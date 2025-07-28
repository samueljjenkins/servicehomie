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
      console.error('Error updating subscription status:', error);
      return NextResponse.json({ error: 'Failed to update subscription' }, { status: 500 });
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Subscription status updated to active',
      data 
    });

  } catch (error) {
    console.error('Error fixing subscription:', error);
    return NextResponse.json(
      { error: 'Failed to fix subscription' },
      { status: 500 }
    );
  }
} 