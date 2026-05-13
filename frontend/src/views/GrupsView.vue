<template>
  <div class="space-y-6">
    <div class="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100">
      <h2 class="text-sm font-black text-slate-400 uppercase tracking-widest mb-4">Els meus Grups</h2>
      
      <div v-if="loading" class="text-center py-8 text-slate-400">
        <p class="text-2xl mb-2">⏳</p>
        <p class="text-sm font-bold">Carregant...</p>
      </div>
      
      <div v-else-if="grups.length === 0" class="text-center py-8 text-slate-400">
        <p class="text-2xl mb-2">📚</p>
        <p class="text-sm font-bold">No tens grups assignats</p>
      </div>
      
      <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div v-for="grup in grups" :key="grup.id" 
          class="bg-slate-50 p-4 rounded-2xl border border-slate-100 hover:border-indigo-200 transition-colors cursor-pointer"
          @click="seleccionarGrup(grup)"
        >
          <div class="flex items-center justify-between mb-2">
            <h3 class="text-lg font-black text-slate-800">{{ grup.nom }}</h3>
            <span class="text-[10px] font-black text-indigo-600 uppercase bg-indigo-50 px-2 py-1 rounded-full">{{ grup.codi }}</span>
          </div>
          <p class="text-sm text-slate-500">{{ grup.alumnes?.length || 0 }} alumnes</p>
          <div class="mt-3 flex items-center justify-between">
            <span class="text-[10px] text-slate-400">Estadístiques</span>
            <div class="flex gap-2">
              <span class="text-xs font-bold text-emerald-600">{{ grup.assistencies?.percentatge || 0 }}% assist.</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-if="grupSeleccionat" class="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100">
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-sm font-black text-slate-400 uppercase tracking-widest">{{ grupSeleccionat.nom }}</h2>
        <button @click="grupSeleccionat = null" class="text-slate-400 hover:text-slate-600">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead>
            <tr class="border-b border-slate-100">
              <th class="text-left text-[10px] font-black text-slate-400 uppercase tracking-widest py-3">Alumne</th>
              <th class="text-center text-[10px] font-black text-slate-400 uppercase tracking-widest py-3">Assist.</th>
              <th class="text-center text-[10px] font-black text-slate-400 uppercase tracking-widest py-3">Nota</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="alumne in grupSeleccionat.alumnes" :key="alumne.id" class="border-b border-slate-50 last:border-0">
              <td class="py-3">
                <p class="text-sm font-bold text-slate-700">{{ alumne.nom }} {{ alumne.cognoms }}</p>
                <p class="text-[10px] text-slate-400">{{ alumne.email }}</p>
              </td>
              <td class="text-center py-3">
                <span class="text-sm font-black" :class="alumne.assistencies?.percentatge >= 85 ? 'text-emerald-600' : alumne.assistencies?.percentatge >= 70 ? 'text-amber-600' : 'text-rose-600'">
                  {{ alumne.assistencies?.percentatge || 0 }}%
                </span>
              </td>
              <td class="text-center py-3">
                <span class="text-sm font-black text-slate-700">{{ alumne.notaMitjana || '-' }}</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { API_BASE_URL } from '@/config/api';

const props = defineProps({ user: Object });

const loading = ref(true);
const grups = ref([]);
const grupSeleccionat = ref(null);

const carregarGrups = async () => {
  loading.value = true;
  try {
    const res = await fetch(`${API_BASE_URL}/api/usuaris/professor/${props.user.id}/moduls`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('access_token')}` }
    });
    if (res.ok) {
      grups.value = await res.json();
    }
  } catch (e) {
    console.error(e);
  } finally {
    loading.value = false;
  }
};

const seleccionarGrup = (grup) => {
  grupSeleccionat.value = grup;
};

onMounted(carregarGrups);
</script>