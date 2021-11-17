import { NextApiRequest, NextApiResponse } from "next";
import { Readable } from "stream";
import { stripe } from "../../services/stripe";
import Stripe from "stripe";

async function buffer(readable: Readable) {
  const chunks = [];

  for await (const chunk of readable) {
    chunks.push(typeof chunk === "string" ? Buffer.from(chunk) : chunk);
  }

  return Buffer.concat(chunks);
}

export const config = {
  api: {
    bodyParser: false,
  },
};

const relevantEvents = new Set(["checkout.session.completed"]);

export default async (request: NextApiRequest, response: NextApiResponse) => {
  if (request.method === "POST") {
    const buf = await buffer(request);

    //Busca na propriedade `stripe-signature` do cabeçalho da requisição
    //O id que o stripe envia quando acessa essa rota via webhook.
    const secret = request.headers["stripe-signature"];

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(
        buf,
        secret,
        process.env.STRIPE_WEBHOOK_SECRET
      );
    } catch (error) {
      return response.status(400).send(`Webhook error: ${error.message}`);
    }

    const { type } = event;

    if (relevantEvents.has(type)) {
      console.log(event);
    }

    response.json({ received: true });
  } else {
    response.setHeader("Allow", "POST");
    response.status(405).end("Method not allowed");
  }
};
