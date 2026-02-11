import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  FlatList,
  Modal,
  TouchableWithoutFeedback,
  ScrollView,
  LayoutAnimation,
  Platform,
  UIManager,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { MainTabParamList } from '../types/navigation';
import { colors, spacing, typography, fontWeight } from '../src/constants';

type Props = BottomTabScreenProps<MainTabParamList, 'Plan'>;
type ViewMode = 'Day' | 'Week' | 'Month';

type AchievementItem = {
  id: string;
  title: string;
  isDone: boolean;
  isImportant?: boolean;
};

type AchievementGroup = {
  id: string;
  label: string;
  items: AchievementItem[];
};

const PERIOD_LABELS: Record<ViewMode, string[]> = {
  Day: ['6월 29일 - 7월 5일'],
  Week: ['6월 4주차'],
  Month: ['2025년'],
};

const DUMMY_DATA: Record<ViewMode, AchievementGroup[]> = {
  Day: [
    {
      id: 'day-0629',
      label: '6월 29일 일요일',
      items: [
        { id: 'd1', title: '수학 모의고사 1회분 풀기', isDone: true, isImportant: true },
        { id: 'd2', title: '국어 모의고사 1회분 풀기', isDone: true, isImportant: true },
        { id: 'd3', title: '수학 모의고사 1회분 풀기', isDone: true },
        { id: 'd4', title: '수학 모의고사 1회분 풀기', isDone: false },
        { id: 'd5', title: '수학 모의고사 1회분 풀기', isDone: false },
      ],
    },
    {
      id: 'day-0630',
      label: '6월 30일 월요일',
      items: [
        { id: 'd6', title: '수학 모의고사 1회분 풀기', isDone: true, isImportant: true },
        { id: 'd7', title: '국어 모의고사 1회분 풀기', isDone: true, isImportant: true },
        { id: 'd8', title: '수학 모의고사 1회분 풀기', isDone: true },
      ],
    },
    {
      id: 'day-0701',
      label: '7월 1일 화요일',
      items: [
        { id: 'd9', title: '수학 모의고사 1회분 풀기', isDone: true, isImportant: true },
        { id: 'd10', title: '국어 모의고사 1회분 풀기', isDone: true, isImportant: true },
        { id: 'd11', title: '수학 모의고사 1회분 풀기', isDone: true },
        { id: 'd12', title: '수학 모의고사 1회분 풀기', isDone: false },
      ],
    },
    {
      id: 'day-0702',
      label: '7월 2일 수요일',
      items: [
        { id: 'd13', title: '수학 모의고사 1회분 풀기', isDone: true, isImportant: true },
        { id: 'd14', title: '수학 모의고사 1회분 풀기', isDone: true, isImportant: true },
        { id: 'd15', title: '수학 모의고사 1회분 풀기', isDone: true },
        { id: 'd16', title: '수학 모의고사 1회분 풀기', isDone: false },
        { id: 'd17', title: '수학 모의고사 1회분 풀기', isDone: false },
      ],
    },
  ],
  Week: [
    {
      id: 'week-1',
      label: '6월 1주차',
      items: [
        { id: 'w1', title: '수학 모의고사 1회분 풀기', isDone: true, isImportant: true },
        { id: 'w2', title: '국어 모의고사 1회분 풀기', isDone: true, isImportant: true },
        { id: 'w3', title: '수학 모의고사 1회분 풀기', isDone: true },
        { id: 'w4', title: '수학 모의고사 1회분 풀기', isDone: false },
      ],
    },
    {
      id: 'week-2',
      label: '6월 2주차',
      items: [
        { id: 'w5', title: '수학 모의고사 1회분 풀기', isDone: true, isImportant: true },
        { id: 'w6', title: '수학 모의고사 1회분 풀기', isDone: true, isImportant: true },
        { id: 'w7', title: '수학 모의고사 1회분 풀기', isDone: true },
      ],
    },
    {
      id: 'week-3',
      label: '6월 3주차',
      items: [
        { id: 'w8', title: '수학 모의고사 1회분 풀기', isDone: true, isImportant: true },
        { id: 'w9', title: '국어 모의고사 1회분 풀기', isDone: true, isImportant: true },
        { id: 'w10', title: '수학 모의고사 1회분 풀기', isDone: true },
        { id: 'w11', title: '수학 모의고사 1회분 풀기', isDone: false },
      ],
    },
    {
      id: 'week-4',
      label: '6월 4주차',
      items: [
        { id: 'w12', title: '수학 모의고사 1회분 풀기', isDone: true, isImportant: true },
        { id: 'w13', title: '국어 모의고사 1회분 풀기', isDone: true, isImportant: true },
        { id: 'w14', title: '수학 모의고사 1회분 풀기', isDone: true },
        { id: 'w15', title: '수학 모의고사 1회분 풀기', isDone: false },
      ],
    },
  ],
  Month: [
    {
      id: 'month-jan',
      label: '1월',
      items: [
        { id: 'm1', title: '수학 모의고사 1회분 풀기', isDone: true, isImportant: true },
        { id: 'm2', title: '국어 모의고사 1회분 풀기', isDone: true, isImportant: true },
        { id: 'm3', title: '수학 모의고사 1회분 풀기', isDone: true },
        { id: 'm4', title: '수학 모의고사 1회분 풀기', isDone: false },
      ],
    },
    {
      id: 'month-feb',
      label: '2월',
      items: [
        { id: 'm5', title: '수학 모의고사 1회분 풀기', isDone: true, isImportant: true },
        { id: 'm6', title: '수학 모의고사 1회분 풀기', isDone: true, isImportant: true },
        { id: 'm7', title: '수학 모의고사 1회분 풀기', isDone: true },
      ],
    },
    {
      id: 'month-mar',
      label: '3월',
      items: [
        { id: 'm8', title: '수학 모의고사 1회분 풀기', isDone: true, isImportant: true },
        { id: 'm9', title: '국어 모의고사 1회분 풀기', isDone: true, isImportant: true },
        { id: 'm10', title: '수학 모의고사 1회분 풀기', isDone: true },
        { id: 'm11', title: '수학 모의고사 1회분 풀기', isDone: false },
      ],
    },
    {
      id: 'month-apr',
      label: '4월',
      items: [
        { id: 'm12', title: '수학 모의고사 1회분 풀기', isDone: true, isImportant: true },
        { id: 'm13', title: '국어 모의고사 1회분 풀기', isDone: true, isImportant: true },
        { id: 'm14', title: '수학 모의고사 1회분 풀기', isDone: true },
        { id: 'm15', title: '수학 모의고사 1회분 풀기', isDone: false },
      ],
    },
  ],
};

function AchievementHeader() {
  return (
    <LinearGradient colors={[colors.main.main, colors.main.main2]} style={styles.header}>
      <Text style={styles.headerTitle}>달성</Text>
    </LinearGradient>
  );
}

function AchievementTabs({
  value,
  onChange,
}: {
  value: ViewMode;
  onChange: (mode: ViewMode) => void;
}) {
  const handlePress = (mode: ViewMode) => {
    if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
      UIManager.setLayoutAnimationEnabledExperimental(true);
    }
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    onChange(mode);
  };

  return (
    <View style={styles.tabsContainer}>
      {(['Day', 'Week', 'Month'] as ViewMode[]).map((mode) => (
        <TouchableOpacity
          key={mode}
          style={styles.tabButton}
          onPress={() => handlePress(mode)}
          activeOpacity={0.8}
        >
          <Text style={[styles.tabText, value === mode && styles.tabTextActive]}>
            {mode}
          </Text>
          {value === mode && <View style={styles.tabIndicator} />}
        </TouchableOpacity>
      ))}
    </View>
  );
}

function DateNavigator({
  label,
  onPrev,
  onNext,
}: {
  label: string;
  onPrev: () => void;
  onNext: () => void;
}) {
  return (
    <View style={styles.periodNav}>
      <TouchableOpacity style={styles.arrowButton} onPress={onPrev}>
        <Ionicons name="chevron-back" size={22} color={colors.grayscale.gray900} />
      </TouchableOpacity>
      <Text style={styles.periodText}>{label}</Text>
      <TouchableOpacity style={styles.arrowButton} onPress={onNext}>
        <Ionicons name="chevron-forward" size={22} color={colors.grayscale.gray900} />
      </TouchableOpacity>
    </View>
  );
}

function AchievementItemRow({ item }: { item: AchievementItem }) {
  return (
    <View style={styles.itemRow}>
      <View style={[styles.checkIcon, item.isDone ? styles.checkDone : styles.checkTodo]}>
        {item.isDone && <Ionicons name="checkmark" size={14} color={colors.grayscale.white} />}
      </View>
      {item.isImportant && (
        <View style={styles.importantBadge}>
          <Text style={styles.importantBadgeText}>중요</Text>
        </View>
      )}
      <Text style={styles.itemText} numberOfLines={1}>
        {item.title}
      </Text>
    </View>
  );
}

function AchievementDayCard({
  group,
  onPress,
}: {
  group: AchievementGroup;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity style={styles.card} activeOpacity={0.85} onPress={onPress}>
      <Text style={styles.cardTitle}>{group.label}</Text>
      {group.items.map((item) => (
        <AchievementItemRow key={item.id} item={item} />
      ))}
    </TouchableOpacity>
  );
}

function AchievementDetailBottomSheet({
  visible,
  group,
  onClose,
}: {
  visible: boolean;
  group: AchievementGroup | null;
  onClose: () => void;
}) {
  return (
    <Modal visible={visible} transparent={true} animationType="slide" onRequestClose={onClose}>
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.modalOverlay}>
          <TouchableWithoutFeedback>
            <View style={styles.detailSheet}>
              <View style={styles.detailHeader}>
                <Text style={styles.detailTitle}>{group?.label}</Text>
                <TouchableOpacity style={styles.detailClose} onPress={onClose}>
                  <Ionicons name="close" size={20} color={colors.grayscale.gray700} />
                </TouchableOpacity>
              </View>
              <ScrollView>
                {group?.items.map((item) => (
                  <AchievementItemRow key={item.id} item={item} />
                ))}
              </ScrollView>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}

export default function PlanScreen({}: Props) {
  const [viewMode, setViewMode] = useState<ViewMode>('Day');
  const [periodIndexByMode, setPeriodIndexByMode] = useState<Record<ViewMode, number>>({
    Day: 0,
    Week: 0,
    Month: 0,
  });
  const [selectedGroup, setSelectedGroup] = useState<AchievementGroup | null>(null);

  const data = useMemo(() => DUMMY_DATA[viewMode], [viewMode]);
  const periodLabel = PERIOD_LABELS[viewMode][periodIndexByMode[viewMode]] ?? '';

  const handlePrev = () => {
    setPeriodIndexByMode((prev) => ({
      ...prev,
      [viewMode]: Math.max(prev[viewMode] - 1, 0),
    }));
  };

  const handleNext = () => {
    setPeriodIndexByMode((prev) => ({
      ...prev,
      [viewMode]: Math.min(prev[viewMode] + 1, PERIOD_LABELS[viewMode].length - 1),
    }));
  };

  return (
    <SafeAreaView style={styles.container}>
      <AchievementHeader />
      <View style={styles.whitePanel}>
        <View style={styles.tabsWrapper}>
          <AchievementTabs value={viewMode} onChange={setViewMode} />
        </View>
        <DateNavigator label={periodLabel} onPrev={handlePrev} onNext={handleNext} />
        <FlatList
          data={data}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <AchievementDayCard group={item} onPress={() => setSelectedGroup(item)} />
          )}
          contentContainerStyle={styles.listContent}
          numColumns={2}
          columnWrapperStyle={styles.listColumn}
          showsVerticalScrollIndicator={false}
        />
      </View>
      <AchievementDetailBottomSheet
        visible={selectedGroup !== null}
        group={selectedGroup}
        onClose={() => setSelectedGroup(null)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.grayscale.gray50,
  },
  header: {
    paddingTop: spacing.lg,
    paddingBottom: spacing.lg,
    paddingHorizontal: spacing.base,
  },
  headerTitle: {
    ...typography.h2,
    color: colors.grayscale.white,
    fontWeight: fontWeight.bold,
  },
  tabsWrapper: {
    backgroundColor: colors.grayscale.white,
    paddingHorizontal: spacing.base,
    marginTop: 0,
  },
  whitePanel: {
    flex: 1,
    backgroundColor: colors.grayscale.white,
    borderTopLeftRadius: spacing.xl,
    borderTopRightRadius: spacing.xl,
    marginTop: -spacing.lg,
    overflow: 'hidden',
  },
  tabsContainer: {
    backgroundColor: colors.grayscale.white,
    borderRadius: 0,
    flexDirection: 'row',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.base,
    borderBottomWidth: 1,
    borderBottomColor: colors.grayscale.gray200,
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.xs,
  },
  tabText: {
    ...typography.bodyLarge,
    color: colors.grayscale.gray300,
  },
  tabTextActive: {
    color: colors.main.main,
    fontWeight: fontWeight.semibold,
  },
  tabIndicator: {
    marginTop: spacing.xs,
    width: 72,
    height: 2,
    borderRadius: 1,
    backgroundColor: colors.main.main,
  },
  periodNav: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.base,
    paddingHorizontal: spacing.base,
  },
  arrowButton: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  periodText: {
    ...typography.bodyLarge,
    fontWeight: fontWeight.semibold,
    color: colors.grayscale.gray900,
  },
  listContent: {
    paddingHorizontal: spacing.base,
    paddingTop: spacing.base,
    paddingBottom: spacing['2xl'],
  },
  listColumn: {
    gap: spacing.base,
    marginBottom: spacing.base,
  },
  card: {
    flex: 1,
    backgroundColor: colors.grayscale.white,
    borderRadius: 16,
    padding: spacing.base,
    shadowColor: colors.grayscale.gray900,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 2,
  },
  cardTitle: {
    ...typography.bodyLarge,
    fontWeight: fontWeight.semibold,
    color: colors.grayscale.gray900,
    marginBottom: spacing.sm,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  itemText: {
    ...typography.bodyMedium,
    color: colors.grayscale.gray900,
    flex: 1,
  },
  checkIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkDone: {
    backgroundColor: colors.main.main,
  },
  checkTodo: {
    backgroundColor: colors.grayscale.gray200,
  },
  importantBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: spacing.base,
    backgroundColor: colors.main.sub1,
  },
  importantBadgeText: {
    ...typography.bodySmall,
    color: colors.main.main,
    fontWeight: fontWeight.semibold,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.base,
  },
  detailSheet: {
    width: '100%',
    maxHeight: '70%',
    backgroundColor: colors.grayscale.white,
    borderRadius: spacing.lg,
    padding: spacing.base,
  },
  detailHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.base,
  },
  detailTitle: {
    ...typography.bodyLarge,
    fontWeight: fontWeight.semibold,
    color: colors.grayscale.gray900,
  },
  detailClose: {
    width: 28,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
