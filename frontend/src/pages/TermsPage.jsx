
import { LegalPage } from "../components/LegalPage";

export default function TermsPage() {
  return (
    <LegalPage title="Conditions générales d'utilisation">
      <div className="space-y-8">

        <p className="text-sm text-gray-500">
          Dernière mise à jour : [Date à compléter]
        </p>

        <section>
          <h2 className="text-xl font-bold text-primary">1. Objet</h2>
          <p>
            Les présentes conditions générales définissent les règles
            d'accès et d'utilisation de la plateforme E-KAJY.
          </p>
          <p>
            E-KAJY est une application numérique destinée à faciliter
            la gestion des bâtiments et des projets de construction.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-primary">
            2. Accès au service et licence
          </h2>
          <p>
            L'accès à certaines fonctionnalités peut nécessiter
            la création d'un compte ou l'activation d'une licence.
          </p>
          <p>
            Les conditions de durée, de renouvellement et de tarification
            sont précisées dans l'offre correspondante.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-primary">
            3. Création et sécurité du compte
          </h2>
          <p>
            L'utilisateur s'engage à fournir des informations exactes
            et à protéger ses identifiants de connexion.
          </p>
          <p>
            Toute utilisation suspecte doit être signalée à l'administrateur.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-primary">
            4. Obligations des utilisateurs
          </h2>
          <ul className="list-disc space-y-2 pl-6">
            <li>Utiliser la plateforme conformément à la loi.</li>
            <li>Fournir des informations exactes.</li>
            <li>Respecter les droits des autres utilisateurs.</li>
            <li>Ne pas accéder aux espaces non autorisés.</li>
            <li>Ne pas perturber le fonctionnement du service.</li>
            <li>Ne pas transmettre de fichiers malveillants.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-bold text-primary">
            5. Gestion des projets et documents
          </h2>
          <p>
            Les utilisateurs restent responsables des informations,
            photographies, plans et documents qu'ils déposent sur E-KAJY.
          </p>
          <p>
            Ils doivent disposer des autorisations nécessaires pour
            partager ces documents.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-primary">
            6. Responsabilités
          </h2>
          <p>
            L'éditeur met en œuvre des efforts raisonnables pour assurer
            le bon fonctionnement de la plateforme.
          </p>
          <p>
            Des interruptions peuvent survenir en raison de maintenances,
            de difficultés techniques ou de problèmes liés aux services externes.
          </p>
          <p>
            E-KAJY est un outil d'aide à la gestion et ne remplace pas
            les contrôles techniques ni les décisions des professionnels
            responsables des chantiers.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-primary">
            7. Propriété intellectuelle
          </h2>
          <p>
            Les éléments propres à E-KAJY, notamment le logiciel,
            l'interface, les textes et les éléments graphiques,
            sont protégés par les règles applicables.
          </p>
          <p>
            Toute reproduction ou exploitation non autorisée est interdite
            dans les limites prévues par la législation applicable.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-primary">
            8. Suspension et résiliation
          </h2>
          <p>
            L'accès à un compte peut être suspendu en cas de problème
            de sécurité ou de violation des présentes conditions,
            dans le respect des règles applicables.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-primary">
            9. Modification des conditions
          </h2>
          <p>
            L'éditeur peut mettre à jour les présentes conditions
            pour tenir compte de l'évolution de la plateforme.
            La date de mise à jour sera indiquée sur cette page.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-primary">
            10. Droit applicable et litiges
          </h2>
          <p>
            Les présentes conditions sont soumises au droit applicable
            déterminé par l'éditeur, sous réserve des règles impératives.
            En cas de différend, les parties peuvent rechercher
            une solution amiable.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-primary">
            11. Contact
          </h2>
          <p>
            Pour toute question concernant les présentes conditions,
            veuillez consulter notre page Contact.
          </p>
        </section>

      </div>
    </LegalPage>
  );
}
