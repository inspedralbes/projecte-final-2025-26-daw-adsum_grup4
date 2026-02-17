<template>
  <div class="bg-white p-8 rounded-[2.5rem] shadow-[0_20px_50px_rgba(30,41,59,0.05)] border border-slate-100 w-full max-w-sm mx-auto text-center animate-fade-in">
    <div class="bg-slate-50 p-6 rounded-3xl mb-8 flex flex-col items-center justify-center border border-slate-100 shadow-inner">
      <qrcode-vue :value="qrValue" :size="200" level="H" render-as="svg" />
      <div class="mt-4 w-full">
        <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Token de verificació</p>
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
      <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
        {{ Math.ceil(timeLeft) }}s per refrescar
      </p>
      <p :class="status.includes('Conectat') ? 'text-green-500' : 'text-red-500'" class="text-[10px] font-mono font-bold uppercase tracking-tighter">
        ● {{ status }}
      </p>
    </div>
    <!-- Indicadores de Validación (Mockups para el MVP) -->
    <div class="mt-8 pt-6 border-t border-slate-50 flex justify-around">
      <div class="flex flex-col items-center opacity-40">
        <div class="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center mb-1">📍</div>
        <span class="text-[8px] font-black uppercase text-slate-400">GPS</span>
      </div>
      <div class="flex flex-col items-center opacity-40">
        <div class="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center mb-1">📱</div>
        <span class="text-[8px] font-black uppercase text-slate-400">Device</span>
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
  const socket = io('http://localhost:3000');
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