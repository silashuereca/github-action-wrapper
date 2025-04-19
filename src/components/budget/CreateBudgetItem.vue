<template>
  <div class="w-full">
    <Button
      v-show="!state.addItem"
      label="Add Item"
      size="small"
      severity="info"
      variant="text"
      @click="toggleAddItemForm"
    />

    <form v-if="state.addItem" class="w-full grid grid-cols-2 gap-4" @submit.prevent="createBudgetItem()">
      <InputText
        v-model="state.form.name"
        class="w-full"
        placeholder="Name..."
        :invalid="v$.state.form.name.$errors.length > 0"
      />
      <InputNumber
        v-model="state.form.amount"
        input-id="currency-us"
        mode="currency"
        currency="USD"
        locale="en-US"
        :invalid="v$.state.form.amount.$errors.length > 0"
      />
      <div>
        <Button
          label="Create"
          type="submit"
          severity="success"
          size="small"
          :loading="state.loading.creatingBudgetItem"
        />
      </div>
    </form>
  </div>
</template>

<script lang="ts" setup>
import { useVuelidate } from "@vuelidate/core";
import { required } from "@vuelidate/validators";
import { Button, InputNumber, InputText } from "primevue";
import { computed, PropType, reactive } from "vue";

import { BudgetItemApi } from "../../api/budget-items/api";
import { TBudgetItemCategory } from "../../api/budget-items/types";

const props = defineProps({
  category: {
    required: true,
    type: String as PropType<TBudgetItemCategory>,
  },
  monthId: {
    required: true,
    type: String,
  },
});

const emit = defineEmits<{
  "update:list";
}>();

type TState = {
  addItem: boolean;
  form: {
    amount: number;
    name: string;
  };
  loading: {
    creatingBudgetItem: boolean;
  };
};

const state: TState = reactive({
  addItem: false,
  form: {
    amount: 0,
    name: "",
  },
  loading: {
    creatingBudgetItem: false,
  },
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

function toggleAddItemForm(): void {
  state.addItem = !state.addItem;
}

async function createBudgetItem(): Promise<void> {
  const valid = await v$.value.$validate();
  if (!valid) return;

  try {
    const monthId = props.monthId;
    const { amount, name } = state.form;
    state.loading.creatingBudgetItem = true;
    await BudgetItemApi.createBudgetItem({
      amount,
      category: props.category,
      monthId,
      name,
    });
    emit("update:list");
  } finally {
    state.loading.creatingBudgetItem = false;
    state.addItem = false;
    state.form.amount = 0;
    state.form.name = "";
  }
}
</script>
