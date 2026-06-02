import { useState, useEffect } from 'react';
import { Calendar, Film, TrendingUp, Clock } from 'lucide-react';
import { Badge } from '../components/ui/badge';
import { getUpcoming, type Title } from '../../services/api';

const TMDB_IMAGE_BASE = 'https://image.tmdb.org/t/p/w300';
const PLACEHOLDER = 'https://placehold.co/300x450/1a1a2e/ffffff?text=Sem+imagem';

function formatarData(iso: string): string {
  const date = new Date(iso + 'T00:00:00');
  return date.toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' });
}

function diasAte(iso: string): number {
  const lancamento = new Date(iso + 'T00:00:00');
  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);
  return Math.ceil((lancamento.getTime() - hoje.getTime()) / (1000 * 60 * 60 * 24));
}

function BadgeContagem({ releaseDate }: { releaseDate: string }) {
  const dias = diasAte(releaseDate);
  if (dias < 0)   return <Badge variant="outline" className="bg-gray-200 dark:bg-white/10 border-gray-400 dark:border-white/20 text-gray-700 dark:text-white">Lançado</Badge>;
  if (dias === 0) return <Badge variant="outline" className="bg-yellow-500/20 border-yellow-500 text-yellow-600 dark:text-yellow-400">Hoje!</Badge>;
  return <Badge variant="outline" className="bg-blue-500/20 border-blue-500 text-blue-600 dark:text-blue-400">em {dias} dia{dias !== 1 ? 's' : ''}</Badge>;
}

function Skeleton() {
  return (
    <div className="flex gap-4 bg-white dark:bg-gray-900 rounded-lg overflow-hidden border border-gray-300 dark:border-white/10 h-36 animate-pulse">
      <div className="w-24 bg-gray-200 dark:bg-gray-800" />
      <div className="flex-1 py-6 pr-6 space-y-3">
        <div className="h-6 bg-gray-200 dark:bg-gray-800 rounded w-3/4" />
        <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-1/2" />
        <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-1/3" />
      </div>
    </div>
  );
}

function UpcomingCard({ item }: { item: Title }) {
  const title       = item.title ?? item.name ?? 'Sem título';
  const releaseDate = item.release_date ?? item.first_air_date ?? '';
  const image       = item.poster_path ? `${TMDB_IMAGE_BASE}${item.poster_path}` : PLACEHOLDER;

  //Navega para a página de detalhes ao clicar no card
  function handleClick() {
    const type = item.media_type ?? (item.first_air_date ? 'tv' : 'movie');
    window.location.href = `/details/${item.id}?type=${type}`;
  }

  return (
    <div
      onClick={handleClick}
      className="flex gap-4 bg-white dark:bg-gray-900 rounded-lg overflow-hidden border border-gray-300 dark:border-white/10 hover:border-gray-400 dark:hover:border-white/30 transition-all cursor-pointer group"
    >
      <img
        src={image}
        alt={title}
        className="w-24 object-cover flex-shrink-0"
        onError={(e) => { (e.currentTarget as HTMLImageElement).src = PLACEHOLDER; }}
      />
      <div className="flex-1 py-4 pr-4 min-w-0">
        <div className="flex items-center gap-2 flex-wrap mb-1">
          <h3 className="text-gray-900 dark:text-white font-bold text-base group-hover:text-yellow-500 transition-colors truncate">
            {title}
          </h3>
          {releaseDate && <BadgeContagem releaseDate={releaseDate} />}
        </div>
        {releaseDate && (
          <p className="text-gray-500 dark:text-gray-400 text-sm mb-2 flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            {formatarData(releaseDate)}
          </p>
        )}
        <p className="text-yellow-500 text-sm font-semibold">
          ★ {item.vote_average?.toFixed(1) ?? '—'}
        </p>
      </div>
    </div>
  );
}

export default function UpcomingPage() {
  const [filmes,  setFilmes]  = useState<Title[]>([]);
  const [loading, setLoading] = useState(true);
  const [erro,    setErro]    = useState(false);
  const [ordenar, setOrdenar] = useState<'data' | 'titulo'>('data');

  useEffect(() => {
    setLoading(true);
    setErro(false);
    getUpcoming()
      .then(data => setFilmes(data.results))
      .catch(() => setErro(true))
      .finally(() => setLoading(false));
  }, []);

  const ordenados = [...filmes].sort((a, b) => {
    if (ordenar === 'titulo') {
      return (a.title ?? a.name ?? '').localeCompare(b.title ?? b.name ?? '');
    }
    const da = a.release_date ?? a.first_air_date ?? '';
    const db = b.release_date ?? b.first_air_date ?? '';
    const hoje = new Date().toISOString().slice(0, 10);
    const aFuturo = da >= hoje;
    const bFuturo = db >= hoje;
    if (aFuturo && bFuturo)   return da.localeCompare(db);
    if (!aFuturo && !bFuturo) return db.localeCompare(da);
    return aFuturo ? -1 : 1;
  });

  return (
    <div className="pt-[73px] min-h-screen bg-white dark:bg-black">
      <section className="relative py-16 bg-gradient-to-b from-blue-100 dark:from-blue-900/10 via-white dark:via-black to-white dark:to-black">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-4 mb-4">
            <div className="bg-blue-500 text-white p-3 rounded-lg">
              <Clock className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-5xl md:text-6xl text-gray-900 dark:text-white mb-4">Upcoming</h1>
              <div className="flex items-center gap-3">
                <Badge variant="outline" className="bg-blue-500/20 border-blue-500 text-blue-600 dark:text-blue-400">
                  <Calendar className="w-3 h-3 mr-1" />
                  Próximos Lançamentos
                </Badge>
                <Badge variant="outline" className="bg-gray-200 dark:bg-white/10 border-gray-400 dark:border-white/20 text-gray-900 dark:text-white">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  Atualizado diariamente
                </Badge>
              </div>
            </div>
          </div>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl">
            Filmes confirmados para os próximos meses, com datas de lançamento e avaliações preliminares.
          </p>
        </div>
      </section>

      <section className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-3 mb-6">
          <Film className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          <span className="text-gray-600 dark:text-gray-400 text-sm">Ordenar por:</span>
          {(['data', 'titulo'] as const).map(op => (
            <button
              key={op}
              onClick={() => setOrdenar(op)}
              className={`px-4 py-1.5 rounded-lg text-sm font-semibold border transition-all ${
                ordenar === op
                  ? 'bg-blue-500 border-blue-500 text-white'
                  : 'bg-transparent border-gray-400 dark:border-white/20 text-gray-700 dark:text-gray-300 hover:border-blue-400'
              }`}
            >
              {op === 'data' ? 'Data' : 'Título'}
            </button>
          ))}
        </div>

        {loading && (
          <div className="flex flex-col gap-4">
            {Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} />)}
          </div>
        )}

        {erro && (
          <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-400 rounded-lg p-4 flex items-center gap-3">
            <span>⚠️</span>
            <span className="flex-1 text-sm text-yellow-800 dark:text-yellow-300">
              Não foi possível carregar os lançamentos.
            </span>
            <button
              onClick={() => window.location.reload()}
              className="bg-blue-500 text-white px-4 py-1.5 rounded-lg text-sm hover:bg-blue-600 transition-colors"
            >
              Tentar novamente
            </button>
          </div>
        )}

        {!loading && !erro && (
          <div className="flex flex-col gap-4">
            {ordenados.map(m => <UpcomingCard key={m.id} item={m} />)}
            {ordenados.length === 0 && (
              <p className="text-center text-gray-500 dark:text-gray-400 pt-8">
                Nenhum lançamento encontrado.
              </p>
            )}
          </div>
        )}
      </section>
    </div>
  );
}