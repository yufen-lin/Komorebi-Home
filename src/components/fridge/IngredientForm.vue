<template>
  <v-dialog v-model="isDialogVisible" max-width="400">
    <v-card>
      <v-card-title class="text-h6 mt-1 ml-1 pb-0 text-center">
        {{ isEdit ? '✏️ 編輯食材' : '🍴 新增食材' }}
      </v-card-title>

      <v-card-text class="pt-0">
        <v-form ref="formRef" @submit.prevent="handleSubmitForm">
          <v-divider class="my-6" :thickness="2"
            ><div class="text-sm font-bold text-[#949494]">食材資訊</div></v-divider
          >
          <v-row dense class="mb-1">
            <v-col cols="3">
              <div class="text-[12px] text-medium-emphasis mb-1 font-bold">Icon</div>
              <v-text-field
                v-model="form.icon"
                hide-details
                density="compact"
                variant="solo-filled"
                rounded="lg"
                class="text-body-2"
              />
            </v-col>
            <v-col cols="9">
              <div class="text-[12px] text-medium-emphasis mb-1 font-bold">
                <v-icon icon="mdi-asterisk" size="12" class="mr-1" color="error"></v-icon>食材名稱
              </div>
              <v-text-field
                v-model="form.name"
                hide-details
                required
                density="compact"
                variant="solo-filled"
                rounded="lg"
                clearable
              /> </v-col
          ></v-row>

          <v-row dense class="mb-1">
            <v-col cols="6">
              <div class="text-[12px] text-medium-emphasis mb-1 font-bold">
                <v-icon icon="mdi-asterisk" size="12" class="mr-1" color="error"></v-icon>數量
              </div>
              <v-text-field
                v-model="form.quantity"
                type="number"
                min="0.01"
                required
                hide-details
                density="compact"
                variant="solo-filled"
                rounded="lg"
              />
            </v-col>

            <v-col cols="6">
              <div class="text-[12px] text-medium-emphasis mb-1 font-bold">
                <v-icon icon="mdi-asterisk" size="12" class="mr-1" color="error"></v-icon>單位
              </div>
              <v-text-field
                v-model="form.unit"
                placeholder="包 / 顆 / g..."
                hide-details
                required
                density="compact"
                variant="solo-filled"
                rounded="lg"
            /></v-col>
          </v-row>

          <v-row dense class="mb-1">
            <v-col cols="12">
              <div class="text-[12px] text-medium-emphasis mb-1 font-bold">有效期限</div>
              <v-text-field
                v-model="form.expirationDate"
                type="date"
                hide-details
                density="compact"
                variant="solo-filled"
                rounded="lg"
              />
            </v-col>
          </v-row>

          <v-row dense class="mb-1" justify="center">
            <v-col cols="12" class="pb-0">
              <div class="text-[12px] text-medium-emphasis font-bold">保存區域</div></v-col
            >
            <v-col v-for="zone in STORAGE_OPTIONS" :key="zone.key" cols="3">
              <v-card
                :color="
                  form.storageZone === zone.key
                    ? 'primary'
                    : $vuetify.theme.global.current.dark
                      ? '#343434'
                      : '#f6f6f6'
                "
                class="pa-2 text-center transition"
                :ripple="false"
                rounded="lg"
                @click="form.storageZone = zone.key as StorageZone"
              >
                <div class="text-xl">{{ zone.icon }}</div>
                <div class="text-[14px] text-zin">{{ zone.label }}</div>
              </v-card>
            </v-col>
          </v-row>

          <v-row dense class="mb-1" justify="center">
            <v-col cols="12">
              <div class="text-[12px] text-medium-emphasis mb-1 font-bold">
                <v-icon icon="mdi-asterisk" size="12" class="mr-1" color="error"></v-icon>標籤
              </div>
              <v-select
                v-model="form.tags"
                :items="TAG_OPTIONS"
                multiple
                chips
                hide-details
                density="compact"
                variant="solo-filled"
                rounded="lg"
                required
              /> </v-col
          ></v-row>

          <v-divider class="my-6" :thickness="2"
            ><div class="text-sm font-bold text-[#949494]">購買資訊</div></v-divider
          >

          <v-row dense class="mb-1" justify="center">
            <v-col cols="12">
              <div class="text-[12px] text-medium-emphasis mb-2 font-bold">
                <v-icon icon="mdi-asterisk" size="12" class="mr-1" color="error"></v-icon
                >購買/獲得日期
              </div>
              <v-text-field
                v-model="form.purchaseDate"
                type="date"
                hide-details
                density="compact"
                variant="solo-filled"
                rounded="lg"
                :max="new Date().toISOString().slice(0, 10)"
              />
            </v-col>
          </v-row>

          <v-row dense class="mb-" justify="center">
            <v-col cols="6">
              <div class="text-[12px] text-medium-emphasis mb-1 font-bold">購買/獲得地點</div>
              <v-select
                v-model="form.purchaseLocation"
                :items="PURCHASE_LOCATION_OPTIONS"
                hide-details
                density="compact"
                variant="solo-filled"
                rounded="lg"
              />
            </v-col>

            <v-col cols="6">
              <div class="text-[12px] text-medium-emphasis mb-1 font-bold">
                <v-icon icon="mdi-asterisk" size="12" class="mr-1" color="error"></v-icon>價格
              </div>
              <v-text-field
                v-model="form.price"
                type="number"
                min="0"
                hide-details
                density="compact"
                variant="solo-filled"
                rounded="lg"
                prefix="NT$"
              />
            </v-col>
          </v-row>
        </v-form>

        <!-- Validation Error message -->
        <div v-if="errorStore.message" class="text-sm font-bold mt-5 text-[#d0494d]">
          <v-icon icon="mdi-alert-circle-outline" color="#d0494d" class="mr-2"></v-icon
          >{{ errorStore.message }}
        </div>
      </v-card-text>

      <v-card-actions>
        <v-btn variant="elevated" color="secondary" @click="handleCloseForm">取消</v-btn>
        <v-btn type="submit" variant="elevated" color="primary" @click="handleSubmitForm">{{
          isEdit ? '儲存' : '新增'
        }}</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { watch, reactive, computed, ref } from 'vue';
import { useIngredientStore } from '@/stores/ingredients';
import { useErrorStore } from '@/stores/error';
import type { Ingredient, StorageZone } from '@/type';
import { TAG_OPTIONS, STORAGE_OPTIONS, PURCHASE_LOCATION_OPTIONS } from '@/constants';

const ingredientStore = useIngredientStore();
const errorStore = useErrorStore();

const defaultForm: Omit<Ingredient, 'id'> = {
  name: '',
  icon: '🍅',
  quantity: null,
  unit: '',
  storageZone: 'frozen',
  expirationDate: null,
  purchaseDate: new Date().toISOString().slice(0, 10),
  purchaseLocation: 'carrefour',
  price: null,
  tags: [],
};

const formRef = ref();
const form = reactive({ ...defaultForm });

const props = defineProps<{
  modelValue: boolean;
  editData?: Ingredient | null;
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void;
}>();

const isDialogVisible = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value),
});
const isEdit = computed(() => !!props.editData);

const validateForm = (): string | null => {
  if (!form.name.trim()) return '請填寫食材名稱';
  if (form.quantity === null || Number(form.quantity) <= 0) return '數量需大於 0';
  if (!form.unit.trim()) return '請填寫單位';
  if (form.tags?.length === 0) return '請選擇至少一個標籤';
  if (Number(form.price) < 0) return '價格不能小於 0';
  return null;
};

const handleSubmitForm = async () => {
  // Validation
  errorStore.setError('');
  const errorMsg = validateForm();
  if (errorMsg) {
    errorStore.setError(errorMsg);
    return;
  }

  const payload: Ingredient = {
    ...form,
    quantity: Number(form.quantity),
    price: form.price ? Number(form.price) : null,
    purchaseDate: form.expirationDate || null,
  };

  if (isEdit.value) {
    payload.id = props.editData?.id;
    // [FIX]
    if (props.editData?.id) {
      await ingredientStore.updateIngredient(props.editData.id, payload);
    } else {
      console.error('Missing ID when updating ingredient');
    }
  } else {
    await ingredientStore.addIngredient(payload);
  }
  handleCloseForm();
};

const handleCloseForm = () => {
  emit('update:modelValue', false);
};

const resetForm = () => {
  Object.assign(form, { ...defaultForm });
};

watch(
  () => props.editData,
  (newVal) => {
    if (newVal) Object.assign(form, { ...newVal });
  },
  { immediate: true },
);

watch(
  () => props.modelValue,
  (visible) => {
    if (visible && !isEdit.value) {
      resetForm();
    }
  },
);
</script>
