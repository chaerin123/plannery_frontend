import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { colors, spacing, typography, fontWeight } from '../src/constants';

export type RepeatOption = '없음' | '매일' | '주중' | '주말' | '직접 선택';

export interface RepeatOptionButtonsProps {
  selectedOption: RepeatOption | null;
  onOptionSelect: (option: RepeatOption) => void;
}

const options: RepeatOption[] = ['없음', '매일', '주중', '주말', '직접 선택'];

/**
 * 반복 주기 옵션 버튼 컴포넌트
 * 가로 스크롤 가능한 옵션 버튼들
 */
export default function RepeatOptionButtons({
  selectedOption,
  onOptionSelect,
}: RepeatOptionButtonsProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>반복 주기</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.optionsContainer}
      >
        {options.map((option, index) => {
          const isSelected = selectedOption === option;
          return (
            <TouchableOpacity
              key={option}
              style={[
                styles.optionButton,
                isSelected && styles.optionButtonSelected,
                index < options.length - 1 && styles.optionButtonMargin,
              ]}
              onPress={() => onOptionSelect(option)}
            >
              <Text
                style={[
                  styles.optionText,
                  isSelected && styles.optionTextSelected,
                ]}
              >
                {option}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.md,
  },
  label: {
    ...typography.bodyMedium,
    fontWeight: fontWeight.semibold,
    color: colors.grayscale.gray900,
    marginBottom: spacing.md,
  },
  optionsContainer: {
    flexDirection: 'row',
    paddingRight: spacing.base,
  },
  optionButton: {
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.sm,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.grayscale.gray200,
    backgroundColor: colors.grayscale.white,
    minWidth: 60,
    alignItems: 'center',
    justifyContent: 'center',
  },
  optionButtonMargin: {
    marginRight: spacing.sm,
  },
  optionButtonSelected: {
    backgroundColor: colors.main.main,
    borderColor: colors.main.main,
  },
  optionText: {
    ...typography.bodyMedium,
    fontWeight: fontWeight.medium,
    color: colors.grayscale.gray700,
  },
  optionTextSelected: {
    color: colors.grayscale.white,
    fontWeight: fontWeight.semibold,
  },
});
