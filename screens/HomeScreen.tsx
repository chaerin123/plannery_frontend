import React, { useEffect, useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Modal,
  Pressable,
  TouchableWithoutFeedback,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { MainTabParamList } from '../types/navigation';
import { colors, spacing, typography, fontWeight } from '../src/constants';
import CalendarIcon from '../assets/calender_icon.svg';
import TagIcon from '../assets/mdi_tag-outline.svg';
import PencilIcon from '../assets/mynaui_pencil.svg';
import TrashIcon from '../assets/mynaui_trash.svg';
import PlanCard from '../components/PlanCard';
import { usePlan, PlanType } from '../contexts/PlanContext';
import DatePickerBottomSheet from '../components/DatePickerBottomSheet';
import DayCalendar from '../components/DayCalendar';

type Props = BottomTabScreenProps<MainTabParamList, 'Home'>;

type ViewMode = 'Day' | 'Week' | 'Month';

// ViewMode를 PlanType으로 변환하는 헬퍼 함수
const viewModeToPlanType = (mode: ViewMode): PlanType => {
  return mode === 'Day' ? 'DAY' : mode === 'Week' ? 'WEEK' : 'MONTH';
};

export default function HomeScreen({ navigation, route }: Props) {
  const [viewMode, setViewMode] = useState<ViewMode>('Day');
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [isDatePickerVisible, setIsDatePickerVisible] = useState(false);
  const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null);
  const [sortOption, setSortOption] = useState<'time' | 'important'>('time');
  const [isSortMenuVisible, setIsSortMenuVisible] = useState(false);
  const [openMenuPlanId, setOpenMenuPlanId] = useState<string | null>(null);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

  const { plans, groups, togglePlanStatus, togglePlanImportant, deletePlan } = usePlan();

  const currentPlanType = viewModeToPlanType(viewMode);

  const formatHeaderDate = (date: Date) =>
    `${date.getMonth() + 1}월 ${date.getDate()}일`;

  const getDateKey = (date: Date) =>
    `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(
      date.getDate()
    ).padStart(2, '0')}`;

  const isSameDay = (dateKey: string, date: Date) => dateKey === getDateKey(date);

  const isSameMonth = (dateKey: string, date: Date) => {
    const [year, month] = dateKey.split('-').map(Number);
    return year === date.getFullYear() && month === date.getMonth() + 1;
  };

  const isSameWeek = (dateKey: string, date: Date) => {
    const [year, month, day] = dateKey.split('-').map(Number);
    const start = new Date(year, month - 1, day);
    start.setHours(0, 0, 0, 0);
    const end = new Date(start);
    end.setDate(start.getDate() + 6);
    end.setHours(23, 59, 59, 999);
    const target = new Date(date);
    target.setHours(12, 0, 0, 0);
    return target >= start && target <= end;
  };

  const parseTimeToMinutes = (timeText: string) => {
    if (!timeText || timeText === '없음') {
      return Number.MAX_SAFE_INTEGER;
    }
    const match = timeText.match(/(\d{1,2}):(\d{2})/);
    if (!match) {
      return Number.MAX_SAFE_INTEGER;
    }
    return Number(match[1]) * 60 + Number(match[2]);
  };

  useEffect(() => {
    if (route.params?.selectedDate) {
      const [year, month, day] = route.params.selectedDate.split('-').map(Number);
      if (year && month && day) {
        setSelectedDate(new Date(year, month - 1, day));
      }
    }
    if (route.params?.viewMode) {
      setViewMode(route.params.viewMode);
    }
    if (route.params?.selectedGroupId !== undefined) {
      setSelectedGroupId(route.params.selectedGroupId ?? null);
    }
    if (
      route.params?.selectedDate ||
      route.params?.viewMode ||
      route.params?.selectedGroupId !== undefined
    ) {
      navigation.setParams({
        selectedDate: undefined,
        viewMode: undefined,
        selectedGroupId: undefined,
      });
    }
  }, [
    route.params?.selectedDate,
    route.params?.viewMode,
    route.params?.selectedGroupId,
    navigation,
  ]);

  const filteredPlans = useMemo(() => {
    const typedPlans = plans.filter((plan) => plan.type === currentPlanType);
    const datedPlans = typedPlans.filter((plan) => {
      if (viewMode === 'Day') {
        return isSameDay(plan.date, selectedDate);
      }
      if (viewMode === 'Week') {
        return isSameWeek(plan.date, selectedDate);
      }
      return isSameMonth(plan.date, selectedDate);
    });
    const groupedPlans = selectedGroupId
      ? datedPlans.filter((plan) => plan.groupId === selectedGroupId)
      : datedPlans;
    return [...groupedPlans].sort((a, b) => {
      if (sortOption === 'important') {
        if (a.isImportant !== b.isImportant) {
          return a.isImportant ? -1 : 1;
        }
      }
      return parseTimeToMinutes(a.time) - parseTimeToMinutes(b.time);
    });
  }, [
    plans,
    currentPlanType,
    viewMode,
    selectedDate,
    selectedGroupId,
    sortOption,
  ]);

  const completedCount = filteredPlans.filter((plan) => plan.status === 'DONE').length;
  const completionPercent =
    filteredPlans.length === 0
      ? 0
      : Math.round((completedCount / filteredPlans.length) * 100);
  const summaryTitle =
    viewMode === 'Day' ? '오늘의 계획' : viewMode === 'Week' ? '이번 주 계획' : '이번 달 계획';

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[colors.main.main, colors.main.main2]}
        style={styles.header}
      >
        <SafeAreaView edges={['top']} style={styles.headerContent}>
          <View style={styles.headerTop}>
          <Pressable
            style={styles.dateContainer}
            onPress={() => setIsDatePickerVisible(true)}
          >
            <Ionicons name="calendar-outline" size={18} color={colors.grayscale.white} />
            <Text style={styles.dateText}>{formatHeaderDate(selectedDate)}</Text>
            <Ionicons name="chevron-down" size={18} color={colors.grayscale.white} />
          </Pressable>
          <Pressable
            style={styles.notificationButton}
            onPress={() => navigation.navigate('Notification')}
          >
            <Ionicons name="notifications-outline" size={22} color={colors.grayscale.white} />
          </Pressable>
          </View>

          <View style={styles.summaryCard}>
          <View style={styles.summaryIconContainer}>
            <Ionicons name="megaphone" size={20} color={colors.grayscale.white} />
          </View>
          <View style={styles.summaryTextContainer}>
            <Text style={styles.summaryMainText}>{summaryTitle}</Text>
            <Text style={styles.summarySubText}>
              {filteredPlans.length}개의 계획이 있습니다
            </Text>
          </View>
          <View style={styles.progressContainer}>
            <View style={styles.progressCircle}>
              <Text style={styles.progressText}>{completionPercent}%</Text>
            </View>
          </View>
          </View>

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
                  {mode === 'Day' ? 'Day' : mode === 'Week' ? 'Week' : 'Month'}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </SafeAreaView>
      </LinearGradient>

      <View style={styles.contentPanel}>
        <View style={styles.filterSection}>
          <View style={styles.filterBar}>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.groupFilterRow}
            >
              <Pressable
                style={[
                  styles.statusChip,
                  !selectedGroupId && styles.statusChipActive,
                ]}
                onPress={() => setSelectedGroupId(null)}
              >
                <Text
                  style={[
                    styles.statusChipText,
                    !selectedGroupId && styles.statusChipTextActive,
                  ]}
                >
                  전체
                </Text>
              </Pressable>
              {groups.map((group) => (
                <Pressable
                  key={group.id}
                  style={[
                    styles.statusChip,
                    selectedGroupId === group.id && styles.statusChipActive,
                  ]}
                  onPress={() => setSelectedGroupId(group.id)}
                >
                  <Text
                    style={[
                      styles.statusChipText,
                      selectedGroupId === group.id && styles.statusChipTextActive,
                    ]}
                  >
                    {group.name}
                  </Text>
                </Pressable>
              ))}
            </ScrollView>
            <View style={styles.sortDropdown}>
              <Pressable
                style={[
                  styles.sortButton,
                  isSortMenuVisible && styles.sortButtonExpanded,
                ]}
                onPress={() => setIsSortMenuVisible((prev) => !prev)}
              >
                <Ionicons name="swap-vertical" size={14} color={colors.grayscale.gray700} />
                <Text style={styles.sortText}>
                  {sortOption === 'time' ? '시간순' : '중요도순'}
                </Text>
                <Ionicons
                  name={isSortMenuVisible ? 'chevron-up' : 'chevron-down'}
                  size={14}
                  color={colors.grayscale.gray500}
                />
              </Pressable>
              {isSortMenuVisible && (
                <View style={styles.sortDropdownMenu}>
                  <Pressable
                    style={styles.sortDropdownItem}
                    onPress={() => {
                      setSortOption('time');
                      setIsSortMenuVisible(false);
                    }}
                  >
                    <Text style={styles.sortDropdownText}>시간순</Text>
                  </Pressable>
                  <Pressable
                    style={styles.sortDropdownItem}
                    onPress={() => {
                      setSortOption('important');
                      setIsSortMenuVisible(false);
                    }}
                  >
                    <Text style={styles.sortDropdownText}>중요도순</Text>
                  </Pressable>
                </View>
              )}
            </View>
          </View>
        </View>

        <View style={styles.listContainer}>
          <ScrollView style={styles.listContent}>
          {filteredPlans.length === 0 ? (
            <View style={styles.emptyState}>
              <CalendarIcon width={32} height={32} />
              <Text style={styles.emptyText}>아직 계획이 없습니다.</Text>
            </View>
          ) : (
            filteredPlans.map((plan) => (
              <View key={plan.id} style={styles.planCardWrapper}>
                <PlanCard
                  title={plan.title}
                  time={plan.time}
                  status={plan.status}
                  colorBar={plan.colorBar}
                  isImportant={plan.isImportant}
                  onStatusToggle={() => togglePlanStatus(plan.id)}
                  onMenuPress={() =>
                    setOpenMenuPlanId((prev) => (prev === plan.id ? null : plan.id))
                  }
                />
                {openMenuPlanId === plan.id && (
                  <View style={styles.planMenu}>
                    <Pressable
                      style={styles.planMenuItem}
                      onPress={() => {
                        setOpenMenuPlanId(null);
                        navigation.navigate('PlanCreate', { planId: plan.id });
                      }}
                    >
                      <View style={styles.planMenuItemContent}>
                        <PencilIcon width={16} height={16} style={styles.planMenuIcon} />
                        <Text style={styles.planMenuText}>수정하기</Text>
                      </View>
                    </Pressable>
                    <Pressable
                      style={styles.planMenuItem}
                      onPress={() => {
                        setOpenMenuPlanId(null);
                        togglePlanImportant(plan.id);
                      }}
                    >
                      <View style={styles.planMenuItemContent}>
                        <TagIcon width={16} height={16} style={styles.planMenuIcon} />
                        <Text style={styles.planMenuText}>중요 계획 태그</Text>
                      </View>
                    </Pressable>
                    <Pressable
                      style={[styles.planMenuItem, styles.planMenuDelete]}
                      onPress={() => {
                        setOpenMenuPlanId(null);
                        setDeleteTargetId(plan.id);
                        setIsDeleteModalVisible(true);
                      }}
                    >
                      <View style={styles.planMenuItemContent}>
                        <TrashIcon width={16} height={16} style={styles.planMenuIconDelete} />
                        <Text style={styles.planMenuDeleteText}>삭제하기</Text>
                      </View>
                    </Pressable>
                  </View>
                )}
              </View>
            ))
          )}
          </ScrollView>
        </View>
      </View>

      <DatePickerBottomSheet
        visible={isDatePickerVisible}
        viewMode="Day"
        onClose={() => setIsDatePickerVisible(false)}
        onConfirm={() => setIsDatePickerVisible(false)}
        title="날짜를 선택해주세요."
      >
        <DayCalendar
          selectedDate={selectedDate}
          onDateSelect={(date) => {
            setSelectedDate(date);
            setIsDatePickerVisible(false);
          }}
        />
      </DatePickerBottomSheet>


      <Modal
        visible={isDeleteModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setIsDeleteModalVisible(false)}
      >
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setIsDeleteModalVisible(false)}
        >
          <TouchableWithoutFeedback>
            <View style={styles.deleteModal}>
              <View style={styles.deleteModalHeader}>
                <Text style={styles.deleteModalTitle}>계획 삭제</Text>
                <Pressable
                  style={styles.deleteModalClose}
                  onPress={() => setIsDeleteModalVisible(false)}
                >
                  <Ionicons name="close" size={18} color={colors.grayscale.gray500} />
                </Pressable>
              </View>
              <Text style={styles.deleteModalMessage}>
                {deleteTargetId
                  ? `“${plans.find((plan) => plan.id === deleteTargetId)?.title ?? ''}” 계획을\n삭제할까요?`
                  : '계획을\n삭제할까요?'}
              </Text>
              <View style={styles.deleteModalButtons}>
                <Pressable
                  style={styles.deleteCancelButton}
                  onPress={() => setIsDeleteModalVisible(false)}
                >
                  <Text style={styles.deleteCancelText}>취소하기</Text>
                </Pressable>
                <Pressable
                  style={styles.deleteConfirmButton}
                  onPress={() => {
                    if (deleteTargetId) {
                      deletePlan(deleteTargetId);
                    }
                    setDeleteTargetId(null);
                    setIsDeleteModalVisible(false);
                  }}
                >
                  <Text style={styles.deleteConfirmText}>삭제하기</Text>
                </Pressable>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </Pressable>
      </Modal>

      <Pressable
        style={({ pressed }) => [styles.fab, pressed && styles.fabPressed]}
        onPress={() => navigation.navigate('PlanCreate', { type: currentPlanType })}
      >
        <Text style={styles.fabText}>+</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.grayscale.white,
  },
  header: {
    backgroundColor: colors.main.main,
  },
  headerContent: {
    paddingTop: spacing.base,
    paddingBottom: spacing.md,
    paddingHorizontal: spacing.base,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.base,
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  dateText: {
    ...typography.h3,
    color: colors.grayscale.white,
    marginHorizontal: spacing.xs,
  },
  notificationButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  summaryCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.grayscale.white,
    borderRadius: spacing.lg,
    paddingVertical: spacing.base,
    paddingHorizontal: spacing.lg,
    marginTop: spacing.sm,
    shadowColor: colors.grayscale.gray900,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 4,
  },
  summaryIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.main.main,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  summaryTextContainer: {
    flex: 1,
  },
  summaryMainText: {
    ...typography.bodyLarge,
    color: colors.grayscale.gray900,
    marginBottom: spacing.xs,
  },
  summarySubText: {
    ...typography.bodySmall,
    color: colors.grayscale.gray500,
  },
  progressContainer: {
    marginLeft: spacing.md,
  },
  progressCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.grayscale.white,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.main.main,
  },
  progressText: {
    ...typography.bodySmall,
    fontWeight: fontWeight.semibold,
    color: colors.main.main,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: 'transparent',
    borderRadius: spacing.lg,
    paddingHorizontal: 0,
    marginHorizontal: spacing.base,
    marginTop: spacing.md,
    marginBottom: 0,
    justifyContent: 'space-between',
  },
  tab: {
    flex: 1,
    paddingVertical: spacing.md,
    alignItems: 'center',
    borderTopLeftRadius: spacing.lg,
    borderTopRightRadius: spacing.lg,
    backgroundColor: 'transparent',
    borderWidth: 0,
  },
  tabActive: {
    backgroundColor: colors.grayscale.white,
    shadowColor: colors.grayscale.gray900,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 2,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
  },
  tabText: {
    ...typography.bodyLarge,
    fontWeight: fontWeight.medium,
    color: colors.grayscale.white,
  },
  tabTextActive: {
    ...typography.bodyLarge,
    fontWeight: fontWeight.semibold,
    color: colors.grayscale.gray900,
  },
  contentPanel: {
    flex: 1,
    backgroundColor: colors.grayscale.white,
    marginTop: -spacing.xl,
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
  },
  filterSection: {
    paddingHorizontal: spacing.base,
    paddingTop: spacing.xl,
    paddingBottom: spacing.base,
    backgroundColor: colors.grayscale.white,
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
  },
  filterBar: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
  },
  groupFilterRow: {
    alignItems: 'center',
    gap: spacing.sm,
    paddingVertical: 0,
    paddingRight: spacing.sm,
  },
  statusChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingHorizontal: spacing.md,
    paddingVertical: 2,
    minHeight: 24,
    borderRadius: 999,
    backgroundColor: colors.grayscale.white,
    borderWidth: 1,
    borderColor: colors.grayscale.gray300,
  },
  statusChipActive: {
    backgroundColor: colors.grayscale.gray500,
    borderColor: colors.grayscale.gray700,
    shadowColor: colors.grayscale.gray900,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  statusChipText: {
    ...typography.bodySmall,
    color: colors.grayscale.gray700,
  },
  statusChipTextActive: {
    color: colors.grayscale.white,
    fontWeight: fontWeight.semibold,
  },
  sortButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    flexShrink: 0,
    borderRadius: 8,
    backgroundColor: colors.grayscale.white,
    borderWidth: 1,
    borderColor: colors.grayscale.gray300,
  },
  sortText: {
    ...typography.bodySmall,
    color: colors.grayscale.gray700,
    fontWeight: fontWeight.semibold,
  },
  sortDropdown: {
    alignItems: 'stretch',
    position: 'relative',
    zIndex: 5,
  },
  sortButtonExpanded: {
    shadowColor: colors.grayscale.gray900,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 6,
  },
  sortDropdownMenu: {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    marginTop: 2,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.grayscale.gray300,
    backgroundColor: colors.grayscale.white,
    overflow: 'hidden',
    shadowColor: colors.grayscale.gray900,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 6,
  },
  sortDropdownItem: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
  },
  sortDropdownText: {
    ...typography.bodySmall,
    color: colors.grayscale.gray700,
  },
  listContainer: {
    flex: 1,
    backgroundColor: colors.grayscale.white,
  },
  listContent: {
    padding: spacing.base,
    flexGrow: 1,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: spacing['5xl'],
    gap: spacing.sm,
  },
  emptyText: {
    ...typography.bodyMedium,
    color: colors.grayscale.gray700,
  },
  planCardWrapper: {
    position: 'relative',
  },
  planMenu: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: colors.grayscale.white,
    borderRadius: spacing.base,
    paddingVertical: spacing.xs,
    width: 140,
    shadowColor: colors.grayscale.gray900,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
    zIndex: 2,
  },
  planMenuItem: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  planMenuItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  planMenuIcon: {
    opacity: 0.8,
  },
  planMenuText: {
    ...typography.bodyMedium,
    color: colors.grayscale.gray700,
  },
  planMenuDelete: {
    borderTopWidth: 1,
    borderTopColor: colors.grayscale.gray100,
  },
  planMenuDeleteText: {
    ...typography.bodyMedium,
    color: colors.grayscale.gray700,
    fontWeight: fontWeight.semibold,
  },
  planMenuIconDelete: {
    opacity: 0.8,
  },
  fab: {
    position: 'absolute',
    right: spacing.base,
    bottom: spacing['2xl'],
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.grayscale.gray700,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: colors.grayscale.gray900,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  fabPressed: {
    opacity: 0.8,
    transform: [{ scale: 0.98 }],
  },
  fabText: {
    fontSize: 32,
    fontWeight: fontWeight.regular,
    color: colors.grayscale.white,
    lineHeight: 32,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    paddingHorizontal: spacing.lg,
  },
  deleteModal: {
    width: '100%',
    backgroundColor: colors.grayscale.white,
    borderRadius: spacing.lg,
    padding: spacing.lg,
  },
  deleteModalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  deleteModalTitle: {
    ...typography.bodyLarge,
    fontWeight: fontWeight.semibold,
    color: colors.grayscale.gray900,
    textAlign: 'center',
  },
  deleteModalClose: {
    position: 'absolute',
    right: 0,
    width: 28,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  deleteModalMessage: {
    ...typography.bodyMedium,
    color: colors.grayscale.gray700,
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
  deleteModalButtons: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  deleteCancelButton: {
    flex: 1,
    backgroundColor: colors.grayscale.gray100,
    borderRadius: spacing.base,
    paddingVertical: spacing.sm,
    alignItems: 'center',
  },
  deleteCancelText: {
    ...typography.bodyMedium,
    color: colors.grayscale.gray700,
    fontWeight: fontWeight.semibold,
  },
  deleteConfirmButton: {
    flex: 1,
    backgroundColor: colors.main.main,
    borderRadius: spacing.base,
    paddingVertical: spacing.sm,
    alignItems: 'center',
  },
  deleteConfirmText: {
    ...typography.bodyMedium,
    color: colors.grayscale.white,
    fontWeight: fontWeight.semibold,
  },
});

