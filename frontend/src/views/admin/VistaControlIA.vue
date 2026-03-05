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

      <!-- Assistent d'Administració (Chatbot) -->
      <div class="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col h-[500px]">
        <div class="p-4 border-b border-slate-100 flex items-center gap-3 bg-slate-50 relative">
          <div class="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-purple-500/10 to-transparent"></div>
          <div class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse relative z-10"></div>
          <h3 class="font-bold text-slate-800 relative z-10">Assistent Escolar ADSUM</h3>
          <span class="text-[10px] font-black uppercase tracking-widest text-purple-600 bg-purple-100 px-2 py-0.5 rounded ml-auto relative z-10">Gemini</span>
        </div>
        
        <div class="flex-1 p-6 overflow-y-auto bg-slate-50/50 space-y-4" ref="chatContainerElement">
          <!-- Text Predit en Buit -->
          <div v-if="missatgesXat.length === 0" class="h-full flex flex-col items-center justify-center text-slate-400 opacity-60">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-12 h-12 mb-2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M8.625 9.75a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375m-13.5 3.01c0 1.6 1.123 2.994 2.707 3.227 1.087.16 2.185.283 3.293.369V21l4.184-4.183a1.14 1.14 0 01.778-.332 48.294 48.294 0 005.83-.498c1.585-.233 2.708-1.626 2.708-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
            </svg>
            <p class="text-sm font-medium">Inicia una conversa per gestionar tràmits o analitzar dades d'escola.</p>
          </div>
          
          <div v-for="(msg, idx) in missatgesXat" :key="idx" 
               class="max-w-[85%] rounded-2xl p-4 flex gap-3 text-sm animate-fade-in"
               :class="msg.role === 'admin' ? 'bg-indigo-600 text-white ml-auto rounded-tr-sm shadow-sm shadow-indigo-200' : 'bg-white border border-slate-200 text-slate-700 mr-auto rounded-tl-sm'">
            
            <div v-if="msg.role === 'ia'" class="w-6 h-6 flex-shrink-0 bg-purple-100 rounded-full flex items-center justify-center pt-0.5 text-xs shadow-sm">
              ✨
            </div>
            
            <div class="leading-relaxed whitespace-pre-wrap flex-1">{{ msg.text }}</div>
          </div>

          <div v-if="loadingChat" class="max-w-[85%] bg-white border border-slate-200 text-slate-700 mr-auto rounded-2xl rounded-tl-sm p-4 flex gap-3 items-center">
            <div class="flex gap-1">
              <div class="w-2 h-2 rounded-full bg-slate-300 animate-bounce"></div>
              <div class="w-2 h-2 rounded-full bg-slate-300 animate-bounce" style="animation-delay: 0.1s"></div>
              <div class="w-2 h-2 rounded-full bg-slate-300 animate-bounce" style="animation-delay: 0.2s"></div>
            </div>
          </div>
        </div>

        <div class="p-4 bg-white border-t border-slate-100">
          <form @submit.prevent="enviarMissatge" class="flex gap-3 relative">
            <input 
              v-model="inputMissatge"
              type="text" 
              class="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50 outline-none transition-all placeholder:text-slate-400 font-medium disabled:opacity-50"
              placeholder="Pregunta o demana qualsevol gestió escolar..."
              :disabled="loadingChat"
            />
            <button 
              type="submit" 
              :disabled="!inputMissatge.trim() || loadingChat"
              class="w-12 h-12 flex items-center justify-center bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl transition-all shadow-sm shadow-indigo-200 disabled:opacity-50 active:scale-95"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-5 h-5 ml-1">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
              </svg>
            </button>
          </form>
        </div>
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

// Control del Xat
const missatgesXat = ref([]);
const inputMissatge = ref('');
const loadingChat = ref(false);
const chatContainerElement = ref(null);

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

const ferScrollSota = () => {
  setTimeout(() => {
    if(chatContainerElement.value) {
      chatContainerElement.value.scrollTo({ 
        top: chatContainerElement.value.scrollHeight, 
        behavior: 'smooth' 
      });
    }
  }, 100);
};

const enviarMissatge = async () => {
  const textMsg = inputMissatge.value.trim();
  if(!textMsg) return;

  // Afegir missatge de l'admin
  missatgesXat.value.push({ role: 'admin', text: textMsg });
  inputMissatge.value = '';
  loadingChat.value = true;
  ferScrollSota();

  try {
    const res = await fetch('/api/admin/ia/chat', {
       method: 'POST',
       headers: {
         'Content-Type': 'application/json',
         'Authorization': `Bearer ${localStorage.getItem('access_token')}`
       },
       body: JSON.stringify({ missatge: textMsg })
    });
    
    if(!res.ok) { if(res.status === 401) { localStorage.removeItem('access_token'); window.location.href = '/login'; }
       const resp_err = await res.text();
       console.error("Res IA Fallada:", res.status, resp_err);
       throw new Error('Fallada API Gemini Simulat: ' + res.status);
    }
    
    const dades = await res.json();
    missatgesXat.value.push({ role: 'ia', text: dades.resposta || 'Sense resposta vàlida' });
  } catch(e) {
    console.error(e);
    missatgesXat.value.push({ role: 'ia', text: "❌ Connexió aturada: verifica si el servidor intern s'ha reiniciat sobtadament." });
  } finally {
    loadingChat.value = false;
    ferScrollSota();
  }
};

onMounted(() => carregarDades());
</script>
