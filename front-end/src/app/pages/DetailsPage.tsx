import { useEffect, useState } from "react";
import { useParams, useSearchParams, Link } from "react-router";
import { Heart, Plus, Check, X, List } from "lucide-react";
import {
  getDetails,
  getCast,
  getVideos,
  getProviders,
  type TitleDetails,
  type MediaType,
  type CastMember,
  type Video,
  type Provider,
} from "../../services/api";
import { useAuth } from "../contexts/AuthContext";

const TMDB_IMAGE_BASE = "https://image.tmdb.org/t/p/w185";
const TMDB_LOGO_BASE = "https://image.tmdb.org/t/p/w92";

function Skeleton({ className = "" }: { className?: string }) {
  return <div className={`animate-pulse rounded bg-zinc-800 ${className}`} aria-hidden="true" />;
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
  return <img src={src} alt={`Poster de ${title}`} className="h-full w-full rounded-lg object-cover shadow-2xl" />;
}

function StatBadge({ label, value, highlight = false }: { label: string; value: string; highlight?: boolean }) {
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

export default function DetailsPage() {
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const type = (searchParams.get("type") as MediaType) ?? "movie";

  const { user, favorites, lists, addFavorite, removeFavorite, addToList } = useAuth();

  const [details, setDetails] = useState<TitleDetails | null>(null);
  const [cast, setCast] = useState<CastMember[]>([]);
  const [trailer, setTrailer] = useState<Video | null>(null);
  const [providers, setProviders] = useState<Provider[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [favLoading, setFavLoading] = useState(false);
  const [listModalOpen, setListModalOpen] = useState(false);
  const [addedToList, setAddedToList] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    setError(null);

    Promise.all([
      getDetails(id, type),
      getCast(id, type),
      getVideos(id, type),
      getProviders(id, type),
    ])
      .then(([detailsData, castData, videosData, providersData]) => {
        setDetails(detailsData);
        setCast(castData.cast.slice(0, 5));
        const found = videosData.results.find((v) => v.type === "Trailer" && v.site === "YouTube");
        setTrailer(found ?? null);
        setProviders(providersData.results);
      })
      .catch(() => setError("Não foi possível carregar os detalhes do título."))
      .finally(() => setLoading(false));
  }, [id, type]);

  const displayTitle = details?.title ?? details?.name ?? "Título";
  const year = (details?.release_date ?? details?.first_air_date ?? "").slice(0, 4);

  const numericId = Number(id);
  const isFav = favorites.some(f => f.id === numericId);

  const currentItem = details ? {
    id: numericId,
    title: displayTitle,
    image: details.poster_path ? `https://image.tmdb.org/t/p/w500${details.poster_path}` : '',
    rating: details.vote_average,
    type: type === 'movie' ? 'movie' as const : 'series' as const,
  } : null;

  const handleFavorite = async () => {
    if (!user || !currentItem) return;
    setFavLoading(true);
    try {
      if (isFav) {
        await removeFavorite(numericId);
      } else {
        await addFavorite(currentItem);
      }
    } finally {
      setFavLoading(false);
    }
  };

  const handleAddToList = async (listId: string) => {
    if (!currentItem) return;
    await addToList(listId, currentItem);
    setAddedToList(listId);
    setTimeout(() => {
      setAddedToList(null);
      setListModalOpen(false);
    }, 1000);
  };

  return (
    <main className="min-h-screen bg-zinc-950 text-white">
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
        <nav aria-label="Navegação" className="absolute left-4 top-4 flex items-center gap-2 text-sm text-zinc-400">
          <Link to="/" className="hover:text-white transition-colors">Home</Link>
          <span>/</span>
          <span className="text-white">{loading ? "Carregando..." : displayTitle}</span>
        </nav>
      </div>

      <div className="mx-auto max-w-5xl px-4 pb-16 -mt-20 relative z-10">
        <div className="flex flex-col gap-8 md:flex-row">
          <div className="mx-auto h-72 w-48 flex-shrink-0 md:mx-0 md:h-80 md:w-56">
            {loading ? (
              <Skeleton className="h-full w-full rounded-lg" />
            ) : (
              <Poster path={details?.poster_path ?? null} title={displayTitle} />
            )}
          </div>

          <div className="flex flex-1 flex-col gap-4">
            {loading ? (
              <>
                <Skeleton className="h-8 w-3/4" />
                <Skeleton className="h-4 w-1/4" />
              </>
            ) : (
              <>
                <h1 className="text-3xl font-bold leading-tight md:text-4xl">{displayTitle}</h1>
                <p className="text-zinc-400">
                  {year} · {type === "movie" ? "Filme" : "Série"}
                  {details?.runtime ? ` · ${details.runtime} min` : ""}
                  {details?.number_of_seasons ? ` · ${details.number_of_seasons} temporada(s)` : ""}
                </p>
              </>
            )}

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

            {!loading && details?.genres && (
              <div className="flex flex-wrap gap-2">
                {details.genres.map((g) => (
                  <span key={g.id} className="rounded-full border border-zinc-700 px-3 py-1 text-xs text-zinc-300">
                    {g.name}
                  </span>
                ))}
              </div>
            )}

            {loading ? (
              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
                <Skeleton className="h-4 w-4/6" />
              </div>
            ) : (
              <p className="leading-relaxed text-zinc-300">{details?.overview || "Sinopse não disponível."}</p>
            )}

            {/* Botões de ação — só aparecem para usuários logados */}
            {!loading && user && (
              <div className="flex flex-wrap gap-3 mt-2">
                <button
                  onClick={handleFavorite}
                  disabled={favLoading}
                  className={`flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all ${
                    isFav
                      ? 'bg-red-600 hover:bg-red-700 text-white'
                      : 'bg-zinc-800 hover:bg-zinc-700 text-zinc-300'
                  }`}
                >
                  <Heart className="w-4 h-4" fill={isFav ? 'currentColor' : 'none'} />
                  {isFav ? 'Favoritado' : 'Favoritar'}
                </button>

                <div className="relative">
                  <button
                    onClick={() => setListModalOpen(prev => !prev)}
                    className="flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium bg-zinc-800 hover:bg-zinc-700 text-zinc-300 transition-all"
                  >
                    <List className="w-4 h-4" />
                    Adicionar à lista
                  </button>

                  {listModalOpen && (
                    <div className="absolute left-0 top-full mt-2 z-50 w-64 rounded-2xl bg-zinc-900 border border-zinc-700 shadow-2xl overflow-hidden">
                      <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-800">
                        <span className="text-sm font-semibold text-white">Suas listas</span>
                        <button onClick={() => setListModalOpen(false)} className="text-zinc-500 hover:text-white">
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                      {lists.length === 0 ? (
                        <div className="px-4 py-6 text-center text-sm text-zinc-500">
                          Nenhuma lista criada ainda.{" "}
                          <Link to="/profile" className="text-red-400 hover:underline" onClick={() => setListModalOpen(false)}>
                            Criar lista
                          </Link>
                        </div>
                      ) : (
                        <ul>
                          {lists.map(list => {
                            const alreadyIn = list.items.some(i => i.id === numericId);
                            const justAdded = addedToList === list.id;
                            return (
                              <li key={list.id}>
                                <button
                                  onClick={() => !alreadyIn && handleAddToList(list.id)}
                                  disabled={alreadyIn}
                                  className={`w-full flex items-center justify-between px-4 py-3 text-sm transition-colors ${
                                    alreadyIn
                                      ? 'text-zinc-600 cursor-default'
                                      : 'text-zinc-300 hover:bg-zinc-800 hover:text-white'
                                  }`}
                                >
                                  <div className="text-left">
                                    <p className="font-medium">{list.name}</p>
                                    <p className="text-xs text-zinc-600">{list.items.length} itens</p>
                                  </div>
                                  {justAdded ? (
                                    <Check className="w-4 h-4 text-green-400" />
                                  ) : alreadyIn ? (
                                    <Check className="w-4 h-4 text-zinc-600" />
                                  ) : (
                                    <Plus className="w-4 h-4" />
                                  )}
                                </button>
                              </li>
                            );
                          })}
                        </ul>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        <Section title="Trailer">
          {loading ? (
            <Skeleton className="h-52 w-full rounded-xl md:h-72" />
          ) : trailer ? (
            <div className="relative w-full overflow-hidden rounded-xl" style={{ paddingTop: "56.25%" }}>
              <iframe
                className="absolute inset-0 h-full w-full"
                src={`https://www.youtube.com/embed/${trailer.key}`}
                title="Trailer"
                allowFullScreen
              />
            </div>
          ) : (
            <div className="flex h-52 items-center justify-center rounded-xl bg-zinc-900 text-sm text-zinc-500 md:h-72">
              Trailer não disponível no momento.
            </div>
          )}
        </Section>

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
              : cast.map((member) => (
                  <div key={member.id} className="flex-shrink-0 w-20 text-center text-xs">
                    {member.profile_path ? (
                      <img
                        src={`${TMDB_IMAGE_BASE}${member.profile_path}`}
                        alt={member.name}
                        className="mb-1 h-28 w-20 rounded-lg object-cover bg-zinc-800"
                      />
                    ) : (
                      <div className="mb-1 h-28 w-20 rounded-lg bg-zinc-800 flex items-center justify-center text-zinc-600 text-xs">
                        Sem foto
                      </div>
                    )}
                    <p className="text-zinc-300 font-medium truncate">{member.name}</p>
                    <p className="text-zinc-600 truncate">{member.character}</p>
                  </div>
                ))}
          </div>
        </Section>

        <Section title="Onde assistir">
          {loading ? (
            <div className="flex gap-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-12 w-12 rounded-lg" />
              ))}
            </div>
          ) : providers.length > 0 ? (
            <div className="flex flex-wrap gap-3">
              {providers.map((p) => (
                <div key={p.provider_id} className="flex flex-col items-center gap-1">
                  <img
                    src={`${TMDB_LOGO_BASE}${p.logo_path}`}
                    alt={p.provider_name}
                    className="h-12 w-12 rounded-lg object-cover"
                  />
                  <span className="text-xs text-zinc-500">{p.provider_name}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-zinc-500">
              Este título não está disponível em plataformas de streaming no Brasil no momento.
            </p>
          )}
        </Section>

        {error && (
          <div className="mt-8 rounded-xl border border-red-800 bg-red-950/40 p-4 text-center text-red-400">
            {error}
          </div>
        )}
      </div>
    </main>
  );
}