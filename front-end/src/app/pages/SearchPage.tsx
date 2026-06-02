import { useState, useEffect, useRef, useCallback } from 'react';
import { Search, Filter, X, Star, ChevronLeft, ChevronRight, User, Clapperboard } from 'lucide-react';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Badge } from '../components/ui/badge';
import { Slider } from '../components/ui/slider';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router';
import { searchTitles, discoverTitles, getTrending, getUpcoming, getGenres, Title, Genre } from '../../services/api';

const TMDB_IMAGE_BASE = 'https://image.tmdb.org/t/p/w300';

const GENRE_FALLBACK: Genre[] = [
  { id: 28, name: 'Ação' }, { id: 12, name: 'Aventura' },
  { id: 16, name: 'Animação' }, { id: 35, name: 'Comédia' },
  { id: 80, name: 'Crime' }, { id: 18, name: 'Drama' },
  { id: 14, name: 'Fantasia' }, { id: 27, name: 'Terror' },
  { id: 9648, name: 'Mistério' }, { id: 10749, name: 'Romance' },
  { id: 878, name: 'Ficção científica' }, { id: 53, name: 'Thriller' },
];

interface FilterState {
  q: string;
  type: 'movie' | 'tv' | '';
  genre: string;
  sort: string;
  page: number;
  year: string;
  rating: number;
  cast: string;
  director: string;
  decade: string;
}

const DEFAULT_FILTERS: FilterState = {
  q: '',
  type: '',
  genre: '',
  sort: 'popularity.desc',
  page: 1,
  year: '',
  rating: 0,
  cast: '',
  director: '',
  decade: '',
};

const DECADES = ['1950', '1960', '1970', '1980', '1990', '2000', '2010', '2020'];

export function SearchPage() {
  const { t } = useTranslation();

  const [searchParams] = useSearchParams();

useEffect(() => {
  const type = searchParams.get('type');
  //Aplica filtro de tipo vindo da URL ao montar a página
  if (type === 'movie' || type === 'tv') {
    setFilters(prev => ({ ...prev, type }));
  }
}, []);

  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS);
  const [yearMode, setYearMode] = useState<'year' | 'decade'>('year');
  const [inputValue, setInputValue] = useState('');
  const [castInput, setCastInput] = useState('');
  const [directorInput, setDirectorInput] = useState('');
  const castDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const directorDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [showFilters, setShowFilters] = useState(true);

  const [results, setResults] = useState<Title[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [apiError, setApiError] = useState(false);

  const [genres, setGenres] = useState<Genre[]>([]);
  const [genreMap, setGenreMap] = useState<Record<number, string>>({});
  const [suggestions, setSuggestions] = useState<Title[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const type = (filters.type || 'movie') as 'movie' | 'tv';
    getGenres(type)
      .then((data) => {
        setGenres(data.genres);
        const map: Record<number, string> = {};
        data.genres.forEach((g) => { map[g.id] = g.name; });
        setGenreMap(map);
      })
      .catch(() => {
        setGenres(GENRE_FALLBACK);
        const map: Record<number, string> = {};
        GENRE_FALLBACK.forEach((g) => { map[g.id] = g.name; });
        setGenreMap(map);
      });
  }, [filters.type]);

  useEffect(() => {
    executeSearch(filters);
  }, [filters]);

 async function executeSearch(f: FilterState) {
  setIsLoading(true);
  setApiError(false);
  try {
    let items: Title[] = [];
    let pages = 1;

    const yearFrom = f.decade ? f.decade : f.year;
    const yearTo   = f.decade ? String(parseInt(f.decade) + 9) : undefined;
    const usesAdvancedFilters = !!(f.cast || f.director || f.decade);

    if (f.q.trim() && !usesAdvancedFilters) {
      const data = await searchTitles(f.q, f.type);
      items = data.results ?? [];
      pages = (data as any).total_pages ?? 1;
    } else {
      try {
        const data = await discoverTitles({
          q: f.q || undefined,
          type: f.type,
          genre: f.genre,
          sort: f.sort,
          page: f.page,
          year: yearFrom,
          yearTo,
          rating: f.rating,
          cast: f.cast || undefined,
          director: f.director || undefined,
        });
        items = data.results ?? [];
        pages = data.total_pages ?? 1;
      } catch {
        const trendingType = f.type || undefined;
        const [trendingData, upcomingData] = await Promise.all([
          getTrending(trendingType),
          f.type !== 'tv' ? getUpcoming() : Promise.resolve({ results: [] }),
        ]);
        const seen = new Set<number>();
        for (const item of [...(trendingData.results ?? []), ...(upcomingData.results ?? [])]) {
          if (!seen.has(item.id)) { seen.add(item.id); items.push(item); }
        }
      }
    }

    setResults(items);
    setTotalPages(pages);
  } catch {
    setApiError(true);
    setResults([]);
  } finally {
    setIsLoading(false);
  }
}

  function getGenreName(genreIds: number[]): string {
    if (!genreIds || genreIds.length === 0) return '';
    return genreMap[genreIds[0]] ?? '';
  }

  function handleInputChange(value: string) {
    setInputValue(value);
    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (value.length < 3) {
      setSuggestions([]);
      setShowSuggestions(false);
      if (value.length === 0 && filters.q !== '') {
        setFilters((f) => ({ ...f, q: '', page: 1 }));
      }
      return;
    }

    debounceRef.current = setTimeout(async () => {
      try {
        const data = await searchTitles(value);
        setSuggestions((data.results ?? []).slice(0, 5));
        setShowSuggestions(true);
      } catch {
        setSuggestions([]);
      }
      setFilters((f) => ({ ...f, q: value, page: 1 }));
    }, 300);
  }

  const handleSearch = useCallback(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    setShowSuggestions(false);
    setFilters((f) => ({ ...f, q: inputValue, page: 1 }));
  }, [inputValue]);

  function handleSuggestionClick(item: Title) {
    const title = item.title ?? item.name ?? '';
    setInputValue(title);
    setShowSuggestions(false);
    setFilters((f) => ({ ...f, q: title, page: 1 }));
  }

  function handleResultClick(item: Title) {
    const type = item.media_type ?? (item.title && !item.name ? 'movie' : 'tv');
    window.location.href = `/details/${item.id}?type=${type}`;
  }

  function handlePageChange(newPage: number) {
    setFilters((f) => ({ ...f, page: newPage }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function handleTypeChange(type: 'movie' | 'tv' | '') {
    setFilters((f) => ({ ...f, type, genre: '', page: 1 }));
  }

  function clearFilters() {
    setInputValue('');
    setCastInput('');
    setDirectorInput('');
    setFilters(DEFAULT_FILTERS);
    setYearMode('year');
  }

  function handleCastChange(value: string) {
    setCastInput(value);
    if (castDebounceRef.current) clearTimeout(castDebounceRef.current);
    castDebounceRef.current = setTimeout(() => {
      setFilters((f) => ({ ...f, cast: value, page: 1 }));
    }, 600);
  }

  function handleDirectorChange(value: string) {
    setDirectorInput(value);
    if (directorDebounceRef.current) clearTimeout(directorDebounceRef.current);
    directorDebounceRef.current = setTimeout(() => {
      setFilters((f) => ({ ...f, director: value, page: 1 }));
    }, 600);
  }

  const activeFiltersCount = [
    filters.type !== '',
    filters.genre !== '',
    filters.sort !== 'popularity.desc',
    filters.year !== '' || filters.decade !== '',
    filters.rating > 0,
    filters.cast !== '',
    filters.director !== '',
  ].filter(Boolean).length;

  const pageTitle = filters.q
    ? `Resultados para "${filters.q}"`
    : filters.type === 'tv'
    ? 'Séries populares'
    : filters.type === 'movie'
    ? 'Filmes populares'
    : 'Mais populares';

  return (
    <div className="pt-[73px] min-h-screen bg-white dark:bg-black">
      <section className="bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-black py-12 border-b border-gray-300 dark:border-white/10">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl text-gray-900 dark:text-white mb-6">{t('search.title')}</h1>

          <div className="relative max-w-3xl flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 z-10" />
              <Input
                type="text"
                placeholder={t('search.placeholder')}
                value={inputValue}
                onChange={(e) => handleInputChange(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
                className="pl-12 pr-4 py-6 text-lg bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white placeholder:text-gray-400 focus:border-red-500"
              />
              {showSuggestions && suggestions.length > 0 && (
                <div className="absolute top-full left-0 right-0 z-50 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg shadow-xl mt-1 overflow-hidden">
                  {suggestions.map((item) => {
                    const title = item.title ?? item.name ?? '';
                    const imageUrl = item.poster_path ? `${TMDB_IMAGE_BASE}${item.poster_path}` : null;
                    return (
                      <div
                        key={item.id}
                        onMouseDown={() => handleSuggestionClick(item)}
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

          {/* RF06 — Tipo */}
          <div className="flex items-center gap-2 mt-4">
            {(['', 'movie', 'tv'] as const).map((type) => (
              <button
                key={type}
                onClick={() => handleTypeChange(type)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  filters.type === type
                    ? 'bg-red-600 text-white'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
              >
                {type === '' ? 'Todos' : type === 'movie' ? 'Filmes' : 'Séries'}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-4 mt-4">
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
        <div className="flex flex-col md:flex-row gap-8">
          {showFilters && (
            <aside className="w-full md:w-80 flex-shrink-0 space-y-6">
              <div className="bg-gray-100 dark:bg-gray-900 rounded-lg p-6 border border-gray-300 dark:border-white/10 sticky top-24">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl text-gray-900 dark:text-white">{t('search.filters')}</h2>
                  {activeFiltersCount > 0 && (
                    <Badge className="bg-red-600">{activeFiltersCount} {t('search.activeFilters')}</Badge>
                  )}
                </div>

                {/* RF03 — Gênero */}
                <div className="space-y-2">
                  <label className="text-sm text-gray-600 dark:text-gray-400">{t('search.genre')}</label>
                  <Select
                    value={filters.genre || 'all'}
                    onValueChange={(v) => setFilters((f) => ({ ...f, genre: v === 'all' ? '' : v, page: 1 }))}
                  >
                    <SelectTrigger className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white">
                      <SelectValue placeholder="Todos os gêneros" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">{t('search.allGenres')}</SelectItem>
                      {genres.map((g) => (
                        <SelectItem key={g.id} value={String(g.id)}>{g.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* RF04/RF16/RF17 — Ano / Década */}
                <div className="space-y-2">
                  <label className="text-sm text-gray-600 dark:text-gray-400">{t('search.yearDecade')}</label>
                  <div className="flex rounded-md overflow-hidden border border-gray-300 dark:border-gray-600 text-xs w-full">
                    {(['year', 'decade'] as const).map((mode) => (
                      <button
                        key={mode}
                        onClick={() => {
                          setYearMode(mode);
                          setFilters((f) => ({ ...f, year: '', decade: '', page: 1 }));
                        }}
                        className={`flex-1 py-1.5 transition-colors ${
                          yearMode === mode
                            ? 'bg-red-600 text-white'
                            : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                        }`}
                      >
                        {mode === 'year' ? t('search.year') : t('search.decade')}
                      </button>
                    ))}
                  </div>
                  {yearMode === 'year' ? (
                    <Input
                      type="number"
                      placeholder={t('search.yearPlaceholder')}
                      value={filters.year}
                      onChange={(e) => setFilters((f) => ({ ...f, year: e.target.value, decade: '', page: 1 }))}
                      min="1900"
                      max="2030"
                      className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white"
                    />
                  ) : (
                    <Select
                      value={filters.decade || 'all'}
                      onValueChange={(v) => setFilters((f) => ({ ...f, decade: v === 'all' ? '' : v, year: '', page: 1 }))}
                    >
                      <SelectTrigger className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white">
                        <SelectValue placeholder={t('search.selectDecade')} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">{t('search.allDecades')}</SelectItem>
                        {DECADES.map((d) => (
                          <SelectItem key={d} value={d}>{d}s</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                </div>

                {/* RF02 — Filtro por ator/atriz */}
                <div className="space-y-2">
                  <label className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-1">
                    <User className="w-3 h-3" /> {t('search.actor')}
                  </label>
                  <Input
                    type="text"
                    placeholder={t('search.actorPlaceholder')}
                    value={castInput}
                    onChange={(e) => handleCastChange(e.target.value)}
                    className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white"
                  />
                </div>

                {/* RF14 — Filtro por diretor */}
                <div className="space-y-2">
                  <label className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-1">
                    <Clapperboard className="w-3 h-3" /> {t('search.director')}
                  </label>
                  <Input
                    type="text"
                    placeholder={t('search.directorPlaceholder')}
                    value={directorInput}
                    onChange={(e) => handleDirectorChange(e.target.value)}
                    className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white"
                  />
                </div>

                {/* RF08 — Ordenação */}
                <div className="space-y-2">
                  <label className="text-sm text-gray-600 dark:text-gray-400">{t('search.sortBy')}</label>
                  <Select
                    value={filters.sort}
                    onValueChange={(v) => setFilters((f) => ({ ...f, sort: v, page: 1 }))}
                  >
                    <SelectTrigger className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="popularity.desc">{t('search.sortPopular')}</SelectItem>
                      <SelectItem value="vote_average.desc">{t('search.sortRated')}</SelectItem>
                      <SelectItem value="release_date.desc">{t('search.sortNewest')}</SelectItem>
                      <SelectItem value="release_date.asc">{t('search.sortOldest')}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Avaliação mínima */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-sm text-gray-600 dark:text-gray-400">{t('search.minRating')}</label>
                    <div className="flex items-center gap-1 text-yellow-500">
                      <Star className="w-4 h-4 fill-current" />
                      <span className="text-gray-900 dark:text-white text-sm">{filters.rating.toFixed(1)}</span>
                    </div>
                  </div>
                  <Slider
                    value={[filters.rating]}
                    onValueChange={([v]) => setFilters((f) => ({ ...f, rating: v, page: 1 }))}
                    max={10}
                    step={0.5}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>0</span>
                    <span>10</span>
                  </div>
                </div>
              </div>
            </aside>
          )}

          <div className="flex-1">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl text-gray-900 dark:text-white">{pageTitle}</h2>
              {!isLoading && (
                <span className="text-sm text-gray-500">
                  {results.length} resultado(s) — Página {filters.page} de {totalPages}
                </span>
              )}
            </div>

            {isLoading && (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="aspect-[2/3] bg-gray-200 dark:bg-gray-800 rounded-lg animate-pulse" />
                ))}
              </div>
            )}

            {apiError && (
              <p className="text-red-500 text-center py-16">
                Não foi possível conectar ao servidor. Tente novamente.
              </p>
            )}

            {!isLoading && !apiError && results.length === 0 && (
              <div className="text-center py-16">
                <Search className="w-16 h-16 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
                <h3 className="text-xl text-gray-600 dark:text-gray-400 mb-2">{t('search.noResults')}</h3>
                <p className="text-gray-500">{t('search.noResultsDesc')}</p>
              </div>
            )}

            {!isLoading && !apiError && results.length > 0 && (
              <>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {results.map((item) => {
                    const title = item.title ?? item.name ?? 'Sem título';
                    const date = item.release_date ?? item.first_air_date ?? '';
                    const year = date ? new Date(date).getFullYear() : '—';
                    const rating = item.vote_average?.toFixed(1) ?? 'N/A';
                    const imageUrl = item.poster_path ? `${TMDB_IMAGE_BASE}${item.poster_path}` : null;
                    const genreName = getGenreName(item.genre_ids ?? []);
                    return (
                      <div
                        key={item.id}
                        onClick={() => handleResultClick(item)}
                        className="group relative bg-white dark:bg-gray-900 rounded-lg overflow-hidden border border-gray-300 dark:border-white/10 hover:border-red-500/50 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-red-500/20 cursor-pointer"
                      >
                        <div className="aspect-[2/3] overflow-hidden bg-gray-200 dark:bg-gray-800 flex items-center justify-center">
                          {imageUrl
                            ? <img src={imageUrl} alt={title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                            : <span className="text-gray-400 text-sm">Sem imagem</span>
                          }
                        </div>
                        <div className="p-3">
                          <h3 className="text-gray-900 dark:text-white text-sm mb-1 line-clamp-1 group-hover:text-red-500 transition-colors">{title}</h3>
                          <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                            <span>{year}</span>
                            <div className="flex items-center gap-1">
                              <Star className="w-3 h-3 fill-yellow-500 text-yellow-500" />
                              <span className="text-gray-900 dark:text-white">{rating}</span>
                            </div>
                          </div>
                          {genreName && (
                            <span className="inline-block mt-1 text-xs bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded px-2 py-0.5">
                              {genreName}
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* RF10 — Paginação */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-center gap-4 mt-8">
                    <Button
                      onClick={() => handlePageChange(filters.page - 1)}
                      disabled={filters.page <= 1}
                      variant="outline"
                      className="gap-2 border-gray-300 dark:border-gray-700"
                    >
                      <ChevronLeft className="w-4 h-4" />
                      {t('search.previous')}
                    </Button>
                    <span className="text-gray-600 dark:text-gray-400 text-sm">
                      {filters.page} / {totalPages}
                    </span>
                    <Button
                      onClick={() => handlePageChange(filters.page + 1)}
                      disabled={filters.page >= totalPages}
                      variant="outline"
                      className="gap-2 border-gray-300 dark:border-gray-700"
                    >
                      {t('search.next')}
                      <ChevronRight className="w-4 h-4" />
                    </Button>
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
