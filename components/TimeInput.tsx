import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, typography, fontWeight } from '../src/constants';
import { Time, formatTime } from '../utils/timeFormatter';

export interface TimeInputProps {
  label: string;
  value: Time | null;
  isActive: boolean;
  showNone?: boolean; // "없음" 표시 여부 (마감 시간용)
  onPress: () => void;
  onClear?: () => void;
}

/**
 * 시간 입력 필드 컴포넌트
 * iOS 스타일의 시간 입력 UI
 */
export default function TimeInput({
  label,
  value,
  isActive,
  showNone = false,
  onPress,
  onClear,
}: TimeInputProps) {
  const displayText = value ? formatTime(value) : (showNone ? '없음' : '');

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <TouchableOpacity
        style={[
          styles.inputField,
          isActive && styles.inputFieldActive,
        ]}
        onPress={onPress}
      >
        <Text style={[
          styles.inputText,
          !value && showNone && styles.inputTextNone,
        ]}>
          {displayText}
        </Text>
        {value && onClear && (
          <TouchableOpacity
            style={styles.clearButton}
            onPress={(e) => {
              e.stopPropagation();
              onClear();
            }}
          >
            <Ionicons name="close-circle" size={20} color={colors.grayscale.gray500} />
          </TouchableOpacity>
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginRight: spacing.xs,
  },
  label: {
    ...typography.bodySmall,
    color: colors.grayscale.gray700,
    marginBottom: spacing.xs,
  },
  inputField: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.sm,
    backgroundColor: colors.grayscale.gray50,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.grayscale.gray200,
    minHeight: 44,
  },
  inputFieldActive: {
    borderColor: colors.main.main,
    borderWidth: 2,
    backgroundColor: colors.grayscale.white,
  },
  inputText: {
    ...typography.bodyLarge,
    color: colors.grayscale.gray900,
    flex: 1,
  },
  inputTextNone: {
    color: colors.grayscale.gray500,
  },
  clearButton: {
    padding: spacing.xs,
    marginLeft: spacing.xs,
  },
});
