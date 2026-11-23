CREATE TABLE IF NOT EXISTS messages_contact (
  id            SERIAL PRIMARY KEY,
  nom_complet   VARCHAR(150) NOT NULL,
  email         VARCHAR(255) NOT NULL,
  telephone     VARCHAR(30),
  sujet         VARCHAR(200) NOT NULL,
  categorie     VARCHAR(50)  NOT NULL,
  message       TEXT         NOT NULL,
  statut        VARCHAR(20)  NOT NULL DEFAULT 'Nouveau'
                CHECK (statut IN ('Nouveau', 'En cours', 'Traité')),
  date_creation TIMESTAMPTZ  NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_messages_contact_statut ON messages_contact (statut);
CREATE INDEX IF NOT EXISTS idx_messages_contact_date   ON messages_contact (date_creation DESC);