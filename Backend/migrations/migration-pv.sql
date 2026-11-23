-- Module PV E-KAJY  |  node apply-migration.js migration-pv.sql
-- Les PV sont rattachés à la table "chantiers" (colonne projet_id = id du chantier)

CREATE SEQUENCE IF NOT EXISTS pv_numero_seq START 1;

CREATE TABLE IF NOT EXISTS types_pv (
  id          SERIAL PRIMARY KEY,
  code        VARCHAR(40) UNIQUE NOT NULL,
  libelle     VARCHAR(120) NOT NULL,
  description TEXT,
  categorie   VARCHAR(10) NOT NULL DEFAULT 'autre' CHECK (categorie IN ('principal','autre')),
  ordre       INT NOT NULL DEFAULT 0,
  actif       BOOLEAN NOT NULL DEFAULT TRUE
);

INSERT INTO types_pv (code, libelle, description, categorie, ordre) VALUES
 ('mise-en-eau','PV Mise en eau','Essais et vérification des installations hydrauliques.','principal',1),
 ('reception','PV Réception','Réception provisoire, définitive et avec réserves.','principal',2),
 ('reunion','PV de réunion','Décisions, participants et comptes rendus.','principal',3),
 ('constat','PV de constat','Observations, anomalies et non-conformités.','principal',4),
 ('visite-chantier','PV de visite de chantier','Visite et observations sur site.','autre',5),
 ('avancement','PV d''avancement des travaux','Travaux réalisés et pourcentage d''avancement.','autre',6),
 ('arret-reprise','PV d''arrêt et de reprise des travaux','Arrêt et reprise des travaux.','autre',7),
 ('livraison','PV de livraison','Livraison de l''ouvrage ou des équipements.','autre',8),
 ('levee-reserves','PV de levée des réserves','Constat de la levée des réserves.','autre',9),
 ('non-conformite','PV de non-conformité','Non-conformités constatées.','autre',10),
 ('modification-travaux','PV de modification des travaux','Modifications au marché ou aux plans.','autre',11)
ON CONFLICT (code) DO NOTHING;

-- Le type de chantiers.id (INTEGER, BIGINT ou UUID) est détecté automatiquement.
DO $mig$
DECLARE
  id_type text;
BEGIN
  SELECT CASE data_type WHEN 'uuid' THEN 'UUID' WHEN 'bigint' THEN 'BIGINT'
                        WHEN 'integer' THEN 'INTEGER' WHEN 'smallint' THEN 'SMALLINT'
                        ELSE upper(data_type) END
    INTO id_type
    FROM information_schema.columns
   WHERE table_schema = 'public' AND table_name = 'chantiers' AND column_name = 'id';

  IF id_type IS NULL THEN
    RAISE EXCEPTION 'Table "chantiers" (colonne id) introuvable : remplacez le nom "chantiers" dans migration-pv.sql par celui de votre table de chantiers';
  END IF;

  EXECUTE format($f$
    CREATE TABLE IF NOT EXISTS proces_verbaux (
      id                SERIAL PRIMARY KEY,
      numero            VARCHAR(40) UNIQUE NOT NULL,
      type_id           INT NOT NULL REFERENCES types_pv(id),
      projet_id         %s NOT NULL REFERENCES chantiers(id) ON DELETE CASCADE,
      titre             VARCHAR(200) NOT NULL,
      date_pv           DATE NOT NULL DEFAULT CURRENT_DATE,
      lieu              VARCHAR(200),
      objet             TEXT,
      observations      TEXT,
      details           JSONB NOT NULL DEFAULT '{}'::jsonb,
      avancement        NUMERIC(5,2) CHECK (avancement BETWEEN 0 AND 100),
      statut            VARCHAR(20) NOT NULL DEFAULT 'brouillon'
                        CHECK (statut IN ('brouillon','soumis','en_verification','valide','rejete','signe','archive')),
      created_by        INTEGER NOT NULL,
      created_at        TIMESTAMPTZ NOT NULL DEFAULT now(),
      updated_at        TIMESTAMPTZ NOT NULL DEFAULT now()
    )$f$, id_type);
END
$mig$;
CREATE INDEX IF NOT EXISTS idx_pv_projet ON proces_verbaux(projet_id);
CREATE INDEX IF NOT EXISTS idx_pv_type   ON proces_verbaux(type_id);
CREATE INDEX IF NOT EXISTS idx_pv_statut ON proces_verbaux(statut);

CREATE TABLE IF NOT EXISTS pv_participants (
  id        SERIAL PRIMARY KEY,
  pv_id     INT NOT NULL REFERENCES proces_verbaux(id) ON DELETE CASCADE,
  nom       VARCHAR(150) NOT NULL,
  fonction  VARCHAR(150),
  entreprise VARCHAR(150),
  email     VARCHAR(150),
  present   BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE TABLE IF NOT EXISTS pv_reserves (
  id            SERIAL PRIMARY KEY,
  pv_id         INT NOT NULL REFERENCES proces_verbaux(id) ON DELETE CASCADE,
  description   TEXT NOT NULL,
  responsable   VARCHAR(150),
  echeance      DATE,
  levee         BOOLEAN NOT NULL DEFAULT FALSE,
  date_levee    DATE
);

CREATE TABLE IF NOT EXISTS pv_signatures (
  id          SERIAL PRIMARY KEY,
  pv_id       INT NOT NULL REFERENCES proces_verbaux(id) ON DELETE CASCADE,
  user_id     INTEGER,
  nom         VARCHAR(150) NOT NULL,
  fonction    VARCHAR(150),
  signature   TEXT,                       -- image base64 (canvas) facultative
  signe_le    TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS pv_validations (
  id          SERIAL PRIMARY KEY,
  pv_id       INT NOT NULL REFERENCES proces_verbaux(id) ON DELETE CASCADE,
  user_id     INTEGER,
  valideur    VARCHAR(150),
  decision    VARCHAR(20) NOT NULL CHECK (decision IN ('en_verification','valide','rejete')),
  commentaire TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS pv_documents (
  id          SERIAL PRIMARY KEY,
  pv_id       INT NOT NULL REFERENCES proces_verbaux(id) ON DELETE CASCADE,
  nom         VARCHAR(200) NOT NULL,
  url         TEXT NOT NULL,
  type        VARCHAR(40) DEFAULT 'pdf',  -- pdf, photo, annexe
  ajoute_par  INTEGER,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS pv_historique (
  id         SERIAL PRIMARY KEY,
  pv_id      INT NOT NULL REFERENCES proces_verbaux(id) ON DELETE CASCADE,
  user_id    INTEGER,
  auteur     VARCHAR(150),
  action     VARCHAR(40) NOT NULL,        -- creation, modification, statut, signature
  details    JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_pv_hist_pv ON pv_historique(pv_id);
