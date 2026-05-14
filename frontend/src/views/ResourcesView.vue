<template>
  <div class="space-y-8 animate-fade-in">
    <!-- CAPÇALERA -->
    <div class="hero-academic shadow-xl shadow-blue-100 flex flex-col md:flex-row justify-between items-center gap-6">
      <div>
        <div class="flex items-center gap-3 mb-4">
          <span class="badge-estat bg-white/20 text-white backdrop-blur-md">Repositori Digital</span>
          <span class="badge-estat bg-blue-400/50 text-white">Recursos Compartits</span>
        </div>
        <h2 class="text-3xl md:text-4xl font-black tracking-tight uppercase italic leading-none">Biblioteca de Recursos</h2>
        <p class="text-blue-100 font-medium mt-2 max-w-sm uppercase text-[10px] tracking-widest font-bold">Apunts, exercicis i materials oficials de cada mòdul.</p>
      </div>
      
      <div v-if="user.rol === 'professor'" class="bg-white p-4 rounded-2xl border border-blue-200 shadow-xl">
        <button class="boto-academic px-6 h-12 flex items-center gap-2">
          <AppIcon name="plus" class="w-4 h-4" />
          Pujar Material
        </button>
      </div>
    </div>

    <!-- FILTRES I CERCA -->
    <div class="flex flex-col md:flex-row gap-4 items-center justify-between">
      <div class="flex gap-2 overflow-x-auto pb-2 w-full md:w-auto custom-scrollbar">
        <button 
          v-for="cat in categories" :key="cat"
          @click="selectedCategory = cat"
          class="px-5 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all shrink-0"
          :class="selectedCategory === cat ? 'bg-blue-600 text-white shadow-md' : 'bg-white text-slate-500 border border-slate-200 hover:bg-slate-50'"
        >
          {{ cat }}
        </button>
      </div>
      <div class="relative w-full md:w-80">
        <input type="text" v-model="searchQuery" placeholder="CERCAR RECURS..." class="w-full bg-white border border-slate-200 rounded-xl px-5 py-2.5 text-[9px] font-black uppercase tracking-widest focus:outline-none focus:border-blue-400" />
        <AppIcon name="search" class="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
      </div>
    </div>

    <!-- LLISTAT DE FITXERS -->
    <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      <div v-for="res in filteredResources" :key="res.id" 
        class="targeta-campus group hover:border-blue-300 transition-all"
      >
        <div class="flex items-start justify-between mb-6">
          <div class="w-12 h-12 rounded-xl flex items-center justify-center text-blue-600 border border-blue-50 bg-blue-50/30 group-hover:bg-blue-600 group-hover:text-white transition-all">
            <AppIcon :name="res.type === 'pdf' ? 'file-pdf' : 'file-code'" class="w-6 h-6" />
          </div>
          <span class="text-[8px] font-black uppercase tracking-widest text-slate-400 bg-slate-50 px-2 py-1 rounded-md border border-slate-100">{{ res.size }}</span>
        </div>
        
        <h4 class="font-black text-slate-800 text-sm tracking-tight mb-2 group-hover:text-blue-700 transition-colors uppercase">{{ res.title }}</h4>
        <p class="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-6">{{ res.modul }} · {{ res.author }}</p>
        
        <div class="flex items-center justify-between pt-4 border-t border-slate-100">
           <span class="text-[8px] font-black text-slate-300 uppercase tracking-widest">{{ res.date }}</span>
           <div class="flex gap-2">
             <button class="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-all">
               <AppIcon name="download" class="w-4 h-4" />
             </button>
             <button v-if="user.rol === 'professor' || res.isOwner" class="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all">
               <AppIcon name="trash" class="w-4 h-4" />
             </button>
           </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import AppIcon from '../components/shared/AppIcon.vue';

const props = defineProps({
  user: { type: Object, required: true }
});

const selectedCategory = ref('Tots');
const searchQuery = ref('');

const categories = ['Tots', 'Apunts', 'Exercicis', 'Exàmens', 'Oficial'];

const resources = ref([
  { id: 1, title: 'Introducció a Vue 3 i Composition API', modul: 'Interfícies', author: 'M. Font', type: 'pdf', size: '2.4 MB', category: 'Apunts', date: '20 Abr 2024' },
  { id: 2, title: 'Pràctica 2: Gestió d\'esdeveniments', modul: 'Programació', author: 'P. Gomez', type: 'pdf', size: '1.1 MB', category: 'Exercicis', date: '18 Abr 2024' },
  { id: 3, title: 'Model E-R: Exercicis resolts', modul: 'Bases de Dades', author: 'L. Serra', type: 'pdf', size: '4.8 MB', category: 'Apunts', date: '15 Abr 2024' },
  { id: 4, title: 'Examen de recuperació 1a Aval', modul: 'Sistemes', author: 'J. Roca', type: 'pdf', size: '0.8 MB', category: 'Exàmens', date: '10 Abr 2024' }
]);

const filteredResources = computed(() => {
  return resources.value.filter(r => {
    const matchesCat = selectedCategory.value === 'Tots' || r.category === selectedCategory.value;
    const matchesSearch = r.title.toLowerCase().includes(searchQuery.value.toLowerCase()) || 
                         r.modul.toLowerCase().includes(searchQuery.value.toLowerCase());
    return matchesCat && matchesSearch;
  });
});
</script>
