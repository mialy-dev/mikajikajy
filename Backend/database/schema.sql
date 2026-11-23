
CREATE TABLE entreprises (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    nom VARCHAR(255) NOT NULL,
    adresse TEXT,
    telephone VARCHAR(50),
    email VARCHAR(255),
    logo TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE utilisateurs (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    entreprise_id BIGINT REFERENCES entreprises(id)
        ON DELETE CASCADE,
    nom VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(30) NOT NULL DEFAULT 'lecteur'
        CHECK (role IN (
            'superadmin',
            'editeur',
            'lecteur',
            'intervenant'
        )),
    actif BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE chantiers (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    entreprise_id BIGINT NOT NULL REFERENCES entreprises(id)
        ON DELETE CASCADE,
    reference VARCHAR(100) NOT NULL,
    nom VARCHAR(255) NOT NULL,
    adresse TEXT,
    maitre_ouvrage VARCHAR(255),
    statut VARCHAR(50) DEFAULT 'nouveau',
    date_debut DATE,
    date_fin DATE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE (entreprise_id, reference)
);

CREATE TABLE intervenants (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    entreprise_id BIGINT NOT NULL REFERENCES entreprises(id)
        ON DELETE CASCADE,
    nom VARCHAR(255) NOT NULL,
    fonction VARCHAR(255),
    organisme VARCHAR(255),
    email VARCHAR(255),
    telephone VARCHAR(50)
);

CREATE TABLE proces_verbaux (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    chantier_id BIGINT NOT NULL REFERENCES chantiers(id)
        ON DELETE CASCADE,
    redacteur_id BIGINT NOT NULL REFERENCES utilisateurs(id)
        ON DELETE CASCADE,
    numero VARCHAR(100) NOT NULL,
    objet TEXT NOT NULL,
    date_reunion DATE NOT NULL,
    lieu TEXT,
    contenu JSONB DEFAULT '{}'::jsonb,
    statut VARCHAR(40) DEFAULT 'brouillon'
        CHECK (statut IN (
            'brouillon',
            'en_validation',
            'valide',
            'archive'
        )),
    valide_le TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE (chantier_id, numero)
);

CREATE TABLE pv_participants (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    proces_verbal_id BIGINT NOT NULL REFERENCES proces_verbaux(id)
        ON DELETE CASCADE,
    intervenant_id BIGINT NOT NULL REFERENCES intervenants(id)
        ON DELETE CASCADE,
    present BOOLEAN DEFAULT FALSE,
    UNIQUE (proces_verbal_id, intervenant_id)
);

CREATE TABLE actions (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    proces_verbal_id BIGINT NOT NULL REFERENCES proces_verbaux(id)
        ON DELETE CASCADE,
    responsable_id BIGINT REFERENCES intervenants(id)
        ON DELETE CASCADE,
    description TEXT NOT NULL,
    echeance DATE,
    statut VARCHAR(40) DEFAULT 'a_faire'
);

CREATE TABLE reserves (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    chantier_id BIGINT NOT NULL REFERENCES chantiers(id)
        ON DELETE CASCADE,
    proces_verbal_id BIGINT REFERENCES proces_verbaux(id)
        ON DELETE CASCADE,
    description TEXT NOT NULL,
    responsable_id BIGINT REFERENCES intervenants(id)
        ON DELETE CASCADE,
    date_limite DATE,
    statut VARCHAR(40) DEFAULT 'ouverte'
);

CREATE TABLE documents (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    proces_verbal_id BIGINT NOT NULL REFERENCES proces_verbaux(id)
        ON DELETE CASCADE,
    nom_fichier VARCHAR(255) NOT NULL,
    chemin TEXT NOT NULL,
    type VARCHAR(100),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_chantiers_entreprise
ON chantiers(entreprise_id);

CREATE INDEX idx_pv_chantier
ON proces_verbaux(chantier_id);

CREATE INDEX idx_pv_statut
ON proces_verbaux(statut);

CREATE INDEX idx_intervenants_entreprise
ON intervenants(entreprise_id);

CREATE INDEX idx_actions_pv
ON actions(proces_verbal_id);
