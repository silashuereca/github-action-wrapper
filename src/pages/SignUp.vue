<template>
  <div class="h-screen flex items-center justify-center">
    <Button
      label="Sign Up With Github"
      type="button"
      icon="pi pi-github"
      severity="contrast"
      @click="signIn()"
    />
  </div>
</template>

<script lang="ts" setup>
import Button from "primevue/button";

import { signIn } from "../hooks/auth";
</script>
