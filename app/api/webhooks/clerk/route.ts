import { Webhook } from 'svix';
import { headers } from 'next/headers';
import { WebhookEvent } from '@clerk/nextjs/server';
import { createUserProfile, createTechnicianProfile } from '@/lib/supabase-utils';

export async function POST(req: Request) {
  // Get the headers
  const headerPayload = await headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response('Error occured -- no svix headers', {
      status: 400
    });
  }

  // Get the body
  const payload = await req.json();
  const body = JSON.stringify(payload);

  // Create a new Svix instance with your secret.
  const wh = new Webhook(process.env.CLERK_WEBHOOK_SECRET || '');

  let evt: WebhookEvent;

  // Verify the payload with the headers
  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent;
  } catch (err) {
    console.error('Error verifying webhook:', err);
    return new Response('Error occured', {
      status: 400
    });
  }

  // Handle the webhook
  const eventType = evt.type;
  
  if (eventType === 'user.created') {
    try {
      console.log('Creating user profile for:', evt.data.id);
      
      // Create user profile in Supabase
      const userProfile = await createUserProfile(evt.data as any);
      
      // Create technician profile (since this is for technician signup)
      const technicianProfile = await createTechnicianProfile(userProfile.id, {
        name: `${evt.data.first_name || ''} ${evt.data.last_name || ''}`.trim(),
        email: evt.data.email_addresses[0]?.email_address || '',
        location: '',
        bio: '',
        services: []
      });
      
      console.log('Successfully created profiles:', { userProfile, technicianProfile });
      
      return new Response('Profiles created successfully', { status: 200 });
    } catch (error) {
      console.error('Error creating profiles:', error);
      return new Response('Error creating profiles', { status: 500 });
    }
  }

  return new Response('Webhook processed', { status: 200 });
} 