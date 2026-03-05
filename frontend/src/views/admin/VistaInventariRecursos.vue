<template>
  <div class="animate-fade-in space-y-6">
    <header class="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <h2 class="text-2xl font-black text-slate-800 tracking-tight italic uppercase">Inventari i Recursos</h2>
        <p class="text-slate-500 text-sm mt-1">Gestió d'espais i eines compartides del centre</p>
      </div>
      <button @click="showModal = true" class="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl font-bold text-sm transition-colors self-start shadow-sm shadow-indigo-200 flex items-center gap-1.5">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-4 h-4">
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
        </svg>
        Nou Recurs
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

    <!-- MODAL NOU RECURS -->
    <div v-if="showModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fade-in text-slate-900">
      <div class="bg-white rounded-2xl shadow-xl w-full max-w-sm overflow-hidden flex flex-col max-h-[90vh]">
        <header class="p-4 border-b border-slate-100 flex justify-between items-center bg-white sticky top-0 z-10">
          <div>
            <h3 class="font-black text-lg text-slate-800 italic uppercase tracking-tight">Afegir Material</h3>
            <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Nou Registre a l'Inventari</p>
          </div>
          <button @click="tancarModal" class="w-8 h-8 flex justify-center items-center rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors">✕</button>
        </header>

        <form @submit.prevent="guardarRecurs" class="p-6 space-y-5 overflow-y-auto">
          <div>
            <label class="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Nom Material / Espai *</label>
            <input v-model="nouRecurs.nom" type="text" required class="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all placeholder:text-slate-300 font-medium" placeholder="Ex: Carretó Portàtils B" />
          </div>

          <div>
            <label class="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Tipologia *</label>
            <select v-model="nouRecurs.tipus" required class="w-full border border-slate-200 bg-white rounded-xl px-4 py-2.5 text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all font-bold text-slate-700">
              <option value="Maquinari">💻 Maquinari (Equips)</option>
              <option value="Espai">🏛️ Espai Compartit</option>
              <option value="Digital">🌐 Llicència / Servei</option>
            </select>
          </div>

          <div class="pt-2 flex justify-end gap-3">
            <button type="button" @click="tancarModal" class="px-5 py-2.5 text-sm font-bold text-slate-500 hover:text-slate-700 hover:bg-slate-200 rounded-xl transition-colors">
              Cancel·lar
            </button>
            <button type="submit" :disabled="saving" class="px-6 py-2.5 text-sm font-black text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-sm shadow-indigo-200 transition-all active:scale-95 disabled:opacity-50">
              {{ saving ? 'Processant...' : 'Enregistrar' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const recursos = ref([]);
const loading = ref(true);
const showModal = ref(false);
const saving = ref(false);

const nouRecurs = ref({
  nom: '',
  tipus: 'Maquinari'
});

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

const tancarModal = () => {
  showModal.value = false;
  nouRecurs.value = { nom: '', tipus: 'Maquinari' };
};

const guardarRecurs = async () => {
  saving.value = true;
  try {
    const res = await fetch('/api/admin/recursos', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('access_token')}`
      },
      body: JSON.stringify(nouRecurs.value)
    });
    
    if (!res.ok) throw new Error('Fallada al crear recurs');
    
    const dadesDesades = await res.json();
    recursos.value.push(dadesDesades);
    tancarModal();
  } catch (err) {
    alert(err.message);
  } finally {
    saving.value = false;
  }
};

onMounted(() => carregarRecursos());
</script>
