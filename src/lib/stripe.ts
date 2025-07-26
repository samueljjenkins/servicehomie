import Stripe from 'stripe';

// Initialize Stripe with your secret key
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-06-30.basil',
});

// Stripe configuration
export const STRIPE_CONFIG = {
  subscriptionPriceId: process.env.STRIPE_SUBSCRIPTION_PRICE_ID!,
  successUrl: `${process.env.NEXT_PUBLIC_APP_URL}/technician-dashboard?success=true`,
  cancelUrl: `${process.env.NEXT_PUBLIC_APP_URL}/technician-dashboard?canceled=true`,
};

// Create a checkout session for subscription
export async function createSubscriptionCheckoutSession(
  customerEmail: string,
  technicianProfileId: string
) {
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'subscription',
      customer_email: customerEmail,
      line_items: [
        {
          price: STRIPE_CONFIG.subscriptionPriceId,
          quantity: 1,
        },
      ],
      success_url: `${STRIPE_CONFIG.successUrl}&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: STRIPE_CONFIG.cancelUrl,
      metadata: {
        technicianProfileId,
      },
    });

    return session;
  } catch (error) {
    console.error('Error creating checkout session:', error);
    throw error;
  }
}

// Create a customer portal session for managing subscriptions
export async function createCustomerPortalSession(customerId: string) {
  try {
    // Validate customer ID format
    if (!customerId || typeof customerId !== 'string' || customerId.trim() === '') {
      throw new Error('Invalid customer ID provided');
    }

    // Check if customer exists in Stripe
    try {
      await stripe.customers.retrieve(customerId);
    } catch (error) {
      if (error instanceof Error && error.message.includes('No such customer')) {
        throw new Error('No such customer');
      }
      throw error;
    }

    const session = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: `${process.env.NEXT_PUBLIC_APP_URL}/technician-dashboard`,
    });

    if (!session || !session.url) {
      throw new Error('Failed to create portal session');
    }

    return session;
  } catch (error) {
    console.error('Error creating customer portal session:', error);
    throw error;
  }
}

// Get subscription details
export async function getSubscription(subscriptionId: string) {
  try {
    const subscription = await stripe.subscriptions.retrieve(subscriptionId);
    return subscription;
  } catch (error) {
    console.error('Error retrieving subscription:', error);
    throw error;
  }
}

// Cancel subscription
export async function cancelSubscription(subscriptionId: string) {
  try {
    const subscription = await stripe.subscriptions.cancel(subscriptionId);
    return subscription;
  } catch (error) {
    console.error('Error canceling subscription:', error);
    throw error;
  }
} 