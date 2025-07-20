<template>
  <v-container
    class="px-0"
    :style="{
      overflowY: 'auto',
      overflowX: 'hidden',
      height: mdAndUp ? '70vh' : '68vh',
    }"
  >
    <!-- Ingredient Card List -->
    <v-row dense>
      <v-col v-for="item in ingredients" :key="item.id" cols="12" sm="6" lg="4" xl="3" class="px-2">
        <IngredientCard
          :ingredient="item"
          @delete="(id) => (deleteItemId = id ?? null)"
          @click="emit('edit', item)"
        />
      </v-col>
    </v-row>

    <!-- Delete Ingredient Confirm Dialog -->
    <v-dialog v-model="isDeleteDialogVisible" max-width="400">
      <v-card :loading="ingredientStore.loading">
        <v-card-title class="mt-2">
          <v-icon class="me-1" color="warning">mdi-alert-circle-outline</v-icon>
          確定要刪除這筆食材嗎？
        </v-card-title>

        <v-card-text class="pt-0 pb-2 px-14">
          <p>刪除後它將會從冰箱中消失</p>
          <p>無法復原，請小心選擇！</p></v-card-text
        >
        <v-card-actions class="mb-2 mr-2 mt-1">
          <v-btn
            variant="elevated"
            color="secondary"
            :disabled="ingredientStore.loading"
            @click="deleteItemId = null"
            >取消</v-btn
          >
          <v-btn
            variant="elevated"
            color="error"
            @click="handleDelete"
            :disabled="ingredientStore.loading"
            >刪除</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { useDisplay } from 'vuetify';

import { INGREDIENT_TAG_INFO } from '@/constants';
import type { Ingredient } from '@/type';
import { useIngredientStore } from '@/stores/ingredients';
import IngredientCard from './IngredientCard.vue';

const { mdAndUp } = useDisplay();
const ingredientStore = useIngredientStore();

const deleteItemId = ref<string | null>(null);

const props = defineProps<{
  filterByStorage?: string;
  filterByKeyword?: string;
}>();

const emit = defineEmits<{
  edit: [editItem: Ingredient];
}>();

const isDeleteDialogVisible = computed({
  get: () => !!deleteItemId.value,
  set: (val) => {
    if (!val) deleteItemId.value = null; // Clear id when dialog closed
  },
});

// Filter ingredients list by storage zone or keyword
const ingredients = computed(() => {
  return ingredientStore.ingredients
    .filter((item) => matchesStorageFilter(item))
    .filter((item) => matchesKeywordFilter(item));
});

const matchesStorageFilter = (item: Ingredient) => {
  if (!props.filterByStorage || props.filterByStorage === 'all') return true;
  return item.storageZone === props.filterByStorage;
};

const matchesKeywordFilter = (item: Ingredient) => {
  const keyword = props.filterByKeyword?.toLowerCase().trim();
  if (!keyword) return true;

  // Check Name
  if (item.name.toLowerCase().includes(keyword)) {
    return true;
  }

  // Check Tags
  return item.tags?.some((tagKey) => {
    const label = INGREDIENT_TAG_INFO[tagKey]?.label || '';
    return label.toLowerCase().includes(keyword);
  });
};

const handleDelete = async () => {
  if (deleteItemId.value) {
    await ingredientStore.deleteIngredient(deleteItemId.value);
    deleteItemId.value = null;
  }
};

onMounted(() => {
  ingredientStore.fetchIngredients();
});
</script>
