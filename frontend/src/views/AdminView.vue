<template>
  <div class="flex h-screen bg-slate-50 font-sans overflow-hidden">
    
    <aside class="w-64 bg-slate-900 text-slate-300 flex flex-col transition-all duration-300">
      <div class="h-20 flex items-center px-8 border-b border-slate-800">
        <div class="flex items-center gap-3">
          <span class="material-symbols-outlined text-blue-500 text-3xl">admin_panel_settings</span>
          <h1 class="text-white font-bold text-lg tracking-wide">Admin Flow</h1>
        </div>
      </div>

      <nav class="flex-1 py-6 px-4 space-y-2">
        <button 
          v-for="item in menuItems" 
          :key="item.id"
          @click="currentTab = item.id"
          :class="[
            'w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 font-medium text-sm',
            currentTab === item.id 
              ? 'bg-blue-600 text-white shadow-md shadow-blue-900/20' 
              : 'hover:bg-slate-800 hover:text-white text-slate-400'
          ]"
        >
          <span class="material-symbols-outlined text-xl">{{ item.icon }}</span>
          {{ item.label }}
        </button>
      </nav>

      <div class="p-4 border-t border-slate-800">
        <button 
          @click="cerrarSesion" 
          class="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-red-500/10 hover:text-red-400 text-slate-400 transition-colors font-medium text-sm"
        >
          <span class="material-symbols-outlined text-xl">logout</span>
          Cerrar Sesión
        </button>
      </div>
    </aside>

    <main class="flex-1 flex flex-col h-screen relative overflow-y-auto">
      
      <header class="h-20 bg-white border-b border-slate-200 flex items-center px-8 sticky top-0 z-10">
        <h2 class="text-2xl font-bold text-slate-800 capitalize">
          {{ menuItems.find(m => m.id === currentTab)?.label }}
        </h2>
      </header>

      <div class="p-8">
        
        <div v-if="currentTab === 'dashboard'" class="animate-fade-in">
          <p class="text-slate-500">Bienvenido al panel de administración. Selecciona una opción en el menú lateral.</p>
          </div>

        <div v-if="currentTab === 'actividades'" class="animate-fade-in">
            <ActividadComponent />
        </div>

        <div v-if="currentTab === 'asistencia'" class="animate-fade-in">
            <AsistenciaComponent />
        </div>

        <div v-if="currentTab === 'roles'" class="animate-fade-in">
            <GestionRolComponent />
        </div>

      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth';
import GestionRolComponent from '../components/GestionRolComponent.vue';
import ActividadComponent from '../components/ActividadComponent.vue';
import AsistenciaComponent from '../components/AsistenciaComponent.vue';

const router = useRouter();
const authStore = useAuthStore();

const currentTab = ref('dashboard');

const menuItems = [
  { id: 'dashboard', label: 'Dashboard', icon: 'space_dashboard' },
  { id: 'actividades', label: 'Actividades', icon: 'local_activity' },
  { id: 'asistencia', label: 'Control Asistencia', icon: 'fact_check' },
  { id: 'roles', label: 'Gestión de Roles', icon: 'manage_accounts' },
];

const cerrarSesion = () => {
  authStore.logout();
  router.push('/login');
};
</script>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.3s ease-in-out;
}
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(5px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>