import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { getUserProfile, getTechnicianProfile } from '@/lib/supabase-utils';

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

    return NextResponse.json({
      userProfile,
      technicianProfile,
      subscriptionStatus: {
        status: technicianProfile.subscription_status,
        stripeSubscriptionId: technicianProfile.stripe_subscription_id,
        stripeCustomerId: technicianProfile.stripe_customer_id,
        startDate: technicianProfile.subscription_start_date,
        endDate: technicianProfile.subscription_end_date
      }
    });

  } catch (error) {
    console.error('Error debugging subscription:', error);
    return NextResponse.json(
      { error: 'Failed to debug subscription' },
      { status: 500 }
    );
  }
} 