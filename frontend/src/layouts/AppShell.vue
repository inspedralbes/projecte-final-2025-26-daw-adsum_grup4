<template>
  <div class="min-h-screen bg-slate-50 font-sans flex text-slate-900">
    
    <!-- SIDEBAR (Desktop) -->
    <aside class="hidden md:flex flex-col w-72 bg-white border-r border-slate-200 sticky top-0 h-screen z-40">
      <div class="p-8 flex items-center gap-4">
        <img src="/logo.png" alt="ADSUM" class="w-10 h-10 rounded-xl object-contain bg-white shadow-lg" />
        <div class="flex flex-col">
          <span class="font-black text-xl tracking-tighter text-slate-900 uppercase">ADSUM</span>
          <span class="text-[8px] font-bold text-slate-400 uppercase tracking-widest -mt-1">Campus Digital</span>
        </div>
      </div>
      
      <nav class="flex-1 px-4 space-y-2 mt-4">
        <button v-for="item in navItems" :key="item.id" 
          @click="changeView(item.id)"
          class="w-full flex items-center gap-4 px-4 py-3 rounded-xl font-bold text-sm transition-all duration-200"
          :class="activeView === item.id 
            ? 'bg-primari-normal text-white shadow-md shadow-blue-200' 
            : 'text-slate-500 hover:bg-slate-50 hover:text-primari-normal'"
        >
          <AppIcon :name="item.icon" class="w-5 h-5" />
          <span class="tracking-wide uppercase text-[10px] font-bold">{{ item.label }}</span>
        </button>
      </nav>

      <div class="p-6 border-t border-slate-100">
        <div @click="$emit('logout')" class="flex items-center gap-4 p-3 rounded-xl bg-slate-50 border border-slate-100 hover:bg-red-50 hover:border-red-100 transition-all duration-200 cursor-pointer group">
          <div class="w-10 h-10 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center overflow-hidden shadow-inner">
            <img :src="`https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.id || 'default'}&backgroundColor=b6e3f4`" class="w-full h-full object-cover" />
          </div>
          <div class="flex-1 overflow-hidden">
            <p class="text-xs font-bold text-slate-800 truncate uppercase">{{ user?.nom }}</p>
            <p class="text-[9px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">
              {{ user?.rol === 'professor' ? 'Docent' : user?.rol === 'admin' ? 'Gestor' : 'Alumne' }}
            </p>
          </div>
          <AppIcon name="logout" class="w-4 h-4 text-slate-300 group-hover:text-red-500 transition-colors" />
        </div>
      </div>
    </aside>

    <!-- MAIN CONTENT AREA -->
    <main class="flex-1 flex flex-col min-w-0 pb-24 md:pb-0">
      <header class="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 md:px-8 sticky top-0 z-30">
        <div class="flex items-center gap-2 md:gap-4">
          <button @click="$emit('logout')" class="md:hidden p-2 text-slate-500 hover:text-blue-600 transition-colors" title="Tornar a l'inici">
            <AppIcon name="home" class="w-5 h-5" />
          </button>
          <div class="md:hidden w-8 h-8 bg-primari-normal rounded flex items-center justify-center text-white text-[10px] font-black">A</div>
          <h1 class="text-sm font-black text-slate-900 tracking-widest uppercase">{{ currentTitle }}</h1>
        </div>
        <div class="flex items-center gap-4">
          <button @click="showGemini = true" class="w-10 h-10 rounded-xl bg-slate-900 text-blue-400 flex items-center justify-center hover:bg-blue-600 hover:text-white transition-all shadow-lg shadow-blue-100 group relative">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            <span class="absolute -top-1 -right-1 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full"></span>
          </button>
          <button class="w-10 h-10 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-400 hover:text-primari-normal hover:border-primari-normal transition-all">
            <AppIcon name="bell" class="w-5 h-5" />
          </button>
        </div>
      </header>

      <div class="p-6 md:p-10 max-w-7xl mx-auto w-full">
        <slot :activeView="activeView" :changeView="changeView" />
      </div>
    </main>

    <!-- BOTTOM NAV (Mobile) -->
    <nav class="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 h-16 flex items-center justify-around z-40">
      <button v-for="item in navItems" :key="item.id" @click="changeView(item.id)"
        class="flex flex-col items-center justify-center flex-1 gap-1 transition-all duration-200"
        :class="activeView === item.id ? 'text-primari-normal' : 'text-slate-400'"
      >
        <AppIcon :name="item.icon" class="w-5 h-5 transition-transform" :class="{ 'scale-110': activeView === item.id }" />
        <span class="text-[9px] font-bold uppercase tracking-widest">{{ item.label }}</span>
      </button>

      <!-- FAB QR (for alumne) -->
      <button v-if="user?.rol === 'alumne'" @click="showQR = true"
        class="absolute -top-7 left-1/2 -translate-x-1/2 w-14 h-14 bg-primari-normal rounded-2xl shadow-lg shadow-blue-200 flex items-center justify-center text-white border-4 border-slate-50 active:scale-95 transition-all duration-200"
      >
        <AppIcon name="qr" class="w-7 h-7" />
      </button>
    </nav>

    <!-- MODALS -->
    <div v-if="showQR" class="fixed inset-0 z-50 flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-sm animate-fade-in" @click.self="showQR = false">
      <div class="w-full max-w-sm">
        <AttendanceQR @close="showQR = false" />
      </div>
    </div>

    <div v-if="showGemini" class="fixed bottom-6 right-6 z-50 w-full max-w-md h-[600px] max-h-[80vh] shadow-2xl animate-fade-in">
       <GeminiChat @close="showGemini = false" />
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import AppIcon from '../components/shared/AppIcon.vue';
import AttendanceQR from '../components/alumne/AttendanceQR.vue';
import GeminiChat from '../components/GeminiChat.vue';

const props = defineProps({
  user: {
    type: Object,
    required: true
  }
});

const emit = defineEmits(['logout', 'change-view']);

const activeView = ref('home');
const showQR = ref(false);
const showGemini = ref(false);

const navItems = computed(() => {
  if (props.user?.rol === 'pare') {
    return [
      { id: 'home', label: 'Inici', icon: 'home' },
      { id: 'justifications', label: 'Tràmits', icon: 'folder' },
      { id: 'calendar', label: 'Calendari', icon: 'calendar' },
      { id: 'schedule', label: 'Horari', icon: 'clock' },
      { id: 'chat', label: 'Xat', icon: 'chat' }
    ];
  }
  if (props.user?.rol === 'professor') {
    return [
      { id: 'home', label: 'Inici', icon: 'home' },
      { id: 'performance', label: 'Grups', icon: 'stats' },
      { id: 'justifications', label: 'Tràmits', icon: 'folder' },
      { id: 'calendar', label: 'Calendari', icon: 'calendar' },
      { id: 'schedule', label: 'Horari', icon: 'clock' },
      { id: 'toolkit', label: 'Eines', icon: 'lightning' },
      { id: 'booking', label: 'Reserves', icon: 'calendar' },
      { id: 'resources', label: 'Recursos', icon: 'book' },
      { id: 'chat', label: 'Xat', icon: 'chat' }
    ];
  }
  if (props.user?.rol === 'admin') {
    return [
      { id: 'home', label: 'Inici', icon: 'home' },
      { id: 'users', label: 'Usuaris', icon: 'users' },
      { id: 'center', label: 'Centre', icon: 'settings' },
    ];
  }
  return [
    { id: 'home', label: 'Inici', icon: 'home' },
    { id: 'performance', label: 'Notes', icon: 'academic' },
    { id: 'calculator', label: 'Simulador', icon: 'calculator' },
    { id: 'justifications', label: 'Tràmits', icon: 'folder' },
    { id: 'calendar', label: 'Calendari', icon: 'calendar' },
    { id: 'schedule', label: 'Horari', icon: 'clock' },
    { id: 'booking', label: 'Reserves', icon: 'calendar' },
    { id: 'resources', label: 'Recursos', icon: 'book' },
    { id: 'chat', label: 'Xat', icon: 'chat' },
    { id: 'attendance', label: 'Històric', icon: 'list' }
  ];
});

const changeView = (view) => {
  activeView.value = view;
  emit('change-view', view);
};

const currentTitle = computed(() => navItems.value.find(i => i.id === activeView.value)?.label || 'ADSUM');
</script>

<style>
@keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
.animate-fade-in { animation: fade-in 0.3s ease-out forwards; }
</style>
