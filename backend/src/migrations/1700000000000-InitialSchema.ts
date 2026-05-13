import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitialSchema1700000000000 implements MigrationInterface {
  name = 'InitialSchema1700000000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS \`grups\` (
        \`id\` INT NOT NULL AUTO_INCREMENT,
        \`codi\` VARCHAR(10) NOT NULL,
        \`nom\` VARCHAR(50) NOT NULL,
        \`curs_academic\` VARCHAR(10) DEFAULT '2025-2026',
        \`aula_base\` VARCHAR(20) NULL,
        \`tutor_id\` INT NULL,
        \`delegat_id\` INT NULL,
        PRIMARY KEY (\`id\`),
        INDEX \`IDX_grups_tutor\` (\`tutor_id\`),
        INDEX \`IDX_grups_delegat\` (\`delegat_id\`)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS \`usuaris\` (
        \`id\` INT NOT NULL AUTO_INCREMENT,
        \`nom\` VARCHAR(50) NOT NULL,
        \`cognoms\` VARCHAR(100) NULL,
        \`email\` VARCHAR(100) NOT NULL,
        \`contrasenya_hash\` VARCHAR(255) NOT NULL,
        \`dni_nie\` VARCHAR(20) NULL,
        \`telefon\` VARCHAR(15) NULL,
        \`foto_url\` TEXT NULL,
        \`rol\` ENUM('admin', 'professor', 'alumne', 'família') NOT NULL DEFAULT 'alumne',
        \`es_actiu\` TINYINT(1) NOT NULL DEFAULT 1,
        \`grup_id\` INT NULL,
        \`nivell_educatiu\` ENUM('primaria', 'eso', 'batxillerat', 'cicles') NULL,
        \`departament\` VARCHAR(100) NULL,
        \`nfc_uid\` VARCHAR(50) NULL,
        \`token_qr_secret\` VARCHAR(100) NULL,
        \`dades_familiares\` JSON NULL,
        \`configuracio_usuari\` JSON NULL,
        \`gamificacio_data\` JSON NULL,
        \`data_creacio\` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        \`ultim_acces\` DATETIME NULL,
        \`token_recuperacio\` VARCHAR(255) NULL,
        \`caducitat_token_recuperacio\` DATETIME NULL,
        PRIMARY KEY (\`id\`),
        UNIQUE KEY \`UQ_usuaris_email\` (\`email\`)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS \`assignatures\` (
        \`id\` INT NOT NULL AUTO_INCREMENT,
        \`codi\` VARCHAR(10) NOT NULL,
        \`nom\` VARCHAR(100) NOT NULL,
        \`descripcio\` TEXT NULL,
        \`color_identificatiu\` VARCHAR(7) DEFAULT '#3b82f6',
        \`curs\` VARCHAR(10) DEFAULT '1r',
        \`hores_setmanals\` INT DEFAULT 3,
        PRIMARY KEY (\`id\`)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS \`matricules\` (
        \`id\` INT NOT NULL AUTO_INCREMENT,
        \`alumne_id\` INT NOT NULL,
        \`assignatura_id\` INT NOT NULL,
        \`any_academic\` VARCHAR(9) DEFAULT '2025-2026',
        \`estat\` ENUM('matriculat', 'convalidat', 'baixa') NOT NULL DEFAULT 'matriculat',
        PRIMARY KEY (\`id\`),
        UNIQUE KEY \`UQ_matricules_alumne_assignatura_any\` (\`alumne_id\`, \`assignatura_id\`, \`any_academic\`)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS \`assignacions_docents\` (
        \`id\` INT NOT NULL AUTO_INCREMENT,
        \`professor_id\` INT NOT NULL,
        \`assignatura_id\` INT NOT NULL,
        \`grup_id\` INT NOT NULL,
        \`any_academic\` VARCHAR(9) DEFAULT '2025-2026',
        PRIMARY KEY (\`id\`)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS \`moduls\` (
        \`id\` INT NOT NULL AUTO_INCREMENT,
        \`nom\` VARCHAR(100) NOT NULL,
        \`codi\` VARCHAR(20) NOT NULL,
        \`professor_id\` INT NULL,
        \`grup_id\` INT NULL,
        PRIMARY KEY (\`id\`)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS \`horaris\` (
        \`id\` INT NOT NULL AUTO_INCREMENT,
        \`assignacio_docent_id\` INT NOT NULL,
        \`dia_setmana\` ENUM('dilluns', 'dimarts', 'dimecres', 'dijous', 'divendres') NOT NULL,
        \`hora_inici\` TIME NOT NULL,
        \`hora_fi\` TIME NOT NULL,
        \`aula\` VARCHAR(20) NOT NULL,
        PRIMARY KEY (\`id\`)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS \`sessions\` (
        \`id\` INT NOT NULL AUTO_INCREMENT,
        \`assignacio_docent_id\` INT NOT NULL,
        \`data_inici\` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        \`data_fi\` DATETIME NULL,
        \`pin_acces\` VARCHAR(6) NULL,
        \`bitacola_docent\` TEXT NULL,
        \`estat\` ENUM('activa', 'tancada') NOT NULL DEFAULT 'activa',
        \`latitud_origen\` DECIMAL(10, 8) NULL,
        \`longitud_origen\` DECIMAL(11, 8) NULL,
        PRIMARY KEY (\`id\`)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS \`assistencies\` (
        \`id\` INT NOT NULL AUTO_INCREMENT,
        \`sessio_id\` INT NULL,
        \`alumne_id\` INT NOT NULL,
        \`modul_id\` INT NULL,
        \`data_registre\` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        \`estat\` ENUM('present', 'retard', 'absent', 'justificat') NOT NULL DEFAULT 'present',
        \`metode_validacio\` ENUM('pin_manual', 'qr_mobil', 'targeta_nfc', 'professor_manual') NOT NULL,
        \`latitud\` DECIMAL(10, 8) NULL,
        \`longitud\` DECIMAL(11, 8) NULL,
        \`dispositiu_hash\` VARCHAR(64) NULL,
        \`es_fraudulent\` TINYINT(1) NOT NULL DEFAULT 0,
        PRIMARY KEY (\`id\`),
        UNIQUE KEY \`UQ_assistencies_sessio_alumne\` (\`sessio_id\`, \`alumne_id\`),
        INDEX \`IDX_assistencia_data\` (\`data_registre\`),
        INDEX \`IDX_assistencia_modul_data\` (\`modul_id\`, \`data_registre\`)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS \`notes\` (
        \`id_nota\` INT NOT NULL AUTO_INCREMENT,
        \`alumne_id\` INT NOT NULL,
        \`modul_id\` INT NOT NULL,
        \`valor\` DECIMAL(4, 2) NOT NULL,
        \`comentari\` TEXT NULL,
        \`data_registre\` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (\`id_nota\`)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS \`sortides_aula\` (
        \`id\` INT NOT NULL AUTO_INCREMENT,
        \`sessio_id\` INT NOT NULL,
        \`alumne_id\` INT NOT NULL,
        \`hora_sortida\` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        \`hora_tornada\` DATETIME NULL,
        \`durada_minuts\` INT NULL,
        PRIMARY KEY (\`id\`)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS \`justificacions\` (
        \`id\` INT NOT NULL AUTO_INCREMENT,
        \`alumne_id\` INT NOT NULL,
        \`data_inici\` DATE NOT NULL,
        \`data_fi\` DATE NOT NULL,
        \`motiu\` TEXT NOT NULL,
        \`arxiu_url\` TEXT NULL,
        \`estat\` ENUM('pendent', 'validada', 'rebutjada') NOT NULL DEFAULT 'pendent',
        \`observacions_professor\` TEXT NULL,
        \`data_solicitud\` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (\`id\`)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS \`logs_auditoria\` (
        \`id\` INT NOT NULL AUTO_INCREMENT,
        \`usuari_autor_id\` INT NOT NULL,
        \`usuari_afectat_id\` INT NULL,
        \`accio\` VARCHAR(50) NOT NULL,
        \`detalls\` JSON NULL,
        \`data_accio\` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        \`ip_origen\` VARCHAR(45) NULL,
        PRIMARY KEY (\`id\`)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS \`dispositius\` (
        \`id_dispositiu\` INT NOT NULL AUTO_INCREMENT,
        \`usuari_id\` INT NOT NULL,
        \`fingerprint\` VARCHAR(255) NOT NULL,
        \`confianca\` TINYINT(1) NOT NULL DEFAULT 0,
        PRIMARY KEY (\`id_dispositiu\`)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS \`subscripcions_push\` (
        \`id\` INT NOT NULL AUTO_INCREMENT,
        \`usuari_id\` INT NOT NULL,
        \`token_subscripcio\` TEXT NOT NULL,
        \`agent_usuari\` VARCHAR(255) NULL,
        \`data_creacio\` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (\`id\`)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS \`attendance_tokens\` (
        \`id\` INT NOT NULL AUTO_INCREMENT,
        \`token\` VARCHAR(255) NOT NULL,
        \`modul_id\` INT NOT NULL,
        \`professor_id\` INT NOT NULL,
        \`late_minutes\` INT DEFAULT 15,
        \`absent_minutes\` INT DEFAULT 30,
        \`expires_at\` DATETIME NOT NULL,
        \`is_used\` TINYINT(1) NOT NULL DEFAULT 0,
        \`created_at\` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (\`id\`),
        INDEX \`IDX_attendance_token_modul\` (\`modul_id\`),
        INDEX \`IDX_attendance_token_expires\` (\`expires_at\`)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS \`relacio_familia_alumnes\` (
        \`alumne_id\` INT NOT NULL,
        \`tutor_id\` INT NOT NULL,
        PRIMARY KEY (\`alumne_id\`, \`tutor_id\`)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);

    await queryRunner.query(`
      ALTER TABLE \`grups\`
      ADD CONSTRAINT \`FK_grups_tutor\` FOREIGN KEY (\`tutor_id\`) REFERENCES \`usuaris\`(\`id\`) ON DELETE SET NULL,
      ADD CONSTRAINT \`FK_grups_delegat\` FOREIGN KEY (\`delegat_id\`) REFERENCES \`usuaris\`(\`id\`) ON DELETE SET NULL
    `);

    await queryRunner.query(`
      ALTER TABLE \`usuaris\`
      ADD CONSTRAINT \`FK_usuaris_grup\` FOREIGN KEY (\`grup_id\`) REFERENCES \`grups\`(\`id\`) ON DELETE SET NULL
    `);

    await queryRunner.query(`
      ALTER TABLE \`matricules\`
      ADD CONSTRAINT \`FK_matricules_alumne\` FOREIGN KEY (\`alumne_id\`) REFERENCES \`usuaris\`(\`id\`) ON DELETE CASCADE,
      ADD CONSTRAINT \`FK_matricules_assignatura\` FOREIGN KEY (\`assignatura_id\`) REFERENCES \`assignatures\`(\`id\`) ON DELETE CASCADE
    `);

    await queryRunner.query(`
      ALTER TABLE \`assignacions_docents\`
      ADD CONSTRAINT \`FK_assignacions_professor\` FOREIGN KEY (\`professor_id\`) REFERENCES \`usuaris\`(\`id\`) ON DELETE CASCADE,
      ADD CONSTRAINT \`FK_assignacions_assignatura\` FOREIGN KEY (\`assignatura_id\`) REFERENCES \`assignatures\`(\`id\`) ON DELETE CASCADE,
      ADD CONSTRAINT \`FK_assignacions_grup\` FOREIGN KEY (\`grup_id\`) REFERENCES \`grups\`(\`id\`) ON DELETE CASCADE
    `);

    await queryRunner.query(`
      ALTER TABLE \`moduls\`
      ADD CONSTRAINT \`FK_moduls_professor\` FOREIGN KEY (\`professor_id\`) REFERENCES \`usuaris\`(\`id\`) ON DELETE SET NULL,
      ADD CONSTRAINT \`FK_moduls_grup\` FOREIGN KEY (\`grup_id\`) REFERENCES \`grups\`(\`id\`) ON DELETE SET NULL
    `);

    await queryRunner.query(`
      ALTER TABLE \`horaris\`
      ADD CONSTRAINT \`FK_horaris_assignacio\` FOREIGN KEY (\`assignacio_docent_id\`) REFERENCES \`assignacions_docents\`(\`id\`) ON DELETE CASCADE
    `);

    await queryRunner.query(`
      ALTER TABLE \`sessions\`
      ADD CONSTRAINT \`FK_sessions_assignacio\` FOREIGN KEY (\`assignacio_docent_id\`) REFERENCES \`assignacions_docents\`(\`id\`) ON DELETE CASCADE
    `);

    await queryRunner.query(`
      ALTER TABLE \`assistencies\`
      ADD CONSTRAINT \`FK_assistencies_sessio\` FOREIGN KEY (\`sessio_id\`) REFERENCES \`sessions\`(\`id\`) ON DELETE CASCADE,
      ADD CONSTRAINT \`FK_assistencies_alumne\` FOREIGN KEY (\`alumne_id\`) REFERENCES \`usuaris\`(\`id\`) ON DELETE CASCADE,
      ADD CONSTRAINT \`FK_assistencies_modul\` FOREIGN KEY (\`modul_id\`) REFERENCES \`moduls\`(\`id\`) ON DELETE SET NULL
    `);

    await queryRunner.query(`
      ALTER TABLE \`notes\`
      ADD CONSTRAINT \`FK_notes_alumne\` FOREIGN KEY (\`alumne_id\`) REFERENCES \`usuaris\`(\`id\`) ON DELETE CASCADE,
      ADD CONSTRAINT \`FK_notes_modul\` FOREIGN KEY (\`modul_id\`) REFERENCES \`moduls\`(\`id\`) ON DELETE CASCADE
    `);

    await queryRunner.query(`
      ALTER TABLE \`sortides_aula\`
      ADD CONSTRAINT \`FK_sortides_sessio\` FOREIGN KEY (\`sessio_id\`) REFERENCES \`sessions\`(\`id\`) ON DELETE CASCADE,
      ADD CONSTRAINT \`FK_sortides_alumne\` FOREIGN KEY (\`alumne_id\`) REFERENCES \`usuaris\`(\`id\`) ON DELETE CASCADE
    `);

    await queryRunner.query(`
      ALTER TABLE \`justificacions\`
      ADD CONSTRAINT \`FK_justificacions_alumne\` FOREIGN KEY (\`alumne_id\`) REFERENCES \`usuaris\`(\`id\`) ON DELETE CASCADE
    `);

    await queryRunner.query(`
      ALTER TABLE \`logs_auditoria\`
      ADD CONSTRAINT \`FK_logs_autor\` FOREIGN KEY (\`usuari_autor_id\`) REFERENCES \`usuaris\`(\`id\`) ON DELETE CASCADE
    `);

    await queryRunner.query(`
      ALTER TABLE \`dispositius\`
      ADD CONSTRAINT \`FK_dispositius_usuari\` FOREIGN KEY (\`usuari_id\`) REFERENCES \`usuaris\`(\`id\`) ON DELETE CASCADE
    `);

    await queryRunner.query(`
      ALTER TABLE \`subscripcions_push\`
      ADD CONSTRAINT \`FK_subscripcions_usuari\` FOREIGN KEY (\`usuari_id\`) REFERENCES \`usuaris\`(\`id\`) ON DELETE CASCADE
    `);

    await queryRunner.query(`
      ALTER TABLE \`relacio_familia_alumnes\`
      ADD CONSTRAINT \`FK_relacio_alumne\` FOREIGN KEY (\`alumne_id\`) REFERENCES \`usuaris\`(\`id\`) ON DELETE CASCADE,
      ADD CONSTRAINT \`FK_relacio_tutor\` FOREIGN KEY (\`tutor_id\`) REFERENCES \`usuaris\`(\`id\`) ON DELETE CASCADE
    `);

    await queryRunner.query(`
      INSERT INTO \`migrations\` (\`timestamp\`, \`name\`) VALUES (1700000000000, 'InitialSchema1700000000000')
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DROP TABLE IF EXISTS \`relacio_familia_alumnes\`
    `);
    await queryRunner.query(`
      DROP TABLE IF EXISTS \`attendance_tokens\`
    `);
    await queryRunner.query(`
      DROP TABLE IF EXISTS \`subscripcions_push\`
    `);
    await queryRunner.query(`
      DROP TABLE IF EXISTS \`dispositius\`
    `);
    await queryRunner.query(`
      DROP TABLE IF EXISTS \`logs_auditoria\`
    `);
    await queryRunner.query(`
      DROP TABLE IF EXISTS \`justificacions\`
    `);
    await queryRunner.query(`
      DROP TABLE IF EXISTS \`sortides_aula\`
    `);
    await queryRunner.query(`
      DROP TABLE IF EXISTS \`notes\`
    `);
    await queryRunner.query(`
      DROP TABLE IF EXISTS \`assistencies\`
    `);
    await queryRunner.query(`
      DROP TABLE IF EXISTS \`sessions\`
    `);
    await queryRunner.query(`
      DROP TABLE IF EXISTS \`horaris\`
    `);
    await queryRunner.query(`
      DROP TABLE IF EXISTS \`moduls\`
    `);
    await queryRunner.query(`
      DROP TABLE IF EXISTS \`assignacions_docents\`
    `);
    await queryRunner.query(`
      DROP TABLE IF EXISTS \`matricules\`
    `);
    await queryRunner.query(`
      DROP TABLE IF EXISTS \`assignatures\`
    `);
    await queryRunner.query(`
      DROP TABLE IF EXISTS \`usuaris\`
    `);
    await queryRunner.query(`
      DROP TABLE IF EXISTS \`grups\`
    `);
  }
}