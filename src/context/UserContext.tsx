"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useAuth } from '@clerk/nextjs';
import { getUserProfile, UserProfile } from '@/lib/supabase-utils';

interface UserContextType {
  user: any; // Clerk user
  profile: UserProfile | null;
  loading: boolean;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const { isSignedIn, userId } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProfile() {
      if (isSignedIn && userId) {
        setLoading(true);
        try {
          const userProfile = await getUserProfile(userId);
          setProfile(userProfile);
        } catch (error) {
          console.error('Error loading user profile:', error);
          setProfile(null);
        }
        setLoading(false);
      } else {
        setProfile(null);
        setLoading(false);
      }
    }

    loadProfile();
  }, [isSignedIn, userId]);

  const refreshProfile = async () => {
    if (isSignedIn && userId) {
      setLoading(true);
      try {
        const userProfile = await getUserProfile(userId);
        setProfile(userProfile);
      } catch (error) {
        console.error('Error refreshing user profile:', error);
      }
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    // Clerk handles sign out automatically
    setProfile(null);
  };
  
  const value = {
    user: null, // We'll get this from Clerk context if needed
    profile,
    loading,
    signOut: handleSignOut,
    refreshProfile,
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
} 