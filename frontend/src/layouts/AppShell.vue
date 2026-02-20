<template>
  <div class="min-h-screen bg-slate-50 font-sans flex text-slate-900">
    
    <!-- SIDEBAR (Desktop) -->
    <aside class="hidden md:flex flex-col w-64 bg-white border-r border-slate-200 sticky top-0 h-screen">
      <div class="p-6 flex items-center gap-3">
        <div class="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-black">A</div>
        <span class="font-black text-xl tracking-tight leading-none italic uppercase">Adsum</span>
      </div>
      
      <nav class="flex-1 px-4 space-y-1">
        <button v-for="item in navItems" :key="item.id" 
          @click="changeView(item.id)"
          class="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-bold text-sm transition-all"
          :class="activeView === item.id ? 'bg-indigo-50 text-indigo-700' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'"
        >
          <AppIcon :name="item.icon" class="w-5 h-5" />
          {{ item.label }}
        </button>
      </nav>

      <div class="p-4 border-t border-slate-100">
        <div class="flex items-center gap-3 p-2 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer text-left">
          <div class="w-10 h-10 rounded-full bg-indigo-100 border border-indigo-200 flex items-center justify-center text-indigo-700 font-bold">PG</div>
          <div class="flex-1 overflow-hidden">
            <p class="text-sm font-bold truncate">Prof. Garcia</p>
            <p class="text-[10px] text-slate-400 font-black uppercase tracking-widest">Professor</p>
          </div>
        </div>
      </div>
    </aside>

    <!-- MAIN CONTENT AREA -->
    <main class="flex-1 flex flex-col min-w-0 pb-20 md:pb-0">
      <header class="h-16 bg-white/80 backdrop-blur-md border-b border-slate-200 flex items-center justify-between px-6 sticky top-0 z-30">
        <h1 class="text-lg font-black text-slate-800 tracking-tight leading-none italic uppercase">{{ currentTitle }}</h1>
        <div class="flex items-center gap-4">
          <button class="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-500 hover:text-indigo-600 transition-colors">
            <AppIcon name="bell" class="w-5 h-5" />
          </button>
        </div>
      </header>

      <div class="p-4 md:p-8 max-w-7xl mx-auto w-full">
        <slot :activeView="activeView" :changeView="changeView" />
      </div>
    </main>

    <!-- BOTTOM NAV (Mobile) -->
    <nav class="md:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-lg border-t border-slate-200 h-16 flex items-center justify-around px-2 z-40">
      <button v-for="item in navItems" :key="item.id" @click="changeView(item.id)"
        class="flex flex-col items-center justify-center flex-1 gap-1 transition-all"
        :class="activeView === item.id ? 'text-indigo-600' : 'text-slate-400'"
      >
        <AppIcon :name="item.icon" class="w-6 h-6 transition-transform" :class="{ 'scale-110': activeView === item.id }" />
        <span class="text-[10px] font-black uppercase tracking-tighter">{{ item.label }}</span>
      </button>
    </nav>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import AppIcon from '../components/shared/AppIcon.vue';

const activeView = ref('home');

const navItems = [
  { id: 'home', label: 'Classes', icon: 'home' },
  { id: 'stats', label: 'Estadístiques', icon: 'stats' },
  { id: 'resources', label: 'Recursos', icon: 'book' },
];

const changeView = (view) => {
  activeView.value = view;
};

const currentTitle = computed(() => navItems.find(i => i.id === activeView.value)?.label || 'ADSUM');
</script>

<style>
@keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
.animate-fade-in { animation: fade-in 0.3s ease-out forwards; }
</style>
