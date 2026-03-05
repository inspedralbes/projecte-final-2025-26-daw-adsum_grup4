<template>
  <div class="animate-fade-in space-y-6">
    <header class="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <h2 class="text-2xl font-black text-slate-800 tracking-tight italic uppercase">Infraestructura IoT</h2>
        <p class="text-slate-500 text-sm mt-1">Estat dels lectors QR de les aules en temps real</p>
      </div>
      <button @click="carregarDadesGlobals" class="bg-indigo-50 hover:bg-indigo-100 text-indigo-700 px-4 py-2 rounded-xl font-bold text-sm transition-colors self-start flex items-center gap-2">
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

    <div v-else class="space-y-8">
      <!-- Targetes de Lectors -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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

      <!-- Monitors d'Usuaris en temps real -->
      <div class="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div class="p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50">
          <h3 class="font-bold text-slate-800 flex items-center gap-2">
            <div class="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></div>
            Activitat d'Ús del Centre
          </h3>
          <span class="text-xs font-bold px-2 py-1 bg-white border border-slate-200 rounded-md text-slate-500">
            {{ usuarisActius.length }} Detectats ara
          </span>
        </div>
        <div class="overflow-x-auto">
          <table class="w-full text-left text-sm">
            <thead class="bg-white border-b border-slate-100 text-xs uppercase tracking-wider text-slate-400">
              <tr>
                <th class="p-4 font-bold">Usuari</th>
                <th class="p-4 font-bold">Rol</th>
                <th class="p-4 font-bold">Últim Lector</th>
                <th class="p-4 font-bold text-right">Data Registre</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-50">
              <tr v-for="usu in usuarisActius" :key="usu.id" class="hover:bg-slate-50 transition-colors">
                <td class="p-4 font-medium text-slate-800">
                  {{ usu.nom }} {{ usu.cognoms }}
                </td>
                <td class="p-4">
                  <span class="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-widest"
                    :class="usu.rol === 'alumne' ? 'bg-blue-50 text-blue-600' : 'bg-emerald-50 text-emerald-600'">
                    {{ usu.rol }}
                  </span>
                </td>
                <td class="p-4 text-slate-600">
                  <div class="flex items-center gap-1.5">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    {{ usu.ubicacio }}
                  </div>
                </td>
                <td class="p-4 text-right text-slate-500 font-mono text-xs">
                  {{ new Date(usu.horaEntrada).toLocaleTimeString() }}
                </td>
              </tr>
              <tr v-if="usuarisActius.length === 0">
                <td colspan="4" class="p-8 justify-center text-center text-slate-400 font-medium text-sm">
                  Cap registre recent d'entrada.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';

const lectors = ref([]);
const usuarisActius = ref([]);
const loading = ref(true);
const error = ref(null);
let pollInterval = null;

const carregarDadesGlobals = async () => {
  try {
    error.value = null;
    const authHeaders = { 'Authorization': `Bearer ${localStorage.getItem('access_token')}` };
    
    // Fem les dues trucades en paral·lel
    const [resLectors, resUsuaris] = await Promise.all([
      fetch('/api/admin/infra/lectors', { headers: authHeaders }),
      fetch('/api/admin/infra/usuaris-actius', { headers: authHeaders })
    ]);

    if (!resLectors.ok || !resUsuaris.ok) { if (resLectors.status === 401 || resUsuaris.status === 401) { localStorage.removeItem('access_token'); window.location.href = '/login'; } throw new Error('Fallada al carregar la telemetria'); }
    
    lectors.value = await resLectors.json();
    usuarisActius.value = await resUsuaris.json();
  } catch(err) {
    error.value = err.message;
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  carregarDadesGlobals();
  // Pollejarem en background cada 5 segons sense disparar el loading global
  pollInterval = setInterval(carregarDadesGlobals, 5000);
});

onUnmounted(() => {
  clearInterval(pollInterval);
});
</script>
