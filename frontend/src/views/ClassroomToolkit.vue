<template>
  <div class="space-y-8 animate-fade-in">
    <!-- CAPÇALERA -->
    <div class="hero-academic shadow-xl shadow-blue-100 flex flex-col md:flex-row justify-between items-center gap-6">
      <div>
        <div class="flex items-center gap-3 mb-4">
          <span class="badge-estat bg-white/20 text-white backdrop-blur-md">Eines de Classe</span>
          <span class="badge-estat bg-blue-400/50 text-white">Professorat</span>
        </div>
        <h2 class="text-3xl md:text-4xl font-black tracking-tight uppercase italic leading-none">Classroom Toolkit</h2>
        <p class="text-blue-100 font-medium mt-2 max-w-sm uppercase text-[10px] tracking-widest font-bold">Eines per dinamitzar l'aula i gestionar grups de treball.</p>
      </div>
      
      <div class="flex gap-4">
         <select v-model="selectedModul" class="bg-white p-4 rounded-2xl border border-blue-200 shadow-xl text-xs font-black uppercase tracking-widest focus:outline-none focus:border-blue-500">
            <option value="DAW2">M7 - DAW2</option>
            <option value="DAW1">M3 - DAW1</option>
         </select>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <!-- RANDOM PICKER -->
      <div class="targeta-campus flex flex-col items-center justify-center p-12 text-center bg-slate-900 text-white border-none shadow-blue-900/20 relative overflow-hidden">
        <div class="relative z-10 space-y-8 w-full">
          <h3 class="font-black uppercase tracking-widest text-[10px] text-blue-400">Random Picker</h3>
          
          <div class="h-32 flex items-center justify-center">
            <div v-if="pickedStudent" class="animate-bounce">
               <p class="text-[10px] font-black text-blue-300 uppercase tracking-widest mb-2">L'elegit és:</p>
               <h4 class="text-4xl font-black italic uppercase tracking-tighter">{{ pickedStudent }}</h4>
            </div>
            <div v-else-if="isSpinning" class="flex gap-2">
               <div class="w-3 h-3 bg-blue-500 rounded-full animate-bounce"></div>
               <div class="w-3 h-3 bg-blue-500 rounded-full animate-bounce" style="animation-delay: 0.2s"></div>
               <div class="w-3 h-3 bg-blue-500 rounded-full animate-bounce" style="animation-delay: 0.4s"></div>
            </div>
            <p v-else class="text-slate-500 text-xs font-bold italic uppercase">Prem el botó per triar algú</p>
          </div>

          <button @click="pickRandom" :disabled="isSpinning" class="w-full py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all shadow-lg shadow-blue-900/40">
             {{ isSpinning ? 'Triant...' : 'Triar Alumne a l\'Atzar' }}
          </button>
        </div>
        <div class="absolute -bottom-10 -right-10 w-40 h-40 bg-blue-500/10 rounded-full blur-3xl"></div>
      </div>

      <!-- GENERADOR DE GRUPS -->
      <div class="targeta-campus">
        <h3 class="font-black text-slate-900 uppercase tracking-widest text-[10px] mb-8 flex items-center gap-2">
          <div class="w-1 h-4 bg-emerald-500 rounded-full"></div>
          Generador de Grups
        </h3>

        <div class="flex gap-4 mb-8">
           <div class="flex-1">
              <label class="block text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Alumnes per grup</label>
              <input v-model.number="groupSize" type="number" min="2" max="10" class="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs font-black text-blue-700" />
           </div>
           <button @click="generateGroups" class="self-end px-6 py-3 bg-emerald-500 text-white rounded-xl text-[9px] font-black uppercase tracking-widest shadow-lg shadow-emerald-50">Generar Equips</button>
        </div>

        <div class="grid grid-cols-2 gap-4">
           <div v-for="(group, idx) in groups" :key="idx" class="p-4 bg-slate-50 rounded-2xl border border-slate-100">
              <p class="text-[9px] font-black text-emerald-600 uppercase tracking-widest mb-3">Grup {{ idx + 1 }}</p>
              <ul class="space-y-1.5">
                 <li v-for="student in group" :key="student" class="text-[10px] font-bold text-slate-600 uppercase">{{ student }}</li>
              </ul>
           </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const selectedModul = ref('DAW2');
const pickedStudent = ref('');
const isSpinning = ref(false);
const groupSize = ref(3);
const groups = ref([]);

const mockStudents = [
  'Bryan G.', 'Sara M.', 'Marc R.', 'Júlia V.', 'Pol S.', 'Anna B.', 'Joan C.', 'Èric F.', 'Marta P.', 'Lluc T.', 'Berta L.', 'Oriol J.'
];

const pickRandom = () => {
  isSpinning.value = true;
  pickedStudent.value = '';
  setTimeout(() => {
    const idx = Math.floor(Math.random() * mockStudents.length);
    pickedStudent.value = mockStudents[idx];
    isSpinning.value = false;
  }, 1500);
};

const generateGroups = () => {
  const shuffled = [...mockStudents].sort(() => 0.5 - Math.random());
  const result = [];
  for (let i = 0; i < shuffled.length; i += groupSize.value) {
    result.push(shuffled.slice(i, i + groupSize.value));
  }
  groups.value = result;
};
</script>
