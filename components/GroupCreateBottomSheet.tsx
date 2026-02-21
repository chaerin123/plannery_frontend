import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Platform,
  TextInput,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, typography, fontWeight } from '../src/constants';
import { Group } from '../types/group';
import ColorPickerBottomSheet from './ColorPickerBottomSheet';

export interface GroupCreateBottomSheetProps {
  visible: boolean;
  group: Group | null; // null이면 생성 모드, 있으면 수정 모드
  onClose: () => void;
  onConfirm: (name: string, color: string) => void;
}

const MAX_NAME_LENGTH = 10;

/**
 * 그룹 생성/수정 Bottom Sheet
 * 그룹 이름과 색상을 설정할 수 있는 UI
 */
export default function GroupCreateBottomSheet({
  visible,
  group,
  onClose,
  onConfirm,
}: GroupCreateBottomSheetProps) {
  const [groupName, setGroupName] = React.useState('');
  const [selectedColor, setSelectedColor] = React.useState<string>(colors.main.main);
  const [isColorPickerVisible, setIsColorPickerVisible] = React.useState(false);

  // 모달이 열릴 때 현재 값으로 초기화
  React.useEffect(() => {
    if (visible) {
      if (group) {
        // 수정 모드
        setGroupName(group.name);
        setSelectedColor(group.color);
      } else {
        // 생성 모드
        setGroupName('');
        setSelectedColor(colors.main.main);
      }
    }
  }, [visible, group]);

  const handleConfirm = () => {
    if (groupName.trim().length === 0) {
      return; // 이름이 비어있으면 확인 불가
    }
    onConfirm(groupName.trim(), selectedColor);
    onClose();
  };

  const handleColorPickerConfirm = (color: string) => {
    setSelectedColor(color);
  };

  const isConfirmEnabled = groupName.trim().length > 0;
  const isEditMode = Boolean(group);

  return (
    <>
      <Modal
        visible={visible && !isColorPickerVisible}
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
                  <TouchableOpacity onPress={onClose} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color={colors.grayscale.gray900} />
                  </TouchableOpacity>
                  <Text style={styles.title}>
                    {isEditMode ? '그룹 수정하기' : '그룹 생성하기'}
                  </Text>
                  <View style={styles.headerRight} />
                </View>

                {/* 컨텐츠 */}
                <View style={styles.content}>
                  {/* 그룹 이름 */}
                  <View style={styles.inputContainer}>
                    <Text style={styles.inputLabel}>그룹 이름</Text>
                    <View style={styles.inputWrapper}>
                      <TextInput
                        style={styles.textInput}
                        placeholder="그룹의 이름을 입력하세요."
                        placeholderTextColor={colors.grayscale.gray500}
                        value={groupName}
                        onChangeText={(text) => {
                          if (text.length <= MAX_NAME_LENGTH) {
                            setGroupName(text);
                          }
                        }}
                        maxLength={MAX_NAME_LENGTH}
                      />
                      <Text style={styles.charCounter}>
                        {groupName.length}/{MAX_NAME_LENGTH}
                      </Text>
                    </View>
                  </View>

                  {/* 그룹 색상 */}
                  <View style={styles.inputContainer}>
                    <Text style={styles.inputLabel}>그룹 색상</Text>
                    <TouchableOpacity
                      style={styles.colorSelector}
                      onPress={() => setIsColorPickerVisible(true)}
                    >
                      <View style={styles.colorSelectorLeft}>
                        <Ionicons name="color-palette-outline" size={20} color={colors.grayscale.gray700} />
                        <Text style={[styles.colorSelectorText, { marginLeft: spacing.sm }]}>색상</Text>
                      </View>
                      <View style={styles.colorSelectorRight}>
                        <View
                          style={[
                            styles.colorPreview,
                            { backgroundColor: selectedColor },
                          ]}
                        />
                        <Ionicons name="chevron-forward" size={20} color={colors.grayscale.gray300} />
                      </View>
                    </TouchableOpacity>
                  </View>
                </View>

                {/* 추가하기 버튼 */}
                <TouchableOpacity
                  style={[
                    styles.addButton,
                    !isConfirmEnabled && styles.addButtonDisabled,
                  ]}
                  onPress={handleConfirm}
                  disabled={!isConfirmEnabled}
                >
                  <Text
                    style={[
                      styles.addButtonText,
                      !isConfirmEnabled && styles.addButtonTextDisabled,
                    ]}
                  >
                    {isEditMode ? '수정하기' : '추가하기'}
                  </Text>
                </TouchableOpacity>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

      {/* 색상 선택 Bottom Sheet */}
      <ColorPickerBottomSheet
        visible={isColorPickerVisible}
        selectedColor={selectedColor}
        onClose={() => setIsColorPickerVisible(false)}
        onConfirm={handleColorPickerConfirm}
      />
    </>
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
    minHeight: '60%',
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
  backButton: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    ...typography.bodyLarge,
    fontWeight: fontWeight.semibold,
    color: colors.grayscale.gray900,
  },
  headerRight: {
    width: 32,
  },
  content: {
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.xl,
    flex: 1,
  },
  inputContainer: {
    marginBottom: spacing.xl,
  },
  inputLabel: {
    ...typography.bodyMedium,
    fontWeight: fontWeight.semibold,
    color: colors.grayscale.gray900,
    marginBottom: spacing.md,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.grayscale.white,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.grayscale.gray200,
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.sm,
    minHeight: 44,
  },
  textInput: {
    flex: 1,
    ...typography.bodyLarge,
    color: colors.grayscale.gray900,
    padding: 0,
  },
  charCounter: {
    ...typography.bodySmall,
    color: colors.grayscale.gray500,
    marginLeft: spacing.sm,
  },
  colorSelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.grayscale.white,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.grayscale.gray200,
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.sm,
    minHeight: 44,
  },
  colorSelectorLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  colorSelectorText: {
    ...typography.bodyLarge,
    color: colors.grayscale.gray900,
  },
  colorSelectorRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  colorPreview: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.grayscale.gray200,
  },
  addButton: {
    backgroundColor: colors.main.main,
    marginHorizontal: spacing.base,
    marginTop: spacing.md,
    marginBottom: Platform.OS === 'ios' ? spacing['2xl'] : spacing.xl,
    paddingVertical: spacing.base,
    borderRadius: spacing.base,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addButtonDisabled: {
    backgroundColor: colors.grayscale.gray300,
  },
  addButtonText: {
    ...typography.bodyLarge,
    fontWeight: fontWeight.semibold,
    color: colors.grayscale.white,
  },
  addButtonTextDisabled: {
    color: colors.grayscale.gray500,
  },
});
