import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { MainTabParamList } from '../types/navigation';
import { colors, spacing, typography, fontWeight } from '../src/constants';
import { useProfile } from '../contexts/ProfileContext';

type Props = NativeStackScreenProps<MainTabParamList, 'NicknameEdit'>;

const MAX_LENGTH = 10;

export default function NicknameEditScreen({ navigation }: Props) {
  const { nickname, updateNickname } = useProfile();
  const [value, setValue] = React.useState(nickname);

  const trimmedValue = value.trim();
  const isValid = trimmedValue.length > 0 && trimmedValue.length <= MAX_LENGTH;
  const isChanged = trimmedValue !== nickname;

  const handleSave = () => {
    if (!isValid || !isChanged) {
      return;
    }
    updateNickname(trimmedValue);
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={22} color={colors.grayscale.gray900} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>닉네임</Text>
        <View style={styles.headerRight} />
      </View>

      <View style={styles.content}>
        <View style={styles.inputWrapper}>
          <TextInput
            value={value}
            onChangeText={(text) => {
              if (text.length <= MAX_LENGTH) {
                setValue(text);
              }
            }}
            placeholder="닉네임을 입력하세요."
            placeholderTextColor={colors.grayscale.gray400}
            style={styles.input}
          />
          <Text style={styles.counter}>
            {value.length}/{MAX_LENGTH}
          </Text>
        </View>
      </View>

      <TouchableOpacity
        style={[styles.saveButton, (!isValid || !isChanged) && styles.saveButtonDisabled]}
        onPress={handleSave}
        disabled={!isValid || !isChanged}
      >
        <Text style={[styles.saveButtonText, (!isValid || !isChanged) && styles.saveTextDisabled]}>
          수정하기
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.grayscale.gray50,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.md,
    backgroundColor: colors.grayscale.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.grayscale.gray100,
  },
  backButton: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    ...typography.bodyLarge,
    fontWeight: fontWeight.semibold,
    color: colors.grayscale.gray900,
  },
  headerRight: {
    width: 32,
  },
  content: {
    paddingHorizontal: spacing.base,
    paddingTop: spacing.lg,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.grayscale.white,
    borderRadius: spacing.base,
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.sm,
    borderWidth: 1,
    borderColor: colors.grayscale.gray200,
  },
  input: {
    flex: 1,
    ...typography.bodyLarge,
    color: colors.grayscale.gray900,
    padding: 0,
  },
  counter: {
    ...typography.bodySmall,
    color: colors.grayscale.gray500,
    marginLeft: spacing.sm,
  },
  saveButton: {
    marginHorizontal: spacing.base,
    marginTop: 'auto',
    marginBottom: spacing.xl,
    paddingVertical: spacing.base,
    backgroundColor: colors.main.main,
    borderRadius: spacing.base,
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveButtonDisabled: {
    backgroundColor: colors.grayscale.gray300,
  },
  saveButtonText: {
    ...typography.bodyLarge,
    fontWeight: fontWeight.semibold,
    color: colors.grayscale.white,
  },
  saveTextDisabled: {
    color: colors.grayscale.gray500,
  },
});
