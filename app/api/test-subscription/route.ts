import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { supabase } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    console.log('Test: Checking subscription for user:', userId);

    // Get user profile
    const { data: userProfile, error: userError } = await supabase
      .from('user_profiles')
      .select('id, email')
      .eq('clerk_user_id', userId)
      .single();

    if (userError) {
      return NextResponse.json({ error: 'User profile not found' }, { status: 404 });
    }

    // Get technician profile
    const { data: techProfile, error: techError } = await supabase
      .from('technician_profiles')
      .select('*')
      .eq('user_profile_id', userProfile.id)
      .single();

    if (techError) {
      return NextResponse.json({ error: 'Technician profile not found' }, { status: 404 });
    }

    // Check if subscription ID exists
    const hasSubscription = techProfile.stripe_subscription_id && 
                          techProfile.stripe_subscription_id.trim() !== '';

    return NextResponse.json({
      success: true,
      userEmail: userProfile.email,
      technicianProfile: {
        id: techProfile.id,
        name: techProfile.name,
        email: techProfile.email,
        stripe_subscription_id: techProfile.stripe_subscription_id,
        stripe_customer_id: techProfile.stripe_customer_id,
        subscription_status: techProfile.subscription_status
      },
      hasSubscription,
      message: hasSubscription ? 'Subscription found!' : 'No subscription found'
    });

  } catch (error) {
    console.error('Test: Error:', error);
    return NextResponse.json(
      { error: 'Test failed' },
      { status: 500 }
    );
  }
} 