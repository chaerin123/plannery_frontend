import React, { createContext, useContext, useState, ReactNode } from 'react';

interface ProfileContextType {
  nickname: string;
  studyGoals: string[];
  updateNickname: (name: string) => void;
  updateStudyGoals: (goals: string[]) => void;
}

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

export function ProfileProvider({ children }: { children: ReactNode }) {
  const [nickname, setNickname] = useState('김플랜');
  const [studyGoals, setStudyGoals] = useState<string[]>([]);

  const updateNickname = (name: string) => setNickname(name);
  const updateStudyGoals = (goals: string[]) => setStudyGoals(goals);

  return (
    <ProfileContext.Provider value={{ nickname, studyGoals, updateNickname, updateStudyGoals }}>
      {children}
    </ProfileContext.Provider>
  );
}

export function useProfile() {
  const context = useContext(ProfileContext);
  if (context === undefined) {
    throw new Error('useProfile must be used within a ProfileProvider');
  }
  return context;
}
