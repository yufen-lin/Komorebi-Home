import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { supabase } from '../lib/supabaseClient';
import type { Role } from '../type';

export const useAuthStore = defineStore('auth', () => {
  const role = ref<Role>('guest');

  const isLoggedIn = computed(() => role.value !== 'guest');
  const isOwner = computed(() => role.value === 'owner');

  function setRole(newRole: Role) {
    role.value = newRole;
  }

  async function loadUserInfo() {
    try {
      // Get User Session
      const { data: session, error: sessionError } = await supabase.auth.getUser();
      const user = session?.user;

      if (sessionError) {
        console.error('無法取得登入狀態：', sessionError.message);
        setRole('guest');
        return;
      }

      if (!user) {
        setRole('guest');
        return;
      }

      // Get User Info
      const { data: userInfo, error: infoError } = await supabase
        .from('users')
        .select('role')
        .eq('id', user.id)
        .single();

      if (infoError) {
        console.error('讀取使用者資訊失敗：', infoError.message);
        setRole('guest');
        return;
      }

      setRole((userInfo?.role || 'guest') as Role);
    } catch (e) {
      console.error('Error:', e);
      setRole('guest');
    }
  }

  async function logout() {
    if (!isLoggedIn.value) return;
    await supabase.auth.signOut();
    role.value = 'guest';
  }

  return {
    role,
    isLoggedIn,
    isOwner,
    setRole,
    loadUserInfo,
    logout,
  };
});
