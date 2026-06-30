<template>
  <div class="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
    
    <div class="flex justify-between items-center mb-6">
      <div>
        <h3 class="text-lg font-semibold text-slate-800">Gestión de Actividades</h3>
        <p class="text-sm text-slate-500">Administra el catálogo de eventos y talleres</p>
      </div>
      
      <button 
        @click="prepararCreacion"
        class="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors flex items-center gap-2 shadow-sm"
      >
        <span class="material-symbols-outlined text-sm">add</span>
        Nueva Actividad
      </button>
    </div>
    
    <div class="overflow-x-auto">
      <table class="w-full text-left border-collapse">
        <thead class="bg-slate-50 text-slate-600 text-sm border-y border-slate-200">
          <tr>
            <th class="p-4 font-medium">ID</th>
            <th class="p-4 font-medium w-1/4">Título</th>
            <th class="p-4 font-medium w-2/4">Descripción</th>
            <th class="p-4 font-medium">Estado</th>
            <th class="p-4 font-medium text-right">Acciones</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-100 text-sm">
          
          <tr v-if="actividades.length === 0">
            <td colspan="5" class="p-8 text-center text-slate-400 font-medium">
              No hay actividades registradas. Haz clic en "Nueva Actividad" para comenzar.
            </td>
          </tr>

          <tr v-for="actividad in actividades" :key="actividad.id" class="hover:bg-slate-50 transition-colors">
            <td class="p-4 text-slate-500 font-medium">#{{ actividad.id }}</td>
            <td class="p-4 text-slate-800 font-semibold">{{ actividad.titulo }}</td>
            <td class="p-4 text-slate-500 truncate max-w-xs" :title="actividad.descripcion">
              {{ actividad.descripcion || 'Sin descripción' }}
            </td>
            <td class="p-4">
              <span 
                class="px-2.5 py-1 rounded-full text-xs font-bold tracking-wide"
                :class="actividad.estado ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'"
              >
                {{ actividad.estado ? 'Activa' : 'Inactiva' }}
              </span>
            </td>
            <td class="p-4 text-right space-x-2 whitespace-nowrap">
              
              <button 
                @click="prepararEdicion(actividad)"
                class="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                title="Editar actividad"
              >
                <span class="material-symbols-outlined text-[20px]">edit</span>
              </button>
              
              <button 
                @click="eliminarActividad(actividad.id)"
                class="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                title="Eliminar actividad"
              >
                <span class="material-symbols-outlined text-[20px]">delete</span>
              </button>

            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div v-if="mostrarModal" class="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div class="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden animate-fade-in">
        
        <div class="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
          <h4 class="text-lg font-bold text-slate-800">
            {{ modoModal === 'crear' ? 'Crear Nueva Actividad' : 'Editar Actividad' }}
          </h4>
          <button @click="cerrarModal" class="text-slate-400 hover:text-slate-600 transition-colors">
            <span class="material-symbols-outlined">close</span>
          </button>
        </div>

        <form @submit.prevent="guardarActividad" class="p-6 space-y-5">
          
          <div>
            <label class="block text-sm font-semibold text-slate-700 mb-1">Título de la Actividad</label>
            <input 
              v-model="formularioActividad.titulo" 
              type="text" 
              required
              placeholder="Ej: Taller de Docker Avanzado"
              class="w-full border border-slate-300 rounded-lg p-2.5 text-sm focus:border-blue-600 focus:ring-1 focus:ring-blue-600 outline-none transition-colors"
            />
          </div>

          <div>
            <div class="flex justify-between items-center mb-1">
              <label class="block text-sm font-semibold text-slate-700">Descripción</label>
              
              <button 
                type="button" 
                @click="generarDescripcionIA"
                :disabled="cargandoIA"
                class="flex items-center gap-1 text-xs font-bold text-purple-700 bg-purple-100 hover:bg-purple-200 px-2 py-1 rounded-md transition-colors disabled:opacity-50"
              >
                <span v-if="cargandoIA" class="material-symbols-outlined text-[16px] animate-spin">progress_activity</span>
                <span v-else class="material-symbols-outlined text-[16px]">auto_awesome</span>
                {{ cargandoIA ? 'Generando...' : 'Generar descripción' }}
              </button>
            </div>
            
            <textarea 
              v-model="formularioActividad.descripcion" 
              rows="4" 
              required
              placeholder="Escribe la descripción o deja que la IA lo haga por ti..."
              class="w-full border border-slate-300 rounded-lg p-2.5 text-sm focus:border-blue-600 focus:ring-1 focus:ring-blue-600 outline-none transition-colors resize-none"
            ></textarea>
          </div>

          <div class="flex items-center gap-3">
            <label class="block text-sm font-semibold text-slate-700">Estado Inicial:</label>
            <label class="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" v-model="formularioActividad.estado" class="sr-only peer">
              <div class="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"></div>
              <span class="ml-3 text-sm font-medium text-slate-600">
                {{ formularioActividad.estado ? 'Activa (Visible)' : 'Inactiva (Oculta)' }}
              </span>
            </label>
          </div>

          <div class="pt-4 flex justify-end gap-3 border-t border-slate-100">
            <button 
              type="button" 
              @click="cerrarModal"
              class="px-4 py-2 text-sm font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
            >
              Cancelar
            </button>
            <button 
              type="submit" 
              class="px-4 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors shadow-sm"
            >
              {{ modoModal === 'crear' ? 'Guardar Actividad' : 'Actualizar Cambios' }}
            </button>
          </div>
        </form>

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

const actividades = ref<Actividad[]>([]);

const mostrarModal = ref(false);
const modoModal = ref<'crear' | 'editar'>('crear');
const cargandoIA = ref(false);

const formularioActividad = ref<Partial<Actividad>>({
  titulo: '',
  descripcion: '',
  estado: true
});

const cargarActividades = async () => {
  try {
    const respuesta = await api.get('/actividades');
    actividades.value = respuesta.data;
  } catch (error) {
    console.error('Error al cargar actividades:', error);
  }
};

const eliminarActividad = async (id: number) => {
  if (!window.confirm('¿Estás seguro de que deseas eliminar esta actividad? Esta acción no se puede deshacer.')) {
    return;
  }

  try {
    await api.delete(`/actividades/${id}`);
    await cargarActividades(); 
  } catch (error) {
    alert('Ocurrió un error al intentar eliminar la actividad.');
    console.error(error);
  }
};

const prepararCreacion = () => {
  modoModal.value = 'crear';
  formularioActividad.value = { titulo: '', descripcion: '', estado: true };
  mostrarModal.value = true;
};
const prepararEdicion = (actividad: Actividad) => {
  modoModal.value = 'editar';
  formularioActividad.value = { ...actividad };
  mostrarModal.value = true;
};

const cerrarModal = () => {
  mostrarModal.value = false;
};

const generarDescripcionIA = async () => {
  if (!formularioActividad.value.titulo) {
    alert('Por favor, escribe un título primero para que la IA tenga contexto.');
    return;
  }

  cargandoIA.value = true;
  try {
    const respuesta = await api.post('/actividades/generar-descripcion', {
      titulo: formularioActividad.value.titulo
    });
    // Inyectamos la respuesta de la IA directo en el campo de descripción
    formularioActividad.value.descripcion = respuesta.data.descripcion;
  } catch (error) {
    alert('Hubo un problema de conexión con la Inteligencia Artificial.');
    console.error(error);
  } finally {
    cargandoIA.value = false;
  }
};

const guardarActividad = async () => {
  try {
    if (modoModal.value === 'crear') {
      await api.post('/actividades', formularioActividad.value);
    } else {
      // Si estamos editando, usamos el PATCH con el ID correspondiente
      await api.patch(`/actividades/${formularioActividad.value.id}`, formularioActividad.value);
    }
    
    cerrarModal();
    await cargarActividades(); // Refrescamos la tabla
  } catch (error) {
    alert('Error al guardar la actividad en la base de datos.');
    console.error(error);
  }
};

onMounted(() => {
  cargarActividades();
});
</script>