export interface Insignia {
  id_insignia: string;
  data_obtencio: string;
}

export interface GamificacioData {
  ratxa_actual_dies: number;
  ratxa_maxima_dies: number;
  punts_acumulats: number;
  nivell_actual: number;
  insignies_desbloquejades: Insignia[];
}

export interface Familiar {
  nom_complet: string;
  parentiu: string;
  telefon_principal?: string;
  email?: string;
  autoritza_sortides_sol: boolean;
  contacte_emergencia_principal: boolean;
}

export type DadesFamiliars = Familiar[];

export interface ConfiguracioUsuari {
  tema_interficie: 'clar' | 'fosc' | 'sistema';
  idioma_preferit: 'ca' | 'es' | 'en';
  accessibilitat: {
    alt_contrast: boolean;
    mida_lletra_gran: boolean;
  };
  notificacions: {
    avisos_falta_immediats: boolean;
    resum_setmanal_email: boolean;
  };
}
