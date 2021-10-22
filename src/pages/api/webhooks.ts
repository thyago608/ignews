import Stripe from 'stripe';
import { NextApiRequest, NextApiResponse } from 'next';
import { Readable } from 'stream';
import { stripe } from '../../services/stripe';
import { saveSubscription } from './_lib/manageSubscription.';

async function buffer(readable:Readable){
    const chunks = [];

    for await (const chunk of readable){
        chunks.push(
            typeof chunk === 'string' ? Buffer.from(chunk) : chunk
        );
    }

    return Buffer.concat(chunks);
}

//Faz o Next não converter as informações que chegarão na requisição para o formato JSON.
export const config = {
    api:{
        bodyParser: false
    }
};

//Eventos relevantes
const relevantEvents = new Set([
    'checkout.session.completed',
    'customer.subscription.updated',
    'customer.subscription.deleted'
]);

export default async(request: NextApiRequest, response:NextApiResponse) => {
    if(request.method === 'POST'){
        try{
            const buf = await buffer(request);
            //Quando o Stripe acessa essa rota via webhook, o mesmo envia uma chave 
            //no header da requisição ( a mesma se encontra dentro de STRIPE-SIGNATURE)
        
            const secret = request.headers['stripe-signature'];

            let event:Stripe.Event;

            try{
                //Tentando criar um evento
                event = stripe.webhooks.constructEvent(buf, secret, process.env.STRIPE_WEBHOOK_SECRET);

            }catch(error){
                response.status(400).send(`Webhook error: ${error.message}`);
            }

            //Tipo de evento
            const type = event.type;


            if(relevantEvents.has(type)){
                try{
                    switch(type){

                        case 'customer.subscription.updated':
                        case 'customer.subscription.deleted':
                            const subscription = event.data.object as Stripe.Subscription;    

                            await saveSubscription(
                                subscription.id,
                                subscription.customer.toString(),
                                false
                            );
                        break;

                        case 'checkout.session.completed':
                            const checkoutSession = event.data.object as Stripe.Checkout.Session;
                            
                            await saveSubscription(
                                checkoutSession.subscription.toString(),
                                checkoutSession.customer.toString(),
                                true
                            );
                        break;

                        default:
                            throw new Error('Unhandled event.');
                    }
                }catch(err){
                    return response.json({error:'Webhook handler failed'})
                }
            }

        }catch(error){
            return response.status(400).send(`Webhook error ${error.message}`);
        }


    }else{
        response.setHeader('Allow', 'POST');
        response.status(405).end('Method not allowed');
    }
}
