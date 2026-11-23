import React from "react";
import "./Dashboard.css";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { BadgeMessagesContact } from "./MessagesContact";

const DashboardBody = () => {
  const { peut } = useAuth();

  const statistiques = [
    {
      titre: "Total des chantiers",
      valeur: "24",
      icone: "🏗️",
      description: "Chantiers enregistrés",
    },
    {
      titre: "PV en attente",
      valeur: "08",
      icone: "📄",
      description: "À valider",
    },
    {
      titre: "PV validés",
      valeur: "16",
      icone: "✅",
      description: "Documents approuvés",
    },
    {
      titre: "Intervenants",
      valeur: "32",
      icone: "👷",
      description: "Personnes enregistrées",
    },
  ];

  const chantiers = [
    {
      reference: "CH-001",
      nom: "Construction bâtiment A",
      localisation: "Antananarivo",
      progression: 75,
      statut: "En cours",
    },
    {
      reference: "CH-002",
      nom: "Réhabilitation bâtiment B",
      localisation: "Antsirabe",
      progression: 45,
      statut: "En cours",
    },
    {
      reference: "CH-003",
      nom: "Aménagement extérieur",
      localisation: "Toamasina",
      progression: 100,
      statut: "Terminé",
    },
  ];

  return (
    <main className="dashboard-body">
      <div className="dashboard-heading">
        <div>
          <h1>Tableau de bord</h1>
          <p>Bienvenue sur votre espace de gestion E-KAJY.</p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {peut("superadmin") && (
            <Link
              to="/dashboard/messages"
              className="inline-flex items-center rounded-lg border border-[#18304F] px-4 py-2 text-sm font-medium text-[#18304F] hover:bg-slate-100"
            >
              Messages de contact <BadgeMessagesContact />
            </Link>
          )}
          <span className="dashboard-date">
            E-KAJY | Gestion des chantiers
          </span>
        </div>
      </div>

      {/* STATISTIQUES */}
      <section className="stats-grid">
        {statistiques.map((stat, index) => (
          <article className="stat-card" key={index}>
            <div className="stat-top">
              <span className="stat-icon">{stat.icone}</span>
              <span className="stat-value">{stat.valeur}</span>
            </div>

            <h3>{stat.titre}</h3>
            <p>{stat.description}</p>
          </article>
        ))}
      </section>

      {/* LISTE DES CHANTIERS */}
      <section className="dashboard-section">
        <div className="section-heading">
          <div>
            <h2>Chantiers récents</h2>
            <p>Suivi de l'avancement des travaux</p>
          </div>

          <button className="primary-button">
            + Nouveau chantier
          </button>
        </div>

        <div className="table-container">
          <table className="chantier-table">
            <thead>
              <tr>
                <th>Référence</th>
                <th>Nom du chantier</th>
                <th>Localisation</th>
                <th>Progression</th>
                <th>Statut</th>
              </tr>
            </thead>

            <tbody>
              {chantiers.map((chantier, index) => (
                <tr key={index}>
                  <td>{chantier.reference}</td>
                  <td>{chantier.nom}</td>
                  <td>{chantier.localisation}</td>
                  <td>
                    <div className="progress-container">
                      <div className="progress-bar">
                        <div
                          className="progress-fill"
                          style={{
                            width: `${chantier.progression}%`,
                          }}
                        />
                      </div>
                      <span>{chantier.progression}%</span>
                    </div>
                  </td>
                  <td>
                    <span
                      className={`status ${
                        chantier.statut === "Terminé"
                          ? "status-finished"
                          : "status-progress"
                      }`}
                    >
                      {chantier.statut}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* ACTIVITES */}
      <section className="dashboard-section activity-section">
        <h2>Activités récentes</h2>

        <div className="activity-item">
          <span>📄</span>
          <div>
            <strong>Nouveau PV créé</strong>
            <p>Un procès-verbal a été ajouté.</p>
          </div>
        </div>

        <div className="activity-item">
          <span>✅</span>
          <div>
            <strong>Validation d'un PV</strong>
            <p>Un document a été validé.</p>
          </div>
        </div>

        <div className="activity-item">
          <span>🏗️</span>
          <div>
            <strong>Chantier mis à jour</strong>
            <p>L'avancement des travaux a été modifié.</p>
          </div>
        </div>
      </section>
    </main>
  );
};

export default DashboardBody;