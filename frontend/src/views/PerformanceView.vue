<template>
  <div class="space-y-6 animate-fade-in">
    <!-- HEADER -->
    <div class="flex items-end justify-between px-2">
      <div>
        <h2 class="text-3xl font-black italic uppercase tracking-tighter text-slate-800">Qualificacions</h2>
        <p class="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mt-1">Curs Acadèmic 2024–25</p>
      </div>
      <div class="text-right">
        <p class="text-5xl font-black text-indigo-600 tracking-tighter leading-none">{{ average }}</p>
        <p class="text-[10px] font-black uppercase tracking-widest text-slate-400 mt-2">Mitjana Total</p>
      </div>
    </div>

    <!-- LISTA DE NOTAS -->
    <div class="grid gap-4">
      <div v-if="loading" class="py-20 text-center">
        <div class="inline-block w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p class="text-xs font-black uppercase tracking-widest text-slate-400">Carregant notes...</p>
      </div>

      <div v-else-if="notes.length === 0" class="bg-white rounded-[2rem] p-12 text-center border border-slate-100 shadow-sm">
        <p class="text-4xl mb-4">📭</p>
        <p class="text-sm font-bold text-slate-500">Encara no hi ha notes registrades</p>
      </div>

      <div v-for="nota in notes" :key="nota.id" 
        class="bg-white rounded-[2.5rem] p-6 border border-slate-100 shadow-sm hover:border-indigo-200 transition-all group flex items-center justify-between"
      >
        <div class="flex items-center gap-5">
          <div class="w-14 h-14 bg-slate-50 rounded-[1.2rem] flex flex-col items-center justify-center border border-slate-100 group-hover:bg-white transition-colors">
            <span class="text-[10px] font-black uppercase text-slate-400 leading-none mb-1">{{ nota.codi }}</span>
            <AppIcon name="book" class="w-5 h-5 text-indigo-500" />
          </div>
          <div>
            <h4 class="font-black text-slate-800 text-lg tracking-tight">{{ nota.modul }}</h4>
            <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{{ formatDate(nota.data) }}</p>
          </div>
        </div>

        <div class="flex items-center gap-6">
          <div class="text-right hidden sm:block">
            <p v-if="nota.comentari" class="text-[10px] italic text-slate-400 max-w-[150px] truncate leading-tight">"{{ nota.comentari }}"</p>
          </div>
          <div class="w-16 h-16 rounded-full border-4 border-slate-50 flex items-center justify-center font-black text-xl shadow-inner group-hover:scale-110 transition-transform"
            :class="getGradeClass(nota.nota)"
          >
            {{ nota.nota.toFixed(1) }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
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
    const [notesRes, avgRes] = await Promise.all([
      fetch(`http://localhost:3000/notes/alumne/${props.user.id}`),
      fetch(`http://localhost:3000/notes/alumne/${props.user.id}/mitjana`)
    ]);
    notes.value = await notesRes.json();
    const avgData = await avgRes.json();
    average.value = avgData.mitjana?.toFixed(1) || '0.0';
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
