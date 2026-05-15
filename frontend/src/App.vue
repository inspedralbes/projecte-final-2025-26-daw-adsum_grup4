<template>
  <div v-if="!isLoggedIn" class="h-screen overflow-hidden transition-all duration-500 bg-slate-50">
    <LandingView v-if="isLandingMode" @login="() => { isLandingMode = false }" />
    <div v-else class="h-full flex flex-col items-center justify-center p-4 animate-fade-in relative overflow-hidden">
        <button @click="() => { isLandingMode = true }" class="absolute top-12 left-12 flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-blue-600 transition-colors z-[100] cursor-pointer bg-white px-5 py-3 rounded-full shadow-md">
           <AppIcon name="arrow-left" class="w-4 h-4" />
           Tornar a l'inici
        </button>
        <Login @login-success="handleLoginSuccess" />
    </div>
  </div>

  <AppShell v-else :user="currentUser" @logout="handleLogout" #default="{ activeView, changeView }">
    <Transition name="fade" mode="out-in">
      <!-- VISTES COMUNS (ACCESSIBLES PER TOTS ELS ROLS) -->
      <div v-if="activeView === 'chat'" class="h-full">
         <ChatView :user="currentUser" />
      </div>
      <div v-else-if="activeView === 'resources' || activeView === 'repositori'" class="h-full">
         <RepositoriView :user="currentUser" />
      </div>
      <div v-else-if="activeView === 'ai'" class="h-full">
         <GeminiAssistant :user="currentUser" />
      </div>

      <!-- VISTES ESPECÍFIQUES PER ROL -->
      <div v-else-if="currentUser?.rol === 'professor'">
        <DashboardProfessor v-if="activeView === 'home' || activeView === 'performance' || activeView === 'toolkit'" :user="currentUser" :active-tab="activeView" />
        <div v-else-if="activeView === 'calendar'"><CalendarView :user="currentUser" /></div>
        <div v-else-if="activeView === 'schedule'"><ScheduleView :user="currentUser" /></div>
        <div v-else-if="activeView === 'justifications'"><JustificationValidatorView :user="currentUser" /></div>
        <div v-else-if="activeView === 'booking'"><BookingView :user="currentUser" /></div>
      </div>
      
      <div v-else-if="currentUser?.rol === 'alumne'">
        <DashboardBento v-if="activeView === 'home'" :user="currentUser" />
        <div v-else-if="activeView === 'performance'"><PerformanceView :user="currentUser" /></div>
        <div v-else-if="activeView === 'calculator'"><CalculatorView :user="currentUser" /></div>
        <div v-else-if="activeView === 'calendar'"><CalendarView :user="currentUser" /></div>
        <div v-else-if="activeView === 'schedule'"><ScheduleView :user="currentUser" /></div>
        <div v-else-if="activeView === 'justifications'"><JustificationView :user="currentUser" /></div>
        <div v-else-if="activeView === 'booking'"><BookingView :user="currentUser" /></div>
        <div v-else-if="activeView === 'attendance'"><AttendanceStats :user="currentUser" /></div>
      </div>

      <div v-else-if="currentUser?.rol === 'pare'">
        <DashboardPares v-if="activeView === 'home'" :user="currentUser" />
        <div v-else-if="activeView === 'calendar'"><CalendarView :user="currentUser" /></div>
        <div v-else-if="activeView === 'schedule'"><ScheduleView :user="currentUser" /></div>
        <div v-else-if="activeView === 'justifications'"><JustificationView :user="currentUser" /></div>
      </div>

      <div v-else-if="currentUser?.rol === 'admin'">
        <DashboardAdmin :user="currentUser" :active-tab="activeView" />
      </div>
    </Transition>
  </AppShell>
</template>

<script setup>
import { ref } from 'vue';
import Login from './components/Login.vue';
import AppShell from './layouts/AppShell.vue';
import LandingView from './views/LandingView.vue';
import AppIcon from './components/shared/AppIcon.vue';
import DashboardBento from './views/DashboardBento.vue';
import PerformanceView from './views/PerformanceView.vue';
import CalculatorView from './views/CalculatorView.vue';
import JustificationView from './views/JustificationView.vue';
import JustificationValidatorView from './views/JustificationValidatorView.vue';
import ResourcesView from './views/ResourcesView.vue';
import RepositoriView from './views/RepositoriView.vue';
import BookingView from './views/BookingView.vue';
import DashboardProfessor from './views/DashboardProfessor.vue';
import CalendarView from './views/CalendarView.vue';
import ScheduleView from './views/ScheduleView.vue';
import DashboardPares from './views/DashboardPares.vue';
import ChatView from './views/ChatView.vue';
import DashboardAdmin from './views/DashboardAdmin.vue';
import GeminiAssistant from './views/GeminiAssistant.vue';
import AttendanceStats from './components/alumne/AttendanceStats.vue';

const isLoggedIn = ref(!!localStorage.getItem('access_token'));
const isLandingMode = ref(true);
const currentUser = ref(JSON.parse(localStorage.getItem('user') || 'null'));

const handleLoginSuccess = (user) => {
  isLoggedIn.value = true;
  isLandingMode.value = false;
  currentUser.value = user || JSON.parse(localStorage.getItem('user') || 'null');
};

const handleLogout = () => {
  localStorage.removeItem('access_token');
  localStorage.removeItem('user');
  isLoggedIn.value = false;
  isLandingMode.value = true;
  currentUser.value = null;
};
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');

.fade-enter-active, .fade-leave-active { transition: opacity 0.2s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>
