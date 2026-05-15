<template>
  <div class="space-y-8 animate-fade-in">
    <!-- CAPÇALERA -->
    <div class="hero-academic shadow-xl shadow-blue-100 flex flex-col md:flex-row justify-between items-center gap-6">
      <div>
        <div class="flex items-center gap-3 mb-4">
          <span class="badge-estat bg-white/20 text-white backdrop-blur-md">Panell Docent</span>
          <span class="badge-estat bg-emerald-500/80 text-white">Gestió de Faltes</span>
        </div>
        <h2 class="text-3xl md:text-4xl font-black tracking-tight uppercase italic leading-none">Validador de Justificacions</h2>
        <p class="text-blue-100 font-medium mt-2 max-w-sm uppercase text-[10px] tracking-widest font-bold">Revisa i aprova els comprovants enviats per l'alumnat per regularitzar les faltes.</p>
      </div>
      
      <div class="bg-white p-6 rounded-2xl border border-blue-200 shadow-xl flex items-center gap-6 min-w-[200px]">
        <div>
          <p class="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-1">Pendents de Revisió</p>
          <div class="flex items-center gap-2">
             <div class="w-2 h-2 bg-amber-500 rounded-full animate-pulse"></div>
             <p class="text-[10px] font-bold text-slate-500 uppercase tracking-tighter">Acció Requerida</p>
          </div>
        </div>
        <p class="text-5xl font-black text-blue-700 tracking-tighter leading-none italic">{{ pendingCount }}</p>
      </div>
    </div>

    <!-- FILTRES -->
    <div class="flex flex-col md:flex-row gap-4 items-center justify-between bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
      <div class="flex gap-4">
        <select v-model="filterStatus" class="bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-[10px] font-black uppercase tracking-widest focus:outline-none focus:border-blue-400">
          <option value="totes">Tots els estats</option>
          <option value="pendent">Pendents</option>
          <option value="aprovada">Aprovades</option>
          <option value="denegada">Denegades</option>
        </select>
      </div>
      <div class="text-[9px] font-black text-slate-400 uppercase tracking-widest">
        Mostrant {{ filteredJustifications.length }} sol·licituds
      </div>
    </div>

    <!-- LLISTAT DE SOL·LICITUDS -->
    <div class="space-y-4">
      <div v-for="j in filteredJustifications" :key="j.id" 
        class="targeta-campus flex flex-col lg:flex-row items-center justify-between gap-6 group hover:border-blue-100 transition-all"
      >
        <div class="flex items-center gap-6 w-full lg:w-auto">
          <div class="w-14 h-14 rounded-2xl bg-slate-50 flex items-center justify-center border border-slate-100 overflow-hidden shadow-inner">
              <img v-if="j.alumne?.foto" :src="j.alumne.foto" class="w-full h-full object-cover" />
              <span v-else class="text-[10px] font-black text-slate-300 uppercase">{{ j.alumne?.nom?.substring(0, 2) }}</span>
           </div>
           <div>
             <h4 class="font-black text-slate-800 text-lg tracking-tight uppercase group-hover:text-blue-700 transition-colors">{{ j.alumne?.nom }}</h4>
             <div class="flex items-center gap-3 mt-1">
               <span class="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{{ new Date(j.dataInici).toLocaleDateString() }}</span>
               <span class="w-1 h-1 bg-slate-200 rounded-full"></span>
               <span class="text-[9px] font-black text-blue-600 uppercase tracking-widest">Justificació</span>
             </div>
           </div>
        </div>

        <div class="flex-1 px-6 hidden xl:block">
           <p class="text-[10px] italic text-slate-500 leading-relaxed border-l-2 border-slate-100 pl-4">"{{ j.motiu }}"</p>
        </div>

        <div class="flex items-center gap-6 w-full lg:w-auto justify-between lg:justify-end">
          <button @click="viewFile(j)" class="flex items-center gap-2 px-4 py-2 bg-slate-50 text-slate-600 rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-blue-50 hover:text-blue-600 border border-slate-200 transition-all">
            <AppIcon name="eye" class="w-4 h-4" />
            Veure Doc
          </button>
          
          <div v-if="j.estat === 'pendent'" class="flex gap-2">
            <button @click="updateStatus(j, 'validada')" class="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100 flex items-center justify-center hover:bg-emerald-500 hover:text-white transition-all shadow-sm">
              <AppIcon name="check" class="w-5 h-5" />
            </button>
            <button @click="updateStatus(j, 'rebutjada')" class="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 border border-rose-100 flex items-center justify-center hover:bg-rose-500 hover:text-white transition-all shadow-sm">
              <AppIcon name="x" class="w-5 h-5" />
            </button>
          </div>
          <div v-else class="px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest" :class="getStatusClasses(j.estat)">
            {{ j.estat }}
          </div>
        </div>
      </div>

      <div v-if="filteredJustifications.length === 0" class="py-32 text-center targeta-campus border-dashed border-2 bg-slate-50/50">
         <div class="w-20 h-20 bg-white rounded-[2.5rem] flex items-center justify-center text-slate-200 mx-auto mb-6 border border-slate-100">
           <AppIcon name="folder" class="w-10 h-10" />
         </div>
         <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest">No s'han trobat justificacions amb aquests filtres</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import AppIcon from '../components/shared/AppIcon.vue';
import { API_BASE_URL } from '@/config/api';

const filterStatus = ref('pendent');
const justifications = ref([]);

const carregarJustificacions = async () => {
  try {
    const token = localStorage.getItem('access_token');
    const res = await fetch(`${API_BASE_URL}/justificacions/totes`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (res.ok) {
      justifications.value = await res.json();
    }
  } catch (err) {
    console.error('Error carregant justificacions:', err);
  }
};

onMounted(() => {
  carregarJustificacions();
});

const pendingCount = computed(() => justifications.value.filter(j => j.estat === 'pendent').length);

const filteredJustifications = computed(() => {
  if (filterStatus.value === 'totes') return justifications.value;
  return justifications.value.filter(j => j.estat === filterStatus.value);
});

const updateStatus = async (j, newStatus) => {
  try {
    const token = localStorage.getItem('access_token');
    const res = await fetch(`${API_BASE_URL}/justificacions/${j.id}/validar`, {
      method: 'PATCH',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ estat: newStatus })
    });
    
    if (res.ok) {
      j.estat = newStatus;
    }
  } catch (err) {
    console.error('Error validant justificació:', err);
  }
};

const getStatusClasses = (status) => {
  if (status === 'validada') return 'bg-emerald-50 text-emerald-600 border border-emerald-100';
  if (status === 'rebutjada') return 'bg-rose-50 text-rose-600 border border-rose-100';
  return 'bg-amber-50 text-amber-600 border border-amber-100';
};

const viewFile = (j) => {
  if (j.arxiuUrl) {
    window.open(`${API_BASE_URL}/uploads/justificacions/${j.arxiuUrl}`, '_blank');
  } else {
    alert('No hi ha cap fitxer adjunt.');
  }
};
</script>
