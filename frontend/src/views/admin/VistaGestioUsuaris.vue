<template>
  <div class="animate-fade-in space-y-6">
    <header class="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <h2 class="text-2xl font-black text-slate-800 tracking-tight italic uppercase">Gestió d'Usuaris</h2>
        <p class="text-slate-500 text-sm mt-1">Administració de perfils: alumnat, professorat i famílies</p>
      </div>
      <button class="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl font-bold text-sm transition-colors self-start shadow-sm shadow-indigo-200">
        + Nou Usuari
      </button>
    </header>

    <div class="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
      <div class="p-4 border-b border-slate-100 flex gap-2 overflow-x-auto">
        <button 
          v-for="rol in ['tots', 'alumne', 'professor', 'admin', 'familiar']" :key="rol"
          @click="filtreRol = rol"
          class="px-4 py-2 rounded-lg text-sm font-bold uppercase tracking-wider transition-colors whitespace-nowrap"
          :class="filtreRol === rol ? 'bg-indigo-50 text-indigo-700' : 'text-slate-500 hover:bg-slate-50'"
        >
          {{ rol }}
        </button>
      </div>

      <div v-if="loading" class="flex justify-center p-12">
        <div class="w-8 h-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
      </div>
      
      <div v-else-if="error" class="bg-red-50 text-red-600 p-4 m-4 rounded-xl text-sm font-medium">
        {{ error }}
      </div>

      <div v-else class="overflow-x-auto">
        <table class="w-full text-left border-collapse min-w-[600px]">
          <thead>
            <tr class="bg-slate-50/50 text-xs uppercase tracking-wider text-slate-500 font-bold border-b border-slate-100">
              <th class="p-4 font-bold">Nom i Cognoms</th>
              <th class="p-4 font-bold">Correu / DNI</th>
              <th class="p-4 font-bold">Rol</th>
              <th class="p-4 font-bold">Estat</th>
              <th class="p-4 font-bold text-right">Accions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100">
            <tr v-for="usuari in usuarisFiltrats" :key="usuari.id" class="hover:bg-slate-50/50 transition-colors">
              <td class="p-4">
                <div class="font-bold text-slate-800">{{ usuari.nom }} {{ usuari.cognoms }}</div>
                <div class="text-xs text-slate-400 font-medium">ID: {{ usuari.id }}</div>
              </td>
              <td class="p-4 text-sm text-slate-600">
                <div>{{ usuari.correu }}</div>
                <div class="text-xs text-slate-400 font-mono">{{ usuari.dni }}</div>
              </td>
              <td class="p-4">
                <span class="px-2 py-1 rounded-md text-[10px] font-black uppercase tracking-widest"
                  :class="{
                    'bg-blue-50 text-blue-600': usuari.rol === 'alumne',
                    'bg-emerald-50 text-emerald-600': usuari.rol === 'professor',
                    'bg-purple-50 text-purple-600': usuari.rol === 'admin',
                    'bg-orange-50 text-orange-600': usuari.rol === 'familiar'
                  }">
                  {{ usuari.rol }}
                </span>
              </td>
              <td class="p-4">
                <span class="flex items-center gap-1.5 text-xs font-bold" :class="usuari.actiu ? 'text-emerald-500' : 'text-slate-400'">
                  <div class="w-2 h-2 rounded-full" :class="usuari.actiu ? 'bg-emerald-500' : 'bg-slate-300'"></div>
                  {{ usuari.actiu ? 'Actiu' : 'Inactiu' }}
                </span>
              </td>
              <td class="p-4 text-right space-x-2">
                <button @click="editarUsuari(usuari)" class="text-indigo-600 hover:bg-indigo-50 p-2 rounded-lg transition-colors text-sm font-bold">
                  Editar
                </button>
                <button @click="eliminarUsuari(usuari.id)" class="text-red-500 hover:bg-red-50 p-2 rounded-lg transition-colors text-sm font-bold">
                  Esborrar
                </button>
              </td>
            </tr>
            <tr v-if="usuarisFiltrats.length === 0">
              <td colspan="5" class="p-8 text-center text-slate-400 text-sm font-medium">
                No hi ha usuaris per mostrar en aquesta categoria.
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';

const usuaris = ref([]);
const loading = ref(true);
const error = ref(null);
const filtreRol = ref('tots');

const usuarisFiltrats = computed(() => {
  if (filtreRol.value === 'tots') return usuaris.value;
  return usuaris.value.filter(u => u.rol === filtreRol.value);
});

const carregarUsuaris = async () => {
  try {
    loading.value = true;
    const res = await fetch('/api/admin/usuaris', {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('access_token')}` }
    });
    if (!res.ok) throw new Error('Error carregant el directori d\'usuaris');
    usuaris.value = await res.json();
  } catch (err) {
    error.value = err.message;
  } finally {
    loading.value = false;
  }
};

const eliminarUsuari = async (id) => {
  if (!confirm("N'estàs segur que vols eliminar aquest usuari? Aquesta acció és irreversible.")) return;
  
  try {
    const res = await fetch(`/api/admin/usuaris/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${localStorage.getItem('access_token')}` }
    });
    if (!res.ok) throw new Error('Fallo en eliminar');
    usuaris.value = usuaris.value.filter(u => u.id !== id);
  } catch(err) {
    alert(err.message);
  }
};

const editarUsuari = (usuari) => {
  alert(`Edició en construcció per l\'ID: ${usuari.id}`);
  // Aquí obriríem un modal
};

onMounted(() => {
  carregarUsuaris();
});
</script>
