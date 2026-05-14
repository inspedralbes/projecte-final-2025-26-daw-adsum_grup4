<template>
  <div class="space-y-8 animate-fade-in">
    <!-- CAPÇALERA -->
    <div class="hero-academic shadow-xl shadow-blue-100 flex flex-col md:flex-row justify-between items-center gap-6">
      <div>
        <div class="flex items-center gap-3 mb-4">
          <span class="badge-estat bg-white/20 text-white backdrop-blur-md">Planificació Setmanal</span>
          <span class="badge-estat bg-emerald-500/50 text-white">Seguiment en Viu</span>
        </div>
        <h2 class="text-3xl md:text-4xl font-black tracking-tight uppercase italic leading-none">Horari Escolar</h2>
        <p class="text-blue-100 font-medium mt-2 max-w-sm uppercase text-[10px] tracking-widest font-bold">Consulta la teva distribució de classes i aules assignades.</p>
      </div>
      
      <div class="bg-white p-6 rounded-2xl border border-blue-200 shadow-xl flex items-center gap-4">
         <div class="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600">
            <AppIcon name="calendar" class="w-6 h-6" />
         </div>
         <div>
            <p class="text-[9px] font-black uppercase tracking-widest text-slate-400">Propera Classe</p>
            <p class="text-sm font-black text-slate-800 uppercase italic">Aula 204 · 15:00h</p>
         </div>
      </div>
    </div>

    <!-- GRAELLA D'HORARIS -->
    <div class="targeta-campus overflow-x-auto">
      <div class="min-w-[800px]">
        <div class="grid grid-cols-6 gap-4 mb-6">
           <div class="w-20"></div> <!-- Columna per les hores -->
           <div v-for="dia in dies" :key="dia" class="text-center">
              <span class="text-[10px] font-black text-slate-400 uppercase tracking-widest">{{ dia }}</span>
           </div>
        </div>

        <div class="space-y-3">
          <div v-for="hora in hores" :key="hora" class="grid grid-cols-6 gap-4 items-center min-h-[80px]">
             <!-- HORA -->
             <div class="w-20 pr-4 text-right">
                <span class="text-[10px] font-black text-slate-300 uppercase tracking-tighter">{{ hora }}</span>
             </div>
             
             <!-- DIES -->
             <div v-for="dia in dies" :key="dia" class="h-full">
                <div v-if="getClasse(dia, hora)" 
                  class="h-full p-3 rounded-2xl border border-blue-100 bg-blue-50/50 flex flex-col justify-center transition-all hover:scale-[1.02] hover:bg-white hover:shadow-lg hover:shadow-blue-100 group"
                >
                   <p class="text-[8px] font-black text-blue-400 uppercase tracking-widest mb-1">{{ getClasse(dia, hora).codi }}</p>
                   <h4 class="text-[10px] font-black text-blue-900 leading-tight uppercase group-hover:text-blue-600">{{ getClasse(dia, hora).nom }}</h4>
                   <div class="mt-2 flex items-center justify-between">
                      <span class="text-[9px] font-bold text-slate-500 uppercase">{{ getClasse(dia, hora).aula }}</span>
                      <span v-if="user.rol === 'professor'" class="text-[8px] font-black text-blue-500 bg-white px-1.5 py-0.5 rounded border border-blue-100">{{ getClasse(dia, hora).grup }}</span>
                   </div>
                </div>
                <div v-else class="h-full border border-dashed border-slate-100 rounded-2xl"></div>
             </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import AppIcon from '../components/shared/AppIcon.vue';

const props = defineProps({
  user: { type: Object, required: true }
});

const dies = ['Dilluns', 'Dimarts', 'Dimecres', 'Dijous', 'Divendres'];
const hores = ['08:00 - 09:00', '09:00 - 10:00', '10:00 - 11:00', '11:30 - 12:30', '12:30 - 13:30', '15:00 - 16:00', '16:00 - 17:00'];

const schedule = ref([
  { dia: 'Dilluns', hora: '08:00 - 09:00', nom: 'Desenvolupament Web', codi: 'M7', aula: 'Aula 204', grup: 'DAW2' },
  { dia: 'Dilluns', hora: '09:00 - 10:00', nom: 'Desenvolupament Web', codi: 'M7', aula: 'Aula 204', grup: 'DAW2' },
  { dia: 'Dimarts', hora: '10:00 - 11:00', nom: 'Bases de Dades', codi: 'M3', aula: 'Lab 1', grup: 'DAW1' },
  { dia: 'Dimecres', hora: '11:30 - 12:30', nom: 'Sistemes Informàtics', codi: 'M1', aula: 'Aula 102', grup: 'DAW1' },
  { dia: 'Dijous', hora: '15:00 - 16:00', nom: 'Projecte Final', codi: 'M12', aula: 'Seminari B', grup: 'DAW2' },
  { dia: 'Divendres', hora: '12:30 - 13:30', nom: 'Entorns de Des.', codi: 'M5', aula: 'Aula 204', grup: 'DAW1' }
]);

const getClasse = (dia, hora) => {
  return schedule.value.find(s => s.dia === dia && s.hora === hora);
};
</script>
