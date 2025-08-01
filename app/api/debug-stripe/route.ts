import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { getStripeServer } from '@/lib/stripe-server';
import { supabase } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    console.log('Debug Stripe: Checking for user:', userId);

    // Get user profile to find email
    const { data: userProfile, error: userError } = await supabase
      .from('user_profiles')
      .select('email')
      .eq('clerk_user_id', userId)
      .single();

    if (userError) {
      return NextResponse.json({ error: 'User profile not found' }, { status: 404 });
    }

    const stripe = getStripeServer();
    
    // Try to find customer by email
    const customers = await stripe.customers.list({
      email: userProfile.email,
      limit: 10
    });

    console.log('Debug Stripe: Found customers:', customers.data.length);

    let customer = null;
    let subscriptions: any[] = [];

    if (customers.data.length > 0) {
      customer = customers.data[0];
      console.log('Debug Stripe: Found customer:', customer.id);
      
      // Get subscriptions for this customer
      const customerSubscriptions = await stripe.subscriptions.list({
        customer: customer.id,
        limit: 10
      });
      
      subscriptions = customerSubscriptions.data;
      console.log('Debug Stripe: Found subscriptions:', subscriptions.length);
    }

    return NextResponse.json({
      userEmail: userProfile.email,
      customer: customer ? {
        id: customer.id,
        email: customer.email,
        created: customer.created
      } : null,
      subscriptions: subscriptions.map(sub => ({
        id: sub.id,
        status: sub.status,
        created: sub.created,
        current_period_start: sub.current_period_start,
        current_period_end: sub.current_period_end
      }))
    });

  } catch (error) {
    console.error('Debug Stripe: Error:', error);
    return NextResponse.json(
      { error: 'Failed to check Stripe data' },
      { status: 500 }
    );
  }
} 