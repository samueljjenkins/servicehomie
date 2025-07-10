"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { supabase } from '@/lib/supabase';
import { getSession, getUserProfile } from '@/lib/auth-utils';
import { User as AuthUser } from '@supabase/supabase-js';
import { User as ProfileUser } from '@/types/database';

interface UserContextType {
  user: AuthUser | null;
  profile: ProfileUser | null;
  loading: boolean;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [profile, setProfile] = useState<ProfileUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadUser() {
      const session = await getSession();
      if (session?.user) {
        setUser(session.user);
        const userProfile = await getUserProfile(session.user.id);
        setProfile(userProfile);
      }
      setLoading(false);
    }

    loadUser();

    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      setLoading(true);
      const currentUser = session?.user ?? null;
      setUser(currentUser);
      if (currentUser) {
        const userProfile = await getUserProfile(currentUser.id);
        setProfile(userProfile);
      } else {
        setProfile(null);
      }
      setLoading(false);
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const refreshProfile = async () => {
    if (user) {
      setLoading(true);
      const userProfile = await getUserProfile(user.id);
      setProfile(userProfile);
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setProfile(null);
  };
  
  const value = {
    user,
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