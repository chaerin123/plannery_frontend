import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, typography, fontWeight } from '../src/constants';
import CheckFlowerEmpty from '../assets/check_flower _emt.svg';
import CheckFlowerFilled from '../assets/check_flower.svg';
import ImportantTag from '../assets/important-tag.svg';

export type PlanCardStatus = 'TODO' | 'DONE';

export interface PlanCardProps {
  title: string;
  time: string;
  status: PlanCardStatus;
  colorBar?: string; // 좌측 컬러 바 색상 (선택적)
  isImportant?: boolean;
  onStatusToggle?: () => void;
  onMenuPress?: () => void;
}

export default function PlanCard({
  title,
  time,
  status,
  colorBar = colors.main.main,
  isImportant = false,
  onStatusToggle,
  onMenuPress,
}: PlanCardProps) {
  const isDone = status === 'DONE';

  return (
    <View style={styles.container} collapsable={false}>
      {/* 좌측 컬러 바 */}
      <View style={[styles.colorBar, { backgroundColor: colorBar }]} collapsable={false} />

      {/* 메인 컨텐츠 */}
      <View style={styles.content} collapsable={false}>
        <View style={styles.topRow}>
          <View style={styles.leftInline} collapsable={false}>
            {/* 체크 아이콘 */}
            <TouchableOpacity style={styles.iconButton} onPress={onStatusToggle} activeOpacity={0.7}>
              {isDone ? (
                <CheckFlowerFilled width={24} height={24} />
              ) : (
                <CheckFlowerEmpty width={24} height={24} />
              )}
            </TouchableOpacity>

            {/* 중요 태그 + 계획명 */}
            <View style={styles.titleRow} collapsable={false}>
              {isImportant && <ImportantTag width={34} height={20} style={styles.importantTag} />}
              <Text style={[styles.title, isDone ? styles.titleDone : null]} numberOfLines={1}>
                {title}
              </Text>
            </View>
          </View>

          {/* 우측 옵션 메뉴 */}
          <TouchableOpacity style={styles.menuButton} onPress={onMenuPress}>
            <Ionicons name="ellipsis-vertical" size={20} color={colors.grayscale.gray500} />
          </TouchableOpacity>
        </View>

        <View style={styles.timeRow}>
          <Ionicons name="time-outline" size={16} color={colors.grayscale.gray500} />
          <Text style={[styles.time, isDone ? styles.timeDone : null]}>{time}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: colors.grayscale.white,
    borderRadius: 10, // iOS 스타일 - 더 둥근 모서리
    marginBottom: spacing.sm,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.grayscale.gray100,
    elevation: 2,
    shadowColor: colors.grayscale.gray900,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  colorBar: {
    width: 16,
    backgroundColor: colors.main.main,
  },
  content: {
    flex: 1,
    padding: spacing.md,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  leftInline: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    minWidth: 0,
  },
  iconButton: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.sm,
  },
  titleRow: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    minWidth: 0,
  },
  importantTag: {
    marginRight: spacing.sm,
  },
  title: {
    ...typography.bodyLarge,
    color: colors.grayscale.gray900,
    fontWeight: fontWeight.semibold,
    flexShrink: 1,
  },
  titleDone: {
    textDecorationLine: 'line-through',
    color: colors.grayscale.gray500,
  },
  time: {
    ...typography.bodySmall,
    color: colors.grayscale.gray500,
    marginLeft: spacing.xs,
  },
  timeDone: {
    color: colors.grayscale.gray300,
  },
  menuButton: {
    padding: spacing.sm,
    justifyContent: 'center',
    alignItems: 'center',
  },
  timeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 0,
    paddingLeft: 25 + spacing.sm,
  },
});

