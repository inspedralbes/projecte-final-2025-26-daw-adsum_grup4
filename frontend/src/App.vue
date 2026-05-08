<template>
  <div class="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
    <div class="flex gap-2 mb-4">
      <button 
        @click="mode = 'display'"
        :class="mode === 'display' ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-700'"
        class="px-4 py-2 rounded-lg font-bold text-sm"
      >
        📺 Display (Alumne)
      </button>
      <button 
        @click="mode = 'scanner'"
        :class="mode === 'scanner' ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-700'"
        class="px-4 py-2 rounded-lg font-bold text-sm"
      >
        📷 Scanner (Porta)
      </button>
    </div>

    <div v-if="mode === 'display'" class="bg-white p-10 rounded-[2rem] shadow-[0_20px_50px_rgba(30,41,59,0.05)] border border-slate-100 max-w-sm w-full text-center">
      <h1 class="text-4xl font-extrabold text-gray-800 mb-4">ADSUM QR</h1>
      <p class="text-gray-500 text-sm mb-6">Escaneja per marcar assistència</p>
      
      <div class="bg-slate-50 p-6 rounded-3xl mb-8 flex flex-col items-center justify-center border border-slate-100 shadow-inner">
        <qrcode-vue :value="qrValue" :size="200" level="H" render-as="svg" />
        <div class="mt-4 w-full">
          <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Token de verificació</p>
          <code class="text-[10px] font-mono text-indigo-600 font-bold break-all bg-white py-2 px-3 rounded-xl border border-slate-100 block shadow-sm select-all">{{ qrValue }}</code>
          <p class="text-[9px] text-slate-300 mt-2">Fes doble clic per seleccionar-ho tot</p>
        </div>
      </div>
      
      <div class="w-full bg-gray-200 rounded-full h-3 mb-2 overflow-hidden">
        <div 
          class="bg-indigo-600 h-full transition-all duration-100 ease-linear"
          :style="{ width: (timeLeft / 5) * 100 + '%' }"
        ></div>
      </div>

      <p class="text-xs font-bold text-slate-400 uppercase tracking-widest">
        S'actualitza en {{ Math.ceil(timeLeft) }}s
      </p>

      <div class="mt-8 pt-6 border-t border-gray-100">
        <p :class="status.includes('Connectat') ? 'text-green-500' : 'text-red-500'" class="text-xs font-mono font-bold">
          ● {{ status }}
        </p>
      </div>

    </div>

    <QrScanner v-else />
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { io } from 'socket.io-client';
import QrcodeVue from 'qrcode.vue';
import QrScanner from './components/QrScanner.vue';

const mode = ref('display');
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
    status.value = 'Connectat al Backend';
    console.log('Conectat amb ID:', socket.id);
  });

  socket.on('disconnect', () => {
    status.value = 'Desconnectat';
    qrValue.value = 'error';
    if (timer) clearInterval(timer);
  });

  socket.on('new_qr', (data) => {
    console.log('Nou QR rebut!', data.token);
    qrValue.value = data.token;
    startCountdown();
  });
});
</script>

<style scoped>
</style>
