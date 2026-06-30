// frontend/src/stores/auth.ts
import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useAuthStore = defineStore('auth', () => {
  const token = ref<string | null>(localStorage.getItem('token'));
  const rol = ref<string | null>(localStorage.getItem('rol'));

  const setAuth = (newToken: string, newRol: string) => {
    token.value = newToken;
    rol.value = newRol;
    localStorage.setItem('token', newToken);
    localStorage.setItem('rol', newRol);
  };

  const logout = () => {
    token.value = null;
    rol.value = null;
    localStorage.removeItem('token');
    localStorage.removeItem('rol');
  };

  return { token, rol, setAuth, logout };
});