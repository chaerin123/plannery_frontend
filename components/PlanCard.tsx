import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, typography, fontWeight } from '../src/constants';

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
        <View style={styles.leftSection} collapsable={false}>
          {/* 아이콘 */}
          <TouchableOpacity style={styles.iconButton} onPress={onStatusToggle} activeOpacity={0.7}>
            <Image
              source={
                isDone
                  ? require('../assets/체크박스Group 1437256896.png')
                  : require('../assets/체크박스Group 1437256897.png')
              }
              style={styles.iconImage}
              resizeMode="contain"
            />
          </TouchableOpacity>

          {/* 텍스트 영역 */}
          <View style={styles.textSection} collapsable={false}>
            {isImportant && (
              <Image
                source={require('../assets/중요1686560433.png')}
                style={styles.importantTagImage}
                resizeMode="contain"
              />
            )}
            <Text
              style={[styles.title, isDone ? styles.titleDone : null]}
              numberOfLines={1}
            >
              {title}
            </Text>
            <View style={styles.timeRow}>
              <Ionicons name="time-outline" size={14} color={colors.grayscale.gray500} />
              <Text style={[styles.time, isDone ? styles.timeDone : null]}>{time}</Text>
            </View>
          </View>
        </View>

        {/* 우측 옵션 메뉴 */}
        <TouchableOpacity style={styles.menuButton} onPress={onMenuPress}>
          <Ionicons name="ellipsis-vertical" size={16} color={colors.grayscale.gray500} />
        </TouchableOpacity>
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing.base,
  },
  leftSection: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconButton: {
    width: 28,
    height: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  iconImage: {
    width: 24,
    height: 24,
  },
  textSection: {
    flex: 1,
    gap: spacing.xs,
  },
  importantTagImage: {
    width: 34,
    height: 18,
  },
  title: {
    ...typography.bodyLarge,
    color: colors.grayscale.gray900,
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
    padding: spacing.xs,
    justifyContent: 'center',
    alignItems: 'center',
  },
  timeRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});

