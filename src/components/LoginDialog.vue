<template>
  <v-dialog v-model="show" max-width="400" persistent>
    <v-card>
      <v-card-title class="text-center">🏠 小屋入口處</v-card-title>
      <v-card-text>
        <v-form @submit.prevent="login">
          <v-text-field v-model="email" label="Email" type="email" required density="comfortable" />
          <v-text-field
            v-model="password"
            label="密碼"
            required
            density="comfortable"
            :append-inner-icon="isPasswordVisible ? 'mdi-eye-off' : 'mdi-eye'"
            :type="isPasswordVisible ? 'text' : 'password'"
            @click:append-inner="isPasswordVisible = !isPasswordVisible"
          />

          <v-btn :loading="loading" block color="primary" class="mt-2" @click="login"> 登入 </v-btn>
        </v-form>
        <div class="text-caption mt-2 text-zinc-500">✨ 歡迎光臨，您將以訪客身份進入小屋 🐾</div>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { supabase } from '@/lib/supabaseClient';
import { useAuthStore } from '@/stores/auth';
import { useErrorStore } from '@/stores/error';

const visitorEmail = import.meta.env.VITE_VISITOR_EMAIL;
const visitorPassword = import.meta.env.VITE_VISITOR_PASSWORD;

const authStore = useAuthStore();
const errorStore = useErrorStore();

const props = defineProps<{ showDialog: boolean }>();
const emit = defineEmits(['update:showDialog', 'login-success']);

const loading = ref(false);
const email = ref(visitorEmail);
const password = ref(visitorPassword);
const isPasswordVisible = ref(false);
const show = ref(props.showDialog);

watch(
  () => props.showDialog,
  (val) => {
    show.value = val;
    if (val) {
      email.value = 'visitor@komorebi.com';
      password.value = 'Vfordemo';
    }
  },
);

watch(show, (val) => emit('update:showDialog', val));

const login = async () => {
  loading.value = true;
  try {
    const { error } = await supabase.auth.signInWithPassword({
      email: email.value,
      password: password.value,
    });

    if (error) {
      errorStore.showError('登入失敗：帳號或密碼錯誤');
    } else {
      await authStore.loadUserInfo();
      emit('login-success');
      show.value = false;
    }
  } catch (e) {
    errorStore.showError(`登入失敗：帳號或密碼錯誤(${e})`);
  } finally {
    loading.value = false;
  }
};
</script>
