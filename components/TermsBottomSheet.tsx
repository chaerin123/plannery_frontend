import React, { useEffect, useMemo, useState } from 'react';
import { Image, Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { BlurView } from 'expo-blur';
import { colors } from '../src/constants';

interface TermsBottomSheetProps {
  visible: boolean;
  onClose: () => void;
  onComplete: () => void;
}

export default function TermsBottomSheet({ visible, onClose, onComplete }: TermsBottomSheetProps) {
  const [allAgree, setAllAgree] = useState(false);
  const [over14, setOver14] = useState(false);
  const [privacy, setPrivacy] = useState(false);
  const [terms, setTerms] = useState(false);

  const requiredChecked = useMemo(() => over14 && privacy && terms, [over14, privacy, terms]);

  useEffect(() => {
    setAllAgree(requiredChecked);
  }, [requiredChecked]);

  useEffect(() => {
    if (!visible) {
      setAllAgree(false);
      setOver14(false);
      setPrivacy(false);
      setTerms(false);
    }
  }, [visible]);

  const toggleAll = (value: boolean) => {
    setAllAgree(value);
    setOver14(value);
    setPrivacy(value);
    setTerms(value);
  };

  const handleComplete = () => {
    if (!requiredChecked) return;
    onComplete();
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <BlurView intensity={18} tint="dark" style={StyleSheet.absoluteFill} />
        <Pressable
          style={StyleSheet.absoluteFill}
          accessibilityRole="button"
          accessibilityLabel="약관 닫기"
          onPress={onClose}
        />
        <Pressable style={styles.sheet} onPress={() => undefined}>
          <Text style={styles.title}>서비스 이용약관</Text>

          <Pressable
            style={[styles.allAgreeRow, allAgree && styles.allAgreeRowChecked]}
            onPress={() => toggleAll(!allAgree)}
            accessibilityRole="checkbox"
            accessibilityState={{ checked: allAgree }}
            accessibilityLabel="모두 동의"
          >
            <Text style={[styles.allAgreeText, allAgree && styles.allAgreeTextChecked]}>
              모두 동의
            </Text>
            <Image
              source={
                allAgree
                  ? require('../assets/체크박스Group 1437256896.png')
                  : require('../assets/체크박스Group 1437256897.png')
              }
              style={styles.allAgreeCheck}
              resizeMode="contain"
            />
          </Pressable>

          <Pressable
            style={styles.itemRow}
            onPress={() => setOver14((prev) => !prev)}
            accessibilityRole="checkbox"
            accessibilityState={{ checked: over14 }}
          >
            <Image
              source={
                over14
                  ? require('../assets/체크박스Group 1437256896.png')
                  : require('../assets/체크박스Group 1437256897.png')
              }
              style={styles.itemCheck}
              resizeMode="contain"
            />
            <Text style={styles.itemText}>(필수) 만 14세 이상입니다.</Text>
          </Pressable>

          <Pressable
            style={styles.itemRow}
            onPress={() => setPrivacy((prev) => !prev)}
            accessibilityRole="checkbox"
            accessibilityState={{ checked: privacy }}
          >
            <Image
              source={
                privacy
                  ? require('../assets/체크박스Group 1437256896.png')
                  : require('../assets/체크박스Group 1437256897.png')
              }
              style={styles.itemCheck}
              resizeMode="contain"
            />
            <Text style={styles.itemText}>(필수) 개인정보보호방침 동의</Text>
            <Pressable style={styles.viewButton} onPress={() => undefined}>
              <Text style={styles.viewButtonText}>보기</Text>
            </Pressable>
          </Pressable>

          <Pressable
            style={styles.itemRow}
            onPress={() => setTerms((prev) => !prev)}
            accessibilityRole="checkbox"
            accessibilityState={{ checked: terms }}
          >
            <Image
              source={
                terms
                  ? require('../assets/체크박스Group 1437256896.png')
                  : require('../assets/체크박스Group 1437256897.png')
              }
              style={styles.itemCheck}
              resizeMode="contain"
            />
            <Text style={styles.itemText}>(필수) 이용약관 동의</Text>
            <Pressable style={styles.viewButton} onPress={() => undefined}>
              <Text style={styles.viewButtonText}>보기</Text>
            </Pressable>
          </Pressable>

          <Pressable
            style={[styles.completeButton, !requiredChecked && styles.completeButtonDisabled]}
            accessibilityRole="button"
            accessibilityState={{ disabled: !requiredChecked }}
            onPress={handleComplete}
          >
            <Text style={styles.completeButtonText}>완료</Text>
          </Pressable>
        </Pressable>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(17, 24, 39, 0.35)',
  },
  sheet: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 24,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 16,
  },
  allAgreeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginBottom: 14,
  },
  allAgreeRowChecked: {
    borderColor: colors.main.main,
  },
  allAgreeText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#9CA3AF',
  },
  allAgreeTextChecked: {
    color: colors.main.main,
  },
  allAgreeCheck: {
    width: 22,
    height: 22,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  itemCheck: {
    width: 18,
    height: 18,
    marginRight: 10,
  },
  itemText: {
    fontSize: 15,
    fontWeight: '500',
    color: '#1F2937',
    flex: 1,
  },
  viewButton: {
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  viewButtonText: {
    fontSize: 13,
    color: colors.main.main,
    fontWeight: '600',
  },
  completeButton: {
    height: 52,
    borderRadius: 14,
    backgroundColor: colors.main.main,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  completeButtonDisabled: {
    backgroundColor: '#D1D5DB',
  },
  completeButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
