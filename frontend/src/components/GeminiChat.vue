<template>
  <div class="flex flex-col h-full bg-white rounded-3xl shadow-2xl border border-blue-100 overflow-hidden animate-fade-in">
    <!-- CAPÇALERA CHAT -->
    <div class="bg-slate-900 p-6 flex items-center justify-between">
      <div class="flex items-center gap-4">
        <div class="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </div>
        <div>
          <h3 class="text-white font-black uppercase tracking-widest text-[10px]">Assistent Gemini AI</h3>
          <div class="flex items-center gap-1.5 mt-0.5">
            <div class="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div>
            <span class="text-[8px] font-black text-blue-300 uppercase tracking-widest">Actiu ara</span>
          </div>
        </div>
      </div>
      <button @click="$emit('close')" class="text-slate-400 hover:text-white transition-colors">
        <AppIcon name="x" class="w-5 h-5" />
      </button>
    </div>

    <!-- ZONA DE MISSATGES -->
    <div class="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50/50 custom-scrollbar" ref="chatBox">
      <div v-for="(msg, i) in messages" :key="i" 
        class="flex" :class="msg.role === 'user' ? 'justify-end' : 'justify-start'"
      >
        <div class="max-w-[85%] p-4 rounded-2xl text-[11px] font-medium leading-relaxed shadow-sm"
          :class="msg.role === 'user' 
            ? 'bg-blue-600 text-white rounded-tr-none' 
            : 'bg-white text-slate-700 border border-slate-100 rounded-tl-none'"
        >
          {{ msg.content }}
        </div>
      </div>
      <div v-if="isTyping" class="flex justify-start">
        <div class="bg-white border border-slate-100 p-4 rounded-2xl rounded-tl-none flex gap-1 items-center">
          <div class="w-1 h-1 bg-blue-400 rounded-full animate-bounce"></div>
          <div class="w-1 h-1 bg-blue-400 rounded-full animate-bounce" style="animation-delay: 0.2s"></div>
          <div class="w-1 h-1 bg-blue-400 rounded-full animate-bounce" style="animation-delay: 0.4s"></div>
        </div>
      </div>
    </div>

    <!-- ENTRADA DE TEXT -->
    <div class="p-6 bg-white border-t border-slate-100">
      <div class="flex gap-3">
        <input 
          v-model="input" 
          @keyup.enter="sendMessage"
          type="text" 
          placeholder="Pregunta sobre l'horari o els teus apunts..." 
          class="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-5 py-3 text-xs font-bold focus:outline-none focus:border-blue-500"
        />
        <button @click="sendMessage" class="w-12 h-12 bg-blue-600 text-white rounded-xl flex items-center justify-center hover:bg-blue-700 transition-all shadow-lg shadow-blue-100">
          <AppIcon name="send" class="w-5 h-5" />
        </button>
      </div>
      <p class="text-[8px] text-slate-400 font-bold uppercase tracking-widest mt-4 text-center">
        L'IA pot cometre errors. Revisa la informació oficial del centre.
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref, nextTick } from 'vue';
import AppIcon from './shared/AppIcon.vue';

const input = ref('');
const isTyping = ref(false);
const chatBox = ref(null);

const messages = ref([
  { role: 'assistant', content: 'Hola! Sóc el teu assistent Gemini. En què et puc ajudar avui? Puc resumir els teus apunts, consultar l\'horari o explicar-te com funciona ADSUM.' }
]);

const sendMessage = async () => {
  if (!input.value.trim()) return;

  const userMsg = input.value;
  messages.value.push({ role: 'user', content: userMsg });
  input.value = '';
  
  await scrollToBottom();
  
  isTyping.value = true;

  // Simulació de resposta de Gemini
  setTimeout(async () => {
    let response = "D'acord, he rebut la teva consulta. Estic processant la informació dels servidors de l'institut...";
    
    if (userMsg.toLowerCase().includes('horari')) {
      response = "El teu pròxim mòdul és 'Desenvolupament d'Interfícies' a les 15:00h a l'Aula 204.";
    } else if (userMsg.toLowerCase().includes('apunts') || userMsg.toLowerCase().includes('resum')) {
      response = "He analitzat els teus apunts de 'Bases de Dades'. El resum és: El model Entitat-Relació es basa en entitats, atributs i relacions. Vols que aprofundeixi en les claus primàries?";
    }

    messages.value.push({ role: 'assistant', content: response });
    isTyping.value = false;
    await scrollToBottom();
  }, 1500);
};

const scrollToBottom = async () => {
  await nextTick();
  if (chatBox.value) {
    chatBox.value.scrollTop = chatBox.value.scrollHeight;
  }
};
</script>
