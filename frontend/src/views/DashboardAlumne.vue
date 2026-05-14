<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-100 via-indigo-50 to-slate-100">
    <!-- CABECERA -->
    <header class="relative overflow-hidden bg-gradient-to-r from-indigo-600 to-violet-600 px-6 pt-10 pb-16 text-white">
      <div class="absolute inset-0 opacity-10"
        style="background-image: radial-gradient(circle at 80% 20%, white 1px, transparent 1px); background-size: 24px 24px;">
      </div>
      <p class="text-indigo-200 text-xs font-bold uppercase tracking-widest mb-1">Benvinguda</p>
      <h1 class="text-2xl font-black">Andreia López</h1>
      <p class="text-indigo-200 text-sm mt-1">DAW · Grup 4 · 2025-26</p>
    </header>
    <!-- GRID DE TARJETAS (superpuesto a la cabecera) -->
    <main class="px-4 -mt-8 pb-28 space-y-4">
      <!-- Fila 1 -->
      <div class="grid grid-cols-2 gap-4">
        <!-- Tarjeta: Notes -->
        <button @click="activeView = 'performance'"
          class="bg-white/80 backdrop-blur-sm border border-white shadow-lg rounded-3xl p-5 text-left hover:scale-[1.03] transition-transform active:scale-95">
          <div class="w-10 h-10 rounded-2xl bg-indigo-100 flex items-center justify-center mb-3">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6 text-indigo-600">
              <path stroke-linecap="round" stroke-linejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z" />
            </svg>
          </div>
          <p class="font-black text-slate-800 text-xl">Notes</p>
          <p class="text-xs text-slate-500 mt-0.5">Simulador i rendiment</p>
        </button>
        <!-- Tarjeta: Assistència -->
        <button @click="activeView = 'attendance'"
          class="bg-white/80 backdrop-blur-sm border border-white shadow-lg rounded-3xl p-5 text-left hover:scale-[1.03] transition-transform active:scale-95">
          <div class="w-10 h-10 rounded-2xl bg-emerald-100 flex items-center justify-center mb-3">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6 text-emerald-600">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5m-9-6h.008v.008H12v-.008ZM12 15h.008v.008H12V15Zm0 2.25h.008v.008H12v-.008ZM9.75 15h.008v.008H9.75V15Zm0 2.25h.008v.008H9.75v-.008ZM7.5 15h.008v.008H7.5V15Zm0 2.25h.008v.008H7.5v-.008Zm6.75-4.5h.008v.008h-.008v-.008Zm0 2.25h.008v.008h-.008V15Zm0 2.25h.008v.008h-.008v-.008Zm2.25-4.5h.008v.008H16.5v-.008Zm0 2.25h.008v.008H16.5V15Z" />
            </svg>
          </div>
          <p class="font-black text-slate-800 text-xl">Assistència</p>
          <p class="text-xs text-slate-500 mt-0.5">Faltes i ratxes</p>
        </button>
      </div>
      <!-- Fila 2 -->
      <div class="grid grid-cols-2 gap-4">
        <!-- Tarjeta: Recursos -->
        <button @click="activeView = 'resources'"
          class="bg-white/80 backdrop-blur-sm border border-white shadow-lg rounded-3xl p-5 text-left hover:scale-[1.03] transition-transform active:scale-95">
          <div class="w-10 h-10 rounded-2xl bg-amber-100 flex items-center justify-center mb-3">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6 text-amber-600">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" />
            </svg>
          </div>
          <p class="font-black text-slate-800 text-xl">Recursos</p>
          <p class="text-xs text-slate-500 mt-0.5">Apunts i comunitat</p>
        </button>
        <!-- Tarjeta: Passadís -->
        <button @click="activeView = 'hallpass'"
          class="bg-white/80 backdrop-blur-sm border border-white shadow-lg rounded-3xl p-5 text-left hover:scale-[1.03] transition-transform active:scale-95">
          <div class="w-10 h-10 rounded-2xl bg-rose-100 flex items-center justify-center mb-3">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6 text-rose-600">
              <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9" />
            </svg>
          </div>
          <p class="font-black text-slate-800 text-xl">Passadís</p>
          <p class="text-xs text-slate-500 mt-0.5">Sortida de classe</p>
        </button>
      </div>
    </main>
    <!-- BOTÓN QR FLOTANTE -->
    <div class="fixed bottom-6 left-0 right-0 flex justify-center z-20">
      <button @click="activeView = 'qr'"
        class="flex items-center gap-3 bg-indigo-600 hover:bg-indigo-700 text-white font-black px-8 py-4 rounded-full shadow-[0_8px_30px_rgba(99,102,241,0.5)] hover:scale-105 transition-all active:scale-95">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6 text-white">
            <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 0 1 3.75 9.375v-4.5ZM3.75 14.625c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5a1.125 1.125 0 0 1-1.125-1.125v-4.5ZM13.5 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 0 1 13.5 9.375v-4.5Z" />
            <path stroke-linecap="round" stroke-linejoin="round" d="M6.75 6.75h.75v.75h-.75v-.75ZM6.75 16.5h.75v.75h-.75v-.75ZM16.5 6.75h.75v.75h-.75v-.75ZM13.5 13.5h.75v.75h-.75v-.75ZM13.5 19.5h.75v.75h-.75v-.75ZM19.5 13.5h.75v.75h-.75v-.75ZM19.5 19.5h.75v.75h-.75v-.75ZM16.5 16.5h.75v.75h-.75v-.75Z" />
          </svg>
        <span class="text-sm uppercase tracking-widest">Fitxar QR</span>
      </button>
    </div>
    <!-- VISTAS SECUNDARIAS (modal/overlay) -->
    <div v-if="activeView !== 'home'"
      class="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-30 flex flex-col justify-end"
      @click.self="activeView = 'home'">
      <div class="bg-slate-50 rounded-t-[2.5rem] max-h-[90vh] overflow-y-auto p-6 pb-10">
        <!-- Botón cerrar -->
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-lg font-black text-slate-800">{{ viewTitle }}</h2>
          <button @click="activeView = 'home'"
            class="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-slate-500 font-bold text-sm">✕</button>
        </div>
        <!-- Contenido según la vista -->
        <div v-if="activeView === 'qr'">
          <AttendanceQR />
        </div>
        <div v-if="activeView === 'performance'">
          <PerformanceDashboard />
        </div>
        <div v-if="activeView === 'attendance'">
          <AttendanceStats />
        </div>
        <div v-if="activeView === 'resources'" class="text-center py-10 text-slate-500">
          <p class="text-4xl mb-3">📚</p>
          <p class="font-bold">Recursos i Comunitat</p>
          <p class="text-sm mt-1">Properament</p>
        </div>
        <div v-if="activeView === 'hallpass'" class="text-center py-10 text-slate-500">
          <p class="text-4xl mb-3">🚪</p>
          <p class="font-bold">Passadís Digital</p>
          <p class="text-sm mt-1">Properament</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import AttendanceQR from '../components/alumne/AttendanceQR.vue';
import PerformanceDashboard from '../components/alumne/PerformanceDashboard.vue';
import AttendanceStats from '../components/alumne/AttendanceStats.vue';

const activeView = ref('home');

const viewTitle = computed(() => {
    const titles= {
        qr: 'Fitxatge QR',
        performance: 'El meu rendiment',
        attendance: 'Assistència',
        resources: 'Recursos',
        hallpass: 'Passadís digital'
    };
    return titles[activeView.value];
});
</script>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.3s ease-out;
}
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>