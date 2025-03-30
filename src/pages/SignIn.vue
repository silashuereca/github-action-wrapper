<template>
  <div class="h-screen flex items-center justify-center">
    <Button
      type="button"
      label="Sign In With Github"
      severity="contrast"
      icon="pi pi-github"
      @click="signIn()"
    />
  </div>
</template>

<script lang="ts" setup>
import Button from "primevue/button";

import { signIn } from "../hooks/auth";
</script>
