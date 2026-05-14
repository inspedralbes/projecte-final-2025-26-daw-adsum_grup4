<template>
  <div class="relative w-full max-w-lg animate-fade-in px-4">
    <!-- Fons decoratiu suau -->
    <div class="absolute -top-32 -left-32 w-80 h-80 bg-blue-100/50 rounded-full blur-3xl"></div>
    <div class="absolute -bottom-32 -right-32 w-80 h-80 bg-emerald-50/50 rounded-full blur-3xl"></div>
    
    <div class="bg-white rounded-[2.5rem] transition-all duration-300 relative z-10 p-12 border border-slate-200/60 shadow-2xl">
      <div class="mb-12 text-center">
        <div class="inline-flex items-center justify-center w-20 h-20 bg-primari-normal rounded-2xl mb-6 shadow-xl shadow-blue-100">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
        </div>
        <h1 class="text-4xl font-black tracking-tighter text-slate-900 mb-1">ADSUM</h1>
        <p class="text-slate-400 text-[10px] font-bold uppercase tracking-[0.3em]">Campus Digital · Institut</p>
      </div>

      <!-- FORMULARI DE LOGIN (EXISTENT) -->
      <form v-if="!showRegisterForm" @submit.prevent="handleLogin" class="space-y-6">
        <div>
          <label for="email" class="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 ml-1">Correu Institucional</label>
          <div class="relative">
            <input 
              id="email" 
              type="email" 
              v-model="email"
              required
              class="w-full px-5 py-4 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-primari-normal transition-all font-semibold text-sm placeholder:text-slate-300"
              placeholder="usuari@institut.cat"
            />
          </div>
        </div>

        <div class="space-y-2">
          <label for="password" class="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 ml-1">Contrasenya</label>
          <input 
            id="password" 
            type="password" 
            v-model="password"
            required
            class="w-full px-5 py-4 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-primari-normal transition-all font-semibold text-sm placeholder:text-slate-300"
            placeholder="••••••••"
          />
        </div>

        <div class="flex justify-center pb-2 relative z-50">
           <button type="button" @click="handleResetPassword" class="text-[11px] font-black text-blue-600 uppercase tracking-widest hover:underline decoration-2 underline-offset-4 cursor-pointer">
             ¿Has oblidat la contrasenya?
           </button>
        </div>

        <div class="pt-2 relative z-50">
          <button 
            type="submit" 
            :disabled="isLoading"
            @click="() => console.log('Clicant botó login...')"
            class="boto-academic w-full h-14 text-[11px] tracking-[0.2em] shadow-lg shadow-blue-100 cursor-pointer"
          >
            <span v-if="isLoading">Verificant...</span>
            <span v-else>Iniciar Sessió</span>
          </button>
        </div>
      </form>

      <!-- FORMULARI DE REGISTRE DE CENTRE (ESTIL PREMIUM) -->
      <div v-else class="animate-fade-in space-y-8">
         <div v-if="!registrationSuccess" class="space-y-6">
            <div class="text-center">
               <h3 class="text-2xl font-black text-slate-900 uppercase italic leading-none tracking-tighter">Sol·licitud de Centre</h3>
               <p class="text-[9px] text-blue-600 font-black mt-2 uppercase tracking-[0.2em]">Envia les dades a l'administració central</p>
            </div>
            
            <form @submit.prevent="handleRegisterCenter" class="space-y-4">
               <div class="relative group">
                  <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-300 group-focus-within:text-blue-500 transition-colors">
                     <AppIcon name="book" class="w-4 h-4" />
                  </div>
                  <input v-model="centerForm.nom" required type="text" placeholder="Nom de l'Institut" class="w-full pl-11 pr-5 py-4 rounded-2xl bg-slate-50 border border-slate-100 text-sm font-bold placeholder:text-slate-300 focus:bg-white focus:ring-4 focus:ring-blue-50 focus:border-blue-500 transition-all outline-none" />
               </div>

               <div class="relative group">
                  <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-300 group-focus-within:text-blue-500 transition-colors">
                     <AppIcon name="stats" class="w-4 h-4" />
                  </div>
                  <input v-model="centerForm.localitat" required type="text" placeholder="Localitat del centre" class="w-full pl-11 pr-5 py-4 rounded-2xl bg-slate-50 border border-slate-100 text-sm font-bold placeholder:text-slate-300 focus:bg-white focus:ring-4 focus:ring-blue-50 focus:border-blue-500 transition-all outline-none" />
               </div>

               <div class="relative group">
                  <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-300 group-focus-within:text-blue-500 transition-colors">
                     <AppIcon name="mail" class="w-4 h-4" />
                  </div>
                  <input v-model="centerForm.email" required type="email" placeholder="Email institucional" class="w-full pl-11 pr-5 py-4 rounded-2xl bg-slate-50 border border-slate-100 text-sm font-bold placeholder:text-slate-300 focus:bg-white focus:ring-4 focus:ring-blue-50 focus:border-blue-500 transition-all outline-none" />
               </div>

               <div class="relative group">
                  <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-300 group-focus-within:text-blue-500 transition-colors">
                     <AppIcon name="phone" class="w-4 h-4" />
                  </div>
                  <input v-model="centerForm.tel" required type="tel" placeholder="Telèfon de contacte" class="w-full pl-11 pr-5 py-4 rounded-2xl bg-slate-50 border border-slate-100 text-sm font-bold placeholder:text-slate-300 focus:bg-white focus:ring-4 focus:ring-blue-50 focus:border-blue-500 transition-all outline-none" />
               </div>

               <button type="submit" class="w-full py-5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] shadow-xl shadow-blue-100 hover:scale-[1.02] active:scale-[0.98] transition-all">
                  Enviar Sol·licitud
               </button>
            </form>
         </div>

         <div v-else class="text-center py-12 px-6 bg-emerald-50 rounded-[2.5rem] border border-emerald-100 animate-scale-up">
            <div class="w-16 h-16 bg-white text-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-sm">
               <AppIcon name="check" class="w-8 h-8" />
            </div>
            <h3 class="text-xl font-black text-slate-900 uppercase italic">Rebut!</h3>
            <p class="text-[10px] text-slate-500 font-bold mt-4 leading-relaxed uppercase tracking-widest">
               L'administrador revisarà les dades de l'institut <br/>
               <span class="text-emerald-600">{{ centerForm.nom }}</span>
            </p>
         </div>

         <button @click="showRegisterForm = false" class="w-full py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-blue-600 transition-colors flex items-center justify-center gap-2">
            <AppIcon name="arrow-left" class="w-3 h-3" />
            Tornar a l'inici de sessió
         </button>
      </div>
      
      <div v-if="errorMessage && !showRegisterForm" class="mt-6 p-4 bg-red-50 text-red-600 text-[10px] font-black uppercase tracking-widest rounded-xl text-center border border-red-100 animate-fade-in">
          {{ errorMessage }}
      </div>

      <div v-if="resetMessage && !showRegisterForm" class="mt-6 p-4 bg-emerald-50 text-emerald-600 text-[10px] font-black uppercase tracking-widest rounded-xl text-center border border-emerald-100 animate-fade-in">
          {{ resetMessage }}
      </div>

      <div class="mt-6 pt-6 border-t border-slate-100 text-center flex flex-col gap-3">
        <p class="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
          Ets un centre nou? <button @click="showRegisterForm = true" class="text-blue-600 font-black hover:underline ml-1 uppercase">Registra't</button>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

// Definim la URL relativa per usar el proxy de Vite
const API_BASE_URL = '/api';

const email = ref('');
const password = ref('');
const isLoading = ref(false);
const errorMessage = ref('');
const resetMessage = ref('');
const showRegisterForm = ref(false);
const registrationSuccess = ref(false);

const centerForm = ref({
    nom: '',
    localitat: '',
    email: '',
    tel: ''
});

const emits = defineEmits(['login-success']);

const handleRegisterCenter = () => {
    console.log("Sol·licitud de registre enviada:", centerForm.value);
    registrationSuccess.value = true;
};

const handleResetPassword = () => {
    if (!email.value) {
        errorMessage.value = 'Introdueix el teu correu per recuperar la contrasenya';
        return;
    }
    resetMessage.value = `S'ha enviat un correu de recuperació a ${email.value}. Revisa la teva bústia!`;
    errorMessage.value = '';
};

const handleLogin = async () => {
    try {
        const response = await fetch(`${API_BASE_URL}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email: email.value, password: password.value })
        });

        if (!response.ok) {
            throw new Error('Credencials invàlides');
        }

        const data = await response.json();
        
        localStorage.setItem('access_token', data.access_token);
        localStorage.setItem('user', JSON.stringify(data.user));

        emits('login-success', data.user);
    } catch (error) {
        errorMessage.value = error.message || 'Error en iniciar sessió';
    } finally {
        isLoading.value = false;
    }
};
</script>
