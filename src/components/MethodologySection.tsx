import type { DashboardData, DepartmentMetrics } from "../types/dashboard";

type MethodologySectionProps = {
  departments: DepartmentMetrics[];
  metadata: DashboardData["metadata"];
  globalMetrics: DashboardData["global_metrics"];
};

function round(value: number, digits = 4) {
  return value.toFixed(digits);
}

function computePearsonDetails(departments: DepartmentMetrics[]) {
  const xs = departments.map((department) => department.pm25_mean);
  const ys = departments.map(
    (department) => department.asthma_hospitalization_rate,
  );
  const n = xs.length;

  const xMean = xs.reduce((sum, value) => sum + value, 0) / n;
  const yMean = ys.reduce((sum, value) => sum + value, 0) / n;

  const sxx = xs.reduce((sum, value) => sum + (value - xMean) ** 2, 0);
  const syy = ys.reduce((sum, value) => sum + (value - yMean) ** 2, 0);
  const sxy = xs.reduce(
    (sum, value, index) => sum + (value - xMean) * (ys[index] - yMean),
    0,
  );

  const r = sxy / Math.sqrt(sxx * syy);
  const tStatistic = r * Math.sqrt((n - 2) / (1 - r ** 2));

  return {
    n,
    xMean,
    yMean,
    sxx,
    syy,
    sxy,
    r,
    tStatistic,
    minPm25: Math.min(...xs),
    maxPm25: Math.max(...xs),
    minAsthma: Math.min(...ys),
    maxAsthma: Math.max(...ys),
  };
}

export function MethodologySection({
  departments,
  metadata,
  globalMetrics,
}: MethodologySectionProps) {
  const details = computePearsonDetails(departments);

  return (
    <section className="rounded-[2rem] border border-white/70 bg-white p-8 shadow-card">
      <div className="max-w-4xl">
        <p className="text-sm uppercase tracking-[0.2em] text-slate">Méthodologie</p>
        <h2 className="mt-2 text-3xl font-semibold text-ink">
          Données, pipeline et démarche statistique
        </h2>
        <p className="mt-4 text-base leading-7 text-slate">
          Cette section documente précisément le MVP pour montrer le déroulé complet :
          génération du jeu de données, transformation en JSON statique, calcul du
          coefficient de corrélation de Pearson et lecture du test statistique associé.
        </p>
      </div>

      <div className="mt-8 grid gap-6">
        <article className="rounded-[1.5rem] border border-slate-200 bg-slate-50/70 p-6">
          <h3 className="text-xl font-semibold text-ink">1. Jeu de données utilisé</h3>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <div className="rounded-2xl bg-white p-5">
              <p className="text-sm uppercase tracking-[0.2em] text-slate">Périmètre</p>
              <p className="mt-2 text-base leading-7 text-ink">
                {details.n} départements de France métropolitaine, identifiés par code
                départemental.
              </p>
            </div>
            <div className="rounded-2xl bg-white p-5">
              <p className="text-sm uppercase tracking-[0.2em] text-slate">Nature des données</p>
              <p className="mt-2 text-base leading-7 text-ink">
                Jeu synthétique généré localement avec <code>Python</code>, <code>NumPy</code>,{" "}
                <code>Pandas</code> et <code>SciPy</code>, puis exporté vers{" "}
                <code>public/data.json</code>.
              </p>
            </div>
          </div>

          <div className="mt-5 rounded-2xl bg-white p-5">
            <p className="text-sm uppercase tracking-[0.2em] text-slate">
              Provenance des données
            </p>
            <div className="mt-3 grid gap-4 md:grid-cols-2">
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-sm font-semibold text-ink">Contours géographiques</p>
                <p className="mt-2 text-base leading-7 text-slate">
                  Les géométries des départements proviennent du fichier officiel{" "}
                  <code>departements-1000m.geojson</code> téléchargé depuis la Base
                  Adresse Nationale / <code>adresse.data.gouv.fr</code>, dans le jeu
                  des contours administratifs.
                </p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-sm font-semibold text-ink">Variables PM2.5 et asthme</p>
                <p className="mt-2 text-base leading-7 text-slate">
                  Les valeurs de pollution et d'hospitalisation affichées dans ce MVP ne
                  viennent pas encore d'une base réelle : elles sont{" "}
                  <span className="font-semibold">synthétiques</span> et générées
                  localement par le script <code>scripts/generate_mock_data.py</code>.
                </p>
              </div>
            </div>
            <p className="mt-4 text-base leading-7 text-slate">
              Autrement dit, la composante cartographique repose sur une source publique
              officielle, tandis que la composante analytique PM2.5 / asthme a été créée
              pour démontrer la méthode statistique et le pipeline technique.
            </p>
          </div>

          <div className="mt-5 rounded-2xl bg-white p-5">
            <p className="text-sm uppercase tracking-[0.2em] text-slate">
              Pourquoi construire des données synthétiques ?
            </p>
            <p className="mt-3 text-base leading-7 text-slate">
              Les valeurs PM2.5 et asthme affichées dans ce MVP ne correspondent pas à
              des observations réelles. Il s'agit d'un <span className="font-semibold">jeu de données synthétique</span>,
              construit pour simuler un scénario plausible de corrélation positive entre
              exposition environnementale et indicateur de santé.
            </p>
            <p className="mt-4 text-base leading-7 text-slate">
              L'objectif n'est donc pas de produire ici une conclusion épidémiologique
              définitive, mais de démontrer une chaîne méthodologique complète :
              génération des données, structuration départementale, calcul statistique,
              test de significativité et restitution interactive.
            </p>
            <p className="mt-4 text-base leading-7 text-slate">
              Ce choix permet de montrer la logique analytique et technique du projet en
              attendant l'intégration future de données observées réelles issues de bases
              environnementales et sanitaires.
            </p>
          </div>

          <div className="mt-5 rounded-2xl bg-white p-5">
            <p className="text-base leading-7 text-slate">
              Le script de génération des données synthétiques a été conçu avec l'aide
              d'une IA générative, puis relu, exécuté et vérifié manuellement afin de
              garantir la cohérence du pipeline, la reproductibilité du jeu généré et la
              clarté de la démonstration statistique.
            </p>
          </div>

          <div className="mt-5 rounded-2xl bg-white p-5">
            <p className="text-base leading-7 text-slate">
              Pour chaque département, deux variables quantitatives ont été construites :
            </p>
            <ul className="mt-3 list-disc pl-5 text-base leading-8 text-ink">
              <li>
                <span className="font-semibold">PM2.5 moyen</span> en{" "}
                <code>{metadata.units.pm25_mean}</code>
              </li>
              <li>
                <span className="font-semibold">Taux d'hospitalisation pour asthme</span>{" "}
                en <code>{metadata.units.asthma_hospitalization_rate}</code>
              </li>
            </ul>
            <p className="mt-4 text-base leading-7 text-slate">
              Les valeurs observées dans le jeu généré sont comprises entre{" "}
              <span className="font-semibold">{round(details.minPm25, 1)}</span> et{" "}
              <span className="font-semibold">{round(details.maxPm25, 1)}</span> pour le
              PM2.5, et entre <span className="font-semibold">{round(details.minAsthma, 1)}</span>{" "}
              et <span className="font-semibold">{round(details.maxAsthma, 1)}</span> pour
              les hospitalisations pour asthme.
            </p>
          </div>
        </article>

        <article className="rounded-[1.5rem] border border-slate-200 bg-slate-50/70 p-6">
          <h3 className="text-xl font-semibold text-ink">2. Pipeline de construction</h3>
          <div className="mt-4 grid gap-4 md:grid-cols-4">
            <div className="rounded-2xl bg-white p-5">
              <p className="text-sm uppercase tracking-[0.2em] text-slate">Étape A</p>
              <p className="mt-2 text-base leading-7 text-ink">
                Liste fixe des 96 départements métropolitains.
              </p>
            </div>
            <div className="rounded-2xl bg-white p-5">
              <p className="text-sm uppercase tracking-[0.2em] text-slate">Étape B</p>
              <p className="mt-2 text-base leading-7 text-ink">
                Génération d'un niveau de PM2.5 avec une graine aléatoire fixe{" "}
                <code>seed = 42</code>.
              </p>
            </div>
            <div className="rounded-2xl bg-white p-5">
              <p className="text-sm uppercase tracking-[0.2em] text-slate">Étape C</p>
              <p className="mt-2 text-base leading-7 text-ink">
                Génération d'un taux d'asthme positivement corrélé au PM2.5.
              </p>
            </div>
            <div className="rounded-2xl bg-white p-5">
              <p className="text-sm uppercase tracking-[0.2em] text-slate">Étape D</p>
              <p className="mt-2 text-base leading-7 text-ink">
                Calcul de <code>r</code> et de la <code>p-value</code> avec{" "}
                <code>scipy.stats.pearsonr</code>.
              </p>
            </div>
          </div>

          <div className="mt-5 rounded-2xl bg-white p-5">
            <p className="text-sm uppercase tracking-[0.2em] text-slate">
              Formule de génération du taux d'asthme
            </p>
            <div className="mt-3 rounded-2xl bg-ink px-5 py-4 text-base leading-8 text-mist">
              <p>
                <code>asthma_rate = 40 + 5.8 × PM2.5 + bruit</code>
              </p>
              <p>
                <code>bruit ~ N(0, 8²)</code>, puis troncature dans l'intervalle{" "}
                <code>[55 ; 180]</code>
              </p>
            </div>
            <p className="mt-4 text-base leading-7 text-slate">
              Cette construction impose volontairement une relation croissante entre les
              deux variables afin de produire un cas d'usage lisible pour le tableau de
              bord et l'analyse statistique.
            </p>
            <p className="mt-4 text-base leading-7 text-slate">
              Plus précisément, la construction repose sur quatre choix :
            </p>
            <ul className="mt-3 list-disc pl-5 text-base leading-8 text-ink">
              <li>un tirage de PM2.5 dans une plage plausible pour créer de l'hétérogénéité territoriale ;</li>
              <li>une relation linéaire positive imposée par le coefficient <code>5.8</code> ;</li>
              <li>un bruit gaussien pour éviter une relation artificiellement parfaite ;</li>
              <li>une troncature finale pour garder des valeurs de taux d'asthme plausibles.</li>
            </ul>
            <p className="mt-4 text-base leading-7 text-slate">
              Le jeu obtenu est donc <span className="font-semibold">artificiel mais cohérent</span> :
              il sert à tester un pipeline complet de data processing et d'analyse, sans
              prétendre remplacer une base de données réelle.
            </p>
          </div>
        </article>

        <article className="rounded-[1.5rem] border border-slate-200 bg-slate-50/70 p-6">
          <h3 className="text-xl font-semibold text-ink">3. Démarche statistique</h3>
          <p className="mt-4 text-base leading-7 text-slate">
            La démarche appliquée ici repose sur des notions vues au <span className="font-semibold">S1</span>{" "}
            et au <span className="font-semibold">S2</span> du Master 1, en particulier dans
            les cours de <span className="font-semibold">Probabilités-Statistiques</span> et
            de <span className="font-semibold">Modélisation</span>.
          </p>

          <div className="mt-5 grid gap-4 md:grid-cols-2">
            <div className="rounded-2xl bg-white p-5">
              <p className="text-sm uppercase tracking-[0.2em] text-slate">Hypothèses testées</p>
              <p className="mt-2 text-base leading-7 text-ink">
                <code>H₀ : ρ = 0</code> (absence de corrélation linéaire)
              </p>
              <p className="text-base leading-7 text-ink">
                <code>H₁ : ρ ≠ 0</code> (présence d'une corrélation linéaire)
              </p>
            </div>
            <div className="rounded-2xl bg-white p-5">
              <p className="text-sm uppercase tracking-[0.2em] text-slate">Taille d'échantillon</p>
              <p className="mt-2 text-base leading-7 text-ink">
                <code>n = {details.n}</code> départements
              </p>
              <p className="text-base leading-7 text-ink">
                <code>x̄ = {round(details.xMean)}</code> et <code>ȳ = {round(details.yMean)}</code>
              </p>
            </div>
          </div>

          <div className="mt-5 rounded-2xl bg-white p-5">
            <p className="text-sm uppercase tracking-[0.2em] text-slate">
              Formule du coefficient de Pearson
            </p>
            <div className="mt-3 rounded-2xl bg-ink px-5 py-4 text-base leading-8 text-mist">
              <p>
                <code>
                  r = Σ[(xᵢ - x̄)(yᵢ - ȳ)] / √(Σ(xᵢ - x̄)² × Σ(yᵢ - ȳ)²)
                </code>
              </p>
            </div>

            <p className="mt-4 text-base leading-7 text-slate">
              En remplaçant par les valeurs réellement calculées sur le jeu de données :
            </p>
            <div className="mt-3 rounded-2xl border border-slate-200 bg-slate-50 p-5">
              <p className="text-base leading-8 text-ink">
                <code>Σ(xᵢ - x̄)² = {round(details.sxx)}</code>
              </p>
              <p className="text-base leading-8 text-ink">
                <code>Σ(yᵢ - ȳ)² = {round(details.syy)}</code>
              </p>
              <p className="text-base leading-8 text-ink">
                <code>Σ[(xᵢ - x̄)(yᵢ - ȳ)] = {round(details.sxy)}</code>
              </p>
              <p className="mt-3 text-base leading-8 text-ink">
                <code>
                  r = {round(details.sxy)} / √({round(details.sxx)} × {round(details.syy)}) =
                  {" "}
                  {round(details.r)}
                </code>
              </p>
            </div>
          </div>

          <div className="mt-5 rounded-2xl bg-white p-5">
            <p className="text-sm uppercase tracking-[0.2em] text-slate">
              Statistique de test associée
            </p>
            <div className="mt-3 rounded-2xl bg-ink px-5 py-4 text-base leading-8 text-mist">
              <p>
                <code>t = r × √((n - 2) / (1 - r²))</code>
              </p>
            </div>
            <div className="mt-3 rounded-2xl border border-slate-200 bg-slate-50 p-5">
              <p className="text-base leading-8 text-ink">
                <code>
                  t = {round(details.r)} × √(({details.n} - 2) / (1 - {round(details.r)}²)) =
                  {" "}
                  {round(details.tStatistic)}
                </code>
              </p>
              <p className="mt-2 text-base leading-8 text-ink">
                <code>p-value = {globalMetrics.p_value}</code>
              </p>
            </div>
          </div>
        </article>

        <article className="rounded-[1.5rem] border border-slate-200 bg-slate-50/70 p-6">
          <h3 className="text-xl font-semibold text-ink">4. Conclusion méthodologique</h3>
          <p className="mt-4 text-base leading-7 text-slate">
            Le calcul donne ici un coefficient de Pearson de{" "}
            <span className="font-semibold">{globalMetrics.pearson_r}</span>, donc une
            corrélation positive forte, avec une <span className="font-semibold">p-value</span>{" "}
            extrêmement faible (<span className="font-semibold">{globalMetrics.p_value}</span>).
          </p>
          <p className="mt-4 text-base leading-7 text-slate">
            Dans ce démonstrateur, cela valide le bon fonctionnement de la chaîne
            complète : simulation de données, structuration territoriale, calcul
            statistique, puis restitution visuelle dans une interface frontend.
          </p>
          <p className="mt-4 text-base leading-7 text-ink">
            Le point important à retenir est que la logique statistique présentée est
            réelle et rigoureuse, même si les données du MVP sont synthétiques.
          </p>
          <p className="mt-4 text-base leading-7 text-slate">
            En résumé, ce MVP doit être lu comme une <span className="font-semibold">preuve de méthode</span> :
            la chaîne de traitement, les calculs et leur interprétation sont authentiques,
            tandis que les valeurs PM2.5 et asthme restent pour l'instant simulées afin
            de justifier proprement la construction du démonstrateur.
          </p>
        </article>
      </div>
    </section>
  );
}
