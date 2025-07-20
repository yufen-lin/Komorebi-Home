<template>
  <v-bottom-navigation :model-value="currentPath" color="primary" active>
    <v-btn
      v-for="item of navList"
      :key="item.path"
      :to="item.path"
      :value="item.path"
      :min-width="50"
      size="small"
    >
      <v-icon :icon="item.icon"></v-icon>
      <span>{{ item.label }}</span>
    </v-btn>
  </v-bottom-navigation>
</template>

<script lang="ts" setup>
import { computed } from 'vue';
import { NAVIGATION_LIST } from '@/constants';

defineProps<{
  currentPath: string;
}>();

const navList = computed(() => NAVIGATION_LIST.filter((item) => item.visible));
</script>
