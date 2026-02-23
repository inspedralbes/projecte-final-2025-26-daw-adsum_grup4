<template>
  <div v-if="!isLoggedIn" class="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4 transition-colors">
    <Login @login-success="handleLoginSuccess" />
  </div>

  <AppShell v-else :user="currentUser" @logout="handleLogout" #default="{ activeView }">
    <Transition name="fade" mode="out-in">
      <div v-if="currentUser?.rol === 'professor'">
        <div v-if="activeView === 'home'" class="flex justify-center py-10">
          <QrDisplay @logout="handleLogout" />
        </div>
        <div v-else class="flex flex-col items-center justify-center py-20 text-slate-400 animate-fade-in">
          <p class="text-4xl mb-4">🚧</p>
          <p class="font-bold uppercase tracking-widest text-xs">Secció de Professor en construcció</p>
        </div>
      </div>
      
      <div v-else-if="currentUser?.rol === 'alumne'">
        <DashboardBento v-if="activeView === 'home'" :user="currentUser" />
        <PerformanceView v-else-if="activeView === 'performance'" :user="currentUser" />
        <div v-else class="flex flex-col items-center justify-center py-20 text-slate-400 animate-fade-in">
          <p class="text-4xl mb-4">🚧</p>
          <p class="font-bold uppercase tracking-widest text-xs">Secció en construcció</p>
          <p class="text-sm mt-1">Properament disponible</p>
        </div>
      </div>
    </Transition>
  </AppShell>
</template>

<script setup>
import { ref } from 'vue';
import Login from './components/Login.vue';
import QrDisplay from './components/QrDisplay.vue';
import AppShell from './layouts/AppShell.vue';
import DashboardBento from './views/DashboardBento.vue';
import PerformanceView from './views/PerformanceView.vue';

const isLoggedIn = ref(!!localStorage.getItem('access_token'));
const currentUser = ref(JSON.parse(localStorage.getItem('user') || 'null'));

const handleLoginSuccess = () => {
    isLoggedIn.value = true;
    currentUser.value = JSON.parse(localStorage.getItem('user') || 'null');
};

const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('user');
    isLoggedIn.value = false;
    currentUser.value = null;
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
