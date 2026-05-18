import { useEffect, useState } from "react";
import { useParams, useSearchParams, Link } from "react-router";
import { getDetails, type TitleDetails, type MediaType } from "../../services/api";

function Skeleton({ className = "" }: { className?: string }) {
  return (
    <div
      className={`animate-pulse rounded bg-zinc-800 ${className}`}
      aria-hidden="true"
    />
  );
}

function Poster({ path, title }: { path: string | null; title: string }) {
  const src = path ? `https://image.tmdb.org/t/p/w500${path}` : null;

  if (!src) {
    return (
      <div className="flex h-full w-full items-center justify-center rounded-lg bg-zinc-800 text-center text-sm text-zinc-500">
        Sem imagem
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={`Poster de ${title}`}
      className="h-full w-full rounded-lg object-cover shadow-2xl"
    />
  );
}

export function DetailsPage() {
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const type = (searchParams.get("type") as MediaType) ?? "movie";

  const [details, setDetails] = useState<TitleDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    setError(null);
    getDetails(id, type)
      .then(setDetails)
      .catch(() => setError("Não foi possível carregar os detalhes do título."))
      .finally(() => setLoading(false));
  }, [id, type]);

  const displayTitle = details?.title ?? details?.name ?? "Título";
  const year = (details?.release_date ?? details?.first_air_date ?? "").slice(0, 4);

  return (
    <main className="min-h-screen bg-zinc-950 text-white">

      {/* Banner */}
      <div className="relative h-64 w-full overflow-hidden md:h-80">
        {details?.backdrop_path && !loading && (
          <img
            src={`https://image.tmdb.org/t/p/w1280${details.backdrop_path}`}
            alt=""
            aria-hidden="true"
            className="h-full w-full object-cover object-center opacity-40"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-zinc-950" />

        {/* Breadcrumb */}
        <nav
          aria-label="Navegação"
          className="absolute left-4 top-4 flex items-center gap-2 text-sm text-zinc-400"
        >
          <Link to="/" className="hover:text-white transition-colors">
            Home
          </Link>
          <span>/</span>
          <span className="text-white">
            {loading ? "Carregando..." : displayTitle}
          </span>
        </nav>
      </div>

      {/* Conteúdo */}
      <div className="mx-auto max-w-5xl px-4 pb-16 -mt-20 relative z-10">
        <div className="flex flex-col gap-8 md:flex-row">

          {/* Poster */}
          <div className="mx-auto h-72 w-48 flex-shrink-0 md:mx-0 md:h-80 md:w-56">
            {loading ? (
              <Skeleton className="h-full w-full rounded-lg" />
            ) : (
              <Poster path={details?.poster_path ?? null} title={displayTitle} />
            )}
          </div>

          {/* Info */}
          <div className="flex flex-1 flex-col gap-4">

            {loading ? (
              <>
                <Skeleton className="h-8 w-3/4" />
                <Skeleton className="h-4 w-1/4" />
              </>
            ) : (
              <>
                <h1 className="text-3xl font-bold leading-tight md:text-4xl">
                  {displayTitle}
                </h1>
                <p className="text-zinc-400">
                  {year} · {type === "movie" ? "Filme" : "Série"}
                  {details?.runtime ? ` · ${details.runtime} min` : ""}
                  {details?.number_of_seasons
                    ? ` · ${details.number_of_seasons} temporada(s)`
                    : ""}
                </p>
              </>
            )}

            {/* RF29 — Estatísticas */}
            <div className="flex flex-wrap gap-3">
              {loading ? (
                <>
                  <Skeleton className="h-10 w-24 rounded-xl" />
                  <Skeleton className="h-10 w-28 rounded-xl" />
                  <Skeleton className="h-10 w-20 rounded-xl" />
                </>
              ) : (
                <>
                  <StatBadge label="Nota" value={`${details?.vote_average.toFixed(1)} / 10`} highlight />
                  <StatBadge label="Votos" value={details?.vote_count.toLocaleString("pt-BR") ?? "—"} />
                  <StatBadge label="Popularidade" value={details?.popularity.toFixed(0) ?? "—"} />
                </>
              )}
            </div>

            {/* Gêneros */}
            {!loading && details?.genres && (
              <div className="flex flex-wrap gap-2">
                {details.genres.map((g) => (
                  <span
                    key={g.id}
                    className="rounded-full border border-zinc-700 px-3 py-1 text-xs text-zinc-300"
                  >
                    {g.name}
                  </span>
                ))}
              </div>
            )}

            {/* Sinopse */}
            {loading ? (
              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
                <Skeleton className="h-4 w-4/6" />
              </div>
            ) : (
              <p className="leading-relaxed text-zinc-300">
                {details?.overview || "Sinopse não disponível."}
              </p>
            )}
          </div>
        </div>

        {/* Seção Trailer — Sprint 2 (RF22) */}
        <Section title="Trailer">
          {loading ? (
            <Skeleton className="h-52 w-full rounded-xl md:h-72" />
          ) : (
            <div className="flex h-52 items-center justify-center rounded-xl bg-zinc-900 text-sm text-zinc-500 md:h-72">
              Trailer será integrado na Sprint 2 (RF22)
            </div>
          )}
        </Section>

        {/* Seção Elenco — Sprint 2 (RF23) */}
        <Section title="Elenco principal">
          <div className="flex gap-4 overflow-x-auto pb-2">
            {loading
              ? Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="flex-shrink-0 space-y-2">
                    <Skeleton className="h-28 w-20 rounded-lg" />
                    <Skeleton className="h-3 w-20" />
                    <Skeleton className="h-3 w-16" />
                  </div>
                ))
              : Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="flex-shrink-0 w-20 text-center text-xs text-zinc-500">
                    <div className="mb-1 h-28 w-20 rounded-lg bg-zinc-800" />
                    <p>Ator {i + 1}</p>
                    <p className="text-zinc-600">Personagem</p>
                  </div>
                ))}
          </div>
          {!loading && (
            <p className="mt-2 text-xs text-zinc-600">
              Elenco real será integrado na Sprint 2 (RF23)
            </p>
          )}
        </Section>

        {/* Seção Onde Assistir — Sprint 2 (RF24/RF25) */}
        <Section title="Onde assistir">
          {loading ? (
            <div className="flex gap-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-12 w-12 rounded-lg" />
              ))}
            </div>
          ) : (
            <p className="text-sm text-zinc-500">
              Plataformas de streaming serão integradas na Sprint 2 (RF24/RF25)
            </p>
          )}
        </Section>

        {/* Erro */}
        {error && (
          <div className="mt-8 rounded-xl border border-red-800 bg-red-950/40 p-4 text-center text-red-400">
            {error}
          </div>
        )}
      </div>
    </main>
  );
}

function StatBadge({
  label,
  value,
  highlight = false,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div className={`rounded-xl px-4 py-2 text-center ${highlight ? "bg-yellow-500/20 text-yellow-400" : "bg-zinc-800 text-zinc-300"}`}>
      <p className="text-xs text-zinc-500">{label}</p>
      <p className="font-semibold">{value}</p>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-10">
      <h2 className="mb-4 text-xl font-semibold">{title}</h2>
      {children}
    </section>
  );
}
