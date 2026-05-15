<template>
  <div class="space-y-6 animate-fade-in">
    <div v-if="!isOut" class="targeta-campus p-8 text-center border-blue-100 shadow-xl shadow-blue-50">
      <div class="w-20 h-20 bg-blue-50 rounded-[2.5rem] flex items-center justify-center mx-auto mb-6 text-blue-600 shadow-inner">
        <AppIcon name="home" class="w-10 h-10" />
      </div>
      <h3 class="text-xl font-black text-slate-900 uppercase italic leading-none">Sol·licitud de Sortida</h3>
      <p class="text-[10px] text-slate-400 font-bold mt-4 uppercase tracking-[0.2em] leading-relaxed">
        Selecciona el motiu i notifica al professor <br/> que necessites sortir de l'aula un moment.
      </p>

      <div class="grid grid-cols-2 gap-3 mt-8">
        <button v-for="motiu in motius" :key="motiu.id" 
          @click="requestExit(motiu.id)"
          class="p-4 rounded-2xl border border-slate-100 bg-slate-50/50 hover:bg-white hover:border-blue-200 hover:scale-[1.02] transition-all group text-left"
        >
          <div class="flex items-center gap-3">
             <span class="text-lg">{{ motiu.icon }}</span>
             <span class="text-[10px] font-black uppercase tracking-widest text-slate-500 group-hover:text-blue-700">{{ motiu.label }}</span>
          </div>
        </button>
      </div>
    </div>

    <div v-else class="targeta-campus p-8 text-center border-rose-100 bg-rose-50/30 animate-pulse-slow">
       <div class="w-20 h-20 bg-rose-500 rounded-[2.5rem] flex items-center justify-center mx-auto mb-6 text-white shadow-xl shadow-rose-200">
        <AppIcon name="clock" class="w-10 h-10" />
      </div>
      <h3 class="text-xl font-black text-slate-900 uppercase italic leading-none">Ets fora de l'aula</h3>
      <p class="text-[10px] text-rose-600 font-black mt-4 uppercase tracking-[0.2em]">El professor ha estat notificat</p>
      
      <div class="mt-8 py-4 px-6 bg-white rounded-2xl border border-rose-100 shadow-sm inline-block">
         <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Temps transcorregut</p>
         <p class="text-2xl font-black text-slate-800 tabular-nums">{{ timerDisplay }}</p>
      </div>

      <button @click="registerReturn" class="w-full mt-10 py-5 bg-rose-600 text-white rounded-3xl text-[11px] font-black uppercase tracking-[0.2em] shadow-xl shadow-rose-200 hover:bg-rose-700 transition-all">
        He tornat a classe
      </button>
    </div>

    <div class="targeta-campus">
       <h4 class="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-2">
         <div class="w-1 h-3 bg-slate-300 rounded-full"></div>
         Normativa del Passadís Digital
       </h4>
       <ul class="space-y-3 text-[10px] font-bold text-slate-500 uppercase leading-tight">
          <li class="flex gap-2">
             <span class="text-blue-500">•</span> S'ha de registrar tant la sortida com la tornada.
          </li>
          <li class="flex gap-2">
             <span class="text-blue-500">•</span> Només pot haver-hi un alumne fora alhora (recomanat).
          </li>
          <li class="flex gap-2">
             <span class="text-blue-500">•</span> El temps d'absència queda registrat a l'expedient.
          </li>
       </ul>
    </div>
  </div>
</template>

<script setup>
import { ref, onUnmounted, computed } from 'vue';
import AppIcon from '../shared/AppIcon.vue';

const props = defineProps({
  user: { type: Object, required: true }
});

const isOut = ref(false);
const startTime = ref(null);
const now = ref(Date.now());
let interval = null;

const motius = [
  { id: 'bany', label: 'Bany', icon: '🚻' },
  { id: 'secretaria', label: 'Secretaria', icon: '📂' },
  { id: 'infermeria', label: 'Infermeria', icon: '🏥' },
  { id: 'altres', label: 'Altres', icon: '❓' }
];

const timerDisplay = computed(() => {
  if (!startTime.value) return '00:00';
  const diff = Math.floor((now.value - startTime.value) / 1000);
  const m = Math.floor(diff / 60).toString().padStart(2, '0');
  const s = (diff % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
});

const requestExit = async (motiu) => {
  try {
    const token = localStorage.getItem('access_token');
    const res = await fetch('/api/assistencia/sortida', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ alumneId: props.user.id, motiu })
    });
    
    if (res.ok) {
      isOut.value = true;
      startTime.value = Date.now();
      interval = setInterval(() => { now.value = Date.now(); }, 1000);
    }
  } catch (err) {
    console.error('Error sol·licitant sortida:', err);
  }
};

const registerReturn = async () => {
  try {
    const token = localStorage.getItem('access_token');
    const res = await fetch('/api/assistencia/tornada', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ alumneId: props.user.id })
    });
    
    if (res.ok) {
      isOut.value = false;
      clearInterval(interval);
    }
  } catch (err) {
    console.error('Error registrant tornada:', err);
  }
};

onUnmounted(() => {
  if (interval) clearInterval(interval);
});
</script>

<style scoped>
.animate-pulse-slow {
  animation: pulse-slow 3s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}
@keyframes pulse-slow {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.8; }
}
</style>
