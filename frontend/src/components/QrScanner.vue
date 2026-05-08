<template>
  <div class="flex flex-col items-center p-6 bg-gray-50 rounded-xl">
    <h2 class="text-2xl font-bold text-gray-800 mb-4">Escàner de Porta</h2>
    
    <div id="reader" class="mb-4 rounded-lg overflow-hidden border-2 border-gray-300"></div>
    
    <div class="text-center space-y-2">
      <p class="text-sm text-gray-600">Estat: <span :class="statusColor">{{ status }}</span></p>
      <p v-if="responseTime" class="text-sm text-gray-600">Temps de resposta: <span :class="timeColor">{{ responseTime }}ms</span></p>
      <p v-if="lastResult" class="text-xs text-gray-500 font-mono break-all">Token: {{ lastResult }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { Html5Qrcode } from 'html5-qrcode';

const status = ref('Iniciant...');
const responseTime = ref(null);
const lastResult = ref(null);
let scanner = null;

const statusColor = computed(() => {
  if (status.value.includes('✓')) return 'text-green-600 font-bold';
  if (status.value.includes('✗')) return 'text-red-600 font-bold';
  return 'text-yellow-600';
});

const timeColor = computed(() => {
  if (responseTime.value === null) return 'text-gray-600';
  return responseTime.value < 200 ? 'text-green-600 font-bold' : 'text-red-600 font-bold';
});

const validateToken = async (token) => {
  const startTime = performance.now();
  
  try {
    const res = await fetch('http://localhost:3000/attendance/validate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token }),
    });
    
    const endTime = performance.now();
    responseTime.value = Math.round(endTime - startTime);
    
    if (res.ok) {
      status.value = '✓ Accés permès (' + responseTime.value + 'ms)';
      lastResult.value = token;
    } else {
      const data = await res.json();
      status.value = '✗ ' + (data.message || 'Accés denegat');
    }
  } catch (err) {
    status.value = '✗ Error de connexió';
    responseTime.value = null;
  }
};

onMounted(async () => {
  try {
    scanner = new Html5Qrcode('reader');
    await scanner.start(
      { facingMode: 'environment' },
      { fps: 10, qrbox: { width: 250, height: 250 } },
      (decodedText) => {
        status.value = 'Validant...';
        validateToken(decodedText);
      },
      () => {}
    );
    status.value = 'Escanejant...';
  } catch (err) {
    status.value = 'Error: ' + err.message;
  }
});

onUnmounted(() => {
  if (scanner) {
    scanner.stop().catch(() => {});
  }
});
</script>