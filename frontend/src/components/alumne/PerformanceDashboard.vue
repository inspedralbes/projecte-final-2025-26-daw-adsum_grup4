<template>
  <div class="max-w-md mx-auto space-y-6 animate-fade-in">
    <!-- Resumen de Asistencia -->
    <div class="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100">
      <h2 class="text-sm font-black text-slate-400 uppercase tracking-widest mb-4">Resum d'Assistència</h2>
      <div class="grid grid-cols-2 gap-4">
        <div class="bg-indigo-50 p-4 rounded-2xl border border-indigo-100">
          <p class="text-2xl font-black text-indigo-600">92%</p>
          <p class="text-[10px] font-bold text-indigo-400 uppercase">Global</p>
        </div>
        <div class="bg-emerald-50 p-4 rounded-2xl border border-emerald-100">
          <p class="text-2xl font-black text-emerald-600">5</p>
          <p class="text-[10px] font-bold text-emerald-400 uppercase">Rata (Dies)</p>
        </div>
      </div>
    </div>

    <!-- Calculadora de Notas -->
    <div class="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100">
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-sm font-black text-slate-400 uppercase tracking-widest">Simulador de Notes</h2>
        <span class="text-xs bg-slate-100 px-2 py-1 rounded-lg font-bold text-slate-500">MVP</span>
      </div>
      
      <div class="space-y-4">
        <div>
          <label class="block text-[10px] font-black text-slate-400 uppercase mb-1 ml-1">Nota actual (mitjana)</label>
          <input 
            v-model.number="currentGrade" 
            type="number" 
            max="10" 
            min="0"
            class="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-2 text-sm font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
          >
        </div>
        
        <div>
          <label class="block text-[10px] font-black text-slate-400 uppercase mb-1 ml-1">Nota desitjada (final)</label>
          <input 
            v-model.number="targetGrade" 
            type="number" 
            max="10" 
            min="0"
            class="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-2 text-sm font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
          >
        </div>

        <div v-if="neededGrade !== null" class="mt-6 p-4 rounded-2xl text-center" :class="neededGrade > 10 ? 'bg-red-50' : 'bg-indigo-600'">
          <p class="text-[10px] uppercase font-bold tracking-widest mb-1" :class="neededGrade > 10 ? 'text-red-400' : 'text-indigo-200'">
            Necessites al següent examen:
          </p>
          <p class="text-3xl font-black" :class="neededGrade > 10 ? 'text-red-600' : 'text-white'">
            {{ neededGrade > 10 ? 'Impossible!' : neededGrade.toFixed(2) }}
          </p>
          <p v-if="neededGrade > 10" class="text-[9px] text-red-400 mt-1 font-bold">La nota supera el 10</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';

const currentGrade = ref(5);
const targetGrade = ref(7);

const neededGrade = computed(() => {
  if (currentGrade.value === null || targetGrade.value === null) return null;
  // Suposant que l'examen següent compta el 50% de la nota final
  // (Target * 2) - Current = Needed
  return (targetGrade.value * 2) - currentGrade.value;
});
</script>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.4s ease-out;
}
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(15px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
