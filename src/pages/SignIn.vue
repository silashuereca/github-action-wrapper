<template>
  <div class="h-screen flex items-center justify-center">
    <div class="flex flex-col">
      <Button
        type="button"
        label="Sign In With Github"
        severity="contrast"
        icon="pi pi-github"
        @click="signInGithub()"
      />
      <Button
        class="mt-5"
        type="button"
        label="Sign In With Google"
        severity="info"
        icon="pi pi-google"
        @click="signInGoogle()"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import Button from "primevue/button";

import { signInGithub, signInGoogle } from "../hooks/auth";
</script>
