<template>
  <div class="h-[calc(100vh-120px)] flex gap-6 animate-fade-in">
    <!-- LLISTA DE CONVERSES -->
    <div class="w-80 bg-white rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-100 flex flex-col overflow-hidden">
      <div class="p-6 border-b border-slate-50">
        <h3 class="text-xl font-black text-slate-900 uppercase italic tracking-tighter">Missatgeria ADSUM</h3>
        <div class="relative mt-4">
           <AppIcon name="search" class="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
           <input type="text" placeholder="Cerca xat..." class="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-[10px] font-bold focus:outline-none focus:border-blue-500 transition-all">
        </div>
      </div>
      <div class="flex-grow overflow-y-auto p-4 space-y-2">
        <div v-for="chat in chats" :key="chat.id" 
          @click="seleccionarChat(chat)"
          :class="chatActiu?.id === chat.id ? 'bg-blue-600 text-white shadow-lg shadow-blue-100' : 'hover:bg-slate-50 text-slate-600'"
          class="p-4 rounded-2xl cursor-pointer transition-all flex items-center gap-4 group relative">
          <div :class="chatActiu?.id === chat.id ? 'bg-white/20' : 'bg-blue-50'" class="w-12 h-12 rounded-2xl flex items-center justify-center font-black text-xs shrink-0">
            {{ chat.nom.substring(0, 1) }}.
          </div>
          <div class="flex-grow min-w-0">
             <div class="flex justify-between items-center mb-0.5">
                <p class="text-[11px] font-black truncate uppercase italic">{{ chat.nom }}</p>
                <span :class="chatActiu?.id === chat.id ? 'text-blue-200' : 'text-slate-300'" class="text-[8px] font-bold tracking-tighter">{{ chat.hora }}</span>
             </div>
             <p :class="chatActiu?.id === chat.id ? 'text-blue-100' : 'text-slate-400'" class="text-[9px] font-bold truncate leading-tight">{{ chat.ultimMissatge }}</p>
          </div>
          <div v-if="chatActiu?.id === chat.id" class="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-white rounded-r-full"></div>
        </div>
      </div>
    </div>

    <!-- FERESTRA DE MISSATGES -->
    <div class="flex-grow bg-white rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-100 flex flex-col overflow-hidden relative">
      <div v-if="chatActiu" class="flex flex-col h-full">
         <!-- Header Xat -->
         <div class="p-6 border-b border-slate-50 flex items-center justify-between bg-slate-50/40 backdrop-blur-sm">
            <div class="flex items-center gap-4">
               <div class="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center font-black text-xs border border-blue-100">
                  {{ chatActiu.nom.substring(0, 2).toUpperCase() }}
               </div>
               <div>
                  <h4 class="text-sm font-black text-slate-900 uppercase italic leading-none mb-1">{{ chatActiu.nom }}</h4>
                  <p class="text-[9px] text-emerald-500 font-black uppercase tracking-widest flex items-center gap-1.5">
                     <span class="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span> {{ isConnected ? 'En línia' : 'Connectant...' }}
                  </p>
               </div>
            </div>
            <div class="flex gap-2">
               <button class="w-10 h-10 rounded-xl bg-white border border-slate-100 flex items-center justify-center text-slate-400 hover:text-blue-600 transition-all">
                  <AppIcon name="phone" class="w-5 h-5" />
               </button>
               <button class="w-10 h-10 rounded-xl bg-white border border-slate-100 flex items-center justify-center text-slate-400 hover:text-blue-600 transition-all">
                  <AppIcon name="info" class="w-5 h-5" />
               </button>
            </div>
         </div>

         <!-- Missatges -->
         <div class="flex-grow overflow-y-auto p-10 space-y-6 bg-slate-50/20" ref="messageContainer">
            <div v-for="msg in missatgesVisibles" :key="msg.id" :class="msg.meu ? 'flex-row-reverse' : ''" class="flex gap-4">
               <div class="flex flex-col" :class="msg.meu ? 'items-end' : 'items-start'">
                  <span v-if="!msg.meu" class="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1 ml-2">{{ msg.user }}</span>
                  <div :class="msg.meu ? 'bg-blue-600 text-white rounded-[1.5rem] rounded-tr-none shadow-lg shadow-blue-100' : 'bg-white text-slate-700 rounded-[1.5rem] rounded-tl-none border border-slate-100 shadow-sm'" class="p-5 max-w-[85%]">
                     <p class="text-xs font-medium leading-relaxed">{{ msg.text }}</p>
                     <p :class="msg.meu ? 'text-blue-200' : 'text-slate-400'" class="text-[8px] font-black uppercase mt-2.5 text-right tracking-widest">{{ msg.hora }}</p>
                  </div>
               </div>
            </div>
         </div>

         <!-- Input -->
         <div class="p-6 bg-white border-t border-slate-100">
            <form @submit.prevent="enviarMissatge" class="flex gap-4">
               <button type="button" class="w-12 h-12 bg-slate-50 text-slate-400 rounded-2xl flex items-center justify-center hover:text-blue-600 transition-all border border-slate-100">
                  <AppIcon name="paper-clip" class="w-5 h-5" />
               </button>
               <input v-model="nouMissatge" type="text" placeholder="Escriu un missatge..." class="flex-grow px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-xs font-bold focus:outline-none focus:border-blue-500 transition-all placeholder:text-slate-300">
               <button type="submit" class="w-14 h-14 bg-blue-600 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-blue-100 hover:bg-blue-700 transition-all active:scale-90">
                  <AppIcon name="send" class="w-6 h-6" />
               </button>
            </form>
         </div>
      </div>

      <!-- Estat buit -->
      <div v-else class="h-full flex flex-col items-center justify-center text-slate-400 p-12 text-center">
         <div class="w-24 h-24 bg-slate-50 rounded-[2.5rem] flex items-center justify-center mb-6 border border-slate-100">
            <AppIcon name="chat" class="h-12 w-12 text-slate-200" />
         </div>
         <p class="font-black uppercase tracking-[0.2em] text-[10px] text-slate-500">Benvingut al Xat Institucional</p>
         <p class="text-xs mt-3 italic max-w-xs leading-relaxed">Selecciona una conversa per començar a comunicar-te de forma segura.</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, nextTick, onMounted, onUnmounted } from 'vue';
import AppIcon from '../components/shared/AppIcon.vue';
import { io } from 'socket.io-client';

const props = defineProps({
  user: Object
});

const chatActiu = ref(null);
const nouMissatge = ref('');
const messageContainer = ref(null);
const isConnected = ref(false);
let socket = null;

const chats = ref([
  { id: 'GLOBAL', nom: 'Grup de Classe (General)', ultimMissatge: 'Benvinguts al curs 25-26!', hora: '09:00' },
  { id: 'TUTOR', nom: 'M. Font (Tutor)', ultimMissatge: 'Hola, com van els projectes?', hora: '10:45' },
]);

const totsElsMissatges = ref({
  'GLOBAL': [
    { id: 1, text: 'Hola a tothom! Aquest és el xat oficial del grup.', user: 'SISTEMA', meu: false, hora: '09:00' }
  ],
  'TUTOR': [
    { id: 1, text: 'Hola, com van els projectes?', user: 'M. Font', meu: false, hora: '10:45' }
  ]
});

const missatgesVisibles = computed(() => {
  if (!chatActiu.value) return [];
  return totsElsMissatges.value[chatActiu.value.id] || [];
});

onMounted(() => {
  // Connectar al namespace /chat
  socket = io('http://localhost:3000/chat');

  socket.on('connect', () => {
    isConnected.value = true;
    console.log('Connectat al xat real-time');
  });

  socket.on('disconnect', () => {
    isConnected.value = false;
  });

  socket.on('chat_history', (history) => {
    // Carregar l'històric rebut de la BD
    history.forEach(msg => {
      const salaId = msg.room || 'GLOBAL';
      if (!totsElsMissatges.value[salaId]) totsElsMissatges.value[salaId] = [];
      
      const existeix = totsElsMissatges.value[salaId].some(m => m.id === msg.id);
      if (!existeix) {
        totsElsMissatges.value[salaId].push(msg);
      }
    });
    
    Object.keys(totsElsMissatges.value).forEach(sala => {
      totsElsMissatges.value[sala].sort((a, b) => a.id - b.id);
    });

    nextTick(() => scrollToBottom());
  });

  socket.on('new_message', (msg) => {
    const salaId = msg.room || 'GLOBAL';
    if (!totsElsMissatges.value[salaId]) totsElsMissatges.value[salaId] = [];
    totsElsMissatges.value[salaId].push(msg);
    
    const chat = chats.value.find(c => c.id === salaId);
    if (chat) {
      chat.ultimMissatge = msg.text;
      chat.hora = msg.hora;
    }
    
    nextTick(() => scrollToBottom());
  });

  socket.on('user_joined', (data) => {
    console.log(`${data.user} s'ha unit`);
  });
});

onUnmounted(() => {
  if (socket) socket.disconnect();
});

const seleccionarChat = (chat) => {
  chatActiu.value = chat;
  
  // Unir-se a la sala quan seleccionem el xat
  if (socket && isConnected.value) {
    socket.emit('join_room', { room: chat.id, user: props.user });
  }
  
  nextTick(() => scrollToBottom());
};

const enviarMissatge = () => {
  if (!nouMissatge.value || !chatActiu.value) return;
  
  const chatId = chatActiu.value.id;
  const text = nouMissatge.value;
  const hora = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  // Afegir el missatge localment (meu)
  const meuMsg = {
    id: Date.now(),
    text: text,
    user: props.user.nom,
    meu: true,
    hora: hora
  };

  totsElsMissatges.value[chatId].push(meuMsg);

  // Enviar pel socket
  socket.emit('send_message', {
    room: chatId,
    user: props.user,
    text: text
  });

  // Actualitzar l'últim missatge a la llista
  const chat = chats.value.find(c => c.id === chatId);
  if (chat) {
    chat.ultimMissatge = text;
    chat.hora = hora;
  }

  nouMissatge.value = '';
  nextTick(() => scrollToBottom());
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

::-webkit-scrollbar { width: 4px; }
::-webkit-scrollbar-track { background: transparent; }
::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 10px; }
::-webkit-scrollbar-thumb:hover { background: #cbd5e1; }
</style>
