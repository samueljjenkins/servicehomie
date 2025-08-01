import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { supabase } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    console.log('Debug: Checking subscription status for userId:', userId);

    // Get user profile
    const { data: userProfile, error: userError } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('clerk_user_id', userId)
      .single();

    if (userError) {
      console.log('Debug: No user profile found:', userError);
      return NextResponse.json({
        userId,
        userProfile: null,
        technicianProfile: null,
        hasActiveSubscription: false,
        error: 'No user profile found'
      });
    }

    console.log('Debug: User profile found:', userProfile);

    // Get technician profile
    const { data: technicianProfile, error: techError } = await supabase
      .from('technician_profiles')
      .select('*')
      .eq('user_profile_id', userProfile.id)
      .single();

    if (techError) {
      console.log('Debug: No technician profile found:', techError);
      return NextResponse.json({
        userId,
        userProfile,
        technicianProfile: null,
        hasActiveSubscription: false,
        error: 'No technician profile found'
      });
    }

    console.log('Debug: Technician profile found:', technicianProfile);

    // Check subscription status
    const hasActiveSubscription = technicianProfile.stripe_subscription_id && 
                                technicianProfile.stripe_subscription_id.trim() !== '';

    console.log('Debug: Subscription check:', {
      stripeId: technicianProfile.stripe_subscription_id,
      hasActive: hasActiveSubscription
    });

    return NextResponse.json({
      userId,
      userProfile,
      technicianProfile,
      hasActiveSubscription,
      stripeSubscriptionId: technicianProfile.stripe_subscription_id,
      stripeCustomerId: technicianProfile.stripe_customer_id
    });

  } catch (error) {
    console.error('Debug: Error checking subscription status:', error);
    return NextResponse.json(
      { error: 'Failed to check subscription status' },
      { status: 500 }
    );
  }
} 