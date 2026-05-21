import { useState, useCallback, useEffect, useRef } from 'react';
import { Search, Filter, X, Star, ArrowUpDown } from 'lucide-react';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Badge } from '../components/ui/badge';
import { Slider } from '../components/ui/slider';
import { useTranslation } from 'react-i18next';
import { searchTitles, getGenres, Title, Genre } from '../../services/api';


const TMDB_IMAGE_BASE = 'https://image.tmdb.org/t/p/w300';

interface Movie {
  id: number;
  title: string;
  image: string;
  year: number;
  genre: string;
  rating: number;
  actors: string[];
}

const allMovies: Movie[] = [
  { id: 1, title: 'Horizonte de Fogo', image: 'https://images.unsplash.com/photo-1655367574486-f63675dd69eb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaW5lbWElMjBtb3ZpZSUyMHBvc3RlcnxlbnwxfHx8fDE3NzUwMTE4NjN8MA&ixlib=rb-4.1.0&q=80&w=1080', year: 2024, genre: 'Ação', rating: 9.2, actors: ['Tom Holland', 'Zendaya'] },
  { id: 2, title: 'Ecos do Passado', image: 'https://images.unsplash.com/photo-1554246881-d1aec048cc39?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhY3Rpb24lMjBmaWxtJTIwc2NlbmV8ZW58MXx8fHwxNzc1MDU4OTIxfDA&ixlib=rb-4.1.0&q=80&w=1080', year: 2023, genre: 'Drama', rating: 9.0, actors: ['Meryl Streep', 'Tom Hanks'] },
  { id: 3, title: 'Invasão Silenciosa', image: 'https://images.unsplash.com/photo-1762356121454-877acbd554bb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkcmFtYSUyMG1vdmllJTIwdGhlYXRlcnxlbnwxfHx8fDE3NzUwNTg5MjF8MA&ixlib=rb-4.1.0&q=80&w=1080', year: 2024, genre: 'Ficção Científica', rating: 8.8, actors: ['Chris Pratt', 'Zoe Saldana'] },
  { id: 4, title: 'Comédia da Vida', image: 'https://images.unsplash.com/photo-1764197944213-3beb56dcf9b4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb21lZHklMjBmaWxtJTIwZW50ZXJ0YWlubWVudHxlbnwxfHx8fDE3NzUwNTg5MjF8MA&ixlib=rb-4.1.0&q=80&w=1080', year: 2025, genre: 'Comédia', rating: 8.4, actors: ['Ryan Reynolds', 'Emma Stone'] },
  { id: 5, title: 'Galáxia Perdida', image: 'https://images.unsplash.com/photo-1634585738250-09ee92cae0f8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzY2ktZmklMjBtb3ZpZSUyMGZ1dHVyaXN0aWN8ZW58MXx8fHwxNzc1MDA5MDg5fDA&ixlib=rb-4.1.0&q=80&w=1080', year: 2024, genre: 'Ficção Científica', rating: 9.4, actors: ['Tom Holland', 'Chris Pratt'] },
  { id: 6, title: 'Amor Eterno', image: 'https://images.unsplash.com/photo-1705565535316-3e4cc538c2ab?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyb21hbmNlJTIwZmlsbSUyMGNvdXBsZXxlbnwxfHx8fDE3NzUwNTg5MjJ8MA&ixlib=rb-4.1.0&q=80&w=1080', year: 2023, genre: 'Romance', rating: 8.6, actors: ['Zendaya', 'Emma Stone'] },
  { id: 7, title: 'Código Vermelho', image: 'https://images.unsplash.com/photo-1655367574486-f63675dd69eb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaW5lbWElMjBtb3ZpZSUyMHBvc3RlcnxlbnwxfHx8fDE3NzUwMTE4NjN8MA&ixlib=rb-4.1.0&q=80&w=1080', year: 2025, genre: 'Ação', rating: 8.2, actors: ['Ryan Reynolds', 'Tom Hanks'] },
  { id: 8, title: 'A Grande Mentira', image: 'https://images.unsplash.com/photo-1554246881-d1aec048cc39?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhY3Rpb24lMjBmaWxtJTIwc2NlbmV8ZW58MXx8fHwxNzc1MDU4OTIxfDA&ixlib=rb-4.1.0&q=80&w=1080', year: 2024, genre: 'Suspense', rating: 8.0, actors: ['Meryl Streep', 'Zoe Saldana'] },
  { id: 9, title: 'Risadas Garantidas', image: 'https://images.unsplash.com/photo-1764197944213-3beb56dcf9b4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb21lZHklMjBmaWxtJTIwZW50ZXJ0YWlubWVudHxlbnwxfHx8fDE3NzUwNTg5MjF8MA&ixlib=rb-4.1.0&q=80&w=1080', year: 2023, genre: 'Comédia', rating: 7.8, actors: ['Emma Stone', 'Ryan Reynolds'] },
  { id: 10, title: 'Destino Final', image: 'https://images.unsplash.com/photo-1762356121454-877acbd554bb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkcmFtYSUyMG1vdmllJTIwdGhlYXRlcnxlbnwxfHx8fDE3NzUwNTg5MjF8MA&ixlib=rb-4.1.0&q=80&w=1080', year: 2025, genre: 'Drama', rating: 9.6, actors: ['Tom Hanks', 'Meryl Streep'] },
  { id: 11, title: 'Viagem Espacial', image: 'https://images.unsplash.com/photo-1634585738250-09ee92cae0f8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzY2ktZmklMjBtb3ZpZSUyMGZ1dHVyaXN0aWN8ZW58MXx8fHwxNzc1MDA5MDg5fDA&ixlib=rb-4.1.0&q=80&w=1080', year: 2024, genre: 'Ficção Científica', rating: 7.6, actors: ['Chris Pratt', 'Zoe Saldana'] },
  { id: 12, title: 'Corações Partidos', image: 'https://images.unsplash.com/photo-1705565535316-3e4cc538c2ab?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyb21hbmNlJTIwZmlsbSUyMGNvdXBsZXxlbnwxfHx8fDE3NzUwNTg5MjJ8MA&ixlib=rb-4.1.0&q=80&w=1080', year: 2023, genre: 'Romance', rating: 7.4, actors: ['Zendaya', 'Tom Holland'] },
];

export function SearchPage() {
  const { t } = useTranslation();


  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenre, setSelectedGenre] = useState(t('genres.all'));
  const [yearFrom, setYearFrom] = useState('');
  const [actorName, setActorName] = useState('');
  const [minRating, setMinRating] = useState([0]);
  const [showFilters, setShowFilters] = useState(true);
  const [sortBy, setSortBy] = useState('relevance');

  const [results, setResults] = useState<Title[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [apiError, setApiError] = useState(false);

  const [genres, setGenres] = useState<Genre[]>([]);
  const [suggestions, setSuggestions] = useState<Title[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const GENRE_FALLBACK: Genre[] = [
    { id: 28, name: 'Ação' }, { id: 12, name: 'Aventura' },
    { id: 16, name: 'Animação' }, { id: 35, name: 'Comédia' },
    { id: 80, name: 'Crime' }, { id: 18, name: 'Drama' },
    { id: 14, name: 'Fantasia' }, { id: 27, name: 'Terror' },
    { id: 9648, name: 'Mistério' }, { id: 10749, name: 'Romance' },
    { id: 878, name: 'Ficção científica' }, { id: 53, name: 'Thriller' },
  ];

  useEffect(() => {
    getGenres('movie')
      .then((data) => setGenres(data.genres))
      .catch(() => setGenres(GENRE_FALLBACK));
  }, []);

  async function doSearch(query: string) {
    if (!query.trim()) return;
    setIsLoading(true);
    setHasSearched(true);
    setApiError(false);
    try {
      const data = await searchTitles(query);
      setResults(data.results ?? []);
    } catch {
      setApiError(true);
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  }

  const handleSearch = useCallback(() => doSearch(searchQuery), [searchQuery]);

  function handleInputChange(value: string) {
    setSearchQuery(value);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (value.length < 3) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }
    debounceRef.current = setTimeout(async () => {
      setIsLoading(true);
      try {
        const data = await searchTitles(value);
        const items = data.results ?? [];
        setSuggestions(items.slice(0, 5));
        setShowSuggestions(true);
        setResults(items);
        setHasSearched(true);
        setApiError(false);
      } catch (err) {
        console.error('[autocomplete] erro:', err);
        setSuggestions([]);
      } finally {
        setIsLoading(false);
      }
    }, 300);
  }

  // RF09 — Navega para detalhes ao clicar num card real
  function handleResultClick(item: Title) {
    const type = item.media_type ?? (item.title ? 'movie' : 'tv');
    window.location.href = `/details/${item.id}?type=${type}`;
  }

  // Filtragem e ordenação dos mockados
  const filteredMovies = allMovies.filter((movie) => {
    const matchesSearch = movie.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesGenre = selectedGenre === t('genres.all') || movie.genre === selectedGenre;
    const matchesYear = yearFrom === '' || movie.year >= parseInt(yearFrom);
    const matchesActor = actorName === '' || movie.actors.some((a) => a.toLowerCase().includes(actorName.toLowerCase()));
    const matchesRating = movie.rating >= minRating[0];
    return matchesSearch && matchesGenre && matchesYear && matchesActor && matchesRating;
  });

  const sortedMovies = [...filteredMovies].sort((a, b) => {
    switch (sortBy) {
      case 'rating-desc': return b.rating - a.rating;
      case 'rating-asc': return a.rating - b.rating;
      case 'alpha-asc': return a.title.localeCompare(b.title);
      case 'alpha-desc': return b.title.localeCompare(a.title);
      case 'year-desc': return b.year - a.year;
      case 'year-asc': return a.year - b.year;
      default: return 0;
    }
  });

  const clearFilters = () => {
    setSelectedGenre(t('genres.all'));
    setYearFrom('');
    setActorName('');
    setMinRating([0]);
  };

  const activeFiltersCount = [
    selectedGenre !== t('genres.all'),
    yearFrom !== '',
    actorName !== '',
    minRating[0] > 0,
  ].filter(Boolean).length;

  const showingRealResults = hasSearched && !apiError;

  return (
    <div className="pt-[73px] min-h-screen bg-white dark:bg-black">
      <section className="bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-black py-12 border-b border-gray-300 dark:border-white/10">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl text-gray-900 dark:text-white mb-6">{t('search.title')}</h1>

          {/* Search Bar — RF01 */}
          <div className="relative max-w-3xl flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                type="text"
                placeholder={t('search.placeholder')}
                value={searchQuery}
                onChange={(e) => handleInputChange(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
                className="pl-12 pr-4 py-6 text-lg bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white placeholder:text-gray-400 focus:border-red-500"
              />
              {showSuggestions && suggestions.length > 0 && (
                <div className="absolute top-full left-0 right-0 z-50 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg shadow-xl mt-1 overflow-hidden">
                  {suggestions.map((item) => {
                    const title = item.title ?? item.name ?? '';
                    const imageUrl = item.poster_path ? `https://image.tmdb.org/t/p/w300${item.poster_path}` : null;
                    return (
                      <div
                        key={item.id}
                        onMouseDown={() => { setSearchQuery(title); setShowSuggestions(false); doSearch(title); }}
                        className="flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                      >
                        {imageUrl
                          ? <img src={imageUrl} alt={title} className="w-8 h-12 object-cover rounded" />
                          : <div className="w-8 h-12 bg-gray-200 dark:bg-gray-600 rounded" />
                        }
                        <span className="text-gray-900 dark:text-white text-sm">{title}</span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
            <Button
              onClick={handleSearch}
              disabled={isLoading}
              className="bg-red-600 hover:bg-red-700 text-white px-6 py-6 text-base"
            >
              {isLoading ? '...' : 'Buscar'}
            </Button>
          </div>

          <div className="flex items-center gap-4 mt-6">
            <Button
              onClick={() => setShowFilters(!showFilters)}
              variant="outline"
              className="border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700 gap-2"
            >
              <Filter className="w-4 h-4" />
              {t('search.filters')}
              {activeFiltersCount > 0 && <Badge className="bg-red-600 ml-2">{activeFiltersCount}</Badge>}
            </Button>
            {activeFiltersCount > 0 && (
              <Button onClick={clearFilters} variant="ghost" className="text-gray-600 dark:text-gray-400 gap-2">
                <X className="w-4 h-4" />
                {t('search.clearFilters')}
              </Button>
            )}
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-8">
        <div className="flex gap-8">
          {showFilters && (
            <aside className="w-80 flex-shrink-0 space-y-6">
              <div className="bg-gray-100 dark:bg-gray-900 rounded-lg p-6 border border-gray-300 dark:border-white/10 sticky top-24">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl text-gray-900 dark:text-white">{t('search.filters')}</h2>
                  {activeFiltersCount > 0 && <Badge className="bg-red-600">{activeFiltersCount} {t('search.activeFilters')}</Badge>}
                </div>
                <div className="space-y-3 mb-6">
                  <label className="text-sm text-gray-600 dark:text-gray-400">{t('search.genre')}</label>
                  <Select value={selectedGenre} onValueChange={setSelectedGenre}>
                    <SelectTrigger className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={t('genres.all')}>{t('genres.all')}</SelectItem>
                      {genres.map((genre) => (
                        <SelectItem key={genre.id} value={genre.name}>{genre.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-3 mb-6">
                  <label className="text-sm text-gray-600 dark:text-gray-400">{t('search.yearFrom')}</label>
                  <Input type="number" placeholder={t('search.yearPlaceholder')} value={yearFrom} onChange={(e) => setYearFrom(e.target.value)} min="1900" max="2030" className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white" />
                </div>
                <div className="space-y-3 mb-6">
                  <label className="text-sm text-gray-600 dark:text-gray-400">{t('search.actor')}</label>
                  <Input type="text" placeholder={t('search.actorPlaceholder')} value={actorName} onChange={(e) => setActorName(e.target.value)} className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white" />
                </div>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <label className="text-sm text-gray-600 dark:text-gray-400">{t('search.minRating')}</label>
                    <div className="flex items-center gap-1 text-yellow-500">
                      <Star className="w-4 h-4 fill-current" />
                      <span className="text-gray-900 dark:text-white">{minRating[0].toFixed(1)}</span>
                    </div>
                  </div>
                  <Slider value={minRating} onValueChange={setMinRating} max={10} step={0.1} className="w-full" />
                  <div className="flex justify-between text-xs text-gray-500"><span>0</span><span>10</span></div>
                </div>
              </div>
            </aside>
          )}

          <div className="flex-1">
            {isLoading && <p className="text-gray-400 text-center py-8">Buscando...</p>}

            {apiError && (
              <p className="text-red-500 text-center py-8">
                Não foi possível conectar ao servidor. Tente novamente.
              </p>
            )}

            {/* Resultados reais da API — RF09 */}
            {showingRealResults && !isLoading && (
              <>
                <p className="text-gray-600 dark:text-gray-400 mb-6">{results.length} resultado(s) encontrado(s)</p>
                {results.length === 0 ? (
                  <div className="text-center py-16">
                    <Search className="w-16 h-16 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
                    <h3 className="text-xl text-gray-600 dark:text-gray-400 mb-2">{t('search.noResults')}</h3>
                    <p className="text-gray-500">{t('search.noResultsDesc')}</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {results.map((item) => {
                      const title = item.title ?? item.name ?? 'Sem título';
                      const date = item.release_date ?? item.first_air_date ?? '';
                      const year = date ? new Date(date).getFullYear() : '—';
                      const rating = item.vote_average?.toFixed(1) ?? 'N/A';
                      const imageUrl = item.poster_path ? `${TMDB_IMAGE_BASE}${item.poster_path}` : null;
                      return (
                        <div key={item.id} onClick={() => handleResultClick(item)} className="group relative bg-white dark:bg-gray-900 rounded-lg overflow-hidden border border-gray-300 dark:border-white/10 hover:border-red-500/50 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-red-500/20 cursor-pointer">
                          <div className="aspect-[2/3] overflow-hidden bg-gray-200 dark:bg-gray-800 flex items-center justify-center">
                            {imageUrl
                              ? <img src={imageUrl} alt={title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                              : <span className="text-gray-400 text-sm">Sem imagem</span>
                            }
                          </div>
                          <div className="p-4">
                            <h3 className="text-gray-900 dark:text-white mb-2 line-clamp-1 group-hover:text-red-500 transition-colors">{title}</h3>
                            <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
                              <span>{year}</span>
                              <div className="flex items-center gap-1">
                                <Star className="w-3 h-3 fill-yellow-500 text-yellow-500" />
                                <span className="text-gray-900 dark:text-white">{rating}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </>
            )}

            {/* Mockados — exibidos antes de qualquer busca */}
            {!showingRealResults && !isLoading && (
              <>
                <div className="mb-6 flex items-center justify-between">
                  <p className="text-gray-600 dark:text-gray-400">
                    {sortedMovies.length} {sortedMovies.length !== 1 ? t('search.resultsPlural') : t('search.results')}{' '}
                    {sortedMovies.length !== 1 ? t('search.foundPlural') : t('search.found')}
                  </p>
                  <div className="flex items-center gap-3">
                    <ArrowUpDown className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                    <Select value={sortBy} onValueChange={setSortBy}>
                      <SelectTrigger className="w-[220px] bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="relevance">{t('search.relevance')}</SelectItem>
                        <SelectItem value="rating-desc">{t('search.ratingDesc')}</SelectItem>
                        <SelectItem value="rating-asc">{t('search.ratingAsc')}</SelectItem>
                        <SelectItem value="alpha-asc">{t('search.alphaAsc')}</SelectItem>
                        <SelectItem value="alpha-desc">{t('search.alphaDesc')}</SelectItem>
                        <SelectItem value="year-desc">{t('search.yearDesc')}</SelectItem>
                        <SelectItem value="year-asc">{t('search.yearAsc')}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                {sortedMovies.length > 0 ? (
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {sortedMovies.map((movie) => (
                      <div key={movie.id} className="group relative bg-white dark:bg-gray-900 rounded-lg overflow-hidden border border-gray-300 dark:border-white/10 hover:border-red-500/50 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-red-500/20 cursor-pointer">
                        <div className="aspect-[2/3] overflow-hidden">
                          <img src={movie.image} alt={movie.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                        </div>
                        <div className="p-4">
                          <h3 className="text-gray-900 dark:text-white mb-2 line-clamp-1 group-hover:text-red-500 transition-colors">{movie.title}</h3>
                          <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400 mb-2">
                            <span>{movie.year}</span>
                            <div className="flex items-center gap-1">
                              <Star className="w-3 h-3 fill-yellow-500 text-yellow-500" />
                              <span className="text-gray-900 dark:text-white">{movie.rating}</span>
                            </div>
                          </div>
                          <Badge variant="outline" className="border-gray-400 dark:border-gray-700 text-gray-600 dark:text-gray-400 text-xs">{movie.genre}</Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-16">
                    <Search className="w-16 h-16 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
                    <h3 className="text-xl text-gray-600 dark:text-gray-400 mb-2">{t('search.noResults')}</h3>
                    <p className="text-gray-500">{t('search.noResultsDesc')}</p>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}