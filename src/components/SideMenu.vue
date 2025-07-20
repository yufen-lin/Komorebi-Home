<template>
  <v-navigation-drawer mobile-breakpoint="md" color="background" width="230" style="height: 100vh">
    <v-list class="px-2" density="compact"
      ><v-list-item class="caveat-font text-[40px] my-1">Komorebi</v-list-item>

      <!-- Feature -->
      <v-list-subheader>Feature</v-list-subheader>
      <v-list-item
        v-for="item of NAVIGATION_LIST"
        link
        :key="item.path"
        :to="item.path"
        rounded="xl"
        color="grey-darken-2"
        ><v-icon
          :icon="item.icon"
          class="mr-3"
          color="grey-darken-1
"
        ></v-icon
        >{{ item.label }}</v-list-item
      >

      <!-- Setting -->
      <v-list-subheader class="mt-4">Setting</v-list-subheader>
      <v-list-item>
        <v-row align="center">
          <v-col cols="8" class="pe-0"
            ><v-icon
              icon="mdi-weather-night"
              class="mr-3"
              color="grey-darken-1
"
            ></v-icon
            >Dark Mode</v-col
          >
          <v-col cols="3"><v-switch v-model="isDark" hide-details></v-switch></v-col>
        </v-row>
      </v-list-item>
    </v-list>

    <!-- Profile -->
    <template v-slot:append>
      <v-divider class="mb-2"></v-divider>

      <v-list-item :subtitle="roleDisplay.subtitle" :title="roleDisplay.title">
        <template v-slot:prepend>
          <v-avatar size="50" border="sm" color="#fff"
            ><v-img :alt="`${roleDisplay.title} avatar`" :src="ownerAvatar"></v-img
          ></v-avatar>
        </template>
      </v-list-item>

      <div class="pa-2">
        <v-btn block @click="handleLogout" color="secondary"
          ><v-icon icon="mdi-home-export-outline" class="mr-2"></v-icon>Leave Here</v-btn
        >
      </div>
    </template>
  </v-navigation-drawer>
</template>

<script lang="ts" setup>
import { computed } from 'vue';
import { useTheme } from 'vuetify';
import { useAuth } from '@/composables/useAuth';
import { useAuthStore } from '@/stores/auth';
import { NAVIGATION_LIST } from '@/constants';

import ownerAvatar from '../assets/owner_avatar.png';

const theme = useTheme();
const { logout } = useAuth();
const authStore = useAuthStore();

const isDark = computed({
  get: () => theme.current.value.dark,
  set: (val: boolean) => {
    theme.global.name.value = val ? 'dark' : 'light';
  },
});

const roleDisplay = computed(() => getRoleDisplay(authStore.role));

const getRoleDisplay = (role: string) => {
  switch (role) {
    case 'owner':
      return {
        title: 'Komorebi Keeper',
        subtitle: 'Resting in the light ☀️',
      };
    case 'guest':
      return {
        title: 'Special Guest',
        subtitle: 'Here for pie & good vibes 💫',
      };
    case 'visitor':
      return {
        title: 'Little Stranger',
        subtitle: 'Peeking inside... 👀',
      };
    default:
      return {
        title: 'Welcome',
        subtitle: 'Enjoy your stay ✨',
      };
  }
};

async function handleLogout() {
  await logout();
}
</script>
