import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { colors, spacing, typography, fontWeight } from '../src/constants';

const weekdays = ['일', '월', '화', '수', '목', '금', '토'];

export interface DayCalendarProps {
  selectedDate: Date;
  onDateSelect: (date: Date) => void;
}

export default function DayCalendar({
  selectedDate,
  onDateSelect,
}: DayCalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(
    new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1)
  );

  // 여러 달 렌더링 (현재 달, 이전 달, 다음 달)
  const monthsToShow = [-1, 0, 1]; // 이전 달, 현재 달, 다음 달

  const handlePrevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  const renderMonth = (monthOffset: number) => {
    const displayMonth = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth() + monthOffset,
      1
    );
    const year = displayMonth.getFullYear();
    const month = displayMonth.getMonth();

    // 월의 첫 날과 마지막 날
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const firstDayOfWeek = firstDay.getDay();

    // 캘린더 그리드 생성
    const days: (Date | null)[] = [];
    
    // 빈 칸 채우기
    for (let i = 0; i < firstDayOfWeek; i++) {
      days.push(null);
    }
    
    // 날짜 채우기
    for (let day = 1; day <= lastDay.getDate(); day++) {
      days.push(new Date(year, month, day));
    }

    return (
      <View key={`month-${year}-${month}`} style={styles.monthContainer}>
        {/* 월 헤더 */}
        <View style={styles.monthHeader}>
          <Text style={styles.monthText}>
            {year}년 {month + 1}월
          </Text>
        </View>

        {/* 요일 헤더 */}
        <View style={styles.weekdayHeader}>
          {weekdays.map((day) => (
            <View key={day} style={styles.weekdayCell}>
              <Text
                style={[
                  styles.weekdayText,
                  (day === '일' || day === '토') && styles.weekendText,
                ]}
              >
                {day}
              </Text>
            </View>
          ))}
        </View>

        {/* 캘린더 그리드 */}
        <View style={styles.calendarGrid}>
          {days.map((date, index) => {
            if (!date) {
              return <View key={`empty-${year}-${month}-${index}`} style={styles.dayCell} />;
            }

            const selected = isSelectedDate(date);
            const today = isToday(date);

            return (
              <TouchableOpacity
                key={date.toISOString()}
                style={[
                  styles.dayCell,
                  selected && styles.selectedDayCell,
                  today && !selected && styles.todayCell,
                ]}
                onPress={() => onDateSelect(date)}
              >
                <Text
                  style={[
                    styles.dayText,
                    selected && styles.selectedDayText,
                    today && !selected && styles.todayText,
                    (date.getDay() === 0 || date.getDay() === 6) &&
                      !selected &&
                      styles.weekendDayText,
                  ]}
                >
                  {date.getDate()}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    );
  };

  const isSelectedDate = (date: Date | null): boolean => {
    if (!date) return false;
    return (
      date.getFullYear() === selectedDate.getFullYear() &&
      date.getMonth() === selectedDate.getMonth() &&
      date.getDate() === selectedDate.getDate()
    );
  };

  const isToday = (date: Date | null): boolean => {
    if (!date) return false;
    const today = new Date();
    return (
      date.getFullYear() === today.getFullYear() &&
      date.getMonth() === today.getMonth() &&
      date.getDate() === today.getDate()
    );
  };

  return (
    <View style={styles.container}>
      {/* 월 네비게이션 */}
      <View style={styles.monthNavigation}>
        <TouchableOpacity onPress={handlePrevMonth} style={styles.navButton}>
          <Text style={styles.navButtonText}>‹</Text>
        </TouchableOpacity>
        <Text style={styles.monthText}>
          {currentMonth.getFullYear()}년 {currentMonth.getMonth() + 1}월
        </Text>
        <TouchableOpacity onPress={handleNextMonth} style={styles.navButton}>
          <Text style={styles.navButtonText}>›</Text>
        </TouchableOpacity>
      </View>

      {/* 여러 달 렌더링 */}
      {monthsToShow.map((offset) => renderMonth(offset))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: spacing.md,
  },
  monthNavigation: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.base,
  },
  monthContainer: {
    marginBottom: spacing.xl,
  },
  monthHeader: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.base,
  },
  navButton: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  navButtonText: {
    fontSize: 24,
    color: colors.grayscale.gray700,
  },
  monthText: {
    ...typography.bodyLarge,
    fontWeight: fontWeight.semibold,
    color: colors.grayscale.gray900,
  },
  weekdayHeader: {
    flexDirection: 'row',
    paddingVertical: spacing.sm,
  },
  weekdayCell: {
    flex: 1,
    alignItems: 'center',
  },
  weekdayText: {
    ...typography.bodySmall,
    color: colors.grayscale.gray500,
  },
  weekendText: {
    color: colors.grayscale.gray700,
  },
  calendarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  dayCell: {
    width: '14.28%',
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: spacing.xs,
  },
  selectedDayCell: {
    backgroundColor: colors.main.main,
    borderRadius: spacing.sm,
  },
  todayCell: {
    backgroundColor: colors.main.sub1,
    borderRadius: spacing.sm,
  },
  dayText: {
    ...typography.bodyMedium,
    color: colors.grayscale.gray900,
  },
  selectedDayText: {
    color: colors.grayscale.white,
    fontWeight: fontWeight.semibold,
  },
  todayText: {
    color: colors.main.main,
    fontWeight: fontWeight.semibold,
  },
  weekendDayText: {
    color: colors.grayscale.gray500,
  },
});
