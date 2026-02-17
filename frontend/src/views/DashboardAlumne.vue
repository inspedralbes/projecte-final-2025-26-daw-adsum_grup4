<template>
    <div class="min-h-screen bg-slate-50 pb-24">
        <header class="bg-white px-6 py-4 border-b border-slate-100 sticky top-0 z-10">
            <h1 class="text-x1 font-bold text-slate-800">{{ currentTitle }}</h1>

        </header>

        <main class="p-4">
            <div v-if="activeTab === 'qr'" class="animate-fade-in">
                <p class="text-slate-400 text-center py-10">Cargant Generador...</p>
            </div>

            <div v-if="activeTab === 'performance'" class="animate-fade-in">
                <p class="text-slate-400 text-center py-10">Cargant Tauler de Rendiment...</p>
            </div>

            <div v-if="activeTab === 'resources'" class="animate-fade-in">
        <!-- Apartado 3 vacío por ahora -->
        <div class="bg-white p-8 rounded-3xl border border-dashed border-slate-200 text-center">
          <p class="text-slate-400">Recursos y Comunidad (Próximamente)</p>
        </div>
      </div>

      <div v-if="activeTab === 'hallpass'" class="animate-fade-in">
        <!-- Apartado 4 vacío por ahora -->
        <div class="bg-white p-8 rounded-3xl border border-dashed border-slate-200 text-center">
          <p class="text-slate-400">Pasillo Digital (Próximamente)</p>
        </div>
      </div>
        </main>

        <nav class="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-100 px-6 py-3 flex justify-between items-center shadow-[0_-10px_30px_rgba(0,0,0,0.02)]">
            <button @click="activeTab = 'qr'" :class="activeTab === 'qr' ? 'text-indigo-600' : 'text-slate-400'" class="flex flex-col items-center">
        <span class="text-xs font-bold">QR</span>
      </button>

      <button @click="activeTab = 'performance'" :class="activeTab === 'performance' ? 'text-indigo-600' : 'text-slate-400'" class="flex flex-col items-center">
        <span class="text-xs font-bold">Notas</span>
      </button>

      <button @click="activeTab = 'resources'" :class="activeTab === 'resources' ? 'text-indigo-600' : 'text-slate-400'" class="flex flex-col items-center">
        <span class="text-xs font-bold">Recursos</span>
      </button>

      <button @click="activeTab = 'hallpass'" :class="activeTab === 'hallpass' ? 'text-indigo-600' : 'text-slate-400'" class="flex flex-col items-center">
        <span class="text-xs font-bold">Salida</span>
      </button>
        </nav>
    </div>
</template>

<script setup>
import { ref, computed } from 'vue';

const activeTab = ref('qr');

const currentTitle = computed(() => {
    const titles= {
        qr: 'Assistencia QR',
        performance: 'El meu rendiment',
        resources: 'Comunitat',
        hallpass: 'Passadís digital'
    };
    return titles[activeTab.value];
});
</script>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.3s ease-out;
}
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>