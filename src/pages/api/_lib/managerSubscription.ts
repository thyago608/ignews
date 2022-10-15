import { query as q } from "faunadb";
import { fauna } from "services/fauna";
import { stripe } from "services/stripe";
import { User } from "types/User";
import { Subscription } from "types/Subscription";

export async function saveSubscription(
  subscriptionId: string,
  customerId: string,
  createAction = false
) {
  const user = await fauna.query<User>(
    q.Get(q.Match(q.Index("user_by_stripe_customer_id"), customerId))
  );

  const subscription = await stripe.subscriptions.retrieve(subscriptionId);

  const subscriptionData = {
    id: subscription.id,
    userId: user.ref,
    status: subscription.status,
    price_id: subscription.items.data[0].price.id,
  };

  const handleSubscribe = async () => {
    await fauna.query(
      q.Create(q.Collection("subscriptions"), { data: subscriptionData })
    );
  };

  const updateUserData = async (subscriptionRef: string) => {
    await fauna.query(
      q.Update(q.Ref(q.Collection("subscriptions"), subscriptionRef), {
        data: {
          id: subscription.id,
          status: subscription.status,
        },
      })
    );
  };

  if (createAction) {
    try {
      const subscriptionUser = await fauna.query<Subscription>(
        q.Get(q.Match(q.Index("subscription_by_user_ref"), user.ref))
      );

      await updateUserData(subscriptionUser.ref.id);
    } catch {
      await handleSubscribe();
    }
  } else {
    await fauna.query(
      q.Replace(
        q.Select(
          "ref",
          q.Get(q.Match(q.Index("subscription_by_id"), subscriptionId))
        ),
        { data: subscriptionData }
      )
    );
  }
}
