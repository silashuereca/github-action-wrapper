<template>
  <div>
    <button type="button" @click="logout">
      Logout
    </button>
  </div>
</template>

<script lang="ts" setup>
import { useRouter } from "vue-router";

import { supabase } from "../../../supabase";

const router = useRouter();

async function logout() {
  await supabase.auth.signOut();
  router.push("/sign-in");
}
</script>
