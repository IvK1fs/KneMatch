const BASE_URL = (import.meta as any).env?.VITE_API_URL ?? "http://localhost:3001";

export type MediaType = "movie" | "tv";

export interface Title {
  id: number;
  title?: string;
  name?: string;
  poster_path: string | null;
  release_date?: string;
  first_air_date?: string;
  vote_average: number;
  genre_ids: number[];
  media_type?: MediaType;
}

export interface TitleDetails {
  id: number;
  title?: string;
  name?: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  vote_average: number;
  vote_count: number;
  popularity: number;
  genres: { id: number; name: string }[];
  release_date?: string;
  first_air_date?: string;
  runtime?: number;
  number_of_seasons?: number;
  media_type?: MediaType;
}

export interface CastMember {
  id: number;
  name: string;
  character: string;
  profile_path: string | null;
}

export interface Video {
  key: string;
  type: string;
  site: string;
}

export interface Provider {
  provider_id: number;
  provider_name: string;
  logo_path: string;
}

export interface Genre {
  id: number;
  name: string;
}

async function fetchAPI<T>(path: string): Promise<T> {
  const response = await fetch(`${BASE_URL}${path}`);
  if (!response.ok) {
    throw new Error(`Erro na requisição: ${response.status}`);
  }
  return response.json() as Promise<T>;
}

export async function searchTitles(query: string, type: MediaType | "" = "") {
  const params = new URLSearchParams({ q: query });
  if (type) params.append("type", type);
  return fetchAPI<{ results: Title[] }>(`/api/search?${params.toString()}`);
}

const USAR_MOCK = false;

const mockDetails: TitleDetails = {
  id: 550,
  title: "Fight Club",
  overview: "Um homem insatisfeito com sua vida forma um clube de luta clandestino com um vendedor de sabão carismático.",
  poster_path: "/pB8BM7pdSp6B6Ih7QZ4DrQ3PmJK.jpg",
  backdrop_path: "/hZkgoQYus5vegHoetLkCJzb17zJ.jpg",
  vote_average: 8.4,
  vote_count: 26280,
  popularity: 61.416,
  genres: [
    { id: 18, name: "Drama" },
    { id: 53, name: "Thriller" },
  ],
  release_date: "1999-10-15",
  runtime: 139,
  media_type: "movie",
};

export async function getDetails(id: string | number, type: MediaType = "movie"): Promise<TitleDetails> {
  if (USAR_MOCK) {
    await new Promise((resolve) => setTimeout(resolve, 600));
    return { ...mockDetails, id: Number(id), media_type: type };
  }
  return fetchAPI<TitleDetails>(`/api/details/${id}?type=${type}`);
}

export async function getTrending(type?: 'movie' | 'tv' | 'all', page = 1): Promise<{ results: Title[] }> {
  const params = new URLSearchParams();
  if (type) params.append('type', type);
  params.append('page', String(page));
  return fetchAPI<{ results: Title[] }>(`/api/trending?${params.toString()}`);
}

export async function getUpcoming(): Promise<{ results: Title[] }> {
  return fetchAPI<{ results: Title[] }>("/api/upcoming");
}

const USAR_MOCK_CAST = true;

const mockCast: CastMember[] = [
  { id: 1, name: "Leonardo DiCaprio", character: "Cobb", profile_path: null },
  { id: 2, name: "Joseph Gordon-Levitt", character: "Arthur", profile_path: null },
  { id: 3, name: "Elliot Page", character: "Ariadne", profile_path: null },
  { id: 4, name: "Tom Hardy", character: "Eames", profile_path: null },
  { id: 5, name: "Ken Watanabe", character: "Saito", profile_path: null },
];

export async function getCast(id: string | number, type: MediaType = "movie"): Promise<{ cast: CastMember[] }> {
  if (USAR_MOCK_CAST) {
    await new Promise((r) => setTimeout(r, 400));
    return { cast: mockCast };
  }
  return fetchAPI(`/api/details/${id}/cast?type=${type}`);
}

const USAR_MOCK_VIDEOS = true;

const mockVideos: Video[] = [
  { key: "YoHD9XEInc0", type: "Trailer", site: "YouTube" },
];

export async function getVideos(id: string | number, type: MediaType = "movie"): Promise<{ results: Video[] }> {
  if (USAR_MOCK_VIDEOS) {
    await new Promise((r) => setTimeout(r, 400));
    return { results: mockVideos };
  }
  return fetchAPI(`/api/details/${id}/videos?type=${type}`);
}

const USAR_MOCK_PROVIDERS = true;

export async function getProviders(id: string | number, type: MediaType = "movie"): Promise<{ results: Provider[] }> {
  if (USAR_MOCK_PROVIDERS) {
    await new Promise((r) => setTimeout(r, 400));
    return {
      results: [
        { provider_id: 8, provider_name: "Netflix", logo_path: "/t2yyOv40HZeVlLjYsCsPHnWLk4W.jpg" },
        { provider_id: 119, provider_name: "Amazon Prime", logo_path: "/68MNrwlkpF7WnmNPXLah69CR5cb.jpg" },
      ],
    };
  }
  return fetchAPI(`/api/details/${id}/providers?type=${type}`);
}

export async function getGenres(type: MediaType): Promise<{ genres: Genre[] }> {
  return fetchAPI<{ genres: Genre[] }>(`/api/genres?type=${type}`);
}

export interface DiscoverParams {
  q?: string;
  type?: MediaType | '';
  genre?: string;
  sort?: string;
  page?: number;
  year?: string;
  rating?: number;
}

export async function discoverTitles(params: DiscoverParams): Promise<{ results: Title[]; total_pages: number }> {
  const p = new URLSearchParams();
  if (params.q) p.append('q', params.q);
  if (params.type) p.append('type', params.type);
  if (params.genre) p.append('genre', params.genre);
  if (params.sort) p.append('sort_by', params.sort);
  if (params.year) p.append('year', params.year);
  if (params.rating && params.rating > 0) p.append('vote_average.gte', String(params.rating));
  if (params.page) p.append('page', String(params.page));
  return fetchAPI(`/api/discover?${p.toString()}`);
}

export async function getTopTen(type: MediaType | "" = "") {
  const params = new URLSearchParams();
  if (type) params.append("type", type);
  const query = params.toString() ? `?${params.toString()}` : "";
  return fetchAPI<{ results: Title[] }>(`/api/top10${query}`);
}

export async function getSimilar(id: string | number, type: MediaType = "movie") {
  return fetchAPI<{ results: Title[] }>(`/api/similar/${id}?type=${type}`);
}
