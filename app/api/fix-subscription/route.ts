import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { supabase } from '@/lib/supabase';
import { getStripeServer } from '@/lib/stripe-server';

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    console.log('Fix subscription: Starting for user:', userId);

    // Get user profile
    const { data: userProfile, error: userError } = await supabase
      .from('user_profiles')
      .select('id, email')
      .eq('clerk_user_id', userId)
      .single();

    if (userError) {
      return NextResponse.json({ error: 'User profile not found' }, { status: 404 });
    }

    console.log('Fix subscription: Found user profile:', userProfile.email);

    // Get technician profile
    const { data: techProfile, error: techError } = await supabase
      .from('technician_profiles')
      .select('*')
      .eq('user_profile_id', userProfile.id)
      .single();

    if (techError) {
      return NextResponse.json({ error: 'Technician profile not found' }, { status: 404 });
    }

    console.log('Fix subscription: Found tech profile, checking Stripe...');

    // Check Stripe for subscription
    const stripe = getStripeServer();
    
    // Find customer by email
    const customers = await stripe.customers.list({
      email: userProfile.email,
      limit: 1
    });

    if (customers.data.length === 0) {
      return NextResponse.json({ error: 'No Stripe customer found' }, { status: 404 });
    }

    const customer = customers.data[0];
    console.log('Fix subscription: Found Stripe customer:', customer.id);

    // Get subscriptions for this customer
    const subscriptions = await stripe.subscriptions.list({
      customer: customer.id,
      limit: 1
    });

    if (subscriptions.data.length === 0) {
      return NextResponse.json({ error: 'No Stripe subscription found' }, { status: 404 });
    }

    const subscription = subscriptions.data[0];
    console.log('Fix subscription: Found Stripe subscription:', subscription.id);

    // Update the technician profile with the correct subscription data
    const { data: updatedProfile, error: updateError } = await supabase
      .from('technician_profiles')
      .update({
        subscription_status: 'active',
        stripe_subscription_id: subscription.id,
        stripe_customer_id: customer.id,
        subscription_start_date: new Date(subscription.created * 1000).toISOString(),
        subscription_end_date: new Date((subscription as any).current_period_end * 1000).toISOString(),
        monthly_fee: 19,
        updated_at: new Date().toISOString()
      })
      .eq('id', techProfile.id)
      .select()
      .single();

    if (updateError) {
      console.error('Fix subscription: Error updating profile:', updateError);
      return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 });
    }

    console.log('Fix subscription: Successfully updated profile');

    return NextResponse.json({
      success: true,
      message: 'Subscription fixed successfully',
      subscriptionId: subscription.id,
      customerId: customer.id,
      updatedProfile
    });

  } catch (error) {
    console.error('Fix subscription: Error:', error);
    return NextResponse.json(
      { error: 'Failed to fix subscription' },
      { status: 500 }
    );
  }
} 