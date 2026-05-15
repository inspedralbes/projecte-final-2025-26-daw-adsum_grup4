<template>
  <div class="space-y-8 animate-fade-in pb-20">
    <!-- HEADER REPOSITORI -->
    <div class="p-10 bg-gradient-to-br from-amber-500 to-orange-600 rounded-[3rem] text-white shadow-2xl shadow-amber-200 relative overflow-hidden group">
      <div class="relative z-10 flex flex-col md:flex-row justify-between items-end gap-6">
        <div>
          <span class="px-3 py-1 bg-white/20 rounded-full text-[9px] font-black uppercase tracking-[0.3em] backdrop-blur-md mb-6 inline-block">Ecosistema ADSUM</span>
          <h2 class="text-4xl font-black italic uppercase tracking-tighter mb-2 leading-none">Repositori d'Apunts</h2>
          <p class="text-amber-100 text-sm font-medium italic opacity-90 max-w-md">Accedeix i comparteix materials pedagògics organitzats per mòduls.</p>
        </div>
        <button class="px-8 py-4 bg-white text-orange-600 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-orange-900/10 hover:scale-105 transition-all flex items-center gap-2 active:scale-95">
           <AppIcon name="upload" class="w-5 h-5" />
           Pujar Material
        </button>
      </div>
      <div class="absolute -top-10 -right-10 w-80 h-80 bg-white/10 rounded-full blur-3xl transition-transform duration-1000 group-hover:scale-110"></div>
    </div>

    <!-- FILTRES I CERCA -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
       <div class="md:col-span-3 relative">
          <AppIcon name="search" class="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300" />
          <input type="text" placeholder="Cerca apunts, exàmens, exercicis..." class="w-full pl-14 pr-8 py-5 bg-white border border-slate-100 rounded-[2rem] text-sm font-bold focus:outline-none focus:ring-8 focus:ring-amber-500/5 focus:border-amber-500 transition-all shadow-xl shadow-slate-200/40">
       </div>
       <select class="px-8 py-5 bg-white border border-slate-100 rounded-[2rem] text-[10px] font-black uppercase tracking-widest focus:outline-none shadow-xl shadow-slate-200/40 cursor-pointer">
          <option>Tots els Mòduls</option>
          <option>M03 - Programació</option>
          <option>M07 - Interfícies</option>
          <option>M06 - Accessibilitat</option>
       </select>
    </div>

    <!-- GRID DE MATERIALS -->
    <div v-if="loading" class="text-center py-20 text-slate-400 font-bold uppercase tracking-widest animate-pulse">
       Carregant recursos...
    </div>
    <div v-else-if="error" class="text-center py-20 text-red-400 font-bold uppercase tracking-widest">
       {{ error }}
    </div>
    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
       <div v-for="fitxer in fitxers" :key="fitxer.id" class="targeta-campus group hover:border-amber-200 transition-all cursor-pointer">
          <div class="flex justify-between items-start mb-6">
             <div :class="fitxer.color" class="w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform">
                <AppIcon :name="fitxer.icona || 'file'" class="w-7 h-7" />
             </div>
             <div class="flex gap-1">
                <button @click.stop="descarregarFitxer(fitxer.id)" class="p-2 bg-slate-50 rounded-lg text-slate-400 hover:text-amber-600 transition-colors">
                   <AppIcon name="download" class="w-4 h-4" />
                </button>
             </div>
          </div>
          <h4 class="text-sm font-black text-slate-900 uppercase italic mb-1 group-hover:text-amber-700 transition-colors">{{ fitxer.titol }}</h4>
          <p class="text-[9px] text-slate-400 font-bold uppercase tracking-widest">{{ fitxer.modul?.codi }} · {{ fitxer.autor?.nom }} {{ fitxer.autor?.cognoms }}</p>
          
          <div class="mt-6 pt-6 border-t border-slate-50 flex justify-between items-center">
             <span class="text-[9px] font-black text-slate-400 uppercase">{{ new Date(fitxer.dataPujada).toLocaleDateString() }}</span>
             <span class="px-3 py-1 bg-slate-100 text-slate-500 rounded-lg text-[8px] font-black uppercase tracking-widest">{{ fitxer.mida }}</span>
          </div>
       </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import AppIcon from '../components/shared/AppIcon.vue';
import { API_BASE_URL } from '@/config/api';

const fitxers = ref([]);
const loading = ref(true);
const error = ref(null);

onMounted(async () => {
  try {
    const token = localStorage.getItem('access_token');
    const res = await fetch(`${API_BASE_URL}/recursos`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!res.ok) throw new Error('Error al carregar els recursos');
    fitxers.value = await res.json();
  } catch (err) {
    console.error('Error carregant repositori:', err);
    error.value = 'No s\'ha pogut carregar el repositori.';
  } finally {
    loading.value = false;
  }
});

const descarregarFitxer = (id) => {
  const token = localStorage.getItem('access_token');
  window.location.href = `${API_BASE_URL}/recursos/descarregar/${id}?token=${token}`;
};
</script>
