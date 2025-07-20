import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth';
import { useIngredientStore } from '../stores/ingredients';

export function useAuth() {
  const router = useRouter();
  const authStore = useAuthStore();
  const ingredientStore = useIngredientStore();

  async function logout() {
    try {
      authStore.logout();
      ingredientStore.$reset();

      await router.push('/menu');
    } catch (error) {
      console.error('登出失敗:', error);
    }
  }

  return {
    logout,
  };
}
