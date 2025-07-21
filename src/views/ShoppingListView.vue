<template>
  <v-container class="pa-6 pb-15">
    <!-- Add shopping item -->
    <v-row align="center" class="mb-10" dense>
      <v-col cols="8" sm="10"
        ><v-text-field
          v-model="newItemName"
          append-inner-icon="mdi-magnify"
          density="compact"
          placeholder="例如: 🥒 櫛瓜x1條"
          variant="solo"
          hide-details
          single-line
          @keyup.enter="addItem"
          clearable
        ></v-text-field
      ></v-col>
      <v-col cols="4" sm="2"
        ><v-btn color="primary" @click="addItem"
          ><v-icon icon="mdi-plus"></v-icon>新增項目</v-btn
        ></v-col
      >
    </v-row>

    <!-- Quick Picks -->
    <v-divider thickness="3"><h2 class="font-bold text-lg">➕ 快速新增區</h2></v-divider>
    <div class="d-flex flex-wrap mt-5 mb-10">
      <v-btn v-for="item in commonItems" :key="item.text" class="ma-1" @click="quickAdd(item)">
        {{ item.label }}
      </v-btn>
    </div>

    <!-- Shopping List -->
    <v-divider thickness="3"
      ><h2 class="font-bold text-lg">
        🛒 購買清單 ( {{ checkedItemCount }} / {{ activeShoppingList.length }} )
      </h2></v-divider
    >
    <v-list
      v-if="activeShoppingList.length > 0"
      class="mt-3"
      bg-color="background"
      density="compact"
    >
      <v-card elevation="1" rounded="lg" class="py-4 pl-2">
        <ShoppingItem
          v-for="item in activeShoppingList"
          :key="item.id"
          :item="item"
          @update="updateItem"
          @delete="deleteItem"
        />
      </v-card>

      <div class="d-flex justify-center mt-3">
        <v-btn class="mt-3" color="primary" @click="completePurchase">
          <v-icon icon="mdi-checkbox-multiple-marked-outline" class="mr-2"></v-icon
          >購買完成（加入勾選項目到食材庫）
        </v-btn>
      </div>
    </v-list>
    <v-empty-state
      v-else
      title="Nothing to buy — for now!"
      text="You’ve got everything you need 🎈"
    ></v-empty-state>
  </v-container>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import ShoppingItem from '../components/shippingList/ShoppingItem.vue';
import type { ShoppingListItem } from '@/type';
import { useShoppingListStore } from '@/stores/shoppingList';

const shoppingListStore = useShoppingListStore();

const newItemName = ref('');

const commonItems = [
  { label: '🥚 雞蛋1盒', text: '🥚 雞蛋x1盒' },
  { label: '🥬 高麗菜0.5顆', text: '🥬 高麗菜x0.5顆' },
  { label: '🥛 牛奶1瓶', text: '🥛 牛奶x1瓶' },
  { label: '🥩 牛肉1盒', text: '🥩 牛肉x1盒' },
  { label: '🐖 豬肉1盒', text: '🐖 豬肉x1盒' },
  { label: '🍄‍🟫 菇類1包', text: '🍄‍🟫 菇類x1包' },
];

const addItem = async (e: KeyboardEvent | MouseEvent) => {
  if (e instanceof KeyboardEvent && (e.isComposing || e.key !== 'Enter')) {
    return;
  }

  if (!newItemName.value.trim()) return;

  await shoppingListStore.addItem({
    text: newItemName.value,
    checked: false,
    status: 'active',
    deleted: false,
  });

  newItemName.value = '';
};

const quickAdd = async (item: { text: string }) => {
  await shoppingListStore.addItem({
    text: item.text,
    checked: false,
    status: 'active',
    deleted: false,
  });
};

const deleteItem = async (id: string) => {
  await shoppingListStore.removeItem(id);
};

const updateItem = async (updatedItem: ShoppingListItem) => {
  await shoppingListStore.updateItem(updatedItem);
};

const completePurchase = async () => {
  await shoppingListStore.completeToIngredientStore();
};

const activeShoppingList = computed(() =>
  shoppingListStore.items.filter((item) => !item.deleted && item.status === 'active'),
);

const checkedItemCount = computed(
  () => activeShoppingList.value.filter((item) => item.checked).length,
);

onMounted(async () => {
  shoppingListStore.fetchItems();
});
</script>
