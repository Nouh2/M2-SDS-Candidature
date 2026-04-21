# M2 SDS Candidature

Tableau de bord géo-épidémiologique statique conçu spécifiquement pour appuyer une candidature au **Master 2 Sciences des Données de Santé (M2 SDS)** de l'Université Paris-Saclay.

Le projet croise deux dimensions à l'échelle départementale :

- une variable environnementale : le **PM2.5 moyen**
- une variable de santé : un **taux d'hospitalisation pour asthme**

L'objectif n'est pas ici de produire une preuve épidémiologique réelle, mais de démontrer une chaîne complète :

- structuration de données
- génération et export local d'un jeu de données
- calcul statistique rigoureux
- visualisation interactive dans une interface frontend moderne

Site déployé :

- `https://nouh2.github.io/M2-SDS-Candidature/`

## 1. Objectif du projet

Ce MVP a été pensé comme une preuve concrète de trois compétences :

- capacité à manipuler et structurer des données avec rigueur
- capacité à développer une application fullstack simple de bout en bout
- capacité à présenter une démarche statistique claire, lisible et justifiée

Le projet prend la forme d'un site statique déployable gratuitement sur GitHub Pages.

## 2. Périmètre

Le dashboard couvre les **96 départements de France métropolitaine**.

Il contient :

- un header de candidature personnalisé
- des indicateurs globaux
- une carte choroplèthe des départements
- un scatter plot PM2.5 vs asthme
- une section méthodologique détaillée

## 3. Stack technique

### Backend local

- `Python`
- `NumPy`
- `Pandas`
- `SciPy`

Le backend n'est pas exposé en API. Il sert uniquement à générer un fichier statique `data.json`.

### Frontend

- `React`
- `TypeScript`
- `Vite`
- `Tailwind CSS`
- `react-leaflet`
- `recharts`

### Hébergement

- `GitHub Pages`
- workflow GitHub Actions pour le build et le déploiement

## 4. Structure du projet

```text
.
├── .github/workflows/deploy-pages.yml
├── public/
│   ├── data.json
│   ├── departements.geojson
│   └── favicon.svg
├── scripts/
│   └── generate_mock_data.py
├── src/
│   ├── components/
│   ├── lib/
│   ├── types/
│   ├── App.tsx
│   ├── index.css
│   ├── main.tsx
│   └── vite-env.d.ts
├── index.html
├── package.json
├── tailwind.config.ts
├── tsconfig.json
└── vite.config.ts
```

## 5. Provenance des données

### Contours géographiques

Les contours des départements proviennent d'un fichier GeoJSON officiel téléchargé depuis :

- `adresse.data.gouv.fr`
- jeu de données des contours administratifs

Fichier utilisé :

- `public/departements.geojson`

### Variables PM2.5 et asthme

Les valeurs affichées pour le PM2.5 et les hospitalisations pour asthme ne proviennent **pas encore** d'une base réelle.

Elles sont **synthétiques** et générées localement par :

- `scripts/generate_mock_data.py`

Ce point est volontairement affiché dans l'application pour des raisons de transparence.

## 6. Pourquoi utiliser des données synthétiques ?

Ce MVP a été conçu comme un **démonstrateur méthodologique**.

L'objectif était de montrer :

- comment construire un pipeline local reproductible
- comment calculer une corrélation de Pearson et sa p-value
- comment interpréter un résultat statistique
- comment restituer ces résultats dans une interface interactive

Les données synthétiques permettent donc de tester une logique d'analyse complète sans prétendre, à ce stade, produire un résultat scientifique sur des données observées.

Autrement dit :

- la **méthode** est réelle
- les **calculs** sont réels
- les **valeurs** PM2.5 et asthme sont simulées

## 7. Transparence sur l'usage de l'IA

Le script de génération des données synthétiques a été conçu avec l'aide d'une IA générative, puis relu, ajusté, exécuté et vérifié manuellement.

L'usage de l'IA a porté sur :

- l'accélération du prototypage
- l'aide à la structuration du script
- l'assistance sur certains choix de formulation et d'interface

La validation technique, la cohérence du pipeline, le contrôle du résultat statistique et les arbitrages du projet ont été réalisés manuellement.

## 8. Fonctionnement du script Python

Le script principal est :

- [scripts/generate_mock_data.py](scripts/generate_mock_data.py)

Il suit les étapes suivantes :

1. construction d'une table des 96 départements métropolitains
2. initialisation d'une graine aléatoire fixe : `seed = 42`
3. génération d'une variable `pm25_mean` par tirage uniforme entre `7.0` et `20.0`
4. génération d'un bruit aléatoire gaussien `N(0, 8²)`
5. construction du taux d'asthme par relation linéaire positive :

```text
asthma_rate = 40 + 5.8 × PM2.5 + bruit
```

6. troncature des valeurs dans un intervalle plausible `[55 ; 180]`
7. calcul du coefficient de Pearson et de la p-value avec `scipy.stats.pearsonr`
8. export vers `public/data.json`

## 9. Démarche statistique

La logique statistique mobilisée repose sur des notions vues au **S1** et au **S2** du **Master 1**, en particulier dans les cours de :

- `Probabilités-Statistiques`
- `Modélisation`

### Hypothèses testées

- `H0 : ρ = 0` : absence de corrélation linéaire
- `H1 : ρ ≠ 0` : présence d'une corrélation linéaire

### Coefficient de Pearson

Le coefficient de corrélation de Pearson est calculé selon :

```text
r = Σ[(xi - x̄)(yi - ȳ)] / √(Σ(xi - x̄)² × Σ(yi - ȳ)²)
```

### Statistique de test

La statistique associée est :

```text
t = r × √((n - 2) / (1 - r²))
```

La p-value est ensuite obtenue via `scipy.stats.pearsonr`.

Dans le jeu actuellement généré :

- `n = 96`
- `r = 0.935`
- `p-value = 4.1592717e-44`

Le résultat correspond donc à une **corrélation positive forte** et **statistiquement significative** dans ce jeu de données synthétique.

## 10. Interface utilisateur

Le frontend contient quatre briques principales :

### Header

- contexte de candidature
- identité du candidat
- email, téléphone, GitHub

### Carte choroplèthe

- visualisation départementale
- coloration selon le taux d'hospitalisation pour asthme
- popup au survol avec PM2.5 et asthme

### Scatter plot

- nuage de points PM2.5 vs asthme
- tooltip par département
- rappel visuel de `r` et de la `p-value`

### Section méthodologie

- origine des données
- justification des données synthétiques
- pipeline Python
- formules statistiques
- remplacement des formules par les chiffres calculés sur le jeu généré

## 11. Lancer le projet en local

### Installer les dépendances frontend

```bash
npm install
```

### Générer le jeu de données

```bash
python scripts/generate_mock_data.py
```

### Lancer le serveur de développement

```bash
npm run dev
```

### Build de production

```bash
npm run build
```

## 12. Déploiement GitHub Pages

Le projet est configuré pour GitHub Pages avec :

- un `base` Vite fixé sur `/M2-SDS-Candidature/`
- un workflow dans `.github/workflows/deploy-pages.yml`
- des chemins statiques compatibles avec un hébergement en sous-répertoire

Le déploiement est déclenché automatiquement à chaque push sur `main`.

## 13. Limites actuelles

Le MVP a des limites assumées :

- les variables PM2.5 et asthme sont synthétiques
- il n'y a pas encore d'ingestion de données réelles
- il n'y a pas encore de pipeline de mise à jour automatisé
- l'analyse se limite ici à une corrélation bivariée

## 14. Évolutions possibles

Pour une version plus avancée, les étapes suivantes seraient naturelles :

- intégration de données PM2.5 observées
- intégration de données hospitalières réelles
- harmonisation temporelle des séries
- ajout d'analyses multivariées
- ajout de modèles de régression
- documentation plus poussée sur les biais, facteurs de confusion et limites causales

## 15. Auteur

**Chevalier-Tehraoui Noe**

- Email : `noe.tehraoui1@gmail.com`
- Téléphone : `07 82 89 26 09`
- GitHub : `https://github.com/Nouh2`

