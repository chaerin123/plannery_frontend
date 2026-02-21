import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  Image,
  Modal,
  TouchableWithoutFeedback,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { MainTabParamList } from '../types/navigation';
import { colors, spacing, typography, fontWeight } from '../src/constants';
import { PlanType, usePlan } from '../contexts/PlanContext';
import DatePickerBottomSheet, {
  ViewMode as DatePickerViewMode,
} from '../components/DatePickerBottomSheet';
import TimePickerBottomSheet from '../components/TimePickerBottomSheet';
import RepeatSettingBottomSheet from '../components/RepeatSettingBottomSheet';
import { RepeatOption } from '../components/RepeatOptionButtons';
import InfoBottomSheet from '../components/InfoBottomSheet';
import DayCalendar from '../components/DayCalendar';
import WeekCalendar from '../components/WeekCalendar';
import MonthPicker from '../components/MonthPicker';
import {
  formatDayDate,
  formatWeekDate,
  formatMonthDate,
} from '../utils/dateFormatter';
import { Time, formatTimeRange } from '../utils/timeFormatter';
import ColorPickerBottomSheet from '../components/ColorPickerBottomSheet';
import IconPickerBottomSheet from '../components/IconPickerBottomSheet';
import { Group, GROUP_COLORS } from '../types/group';

const MAX_GROUP_NAME_LENGTH = 10;

type Props = NativeStackScreenProps<MainTabParamList, 'PlanCreate'>;

type ViewMode = 'Day' | 'Week' | 'Month';

const viewModeToPlanType = (mode: ViewMode): PlanType => {
  return mode === 'Day' ? 'DAY' : mode === 'Week' ? 'WEEK' : 'MONTH';
};

const planTypeToViewMode = (type: PlanType): ViewMode => {
  return type === 'DAY' ? 'Day' : type === 'WEEK' ? 'Week' : 'Month';
};

export default function PlanCreateScreen({ navigation, route }: Props) {
  // route params에서 선택된 그룹 ID 가져오기
  const routeParams = route.params as
    | { selectedGroupId?: string | null; planId?: string }
    | undefined;
  const routeSelectedGroupId = routeParams?.selectedGroupId;
  const routePlanId = routeParams?.planId;

  // 상태값
  const [viewMode, setViewMode] = useState<ViewMode>('Day');
  const [planTitle, setPlanTitle] = useState('');
  const [isImportant, setIsImportant] = useState(false);
  const { addPlan, updatePlan, plans, groups, addGroup, updateGroup, deleteGroup } = usePlan();
  const editingPlan = routePlanId ? plans.find((plan) => plan.id === routePlanId) : null;
  
  // 날짜 상태
  const [dayDate, setDayDate] = useState<Date>(new Date());
  
  // Week: 선택한 날짜부터 7일
  const initialWeekDate = new Date();
  const [weekStartDate, setWeekStartDate] = useState<Date>(() => {
    const start = new Date(initialWeekDate);
    start.setHours(0, 0, 0, 0);
    return start;
  });
  const [weekEndDate, setWeekEndDate] = useState<Date>(() => {
    const end = new Date(initialWeekDate);
    end.setDate(end.getDate() + 6);
    end.setHours(23, 59, 59, 999);
    return end;
  });
  
  const [monthDate, setMonthDate] = useState<Date>(
    new Date(new Date().getFullYear(), new Date().getMonth(), 1)
  );

  // 시간 상태
  const [startTime, setStartTime] = useState<Time | null>(null);
  const [endTime, setEndTime] = useState<Time | null>(null);

  // 반복 설정 상태
  const [repeatOption, setRepeatOption] = useState<RepeatOption | null>(null);
  const [repeatDays, setRepeatDays] = useState<number[]>([]);

  // Bottom Sheet 상태
  const [isDatePickerVisible, setIsDatePickerVisible] = useState(false);
  const [isTimePickerVisible, setIsTimePickerVisible] = useState(false);
  const [isRepeatPickerVisible, setIsRepeatPickerVisible] = useState(false);
  const [isCategoryInfoVisible, setIsCategoryInfoVisible] = useState(false);
  const [isImportanceInfoVisible, setIsImportanceInfoVisible] = useState(false);
  const [isGroupInfoVisible, setIsGroupInfoVisible] = useState(false);
  const [isGroupSheetVisible, setIsGroupSheetVisible] = useState(false);
  const [tempSelectedGroupId, setTempSelectedGroupId] = useState<string | null>(null);
  const [isGroupEditMode, setIsGroupEditMode] = useState(false);
  const [groupSheetView, setGroupSheetView] = useState<'list' | 'create' | 'color'>('list');
  const [draftGroupId, setDraftGroupId] = useState<string | null>(null);
  const [draftGroupName, setDraftGroupName] = useState('');
  const [draftGroupColor, setDraftGroupColor] = useState<string>(colors.main.main);
  const [colorPickerTemp, setColorPickerTemp] = useState<string>(colors.main.main);
  const [deleteTargetGroup, setDeleteTargetGroup] = useState<Group | null>(null);
  const [isDeleteGroupModalVisible, setIsDeleteGroupModalVisible] = useState(false);

  // 날짜 표시 텍스트
  const getDateDisplayText = (): string => {
    switch (viewMode) {
      case 'Day':
        return formatDayDate(dayDate);
      case 'Week':
        return formatWeekDate(weekStartDate, weekEndDate);
      case 'Month':
        return formatMonthDate(monthDate);
      default:
        return '';
    }
  };

  // viewMode 변경 시 날짜 초기화
  useEffect(() => {
    if (editingPlan) {
      return;
    }
    const today = new Date();
    if (viewMode === 'Day') {
      setDayDate(today);
    } else if (viewMode === 'Week') {
      // 선택한 날짜부터 7일
      const start = new Date(today);
      start.setHours(0, 0, 0, 0);
      const end = new Date(start);
      end.setDate(start.getDate() + 6);
      end.setHours(23, 59, 59, 999);
      setWeekStartDate(start);
      setWeekEndDate(end);
    } else if (viewMode === 'Month') {
      setMonthDate(new Date(today.getFullYear(), today.getMonth(), 1));
    }
  }, [viewMode, editingPlan]);

  const handleDatePress = () => {
    setIsDatePickerVisible(true);
  };

  const handleDatePickerClose = () => {
    setIsDatePickerVisible(false);
  };

  const handleDatePickerConfirm = () => {
    setIsDatePickerVisible(false);
  };

  const handleDaySelect = (date: Date) => {
    setDayDate(date);
  };

  const handleWeekSelect = (startDate: Date, endDate: Date) => {
    setWeekStartDate(startDate);
    setWeekEndDate(endDate);
  };

  const handleMonthSelect = (date: Date) => {
    setMonthDate(date);
  };

  const getDatePickerTitle = (): string => {
    switch (viewMode) {
      case 'Day':
        return '날짜를 선택해주세요.';
      case 'Week':
        return '날짜를 선택해주세요.';
      case 'Month':
        return '달을 선택해주세요.';
      default:
        return '날짜를 선택해주세요.';
    }
  };

  // 그룹 상태
  const [selectedGroupId, setSelectedGroupId] = React.useState<string | null>(
    routeSelectedGroupId ?? null
  );

  // route params가 변경되면 선택된 그룹 업데이트
  React.useEffect(() => {
    if (routeSelectedGroupId !== undefined) {
      setSelectedGroupId(routeSelectedGroupId);
    }
  }, [routeSelectedGroupId]);

  React.useEffect(() => {
    if (!editingPlan) {
      return;
    }

    setPlanTitle(editingPlan.title);
    setIsImportant(editingPlan.isImportant);
    setSelectedColor(editingPlan.colorBar);
    setSelectedGroupId(editingPlan.groupId ?? null);
    setViewMode(planTypeToViewMode(editingPlan.type));

    const [year, month, day] = editingPlan.date.split('-').map(Number);
    const baseDate = new Date(year, month - 1, day);
    setDayDate(baseDate);
    const weekStart = new Date(baseDate);
    weekStart.setHours(0, 0, 0, 0);
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 6);
    weekEnd.setHours(23, 59, 59, 999);
    setWeekStartDate(weekStart);
    setWeekEndDate(weekEnd);
    setMonthDate(new Date(baseDate.getFullYear(), baseDate.getMonth(), 1));

    const timeMatches = editingPlan.time.match(/(\d{2}):(\d{2})/g);
    if (timeMatches && timeMatches.length > 0) {
      const [startHour, startMinute] = timeMatches[0].split(':').map(Number);
      setStartTime({ hour: startHour, minute: startMinute });
      if (timeMatches.length > 1) {
        const [endHour, endMinute] = timeMatches[1].split(':').map(Number);
        setEndTime({ hour: endHour, minute: endMinute });
      } else {
        setEndTime(null);
      }
    } else {
      setStartTime(null);
      setEndTime(null);
    }
  }, [editingPlan]);

  // 꾸미기 상태
  const [selectedColor, setSelectedColor] = React.useState<string>(GROUP_COLORS[5]); // 기본 색상: 보라색
  const [selectedIcon, setSelectedIcon] = React.useState<string>('📚');
  const [isColorPickerVisible, setIsColorPickerVisible] = React.useState(false);
  const [isIconPickerVisible, setIsIconPickerVisible] = React.useState(false);

  // 시간 표시 텍스트
  const getTimeDisplayText = (): string => {
    return formatTimeRange(startTime, endTime);
  };

  const handleTimeSettingPress = () => {
    setIsTimePickerVisible(true);
  };

  const handleTimePickerClose = () => {
    setIsTimePickerVisible(false);
  };

  const handleTimePickerConfirm = (newStartTime: Time | null, newEndTime: Time | null) => {
    setStartTime(newStartTime);
    setEndTime(newEndTime);
  };

  const handleRepeatPress = () => {
    setIsRepeatPickerVisible(true);
  };

  const handleRepeatPickerClose = () => {
    setIsRepeatPickerVisible(false);
  };

  const handleRepeatPickerConfirm = (option: RepeatOption | null, days: number[]) => {
    setRepeatOption(option);
    setRepeatDays(days);
  };

  // 반복 표시 텍스트 생성
  const getRepeatDisplayText = (): string => {
    if (!repeatOption) {
      return '없음';
    }

    switch (repeatOption) {
      case '없음':
        return '없음';
      case '매일':
        return '매일';
      case '주중':
        return '주중';
      case '주말':
        return '주말';
      case '직접 선택':
        if (repeatDays.length === 0) {
          return '없음';
        }
        const weekdayNames = ['월', '화', '수', '목', '금', '토', '일'];
        const selectedDayNames = repeatDays
          .sort((a, b) => a - b)
          .map((dayIndex) => weekdayNames[dayIndex]);
        return selectedDayNames.join(', ');
      default:
        return '없음';
    }
  };

  const closeGroupSheet = () => {
    setIsGroupSheetVisible(false);
    setIsGroupEditMode(false);
    setGroupSheetView('list');
    setDraftGroupId(null);
  };

  const handleGroupPress = () => {
    setTempSelectedGroupId(selectedGroupId);
    setIsGroupEditMode(false);
    setGroupSheetView('list');
    setIsGroupSheetVisible(true);
  };

  const handleGroupSelect = (groupId: string | null) => {
    setSelectedGroupId(groupId);
  };

  const startGroupCreate = (group?: Group) => {
    setDraftGroupId(group?.id ?? null);
    setDraftGroupName(group?.name ?? '');
    setDraftGroupColor(group?.color ?? colors.main.main);
    setGroupSheetView('create');
  };

  const openColorPicker = () => {
    setColorPickerTemp(draftGroupColor);
    setGroupSheetView('color');
  };

  const handleGroupSave = () => {
    const trimmed = draftGroupName.trim();
    if (!trimmed) return;
    if (draftGroupId) {
      updateGroup(draftGroupId, trimmed, draftGroupColor);
    } else {
      addGroup(trimmed, draftGroupColor);
    }
    setGroupSheetView('list');
    setDraftGroupId(null);
  };

  const handleGroupDelete = (groupId: string) => {
    const target = groups.find((group) => group.id === groupId);
    if (!target) return;
    setDeleteTargetGroup(target);
    setIsDeleteGroupModalVisible(true);
  };

  const handleConfirmDeleteGroup = () => {
    if (!deleteTargetGroup) return;
    const groupId = deleteTargetGroup.id;
    deleteGroup(groupId);
    setSelectedGroupId((prev) => (prev === groupId ? null : prev));
    setTempSelectedGroupId((prev) => (prev === groupId ? null : prev));
    setDraftGroupId((prev) => (prev === groupId ? null : prev));
    if (groups.length <= 1) {
      setIsGroupEditMode(false);
    }
    setIsDeleteGroupModalVisible(false);
    setDeleteTargetGroup(null);
  };

  const handleCancelDeleteGroup = () => {
    setIsDeleteGroupModalVisible(false);
    setDeleteTargetGroup(null);
  };
  const handleGroupSheetConfirm = () => {
    if (isGroupEditMode) {
      return;
    }
    handleGroupSelect(tempSelectedGroupId ?? null);
    closeGroupSheet();
  };

  // 그룹 표시 텍스트
  const getGroupDisplayText = (): string => {
    if (!selectedGroupId) {
      return '없음';
    }
    const selectedGroup = groups.find((g) => g.id === selectedGroupId);
    return selectedGroup ? selectedGroup.name : '없음';
  };

  const handleColorPress = () => {
    setIsColorPickerVisible(true);
  };

  const handleIconPress = () => {
    setIsIconPickerVisible(true);
  };

  const handleColorConfirm = (color: string) => {
    setSelectedColor(color);
    setIsColorPickerVisible(false);
  };

  const handleIconConfirm = (icon: string) => {
    setSelectedIcon(icon);
    setIsIconPickerVisible(false);
  };

  const handleAddPress = () => {
    if (planTitle.trim().length === 0) {
      return;
    }

    const selectedDate =
      viewMode === 'Day'
        ? dayDate
        : viewMode === 'Week'
        ? weekStartDate
        : monthDate;

    const dateKey = `${selectedDate.getFullYear()}-${String(
      selectedDate.getMonth() + 1
    ).padStart(2, '0')}-${String(selectedDate.getDate()).padStart(2, '0')}`;

    const planPayload = {
      title: planTitle.trim(),
      time: getTimeDisplayText(),
      status: editingPlan?.status ?? 'TODO',
      colorBar: selectedColor,
      type: viewModeToPlanType(viewMode),
      date: dateKey,
      groupId: selectedGroupId,
      isImportant,
    };

    if (editingPlan) {
      updatePlan(editingPlan.id, planPayload);
    } else {
      addPlan(planPayload);
    }

    navigation.navigate('Home', {
      selectedDate: dateKey,
      viewMode,
      selectedGroupId,
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {/* 분류 설정 */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>분류 설정</Text>
          <TouchableOpacity
            onPress={() => setIsCategoryInfoVisible(true)}
            style={styles.infoButton}
          >
            <Ionicons name="help-circle-outline" size={20} color={colors.grayscale.gray500} />
          </TouchableOpacity>
        </View>
        
        {/* 상단 탭: Day / Week / Month - iOS Segmented Control 스타일 */}
        <View style={styles.tabContainer}>
          {(['Day', 'Week', 'Month'] as ViewMode[]).map((mode) => (
            <TouchableOpacity
              key={mode}
              style={[styles.tab, viewMode === mode && styles.tabActive]}
              onPress={() => setViewMode(mode)}
            >
              <Text
                style={[
                  styles.tabText,
                  viewMode === mode && styles.tabTextActive,
                ]}
              >
                {mode}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* 날짜 선택 그룹 */}
        <View style={styles.fieldGroup}>
          <TouchableOpacity style={[styles.fieldContainer, styles.fieldFirst]} onPress={handleDatePress}>
            <View style={styles.fieldLeft}>
              <View style={styles.iconContainer}>
                <Ionicons name="calendar-outline" size={20} color={colors.grayscale.gray700} />
              </View>
              <Text style={styles.fieldLabel}>날짜</Text>
            </View>
            <View style={styles.fieldRight}>
              <Text style={styles.fieldValue}>{getDateDisplayText()}</Text>
              <Ionicons name="chevron-forward" size={20} color={colors.grayscale.gray300} />
            </View>
          </TouchableOpacity>
        </View>

        {/* 날짜 선택 Bottom Sheet */}
        <DatePickerBottomSheet
          visible={isDatePickerVisible}
          viewMode={viewMode as DatePickerViewMode}
          onClose={handleDatePickerClose}
          onConfirm={handleDatePickerConfirm}
          title={getDatePickerTitle()}
        >
          {viewMode === 'Day' && (
            <DayCalendar selectedDate={dayDate} onDateSelect={handleDaySelect} />
          )}
          {viewMode === 'Week' && (
            <WeekCalendar
              selectedStartDate={weekStartDate}
              selectedEndDate={weekEndDate}
              onWeekSelect={handleWeekSelect}
            />
          )}
          {viewMode === 'Month' && (
            <MonthPicker selectedDate={monthDate} onMonthSelect={handleMonthSelect} />
          )}
        </DatePickerBottomSheet>

        {/* 시간 설정 Bottom Sheet */}
        <TimePickerBottomSheet
          visible={isTimePickerVisible}
          startTime={startTime}
          endTime={endTime}
          onClose={handleTimePickerClose}
          onConfirm={handleTimePickerConfirm}
        />

        {/* 반복 설정 Bottom Sheet */}
        <RepeatSettingBottomSheet
          visible={isRepeatPickerVisible}
          selectedOption={repeatOption}
          selectedDays={repeatDays}
          onClose={handleRepeatPickerClose}
          onConfirm={handleRepeatPickerConfirm}
        />

        {/* 계획명 입력 그룹 */}
        <View style={styles.planNameSection}>
          <Text style={styles.planNameLabel}>
            계획명
            <Text style={styles.requiredStar}> *</Text>
          </Text>
          <TextInput
            style={styles.planNameInput}
            placeholder="계획의 이름을 입력해주세요."
            placeholderTextColor={colors.grayscale.gray500}
            value={planTitle}
            onChangeText={setPlanTitle}
          />
        </View>

        {/* 중요도 설정 */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>중요도 설정</Text>
          <TouchableOpacity
            onPress={() => setIsImportanceInfoVisible(true)}
            style={styles.infoButton}
          >
            <Ionicons name="help-circle-outline" size={20} color={colors.grayscale.gray500} />
          </TouchableOpacity>
        </View>

        {/* 중요도 설정 그룹 */}
        <View style={styles.fieldGroup}>
          <View style={[styles.fieldContainer, styles.fieldFirst, styles.fieldLast]}>
            <View style={styles.fieldLeft}>
              <View style={styles.iconContainer}>
                <Ionicons name="pricetag-outline" size={20} color={colors.grayscale.gray700} />
              </View>
              <Text style={styles.fieldLabel}>중요 계획 태그</Text>
            </View>
            <TouchableOpacity
              style={[styles.switchTrack, isImportant && styles.switchTrackOn]}
              activeOpacity={0.8}
              onPress={() => setIsImportant((prev) => !prev)}
            >
              <View style={[styles.switchThumb, isImportant && styles.switchThumbOn]} />
            </TouchableOpacity>
          </View>
        </View>

        {/* 기본 설정 그룹 */}
        <View style={styles.fieldGroup}>
          <TouchableOpacity style={[styles.fieldContainer, styles.fieldFirst]} onPress={handleTimeSettingPress}>
            <View style={styles.fieldLeft}>
              <View style={styles.iconContainer}>
                <Ionicons name="time-outline" size={20} color={colors.grayscale.gray700} />
              </View>
              <Text style={styles.fieldLabel}>시간 설정</Text>
            </View>
          <View style={styles.fieldRight}>
            <Text style={styles.fieldValue}>{getTimeDisplayText()}</Text>
            <Ionicons name="chevron-forward" size={20} color={colors.grayscale.gray300} />
          </View>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.fieldContainer, styles.fieldLast]} onPress={handleRepeatPress}>
            <View style={styles.fieldLeft}>
              <View style={styles.iconContainer}>
                <Ionicons name="repeat-outline" size={20} color={colors.grayscale.gray700} />
              </View>
              <Text style={styles.fieldLabel}>반복</Text>
            </View>
            <View style={styles.fieldRight}>
              <Text style={styles.fieldValue}>{getRepeatDisplayText()}</Text>
              <Ionicons name="chevron-forward" size={20} color={colors.grayscale.gray300} />
            </View>
          </TouchableOpacity>
        </View>

        {/* 그룹 설정 */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>그룹 설정</Text>
          <TouchableOpacity
            onPress={() => setIsGroupInfoVisible(true)}
            style={styles.infoButton}
          >
            <Ionicons name="help-circle-outline" size={20} color={colors.grayscale.gray500} />
          </TouchableOpacity>
        </View>

        {/* 그룹 설정 그룹 */}
        <View style={styles.fieldGroup}>
          <TouchableOpacity style={[styles.fieldContainer, styles.fieldFirst, styles.fieldLast]} onPress={handleGroupPress}>
            <View style={styles.fieldLeft}>
              <View style={styles.iconContainer}>
                <Ionicons name="folder-outline" size={20} color={colors.grayscale.gray700} />
              </View>
              <Text style={styles.fieldLabel}>그룹</Text>
            </View>
            <View style={styles.fieldRight}>
              <Text style={styles.fieldValue}>{getGroupDisplayText()}</Text>
              <Ionicons name="chevron-forward" size={20} color={colors.grayscale.gray300} />
            </View>
          </TouchableOpacity>
        </View>

        {/* 꾸미기 섹션 */}
        <View style={styles.decorateSection}>
          <Text style={[styles.sectionTitle, styles.decorateSectionTitle]}>꾸미기</Text>

          {/* 꾸미기 그룹 */}
          <View style={styles.fieldGroup}>
            <TouchableOpacity style={[styles.fieldContainer, styles.fieldFirst]} onPress={handleColorPress}>
              <View style={styles.fieldLeft}>
                <View style={styles.iconContainer}>
                  <Ionicons name="color-palette-outline" size={20} color={colors.grayscale.gray700} />
                </View>
                <Text style={styles.fieldLabel}>색상</Text>
              </View>
              <View style={styles.fieldRight}>
                <View style={[styles.colorCircle, { backgroundColor: selectedColor }]} />
                <Ionicons name="chevron-forward" size={20} color={colors.grayscale.gray300} />
              </View>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.fieldContainer, styles.fieldLast]} onPress={handleIconPress}>
              <View style={styles.fieldLeft}>
                <View style={styles.iconContainer}>
                  <Ionicons name="happy-outline" size={20} color={colors.grayscale.gray700} />
                </View>
                <Text style={styles.fieldLabel}>아이콘</Text>
              </View>
              <View style={styles.fieldRight}>
                <Text style={styles.iconEmoji}>{selectedIcon}</Text>
                <Ionicons name="chevron-forward" size={20} color={colors.grayscale.gray300} />
              </View>
            </TouchableOpacity>
          </View>
        </View>

        {/* 하단 추가하기 버튼 */}
        <TouchableOpacity style={styles.addButton} onPress={handleAddPress}>
          <Text style={styles.addButtonText}>
            {editingPlan ? '수정하기' : '추가하기'}
          </Text>
        </TouchableOpacity>
      </ScrollView>

      {/* 분류 설정 설명 바텀시트 */}
      <InfoBottomSheet
        visible={isCategoryInfoVisible}
        onClose={() => setIsCategoryInfoVisible(false)}
        title="분류 설정 TIP"
      >
        <View style={styles.infoContent}>
          <Text style={styles.infoMainText}>
            플래너리에서는 day, week, month에 따라 각각 다른 계획을 세울 수 있어요! 필요한 계획을 분류에 맞게 세워보세요 :)
          </Text>
          
          <View style={styles.infoItem}>
            <Text style={styles.infoItemTitle}>✔ DAY</Text>
            <Text style={styles.infoItemText}>
              특정 하루에 달성할 계획을 세워주세요.{'\n'}
              예: 국어 문학 지문 복습하기
            </Text>
          </View>

          <View style={styles.infoItem}>
            <Text style={styles.infoItemTitle}>✔ WEEK</Text>
            <Text style={styles.infoItemText}>
              한 주 동안 달성할 계획을 세워주세요.{'\n'}
              주의: Day에 추가했던 계획들이 합산되는 방식이 아니에요.{'\n'}
              예: 주에 수학 모고 3개 풀고 오답노트하기
            </Text>
          </View>

          <View style={styles.infoItem}>
            <Text style={styles.infoItemTitle}>✔ MONTH</Text>
            <Text style={styles.infoItemText}>
              한 달 동안 달성할 계획을 세워주세요.{'\n'}
              주의: Day와 Week에 추가했던 계획들이 합산되는 방식이 아니에요.{'\n'}
              예: 7월 동안 무조건 6시 30분에 기상하기
            </Text>
          </View>
        </View>
      </InfoBottomSheet>

      {/* 중요도 설정 설명 바텀시트 */}
      <InfoBottomSheet
        visible={isImportanceInfoVisible}
        onClose={() => setIsImportanceInfoVisible(false)}
        title="중요도 설정"
      >
        <View style={styles.infoContent}>
          <Text style={styles.infoMainText}>
            플래너리에서는 중요한 계획을 따로 표기할 수 있어요.
          </Text>
          
          {/* 예시 카드 */}
          <Image
            source={require('../assets/중요도설정_예시_설명탭.png')}
            style={styles.exampleCardImage}
            resizeMode="contain"
          />

          <Text style={styles.infoDescription}>
            중요 계획 태그 버튼을 'on' 하면 위와 같이 중요 태그가 붙어서 표기돼요. 중요한 계획은 태그를 붙여 관리해보세요 :)
          </Text>
        </View>
      </InfoBottomSheet>

      {/* 그룹 설명 바텀시트 */}
      <InfoBottomSheet
        visible={isGroupInfoVisible}
        onClose={() => setIsGroupInfoVisible(false)}
        title="그룹이란?"
      >
        <View style={styles.infoContent}>
          <Text style={styles.infoMainText}>
            플래너리에서는 계획을 그룹으로 간편하게 관리할 수 있어요.
          </Text>
        </View>
      </InfoBottomSheet>

      {/* 색상 선택 Bottom Sheet */}
      <ColorPickerBottomSheet
        visible={isColorPickerVisible}
        selectedColor={selectedColor}
        onClose={() => setIsColorPickerVisible(false)}
        onConfirm={handleColorConfirm}
        title="꾸미기 색상"
      />

      {/* 아이콘 선택 Bottom Sheet */}
      <IconPickerBottomSheet
        visible={isIconPickerVisible}
        selectedIcon={selectedIcon}
        onClose={() => setIsIconPickerVisible(false)}
        onConfirm={handleIconConfirm}
      />

      {/* 그룹 선택 Bottom Sheet */}
      <Modal
        visible={isGroupSheetVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={closeGroupSheet}
      >
        <TouchableWithoutFeedback onPress={closeGroupSheet}>
          <View style={styles.groupSheetOverlay}>
            <TouchableWithoutFeedback onPress={(e) => e.stopPropagation()}>
              <View style={styles.groupSheet}>
                <View style={styles.groupSheetGrabber} />
                <View style={styles.groupSheetHeader}>
                  {groupSheetView === 'list' ? (
                    <>
                      <Text style={styles.groupSheetTitle}>
                        {isGroupEditMode ? '그룹 수정' : '그룹 설정'}
                      </Text>
                      <View style={styles.groupSheetActions}>
                        {groups.length > 0 && (
                          <TouchableOpacity
                            style={styles.groupSheetActionButton}
                            onPress={() => setIsGroupEditMode((prev) => !prev)}
                          >
                            <Ionicons
                              name={isGroupEditMode ? 'checkmark' : 'create-outline'}
                              size={20}
                              color={isGroupEditMode ? colors.main.main : colors.grayscale.gray700}
                            />
                          </TouchableOpacity>
                        )}
                        <TouchableOpacity
                          style={styles.groupSheetActionButton}
                          onPress={closeGroupSheet}
                        >
                          <Ionicons name="close" size={20} color={colors.grayscale.gray700} />
                        </TouchableOpacity>
                      </View>
                    </>
                  ) : (
                    <View style={styles.groupSheetHeaderRow}>
                      <TouchableOpacity
                        style={styles.groupSheetHeaderButton}
                        onPress={() =>
                          setGroupSheetView(groupSheetView === 'color' ? 'create' : 'list')
                        }
                      >
                        <Ionicons name="arrow-back" size={20} color={colors.grayscale.gray700} />
                      </TouchableOpacity>
                      <Text style={styles.groupSheetTitle}>
                        {groupSheetView === 'color'
                          ? '그룹 색상'
                          : draftGroupId
                            ? '그룹 수정하기'
                            : '그룹 생성하기'}
                      </Text>
                      <TouchableOpacity
                        style={styles.groupSheetHeaderButton}
                        onPress={closeGroupSheet}
                      >
                        <Ionicons name="close" size={20} color={colors.grayscale.gray700} />
                      </TouchableOpacity>
                    </View>
                  )}
                </View>

                {groupSheetView === 'list' && (
                  <ScrollView contentContainerStyle={styles.groupSheetList}>
                    {groups.length === 0 ? (
                      <View style={styles.groupSheetEmptyContainer}>
                        <Text style={styles.groupSheetEmpty}>
                          생성된 그룹이 없습니다.{'\n'}새로운 그룹을 만들어보세요!
                        </Text>
                      </View>
                    ) : (
                      groups.map((group) => {
                        const isSelected = !isGroupEditMode && tempSelectedGroupId === group.id;
                        return (
                          <View
                            key={group.id}
                            style={[styles.groupSheetItem, isSelected && styles.groupSheetItemSelected]}
                          >
                            <TouchableOpacity
                              style={styles.groupSheetItemContent}
                              activeOpacity={0.8}
                              onPress={() => {
                                if (isGroupEditMode) {
                                  startGroupCreate(group);
                                  return;
                                }
                                setTempSelectedGroupId((prev) =>
                                  prev === group.id ? null : group.id
                                );
                              }}
                            >
                              <View style={[styles.groupSheetColor, { backgroundColor: group.color }]} />
                              <Text style={styles.groupSheetName}>{group.name}</Text>
                            </TouchableOpacity>
                            {isGroupEditMode && (
                              <TouchableOpacity
                                style={styles.groupSheetDeleteButton}
                                onPress={() => handleGroupDelete(group.id)}
                              >
                                <Ionicons name="remove-circle" size={22} color="#EF4444" />
                              </TouchableOpacity>
                            )}
                          </View>
                        );
                      })
                    )}
                  </ScrollView>
                )}

                {groupSheetView === 'create' && (
                  <View style={styles.groupForm}>
                    <View style={styles.groupFormField}>
                      <Text style={styles.groupFormLabel}>그룹 이름</Text>
                      <View style={styles.groupFormInputRow}>
                        <TextInput
                          style={styles.groupFormInput}
                          placeholder="그룹의 이름을 입력하세요."
                          placeholderTextColor={colors.grayscale.gray500}
                          value={draftGroupName}
                          onChangeText={(text) => {
                            if (text.length <= MAX_GROUP_NAME_LENGTH) {
                              setDraftGroupName(text);
                            }
                          }}
                        />
                        <Text style={styles.groupFormCounter}>
                          {draftGroupName.length}/{MAX_GROUP_NAME_LENGTH}
                        </Text>
                      </View>
                    </View>

                    <View style={styles.groupFormField}>
                      <Text style={styles.groupFormLabel}>그룹 색상</Text>
                      <TouchableOpacity style={styles.groupFormColor} onPress={openColorPicker}>
                        <View style={styles.groupFormColorLeft}>
                          <Ionicons
                            name="color-palette-outline"
                            size={20}
                            color={colors.grayscale.gray700}
                          />
                          <Text style={styles.groupFormColorText}>색상</Text>
                        </View>
                        <View style={styles.groupFormColorRight}>
                          <View
                            style={[
                              styles.groupFormColorPreview,
                              { backgroundColor: draftGroupColor },
                            ]}
                          />
                          <Ionicons name="chevron-forward" size={20} color={colors.grayscale.gray300} />
                        </View>
                      </TouchableOpacity>
                    </View>

                    <TouchableOpacity
                      style={[
                        styles.groupFormSubmit,
                        !draftGroupName.trim() && styles.groupFormSubmitDisabled,
                      ]}
                      onPress={handleGroupSave}
                      disabled={!draftGroupName.trim()}
                    >
                      <Text
                        style={[
                          styles.groupFormSubmitText,
                          !draftGroupName.trim() && styles.groupFormSubmitTextDisabled,
                        ]}
                      >
                        {draftGroupId ? '수정하기' : '추가하기'}
                      </Text>
                    </TouchableOpacity>
                  </View>
                )}

                {groupSheetView === 'color' && (
                  <View style={styles.groupColor}>
                    <View style={styles.groupColorGrid}>
                      {Array.from({ length: 4 }).map((_, rowIndex) => (
                        <View key={rowIndex} style={styles.groupColorRow}>
                          {GROUP_COLORS.slice(rowIndex * 5, (rowIndex + 1) * 5).map(
                            (color, colIndex) => {
                              const isSelected = colorPickerTemp === color;
                              return (
                                <TouchableOpacity
                                  key={`${rowIndex}-${colIndex}`}
                                  style={[
                                    styles.groupColorSwatch,
                                    isSelected && styles.groupColorSwatchSelected,
                                    { backgroundColor: color },
                                    colIndex < 4 && styles.groupColorSwatchMargin,
                                  ]}
                                  onPress={() => setColorPickerTemp(color)}
                                />
                              );
                            }
                          )}
                        </View>
                      ))}
                    </View>
                    <TouchableOpacity
                      style={styles.groupColorConfirm}
                      onPress={() => {
                        setDraftGroupColor(colorPickerTemp);
                        setGroupSheetView('create');
                      }}
                    >
                      <Text style={styles.groupColorConfirmText}>확인</Text>
                    </TouchableOpacity>
                  </View>
                )}

                {groupSheetView === 'list' && (
                  <>
                    <TouchableOpacity
                      style={styles.groupSheetAdd}
                      onPress={() => startGroupCreate()}
                    >
                      <Ionicons name="add" size={20} color={colors.grayscale.white} />
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={[
                        styles.groupSheetConfirm,
                        (!tempSelectedGroupId || isGroupEditMode) && styles.groupSheetConfirmDisabled,
                      ]}
                      onPress={handleGroupSheetConfirm}
                      disabled={!tempSelectedGroupId || isGroupEditMode}
                    >
                      <Text
                        style={[
                          styles.groupSheetConfirmText,
                          (!tempSelectedGroupId || isGroupEditMode) &&
                            styles.groupSheetConfirmTextDisabled,
                        ]}
                      >
                        선택하기
                      </Text>
                    </TouchableOpacity>
                  </>
                )}
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

      <Modal
        visible={isDeleteGroupModalVisible}
        transparent
        animationType="fade"
        onRequestClose={handleCancelDeleteGroup}
      >
        <TouchableWithoutFeedback onPress={handleCancelDeleteGroup}>
          <View style={styles.deleteModalOverlay}>
            <TouchableWithoutFeedback>
              <View style={styles.deleteModalContainer}>
                <TouchableOpacity
                  onPress={handleCancelDeleteGroup}
                  style={styles.deleteModalClose}
                >
                  <Ionicons name="close" size={18} color={colors.grayscale.gray700} />
                </TouchableOpacity>
                <Text style={styles.deleteModalTitle}>
                  {deleteTargetGroup
                    ? `'${deleteTargetGroup.name}' 그룹이 삭제돼요.`
                    : '그룹이 삭제돼요.'}
                </Text>
                <Text style={styles.deleteModalDescription}>
                  그룹이 삭제되면 복구할 수 없어요.{'\n'}그래도 삭제하시겠어요?
                </Text>
                <View style={styles.deleteModalButtons}>
                  <TouchableOpacity
                    style={styles.deleteModalCancel}
                    onPress={handleCancelDeleteGroup}
                  >
                    <Text style={styles.deleteModalCancelText}>취소하기</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.deleteModalConfirm}
                    onPress={handleConfirmDeleteGroup}
                  >
                    <Text style={styles.deleteModalConfirmText}>삭제하기</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.grayscale.gray50, // iOS 배경색
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: spacing['2xl'],
    paddingTop: spacing.sm,
  },
  // 상단 탭 - iOS Segmented Control 스타일
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: colors.grayscale.gray100,
    borderRadius: 8,
    padding: 4,
    marginHorizontal: spacing.base,
    marginVertical: spacing.md,
  },
  tab: {
    flex: 1,
    paddingVertical: spacing.sm,
    alignItems: 'center',
    borderRadius: 6,
    backgroundColor: 'transparent',
    borderWidth: 0,
  },
  tabActive: {
    backgroundColor: colors.main.main,
    shadowColor: colors.grayscale.gray900,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  tabText: {
    ...typography.bodyMedium,
    fontWeight: fontWeight.medium,
    color: colors.grayscale.gray700,
  },
  tabTextActive: {
    color: colors.grayscale.white,
    fontWeight: fontWeight.semibold,
  },
  // 필드 그룹
  fieldGroup: {
    marginVertical: spacing.base,
    backgroundColor: 'transparent',
  },
  // 필드 공통 스타일 - iOS Settings 스타일
  fieldContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.grayscale.white,
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.md,
    marginHorizontal: spacing.base,
    marginVertical: 0.5,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: colors.grayscale.gray200,
  },
  fieldFirst: {
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    borderTopWidth: 1,
    borderBottomWidth: 1,
  },
  fieldLast: {
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    borderTopWidth: 1,
    borderBottomWidth: 1,
  },
  fieldLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  fieldRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  iconContainer: {
    width: 24,
    height: 24,
    marginRight: spacing.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fieldLabel: {
    ...typography.bodyMedium,
    color: colors.grayscale.gray900,
  },
  switchTrack: {
    width: 44,
    height: 26,
    borderRadius: 13,
    backgroundColor: colors.grayscale.gray200,
    padding: 3,
    justifyContent: 'center',
  },
  switchTrackOn: {
    backgroundColor: colors.main.main,
  },
  switchThumb: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: colors.grayscale.white,
    transform: [{ translateX: 0 }],
  },
  switchThumbOn: {
    transform: [{ translateX: 18 }],
  },
  requiredStar: {
    color: colors.main.main,
  },
  fieldValue: {
    ...typography.bodyMedium,
    color: colors.grayscale.gray500,
  },
  // 계획명 섹션
  planNameSection: {
    paddingHorizontal: spacing.base,
    marginTop: spacing.base,
    marginBottom: spacing.base,
  },
  planNameLabel: {
    ...typography.bodyLarge,
    fontWeight: fontWeight.semibold,
    color: colors.grayscale.gray900,
    marginBottom: spacing.md,
  },
  planNameInput: {
    ...typography.bodyLarge,
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.md,
    backgroundColor: colors.grayscale.white,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.grayscale.gray200,
    color: colors.grayscale.gray900,
    minHeight: 44,
  },
  // 텍스트 입력 - iOS 스타일 (다른 곳에서 사용할 경우를 위해 유지)
  textInput: {
    ...typography.bodyLarge,
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.md,
    marginHorizontal: spacing.base,
    marginBottom: spacing.base,
    backgroundColor: colors.grayscale.white,
    borderRadius: 10,
    borderWidth: 0.5,
    borderColor: colors.grayscale.gray200,
    color: colors.grayscale.gray900,
  },
  // 꾸미기 섹션
  decorateSection: {
    marginTop: spacing.base,
  },
  decorateSectionTitle: {
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.md,
  },
  sectionTitle: {
    ...typography.bodyLarge,
    fontWeight: fontWeight.semibold,
    color: colors.grayscale.gray900,
  },
  colorCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.grayscale.gray200,
  },
  iconEmoji: {
    fontSize: 24,
  },
  // 추가하기 버튼 - iOS 스타일
  addButton: {
    backgroundColor: colors.main.main,
    marginHorizontal: spacing.base,
    marginTop: spacing.xl,
    paddingVertical: spacing.base,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.grayscale.gray900,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  addButtonText: {
    ...typography.bodyLarge,
    fontWeight: fontWeight.semibold,
    color: colors.grayscale.white,
  },
  // 섹션 헤더
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.base,
    paddingTop: spacing.xl,
    paddingBottom: spacing.sm,
    marginTop: spacing.base,
  },
  infoButton: {
    marginLeft: spacing.xs,
    padding: spacing.xs,
  },
  // 설명 바텀시트 스타일
  infoContent: {
    paddingVertical: spacing.md,
  },
  infoMainText: {
    ...typography.bodyMedium,
    color: colors.grayscale.gray900,
    marginBottom: spacing.xl,
    lineHeight: 22,
  },
  infoItem: {
    marginBottom: spacing.lg,
  },
  infoItemTitle: {
    ...typography.bodyLarge,
    fontWeight: fontWeight.semibold,
    color: colors.grayscale.gray900,
    marginBottom: spacing.sm,
  },
  infoItemText: {
    ...typography.bodyMedium,
    color: colors.grayscale.gray700,
    lineHeight: 22,
  },
  infoDescription: {
    ...typography.bodyMedium,
    color: colors.grayscale.gray700,
    marginTop: spacing.base,
    lineHeight: 22,
  },
  groupSheetOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
    justifyContent: 'flex-end',
  },
  groupSheet: {
    backgroundColor: colors.grayscale.white,
    borderTopLeftRadius: spacing.xl,
    borderTopRightRadius: spacing.xl,
    maxHeight: '80%',
    minHeight: '70%',
    paddingBottom: spacing.lg,
  },
  groupSheetGrabber: {
    alignSelf: 'center',
    width: 44,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.grayscale.gray200,
    marginTop: spacing.sm,
    marginBottom: spacing.sm,
  },
  groupSheetHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.grayscale.gray100,
  },
  groupSheetHeaderRow: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  groupSheetHeaderButton: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  groupSheetTitle: {
    ...typography.bodyLarge,
    fontWeight: fontWeight.semibold,
    color: colors.grayscale.gray900,
  },
  groupSheetActions: {
    position: 'absolute',
    right: spacing.base,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  groupSheetActionButton: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  groupSheetList: {
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.lg,
    flexGrow: 1,
  },
  groupSheetEmptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing['2xl'],
  },
  groupSheetEmpty: {
    ...typography.bodyMedium,
    color: colors.grayscale.gray500,
    textAlign: 'center',
    lineHeight: 22,
  },
  groupSheetItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.base,
    paddingHorizontal: spacing.base,
    borderRadius: spacing.base,
    backgroundColor: colors.grayscale.white,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.grayscale.gray100,
  },
  groupSheetItemSelected: {
    borderColor: colors.main.main,
    backgroundColor: colors.main.sub1,
  },
  groupSheetItemContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  groupSheetDeleteButton: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.sm,
  },
  groupSheetItemAction: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  groupSheetItemActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  groupSheetColor: {
    width: 20,
    height: 20,
    borderRadius: 10,
    marginRight: spacing.md,
  },
  groupSheetName: {
    ...typography.bodyLarge,
    color: colors.grayscale.gray900,
  },
  groupSheetAdd: {
    position: 'absolute',
    right: spacing.base,
    bottom: spacing['5xl'] + spacing['2xl'],
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.grayscale.gray700,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
    shadowColor: colors.grayscale.gray900,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  groupForm: {
    flex: 1,
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.lg,
  },
  groupFormField: {
    marginBottom: spacing.lg,
  },
  groupFormLabel: {
    ...typography.bodyMedium,
    fontWeight: fontWeight.semibold,
    color: colors.grayscale.gray900,
    marginBottom: spacing.sm,
  },
  groupFormInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.grayscale.gray200,
    borderRadius: 10,
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.sm,
    backgroundColor: colors.grayscale.white,
  },
  groupFormInput: {
    ...typography.bodyLarge,
    color: colors.grayscale.gray900,
    flex: 1,
  },
  groupFormCounter: {
    ...typography.bodySmall,
    color: colors.grayscale.gray500,
  },
  groupFormColor: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: colors.grayscale.gray200,
    borderRadius: 10,
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.base,
    backgroundColor: colors.grayscale.white,
  },
  groupFormColorLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  groupFormColorRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  groupFormColorText: {
    ...typography.bodyMedium,
    color: colors.grayscale.gray700,
  },
  groupFormColorPreview: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.grayscale.gray200,
  },
  groupFormSubmit: {
    backgroundColor: colors.main.main,
    marginTop: 'auto',
    marginHorizontal: 0,
    marginBottom: spacing.lg,
    paddingVertical: spacing.base,
    borderRadius: spacing.base,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  groupFormSubmitDisabled: {
    backgroundColor: colors.grayscale.gray300,
  },
  groupFormSubmitText: {
    ...typography.bodyLarge,
    fontWeight: fontWeight.semibold,
    color: colors.grayscale.white,
  },
  groupFormSubmitTextDisabled: {
    color: colors.grayscale.gray500,
  },
  groupColor: {
    flex: 1,
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.lg,
  },
  groupColorGrid: {
    marginBottom: spacing.lg,
  },
  groupColorRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  groupColorSwatch: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: colors.grayscale.gray200,
  },
  groupColorSwatchSelected: {
    borderColor: colors.main.main,
    borderWidth: 3,
  },
  groupColorSwatchMargin: {
    marginRight: spacing.md,
  },
  groupColorConfirm: {
    backgroundColor: colors.main.main,
    paddingVertical: spacing.base,
    borderRadius: spacing.base,
    alignItems: 'center',
    justifyContent: 'center',
  },
  groupColorConfirmText: {
    ...typography.bodyLarge,
    fontWeight: fontWeight.semibold,
    color: colors.grayscale.white,
  },
  deleteModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
  },
  deleteModalContainer: {
    width: '100%',
    backgroundColor: colors.grayscale.white,
    borderRadius: spacing.lg,
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.lg,
  },
  deleteModalClose: {
    position: 'absolute',
    top: spacing.md,
    right: spacing.md,
    width: 28,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  deleteModalTitle: {
    ...typography.bodyLarge,
    fontWeight: fontWeight.semibold,
    color: colors.grayscale.gray900,
    textAlign: 'center',
    marginTop: spacing.md,
  },
  deleteModalDescription: {
    ...typography.bodyMedium,
    color: colors.grayscale.gray700,
    textAlign: 'center',
    marginTop: spacing.sm,
    lineHeight: 22,
  },
  deleteModalButtons: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.lg,
  },
  deleteModalCancel: {
    flex: 1,
    backgroundColor: colors.grayscale.gray100,
    borderRadius: spacing.base,
    paddingVertical: spacing.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  deleteModalCancelText: {
    ...typography.bodyMedium,
    fontWeight: fontWeight.semibold,
    color: colors.grayscale.gray700,
  },
  deleteModalConfirm: {
    flex: 1,
    backgroundColor: colors.main.main,
    borderRadius: spacing.base,
    paddingVertical: spacing.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  deleteModalConfirmText: {
    ...typography.bodyMedium,
    fontWeight: fontWeight.semibold,
    color: colors.grayscale.white,
  },
  groupSheetConfirm: {
    backgroundColor: colors.main.main,
    marginHorizontal: spacing.base,
    marginTop: 'auto',
    marginBottom: spacing.lg,
    paddingVertical: spacing.base,
    borderRadius: spacing.base,
    alignItems: 'center',
    justifyContent: 'center',
  },
  groupSheetConfirmDisabled: {
    backgroundColor: colors.grayscale.gray300,
  },
  groupSheetConfirmText: {
    ...typography.bodyLarge,
    fontWeight: fontWeight.semibold,
    color: colors.grayscale.white,
  },
  groupSheetConfirmTextDisabled: {
    color: colors.grayscale.gray500,
  },
  // 예시 카드 이미지
  exampleCardImage: {
    width: '100%',
    height: undefined,
    aspectRatio: 1, // 이미지 비율에 맞게 조정 필요 시 수정
    marginVertical: spacing.base,
    borderRadius: spacing.base,
  },
});

