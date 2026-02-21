/**
 * 플래너리 디자인 시스템 - 컬러 팔레트
 * React Native StyleSheet에서 바로 사용 가능
 */

export const colors = {
  // Grayscale
  grayscale: {
    white: '#FFFFFF',
    gray50: '#F9FAFB',
    gray100: '#F3F4F6',
    gray200: '#E5E7EB',
    gray300: '#D1D5DB',
    gray500: '#6B7280',
    gray600: '#4B5563',
    gray700: '#374151',
    gray900: '#111827',
  },

  // Main Color Palette
  main: {
    main: '#8D8DF5',
    main2: '#D8AEE3',
    sub1: '#E6E6FA',
    sub2: '#F0E8FF',
  },
} as const;

// 타입 안정성을 위한 타입 정의
export type Colors = typeof colors;

