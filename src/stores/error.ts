import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useErrorStore = defineStore('error', () => {
  const message = ref('');
  const show = ref(false);
  const timeout = ref(3000);

  function setError(msg: string) {
    message.value = msg;
  }

  function showError(msg: string, duration = 3000) {
    message.value = msg;
    show.value = true;
    timeout.value = duration;
  }

  function hideError() {
    message.value = '';
    show.value = false;
  }

  return {
    message,
    show,
    timeout,
    setError,
    showError,
    hideError,
  };
});
