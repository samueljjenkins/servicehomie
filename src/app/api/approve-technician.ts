import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: NextRequest) {
  const { email, applicationId } = await req.json();

  // 1. Invite the user by email
  const { data, error } = await supabase.auth.admin.inviteUserByEmail(email, {
    redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/technician-dashboard`,
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // 2. Update application status in your DB
  const { error: updateError } = await supabase
    .from('technician_applications')
    .update({ status: 'approved' })
    .eq('id', applicationId);

  if (updateError) {
    return NextResponse.json({ error: updateError.message }, { status: 500 });
  }

  return NextResponse.json({ message: 'Technician approved and invite sent.' });
} 