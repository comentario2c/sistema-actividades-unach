<template>
  <div class="min-h-screen bg-slate-50 p-8">
    <div class="max-w-6xl mx-auto">
      
      <div class="flex justify-between items-center mb-10">
        <div>
          <h1 class="text-3xl font-extrabold text-slate-900 tracking-tight">Explorar Actividades</h1>
          <p class="text-slate-500 mt-1 text-sm">Inscríbete en los próximos eventos y talleres</p>
        </div>
        <button @click="cerrarSesion" class="text-sm font-semibold text-slate-400 hover:text-slate-800 transition">
          Cerrar Sesión
        </button>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          v-for="actividad in actividades"
          :key="actividad.id"
          class="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 flex flex-col h-full hover:shadow-md transition duration-200"
        >
          <div class="flex justify-between items-start mb-4">
            <h2 class="text-xl font-bold text-slate-800 leading-tight pr-4">{{ actividad.titulo }}</h2>
            
            <span
              class="px-3 py-1 text-xs font-bold rounded-full whitespace-nowrap"
              :class="actividad.estado ? 'bg-green-100 text-green-700' : 'bg-red-50 text-red-500'"
            >
              {{ actividad.estado ? 'Activa' : 'Cerrada' }}
            </span>
          </div>

          <p class="text-slate-500 text-sm mb-8 grow leading-relaxed">
            {{ actividad.descripcion || 'Sin descripción detallada.' }}
          </p>

          <button
            @click="inscribirse(actividad.id)"
            :disabled="!actividad.estado"
            class="w-full py-3 rounded-xl text-sm font-bold transition transform active:scale-95"
            :class="actividad.estado
              ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-md'
              : 'bg-slate-100 text-slate-400 cursor-not-allowed'"
          >
            Inscribirse
          </button>
        </div>
      </div>

      <div v-if="actividades.length === 0" class="text-center py-20">
        <p class="text-slate-400 font-medium">No hay actividades disponibles en este momento.</p>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth';
import api from '../api';
import axios from 'axios';

interface Actividad {
  id: number;
  titulo: string;
  descripcion: string;
  estado: boolean;
}

const actividades = ref<Actividad[]>([]);
const router = useRouter();
const authStore = useAuthStore();

const cargarActividades = async () => {
  try {
    const res = await api.get('/actividades');
    actividades.value = res.data;
  } catch (error) {
    console.error('Error al cargar actividades:', error);
  }
};

const inscribirse = async (actividadId: number) => {
  try {
    const token = authStore.token;
    if (!token) throw new Error("No hay sesión activa");

    const payloadBase64 = token.split('.')[1];
    if (!payloadBase64) {
      throw new Error("Token inválido");
    }
    const payload = JSON.parse(atob(payloadBase64));

    if (!payload?.sub || typeof payload.sub !== 'string') {
      throw new Error("Token inválido");
    }

    const usuarioId = payload.sub;

    await api.post('/participaciones/inscribir', {
      usuarioId,
      actividadId
    });

    alert('¡Inscripción exitosa!');
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 409) {
        alert('Ya estás inscrito en esta actividad.');
      } else {
        alert('Error al procesar la inscripción.');
      }
    } else {
      alert('Error desconocido.');
    }

    console.error(error);
  }
};

const cerrarSesion = () => {
  authStore.logout();
  router.push('/login');
};

onMounted(() => {
  cargarActividades();
});
</script>