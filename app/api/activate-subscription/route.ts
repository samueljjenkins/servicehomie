import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { supabase } from '@/lib/supabase';
import { getUserProfile, getTechnicianProfile } from '@/lib/supabase-utils';

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

    // Update subscription status to active
    const { data, error } = await supabase
      .from('technician_profiles')
      .update({
        subscription_status: 'active',
        subscription_start_date: new Date().toISOString(),
      })
      .eq('id', technicianProfile.id)
      .select();

    if (error) {
      console.error('Error activating subscription:', error);
      return NextResponse.json({ error: 'Failed to activate subscription' }, { status: 500 });
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Subscription activated successfully! You can now access your dashboard.',
      data 
    });

  } catch (error) {
    console.error('Error activating subscription:', error);
    return NextResponse.json(
      { error: 'Failed to activate subscription' },
      { status: 500 }
    );
  }
} 