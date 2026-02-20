<template>
  <AppShell #default="{ activeView, changeView }">
    <div v-if="activeView === 'home'">
      <DashboardProfessor v-if="!selectedClass" @select-class="onSelectClass" />
      <ClasseDetall v-else :modul="selectedClass" @back="selectedClass = null" />
    </div>
    <div v-else class="flex flex-col items-center justify-center py-20 text-slate-400">
      <p class="text-4xl mb-4">🚧</p>
      <p class="font-bold uppercase tracking-widest text-xs">Secció en construcció</p>
      <p class="text-sm mt-1">Dissenyant noves eines per a professors</p>
    </div>
  </AppShell>
</template>

<script setup>
import { ref } from 'vue';
import AppShell from './layouts/AppShell.vue';
import DashboardProfessor from './views/DashboardProfessor.vue';
import ClasseDetall from './views/ClasseDetall.vue';

const selectedClass = ref(null);

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
</style>
