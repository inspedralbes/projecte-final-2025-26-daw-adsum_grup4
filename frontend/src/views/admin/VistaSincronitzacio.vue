<template>
  <div class="animate-fade-in space-y-6 max-w-4xl mx-auto">
    <header class="text-center">
      <div class="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-indigo-50 mb-4">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-8 h-8 text-indigo-600">
          <path stroke-linecap="round" stroke-linejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
        </svg>
      </div>
      <h2 class="text-2xl font-black text-slate-800 tracking-tight italic uppercase">Sincronització de Dades</h2>
      <p class="text-slate-500 text-sm mt-2 max-w-xl mx-auto">
        Importeu matrícules i llistats des d'arxius externs (CSV/XLSX) per actualitzar la plataforma o exporteu-ne l'assistència cap a l'excel del centre.
      </p>
    </header>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
      <!-- Importació -->
      <div class="bg-white rounded-2xl border border-dashed border-slate-300 shadow-sm p-8 text-center transition-all hover:border-indigo-400 hover:bg-slate-50 flex flex-col justify-between">
        <div>
          <div class="mb-4 text-slate-400 font-bold uppercase tracking-widest text-xs">Pujar Registres Nous</div>
          <p class="text-sm font-medium text-slate-600 mb-6">
            Arrossega un arxiu CSV/Excel ací per iniciar la càrrega massiva d'alumnes o selecciona'l del teu equip.
          </p>
        </div>
        
        <input type="file" ref="fileInput" accept=".csv, .xlsx, .xls" class="hidden" @change="alSeleccionarArxiu" />
        
        <button @click="triggerFileInput" :disabled="loadingImport" class="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold transition-all shadow-sm shadow-indigo-200 disabled:opacity-50">
          {{ loadingImport ? 'Pujant i Processant...' : 'Explorar Arxius' }}
        </button>
      </div>

      <!-- Exportació -->
      <div class="bg-white rounded-2xl border border-slate-200 shadow-sm p-8 flex flex-col justify-between">
        <div>
          <div class="mb-4 text-slate-400 font-bold uppercase tracking-widest text-xs text-center">Tancar i Exportar</div>
          <p class="text-sm font-medium text-slate-600 mb-6 text-center">
            Aboca tot el registre d'assistència actual de l'aplicació en un document per a Google Sheets forçant la sincronització ara.
          </p>
        </div>
        <button @click="alExportarGoogleSheets" :disabled="loadingExport" class="w-full py-3 bg-slate-800 hover:bg-slate-900 text-white rounded-xl font-bold transition-all shadow-sm flex items-center justify-center gap-2 mt-auto disabled:opacity-50 disabled:cursor-wait">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-5 h-5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5" />
          </svg>          
          {{ loadingExport ? 'Generant CSV/Excel...' : 'Exportar cap a Google Sheets' }}
        </button>
      </div>
    </div>

    <!-- Feedback Area -->
    <Transition name="fade">
      <div v-if="missatge" class="p-4 rounded-xl text-center text-sm font-bold shadow-sm"
        :class="missatge.tipus === 'exit' ? 'bg-emerald-50 text-emerald-600 border border-emerald-200' : 'bg-red-50 text-red-600 border border-red-200'">
        {{ missatge.text }}
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const loadingImport = ref(false);
const loadingExport = ref(false);
const missatge = ref(null);
const fileInput = ref(null);

const triggerFileInput = () => {
  if (fileInput.value) {
    fileInput.value.click();
  }
};

const alSeleccionarArxiu = async (event) => {
  const file = event.target.files[0];
  if (!file) return;

  loadingImport.value = true;
  missatge.value = null;

  const formData = new FormData();
  formData.append('file', file);

  try {
    const res = await fetch('/api/admin/sincronitzacio/importar', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('access_token')}`
        // A FormData el navegador posa l'Content-Type amb el boundary
      },
      body: formData
    });
    
    if(!res.ok) {
      const resp = await res.json();
      throw new Error(resp.message || 'Error en processar un arxiu en el costat servidor');
    }
    
    const dades = await res.json();
    missatge.value = { 
      tipus: 'exit', 
      text: `${dades.missatge} (Llegits ${dades.mida} bytes de ${file.name}).` 
    };
  } catch (err) {
    missatge.value = { tipus: 'error', text: err.message };
  } finally {
    loadingImport.value = false;
    if (fileInput.value) fileInput.value.value = ''; // Reset l'input
    setTimeout(() => missatge.value = null, 7000);
  }
};

const alExportarGoogleSheets = async () => {
  loadingExport.value = true;
  missatge.value = null;

  try {
    const res = await fetch('/api/admin/sincronitzacio/exportar', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('access_token')}`
      }
    });

    if(!res.ok) throw new Error('Fallada generant l\'exportació de dades cap a Google Sheets');

    // Processem com a descàrrega de Blob
    const blob = await res.blob();
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'adsum_export_sheets.csv');
    document.body.appendChild(link);
    link.click();
    link.parentNode.removeChild(link);
    
    missatge.value = { 
      tipus: 'exit', 
      text: "L'arxiu d'integració Google Sheets ha completat de descarregar-se al teu equip." 
    };
  } catch(err) {
    missatge.value = { tipus: 'error', text: err.message };
  } finally {
    loadingExport.value = false;
    setTimeout(() => missatge.value = null, 5000);
  }
};
</script>
