import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Platform,
} from 'react-native';
import { colors, spacing, typography, fontWeight } from '../src/constants';
import RepeatOptionButtons, { RepeatOption } from './RepeatOptionButtons';
import WeekdaySelector from './WeekdaySelector';

export interface RepeatSettingBottomSheetProps {
  visible: boolean;
  selectedOption: RepeatOption | null;
  selectedDays: number[]; // 0=월요일, 1=화요일, ..., 6=일요일
  onClose: () => void;
  onConfirm: (option: RepeatOption | null, days: number[]) => void;
}

/**
 * 반복 주기 설정 Bottom Sheet
 * 반복 주기 옵션 선택 및 요일 선택 기능 제공
 */
export default function RepeatSettingBottomSheet({
  visible,
  selectedOption: initialSelectedOption,
  selectedDays: initialSelectedDays,
  onClose,
  onConfirm,
}: RepeatSettingBottomSheetProps) {
  const [selectedOption, setSelectedOption] = React.useState<RepeatOption | null>(
    initialSelectedOption
  );
  const [selectedDays, setSelectedDays] = React.useState<number[]>(initialSelectedDays);

  // 모달이 열릴 때 현재 값으로 초기화
  React.useEffect(() => {
    if (visible) {
      setSelectedOption(initialSelectedOption);
      setSelectedDays(initialSelectedDays);
    }
  }, [visible, initialSelectedOption, initialSelectedDays]);

  const handleOptionSelect = (option: RepeatOption) => {
    setSelectedOption(option);
    // "직접 선택"이 아니면 요일 선택 초기화
    if (option !== '직접 선택') {
      setSelectedDays([]);
    }
  };

  const handleDayToggle = (dayIndex: number) => {
    if (selectedDays.includes(dayIndex)) {
      setSelectedDays(selectedDays.filter((d) => d !== dayIndex));
    } else {
      setSelectedDays([...selectedDays, dayIndex]);
    }
  };

  const handleConfirm = () => {
    // 확인 버튼 활성화 조건 체크
    if (selectedOption === '직접 선택') {
      // 직접 선택인 경우 요일이 1개 이상 선택되어야 함
      if (selectedDays.length === 0) {
        return;
      }
    } else if (selectedOption === null) {
      // 옵션이 선택되지 않았으면 확인 불가
      return;
    }

    onConfirm(selectedOption, selectedDays);
    onClose();
  };

  // 확인 버튼 활성화 조건
  const isConfirmEnabled =
    selectedOption !== null &&
    (selectedOption !== '직접 선택' || selectedDays.length > 0);

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback onPress={(e) => e.stopPropagation()}>
            <View style={styles.bottomSheet}>
              {/* 헤더 */}
              <View style={styles.header}>
                <Text style={styles.title}>반복 주기를 설정해보세요.</Text>
                <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                  <Text style={styles.closeButtonText}>✕</Text>
                </TouchableOpacity>
              </View>

              {/* 컨텐츠 */}
              <View style={styles.content}>
                {/* 반복 주기 옵션 */}
                <RepeatOptionButtons
                  selectedOption={selectedOption}
                  onOptionSelect={handleOptionSelect}
                />

                {/* 직접 선택인 경우 요일 선택 UI 표시 */}
                {selectedOption === '직접 선택' && (
                  <WeekdaySelector
                    selectedDays={selectedDays}
                    onDayToggle={handleDayToggle}
                  />
                )}
              </View>

              {/* 확인 버튼 */}
              <TouchableOpacity
                style={[
                  styles.confirmButton,
                  !isConfirmEnabled && styles.confirmButtonDisabled,
                ]}
                onPress={handleConfirm}
                disabled={!isConfirmEnabled}
              >
                <Text
                  style={[
                    styles.confirmButtonText,
                    !isConfirmEnabled && styles.confirmButtonTextDisabled,
                  ]}
                >
                  확인
                </Text>
              </TouchableOpacity>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  bottomSheet: {
    backgroundColor: colors.grayscale.white,
    borderTopLeftRadius: spacing.xl,
    borderTopRightRadius: spacing.xl,
    maxHeight: '90%',
    flexDirection: 'column',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.grayscale.gray100,
  },
  title: {
    ...typography.bodyLarge,
    fontWeight: fontWeight.semibold,
    color: colors.grayscale.gray900,
  },
  closeButton: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: 24,
    color: colors.grayscale.gray500,
  },
  content: {
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.md,
  },
  confirmButton: {
    backgroundColor: colors.main.main,
    marginHorizontal: spacing.base,
    marginTop: spacing.md,
    marginBottom: Platform.OS === 'ios' ? spacing['2xl'] : spacing.xl,
    paddingVertical: spacing.base,
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
