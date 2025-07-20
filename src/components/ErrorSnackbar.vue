<template>
  <v-snackbar
    v-model="errorStore.show"
    :timeout="errorStore.timeout"
    color="error"
    variant="outlined"
    location="top"
  >
    {{ errorStore.message }}
    <template #actions>
      <v-btn icon @click="errorStore.hideError">
        <v-icon>mdi-close</v-icon>
      </v-btn>
    </template>
  </v-snackbar>
</template>

<script lang="ts" setup>
import { useErrorStore } from '@/stores/error';
const errorStore = useErrorStore();
</script>
