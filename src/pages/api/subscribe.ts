import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";
import { query as q } from "faunadb";
import { fauna } from "../../services/fauna";
import { stripe } from "../../services/stripe";

type User = {
  ref: {
    id: string;
  };
  data: {
    email: string;
    stripe_customer_id: string;
  };
};

const subscribe = async (
  request: NextApiRequest,
  response: NextApiResponse
) => {
  if (request.method === "POST") {
    const session = await getSession({ req: request });
    let customerId = "";

    if (session) {
      const user = await fauna.query<User>(
        q.Get(
          q.Match(
            q.Index("user_by_email"),
            q.Casefold(session?.user?.email ?? "")
          )
        )
      );

      customerId = user.data.stripe_customer_id;

      if (!customerId) {
        const stripeCustomer = await stripe.customers.create({
          email: session?.user?.email ?? "user@example.com",
        });

        await fauna.query(
          q.Update(q.Ref(q.Collection("users"), user.ref.id), {
            data: { stripe_customer_id: stripeCustomer.id },
          })
        );

        customerId = stripeCustomer.id;
      }
    }

    const checkoutSession = await stripe.checkout.sessions.create({
      customer: customerId,
      payment_method_types: ["card"],
      billing_address_collection: "required",
      line_items: [{ price: "price_1JwWvLDdE7su2Hyxshg6bJ5J", quantity: 1 }],
      mode: "subscription",
      allow_promotion_codes: true,
      success_url: String(process.env.STRIPE_SUCCESS_URL),
      cancel_url: String(process.env.STRIPE_CANCEL_URL),
    });

    return response.status(201).json({ sessionId: checkoutSession.id });
  } else {
    response.setHeader("Allow", "POST");
    response.status(405).end("Method not allowed");
  }
};

export default subscribe;
