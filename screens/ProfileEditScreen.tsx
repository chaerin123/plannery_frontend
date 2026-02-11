import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { MainTabParamList } from '../types/navigation';
import { colors, spacing, typography, fontWeight } from '../src/constants';
import { useProfile } from '../contexts/ProfileContext';

type Props = NativeStackScreenProps<MainTabParamList, 'ProfileEdit'>;

export default function ProfileEditScreen({ navigation }: Props) {
  const { nickname, studyGoals } = useProfile();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={22} color={colors.grayscale.gray900} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>프로필</Text>
        <View style={styles.headerRight} />
      </View>

      <View style={styles.profileSection}>
        <View style={styles.avatarWrapper}>
          <Image source={require('../assets/planner_face_icon.png')} style={styles.avatar} />
          <View style={styles.avatarBadge}>
            <Ionicons name="add" size={16} color={colors.grayscale.white} />
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>닉네임</Text>
        <TouchableOpacity
          style={styles.listItem}
          onPress={() => navigation.navigate('NicknameEdit')}
        >
          <Text style={styles.listItemValue}>{nickname}</Text>
          <Ionicons name="chevron-forward" size={18} color={colors.grayscale.gray300} />
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>공부 목표</Text>
        <TouchableOpacity
          style={styles.listItem}
          onPress={() => navigation.navigate('StudyGoalSelect')}
        >
          <Text style={styles.listItemValue}>
            {studyGoals.length > 0 ? studyGoals.join(', ') : '설정안됨'}
          </Text>
          <Ionicons name="chevron-forward" size={18} color={colors.grayscale.gray300} />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.grayscale.gray50,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.md,
    backgroundColor: colors.grayscale.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.grayscale.gray100,
  },
  backButton: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    ...typography.bodyLarge,
    fontWeight: fontWeight.semibold,
    color: colors.grayscale.gray900,
  },
  headerRight: {
    width: 32,
  },
  profileSection: {
    alignItems: 'center',
    paddingVertical: spacing.xl,
  },
  avatarWrapper: {
    width: 84,
    height: 84,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.grayscale.white,
  },
  avatarBadge: {
    position: 'absolute',
    right: -2,
    bottom: -2,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.main.main,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: colors.grayscale.white,
  },
  section: {
    paddingHorizontal: spacing.base,
    paddingTop: spacing.lg,
  },
  sectionTitle: {
    ...typography.bodyMedium,
    fontWeight: fontWeight.semibold,
    color: colors.grayscale.gray700,
    marginBottom: spacing.sm,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.grayscale.white,
    borderRadius: spacing.base,
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.md,
    shadowColor: colors.grayscale.gray900,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 2,
  },
  listItemValue: {
    ...typography.bodyMedium,
    color: colors.grayscale.gray900,
    flex: 1,
    marginRight: spacing.sm,
  },
});
