<template>
  <div class="space-y-6">
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-2">
      <div class="flex items-center gap-4">
        <button @click="$emit('back')" class="p-2 hover:bg-slate-100 rounded-xl transition-colors">
          <AppIcon name="arrow-left" class="w-6 h-6 text-slate-600" />
        </button>
        <div>
          <h2 class="text-2xl font-black text-slate-800 tracking-tight uppercase italic">{{ modul.nom }}</h2>
          <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest">{{ modul.grup?.nom }} · {{ modul.codi }}</p>
        </div>
      </div>

      <!-- TABS NAVIGATION -->
      <div class="flex bg-slate-100/50 p-1 rounded-2xl border border-slate-100">
        <button
          v-for="tab in tabs" :key="tab.id"
          @click="activeTab = tab.id"
          class="px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all"
          :class="activeTab === tab.id ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'"
        >
          {{ tab.name }}
        </button>
      </div>
      <div class="flex gap-2">
        <button @click="exportData('csv')" class="px-3 py-2 bg-white border border-slate-200 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-600 hover:bg-slate-50 transition-all flex items-center gap-2">
          <AppIcon name="download" class="w-3 h-3" /> CSV
        </button>
        <button @click="exportData('pdf')" class="px-3 py-2 bg-white border border-slate-200 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-600 hover:bg-slate-50 transition-all flex items-center gap-2">
          <AppIcon name="file-text" class="w-3 h-3" /> PDF
        </button>
      </div>
    </div>

    <!-- TAB 1: ASSISTÈNCIA -->
    <div v-if="activeTab === 'attendance'" class="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-in fade-in duration-300">
      <!-- CODE GENERATOR -->
      <div class="lg:col-span-1 space-y-6">
        <!-- CONFIGURATION CARD -->
        <div class="bg-white rounded-[2.5rem] p-6 border border-slate-100 shadow-sm">
          <h3 class="font-black text-slate-800 uppercase tracking-widest text-[10px] mb-4 text-center">Configuració de Temps</h3>
          <div class="space-y-4">
            <div>
              <label class="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Minuts per Retard</label>
              <div class="relative">
                <input type="number" v-model="lateMinutes" class="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-2 text-sm font-bold text-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/20" />
                <span class="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-black text-slate-300">MIN</span>
              </div>
            </div>
            <div>
              <label class="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Minuts per Falta</label>
              <div class="relative">
                <input type="number" v-model="absentMinutes" class="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-2 text-sm font-bold text-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/20" />
                <span class="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-black text-slate-300">MIN</span>
              </div>
            </div>
            <div>
              <label class="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Durada Total Codi</label>
              <div class="relative">
                <input type="number" v-model="validityMinutes" class="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-2 text-sm font-bold text-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/20" />
                <span class="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-black text-slate-300">MIN</span>
              </div>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm flex flex-col items-center text-center">
          <div class="w-16 h-16 bg-indigo-50 rounded-3xl flex items-center justify-center text-indigo-600 mb-6">
            <AppIcon name="qr" class="w-9 h-9" />
          </div>
          <h3 class="font-black text-slate-800 uppercase tracking-widest text-xs mb-8">Codi d'Assistència</h3>
          
          <div class="flex gap-2 mb-8">
            <div v-for="(digit, i) in codeDisplay" :key="i" 
              class="w-10 h-14 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-center text-2xl font-black text-indigo-600 shadow-inner"
            >
              {{ digit }}
            </div>
          </div>

          <div v-if="countdown > 0" class="mb-6">
             <div class="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Codi expira en:</div>
             <div class="text-xl font-black text-indigo-600 tabular-nums">{{ formattedCountdown }}</div>
          </div>

          <button @click="generateCode" 
            class="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-black uppercase tracking-widest text-xs transition-all shadow-lg shadow-indigo-100 active:scale-95"
            :disabled="loadingCode"
          >
            {{ loadingCode ? 'Generant...' : (countdown > 0 ? 'Regenerar Codi' : 'Generar Nou Codi') }}
          </button>
          <p class="mt-4 text-[10px] text-slate-400 font-bold uppercase tracking-tighter italic">Vàlid per {{ validityMinutes }} minuts</p>
        </div>

        <div class="bg-indigo-600 rounded-[2rem] p-6 text-white overflow-hidden relative">
          <p class="text-xs font-black uppercase tracking-widest text-indigo-200 mb-1">Mètriques d'avui</p>
          <p class="text-3xl font-black italic">{{ attendancePercentage }}%</p>
          <p class="text-[10px] font-bold text-indigo-200 uppercase tracking-widest">
            {{ totalMarked > 0 ? `${presentsCount} presents de ${totalMarked} marcats` : 'Sense dades' }}
          </p>
          <div class="absolute -bottom-4 -right-4 w-24 h-24 bg-indigo-500 rounded-full blur-2xl opacity-50"></div>
        </div>
      </div>

      <!-- QUICK STUDENT LIST -->
      <div class="lg:col-span-2 bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm flex flex-col max-h-[700px]">
        <div class="flex justify-between items-center mb-8 shrink-0">
          <div class="flex flex-col">
             <h3 class="font-black text-slate-800 uppercase tracking-widest text-xs">Assistència Ràpida</h3>
             <p class="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-1">Llistat complet de la classe</p>
          </div>
          <div class="flex gap-2">
            <div class="px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full text-[10px] font-black uppercase tracking-widest">
              {{ students.filter(s => s.estat === 'present').length }} Presents
            </div>
            <div class="px-3 py-1 bg-slate-50 text-slate-400 rounded-full text-[10px] font-black uppercase tracking-widest">
              {{ students.filter(s => s.estat === 'pendent').length }} Pendents
            </div>
          </div>
        </div>

        <div class="space-y-3 overflow-y-auto pr-2 custom-scrollbar">
          <div v-for="student in students" :key="student.id" 
            @click="openStudentDetail(student)"
            class="flex items-center justify-between p-4 rounded-2xl border border-slate-50 hover:bg-slate-50 transition-colors group cursor-pointer"
          >
            <div class="flex items-center gap-4">
              <div class="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 font-bold text-xs uppercase group-hover:bg-white transition-colors overflow-hidden">
                <img v-if="student.foto" :src="student.foto" class="w-full h-full object-cover" />
                <span v-else>{{ student.nom.split(' ').map(n => n[0]).join('') }}</span>
              </div>
              <div>
                <p class="text-sm font-bold text-slate-700">{{ student.nom }}</p>
                <p class="text-[10px] text-slate-400 font-black uppercase tracking-widest">{{ student.email }}</p>
              </div>
            </div>
            
            <div class="flex items-center gap-2" @click.stop>
              <button 
                @click="updateStatus(student, 'present')"
                class="w-8 h-8 rounded-lg flex items-center justify-center transition-all"
                :class="student.estat === 'present' ? 'bg-emerald-500 text-white shadow-md shadow-emerald-100' : 'bg-slate-50 text-slate-300 hover:text-emerald-500 hover:bg-emerald-50'"
              >
                <AppIcon name="check" class="w-4 h-4" />
              </button>
              <button 
                @click="updateStatus(student, 'absent')"
                class="w-8 h-8 rounded-lg flex items-center justify-center transition-all"
                :class="student.estat === 'absent' ? 'bg-rose-500 text-white shadow-md shadow-rose-100' : 'bg-slate-50 text-slate-300 hover:text-rose-500 hover:bg-rose-50'"
              >
                <AppIcon name="x" class="w-4 h-4" />
              </button>
              <button 
                @click="updateStatus(student, 'retard')"
                class="w-8 h-8 rounded-lg flex items-center justify-center transition-all"
                :class="student.estat === 'retard' ? 'bg-amber-500 text-white shadow-md shadow-amber-100' : 'bg-slate-50 text-slate-300 hover:text-amber-500 hover:bg-amber-50'"
              >
                <AppIcon name="clock" class="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- TAB 2: LLISTAT COMPLET -->
    <div v-if="activeTab === 'students'" class="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm animate-in fade-in slide-in-from-bottom-4 duration-300">
      <div class="flex justify-between items-center mb-8">
        <div>
          <h3 class="font-black text-slate-800 uppercase tracking-widest text-xs mb-1">Llistat Complet d'Alumnes</h3>
          <p class="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Hi ha {{ students.length }} alumnes registrats</p>
        </div>
        <div class="flex gap-2">
          <button @click="seedData" class="px-4 py-2 bg-indigo-50 text-indigo-600 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-100 transition-colors">
            Generar Datos de Prova
          </button>
          <div class="relative">
            <input type="text" v-model="searchQuery" placeholder="BUSCAR ALUMNE..." class="bg-slate-50 border border-slate-100 rounded-xl px-4 py-2 text-[10px] font-black uppercase tracking-widest focus:outline-none focus:ring-2 focus:ring-indigo-500/20 w-48 md:w-64" />
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div v-for="student in filteredStudents" :key="student.id" 
          @click="openStudentDetail(student)"
          class="flex items-center justify-between p-4 rounded-2xl border border-slate-50 hover:bg-slate-50 transition-colors group cursor-pointer"
        >
          <div class="flex items-center gap-4">
            <div class="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-400 font-black text-xs uppercase group-hover:bg-white transition-colors overflow-hidden">
              <img v-if="student.foto" :src="student.foto" class="w-full h-full object-cover" />
              <span v-else>{{ student.nom.split(' ').map(n => n[0]).join('') }}</span>
            </div>
            <div>
              <p class="text-sm font-bold text-slate-700">{{ student.nom }}</p>
              <p class="text-[10px] text-slate-400 font-black uppercase tracking-widest">{{ student.email }}</p>
            </div>
          </div>
          
          <div class="flex items-center gap-2" @click.stop>
            <button 
              @click="updateStatus(student, 'present')"
              class="w-8 h-8 rounded-lg flex items-center justify-center transition-all"
              :class="student.estat === 'present' ? 'bg-emerald-500 text-white shadow-md shadow-emerald-100' : 'bg-slate-50 text-slate-300 hover:text-emerald-500 hover:bg-emerald-50'"
            >
              <AppIcon name="check" class="w-4 h-4" />
            </button>
            <button 
              @click="updateStatus(student, 'absent')"
              class="w-8 h-8 rounded-lg flex items-center justify-center transition-all"
              :class="student.estat === 'absent' ? 'bg-rose-500 text-white shadow-md shadow-rose-100' : 'bg-slate-50 text-slate-300 hover:text-rose-500 hover:bg-rose-50'"
            >
              <AppIcon name="x" class="w-4 h-4" />
            </button>
            <button 
              @click="updateStatus(student, 'retard')"
              class="w-8 h-8 rounded-lg flex items-center justify-center transition-all"
              :class="student.estat === 'retard' ? 'bg-amber-500 text-white shadow-md shadow-amber-100' : 'bg-slate-50 text-slate-300 hover:text-amber-500 hover:bg-amber-50'"
            >
              <AppIcon name="clock" class="w-4 h-4" />
            </button>
          </div>
        </div>
        <div v-if="filteredStudents.length === 0" class="col-span-full py-12 text-center opacity-40">
           <p class="text-[10px] font-black uppercase tracking-widest text-slate-400">No s'han trobat alumnes que coincideixin amb "{{ searchQuery }}"</p>
        </div>
      </div>
    </div>

    <!-- STUDENT MODAL -->
    <div v-if="showStudentModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200" @click.self="showStudentModal = false">
      <div class="bg-white w-full max-w-sm rounded-[3rem] shadow-2xl overflow-hidden animate-in slide-in-from-bottom-4 duration-300">
        <!-- MODAL HEADER / PHOTO -->
        <div class="bg-indigo-600 h-32 relative">
          <button @click="showStudentModal = false" class="absolute top-6 right-6 p-2 bg-white/20 hover:bg-white/30 rounded-xl text-white transition-colors">
            <AppIcon name="x" class="w-4 h-4" />
          </button>
          <div class="absolute -bottom-12 left-8 w-24 h-24 bg-white rounded-3xl p-1 shadow-lg">
            <div class="w-full h-full bg-slate-100 rounded-2xl flex items-center justify-center overflow-hidden">
               <img v-if="selectedStudent.foto" :src="selectedStudent.foto" class="w-full h-full object-cover" />
               <span v-else class="text-2xl font-black text-slate-300">{{ selectedStudent.nom.split(' ').map(n => n[0]).join('') }}</span>
            </div>
          </div>
        </div>

        <!-- MODAL CONTENT -->
        <div class="p-8 pt-16">
          <h2 class="text-xl font-black text-slate-800 mb-1 uppercase italic tracking-tight">{{ selectedStudent.nom }}</h2>
          <p class="text-[10px] font-black text-indigo-600 uppercase tracking-widest mb-8">Alumne de {{ modul.nom }}</p>

          <div class="grid grid-cols-2 gap-4 mb-8">
            <div class="bg-rose-50 p-4 rounded-3xl border border-rose-100/50">
              <p class="text-[8px] font-black text-rose-400 uppercase tracking-widest mb-1">Faltes acumulades</p>
              <p class="text-2xl font-black text-rose-600 italic">{{ selectedStudent.faltas_acumuladas || 0 }}</p>
            </div>
            <div class="bg-amber-50 p-4 rounded-3xl border border-amber-100/50">
              <p class="text-[8px] font-black text-amber-400 uppercase tracking-widest mb-1">Retards acumulats</p>
              <p class="text-2xl font-black text-amber-600 italic">{{ selectedStudent.retrasos_acumulados || 0 }}</p>
            </div>
          </div>

          <div class="space-y-4">
            <div class="flex items-center gap-4 group">
              <div class="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors border border-slate-100">
                <AppIcon name="mail" class="w-5 h-5" />
              </div>
              <div class="flex-1 overflow-hidden">
                <p class="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Correu Electrònic</p>
                <p class="text-xs font-bold text-slate-700 truncate">{{ selectedStudent.email }}</p>
              </div>
            </div>

            <div class="flex items-center gap-4 group">
              <div class="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors border border-slate-100">
                <AppIcon name="phone" class="w-5 h-5" />
              </div>
              <div class="flex-1 overflow-hidden">
                <p class="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Número de Telèfon</p>
                <p class="text-xs font-bold text-slate-700">{{ selectedStudent.telefon || 'No disponible' }}</p>
              </div>
            </div>

            <div class="flex items-center gap-4 group">
              <div class="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors border border-slate-100">
                <AppIcon name="info" class="w-5 h-5" />
              </div>
              <div class="flex-1 overflow-hidden">
                <p class="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Informació addicional</p>
                <p class="text-xs font-bold text-slate-700">Dades completes de l'alumne del grup {{ modul.grup?.nom }}</p>
              </div>
            </div>
          </div>
          
          <button @click="showStudentModal = false" class="w-full mt-10 py-4 bg-slate-800 hover:bg-slate-900 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] transition-all shadow-lg shadow-slate-200 active:scale-95">
            Tancar Fitxa
          </button>
        </div>
      </div>
    </div>

    <!-- TAB 3: GENERADOR DE GRUPS -->
    <div v-if="activeTab === 'groups'" class="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
      <div class="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm">
        <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
          <div>
            <h3 class="font-black text-slate-800 uppercase tracking-widest text-xs mb-1">Generador de Grups Aleatoris</h3>
            <p class="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Organitza als teus {{ students.length }} alumnes automàticament</p>
          </div>
          
          <div class="flex items-center gap-4 w-full md:w-auto">
            <div class="flex-1 md:flex-none">
              <label class="block text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1 ml-1">Alumnes per grup</label>
              <input type="number" v-model="studentsPerGroup" min="2" max="20" class="w-full md:w-24 bg-slate-50 border border-slate-100 rounded-xl px-4 py-2 text-sm font-black text-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/20" />
            </div>
            <button @click="generateGroups" class="flex-1 md:flex-none h-10 px-8 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-lg shadow-indigo-100 active:scale-95 mt-4">
              Generar Grups
            </button>
          </div>
        </div>

        <div v-if="generatedGroups.length > 0" class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          <div v-for="(group, idx) in generatedGroups" :key="idx" class="bg-slate-50/50 rounded-3xl p-6 border border-slate-100 relative overflow-hidden group">
            <div class="absolute -top-4 -right-4 w-20 h-20 bg-indigo-600/5 rounded-full blur-2xl"></div>
            
            <div class="flex justify-between items-center mb-4 relative">
              <span class="text-[10px] font-black text-indigo-600 uppercase tracking-widest bg-white px-3 py-1 rounded-full shadow-sm">Grup {{ idx + 1 }}</span>>
              <span class="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{{ group.length }} Alumnes</span>
            </div>

            <div class="space-y-2 relative">
              <div v-for="student in group" :key="student.id" class="flex items-center gap-3 bg-white/80 p-2 rounded-xl backdrop-blur-sm border border-slate-50 shadow-sm">
                <div class="w-6 h-6 rounded-lg bg-indigo-50 flex items-center justify-center text-[8px] font-black text-indigo-400 uppercase">
                  {{ student.nom.split(' ').map(n => n[0]).join('') }}
                </div>
                <span class="text-[11px] font-bold text-slate-600">{{ student.nom }}</span>
              </div>
            </div>
          </div>
        </div>

        <div v-else class="py-20 flex flex-col items-center text-center opacity-40">
          <div class="w-20 h-20 bg-slate-100 rounded-[2rem] flex items-center justify-center text-slate-400 mb-6">
            <AppIcon name="users" class="w-10 h-10" />
          </div>
          <p class="max-w-[200px] text-[10px] font-black uppercase tracking-widest text-slate-400">Selecciona la quantitat d'alumnes i fes clic a generar</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { API_BASE_URL } from '@/config/api';
import AppIcon from '../components/shared/AppIcon.vue';
import { io } from 'socket.io-client';

const props = defineProps({
// ... (rest of props)
  user: { type: Object, required: true },
  modul: { type: Object, required: true }
});

const emit = defineEmits(['back']);

// TABS
const activeTab = ref('attendance');
const tabs = [
  { id: 'attendance', name: 'Assistència' },
  { id: 'students', name: 'Alumnes' },
  { id: 'groups', name: 'Grups' }
];

const code = ref('------');
const loadingCode = ref(false);
const students = ref([]);
const lateMinutes = ref(15);
const absentMinutes = ref(30);
const validityMinutes = ref(120);

// SEARCH
const searchQuery = ref('');
const filteredStudents = computed(() => {
  if (!searchQuery.value) return students.value;
  const q = searchQuery.value.toLowerCase();
  return students.value.filter(s => 
    s.nom.toLowerCase().includes(q) || 
    s.email.toLowerCase().includes(q)
  );
});

// METRICS
const presentsCount = computed(() => students.value.filter(s => s.estat === 'present').length);
const absentsCount = computed(() => students.value.filter(s => s.estat === 'absent').length);
const totalMarked = computed(() => presentsCount.value + absentsCount.value);
const attendancePercentage = computed(() => {
  if (totalMarked.value === 0) return 0;
  return Math.round((presentsCount.value / totalMarked.value) * 100);
});

// MODAL
const showStudentModal = ref(false);
const selectedStudent = ref(null);

const openStudentDetail = (student) => {
  selectedStudent.value = student;
  showStudentModal.value = true;
};

// COUNTDOWN
const countdown = ref(0);
let timer = null;

const formattedCountdown = computed(() => {
  const m = Math.floor(countdown.value / 60);
  const s = countdown.value % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
});

const startCountdown = (minutes) => {
  if (timer) clearInterval(timer);
  countdown.value = minutes * 60;
  timer = setInterval(() => {
    if (countdown.value > 0) {
      countdown.value--;
    } else {
      clearInterval(timer);
    }
  }, 1000);
};

// GROUPS
const studentsPerGroup = ref(4);
const generatedGroups = ref([]);

const codeDisplay = computed(() => {
  return code.value.split('');
});

const generateCode = async () => {
  loadingCode.value = true;
  try {
    const res = await fetch(`${API_BASE_URL}/attendance/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        modulId: props.modul.id, 
        professorId: props.user.id,
        lateMinutes: lateMinutes.value,
        absentMinutes: absentMinutes.value,
        validityMinutes: validityMinutes.value
      })
    });
    const data = await res.json();
    code.value = data.token;
    startCountdown(validityMinutes.value);
  } catch (e) {
    code.value = Math.floor(100000 + Math.random() * 900000).toString();
    startCountdown(validityMinutes.value);
  } finally {
    loadingCode.value = false;
  }
};

const fetchStudents = async () => {
  try {
    const res = await fetch(`${API_BASE_URL}/api/usuaris/modul/${props.modul.id}/students`);
    students.value = await res.json();
  } catch (e) {
    // Fallback Mock data
    const mockNames = [
      'Marc Roig', 'Laia Sols', 'Pol Vila', 'Anna Bosch', 'Joan Martí',
      'Carla Puig', 'Miquel Serra', 'Elena Roca', 'Jordi Font', 'Sílvia Mas',
      'Albert Soler', 'Marta Vidal', 'Pau Casals', 'Núria Riera', 'Roger Molins'
    ];
    students.value = mockNames.map((name, i) => ({
      id: i + 1,
      nom: name,
      email: `${name.toLowerCase().replace(' ', '')}@example.com`,
      estat: 'pendent',
      foto: `https://api.dicebear.com/7.x/avataaars/svg?seed=${name}`,
      telefon: `600 ${100 + i} ${200 + i}`,
      faltas_acumuladas: Math.floor(Math.random() * 5),
      retrasos_acumulados: Math.floor(Math.random() * 8)
    }));
  }
};

const seedData = async () => {
  try {
    await fetch(`${API_BASE_URL}/api/usuaris/modul/${props.modul.id}/seed`, { method: 'POST' });
    await fetchStudents();
  } catch (e) {
    console.error('Error seeding data');
  }
};

const updateStatus = async (student, newStatus) => {
  const oldStatus = student.estat;
  student.estat = newStatus;
  
  try {
    await fetch(`${API_BASE_URL}/attendance/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        alumneId: student.id, 
        modulId: props.modul.id, 
        estat: newStatus 
      })
    });
    // Opcional: Refrescar per actualitzar acumulats si cal
    // await fetchStudents(); 
  } catch (e) {
    console.error('Error actualitzant estat');
    student.estat = oldStatus;
  }
};

const generateGroups = () => {
  const shuffled = [...students.value].sort(() => 0.5 - Math.random());
  const size = studentsPerGroup.value;
  const groups = [];

  for (let i = 0; i < shuffled.length; i += size) {
    groups.push(shuffled.slice(i, i + size));
  }

  generatedGroups.value = groups;
};

const exportData = async (format) => {
  try {
    const response = await fetch(`${API_BASE_URL}/attendance/export/${format}/${props.modul.id}`);
    if (!response.ok) throw new Error('Error en l\'exportació');

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `assistencia_${props.modul.id}.${format}`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  } catch (e) {
    console.error('Export error:', e);
    alert('Error al generar l\'exportació');
  }
};

let socket = null;

onMounted(() => {
  fetchStudents();

  // Configuración de WebSockets para tiempo real
  // En producción usamos el mismo host. En desarrollo localhost:3000
  const socketUrl = import.meta.env.PROD ? window.location.origin : 'http://localhost:3000';
  socket = io(socketUrl);
  
  socket.on('connect', () => {
    console.log('Connectat al socket per sync en temps real');
    socket.emit('join_module', props.modul.id);
  });

  socket.on('attendance_updated', (data) => {
    console.log('Actualització d\'assistència rebuda!', data);
    // Refresquem la llista completa per assegurar que les mètriques també s'actualitzen
    fetchStudents();
  });
});

onUnmounted(() => {
  if (timer) clearInterval(timer);
  if (socket) socket.disconnect();
});
</script>

<style scoped>
.animate-in {
  animation-duration: 0.3s;
  animation-fill-mode: both;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slideInFromBottom {
  from { transform: translateY(1rem); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}

.fade-in { animation-name: fadeIn; }
.slide-in-from-bottom-4 { animation-name: slideInFromBottom; }

.custom-scrollbar::-webkit-scrollbar {
  width: 4px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #e2e8f0;
  border-radius: 10px;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: #cbd5e1;
}
</style>
