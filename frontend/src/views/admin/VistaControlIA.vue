<template>
  <div class="animate-fade-in space-y-6 max-w-4xl mx-auto">
    <header>
      <div class="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-purple-50 mb-3">
        <span class="text-2xl">✨</span>
      </div>
      <h2 class="text-2xl font-black text-slate-800 tracking-tight italic uppercase">Governança d'Intel·ligència Artificial</h2>
      <p class="text-slate-500 text-sm mt-1">Configuració i limitació del model Gemini API per als assistents de la plataforma</p>
    </header>

    <div v-if="loading" class="flex justify-center p-12">
      <div class="w-8 h-8 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin"></div>
    </div>

    <div v-else class="space-y-6">
      
      <!-- Telemetria API -->
      <div class="grid grid-cols-2 gap-4">
        <div class="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
          <div class="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Estat de la Integració</div>
          <div class="flex items-center gap-2">
            <div class="w-3 h-3 rounded-full" :class="config.estat === 'actiu' ? 'bg-emerald-500' : 'bg-red-500'"></div>
            <span class="text-lg font-black text-slate-800 uppercase">{{ config.estat }}</span>
          </div>
        </div>
        <div class="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
          <div class="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Ús Diari (Peticions)</div>
          <div class="flex items-end gap-2">
            <span class="text-3xl font-black text-slate-800 leading-none">{{ config.peticionsDiaries }}</span>
            <span class="text-sm font-bold text-slate-400 mb-1">/ {{ config.limitDiari }} limit</span>
          </div>
          <div class="w-full bg-slate-100 rounded-full h-1.5 mt-3 overflow-hidden">
            <div class="bg-purple-500 h-1.5 rounded-full" :style="{ width: `${(config.peticionsDiaries / config.limitDiari) * 100}%` }"></div>
          </div>
        </div>
      </div>

      <!-- Editor de Comportament IA -->
      <div class="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
        <h3 class="font-bold text-slate-800 mb-4">Paràmetres de Personalitat (System Prompt)</h3>
        
        <textarea 
          v-model="promptActual" 
          rows="5"
          class="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 text-sm font-mono text-slate-700 outline-none focus:border-purple-400 focus:ring-4 focus:ring-purple-50 transition-all resize-none"
          placeholder="Escriu instruccions per al comportament general de la IA..."
        ></textarea>
        
        <div class="mt-4 flex justify-end">
          <button @click="guardarPrompt" :disabled="guardant" class="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2.5 rounded-xl font-bold text-sm transition-colors shadow-sm shadow-purple-200 disabled:opacity-50">
            {{ guardant ? 'Guardant...' : 'Actualitzar Comportament' }}
          </button>
        </div>
        
        <Transition name="fade">
          <p v-if="missatgeGuardat" class="text-emerald-500 text-xs font-bold mt-2 text-right">{{ missatgeGuardat }}</p>
        </Transition>
      </div>

      <!-- Zona de Perill -->
      <div class="bg-red-50 border border-red-100 rounded-2xl p-6">
        <h3 class="font-bold text-red-800">Botó de Pànic (Kill Switch)</h3>
        <p class="text-sm text-red-600 mt-1 mb-4">Si sorgeix un abús de consum d'API (Billing) o respostes indegudes massives, atureu la intel·ligència als dispositius dels alumnes immediatament.</p>
        <button class="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-xl font-bold text-sm transition-colors shadow-sm shadow-red-200">
          Deshabilitar connexió amb Gemini temporalment
        </button>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const config = ref(null);
const loading = ref(true);
const promptActual = ref('');
const guardant = ref(false);
const missatgeGuardat = ref('');

const carregarDades = async () => {
  try {
    const res = await fetch('/api/admin/ia/config', {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('access_token')}` }
    });
    if(res.ok) {
      config.value = await res.json();
      promptActual.value = config.value.promptSistema;
    }
  } finally {
    loading.value = false;
  }
};

const guardarPrompt = async () => {
  guardant.value = true;
  try {
    const res = await fetch('/api/admin/ia/config', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('access_token')}`
      },
      body: JSON.stringify({ prompt: promptActual.value })
    });
    if(res.ok) {
      missatgeGuardat.value = 'Configuració actualitzada amb èxit a tots els nodes!';
      setTimeout(() => missatgeGuardat.value = '', 3000);
    }
  } catch(e) {
    alert("Error de connexió");
  } finally {
    guardant.value = false;
  }
};

onMounted(() => carregarDades());
</script>
