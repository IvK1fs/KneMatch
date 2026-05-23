const BASE_URL = (import.meta as any).env?.VITE_API_URL ?? "http://localhost:3001";

// ─────────────────────────────────────────────
// TIPOS
// ─────────────────────────────────────────────

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

// ─────────────────────────────────────────────
// HELPER
// ─────────────────────────────────────────────

async function fetchAPI<T>(path: string): Promise<T> {
  const response = await fetch(`${BASE_URL}${path}`);
  if (!response.ok) {
    throw new Error(`Erro na requisição: ${response.status}`);
  }
  return response.json() as Promise<T>;
}

// ─────────────────────────────────────────────
// RF01 — Busca por título (Pollyana usa)
// ─────────────────────────────────────────────

export async function searchTitles(query: string, type: MediaType | "" = "") {
  const params = new URLSearchParams({ q: query });
  if (type) params.append("type", type);
  return fetchAPI<{ results: Title[] }>(`/api/search?${params.toString()}`);
}

// ─────────────────────────────────────────────
// RF12 — Detalhes de um título (Lucas usa)
// ─────────────────────────────────────────────

const USAR_MOCK_TRENDING = false;
const USAR_MOCK_UPCOMING = false;

const mockDetails: TitleDetails = {
  id: 550,
  title: "Fight Club",
  overview:
    "Um homem insatisfeito com sua vida forma um clube de luta clandestino com um vendedor de sabão carismático.",
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

export async function getDetails(
  id: string | number,
  type: MediaType = "movie"
): Promise<TitleDetails> {
  if (USAR_MOCK_TRENDING) {
    await new Promise((resolve) => setTimeout(resolve, 600));
    return { ...mockDetails, id: Number(id), media_type: type };
  }
  return fetchAPI<TitleDetails>(`/api/details/${id}?type=${type}`);
}

// ─────────────────────────────────────────────
// RF26 — Trending (Nelson usa)
// ─────────────────────────────────────────────

export async function getTrending() {
  if (USAR_MOCK_TRENDING) {
    await new Promise((resolve) => setTimeout(resolve, 600));
    return { results: [] };
  }
  return fetchAPI<{ results: Title[] }>("/api/trending");
}

// ─────────────────────────────────────────────
// RF27 — Upcoming (Nelson usa)
// ─────────────────────────────────────────────

export async function getUpcoming() {
  if (USAR_MOCK_UPCOMING) {
    await new Promise((resolve) => setTimeout(resolve, 600));
    return { results: [] };
  }
  return fetchAPI<{ results: Title[] }>("/api/upcoming");
}

// ─────────────────────────────────────────────
// RF28 — Top 10 (Nelson usa)
// ─────────────────────────────────────────────

export async function getTopTen(type: MediaType | "" = "") {
  const params = new URLSearchParams();
  if (type) params.append("type", type);
  const query = params.toString() ? `?${params.toString()}` : "";
  return fetchAPI<{ results: Title[] }>(`/api/top10${query}`);
}

// ─────────────────────────────────────────────
// RF21 — Títulos similares (Nelson usa na DetailsPage)
// Avisar Lucas antes de mexer na DetailsPage
// ─────────────────────────────────────────────

export async function getSimilar(id: string | number, type: MediaType = "movie") {
  return fetchAPI<{ results: Title[] }>(`/api/similar/${id}?type=${type}`);
}
