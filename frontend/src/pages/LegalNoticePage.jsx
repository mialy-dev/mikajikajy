
import { LegalPage } from "../components/LegalPage";

const LEGAL = {
  company: "[Nom légal de l'entreprise ou de l'éditeur]",
  representative: "[Nom du représentant légal]",
  address: "[Adresse officielle]",
  email: "[Adresse e-mail officielle]",
  phone: "[Téléphone officiel]",
  registration: "[Numéro d'immatriculation, si applicable]",
  host: "[Nom de l'hébergeur]",
  hostAddress: "[Adresse de l'hébergeur]",
  hostWebsite: "[Site web de l'hébergeur]",
};

export default function LegalNoticePage() {
  return (
    <LegalPage title="Mentions légales">
      <div className="space-y-8">

        <p className="text-sm text-gray-500">
          Dernière mise à jour : [Date à compléter]
        </p>

        <section>
          <h2 className="text-xl font-bold text-primary">
            1. Éditeur de la plateforme
          </h2>
          <p>
            La plateforme E-KAJY est éditée par :
          </p>
          <ul className="list-disc space-y-2 pl-6">
            <li>Nom ou raison sociale : {LEGAL.company}</li>
            <li>Représentant légal : {LEGAL.representative}</li>
            <li>Adresse : {LEGAL.address}</li>
            <li>E-mail : {LEGAL.email}</li>
            <li>Téléphone : {LEGAL.phone}</li>
            <li>Immatriculation : {LEGAL.registration}</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-bold text-primary">
            2. Hébergement
          </h2>
          <p>
            La plateforme est hébergée par le prestataire suivant :
          </p>
          <ul className="list-disc space-y-2 pl-6">
            <li>Hébergeur : {LEGAL.host}</li>
            <li>Adresse : {LEGAL.hostAddress}</li>
            <li>Site web : {LEGAL.hostWebsite}</li>
          </ul>
          <p>
            Ces informations doivent correspondre à l'hébergement
            réellement utilisé par la plateforme.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-primary">
            3. Objet de la plateforme
          </h2>
          <p>
            E-KAJY est une application numérique destinée à faciliter
            la gestion des bâtiments et des projets de construction.
            Elle propose notamment des outils de suivi des chantiers,
            de gestion documentaire, de coordination et de suivi des activités.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-primary">
            4. Propriété intellectuelle
          </h2>
          <p>
            Les éléments propres à E-KAJY, notamment son identité visuelle,
            ses textes, son interface et ses éléments graphiques,
            sont protégés par les règles applicables en matière de
            propriété intellectuelle.
          </p>
          <p>
            Toute reproduction, modification ou exploitation non autorisée
            de ces éléments peut être interdite par la législation applicable.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-primary">
            5. Responsabilité
          </h2>
          <p>
            L'éditeur s'efforce de fournir une plateforme fonctionnelle
            et des informations fiables. Toutefois, il ne garantit pas
            une disponibilité permanente du service.
          </p>
          <p>
            Chaque utilisateur reste responsable des informations
            et documents qu'il ajoute à la plateforme.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-primary">
            6. Contact
          </h2>
          <p>
            Pour toute question relative aux présentes mentions légales,
            vous pouvez contacter l'éditeur aux coordonnées indiquées
            dans la présente page.
          </p>
        </section>

      </div>
    </LegalPage>
  );
}
