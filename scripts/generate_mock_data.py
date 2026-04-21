from __future__ import annotations

import json
from datetime import datetime, timezone
from pathlib import Path

import numpy as np
import pandas as pd

try:
    from scipy.stats import pearsonr
except ImportError as exc:  # pragma: no cover - defensive guard for local setup
    raise SystemExit(
        "SciPy is required for this script. Install it with: python -m pip install scipy"
    ) from exc


DEPARTMENTS = [
    {"code": "01", "name": "Ain"},
    {"code": "02", "name": "Aisne"},
    {"code": "03", "name": "Allier"},
    {"code": "04", "name": "Alpes-de-Haute-Provence"},
    {"code": "05", "name": "Hautes-Alpes"},
    {"code": "06", "name": "Alpes-Maritimes"},
    {"code": "07", "name": "Ardeche"},
    {"code": "08", "name": "Ardennes"},
    {"code": "09", "name": "Ariege"},
    {"code": "10", "name": "Aube"},
    {"code": "11", "name": "Aude"},
    {"code": "12", "name": "Aveyron"},
    {"code": "13", "name": "Bouches-du-Rhone"},
    {"code": "14", "name": "Calvados"},
    {"code": "15", "name": "Cantal"},
    {"code": "16", "name": "Charente"},
    {"code": "17", "name": "Charente-Maritime"},
    {"code": "18", "name": "Cher"},
    {"code": "19", "name": "Correze"},
    {"code": "2A", "name": "Corse-du-Sud"},
    {"code": "2B", "name": "Haute-Corse"},
    {"code": "21", "name": "Cote-d'Or"},
    {"code": "22", "name": "Cotes-d'Armor"},
    {"code": "23", "name": "Creuse"},
    {"code": "24", "name": "Dordogne"},
    {"code": "25", "name": "Doubs"},
    {"code": "26", "name": "Drome"},
    {"code": "27", "name": "Eure"},
    {"code": "28", "name": "Eure-et-Loir"},
    {"code": "29", "name": "Finistere"},
    {"code": "30", "name": "Gard"},
    {"code": "31", "name": "Haute-Garonne"},
    {"code": "32", "name": "Gers"},
    {"code": "33", "name": "Gironde"},
    {"code": "34", "name": "Herault"},
    {"code": "35", "name": "Ille-et-Vilaine"},
    {"code": "36", "name": "Indre"},
    {"code": "37", "name": "Indre-et-Loire"},
    {"code": "38", "name": "Isere"},
    {"code": "39", "name": "Jura"},
    {"code": "40", "name": "Landes"},
    {"code": "41", "name": "Loir-et-Cher"},
    {"code": "42", "name": "Loire"},
    {"code": "43", "name": "Haute-Loire"},
    {"code": "44", "name": "Loire-Atlantique"},
    {"code": "45", "name": "Loiret"},
    {"code": "46", "name": "Lot"},
    {"code": "47", "name": "Lot-et-Garonne"},
    {"code": "48", "name": "Lozere"},
    {"code": "49", "name": "Maine-et-Loire"},
    {"code": "50", "name": "Manche"},
    {"code": "51", "name": "Marne"},
    {"code": "52", "name": "Haute-Marne"},
    {"code": "53", "name": "Mayenne"},
    {"code": "54", "name": "Meurthe-et-Moselle"},
    {"code": "55", "name": "Meuse"},
    {"code": "56", "name": "Morbihan"},
    {"code": "57", "name": "Moselle"},
    {"code": "58", "name": "Nievre"},
    {"code": "59", "name": "Nord"},
    {"code": "60", "name": "Oise"},
    {"code": "61", "name": "Orne"},
    {"code": "62", "name": "Pas-de-Calais"},
    {"code": "63", "name": "Puy-de-Dome"},
    {"code": "64", "name": "Pyrenees-Atlantiques"},
    {"code": "65", "name": "Hautes-Pyrenees"},
    {"code": "66", "name": "Pyrenees-Orientales"},
    {"code": "67", "name": "Bas-Rhin"},
    {"code": "68", "name": "Haut-Rhin"},
    {"code": "69", "name": "Rhone"},
    {"code": "70", "name": "Haute-Saone"},
    {"code": "71", "name": "Saone-et-Loire"},
    {"code": "72", "name": "Sarthe"},
    {"code": "73", "name": "Savoie"},
    {"code": "74", "name": "Haute-Savoie"},
    {"code": "75", "name": "Paris"},
    {"code": "76", "name": "Seine-Maritime"},
    {"code": "77", "name": "Seine-et-Marne"},
    {"code": "78", "name": "Yvelines"},
    {"code": "79", "name": "Deux-Sevres"},
    {"code": "80", "name": "Somme"},
    {"code": "81", "name": "Tarn"},
    {"code": "82", "name": "Tarn-et-Garonne"},
    {"code": "83", "name": "Var"},
    {"code": "84", "name": "Vaucluse"},
    {"code": "85", "name": "Vendee"},
    {"code": "86", "name": "Vienne"},
    {"code": "87", "name": "Haute-Vienne"},
    {"code": "88", "name": "Vosges"},
    {"code": "89", "name": "Yonne"},
    {"code": "90", "name": "Territoire de Belfort"},
    {"code": "91", "name": "Essonne"},
    {"code": "92", "name": "Hauts-de-Seine"},
    {"code": "93", "name": "Seine-Saint-Denis"},
    {"code": "94", "name": "Val-de-Marne"},
    {"code": "95", "name": "Val-d'Oise"},
]

SEED = 42
OUTPUT_PATH = Path(__file__).resolve().parents[1] / "public" / "data.json"


def build_dataset() -> pd.DataFrame:
    rng = np.random.default_rng(SEED)
    data = pd.DataFrame(DEPARTMENTS)

    pm25_values = rng.uniform(7.0, 20.0, size=len(data))
    noise = rng.normal(loc=0.0, scale=8.0, size=len(data))

    asthma_rates = 40.0 + 5.8 * pm25_values + noise
    asthma_rates = np.clip(asthma_rates, 55.0, 180.0)

    data["pm25_mean"] = np.round(pm25_values, 1)
    data["asthma_hospitalization_rate"] = np.round(asthma_rates, 1)
    return data


def build_interpretation(pearson_r: float, p_value: float) -> str:
    if p_value < 0.05 and pearson_r > 0:
        return (
            "This synthetic dataset shows a positive and statistically significant "
            "correlation between PM2.5 exposure and asthma-related emergency admissions."
        )
    if p_value < 0.05 and pearson_r < 0:
        return (
            "This synthetic dataset shows a negative and statistically significant "
            "correlation between PM2.5 exposure and asthma-related emergency admissions."
        )
    return (
        "This synthetic dataset does not show a statistically significant linear "
        "correlation between PM2.5 exposure and asthma-related emergency admissions."
    )


def build_payload(data: pd.DataFrame) -> dict:
    pearson_r, p_value = pearsonr(
        data["pm25_mean"], data["asthma_hospitalization_rate"]
    )

    return {
        "metadata": {
            "generated_at": datetime.now(timezone.utc).isoformat(),
            "seed": SEED,
            "scope": "France metropolitaine",
            "is_mock_data": True,
            "units": {
                "pm25_mean": "ug/m3",
                "asthma_hospitalization_rate": "emergency admissions per 100,000 inhabitants",
            },
        },
        "global_metrics": {
            "department_count": int(len(data)),
            "pearson_r": round(float(pearson_r), 4),
            "p_value": float(f"{float(p_value):.8g}"),
            "interpretation": build_interpretation(float(pearson_r), float(p_value)),
        },
        "departments": data.to_dict(orient="records"),
    }


def main() -> None:
    dataset = build_dataset()
    payload = build_payload(dataset)

    OUTPUT_PATH.parent.mkdir(parents=True, exist_ok=True)
    OUTPUT_PATH.write_text(json.dumps(payload, indent=2), encoding="utf-8")

    print(f"Wrote {OUTPUT_PATH}")
    print(
        "Pearson r = "
        f"{payload['global_metrics']['pearson_r']}, "
        f"p-value = {payload['global_metrics']['p_value']}"
    )


if __name__ == "__main__":
    main()
