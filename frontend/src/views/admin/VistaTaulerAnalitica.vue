<template>
  <div class="animate-fade-in space-y-6">
    <header>
      <h2 class="text-2xl font-black text-slate-800 tracking-tight italic uppercase">Tauler d'Analítica</h2>
      <p class="text-slate-500 text-sm mt-1">Visió general de l'absentisme i estadístiques del centre</p>
    </header>

    <div v-if="loading" class="flex justify-center p-12">
      <div class="w-8 h-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
    </div>
    
    <div v-else-if="error" class="bg-red-50 text-red-600 p-4 rounded-xl text-sm font-medium">
      {{ error }}
    </div>

    <div v-else class="space-y-6">
      <!-- Targetes Superiors -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div class="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col gap-2">
          <div class="flex items-center gap-2 text-slate-500 text-xs font-bold uppercase tracking-wider">
            <span>Faltes Totals (Setmana)</span>
          </div>
          <div class="text-3xl font-black text-slate-800">{{ stats.totalAbsenciesIda }}</div>
          <div class="text-xs font-medium text-amber-600 bg-amber-50 self-start px-2 py-1 rounded-md">
            {{ stats.tendencia }}
          </div>
        </div>
        
        <div class="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col gap-2">
          <div class="flex items-center gap-2 text-slate-500 text-xs font-bold uppercase tracking-wider">
            <span>Hores Crítiques</span>
          </div>
          <ul class="space-y-2 mt-2">
            <li v-for="(hora, index) in stats.horesCritiques" :key="index" class="text-sm font-medium text-slate-700 bg-slate-50 px-3 py-2 rounded-lg">
              {{ hora }}
            </li>
          </ul>
        </div>
      </div>

      <!-- Llistes de Risc -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div class="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div class="px-5 py-4 border-b border-slate-100 bg-slate-50/50">
            <h3 class="font-bold text-slate-800 text-sm uppercase tracking-wider">Grups amb més faltes</h3>
          </div>
          <div class="divide-y divide-slate-100">
            <div v-for="grup in stats.grupsRisc" :key="grup.nom" class="px-5 py-3 flex items-center justify-between">
              <span class="font-bold text-slate-700">{{ grup.nom }}</span>
              <span class="text-sm font-black text-red-500 bg-red-50 px-3 py-1 rounded-full">{{ grup.faltes }} faltes</span>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div class="px-5 py-4 border-b border-slate-100 bg-slate-50/50">
            <h3 class="font-bold text-slate-800 text-sm uppercase tracking-wider">Alertes d'Alumnes</h3>
          </div>
          <div class="divide-y divide-slate-100">
            <div v-for="alumne in stats.alumnesAlerta" :key="alumne.id" class="px-5 py-3 flex items-center justify-between">
              <div>
                <div class="font-bold text-slate-700">{{ alumne.nom }} {{ alumne.cognoms }}</div>
                <div class="text-xs text-slate-400 font-medium">{{ alumne.curs }}</div>
              </div>
              <span class="text-xs font-bold text-amber-600 bg-amber-50 px-2 py-1 rounded-md">
                {{ alumne.faltesRecents }} faltes recents
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const stats = ref(null);
const loading = ref(true);
const error = ref(null);

const fetchAnalitiques = async () => {
  try {
    const response = await fetch('/api/admin/analitica/absentisme', {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('access_token')}`
      }
    });
    if (!response.ok) throw new Error('Error carregant analítiques');
    stats.value = await response.json();
  } catch (err) {
    error.value = err.message;
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchAnalitiques();
});
</script>
