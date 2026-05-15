<template>
  <div class="space-y-8 animate-fade-in">
    <!-- CAPÇALERA -->
    <div class="hero-academic shadow-xl shadow-blue-100 flex flex-col md:flex-row justify-between items-center gap-6">
      <div>
        <div class="flex items-center gap-3 mb-4">
          <span class="badge-estat bg-white/20 text-white backdrop-blur-md">Gestió de Recursos</span>
          <span class="badge-estat bg-emerald-500/80 text-white">Reserves Actives</span>
        </div>
        <h2 class="text-3xl md:text-4xl font-black tracking-tight uppercase italic leading-none">Reserva d'Espais</h2>
        <p class="text-blue-100 font-medium mt-2 max-w-sm uppercase text-[10px] tracking-widest font-bold">Reserva aules d'informàtica, laboratoris o material del centre.</p>
      </div>
      
      <div class="bg-white p-6 rounded-2xl border border-blue-200 shadow-xl flex items-center gap-6 min-w-[200px]">
        <div>
          <p class="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-1">Les Teves Reserves</p>
          <div class="flex items-center gap-2">
             <div class="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
             <p class="text-[10px] font-bold text-slate-500 uppercase tracking-tighter">Properes Sessions</p>
          </div>
        </div>
        <p class="text-5xl font-black text-blue-700 tracking-tighter leading-none italic">{{ userBookings.length }}</p>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <!-- SELECCIÓ DE RECURS -->
      <div class="lg:col-span-2 space-y-6">
        <div class="targeta-campus">
          <div class="flex justify-between items-center mb-8">
            <h3 class="font-black text-slate-900 uppercase tracking-widest text-[10px] flex items-center gap-2">
              <div class="w-1 h-4 bg-blue-600 rounded-full"></div>
              Espais Disponibles
            </h3>
            <div class="flex gap-2">
               <button v-for="cat in categories" :key="cat" @click="selectedCat = cat"
                 class="px-3 py-1.5 rounded-lg text-[8px] font-black uppercase tracking-widest transition-all"
                 :class="selectedCat === cat ? 'bg-blue-600 text-white shadow-sm' : 'bg-slate-50 text-slate-400 border border-slate-100 hover:bg-slate-100'"
               >
                 {{ cat }}
               </button>
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div v-for="space in filteredSpaces" :key="space.id" 
              @click="selectSpace(space)"
              class="p-4 rounded-2xl border border-slate-100 bg-slate-50/50 cursor-pointer transition-all hover:border-blue-200 hover:bg-white group"
              :class="{ '!border-blue-500 !bg-blue-50/30': selectedSpace?.id === space.id }"
            >
              <div class="flex items-start justify-between mb-4">
                <div class="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-slate-400 group-hover:text-blue-600 shadow-sm border border-slate-50">
                  <AppIcon :name="space.tipus === 'aula' ? 'home' : 'tool'" class="w-5 h-5" />
                </div>
                <span class="text-[8px] font-black uppercase tracking-widest px-2 py-1 rounded-md" :class="space.disponible ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'">
                  {{ space.disponible ? 'Disponible' : 'Ocupat' }}
                </span>
              </div>
              <h4 class="font-black text-slate-800 text-sm group-hover:text-blue-700 transition-colors uppercase">{{ space.nom }}</h4>
              <p class="text-[9px] text-slate-400 font-bold uppercase tracking-widest mt-1">{{ space.capacitat }} Persones · {{ space.equipament }}</p>
            </div>
          </div>
        </div>

        <!-- CALENDARI DE SLOTS (Si s'ha seleccionat espai) -->
        <div v-if="selectedSpace" class="targeta-campus animate-fade-in">
           <h3 class="font-black text-slate-900 uppercase tracking-widest text-[10px] mb-8 flex items-center gap-2">
            <div class="w-1 h-4 bg-blue-600 rounded-full"></div>
            Slots Disponibles: {{ selectedSpace.name }}
          </h3>
          
          <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
            <button v-for="slot in slots" :key="slot" 
              @click="toggleSlot(slot)"
              class="p-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border"
              :class="selectedSlots.includes(slot) 
                ? 'bg-blue-600 text-white border-blue-600 shadow-lg shadow-blue-100' 
                : 'bg-white text-slate-500 border-slate-200 hover:border-blue-300'"
            >
              {{ slot }}
            </button>
          </div>

          <div class="mt-10 pt-8 border-t border-slate-100 flex justify-between items-center">
             <div>
               <p class="text-[9px] font-black text-slate-400 uppercase tracking-widest">Reserva per a</p>
               <p class="text-xs font-bold text-slate-800 uppercase">{{ selectedSlots.length }} Franges Seleccionades</p>
             </div>
             <button @click="confirmBooking" :disabled="selectedSlots.length === 0" class="boto-academic px-8 h-12">
               Confirmar Reserva
             </button>
          </div>
        </div>
      </div>

      <!-- EL TEU HISTÒRIC -->
      <div class="space-y-6">
        <div class="targeta-campus">
          <h3 class="font-black text-slate-800 uppercase tracking-widest text-[10px] mb-8 flex items-center gap-2">
            <div class="w-1 h-3 bg-emerald-500 rounded-full"></div>
            Pròximes Reserves
          </h3>
          
          <div class="space-y-3">
            <div v-for="b in userBookings" :key="b.id" class="p-4 bg-slate-50 rounded-2xl border border-transparent hover:border-blue-100 transition-all group">
              <div class="flex justify-between items-start mb-3">
                 <span class="text-[9px] font-black text-blue-600 uppercase tracking-widest">{{ b.espai?.nom }}</span>
                 <button @click="cancelBooking(b.id)" class="text-slate-300 hover:text-rose-500 transition-colors">
                   <AppIcon name="trash" class="w-3.5 h-3.5" />
                 </button>
              </div>
              <p class="text-xs font-bold text-slate-700 uppercase">{{ b.data }}</p>
              <p class="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">{{ b.franja }}</p>
            </div>
            
            <div v-if="userBookings.length === 0" class="py-12 text-center text-slate-400 text-[10px] font-black uppercase tracking-widest">
              No tens reserves actives
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import AppIcon from '../components/shared/AppIcon.vue';
import { API_BASE_URL } from '@/config/api';

const selectedCat = ref('Totes');
const selectedSpace = ref(null);
const selectedSlots = ref([]);
const spaces = ref([]);
const userBookings = ref([]);

const categories = ['Totes', 'Aules', 'Labs', 'Material'];
const slots = ['08:00 - 09:00', '09:00 - 10:00', '10:00 - 11:00', '11:30 - 12:30', '12:30 - 13:30', '15:00 - 16:00', '16:00 - 17:00'];

const carregarDades = async () => {
  try {
    const token = localStorage.getItem('access_token');
    
    // Carregar espais
    const resEspais = await fetch(`${API_BASE_URL}/reserves/espais`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (resEspais.ok) spaces.value = await resEspais.json();

    // Carregar reserves meves
    const resMeves = await fetch(`${API_BASE_URL}/reserves/meves`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (resMeves.ok) userBookings.value = await resMeves.json();
  } catch (err) {
    console.error('Error carregant dades de reserves:', err);
  }
};

onMounted(() => {
  carregarDades();
});

const filteredSpaces = computed(() => {
  if (selectedCat.value === 'Totes') return spaces.value;
  return spaces.value.filter(s => s.tipus.toLowerCase() === selectedCat.value.toLowerCase().replace('s', ''));
});

const selectSpace = (space) => {
  if (!space.disponible) return;
  selectedSpace.value = space;
  selectedSlots.value = [];
};

const toggleSlot = (slot) => {
  const idx = selectedSlots.value.indexOf(slot);
  if (idx > -1) selectedSlots.value.splice(idx, 1);
  else selectedSlots.value.push(slot);
};

const confirmBooking = async () => {
  try {
    const token = localStorage.getItem('access_token');
    const avui = new Date().toISOString().split('T')[0];

    for (const franja of selectedSlots.value) {
      await fetch(`${API_BASE_URL}/reserves/crear`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          espaiId: selectedSpace.value.id,
          data: avui,
          franja: franja
        })
      });
    }

    await carregarDades();
    selectedSpace.value = null;
    selectedSlots.value = [];
  } catch (err) {
    console.error('Error confirmant reserva:', err);
  }
};

const cancelBooking = async (id) => {
  try {
    const token = localStorage.getItem('access_token');
    const res = await fetch(`${API_BASE_URL}/reserves/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (res.ok) await carregarDades();
  } catch (err) {
    console.error('Error cancel·lant reserva:', err);
  }
};
</script>
