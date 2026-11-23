
import { LegalPage } from "../components/LegalPage";

export default function PrivacyPage() {
  return (
    <LegalPage title="Politique de confidentialité">
      <div className="space-y-8">

        <p className="text-sm text-gray-500">
          Dernière mise à jour : [Date à compléter]
        </p>

        <section>
          <p className="text-lg font-medium text-gray-800">
            La protection de vos données personnelles est une priorité
            pour E-KAJY.
          </p>
          <p>
            Cette politique explique quelles informations peuvent être
            collectées, pourquoi elles sont utilisées et comment elles
            sont protégées lorsque vous utilisez notre plateforme.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-primary">
            1. Données collectées
          </h2>
          <p>
            Selon les fonctionnalités utilisées, les catégories de données
            susceptibles d'être traitées comprennent :
          </p>
          <ul className="list-disc space-y-2 pl-6">
            <li>Informations d'identification : nom, prénom et identifiant.</li>
            <li>Coordonnées : adresse e-mail et numéro de téléphone.</li>
            <li>Données de compte : identifiants de connexion et rôle utilisateur.</li>
            <li>Données professionnelles : projets, chantiers et équipes.</li>
            <li>Documents : plans, photographies, constats et procès-verbaux.</li>
            <li>Données techniques : journaux de connexion et informations nécessaires au fonctionnement du service.</li>
          </ul>
          <p>
            Seules les données effectivement nécessaires aux fonctionnalités
            utilisées doivent être collectées.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-primary">
            2. Utilisation des données
          </h2>
          <p>Les informations peuvent être utilisées pour :</p>
          <ul className="list-disc space-y-2 pl-6">
            <li>Créer et gérer les comptes utilisateurs.</li>
            <li>Permettre l'accès aux fonctionnalités de la plateforme.</li>
            <li>Organiser et suivre les projets de construction.</li>
            <li>Gérer les documents et les activités des chantiers.</li>
            <li>Assurer l'assistance et le support technique.</li>
            <li>Améliorer le fonctionnement et la sécurité du service.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-bold text-primary">
            3. Conservation des données
          </h2>
          <p>
            Les données sont conservées pendant la durée nécessaire
            aux finalités pour lesquelles elles sont traitées, sous réserve
            des obligations légales et contractuelles applicables.
          </p>
          <p>
            Les durées précises de conservation doivent être définies
            et communiquées par l'éditeur.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-primary">
            4. Protection des données
          </h2>
          <p>
            E-KAJY doit mettre en œuvre des mesures techniques et
            organisationnelles adaptées afin de protéger les informations
            contre les accès non autorisés, les pertes, les modifications
            et les divulgations non autorisées.
          </p>
          <p>
            L'accès aux données doit être limité aux personnes
            autorisées selon leurs responsabilités.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-primary">
            5. Partage des données
          </h2>
          <p>
            Les données ne doivent être accessibles qu'aux personnes
            autorisées et aux prestataires intervenant légitimement
            dans le fonctionnement du service, dans la limite de leurs
            missions et des règles applicables.
          </p>
          <p>
            Les conditions de partage avec des tiers et les éventuels
            transferts internationaux doivent être précisés par l'éditeur.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-primary">
            6. Vos droits
          </h2>
          <p>
            Selon la législation applicable, vous pouvez notamment
            disposer de droits concernant vos données personnelles :
          </p>
          <ul className="list-disc space-y-2 pl-6">
            <li>Le droit d'être informé sur leur utilisation.</li>
            <li>Le droit de demander l'accès à vos données.</li>
            <li>Le droit de demander la rectification des informations inexactes.</li>
            <li>Le droit de demander leur suppression lorsque les conditions le permettent.</li>
            <li>Le droit de vous opposer à certains traitements, lorsque cela est applicable.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-bold text-primary">
            7. Cookies et technologies similaires
          </h2>
          <p>
            La plateforme peut utiliser des technologies nécessaires
            à son fonctionnement, notamment pour maintenir une session
            utilisateur ou mémoriser certaines préférences.
          </p>
          <p>
            Les éventuels cookies supplémentaires doivent être décrits
            selon les technologies réellement utilisées.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-primary">
            8. Modifications de la politique
          </h2>
          <p>
            Cette politique peut être mise à jour pour tenir compte
            de l'évolution de la plateforme ou des obligations applicables.
            La date de la dernière mise à jour doit être indiquée.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-primary">
            9. Contact
          </h2>
          <p>
            Pour toute question ou demande concernant vos données
            personnelles, contactez l'éditeur d'E-KAJY par les moyens
            indiqués sur la page Contact.
          </p>
        </section>

      </div>
    </LegalPage>
  );
}
