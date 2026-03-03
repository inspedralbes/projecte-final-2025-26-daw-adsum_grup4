<template>
  <div class="animate-fade-in space-y-6">
    <header class="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <h2 class="text-2xl font-black text-slate-800 tracking-tight italic uppercase">Infraestructura IoT</h2>
        <p class="text-slate-500 text-sm mt-1">Estat dels lectors QR de les aules en temps real</p>
      </div>
      <button @click="carregarLectors" class="bg-indigo-50 hover:bg-indigo-100 text-indigo-700 px-4 py-2 rounded-xl font-bold text-sm transition-colors self-start flex items-center gap-2">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-4 h-4" :class="{'animate-spin': loading}">
          <path stroke-linecap="round" stroke-linejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
        </svg>
        Refrescar Estat
      </button>
    </header>

    <div v-if="loading" class="flex justify-center p-12">
      <div class="w-8 h-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
    </div>

    <div v-else-if="error" class="bg-red-50 text-red-600 p-4 rounded-xl text-sm font-medium">
      {{ error }}
    </div>

    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <div v-for="lector in lectors" :key="lector.id" class="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 flex flex-col gap-4 relative overflow-hidden transition-all hover:border-slate-300">
        <div class="absolute top-0 right-0 w-2 h-full" :class="lector.estat === 'online' ? 'bg-emerald-500' : 'bg-red-500'"></div>
        
        <div>
          <h3 class="font-bold text-slate-800">{{ lector.aula }}</h3>
          <p class="text-xs text-slate-400 font-mono mt-1">ID: LECTOR-{{ lector.id.toString().padStart(3, '0') }}</p>
        </div>

        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2">
            <span class="flex h-3 w-3 relative">
              <span class="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75" :class="lector.estat === 'online' ? 'bg-emerald-400' : 'bg-red-400'"></span>
              <span class="relative inline-flex rounded-full h-3 w-3" :class="lector.estat === 'online' ? 'bg-emerald-500' : 'bg-red-500'"></span>
            </span>
            <span class="text-xs font-bold uppercase tracking-widest text-slate-600">
              {{ lector.estat === 'online' ? 'En Línia' : 'Fora de Servei' }}
            </span>
          </div>

          <div class="flex items-center gap-1.5 bg-slate-50 px-2 py-1 rounded-md">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" :class="lector.bateria === '100%' ? 'text-emerald-500' : lector.bateria === '0%' ? 'text-red-500' : 'text-slate-500'" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            <span class="text-xs font-bold">{{ lector.bateria }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const lectors = ref([]);
const loading = ref(true);
const error = ref(null);

const carregarLectors = async () => {
  try {
    loading.value = true;
    error.value = null;
    const res = await fetch('/api/admin/infra/lectors', {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('access_token')}` }
    });
    if (!res.ok) throw new Error('Error al connectar amb els dispositius IoT');
    lectors.value = await res.json();
  } catch(err) {
    error.value = err.message;
  } finally {
    loading.value = false;
  }
};

onMounted(() => carregarLectors());
</script>
