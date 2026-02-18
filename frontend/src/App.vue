<template>
  <AppShell #default="{ activeView }">
    <DashboardBento v-if="activeView === 'home'" />
    <PerformanceView v-else-if="activeView === 'performance'" />
    <div v-else class="flex flex-col items-center justify-center py-20 text-slate-400">
      <p class="text-4xl mb-4">🚧</p>
      <p class="font-bold uppercase tracking-widest text-xs">Secció en construcció</p>
      <p class="text-sm mt-1">Properament disponible en la v2.0</p>
    </div>
  </AppShell>
</template>

<script setup>
import AppShell from './layouts/AppShell.vue';
import DashboardBento from './views/DashboardBento.vue';
import PerformanceView from './views/PerformanceView.vue';
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
</style>
