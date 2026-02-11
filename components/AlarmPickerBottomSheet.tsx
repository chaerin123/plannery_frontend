import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Platform,
  Switch,
} from 'react-native';
import { colors, spacing, typography, fontWeight } from '../src/constants';
import { Time } from '../utils/timeFormatter';
import AlarmTimeInput from './AlarmTimeInput';
import AlarmWheelPicker from './AlarmWheelPicker';

export interface AlarmPickerBottomSheetProps {
  visible: boolean;
  isEnabled: boolean;
  alarmTime: Time | null;
  onClose: () => void;
  onConfirm: (isEnabled: boolean, alarmTime: Time | null) => void;
}

/**
 * 알람 설정 Bottom Sheet
 * 알람 ON/OFF 토글과 시간 선택 기능 제공
 */
export default function AlarmPickerBottomSheet({
  visible,
  isEnabled: initialIsEnabled,
  alarmTime: initialAlarmTime,
  onClose,
  onConfirm,
}: AlarmPickerBottomSheetProps) {
  const [isEnabled, setIsEnabled] = React.useState(initialIsEnabled);
  const [alarmTime, setAlarmTime] = React.useState<Time | null>(initialAlarmTime);

  // 모달이 열릴 때 현재 값으로 초기화
  React.useEffect(() => {
    if (visible) {
      setIsEnabled(initialIsEnabled);
      setAlarmTime(initialAlarmTime || { hour: 9, minute: 0 }); // 기본값: 09:00
    }
  }, [visible, initialIsEnabled, initialAlarmTime]);

  const handleConfirm = () => {
    onConfirm(isEnabled, alarmTime);
    onClose();
  };

  const handleTimeChange = (time: Time) => {
    setAlarmTime(time);
  };

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
                <Text style={styles.title}>알람 시간 설정</Text>
                <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                  <Text style={styles.closeButtonText}>✕</Text>
                </TouchableOpacity>
              </View>

              {/* 컨텐츠 */}
              <View style={styles.content}>
                {/* 알람 ON/OFF 토글 */}
                <View style={styles.toggleContainer}>
                  <Text style={styles.toggleLabel}>알람</Text>
                  <TouchableOpacity
                    style={[styles.switchTrack, isEnabled && styles.switchTrackOn]}
                    activeOpacity={0.8}
                    onPress={() => setIsEnabled((prev) => !prev)}
                  >
                    <View style={[styles.switchThumb, isEnabled && styles.switchThumbOn]} />
                  </TouchableOpacity>
                </View>

                {/* 알람 시간 표시 */}
                {isEnabled && (
                  <>
                    <AlarmTimeInput time={alarmTime} />

                    {/* Wheel Picker */}
                    <AlarmWheelPicker
                      value={alarmTime}
                      onChange={handleTimeChange}
                    />
                  </>
                )}
              </View>

              {/* 확인 버튼 */}
              <TouchableOpacity
                style={styles.confirmButton}
                onPress={handleConfirm}
              >
                <Text style={styles.confirmButtonText}>확인</Text>
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
  toggleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.base,
    marginBottom: spacing.md,
  },
  toggleLabel: {
    ...typography.bodyLarge,
    fontWeight: fontWeight.medium,
    color: colors.grayscale.gray900,
  },
  switchTrack: {
    width: 44,
    height: 26,
    borderRadius: 13,
    backgroundColor: colors.grayscale.gray200,
    padding: 3,
    justifyContent: 'center',
  },
  switchTrackOn: {
    backgroundColor: colors.main.main,
  },
  switchThumb: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: colors.grayscale.white,
    transform: [{ translateX: 0 }],
  },
  switchThumbOn: {
    transform: [{ translateX: 18 }],
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
  confirmButtonText: {
    ...typography.bodyLarge,
    fontWeight: fontWeight.semibold,
    color: colors.grayscale.white,
  },
});
