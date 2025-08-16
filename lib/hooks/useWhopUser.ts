import { useState, useEffect } from 'react';
import { useIframeSdk } from '@whop/react/iframe';

export interface WhopUser {
  id: string;
  email: string;
  first_name?: string;
  last_name?: string;
  company_id?: string;
  plan_id?: string;
}

export function useWhopUser() {
  const [user, setUser] = useState<WhopUser | null>(null);
  const [loading, setLoading] = useState(true);
  const sdk = useIframeSdk();

  useEffect(() => {
    // For now, use mock user since Whop user auth needs different approach
    // In production, you'd integrate with Whop's user management
    const mockUser = {
      id: 'mock-user-id',
      email: 'user@example.com',
      first_name: 'Demo',
      last_name: 'User',
      company_id: 'demo-company',
      plan_id: 'demo-plan'
    };
    
    setUser(mockUser);
    setLoading(false);
  }, []);

  return { user, loading };
}
