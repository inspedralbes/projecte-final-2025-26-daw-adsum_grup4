<template>
  <div class="min-h-screen bg-slate-50 font-sans selection:bg-blue-100 selection:text-blue-600">
    <!-- NAV -->
    <nav class="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-slate-100">
      <div class="max-w-7xl mx-auto px-6 h-20 flex justify-between items-center">
        <div class="flex items-center gap-3">
          <img src="/logo.png" alt="ADSUM" class="w-10 h-10 rounded-xl object-contain bg-white" />
          <span class="text-xl font-black text-slate-900 uppercase tracking-tighter italic">ADSUM</span>
        </div>
        <div class="hidden md:flex items-center gap-8">
          <a href="#features" class="text-xs font-bold text-slate-500 hover:text-blue-600 transition-colors uppercase tracking-widest">Funcionalitats</a>
          <a href="#roles" class="text-xs font-bold text-slate-500 hover:text-blue-600 transition-colors uppercase tracking-widest">Usuaris</a>
          <button @click="$emit('login')" class="px-6 py-3 bg-slate-900 text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-blue-600 transition-all shadow-xl shadow-slate-200"> Accedir </button>
        </div>
      </div>
    </nav>

    <!-- HERO SECTION -->
    <header class="pt-40 pb-20 px-6">
      <div class="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        <div class="space-y-8 animate-fade-in">
          <div class="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-full text-[10px] font-black uppercase tracking-widest">
            <div class="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
            Revolucionant la gestió acadèmica
          </div>
          <h1 class="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-slate-900 leading-[1.1] tracking-tighter italic">
            L'assistència, <span class="text-blue-600">simplificada.</span><br/>
            El compromís, <span class="text-blue-600 uppercase">potenciat.</span>
          </h1>
          <p class="text-lg text-slate-500 font-medium leading-relaxed max-w-lg">
            ADSUM transforma el ritual tradicional de passar llista en un procés digital, segur i basat en dades. Una plataforma única per a una comunitat educativa connectada.
          </p>
          <div class="flex flex-col sm:flex-row gap-4 pt-4">
            <button @click="$emit('login')" class="px-10 py-5 bg-blue-600 text-white rounded-2xl text-sm font-black uppercase tracking-widest hover:bg-blue-700 transition-all shadow-2xl shadow-blue-100 hover:-translate-y-1">
              Comença ara
            </button>
            <a href="#features" class="px-10 py-5 bg-white border-2 border-slate-100 text-slate-600 rounded-2xl text-sm font-black uppercase tracking-widest hover:border-blue-100 hover:bg-slate-50 transition-all flex items-center justify-center">
              Saber-ne més
            </a>
          </div>
        </div>
        <div class="relative animate-scale-up">
          <div class="absolute inset-0 bg-blue-600/20 blur-[120px] rounded-full"></div>
          <img src="/mockup_dashboard.png" alt="ADSUM Dashboard" class="relative z-10 w-full rounded-[2.5rem] shadow-2xl border-8 border-white" />
        </div>
      </div>
    </header>

    <!-- FEATURES SECTION (EXISTENT PERÒ REFORÇADA) -->
    <section id="features" class="py-32 bg-white overflow-hidden">
      <div class="max-w-7xl mx-auto px-6 text-center mb-20">
        <h2 class="text-[10px] font-black text-blue-600 uppercase tracking-[0.4em] mb-4">Tecnologia al servei de l'educació</h2>
        <h3 class="text-5xl font-black text-slate-900 tracking-tight italic uppercase leading-none">Funcionalitats<br/><span class="text-blue-600">Intel·ligents</span></h3>
      </div>
      
      <div class="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-12">
        <div class="p-10 bg-slate-50 rounded-[2.5rem] border border-transparent hover:border-blue-100 transition-all group hover:bg-white hover:shadow-2xl hover:shadow-blue-50">
          <div class="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mb-8 shadow-xl shadow-blue-100 group-hover:-rotate-6 transition-transform">
            <AppIcon name="qr-code" class="text-white w-8 h-8" />
          </div>
          <h4 class="text-xl font-black text-slate-900 mb-4 italic uppercase">QR Dinàmic Segur</h4>
          <p class="text-slate-500 font-medium text-sm leading-relaxed italic">Algoritme de regeneració cada 5 segons que garanteix la presència real de l'alumne a l'aula.</p>
        </div>

        <div class="p-10 bg-slate-50 rounded-[2.5rem] border border-transparent hover:border-blue-100 transition-all group hover:bg-white hover:shadow-2xl hover:shadow-emerald-50">
          <div class="w-16 h-16 bg-emerald-500 rounded-2xl flex items-center justify-center mb-8 shadow-xl shadow-emerald-100 group-hover:rotate-6 transition-transform">
            <AppIcon name="calendar" class="text-white w-8 h-8" />
          </div>
          <h4 class="text-xl font-black text-slate-900 mb-4 italic uppercase">Agenda Predictiva</h4>
          <p class="text-slate-500 font-medium text-sm leading-relaxed italic">Sincronització instantània amb canvis de darrera hora, exàmens i entregues de treballs.</p>
        </div>

        <div class="p-10 bg-slate-50 rounded-[2.5rem] border border-transparent hover:border-blue-100 transition-all group hover:bg-white hover:shadow-2xl hover:shadow-purple-50">
          <div class="w-16 h-16 bg-purple-600 rounded-2xl flex items-center justify-center mb-8 shadow-xl shadow-purple-100 group-hover:-rotate-6 transition-transform">
            <AppIcon name="chart" class="text-white w-8 h-8" />
          </div>
          <h4 class="text-xl font-black text-slate-900 mb-4 italic uppercase">Big Data Acadèmic</h4>
          <p class="text-slate-500 font-medium text-sm leading-relaxed italic">Panells visuals per detectar patrons d'absentisme i fomentar la motivació escolar.</p>
        </div>
      </div>
    </section>

    <!-- STORYTELLING (NEW) -->
    <section class="py-32 bg-slate-900 text-white relative overflow-hidden">
       <div class="absolute top-0 right-0 w-1/2 h-full bg-blue-600/10 blur-[150px]"></div>
       <div class="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <div class="space-y-8 relative z-10">
             <div class="w-12 h-1 bg-blue-500"></div>
             <h3 class="text-4xl md:text-5xl font-black italic tracking-tighter leading-tight uppercase">"ADSUM":<br/>Més que un nom</h3>
             <p class="text-lg text-slate-300 font-medium leading-relaxed">
                “Adsum” és un terme llatí que significa literalment <span class="text-blue-400 font-bold italic">“Sóc aquí”</span>. Era la resposta solemne que donaven els estudiants a les universitats tradicionals quan es passava llista.
             </p>
             <p class="text-lg text-slate-300 font-medium leading-relaxed">
                ADSUM recupera aquest concepte per connectar la tradició acadèmica amb la tecnologia moderna, transformant el control en un procés d'autonomia i compromís.
             </p>
             <div class="grid grid-cols-2 gap-8 pt-8 border-t border-slate-800">
                <div>
                   <span class="text-4xl font-black text-blue-500 italic leading-none">-90%</span>
                   <p class="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400 mt-2">Burocràcia Docent</p>
                </div>
                <div>
                   <span class="text-4xl font-black text-emerald-400 italic leading-none">+25%</span>
                   <p class="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400 mt-2">Compromís Alumne</p>
                </div>
             </div>
          </div>
          <div class="relative group">
             <div class="aspect-[4/5] bg-slate-800 rounded-[3rem] overflow-hidden shadow-2xl relative">
                <img src="https://images.unsplash.com/photo-1523050853064-8070e989c629?q=80&w=2070&auto=format&fit=crop" class="w-full h-full object-cover opacity-60 grayscale group-hover:grayscale-0 transition-all duration-700" />
                <div class="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent"></div>
                <div class="absolute bottom-10 left-10">
                   <p class="text-3xl font-black italic uppercase leading-none text-white tracking-widest">Sóc aquí.</p>
                   <p class="text-[10px] font-bold text-blue-400 uppercase tracking-widest mt-2">L'essència del compromís</p>
                </div>
             </div>
          </div>
       </div>
    </section>

    <!-- PWA & TECHNOLOGY (NEW) -->
    <section class="py-32 bg-white">
       <div class="max-w-7xl mx-auto px-6 flex flex-col md:flex-row gap-16 items-center">
          <div class="flex-1 space-y-8">
             <h3 class="text-4xl font-black text-slate-900 italic tracking-tighter uppercase">Tecnologia PWA<br/><span class="text-blue-600">Sempre connectat</span></h3>
             <div class="space-y-6">
                <div class="flex gap-5">
                   <div class="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center flex-shrink-0 text-blue-600"><AppIcon name="fire" class="w-6 h-6" /></div>
                   <div>
                      <h6 class="font-black text-xs uppercase italic text-slate-900">Mode Offline</h6>
                      <p class="text-sm text-slate-500 font-medium">L'App segueix funcionant fins i tot sense connexió a internet als passadissos de l'institut.</p>
                   </div>
                </div>
                <div class="flex gap-5">
                   <div class="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center flex-shrink-0 text-emerald-600"><AppIcon name="bell" class="w-6 h-6" /></div>
                   <div>
                      <h6 class="font-black text-xs uppercase italic text-slate-900">Push Notifications</h6>
                      <p class="text-sm text-slate-500 font-medium">Rep avisos immediats de canvis d'aula o justificacions de faltes pendents.</p>
                   </div>
                </div>
                <div class="flex gap-5">
                   <div class="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center flex-shrink-0 text-white"><AppIcon name="door" class="w-6 h-6" /></div>
                   <div>
                      <h6 class="font-black text-xs uppercase italic text-white md:text-slate-900">Instal·lable</h6>
                      <p class="text-sm text-slate-500 font-medium">Afegeix ADSUM a la pantalla d'inici del teu mòbil sense passar per l'App Store.</p>
                   </div>
                </div>
             </div>
          </div>
          <div class="flex-1 grid grid-cols-2 gap-6">
             <div class="aspect-square bg-slate-50 rounded-3xl p-8 flex flex-col justify-end border border-slate-100">
                <span class="text-3xl font-black text-slate-900 italic uppercase">100%</span>
                <p class="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-2">Seguretat SSL</p>
             </div>
             <div class="aspect-square bg-blue-600 rounded-3xl p-8 flex flex-col justify-end shadow-xl shadow-blue-100">
                <span class="text-3xl font-black text-white italic uppercase">Zero</span>
                <p class="text-[9px] font-bold text-blue-200 uppercase tracking-widest mt-2">Paper malgastat</p>
             </div>
          </div>
       </div>
    </section>

    <!-- ROLES SECTION -->
    <section id="roles" class="py-32 bg-slate-50">
      <div class="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
        <div class="grid grid-cols-1 gap-6">
           <div class="p-8 bg-white rounded-3xl shadow-sm flex items-start gap-6 border-l-8 border-blue-600">
              <div class="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center flex-shrink-0 text-blue-600 font-black italic">A</div>
              <div>
                 <h5 class="font-black text-slate-900 uppercase italic mb-2">Alumnes</h5>
                 <p class="text-sm text-slate-500 font-medium leading-relaxed">Pren el control de la teva identitat acadèmica i la teva autonomia amb el carnet digital.</p>
              </div>
           </div>
           <div class="p-8 bg-white rounded-3xl shadow-sm flex items-start gap-6 border-l-8 border-emerald-500">
              <div class="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center flex-shrink-0 text-emerald-500 font-black italic">P</div>
              <div>
                 <h5 class="font-black text-slate-900 uppercase italic mb-2">Professors</h5>
                 <p class="text-sm text-slate-500 font-medium leading-relaxed">Elimina la paperassa i centra't en l'educació. Gestió de sessions eficient i àgil.</p>
              </div>
           </div>
           <div class="p-8 bg-white rounded-3xl shadow-sm flex items-start gap-6 border-l-8 border-rose-500">
              <div class="w-12 h-12 bg-rose-50 rounded-xl flex items-center justify-center flex-shrink-0 text-rose-500 font-black italic">F</div>
              <div>
                 <h5 class="font-black text-slate-900 uppercase italic mb-2">Famílies</h5>
                 <p class="text-sm text-slate-500 font-medium leading-relaxed">Connexió directa amb l'evolució del fill. Seguiment de l'assistència i justificacions en un clic.</p>
              </div>
           </div>
        </div>
        <div class="space-y-8">
           <h3 class="text-5xl font-black text-slate-900 leading-tight italic uppercase tracking-tighter">Una plataforma,<br/><span class="text-blue-600">tota la comunitat.</span></h3>
           <p class="text-lg text-slate-500 font-medium leading-relaxed">
             ADSUM no és només una eina de control. És un ecosistema dissenyat per fomentar la responsabilitat i l'autonomia, connectant tots els actors de l'institut.
           </p>
           <a href="#register" class="px-10 py-5 bg-slate-900 text-white rounded-2xl text-sm font-black uppercase tracking-widest hover:bg-blue-600 transition-all shadow-2xl shadow-slate-200 inline-block text-center">
             Vull registrar el meu centre
           </a>
        </div>
      </div>
    </section>

    <!-- REGISTER SECTION (NEW) -->
    <section id="register" class="py-32 bg-slate-50 relative overflow-hidden">
       <div class="max-w-4xl mx-auto px-6">
          <div class="targeta-campus !p-12 relative z-10 border-slate-200">
             <div v-if="!registrationSuccess">
                <div class="mb-12">
                   <h2 class="text-[10px] font-black text-blue-600 uppercase tracking-[0.4em] mb-4">Sol·licitud d'adhesió</h2>
                   <h3 class="text-4xl font-black text-slate-900 italic tracking-tighter uppercase leading-none">Registra el teu<br/><span class="text-blue-600">Institut</span></h3>
                   <p class="text-sm text-slate-400 font-medium mt-4">Emplena les dades i el nostre equip d'administració es posarà en contacte amb vosaltres en menys de 24h.</p>
                </div>

                <form @submit.prevent="handleRegisterCenter" class="grid grid-cols-1 md:grid-cols-2 gap-6">
                   <div class="space-y-2">
                      <label class="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Nom del Centre</label>
                      <input v-model="centerForm.nom" required type="text" placeholder="Ex: INS Pedralbes" class="w-full px-5 py-4 rounded-xl bg-white border border-slate-200 focus:ring-4 focus:ring-blue-50 focus:border-blue-500 transition-all text-sm font-bold" />
                   </div>
                   <div class="space-y-2">
                      <label class="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Localitat</label>
                      <input v-model="centerForm.localitat" required type="text" placeholder="Ex: Barcelona" class="w-full px-5 py-4 rounded-xl bg-white border border-slate-200 focus:ring-4 focus:ring-blue-50 focus:border-blue-500 transition-all text-sm font-bold" />
                   </div>
                   <div class="space-y-2">
                      <label class="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Persona de Contacte</label>
                      <input v-model="centerForm.contacte" required type="text" placeholder="Nom i Cognoms" class="w-full px-5 py-4 rounded-xl bg-white border border-slate-200 focus:ring-4 focus:ring-blue-50 focus:border-blue-500 transition-all text-sm font-bold" />
                   </div>
                   <div class="space-y-2">
                      <label class="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Correu Electrònic</label>
                      <input v-model="centerForm.email" required type="email" placeholder="direccio@institut.cat" class="w-full px-5 py-4 rounded-xl bg-white border border-slate-200 focus:ring-4 focus:ring-blue-50 focus:border-blue-500 transition-all text-sm font-bold" />
                   </div>
                   <div class="space-y-2">
                      <label class="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Telèfon</label>
                      <input v-model="centerForm.tel" required type="tel" placeholder="93X XXX XXX" class="w-full px-5 py-4 rounded-xl bg-white border border-slate-200 focus:ring-4 focus:ring-blue-50 focus:border-blue-500 transition-all text-sm font-bold" />
                   </div>
                   <div class="space-y-2">
                      <label class="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Aprox. Alumnes</label>
                      <select v-model="centerForm.alumnes" class="w-full px-5 py-4 rounded-xl bg-white border border-slate-200 focus:ring-4 focus:ring-blue-50 focus:border-blue-500 transition-all text-sm font-bold">
                         <option value="100-500">100 - 500</option>
                         <option value="500-1000">500 - 1000</option>
                         <option value="1000+">+ 1000</option>
                      </select>
                   </div>
                   <div class="md:col-span-2 pt-4">
                      <button type="submit" class="w-full py-5 bg-blue-600 text-white rounded-2xl text-xs font-black uppercase tracking-[0.2em] hover:bg-blue-700 transition-all shadow-xl shadow-blue-100">
                         Enviar Sol·licitud a l'Administrador
                      </button>
                   </div>
                </form>
             </div>
             <div v-else class="text-center py-10 animate-scale-up">
                <div class="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-8 shadow-lg shadow-emerald-50">
                   <AppIcon name="check" class="w-10 h-10" />
                </div>
                <h3 class="text-3xl font-black text-slate-900 italic uppercase">Sol·licitud Enviada!</h3>
                <p class="text-slate-400 font-medium mt-4 max-w-sm mx-auto italic">Gràcies per confiar en ADSUM. L'administrador del sistema rebrà les dades de l'institut <span class="text-blue-600 font-bold tracking-tight uppercase">{{ centerForm.nom }}</span> i us respondrà ben aviat.</p>
                <button @click="registrationSuccess = false" class="mt-10 text-[10px] font-black text-blue-600 uppercase tracking-widest hover:underline">Enviar una altra sol·licitud</button>
             </div>
          </div>
       </div>
    </section>

    <!-- FAQ SECTION -->
    <section class="py-32 bg-white">
       <div class="max-w-3xl mx-auto px-6">
          <div class="text-center mb-16">
             <h2 class="text-[10px] font-black text-blue-600 uppercase tracking-[0.4em] mb-4">Suport i dubtes</h2>
             <h3 class="text-4xl font-black text-slate-900 italic tracking-tighter uppercase leading-none">Preguntes<br/><span class="text-blue-600">Freqüents</span></h3>
          </div>

          <div class="space-y-4">
             <div v-for="(faq, index) in faqs" :key="index" class="group border border-slate-100 rounded-3xl overflow-hidden transition-all hover:border-blue-100">
                <button @click="openFaq = openFaq === index ? null : index" class="w-full p-8 flex justify-between items-center text-left bg-white hover:bg-slate-50 transition-colors">
                   <span class="font-black text-slate-900 uppercase italic text-sm tracking-tight">{{ faq.q }}</span>
                   <div class="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 group-hover:text-blue-600 transition-all" :class="{ 'rotate-180 bg-blue-50 text-blue-600': openFaq === index }">
                      <AppIcon name="arrow-left" class="w-4 h-4 -rotate-90" />
                   </div>
                </button>
                <div v-show="openFaq === index" class="p-8 pt-0 bg-white animate-fade-in">
                   <p class="text-slate-500 font-medium text-sm leading-relaxed">{{ faq.a }}</p>
                </div>
             </div>
          </div>
       </div>
    </section>

    <!-- FOOTER -->
    <footer class="py-20 border-t border-slate-100 bg-white">
      <div class="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-10">
        <div class="flex items-center gap-3">
          <img src="/logo.png" alt="ADSUM" class="w-8 h-8 rounded-lg object-contain bg-white" />
          <span class="text-lg font-black text-slate-900 uppercase tracking-tighter italic">ADSUM</span>
        </div>
        <p class="text-slate-400 text-[10px] font-bold uppercase tracking-[0.2em]">© 2026 Adsum Campus Digital. Tots els drets reservats.</p>
        <div class="flex gap-6">
           <a href="#" class="text-slate-400 hover:text-blue-600 transition-colors"><AppIcon name="twitter" class="w-5 h-5" /></a>
           <a href="#" class="text-slate-400 hover:text-blue-600 transition-colors"><AppIcon name="instagram" class="w-5 h-5" /></a>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import AppIcon from '../components/shared/AppIcon.vue';
defineEmits(['login']);

const openFaq = ref(null);
const registrationSuccess = ref(false);

const centerForm = ref({
  nom: '',
  localitat: '',
  contacte: '',
  email: '',
  tel: '',
  alumnes: '100-500'
});

const handleRegisterCenter = () => {
  // Simulem enviament
  console.log("Dades enviades a l'admin:", centerForm.value);
  registrationSuccess.value = true;
};

const faqs = [
  {
    q: "Com s'evita que un alumne enviï el QR a un altre?",
    a: "El QR d'ADSUM és dinàmic. Es regenera cada 5 segons amb un algoritme xifrat. Si algú fa una captura de pantalla i l'envia, el codi haurà caducat abans que l'altre alumne el pugui utilitzar."
  },
  {
    q: "És compatible amb mòbils antics?",
    a: "Sí! ADSUM és una PWA (Progressive Web App). Això vol dir que no requereix l'última versió d'Android o iOS; només un navegador web modern per funcionar com una App nativa."
  },
  {
    q: "Les dades estan segures i compleixen la RGPD?",
    a: "Totalment. Totes les dades s'emmagatzemen en servidors segurs dins de la Unió Europea i se segueixen els protocols més estrictes de protecció de dades acadèmiques."
  },
  {
    q: "Què passa si un alumne perd el mòbil o es queda sense bateria?",
    a: "Cap problema. El professor sempre pot marcar l'assistència manualment des del seu dispositiu. ADSUM està pensat per facilitar la feina, no per ser una barrera."
  },
  {
    q: "Poden diversos familiars seguir a un mateix alumne?",
    a: "Sí. El centre pot vincular diversos perfils de 'Pare/Mare' a un mateix alumne perquè tota la família estigui informada en temps real."
  },
  {
    q: "L'aplicació ocupa gaire espai al meu dispositiu?",
    a: "Gairebé res. Al ser una Web App Progressiva, utilitza la tecnologia del navegador. Ocupa menys de 5MB, el que equival a una sola fotografia d'alta resolució."
  },
  {
    q: "Es pot fer servir per a activitats fora del centre?",
    a: "I tant. Mentre hi hagi una connexió mínima o s'hagi carregat prèviament l'horari, el sistema de QR funciona perfectament en excursions o activitats extraescolars."
  },
  {
    q: "Com funcionen les justificacions de faltes?",
    a: "Les famílies reben una notificació quan el seu fill no assisteix a classe. Des del seu propi panell, poden pujar el justificant mèdic o escriure una nota que el professor validarà a l'instant."
  }
];
</script>

<style scoped>
.animate-fade-in {
  animation: fadeIn 1s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

.animate-scale-up {
  animation: scaleUp 1s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(30px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes scaleUp {
  from { opacity: 0; transform: scale(0.9); }
  to { opacity: 1; transform: scale(1); }
}

html {
  scroll-behavior: smooth;
}
</style>
