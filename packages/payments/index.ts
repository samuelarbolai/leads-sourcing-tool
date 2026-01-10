import "server-only";
import Stripe from "stripe";
import { keys } from "./keys";

const getStripeClient = () => {
  const secretKey = keys().STRIPE_SECRET_KEY;
  if (!secretKey) {
    throw new Error("STRIPE_SECRET_KEY is not configured");
  }
  return new Stripe(secretKey, {
    apiVersion: "2025-11-17.clover",
  });
};

export const stripe = new Proxy({} as Stripe, {
  get: (_target, prop) => {
    const client = getStripeClient();
    return client[prop as keyof Stripe];
  },
});

export type { Stripe } from "stripe";
