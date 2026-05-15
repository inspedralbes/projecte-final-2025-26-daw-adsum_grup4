<template>
  <div class="space-y-8 animate-fade-in">
    <!-- CAPÇALERA -->
    <div class="hero-academic shadow-xl shadow-blue-100 flex flex-col md:flex-row justify-between items-center gap-6">
      <div>
        <div class="flex items-center gap-3 mb-4">
          <span class="badge-estat bg-white/20 text-white backdrop-blur-md">Gestió d'Absències</span>
          <span class="badge-estat bg-emerald-500/80 text-white">Oficial</span>
        </div>
        <h2 class="text-3xl md:text-4xl font-black tracking-tight uppercase italic leading-none">Justificació de Faltes</h2>
        <p class="text-blue-100 font-medium mt-2 max-w-sm uppercase text-[10px] tracking-widest font-bold">Envia els teus comprovants mèdics o personals per regularitzar l'assistència.</p>
      </div>
      
      <div class="bg-white p-6 rounded-2xl border border-blue-200 shadow-xl flex items-center gap-6 min-w-[200px]">
        <div>
          <p class="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-1">Faltes Pendents</p>
          <div class="flex items-center gap-2">
             <div class="w-2 h-2 bg-rose-500 rounded-full animate-pulse"></div>
             <p class="text-[10px] font-bold text-slate-500 uppercase tracking-tighter">Revisió Necessària</p>
          </div>
        </div>
        <p class="text-5xl font-black text-rose-600 tracking-tighter leading-none italic">{{ pendingJustificationsCount }}</p>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <!-- FORMULARI DE PUJADA -->
      <div class="lg:col-span-1 space-y-6">
        <div class="targeta-campus">
          <h3 class="font-black text-slate-900 uppercase tracking-widest text-[10px] mb-6 flex items-center gap-2">
            <div class="w-1 h-3 bg-blue-600 rounded-full"></div>
            Nova Justificació
          </h3>
          
          <form @submit.prevent="submitJustification" class="space-y-4">
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Data Inici</label>
                <input type="date" v-model="form.dataInici" class="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-bold focus:outline-none focus:border-blue-400" />
              </div>
              <div>
                <label class="block text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Data Fi</label>
                <input type="date" v-model="form.dataFi" class="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-bold focus:outline-none focus:border-blue-400" />
              </div>
            </div>

            <div>
              <label class="block text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Motiu de l'Absència</label>
              <textarea v-model="form.reason" rows="3" class="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-bold focus:outline-none focus:border-blue-400" placeholder="Explica breument el motiu..."></textarea>
            </div>

            <div>
              <label class="block text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Comprovant (PDF o Imatge)</label>
              <div class="relative group cursor-pointer">
                <input type="file" @change="handleFile" class="absolute inset-0 opacity-0 cursor-pointer z-10" />
                <div class="border-2 border-dashed border-slate-200 rounded-2xl p-6 flex flex-col items-center gap-2 group-hover:border-blue-300 group-hover:bg-blue-50/30 transition-all">
                  <AppIcon name="upload" class="w-6 h-6 text-slate-300 group-hover:text-blue-500" />
                  <span class="text-[9px] font-black text-slate-400 uppercase tracking-widest">{{ fileName || 'Clica per seleccionar fitxer' }}</span>
                </div>
              </div>
            </div>

            <button type="submit" class="boto-academic w-full h-12" :disabled="isSubmitting">
              {{ isSubmitting ? 'Enviant...' : 'Enviar Justificació' }}
            </button>
          </form>
        </div>
      </div>

      <!-- HISTÒRIC DE JUSTIFICACIONS -->
      <div class="lg:col-span-2 targeta-campus">
        <h3 class="font-black text-slate-900 uppercase tracking-widest text-[10px] mb-8 flex items-center gap-2">
          <div class="w-1 h-3 bg-emerald-500 rounded-full"></div>
          Històric de Tràmits
        </h3>

        <div class="space-y-3">
          <div v-for="j in justifications" :key="j.id" class="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-transparent hover:border-blue-100 hover:bg-white transition-all group">
            <div class="flex items-center gap-4">
              <div class="w-10 h-10 rounded-xl bg-white border border-slate-100 flex items-center justify-center text-slate-400 shadow-sm">
                <AppIcon :name="j.estat === 'validada' ? 'check' : j.estat === 'rebutjada' ? 'x' : 'clock'" class="w-5 h-5" :class="getStatusColor(j.estat)" />
              </div>
              <div>
                <p class="text-sm font-bold text-slate-700 group-hover:text-blue-700 transition-colors">{{ j.motiu }}</p>
                <div class="flex items-center gap-2 mt-0.5">
                  <span class="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{{ new Date(j.dataInici).toLocaleDateString() }}</span>
                  <span v-if="j.dataInici !== j.dataFi" class="text-[9px] font-bold text-slate-400 uppercase tracking-widest"> - {{ new Date(j.dataFi).toLocaleDateString() }}</span>
                  <span class="w-1 h-1 bg-slate-200 rounded-full"></span>
                  <span class="text-[9px] font-black uppercase tracking-widest" :class="getStatusColor(j.estat)">{{ j.estat }}</span>
                </div>
              </div>
            </div>
            
            <a v-if="j.arxiuUrl" :href="`${API_BASE_URL}/uploads/justificacions/${j.arxiuUrl}`" target="_blank" class="w-8 h-8 rounded-lg bg-white border border-slate-100 flex items-center justify-center text-slate-400 hover:text-blue-600 hover:border-blue-200 transition-all">
              <AppIcon name="eye" class="w-4 h-4" />
            </a>
          </div>

          <div v-if="justifications.length === 0" class="py-24 text-center">
             <div class="w-16 h-16 bg-slate-50 rounded-[2rem] flex items-center justify-center text-slate-200 mx-auto mb-4">
               <AppIcon name="folder" class="w-8 h-8" />
             </div>
             <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest">No hi ha tràmits registrats</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import AppIcon from '../components/shared/AppIcon.vue';
import { API_BASE_URL } from '@/config/api';

const props = defineProps({
  user: { type: Object, required: true }
});

const isSubmitting = ref(false);
const fileName = ref('');
const pendingJustificationsCount = ref(0);
const justifications = ref([]);

const form = reactive({
  modul: '',
  reason: '',
  file: null,
  dataInici: new Date().toISOString().split('T')[0],
  dataFi: new Date().toISOString().split('T')[0]
});

// En una app real, els mòduls vindrien de la BD
const moduls = ref([
  { id: 1, nom: 'Programació Multimèdia' },
  { id: 2, nom: 'Sistemes de Gestió Empresarial' },
  { id: 3, nom: 'Desenvolupament d\'Interfícies' }
]);

const carregarJustificacions = async () => {
  try {
    const token = localStorage.getItem('access_token');
    const res = await fetch(`${API_BASE_URL}/justificacions/meves`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (res.ok) {
      justifications.value = await res.json();
      pendingJustificationsCount.value = justifications.value.filter(j => j.estat === 'pendent').length;
    }
  } catch (err) {
    console.error('Error carregant justificacions:', err);
  }
};

onMounted(() => {
  carregarJustificacions();
});

const handleFile = (e) => {
  const file = e.target.files[0];
  if (file) {
    fileName.value = file.name;
    form.file = file;
  }
};

const submitJustification = async () => {
  if (!form.reason || !form.dataInici) return;
  isSubmitting.value = true;
  
  try {
    const token = localStorage.getItem('access_token');
    const formData = new FormData();
    formData.append('motiu', form.reason);
    formData.append('dataInici', form.dataInici);
    formData.append('dataFi', form.dataFi);
    if (form.file) {
      formData.append('file', form.file);
    }

    const res = await fetch(`${API_BASE_URL}/justificacions/pujar`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}` },
      body: formData
    });

    if (res.ok) {
      await carregarJustificacions();
      // Reset form
      form.reason = '';
      form.file = null;
      fileName.value = '';
    }
  } catch (err) {
    console.error('Error enviant justificació:', err);
  } finally {
    isSubmitting.value = false;
  }
};

const getStatusColor = (status) => {
  if (status === 'validada') return 'text-emerald-500';
  if (status === 'rebutjada') return 'text-rose-500';
  return 'text-amber-500';
};
</script>
