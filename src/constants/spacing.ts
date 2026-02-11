/**
 * 플래너리 디자인 시스템 - 공통 여백 단위
 * React Native StyleSheet에서 바로 사용 가능
 * 
 * 4px 기준 그리드 시스템 사용
 */

export const spacing = {
  // 기본 단위 (4px 기준)
  xs: 4,
  sm: 8,
  md: 12,
  base: 16,
  lg: 20,
  xl: 24,
  '2xl': 32,
  '3xl': 40,
  '4xl': 48,
  '5xl': 64,
} as const;

// 타입 안정성을 위한 타입 정의
export type Spacing = typeof spacing;

