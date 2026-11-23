
import React, { useState } from "react";
import "./ChantierBoard.css";

const colonnes = [
  { id: "a_planifier", titre: "À planifier", couleur: "#64748b" },
  { id: "a_faire", titre: "À faire", couleur: "#2563eb" },
  { id: "en_cours", titre: "En cours", couleur: "#d97706" },
  { id: "termine", titre: "Terminé", couleur: "#16a34a" },
];

const donneesInitiales = [
  {
    id: 1,
    reference: "CH-001",
    nom: "Construction bâtiment A",
    localisation: "Antananarivo",
    responsable: "Jean Rakoto",
    progression: 0,
    statut: "a_planifier",
  },
  {
    id: 2,
    reference: "CH-002",
    nom: "Réhabilitation bâtiment B",
    localisation: "Antsirabe",
    responsable: "Marie Rasoanaivo",
    progression: 20,
    statut: "a_faire",
  },
  {
    id: 3,
    reference: "CH-003",
    nom: "Travaux de toiture",
    localisation: "Toamasina",
    responsable: "Paul Randria",
    progression: 65,
    statut: "en_cours",
  },
  {
    id: 4,
    reference: "CH-004",
    nom: "Aménagement extérieur",
    localisation: "Fianarantsoa",
    responsable: "Hery Andry",
    progression: 100,
    statut: "termine",
  },
];

function ChantierBoard() {
  const [chantiers, setChantiers] = useState(donneesInitiales);

  const [recherche, setRecherche] = useState("");

  const [nouveauChantier, setNouveauChantier] = useState({
    nom: "",
    localisation: "",
    responsable: "",
  });

  const [modalOuvert, setModalOuvert] = useState(false);

  const deplacerChantier = (id, nouveauStatut) => {
    setChantiers((anciens) =>
      anciens.map((chantier) =>
        chantier.id === id
          ? {
              ...chantier,
              statut: nouveauStatut,
              progression:
                nouveauStatut === "termine"
                  ? 100
                  : nouveauStatut === "a_planifier"
                  ? 0
                  : chantier.progression === 100
                  ? 50
                  : chantier.progression,
            }
          : chantier
      )
    );
  };

  const ajouterChantier = (e) => {
    e.preventDefault();

    if (!nouveauChantier.nom.trim()) return;

    const chantier = {
      id: Date.now(),
      reference: `CH-${String(chantiers.length + 1).padStart(3, "0")}`,
      nom: nouveauChantier.nom,
      localisation: nouveauChantier.localisation,
      responsable: nouveauChantier.responsable,
      progression: 0,
      statut: "a_planifier",
    };

    setChantiers((anciens) => [...anciens, chantier]);

    setNouveauChantier({
      nom: "",
      localisation: "",
      responsable: "",
    });

    setModalOuvert(false);
  };

  const chantiersFiltres = chantiers.filter((chantier) =>
    `${chantier.nom} ${chantier.reference} ${chantier.localisation}`
      .toLowerCase()
      .includes(recherche.toLowerCase())
  );

  return (
    <main className="chantier-board">

      <div className="board-header">
        <div>
          <h1>Gestion des chantiers</h1>
          <p>Organisez et suivez l'avancement de vos travaux.</p>
        </div>

        <button
          className="board-add-button"
          onClick={() => setModalOuvert(true)}
        >
          + Nouveau chantier
        </button>
      </div>

      <div className="board-toolbar">
        <input
          type="search"
          placeholder="Rechercher un chantier..."
          value={recherche}
          onChange={(e) => setRecherche(e.target.value)}
        />

        <span>{chantiers.length} chantier(s) au total</span>
      </div>

      <div className="kanban-columns">

        {colonnes.map((colonne) => {
          const liste = chantiersFiltres.filter(
            (chantier) => chantier.statut === colonne.id
          );

          return (
            <section className="kanban-column" key={colonne.id}>

              <div className="kanban-column-header">
                <span
                  className="column-indicator"
                  style={{ background: colonne.couleur }}
                />

                <h2>{colonne.titre}</h2>

                <span className="column-count">{liste.length}</span>
              </div>

              <div className="kanban-cards">

                {liste.map((chantier) => (
                  <article className="kanban-card" key={chantier.id}>

                    <span className="chantier-reference">
                      {chantier.reference}
                    </span>

                    <h3>{chantier.nom}</h3>

                    <p>📍 {chantier.localisation || "Non renseignée"}</p>

                    <p>👷 {chantier.responsable || "Non affecté"}</p>

                    <div className="chantier-progress-info">
                      <span>Progression</span>
                      <strong>{chantier.progression}%</strong>
                    </div>

                    <div className="chantier-progress">
                      <div
                        style={{ width: `${chantier.progression}%` }}
                      />
                    </div>

                    <label>Changer le statut</label>

                    <select
                      value={chantier.statut}
                      onChange={(e) =>
                        deplacerChantier(
                          chantier.id,
                          e.target.value
                        )
                      }
                    >
                      {colonnes.map((option) => (
                        <option key={option.id} value={option.id}>
                          {option.titre}
                        </option>
                      ))}
                    </select>

                  </article>
                ))}

                {liste.length === 0 && (
                  <div className="kanban-empty">
                    Aucun chantier
                  </div>
                )}

              </div>
            </section>
          );
        })}

      </div>

      {modalOuvert && (
        <div className="board-modal-overlay">
          <form className="board-modal" onSubmit={ajouterChantier}>

            <h2>Nouveau chantier</h2>

            <label>Nom du chantier *</label>
            <input
              required
              value={nouveauChantier.nom}
              onChange={(e) =>
                setNouveauChantier({
                  ...nouveauChantier,
                  nom: e.target.value,
                })
              }
              placeholder="Ex : Construction bâtiment A"
            />

            <label>Localisation</label>
            <input
              value={nouveauChantier.localisation}
              onChange={(e) =>
                setNouveauChantier({
                  ...nouveauChantier,
                  localisation: e.target.value,
                })
              }
              placeholder="Ex : Antananarivo"
            />

            <label>Responsable</label>
            <input
              value={nouveauChantier.responsable}
              onChange={(e) =>
                setNouveauChantier({
                  ...nouveauChantier,
                  responsable: e.target.value,
                })
              }
              placeholder="Nom du responsable"
            />

            <div className="board-modal-actions">
              <button type="button" onClick={() => setModalOuvert(false)}>
                Annuler
              </button>

              <button type="submit">
                Enregistrer
              </button>
            </div>

          </form>
        </div>
      )}

    </main>
  );
}

export default ChantierBoard;
