import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { supabase } from '@/lib/supabase';
import { getUserProfile, getTechnicianProfile } from '@/lib/supabase-utils';
import { getStripeServer } from '@/lib/stripe-server';

export async function POST(request: NextRequest) {
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

    // Get Stripe customer ID from technician profile
    const stripeCustomerId = technicianProfile.stripe_customer_id;
    
    if (!stripeCustomerId) {
      return NextResponse.json({ error: 'No Stripe customer ID found' }, { status: 404 });
    }

    // Get subscription from Stripe
    const stripe = getStripeServer();
    const subscriptions = await stripe.subscriptions.list({
      customer: stripeCustomerId,
      limit: 1,
      status: 'active'
    });

    if (subscriptions.data.length === 0) {
      return NextResponse.json({ error: 'No active subscription found in Stripe' }, { status: 404 });
    }

    const subscription = subscriptions.data[0];
    
    // Update technician profile with subscription info
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
      console.error('Error updating technician profile:', error);
      return NextResponse.json({ error: 'Failed to update subscription status' }, { status: 500 });
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Subscription status updated from Stripe!',
      subscription: {
        id: subscription.id,
        status: subscription.status
      },
      data 
    });

  } catch (error) {
    console.error('Error syncing subscription from Stripe:', error);
    return NextResponse.json(
      { error: 'Failed to sync subscription from Stripe' },
      { status: 500 }
    );
  }
} 