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
    const loadUser = async () => {
      try {
        setLoading(true);
        
        if (!sdk) {
          console.log('No SDK available');
          setUser(null);
          setLoading(false);
          return;
        }

        // Get company and experience data from Whop iframe
        const urlData = await sdk.getTopLevelUrlData({});
        
        if (urlData) {
          // For now, create a user based on company/experience data
          // In production, you'd integrate with Whop's user management
          const whopUser: WhopUser = {
            id: urlData.experienceId, // Use experience ID as user ID for now
            email: 'user@whop.com', // Placeholder
            first_name: 'Whop',
            last_name: 'User',
            company_id: urlData.companyRoute,
            plan_id: urlData.experienceId
          };
          
          console.log('Whop user loaded from URL data:', whopUser);
          setUser(whopUser);
        } else {
          console.log('No URL data available');
          setUser(null);
        }
      } catch (error) {
        console.error('Error loading Whop user:', error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, [sdk]);

  return { user, loading };
}
