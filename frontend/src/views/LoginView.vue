<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth';
import api from '../api';

const email = ref('');
const password = ref('');
const router = useRouter();
const authStore = useAuthStore();

const showPassword = ref(false);
const isLoading = ref(false);

const togglePassword = () => {
  showPassword.value = !showPassword.value;
};

const hacerLogin = async () => {
  isLoading.value = true;
  try {
    const respuesta = await api.post('/usuarios/login', {
      email: email.value,
      password: password.value
    });

    authStore.setAuth(respuesta.data.access_token, respuesta.data.usuario.rol);

    await router.push('/actividades');
  } catch (error) {
    alert('Error al iniciar sesión. Revisa tus credenciales.');
    console.error(error);
  } finally {
    isLoading.value = false;
  }
};
</script>

<template>
  <div class="h-full min-h-screen flex items-center justify-center p-4 bg-linear-to-br from-blue-50 to-blue-100">
    <div class="w-full max-w-md">
      <div class="bg-white rounded-xl shadow-lg border border-slate-200/60 overflow-hidden">
        <div class="p-8 pb-4 text-center">
          <div class="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 text-blue-700 mb-4">
            <span class="material-symbols-outlined fill text-3xl">lock_person</span>
          </div>
          <h1 class="text-2xl font-semibold text-slate-900 mb-1">ActivityFlow</h1>
          <p class="text-sm text-slate-500">Acceso Administrativo Institucional</p>
        </div>

        <!-- Form Section -->
        <form class="p-8 pt-0 space-y-6" @submit.prevent="hacerLogin">
          <!-- Email Field -->
          <div>
            <label for="email" class="block text-xs font-semibold tracking-wide text-slate-700 mb-2">
              Correo Electrónico
            </label>
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <span class="material-symbols-outlined text-lg">mail</span>
              </div>
              <input
                id="email"
                v-model="email"
                type="email"
                required
                placeholder="usuario@institucion.edu"
                class="block w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-lg bg-slate-50 text-sm text-slate-900 placeholder-slate-400 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition-colors"
              />
            </div>
          </div>

          <!-- Password Field -->
          <div>
            <div class="flex justify-between items-center mb-2">
              <label for="password" class="block text-xs font-semibold tracking-wide text-slate-700">
                Contraseña
              </label>
              <a href="#" class="text-xs font-semibold text-blue-700 hover:text-blue-800 transition-colors">
                ¿Olvidaste tu contraseña?
              </a>
            </div>
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <span class="material-symbols-outlined text-lg">key</span>
              </div>
              <input
                id="password"
                v-model="password"
                :type="showPassword ? 'text' : 'password'"
                required
                placeholder="••••••••"
                class="block w-full pl-10 pr-10 py-2.5 border border-slate-300 rounded-lg bg-slate-50 text-sm text-slate-900 placeholder-slate-400 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition-colors"
              />
              <button
                type="button"
                class="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
                @click="togglePassword"
              >
                <span class="material-symbols-outlined text-lg">
                  {{ showPassword ? 'visibility' : 'visibility_off' }}
                </span>
              </button>
            </div>
          </div>

          <!-- Actions -->
          <div class="pt-2">
            <button
              type="submit"
              :disabled="isLoading"
              class="w-full flex items-center justify-center py-2.5 px-4 border border-transparent rounded-lg bg-blue-700 text-white text-sm font-semibold hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-700 transition-colors shadow-sm disabled:opacity-70 disabled:cursor-not-allowed"
            >
              <span v-if="isLoading" class="material-symbols-outlined animate-spin mr-2 text-lg">progress_activity</span>
              {{ isLoading ? 'Iniciando...' : 'Iniciar Sesión' }}
            </button>
          </div>
        </form>

        <!-- Footer -->
        <div class="px-8 py-4 bg-slate-50 border-t border-slate-200/60 text-center">
          <p class="text-sm text-slate-500">
            ¿Problemas de acceso?
            <a href="#" class="text-xs font-semibold text-blue-700 hover:underline">Contactar Soporte IT</a>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>