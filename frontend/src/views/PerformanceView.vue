<template>
  <div class="space-y-8 animate-fade-in">
    <!-- CAPÇALERA DE RENDIMENT ACADÈMIC -->
    <div class="hero-academic shadow-xl shadow-blue-100 flex flex-col md:flex-row justify-between items-center gap-6">
      <div>
        <div class="flex items-center gap-3 mb-4">
          <span class="badge-estat bg-white/20 text-white backdrop-blur-md">Expedient Oficial</span>
          <span class="badge-estat bg-blue-400/50 text-white">Curs 2024-25</span>
        </div>
        <h2 class="text-3xl md:text-4xl font-black tracking-tight uppercase italic leading-none">Qualificacions</h2>
        <p class="text-blue-100 font-medium mt-2 max-w-sm uppercase text-[10px] tracking-widest font-bold">Resum del rendiment acadèmic per mòduls</p>
      </div>
      
      <div class="bg-white p-6 rounded-2xl border border-blue-200 shadow-xl flex items-center gap-6 min-w-[200px]">
        <div>
          <p class="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-1">Mitjana Global</p>
          <div class="flex items-center gap-2">
             <div class="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
             <p class="text-[10px] font-bold text-slate-500 uppercase tracking-tighter">Bona Progrés</p>
          </div>
        </div>
        <p class="text-5xl font-black text-blue-700 tracking-tighter leading-none italic">{{ average }}</p>
      </div>
    </div>

    <!-- LLISTAT DE QUALIFICACIONS -->
    <div class="grid gap-4">
      <div v-if="loading" class="py-24 text-center">
        <div class="inline-block w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-6"></div>
        <p class="text-[9px] font-black uppercase tracking-widest text-slate-400">Sincronitzant dades de l'institut...</p>
      </div>

      <div v-else-if="notes.length === 0" class="targeta-campus !p-20 text-center">
        <div class="w-20 h-20 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-200 mx-auto mb-6 border border-slate-100">
           <AppIcon name="academic" class="w-10 h-10" />
        </div>
        <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-loose">Encara no s'ha publicat cap nota oficial<br>per a aquest alumne.</p>
      </div>

      <div v-for="nota in notes" :key="nota.id" 
        class="targeta-campus flex flex-col sm:flex-row items-center justify-between gap-6 group"
      >
        <div class="flex items-center gap-6 w-full sm:w-auto">
          <div class="w-14 h-14 bg-slate-50 rounded-xl flex flex-col items-center justify-center border border-slate-100 group-hover:bg-blue-50 group-hover:border-blue-200 transition-all">
             <span class="text-[8px] font-black text-blue-700 leading-none mb-1">{{ nota.codi }}</span>
             <AppIcon name="book" class="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h4 class="font-black text-slate-800 text-lg tracking-tight group-hover:text-blue-700 transition-colors uppercase">{{ nota.modul }}</h4>
            <div class="flex items-center gap-3 mt-1">
              <span class="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{{ formatDate(nota.data) }}</span>
              <span class="w-1 h-1 bg-slate-200 rounded-full"></span>
              <span class="text-[9px] font-black text-blue-600 uppercase tracking-widest">Avaluació Final</span>
            </div>
          </div>
        </div>

        <div class="flex items-center gap-8 w-full sm:w-auto justify-between sm:justify-end">
          <div class="text-right hidden xl:block">
            <p v-if="nota.comentari" class="text-[10px] italic text-slate-400 max-w-[250px] leading-relaxed border-l-2 border-slate-100 pl-4 py-1">"{{ nota.comentari }}"</p>
          </div>
          <div class="flex items-center gap-6">
             <div class="text-right hidden sm:block">
                <p class="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Nota Mòdul</p>
                <div class="w-24 h-1.5 bg-slate-100 rounded-full overflow-hidden border border-slate-50">
                   <div class="h-full rounded-full transition-all duration-1000" 
                        :class="getGradeBarColor(nota.nota)" 
                        :style="{ width: (nota.nota * 10) + '%' }"></div>
                </div>
             </div>
             <div class="w-16 h-16 rounded-xl flex flex-col items-center justify-center shadow-lg transition-all duration-300 group-hover:translate-y-[-2px]"
               :class="getGradeClass(nota.nota)"
             >
               <span class="text-2xl font-black italic leading-none">{{ nota.nota.toFixed(1) }}</span>
             </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { API_BASE_URL } from '@/config/api';
import AppIcon from '../components/shared/AppIcon.vue';

const props = defineProps({
  user: {
    type: Object,
    required: true
  }
});

const notes = ref([]);
const average = ref('0.0');
const loading = ref(true);

const fetchNotes = async () => {
  try {
    const [notesRes, statsRes] = await Promise.all([
      fetch(`${API_BASE_URL}/usuaris/${props.user.id}/notes`),
      fetch(`${API_BASE_URL}/usuaris/${props.user.id}/stats`)
    ]);
    notes.value = await notesRes.json();
    const statsData = await statsRes.json();
    average.value = statsData.stats?.mitjana?.toFixed(1) || '0.0';
  } catch (e) {
    console.error('Error fetching notes:', e);
  } finally {
    loading.value = false;
  }
};

const getGradeClass = (val) => {
  if (val >= 9) return 'text-indigo-600 bg-indigo-50 border-indigo-100';
  if (val >= 7) return 'text-emerald-600 bg-emerald-50 border-emerald-100';
  if (val >= 5) return 'text-amber-600 bg-amber-50 border-amber-100';
  return 'text-red-600 bg-red-50 border-red-100';
};

const getGradeBarColor = (val) => {
  if (val >= 9) return 'bg-indigo-500';
  if (val >= 7) return 'bg-emerald-500';
  if (val >= 5) return 'bg-amber-500';
  return 'bg-rose-500';
};

const formatDate = (dateStr) => {
  const date = new Date(dateStr);
  return date.toLocaleDateString('ca-ES', { day: '2-digit', month: 'short', year: 'numeric' });
};

onMounted(fetchNotes);
</script>

<style>
@keyframes fade-in { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
.animate-fade-in { animation: fade-in 0.5s ease-out forwards; }
</style>
