import { NextApiRequest, NextApiResponse } from 'next';
import { query as q } from 'faunadb';
import { getSession } from 'next-auth/client';

import { fauna } from '../../services/fauna';
import { stripe } from '../../services/stripe';

type User = {
    ref:{
        id:string;
    },
    data:{
        stripe_customer_id:string;
    }
};

export default async(request:NextApiRequest, response:NextApiResponse) => {
  if(request.method === 'POST'){
      //Pegando os cookies da requisição
      const session = await getSession({req:request});

      //Verificando se o usuário autenticado está no fauna
      const user = await fauna.query<User>(
          q.Get(
              q.Match(
                  q.Index('user_by_email'),
                  q.Casefold(session.user.email)
              )
          )
      );
  
      let customer_id = user.data.stripe_customer_id;
  
      if(!customer_id){
          const stripeCustomer = await stripe.customers.create({
              email: session.user.email
          });
  
          //Atualizando informações do usuário no fauna
          await fauna.query(
              q.Update(
                  q.Ref(q.Collection('users'),user.ref.id),
                  {
                      data:{
                          stripe_customer_id:stripeCustomer.id
                      }
                  }
              )
          )
  
          customer_id = stripeCustomer.id;

        }
        
          const checkoutSession = await stripe.checkout.sessions.create({
                customer: customer_id,
                payment_method_types:['card'],
                billing_address_collection:'required',
                line_items:[
                    { price: 'price_1Jd7YSCgz6De2oriuFvAWuFx', quantity: 1}
                ],
                mode: 'subscription',
                allow_promotion_codes: true,
                success_url:process.env.STRIPE_SUCCESS_URL,
                cancel_url:process.env.STRIPE_CANCEL_URL,
        });

        return response.status(201).json({ sessionId: checkoutSession.id});
         
  }else{
      response.setHeader('Allow', 'POST');
      response.status(501).end('Method not allowed');
  }
}