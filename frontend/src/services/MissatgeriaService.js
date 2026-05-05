import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

class MissatgeriaService {
  async enviarMissatge(emissorId, receptorId, contingut) {
    const response = await axios.post(`${API_URL}/missatges`, {
      emissorId,
      receptorId,
      contingut,
    });
    return response.data;
  }

  async obtenirConversa(usuari1Id, usuari2Id) {
    const response = await axios.get(`${API_URL}/missatges/conversa/${usuari1Id}/${usuari2Id}`);
    return response.data;
  }

  async obtenirFamiliarsDAlumne(alumneId) {
    const response = await axios.get(`${API_URL}/missatges/familiars/${alumneId}`);
    return response.data;
  }
  
  async obtenirFillsDeFamiliar(familiarId) {
    const response = await axios.get(`${API_URL}/missatges/fills/${familiarId}`);
    return response.data;
  }
}

export default new MissatgeriaService();
