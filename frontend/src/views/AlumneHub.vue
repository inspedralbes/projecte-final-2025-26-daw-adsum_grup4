<template>
    <div class="hub-container min-h-screen overflow-hidden flex items-center justify-center p-6 text-white font-sans">
        
        <!-- FONDO LÍQUIDO -->
        <div class="liquid-bg"></div>

        <!-- CAPA DE CIERRE (Solo visible cuando está expandido) -->
        <div v-if="isExpanded" class="fixed inset-0 z-0" @click="toggleHub"></div>

        <!-- HUB CENTRAL EXPANDIBLE -->
        <button
            class="relative z-10 rounded-[3rem] glass-orb shadow-2xl transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] cursor-pointer overflow-hidden focus:outline-none focus:ring-4 focus:ring-indigo-500/50"
            :class="isExpanded ? 'w-[85vw] h-[70vh] max-w-md' : 'w-64 h-64 flex flex-col items-center justify-center'"
            @click="!isExpanded && toggleHub()"
            :aria-expanded="isExpanded"
            aria-label="Adsum Hub - Clica per expandir el teu perfil digital"
        >
            <!-- CONTENIDO MODO CERRADO (ORBE) -->
            <div v-if="!isExpanded" class="text-center animate-pulse-slow">
                <p class="text-[0.6rem] font-black uppercase tracking-[0.3em] text-white/80 mb-1">Status: Active</p>
                <h2 class="text-lg font-black tracking-tight leading-none italic uppercase">Adsum Hub</h2>
            </div>

            <!-- CONTENIDO MODO ABIERTO (QR) -->
            <div v-if="isExpanded" class="w-full h-full p-8 flex flex-col items-center justify-between animate-fade-in">
                <div class="flex justify-between w-full items-center">
                    <p class="text-[0.7rem] font-black uppercase tracking-widest text-white/80">Digital Identity</p>
                    <button @click.stop="toggleHub" class="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors">✕</button>
                </div>

                <div class="flex flex-col items-center gap-6">
                    <!-- Placeholder del QR -->
                    <div class="w-48 h-48 bg-white/5 rounded-[2.5rem] border border-white/10 flex items-center justify-center relative">
                        <span class="text-4xl opacity-20">⬛</span>
                        <!-- Simulación de scanner -->
                        <div class="absolute inset-4 border-2 border-indigo-500/20 rounded-3xl animate-scan"></div>
                    </div>
                    
                    <div class="text-center">
                        <p class="text-xl font-bold">Andreia López</p>
                        <p class="text-[0.6rem] text-white/60 uppercase font-black tracking-widest">Grup 4 · DAW</p>
                    </div>
                </div>

                <div class="w-full h-1 bg-white/10 rounded-full overflow-hidden">
                    <div class="h-full bg-indigo-500 animate-timer"></div>
                </div>
            </div>

            <!-- Indicador inferior (solo modo cerrado) -->
            <div v-if="!isExpanded" class="absolute bottom-10 flex gap-1">
                <div class="w-1.5 h-1.5 rounded-full bg-white opacity-40"></div>
                <div class="w-1.5 h-1.5 rounded-full bg-white"></div>
                <div class="w-1.5 h-1.5 rounded-full bg-white opacity-40"></div>
            </div>
        </button>

        <!-- NODOS ORBITALES (Se ocultan cuando el hub se expande) -->
        <button
            v-for="(node, index) in nodes"
            :key="index"
            class="absolute z-20 orbital-node flex items-center justify-center cursor-pointer transition-all duration-500 focus:outline-none focus:ring-2 focus:ring-white/50"
            :class="[node.id, { 'opacity-0 scale-0 pointer-events-none': isExpanded }]"
            :style="nodeStyles[index]"
            @click="activeView = node.id"
            :aria-label="node.label"
        >
            <div class="glass-node w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg hover:scale-110 active:scale-90 transition-transform">
                <span class="text-xl" aria-hidden="true">{{ node.icon }}</span>
            </div>
            <p class="absolute -bottom-6 text-[0.6rem] font-bold uppercase tracking-tighter opacity-0 node-label transition-opacity whitespace-nowrap">
                {{ node.label }}
            </p>
        </button>

    </div>
</template>

<script setup>
import { ref } from 'vue';

const isExpanded = ref(false);
const activeView = ref('home');

const nodes = [
    { id: 'performance', label: 'Rendiment', icon: '📊' },
    { id: 'attendance', label: 'Assistència', icon: '📅' },
    { id: 'resources', label: 'Recursos', icon: '📚' },
    { id: 'hallpass', label: 'Pasadís', icon: '🚪' }
];

const nodeStyles = nodes.map((_, i) => {
    const angle = (i * (360 / nodes.length)) - 45;
    const radius = 130;
    return {
        transform: `rotate(${angle}deg) translate(${radius}px) rotate(-${angle}deg)`
    };
});

const toggleHub = () => {
    isExpanded.value = !isExpanded.value;
};
</script>

<style scoped>
.hub-container { background: #080b14; }

.liquid-bg {
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, #4f46e5 0%, #1d1b4b 50%, #7c3aed 100%);
  background-size: 400% 400%;
  animation: liquid-flow 20s ease infinite;
  filter: blur(80px);
  opacity: 0.5;
}

@keyframes liquid-flow {
    0%, 100% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
}

.glass-orb {
  background: rgba(255, 255, 255, 0.03);
  backdrop-filter: blur(40px) saturate(150%);
  -webkit-backdrop-filter: blur(40px) saturate(150%);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.glass-node {
    background: rgba(255, 255, 255, 0.05);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.1);
}

.orbital-node { animation: orbit-float 6s ease-in-out infinite; }
.orbital-node:nth-child(1) { animation-delay: 0s; }
.orbital-node:nth-child(2) { animation-delay: 1.5s; }
.orbital-node:nth-child(3) { animation-delay: 3s; }
.orbital-node:nth-child(4) { animation-delay: 4.5s; }

@keyframes orbit-float {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-10px); }
}

.orbital-node:hover .node-label { opacity: 0.6; }

.animate-pulse-slow { animation: pulse 4s ease-in-out infinite; }
@keyframes pulse {
    0%, 100% { transform: scale(1); opacity: 1; }
    50% { transform: scale(0.96); opacity: 0.7; }
}

.animate-fade-in { animation: fadeIn 0.8s ease-out forwards; }
@keyframes fadeIn {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
}

.animate-scan {
    animation: scanning 2s linear infinite;
}
@keyframes scanning {
    0%, 100% { transform: translateY(-10%); opacity: 0; }
    50% { transform: translateY(110%); opacity: 1; }
}

.animate-timer { animation: timer 5s linear infinite; }
@keyframes timer {
    from { width: 100%; }
    to { width: 0%; }
}
</style>