<template>
  <div class="animate-fade-in space-y-6">
    <header class="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <h2 class="text-2xl font-black text-slate-800 tracking-tight italic uppercase">Gestió d'Usuaris</h2>
        <p class="text-slate-500 text-sm mt-1">Administració de perfils: alumnat, professorat i famílies</p>
      </div>
      <button @click="obrirModal(null)" class="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl font-bold text-sm transition-colors self-start shadow-sm shadow-indigo-200">
        + Nou Usuari
      </button>
    </header>

    <div class="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
      <div class="p-4 border-b border-slate-100 flex gap-2 overflow-x-auto">
        <button 
          v-for="rol in ['tots', 'alumne', 'professor', 'admin', 'familiar']" :key="rol"
          @click="filtreRol = rol"
          class="px-4 py-2 rounded-lg text-sm font-bold uppercase tracking-wider transition-colors whitespace-nowrap"
          :class="filtreRol === rol ? 'bg-indigo-50 text-indigo-700' : 'text-slate-500 hover:bg-slate-50'"
        >
          {{ rol }}
        </button>
      </div>

      <div v-if="loading" class="flex justify-center p-12">
        <div class="w-8 h-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
      </div>
      
      <div v-else-if="error" class="bg-red-50 text-red-600 p-4 m-4 rounded-xl text-sm font-medium">
        {{ error }}
      </div>

      <div v-else class="overflow-x-auto">
        <table class="w-full text-left border-collapse min-w-[600px]">
          <thead>
            <tr class="bg-slate-50/50 text-xs uppercase tracking-wider text-slate-500 font-bold border-b border-slate-100">
              <th class="p-4 font-bold">Nom i Cognoms</th>
              <th class="p-4 font-bold">Correu / DNI</th>
              <th class="p-4 font-bold">Rol</th>
              <th class="p-4 font-bold">Estat</th>
              <th class="p-4 font-bold text-right">Accions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100">
            <tr v-for="usuari in usuarisFiltrats" :key="usuari.id" class="hover:bg-slate-50/50 transition-colors">
              <td class="p-4">
                <div class="font-bold text-slate-800">{{ usuari.nom }} {{ usuari.cognoms }}</div>
                <div class="text-xs text-slate-400 font-medium">ID: {{ usuari.id }}</div>
              </td>
              <td class="p-4 text-sm text-slate-600">
                <div>{{ usuari.email }}</div>
                <div class="text-xs text-slate-400 font-mono">{{ usuari.dniNie || 'SENSE DNI' }}</div>
              </td>
              <td class="p-4">
                <span class="px-2 py-1 rounded-md text-[10px] font-black uppercase tracking-widest"
                  :class="{
                    'bg-blue-50 text-blue-600': usuari.rol === 'alumne',
                    'bg-emerald-50 text-emerald-600': usuari.rol === 'professor',
                    'bg-purple-50 text-purple-600': usuari.rol === 'admin',
                    'bg-orange-50 text-orange-600': usuari.rol === 'familiar'
                  }">
                  {{ usuari.rol }}
                </span>
              </td>
              <td class="p-4">
                <span class="flex items-center gap-1.5 text-xs font-bold" :class="usuari.esActiu ? 'text-emerald-500' : 'text-slate-400'">
                  <div class="w-2 h-2 rounded-full" :class="usuari.esActiu ? 'bg-emerald-500' : 'bg-slate-300'"></div>
                  {{ usuari.esActiu ? 'Actiu' : 'Inactiu' }}
                </span>
              </td>
              <td class="p-4 text-right space-x-2">
                <button @click="obrirModal(usuari)" class="text-indigo-600 hover:bg-indigo-50 p-2 rounded-lg transition-colors text-sm font-bold">
                  Editar
                </button>
                <button @click="eliminarUsuari(usuari.id)" class="text-red-500 hover:bg-red-50 p-2 rounded-lg transition-colors text-sm font-bold">
                  Esborrar
                </button>
              </td>
            </tr>
            <tr v-if="usuarisFiltrats.length === 0">
              <td colspan="5" class="p-8 text-center text-slate-400 text-sm font-medium">
                No hi ha usuaris per mostrar en aquesta categoria.
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- MODAL -->
    <div v-if="showModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fade-in text-slate-900">
      <div class="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
        <header class="p-4 border-b border-slate-100 flex justify-between items-center bg-white sticky top-0 z-10">
          <div>
            <h3 class="font-black text-lg text-slate-800 italic uppercase tracking-tight">{{ usuariActiu.id ? 'Editar Usuari' : 'Nou Usuari' }}</h3>
            <p v-if="usuariActiu.id" class="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">ID: {{ usuariActiu.id }}</p>
          </div>
          <button @click="tancarModal" class="w-8 h-8 flex justify-center items-center rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors">✕</button>
        </header>

        <div class="p-6 space-y-5 overflow-y-auto">
          <!-- Nom i Cognoms -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Nom *</label>
              <input v-model="usuariActiu.nom" type="text" required class="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all placeholder:text-slate-300 font-medium" placeholder="Ex: Maria" />
            </div>
            <div>
              <label class="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Cognoms *</label>
              <input v-model="usuariActiu.cognoms" type="text" required class="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all placeholder:text-slate-300 font-medium" placeholder="Ex: Garcia Puig" />
            </div>
          </div>

          <!-- Correu i DNI -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Correu Electrònic *</label>
              <input v-model="usuariActiu.email" type="email" required class="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all placeholder:text-slate-300 font-medium" placeholder="Ex: m.garcia@adsum.cat" />
            </div>
            <div>
              <label class="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">DNI / NIE / PASSAPORT</label>
              <input v-model="usuariActiu.dniNie" type="text" class="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all placeholder:text-slate-300 font-medium uppercase" placeholder="Opcional" />
            </div>
          </div>

          <!-- Rol i Contrasenya -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Rol a la Plataforma</label>
              <select v-model="usuariActiu.rol" class="w-full border border-slate-200 bg-white rounded-xl px-4 py-2.5 text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all font-bold text-slate-700">
                <option value="alumne">👨‍🎓 Alumne/a</option>
                <option value="professor">👨‍🏫 Professor/a</option>
                <option value="admin">🛡️ Administrador</option>
                <option value="familia">👨‍👩‍👦 Familiar</option>
              </select>
            </div>
            <div>
              <label class="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">
                Contrasenya {{ usuariActiu.id ? '(Nova)' : '*' }}
              </label>
              <input v-model="usuariActiu.contrasenya" type="password" class="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all placeholder:text-slate-300 font-medium font-mono" :placeholder="usuariActiu.id ? 'Deixar en blanc per no canviar' : 'Deixa buida per default (password123)'" />
            </div>
          </div>

          <!-- Switch d'Estat -->
          <div class="pt-2">
            <label class="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Estat de l'Usuari</label>
            <div class="flex items-center gap-3 bg-slate-50 p-3 rounded-xl border border-slate-100 cursor-pointer" @click="usuariActiu.esActiu = !usuariActiu.esActiu">
              <div class="relative w-10 h-6 rounded-full transition-colors duration-200 ease-in-out" :class="usuariActiu.esActiu ? 'bg-emerald-500' : 'bg-slate-300'">
                <div class="absolute w-4 h-4 bg-white rounded-full top-1 transition-transform duration-200 ease-in-out shadow-sm" :class="usuariActiu.esActiu ? 'translate-x-5' : 'translate-x-1'"></div>
              </div>
              <span class="text-sm font-bold" :class="usuariActiu.esActiu ? 'text-emerald-700' : 'text-slate-500'">
                {{ usuariActiu.esActiu ? 'Compte Actiu (Pot accedir)' : 'Compte Inactiu (Accés Bloquejat)' }}
              </span>
            </div>
          </div>
        </div>
        
        <footer class="p-4 bg-slate-50 flex justify-end gap-3 border-t border-slate-100 flex-shrink-0">
          <button @click="tancarModal" class="px-5 py-2.5 text-sm font-bold text-slate-500 hover:text-slate-700 hover:bg-slate-200 rounded-xl transition-colors">
            Cancel·lar
          </button>
          <button @click="guardarUsuari" :disabled="saving" class="px-6 py-2.5 text-sm font-black text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-sm shadow-indigo-200 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-wait">
            {{ saving ? 'Processant...' : (usuariActiu.id ? 'Desar Canvis' : 'Crear Usuari') }}
          </button>
        </footer>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';

const usuaris = ref([]);
const loading = ref(true);
const error = ref(null);
const filtreRol = ref('tots');

// Control del Modal
const showModal = ref(false);
const saving = ref(false);
const usuariActiu = ref({
  nom: '',
  cognoms: '',
  email: '',
  dniNie: '',
  rol: 'alumne',
  esActiu: true,
  contrasenya: ''
});

const usuarisFiltrats = computed(() => {
  if (filtreRol.value === 'tots') return usuaris.value;
  return usuaris.value.filter(u => u.rol === filtreRol.value);
});

const carregarUsuaris = async () => {
  try {
    loading.value = true;
    const res = await fetch('/api/admin/usuaris', {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('access_token')}` }
    });
    if (!res.ok) { if (res.status === 401) { localStorage.removeItem('access_token'); window.location.href = '/login'; } throw new Error('Error carregant el directori d\'usuaris'); }
    usuaris.value = await res.json();
  } catch (err) {
    error.value = err.message;
  } finally {
    loading.value = false;
  }
};

const obrirModal = (usuari = null) => {
  if (usuari) {
    // Edició
    usuariActiu.value = { ...usuari, contrasenya: '' }; // Buidem la contrasenya del payload d'edició per defecte
  } else {
    // Creació
    usuariActiu.value = {
      nom: '', cognoms: '', email: '', dniNie: '', rol: 'alumne', esActiu: true, contrasenya: ''
    };
  }
  showModal.value = true;
};

const tancarModal = () => {
  showModal.value = false;
};

const guardarUsuari = async () => {
  saving.value = true;
  try {
    const isEditing = !!usuariActiu.value.id;
    const method = isEditing ? 'PUT' : 'POST';
    const url = isEditing 
      ? `/api/admin/usuaris/${usuariActiu.value.id}` 
      : `/api/admin/usuaris`;

    // Netejem la contrasenya si està buida al editar per no matxacar-la
    const dadesFormulari = { ...usuariActiu.value };
    if (isEditing && !dadesFormulari.contrasenya) {
      delete dadesFormulari.contrasenya;
    }

    const res = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('access_token')}`
      },
      body: JSON.stringify(dadesFormulari)
    });

    if (!res.ok) {
      const resp = await res.json();
      throw new Error(resp.message || 'Error en guardar');
    }
    
    const usuariDesat = await res.json();
    
    if (isEditing) {
      const idx = usuaris.value.findIndex(u => u.id === usuariDesat.id);
      if (idx !== -1) usuaris.value[idx] = usuariDesat;
    } else {
      usuaris.value.push(usuariDesat);
    }
    
    tancarModal();
  } catch (err) {
    alert(err.message);
  } finally {
    saving.value = false;
  }
};

const eliminarUsuari = async (id) => {
  if (!confirm("N'estàs segur que vols eliminar aquest usuari? Aquesta acció és irreversible.")) return;
  
  try {
    const res = await fetch(`/api/admin/usuaris/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${localStorage.getItem('access_token')}` }
    });
    if (!res.ok) { if (res.status === 401) { localStorage.removeItem('access_token'); window.location.href = '/login'; } throw new Error('Fallo en eliminar'); }
    usuaris.value = usuaris.value.filter(u => u.id !== id);
  } catch(err) {
    alert(err.message);
  }
};

onMounted(() => {
  carregarUsuaris();
});
</script>
