<template>
  <div class="targeta-dinamica !p-8 w-full max-w-sm mx-auto text-center border-white/40 shadow-2xl relative animate-fade-in">
    <div class="mb-8">
      <div class="inline-flex items-center justify-center w-14 h-14 bg-blue-50 rounded-2xl mb-4 shadow-inner">
        <AppIcon name="lightning" class="w-8 h-8 text-blue-600" />
      </div>
      <h3 class="font-black text-slate-900 uppercase tracking-[0.2em] text-[11px]">Registre d'Assistència</h3>
      <p class="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">Introdueix el codi de la sessió</p>
    </div>

    <div class="space-y-6">
      <div class="flex gap-2 justify-center">
        <input 
          v-for="(digit, i) in 6" :key="i"
          :id="'digit-' + i"
          v-model="digits[i]"
          type="text"
          maxlength="1"
          class="w-10 h-14 bg-white rounded-xl border border-slate-200 text-center text-2xl font-black text-blue-700 shadow-sm focus:border-blue-500 focus:ring-4 focus:ring-blue-500/5 outline-none transition-all"
          @input="handleInput($event, i)"
          @keydown.backspace="handleBackspace(i)"
        />
      </div>

      <button 
        @click="confirmarAssistencia"
        :disabled="!isComplete || loading"
        class="boto-academic w-full h-14 text-xs tracking-widest flex items-center justify-center gap-3 disabled:opacity-50 disabled:grayscale"
      >
        <span v-if="!loading">CONFIRMAR PRESÈNCIA</span>
        <span v-else class="flex items-center gap-2">
          <svg class="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          PROCESSANT...
        </span>
      </button>

      <p v-if="error" class="text-[10px] font-bold text-rose-500 uppercase tracking-tight animate-bounce">
        {{ error }}
      </p>
      <p v-if="success" class="text-[10px] font-bold text-emerald-500 uppercase tracking-tight">
        ✓ Assistència registrada amb èxit
      </p>
    </div>

    <div class="mt-8 pt-6 border-t border-slate-100">
      <p class="text-[8px] font-black uppercase text-slate-400 tracking-widest leading-relaxed">
        El codi és personal i intransferible.<br>Es validarà la teva geolocalització.
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { API_BASE_URL } from '@/config/api';
import AppIcon from '../shared/AppIcon.vue';

const props = defineProps({
  alumneId: { type: Number, required: true }
});

const digits = ref(['', '', '', '', '', '']);
const loading = ref(false);
const error = ref('');
const success = ref(false);

const isComplete = computed(() => digits.value.every(d => d !== ''));

const handleInput = (e, index) => {
  const val = e.target.value;
  if (!/^\d$/.test(val)) {
    digits.value[index] = '';
    return;
  }
  
  if (index < 5 && val) {
    document.getElementById(`digit-${index + 1}`).focus();
  }
};

const handleBackspace = (index) => {
  if (index > 0 && !digits.value[index]) {
    document.getElementById(`digit-${index - 1}`).focus();
  }
};

const confirmarAssistencia = async () => {
  const token = digits.value.join('');
  loading.value = true;
  error.value = '';
  
  try {
    const res = await fetch(`${API_BASE_URL}/api/assistencia/validar`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        alumneId: props.alumneId,
        tokenValue: token
      })
    });
    
    const data = await res.json();
    
    if (!res.ok) {
      throw new Error(data.message || 'Error al registrar assistència');
    }
    
    success.value = true;
    setTimeout(() => {
      digits.value = ['', '', '', '', '', ''];
      success.value = false;
    }, 3000);
    
  } catch (e) {
    error.value = e.message;
  } finally {
    loading.value = false;
  }
};
</script>
