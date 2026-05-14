<template>
  <div class="h-[calc(100vh-120px)] flex flex-col bg-white rounded-[3rem] shadow-2xl shadow-blue-900/10 border border-slate-100 overflow-hidden animate-fade-in relative">
    <!-- BACKGROUND DECORATIU (IA FEEL) -->
    <div class="absolute top-0 right-0 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl pointer-events-none"></div>
    <div class="absolute bottom-0 left-0 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none"></div>

    <!-- HEADER ASSISTENT -->
    <div class="p-8 border-b border-slate-50 flex items-center justify-between bg-white/50 backdrop-blur-md relative z-10">
      <div class="flex items-center gap-5">
        <div class="w-14 h-14 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl shadow-xl shadow-blue-500/40 flex items-center justify-center group overflow-hidden">
           <div class="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-from)_0%,_transparent_70%)] animate-pulse"></div>
           <AppIcon name="ai" class="w-8 h-8 text-white relative z-10" />
        </div>
        <div>
          <h3 class="text-xl font-black text-slate-900 uppercase italic tracking-tighter">Assistent Gemini</h3>
          <p class="text-[10px] text-emerald-500 font-black uppercase tracking-[0.2em] flex items-center gap-1.5">
             <span class="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span> Sistema Intel·ligent Actiu
          </p>
        </div>
      </div>
      <div class="flex gap-2">
         <span class="px-4 py-2 bg-slate-50 rounded-xl text-[9px] font-black text-slate-400 uppercase tracking-widest border border-slate-100">Model: ADSUM-Gemini v2</span>
      </div>
    </div>

    <!-- FIL DE MISSATGES -->
    <div class="flex-grow overflow-y-auto p-10 space-y-8 relative z-10" ref="messageContainer">
      <div v-for="msg in missatges" :key="msg.id" :class="msg.rol === 'ia' ? 'flex-row' : 'flex-row-reverse'" class="flex gap-6">
        <!-- Avatar IA -->
        <div v-if="msg.rol === 'ia'" class="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center shrink-0 shadow-lg">
           <AppIcon name="ai" class="w-5 h-5 text-white" />
        </div>
        
        <div :class="msg.rol === 'ia' ? 'bg-slate-50 text-slate-700 rounded-3xl rounded-tl-none border border-slate-100' : 'bg-blue-600 text-white rounded-3xl rounded-tr-none shadow-xl shadow-blue-100'" class="p-6 max-w-[80%]">
          <p class="text-sm font-medium leading-relaxed whitespace-pre-wrap">{{ msg.text }}</p>
          <div v-if="msg.pensant" class="flex gap-1 mt-2">
             <div class="w-1 h-1 bg-blue-400 rounded-full animate-bounce"></div>
             <div class="w-1 h-1 bg-blue-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
             <div class="w-1 h-1 bg-blue-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
          </div>
          <p :class="msg.rol === 'ia' ? 'text-slate-400' : 'text-blue-200'" class="text-[8px] font-black uppercase mt-3 tracking-widest">{{ msg.hora }}</p>
        </div>
      </div>
    </div>

    <!-- INPUT DE CONSULTA -->
    <div class="p-8 bg-white/80 backdrop-blur-md border-t border-slate-50 relative z-10">
      <form @submit.prevent="enviarConsulta" class="flex gap-4 max-w-4xl mx-auto">
        <div class="flex-grow relative group">
           <input v-model="consulta" type="text" placeholder="Fes-me una consulta sobre ADSUM o el teu rendiment..." class="w-full pl-8 pr-14 py-5 bg-slate-50 border-2 border-slate-100 rounded-[2rem] text-sm font-bold focus:outline-none focus:ring-8 focus:ring-blue-500/5 focus:border-blue-500 transition-all placeholder:text-slate-300">
           <div class="absolute right-4 top-1/2 -translate-y-1/2 w-8 h-8 bg-white rounded-xl shadow-sm flex items-center justify-center text-blue-400 border border-slate-100 opacity-0 group-focus-within:opacity-100 transition-opacity">
              <AppIcon name="mic" class="w-4 h-4" />
           </div>
        </div>
        <button type="submit" :disabled="isThinking" class="px-8 bg-blue-600 text-white rounded-[2rem] font-black uppercase text-[10px] tracking-[0.2em] shadow-xl shadow-blue-100 hover:bg-blue-700 hover:scale-105 transition-all active:scale-95 disabled:opacity-50">
           Enviar
        </button>
      </form>
      <div class="flex justify-center gap-6 mt-6">
         <button @click="consultaRapida('Com va el meu rendiment acadèmic?')" class="text-[9px] font-black text-slate-400 uppercase tracking-widest hover:text-blue-600 transition-colors">Analitzar rendiment</button>
         <button @click="consultaRapida('Quin és el meu horari per avui?')" class="text-[9px] font-black text-slate-400 uppercase tracking-widest hover:text-blue-600 transition-colors">Consultar horari</button>
         <button @click="consultaRapida('Com puc justificar una falta?')" class="text-[9px] font-black text-slate-400 uppercase tracking-widest hover:text-blue-600 transition-colors">Ajuda tràmits</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, nextTick } from 'vue';
import AppIcon from '../components/shared/AppIcon.vue';

const consulta = ref('');
const messageContainer = ref(null);
const isThinking = ref(false);

const missatges = ref([
  { id: 1, rol: 'ia', text: 'Hola! Sóc l\'assistent de ADSUM basat en Gemini. Analitzo les teves dades en temps real per ajudar-te. Què vols saber avui?', hora: 'ARA' }
]);

const enviarConsulta = async () => {
  if (!consulta.value || isThinking.value) return;
  
  const textUsuari = consulta.value;
  missatges.value.push({ id: Date.now(), rol: 'usuari', text: textUsuari, hora: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) });
  consulta.value = '';
  isThinking.value = true;

  // Afegir missatge de "pensant"
  const idIa = Date.now() + 1;
  missatges.value.push({ id: idIa, rol: 'ia', text: '', hora: 'ARA', pensant: true });
  nextTick(() => scrollToBottom());

  try {
    const token = localStorage.getItem('access_token');
    const res = await fetch('/api/ai/consultar', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ consulta: textUsuari })
    });

    if (res.ok) {
      const data = await res.json();
      const msgIa = missatges.value.find(m => m.id === idIa);
      if (msgIa) {
        msgIa.pensant = false;
        msgIa.text = data.resposta;
      }
    } else {
      throw new Error("Error en la comunicació amb l'IA");
    }
  } catch (error) {
    const msgIa = missatges.value.find(m => m.id === idIa);
    if (msgIa) {
      msgIa.pensant = false;
      msgIa.text = "Ho sento, hi ha hagut un problema en connectar amb el meu nucli de processament. Torna-ho a provar en uns minuts.";
    }
  } finally {
    isThinking.value = false;
    nextTick(() => scrollToBottom());
  }
};

const consultaRapida = (text) => {
   consulta.value = text;
   enviarConsulta();
};

const scrollToBottom = () => {
  if (messageContainer.value) {
    messageContainer.value.scrollTop = messageContainer.value.scrollHeight;
  }
};
</script>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
