import { reactive } from 'vue';
import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '../stores/auth';

import HomeView from '../views/HomeView.vue';
import UnderConstruction from '../components/UnderConstruction.vue';

const routes = [
  {
    path: '/',
    name: 'Home',
    component: HomeView,
    meta: { requiresAuth: true },
  },
  {
    path: '/fridge',
    name: 'Fridge',
    component: () => import('../views/FridgeView.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/shopping-list',
    name: 'Shopping List',
    component: () => import('../views/ShoppingListView.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/menu',
    name: 'Menu',
    component: UnderConstruction,
    meta: { requiresAuth: false },
  },
];

export const router = createRouter({
  history: createWebHistory(),
  routes,
});

export const loginGuardState = reactive({
  showLoginDialog: false,
  redirectPathAfterLogin: '',
});

router.beforeEach(async (to, _, next) => {
  const authStore = useAuthStore();
  if (authStore.role === 'guest') {
    await authStore.loadUserInfo();
  }

  if (to.meta.requiresAuth && !authStore.isLoggedIn) {
    loginGuardState.showLoginDialog = true;
    loginGuardState.redirectPathAfterLogin = to.fullPath;

    next(false);
  } else {
    next();
  }
});
