<template>
  <div class="animate-fade-in space-y-6">
    <header class="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <h2 class="text-2xl font-black text-slate-800 tracking-tight italic uppercase">Inventari i Recursos</h2>
        <p class="text-slate-500 text-sm mt-1">Gestió d'espais i eines compartides del centre</p>
      </div>
      <button class="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl font-bold text-sm transition-colors self-start shadow-sm shadow-indigo-200">
        + Nou Recurs
      </button>
    </header>

    <div v-if="loading" class="flex justify-center p-12">
      <div class="w-8 h-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
    </div>

    <div v-else class="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      <table class="w-full text-left border-collapse">
        <thead>
          <tr class="bg-slate-50/50 text-xs uppercase tracking-wider text-slate-500 font-bold border-b border-slate-100">
            <th class="p-4 font-bold">Nom del Recurs</th>
            <th class="p-4 font-bold">Tipus</th>
            <th class="p-4 font-bold">Estat Operatiu</th>
            <th class="p-4 font-bold text-right">Accions</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-100">
          <tr v-for="recurs in recursos" :key="recurs.id" class="hover:bg-slate-50/50 transition-colors">
            <td class="p-4">
              <div class="font-bold text-slate-800">{{ recurs.nom }}</div>
              <div class="text-xs text-slate-400 font-mono mt-0.5">ID: REC-{{ recurs.id }}</div>
            </td>
            <td class="p-4">
               <span class="px-2 py-1 bg-slate-100 text-slate-600 rounded-md text-[10px] font-black uppercase tracking-widest">
                  {{ recurs.tipus }}
               </span>
            </td>
            <td class="p-4">
              <span class="flex items-center gap-1.5 text-xs font-bold" :class="recurs.estat === 'operatiu' ? 'text-emerald-500' : 'text-amber-500'">
                <div class="w-2 h-2 rounded-full" :class="recurs.estat === 'operatiu' ? 'bg-emerald-500' : 'bg-amber-500'"></div>
                {{ recurs.estat === 'operatiu' ? 'Disponible per reserva' : 'En Manteniment' }}
              </span>
            </td>
            <td class="p-4 text-right">
               <button @click="canviarEstat(recurs)" class="text-sm font-bold text-indigo-600 hover:bg-indigo-50 px-3 py-1.5 rounded-lg transition-colors">
                 {{ recurs.estat === 'operatiu' ? 'Bloquejar (Manteniment)' : 'Restaurar Operativitat' }}
               </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const recursos = ref([]);
const loading = ref(true);

const carregarRecursos = async () => {
  try {
    const res = await fetch('/api/admin/recursos', {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('access_token')}` }
    });
    if(res.ok) recursos.value = await res.json();
  } finally {
    loading.value = false;
  }
};

const canviarEstat = async (recurs) => {
  const nouEstat = recurs.estat === 'operatiu' ? 'manteniment' : 'operatiu';
  try {
    const res = await fetch(`/api/admin/recursos/${recurs.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('access_token')}`
      },
      body: JSON.stringify({ estat: nouEstat })
    });
    if(res.ok) recurs.estat = nouEstat;
  } catch(e) {
    alert('Error actualitzant estat');
  }
};

onMounted(() => carregarRecursos());
</script>
