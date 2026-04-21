import { useEffect, useState } from "react";
import { DepartmentMap } from "./components/DepartmentMap";
import { Header } from "./components/Header";
import { MethodologySection } from "./components/MethodologySection";
import { ScatterAnalysis } from "./components/ScatterAnalysis";
import { loadDashboardData } from "./lib/loadDashboardData";
import type { DashboardData } from "./types/dashboard";

function formatGeneratedAt(dateString: string) {
  return new Intl.DateTimeFormat("fr-FR", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(dateString));
}

function App() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function bootstrap() {
      try {
        const nextData = await loadDashboardData();
        setData(nextData);
      } catch (caughtError) {
        setError("Impossible de charger le fichier data.json.");
        console.error(caughtError);
      }
    }

    void bootstrap();
  }, []);

  const generatedAtLabel = data
    ? formatGeneratedAt(data.metadata.generated_at)
    : "--";
  const isSignificant = data ? data.global_metrics.p_value < 0.05 : false;

  return (
    <div className="min-h-screen bg-slate-50 text-ink">
      <Header />

      <main className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 py-10 sm:px-6 lg:px-8">
        <section className="grid gap-4 md:grid-cols-3">
          <article className="rounded-3xl border border-white/70 bg-white p-6 shadow-card">
            <p className="text-sm uppercase tracking-[0.2em] text-slate">Départements</p>
            <p className="mt-3 text-4xl font-semibold text-ink">
              {data?.global_metrics.department_count ?? "--"}
            </p>
            <p className="mt-3 text-sm leading-6 text-slate">
              Couverture du MVP sur les 96 départements de France métropolitaine.
            </p>
          </article>

          <article className="rounded-3xl border border-white/70 bg-white p-6 shadow-card">
            <p className="text-sm uppercase tracking-[0.2em] text-slate">Pearson r</p>
            <p className="mt-3 text-4xl font-semibold text-ink">
              {data?.global_metrics.pearson_r ?? "--"}
            </p>
            <p className="mt-3 text-sm leading-6 text-slate">
              Mesure la force de la relation linéaire entre pollution et asthme.
            </p>
          </article>

          <article className="rounded-3xl border border-white/70 bg-white p-6 shadow-card">
            <p className="text-sm uppercase tracking-[0.2em] text-slate">P-value</p>
            <p className="mt-3 break-all text-2xl font-semibold text-ink">
              {data?.global_metrics.p_value ?? "--"}
            </p>
            <p className="mt-3 text-sm leading-6 text-slate">
              {isSignificant
                ? "Inférieure à 0,05 : la relation linéaire est significative dans ce jeu synthétique."
                : "Supérieure ou égale à 0,05 : pas de significativité linéaire établie."}
            </p>
          </article>
        </section>

        <section className="rounded-[2rem] border border-sky/30 bg-[linear-gradient(135deg,#f8fbfd_0%,#edf4f9_100%)] p-6 shadow-card">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-3xl">
              <p className="text-sm uppercase tracking-[0.2em] text-slate">Cadre de lecture</p>
              <h2 className="mt-2 text-2xl font-semibold text-ink">
                Démonstrateur statique de méthode, pas preuve épidémiologique définitive
              </h2>
              <p className="mt-3 text-base leading-7 text-slate">
                Ce prototype montre comment structurer un pipeline local, produire un
                indicateur statistique interprétable et le restituer dans une interface
                claire pour une lecture territoriale rapide.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              <div className="rounded-2xl bg-white/90 px-4 py-3">
                <p className="text-xs uppercase tracking-[0.2em] text-slate">Jeu de données</p>
                <p className="mt-2 text-sm font-medium text-ink">
                  {data?.metadata.is_mock_data ? "Synthétique" : "Observé"}
                </p>
              </div>
              <div className="rounded-2xl bg-white/90 px-4 py-3">
                <p className="text-xs uppercase tracking-[0.2em] text-slate">Mise à jour</p>
                <p className="mt-2 text-sm font-medium text-ink">{generatedAtLabel}</p>
              </div>
              <div className="rounded-2xl bg-white/90 px-4 py-3">
                <p className="text-xs uppercase tracking-[0.2em] text-slate">Lecture</p>
                <p className="mt-2 text-sm font-medium text-ink">
                  {isSignificant ? "Corrélation significative" : "Corrélation non significative"}
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
          <article className="rounded-[2rem] border border-white/70 bg-white p-6 shadow-card">
            <p className="text-sm uppercase tracking-[0.2em] text-slate">Définition</p>
            <h2 className="mt-2 text-2xl font-semibold text-ink">Qu'est-ce que le PM2.5 ?</h2>
            <p className="mt-4 text-base leading-7 text-slate">
              Le PM2.5 désigne les particules fines en suspension dans l'air dont le
              diamètre est inférieur ou égal à 2,5 micromètres. Elles pénètrent plus
              profondément dans l'appareil respiratoire que les particules plus grosses
              et sont couramment surveillées dans les études de santé environnementale.
            </p>
          </article>

          <article className="rounded-[2rem] border border-white/70 bg-white p-6 shadow-card">
            <p className="text-sm uppercase tracking-[0.2em] text-slate">Unité</p>
            <h2 className="mt-2 text-2xl font-semibold text-ink">Comment lire la mesure ?</h2>
            <p className="mt-4 text-base leading-7 text-slate">
              Ici, le PM2.5 est exprimé en microgrammes par mètre cube d'air
              (<code>ug/m3</code>). Plus la valeur est élevée, plus la concentration
              moyenne de particules fines est importante dans le département considéré.
            </p>
          </article>
        </section>

        <section className="grid gap-6">
          <article className="rounded-[2rem] border border-white/70 bg-white p-6 shadow-card">
            <p className="text-sm uppercase tracking-[0.2em] text-slate">Étape 3</p>
            <h2 className="mt-3 text-2xl font-semibold text-ink">Carte choroplèthe</h2>
            <p className="mt-4 max-w-2xl text-base leading-7 text-slate">
              Chaque département est coloré selon le taux d'hospitalisation pour
              asthme. Le survol ouvre un popup avec les indicateurs pollution et
              santé reliés par le <code>code</code> départemental.
            </p>

            <div className="mt-6 overflow-hidden rounded-[1.5rem] border border-slate-200">
              {data ? (
                <DepartmentMap departments={data.departments} />
              ) : (
                <div className="flex min-h-[520px] animate-pulse items-center justify-center bg-slate-100 text-slate">
                  Chargement de la carte...
                </div>
              )}
            </div>
          </article>

          <article className="min-w-0 rounded-[2rem] border border-white/70 bg-white p-8 shadow-card">
            <p className="text-sm uppercase tracking-[0.2em] text-slate">Étape 4</p>
            <h2 className="mt-3 text-2xl font-semibold text-ink">Statistiques et visualisation</h2>
            <p className="mt-4 text-base leading-7 text-slate">
              Le nuage de points <code>Pollution vs Asthme</code> et l'encart
              d'interprétation statistique prendront appui sur les métriques globales et
              sur les données départementales déjà chargées.
            </p>

            <div className="mt-8">
              {data ? (
                <ScatterAnalysis
                  departments={data.departments}
                  globalMetrics={data.global_metrics}
                />
              ) : (
                <div className="rounded-2xl bg-ink px-5 py-4 text-sm leading-6 text-mist">
                  Chargement de la visualisation statistique...
                </div>
              )}
            </div>

            {error ? (
              <div className="mt-6 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                {error}
              </div>
            ) : null}
          </article>
        </section>

        {data ? (
          <MethodologySection
            departments={data.departments}
            metadata={data.metadata}
            globalMetrics={data.global_metrics}
          />
        ) : null}
      </main>
    </div>
  );
}

export default App;
