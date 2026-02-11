import React from 'react';
import { Image, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../types/navigation';
import { useAuth } from '../contexts/AuthContext';

type Props = NativeStackScreenProps<AuthStackParamList, 'Signup'>;

export default function SignupScreen({ navigation }: Props) {
  const { login } = useAuth();

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Image
          source={require('../assets/planner_face_icon.png')}
          resizeMode="contain"
          style={styles.faceIcon}
          accessibilityLabel="캐릭터 얼굴"
        />
        <Text style={styles.title}>플랜님 반가워요!</Text>
        <Text style={styles.subtitle}>계획 달성, 현재 시작해볼까요?</Text>
      </View>
      <View style={styles.footer}>
        <TouchableOpacity style={styles.button} onPress={login} accessibilityRole="button">
          <Text style={styles.buttonText}>시작하기</Text>
        </TouchableOpacity>
        <Text style={styles.backText} onPress={() => navigation.navigate('Login')} accessibilityRole="button">
          돌아가기
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F5F3FF',
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  faceIcon: {
    width: 120,
    height: 120,
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1F2937',
    textAlign: 'center',
  },
  subtitle: {
    marginTop: 8,
    fontSize: 16,
    fontWeight: '500',
    color: '#6B7280',
    textAlign: 'center',
  },
  footer: {
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  button: {
    height: 52,
    borderRadius: 14,
    backgroundColor: '#A78BFA',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#111827',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 2,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  backText: {
    marginTop: 12,
    textAlign: 'center',
    fontSize: 14,
    color: '#6B7280',
    textDecorationLine: 'underline',
  },
});

