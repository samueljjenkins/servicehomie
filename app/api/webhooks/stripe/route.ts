import { NextRequest, NextResponse } from 'next/server';
import { getStripeServer } from '@/lib/stripe-server';
import { supabase } from '@/lib/supabase';
import Stripe from 'stripe';

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get('stripe-signature')!;

  console.log('Webhook received:', {
    signature: signature ? 'Present' : 'Missing',
    bodyLength: body.length,
    webhookSecret: process.env.STRIPE_WEBHOOK_SECRET ? 'Set' : 'Missing'
  });

  let event: Stripe.Event;

  try {
    const stripe = getStripeServer();
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
    console.log('Webhook verified successfully, event type:', event.type);
  } catch (err) {
    console.error('Webhook signature verification failed:', err);
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed':
        console.log('Processing checkout.session.completed');
        const session = event.data.object as Stripe.Checkout.Session;
        console.log('Session data:', {
          mode: session.mode,
          subscription: session.subscription,
          customer: session.customer,
          metadata: session.metadata
        });
        
        if (session.mode === 'subscription') {
          const technicianProfileId = session.metadata?.technicianProfileId;
          const subscriptionId = session.subscription as string;
          
          console.log('Updating technician profile:', {
            technicianProfileId,
            subscriptionId,
            customerId: session.customer
          });
          
          if (technicianProfileId && subscriptionId) {
            // First try to update by the provided technicianProfileId
            let { data, error } = await supabase
              .from('technician_profiles')
              .update({
                subscription_status: 'active',
                subscription_start_date: new Date().toISOString(),
                stripe_subscription_id: subscriptionId,
                stripe_customer_id: session.customer as string,
                monthly_fee: 19,
                updated_at: new Date().toISOString()
              })
              .eq('id', technicianProfileId)
              .select();

            if (error) {
              console.error('Error updating technician profile by ID:', error);
              
              // If that fails, try to find by user_profile_id if it's in metadata
              const userId = session.metadata?.userId;
              if (userId) {
                console.log('Trying to update by user_profile_id:', userId);
                const { data: profileData, error: profileError } = await supabase
                  .from('technician_profiles')
                  .update({
                    subscription_status: 'active',
                    subscription_start_date: new Date().toISOString(),
                    stripe_subscription_id: subscriptionId,
                    stripe_customer_id: session.customer as string,
                    monthly_fee: 19,
                    updated_at: new Date().toISOString()
                  })
                  .eq('user_profile_id', userId)
                  .select();

                if (profileError) {
                  console.error('Error updating technician profile by user_profile_id:', profileError);
                } else {
                  console.log('Successfully updated technician profile by user_profile_id:', profileData);
                }
              }
            } else {
              console.log('Successfully updated technician profile by ID:', data);
            }
          } else {
            console.error('Missing technicianProfileId or subscriptionId in session');
          }
        }
        break;

      case 'customer.subscription.updated':
        console.log('Processing customer.subscription.updated');
        const subscription = event.data.object as Stripe.Subscription;
        const { data: technicianProfile, error: profileError } = await supabase
          .from('technician_profiles')
          .select('id')
          .eq('stripe_subscription_id', subscription.id)
          .single();

        if (profileError) {
          console.error('Error finding technician profile:', profileError);
        } else if (technicianProfile) {
          const { error: updateError } = await supabase
            .from('technician_profiles')
            .update({
              subscription_status: subscription.status,
            })
            .eq('id', technicianProfile.id);

          if (updateError) {
            console.error('Error updating subscription status:', updateError);
          } else {
            console.log('Successfully updated subscription status to:', subscription.status);
          }
        }
        break;

      case 'customer.subscription.deleted':
        console.log('Processing customer.subscription.deleted');
        const deletedSubscription = event.data.object as Stripe.Subscription;
        const { data: deletedTechnicianProfile, error: deletedProfileError } = await supabase
          .from('technician_profiles')
          .select('id')
          .eq('stripe_subscription_id', deletedSubscription.id)
          .single();

        if (deletedProfileError) {
          console.error('Error finding technician profile for deletion:', deletedProfileError);
        } else if (deletedTechnicianProfile) {
          const { error: deleteUpdateError } = await supabase
            .from('technician_profiles')
            .update({
              subscription_status: 'cancelled',
              subscription_end_date: new Date().toISOString(),
            })
            .eq('id', deletedTechnicianProfile.id);

          if (deleteUpdateError) {
            console.error('Error updating cancelled subscription:', deleteUpdateError);
          } else {
            console.log('Successfully cancelled subscription');
          }
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