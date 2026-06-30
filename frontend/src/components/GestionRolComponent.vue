<template>
  <div class="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
    <h3 class="text-lg font-semibold text-slate-800 mb-6">Gestión de Roles de Usuario</h3>
    
    <div class="overflow-x-auto">
      <table class="w-full text-left border-collapse">
        <thead class="bg-slate-50 text-slate-600 text-sm">
          <tr>
            <th class="p-4 font-medium border-b border-slate-200">ID</th>
            <th class="p-4 font-medium border-b border-slate-200">Correo Electrónico</th>
            <th class="p-4 font-medium border-b border-slate-200">Rol Actual</th>
            <th class="p-4 font-medium border-b border-slate-200 text-right">Acción</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-100 text-sm">
          <tr v-for="usuario in usuarios" :key="usuario.id" class="hover:bg-slate-50 transition-colors">
            <td class="p-4 text-slate-500">{{ usuario.id }}</td>
            <td class="p-4 font-medium text-slate-800">{{ usuario.email }}</td>
            <td class="p-4">
              <span 
                class="px-2.5 py-1 rounded-full text-xs font-bold tracking-wide"
                :class="usuario.rol === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-slate-100 text-slate-600'"
              >
                {{ usuario.rol }}
              </span>
            </td>
            <td class="p-4 text-right">
              <button 
                v-if="usuario.rol !== 'admin'"
                @click="hacerAdmin(usuario.id)" 
                class="bg-slate-900 text-white px-3 py-1.5 rounded-lg text-xs font-semibold hover:bg-slate-800 transition-transform active:scale-95 shadow-sm"
              >
                Administrador
              </button>
              <span v-else class="text-xs text-slate-400 italic pr-2">Sin acciones</span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import api from '../api';

interface Usuario {
  id: number;
  email: string;
  rol: string;
}

const usuarios = ref<Usuario[]>([]);

// 1. Obtener la lista de usuarios
const cargarUsuarios = async () => {
  try {
    const respuesta = await api.get('/usuarios');
    usuarios.value = respuesta.data;
  } catch (error) {
    console.error('Error al cargar la lista de usuarios:', error);
  }
};

// 2. Cambiar el rol al presionar el botón
const hacerAdmin = async (id: number) => {
  try {
    await api.patch(`/usuarios/${id}/rol`, { rol: 'admin' });
    
    await cargarUsuarios();
  } catch (error) {
    alert('Ocurrió un error al intentar actualizar el rol.');
    console.error(error);
  }
};

// Ejecutar la carga de usuarios apenas el componente se monte en pantalla
onMounted(() => {
  cargarUsuarios();
});
</script>