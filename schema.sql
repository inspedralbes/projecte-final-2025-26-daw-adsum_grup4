-- =======================================================
-- PROJECTE ADSUM - ESQUEMA DE BASE DE DADES INTEGRAL
-- Versió: Final (MVP + Funcionalitats Avançades)
-- =======================================================


-- -------------------------------------------------------
-- 1. CONFIGURACIÓ GLOBAL (Singleton)
-- -------------------------------------------------------
-- Defineix les regles del joc: quan es considera retard o falta.
CREATE TABLE configuracio_centre (
    id INT PRIMARY KEY DEFAULT 1,
    minuts_tall_retard INT NOT NULL DEFAULT 10,   -- Ex: min 0-10 (Present)
    minuts_tall_absencia INT NOT NULL DEFAULT 30, -- Ex: min 11-30 (Retard), >30 (Absent)
    curs_actual VARCHAR(20) DEFAULT '2024-2025',
    
    CONSTRAINT check_unica_fila CHECK (id = 1)
) ENGINE=InnoDB;

INSERT INTO configuracio_centre (id, minuts_tall_retard, minuts_tall_absencia) VALUES (1, 10, 30);

-- -------------------------------------------------------
-- 2. GRUPS (Estructura base)
-- -------------------------------------------------------
CREATE TABLE grups (
    id INT AUTO_INCREMENT PRIMARY KEY,
    codi VARCHAR(10) NOT NULL UNIQUE,  -- Ex: "2DAW-A"
    nom VARCHAR(50) NOT NULL,          -- Ex: "2n Desenvolupament Web A"
    aula_base VARCHAR(20) NULL,
    tutor_id INT NULL,                 -- S'assignarà després (FK circular)
    delegat_id INT NULL                -- S'assignarà després (FK circular)
) ENGINE=InnoDB;

-- -------------------------------------------------------
-- 3. USUARIS (Taula Mestra)
-- -------------------------------------------------------
CREATE TABLE usuaris (
    id INT AUTO_INCREMENT PRIMARY KEY,
    
    -- Dades Personals i Accés
    nom VARCHAR(50) NOT NULL,
    cognoms VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    contrasenya_hash VARCHAR(255) NOT NULL,
    dni_nie VARCHAR(20) UNIQUE NULL,
    telefon VARCHAR(15) NULL,
    foto_url VARCHAR(255) NULL,        -- URL local o API DiceBear
    
    -- Rols i Estat
    rol ENUM('admin', 'professor', 'alumne') NOT NULL DEFAULT 'alumne',
    es_actiu BOOLEAN DEFAULT TRUE,     -- Per a esborrat lògic
    
    -- Dades Acadèmiques (Alumnes)
    grup_id INT NULL,
    nivell_educatiu ENUM('primaria', 'eso', 'batxillerat', 'cicles') NULL,
    
    -- Dades Acadèmiques (Professors)
    departament VARCHAR(100) NULL,
    
    -- Identificadors Físics (Integració Hardware)
    nfc_uid VARCHAR(50) UNIQUE NULL,   -- Codi targeta (Hexadecimal)
    token_qr_secret VARCHAR(100) NULL, -- Secret per generar QR dinàmic
    
    -- Camps JSON (NoSQL) per a dades flexibles
    dades_familiares JSON NULL,        -- Contactes emergència
    configuracio_usuari JSON NULL,     -- Preferències UI (Dark mode, etc.)
    gamificacio_data JSON DEFAULT (JSON_OBJECT('ratxa_actual', 0, 'punts', 0, 'insignies', JSON_ARRAY())),
    
    -- Meta-dades
    data_creacio TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ultim_acces TIMESTAMP NULL,

    FOREIGN KEY (grup_id) REFERENCES grups(id) ON DELETE SET NULL
) ENGINE=InnoDB;

-- Tancament de relacions circulars (Grups <-> Usuaris)
ALTER TABLE grups ADD FOREIGN KEY (tutor_id) REFERENCES usuaris(id) ON DELETE SET NULL;
ALTER TABLE grups ADD FOREIGN KEY (delegat_id) REFERENCES usuaris(id) ON DELETE SET NULL;

-- -------------------------------------------------------
-- 4. ASSIGNATURES (Mòduls)
-- -------------------------------------------------------
CREATE TABLE assignatures (
    id INT AUTO_INCREMENT PRIMARY KEY,
    codi VARCHAR(10) NOT NULL,         -- Ex: "M06"
    nom VARCHAR(100) NOT NULL,         -- Ex: "Desenvolupament Client"
    descripcio TEXT NULL,
    color_identificatiu VARCHAR(7) DEFAULT '#3b82f6' -- Per pintar l'horari
) ENGINE=InnoDB;

-- -------------------------------------------------------
-- 5. MATRÍCULES (Alumne <-> Assignatura)
-- -------------------------------------------------------
-- Defineix a quines classes ha d'assistir l'alumne.
CREATE TABLE matricules (
    id INT AUTO_INCREMENT PRIMARY KEY,
    alumne_id INT NOT NULL,
    assignatura_id INT NOT NULL,
    any_academic VARCHAR(9) NOT NULL DEFAULT '2024-2025',
    estat ENUM('matriculat', 'convalidat', 'baixa') DEFAULT 'matriculat',
    
    FOREIGN KEY (alumne_id) REFERENCES usuaris(id) ON DELETE CASCADE,
    FOREIGN KEY (assignatura_id) REFERENCES assignatures(id) ON DELETE CASCADE,
    UNIQUE(alumne_id, assignatura_id, any_academic)
) ENGINE=InnoDB;

-- -------------------------------------------------------
-- 6. ASSIGNACIONS DOCENTS (Profe <-> Assignatura <-> Grup)
-- -------------------------------------------------------
-- Defineix qui imparteix la classe (imprescindible per l'horari).
CREATE TABLE assignacions_docents (
    id INT AUTO_INCREMENT PRIMARY KEY,
    professor_id INT NOT NULL,
    assignatura_id INT NOT NULL,
    grup_id INT NOT NULL,
    any_academic VARCHAR(9) NOT NULL DEFAULT '2024-2025',
    
    FOREIGN KEY (professor_id) REFERENCES usuaris(id),
    FOREIGN KEY (assignatura_id) REFERENCES assignatures(id),
    FOREIGN KEY (grup_id) REFERENCES grups(id),
    UNIQUE(assignatura_id, grup_id, any_academic)
) ENGINE=InnoDB;

-- -------------------------------------------------------
-- 7. HORARIS (Plantilla Setmanal)
-- -------------------------------------------------------
CREATE TABLE horaris (
    id INT AUTO_INCREMENT PRIMARY KEY,
    assignacio_docent_id INT NOT NULL,
    dia_setmana ENUM('dilluns', 'dimarts', 'dimecres', 'dijous', 'divendres') NOT NULL,
    hora_inici TIME NOT NULL,
    hora_fi TIME NOT NULL,
    aula VARCHAR(20) NOT NULL,
    
    FOREIGN KEY (assignacio_docent_id) REFERENCES assignacions_docents(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- -------------------------------------------------------
-- 8. SESSIONS (Registre Diari)
-- -------------------------------------------------------
-- Es crea cada cop que comença una classe real.
CREATE TABLE sessions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    assignacio_docent_id INT NOT NULL,
    
    data_inici DATETIME DEFAULT CURRENT_TIMESTAMP,
    data_fi DATETIME NULL,
    
    pin_acces CHAR(6) NULL,            -- PIN temporal
    bitacola_docent TEXT NULL,         -- Notes del professor ("Deures fets...")
    estat ENUM('activa', 'tancada') DEFAULT 'activa',
    
    -- Geolocalització del Professor (Centre del radi permès)
    latitud_origen DECIMAL(10, 8) NULL,
    longitud_origen DECIMAL(11, 8) NULL,
    
    FOREIGN KEY (assignacio_docent_id) REFERENCES assignacions_docents(id)
) ENGINE=InnoDB;

-- -------------------------------------------------------
-- 9. ASSISTÈNCIES (El Fitxatge)
-- -------------------------------------------------------
CREATE TABLE assistencies (
    id INT AUTO_INCREMENT PRIMARY KEY,
    sessio_id INT NOT NULL,
    alumne_id INT NOT NULL,
    data_registre TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    -- Estat calculat pel backend (segons configuracio_centre)
    estat ENUM('present', 'retard', 'absent', 'justificat') NOT NULL DEFAULT 'present',
    
    -- Mètode d'entrada
    metode_validacio ENUM('pin_manual', 'qr_mobil', 'targeta_nfc', 'professor_manual') NOT NULL,
    
    -- Seguretat i Antifrau
    latitud DECIMAL(10, 8) NULL,       -- GPS de l'alumne
    longitud DECIMAL(11, 8) NULL,
    dispositiu_hash VARCHAR(64) NULL,  -- Empremta digital del navegador (fingerprint)
    es_fraudulent BOOLEAN DEFAULT FALSE,
    
    FOREIGN KEY (sessio_id) REFERENCES sessions(id) ON DELETE CASCADE,
    FOREIGN KEY (alumne_id) REFERENCES usuaris(id) ON DELETE CASCADE,
    UNIQUE(sessio_id, alumne_id)
) ENGINE=InnoDB;

-- -------------------------------------------------------
-- 10. PASSADÍS DIGITAL (Sortides Aula)
-- -------------------------------------------------------
CREATE TABLE sortides_aula (
    id INT AUTO_INCREMENT PRIMARY KEY,
    sessio_id INT NOT NULL,
    alumne_id INT NOT NULL,
    
    hora_sortida DATETIME DEFAULT CURRENT_TIMESTAMP,
    hora_tornada DATETIME NULL,
    motiu ENUM('bany', 'secretaria', 'infermeria', 'altres') NOT NULL,
    
    -- Camp calculat automàticament (Total minuts fora)
    durada_minuts INT GENERATED ALWAYS AS (TIMESTAMPDIFF(MINUTE, hora_sortida, hora_tornada)) VIRTUAL,
    
    FOREIGN KEY (sessio_id) REFERENCES sessions(id),
    FOREIGN KEY (alumne_id) REFERENCES usuaris(id)
) ENGINE=InnoDB;

-- -------------------------------------------------------
-- 11. JUSTIFICACIONS
-- -------------------------------------------------------
CREATE TABLE justificacions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    alumne_id INT NOT NULL,
    data_inici DATE NOT NULL,
    data_fi DATE NOT NULL,
    motiu TEXT NOT NULL,
    arxiu_url VARCHAR(255) NULL,       -- Ruta al fitxer pujat
    estat ENUM('pendent', 'validada', 'rebutjada') DEFAULT 'pendent',
    observacions_professor TEXT NULL,
    data_solicitud TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (alumne_id) REFERENCES usuaris(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- -------------------------------------------------------
-- 12. AUDITORIA (Logs)
-- -------------------------------------------------------
CREATE TABLE logs_auditoria (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuari_autor_id INT NOT NULL,      -- Qui fa l'acció
    usuari_afectat_id INT NULL,        -- A qui li toquen les dades
    accio VARCHAR(50) NOT NULL,        -- Ex: "UPDATE_PERFIL"
    detalls JSON NULL,                 -- Valors anteriors/nous
    data_accio TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ip_origen VARCHAR(45),
    
    FOREIGN KEY (usuari_autor_id) REFERENCES usuaris(id)
) ENGINE=InnoDB;