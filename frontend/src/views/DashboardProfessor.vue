<template>
  <div class="space-y-6">
    <section class="bg-indigo-600 rounded-[2.5rem] p-8 text-white relative overflow-hidden shadow-xl shadow-indigo-100">
      <div class="relative z-10">
        <h2 class="text-3xl font-black tracking-tight leading-none italic uppercase">Hola, Prof. Garcia</h2>
        <p class="mt-2 text-indigo-100 font-bold text-xs uppercase tracking-widest">Tens {{ moduls.length }} classes assignades</p>
      </div>
      <div class="absolute -top-12 -right-12 w-64 h-64 bg-indigo-500 rounded-full blur-3xl opacity-50 font-black flex items-center justify-center text-indigo-400/20 text-9xl">P</div>
    </section>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div v-for="modul in moduls" :key="modul.id_modul" 
        @click="$emit('select-class', modul)"
        class="bg-white rounded-[2rem] p-6 border border-slate-100 shadow-sm flex flex-col justify-between hover:border-indigo-200 transition-all cursor-pointer group hover:-translate-y-1"
      >
        <div class="flex justify-between items-start">
          <div class="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 group-hover:scale-110 transition-transform">
            <AppIcon name="book" class="w-7 h-7" />
          </div>
          <span class="text-[10px] font-black uppercase tracking-widest text-slate-400 bg-slate-50 px-2.5 py-1 rounded-full group-hover:text-indigo-500 group-hover:bg-indigo-50 transition-colors">{{ modul.grup?.nom || 'Sense Grup' }}</span>
        </div>
        <div class="mt-8">
          <h3 class="text-xl font-black text-slate-800 tracking-tight leading-tight">{{ modul.nom }}</h3>
          <p class="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em] mt-2">Codi: {{ modul.codi }}</p>
          <div class="mt-6 flex items-center gap-2">
            <div class="flex -space-x-2">
              <div v-for="i in 3" :key="i" class="w-6 h-6 rounded-full border-2 border-white bg-slate-200"></div>
            </div>
            <span class="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">+20 alumnes</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import AppIcon from '../components/shared/AppIcon.vue';

const emit = defineEmits(['select-class']);
const moduls = ref([]);

onMounted(async () => {
  try {
    // Hardcoded professor ID for demonstration
    const res = await fetch('http://localhost:3000/users/professor/1/moduls');
    moduls.value = await res.json();
  } catch (e) {
    console.error('Error fetching moduls:', e);
    // Fallback Mock data
    moduls.value = [
      { id_modul: 1, nom: 'Desenvolupament Web', codi: 'M7', grup: { nom: 'DAW2' } },
      { id_modul: 2, nom: 'Bases de Dades', codi: 'M3', grup: { nom: 'DAW1' } }
    ];
  }
});
</script>
