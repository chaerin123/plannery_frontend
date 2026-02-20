import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, typography, fontWeight } from '../src/constants';

export interface OnboardingPlanCardProps {
  barColor: string;
  title: string;
  timeText: string;
}

/**
 * 온보딩 "중요 계획 태그부터" 슬라이드용 카드
 * Figma 구조: [컬러 vertical bar] [아이콘] [태그 배지] [계획 제목] [시간 텍스트]
 */
export default function OnboardingPlanCard({
  barColor,
  title,
  timeText,
}: OnboardingPlanCardProps) {
  return (
    <View style={styles.card}>
      <View style={[styles.bar, { backgroundColor: barColor }]} />
      <View style={styles.iconWrap}>
        <Ionicons name="bulb-outline" size={20} color={colors.grayscale.gray700} />
      </View>
      <View style={styles.body}>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>중요</Text>
        </View>
        <Text style={styles.title} numberOfLines={1}>
          {title}
        </Text>
        <View style={styles.timeRow}>
          <Ionicons name="time-outline" size={12} color={colors.grayscale.gray500} />
          <Text style={styles.timeText}>{timeText}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.grayscale.white,
    borderRadius: 16,
    padding: spacing.base,
    overflow: 'hidden',
    shadowColor: colors.grayscale.gray900,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  bar: {
    width: 4,
    alignSelf: 'stretch',
    borderRadius: 2,
    marginRight: spacing.sm,
  },
  iconWrap: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.grayscale.gray100,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.sm,
  },
  body: {
    flex: 1,
    gap: spacing.xs,
  },
  badge: {
    alignSelf: 'flex-start',
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: spacing.base,
    backgroundColor: colors.main.sub1,
  },
  badgeText: {
    ...typography.bodySmall,
    color: colors.main.main,
    fontWeight: fontWeight.semibold,
  },
  title: {
    ...typography.bodyMedium,
    color: colors.grayscale.gray900,
    fontWeight: fontWeight.medium,
  },
  timeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  timeText: {
    ...typography.bodySmall,
    color: colors.grayscale.gray500,
  },
});
