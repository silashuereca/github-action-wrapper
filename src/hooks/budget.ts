import { computed, ComputedRef } from "vue";

import { TBudgetExpenseRow } from "../api/budget-expenses/api";
import { TBudgetItem } from "../api/budget-items/api";

export type TBudget = {
  budgetExpenses: TBudgetExpenseRow[];
  budgetItems: TBudgetItem[];
};

export function getTotal(amounts: number[]): number {
  return amounts.reduce((acc, amount) => acc + amount, 0);
}

export function useBudget(state: TBudget): {
  isNegativeBudget: ComputedRef<boolean>;
  leftToBudget: ComputedRef<number>;
  monthlyBudgetTotal: ComputedRef<number>;
  overSpentOnTotalIncome: ComputedRef<boolean>;
  percentageIsOverBudget: ComputedRef<boolean>;
  percentageOfBudgetSpent: ComputedRef<number>;
  remainingToSpendTotal: ComputedRef<number>;
  totalExpenses: ComputedRef<number>;
  totalIncome: ComputedRef<number>;
} {
  const totalIncome = computed(() => {
    const incomes = state.budgetItems.filter((item) => item.type === "income").map((item) => item.budgeted_amount);
    return getTotal(incomes);
  });

  const monthlyBudgetTotal = computed(() => {
    return getTotal(state.budgetItems.filter((item) => item.type !== "income").map((item) => item.budgeted_amount));
  });

  const leftToBudget = computed(() => {
    return totalIncome.value - monthlyBudgetTotal.value;
  });

  const isNegativeBudget = computed(() => {
    return leftToBudget.value < 0;
  });

  const totalExpenses = computed(() => {
    const expenses = state.budgetExpenses.map((item) => item.amount);
    return getTotal(expenses);
  });

  const remainingToSpendTotal = computed(() => {
    return totalIncome.value - totalExpenses.value;
  });

  const percentageOfBudgetSpent = computed(() => {
    if (monthlyBudgetTotal.value === 0) {
      return 0;
    }
    return (totalExpenses.value / monthlyBudgetTotal.value) * 100;
  });

  const percentageIsOverBudget = computed(() => {
    if (monthlyBudgetTotal.value === 0) {
      return false;
    }
    const percentage = (totalExpenses.value / monthlyBudgetTotal.value) * 100;
    return percentage > 100;
  });

  const overSpentOnTotalIncome = computed(() => {
    return totalExpenses.value > totalIncome.value;
  });

  return {
    isNegativeBudget,
    leftToBudget,
    monthlyBudgetTotal,
    overSpentOnTotalIncome,
    percentageIsOverBudget,
    percentageOfBudgetSpent,
    remainingToSpendTotal,
    totalExpenses,
    totalIncome,
  };
}
