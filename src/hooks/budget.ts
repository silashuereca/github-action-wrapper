import { computed, ComputedRef } from "vue";

import { TBudgetItem } from "../api/budget-items/api";

export function incomeTotal(incomes: number[]): number {
  return incomes.reduce((acc, income) => acc + income, 0);
}

export function monthlyBudgetTotal(amounts: number[]): number {
  return amounts.reduce((acc, amount) => acc + amount, 0);
}

export function leftToBudget(options: { budget: number; income: number }): number {
  const { budget, income } = options;
  return income - budget;
}

export function useBudget(state: { budgetItems: TBudgetItem[] }): {
  isNegativeBudget: ComputedRef<boolean>;
  leftToBudget: ComputedRef<number>;
  monthlyBudgetTotal: ComputedRef<number>;
  totalIncome: ComputedRef<number>;
} {
  const totalIncomeComputed = computed(() => {
    const incomes = state.budgetItems.filter((item) => item.type === "income").map((item) => item.budgeted_amount);
    return incomeTotal(incomes);
  });

  const monthlyBudgetTotalComputed = computed(() => {
    return monthlyBudgetTotal(
      state.budgetItems.filter((item) => item.type !== "income").map((item) => item.budgeted_amount),
    );
  });

  const leftToBudgetComputed = computed(() => {
    return leftToBudget({
      budget: monthlyBudgetTotalComputed.value,
      income: totalIncomeComputed.value,
    });
  });

  const isNegativeBudget = computed(() => {
    return leftToBudgetComputed.value < 0;
  });

  return {
    isNegativeBudget,
    leftToBudget: leftToBudgetComputed,
    monthlyBudgetTotal: monthlyBudgetTotalComputed,
    totalIncome: totalIncomeComputed,
  };
}
