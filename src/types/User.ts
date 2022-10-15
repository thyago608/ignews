export type User = {
  ref: {
    id: string;
  };
  data: {
    email: string;
    stripe_customer_id: string;
  };
};
