import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  TouchableWithoutFeedback,
  useWindowDimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, spacing, typography, fontWeight } from '../src/constants';
import { Time } from '../utils/timeFormatter';
import TimeInput from './TimeInput';
import TimePickerWheel from './TimePickerWheel';

export interface TimePickerBottomSheetProps {
  visible: boolean;
  startTime: Time | null;
  endTime: Time | null;
  onClose: () => void;
  onConfirm: (startTime: Time | null, endTime: Time | null) => void;
}

export default function TimePickerBottomSheet({
  visible,
  startTime,
  endTime,
  onClose,
  onConfirm,
}: TimePickerBottomSheetProps) {
  const { height: windowHeight } = useWindowDimensions();
  const sheetHeight = Math.min(windowHeight * 0.72, 560);

  const [tempStartTime, setTempStartTime] = React.useState<Time | null>(startTime);
  const [tempEndTime, setTempEndTime] = React.useState<Time | null>(endTime);
  const [activeField, setActiveField] = React.useState<'start' | 'end'>('start');

  // 모달이 열릴 때 현재 값으로 초기화
  React.useEffect(() => {
    if (visible) {
      setTempStartTime(startTime);
      setTempEndTime(endTime);
      // 시작 시간이 없으면 시작 시간 필드 활성화, 있으면 마감 시간 필드 활성화
      setActiveField(startTime ? 'end' : 'start');
    }
  }, [visible, startTime, endTime]);

  const handleConfirm = () => {
    if (tempStartTime) {
      onConfirm(tempStartTime, tempEndTime);
      onClose();
    }
  };

  const handleClearStartTime = () => {
    setTempStartTime(null);
    setTempEndTime(null); // 시작 시간을 지우면 마감 시간도 지움
    setActiveField('start');
  };

  const handleClearEndTime = () => {
    setTempEndTime(null);
    setActiveField('end');
  };

  const handleStartTimeFieldPress = () => {
    setActiveField('start');
  };

  const handleEndTimeFieldPress = () => {
    // 시작 시간이 있어야만 마감 시간 선택 가능
    if (tempStartTime) {
      setActiveField('end');
    }
  };

  // 현재 활성화된 필드의 시간
  const currentTime = activeField === 'start' ? tempStartTime : tempEndTime;
  const setCurrentTime = activeField === 'start' ? setTempStartTime : setTempEndTime;

  // 확인 버튼 활성화 조건: 시작 시간과 마감 시간이 모두 있어야 함
  // (요구사항: 시작 시간만 선택된 경우 비활성화)
  const isConfirmEnabled = tempStartTime !== null && tempEndTime !== null;

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
            <View style={[styles.bottomSheet, { height: sheetHeight }]}>
              {/* 헤더 */}
              <View style={styles.header}>
                <Text style={styles.title}>시간을 설정해주세요.</Text>
                <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                  <Text style={styles.closeButtonText}>✕</Text>
                </TouchableOpacity>
              </View>

              {/* 컨텐츠: flex 1로 남는 공간 채움, overflow 방지 */}
              <View style={styles.content}>
                <View style={styles.timeInputContainer}>
                  <TimeInput
                    label="시작 시간"
                    value={tempStartTime}
                    isActive={activeField === 'start'}
                    onPress={handleStartTimeFieldPress}
                    onClear={handleClearStartTime}
                  />
                  <Text style={styles.timeSeparator}>~</Text>
                  <TimeInput
                    label="마감 시간"
                    value={tempEndTime}
                    isActive={activeField === 'end'}
                    showNone={true}
                    onPress={handleEndTimeFieldPress}
                    onClear={handleClearEndTime}
                  />
                </View>
                <TimePickerWheel
                  value={currentTime}
                  onChange={setCurrentTime}
                  label=""
                  required={false}
                  minTime={activeField === 'end' ? tempStartTime : null}
                  fillHeight
                />
              </View>

              {/* 확인 버튼: 항상 하단 고정 */}
              <SafeAreaView style={styles.confirmArea} edges={['bottom']}>
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
              </SafeAreaView>
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
    flex: 1,
    minHeight: 0,
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.md,
  },
  confirmArea: {
    paddingHorizontal: spacing.base,
    paddingTop: spacing.md,
    paddingBottom: spacing.sm,
  },
  timeInputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginBottom: spacing.xl,
  },
  timeSeparator: {
    ...typography.bodyLarge,
    color: colors.grayscale.gray500,
    marginBottom: spacing.sm,
    paddingHorizontal: spacing.xs,
    marginLeft: spacing.md,
    marginRight: spacing.md,
  },
  confirmButton: {
    backgroundColor: colors.main.main,
    marginHorizontal: 0,
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
