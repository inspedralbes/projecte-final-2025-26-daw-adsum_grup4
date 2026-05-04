import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

class MissatgeriaService {
  async enviarMissatge(emissorId, receptorId, contingut) {
    console.log('Mock: Enviant missatge...', {emissorId, receptorId, contingut});
    return { success: true };
  }

  async obtenirConversa(usuari1Id, usuari2Id) {
    return [
      { id: 1, emissorId: usuari1Id, receptorId: usuari2Id, contingut: "Bon dia, l'alumne avui ha destacat molt a classe.", dataEnviament: new Date().toISOString(), llegit: false, emissor: { nom: 'Maria' } },
      { id: 2, emissorId: usuari2Id, receptorId: usuari1Id, contingut: "Gràcies per l'avís!", dataEnviament: new Date().toISOString(), llegit: true }
    ];
  }

  async obtenirFamiliarsDAlumne(alumneId) {
    return [
      { id: 99, nom: 'Pare/Mare', cognoms: 'Proves' }
    ];
  }
  
  async obtenirFillsDeFamiliar(familiarId) {
    return [
      { id: 1, nom: 'Alumne', cognoms: 'De Prova', grup: { nom: '2DAW' } }
    ];
  }
}

export default new MissatgeriaService();
