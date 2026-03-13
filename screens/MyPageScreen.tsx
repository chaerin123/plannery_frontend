import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  Modal,
  TouchableWithoutFeedback,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { MainTabParamList } from '../types/navigation';
import { useAuth } from '../contexts/AuthContext';
import { useProfile } from '../contexts/ProfileContext';
import { colors, spacing, typography, fontWeight } from '../src/constants';

type Props = NativeStackScreenProps<MainTabParamList, 'MyPage'>;

export default function MyPageScreen({ navigation }: Props) {
  const { logout } = useAuth();
  const { nickname, studyGoals, profileImageUri } = useProfile();
  const [isWithdrawModalVisible, setIsWithdrawModalVisible] = React.useState(false);
  const [infoModalType, setInfoModalType] = React.useState<'terms' | 'privacy' | null>(null);
  const hasGoals = studyGoals.length > 0;

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <LinearGradient
          colors={[colors.main.main, colors.main.main2]}
          style={styles.header}
        >
          <SafeAreaView edges={['top']} style={styles.headerContent}>
            <View style={styles.profileHeader}>
              <TouchableOpacity
                style={styles.profileEditButton}
                onPress={() => navigation.navigate('ProfileEdit')}
              >
                <Text style={styles.profileEditText}>프로필 편집</Text>
                <Ionicons name="chevron-forward" size={14} color={colors.grayscale.white} />
              </TouchableOpacity>
              <Image
                source={
                  profileImageUri
                    ? { uri: profileImageUri }
                    : require('../assets/planner_face_icon.png')
                }
                style={styles.profileImage}
              />
              <Text style={styles.profileName}>{nickname} 님</Text>
              <Text style={styles.profileSubText}>
                오늘도 공부 목표를 향해 화이팅! 💪
              </Text>
            </View>

            <View style={styles.badgeRow}>
            {hasGoals ? (
              studyGoals.map((label) => (
                <View key={label} style={styles.badge}>
                  <Text style={styles.badgeText}>{label}</Text>
                </View>
              ))
            ) : (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>공부 목표를 설정해주세요!</Text>
              </View>
            )}
            </View>
          </SafeAreaView>
        </LinearGradient>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>이용 안내</Text>
          <TouchableOpacity
            style={styles.listItem}
            onPress={() => setInfoModalType('terms')}
          >
            <View style={styles.listItemLeft}>
              <Ionicons name="document-text-outline" size={18} color={colors.grayscale.gray700} />
              <Text style={styles.listItemText}>서비스 이용약관</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={colors.grayscale.gray300} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.listItem}
            onPress={() => setInfoModalType('privacy')}
          >
            <View style={styles.listItemLeft}>
              <Ionicons name="shield-checkmark-outline" size={18} color={colors.grayscale.gray700} />
              <Text style={styles.listItemText}>개인정보 처리방침</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={colors.grayscale.gray300} />
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>계정 관리</Text>
          <TouchableOpacity style={styles.listItem} onPress={logout}>
            <View style={styles.listItemLeft}>
              <Ionicons name="log-out-outline" size={18} color={colors.grayscale.gray700} />
              <Text style={styles.listItemText}>로그아웃</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={colors.grayscale.gray300} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.listItem}
            onPress={() => setIsWithdrawModalVisible(true)}
          >
            <View style={styles.listItemLeft}>
              <Ionicons name="person-remove-outline" size={18} color={colors.grayscale.gray700} />
              <Text style={styles.listItemText}>회원탈퇴</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={colors.grayscale.gray300} />
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* 이용약관/개인정보 모달 */}
      <Modal
        visible={infoModalType !== null}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setInfoModalType(null)}
      >
        <TouchableWithoutFeedback onPress={() => setInfoModalType(null)}>
          <View style={styles.modalOverlay}>
            <TouchableWithoutFeedback>
              <View style={styles.infoModal}>
                <TouchableOpacity
                  style={styles.modalCloseButton}
                  onPress={() => setInfoModalType(null)}
                >
                  <Ionicons name="close" size={18} color={colors.grayscale.gray700} />
                </TouchableOpacity>
                <Text style={styles.infoModalTitle}>
                  {infoModalType === 'terms' ? '서비스 이용약관' : '개인정보 처리방침'}
                </Text>
                <Text style={styles.infoModalText}>
                  {infoModalType === 'terms'
                    ? '플래너리 서비스 이용을 위한 기본 약관을 확인하는 화면입니다.'
                    : '개인정보 수집 및 이용에 대한 안내를 확인하는 화면입니다.'}
                </Text>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

      {/* 회원탈퇴 모달 */}
      <Modal
        visible={isWithdrawModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setIsWithdrawModalVisible(false)}
      >
        <TouchableWithoutFeedback onPress={() => setIsWithdrawModalVisible(false)}>
          <View style={styles.modalOverlay}>
            <TouchableWithoutFeedback>
              <View style={styles.withdrawModal}>
                <TouchableOpacity
                  style={styles.modalCloseButton}
                  onPress={() => setIsWithdrawModalVisible(false)}
                >
                  <Ionicons name="close" size={18} color={colors.grayscale.gray700} />
                </TouchableOpacity>
                <Text style={styles.withdrawTitle}>정말 탈퇴하시겠어요?</Text>
                <Text style={styles.withdrawDescription}>
                  그동안의 데이터가 모두 사라져요.{'\n'}그래도 계속하시겠어요?
                </Text>
                <View style={styles.withdrawButtonRow}>
                  <TouchableOpacity
                    style={styles.withdrawCancelButton}
                    onPress={() => setIsWithdrawModalVisible(false)}
                  >
                    <Text style={styles.withdrawCancelText}>취소하기</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.withdrawConfirmButton}
                    onPress={() => {
                      console.log('회원탈퇴 진행');
                      setIsWithdrawModalVisible(false);
                    }}
                  >
                    <Text style={styles.withdrawConfirmText}>탈퇴하기</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.grayscale.gray50,
  },
  scrollContent: {
    paddingBottom: spacing['2xl'],
  },
  header: {
    backgroundColor: colors.main.main,
  },
  headerContent: {
    paddingTop: spacing.xl,
    paddingHorizontal: spacing.base,
    paddingBottom: spacing['2xl'],
    minHeight: 260,
  },
  profileHeader: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: spacing.md,
    paddingBottom: spacing.md,
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.grayscale.white,
    borderWidth: 2,
    borderColor: colors.grayscale.white,
  },
  profileName: {
    ...typography.h3,
    fontWeight: fontWeight.bold,
    color: colors.grayscale.white,
    marginTop: spacing.base,
    textAlign: 'center',
  },
  profileSubText: {
    ...typography.bodySmall,
    color: colors.grayscale.white,
    marginTop: spacing.xs,
    textAlign: 'center',
  },
  profileEditButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    position: 'absolute',
    right: 0,
    top: spacing.sm,
  },
  profileEditText: {
    ...typography.bodySmall,
    color: colors.grayscale.white,
  },
  badgeRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginTop: spacing.lg,
    justifyContent: 'center',
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.22)',
  },
  badgeText: {
    ...typography.bodySmall,
    color: colors.grayscale.white,
  },
  section: {
    paddingHorizontal: spacing.base,
    paddingTop: spacing.lg,
  },
  sectionTitle: {
    ...typography.bodyMedium,
    fontWeight: fontWeight.semibold,
    color: colors.grayscale.gray700,
    marginBottom: spacing.sm,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.grayscale.white,
    borderRadius: spacing.base,
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.md,
    marginBottom: spacing.sm,
    shadowColor: colors.grayscale.gray900,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 2,
  },
  listItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  listItemText: {
    ...typography.bodyMedium,
    color: colors.grayscale.gray900,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
  },
  infoModal: {
    width: '100%',
    backgroundColor: colors.grayscale.white,
    borderRadius: spacing.lg,
    padding: spacing.lg,
  },
  infoModalTitle: {
    ...typography.bodyLarge,
    fontWeight: fontWeight.semibold,
    color: colors.grayscale.gray900,
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  infoModalText: {
    ...typography.bodyMedium,
    color: colors.grayscale.gray700,
    textAlign: 'center',
    lineHeight: 22,
  },
  modalCloseButton: {
    position: 'absolute',
    top: spacing.md,
    right: spacing.md,
    width: 28,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  withdrawModal: {
    width: '100%',
    backgroundColor: colors.grayscale.white,
    borderRadius: spacing.lg,
    padding: spacing.lg,
  },
  withdrawTitle: {
    ...typography.bodyLarge,
    fontWeight: fontWeight.semibold,
    color: colors.grayscale.gray900,
    textAlign: 'center',
    marginTop: spacing.md,
  },
  withdrawDescription: {
    ...typography.bodyMedium,
    color: colors.grayscale.gray700,
    textAlign: 'center',
    marginTop: spacing.sm,
    lineHeight: 22,
  },
  withdrawButtonRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.lg,
  },
  withdrawCancelButton: {
    flex: 1,
    backgroundColor: colors.grayscale.gray100,
    borderRadius: spacing.base,
    paddingVertical: spacing.sm,
    alignItems: 'center',
  },
  withdrawCancelText: {
    ...typography.bodyMedium,
    fontWeight: fontWeight.semibold,
    color: colors.grayscale.gray700,
  },
  withdrawConfirmButton: {
    flex: 1,
    backgroundColor: colors.main.main,
    borderRadius: spacing.base,
    paddingVertical: spacing.sm,
    alignItems: 'center',
  },
  withdrawConfirmText: {
    ...typography.bodyMedium,
    fontWeight: fontWeight.semibold,
    color: colors.grayscale.white,
  },
});

