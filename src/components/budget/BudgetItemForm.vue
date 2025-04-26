<template>
  <div class="w-full">
    <form class="w-full grid grid-cols-1 lg:grid-cols-2 gap-4" @submit.prevent="createOrEditBudgetItem()">
      <InputText
        v-model="state.form.name"
        class="w-full"
        placeholder="Name..."
        :invalid="v$.state.form.name.$errors.length > 0"
        autofocus
        fluid
      />
      <InputText
        inputmode="numeric"
        :value="formattedAmount"
        :invalid="v$.state.form.amount.$errors.length > 0"
        @input="handleInput"
        @keydown="handleKeydown"
        @blur="handleBlur"
      />
      <div class="flex justify-between sm:justify-start items-center">
        <Button
          :label="props.edit ? 'Update' : 'Create'"
          type="submit"
          severity="success"
          size="small"
          :loading="state.loading.createOrEditBudgetItem"
        />
        <Button
          class="ml-2"
          label="Cancel"
          type="button"
          severity="secondary"
          size="small"
          @click="cancel()"
        />
      </div>
    </form>
  </div>
</template>

<script lang="ts" setup>
import { useVuelidate } from "@vuelidate/core";
import { required } from "@vuelidate/validators";
import { Button, InputText } from "primevue";
import { computed, PropType, reactive } from "vue";

import { BudgetItemApi, TBudgetItemCategory } from "../../api/budget-items/api";
import { useMoneyInput } from "../../hooks/money-input";

const props = defineProps({
  amount: {
    default: null,
    type: Number,
  },
  budgetItemId: {
    default: null,
    type: String,
  },
  category: {
    default: null,
    type: String as PropType<TBudgetItemCategory>,
  },
  edit: {
    default: false,
    type: Boolean,
  },
  monthId: {
    default: null,
    type: String,
  },
  name: {
    default: null,
    type: String,
  },
});

const emit = defineEmits<{
  "update:cancel";
  "update:form";
}>();

type TState = {
  form: {
    amount: string;
    name: string;
  };
  loading: {
    createOrEditBudgetItem: boolean;
  };
};

const state: TState = reactive({
  addItem: false,
  form: {
    amount: "",
    name: "",
  },
  loading: {
    createOrEditBudgetItem: false,
  },
});
const { formatAmountToSave, formattedAmount, handleBlur, handleInput, handleKeydown } = useMoneyInput({
  amountProp: props.amount,
  edit: props.edit,
  form: state.form,
  nameProp: props.name,
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

function cancel(): void {
  state.form.amount = "";
  state.form.name = "";
  state.loading.createOrEditBudgetItem = false;
  v$.value.$reset();
  emit("update:cancel");
}

async function createOrEditBudgetItem(): Promise<void> {
  const valid = await v$.value.$validate();
  if (!valid) return;

  try {
    const monthId = props.monthId;
    const { amount, name } = state.form;
    const inputAmount = formatAmountToSave(amount);

    state.loading.createOrEditBudgetItem = true;
    if (props.edit) {
      await BudgetItemApi.updateBudgetItem({
        amount: inputAmount,
        id: props.budgetItemId,
        name,
      });
    } else {
      await BudgetItemApi.createBudgetItem({
        amount: inputAmount,
        category: props.category,
        monthId,
        name,
      });
    }

    emit("update:form");
  } finally {
    state.loading.createOrEditBudgetItem = false;
    state.form.amount = "0";
    state.form.name = "";
  }
}
</script>
