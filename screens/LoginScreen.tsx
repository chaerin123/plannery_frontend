import React, { useCallback, useRef, useState } from 'react';
import {
  Animated,
  Image,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../types/navigation';
import AsyncStorage from '@react-native-async-storage/async-storage';
import OnboardingSlide from '../components/OnboardingSlide';
import PageIndicator from '../components/PageIndicator';
import SocialLoginButton from '../components/SocialLoginButton';
import TagCard from '../components/TagCard';
import TermsBottomSheet from '../components/TermsBottomSheet';

type Props = NativeStackScreenProps<AuthStackParamList, 'Login'>;

export default function LoginScreen({ navigation }: Props) {
  const { width } = useWindowDimensions();
  const scrollRef = useRef<Animated.ScrollView>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [termsVisible, setTermsVisible] = useState(false);

  const saveOnboardingComplete = useCallback(async () => {
    try {
      if (Platform.OS === 'web' && typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.setItem('onboardingComplete', 'true');
        return;
      }
      await AsyncStorage.setItem('onboardingComplete', 'true');
    } catch (error) {
      console.warn('온보딩 완료 상태 저장 실패', error);
    }
  }, []);

  const handleScrollEnd = (event: { nativeEvent: { contentOffset: { x: number } } }) => {
    const nextIndex = Math.round(event.nativeEvent.contentOffset.x / width);
    setCurrentIndex(nextIndex);
  };

  const handleDotPress = (index: number) => {
    scrollRef.current?.scrollTo({ x: width * index, animated: true });
    setCurrentIndex(index);
  };

  const openTerms = () => setTermsVisible(true);
  const closeTerms = () => setTermsVisible(false);

  const handleTermsComplete = async () => {
    await saveOnboardingComplete();
    setTermsVisible(false);
    navigation.navigate('Signup');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Animated.ScrollView
          ref={scrollRef}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onMomentumScrollEnd={handleScrollEnd}
          contentContainerStyle={[styles.sliderContent, { width: width * 3 }]}
        >
          <View style={[styles.slide, { width }]}>
            <OnboardingSlide title={'내 꿈으로 향하는\n밀도 있는 플랜 짜기 💪'}>
              <Image
                source={require('../assets/Frame_1686560451.png')}
                resizeMode="contain"
                style={styles.heroImage}
                accessibilityLabel="온보딩 캐릭터 배경"
              />
            </OnboardingSlide>
          </View>

          <View style={[styles.slide, { width }]}>
            <OnboardingSlide title={'중요 계획\n태그부터'}>
              <View style={styles.cardStack}>
                <View style={styles.cardListContainer}>
                  <View style={styles.cardList}>
                    <TagCard
                      imageSource={require('../assets/Group 1437256850.png')}
                      accessibilityLabel="중요 계획 카드 1"
                      variant="flat"
                    />
                    <TagCard
                      imageSource={require('../assets/Group 1437257004.png')}
                      accessibilityLabel="중요 계획 카드 2"
                      variant="flat"
                    />
                    <TagCard
                      imageSource={require('../assets/Group 1437257005.png')}
                      accessibilityLabel="중요 계획 카드 3"
                      variant="flat"
                    />
                  </View>
                </View>
              </View>
            </OnboardingSlide>
          </View>

          <View style={[styles.slide, { width }]}>
            <OnboardingSlide title={'일간, 주간, 월간\n계획까지 한 번에'}>
              <Image
                source={require('../assets/home_png1(DAY).png')}
                resizeMode="contain"
                style={styles.mockImage}
                accessibilityLabel="서비스 기능 설명 화면"
              />
            </OnboardingSlide>
          </View>
        </Animated.ScrollView>

        <PageIndicator total={3} currentIndex={currentIndex} onDotPress={handleDotPress} />

        <View style={styles.loginArea}>
          <SocialLoginButton
            label="카카오로 시작하기"
            backgroundColor="#FEE500"
            textColor="#111827"
            onPress={openTerms}
          />
          <SocialLoginButton
            label="Apple로 시작하기"
            backgroundColor="#000000"
            textColor="#FFFFFF"
            onPress={openTerms}
          />
          <Text style={styles.textButton} onPress={openTerms} accessibilityRole="button">
            다른 방법으로 시작하기
          </Text>
        </View>
      </View>

      <TermsBottomSheet
        visible={termsVisible}
        onClose={closeTerms}
        onComplete={handleTermsComplete}
      />
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
    backgroundColor: '#F5F3FF',
  },
  sliderContent: {
    alignItems: 'stretch',
  },
  slide: {
    flex: 1,
    paddingHorizontal: 12,
  },
  heroImage: {
    width: '100%',
    height: 280,
  },
  cardStack: {
    width: '100%',
    alignItems: 'center',
  },
  cardListContainer: {
    width: '100%',
    maxWidth: 328,
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 14,
    shadowColor: '#111827',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.08,
    shadowRadius: 18,
    elevation: 3,
  },
  cardList: {
    width: '100%',
    gap: 10,
  },
  mockImage: {
    width: '100%',
    height: 320,
  },
  loginArea: {
    paddingHorizontal: 24,
    paddingBottom: 18,
  },
  textButton: {
    marginTop: 8,
    textAlign: 'center',
    fontSize: 15,
    color: '#6B7280',
    textDecorationLine: 'underline',
    fontWeight: '600',
  },
});

