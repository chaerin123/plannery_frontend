import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { MainTabParamList } from '../types/navigation';
import { colors, spacing, typography, fontWeight } from '../src/constants';
import { useProfile } from '../contexts/ProfileContext';

type Props = NativeStackScreenProps<MainTabParamList, 'StudyGoalSelect'>;

const GOAL_OPTIONS = [
  '내신 성적 향상',
  '수능 대비',
  '취업 준비',
  '전문직 시험 합격',
  '검정고시 합격',
  '학점 향상',
  '공기업 준비',
  '고시 패스',
  '공시 준비',
  '자격증 취득',
  '그 외',
];

const MAX_SELECT = 3;

export default function StudyGoalSelectScreen({ navigation }: Props) {
  const { studyGoals, updateStudyGoals } = useProfile();
  const [selected, setSelected] = React.useState<string[]>(studyGoals);

  const handleToggle = (goal: string) => {
    if (selected.includes(goal)) {
      setSelected((prev) => prev.filter((item) => item !== goal));
      return;
    }
    if (selected.length >= MAX_SELECT) {
      return;
    }
    setSelected((prev) => [...prev, goal]);
  };

  const isConfirmEnabled = selected.length > 0;

  const handleConfirm = () => {
    if (!isConfirmEnabled) {
      return;
    }
    updateStudyGoals(selected);
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={22} color={colors.grayscale.gray900} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>공부 목표</Text>
        <View style={styles.headerRight} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.counterText}>
          최대 등록 개수 {selected.length}/{MAX_SELECT}
        </Text>
        <View style={styles.goalGrid}>
          {GOAL_OPTIONS.map((goal) => {
            const isSelected = selected.includes(goal);
            const isDisabled = !isSelected && selected.length >= MAX_SELECT;
            return (
              <TouchableOpacity
                key={goal}
                style={[
                  styles.goalChip,
                  isSelected && styles.goalChipSelected,
                  isDisabled && styles.goalChipDisabled,
                ]}
                onPress={() => handleToggle(goal)}
                activeOpacity={0.8}
                disabled={isDisabled}
              >
                <Text
                  style={[
                    styles.goalChipText,
                    isSelected && styles.goalChipTextSelected,
                    isDisabled && styles.goalChipTextDisabled,
                  ]}
                >
                  {goal}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>

      <TouchableOpacity
        style={[styles.confirmButton, !isConfirmEnabled && styles.confirmButtonDisabled]}
        onPress={handleConfirm}
        disabled={!isConfirmEnabled}
      >
        <Text
          style={[styles.confirmButtonText, !isConfirmEnabled && styles.confirmButtonTextDisabled]}
        >
          설정하기
        </Text>
      </TouchableOpacity>
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
  content: {
    paddingHorizontal: spacing.base,
    paddingTop: spacing.lg,
    paddingBottom: spacing['2xl'],
  },
  counterText: {
    ...typography.bodySmall,
    color: colors.grayscale.gray700,
    marginBottom: spacing.lg,
  },
  goalGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  goalChip: {
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.sm,
    borderRadius: spacing.xl,
    borderWidth: 1,
    borderColor: colors.grayscale.gray200,
    backgroundColor: colors.grayscale.white,
  },
  goalChipSelected: {
    borderColor: colors.main.main,
    backgroundColor: colors.main.sub1,
  },
  goalChipDisabled: {
    opacity: 0.5,
  },
  goalChipText: {
    ...typography.bodySmall,
    color: colors.grayscale.gray700,
  },
  goalChipTextSelected: {
    color: colors.main.main,
    fontWeight: fontWeight.semibold,
  },
  goalChipTextDisabled: {
    color: colors.grayscale.gray400,
  },
  confirmButton: {
    marginHorizontal: spacing.base,
    marginBottom: spacing.xl,
    paddingVertical: spacing.base,
    backgroundColor: colors.main.main,
    borderRadius: spacing.base,
    alignItems: 'center',
    justifyContent: 'center',
  },
  confirmButtonDisabled: {
    backgroundColor: colors.grayscale.gray300,
  },
  confirmButtonText: {
    ...typography.bodyLarge,
    fontWeight: fontWeight.semibold,
    color: colors.grayscale.white,
  },
  confirmButtonTextDisabled: {
    color: colors.grayscale.gray500,
  },
});
