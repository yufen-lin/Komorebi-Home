<template>
  <v-card
    class="pa-3 d-flex align-center mb-2"
    elevation="3"
    rounded="lg"
    :ripple="false"
    :style="{
      borderLeft: '6px solid',
      borderLeftColor: expirationInfo.statusColor,
    }"
  >
    <!-- Delete Button -->
    <v-btn
      variant="plain"
      size="small"
      class="position-absolute top-1 right-0"
      @click.stop="emit('delete', ingredient.id)"
    >
      <v-icon icon="mdi-close" />
    </v-btn>

    <!-- Ingredient Icon -->
    <v-avatar size="70" class="mr-4" color="iconBg">
      <span class="text-[45px]">{{ ingredient.icon || '🍽️' }}</span>
    </v-avatar>

    <!-- Ingredient Info -->
    <div class="d-flex flex-col flex-1 px-1 py-1">
      <div class="d-flex items-center mb-1 gap-2 font-bold">
        <div
          :class="[
            $vuetify.theme.global.current.dark ? 'text-zinc-200' : 'text-zinc-700',
            'text-base',
          ]"
        >
          {{ ingredient.name }}
        </div>
        <v-divider
          thickness="2"
          vertical
          length="14px"
          :inset="true"
          color="#d9d9d9"
          opacity="1"
          class="mx-1"
        ></v-divider>
        <div
          :class="[
            $vuetify.theme.global.current.dark ? 'text-zinc-400' : 'text-zinc-500',
            'text-sm',
          ]"
        >
          {{ ingredient.quantity }} {{ ingredient.unit }}
        </div>
      </div>

      <!-- Expiration Data -->
      <div class="text-[#878787] font-bold mb-2 text-sm">
        {{ expirationInfo.label }}
      </div>

      <!-- Ingredient Tags -->
      <div class="d-flex gap-2 flex-wrap">
        <div
          v-for="tag of ingredient.tags"
          :key="tag"
          :style="{
            color: INGREDIENT_TAG_INFO[tag].text,
            backgroundColor: INGREDIENT_TAG_INFO[tag].bg,
          }"
          class="text-[12px] font-bold rounded-[8px] w-fit px-2"
        >
          # {{ INGREDIENT_TAG_INFO[tag].label }}
        </div>
      </div>
    </div>
  </v-card>
</template>

<script lang="ts" setup>
import { computed } from 'vue';
import type { Ingredient } from '@/type';
import { getDateDiffInfo } from '@/utils/dateUtils';
import { INGREDIENT_TAG_INFO } from '@/constants';

const props = defineProps<{
  ingredient: Ingredient;
}>();

const emit = defineEmits<{
  (e: 'delete', id?: string): void;
}>();

const expirationInfo = computed(() => getDateDiffInfo(props.ingredient.expirationDate));
</script>
