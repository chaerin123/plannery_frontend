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
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, typography, fontWeight } from '../src/constants';
import { GROUP_COLORS } from '../types/group';

export interface ColorPickerBottomSheetProps {
  visible: boolean;
  selectedColor: string;
  onClose: () => void;
  onConfirm: (color: string) => void;
  title?: string; // 제목을 선택적으로 받을 수 있도록
}

/**
 * 색상 선택 Bottom Sheet
 * 그룹 색상을 선택할 수 있는 팔레트 제공
 */
export default function ColorPickerBottomSheet({
  visible,
  selectedColor,
  onClose,
  onConfirm,
  title = '그룹 색상',
}: ColorPickerBottomSheetProps) {
  const [tempColor, setTempColor] = React.useState(selectedColor);

  // 모달이 열릴 때 현재 색상으로 초기화
  React.useEffect(() => {
    if (visible) {
      setTempColor(selectedColor);
    }
  }, [visible, selectedColor]);

  const handleConfirm = () => {
    onConfirm(tempColor);
    onClose();
  };

  // 4행 5열로 색상 배치
  const rows = [];
  for (let i = 0; i < 4; i++) {
    rows.push(GROUP_COLORS.slice(i * 5, (i + 1) * 5));
  }

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
                <Text style={styles.title}>{title}</Text>
                <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                  <Ionicons name="close" size={24} color={colors.grayscale.gray500} />
                </TouchableOpacity>
              </View>

              {/* 컨텐츠 */}
              <View style={styles.content}>
                <View style={styles.colorGrid}>
                  {rows.map((row, rowIndex) => (
                    <View key={rowIndex} style={styles.colorRow}>
                      {row.map((color, colIndex) => {
                        const isSelected = tempColor === color;
                        return (
                          <TouchableOpacity
                            key={colIndex}
                            style={[
                              styles.colorSwatch,
                              isSelected && styles.colorSwatchSelected,
                              { backgroundColor: color },
                              colIndex < row.length - 1 && styles.colorSwatchMargin,
                            ]}
                            onPress={() => setTempColor(color)}
                          >
                            {isSelected && (
                              <View style={styles.checkmark}>
                                <Text style={styles.checkmarkText}>✓</Text>
                              </View>
                            )}
                          </TouchableOpacity>
                        );
                      })}
                    </View>
                  ))}
                </View>
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
  content: {
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.md,
  },
  colorGrid: {
    // gap 제거 (웹 호환성)
  },
  colorRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  colorSwatch: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: colors.grayscale.gray200,
    alignItems: 'center',
    justifyContent: 'center',
  },
  colorSwatchMargin: {
    marginRight: spacing.md,
  },
  colorSwatchSelected: {
    borderColor: colors.main.main,
    borderWidth: 3,
  },
  checkmark: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.grayscale.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkmarkText: {
    fontSize: 16,
    color: colors.main.main,
    fontWeight: fontWeight.bold,
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
