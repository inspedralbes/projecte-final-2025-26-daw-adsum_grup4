<template>
  <div class="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
    <Transition name="fade" mode="out-in">
      <Login 
        v-if="!isLoggedIn" 
        @login-success="handleLoginSuccess"
      />
      <QrDisplay 
        v-else 
        @logout="handleLogout"
      />
    </Transition>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import Login from './components/Login.vue';
import QrDisplay from './components/QrDisplay.vue';

const isLoggedIn = ref(false);

const handleLoginSuccess = () => {
    isLoggedIn.value = true;
};

const handleLogout = () => {
    isLoggedIn.value = false;
};
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
