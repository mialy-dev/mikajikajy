CREATE TABLE IF NOT EXISTS entreprises (
  id SERIAL PRIMARY KEY,
  nom VARCHAR(200) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS utilisateurs (
  id SERIAL PRIMARY KEY,
  entreprise_id INT REFERENCES entreprises(id),
  nom VARCHAR(150) NOT NULL,
  email VARCHAR(200) UNIQUE NOT NULL,
  mot_de_passe_hash TEXT NOT NULL,
  role VARCHAR(20) NOT NULL DEFAULT 'lecteur'
    CHECK (role IN ('superadmin','editeur','lecteur','intervenant')),
  actif BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS historique (
  id SERIAL PRIMARY KEY,
  utilisateur_id INT REFERENCES utilisateurs(id),
  action VARCHAR(50) NOT NULL,
  entite VARCHAR(50),
  entite_id INT,
  details JSONB,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS notifications (
  id SERIAL PRIMARY KEY,
  utilisateur_id INT NOT NULL REFERENCES utilisateurs(id),
  message TEXT NOT NULL,
  lu BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);