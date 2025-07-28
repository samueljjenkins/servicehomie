import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { supabase } from '@/lib/supabase';
import { getUserProfile, getTechnicianProfile } from '@/lib/supabase-utils';
import { getStripeServer } from '@/lib/stripe-server';

export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get user profile
    const userProfile = await getUserProfile(userId);
    if (!userProfile) {
      return NextResponse.json({ error: 'User profile not found' }, { status: 404 });
    }

    // Get technician profile
    const technicianProfile = await getTechnicianProfile(userProfile.id);
    if (!technicianProfile) {
      return NextResponse.json({ error: 'Technician profile not found' }, { status: 404 });
    }

    // Check if user has Stripe customer ID
    const stripeCustomerId = technicianProfile.stripe_customer_id;
    
    if (stripeCustomerId) {
      // Check Stripe for active subscription
      try {
        const stripe = getStripeServer();
        const subscriptions = await stripe.subscriptions.list({
          customer: stripeCustomerId,
          limit: 1,
          status: 'active'
        });

        if (subscriptions.data.length > 0) {
          const subscription = subscriptions.data[0];
          
          // Force update the database with Stripe data
          const { data, error } = await supabase
            .from('technician_profiles')
            .update({
              subscription_status: 'active',
              subscription_start_date: new Date().toISOString(),
              stripe_subscription_id: subscription.id,
              stripe_customer_id: stripeCustomerId,
            })
            .eq('id', technicianProfile.id)
            .select();

          if (error) {
            console.error('Error updating subscription status:', error);
          }

          return NextResponse.json({
            success: true,
            message: 'Subscription found in Stripe and database updated',
            hasActiveSubscription: true,
            subscription: {
              id: subscription.id,
              status: subscription.status
            },
            databaseStatus: 'active'
          });
        }
      } catch (stripeError) {
        console.error('Error checking Stripe:', stripeError);
      }
    }

    // Return current database status
    return NextResponse.json({
      success: false,
      message: 'No active subscription found',
      hasActiveSubscription: false,
      databaseStatus: technicianProfile.subscription_status,
      stripeCustomerId: stripeCustomerId || null
    });

  } catch (error) {
    console.error('Error checking subscription:', error);
    return NextResponse.json(
      { error: 'Failed to check subscription' },
      { status: 500 }
    );
  }
} 