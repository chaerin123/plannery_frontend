/**
 * 플래너리 디자인 시스템 - 타이포그래피
 * Pretendard 폰트 기준
 * React Native StyleSheet에서 바로 사용 가능
 */

export const typography = {
  // Heading Styles
  h1: {
    fontSize: 28,
    fontWeight: '700' as const, // Bold
    lineHeight: 36,
    fontFamily: 'Pretendard',
  },
  h2: {
    fontSize: 24,
    fontWeight: '600' as const, // Semibold
    lineHeight: 32,
    fontFamily: 'Pretendard',
  },
  h3: {
    fontSize: 20,
    fontWeight: '600' as const, // Semibold
    lineHeight: 28,
    fontFamily: 'Pretendard',
  },
  h4: {
    fontSize: 18,
    fontWeight: '600' as const, // Semibold
    lineHeight: 24,
    fontFamily: 'Pretendard',
  },

  // Body Styles
  bodyLarge: {
    fontSize: 16,
    fontWeight: '500' as const, // Medium
    lineHeight: 24,
    fontFamily: 'Pretendard',
  },
  bodyMedium: {
    fontSize: 14,
    fontWeight: '400' as const, // Regular
    lineHeight: 22,
    fontFamily: 'Pretendard',
  },
  bodySmall: {
    fontSize: 12,
    fontWeight: '400' as const, // Regular
    lineHeight: 20,
    fontFamily: 'Pretendard',
  },

  // Caption Style
  caption: {
    fontSize: 10,
    fontWeight: '400' as const, // Regular
    lineHeight: 14,
    fontFamily: 'Pretendard',
  },
} as const;

// 개별 속성으로도 접근 가능하도록 export
export const fontSize = {
  h1: 28,
  h2: 24,
  h3: 20,
  h4: 18,
  bodyLarge: 16,
  bodyMedium: 14,
  bodySmall: 12,
  caption: 10,
} as const;

export const lineHeight = {
  h1: 36,
  h2: 32,
  h3: 28,
  h4: 24,
  bodyLarge: 24,
  bodyMedium: 22,
  bodySmall: 20,
  caption: 14,
} as const;

export const fontWeight = {
  bold: '700' as const,
  semibold: '600' as const,
  medium: '500' as const,
  regular: '400' as const,
} as const;

// 타입 안정성을 위한 타입 정의
export type Typography = typeof typography;

