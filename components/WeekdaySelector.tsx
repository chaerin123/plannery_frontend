import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { colors, spacing, typography, fontWeight } from '../src/constants';

export interface WeekdaySelectorProps {
  selectedDays: number[]; // 0=월요일, 1=화요일, ..., 6=일요일
  onDayToggle: (dayIndex: number) => void;
}

const weekdays = ['월', '화', '수', '목', '금', '토', '일'];

/**
 * 요일 선택 컴포넌트
 * 다중 선택 가능한 요일 버튼들
 */
export default function WeekdaySelector({
  selectedDays,
  onDayToggle,
}: WeekdaySelectorProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>요일 선택</Text>
      <View style={styles.weekdayContainer}>
        {weekdays.map((day, index) => {
          const isSelected = selectedDays.includes(index);
          return (
            <TouchableOpacity
              key={index}
              style={[
                styles.weekdayButton,
                isSelected && styles.weekdayButtonSelected,
                index < weekdays.length - 1 && styles.weekdayButtonMargin,
              ]}
              onPress={() => onDayToggle(index)}
            >
              <Text
                style={[
                  styles.weekdayText,
                  isSelected && styles.weekdayTextSelected,
                ]}
              >
                {day}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: spacing.xl,
  },
  label: {
    ...typography.bodyMedium,
    fontWeight: fontWeight.semibold,
    color: colors.grayscale.gray900,
    marginBottom: spacing.md,
  },
  weekdayContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  weekdayButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: colors.grayscale.gray200,
    backgroundColor: colors.grayscale.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  weekdayButtonMargin: {
    marginRight: spacing.sm,
  },
  weekdayButtonSelected: {
    backgroundColor: colors.main.main,
    borderColor: colors.main.main,
  },
  weekdayText: {
    ...typography.bodyMedium,
    fontWeight: fontWeight.medium,
    color: colors.grayscale.gray700,
  },
  weekdayTextSelected: {
    color: colors.grayscale.white,
    fontWeight: fontWeight.semibold,
  },
});
