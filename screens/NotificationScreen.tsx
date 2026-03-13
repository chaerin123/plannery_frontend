import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { MainTabParamList } from '../types/navigation';
import { colors, spacing, typography, fontWeight } from '../src/constants';

type Props = BottomTabScreenProps<MainTabParamList, 'Notification'>;

type NotificationItem = {
  id: string;
  title: string;
  message: string;
  date: string;
};

const NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'n1',
    title: '계획을 달성했어요! 👏',
    message: '“수학 모의고사 1회분 풀기” 계획을 완료했어요!',
    date: '2월 15일',
  },
  {
    id: 'n2',
    title: '계획을 달성했어요! 👏',
    message: '“국어 모의고사 1회분 풀기” 계획을 완료했어요!',
    date: '2월 15일',
  },
  {
    id: 'n3',
    title: '계획을 달성했어요! 👏',
    message: '“명상하기” 계획을 완료했어요!',
    date: '2월 15일',
  },
  {
    id: 'n4',
    title: '계획을 달성했어요! 👏',
    message: '“영어 단어 100개 외우기” 계획을 완료했어요!',
    date: '2월 14일',
  },
  {
    id: 'n5',
    title: '계획을 달성했어요! 👏',
    message: '“화학 10문제 풀기” 계획을 완료했어요!',
    date: '2월 14일',
  },
  {
    id: 'n6',
    title: '계획을 달성했어요! 👏',
    message: '“영어 모의고사 풀기” 계획을 완료했어요!',
    date: '2월 13일',
  },
];

function NotificationRow({ item }: { item: NotificationItem }) {
  return (
    <View style={styles.row}>
      <View style={styles.iconCircle}>
        <Ionicons name="notifications-outline" size={18} color={colors.grayscale.gray500} />
      </View>
      <View style={styles.textColumn}>
        <Text style={styles.rowTitle}>{item.title}</Text>
        <Text style={styles.rowMessage}>{item.message}</Text>
        <Text style={styles.rowDate}>{item.date}</Text>
      </View>
    </View>
  );
}

export default function NotificationScreen({ navigation }: Props) {
  return (
    <View style={styles.container}>
      <SafeAreaView edges={['top']} style={styles.header}>
        <View style={styles.headerRow}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Ionicons name="chevron-back" size={22} color={colors.grayscale.gray900} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>알림</Text>
          <View style={styles.headerSpacer} />
        </View>
      </SafeAreaView>
      <FlatList
        data={NOTIFICATIONS}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <NotificationRow item={item} />}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.grayscale.white,
  },
  header: {
    backgroundColor: colors.grayscale.white,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.base,
    paddingBottom: spacing.sm,
  },
  backButton: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    ...typography.bodyLarge,
    fontWeight: fontWeight.semibold,
    color: colors.grayscale.gray900,
  },
  headerSpacer: {
    width: 36,
  },
  listContent: {
    paddingHorizontal: spacing.base,
    paddingTop: spacing.sm,
    paddingBottom: spacing['2xl'],
  },
  row: {
    flexDirection: 'row',
    gap: spacing.md,
    paddingVertical: spacing.base,
    borderBottomWidth: 1,
    borderBottomColor: colors.grayscale.gray100,
  },
  iconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.grayscale.gray200,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  textColumn: {
    flex: 1,
    gap: spacing.xs,
  },
  rowTitle: {
    ...typography.bodyMedium,
    fontWeight: fontWeight.semibold,
    color: colors.grayscale.gray900,
  },
  rowMessage: {
    ...typography.bodySmall,
    color: colors.grayscale.gray700,
  },
  rowDate: {
    ...typography.bodySmall,
    color: colors.grayscale.gray400,
  },
});
