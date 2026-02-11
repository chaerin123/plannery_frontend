import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { colors, spacing, typography, fontWeight } from '../src/constants';
import { Time, to12HourFormat, to24HourFormat, generateHours, generateMinutes } from '../utils/timeFormatter';

export interface AlarmWheelPickerProps {
  value: Time | null;
  onChange: (time: Time) => void;
}

/**
 * 알람 시간 선택을 위한 iOS 스타일 wheel picker
 * 오전/오후, 시, 분을 선택할 수 있음
 */
export default function AlarmWheelPicker({
  value,
  onChange,
}: AlarmWheelPickerProps) {
  const hours = generateHours(); // 1-12
  const minutes = generateMinutes(); // 0, 5, 10, ..., 55

  // 초기값 설정
  const [period, setPeriod] = useState<'오전' | '오후'>('오전');
  const [selectedHour, setSelectedHour] = useState<number>(1);
  const [selectedMinute, setSelectedMinute] = useState<number>(0);

  const hourScrollRef = useRef<ScrollView>(null);
  const minuteScrollRef = useRef<ScrollView>(null);

  // value가 변경되면 내부 상태 업데이트
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

  // 스크롤 위치 업데이트
  useEffect(() => {
    const hourIndex = hours.indexOf(selectedHour);
    const minuteIndex = minutes.indexOf(selectedMinute);
    
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
  }, [selectedHour, selectedMinute, hours, minutes]);

  // 시간 업데이트
  const updateTime = (hour: number, minute: number, timePeriod: '오전' | '오후') => {
    const hour24 = to24HourFormat(hour, timePeriod);
    const newTime: Time = { hour: hour24, minute };
    onChange(newTime);
  };

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

  // Wheel Picker 컬럼 렌더링
  const renderPickerColumn = (
    items: number[],
    selectedValue: number,
    onValueChange: (value: number) => void,
    formatValue: (value: number) => string,
    scrollRef: React.RefObject<ScrollView | null>
  ) => {
    return (
      <View style={styles.pickerColumnWrapper}>
        {/* 중앙 선택 영역 강조 오버레이 */}
        <View style={styles.pickerSelectionOverlay} pointerEvents="none" />
        
        {/* 위쪽 그라데이션 (페이드 아웃) */}
        <View style={styles.fadeTop} pointerEvents="none" />
        
        {/* 아래쪽 그라데이션 (페이드 아웃) */}
        <View style={styles.fadeBottom} pointerEvents="none" />
        
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
          {items.map((item, index) => {
            const isSelected = item === selectedValue;
            const itemIndex = items.indexOf(item);
            const selectedIndex = items.indexOf(selectedValue);
            const distance = Math.abs(itemIndex - selectedIndex);
            
            // 중앙에서 멀어질수록 opacity 감소
            let opacity = 1;
            if (distance === 0) {
              opacity = 1;
            } else if (distance === 1) {
              opacity = 0.6;
            } else if (distance === 2) {
              opacity = 0.4;
            } else {
              opacity = 0.2;
            }

            return (
              <TouchableOpacity
                key={item}
                style={[styles.pickerItem, isSelected && styles.pickerItemSelected]}
                onPress={() => {
                  onValueChange(item);
                  scrollRef.current?.scrollTo({
                    y: itemIndex * 44,
                    animated: true,
                  });
                }}
              >
                <Text
                  style={[
                    styles.pickerItemText,
                    isSelected && styles.pickerItemTextSelected,
                    { opacity },
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
      <View style={styles.pickerContainer}>
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
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  pickerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.grayscale.gray50,
    borderRadius: 10,
    padding: spacing.base,
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
    position: 'relative',
  },
  timeSeparator: {
    ...typography.h2,
    color: colors.grayscale.gray900,
    marginHorizontal: spacing.xs,
    fontSize: 24,
  },
  pickerColumnWrapper: {
    flex: 1,
    position: 'relative',
    height: 200,
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
  fadeTop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 78,
    backgroundColor: colors.grayscale.white,
    zIndex: 2,
    pointerEvents: 'none',
    opacity: 0.95,
  },
  fadeBottom: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 78,
    backgroundColor: colors.grayscale.white,
    zIndex: 2,
    pointerEvents: 'none',
    opacity: 0.95,
  },
  pickerColumn: {
    flex: 1,
    zIndex: 0,
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
    backgroundColor: 'transparent', // 오버레이가 배경색을 제공
  },
  pickerItemText: {
    ...typography.bodyLarge,
    fontSize: 20,
    color: colors.grayscale.gray500,
  },
  pickerItemTextSelected: {
    color: colors.grayscale.gray900,
    fontWeight: fontWeight.semibold,
    fontSize: 22,
  },
});
