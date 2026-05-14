<template>
  <div class="space-y-8 animate-fade-in">
    <!-- HERO SECCIÓ: BENVINGUDA ACADÈMICA -->
    <div class="relative p-10 md:p-14 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-[3.5rem] text-white overflow-hidden shadow-xl shadow-blue-100">
      <div class="relative z-10">
        <div class="flex items-center gap-3 mb-4">
          <span class="px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-[0.2em] bg-white/20 text-white backdrop-blur-md">Curs {{ user?.curs || '2025-2026' }}</span>
          <span class="px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-[0.2em] bg-emerald-500/80 text-white">En Línia</span>
        </div>
        <h2 class="text-3xl md:text-4xl font-black tracking-tight mb-2 uppercase italic">Bon dia, {{ user?.nom?.split(' ')[0] }}!</h2>
        <p class="text-blue-100 font-medium max-w-md">Benvingut al teu portal acadèmic. Tens {{ recentSessions.length }} sessions programades a la teva {{ aulaBase }}.</p>
      </div>
      <!-- Orbe decoratiu -->
      <div class="absolute -top-24 -right-24 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
      <div class="absolute -bottom-12 -right-12 w-48 h-48 bg-blue-400/20 rounded-full blur-2xl"></div>
    </div>

    <!-- GRID DE RENDIMENT I ESTATS -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <!-- TARGETA ASSISTÈNCIA GLOBAL -->
      <div class="p-8 bg-white rounded-[2.5rem] border border-slate-100 transition-all duration-500 flex flex-col justify-between overflow-hidden group">
         <div>
            <div class="flex justify-between items-start mb-6">
               <div class="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600">
                  <AppIcon name="stats" class="w-6 h-6" />
               </div>
               <span class="text-[10px] font-black text-emerald-500 bg-emerald-50 px-3 py-1 rounded-full uppercase tracking-widest">+{{ (attendancePct/10).toFixed(1) }}% vs mes ant.</span>
            </div>
            <h3 class="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Assistència Global</h3>
            <p class="text-4xl font-black text-slate-900 italic tracking-tighter">{{ attendancePct }}%</p>
         </div>
         <div class="mt-8">
            <div class="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
               <div class="h-full bg-blue-600 rounded-full transition-all duration-1000" :style="{ width: attendancePct + '%' }"></div>
            </div>
         </div>
      </div>

      <!-- TARGETA MITJANA ACADÈMICA -->
      <div class="p-8 bg-white rounded-[2.5rem] border border-slate-100 transition-all duration-500 flex flex-col justify-between group">
         <div>
            <div class="flex justify-between items-start mb-6">
               <div class="w-12 h-12 bg-amber-50 rounded-2xl flex items-center justify-center text-amber-600">
                  <AppIcon name="academic" class="w-6 h-6" />
               </div>
               <div class="flex -space-x-2">
                  <div v-for="i in 3" :key="i" class="w-6 h-6 rounded-full border-2 border-white bg-slate-200"></div>
               </div>
            </div>
            <h3 class="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Mitjana d'Expedient</h3>
            <p class="text-4xl font-black text-slate-900 italic tracking-tighter">{{ averageGrade }}</p>
         </div>
         <p class="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-4">Top 5% de la promoció {{ userGroup }}</p>
      </div>

      <!-- TARGETA RATXA (GAMIFICACIÓ) -->
      <div class="p-8 bg-slate-900 rounded-[2.5rem] text-white border-none relative overflow-hidden transition-all duration-500">
         <div class="relative z-10">
            <div class="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center text-amber-400 mb-6 backdrop-blur-md">
               <AppIcon name="fire" class="w-6 h-6" />
            </div>
            <h3 class="text-xs font-black text-slate-500 uppercase tracking-[0.2em] mb-1">Ratxa de Presència</h3>
            <p class="text-4xl font-black italic tracking-tighter">{{ streak }} DIES</p>
            <p class="text-[9px] font-bold text-amber-400/80 uppercase tracking-[0.2em] mt-2">Estàs on fire! No t'aturis.</p>
         </div>
         <div class="absolute -bottom-10 -right-10 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl"></div>
      </div>

      <!-- TARGETA ID DIGITAL (NOVA) -->
      <div class="p-8 bg-white rounded-[2.5rem] border border-slate-100 flex flex-col items-center justify-center group relative overflow-hidden">
         <div class="absolute top-0 left-0 w-full h-1 bg-blue-600"></div>
         <h3 class="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Identitat Digital ADSUM</h3>
         <div class="p-4 bg-slate-50 rounded-3xl border border-slate-100 shadow-inner group-hover:scale-105 transition-transform">
            <qrcode-vue :value="'ALUMNE_ID:' + user?.id" :size="100" level="H" foreground="#1e293b" />
         </div>
         <p class="text-[10px] font-black text-slate-900 uppercase tracking-tighter mt-4">{{ user?.nom }}</p>
         <p class="text-[8px] text-slate-400 font-bold uppercase tracking-widest">{{ user?.email }}</p>
      </div>
    </div>

    <!-- SECCIÓ CENTRAL: SESSIONS I CALCULADORA -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <!-- LLISTA DE SESSIONS AVUI -->
      <div class="lg:col-span-2 space-y-6">
         <div class="flex items-center justify-between">
            <h3 class="font-black text-slate-900 uppercase tracking-widest text-[11px] flex items-center gap-2">
               <div class="w-1.5 h-4 bg-blue-600 rounded-full"></div>
               Horari de Sessions ({{ userGroup }})
            </h3>
            <button class="text-[10px] font-black text-blue-600 uppercase tracking-widest hover:underline italic">Veure horari complet</button>
         </div>
         
         <div class="space-y-4">
            <div v-if="recentSessions.length === 0" class="p-12 text-center bg-white rounded-[2rem] border border-dashed border-slate-200">
               <p class="text-slate-400 text-xs font-bold uppercase tracking-widest">No hi ha sessions programades per avui</p>
            </div>
            <div v-for="session in recentSessions" :key="session.id" 
              class="flex items-center justify-between p-6 bg-white rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-md transition-all group">
               <div class="flex items-center gap-6">
                  <div :class="session.estat === 'realitzat' ? 'bg-emerald-50 text-emerald-500' : 'bg-blue-50 text-blue-500'" 
                    class="w-14 h-14 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110">
                     <AppIcon :name="session.estat === 'realitzat' ? 'check' : 'clock'" class="w-6 h-6" />
                  </div>
                  <div>
                     <p class="text-[15px] font-black text-slate-800 uppercase italic">{{ session.modul }}</p>
                     <p class="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">{{ session.professor }} · {{ session.aula }}</p>
                  </div>
               </div>
               <div class="text-right">
                  <p class="text-[13px] font-black text-slate-900 tracking-tighter">{{ session.hora }}</p>
                  <span :class="session.estat === 'realitzat' ? 'text-emerald-500' : 'text-blue-500'" 
                    class="text-[8px] font-black uppercase tracking-[0.2em]">{{ session.estat }}</span>
               </div>
            </div>
         </div>

         <!-- HALL PASS (PASSADÍS DIGITAL) -->
         <div class="p-8 bg-gradient-to-r from-slate-50 to-white rounded-[2.5rem] border border-slate-100 flex flex-col md:flex-row items-center justify-between gap-6">
            <div class="flex items-center gap-5">
               <div class="w-16 h-16 bg-white shadow-lg rounded-3xl flex items-center justify-center text-slate-800 border border-slate-50">
                  <AppIcon :name="isOutside ? 'door' : 'home'" class="w-8 h-8" />
               </div>
               <div>
                  <h4 class="text-lg font-black text-slate-900 uppercase italic">Hall Pass Digital</h4>
                  <p class="text-xs text-slate-400 font-medium">Sol·licita permís per sortir de l'aula temporalment.</p>
               </div>
            </div>
            <button @click="toggleHallPass" 
              :class="isOutside ? 'bg-rose-600 shadow-rose-100' : 'bg-slate-900 shadow-slate-200'"
              class="px-10 py-4 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl transition-all active:scale-95">
               {{ isOutside ? 'Tornar a l\'Aula' : 'Sol·licitar Sortida' }}
            </button>
         </div>
      </div>

      <!-- CALCULADORA DE NOTES (SIMULADOR) -->
      <div class="space-y-6">
         <h3 class="font-black text-slate-900 uppercase tracking-widest text-[11px] flex items-center gap-2">
            <div class="w-1.5 h-4 bg-amber-500 rounded-full"></div>
            Simulador de Notes
         </h3>
         <div class="p-8 bg-white rounded-[2.5rem] border border-slate-100 transition-all duration-500 space-y-8">
            <div class="text-center pb-6 border-b border-slate-50">
               <p class="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">Nota Final Estimada</p>
               <div class="text-6xl font-black text-slate-900 italic tracking-tighter">{{ notaFinal }}</div>
               <span :class="notaFinal >= 5 ? 'text-emerald-500' : 'text-rose-500'" class="text-[10px] font-black uppercase tracking-widest">
                  {{ notaFinal >= 5 ? 'Apte / Progressant' : 'Cal Reforç' }}
               </span>
            </div>

            <div class="space-y-6">
               <div class="space-y-3">
                  <div class="flex justify-between text-[10px] font-black uppercase text-slate-500 tracking-widest">
                     <span>Mitjana Exàmens</span>
                     <span class="text-blue-600">{{ notaExamen }}</span>
                  </div>
                  <input type="range" v-model="notaExamen" min="0" max="10" step="0.1" class="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-blue-600">
               </div>
               <div class="space-y-3">
                  <div class="flex justify-between text-[10px] font-black uppercase text-slate-500 tracking-widest">
                     <span>Mitjana Projectes</span>
                     <span class="text-blue-600">{{ notaProjecte }}</span>
                  </div>
                  <input type="range" v-model="notaProjecte" min="0" max="10" step="0.1" class="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-blue-600">
               </div>
            </div>

            <div class="p-4 bg-amber-50 rounded-2xl border border-amber-100">
               <p class="text-[9px] text-amber-700 font-bold leading-relaxed italic text-center uppercase">Aquesta nota és una simulació basada en les dades reals del teu expedient.</p>
            </div>
         </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import AppIcon from '../components/shared/AppIcon.vue';
import QrcodeVue from 'qrcode.vue';
import { API_BASE_URL } from '@/config/api';

const props = defineProps({
  user: Object
});

const averageGrade = ref('0.0');
const attendancePct = ref(0);
const streak = ref(0);
const recentSessions = ref([]);

const userGroup = computed(() => props.user?.grup?.nom || 'Sense Grup');
const aulaBase = computed(() => props.user?.grup?.aulaBase || 'Aula 101');

// FETCH REAL DATA FROM BACKEND
onMounted(async () => {
  if (!props.user?.id) return;
  
  try {
    const token = localStorage.getItem('access_token');
    
    // 1. Fetch Stats (Attendance, Streak)
    const statsRes = await fetch(`${API_BASE_URL}/usuaris/${props.user.id}/stats`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (statsRes.ok) {
      const stats = await statsRes.json();
      attendancePct.value = stats.stats.percentatge;
      streak.value = stats.stats.ratxa;
    }

    // 2. Fetch Grades (Academic Average)
    const notesRes = await fetch(`${API_BASE_URL}/usuaris/${props.user.id}/notes`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (notesRes.ok) {
      const notes = await notesRes.json();
      if (notes.length > 0) {
        const sum = notes.reduce((acc, n) => acc + n.valor, 0);
        averageGrade.value = (sum / notes.length).toFixed(1);
        // També ajustem els sliders per defecte
        notaExamen.value = Number(averageGrade.value);
        notaProjecte.value = Number(averageGrade.value);
      }
    }

    // 3. Fetch Schedule
    const scheduleRes = await fetch(`${API_BASE_URL}/usuaris/${props.user.id}/schedule`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (scheduleRes.ok) {
      recentSessions.value = await scheduleRes.json();
    }

  } catch (error) {
    console.error("Error carregant dades del Dashboard:", error);
  }
});

// CALCULADORA DE NOTES
const notaExamen = ref(5.0);
const notaProjecte = ref(5.0);
const notaFinal = computed(() => {
  return (parseFloat(notaExamen.value) * 0.4 + parseFloat(notaProjecte.value) * 0.6).toFixed(1);
});

// ESTAT DEL PASSADÍS DIGITAL (HALL PASS)
const isOutside = ref(false);
const toggleHallPass = () => {
  isOutside.value = !isOutside.value;
};
</script>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
