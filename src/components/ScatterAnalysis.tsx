import {
  CartesianGrid,
  ResponsiveContainer,
  Scatter,
  ScatterChart,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { DepartmentMetrics, DashboardData } from "../types/dashboard";

type ScatterAnalysisProps = {
  departments: DepartmentMetrics[];
  globalMetrics: DashboardData["global_metrics"];
};

type TooltipProps = {
  active?: boolean;
  payload?: Array<{
    payload: DepartmentMetrics;
  }>;
};

function describeCorrelationStrength(pearsonR: number) {
  const absoluteValue = Math.abs(pearsonR);

  if (absoluteValue >= 0.8) {
    return "forte";
  }
  if (absoluteValue >= 0.5) {
    return "modérée";
  }
  if (absoluteValue >= 0.3) {
    return "faible à modérée";
  }
  return "faible";
}

function buildInterpretationSentence(
  pearsonR: number,
  pValue: number,
  fallback: string,
) {
  const direction = pearsonR >= 0 ? "positive" : "negative";
  const strength = describeCorrelationStrength(pearsonR);

  if (pValue < 0.05) {
    return `On observe une corrélation ${direction} ${strength} entre l'exposition aux PM2.5 et les hospitalisations pour asthme. La p-value étant inférieure à 0,05, cette relation linéaire est statistiquement significative dans ce jeu de données synthétique.`;
  }

  return `${fallback} La p-value étant supérieure ou égale à 0,05, on ne peut pas conclure à une relation linéaire statistiquement significative.`;
}

function ScatterTooltip({ active, payload }: TooltipProps) {
  if (!active || !payload?.length) {
    return null;
  }

  const department = payload[0].payload;

  return (
    <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-lg">
      <p className="text-sm font-semibold text-ink">{department.name}</p>
      <p className="mt-2 text-sm text-slate">
        PM2.5 moyen: <span className="font-medium text-ink">{department.pm25_mean} ug/m3</span>
      </p>
      <p className="text-sm text-slate">
        Asthme:{" "}
        <span className="font-medium text-ink">
          {department.asthma_hospitalization_rate} / 100 000
        </span>
      </p>
    </div>
  );
}

export function ScatterAnalysis({
  departments,
  globalMetrics,
}: ScatterAnalysisProps) {
  const interpretation = buildInterpretationSentence(
    globalMetrics.pearson_r,
    globalMetrics.p_value,
    globalMetrics.interpretation,
  );

  return (
    <div className="grid gap-6">
      <div className="flex flex-wrap gap-3">
        <div className="rounded-full border border-accent/20 bg-accent/5 px-4 py-2 text-sm font-medium text-accent">
          r = {globalMetrics.pearson_r}
        </div>
        <div className="rounded-full border border-sky/30 bg-sky/10 px-4 py-2 text-sm font-medium text-ink">
          p-value = {globalMetrics.p_value}
        </div>
        <div className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate">
          Survolez un point pour voir le détail d'un département
        </div>
      </div>

      <div className="min-w-0 rounded-[1.5rem] border border-slate-200 bg-slate-50/70 p-4">
        <div className="mb-4 flex flex-col gap-3">
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-slate">
              Nuage de points
            </p>
            <h3 className="mt-2 text-xl font-semibold text-ink">
              Pollution PM2.5 vs admissions pour asthme
            </h3>
          </div>
          <p className="max-w-2xl text-sm leading-6 text-slate">
            Chaque point représente un département. Plus un point est à droite,
            plus le niveau moyen de PM2.5 est élevé ; plus il est haut, plus le
            taux d'hospitalisation pour asthme est important.
          </p>
        </div>

        <div className="h-[360px] min-w-0 w-full">
          <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={320}>
            <ScatterChart margin={{ top: 16, right: 12, bottom: 24, left: 12 }}>
              <CartesianGrid stroke="#dbe7f3" strokeDasharray="4 4" />
              <XAxis
                type="number"
                dataKey="pm25_mean"
                name="PM2.5"
                tickLine={false}
                axisLine={false}
                tick={{ fill: "#52667b", fontSize: 12 }}
                label={{
                  value: "PM2.5 moyen (ug/m3)",
                  position: "insideBottom",
                  offset: -10,
                  fill: "#52667b",
                  fontSize: 12,
                }}
              />
              <YAxis
                type="number"
                dataKey="asthma_hospitalization_rate"
                name="Asthme"
                tickLine={false}
                axisLine={false}
                tick={{ fill: "#52667b", fontSize: 12 }}
                width={72}
                label={{
                  value: "Admissions asthme / 100 000",
                  angle: -90,
                  position: "insideLeft",
                  fill: "#52667b",
                  fontSize: 12,
                }}
              />
              <Tooltip content={<ScatterTooltip />} cursor={{ strokeDasharray: "4 4" }} />
              <Scatter data={departments} fill="#0f766e" />
            </ScatterChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <article className="rounded-[1.5rem] border border-accent/20 bg-[linear-gradient(135deg,#f3fbf8_0%,#ffffff_100%)] p-6">
          <p className="text-sm uppercase tracking-[0.2em] text-slate">
            Lecture statistique
          </p>
          <div className="mt-3 flex flex-wrap items-center gap-3">
            <p className="text-3xl font-semibold text-ink">r = {globalMetrics.pearson_r}</p>
            <span
              className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] ${
                globalMetrics.p_value < 0.05
                  ? "bg-emerald-100 text-emerald-700"
                  : "bg-amber-100 text-amber-700"
              }`}
            >
              {globalMetrics.p_value < 0.05 ? "Significatif" : "À confirmer"}
            </span>
          </div>
          <p className="mt-2 text-sm text-slate">p-value = {globalMetrics.p_value}</p>
          <p className="mt-5 text-base leading-7 text-ink">{interpretation}</p>
        </article>

        <article className="rounded-[1.5rem] border border-slate-200 bg-white p-6">
          <p className="text-sm uppercase tracking-[0.2em] text-slate">
            Point clé pour le jury
          </p>
          <p className="mt-3 text-base leading-7 text-ink">
            Le coefficient de Pearson mesure la force d'une relation linéaire entre
            deux variables quantitatives. Ici, un <span className="font-semibold">r positif</span>{" "}
            signifie que les départements les plus exposés aux PM2.5 tendent aussi
            à présenter davantage d'admissions pour asthme.
          </p>
          <p className="mt-4 text-base leading-7 text-slate">
            Comme les données sont synthétiques, cet indicateur ne doit pas être
            interprété comme une preuve épidémiologique réelle, mais comme une
            démonstration de méthode, de visualisation et de lecture statistique.
          </p>
        </article>
      </div>
    </div>
  );
}
