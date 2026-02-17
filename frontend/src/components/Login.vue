<template>
  <div class="bg-white p-10 rounded-[2rem] shadow-[0_20px_50px_rgba(30,41,59,0.05)] border border-slate-100 max-w-sm w-full">
    <div class="text-center mb-10">
      <h1 class="text-3xl font-extrabold text-gray-800 mb-2">Benvingut</h1>
      <p class="text-slate-400 text-sm">Introdueix les teves credencials per accedir</p>
    </div>

    <form @submit.prevent="handleLogin" class="space-y-6">
      <div>
        <label for="email" class="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Correu Electrònic</label>
        <input 
          id="email" 
          type="email" 
          v-model="email"
          required
          class="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-medium text-sm placeholder:text-slate-300"
          placeholder="exemple@adsum.cat"
        />
      </div>

      <div>
        <label for="password" class="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Contrasenya</label>
        <input 
          id="password" 
          type="password" 
          v-model="password"
          required
          class="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-medium text-sm placeholder:text-slate-300"
          placeholder="••••••••"
        />
      </div>

      <div class="pt-4">
        <button 
          type="submit" 
          :disabled="isLoading"
          class="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 px-6 rounded-xl shadow-lg shadow-indigo-500/30 transition-all transform active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          <span v-if="isLoading">Verificant...</span>
          <span v-else>Iniciar Sessió</span>
          <svg v-if="!isLoading" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clip-rule="evenodd" />
          </svg>
        </button>
      </div>
    </form>
    
    <div v-if="errorMessage" class="mt-6 p-4 bg-red-50 text-red-500 text-xs font-bold rounded-xl text-center border border-red-100 animate-pulse">
        {{ errorMessage }}
    </div>

    <div class="mt-8 text-center">
      <a href="#" class="text-xs text-slate-400 hover:text-indigo-600 font-medium transition-colors">Has oblidat la contrasenya?</a>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const email = ref('');
const password = ref('');
const isLoading = ref(false);
const errorMessage = ref('');

const emits = defineEmits(['login-success']);

const handleLogin = async () => {
    isLoading.value = true;
    errorMessage.value = '';
    
    // Simulate API call
    setTimeout(() => {
        isLoading.value = false;
        // Mock validation: accept any email/password for now as requested
        // In a real scenario, this would check against the backend
        if (email.value && password.value) {
            emits('login-success');
        } else {
            errorMessage.value = 'Credencials invàlides';
        }
    }, 1500);
};
</script>
