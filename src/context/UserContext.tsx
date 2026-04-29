"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/utils/supabase';

interface UserProfile {
  id: string;
  name: string;
  sex: "male" | "female" | "other" | "";
  age: string;
  weight: string;
  conditions: string[];
  onboarding_complete: boolean;
}

interface UserContextType {
  profile: UserProfile;
  updateProfile: (data: Partial<UserProfile>) => Promise<void>;
  isLoading: boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

const DEFAULT_PROFILE: UserProfile = {
  id: "",
  name: "",
  sex: "",
  age: "",
  weight: "",
  conditions: [],
  onboarding_complete: false
};

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [profile, setProfileState] = useState<UserProfile>(DEFAULT_PROFILE);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function initProfile() {
      // 1. Get or Create Guest ID
      let guestId = localStorage.getItem("prana_guest_id");
      if (!guestId) {
        guestId = crypto.randomUUID();
        localStorage.setItem("prana_guest_id", guestId);
      }

      // 2. Fetch from Supabase
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', guestId)
        .single();

      if (data) {
        setProfileState({
          ...data,
          age: data.age?.toString() || "",
          weight: data.biological_data?.weight || ""
        });
      } else {
        // Create initial record
        const initialProfile = { ...DEFAULT_PROFILE, id: guestId };
        await supabase.from('profiles').insert([
          { 
            id: guestId, 
            name: "", 
            onboarding_complete: false 
          }
        ]);
        setProfileState(initialProfile);
      }
      setIsLoading(false);
    }

    initProfile();
  }, []);

  const updateProfile = async (data: Partial<UserProfile>) => {
    setProfileState(prev => {
      const updated = { ...prev, ...data };
      return updated;
    });

    // Sync with Supabase
    const updatePayload: any = {};
    if (data.name !== undefined) updatePayload.name = data.name;
    if (data.sex !== undefined) updatePayload.sex = data.sex;
    if (data.age !== undefined) updatePayload.age = parseInt(data.age);
    if (data.onboarding_complete !== undefined) updatePayload.onboarding_complete = data.onboarding_complete;
    
    // Handle biological data (weight etc)
    if (data.weight !== undefined) {
      updatePayload.biological_data = { weight: data.weight };
    }

    await supabase
      .from('profiles')
      .update(updatePayload)
      .eq('id', profile.id);
  };

  return (
    <UserContext.Provider value={{ profile, updateProfile, isLoading }}>
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
