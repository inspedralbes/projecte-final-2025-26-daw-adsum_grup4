<template>
  <div class="space-y-8 animate-fade-in">
    <!-- Capçalera amb Navegació -->
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-4">
      <div class="flex items-center gap-5">
        <button @click="$emit('back')" class="w-10 h-10 flex items-center justify-center bg-white border border-slate-200 hover:bg-slate-50 rounded-xl transition-all shadow-sm">
          <AppIcon name="arrow-left" class="w-5 h-5 text-slate-500" />
        </button>
        <div>
          <h2 class="text-3xl font-black text-slate-900 tracking-tighter uppercase italic leading-none">{{ modul.nom }}</h2>
          <div class="flex items-center gap-2 mt-2">
            <span class="badge-estat bg-blue-100 text-blue-700">{{ modul.grup?.nom }}</span>
            <span class="w-1 h-1 bg-slate-300 rounded-full"></span>
            <span class="text-[9px] font-black text-slate-400 uppercase tracking-widest">{{ modul.codi }} · Campus Sud</span>
          </div>
        </div>
      </div>

      <!-- NAVEGACIÓ PER PESTANYES (TABS) -->
      <div class="flex bg-slate-100 p-1 rounded-xl border border-slate-200 shadow-inner">
        <button 
          v-for="tab in tabs" :key="tab.id"
          @click="activeTab = tab.id"
          class="px-5 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all duration-200"
          :class="activeTab === tab.id ? 'bg-white text-blue-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'"
        >
          {{ tab.name }}
        </button>
      </div>
    </div>

    <!-- PESTANYA 1: ASSISTÈNCIA -->
    <div v-if="activeTab === 'attendance'" class="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-fade-in">
      <!-- GENERADOR DE CODI -->
      <div class="lg:col-span-1 space-y-8">
        <!-- TARGETA DE CONFIGURACIÓ -->
        <div class="targeta-campus !p-6">
          <h3 class="font-black text-slate-800 uppercase tracking-widest text-[10px] mb-6 flex items-center gap-2">
            <div class="w-1 h-3 bg-blue-600 rounded-full"></div>
            Configuració de Temps
          </h3>
          <div class="space-y-4">
            <div>
              <label class="block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Minuts per Retard</label>
              <div class="relative">
                <input type="number" v-model="lateMinutes" class="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-black text-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-400" />
                <span class="absolute right-4 top-1/2 -translate-y-1/2 text-[8px] font-black text-slate-300">MIN</span>
              </div>
            </div>
            <div>
              <label class="block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Minuts per Falta</label>
              <div class="relative">
                <input type="number" v-model="absentMinutes" class="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-black text-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-400" />
                <span class="absolute right-4 top-1/2 -translate-y-1/2 text-[8px] font-black text-slate-300">MIN</span>
              </div>
            </div>
          </div>
        </div>

        <!-- TARGETA DEL CODI -->
        <div class="targeta-campus !p-8 flex flex-col items-center text-center">
          <div class="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 mb-6 shadow-inner border border-blue-100/50">
            <AppIcon name="qr" class="w-8 h-8" />
          </div>
          <h3 class="font-black text-slate-800 uppercase tracking-widest text-[10px] mb-8">Codi d'Accés Dinàmic</h3>
          
          <div class="flex gap-2 mb-8">
            <div v-for="(digit, i) in codeDisplay" :key="i" 
              class="w-10 h-14 bg-white rounded-xl border border-slate-200 flex items-center justify-center text-2xl font-black text-blue-700 shadow-sm border-b-4 border-b-blue-100"
            >
              {{ digit }}
            </div>
          </div>

          <div v-if="countdown > 0" class="mb-6 w-full bg-slate-50 rounded-xl py-2 border border-slate-100">
             <div class="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">El codi expira en:</div>
             <div class="text-xl font-black text-blue-700 tabular-nums leading-none">{{ formattedCountdown }}</div>
          </div>

          <button @click="generateCode" 
            class="boto-academic w-full h-12 text-[10px] tracking-widest"
            :disabled="loadingCode"
          >
            {{ loadingCode ? 'Generant...' : (countdown > 0 ? 'Regenerar Codi' : 'Generar Nou Codi') }}
          </button>
        </div>

        <!-- MÈTRIQUES RÀPIDES -->
        <div class="bg-blue-900 rounded-[1.5rem] p-6 text-white overflow-hidden relative shadow-lg shadow-blue-100">
          <p class="text-[9px] font-black uppercase tracking-widest text-blue-300 mb-2">Presència de la Classe</p>
          <div class="flex items-baseline gap-2">
            <p class="text-3xl font-black italic">{{ attendancePercentage }}%</p>
            <p class="text-[9px] font-bold text-blue-400 uppercase tracking-widest">Global</p>
          </div>
          <div class="mt-4 flex items-center gap-2">
            <div class="flex-1 bg-white/10 h-1.5 rounded-full overflow-hidden">
               <div class="bg-blue-400 h-full transition-all duration-1000 shadow-[0_0_8px_rgba(96,165,250,0.5)]" :style="{ width: attendancePercentage + '%' }"></div>
            </div>
            <span class="text-[8px] font-black uppercase tracking-widest">{{ presentsCount }}/{{ totalMarked || students.length }}</span>
          </div>
        </div>
      </div>

      <!-- LLISTAT D'ASSISTÈNCIA RÀPIDA -->
      <div class="lg:col-span-2 targeta-campus !p-6 flex flex-col max-h-[800px]">
        <div class="flex justify-between items-center mb-8 shrink-0">
          <div class="flex items-center gap-3">
             <div class="w-1 h-5 bg-blue-600 rounded-full"></div>
             <div>
               <h3 class="font-black text-slate-800 uppercase tracking-widest text-[10px]">Llistat d'Assistència</h3>
               <p class="text-[8px] font-bold text-slate-400 uppercase tracking-widest mt-1">Control en temps real</p>
             </div>
          </div>
          <div class="flex gap-2">
            <span class="badge-estat bg-emerald-50 text-emerald-600 border border-emerald-100">{{ presentsCount }} Presents</span>
          </div>
        </div>

        <div class="space-y-2 overflow-y-auto pr-2 custom-scrollbar">
          <div v-for="student in students" :key="student.id" 
            @click="openStudentDetail(student)"
            class="flex items-center justify-between p-3 rounded-xl bg-slate-50/50 border border-transparent hover:border-blue-100 hover:bg-white transition-all duration-200 group cursor-pointer"
          >
            <div class="flex items-center gap-4">
              <div class="w-10 h-10 rounded-lg bg-white border border-slate-100 flex items-center justify-center shadow-sm overflow-hidden group-hover:border-blue-200">
                <img v-if="student.foto" :src="student.foto" class="w-full h-full object-cover" />
                <span v-else class="text-[10px] font-black text-slate-300 uppercase">{{ student.nom.split(' ').map(n => n[0]).join('') }}</span>
              </div>
              <div>
                <p class="text-sm font-bold text-slate-700 group-hover:text-blue-700 transition-colors">{{ student.nom }}</p>
                <p class="text-[9px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">{{ student.email }}</p>
              </div>
            </div>
            
            <div class="flex items-center gap-2" @click.stop>
              <button 
                @click="updateStatus(student, 'present')"
                class="w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-200 shadow-sm"
                :class="student.estat === 'present' ? 'bg-emerald-500 text-white' : 'bg-white text-slate-300 border border-slate-100 hover:text-emerald-500 hover:border-emerald-200'"
              >
                <AppIcon name="check" class="w-4 h-4" />
              </button>
              <button 
                @click="updateStatus(student, 'absent')"
                class="w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-200 shadow-sm"
                :class="student.estat === 'absent' ? 'bg-rose-500 text-white' : 'bg-white text-slate-300 border border-slate-100 hover:text-rose-500 hover:border-rose-200'"
              >
                <AppIcon name="x" class="w-4 h-4" />
              </button>
              <button 
                @click="updateStatus(student, 'retard')"
                class="w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-200 shadow-sm"
                :class="student.estat === 'retard' ? 'bg-amber-500 text-white' : 'bg-white text-slate-300 border border-slate-100 hover:text-amber-500 hover:border-amber-200'"
              >
                <AppIcon name="clock" class="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- PESTANYA 2: LLISTAT COMPLET -->
    <div v-if="activeTab === 'students'" class="targeta-campus !p-8 animate-fade-in">
      <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
        <div class="flex items-center gap-3">
           <div class="w-1 h-6 bg-blue-600 rounded-full"></div>
           <div>
             <h3 class="font-black text-slate-900 uppercase tracking-widest text-[10px]">Gestió d'Alumnat</h3>
             <p class="text-[8px] text-slate-400 font-bold uppercase tracking-widest">Total: {{ students.length }} alumnes registrats</p>
           </div>
        </div>
        <div class="flex gap-3 w-full md:w-auto">
          <div class="relative flex-1 md:flex-none">
            <input type="text" v-model="searchQuery" placeholder="BUSCAR ALUMNE..." class="w-full md:w-64 bg-slate-50 border border-slate-200 rounded-xl px-5 py-2.5 text-[9px] font-black uppercase tracking-widest focus:outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-400" />
            <AppIcon name="search" class="absolute right-4 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-300" />
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        <div v-for="student in filteredStudents" :key="student.id" 
          @click="openStudentDetail(student)"
          class="flex items-center justify-between p-4 rounded-xl bg-slate-50 border border-transparent hover:border-blue-100 hover:bg-white transition-all duration-200 group cursor-pointer shadow-sm"
        >
          <div class="flex items-center gap-4">
            <div class="w-11 h-11 rounded-lg bg-white border border-slate-100 flex items-center justify-center overflow-hidden group-hover:border-blue-200 shadow-sm">
              <img v-if="student.foto" :src="student.foto" class="w-full h-full object-cover" />
              <span v-else class="text-[10px] font-black text-slate-300 uppercase">{{ student.nom.split(' ').map(n => n[0]).join('') }}</span>
            </div>
            <div>
              <p class="text-sm font-bold text-slate-700 group-hover:text-blue-700 transition-colors">{{ student.nom }}</p>
              <p class="text-[9px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">{{ student.email }}</p>
            </div>
          </div>
          
          <AppIcon name="arrow-right" class="w-3.5 h-3.5 text-slate-200 group-hover:text-blue-600 transition-all" />
        </div>
      </div>
    </div>

    <!-- PESTANYA 3: GENERADOR DE GRUPS -->
    <div v-if="activeTab === 'groups'" class="targeta-campus !p-8 animate-fade-in">
      <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
        <div class="flex items-center gap-3">
           <div class="w-1 h-6 bg-blue-600 rounded-full"></div>
           <div>
             <h3 class="font-black text-slate-900 uppercase tracking-widest text-[10px]">Generació de Grups</h3>
             <p class="text-[8px] text-slate-400 font-bold uppercase tracking-widest">Treball col·laboratiu</p>
           </div>
        </div>
        
        <div class="flex items-end gap-3 w-full md:w-auto">
          <div class="flex-1 md:flex-none">
            <label class="block text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Mida equip</label>
            <input type="number" v-model="studentsPerGroup" min="2" max="20" class="w-full md:w-24 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm font-black text-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-400" />
          </div>
          <button @click="generateGroups" class="boto-academic h-[42px] px-6 text-[10px]">
            Generar
          </button>
        </div>
      </div>

      <div v-if="generatedGroups.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div v-for="(group, idx) in generatedGroups" :key="idx" class="bg-slate-50 border border-slate-100 rounded-2xl p-5 shadow-sm">
          <div class="flex justify-between items-center mb-4">
            <span class="text-[9px] font-black text-blue-700 uppercase tracking-widest bg-blue-50 px-3 py-1 rounded-lg">Grup {{ idx + 1 }}</span>
          </div>
          <div class="space-y-2">
            <div v-for="student in group" :key="student.id" class="flex items-center gap-3 bg-white p-2.5 rounded-lg border border-slate-100 shadow-sm">
              <div class="w-6 h-6 rounded bg-slate-50 flex items-center justify-center text-[8px] font-black text-slate-400 uppercase">
                {{ student.nom.split(' ').map(n => n[0]).join('') }}
              </div>
              <span class="text-[11px] font-bold text-slate-700">{{ student.nom }}</span>
            </div>
          </div>
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
    const res = await fetch(`${API_BASE_URL}/api/assistencia/generar`, {
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
    await fetch(`${API_BASE_URL}/api/assistencia/manual`, {
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
