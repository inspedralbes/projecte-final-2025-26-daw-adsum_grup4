<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <h2 class="text-sm font-black text-slate-400 uppercase tracking-widest">Simulador Avançat</h2>
      <div class="flex items-center gap-2">
        <span class="text-[10px] font-black text-indigo-600 uppercase">Objectiu:</span>
        <input 
          v-model.number="targetGrade" 
          type="number" step="0.1" max="10" min="0"
          class="w-12 bg-indigo-50 border border-indigo-100 rounded-lg px-2 py-1 text-xs font-black text-indigo-700 focus:outline-none"
        >
      </div>
    </div>

    <!-- LLISTA DE NOTES EXISTENTS -->
    <div class="space-y-3">
      <div v-for="(item, index) in grades" :key="index" 
        class="flex items-center gap-3 bg-slate-50 p-3 rounded-2xl border border-slate-100 group animate-slide-in"
        :style="{ animationDelay: `${index * 0.1}s` }"
      >
        <div class="flex-1">
          <input 
            v-model="item.name" 
            placeholder="Nom (ex: Examen 1)"
            class="w-full bg-transparent border-none text-xs font-bold text-slate-700 placeholder:text-slate-300 focus:outline-none"
          >
        </div>
        <div class="flex items-center gap-2">
          <div class="flex flex-col items-center">
            <span class="text-[8px] font-black text-slate-400 uppercase leading-none mb-1">Nota</span>
            <input 
              v-model.number="item.value" 
              type="number" step="0.1" max="10" min="0"
              class="w-12 bg-white border border-slate-200 rounded-lg px-2 py-1 text-xs font-black text-slate-700 text-center focus:ring-2 focus:ring-indigo-500/20 outline-none"
            >
          </div>
          <div class="flex flex-col items-center">
            <span class="text-[8px] font-black text-slate-400 uppercase leading-none mb-1">Pes %</span>
            <input 
              v-model.number="item.weight" 
              type="number" max="100" min="0"
              class="w-12 bg-white border border-slate-200 rounded-lg px-2 py-1 text-xs font-black text-slate-700 text-center focus:ring-2 focus:ring-indigo-500/20 outline-none"
            >
          </div>
          <button @click="removeGrade(index)" class="text-slate-300 hover:text-red-400 transition-colors ml-1">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-4 h-4">
              <path fill-rule="evenodd" d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16ZM8.28 7.22a.75.75 0 0 0-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 1 0 1.06 1.06L10 11.06l1.72 1.72a.75.75 0 1 0 1.06-1.06L11.06 10l1.72-1.72a.75.75 0 1 0-1.06-1.06L10 8.94 8.28 7.22Z" clip-rule="evenodd" />
            </svg>
          </button>
        </div>
      </div>
    </div>

    <!-- ACCIONS -->
    <button @click="addGrade" 
      class="w-full py-3 border-2 border-dashed border-slate-200 rounded-2xl text-slate-400 hover:text-indigo-500 hover:border-indigo-200 hover:bg-indigo-50/30 transition-all flex items-center justify-center gap-2 group"
    >
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-5 h-5 group-hover:scale-110 transition-transform">
        <path d="M10.75 4.75a.75.75 0 0 0-1.5 0v4.5h-4.5a.75.75 0 0 0 0 1.5h4.5v4.5a.75.75 0 0 0 1.5 0v-4.5h4.5a.75.75 0 0 0 0-1.5h-4.5v-4.5Z" />
      </svg>
      <span class="text-[10px] font-black uppercase tracking-widest">Afegir qualificació</span>
    </button>

    <!-- RESULTATS -->
    <div v-if="totalWeight < 100" class="relative mt-8 p-6 rounded-[2rem] overflow-hidden group">
      <!-- Background dinàmic -->
      <div class="absolute inset-0 bg-indigo-600 transition-colors duration-500" :class="{ 'bg-rose-600': neededGrade > 10 }"></div>
      <div class="absolute inset-0 opacity-20" style="background-image: radial-gradient(circle at 2px 2px, white 1px, transparent 0); background-size: 16px 16px;"></div>
      
      <div class="relative z-10 text-center">
        <p class="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-100 mb-2">Per a la resta del mòdul ({{ 100 - totalWeight }}%)</p>
        
        <div class="flex items-center justify-center gap-2 mb-1">
          <span class="text-xs font-bold text-indigo-200">Necessites un:</span>
          <h3 class="text-5xl font-black text-white tracking-tighter tabular-nums">
            {{ neededGrade > 10 ? '!' : neededGrade.toFixed(2) }}
          </h3>
        </div>

        <p v-if="neededGrade > 10" class="text-xs font-black text-white/90 bg-black/20 py-1 px-4 rounded-full inline-block mt-2">
          MATEMÀTICAMENT IMPOSSIBLE
        </p>
        <p v-else class="text-[10px] font-bold text-indigo-200 uppercase tracking-widest">
          {{ neededGrade <= 5 ? 'Ho tens fàcil! 💪' : neededGrade > 8 ? 'Caldrà esforçar-se molt! 🔥' : 'Pots aconseguir-ho! 👍' }}
        </p>
      </div>
    </div>

    <div v-else-if="totalWeight === 100" class="p-6 rounded-[2rem] bg-slate-100 text-center border-2 border-slate-200">
        <p class="text-[10px] font-black text-slate-400 uppercase mb-1">Mitjana Final</p>
        <p class="text-4xl font-black text-slate-800">{{ currentAverage.toFixed(2) }}</p>
        <p class="text-xs font-bold mt-2" :class="currentAverage >= targetGrade ? 'text-emerald-500' : 'text-rose-500'">
            {{ currentAverage >= targetGrade ? 'ESTÀS APROVAT! 🎉' : 'NO ARRIBES A L\'OBJECTIU 😔' }}
        </p>
    </div>

    <div v-else class="p-4 bg-amber-50 rounded-2xl border border-amber-200 flex items-center gap-3">
        <span class="text-xl">⚠️</span>
        <p class="text-[10px] font-bold text-amber-700 uppercase">El pes total supera el 100% ({{ totalWeight }}%)</p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';

const targetGrade = ref(5);
const grades = ref([
  { name: 'Examen Teòric', value: 4.5, weight: 40 },
  { name: 'Pràctica Final', value: 6.2, weight: 30 }
]);

const addGrade = () => {
  grades.value.push({ name: '', value: 5, weight: 10 });
};

const removeGrade = (index) => {
  grades.value.splice(index, 1);
};

const totalWeight = computed(() => {
  return grades.value.reduce((acc, curr) => acc + (curr.weight || 0), 0);
});

const currentWeightedSum = computed(() => {
  return grades.value.reduce((acc, curr) => acc + ((curr.value || 0) * (curr.weight || 0)), 0);
});

const currentAverage = computed(() => {
  if (totalWeight.value === 0) return 0;
  return currentWeightedSum.value / totalWeight.value;
});

const neededGrade = computed(() => {
  const remainingWeight = 100 - totalWeight.value;
  if (remainingWeight <= 0) return 0;
  
  // Formula: (Target * 100 - CurrentWeightedSum) / RemainingWeight
  const needed = (targetGrade.value * 100 - currentWeightedSum.value) / remainingWeight;
  return Math.max(0, needed);
});
</script>

<script>
export default {
    name: 'GradeCalculator'
}
</script>

<style scoped>
.animate-slide-in {
  animation: slideIn 0.3s ease-out forwards;
  opacity: 0;
}

@keyframes slideIn {
  from { opacity: 0; transform: translateX(-10px); }
  to { opacity: 1; transform: translateX(0); }
}
</style>
