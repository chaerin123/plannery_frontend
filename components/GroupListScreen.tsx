import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  SafeAreaView,
  Modal,
  TouchableWithoutFeedback,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { MainTabParamList } from '../types/navigation';
import { colors, spacing, typography, fontWeight } from '../src/constants';
import GroupCreateBottomSheet from './GroupCreateBottomSheet';
import { usePlan } from '../contexts/PlanContext';

type Props = NativeStackScreenProps<MainTabParamList, 'GroupList'>;

/**
 * 그룹 목록 화면
 * 그룹 목록 표시, 생성, 수정 기능 제공
 */
export default function GroupListScreen({ navigation, route }: Props) {
  // 그룹 상태는 Context나 전역 상태로 관리해야 하지만, 여기서는 로컬 상태로 관리
  // 실제로는 Context API나 Redux 등을 사용하는 것이 좋습니다
  const { groups, addGroup, updateGroup, deleteGroup } = usePlan();
  const [selectedGroupId, setSelectedGroupId] = React.useState<string | null>(null);
  const [isCreateModalVisible, setIsCreateModalVisible] = React.useState(false);
  const [isEditMode, setIsEditMode] = React.useState(false);
  const [editingGroup, setEditingGroup] = React.useState<Group | null>(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = React.useState(false);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = React.useState(false);
  const [deleteTarget, setDeleteTarget] = React.useState<Group | null>(null);

  const handleCreatePress = () => {
    setIsEditMode(false);
    setEditingGroup(null);
    setIsCreateModalVisible(true);
  };

  const handleEditPress = () => {
    if (isEditMode) {
      setIsEditMode(false);
      setEditingGroup(null);
      setHasUnsavedChanges(false);
    } else {
      // 수정 모드 진입
      setIsEditMode(true);
      setEditingGroup(null);
      setHasUnsavedChanges(false);
    }
  };

  const handleDeleteGroup = (group: Group) => {
    setDeleteTarget(group);
    setIsDeleteModalVisible(true);
  };

  const handleDeleteConfirm = () => {
    if (!deleteTarget) {
      return;
    }
    const targetId = deleteTarget.id;
    deleteGroup(targetId);
    setSelectedGroupId((prevSelectedId) => (prevSelectedId === targetId ? null : prevSelectedId));
    setDeleteTarget(null);
    setIsDeleteModalVisible(false);
  };

  const handleDeleteCancel = () => {
    setDeleteTarget(null);
    setIsDeleteModalVisible(false);
  };

  const handleGroupItemPress = (group: Group) => {
    if (isEditMode) {
      // 수정 모드: 그룹 수정 모달 열기
      setEditingGroup(group);
      setIsCreateModalVisible(true);
    } else {
      // 선택 모드: 그룹 선택
      if (selectedGroupId === group.id) {
        setSelectedGroupId(null); // 이미 선택된 그룹을 다시 클릭하면 선택 해제
      } else {
        setSelectedGroupId(group.id);
      }
    }
  };

  const handleCreateConfirm = (name: string, color: string) => {
    if (editingGroup) {
      // 수정
      updateGroup(editingGroup.id, name, color);
      // 수정 모드에서 수정이 완료되었음을 표시
      if (isEditMode) {
        setHasUnsavedChanges(true);
      }
    } else {
      // 생성
      addGroup(name, color);
    }
    setIsCreateModalVisible(false);
    setEditingGroup(null);
  };

  const handleBack = () => {
    navigation.goBack();
  };

  const handleSelectConfirm = () => {
    navigation.navigate({
      name: 'PlanCreate',
      params: { selectedGroupId },
      merge: true,
    });
    navigation.goBack();
  };

  const renderGroupItem = ({ item }: { item: Group }) => {
    const isSelected = selectedGroupId === item.id && !isEditMode;
    return (
      <View style={[styles.groupItem, isSelected && styles.groupItemSelected]}>
        {isSelected && <View style={styles.groupItemIndicator} />}
        {isEditMode && (
          <TouchableOpacity
            style={styles.deleteButton}
            onPress={(e) => {
              e.stopPropagation();
              handleDeleteGroup(item);
            }}
          >
            <Ionicons name="remove-circle-outline" size={24} color={colors.grayscale.gray500} />
          </TouchableOpacity>
        )}
        <TouchableOpacity
          style={styles.groupItemContent}
          onPress={() => handleGroupItemPress(item)}
        >
          <View style={[styles.colorCircle, { backgroundColor: item.color }]} />
          <Text style={[styles.groupName, isSelected && styles.groupNameSelected]}>
            {item.name}
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyText}>
        생성된 그룹이 없습니다.{'\n'}새로운 그룹을 만들어보세요!
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* 헤더 */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={colors.grayscale.gray900} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>그룹 설정</Text>
        {groups.length > 0 ? (
          <TouchableOpacity onPress={handleEditPress} style={styles.editButton}>
            <Ionicons
              name={isEditMode ? 'checkmark' : 'pencil-outline'}
              size={24}
              color={isEditMode ? colors.main.main : colors.grayscale.gray900}
            />
          </TouchableOpacity>
        ) : (
          <View style={styles.headerSpacer} />
        )}
      </View>

      {/* 그룹 목록 */}
      <FlatList
        data={groups}
        renderItem={renderGroupItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={[
          styles.listContainer,
          groups.length === 0 && styles.listContainerEmpty,
        ]}
        ListEmptyComponent={renderEmptyState}
      />

      {/* FAB 버튼 */}
      <TouchableOpacity
        style={styles.fab}
        onPress={handleCreatePress}
      >
        <Ionicons name="add" size={24} color={colors.grayscale.white} />
      </TouchableOpacity>

      {/* 그룹 생성/수정 모달 */}
      <GroupCreateBottomSheet
        visible={isCreateModalVisible}
        group={editingGroup}
        onClose={() => {
          setIsCreateModalVisible(false);
          setEditingGroup(null);
        }}
        onConfirm={handleCreateConfirm}
      />

      {/* 삭제 확인 모달 */}
      <Modal
        visible={isDeleteModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={handleDeleteCancel}
      >
        <TouchableWithoutFeedback onPress={handleDeleteCancel}>
          <View style={styles.modalOverlay}>
            <TouchableWithoutFeedback>
              <View style={styles.modalContainer}>
                <TouchableOpacity onPress={handleDeleteCancel} style={styles.modalCloseButton}>
                  <Ionicons name="close" size={18} color={colors.grayscale.gray700} />
                </TouchableOpacity>
                <Text style={styles.modalTitle}>
                  {deleteTarget ? `'${deleteTarget.name}' 그룹이 삭제돼요.` : '그룹이 삭제돼요.'}
                </Text>
                <Text style={styles.modalDescription}>
                  그룹이 삭제되면 복구할 수 없어요.{'\n'}그래도 삭제하시겠어요?
                </Text>
                <View style={styles.modalButtonRow}>
                  <TouchableOpacity style={styles.modalCancelButton} onPress={handleDeleteCancel}>
                    <Text style={styles.modalCancelButtonText}>취소하기</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.modalDeleteButton} onPress={handleDeleteConfirm}>
                    <Text style={styles.modalDeleteButtonText}>삭제하기</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

      {/* 그룹 선택 버튼 */}
      <TouchableOpacity
        style={[
          styles.selectButton,
          !selectedGroupId && styles.selectButtonDisabled,
        ]}
        onPress={handleSelectConfirm}
        disabled={!selectedGroupId}
      >
        <Text
          style={[
            styles.selectButtonText,
            !selectedGroupId && styles.selectButtonTextDisabled,
          ]}
        >
          선택하기
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.grayscale.white,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.grayscale.gray100,
  },
  backButton: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    ...typography.bodyLarge,
    fontWeight: fontWeight.semibold,
    color: colors.grayscale.gray900,
  },
  editButton: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerSpacer: {
    width: 32,
    height: 32,
  },
  listContainer: {
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.lg,
    paddingBottom: spacing['5xl'],
  },
  listContainerEmpty: {
    flex: 1,
    justifyContent: 'center',
  },
  groupItem: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    marginBottom: spacing.md,
    backgroundColor: colors.grayscale.white,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.sm,
  },
  groupItemSelected: {
    backgroundColor: 'rgba(141, 141, 245, 0.12)',
  },
  groupItemIndicator: {
    position: 'absolute',
    left: -4,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.main.main,
  },
  groupItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.sm,
  },
  deleteButton: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: spacing.xs,
  },
  colorCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    marginRight: spacing.md,
  },
  groupName: {
    ...typography.bodyLarge,
    color: colors.grayscale.gray900,
  },
  groupNameSelected: {
    fontWeight: fontWeight.semibold,
    color: colors.main.main,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing['2xl'],
  },
  emptyText: {
    ...typography.bodyMedium,
    color: colors.grayscale.gray500,
    textAlign: 'center',
    lineHeight: 24,
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: spacing['5xl'] + spacing.base,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#374151',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
    shadowColor: colors.grayscale.gray900,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  selectButton: {
    backgroundColor: colors.main.main,
    marginHorizontal: spacing.base,
    marginBottom: spacing.lg,
    paddingVertical: spacing.base,
    borderRadius: spacing.base,
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectButtonDisabled: {
    backgroundColor: colors.grayscale.gray300,
  },
  selectButtonText: {
    ...typography.bodyLarge,
    fontWeight: fontWeight.semibold,
    color: colors.grayscale.white,
  },
  selectButtonTextDisabled: {
    color: colors.grayscale.gray500,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
  },
  modalContainer: {
    width: '100%',
    backgroundColor: colors.grayscale.white,
    borderRadius: spacing.lg,
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.lg,
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
  modalTitle: {
    ...typography.bodyLarge,
    fontWeight: fontWeight.semibold,
    color: colors.grayscale.gray900,
    textAlign: 'center',
    marginTop: spacing.md,
  },
  modalDescription: {
    ...typography.bodyMedium,
    color: colors.grayscale.gray700,
    textAlign: 'center',
    marginTop: spacing.sm,
    lineHeight: 22,
  },
  modalButtonRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.lg,
  },
  modalCancelButton: {
    flex: 1,
    backgroundColor: colors.grayscale.gray100,
    borderRadius: spacing.base,
    paddingVertical: spacing.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalCancelButtonText: {
    ...typography.bodyMedium,
    fontWeight: fontWeight.semibold,
    color: colors.grayscale.gray700,
  },
  modalDeleteButton: {
    flex: 1,
    backgroundColor: colors.main.main,
    borderRadius: spacing.base,
    paddingVertical: spacing.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalDeleteButtonText: {
    ...typography.bodyMedium,
    fontWeight: fontWeight.semibold,
    color: colors.grayscale.white,
  },
});
