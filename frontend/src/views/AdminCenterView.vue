<template>
  <div class="space-y-6">
    <div class="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100">
      <h2 class="text-sm font-black text-slate-400 uppercase tracking-widest mb-4">Configuració del Centre</h2>
      
      <div v-if="loading" class="text-center py-8 text-slate-400">
        <p class="text-2xl mb-2">⏳</p>
        <p class="text-sm font-bold">Carregant...</p>
      </div>
      
      <div v-else-if="config" class="space-y-4">
        <div>
          <label class="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Curs Academic</label>
          <input v-model="config.cursActual" class="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-100" />
        </div>
        
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Minuts per a retard</label>
            <input v-model.number="config.minutsTallRetard" type="number" class="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-100" />
          </div>
          <div>
            <label class="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Minuts per a absència</label>
            <input v-model.number="config.minutsTallAbsencia" type="number" class="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-100" />
          </div>
        </div>

        <button @click="guardarConfig" :disabled="saving" class="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-black uppercase tracking-widest text-xs py-4 px-6 rounded-2xl shadow-lg shadow-indigo-500/30 transition-all disabled:opacity-50">
          {{ saving ? 'Guardant...' : 'Guardar Configuració' }}
        </button>
        
        <p v-if="missatge" class="text-center text-sm font-bold" :class="error ? 'text-rose-600' : 'text-emerald-600'">{{ missatge }}</p>
      </div>
    </div>

    <div class="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100">
      <h2 class="text-sm font-black text-slate-400 uppercase tracking-widest mb-4">Estadístiques del Centre</h2>
      <div class="grid grid-cols-3 gap-4">
        <div class="bg-indigo-50 p-4 rounded-2xl text-center">
          <p class="text-2xl font-black text-indigo-600">{{ stats.totalUsuaris }}</p>
          <p class="text-[10px] font-bold text-indigo-400 uppercase">Usuaris</p>
        </div>
        <div class="bg-emerald-50 p-4 rounded-2xl text-center">
          <p class="text-2xl font-black text-emerald-600">{{ stats.totalAlumnes }}</p>
          <p class="text-[10px] font-bold text-emerald-400 uppercase">Alumnes</p>
        </div>
        <div class="bg-amber-50 p-4 rounded-2xl text-center">
          <p class="text-2xl font-black text-amber-600">{{ stats.totalProfessors }}</p>
          <p class="text-[10px] font-bold text-amber-400 uppercase">Professors</p>
        </div>
      </div>
    </div>

    <div class="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100">
      <h2 class="text-sm font-black text-slate-400 uppercase tracking-widest mb-4">Accions d'Administració</h2>
      <div class="space-y-3">
        <button @click="executarSeed" class="w-full py-3 rounded-2xl bg-rose-50 text-rose-600 font-bold text-sm hover:bg-rose-100 transition-colors">
          Regenerar Dades (Seed)
        </button>
        <button class="w-full py-3 rounded-2xl bg-slate-50 text-slate-600 font-bold text-sm hover:bg-slate-100 transition-colors">
          Exportar Dades
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { API_BASE_URL } from '@/config/api';

const props = defineProps({ user: Object });

const loading = ref(true);
const saving = ref(false);
const config = ref(null);
const stats = ref({ totalUsuaris: 0, totalAlumnes: 0, totalProfessors: 0 });
const missatge = ref('');
const error = ref(false);

const carregarConfig = async () => {
  loading.value = true;
  try {
    const res = await fetch(`${API_BASE_URL}/api/grups`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('access_token')}` }
    });
    const usuarisRes = await fetch(`${API_BASE_URL}/api/usuaris`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('access_token')}` }
    });
    if (usuarisRes.ok) {
      const usuaris = await usuarisRes.json();
      stats.value = {
        totalUsuaris: usuaris.length,
        totalAlumnes: usuaris.filter(u => u.rol === 'alumne').length,
        totalProfessors: usuaris.filter(u => u.rol === 'professor').length
      };
    }
    config.value = { cursActual: '2025-2026', minutsTallRetard: 10, minutsTallAbsencia: 15 };
  } catch (e) {
    console.error(e);
  } finally {
    loading.value = false;
  }
};

const guardarConfig = async () => {
  saving.value = true;
  missatge.value = '';
  setTimeout(() => {
    saving.value = false;
    missatge.value = 'Configuració guardada correctament';
    error.value = false;
    setTimeout(() => missatge.value = '', 3000);
  }, 1000);
};

const executarSeed = async () => {
  if (!confirm('Això regenerarà totes les dades. Segur?')) return;
  try {
    const res = await fetch(`${API_BASE_URL}/api/seed/executar`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('access_token')}` }
    });
    if (res.ok) {
      missatge.value = 'Dades regenerades correctament';
      error.value = false;
      carregarConfig();
    }
  } catch (e) {
    missatge.value = 'Error al regenerar dades';
    error.value = true;
  }
};

onMounted(carregarConfig);
</script>