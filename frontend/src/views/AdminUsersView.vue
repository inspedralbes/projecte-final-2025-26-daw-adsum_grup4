<template>
  <div class="space-y-6">
    <div class="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100">
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-sm font-black text-slate-400 uppercase tracking-widest">Gestió d'Usuaris</h2>
        <button @click="carregarUsuaris" class="text-indigo-600 hover:text-indigo-700 text-sm font-bold">
          Actualitzar
        </button>
      </div>

      <div class="flex gap-2 mb-4">
        <button v-for="rol in ['tot', 'alumne', 'professor', 'admin']" :key="rol"
          @click="filtreRol = rol"
          class="px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest transition-colors"
          :class="filtreRol === rol ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'"
        >
          {{ rol === 'tot' ? 'Tots' : rol }}
        </button>
      </div>
      
      <div v-if="loading" class="text-center py-8 text-slate-400">
        <p class="text-2xl mb-2">⏳</p>
        <p class="text-sm font-bold">Carregant...</p>
      </div>
      
      <div v-else class="overflow-x-auto">
        <table class="w-full">
          <thead>
            <tr class="border-b border-slate-100">
              <th class="text-left text-[10px] font-black text-slate-400 uppercase tracking-widest py-3">Nom</th>
              <th class="text-left text-[10px] font-black text-slate-400 uppercase tracking-widest py-3">Email</th>
              <th class="text-center text-[10px] font-black text-slate-400 uppercase tracking-widest py-3">Rol</th>
              <th class="text-center text-[10px] font-black text-slate-400 uppercase tracking-widest py-3">Estat</th>
              <th class="text-center text-[10px] font-black text-slate-400 uppercase tracking-widest py-3">Accions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="u in usuarisFiltrats" :key="u.id" class="border-b border-slate-50 last:border-0">
              <td class="py-3">
                <p class="text-sm font-bold text-slate-700">{{ u.nom }} {{ u.cognoms }}</p>
              </td>
              <td class="py-3">
                <p class="text-sm text-slate-500">{{ u.email }}</p>
              </td>
              <td class="text-center py-3">
                <span class="text-[10px] font-black px-2 py-1 rounded-full uppercase"
                  :class="{
                    'bg-indigo-100 text-indigo-700': u.rol === 'admin',
                    'bg-emerald-100 text-emerald-700': u.rol === 'professor',
                    'bg-amber-100 text-amber-700': u.rol === 'alumne'
                  }"
                >
                  {{ u.rol }}
                </span>
              </td>
              <td class="text-center py-3">
                <span class="text-[10px] font-black px-2 py-1 rounded-full uppercase"
                  :class="u.esActiu ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'"
                >
                  {{ u.esActiu ? 'Actiu' : 'Inactiu' }}
                </span>
              </td>
              <td class="text-center py-3">
                <button @click="editarUsuari(u)" class="text-indigo-600 hover:text-indigo-700 mr-2">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                  </svg>
                </button>
                <button @click="eliminarUsuari(u)" class="text-rose-600 hover:text-rose-700">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div v-if="usuariEditant" class="fixed inset-0 z-50 flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-sm">
      <div class="bg-white p-6 rounded-[2rem] w-full max-w-md">
        <h3 class="text-lg font-black text-slate-800 mb-4">Editar Usuari</h3>
        <div class="space-y-4">
          <div>
            <label class="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Nom</label>
            <input v-model="usuariEditant.nom" class="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-100" />
          </div>
          <div>
            <label class="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Cognoms</label>
            <input v-model="usuariEditant.cognoms" class="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-100" />
          </div>
          <div>
            <label class="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Rol</label>
            <select v-model="usuariEditant.rol" class="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-100">
              <option value="alumne">Alumne</option>
              <option value="professor">Professor</option>
              <option value="admin">Admin</option>
            </select>
          </div>
        </div>
        <div class="flex gap-2 mt-6">
          <button @click="usuariEditant = null" class="flex-1 py-3 rounded-2xl bg-slate-100 font-bold text-slate-600">Cancel·lar</button>
          <button @click="guardarCanvis" class="flex-1 py-3 rounded-2xl bg-indigo-600 text-white font-bold">Guardar</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { API_BASE_URL } from '@/config/api';

const props = defineProps({ user: Object });

const loading = ref(true);
const usuaris = ref([]);
const filtreRol = ref('tot');
const usuariEditant = ref(null);

const usuarisFiltrats = computed(() => {
  if (filtreRol.value === 'tot') return usuaris.value;
  return usuaris.value.filter(u => u.rol === filtreRol.value);
});

const carregarUsuaris = async () => {
  loading.value = true;
  try {
    const res = await fetch(`${API_BASE_URL}/api/usuaris`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('access_token')}` }
    });
    if (res.ok) usuaris.value = await res.json();
  } catch (e) {
    console.error(e);
  } finally {
    loading.value = false;
  }
};

const editarUsuari = (u) => {
  usuariEditant.value = { ...u };
};

const guardarCanvis = async () => {
  const res = await fetch(`${API_BASE_URL}/api/usuaris/${usuariEditant.value.id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${localStorage.getItem('access_token')}` },
    body: JSON.stringify(usuariEditant.value)
  });
  if (res.ok) {
    carregarUsuaris();
    usuariEditant.value = null;
  }
};

const eliminarUsuari = async (u) => {
  if (!confirm(`Eliminar ${u.nom}?`)) return;
  await fetch(`${API_BASE_URL}/api/usuaris/${u.id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${localStorage.getItem('access_token')}` }
  });
  carregarUsuaris();
};

onMounted(carregarUsuaris);
</script>