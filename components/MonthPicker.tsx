import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { colors, spacing, typography, fontWeight } from '../src/constants';

const months = [
  '1월',
  '2월',
  '3월',
  '4월',
  '5월',
  '6월',
  '7월',
  '8월',
  '9월',
  '10월',
  '11월',
  '12월',
];

export interface MonthPickerProps {
  selectedDate: Date;
  onMonthSelect: (date: Date) => void;
}

export default function MonthPicker({
  selectedDate,
  onMonthSelect,
}: MonthPickerProps) {
  const [currentYear, setCurrentYear] = useState(selectedDate.getFullYear());

  const handlePrevYear = () => {
    setCurrentYear(currentYear - 1);
  };

  const handleNextYear = () => {
    setCurrentYear(currentYear + 1);
  };

  const handleMonthPress = (monthIndex: number) => {
    const newDate = new Date(currentYear, monthIndex, 1);
    onMonthSelect(newDate);
  };

  const isSelectedMonth = (monthIndex: number): boolean => {
    return (
      currentYear === selectedDate.getFullYear() &&
      monthIndex === selectedDate.getMonth()
    );
  };

  return (
    <View style={styles.container}>
      {/* 연도 네비게이션 */}
      <View style={styles.yearNavigation}>
        <TouchableOpacity onPress={handlePrevYear} style={styles.navButton}>
          <Text style={styles.navButtonText}>‹</Text>
        </TouchableOpacity>
        <Text style={styles.yearText}>{currentYear}년</Text>
        <TouchableOpacity onPress={handleNextYear} style={styles.navButton}>
          <Text style={styles.navButtonText}>›</Text>
        </TouchableOpacity>
      </View>

      {/* 월 그리드 */}
      <View style={styles.monthGrid}>
        {months.map((month, index) => {
          const selected = isSelectedMonth(index);
          return (
            <TouchableOpacity
              key={month}
              style={[styles.monthCell, selected && styles.selectedMonthCell]}
              onPress={() => handleMonthPress(index)}
            >
              <Text
                style={[
                  styles.monthText,
                  selected && styles.selectedMonthText,
                ]}
              >
                {month}
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
    paddingVertical: spacing.md,
  },
  yearNavigation: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.base,
  },
  navButton: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  navButtonText: {
    fontSize: 24,
    color: colors.grayscale.gray700,
  },
  yearText: {
    ...typography.bodyLarge,
    fontWeight: fontWeight.semibold,
    color: colors.grayscale.gray900,
  },
  monthGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.base,
  },
  monthCell: {
    flexBasis: '23%',
    aspectRatio: 1.5,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.sm,
    borderRadius: spacing.base,
    backgroundColor: colors.grayscale.white,
    borderWidth: 1,
    borderColor: colors.grayscale.gray200,
  },
  selectedMonthCell: {
    backgroundColor: colors.main.main,
    borderColor: colors.main.main,
  },
  monthText: {
    ...typography.bodyMedium,
    color: colors.grayscale.gray700,
  },
  selectedMonthText: {
    color: colors.grayscale.white,
    fontWeight: fontWeight.semibold,
  },
});
