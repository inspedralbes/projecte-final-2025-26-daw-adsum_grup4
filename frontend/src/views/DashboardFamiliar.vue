<template>
  <div class="space-y-6">
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-2">
      <div>
        <h2 class="text-2xl font-black text-slate-800 tracking-tight uppercase italic">Portal de Famílies</h2>
        <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Benvingut/da, {{ familiar.nom }}</p>
      </div>
      
      <div class="flex bg-slate-100/50 p-1 rounded-2xl border border-slate-100">
        <button 
          v-for="tab in tabs" :key="tab.id"
          @click="activeTab = tab.id"
          class="px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all"
          :class="activeTab === tab.id ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'"
        >
          {{ tab.name }}
        </button>
      </div>
    </div>

    <!-- TAB 1: RESUM -->
    <div v-if="activeTab === 'resum'" class="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in duration-300">
      <div v-if="fills.length === 0" class="col-span-full py-12 text-center text-slate-500">
        No tens cap alumne vinculat al teu compte.
      </div>
      <div v-for="fill in fills" :key="fill.id" class="bg-white rounded-[2.5rem] p-6 border border-slate-100 shadow-sm flex flex-col items-center">
        <div class="w-20 h-20 bg-indigo-50 rounded-full mb-4 flex items-center justify-center text-2xl font-black text-indigo-400">
          {{ fill.nom[0] }}{{ fill.cognoms[0] }}
        </div>
        <h3 class="font-black text-slate-800 uppercase text-lg">{{ fill.nom }} {{ fill.cognoms }}</h3>
        <p class="text-xs text-slate-400 font-bold mb-4">{{ fill.grup?.nom || 'Sense Grup' }}</p>
        <button @click="justificarFalta(fill)" class="mt-auto px-4 py-2 bg-indigo-50 text-indigo-600 rounded-xl font-bold text-sm hover:bg-indigo-100 w-full transition-colors">
          Justificar Falta
        </button>
      </div>
    </div>

    <!-- TAB 2: MISSATGES -->
    <div v-if="activeTab === 'missatges'" class="bg-white rounded-[2.5rem] p-6 border border-slate-100 shadow-sm animate-in fade-in duration-300">
      <h3 class="font-black text-slate-800 uppercase tracking-widest text-xs mb-6">Safata d'entrada</h3>
      
      <div v-if="carregantMissatges" class="text-center py-8 text-slate-400">
        Carregant missatges...
      </div>
      
      <div v-else-if="missatges.length === 0" class="text-center py-12 text-slate-400 bg-slate-50 rounded-2xl border border-slate-100">
        No tens cap missatge nou.
      </div>

      <div v-else class="space-y-4">
        <div v-for="msg in missatges" :key="msg.id" 
             class="p-4 rounded-2xl border transition-colors"
             :class="!msg.llegit ? 'bg-indigo-50/50 border-indigo-100' : 'bg-white border-slate-100 hover:bg-slate-50'">
          <div class="flex justify-between items-start mb-2">
            <div class="flex items-center gap-2">
              <div class="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold text-xs">
                PR
              </div>
              <div>
                <p class="text-sm font-bold text-slate-800">Professor ({{ msg.emissor?.nom }})</p>
                <p class="text-[9px] font-black text-slate-400 uppercase">{{ formatData(msg.dataEnviament) }}</p>
              </div>
            </div>
            <span v-if="!msg.llegit" class="px-2 py-1 bg-indigo-500 text-white text-[9px] font-black uppercase rounded-full">Nou</span>
          </div>
          <p class="text-sm text-slate-600 mt-3 whitespace-pre-wrap">{{ msg.contingut }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import MissatgeriaService from '../services/MissatgeriaService';
import { useAuthStore } from '../stores/auth'; // Simulat

const authStore = useAuthStore();
const familiar = ref(authStore.usuari || { id: 1, nom: 'Pare/Mare', cognoms: 'Proves' });

const activeTab = ref('resum');
const tabs = [
  { id: 'resum', name: 'Alumnes Vinculats' },
  { id: 'missatges', name: 'Missatges' }
];

const fills = ref([]);
const missatges = ref([]);
const carregantMissatges = ref(false);

const justificarFalta = (alumne) => {
  alert(`Funcionalitat en desenvolupament (Sprint 3): Justificant per a ${alumne.nom}`);
};

const formatData = (dataString) => {
  const d = new Date(dataString);
  return d.toLocaleDateString('ca-ES', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' });
};

const carregarDades = async () => {
  try {
    // Carregar fills
    fills.value = await MissatgeriaService.obtenirFillsDeFamiliar(familiar.value.id);
    
    // Per a la demo, agafem els missatges on el receptor és el familiar actiu i l'emissor és un profe aleatori.
    // Idealment l'API hauria de tenir un endpoint `GET /missatges/meus`
    carregantMissatges.value = true;
    
    // Fem una simulació d'una crida real si només tenim la conversa per parells:
    // Aquí estem forçant un ID de professor per provar (ex: id=2)
    const profeIdDemo = 2; 
    const msgs = await MissatgeriaService.obtenirConversa(profeIdDemo, familiar.value.id);
    
    // Filtrem només els que ha rebut el familiar per fer l'inbox simple
    missatges.value = msgs.filter(m => m.receptorId === familiar.value.id).reverse(); // Ordenar més recents primer
  } catch (error) {
    console.error('Error carregant dades:', error);
  } finally {
    carregantMissatges.value = false;
  }
};

onMounted(() => {
  carregarDades();
});
</script>
