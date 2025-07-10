import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function POST(request: Request) {
  const {
    fullName,
    email,
    phone,
    serviceCategory,
    zipCodes,
    experienceDescription
  } = await request.json()

  console.log('Onboarding request received:', { fullName, email, serviceCategory })

  const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  try {
    // ✅ Step 1: Send Auth invite email + attach metadata
    console.log('Sending invitation email to:', email)
    const { data: { user }, error: inviteError } = await supabaseAdmin.auth.admin.inviteUserByEmail(email, {
      data: {
        full_name: fullName,
        phone,
        user_type: 'technician'
      },
      redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/technician-password`
    })

    if (inviteError) {
      console.error('Invite error details:', inviteError)
      return NextResponse.json({ error: inviteError.message, details: inviteError }, { status: 400 })
    }
    if (!user) {
      console.error('User was not created by Supabase Auth.')
      return NextResponse.json({ error: 'User was not created.' }, { status: 400 })
    }

    // ✅ Step 2: Insert into your 'technicians' table ONLY if user was created
    const { error: insertError } = await supabaseAdmin.from('technicians').insert({
      user_id: user.id,
      name: fullName,
      email,
      phone,
      services: [serviceCategory],
      experience: experienceDescription,
      verified: true
    })

    if (insertError) {
      console.error('Database insert error:', insertError)
      // Optionally, clean up the user from Auth if DB insert fails
      await supabaseAdmin.auth.admin.deleteUser(user.id)
      return NextResponse.json({ error: insertError.message, details: insertError }, { status: 500 })
    }

    console.log('Technician onboarded and invited successfully!')
    return NextResponse.json({ message: 'Technician onboarded successfully! Invitation email sent.', user_id: user.id })
  } catch (error: any) {
    console.error('Onboarding error:', error)
    return NextResponse.json({ error: error.message, details: error }, { status: 500 })
  }
}
