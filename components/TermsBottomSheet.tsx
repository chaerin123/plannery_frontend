import React, { useEffect, useMemo, useState } from 'react';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { BlurView } from 'expo-blur';

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
          <View style={styles.handle} />
          <Text style={styles.title}>이용약관 동의</Text>

          <Pressable
            style={styles.row}
            onPress={() => toggleAll(!allAgree)}
            accessibilityRole="checkbox"
            accessibilityState={{ checked: allAgree }}
            accessibilityLabel="모두 동의"
          >
            <View style={[styles.checkbox, allAgree && styles.checkboxChecked]}>
              {allAgree && <Text style={styles.checkboxIcon}>✓</Text>}
            </View>
            <Text style={styles.itemText}>모두 동의</Text>
          </Pressable>

          <View style={styles.itemDivider} />

          <Pressable
            style={styles.row}
            onPress={() => setOver14((prev) => !prev)}
            accessibilityRole="checkbox"
            accessibilityState={{ checked: over14 }}
          >
            <View style={[styles.checkbox, over14 && styles.checkboxChecked]}>
              {over14 && <Text style={styles.checkboxIcon}>✓</Text>}
            </View>
            <Text style={styles.itemText}>(필수) 만 14세 이상입니다</Text>
          </Pressable>

          <Pressable
            style={styles.row}
            onPress={() => setPrivacy((prev) => !prev)}
            accessibilityRole="checkbox"
            accessibilityState={{ checked: privacy }}
          >
            <View style={[styles.checkbox, privacy && styles.checkboxChecked]}>
              {privacy && <Text style={styles.checkboxIcon}>✓</Text>}
            </View>
            <Text style={styles.itemText}>(필수) 개인정보보호방침 동의</Text>
          </Pressable>

          <Pressable
            style={styles.row}
            onPress={() => setTerms((prev) => !prev)}
            accessibilityRole="checkbox"
            accessibilityState={{ checked: terms }}
          >
            <View style={[styles.checkbox, terms && styles.checkboxChecked]}>
              {terms && <Text style={styles.checkboxIcon}>✓</Text>}
            </View>
            <Text style={styles.itemText}>(필수) 이용약관 동의</Text>
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
    paddingTop: 12,
    paddingBottom: 24,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
  },
  handle: {
    alignSelf: 'center',
    width: 42,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#E5E7EB',
    marginBottom: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    textAlign: 'center',
    marginBottom: 16,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
  },
  itemText: {
    fontSize: 15,
    fontWeight: '500',
    color: '#1F2937',
  },
  itemDivider: {
    height: 1,
    backgroundColor: '#F3F4F6',
    marginVertical: 12,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 6,
    borderWidth: 1.5,
    borderColor: '#D1D5DB',
    marginRight: 10,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxChecked: {
    backgroundColor: '#A78BFA',
    borderColor: '#A78BFA',
  },
  checkboxIcon: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  completeButton: {
    height: 52,
    borderRadius: 14,
    backgroundColor: '#A78BFA',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 18,
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
