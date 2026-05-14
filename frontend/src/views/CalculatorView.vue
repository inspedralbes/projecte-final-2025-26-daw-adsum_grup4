<template>
  <div class="space-y-8 animate-fade-in">
    <!-- CAPÇALERA -->
    <div class="hero-academic shadow-xl shadow-blue-100 flex flex-col md:flex-row justify-between items-center gap-6">
      <div>
        <div class="flex items-center gap-3 mb-4">
          <span class="badge-estat bg-white/20 text-white backdrop-blur-md">Eina de Planificació</span>
          <span class="badge-estat bg-blue-400/50 text-white">Simulador</span>
        </div>
        <h2 class="text-3xl md:text-4xl font-black tracking-tight uppercase italic leading-none">Calculadora de Notes</h2>
        <p class="text-blue-100 font-medium mt-2 max-w-sm uppercase text-[10px] tracking-widest font-bold">Simula el teu rendiment i preveu la teva nota final.</p>
      </div>
      
      <div class="bg-white p-6 rounded-2xl border border-blue-200 shadow-xl flex items-center gap-6 min-w-[200px]">
        <div>
          <p class="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-1">Nota Final Prevista</p>
          <div class="flex items-center gap-2">
             <div class="w-2 h-2 rounded-full animate-pulse" :class="gradeColor"></div>
             <p class="text-[10px] font-bold text-slate-500 uppercase tracking-tighter">{{ gradeStatus }}</p>
          </div>
        </div>
        <p class="text-5xl font-black tracking-tighter leading-none italic" :class="gradeTextColor">{{ finalGrade.toFixed(1) }}</p>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <!-- CONFIGURACIÓ DE PESOS -->
      <div class="lg:col-span-2 targeta-campus">
        <div class="flex justify-between items-center mb-8">
          <h3 class="font-black text-slate-900 uppercase tracking-widest text-xs flex items-center gap-2">
            <div class="w-1 h-4 bg-blue-600 rounded-full"></div>
            Activitats de l'Avaluació
          </h3>
          <button @click="addItem" class="text-[9px] font-black text-blue-600 uppercase tracking-widest hover:bg-blue-50 px-3 py-1.5 rounded-lg border border-blue-100 transition-all">
            + Afegir Activitat
          </button>
        </div>

        <div class="space-y-4">
          <div v-for="(item, index) in items" :key="index" class="flex flex-col md:flex-row gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100 hover:border-blue-200 transition-all group">
            <div class="flex-1">
              <label class="block text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Nom de l'Activitat</label>
              <input v-model="item.name" type="text" placeholder="Ex: Examen Tema 1" class="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-bold focus:outline-none focus:border-blue-400" />
            </div>
            <div class="w-full md:w-24">
              <label class="block text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Pes (%)</label>
              <input v-model.number="item.weight" type="number" min="0" max="100" class="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-black text-blue-700" />
            </div>
            <div class="w-full md:w-24">
              <label class="block text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Nota (0-10)</label>
              <input v-model.number="item.grade" type="number" min="0" max="10" step="0.1" class="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-black text-blue-700" />
            </div>
            <button @click="removeItem(index)" class="mt-4 md:mt-0 md:self-end p-2.5 text-slate-300 hover:text-red-500 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        </div>

        <div v-if="totalWeight !== 100" class="mt-8 p-4 bg-amber-50 rounded-xl border border-amber-100 flex items-center gap-3">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <p class="text-[9px] font-black text-amber-700 uppercase tracking-widest">
            Alerta: La suma dels pesos és del {{ totalWeight }}%. Per a un càlcul precís, hauria de ser del 100%.
          </p>
        </div>
      </div>

      <!-- CONSELLS I RECOMANACIONS -->
      <div class="space-y-6">
        <div class="targeta-campus !p-8 bg-slate-900 text-white border-none shadow-blue-900/20 relative overflow-hidden">
          <div class="relative z-10">
            <h3 class="font-black uppercase tracking-widest text-[10px] text-blue-400 mb-6">Objectiu d'Aprovat</h3>
            <p class="text-2xl font-black italic mb-4 leading-tight">Quant necessito per treure un 5.0?</p>
            <div v-if="remainingWeight > 0" class="p-4 bg-white/10 rounded-xl border border-white/10">
               <p class="text-[9px] font-bold text-blue-300 uppercase tracking-widest mb-1">Nota mínima necessària:</p>
               <p class="text-3xl font-black text-white italic">{{ neededForFive.toFixed(1) }}</p>
               <p class="text-[8px] text-blue-300 mt-2">En el {{ remainingWeight }}% restant de l'avaluació.</p>
            </div>
            <div v-else class="p-4 bg-emerald-500/20 rounded-xl border border-emerald-500/20">
               <p class="text-[10px] font-black text-emerald-400 uppercase tracking-widest">Ja has completat l'avaluació!</p>
            </div>
          </div>
          <div class="absolute -bottom-6 -right-6 w-32 h-32 bg-blue-600/10 rounded-full blur-3xl"></div>
        </div>

        <div class="targeta-campus !p-8">
          <h3 class="font-black text-slate-800 uppercase tracking-widest text-[10px] mb-6 flex items-center gap-2">
            <div class="w-1 h-3 bg-emerald-500 rounded-full"></div>
            Consells Acadèmics
          </h3>
          <ul class="space-y-4">
            <li class="flex gap-3">
              <div class="w-5 h-5 bg-blue-50 rounded-md flex items-center justify-center shrink-0">
                <span class="text-[9px] font-black text-blue-600">01</span>
              </div>
              <p class="text-[10px] text-slate-500 font-medium">Prioritza les activitats amb més **pes**. Un examen del 40% val més que 4 pràctiques del 5%.</p>
            </li>
            <li class="flex gap-3">
              <div class="w-5 h-5 bg-blue-50 rounded-md flex items-center justify-center shrink-0">
                <span class="text-[9px] font-black text-blue-600">02</span>
              </div>
              <p class="text-[10px] text-slate-500 font-medium">No t'oblidis de l'assistència; recorda que a l'institut és obligatòria per poder ser avaluat.</p>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';

const items = ref([
  { name: 'Examen Teòric', weight: 40, grade: 7.5 },
  { name: 'Pràctica Final', weight: 30, grade: 8.0 },
  { name: 'Seguiment a l\'aula', weight: 10, grade: 10 }
]);

const addItem = () => {
  items.value.push({ name: '', weight: 0, grade: 0 });
};

const removeItem = (index) => {
  items.value.splice(index, 1);
};

const totalWeight = computed(() => {
  return items.value.reduce((acc, item) => acc + (item.weight || 0), 0);
});

const finalGrade = computed(() => {
  if (totalWeight.value === 0) return 0;
  const weightedSum = items.value.reduce((acc, item) => acc + ((item.grade || 0) * (item.weight || 0)), 0);
  return weightedSum / totalWeight.value;
});

const remainingWeight = computed(() => {
  return Math.max(0, 100 - totalWeight.value);
});

const neededForFive = computed(() => {
  if (remainingWeight.value <= 0) return 0;
  const currentPoints = items.value.reduce((acc, item) => acc + ((item.grade || 0) * (item.weight || 0)), 0);
  const neededPoints = 500 - currentPoints;
  const result = neededPoints / remainingWeight.value;
  return result > 10 ? 10 : (result < 0 ? 0 : result);
});

const gradeStatus = computed(() => {
  if (finalGrade.value >= 9) return 'Excel·lent';
  if (finalGrade.value >= 7) return 'Notable';
  if (finalGrade.value >= 5) return 'Aprovat';
  return 'Insuficient';
});

const gradeColor = computed(() => {
  if (finalGrade.value >= 9) return 'bg-blue-600';
  if (finalGrade.value >= 7) return 'bg-blue-400';
  if (finalGrade.value >= 5) return 'bg-emerald-500';
  return 'bg-rose-500';
});

const gradeTextColor = computed(() => {
  if (finalGrade.value >= 9) return 'text-blue-700';
  if (finalGrade.value >= 7) return 'text-blue-500';
  if (finalGrade.value >= 5) return 'text-emerald-600';
  return 'text-rose-600';
});
</script>
