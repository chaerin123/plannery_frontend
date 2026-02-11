import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, spacing, typography, fontWeight } from '../src/constants';
import { Time, formatTime, to12HourFormat } from '../utils/timeFormatter';

export interface AlarmTimeInputProps {
  time: Time | null;
}

/**
 * 알람 시간 표시 영역 컴포넌트
 * 선택된 알람 시간을 큰 글씨로 표시
 */
export default function AlarmTimeInput({ time }: AlarmTimeInputProps) {
  if (!time) {
    return (
      <View style={styles.container}>
        <Text style={styles.timeText}>--:--</Text>
      </View>
    );
  }

  const { hour, minute } = time;
  const { hour12, period } = to12HourFormat(hour);
  const formattedTime = formatTime(time);
  const displayHour = hour12;
  const displayMinute = String(minute).padStart(2, '0');

  return (
    <View style={styles.container}>
      <View style={styles.timeRow}>
        <Text style={styles.periodText}>{period}</Text>
        <Text style={styles.timeText}>
          {displayHour}:{displayMinute}
        </Text>
      </View>
      <Text style={styles.subText}>{formattedTime}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.xl,
  },
  timeRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: spacing.sm,
  },
  periodText: {
    ...typography.bodyLarge,
    color: colors.grayscale.gray600,
    fontWeight: fontWeight.medium,
  },
  timeText: {
    ...typography.headingLarge,
    fontSize: 48,
    fontWeight: fontWeight.bold,
    color: colors.grayscale.gray900,
  },
  subText: {
    ...typography.bodyMedium,
    color: colors.grayscale.gray500,
    marginTop: spacing.xs,
  },
});
