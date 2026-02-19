<template>
  <div class="space-y-5">

    <!-- Resum de stats -->
    <div v-if="loading" class="text-center py-10 text-slate-400">
      <p class="text-3xl mb-2">⏳</p>
      <p class="text-sm font-bold">Carregant dades...</p>
    </div>

    <div v-else-if="error" class="text-center py-10 text-rose-400">
      <p class="text-3xl mb-2">⚠️</p>
      <p class="text-sm font-bold">{{ error }}</p>
    </div>

    <template v-else>
      <!-- Targetes de resum -->
      <div class="grid grid-cols-3 gap-3">
        <div class="bg-emerald-50 rounded-2xl p-4 text-center">
          <p class="text-2xl font-black text-emerald-600">{{ stats.percentatge }}%</p>
          <p class="text-[10px] font-bold uppercase text-emerald-400 mt-0.5">Assistència</p>
        </div>
        <div class="bg-indigo-50 rounded-2xl p-4 text-center">
          <p class="text-2xl font-black text-indigo-600">{{ stats.ratxa }}</p>
          <p class="text-[10px] font-bold uppercase text-indigo-400 mt-0.5">Ratxa 🔥</p>
        </div>
        <div class="bg-rose-50 rounded-2xl p-4 text-center">
          <p class="text-2xl font-black text-rose-600">{{ stats.absents }}</p>
          <p class="text-[10px] font-bold uppercase text-rose-400 mt-0.5">Faltes</p>
        </div>
      </div>

      <!-- Barra de progrés -->
      <div class="bg-white rounded-2xl p-4 shadow-sm border border-slate-100">
        <div class="flex justify-between items-center mb-2">
          <p class="text-xs font-black text-slate-600 uppercase tracking-wide">Progrés global</p>
          <p class="text-xs font-bold text-slate-400">{{ stats.presents }}/{{ stats.total }} sessions</p>
        </div>
        <div class="w-full bg-slate-100 rounded-full h-3">
          <div
            class="h-3 rounded-full transition-all duration-700"
            :class="stats.percentatge >= 85 ? 'bg-emerald-500' : stats.percentatge >= 70 ? 'bg-amber-400' : 'bg-rose-500'"
            :style="{ width: stats.percentatge + '%' }"
          ></div>
        </div>
        <p class="text-[10px] text-slate-400 mt-1">
          {{ stats.percentatge >= 85 ? '✅ Assistència correcta' : stats.percentatge >= 70 ? '⚠️ En risc' : '❌ Assistència insuficient' }}
        </p>
      </div>

      <!-- Historial recent -->
      <div class="bg-white rounded-2xl p-4 shadow-sm border border-slate-100">
        <p class="text-xs font-black text-slate-600 uppercase tracking-wide mb-3">Últimes sessions</p>
        <div class="space-y-2">
          <div
            v-for="(a, i) in recents"
            :key="i"
            class="flex items-center justify-between py-2 border-b border-slate-50 last:border-0"
          >
            <div>
              <p class="text-xs font-bold text-slate-700">{{ a.modul }}</p>
              <p class="text-[10px] text-slate-400">{{ formatData(a.data) }} · {{ a.hora.slice(0, 5) }}</p>
            </div>
            <span
              class="text-[10px] font-black px-2 py-1 rounded-full uppercase"
              :class="{
                'bg-emerald-100 text-emerald-700': a.estat === 'present',
                'bg-rose-100 text-rose-700': a.estat === 'absent',
                'bg-amber-100 text-amber-700': a.estat === 'retard',
                'bg-indigo-100 text-indigo-700': a.estat === 'justificat',
              }"
            >{{ a.estat }}</span>
          </div>
        </div>
      </div>
    </template>

  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const loading = ref(true);
const error = ref(null);
const stats = ref({});
const recents = ref([]);

// ID de l'alumna hardcoded per al MVP (Andreia = id 2)
const ALUMNE_ID = 2;

onMounted(async () => {
  try {
    const res = await fetch(`http://localhost:3000/alumne/${ALUMNE_ID}/stats`);
    if (!res.ok) throw new Error('Error al carregar les dades');
    const data = await res.json();
    stats.value = data.stats;
    recents.value = data.recents;
  } catch (e) {
    error.value = 'No s\'han pogut carregar les dades. Comprova que el servidor està actiu.';
  } finally {
    loading.value = false;
  }
});

function formatData(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleDateString('ca-ES', { day: '2-digit', month: 'short' });
}
</script>
