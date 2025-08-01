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
          const userId = session.metadata?.userId;
          const subscriptionId = session.subscription as string;
          
          console.log('Webhook processing:', {
            technicianProfileId,
            userId,
            subscriptionId,
            customerId: session.customer
          });
          
          if (subscriptionId) {
            let updateSuccess = false;
            
            // First try to update by technicianProfileId if available
            if (technicianProfileId) {
              console.log('Trying to update by technicianProfileId:', technicianProfileId);
              const { data, error } = await supabase
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
                console.error('Error updating by technicianProfileId:', error);
              } else {
                console.log('Successfully updated by technicianProfileId:', data);
                updateSuccess = true;
              }
            }
            
            // If that didn't work, try by userId
            if (!updateSuccess && userId) {
              console.log('Trying to update by userId:', userId);
              
              // First get the user profile
              const { data: userProfile, error: userError } = await supabase
                .from('user_profiles')
                .select('id')
                .eq('clerk_user_id', userId)
                .single();
                
              if (userError) {
                console.error('Error finding user profile:', userError);
              } else if (userProfile) {
                console.log('Found user profile:', userProfile);
                
                // Then update the technician profile
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
                  .eq('user_profile_id', userProfile.id)
                  .select();

                if (profileError) {
                  console.error('Error updating technician profile by user_profile_id:', profileError);
                } else {
                  console.log('Successfully updated technician profile by user_profile_id:', profileData);
                  updateSuccess = true;
                }
              }
            }
            
            if (!updateSuccess) {
              console.error('Failed to update any technician profile for subscription:', subscriptionId);
              
              // Final fallback: try to find by customer email
              if (session.customer_email) {
                console.log('Trying fallback update by customer email:', session.customer_email);
                
                const { data: fallbackData, error: fallbackError } = await supabase
                  .from('technician_profiles')
                  .update({
                    subscription_status: 'active',
                    subscription_start_date: new Date().toISOString(),
                    stripe_subscription_id: subscriptionId,
                    stripe_customer_id: session.customer as string,
                    monthly_fee: 19,
                    updated_at: new Date().toISOString()
                  })
                  .eq('email', session.customer_email)
                  .select();

                if (fallbackError) {
                  console.error('Fallback update by email failed:', fallbackError);
                } else {
                  console.log('Successfully updated by fallback email method:', fallbackData);
                  updateSuccess = true;
                }
              }
            }
          } else {
            console.error('Missing subscriptionId in session');
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