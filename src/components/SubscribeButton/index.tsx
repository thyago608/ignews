import { useRouter } from "next/router";
import { signIn, useSession } from "next-auth/react";
import { api } from "../../services/api";
import { getStripeJs } from "../../services/stripe-js";
import styles from "./styles.module.scss";

export function SubscribeButton() {
  const { data } = useSession();
  const router = useRouter();

  async function handleSubscribe() {
    if (!data) {
      signIn("github");
      return;
    }

    const subscriptionActiveExists =
      "activeSubscription" in data && !!data?.activeSubscription;

    if (subscriptionActiveExists) {
      router.push("/posts");
      return;
    }

    try {
      const response = await api.post("/subscribe");

      const { sessionId } = response.data;

      const stripe = await getStripeJs();

      await stripe?.redirectToCheckout({ sessionId });
    } catch (error: any) {
      alert(error.message);
    }
  }

  return (
    <button
      type="button"
      className={styles.subscribleButton}
      onClick={handleSubscribe}
    >
      Subscribe now
    </button>
  );
}
