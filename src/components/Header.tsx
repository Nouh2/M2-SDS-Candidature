export function Header() {
  return (
    <header className="relative overflow-hidden bg-hero">
      <div className="absolute inset-y-0 right-0 hidden w-1/3 bg-[radial-gradient(circle_at_center,rgba(15,118,110,0.14),transparent_62%)] lg:block" />

      <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
        <div className="flex flex-col gap-3 rounded-[1.5rem] border border-white/70 bg-white/85 px-5 py-4 text-sm text-slate shadow-sm backdrop-blur sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
          <p className="text-base font-semibold text-ink">Chevalier-Tehraoui Noe</p>
          <div className="flex flex-col gap-1 sm:flex-row sm:flex-wrap sm:items-center sm:gap-4">
            <a
              href="mailto:noe.tehraoui1@gmail.com"
              className="transition hover:text-accent"
            >
              noe.tehraoui1@gmail.com
            </a>
            <span className="hidden text-sky sm:inline">•</span>
            <a href="tel:0782892609" className="transition hover:text-accent">
              07 82 89 26 09
            </a>
            <span className="hidden text-sky sm:inline">•</span>
            <a
              href="https://github.com/Nouh2"
              target="_blank"
              rel="noreferrer"
              className="transition hover:text-accent"
            >
              github.com/Nouh2
            </a>
          </div>
        </div>

        <div className="inline-flex w-fit items-center rounded-full border border-accent/15 bg-white/80 px-4 py-2 text-sm font-medium text-accent shadow-sm backdrop-blur">
          Projet géo-épidémiologique interactif
        </div>

        <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
          <div className="max-w-3xl">
            <p className="text-sm uppercase tracking-[0.28em] text-slate">
              Pollution atmosphérique, santé publique, visualisation territoriale
            </p>
            <h1 className="mt-5 text-4xl font-semibold tracking-tight text-ink sm:text-5xl lg:text-6xl">
              Tableau de bord géo-épidémiologique sur l'asthme et l'exposition aux PM2.5
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate">
              MVP statique conçu pour illustrer un traitement rigoureux de données de
              santé, une analyse statistique interprétable et une exécution fullstack
              complète.
            </p>
          </div>

          <aside className="rounded-[2rem] border border-white/70 bg-white/90 p-6 shadow-card backdrop-blur">
            <p className="text-sm uppercase tracking-[0.2em] text-slate">Candidature ciblée</p>
            <p className="mt-3 text-xl font-semibold leading-8 text-ink">
              Projet interactif développé spécifiquement pour ma candidature au Master 2
              Sciences des Données de Santé (M2 SDS) - Université Paris Saclay
            </p>
            <div className="mt-6 inline-flex rounded-full bg-warm px-4 py-2 text-sm font-medium text-ink">
              Démarche orientée statistique appliquée et santé publique
            </div>
          </aside>
        </div>
      </div>
    </header>
  );
}
