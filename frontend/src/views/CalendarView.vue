<template>
  <div class="space-y-8 animate-fade-in">
    <!-- CAPÇALERA -->
    <div class="hero-academic shadow-xl shadow-blue-100 flex flex-col md:flex-row justify-between items-center gap-6">
      <div>
        <div class="flex items-center gap-3 mb-4">
          <span class="badge-estat bg-white/20 text-white backdrop-blur-md">Curs 2024-25</span>
          <span class="badge-estat bg-blue-400/50 text-white">Calendari Oficial</span>
        </div>
        <h2 class="text-3xl md:text-4xl font-black tracking-tight uppercase italic leading-none">Calendari Escolar</h2>
        <p class="text-blue-100 font-medium mt-2 max-w-sm uppercase text-[10px] tracking-widest font-bold">Consulta festius, períodes d'exàmens i lliuraments de projectes.</p>
      </div>
      
      <div class="bg-white p-6 rounded-2xl border border-blue-200 shadow-xl flex items-center gap-6">
        <div class="text-center">
           <p class="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-1">Avui</p>
           <p class="text-3xl font-black text-blue-700 leading-none">28</p>
           <p class="text-[10px] font-bold text-slate-500 uppercase tracking-tighter">Abril</p>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-1 xl:grid-cols-4 gap-8">
      <!-- COLUMNA ESQUERRA (CALENDARI) - Ocupa 3 de 4 columnes en pantalles extra grans -->
      <div class="xl:col-span-3 space-y-6">
        <div class="targeta-campus h-full">
          <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
             <div>
               <h3 class="font-black text-slate-900 uppercase tracking-widest text-lg flex items-center gap-2 italic">
                 Maig 2026
               </h3>
               <p class="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">Curs 2025-2026</p>
             </div>
             
             <div class="flex gap-3 items-center w-full sm:w-auto">
                <button @click="showAddModal = true" class="flex-1 sm:flex-none px-6 py-3 bg-blue-600 text-white rounded-xl flex items-center justify-center gap-2 hover:bg-blue-700 transition-all shadow-lg shadow-blue-100 text-[10px] font-black uppercase tracking-widest">
                   <AppIcon name="plus" class="w-4 h-4" />
                   <span>Afegir Esdeveniment</span>
                </button>
                <div class="flex gap-1">
                  <button class="p-2 hover:bg-slate-50 rounded-lg text-slate-400"><AppIcon name="arrow-left" class="w-4 h-4" /></button>
                  <button class="p-2 hover:bg-slate-50 rounded-lg text-slate-400"><AppIcon name="arrow-right" class="w-4 h-4" /></button>
                </div>
             </div>
          </div>

          <div class="grid grid-cols-7 gap-2 mb-4">
             <div v-for="d in diesSetmana" :key="d" class="text-center text-[9px] font-black text-slate-400 uppercase tracking-widest py-2">{{ d }}</div>
          </div>

          <div class="grid grid-cols-7 gap-2">
             <!-- Offset per Maig 2026 (comença en divendres = 4 buits: Dll, Dt, Dc, Dj) -->
             <div class="bg-transparent aspect-square"></div>
             <div class="bg-transparent aspect-square"></div>
             <div class="bg-transparent aspect-square"></div>
             <div class="bg-transparent aspect-square"></div>
             
             <div v-for="n in 31" :key="n" 
               @click="seleccionarDia(n)"
               class="aspect-square flex flex-col items-center justify-center rounded-xl border-2 transition-all cursor-pointer relative group hover:-translate-y-1"
               :class="[
                 newEvent.dia === n && showAddModal 
                   ? 'bg-white border-blue-500 ring-4 ring-blue-50 text-blue-700 z-10 shadow-lg' 
                   : (n === 4 ? 'bg-blue-600 border-blue-600 text-white shadow-md' : 'bg-slate-50 border-transparent text-slate-600 hover:bg-white hover:border-blue-100'),
                 esFestiu(n) && newEvent.dia !== n ? 'text-rose-500 font-bold' : ''
               ]"
             >
               <span class="text-sm font-black italic transition-transform group-hover:scale-110">{{ n }}</span>
               <div v-if="téEsdeveniment(n)" class="absolute bottom-2 w-1.5 h-1.5 bg-blue-400 rounded-full group-hover:bg-blue-600"></div>
             </div>
          </div>
        </div>
      </div>

      <!-- COLUMNA DRETA (ESDEVENIMENTS I FORMULARI) -->
      <div class="xl:col-span-1 space-y-6">
        
        <!-- FORMULARI INTEGRAT (NOMÉS SI showAddModal ÉS TRUE) -->
        <Transition name="slide-down">
          <div v-if="showAddModal" class="targeta-campus border-blue-200 bg-blue-50/30 overflow-hidden relative group">
             <div class="flex justify-between items-center mb-6">
                <h4 class="text-sm font-black text-slate-800 uppercase italic tracking-tighter">Nou Esdeveniment</h4>
                <button @click="showAddModal = false" class="text-slate-400 hover:text-rose-500 transition-colors">
                   <AppIcon name="close" class="w-4 h-4" />
                </button>
             </div>

             <div class="space-y-5">
                <div class="space-y-2">
                   <label class="text-[8px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Títol de la fita</label>
                   <input v-model="newEvent.titol" placeholder="Ex: Examen M7..." class="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-xs font-bold focus:outline-none focus:border-blue-500 transition-all shadow-sm" />
                </div>

                <div class="grid grid-cols-2 gap-4">
                   <div class="space-y-2">
                      <label class="text-[8px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Tipus</label>
                      <select v-model="newEvent.tipus" class="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-xs font-bold focus:outline-none cursor-pointer">
                         <option>Examen</option>
                         <option>Entrega</option>
                         <option>Festiu</option>
                      </select>
                   </div>
                   <div class="space-y-2">
                      <label class="text-[8px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Dia d'Abril</label>
                      <input v-model="newEvent.dia" type="number" min="1" max="30" class="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-xs font-bold focus:outline-none" />
                   </div>
                </div>

                <button @click="addEvent" class="w-full py-4 bg-blue-600 text-white rounded-xl text-[9px] font-black uppercase tracking-widest shadow-lg shadow-blue-100 hover:bg-blue-700 transition-all mt-2">
                   Publicar Esdeveniment
                </button>
             </div>
             <!-- Decoració integrada -->
             <div class="absolute -bottom-4 -right-4 w-12 h-12 bg-blue-500/10 rounded-full blur-xl"></div>
          </div>
        </Transition>

        <div class="targeta-campus">
          <h3 class="font-black text-slate-800 uppercase tracking-widest text-[10px] mb-8 flex items-center gap-2">
            <div class="w-1 h-3 bg-blue-600 rounded-full"></div>
            Pròxims Esdeveniments
          </h3>
          
          <div class="space-y-4">
            <div v-for="ev in esdeveniments" :key="ev.id" class="p-4 bg-slate-50 rounded-2xl border-l-4 border-transparent hover:border-blue-600 transition-all group">
               <div class="flex justify-between items-start mb-2">
                  <span class="text-[9px] font-black text-blue-600 uppercase tracking-widest">{{ ev.data }}</span>
                  <span class="badge-estat" :class="ev.tipus === 'Examen' ? 'bg-rose-50 text-rose-600' : 'bg-blue-50 text-blue-600'">{{ ev.tipus }}</span>
               </div>
               <h4 class="text-xs font-bold text-slate-800 uppercase tracking-tight">{{ ev.titol }}</h4>
            </div>
            <div v-if="esdeveniments.length === 0" class="py-12 text-center text-slate-300 text-[10px] font-black uppercase">No hi ha esdeveniments</div>
          </div>
        </div>

        <div class="targeta-campus bg-slate-900 text-white border-none">
           <h3 class="font-black text-blue-300 uppercase tracking-widest text-[10px] mb-4">Llegenda</h3>
           <div class="space-y-3">
              <div class="flex items-center gap-3">
                 <div class="w-2 h-2 bg-blue-500 rounded-full"></div>
                 <span class="text-[10px] font-bold uppercase">Lectiu / Entregues</span>
              </div>
              <div class="flex items-center gap-3">
                 <div class="w-2 h-2 bg-rose-500 rounded-full"></div>
                 <span class="text-[10px] font-bold uppercase">Festiu / Vacances</span>
              </div>
           </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import AppIcon from '../components/shared/AppIcon.vue';

const diesSetmana = ['Dll', 'Dt', 'Dc', 'Dj', 'Dv', 'Ds', 'Dg'];
const showAddModal = ref(false);
const newEvent = ref({ titol: '', tipus: 'Examen', dia: null });

const esdeveniments = ref([
  { id: 1, titol: 'Presentació Final ADSUM', data: '22 Maig', tipus: 'Examen', dia: 22 },
  { id: 2, titol: 'Lliurament Memòria TR', data: '15 Maig', tipus: 'Entrega', dia: 15 },
  { id: 3, titol: 'Festa de Graduació', data: '29 Maig', tipus: 'Festiu', dia: 29 }
]);

const esFestiu = (dia) => dia === 1 || dia === 29;
const téEsdeveniment = (dia) => esdeveniments.value.some(ev => ev.dia === dia);

const seleccionarDia = (dia) => {
  newEvent.value.dia = dia;
  showAddModal.value = true;
};

const addEvent = () => {
  if (!newEvent.value.titol || !newEvent.value.dia) return;
  
  esdeveniments.value.push({
    id: Date.now(),
    titol: newEvent.value.titol,
    tipus: newEvent.value.tipus,
    data: `${newEvent.value.dia} Maig`,
    dia: parseInt(newEvent.value.dia)
  });
  
  showAddModal.value = false;
  newEvent.value = { titol: '', tipus: 'Examen', dia: null };
};
</script>

<style scoped>
.slide-down-enter-active,
.slide-down-leave-active {
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
  max-height: 500px;
}

.slide-down-enter-from,
.slide-down-leave-to {
  opacity: 0;
  max-height: 0;
  transform: translateY(-20px);
  margin-bottom: 0;
  padding-top: 0;
  padding-bottom: 0;
}
</style>
