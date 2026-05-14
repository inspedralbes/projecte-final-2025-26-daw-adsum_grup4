<template>
  <div class="targeta-dinamica !p-8 w-full max-w-sm mx-auto text-center border-white/40 shadow-2xl relative animate-fade-in">
    <!-- Botó de tancar -->
    <button @click="$emit('close')" class="absolute top-6 right-6 w-10 h-10 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all duration-300">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M6 18L18 6M6 6l12 12" />
      </svg>
    </button>
    
    <div class="mb-8">
      <div class="inline-flex items-center justify-center w-14 h-14 bg-indigo-50 rounded-2xl mb-4 shadow-inner">
        <AppIcon name="qr" class="w-8 h-8 text-primari-normal" />
      </div>
      <h3 class="font-black text-slate-900 uppercase tracking-[0.2em] text-[11px]">Identitat Digital ADSUM</h3>
      <p class="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">Vàlid només per a la sessió actual</p>
    </div>

    <div class="bg-white p-6 rounded-[2.5rem] mb-8 flex flex-col items-center justify-center border-4 border-slate-50 shadow-xl relative overflow-hidden group">
      <div class="absolute inset-0 degradat-adsum opacity-[0.02] group-hover:opacity-[0.05] transition-opacity"></div>
      <qrcode-vue :value="qrValue" :size="180" level="H" render-as="svg" class="relative z-10" />
      
      <div class="mt-6 w-full relative z-10">
        <p class="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2">Codi de seguretat</p>
        <div class="bg-slate-50 py-3 px-4 rounded-2xl border border-slate-100 shadow-inner group-hover:border-primari-claret transition-colors">
          <code class="text-[10px] font-mono text-primari-normal font-black break-all select-all">{{ qrValue }}</code>
        </div>
      </div>
    </div>
    
    <div class="space-y-3">
      <div class="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden p-0.5 border border-white">
        <div 
          class="degradat-adsum h-full rounded-full transition-all duration-100 ease-linear shadow-sm"
          :style="{ width: (timeLeft / 5) * 100 + '%' }"
        ></div>
      </div>
      
      <div class="flex justify-between items-center px-1">
        <p class="text-[9px] font-black text-slate-400 uppercase tracking-[0.1em]">
          Refresc en <span class="text-primari-normal">{{ Math.ceil(timeLeft) }}s</span>
        </p>
        <div class="flex items-center gap-1.5">
          <div class="w-1.5 h-1.5 rounded-full animate-pulse" :class="status.includes('línia') ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'bg-red-500'"></div>
          <span class="text-[9px] font-black uppercase tracking-widest" :class="status.includes('línia') ? 'text-emerald-600' : 'text-red-500'">
            {{ status }}
          </span>
        </div>
      </div>
    </div>

    <!-- Indicadors de Validació -->
    <div class="mt-10 pt-6 border-t border-slate-100 flex justify-around opacity-40 group-hover:opacity-100 transition-opacity">
      <div class="flex flex-col items-center gap-1">
        <div class="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center shadow-inner">
          <AppIcon name="location" class="w-5 h-5 text-slate-400" />
        </div>
        <span class="text-[8px] font-black uppercase text-slate-400 tracking-tighter">Geo-Posició</span>
      </div>
      <div class="flex flex-col items-center gap-1">
        <div class="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center shadow-inner">
          <AppIcon name="phone" class="w-5 h-5 text-slate-400" />
        </div>
        <span class="text-[8px] font-black uppercase text-slate-400 tracking-tighter">Dispositiu</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref, onUnmounted } from 'vue';
import { io } from 'socket.io-client';
import QrcodeVue from 'qrcode.vue';

const qrValue = ref('esperant...');
const timeLeft = ref(5);
let timer = null;
const status = ref('Desconnectat');

onMounted(() => {
  const socketUrl = window.location.origin;
  const socket = io(socketUrl);
  const startCountdown = () => {
    if (timer) clearInterval(timer);
    timeLeft.value = 5.0;
    timer = setInterval(() => {
      if (timeLeft.value > 0.1) {
        timeLeft.value -= 0.1;
      } else {
        timeLeft.value = 0;
      }
    }, 100);
  };
  socket.on('connect', () => {
    status.value = 'En línia';
  });
  socket.on('disconnect', () => {
    status.value = 'Desconnectat';
    qrValue.value = 'error';
    if (timer) clearInterval(timer);
  });
  socket.on('new_qr', (data) => {
    qrValue.value = data.token;
    startCountdown();
  });
});

onUnmounted(() => {
  if (timer) clearInterval(timer);
});
</script>