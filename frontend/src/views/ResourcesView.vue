<template>
  <div class="space-y-6">
    <div class="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100">
      <h2 class="text-sm font-black text-slate-400 uppercase tracking-widest mb-4">Recursos del Curs</h2>
      
      <div v-if="loading" class="text-center py-8 text-slate-400">
        <p class="text-2xl mb-2">⏳</p>
        <p class="text-sm font-bold">Carregant...</p>
      </div>
      
      <div v-else class="space-y-3">
        <div v-for="r in recursos" :key="r.id" class="p-4 bg-slate-50 rounded-2xl border border-slate-100">
          <div class="flex items-start justify-between">
            <div>
              <h3 class="text-sm font-bold text-slate-700">{{ r.titol }}</h3>
              <p class="text-[10px] text-slate-400 mt-1">{{ r.descripcio }}</p>
            </div>
            <span class="text-[10px] font-black px-2 py-1 rounded-full uppercase bg-indigo-100 text-indigo-700">
              {{ r.tipus }}
            </span>
          </div>
          <a v-if="r.url" :href="r.url" target="_blank" class="mt-3 inline-flex items-center gap-2 text-indigo-600 text-sm font-bold hover:text-indigo-700">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
            Accedir
          </a>
        </div>
        
        <div v-if="!recursos.length" class="text-center py-8 text-slate-400">
          <p class="text-2xl mb-2">📚</p>
          <p class="text-sm font-bold">No hi han recursos disponibles</p>
        </div>
      </div>
    </div>

    <div class="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100">
      <h2 class="text-sm font-black text-slate-400 uppercase tracking-widest mb-4">Enllaços Ràpids</h2>
      <div class="grid grid-cols-2 gap-3">
        <a href="https://agora.xtec.cat/inspedralbes/" target="_blank" class="p-4 bg-slate-50 rounded-2xl border border-slate-100 hover:border-indigo-200 transition-colors text-center">
          <p class="text-sm font-bold text-slate-700">Portal Àgora</p>
          <p class="text-[10px] text-slate-400">Institut</p>
        </a>
        <a href="https://educaciodigital.cat/" target="_blank" class="p-4 bg-slate-50 rounded-2xl border border-slate-100 hover:border-indigo-200 transition-colors text-center">
          <p class="text-sm font-bold text-slate-700">EduDigital</p>
          <p class="text-[10px] text-slate-400">Recursos</p>
        </a>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { API_BASE_URL } from '@/config/api';

const props = defineProps({ user: Object });

const loading = ref(true);
const recursos = ref([
  { id: 1, titol: 'Apunts M04', descripció: 'Apunts del mòdul de programació', tipus: 'PDF', url: '#' },
  { id: 2, titol: 'Exercicis PR1', descripció: 'Exercicis de pràctica Tema 1', tipus: 'Exercicis', url: '#' },
  { id: 3, titol: 'Calendari Exàmens', descripció: 'Calendari d\'exàmens del curs', tipus: 'Calendari', url: '#' }
]);

onMounted(() => {
  setTimeout(() => loading.value = false, 500);
});
</script>