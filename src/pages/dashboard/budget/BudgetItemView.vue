<template>
  <Card class=" max-w-2xl mx-auto">
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
        <h2 class="text-2xl font-bold ml-2" v-text="state.budgetItem?.name" />
      
        <h2 class="text-2xl font-bold ml-2" v-text="formatCurrency(state.budgetItem?.budgeted_amount)" />
      </div>

      <section v-show="state.expenses.length" class="mt-5">
        <DataTable :value="state.expenses">
          <Column field="name" header="Name" />
          <Column field="date" header="Date" />
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

      <Popover ref="op" @hide="close()">
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
          <InputNumber
            v-model="state.form.amount"
            label="Amount"
            mode="currency"
            currency="USD"
            locale="en-US"
            :invalid="v$.state.form.amount.$errors.length > 0"
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
  InputNumber,
  InputText,
  Popover,
  useConfirm,
} from "primevue";
import { computed, onMounted, reactive, ref } from "vue";
import { useRoute, useRouter } from "vue-router";

import { BudgetExpenseApi, TBudgetExpenseRow } from "../../../api/budget-expenses/api";
import { BudgetItemApi, TBudgetItem } from "../../../api/budget-items/api";
import { renderTypeHeader } from "../../../api/budget-items/utils";
import IconArrowLeft from "../../../icons/IconArrowLeft.vue";
import IconElipsisVertical from "../../../icons/IconElipsisVertical.vue";
import { formatCurrency } from "../../../utils/common";

type TState = {
  addOrEditTransaction: boolean;
  budgetItem: TBudgetItem | null;
  expenses: TBudgetExpenseRow[];
  form: {
    amount: number;
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

const op = ref();
const state: TState = reactive({
  addOrEditTransaction: false,
  budgetItem: null,
  expenses: [],
  form: {
    amount: 0,
    id: null,
    name: "",
  },
  loading: {
    budgetItem: false,
    creatingOrEditingTransaction: false,
    deletingTransaction: false,
  },
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

async function createOrEditTransaction(): Promise<void> {
  const valid = await v$.value.$validate();
  if (!valid) return;
  const { amount, id, name } = state.form;
  try {
    state.loading.creatingOrEditingTransaction = true;
    if (id) {
      await BudgetExpenseApi.updateBudgetExpense({
        amount,
        id,
        name,
      });
    } else {
      await BudgetExpenseApi.createBudgetExpense({
        amount,
        budget_item_id: budgetItemId,
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
  state.form.amount = 0;
  state.form.name = "";
  state.loading.creatingOrEditingTransaction = false;
  v$.value.$reset();
  state.addOrEditTransaction = false;
}

function addOrEditTransaction(): void {
  state.addOrEditTransaction = true;
  state.form.amount = 0;
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
  state.form.amount = transaction.amount;
  state.form.name = transaction.name;
  state.form.id = transaction.id;
  op.value.toggle(event);
};
</script>
