<script setup lang="ts">
import { ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useTheme } from 'vuetify';
import { loginGuardState } from '@/router';
import { useAuth } from '@/composables/useAuth';

import { useDisplay } from 'vuetify';
const { smAndDown } = useDisplay();

import BottomNavigation from './components/BottomNavigation.vue';
import SideMenu from './components/SideMenu.vue';
import LoginDialog from '@/components/LoginDialog.vue';
import ErrorSnackbar from './components/ErrorSnackbar.vue';

const router = useRouter();
const route = useRoute();
const currentPath = ref(route.path);
const theme = useTheme();

const { logout } = useAuth();

const onLoginSuccess = () => {
  const redirectPath = loginGuardState.redirectPathAfterLogin || '/';
  router.replace(redirectPath);
};

async function handleLogout() {
  await logout();
}
</script>

<template>
  <v-app :style="{ height: '100vgh', overflow: 'hidden' }">
    <v-layout
      :style="{
        backgroundColor: theme.name.value === 'dark' ? '#1E1E1E' : '#F8F8F8',
        height: '100vh',
      }"
    >
      <v-main :style="{ overflowY: 'auto' }">
        <LoginDialog
          :show-dialog="loginGuardState.showLoginDialog"
          @update:showDialog="(val) => (loginGuardState.showLoginDialog = val)"
          @login-success="onLoginSuccess"
        />
        <v-app-bar v-if="smAndDown" :elevation="0" height="58" color="background">
          <div class="caveat-font text-3xl px-4">Komorebi Home 🏡✨</div>

          <template v-slot:append>
            <v-btn
              @click="theme.toggle()"
              :icon="theme.name.value === 'dark' ? 'mdi-white-balance-sunny' : 'mdi-weather-night'"
              density="compact"
              variant="text"
              class="mr-1"
            ></v-btn>
            <v-btn
              icon="mdi-home-export-outline"
              @click="handleLogout"
              density="compact"
              class="mr-2"
            ></v-btn>
          </template>
        </v-app-bar>

        <SideMenu />
        <RouterView />

        <ErrorSnackbar />
      </v-main>
    </v-layout>
    <BottomNavigation :currentPath="currentPath" class="d-print-block d-md-none" />
  </v-app>
</template>
