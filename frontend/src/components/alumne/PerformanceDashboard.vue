<template>
  <div class="max-w-md mx-auto space-y-6 animate-fade-in">
    <!-- Resumen de Asistencia -->
    <div class="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100">
      <h2 class="text-sm font-black text-slate-400 uppercase tracking-widest mb-4">Resum d'Assistència</h2>
      <div class="grid grid-cols-2 gap-4">
        <div class="bg-indigo-50 p-4 rounded-2xl border border-indigo-100">
          <p class="text-2xl font-black text-indigo-600">92%</p>
          <p class="text-[10px] font-bold text-indigo-400 uppercase">Global</p>
        </div>
        <div class="bg-emerald-50 p-4 rounded-2xl border border-emerald-100">
          <p class="text-2xl font-black text-emerald-600">5</p>
          <p class="text-[10px] font-bold text-emerald-400 uppercase">Rata (Dies)</p>
        </div>
      </div>
    </div>

    <!-- Calculadora de Notas -->
    <div class="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100">
      <GradeCalculator />
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import GradeCalculator from './GradeCalculator.vue';

// Mantingut per compatibilitat amb el Resum d'Assistència si calgués en el futur
</script>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.4s ease-out;
}
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(15px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
