<template>
  <div class="bg-white p-6 rounded-[2.5rem] w-full mx-auto text-center animate-fade-in relative">
    <!-- Botón de cerrar para el modal -->
    <button @click="$emit('close')" class="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-500 hover:text-slate-600 transition-colors">✕</button>
    
    <div class="flex justify-between w-full items-center mb-6 px-2">
      <h3 class="font-black text-slate-800 uppercase tracking-widest text-[10px]">Identitat Digital</h3>
    </div>
    <div class="bg-slate-50 p-6 rounded-3xl mb-8 flex flex-col items-center justify-center border border-slate-100 shadow-inner">
      <qrcode-vue :value="qrValue" :size="200" level="H" render-as="svg" />
      <div class="mt-4 w-full">
        <p class="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Token de verificació</p>
        <code class="text-[10px] font-mono text-indigo-600 font-bold break-all bg-white py-2 px-3 rounded-xl border border-slate-100 block shadow-sm select-all">{{ qrValue }}</code>
      </div>
    </div>
    
    <div class="w-full bg-slate-100 rounded-full h-2 mb-2 overflow-hidden">
      <div 
        class="bg-indigo-600 h-full transition-all duration-100 ease-linear"
        :style="{ width: (timeLeft / 5) * 100 + '%' }"
      ></div>
    </div>
    <div class="flex justify-between items-center px-1">
      <p class="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
        {{ Math.ceil(timeLeft) }}s per refrescar
      </p>
      <p :class="status.includes('Conectat') ? 'text-green-500' : 'text-red-500'" class="text-[10px] font-mono font-bold uppercase tracking-tighter">
        ● {{ status }}
      </p>
    </div>
    <!-- Indicadores de Validación (Mockups para el MVP) -->
    <div class="mt-8 pt-6 border-t border-slate-50 flex justify-around">
      <div class="flex flex-col items-center opacity-40">
        <div class="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center mb-1"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
  <path stroke-linecap="round" stroke-linejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
  <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
</svg>
</div>
        <span class="text-[8px] font-black uppercase text-slate-500">GPS</span>
      </div>
      <div class="flex flex-col items-center opacity-40">
        <div class="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center mb-1"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
  <path stroke-linecap="round" stroke-linejoin="round" d="M10.5 1.5H8.25A2.25 2.25 0 0 0 6 3.75v16.5a2.25 2.25 0 0 0 2.25 2.25h7.5A2.25 2.25 0 0 0 18 20.25V3.75a2.25 2.25 0 0 0-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3" />
</svg>
</div>
        <span class="text-[8px] font-black uppercase text-slate-500">Device</span>
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
  const socketUrl = import.meta.env.PROD ? window.location.origin : 'http://localhost:3000';
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