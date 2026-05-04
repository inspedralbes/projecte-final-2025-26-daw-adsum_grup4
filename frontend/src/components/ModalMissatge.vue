<template>
  <div v-if="isOpen" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md p-6">
      <div class="flex justify-between items-center mb-4">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Contactar Família</h3>
        <button @click="close" class="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
        </button>
      </div>
      
      <div v-if="carregantFamiliars" class="text-center py-4 text-gray-600 dark:text-gray-300">
        Carregant familiars...
      </div>
      
      <div v-else-if="familiars.length === 0" class="text-center py-4 text-red-500">
        Aquest alumne no té cap familiar vinculat al sistema.
      </div>

      <div v-else>
        <p class="text-sm text-gray-600 dark:text-gray-300 mb-2">Enviant missatge a la família de: <strong>{{ alumne.nom }} {{ alumne.cognoms }}</strong></p>
        
        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Destinatari (Familiar)</label>
          <select v-model="familiarSeleccionat" class="w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white">
            <option v-for="fam in familiars" :key="fam.id" :value="fam.id">
              {{ fam.nom }} {{ fam.cognoms }}
            </option>
          </select>
        </div>

        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Missatge</label>
          <textarea v-model="missatgeText" rows="4" class="w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white" placeholder="Escriu el missatge aquí..."></textarea>
        </div>

        <div class="flex justify-end space-x-3">
          <button @click="close" class="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600">Cancel·lar</button>
          <button @click="enviar" :disabled="!missatgeText.trim() || !familiarSeleccionat || enviant" class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50">
            {{ enviant ? 'Enviant...' : 'Enviar Missatge' }}
          </button>
        </div>
      </div>
      
      <div v-if="enviatAmbExit" class="mt-4 p-2 bg-green-100 text-green-800 rounded text-sm text-center">
        Missatge enviat correctament!
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';
import MissatgeriaService from '../services/MissatgeriaService';

const currentUser = JSON.parse(localStorage.getItem('user') || '{}');

const props = defineProps({
  isOpen: Boolean,
  alumne: Object,
});

const emit = defineEmits(['close']);

const familiars = ref([]);
const familiarSeleccionat = ref(null);
const missatgeText = ref('');
const carregantFamiliars = ref(false);
const enviant = ref(false);
const enviatAmbExit = ref(false);

const authStore = useAuthStore();

watch(() => props.isOpen, async (newVal) => {
  if (newVal && props.alumne) {
    carregarFamiliars();
    missatgeText.ref = '';
    enviatAmbExit.value = false;
  }
});

const carregarFamiliars = async () => {
  carregantFamiliars.value = true;
  try {
    const dades = await MissatgeriaService.obtenirFamiliarsDAlumne(props.alumne.id);
    familiars.value = dades;
    if (dades.length > 0) {
      familiarSeleccionat.value = dades[0].id;
    }
  } catch (error) {
    console.error('Error carregant familiars:', error);
  } finally {
    carregantFamiliars.value = false;
  }
};

const close = () => {
  emit('close');
};

const enviar = async () => {
  if (!familiarSeleccionat.value || !missatgeText.value.trim()) return;
  
  enviant.value = true;
  try {
    const emissorId = currentUser.id || 1; // L'ID del professor actiu (fallback a 1 per demos)
    await MissatgeriaService.enviarMissatge(emissorId, familiarSeleccionat.value, missatgeText.value);
    enviatAmbExit.value = true;
    setTimeout(() => {
      close();
    }, 2000);
  } catch (error) {
    console.error('Error enviant missatge:', error);
    alert('Hi ha hagut un error en enviar el missatge.');
  } finally {
    enviant.value = false;
  }
};
</script>
