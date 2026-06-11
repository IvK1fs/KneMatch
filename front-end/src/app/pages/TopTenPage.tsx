import { useState, useEffect } from 'react';
import { Trophy, Film, Tv, TrendingUp, Calendar } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { TopTenCard } from '../components/TopTenCard';
import { Badge } from '../components/ui/badge';
import { getTopTen, type Title } from '../../services/api';

const TMDB_IMAGE_BASE = 'https://image.tmdb.org/t/p/w300';
const PLACEHOLDER = 'https://placehold.co/300x450/1a1a2e/ffffff?text=Sem+imagem';

const GENRE_MAP: Record<number, string> = {
  28: 'Ação', 12: 'Aventura', 16: 'Animação', 35: 'Comédia',
  80: 'Crime', 18: 'Drama', 14: 'Fantasia', 27: 'Terror',
  9648: 'Mistério', 10749: 'Romance', 878: 'Ficção Científica',
  53: 'Thriller', 10765: 'Ficção Científica', 10759: 'Ação e Aventura',
  10762: 'Kids', 10763: 'Notícias', 10764: 'Reality', 10766: 'Novela',
  10767: 'Talk', 10768: 'Guerra e Política', 37: 'Western',
};

function toCardProps(item: Title, rank: number) {
  const title = item.title ?? item.name ?? 'Sem título';
  const image = item.poster_path ? `${TMDB_IMAGE_BASE}${item.poster_path}` : PLACEHOLDER;
  const genre = GENRE_MAP[item.genre_ids?.[0]] ?? '—';
  const rating = item.vote_average ?? 0;
  const views = `${(item as any).popularity?.toFixed(0) ?? '—'}`;
  return { rank, title, image, genre, rating, views };
}

function handleCardClick(item: Title) {
  const type = item.media_type ?? (item.first_air_date ? 'tv' : 'movie');
  window.location.href = `/details/${item.id}?type=${type}`;
}

function Skeleton() {
  return (
    <div className="flex gap-2 sm:gap-4 bg-white dark:bg-gray-900 rounded-lg overflow-hidden border border-gray-300 dark:border-white/10 h-24 sm:h-36 animate-pulse">
      <div className="w-12 sm:w-32 bg-gray-200 dark:bg-gray-800 flex-shrink-0" />
      <div className="w-20 sm:w-40 bg-gray-200 dark:bg-gray-800 flex-shrink-0" />
      <div className="flex-1 py-3 sm:py-6 pr-3 sm:pr-6 space-y-2 sm:space-y-3">
        <div className="h-4 sm:h-6 bg-gray-200 dark:bg-gray-800 rounded w-3/4" />
        <div className="h-3 sm:h-4 bg-gray-200 dark:bg-gray-800 rounded w-1/2" />
      </div>
    </div>
  );
}

export function TopTenPage() {
  const [selectedTab, setSelectedTab] = useState('movies');
  const [movies, setMovies] = useState<Title[]>([]);
  const [series, setSeries] = useState<Title[]>([]);
  const [loadingMovies, setLoadingMovies] = useState(true);
  const [loadingSeries, setLoadingSeries] = useState(true);
  const [errorMovies, setErrorMovies] = useState(false);
  const [errorSeries, setErrorSeries] = useState(false);

  useEffect(() => {
    setLoadingMovies(true);
    setErrorMovies(false);
    getTopTen('movie')
      .then((data) => setMovies((data.results ?? []).slice(0, 10)))
      .catch(() => setErrorMovies(true))
      .finally(() => setLoadingMovies(false));
  }, []);

  useEffect(() => {
    setLoadingSeries(true);
    setErrorSeries(false);
    getTopTen('tv')
      .then((data) => setSeries((data.results ?? []).slice(0, 10)))
      .catch(() => setErrorSeries(true))
      .finally(() => setLoadingSeries(false));
  }, []);

  return (
    <div className="pt-[73px] min-h-screen bg-white dark:bg-black">
      <section className="relative py-16 bg-gradient-to-b from-yellow-100 dark:from-yellow-900/10 via-white dark:via-black to-white dark:to-black">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-3 sm:gap-4 mb-4">
            <div className="bg-yellow-500 text-black p-2 sm:p-3 rounded-lg flex-shrink-0">
              <Trophy className="w-6 h-6 sm:w-8 sm:h-8" />
            </div>
            <div>
              <h1 className="text-3xl sm:text-5xl md:text-6xl text-gray-900 dark:text-white mb-1 sm:mb-2">Ranking</h1>
              <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
                <Badge variant="outline" className="bg-yellow-500/20 border-yellow-500 text-yellow-600 dark:text-yellow-400 text-xs sm:text-sm">
                  <Calendar className="w-3 h-3 mr-1" />
                  Esta Semana
                </Badge>
                <Badge variant="outline" className="bg-gray-200 dark:bg-white/10 border-gray-400 dark:border-white/20 text-gray-900 dark:text-white text-xs sm:text-sm">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  Atualizado diariamente
                </Badge>
              </div>
            </div>
          </div>
          <p className="text-sm sm:text-xl text-gray-600 dark:text-gray-400 max-w-3xl">
            Os filmes e séries mais populares da semana, baseados em visualizações,
            avaliações e engajamento da comunidade.
          </p>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
        <Tabs defaultValue="movies" value={selectedTab} onValueChange={setSelectedTab}>
          <div className="flex justify-center mb-8 sm:mb-12">
            <TabsList className="bg-gray-100 dark:bg-gray-900 border border-gray-300 dark:border-white/10 p-1 w-full sm:w-auto">
              <TabsTrigger
                value="movies"
                className="data-[state=active]:bg-yellow-500 data-[state=active]:text-black gap-1 sm:gap-2 px-3 sm:px-8 flex-1 sm:flex-none text-sm sm:text-base"
              >
                <Film className="w-4 h-4 sm:w-5 sm:h-5" />
                <span className="hidden xs:inline">Ranking </span>Filmes
              </TabsTrigger>
              <TabsTrigger
                value="series"
                className="data-[state=active]:bg-yellow-500 data-[state=active]:text-black gap-1 sm:gap-2 px-3 sm:px-8 flex-1 sm:flex-none text-sm sm:text-base"
              >
                <Tv className="w-4 h-4 sm:w-5 sm:h-5" />
                <span className="hidden xs:inline">Ranking </span>Séries
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="movies" className="space-y-4">
            {loadingMovies && Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} />)}
            {errorMovies && (
              <p className="text-red-500 text-center py-8">
                Não foi possível carregar o ranking de filmes.
              </p>
            )}
            {!loadingMovies && !errorMovies && movies.map((movie, index) => {
              const props = toCardProps(movie, index + 1);
              return (
                <TopTenCard
                  key={movie.id}
                  {...props}
                  onClick={() => handleCardClick(movie)}
                />
              );
            })}
          </TabsContent>

          <TabsContent value="series" className="space-y-4">
            {loadingSeries && Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} />)}
            {errorSeries && (
              <p className="text-red-500 text-center py-8">
                Não foi possível carregar o ranking de séries.
              </p>
            )}
            {!loadingSeries && !errorSeries && series.map((serie, index) => {
              const props = toCardProps(serie, index + 1);
              return (
                <TopTenCard
                  key={serie.id}
                  {...props}
                  onClick={() => handleCardClick(serie)}
                />
              );
            })}
          </TabsContent>
        </Tabs>
      </div>

      <section className="border-t border-gray-300 dark:border-white/10 py-12 bg-gray-100 dark:bg-gray-900/30">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl text-yellow-500 mb-2">Top 10</div>
              <div className="text-gray-600 dark:text-gray-400">Títulos em Destaque</div>
            </div>
            <div>
              <div className="text-4xl text-yellow-500 mb-2">TMDb</div>
              <div className="text-gray-600 dark:text-gray-400">Fonte dos dados</div>
            </div>
            <div>
              <div className="text-4xl text-yellow-500 mb-2">Diária</div>
              <div className="text-gray-600 dark:text-gray-400">Atualização</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
