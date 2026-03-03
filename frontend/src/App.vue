<template>
  <div v-if="!isLoggedIn" class="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4 transition-colors">
    <Login @login-success="handleLoginSuccess" />
  </div>

  <AppShell v-else :user="currentUser" @logout="handleLogout" #default="{ activeView, changeView }">
    <Transition name="fade" mode="out-in">
      <div v-if="currentUser?.rol === 'professor'">
        <div v-if="activeView === 'home'">
          <DashboardProfessor v-if="!selectedClass" :user="currentUser" @select-class="onSelectClass" />
          <ClasseDetall v-else :user="currentUser" :modul="selectedClass" @back="selectedClass = null" />
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

      <div v-else-if="currentUser?.rol === 'admin'" class="w-full">
        <VistaTaulerAnalitica v-if="activeView === 'home'" />
        <VistaGestioUsuaris v-else-if="activeView === 'users'" />
        <VistaSincronitzacio v-else-if="activeView === 'center'" />
        <VistaInfraestructura v-else-if="activeView === 'iot'" />
        <VistaInventariRecursos v-else-if="activeView === 'resources'" />
        <VistaControlIA v-else-if="activeView === 'ia'" />
        <VistaOperacionsSistema v-else-if="activeView === 'system'" />
        
        <div v-else class="flex flex-col items-center justify-center py-20 text-slate-400 animate-fade-in">
          <p class="text-4xl mb-4">🚧</p>
          <p class="font-bold uppercase tracking-widest text-xs">Secció d'Admin desconeguda</p>
        </div>
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
import DashboardProfessor from './views/DashboardProfessor.vue';
import ClasseDetall from './views/ClasseDetall.vue';

// Admin Views
import VistaTaulerAnalitica from './views/admin/VistaTaulerAnalitica.vue';
import VistaGestioUsuaris from './views/admin/VistaGestioUsuaris.vue';
import VistaSincronitzacio from './views/admin/VistaSincronitzacio.vue';
import VistaInfraestructura from './views/admin/VistaInfraestructura.vue';
import VistaInventariRecursos from './views/admin/VistaInventariRecursos.vue';
import VistaControlIA from './views/admin/VistaControlIA.vue';
import VistaOperacionsSistema from './views/admin/VistaOperacionsSistema.vue';

const isLoggedIn = ref(!!localStorage.getItem('access_token'));
const currentUser = ref(JSON.parse(localStorage.getItem('user') || 'null'));
const selectedClass = ref(null);

const handleLoginSuccess = () => {
  isLoggedIn.value = true;
  currentUser.value = JSON.parse(localStorage.getItem('user') || 'null');
};

const handleLogout = () => {
  localStorage.removeItem('access_token');
  localStorage.removeItem('user');
  isLoggedIn.value = false;
  currentUser.value = null;
  selectedClass.value = null;
};

const onSelectClass = (modul) => {
  selectedClass.value = modul;
};
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');

body,
html {
  margin: 0;
  padding: 0;
  background: #f8fafc; /* slate-50 */
  font-family: 'Inter', sans-serif;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
