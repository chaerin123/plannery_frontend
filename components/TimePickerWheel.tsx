import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { colors, spacing, typography, fontWeight } from '../src/constants';
import { Time, to12HourFormat, to24HourFormat, generateHours, generateMinutes } from '../utils/timeFormatter';

export interface TimePickerWheelProps {
  value: Time | null;
  onChange: (time: Time | null) => void;
  label: string;
  required?: boolean;
  minTime?: Time | null; // 최소 시간 제한 (마감 시간이 시작 시간보다 빠르지 않도록)
}

export default function TimePickerWheel({
  value,
  onChange,
  label,
  required = false,
  minTime = null,
}: TimePickerWheelProps) {
  const hours = generateHours();
  const minutes = generateMinutes();

  // 초기값 설정
  const [period, setPeriod] = useState<'오전' | '오후'>('오전');
  const [selectedHour, setSelectedHour] = useState<number>(1);
  const [selectedMinute, setSelectedMinute] = useState<number>(0);

  useEffect(() => {
    if (value) {
      const { hour12, period: timePeriod } = to12HourFormat(value.hour);
      setPeriod(timePeriod);
      setSelectedHour(hour12);
      setSelectedMinute(value.minute);
    } else {
      // 기본값
      setPeriod('오전');
      setSelectedHour(1);
      setSelectedMinute(0);
    }
  }, [value]);

  // 시간 업데이트 헬퍼 함수
  const updateTime = useCallback((hour: number, minute: number, timePeriod: '오전' | '오후') => {
    const hour24 = to24HourFormat(hour, timePeriod);
    const newTime: Time = { hour: hour24, minute };
    
    // 최소 시간 제한 체크
    if (minTime) {
      const newTimeMinutes = newTime.hour * 60 + newTime.minute;
      const minTimeMinutes = minTime.hour * 60 + minTime.minute;
      if (newTimeMinutes < minTimeMinutes) {
        // 최소 시간보다 빠르면 최소 시간으로 설정
        const { hour12, period } = to12HourFormat(minTime.hour);
        setPeriod(period);
        setSelectedHour(hour12);
        setSelectedMinute(minTime.minute);
        onChange(minTime);
        return;
      }
    }
    
    // 값이 실제로 변경되었을 때만 알림
    if (!value || value.hour !== newTime.hour || value.minute !== newTime.minute) {
      onChange(newTime);
    }
  }, [value, onChange, minTime]);

  const handlePeriodChange = (newPeriod: '오전' | '오후') => {
    setPeriod(newPeriod);
    updateTime(selectedHour, selectedMinute, newPeriod);
  };

  const handleHourChange = (hour: number) => {
    setSelectedHour(hour);
    updateTime(hour, selectedMinute, period);
  };

  const handleMinuteChange = (minute: number) => {
    setSelectedMinute(minute);
    updateTime(selectedHour, minute, period);
  };

  const hourScrollRef = useRef<ScrollView>(null);
  const minuteScrollRef = useRef<ScrollView>(null);

  // 초기 스크롤 위치 설정
  useEffect(() => {
    if (value) {
      const hourIndex = hours.indexOf(selectedHour);
      const minuteIndex = minutes.indexOf(selectedMinute);
      
      // 약간의 지연 후 스크롤 (렌더링 완료 후)
      setTimeout(() => {
        if (hourIndex !== -1 && hourScrollRef.current) {
          hourScrollRef.current.scrollTo({
            y: hourIndex * 44,
            animated: false,
          });
        }
        if (minuteIndex !== -1 && minuteScrollRef.current) {
          minuteScrollRef.current.scrollTo({
            y: minuteIndex * 44,
            animated: false,
          });
        }
      }, 100);
    }
  }, [value]); // value가 변경될 때만 실행

  const renderPickerColumn = (
    items: number[],
    selectedValue: number,
    onValueChange: (value: number) => void,
    formatValue: (value: number) => string,
    scrollRef: React.RefObject<ScrollView>
  ) => {
    return (
      <View style={styles.pickerColumnWrapper}>
        {/* 중앙 선택 영역 강조 */}
        <View style={styles.pickerSelectionOverlay} pointerEvents="none" />
        <ScrollView
          ref={scrollRef}
          style={styles.pickerColumn}
          contentContainerStyle={styles.pickerColumnContent}
          showsVerticalScrollIndicator={false}
          snapToInterval={44}
          decelerationRate="fast"
          onMomentumScrollEnd={(event) => {
            const y = event.nativeEvent.contentOffset.y;
            const index = Math.round(y / 44);
            if (index >= 0 && index < items.length) {
              onValueChange(items[index]);
            }
          }}
        >
          {items.map((item) => {
            const isSelected = item === selectedValue;
            return (
              <TouchableOpacity
                key={item}
                style={[styles.pickerItem, isSelected && styles.pickerItemSelected]}
                onPress={() => {
                  const index = items.indexOf(item);
                  onValueChange(item);
                  scrollRef.current?.scrollTo({
                    y: index * 44,
                    animated: true,
                  });
                }}
              >
                <Text
                  style={[
                    styles.pickerItemText,
                    isSelected && styles.pickerItemTextSelected,
                  ]}
                >
                  {formatValue(item)}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {label && (
        <View style={styles.labelContainer}>
          <Text style={styles.label}>
            {label}
            {required && <Text style={styles.requiredStar}> *</Text>}
          </Text>
        </View>
      )}

      <View style={styles.pickerContainer}>
        {/* 오전/오후 선택과 시/분 선택을 한 줄에 */}
        <View style={styles.timePickerRow}>
          {/* 오전/오후 선택 */}
          <View style={styles.periodContainer}>
            <TouchableOpacity
              style={[styles.periodButton, styles.periodButtonFirst, period === '오전' && styles.periodButtonActive]}
              onPress={() => handlePeriodChange('오전')}
            >
              <Text
                style={[
                  styles.periodText,
                  period === '오전' && styles.periodTextActive,
                ]}
              >
                오전
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.periodButton, period === '오후' && styles.periodButtonActive]}
              onPress={() => handlePeriodChange('오후')}
            >
              <Text
                style={[
                  styles.periodText,
                  period === '오후' && styles.periodTextActive,
                ]}
              >
                오후
              </Text>
            </TouchableOpacity>
          </View>

          {/* 시/분 선택 */}
          <View style={styles.wheelContainer}>
            {renderPickerColumn(
              hours,
              selectedHour,
              handleHourChange,
              (hour) => `${hour}`,
              hourScrollRef
            )}
            <Text style={styles.timeSeparator}>:</Text>
            {renderPickerColumn(
              minutes,
              selectedMinute,
              handleMinuteChange,
              (minute) => `${String(minute).padStart(2, '0')}`,
              minuteScrollRef
            )}
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.xl,
  },
  labelContainer: {
    marginBottom: spacing.md,
  },
  label: {
    ...typography.bodyMedium,
    fontWeight: fontWeight.semibold,
    color: colors.grayscale.gray900,
  },
  requiredStar: {
    color: colors.main.main,
  },
  pickerContainer: {
    backgroundColor: colors.grayscale.gray50,
    borderRadius: 10,
    padding: spacing.base,
  },
  timePickerRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  periodContainer: {
    flexDirection: 'column',
    backgroundColor: colors.grayscale.white,
    borderRadius: 8,
    padding: 4,
    minWidth: 80,
    marginRight: spacing.md,
  },
  periodButton: {
    flex: 1,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.sm,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 6,
    backgroundColor: 'transparent',
    minHeight: 40,
  },
  periodButtonFirst: {
    marginBottom: 4,
  },
  periodButtonActive: {
    backgroundColor: colors.grayscale.white,
    shadowColor: colors.grayscale.gray900,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  periodText: {
    ...typography.bodyMedium,
    color: colors.grayscale.gray700,
  },
  periodTextActive: {
    color: colors.grayscale.gray900,
    fontWeight: fontWeight.semibold,
  },
  wheelContainer: {
    flexDirection: 'row',
    flex: 1,
    height: 200,
    backgroundColor: colors.grayscale.white,
    borderRadius: 10,
    padding: spacing.sm,
    alignItems: 'center',
  },
  timeSeparator: {
    ...typography.headingLarge,
    color: colors.grayscale.gray900,
    marginHorizontal: spacing.xs,
  },
  pickerColumnWrapper: {
    flex: 1,
    position: 'relative',
  },
  pickerSelectionOverlay: {
    position: 'absolute',
    top: '50%',
    left: spacing.xs,
    right: spacing.xs,
    height: 44,
    marginTop: -22,
    backgroundColor: colors.main.sub1,
    borderRadius: 8,
    zIndex: 1,
    pointerEvents: 'none',
  },
  pickerColumn: {
    flex: 1,
  },
  pickerColumnContent: {
    paddingVertical: 78, // 중앙 정렬을 위한 패딩 (200 / 2 - 22)
    alignItems: 'center',
  },
  pickerItem: {
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pickerItemSelected: {
    backgroundColor: colors.main.sub1,
    borderRadius: 8,
  },
  pickerItemText: {
    ...typography.bodyLarge,
    color: colors.grayscale.gray500,
  },
  pickerItemTextSelected: {
    color: colors.grayscale.gray900,
    fontWeight: fontWeight.semibold,
  },
});
