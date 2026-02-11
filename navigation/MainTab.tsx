import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography, fontWeight } from '../src/constants';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { MainTabParamList } from '../types/navigation';
import HomeScreen from '../screens/HomeScreen';
import PlanScreen from '../screens/PlanScreen';
import MyPageScreen from '../screens/MyPageScreen';
import ProfileEditScreen from '../screens/ProfileEditScreen';
import NicknameEditScreen from '../screens/NicknameEditScreen';
import StudyGoalSelectScreen from '../screens/StudyGoalSelectScreen';
import PlanCreateScreen from '../screens/PlanCreateScreen';
import GroupListScreen from '../components/GroupListScreen';

const Tab = createBottomTabNavigator<MainTabParamList>();
const Stack = createNativeStackNavigator<MainTabParamList>();

// Home Stack Navigator (Home + PlanCreate + GroupList)
function HomeStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen 
        name="PlanCreate" 
        component={PlanCreateScreen}
        options={{ 
          headerShown: true,
          title: '새 계획 만들기',
        }}
      />
      <Stack.Screen 
        name="GroupList" 
        component={GroupListScreen}
        options={{ 
          headerShown: false,
        }}
      />
    </Stack.Navigator>
  );
}

function MyPageStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="MyPage" component={MyPageScreen} />
      <Stack.Screen name="ProfileEdit" component={ProfileEditScreen} />
      <Stack.Screen name="NicknameEdit" component={NicknameEditScreen} />
      <Stack.Screen name="StudyGoalSelect" component={StudyGoalSelectScreen} />
    </Stack.Navigator>
  );
}

export default function MainTab() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: colors.grayscale.gray900,
        tabBarInactiveTintColor: colors.grayscale.gray300,
        tabBarLabelStyle: {
          ...typography.bodySmall,
          fontWeight: fontWeight.semibold,
        },
        tabBarStyle: {
          height: 64,
          paddingTop: 8,
          paddingBottom: 8,
          borderTopWidth: 1,
          borderTopColor: colors.grayscale.gray200,
          backgroundColor: colors.grayscale.white,
        },
        tabBarIcon: ({ color, size }) => {
          const iconSize = size ?? 22;
          if (route.name === 'Home') {
            return <Ionicons name="home" size={iconSize} color={color} />;
          }
          if (route.name === 'Plan') {
            return <Ionicons name="flag" size={iconSize} color={color} />;
          }
          return <Ionicons name="person" size={iconSize} color={color} />;
        },
      })}
    >
      <Tab.Screen 
        name="Home" 
        component={HomeStack}
        options={{ title: '홈' }}
      />
      <Tab.Screen 
        name="Plan" 
        component={PlanScreen}
        options={{ title: '달성' }}
      />
      <Tab.Screen 
        name="MyPage" 
        component={MyPageStack}
        options={{ title: '마이' }}
      />
    </Tab.Navigator>
  );
}

