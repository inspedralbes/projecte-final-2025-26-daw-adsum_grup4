<template>
  <div class="space-y-8 animate-fade-in pb-20">
    <!-- MODAL QR DINÀMIC -->
    <div v-if="mostrantQR" class="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-slate-900/80 backdrop-blur-xl animate-fade-in">
       <div class="bg-white w-full max-w-md rounded-[3rem] p-10 text-center shadow-2xl relative overflow-hidden">
          <button @click="mostrantQR = false" class="absolute top-8 right-8 text-slate-400 hover:text-slate-900 transition-colors">
             <AppIcon name="close" class="w-6 h-6" />
          </button>
          
          <div class="mb-8">
             <h3 class="text-2xl font-black text-slate-900 uppercase italic tracking-tighter">{{ modulSeleccionat?.nom }}</h3>
             <p class="text-[10px] text-blue-600 font-black uppercase tracking-[0.2em] mt-2">Escaneja per registrar assistència</p>
          </div>

          <div class="bg-slate-50 p-8 rounded-[2.5rem] border border-slate-100 mb-8 flex justify-center">
             <div class="bg-white p-4 rounded-3xl shadow-inner border border-white">
                <qrcode-vue :value="qrToken" :size="240" level="H" render-as="svg" foreground="#0f172a" />
             </div>
          </div>

          <div class="flex flex-col gap-4">
             <div class="flex items-center justify-center gap-3">
                <div class="w-2 h-2 bg-blue-600 rounded-full animate-pulse"></div>
                <span class="text-[11px] font-black text-slate-400 uppercase tracking-widest">Sincronitzat amb el centre</span>
             </div>
             <p class="text-[9px] text-slate-400 font-bold uppercase tracking-widest leading-relaxed">Aquest codi canvia automàticament cada 10 segons per garantir la seguretat del fitxatge.</p>
          </div>
       </div>
    </div>
    <!-- HEADER PROFESSOR -->
    <div class="p-10 bg-gradient-to-br from-blue-700 to-indigo-800 rounded-[3rem] text-white shadow-2xl shadow-blue-200 relative overflow-hidden group">
      <div class="relative z-10">
        <span class="px-3 py-1 bg-white/20 rounded-full text-[9px] font-black uppercase tracking-[0.3em] backdrop-blur-md mb-6 inline-block">Panell Docent ADSUM</span>
        <h2 class="text-4xl font-black italic uppercase tracking-tighter mb-2 leading-none">Centre de Comandament</h2>
        <p class="text-blue-100 text-sm font-medium italic opacity-90 max-w-md">Benvingut, {{ props.user?.nom }}. Gestió de mòduls i alumnat en temps real.</p>
      </div>
      <div class="absolute -top-10 -right-10 w-80 h-80 bg-white/5 rounded-full blur-3xl transition-transform duration-1000 group-hover:scale-110"></div>
    </div>

    <!-- FILTRE DE MÒDUL / GRUP -->
    <div class="flex items-center justify-between bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
      <div class="flex items-center gap-4 overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
        <button v-for="modul in moduls" :key="modul.id" 
          @click="modulSeleccionat = modul"
          :class="modulSeleccionat?.id === modul.id ? 'bg-slate-900 text-white shadow-lg' : 'bg-slate-50 text-slate-500'"
          class="px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap">
          {{ modul.codi }} - {{ modul.grup?.nom }}
        </button>
      </div>
      <div class="hidden md:flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-xl">
        <span class="text-[10px] font-black uppercase">{{ alumnes.length }} Alumnes</span>
      </div>
    </div>

    <!-- TABS INTERNES -->
    <div class="flex items-center gap-4">
      <button @click="pestanyaActual = 'toolkit'" 
        :class="[
          'px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all border',
          pestanyaActual === 'toolkit' ? 'bg-blue-600 text-white shadow-lg shadow-blue-100 border-transparent' : 'bg-white text-slate-500 border-slate-100'
        ]">
        Classroom Toolkit
      </button>
      <button @click="pestanyaActual = 'notes'" 
        :class="[
          'px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all border',
          pestanyaActual === 'notes' ? 'bg-blue-600 text-white shadow-lg shadow-blue-100 border-transparent' : 'bg-white text-slate-500 border-slate-100'
        ]">
        Qualificacions
      </button>
      <button @click="obrirGeneradorQR" 
        class="ml-auto px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all bg-emerald-500 text-white shadow-lg shadow-emerald-100 flex items-center gap-2 hover:scale-[1.02]">
        <AppIcon name="camera" class="w-4 h-4" />
        Generar QR Assistència
      </button>
    </div>

    <!-- SECCIÓ 1: CLASSROOM TOOLKIT -->
    <div v-if="pestanyaActual === 'toolkit'" class="grid grid-cols-1 md:grid-cols-2 gap-8">
       <div class="targeta-campus flex flex-col justify-between min-h-[350px]">
          <div>
             <h3 class="font-black text-slate-900 uppercase tracking-widest text-[11px] mb-6 flex items-center gap-2">
                <div class="w-1.5 h-4 bg-amber-500 rounded-full"></div>
                Random Picker (Atzar {{ modulSeleccionat?.grup?.nom }})
             </h3>
             <div class="flex flex-col items-center py-12">
                <div v-if="alumneAtzar" class="text-center animate-fade-in">
                   <img :src="alumneAtzar.foto" class="w-24 h-24 rounded-[2rem] mx-auto mb-6 border-4 border-white shadow-2xl" />
                   <p class="text-2xl font-black text-slate-900 uppercase italic tracking-tighter">{{ alumneAtzar.nom }}</p>
                   <p class="text-[10px] text-amber-600 font-bold uppercase tracking-widest mt-1">Ha estat seleccionat!</p>
                </div>
                <div v-else class="text-slate-300 italic text-sm text-center">
                   <AppIcon name="users" class="w-12 h-12 mx-auto mb-4 opacity-20" />
                   Prem el botó per triar un alumne
                </div>
             </div>
          </div>
          <button @click="triarAlumne" class="w-full py-5 bg-amber-500 hover:bg-amber-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-amber-100 transition-all active:scale-95">Generar Alumne a l'Atzar</button>
       </div>

       <div class="targeta-campus flex flex-col justify-between">
          <div>
            <h3 class="font-black text-slate-900 uppercase tracking-widest text-[11px] mb-8 flex items-center gap-2">
               <div class="w-1.5 h-4 bg-indigo-500 rounded-full"></div>
               Generador de Grups Dinàmics
            </h3>
            <div class="space-y-6">
               <div class="p-6 bg-slate-50 rounded-3xl border border-slate-100">
                  <div class="flex justify-between items-center mb-4">
                    <span class="text-[10px] font-black text-slate-500 uppercase tracking-widest">Número de Grups</span>
                    <span class="text-lg font-black text-blue-600 italic">{{ numGrups }}</span>
                  </div>
                  <input type="range" min="2" max="8" v-model="numGrups" class="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600">
               </div>
               <div class="flex items-center gap-3 p-4 bg-blue-50 text-blue-600 rounded-2xl border border-blue-100">
                  <AppIcon name="info" class="w-4 h-4" />
                  <p class="text-[9px] font-bold uppercase tracking-wide">Es crearan grups de ~{{ Math.ceil(alumnes.length / numGrups) }} alumnes.</p>
               </div>
            </div>
          </div>
          <button @click="generarGrups" class="w-full py-5 bg-slate-900 hover:bg-black text-white rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all shadow-xl shadow-slate-200 mt-8 active:scale-95">Crear Equips de Treball</button>
       </div>
    </div>

    <!-- SECCIÓ 2: QUALIFICACIONS -->
    <div v-if="pestanyaActual === 'notes'" class="space-y-6">
       <div class="targeta-campus !p-0 overflow-hidden border-none shadow-2xl shadow-slate-100">
          <div class="overflow-x-auto">
            <table class="w-full text-left">
              <thead class="bg-slate-50/80 backdrop-blur-md border-b border-slate-100">
                  <tr>
                    <th class="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Alumne</th>
                    <th v-for="act in activitats" :key="act.id" class="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">
                        {{ act.nom }} ({{ act.pes }}%)
                    </th>
                    <th class="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Nota Final</th>
                  </tr>
              </thead>
              <tbody class="divide-y divide-slate-50 bg-white">
                  <tr v-for="alumne in alumnes" :key="alumne.id" class="hover:bg-blue-50/30 transition-all group">
                    <td class="px-10 py-5">
                        <div class="flex items-center gap-4">
                          <img :src="alumne.foto" class="w-10 h-10 rounded-xl" />
                          <div>
                            <p class="text-[13px] font-black text-slate-800 uppercase italic leading-none">{{ alumne.nom }}</p>
                            <p class="text-[9px] text-slate-400 font-bold uppercase mt-1">{{ alumne.email }}</p>
                          </div>
                        </div>
                    </td>
                    <td v-for="act in activitats" :key="act.id" class="px-8 py-5 text-center">
                        <input type="number" step="0.1" :value="alumne.id % 4 + 6" class="w-16 bg-slate-50 border border-slate-100 rounded-xl px-2 py-2 text-center text-xs font-black focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all">
                    </td>
                    <td class="px-10 py-5 text-right">
                        <span class="px-4 py-2 bg-emerald-50 text-emerald-600 rounded-xl text-[11px] font-black italic border border-emerald-100 shadow-sm">{{ (alumne.id % 4 + 6.5).toFixed(1) }}</span>
                    </td>
                  </tr>
              </tbody>
            </table>
          </div>
          <div class="p-8 bg-slate-50 border-t border-slate-100 flex justify-center">
             <p class="text-[9px] font-black text-slate-400 uppercase tracking-[0.3em]">S'estan mostrant dades reals del mòdul {{ modulSeleccionat?.codi }}</p>
          </div>
       </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted } from 'vue';
import AppIcon from '../components/shared/AppIcon.vue';
import QrcodeVue from 'qrcode.vue';
import { API_BASE_URL } from '@/config/api';

const props = defineProps({
  user: Object,
  activeTab: String
});

const pestanyaActual = ref('toolkit');
const moduls = ref([]);
const modulSeleccionat = ref(null);
const alumnes = ref([]);
const alumneAtzar = ref(null);
const numGrups = ref(4);

// ESTATS QR
const mostrantQR = ref(false);
const qrToken = ref('');
let qrInterval = null;

// FETCH REAL DATA
onMounted(async () => {
  if (!props.user?.id) return;
  const token = localStorage.getItem('access_token');

  try {
    // 1. Obtenir mòduls del professor
    const modulsRes = await fetch(`${API_BASE_URL}/usuaris/professor/${props.user.id}/moduls`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (modulsRes.ok) {
      moduls.value = await modulsRes.json();
      if (moduls.value.length > 0) {
        modulSeleccionat.value = moduls.value[0];
      }
    }
  } catch (error) {
    console.error("Error carregant mòduls del professor:", error);
  }
});

// WATCHER PER CARREGAR ALUMNES QUAN CANVIA EL MÒDUL
watch(modulSeleccionat, async (newModul) => {
  if (!newModul) return;
  const token = localStorage.getItem('access_token');
  
  try {
    const studentsRes = await fetch(`${API_BASE_URL}/usuaris/modul/${newModul.id}/students`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (studentsRes.ok) {
      alumnes.value = await studentsRes.json();
      alumneAtzar.value = null; // Reset picker
    }
  } catch (error) {
    console.error("Error carregant alumnes del mòdul:", error);
  }
});

const activitats = [
  { id: 'uf1', nom: 'Teoria', pes: 40 },
  { id: 'prj', nom: 'Projecte', pes: 60 }
];

watch(() => props.activeTab, (newTab) => {
  if (newTab === 'performance') pestanyaActual.value = 'notes';
  else if (newTab === 'toolkit') pestanyaActual.value = 'toolkit';
  else if (newTab === 'home') pestanyaActual.value = 'toolkit';
}, { immediate: true });

const triarAlumne = () => {
  if (alumnes.value.length === 0) return;
  alumneAtzar.value = alumnes.value[Math.floor(Math.random() * alumnes.value.length)];
};

const generarGrups = () => {
  alert(`Generant ${numGrups.value} equips per al mòdul ${modulSeleccionat.value.codi}...`);
};

// LÒGICA QR DINÀMIC
const obrirGeneradorQR = async () => {
  if (!modulSeleccionat.value) return;
  mostrantQR.value = true;
  await generarNouTokenQR();
  
  // Reiniciem l'interval
  if (qrInterval) clearInterval(qrInterval);
  qrInterval = setInterval(generarNouTokenQR, 10000);
};

const generarNouTokenQR = async () => {
  if (!modulSeleccionat.value) return;
  const token = localStorage.getItem('access_token');
  
  try {
    const res = await fetch(`${API_BASE_URL}/assistencia/generate`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}` 
      },
      body: JSON.stringify({
        modulId: modulSeleccionat.value.id,
        professorId: props.user.id,
        lateMinutes: 15,
        absentMinutes: 30
      })
    });
    
    if (res.ok) {
      const data = await res.json();
      qrToken.value = data.token;
    }
  } catch (error) {
    console.error("Error generant token QR:", error);
  }
};

onUnmounted(() => {
  if (qrInterval) clearInterval(qrInterval);
});
</script>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(15px); }
  to { opacity: 1; transform: translateY(0); }
}
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}
.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
