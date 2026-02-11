import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Platform,
  TextInput,
  FlatList,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, typography, fontWeight } from '../src/constants';

export interface IconPickerBottomSheetProps {
  visible: boolean;
  selectedIcon: string;
  onClose: () => void;
  onConfirm: (icon: string) => void;
}

// 이모티콘 목록 (카테고리별)
const EMOJI_CATEGORIES = {
  '인기': ['❤️', '🔥', '⭐', '💯', '✨', '🎉', '🎊', '🎈', '🎁', '🎂', '🍰', '🍕', '🍔', '🍟', '🍗', '🍖', '🍝', '🍜', '🍲', '🍱'],
  '감정': ['😀', '😃', '😄', '😁', '😆', '😅', '🤣', '😂', '🙂', '🙃', '😉', '😊', '😇', '🥰', '😍', '🤩', '😘', '😗', '😚', '😙'],
  '사람': ['👶', '👧', '🧒', '👦', '👩', '🧑', '👨', '👵', '🧓', '👴', '👮', '👷', '💂', '🕵️', '👩‍⚕️', '👨‍⚕️', '👩‍🌾', '👨‍🌾', '👩‍🍳', '👨‍🍳'],
  '동물': ['🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼', '🐨', '🐯', '🦁', '🐮', '🐷', '🐽', '🐸', '🐵', '🙈', '🙉', '🙊', '🐒'],
  '음식': ['🍎', '🍊', '🍋', '🍌', '🍉', '🍇', '🍓', '🍈', '🍒', '🍑', '🥭', '🍍', '🥥', '🥝', '🍅', '🍆', '🥑', '🥦', '🥬', '🥒'],
  '활동': ['⚽', '🏀', '🏈', '⚾', '🎾', '🏐', '🏉', '🎱', '🏓', '🏸', '🥅', '🏒', '🏑', '🏏', '🥊', '🥋', '🎽', '🛹', '🛷', '⛸️'],
  '여행': ['🚗', '🚕', '🚙', '🚌', '🚎', '🏎️', '🚓', '🚑', '🚒', '🚐', '🚚', '🚛', '🚜', '🛴', '🚲', '🛵', '🏍️', '🛺', '✈️', '🚀'],
  '물건': ['⌚', '📱', '💻', '⌨️', '🖥️', '🖨️', '🖱️', '🖲️', '🕹️', '🗜️', '💾', '💿', '📀', '📼', '📷', '📸', '📹', '🎥', '📽️', '🎞️'],
  '기호': ['❤️', '🧡', '💛', '💚', '💙', '💜', '🖤', '🤍', '🤎', '💔', '❣️', '💕', '💞', '💓', '💗', '💖', '💘', '💝', '💟', '☮️'],
  '학습': ['📚', '📖', '📗', '📘', '📙', '📕', '📓', '📔', '📒', '📃', '📜', '📄', '📑', '🔖', '🏷️', '💰', '💴', '💵', '💶', '💷'],
};

const ALL_EMOJIS = Object.values(EMOJI_CATEGORIES).flat();

/**
 * 아이콘 선택 Bottom Sheet
 * 이모티콘을 선택할 수 있는 UI 제공
 */
export default function IconPickerBottomSheet({
  visible,
  selectedIcon,
  onClose,
  onConfirm,
}: IconPickerBottomSheetProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [tempIcon, setTempIcon] = useState(selectedIcon);

  // 모달이 열릴 때 현재 아이콘으로 초기화
  React.useEffect(() => {
    if (visible) {
      setTempIcon(selectedIcon);
      setSearchQuery('');
    }
  }, [visible, selectedIcon]);

  const handleConfirm = () => {
    onConfirm(tempIcon);
    onClose();
  };

  // 검색 필터링
  const filteredEmojis = React.useMemo(() => {
    if (!searchQuery.trim()) {
      return ALL_EMOJIS;
    }
    // 이모티콘 검색은 간단하게 전체 목록에서 필터링
    // 실제로는 이모티콘 이름으로 검색하는 것이 좋지만, 여기서는 간단하게 처리
    return ALL_EMOJIS;
  }, [searchQuery]);

  // 이모티콘을 그리드로 렌더링 (10개씩 행으로)
  const renderEmojiGrid = () => {
    const rows = [];
    for (let i = 0; i < filteredEmojis.length; i += 10) {
      rows.push(filteredEmojis.slice(i, i + 10));
    }

    return (
      <ScrollView style={styles.emojiGridContainer} showsVerticalScrollIndicator={false}>
        {rows.map((row, rowIndex) => (
          <View key={rowIndex} style={styles.emojiRow}>
            {row.map((emoji, colIndex) => {
              const isSelected = tempIcon === emoji;
              return (
                <TouchableOpacity
                  key={colIndex}
                  style={[styles.emojiItem, isSelected && styles.emojiItemSelected]}
                  onPress={() => setTempIcon(emoji)}
                >
                  <Text style={styles.emojiText}>{emoji}</Text>
                </TouchableOpacity>
              );
            })}
            {/* 빈 공간 채우기 */}
            {row.length < 10 && (
              Array.from({ length: 10 - row.length }).map((_, idx) => (
                <View key={`empty-${idx}`} style={styles.emojiItem} />
              ))
            )}
          </View>
        ))}
      </ScrollView>
    );
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
                <Text style={styles.title}>꾸미기 아이콘 선택</Text>
                <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                  <Ionicons name="close" size={24} color={colors.grayscale.gray900} />
                </TouchableOpacity>
              </View>

              {/* 검색 바 */}
              <View style={styles.searchContainer}>
                <Ionicons name="search-outline" size={20} color={colors.grayscale.gray500} style={styles.searchIcon} />
                <TextInput
                  style={styles.searchInput}
                  placeholder="이모티콘 검색"
                  placeholderTextColor={colors.grayscale.gray500}
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                />
              </View>

              {/* 이모티콘 그리드 */}
              {renderEmojiGrid()}

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
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: spacing.base,
    marginVertical: spacing.md,
    backgroundColor: colors.grayscale.gray50,
    borderRadius: 10,
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.sm,
  },
  searchIcon: {
    marginRight: spacing.sm,
  },
  searchInput: {
    flex: 1,
    ...typography.bodyMedium,
    color: colors.grayscale.gray900,
    padding: 0,
  },
  emojiGridContainer: {
    flex: 1,
    paddingHorizontal: spacing.base,
    maxHeight: 400,
  },
  emojiRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
    width: '100%',
  },
  emojiItem: {
    width: '9%',
    aspectRatio: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    marginBottom: spacing.xs,
  },
  emojiItemSelected: {
    backgroundColor: colors.main.sub1,
    borderWidth: 2,
    borderColor: colors.main.main,
  },
  emojiText: {
    fontSize: 24,
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
