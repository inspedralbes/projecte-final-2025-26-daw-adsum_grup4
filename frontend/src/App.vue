<template>
  <div v-if="!isLoggedIn" class="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4 transition-colors">
    <Login @login-success="handleLoginSuccess" />
  </div>

  <AppShell v-else #default="{ activeView }">
    <Transition name="fade" mode="out-in">
      <DashboardBento v-if="activeView === 'home'" />
      <PerformanceView v-else-if="activeView === 'performance'" />
      <div v-else class="flex flex-col items-center justify-center py-20 text-slate-400 animate-fade-in">
        <p class="text-4xl mb-4">🚧</p>
        <p class="font-bold uppercase tracking-widest text-xs">Secció en construcció</p>
        <p class="text-sm mt-1">Properament disponible</p>
      </div>
    </Transition>
  </AppShell>
</template>

<script setup>
import { ref } from 'vue';
import Login from './components/Login.vue';
import AppShell from './layouts/AppShell.vue';
import DashboardBento from './views/DashboardBento.vue';
import PerformanceView from './views/PerformanceView.vue';

const isLoggedIn = ref(false);

const handleLoginSuccess = () => {
    isLoggedIn.value = true;
};
</script>

<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
