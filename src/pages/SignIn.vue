<template>
  <div>
    <button type="button" @click="signIn()">
      Sign In With GitHub
    </button>
  </div>
</template>

<script lang="ts" setup>
import { signIn } from "../hooks/auth";
</script>
