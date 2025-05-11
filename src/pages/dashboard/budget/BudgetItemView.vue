<template>
  <div>
    <div v-show="state.loading.budgetItem" class="flex justify-center items-center">
      <ProgressSpinner />
    </div>
    <Card v-show="!state.loading.budgetItem" class=" max-w-2xl mx-auto">
      <template #header>
        <div class="p-3">
          <button type="button" class="flex items-center cursor-pointer" @click="goBackToBudgetMonth()">
            <IconArrowLeft class="size-3 text-gray-500" />
            <h2 class="font-bold ml-2" v-text="renderTypeHeader(state.budgetItem?.type)" />
          </button>
        </div>
      </template>
      <template #content>
        <div class="flex items-center justify-between">
          <div>
            <h2 class="text-2xl font-bold" v-text="state.budgetItem?.name" />
            <div class="flex items-center">
              <p class="text-green-500 text-xs" v-text="formatCurrency(totalExpenses)" />
              <p class="text-xs mx-2">
                spent of
              </p>
              <p class="text-gray-500 text-xs" v-text="formatCurrency(budgetAmount())" />
            </div>
          </div>
          
      
          <div>
            <p class="text-gray-500 text-xs text-end">
              remaining
            </p>
            <h2 class="text-2xl font-bold ml-2" v-text="formatCurrency(remainingBudget)" />
          </div>
        </div>

        <section v-show="state.expenses.length" class="mt-5">
          <DataTable :value="state.expenses">
            <Column field="name" header="Name">
              <template #body="slotProps">
                <p v-text="slotProps.data.name" />
                <p class="text-gray-500 text-xs" v-text="formatDate(slotProps.data.created_at)" />
              </template>
            </Column>
            <Column field="amount" header="Amount">
              <template #body="slotProps">
                <div class="flex justify-between items-center">
                  <p v-text="formatCurrency(slotProps.data.amount)" />
                  <button type="button" @click="toggle($event, slotProps.data)">
                    <IconElipsisVertical class="size-6 text-gray-500 ml-4" />
                  </button>
                </div>
                <ConfirmDialog :group="slotProps.data.id" />
              </template>
            </Column>
          </DataTable>
        </section>

        <Popover ref="op">
          <div class="flex flex-col">
            <Button
              type="button"
              size="small"
              severity="secondary"
              label="Edit"
              @click="editTransaction()"
            />
            <Button
              class="mt-4"
              type="button"
              size="small"
              severity="danger"
              label="Delete"
              @click="deleteTransaction()"
            />
          </div>
        </Popover>


        <Button
          class="mt-5"
          type="button"
          label="Add Transaction"
          size="small"
          severity="secondary"
          @click="addOrEditTransaction()"
        />

        <Dialog
          v-model:visible="state.addOrEditTransaction"
          modal
          header="Add Transaction"
          class="w-full mx-4 sm:mx-0 sm:w-96"
          :closable="false"
        >
          <form class="flex flex-col gap-3" @submit.prevent="createOrEditTransaction()">
            <InputText
              v-model="state.form.name"
              label="Name"
              placeholder="Transaction Name"
              :invalid="v$.state.form.name.$errors.length > 0"
            />
            <InputText
              inputmode="numeric"
              :value="formattedAmount"
              :invalid="v$.state.form.amount.$errors.length > 0"
              @input="handleInput"
              @keydown="handleKeydown"
              @blur="handleBlur"
            />
            <div>
              <Button :label="state.form.id ? 'Update' : 'Add'" type="submit" size="small" :loading="state.loading.creatingOrEditingTransaction" />
              <Button
                label="Cancel"
                type="button"
                class="ml-4"
                severity="secondary"
                size="small"
                @click="close()"
              />
            </div>
          </form>
        </Dialog>
      </template>
    </Card>
  </div>
</template>

<script lang="ts" setup>
import { useVuelidate } from "@vuelidate/core";
import { required } from "@vuelidate/validators";
import {
  Button,
  Card,
  Column,
  ConfirmDialog,
  DataTable,
  Dialog,
  InputText,
  Popover,
  ProgressSpinner,
  useConfirm,
} from "primevue";
import { computed, onMounted, reactive, ref } from "vue";
import { useRoute, useRouter } from "vue-router";

import { BudgetExpenseApi, TBudgetExpenseRow } from "../../../api/budget-expenses/api";
import { BudgetItemApi, TBudgetItem } from "../../../api/budget-items/api";
import { renderTypeHeader } from "../../../api/budget-items/utils";
import { getTotal } from "../../../hooks/budget";
import { useMoneyInput } from "../../../hooks/money-input";
import IconArrowLeft from "../../../icons/IconArrowLeft.vue";
import IconElipsisVertical from "../../../icons/IconElipsisVertical.vue";
import { formatCurrency, formatDate } from "../../../utils/common";

type TState = {
  addOrEditTransaction: boolean;
  budgetItem: TBudgetItem | null;
  expenses: TBudgetExpenseRow[];
  form: {
    amount: string;
    id?: string;
    name: string;
  };
  loading: {
    budgetItem: boolean;
    creatingOrEditingTransaction: boolean;
    deletingTransaction: boolean;
  };
};

const confirm = useConfirm();
const router = useRouter();
const route = useRoute();
const monthId = route.params.id as string;
const budgetItemId = route.params.itemId as string;
const budgetMonthId = route.params.id as string;

const op = ref();
const state: TState = reactive({
  addOrEditTransaction: false,
  budgetItem: null,
  expenses: [],
  form: {
    amount: "",
    id: null,
    name: "",
  },
  loading: {
    budgetItem: false,
    creatingOrEditingTransaction: false,
    deletingTransaction: false,
  },
});

const { formatAmountOnMount, formatAmountToSave, formattedAmount, handleBlur, handleInput, handleKeydown } =
  useMoneyInput({
    form: state.form,
  });

onMounted(() => {
  state.loading.budgetItem = true;
  getBudgetItem();
});

const rules = computed(() => {
  return {
    state: {
      form: {
        amount: { required },
        name: { required },
      },
    },
  };
});

const v$: any = useVuelidate(rules, { state });

async function getExpenses(): Promise<void> {
  state.expenses = await BudgetExpenseApi.getBudgetExpenses({ id: budgetItemId });
}

function budgetAmount(): number {
  return state.budgetItem?.budgeted_amount || 0;
}

const remainingBudget = computed(() => {
  return budgetAmount() - totalExpenses.value;
});

const totalExpenses = computed(() => {
  return getTotal(state.expenses.map((expense) => expense.amount));
});

async function createOrEditTransaction(): Promise<void> {
  const valid = await v$.value.$validate();
  if (!valid) return;
  const { amount, id, name } = state.form;
  const inputAmount = formatAmountToSave(amount);
  try {
    state.loading.creatingOrEditingTransaction = true;
    if (id) {
      await BudgetExpenseApi.updateBudgetExpense({
        amount: inputAmount,
        id,
        name,
      });
    } else {
      await BudgetExpenseApi.createBudgetExpense({
        amount: inputAmount,
        budget_item_id: budgetItemId,
        budget_month_id: budgetMonthId,
        name,
      });
    }

    await getExpenses();
  } finally {
    close();
  }
}

async function getBudgetItem(): Promise<void> {
  try {
    state.budgetItem = await BudgetItemApi.getBudgetItem({ id: budgetItemId });
    await getExpenses();
  } finally {
    state.loading.budgetItem = false;
  }
}

function goBackToBudgetMonth(): void {
  router.push({
    name: "budget-month",
    params: {
      id: monthId,
    },
  });
}

function close(): void {
  state.form.amount = "";
  state.form.name = "";
  state.loading.creatingOrEditingTransaction = false;
  v$.value.$reset();
  state.addOrEditTransaction = false;
}

function addOrEditTransaction(): void {
  state.addOrEditTransaction = true;
  state.form.amount = "";
  state.form.name = "";
  state.form.id = null;
}

function editTransaction(): void {
  state.addOrEditTransaction = true;
}

function deleteTransaction(): void {
  confirm.require({
    accept: async () => {
      try {
        state.loading.deletingTransaction = true;
        await BudgetExpenseApi.deleteBudgetExpense({ id: state.form.id });
        await getExpenses();
      } finally {
        state.loading.deletingTransaction = false;
      }
    },
    acceptProps: {
      label: "Delete",
      loading: state.loading.deletingTransaction,
      severity: "danger",
      size: "small",
    },
    group: state.form.id,
    header: "Delete Transaction",
    message: "Are you sure you want to delete this transaction?",
    reject: () => {
      close();
    },
    rejectProps: {
      label: "Cancel",
      severity: "secondary",
      size: "small",
    },
  });
}

const toggle = (event: Event, transaction: TBudgetExpenseRow) => {
  state.form.amount = formatAmountOnMount(transaction.amount);
  state.form.name = transaction.name;
  state.form.id = transaction.id;
  op.value.toggle(event);
};
</script>
