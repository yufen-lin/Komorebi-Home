<template>
  <v-list-item style="max-width: 450px">
    <template #prepend>
      <v-checkbox
        v-show="!isEditing"
        :model-value="item.checked"
        hide-details
        color="primary"
        density="compact"
        @update:model-value="(val) => updateItem({ checked: !!val })"
      />
    </template>

    <div class="d-flex align-center ml-3">
      <!-- Edit Mode -->
      <template v-if="isEditing">
        <v-text-field
          v-model="editableText"
          dense
          hide-details
          single-line
          @keyup.enter="confirmEdit"
          @keydown.down.stop
          @keydown.up.stop
        />
        <v-btn variant="plain" size="small" @click="confirmEdit">
          <v-icon icon="mdi-check" size="25" />
        </v-btn>
        <v-btn variant="plain" size="small" @click="isEditing = false">
          <v-icon icon="mdi-close" size="25" />
        </v-btn>
      </template>

      <!-- Display Mode -->
      <template v-else>
        <div class="flex-grow-1">
          {{ item.text }}
        </div>
        <v-btn variant="plain" size="small" @click="isEditing = true">
          <v-icon icon="mdi-square-edit-outline" size="20" />
        </v-btn>
        <v-btn variant="plain" size="small" @click="$emit('delete', item.id)">
          <v-icon icon="mdi-trash-can-outline" size="20" />
        </v-btn>
      </template>
    </div>
  </v-list-item>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import type { ShoppingListItem } from '@/type';

const props = defineProps<{
  item: ShoppingListItem;
}>();

const emit = defineEmits<{
  (e: 'update', item: ShoppingListItem): void;
  (e: 'delete', id: string): void;
}>();

const isEditing = ref(false);
const editableText = ref(props.item.text);

const updateItem = (patch: Partial<ShoppingListItem>) => {
  emit('update', { ...props.item, ...patch });
};

const confirmEdit = (e?: KeyboardEvent | MouseEvent) => {
  if (e instanceof KeyboardEvent && (e.isComposing || e.key !== 'Enter')) {
    return;
  }

  isEditing.value = false;
  updateItem({ text: editableText.value });
};
</script>
