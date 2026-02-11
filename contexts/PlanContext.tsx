import React, { createContext, useContext, useState, ReactNode } from 'react';
import { PlanCardStatus } from '../components/PlanCard';
import { Group } from '../types/group';

export type PlanType = 'DAY' | 'WEEK' | 'MONTH';

export interface PlanItem {
  id: string;
  title: string;
  time: string;
  status: PlanCardStatus;
  colorBar: string;
  type: PlanType;
  date: string; // YYYY-MM-DD
  groupId: string | null;
  isImportant: boolean;
}

interface PlanContextType {
  plans: PlanItem[];
  addPlan: (plan: Omit<PlanItem, 'id'>) => void;
  updatePlan: (planId: string, updates: Partial<Omit<PlanItem, 'id'>>) => void;
  deletePlan: (planId: string) => void;
  togglePlanStatus: (planId: string) => void;
  togglePlanImportant: (planId: string) => void;
  groups: Group[];
  addGroup: (name: string, color: string) => void;
  updateGroup: (groupId: string, name: string, color: string) => void;
  deleteGroup: (groupId: string) => void;
}

const PlanContext = createContext<PlanContextType | undefined>(undefined);

export function PlanProvider({ children }: { children: ReactNode }) {
  const [plans, setPlans] = useState<PlanItem[]>([]);
  const [groups, setGroups] = useState<Group[]>([]);

  const addPlan = (plan: Omit<PlanItem, 'id'>) => {
    const newPlan: PlanItem = {
      ...plan,
      id: Date.now().toString(),
    };
    setPlans((prev) => [...prev, newPlan]);
  };

  const updatePlan = (planId: string, updates: Partial<Omit<PlanItem, 'id'>>) => {
    setPlans((prev) =>
      prev.map((plan) => (plan.id === planId ? { ...plan, ...updates } : plan))
    );
  };

  const deletePlan = (planId: string) => {
    setPlans((prev) => prev.filter((plan) => plan.id !== planId));
  };

  const togglePlanStatus = (planId: string) => {
    setPlans((prev) =>
      prev.map((plan) =>
        plan.id === planId
          ? { ...plan, status: plan.status === 'TODO' ? 'DONE' : 'TODO' }
          : plan
      )
    );
  };

  const togglePlanImportant = (planId: string) => {
    setPlans((prev) =>
      prev.map((plan) =>
        plan.id === planId ? { ...plan, isImportant: !plan.isImportant } : plan
      )
    );
  };

  const addGroup = (name: string, color: string) => {
    const newGroup: Group = {
      id: Date.now().toString(),
      name,
      color,
    };
    setGroups((prev) => [...prev, newGroup]);
  };

  const updateGroup = (groupId: string, name: string, color: string) => {
    setGroups((prev) =>
      prev.map((group) => (group.id === groupId ? { ...group, name, color } : group))
    );
  };

  const deleteGroup = (groupId: string) => {
    setGroups((prev) => prev.filter((group) => group.id !== groupId));
    setPlans((prev) =>
      prev.map((plan) => (plan.groupId === groupId ? { ...plan, groupId: null } : plan))
    );
  };

  return (
    <PlanContext.Provider
      value={{
        plans,
        addPlan,
        updatePlan,
        deletePlan,
        togglePlanStatus,
        togglePlanImportant,
        groups,
        addGroup,
        updateGroup,
        deleteGroup,
      }}
    >
      {children}
    </PlanContext.Provider>
  );
}

export function usePlan() {
  const context = useContext(PlanContext);
  if (context === undefined) {
    throw new Error('usePlan must be used within a PlanProvider');
  }
  return context;
}

