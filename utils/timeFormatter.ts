/**
 * 시간 포맷팅 유틸 함수
 */

export interface Time {
  hour: number; // 0-23 (24시간 형식)
  minute: number; // 0-59
}

/**
 * Time 객체를 "HH:MM" 형식 문자열로 변환
 */
export function formatTime(time: Time): string {
  const hour = String(time.hour).padStart(2, '0');
  const minute = String(time.minute).padStart(2, '0');
  return `${hour}:${minute}`;
}

/**
 * 시작 시간과 마감 시간을 "HH:MM ~ HH:MM" 형식으로 변환
 * 마감 시간이 없으면 "HH:MM"만 반환
 */
export function formatTimeRange(startTime: Time | null, endTime: Time | null): string {
  if (!startTime) return '없음';
  if (!endTime) return formatTime(startTime);
  return `${formatTime(startTime)} ~ ${formatTime(endTime)}`;
}

/**
 * 24시간 형식을 12시간 형식으로 변환 (오전/오후)
 */
export function to12HourFormat(hour24: number): { hour12: number; period: '오전' | '오후' } {
  if (hour24 === 0) {
    return { hour12: 12, period: '오전' };
  } else if (hour24 < 12) {
    return { hour12: hour24, period: '오전' };
  } else if (hour24 === 12) {
    return { hour12: 12, period: '오후' };
  } else {
    return { hour12: hour24 - 12, period: '오후' };
  }
}

/**
 * 12시간 형식을 24시간 형식으로 변환
 */
export function to24HourFormat(hour12: number, period: '오전' | '오후'): number {
  if (period === '오전') {
    return hour12 === 12 ? 0 : hour12;
  } else {
    return hour12 === 12 ? 12 : hour12 + 12;
  }
}

/**
 * 시간 배열 생성 (1-12)
 */
export function generateHours(): number[] {
  return Array.from({ length: 12 }, (_, i) => i + 1);
}

/**
 * 분 배열 생성 (0-59, 5분 간격)
 */
export function generateMinutes(): number[] {
  return Array.from({ length: 12 }, (_, i) => i * 5);
}
