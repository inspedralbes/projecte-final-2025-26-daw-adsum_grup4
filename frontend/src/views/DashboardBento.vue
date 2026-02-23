<template>
  <div class="space-y-6">
    <section class="bg-indigo-600 rounded-[2.5rem] p-8 text-white relative overflow-hidden shadow-xl shadow-indigo-100">
      <div class="relative z-10">
        <h2 class="text-3xl font-black tracking-tight leading-none italic uppercase">Hola, {{ user?.nom?.split(' ')[0] }}</h2>
        <p class="mt-2 text-indigo-100 font-bold text-xs uppercase tracking-widest">Pròxima classe: Matemàtiques · 12:45</p>
      </div>
      <div class="absolute -top-12 -right-12 w-64 h-64 bg-indigo-500 rounded-full blur-3xl opacity-50 font-black flex items-center justify-center text-indigo-400/20 text-9xl">A</div>
    </section>

    <div class="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
      <!-- ASISTENCIA -->
      <div class="col-span-2 bg-white rounded-[2rem] p-6 border border-slate-100 shadow-sm flex flex-col justify-between hover:border-indigo-200 transition-colors cursor-pointer group">
        <div class="flex justify-between items-start">
          <div class="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 group-hover:scale-110 transition-transform">
            <AppIcon name="calendar" class="w-7 h-7" />
          </div>
          <span class="text-[10px] font-black uppercase tracking-widest text-emerald-500 bg-emerald-50 px-2.5 py-1 rounded-full">En línia</span>
        </div>
        <div class="mt-8">
          <p class="text-4xl font-black text-slate-800 tracking-tighter">94% <span class="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em] ml-2">Assistència</span></p>
          <div class="w-full bg-slate-100 h-1.5 rounded-full mt-4 overflow-hidden">
            <div class="bg-emerald-500 h-full w-[94%] rounded-full"></div>
          </div>
        </div>
      </div>

      <!-- NOTAS -->
      <div class="bg-white rounded-[2rem] p-6 border border-slate-100 shadow-sm flex flex-col justify-between hover:border-violet-200 transition-colors cursor-pointer group">
        <div class="w-12 h-12 bg-violet-50 rounded-2xl flex items-center justify-center text-violet-600 group-hover:rotate-12 transition-transform">
          <AppIcon name="academic" class="w-7 h-7" />
        </div>
        <div class="mt-4 text-center md:text-left">
          <p class="text-3xl font-black text-slate-800 tracking-tighter">{{ averageGrade }}</p>
          <p class="text-[10px] text-slate-400 font-black uppercase tracking-widest">Mitjana</p>
        </div>
      </div>

      <!-- RATXA -->
      <div class="bg-white rounded-[2rem] p-6 border border-slate-100 shadow-sm flex flex-col justify-between hover:border-amber-200 transition-colors cursor-pointer group">
        <div class="w-12 h-12 bg-amber-50 rounded-2xl flex items-center justify-center text-amber-600 group-hover:scale-110 transition-transform">
          <AppIcon name="fire" class="w-7 h-7" />
        </div>
        <div class="mt-4 text-center md:text-left">
          <p class="text-3xl font-black text-slate-800 tracking-tighter">12</p>
          <p class="text-[10px] text-slate-400 font-black uppercase tracking-widest">Dies ratxa</p>
        </div>
      </div>

      <!-- ACTIVIDAD RECIENTE -->
      <div class="col-span-2 md:col-span-4 bg-white rounded-[2rem] p-8 border border-slate-100 shadow-sm">
        <div class="flex justify-between items-center mb-6">
          <h3 class="font-black text-slate-800 uppercase tracking-widest text-[10px]">Activitat Recent</h3>
          <button class="text-indigo-600 text-[10px] font-black uppercase tracking-widest hover:underline">Historial</button>
        </div>
        <div class="space-y-2">
          <div v-for="i in 3" :key="i" class="flex items-center justify-between p-3 rounded-2xl hover:bg-slate-50 transition-colors cursor-pointer group">
            <div class="flex items-center gap-4">
              <div class="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-white transition-colors shadow-inner">
                <AppIcon name="check" class="w-5 h-5" />
              </div>
              <div>
                <p class="text-xs font-bold text-slate-700">Assistència registrada</p>
                <p class="text-[10px] text-slate-400 font-black uppercase tracking-tighter tracking-widest mt-0.5">M7 · Ahir, 09:15</p>
              </div>
            </div>
            <span class="text-[10px] font-black text-emerald-500 bg-emerald-50 px-2 py-0.5 rounded-md uppercase tracking-tighter">Éxit</span>
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

const averageGrade = ref('...');

onMounted(async () => {
  try {
    const res = await fetch(`http://localhost:3000/notes/alumne/${props.user.id}/mitjana`);
    const data = await res.json();
    averageGrade.value = data.mitjana || '0.0';
  } catch (e) {
    averageGrade.value = '8.4'; // Fallback
  }
});
</script>
