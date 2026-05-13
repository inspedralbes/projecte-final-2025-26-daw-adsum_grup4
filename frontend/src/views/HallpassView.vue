<template>
  <div class="space-y-6">
    <div class="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100">
      <h2 class="text-sm font-black text-slate-400 uppercase tracking-widest mb-4">Sol·licita un passe</h2>
      
      <div class="space-y-4">
        <div>
          <label class="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Motiu</label>
          <select v-model="motiu" class="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-100 text-slate-800 font-bold text-sm focus:outline-none focus:ring-4 focus:ring-indigo-500/10">
            <option value="bany">Bany</option>
            <option value="secretaria">Secretaria</option>
            <option value="infermeria">Infermeria</option>
            <option value="altres">Altres</option>
          </select>
        </div>

        <div>
          <label class="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Durada (minuts)</label>
          <input v-model.number="durada" type="number" min="5" max="60" class="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-100 text-slate-800 font-bold text-sm focus:outline-none focus:ring-4 focus:ring-indigo-500/10" />
        </div>

        <button @click="sollicitarPasse" :disabled="loading"
          class="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-black uppercase tracking-widest text-xs py-4 px-6 rounded-2xl shadow-lg shadow-indigo-500/30 transition-all disabled:opacity-50">
          {{ loading ? 'Enviant...' : 'Sol·licitar Passe' }}
        </button>
      </div>
    </div>

    <div v-if="sortidaActiva" class="bg-emerald-50 p-6 rounded-[2rem] border-2 border-emerald-200">
      <div class="text-center">
        <p class="text-[10px] font-black text-emerald-600 uppercase tracking-widest mb-2">Passe Actiu</p>
        <p class="text-2xl font-black text-emerald-700">Has sortit: {{ motiuLabel(sortidaActiva.motiu) }}</p>
        <p class="text-sm text-emerald-600 mt-2">Ves tornant quan acabis</p>
        <button @click="tornar" class="mt-4 bg-emerald-600 hover:bg-emerald-700 text-white font-black uppercase tracking-widest text-xs py-3 px-6 rounded-xl">
          Registrar Tornada
        </button>
      </div>
    </div>

    <div class="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100">
      <h2 class="text-sm font-black text-slate-400 uppercase tracking-widest mb-4">Historial</h2>
      <div class="space-y-3">
        <div v-for="s in historial" :key="s.id" class="flex items-center justify-between py-3 border-b border-slate-50 last:border-0">
          <div>
            <p class="text-sm font-bold text-slate-700">{{ motiuLabel(s.motiu) }}</p>
            <p class="text-[10px] text-slate-400">{{ formatData(s.horaSortida) }}</p>
          </div>
          <span class="text-[10px] font-black px-2 py-1 rounded-full uppercase"
            :class="s.horaTornada ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'">
            {{ s.horaTornada ? 'Completat' : 'Actiu' }}
          </span>
        </div>
        <p v-if="!historial.length" class="text-center text-slate-400 text-sm">No hi ha historial</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { API_BASE_URL } from '@/config/api';

const props = defineProps({ user: Object });

const motiu = ref('bany');
const durada = ref(15);
const loading = ref(false);
const historial = ref([]);
const sortidaActiva = ref(null);

const motiuLabel = (m) => {
  const labels = { bany: 'Bany', secretaria: 'Secretaria', infermeria: 'Infermeria', altres: 'Altres' };
  return labels[m] || m;
};

const formatData = (d) => new Date(d).toLocaleString('ca-ES', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' });

const carregarHistorial = async () => {
  const res = await fetch(`${API_BASE_URL}/hallpass/alumne/${props.user.id}`, {
    headers: { Authorization: `Bearer ${localStorage.getItem('access_token')}` }
  });
  if (res.ok) {
    historial.value = await res.json();
    sortidaActiva.value = historial.value.find(s => !s.horaTornada) || null;
  }
};

const sollicitarPasse = async () => {
  loading.value = true;
  const res = await fetch(`${API_BASE_URL}/hallpass/crear`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${localStorage.getItem('access_token')}` },
    body: JSON.stringify({ alumneId: props.user.id, motiu: motiu.value, duradaMinuts: durada.value })
  });
  loading.value = false;
  if (res.ok) carregarHistorial();
};

const tornar = async () => {
  if (!sortidaActiva.value) return;
  await fetch(`${API_BASE_URL}/hallpass/${sortidaActiva.value.id}/tornada`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${localStorage.getItem('access_token')}` }
  });
  carregarHistorial();
};

onMounted(carregarHistorial);
</script>