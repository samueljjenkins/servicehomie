import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { supabase } from '@/lib/supabase';
import Stripe from 'stripe';

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get('stripe-signature')!;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    console.error('Webhook signature verification failed:', err);
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed':
        const session = event.data.object as Stripe.Checkout.Session;
        if (session.mode === 'subscription') {
          const technicianProfileId = session.metadata?.technicianProfileId;
          const subscriptionId = session.subscription as string;
          
          if (technicianProfileId && subscriptionId) {
            // Update technician profile with subscription info
            await supabase
              .from('technician_profiles')
              .update({
                subscription_status: 'active',
                subscription_start_date: new Date().toISOString(),
                stripe_subscription_id: subscriptionId,
                stripe_customer_id: session.customer as string,
              })
              .eq('id', technicianProfileId);
          }
        }
        break;

      case 'customer.subscription.updated':
        const subscription = event.data.object as Stripe.Subscription;
        const technicianProfile = await supabase
          .from('technician_profiles')
          .select('id')
          .eq('stripe_subscription_id', subscription.id)
          .single();

        if (technicianProfile.data) {
          await supabase
            .from('technician_profiles')
            .update({
              subscription_status: subscription.status,
            })
            .eq('id', technicianProfile.data.id);
        }
        break;

      case 'customer.subscription.deleted':
        const deletedSubscription = event.data.object as Stripe.Subscription;
        const deletedTechnicianProfile = await supabase
          .from('technician_profiles')
          .select('id')
          .eq('stripe_subscription_id', deletedSubscription.id)
          .single();

        if (deletedTechnicianProfile.data) {
          await supabase
            .from('technician_profiles')
            .update({
              subscription_status: 'cancelled',
              subscription_end_date: new Date().toISOString(),
            })
            .eq('id', deletedTechnicianProfile.data.id);
        }
        break;

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Error processing webhook:', error);
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    );
  }
} 