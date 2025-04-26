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
import { computed, onMounted, PropType, reactive } from "vue";

import { BudgetItemApi, TBudgetItemCategory } from "../../api/budget-items/api";

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

onMounted(() => {
  if (props.edit) {
    state.form.amount = String(Math.round(Number(props.amount) * 100));
    state.form.name = props.name;
  }
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

const formattedAmount = computed(() => {
  const value = state.form.amount.padStart(3, "0");
  const dollars = value.slice(0, -2);
  const cents = value.slice(-2);
  return `$${parseInt(dollars, 10).toLocaleString()}.${cents}`;
});

function handleInput(event) {
  const digitsOnly = event.target.value.replace(/\D/g, "");
  state.form.amount = digitsOnly;
}

function handleKeydown(event) {
  // Prevent entering non-numeric characters manually
  if (event.key.length === 1 && !/\d/.test(event.key)) {
    event.preventDefault();
  }
}

function handleBlur() {
  if (state.form.amount === "") {
    state.form.amount = "0";
  }
}

async function createOrEditBudgetItem(): Promise<void> {
  const valid = await v$.value.$validate();
  if (!valid) return;

  try {
    const monthId = props.monthId;
    const { amount, name } = state.form;
    const inputAmount = parseInt(amount) / 100;

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
