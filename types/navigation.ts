export type AuthStackParamList = {
  Login: undefined;
  Signup: undefined;
};

export type MainTabParamList = {
  Home:
    | { selectedDate?: string; viewMode?: 'Day' | 'Week' | 'Month'; selectedGroupId?: string | null }
    | undefined;
  Plan: undefined;
  MyPage: undefined;
  PlanCreate:
    | { type?: 'DAY' | 'WEEK' | 'MONTH'; selectedGroupId?: string | null; planId?: string }
    | undefined;
  GroupList: undefined;
  ProfileEdit: undefined;
  NicknameEdit: undefined;
  StudyGoalSelect: undefined;
};

export type RootStackParamList = {
  AuthStack: undefined;
  MainTab: undefined;
};

