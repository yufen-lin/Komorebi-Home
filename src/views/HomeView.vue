<template>
  <v-container :style="{ maxWidth: '1400px', overflow: 'auto' }" fill-height>
    <v-row dense>
      <v-col v-for="item in statsData" :key="item.title" cols="6" md="3" class="pa-2">
        <StatCard :data="item" />
      </v-col>
    </v-row>

    <v-row dense>
      <v-col cols="12" md="6" class="pa-2">
        <v-card class="pa-4" elevation="2" style="height: 430px" rounded="lg">
          <IngredientCostChart />
        </v-card>
      </v-col>

      <v-col cols="12" md="6" class="pa-2">
        <v-card class="pa-4" elevation="2" style="height: 430px" rounded="lg">
          <div v-if="loading">
            <LoadingSpinner />
          </div>
          <IngredientInventoryChart v-else :ingredients="safeIngredients" />
        </v-card>
      </v-col>
    </v-row>

    <v-row dense class="mb-6 section-3">
      <v-col cols="12" class="pa-4">
        <h2 class="font-bold text-lg my-2">😱 即將過期的食材</h2>
        <v-slide-group :show-arrows="true" class="custom-slide-group">
          <v-slide-group-item v-for="item in expiringIngredients" :key="item.id">
            <v-card
              elevation="1"
              rounded="xl"
              class="overflow-visible flex flex-col text-center mr-3 px- pt-7 pb-4"
              :style="{ width: '125px', height: '135px' }"
            >
              <div class="absolute text-[56px] top-[-48px] left-[32px]">
                {{ item.icon }}
              </div>

              <div class="font-bold text-sm mt-1">{{ item.name }}</div>
              <div class="text-[12px]">{{ item.quantity }} {{ item.unit }}</div>
              <div class="text-[13px] font-bold text-title">
                {{ item.expirationDate }}
              </div>

              <v-chip
                class="pe-3 ps-3 font-weight-bold mt-2"
                size="small"
                color="primary"
                variant="tonal"
                base-color="secondary"
                :ripple="false"
                >{{ item.storageZone }}</v-chip
              >
            </v-card>
          </v-slide-group-item>
        </v-slide-group>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue';

import StatCard from '../components/dashboard/StatCard.vue';
import IngredientCostChart from '../components/dashboard/IngredientCostChart.vue';
import IngredientInventoryChart from '../components/dashboard/IngredientInventoryChart.vue';

import { useIngredientStore } from '../stores/ingredients';
import { storeToRefs } from 'pinia';
import type { StatCardData } from '@/type';
import { getDateDiffInfo } from '@/utils/dateUtils';

const ingredientStore = useIngredientStore();
const { ingredients, loading } = storeToRefs(ingredientStore);

const statsData: StatCardData[] = [
  {
    icon: 'mdi-currency-usd',
    title: '本月食材總花費',
    value: '$ 1,648',
    trend: '$ 345',
    trendDirection: 'up',
    trendImpact: 'negative',
  },
  {
    icon: 'mdi-pot-steam',
    title: '本月料理總次數',
    value: '4',
    trend: '1 次',
    trendDirection: 'up',
    trendImpact: 'positive',
  },
  {
    icon: 'mdi-account-group',
    title: '總累積客人數',
    value: '2',
  },
  {
    icon: 'mdi-cart-variant',
    title: '待買清單',
    value: '5',
  },
];

onMounted(async () => {
  await ingredientStore.fetchIngredients();
});

const safeIngredients = computed(() => (loading ? ingredients.value : []));

const storageZoneMap: Record<string, string> = {
  frozen: '冷凍區',
  refrigerated: '冷藏區',
  roomTemp: '常溫區',
  produce: '蔬果區',
};

const expiringIngredients = computed(() => {
  return ingredientStore.ingredients
    .filter((item) => item.expirationDate)
    .filter((item) => {
      const { daysLeft } = getDateDiffInfo(item.expirationDate);
      return daysLeft !== null && daysLeft >= 0 && daysLeft <= 10;
    })
    .map((item) => ({
      ...item,
      storageZone: storageZoneMap[item.storageZone] || item.storageZone,
    }));
});
</script>

<style scoped>
::v-deep(.custom-slide-group .v-slide-group__container) {
  height: 200px;
  align-items: center;
}
</style>
