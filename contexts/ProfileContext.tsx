import React, { createContext, useContext, useState, ReactNode } from 'react';

interface ProfileContextType {
  nickname: string;
  studyGoals: string[];
  profileImageUri: string | null;
  updateNickname: (name: string) => void;
  updateStudyGoals: (goals: string[]) => void;
  updateProfileImage: (uri: string | null) => void;
}

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

export function ProfileProvider({ children }: { children: ReactNode }) {
  const [nickname, setNickname] = useState('김플랜');
  const [studyGoals, setStudyGoals] = useState<string[]>([]);
  const [profileImageUri, setProfileImageUri] = useState<string | null>(null);

  const updateNickname = (name: string) => setNickname(name);
  const updateStudyGoals = (goals: string[]) => setStudyGoals(goals);
  const updateProfileImage = (uri: string | null) => setProfileImageUri(uri);

  return (
    <ProfileContext.Provider
      value={{
        nickname,
        studyGoals,
        profileImageUri,
        updateNickname,
        updateStudyGoals,
        updateProfileImage,
      }}
    >
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
