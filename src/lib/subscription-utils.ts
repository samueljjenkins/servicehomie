import { getTechnicianProfile } from './supabase-utils';

export interface SubscriptionStatus {
  isActive: boolean;
  status: 'active' | 'inactive' | 'past_due' | 'cancelled' | 'trialing';
  endDate?: string;
  startDate?: string;
}

export async function checkSubscriptionStatus(technicianProfileId: string): Promise<SubscriptionStatus> {
  try {
    const profile = await getTechnicianProfile(technicianProfileId);
    
    if (!profile) {
      return {
        isActive: false,
        status: 'inactive'
      };
    }

    // Check if user has a Stripe subscription
    if (profile.stripe_subscription_id && profile.subscription_status) {
      const status = profile.subscription_status as SubscriptionStatus['status'];
      const isActive = status === 'active' || status === 'trialing';
      
      return {
        isActive,
        status,
        endDate: profile.subscription_end_date,
        startDate: profile.subscription_start_date
      };
    }

    // Fallback: check if user has paid the monthly fee (for manual payments)
    if (profile.subscription_status === 'active') {
      return {
        isActive: true,
        status: 'active',
        endDate: profile.subscription_end_date,
        startDate: profile.subscription_start_date
      };
    }

    return {
      isActive: false,
      status: 'inactive'
    };
  } catch (error) {
    console.error('Error checking subscription status:', error);
    return {
      isActive: false,
      status: 'inactive'
    };
  }
}

export function isSubscriptionRequired(pathname: string): boolean {
  // Routes that require an active subscription
  const protectedRoutes = [
    '/technician-dashboard',
    '/technician-page/edit',
    '/settings'
  ];

  return protectedRoutes.some(route => pathname.startsWith(route));
}

export function getSubscriptionRedirectUrl(): string {
  return '/subscription-required';
} 