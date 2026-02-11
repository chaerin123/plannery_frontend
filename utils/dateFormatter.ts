/**
 * 날짜 포맷팅 유틸 함수
 */

const weekdays = ['일', '월', '화', '수', '목', '금', '토'];

/**
 * Day 모드: "2025.06.22 (화)" 형식
 */
export function formatDayDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const weekday = weekdays[date.getDay()];
  return `${year}.${month}.${day} (${weekday})`;
}

/**
 * Week 모드: "2025.06.22 (일) ~ 2025.06.28 (토)" 형식
 */
export function formatWeekDate(startDate: Date, endDate: Date): string {
  const formatDate = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const weekday = weekdays[date.getDay()];
    return `${year}.${month}.${day} (${weekday})`;
  };
  return `${formatDate(startDate)} ~ ${formatDate(endDate)}`;
}

/**
 * Month 모드: "2025년 6월" 형식
 */
export function formatMonthDate(date: Date): string {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  return `${year}년 ${month}월`;
}

/**
 * 주의 시작일(일요일) 계산
 */
export function getWeekStart(date: Date): Date {
  const day = date.getDay();
  const diff = date.getDate() - day;
  const weekStart = new Date(date);
  weekStart.setDate(diff);
  weekStart.setHours(0, 0, 0, 0);
  return weekStart;
}

/**
 * 주의 종료일(토요일) 계산
 */
export function getWeekEnd(date: Date): Date {
  const weekStart = getWeekStart(date);
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekStart.getDate() + 6);
  weekEnd.setHours(23, 59, 59, 999);
  return weekEnd;
}

/**
 * 월의 첫 날
 */
export function getMonthStart(date: Date): Date {
  const monthStart = new Date(date.getFullYear(), date.getMonth(), 1);
  monthStart.setHours(0, 0, 0, 0);
  return monthStart;
}

/**
 * 월의 마지막 날
 */
export function getMonthEnd(date: Date): Date {
  const monthEnd = new Date(date.getFullYear(), date.getMonth() + 1, 0);
  monthEnd.setHours(23, 59, 59, 999);
  return monthEnd;
}
