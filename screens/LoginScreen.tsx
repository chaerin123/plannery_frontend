import React, { useCallback, useRef, useState } from 'react';
import {
  Animated,
  Image,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../types/navigation';
import AsyncStorage from '@react-native-async-storage/async-storage';
import PageIndicator from '../components/PageIndicator';
import SocialLoginButton from '../components/SocialLoginButton';
import TermsBottomSheet from '../components/TermsBottomSheet';

type Props = NativeStackScreenProps<AuthStackParamList, 'Login'>;

export default function LoginScreen({ navigation }: Props) {
  const { width } = useWindowDimensions();
  const scrollRef = useRef<ScrollView>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [termsVisible, setTermsVisible] = useState(false);
  const slideWidth = Math.max(width - 48, 0);

  const slides = [
    {
      titleLines: [
        <>내 꿈으로 향하는</>,
        <>
          <Text style={styles.titleHighlight}>밀도 있는</Text> 플랜 짜기 💪
        </>,
      ],
      content: (
        <Image
          source={require('../assets/Frame_1686560451.png')}
          resizeMode="contain"
          style={styles.heroImage}
          accessibilityLabel="온보딩 캐릭터 배경"
        />
      ),
    },
    {
      titleLines: [
        <>
          <Text style={styles.titleHighlight}>중요 계획</Text>
        </>,
        <>태그부터</>,
      ],
      content: (
        <View style={[styles.planCardList, { maxWidth: Math.min(slideWidth, 328) }]}>
          <Image
            source={require('../assets/Group 1437256850.png')}
            resizeMode="contain"
            style={styles.planCardImage}
            accessibilityLabel="중요 계획 태그 카드 1"
          />
          <Image
            source={require('../assets/Group 1437257004.png')}
            resizeMode="contain"
            style={styles.planCardImage}
            accessibilityLabel="중요 계획 태그 카드 2"
          />
          <Image
            source={require('../assets/Group 1437257005.png')}
            resizeMode="contain"
            style={styles.planCardImage}
            accessibilityLabel="중요 계획 태그 카드 3"
          />
        </View>
      ),
    },
    {
      titleLines: [
        <>
          <Text style={styles.titleHighlight}>일간, 주간, 월간</Text>
        </>,
        <>계획까지 한 번에</>,
      ],
      content: (
        <Image
          source={require('../assets/home_png1(DAY).png')}
          resizeMode="contain"
          style={styles.mockImage}
          accessibilityLabel="서비스 기능 설명 화면"
        />
      ),
    },
  ];

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
    const nextIndex = Math.round(event.nativeEvent.contentOffset.x / slideWidth);
    setCurrentIndex(nextIndex);
  };

  const handleDotPress = (index: number) => {
    scrollRef.current?.scrollTo({ x: slideWidth * index, animated: true });
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
      <View style={styles.wrapper}>
        <View style={styles.titleBlock}>
          {slides[currentIndex].titleLines.map((line, index) => (
            <Text key={`title-line-${index}`} style={[styles.titleText, index > 0 && styles.titleLineSpacing]}>
              {line}
            </Text>
          ))}
        </View>

        <View style={styles.character}>
          <Animated.ScrollView
            ref={scrollRef}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onMomentumScrollEnd={handleScrollEnd}
            contentContainerStyle={[styles.sliderContent, { width: slideWidth * slides.length }]}
          >
            {slides.map((slide, index) => (
              <View key={`slide-${index}`} style={[styles.slide, { width: slideWidth }]}>
                {slide.content}
              </View>
            ))}
          </Animated.ScrollView>
        </View>

        <View style={styles.indicator}>
          <PageIndicator total={slides.length} currentIndex={currentIndex} onDotPress={handleDotPress} />
        </View>

        <View style={styles.buttonBlock}>
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
  wrapper: {
    flex: 1,
    backgroundColor: '#F5F3FF',
    paddingHorizontal: 24,
  },
  sliderContent: {
    alignItems: 'center',
  },
  slide: {
    alignItems: 'center',
  },
  titleBlock: {
    paddingTop: 56,
  },
  titleText: {
    fontSize: 26,
    fontWeight: '700',
    textAlign: 'center',
    color: '#1F2937',
    lineHeight: 34,
    letterSpacing: -0.3,
  },
  titleLineSpacing: {
    marginTop: 2,
  },
  character: {
    marginTop: 54,
    alignItems: 'center',
  },
  heroImage: {
    width: '100%',
    height: 280,
  },
  planCardList: {
    width: '100%',
    alignSelf: 'center',
    gap: 4,
  },
  planCardImage: {
    width: '100%',
    height: 88,
  },
  mockImage: {
    width: '100%',
    height: 320,
  },
  titleHighlight: {
    color: '#8D8DF5',
  },
  indicator: {
    marginTop: 32,
  },
  buttonBlock: {
    marginTop: 24,
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

