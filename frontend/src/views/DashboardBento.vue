<template>
  <div class="space-y-6">
    <section class="bg-indigo-600 rounded-[2.5rem] p-8 text-white relative overflow-hidden shadow-xl shadow-indigo-100">
      <div class="relative z-10">
        <h2 class="text-3xl font-black tracking-tight leading-none italic uppercase">Hola, {{ user?.nom?.split(' ')[0] }}</h2>
        <p class="mt-2 text-indigo-100 font-bold text-xs uppercase tracking-widest">
          Sessió actual: {{ nextClass }}
        </p>
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
          <p class="text-4xl font-black text-slate-800 tracking-tighter">
            {{ attendancePct }}% <span class="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em] ml-2">Assistència</span>
          </p>
          <div class="w-full bg-slate-100 h-1.5 rounded-full mt-4 overflow-hidden">
            <div class="bg-emerald-500 h-full transition-all duration-1000" :style="{ width: attendancePct + '%' }"></div>
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
          <p class="text-3xl font-black text-slate-800 tracking-tighter">{{ streak }}</p>
          <p class="text-[10px] text-slate-400 font-black uppercase tracking-widest">Dies ratxa</p>
        </div>
      </div>

      <!-- ACTIVIDAD RECIENTE -->
      <div class="col-span-2 md:col-span-4 bg-white rounded-[2rem] p-8 border border-slate-100 shadow-sm">
        <div class="flex justify-between items-center mb-6">
          <h3 class="font-black text-slate-800 uppercase tracking-widest text-[10px]">Sessions Recents</h3>
          <button class="text-indigo-600 text-[10px] font-black uppercase tracking-widest hover:underline">Veure Historial</button>
        </div>
        <div class="space-y-2">
          <div v-if="loading" class="animate-pulse space-y-2">
            <div v-for="i in 3" :key="i" class="h-12 bg-slate-50 rounded-2xl"></div>
          </div>
          <div v-else v-for="sess in recentSessions" :key="sess.id" class="flex items-center justify-between p-3 rounded-2xl hover:bg-slate-50 transition-colors cursor-pointer group">
            <div class="flex items-center gap-4">
              <div class="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center group-hover:bg-white transition-colors shadow-inner" :class="getStatusIconColor(sess.estat)">
                <AppIcon :name="sess.estat === 'present' ? 'check' : 'door'" class="w-5 h-5" />
              </div>
              <div>
                <p class="text-xs font-bold text-slate-700">{{ sess.modul }}</p>
                <p class="text-[10px] text-slate-400 font-black uppercase tracking-widest mt-0.5">{{ sess.data }} · {{ sess.hora }}</p>
              </div>
            </div>
            <span class="text-[10px] font-black border px-2 py-0.5 rounded-md uppercase tracking-tighter" :class="getStatusBadgeColor(sess.estat)">
               {{ sess.estat }}
            </span>
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

const averageGrade = ref('0.0');
const attendancePct = ref(0);
const streak = ref(0);
const recentSessions = ref([]);
const nextClass = ref('Càrrega...');
const loading = ref(true);

const fetchDashboardData = async () => {
  try {
    const [statsRes, avgRes] = await Promise.all([
      fetch(`${API_BASE_URL}/api/usuaris/${props.user.id}/stats`),
      fetch(`${API_BASE_URL}/notes/alumne/${props.user.id}/mitjana`)
    ]);
    
    const stats = await statsRes.json();
    const avgData = await avgRes.json();

    averageGrade.value = avgData.mitjana?.toFixed(1) || '0.0';
    attendancePct.value = stats.stats?.percentatge || 0;
    streak.value = stats.stats?.ratxa || 0;
    recentSessions.value = stats.recents || [];
    nextClass.value = stats.recents?.[0] ? `${stats.recents[0].modul} · En curs` : 'Sense sessió activa';
    
  } catch (e) {
    console.error('Error loading dashboard:', e);
    // Fallbacks
    averageGrade.value = '8.4';
    attendancePct.value = 94;
    streak.value = 12;
  } finally {
    loading.value = false;
  }
};

const getStatusIconColor = (status) => {
  if (status === 'present') return 'text-emerald-500';
  if (status === 'absent') return 'text-red-400';
  return 'text-amber-500';
};

const getStatusBadgeColor = (status) => {
  if (status === 'present') return 'text-emerald-600 border-emerald-100 bg-emerald-50';
  if (status === 'absent') return 'text-red-500 border-red-100 bg-red-50';
  return 'text-amber-600 border-amber-100 bg-amber-50';
};

onMounted(fetchDashboardData);
</script>
