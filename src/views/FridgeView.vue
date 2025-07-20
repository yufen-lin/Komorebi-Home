<template>
  <v-container class="pb-15" :max-width="1500" :style="{ height: '100vh' }">
    <!-- <h2 class="text-4xl text-weight-bold mb-4 caveat-font mx-3 my-2">
      Fridge 🍽️
    </h2> -->

    <!-- Search Bar -->
    <v-row align="center" class="mb-1">
      <v-col cols="12" md="10"
        ><v-text-field
          v-model="keyword"
          append-inner-icon="mdi-magnify"
          density="compact"
          label="搜尋食材 (名稱/標籤)"
          variant="solo"
          hide-details
          single-line
        ></v-text-field
      ></v-col>
      <v-col v-if="mdAndUp" cols="2"
        ><v-btn v-show="mdAndUp" color="primary" @click="openNewForm"
          ><v-icon icon="mdi-plus"></v-icon>新增食材</v-btn
        ></v-col
      >
    </v-row>

    <!-- Storage Zone Selection -->
    <v-chip-group v-model="currentZone" class="mb-1">
      <v-chip
        v-for="zone of STORAGE_ZONES"
        :key="zone.value"
        :value="zone.value"
        class="pr-4 ps-4 font-weight-black"
        color="primary"
        variant="tonal"
        base-color="secondary"
        :ripple="false"
        >{{ zone.label }}</v-chip
      >
    </v-chip-group>

    <!-- Add Ingredient Button (mobile) -->
    <v-btn
      v-show="!mdAndUp"
      icon="mdi-plus"
      class="mb-4 bottom-15 right-5 z-10"
      position="fixed"
      @click="openNewForm"
    ></v-btn>

    <IngredientForm v-model="formVisible" :editData="editItem" />

    <IngredientList
      :filterByStorage="currentZone"
      :filterByKeyword="keyword"
      @edit="openEditForm"
    />
  </v-container>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { useDisplay } from 'vuetify';

import { STORAGE_ZONES } from '@/constants';
import type { Ingredient } from '@/type';
import IngredientList from '../components/fridge/IngredientList.vue';
import IngredientForm from '../components/fridge/IngredientForm.vue';

const { mdAndUp } = useDisplay();

const currentZone = ref('all');
const keyword = ref<string>('');
const formVisible = ref<boolean>(false);
const editItem = ref<Ingredient | null>(null);

function openNewForm() {
  editItem.value = null;
  formVisible.value = true;
}

function openEditForm(item: Ingredient) {
  editItem.value = item;
  formVisible.value = true;
}
</script>
