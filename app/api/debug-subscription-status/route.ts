import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { supabase } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    console.log('Debug: Checking subscription status for userId:', userId);

    // Get user profile
    const { data: userProfile, error: userError } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('clerk_user_id', userId)
      .single();

    if (userError) {
      console.error('Debug: Error getting user profile:', userError);
      return NextResponse.json({ 
        error: 'User profile not found',
        userError: userError.message 
      }, { status: 404 });
    }

    console.log('Debug: User profile found:', userProfile);

    // Get technician profile
    const { data: techProfile, error: techError } = await supabase
      .from('technician_profiles')
      .select('*')
      .eq('user_profile_id', userProfile.id)
      .single();

    if (techError) {
      console.error('Debug: Error getting technician profile:', techError);
      return NextResponse.json({ 
        error: 'Technician profile not found',
        techError: techError.message 
      }, { status: 404 });
    }

    console.log('Debug: Technician profile found:', techProfile);

    // Check subscription status
    const hasActiveSubscription = techProfile.subscription_status === 'active' && 
                                techProfile.stripe_subscription_id && 
                                techProfile.stripe_subscription_id.trim() !== '';

    return NextResponse.json({
      userId,
      userProfile,
      techProfile,
      hasActiveSubscription,
      subscriptionStatus: techProfile.subscription_status,
      stripeSubscriptionId: techProfile.stripe_subscription_id,
      subscriptionStartDate: techProfile.subscription_start_date,
      subscriptionEndDate: techProfile.subscription_end_date
    });

  } catch (error) {
    console.error('Debug: Error checking subscription status:', error);
    return NextResponse.json(
      { error: 'Failed to check subscription status' },
      { status: 500 }
    );
  }
} 