import { useEffect, useState } from "react";
import {
  GeoJSON,
  MapContainer,
  Pane,
  ZoomControl,
} from "react-leaflet";
import type { Path } from "leaflet";
import type { DepartmentMetrics } from "../types/dashboard";
import type {
  DepartmentFeature,
  DepartmentFeatureCollection,
} from "../types/geojson";

type DepartmentMapProps = {
  departments: DepartmentMetrics[];
};

const FRANCE_CENTER: [number, number] = [46.6, 2.4];
const DEPARTMENT_BREAKS = [90, 105, 120, 135, 150];
const CHOROPLETH_COLORS = [
  "#e6f4ea",
  "#c6e7d0",
  "#93d1b0",
  "#5db690",
  "#2c8a6a",
  "#11543f",
];

export function DepartmentMap({ departments }: DepartmentMapProps) {
  const [geojson, setGeojson] = useState<DepartmentFeatureCollection | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadGeojson() {
      try {
        const response = await fetch(
          `${import.meta.env.BASE_URL}departements.geojson`,
        );

        if (!response.ok) {
          throw new Error(`Failed to load GeoJSON: ${response.status}`);
        }

        const rawGeojson =
          (await response.json()) as DepartmentFeatureCollection;
        const availableCodes = new Set(departments.map((department) => department.code));

        setGeojson({
          ...rawGeojson,
          features: rawGeojson.features.filter((feature) =>
            availableCodes.has(feature.properties.code),
          ),
        });
      } catch (caughtError) {
        setError("Impossible de charger le GeoJSON des departements.");
        console.error(caughtError);
      }
    }

    void loadGeojson();
  }, [departments]);

  const metricsByCode = new Map(
    departments.map((department) => [department.code, department]),
  );

  function getFillColor(value: number) {
    if (value >= DEPARTMENT_BREAKS[4]) {
      return CHOROPLETH_COLORS[5];
    }
    if (value >= DEPARTMENT_BREAKS[3]) {
      return CHOROPLETH_COLORS[4];
    }
    if (value >= DEPARTMENT_BREAKS[2]) {
      return CHOROPLETH_COLORS[3];
    }
    if (value >= DEPARTMENT_BREAKS[1]) {
      return CHOROPLETH_COLORS[2];
    }
    if (value >= DEPARTMENT_BREAKS[0]) {
      return CHOROPLETH_COLORS[1];
    }
    return CHOROPLETH_COLORS[0];
  }

  function styleFeature(feature?: DepartmentFeature) {
    const department = feature
      ? metricsByCode.get(feature.properties.code)
      : undefined;
    const rate = department?.asthma_hospitalization_rate ?? 0;

    return {
      color: "#ffffff",
      weight: 1.2,
      fillColor: getFillColor(rate),
      fillOpacity: 0.88,
    };
  }

  function onEachFeature(feature: DepartmentFeature, layer: Path) {
    const department = metricsByCode.get(feature.properties.code);

    layer.bindPopup(
      `
        <div style="min-width: 220px; font-family: 'Segoe UI', system-ui, sans-serif;">
          <div style="font-size: 12px; letter-spacing: 0.08em; text-transform: uppercase; color: #52667b;">
            Département ${feature.properties.code}
          </div>
          <div style="margin-top: 6px; font-size: 18px; font-weight: 700; color: #132238;">
            ${feature.properties.nom}
          </div>
          <div style="margin-top: 12px; display: grid; gap: 8px;">
            <div>
              <div style="font-size: 12px; color: #52667b;">PM2.5 moyen</div>
              <div style="font-size: 16px; font-weight: 600; color: #132238;">
                ${department?.pm25_mean ?? "N/A"} ug/m3
              </div>
            </div>
            <div>
              <div style="font-size: 12px; color: #52667b;">Hospitalisations asthme</div>
              <div style="font-size: 16px; font-weight: 600; color: #132238;">
                ${department?.asthma_hospitalization_rate ?? "N/A"} / 100 000
              </div>
            </div>
          </div>
        </div>
      `,
      {
        closeButton: false,
        autoPan: false,
      },
    );

    layer.on({
      mouseover: () => {
        layer.setStyle({
          weight: 2,
          color: "#132238",
          fillOpacity: 0.96,
        });
        layer.openPopup();
      },
      mouseout: () => {
        layer.setStyle(styleFeature(feature));
        layer.closePopup();
      },
    });
  }

  return (
    <div className="relative">
      <MapContainer
        center={FRANCE_CENTER}
        zoom={5.6}
        zoomControl={false}
        scrollWheelZoom={false}
        className="min-h-[520px] bg-[#edf4f9]"
      >
        <ZoomControl position="bottomright" />
        <Pane name="departments" style={{ zIndex: 400 }}>
          {geojson ? (
            <GeoJSON
              data={geojson}
              pane="departments"
              style={styleFeature}
              onEachFeature={onEachFeature}
            />
          ) : null}
        </Pane>
      </MapContainer>

      <div className="pointer-events-none absolute left-4 top-4 z-[500] max-w-xs rounded-2xl border border-white/70 bg-white/90 px-4 py-3 shadow-lg backdrop-blur">
        <p className="text-xs uppercase tracking-[0.2em] text-slate">
          Choroplèthe
        </p>
        <p className="mt-2 text-sm leading-6 text-ink">
          Intensité basée sur les admissions d'urgence pour asthme pour 100 000 habitants.
        </p>
      </div>

      <div className="pointer-events-none absolute right-4 top-4 z-[500] rounded-2xl border border-white/70 bg-white/90 px-4 py-3 shadow-lg backdrop-blur">
        <p className="text-xs uppercase tracking-[0.2em] text-slate">Interaction</p>
        <p className="mt-2 text-sm leading-6 text-ink">
          Survolez un département pour afficher pollution et santé.
        </p>
      </div>

      <div className="pointer-events-none absolute bottom-4 left-4 z-[500] rounded-2xl border border-white/70 bg-white/92 p-4 shadow-lg backdrop-blur">
        <p className="text-xs uppercase tracking-[0.2em] text-slate">Légende</p>
        <div className="mt-3 grid gap-2">
          {CHOROPLETH_COLORS.map((color, index) => {
            const label =
              index === 0
                ? `< ${DEPARTMENT_BREAKS[0]}`
                : index === CHOROPLETH_COLORS.length - 1
                  ? `>= ${DEPARTMENT_BREAKS[DEPARTMENT_BREAKS.length - 1]}`
                  : `${DEPARTMENT_BREAKS[index - 1]} - ${DEPARTMENT_BREAKS[index]}`;

            return (
              <div key={label} className="flex items-center gap-3">
                <span
                  className="h-4 w-4 rounded-sm border border-slate-200"
                  style={{ backgroundColor: color }}
                />
                <span className="text-sm text-ink">{label}</span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="pointer-events-none absolute bottom-4 right-4 z-[500] rounded-2xl border border-white/70 bg-white/92 px-4 py-3 text-sm text-slate shadow-lg backdrop-blur">
        Source contour : découpage administratif officiel
      </div>

      {error ? (
        <div className="absolute inset-x-4 bottom-4 z-[600] rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700 shadow-lg">
          {error}
        </div>
      ) : null}
    </div>
  );
}
