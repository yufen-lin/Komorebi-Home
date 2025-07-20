import { ref } from 'vue';
import { defineStore } from 'pinia';
import type { Ingredient } from '../type';
import { supabase } from '../lib/supabaseClient';
import { fromDbIngredient, toDbIngredient } from '../utils/ingredientTransform';

export const useIngredientStore = defineStore('ingredient', () => {
  const ingredients = ref<Ingredient[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);

  async function getCurrentUser() {
    const { data, error } = await supabase.auth.getUser();
    if (error || !data.user) throw new Error('尚未登入');
    return data.user;
  }

  async function fetchIngredients() {
    loading.value = true;
    error.value = null;

    try {
      const user = await getCurrentUser();

      const { data, error: fetchError } = await supabase
        .from('ingredients')
        .select('*')
        .eq('user_id', user.id)
        .order('expiration_date', { ascending: true, nullsFirst: false });

      if (fetchError) throw fetchError;
      ingredients.value = (data ?? []).map(fromDbIngredient);
    } catch (err: unknown) {
      if (err instanceof Error) {
        error.value = err.message;
      } else {
        error.value = '取得食材清單失敗';
      }
      ingredients.value = [];
    } finally {
      loading.value = false;
    }
  }

  async function addIngredient(newItem: Omit<Ingredient, 'id'>) {
    loading.value = true;
    error.value = null;
    try {
      const user = await getCurrentUser();
      const payload = toDbIngredient(newItem);

      const { error: insertError } = await supabase
        .from('ingredients')
        .insert([{ ...payload, user_id: user.id }])
        .select();

      if (insertError) throw insertError;
      await fetchIngredients();
    } catch (err: unknown) {
      if (err instanceof Error) {
        error.value = err.message;
      } else {
        error.value = '新增食材清單失敗';
      }
      ingredients.value = [];
    } finally {
      loading.value = false;
    }
  }

  async function updateIngredient(id: string, updatedItem: Ingredient) {
    loading.value = true;
    error.value = null;

    try {
      const user = await getCurrentUser();
      const payload = toDbIngredient(updatedItem);

      const { data, error: updateError } = await supabase
        .from('ingredients')
        .update(payload)
        .eq('id', id)
        .eq('user_id', user.id)
        .select();

      if (updateError) throw updateError;

      const updated = data?.[0];
      if (!updated) {
        throw new Error('找不到要更新的資料或更新失敗');
      }

      await fetchIngredients();
    } catch (err: unknown) {
      if (err instanceof Error) {
        error.value = err.message;
      } else {
        error.value = '更新食材清單失敗';
      }
      ingredients.value = [];
    } finally {
      loading.value = false;
    }
  }

  async function deleteIngredient(itemId: string) {
    loading.value = true;
    error.value = null;

    try {
      const user = await getCurrentUser();
      const { error: deleteError } = await supabase
        .from('ingredients')
        .delete()
        .eq('id', itemId)
        .eq('user_id', user.id);
      if (deleteError) throw deleteError;
      await fetchIngredients();
    } catch (err: unknown) {
      if (err instanceof Error) {
        error.value = err.message;
      } else {
        error.value = '刪除食材清單失敗';
      }
      ingredients.value = [];
    } finally {
      loading.value = false;
    }
  }

  function $reset() {
    ingredients.value = [];
    loading.value = false;
    error.value = null;
  }

  return {
    ingredients,
    loading,
    error,
    fetchIngredients,
    addIngredient,
    updateIngredient,
    deleteIngredient,
    $reset,
  };
});
