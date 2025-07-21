<template>
  <v-card class="pa-3" elevation="2" rounded="lg">
    <v-row justify="center" dense align="center">
      <v-col cols="12" sm="3" class="flex justify-center">
        <v-avatar size="45" class="mr-1" color="#e4ebf2" rounded="lg">
          <v-icon :icon="data.icon" color="primary" size="30"></v-icon>
        </v-avatar>
      </v-col>

      <v-col cols="12" sm="9" class="d-flex flex-col align-center d-sm-block">
        <div class="text-sm md:text-base text-title font-bold">
          {{ data.title }}
        </div>
        <div class="text-base md:text-lg font-bold">
          {{ data.value }}
          <span
            v-if="data.trend"
            class="text-[12px] md:text-sm"
            :class="data.trendImpact === 'positive' ? 'text-success' : 'text-error'"
          >
            <v-icon
              :icon="`mdi-trending-${data.trendDirection}`"
              :color="data.trendImpact === 'positive' ? 'success' : 'error'"
            />
            {{ data.trend }}
          </span>
        </div>
      </v-col>
    </v-row>
  </v-card>
</template>

<script lang="ts" setup>
import type { StatCardData } from '@/type';

defineProps<{
  data: StatCardData;
}>();
</script>
