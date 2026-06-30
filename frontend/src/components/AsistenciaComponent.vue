<template>
  <div class="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 min-h-[60vh] relative">
    
    <div class="mb-8">
      <h3 class="text-lg font-semibold text-slate-800">Control de Asistencia</h3>
      <p class="text-sm text-slate-500">Selecciona una actividad para registrar la asistencia de los estudiantes inscritos.</p>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      <div v-if="actividades.length === 0" class="col-span-full py-12 text-center border-2 border-dashed border-slate-200 rounded-xl">
        <p class="text-slate-400 font-medium">No hay actividades registradas en el sistema.</p>
      </div>

      <div 
        v-for="actividad in actividades" 
        :key="actividad.id"
        class="bg-slate-50 rounded-xl border border-slate-200 p-5 flex flex-col hover:border-blue-300 hover:shadow-md transition-all duration-200"
      >
        <div class="flex justify-between items-start mb-3">
          <h4 class="font-bold text-slate-800 pr-3 leading-tight">{{ actividad.titulo }}</h4>
          <span 
            class="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider shrink-0"
            :class="actividad.estado ? 'bg-green-100 text-green-700' : 'bg-slate-200 text-slate-500'"
          >
            {{ actividad.estado ? 'Activa' : 'Cerrada' }}
          </span>
        </div>
        <p class="text-xs text-slate-500 mb-6 grow line-clamp-2">
          {{ actividad.descripcion || 'Sin descripción detallada.' }}
        </p>

        <button 
          @click="abrirLista(actividad)"
          class="w-full bg-white border border-slate-300 text-slate-700 font-semibold py-2 rounded-lg text-sm hover:bg-slate-100 hover:text-blue-700 hover:border-blue-300 transition-colors shadow-sm flex items-center justify-center gap-2"
        >
          <span class="material-symbols-outlined text-[18px]">checklist</span>
          Pasar Lista
        </button>
      </div>
    </div>

    <div v-if="mostrarModal" class="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div class="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden animate-fade-in flex flex-col max-h-[85vh]">
        
        <div class="px-6 py-4 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
          <div>
            <h4 class="text-lg font-bold text-slate-800">Lista de Inscritos</h4>
            <p class="text-xs text-slate-500 font-medium mt-1">{{ actividadSeleccionada?.titulo }}</p>
          </div>
          <button @click="cerrarModal" class="text-slate-400 hover:text-slate-600 transition-colors">
            <span class="material-symbols-outlined">close</span>
          </button>
        </div>

        <div class="overflow-y-auto grow">
          <table class="w-full text-left border-collapse">
            <thead class="bg-white sticky top-0 border-b border-slate-200 z-10 shadow-sm">
              <tr>
                <th class="p-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Estudiante (Email)</th>
                <th class="p-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">Asistencia</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100 text-sm">
              
              <tr v-if="inscritos.length === 0">
                <td colspan="2" class="p-8 text-center text-slate-400 font-medium bg-slate-50/50">
                  Aún no hay estudiantes inscritos en esta actividad.
                </td>
              </tr>

              <tr v-for="inscrito in inscritos" :key="inscrito.id" class="hover:bg-slate-50 transition-colors">
                <td class="p-4 font-medium text-slate-800">
                  {{ inscrito.usuario.email }}
                </td>
                <td class="p-4 flex justify-end">
                  
                  <label class="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      :checked="inscrito.asistencia"
                      @change="cambiarAsistencia(inscrito.id, inscrito.asistencia)"
                      class="sr-only peer"
                    >
                    <div class="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    <span class="ml-3 text-sm font-bold w-16" :class="inscrito.asistencia ? 'text-blue-700' : 'text-slate-400'">
                      {{ inscrito.asistencia ? 'Presente' : 'Ausente' }}
                    </span>
                  </label>

                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="px-6 py-4 border-t border-slate-100 bg-slate-50 flex justify-end">
          <button @click="cerrarModal" class="px-5 py-2 text-sm font-semibold text-white bg-slate-800 hover:bg-slate-900 rounded-lg transition-colors shadow-sm">
            Cerrar Lista
          </button>
        </div>

      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import api from '../api';

interface Actividad {
  id: number;
  titulo: string;
  descripcion: string;
  estado: boolean;
}

// Interfaz para mapear la respuesta del backend
interface Participacion {
  id: number;
  asistencia: boolean;
  usuario: {
    id: number;
    email: string;
  };
}

const actividades = ref<Actividad[]>([]);
const inscritos = ref<Participacion[]>([]);
const mostrarModal = ref(false);
const actividadSeleccionada = ref<Actividad | null>(null);

const cargarActividades = async () => {
  try {
    const respuesta = await api.get('/actividades');
    actividades.value = respuesta.data;
  } catch (error) {
    console.error('Error al cargar actividades:', error);
  }
};

const abrirLista = async (actividad: Actividad) => {
  actividadSeleccionada.value = actividad;
  try {
    const respuesta = await api.get(`/participaciones/actividad/${actividad.id}`);
    inscritos.value = respuesta.data;
    mostrarModal.value = true;
  } catch (error) {
    alert('Error al obtener la lista de inscritos.');
    console.error(error);
  }
};

const cerrarModal = () => {
  mostrarModal.value = false;
  inscritos.value = [];
  actividadSeleccionada.value = null;
};

const cambiarAsistencia = async (participacionId: number, estadoActual: boolean) => {
  const nuevoEstado = !estadoActual;
  try {
    // Llamamos al endpoint que ya tenías creado: PATCH /participaciones/:id/asistencia
    await api.patch(`/participaciones/${participacionId}/asistencia`, {
      asistencia: nuevoEstado
    });
    
    // Actualizamos visualmente el array local sin recargar todo
    const participacion = inscritos.value.find(p => p.id === participacionId);
    if (participacion) {
      participacion.asistencia = nuevoEstado;
    }
  } catch (error) {
    alert('Error al guardar la asistencia.');
    console.error(error);
  }
};

onMounted(() => {
  cargarActividades();
});
</script>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.2s ease-out;
}
@keyframes fadeIn {
  from { opacity: 0; transform: scale(0.95); }
  to { opacity: 1; transform: scale(1); }
}
</style>