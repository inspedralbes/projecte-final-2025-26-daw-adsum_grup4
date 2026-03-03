<template>
  <div class="animate-fade-in space-y-6 max-w-4xl mx-auto">
    <header>
      <div class="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-slate-800 mb-3">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-6 h-6 text-white">
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      </div>
      <h2 class="text-2xl font-black text-slate-800 tracking-tight italic uppercase">Operacions del Sistema</h2>
      <p class="text-slate-500 text-sm mt-1">Àrea restringida. Gestió del cicle de vida de les dades acadèmiques segons la legislació de protecció de dades (RGPD).</p>
    </header>

    <div class="bg-red-50 border border-red-200 rounded-2xl shadow-sm p-6 md:p-8 mt-8">
      <h3 class="text-xl font-bold text-red-800 mb-2 uppercase tracking-tight">Tancament de Curs Lectiu</h3>
      <p class="text-sm font-medium text-red-700 mb-6">
        Aquesta operació desactivarà les llistes actuals, purgarà justificacions personals antics segons la política mínima i congelarà ('soft-delete') el quadre de qualificacions actual per deixar el projecte ADSUM llest per al setembre del proper any.
      </p>

      <div class="bg-white rounded-xl p-5 border border-red-100 flex flex-col items-start gap-4">
        <label class="block text-sm font-bold text-slate-700">
          Per confirmar, escriviu "CONFIRMAR" en majúscules sota d'aquest text:
        </label>
        
        <input 
          v-model="textConfirmacio" 
          type="text" 
          placeholder="..." 
          class="w-full md:w-2/3 bg-slate-50 border border-slate-200 rounded-lg p-3 text-sm font-bold focus:border-red-400 focus:ring-4 focus:ring-red-50 transition-all outline-none"
        />

        <button 
          @click="executarTancament" 
          :disabled="textConfirmacio !== 'CONFIRMAR' || executant"
          class="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-sm shadow-red-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {{ executant ? 'Processant...' : "Executar Neteja de l'any acadèmic" }}
        </button>
      </div>
      
      <Transition name="fade">
        <div v-if="resultat" class="mt-4 p-4 rounded-xl text-center text-sm font-bold border"
          :class="resultat.ok ? 'bg-emerald-50 text-emerald-600 border-emerald-200' : 'bg-orange-50 text-orange-600 border-orange-200'">
          {{ resultat.msg }}
        </div>
      </Transition>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const textConfirmacio = ref('');
const executant = ref(false);
const resultat = ref(null);

const executarTancament = async () => {
  if (textConfirmacio.value !== 'CONFIRMAR') return;
  executant.value = true;
  resultat.value = null;

  try {
    const res = await fetch('/api/admin/sistema/tancar-curs', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('access_token')}`
      },
      body: JSON.stringify({ confirmacio: textConfirmacio.value })
    });
    
    if(!res.ok) throw new Error('Operació fallida de seguretat.');
    
    const dades = await res.json();
    resultat.value = { ok: true, msg: dades.missatge };
    textConfirmacio.value = '';
  } catch (err) {
    resultat.value = { ok: false, msg: err.message };
  } finally {
    executant.value = false;
  }
};
</script>
