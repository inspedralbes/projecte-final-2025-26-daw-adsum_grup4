<template>
  <div class="space-y-8 animate-fade-in">
    <!-- HERO RESUM -->
    <div class="hero-academic shadow-xl shadow-blue-100 border-none bg-slate-900">
      <div class="relative z-10">
        <div class="flex items-center gap-3 mb-4">
          <span class="badge-estat bg-blue-500/30 text-blue-200 backdrop-blur-md">Panell de Control</span>
          <span class="badge-estat bg-emerald-500/80 text-white">Sessió Activa</span>
        </div>
        <h2 class="text-3xl md:text-4xl font-black tracking-tight mb-2 uppercase italic text-white">Hola, {{ user?.nom }}</h2>
        <p class="text-blue-200 font-medium max-w-md text-sm">Tens una classe de **Desenvolupament Web** programada per a les 15:00h a l'Aula 204.</p>
      </div>
    </div>

    <!-- MÈTRIQUES RÀPIDES -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
       <div class="targeta-campus flex flex-col justify-between">
          <div>
            <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Assistència Mitjana</p>
            <h3 class="text-3xl font-black text-slate-800 italic">92%</h3>
          </div>
          <div class="mt-4 flex items-center gap-2 text-emerald-600 font-black text-[10px] uppercase">
             <AppIcon name="arrow-up" class="w-3 h-3" /> +4% respecte setmana anterior
          </div>
       </div>
       
       <div class="targeta-campus flex flex-col justify-between">
          <div>
            <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Tràmits Pendents</p>
            <h3 class="text-3xl font-black text-blue-700 italic">3</h3>
          </div>
          <div class="mt-4 text-slate-400 font-black text-[10px] uppercase tracking-widest">
             Justificacions per revisar
          </div>
       </div>

       <div class="targeta-campus flex flex-col justify-between bg-blue-600 text-white border-none">
          <div>
            <p class="text-[10px] font-black text-blue-100 uppercase tracking-widest mb-1">Pròxima Classe</p>
            <h3 class="text-lg font-black uppercase leading-tight">Desenvolupament Web</h3>
          </div>
          <div class="mt-4 flex justify-between items-center">
             <span class="text-xl font-black italic">15:00h</span>
             <span class="text-[9px] font-black uppercase tracking-widest bg-white/20 px-2 py-1 rounded-md">Aula 204</span>
          </div>
       </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
       <!-- BITÀCOLA DOCENT / NOTES DE SEGUIMENT -->
       <div class="targeta-campus">
          <h3 class="font-black text-slate-900 uppercase tracking-widest text-[10px] mb-8 flex items-center gap-2">
            <div class="w-1 h-4 bg-blue-600 rounded-full"></div>
            Bitàcola de Seguiment
          </h3>
          <div class="space-y-4">
             <div class="p-4 bg-slate-50 rounded-2xl border border-slate-100 group hover:border-blue-200 transition-all cursor-pointer">
                <p class="text-[9px] font-black text-blue-600 uppercase tracking-widest mb-2">Ahir · DAW2</p>
                <p class="text-xs text-slate-700 font-medium">Finalitzada la introducció a Vue Router. La setmana vinent comencem Pinia.</p>
             </div>
             <div class="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <p class="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2">12 Abr · DAW1</p>
                <p class="text-xs text-slate-700 font-medium">Revisió de l'examen de Bases de Dades. Molt bons resultats en general.</p>
             </div>
          </div>
       </div>

       <!-- ACCIONS RÀPIDES -->
       <div class="grid grid-cols-2 gap-4">
          <div @click="$emit('change-view', 'toolkit')" class="targeta-campus flex flex-col items-center justify-center text-center p-8 hover:bg-blue-50 cursor-pointer transition-all border-dashed">
             <AppIcon name="users" class="w-8 h-8 text-blue-600 mb-4" />
             <p class="text-[9px] font-black text-slate-900 uppercase tracking-widest">Generador de Grups</p>
          </div>
          <div @click="$emit('change-view', 'booking')" class="targeta-campus flex flex-col items-center justify-center text-center p-8 hover:bg-blue-50 cursor-pointer transition-all border-dashed">
             <AppIcon name="calendar" class="w-8 h-8 text-blue-600 mb-4" />
             <p class="text-[9px] font-black text-slate-900 uppercase tracking-widest">Reserva d'Espais</p>
          </div>
          <div @click="$emit('change-view', 'resources')" class="targeta-campus flex flex-col items-center justify-center text-center p-8 hover:bg-blue-50 cursor-pointer transition-all border-dashed">
             <AppIcon name="book" class="w-8 h-8 text-blue-600 mb-4" />
             <p class="text-[9px] font-black text-slate-900 uppercase tracking-widest">Pujar Recursos</p>
          </div>
          <div @click="$emit('change-view', 'toolkit')" class="targeta-campus flex flex-col items-center justify-center text-center p-8 hover:bg-blue-50 cursor-pointer transition-all border-dashed">
             <AppIcon name="lightning" class="w-8 h-8 text-blue-600 mb-4" />
             <p class="text-[9px] font-black text-slate-900 uppercase tracking-widest">Random Picker</p>
          </div>
       </div>
    </div>
  </div>
</template>

<script setup>
import AppIcon from '../components/shared/AppIcon.vue';
const props = defineProps({
  user: { type: Object, required: true }
});

defineEmits(['change-view']);
</script>
