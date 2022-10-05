import Stripe from "stripe";

export const stripe = new Stripe(String(process.env.STRIPE_API_KEY), {
  apiVersion: "2022-08-01",
  appInfo: {
    name: "Ignews",
    version: "1.0.0",
  },
});
