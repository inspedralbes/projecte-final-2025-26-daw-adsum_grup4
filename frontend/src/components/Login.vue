<template>
  <div class="relative w-full max-w-sm">
    <!-- Decorative Orb -->
    <div class="absolute -top-20 -right-20 w-64 h-64 bg-indigo-500 rounded-full blur-3xl opacity-20 pointer-events-none animate-pulse"></div>
    
    <div class="bg-white p-10 rounded-[2.5rem] shadow-xl shadow-indigo-100 border border-slate-100 relative z-10">
      <div class="mb-10">
        <h1 class="text-4xl font-black italic uppercase tracking-tight leading-none text-slate-800 mb-2">Benvingut</h1>
        <p class="text-slate-500 text-xs font-bold uppercase tracking-widest">Introdueix les teves credencials</p>
      </div>

      <form @submit.prevent="handleLogin" class="space-y-6">
        <div>
          <label for="email" class="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Correu Electrònic</label>
          <input 
            id="email" 
            type="email" 
            v-model="email"
            required
            class="w-full px-5 py-4 rounded-2xl bg-slate-50 border border-slate-100 text-slate-800 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-bold text-sm placeholder:text-slate-300 pointer-events-auto"
            placeholder="exemple@adsum.cat"
          />
        </div>

        <div>
          <label for="password" class="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Contrasenya</label>
          <input 
            id="password" 
            type="password" 
            v-model="password"
            required
            class="w-full px-5 py-4 rounded-2xl bg-slate-50 border border-slate-100 text-slate-800 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-bold text-sm placeholder:text-slate-300 pointer-events-auto"
            placeholder="••••••••"
          />
        </div>

        <div class="pt-2">
          <button 
            type="submit" 
            :disabled="isLoading"
            class="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-black uppercase tracking-widest text-xs py-5 px-6 rounded-2xl shadow-lg shadow-indigo-500/30 transition-all transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            <span v-if="isLoading">Verificant...</span>
            <span v-else>Iniciar Sessió</span>
            <svg v-if="!isLoading" xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path fill-rule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clip-rule="evenodd" />
            </svg>
          </button>
        </div>
      </form>
      
      <div v-if="errorMessage" role="alert" class="mt-6 p-4 bg-red-50 text-red-600 text-[10px] font-black uppercase tracking-widest rounded-2xl text-center border border-red-100">
          {{ errorMessage }}
      </div>

      <div class="mt-8 text-center">
        <a href="/forgot-password" class="text-[10px] text-slate-500 hover:text-indigo-600 font-black uppercase tracking-widest transition-colors">Has oblidat la contrasenya?</a>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { API_BASE_URL } from '@/config/api';

const email = ref('');
const password = ref('');
const isLoading = ref(false);
const errorMessage = ref('');

const emits = defineEmits(['login-success']);

const handleLogin = async () => {
    isLoading.value = true;
    errorMessage.value = '';
    
    try {
        const response = await fetch(`${API_BASE_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: email.value, password: password.value })
        });

        if (!response.ok) {
            if (response.status === 401) {
                throw new Error('Correu o contrasenya incorrectes');
            } else if (response.status >= 500) {
                throw new Error('Error del servidor. Torna-ho a intentar més tard');
            } else {
                throw new Error(`Error inesperat (${response.status})`);
            }
        }

        const data = await response.json();

        if (!data.access_token || !data.user) {
            throw new Error('Resposta del servidor incorrecta');
        }
        
        // Save token and full user data
        localStorage.setItem('access_token', data.access_token);
        localStorage.setItem('user', JSON.stringify(data.user));
        // Save role separately for push notifications and quick access
        localStorage.setItem('userRole', data.user.rol);
        localStorage.setItem('token_created_at', Date.now().toString());

        emits('login-success');
    } catch (error) {
        if (error.name === 'TypeError' && error.message.includes('fetch')) {
            errorMessage.value = 'No es pot connectar amb el servidor. Comprova la connexió.';
        } else {
            errorMessage.value = error.message || 'Error en iniciar sessió';
        }
    } finally {
        isLoading.value = false;
    }
};
</script>
