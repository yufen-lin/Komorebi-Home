import { ref } from 'vue';
import { defineStore } from 'pinia';
import type { ShoppingListItem, Ingredient } from '../type';
import { supabase } from '../lib/supabaseClient';
import { useIngredientStore } from './ingredients';

export const useShoppingListStore = defineStore('shoppingList', () => {
  const ingredientStore = useIngredientStore();
  const items = ref<ShoppingListItem[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);

  async function getCurrentUser() {
    const { data, error } = await supabase.auth.getUser();
    if (error || !data.user) throw new Error('尚未登入');
    return data.user;
  }

  async function fetchItems() {
    loading.value = true;
    error.value = null;

    try {
      const user = await getCurrentUser();

      const { data, error: fetchError } = await supabase
        .from('shopping_list_items')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: true });

      if (fetchError) throw fetchError;
      items.value = data || [];
    } catch (err: unknown) {
      if (err instanceof Error) {
        error.value = err.message;
      } else {
        error.value = '取得待買清單失敗';
      }
      items.value = [];
    } finally {
      loading.value = false;
    }
  }

  async function addItem(newItem: Omit<ShoppingListItem, 'id'>) {
    loading.value = true;
    error.value = null;

    try {
      const user = await getCurrentUser();

      const { error: insertError } = await supabase
        .from('shopping_list_items')
        .insert([{ ...newItem, user_id: user.id }])
        .select();

      if (insertError) throw insertError;
      await fetchItems();
    } catch (err: unknown) {
      if (err instanceof Error) {
        error.value = err.message;
      } else {
        error.value = '新增待買項目失敗';
      }
    } finally {
      loading.value = false;
    }
  }

  async function updateItem(updatedItem: ShoppingListItem) {
    loading.value = true;
    error.value = null;

    try {
      const user = await getCurrentUser();

      const { data, error: updateError } = await supabase
        .from('shopping_list_items')
        .update(updatedItem)
        .eq('id', updatedItem.id)
        .eq('user_id', user.id)
        .select();

      if (updateError) throw updateError;

      const updated = data?.[0];
      if (!updated) {
        throw new Error('找不到要更新的資料或更新失敗');
      }

      await fetchItems();
    } catch (err: unknown) {
      if (err instanceof Error) {
        error.value = err.message;
      } else {
        error.value = '更新待買項目失敗';
      }
    } finally {
      loading.value = false;
    }
  }

  async function removeItem(itemId: string) {
    loading.value = true;
    error.value = null;

    try {
      const user = await getCurrentUser();

      const { error: updateError } = await supabase
        .from('shopping_list_items')
        .update({ deleted: true })
        .eq('id', itemId)
        .eq('user_id', user.id);

      if (updateError) throw updateError;
      await fetchItems();
    } catch (err: unknown) {
      if (err instanceof Error) {
        error.value = err.message;
      } else {
        error.value = '刪除待買項目失敗';
      }
    } finally {
      loading.value = false;
    }
  }

  function parseItem(rawInput: string) {
    const text = rawInput.replace(/、|，|,/g, '\n');
    const regex =
      /^(?<icon>[\p{Emoji_Presentation}\uFE0F\u200D]+)?\s*(?<name>[\p{Script=Han}]+)x(?<quantity>\d+)(?<unit>[\p{Script=Han}]+)/u;

    let result;

    for (const line of text.split('\n')) {
      const match = regex.exec(line.trim());
      if (match && match.groups) {
        result = {
          icon: match.groups.icon || '🍽️',
          name: match.groups.name,
          quantity: Number(match.groups.quantity),
          unit: match.groups.unit,
        };
      }
      regex.lastIndex = 0;
      return result;
    }
  }

  async function completeToIngredientStore() {
    const today = new Date().toISOString().split('T')[0];
    const checkedItems = items.value.filter((item) => item.checked && !item.deleted);

    const purchasedList = [];
    const idsToDelete: string[] = [];

    for (const item of checkedItems) {
      const parseResult = parseItem(item.text);
      const newIngredient: Omit<Ingredient, 'id'> = {
        name: parseResult?.name || '',
        icon: parseResult?.icon || '🍽️',
        quantity: parseResult?.quantity || 1,
        unit: parseResult?.unit || '',
        expirationDate: null,
        storageZone: 'roomTemp',
        tags: [],
        purchaseDate: today,
        purchaseLocation: 'other',
        price: null,
      };
      purchasedList.push(newIngredient);
      idsToDelete.push(item.id);
    }
    if (purchasedList.length === 0) return;

    try {
      await ingredientStore.addIngredient(purchasedList);

      const { error } = await supabase
        .from('shopping_list_items')
        .update({ deleted: true })
        .in('id', idsToDelete);

      if (error) throw error;
      await fetchItems();
    } catch (err) {
      console.error('加入食材失敗', err);
    }
  }

  function $reset() {
    items.value = [];
    loading.value = false;
    error.value = null;
  }

  return {
    items,
    loading,
    fetchItems,
    addItem,
    updateItem,
    removeItem,
    completeToIngredientStore,
    $reset,
  };
});
