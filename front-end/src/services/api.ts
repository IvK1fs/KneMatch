const BASE_URL = (import.meta.env.VITE_API_URL as string) ?? "http://localhost:3001";

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

export interface AlternativeTitle {
  iso_3166_1: string;
  title: string;
  type: string;
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

export async function getDetails(id: string | number, type: MediaType = "movie"): Promise<TitleDetails> {
  return fetchAPI<TitleDetails>(`/api/details/${id}?type=${type}`);
}

export async function getTrending(type?: "movie" | "tv" | "all", page = 1): Promise<{ results: Title[] }> {
  const params = new URLSearchParams();
  if (type) params.append("type", type);
  params.append("page", String(page));
  return fetchAPI<{ results: Title[] }>(`/api/trending?${params.toString()}`);
}

export async function getUpcoming(): Promise<{ results: Title[] }> {
  return fetchAPI<{ results: Title[] }>("/api/upcoming");
}

export async function getCast(id: string | number, type: MediaType = "movie"): Promise<{ cast: CastMember[] }> {
  return fetchAPI(`/api/details/${id}/cast?type=${type}`);
}

export async function getVideos(id: string | number, type: MediaType = "movie"): Promise<{ results: Video[] }> {
  return fetchAPI(`/api/details/${id}/videos?type=${type}`);
}

export async function getProviders(id: string | number, type: MediaType = "movie"): Promise<{ results: Provider[] }> {
  return fetchAPI(`/api/details/${id}/providers?type=${type}`);
}

export async function getGenres(type: MediaType): Promise<{ genres: Genre[] }> {
  return fetchAPI<{ genres: Genre[] }>(`/api/genres?type=${type}`);
}

export interface DiscoverParams {
  q?: string;
  type?: MediaType | "";
  genre?: string;
  sort?: string;
  page?: number;
  year?: string;
  yearTo?: string;
  rating?: number;
  cast?: string;
  director?: string;
  showrunner?: string;
}

export async function discoverTitles(params: DiscoverParams): Promise<{ results: Title[]; total_pages: number }> {
  const p = new URLSearchParams();
  if (params.q) p.append("q", params.q);
  if (params.type) p.append("type", params.type);
  if (params.genre) p.append("genre", params.genre);
  if (params.sort) p.append("sort_by", params.sort);
  if (params.year) p.append("year", params.year);
  if (params.yearTo) p.append("year_to", params.yearTo);
  if (params.rating && params.rating > 0) p.append("vote_average.gte", String(params.rating));
  if (params.page) p.append("page", String(params.page));
  if (params.cast) p.append("with_cast", params.cast);
  if (params.director) p.append("with_crew", params.director);
  return fetchAPI(`/api/discover?${p.toString()}`);
}

export async function getTopTen(type: MediaType | "" = "") {
  const params = new URLSearchParams();
  if (type) params.append("type", type);
  return fetchAPI<{ results: Title[] }>(`/api/top?${params.toString()}`);
}

export async function getSimilar(id: string | number, type: MediaType = "movie") {
  return fetchAPI<{ results: Title[] }>(`/api/details/${id}/similar?type=${type}`);
}

//RF30: títulos do filme/série em outros idiomas
export async function getAlternativeTitles(id: string | number, type: MediaType = "movie") {
  return fetchAPI<{ titles?: AlternativeTitle[]; results?: AlternativeTitle[] }>(
    `/api/details/${id}/alternative-titles?type=${type}`
  );
}

export async function getPersonalRecommendations(): Promise<{ results: any[]; media_type: string }> {
  const token = localStorage.getItem("token");
  if (!token) return { results: [], media_type: "movie" };

  const response = await fetch(`${BASE_URL}/api/users/recommendations`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!response.ok) return { results: [], media_type: "movie" };
  return response.json();
}