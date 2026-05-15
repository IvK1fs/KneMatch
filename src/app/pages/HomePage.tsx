// HomePage.tsx  –  CineMatch  |  Sprint 1
// Conectada ao api.ts com flag USE_MOCK (trocar para false quando o back subir)

import { useState, useEffect } from "react";
import {
  fetchMovies,
  fetchTop10,
  fetchFilteredMovies,
  searchMovies,
  type Movie,
} from "./api";

// ─── Sub-componentes locais (inline para facilitar o protótipo) ───────────────

function Spinner() {
  return (
    <div style={{ display: "flex", justifyContent: "center", padding: "48px 0" }}>
      <div
        style={{
          width: 40, height: 40,
          border: "3px solid #BDD7EE",
          borderTopColor: "#4472C4",
          borderRadius: "50%",
          animation: "spin 0.8s linear infinite",
        }}
      />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

function ErrorBanner({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <div style={{
      background: "#FFF3CD", border: "1px solid #FFCA2C",
      borderRadius: 8, padding: "12px 16px",
      display: "flex", alignItems: "center", gap: 12, margin: "16px 0",
    }}>
      <span>⚠️</span>
      <span style={{ flex: 1, fontSize: 14, color: "#664D03" }}>{message}</span>
      <button
        onClick={onRetry}
        style={{
          background: "#4472C4", color: "#fff",
          border: "none", borderRadius: 6, padding: "6px 14px",
          cursor: "pointer", fontSize: 13,
        }}
      >
        Tentar novamente
      </button>
    </div>
  );
}

function MovieCard({ movie }: { movie: Movie }) {
  return (
    <div style={{
      background: "#fff", borderRadius: 10,
      boxShadow: "0 2px 8px rgba(68,114,196,0.12)",
      overflow: "hidden", transition: "transform 0.18s",
    }}
      onMouseEnter={(e) => ((e.currentTarget as HTMLDivElement).style.transform = "translateY(-4px)")}
      onMouseLeave={(e) => ((e.currentTarget as HTMLDivElement).style.transform = "")}
    >
      <img
        src={movie.posterUrl}
        alt={movie.title}
        style={{ width: "100%", aspectRatio: "2/3", objectFit: "cover", display: "block" }}
        onError={(e) => {
          (e.currentTarget as HTMLImageElement).src =
            `https://placehold.co/200x300/BDD7EE/1F4E79?text=${encodeURIComponent(movie.title)}`;
        }}
      />
      <div style={{ padding: "12px 14px" }}>
        <h3 style={{ margin: 0, fontSize: 14, fontWeight: 700, color: "#1F4E79",
                     whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
          {movie.title}
        </h3>
        <p style={{ margin: "4px 0 0", fontSize: 12, color: "#555" }}>
          {movie.year} · {movie.genre.slice(0, 2).join(", ")}
        </p>
        <div style={{ marginTop: 8, display: "flex", alignItems: "center", gap: 6 }}>
          <span style={{
            background: "#4472C4", color: "#fff",
            borderRadius: 4, padding: "2px 8px", fontSize: 12, fontWeight: 700,
          }}>
            ★ {movie.rating.toFixed(1)}
          </span>
          <span style={{ fontSize: 11, color: "#888" }}>{movie.language}</span>
        </div>
      </div>
    </div>
  );
}

// ─── Componente principal ─────────────────────────────────────────────────────

export default function HomePage() {
  const [allMovies,  setAllMovies]  = useState<Movie[]>([]);
  const [top10,      setTop10]      = useState<Movie[]>([]);
  const [displayed,  setDisplayed]  = useState<Movie[]>([]);
  const [loading,    setLoading]    = useState(true);
  const [error,      setError]      = useState<string | null>(null);
  const [query,      setQuery]      = useState("");
  const [darkMode,   setDarkMode]   = useState(false);
  const [language,   setLanguage]   = useState<"pt" | "en">("pt");
  const [filters,    setFilters]    = useState({
    genre: "", minRating: 0, language: "", year: 0,
  });
  const [activeTab, setActiveTab]   = useState<"todos" | "top10">("todos");

  const i18n = {
    pt: {
      search: "Buscar filmes por título…",
      todos: "Todos os Filmes",
      top10: "Top 10",
      upcoming: "Lançamentos",
      filter: "Filtrar",
      genre: "Gênero",
      minRating: "Nota mínima",
      year: "Ano",
      lang: "Idioma",
      results: (n: number) => `${n} resultado${n !== 1 ? "s" : ""}`,
      errorMsg: "Não foi possível carregar os filmes.",
    },
    en: {
      search: "Search movies by title…",
      todos: "All Movies",
      top10: "Top 10",
      upcoming: "Upcoming",
      filter: "Filter",
      genre: "Genre",
      minRating: "Min rating",
      year: "Year",
      lang: "Language",
      results: (n: number) => `${n} result${n !== 1 ? "s" : ""}`,
      errorMsg: "Could not load movies.",
    },
  }[language];

  // ── Carrega dados iniciais ──
  async function loadData() {
    setLoading(true);
    setError(null);
    try {
      const [movies, ranking] = await Promise.all([fetchMovies(), fetchTop10()]);
      setAllMovies(movies);
      setTop10(ranking);
      setDisplayed(movies);
    } catch (err) {
      setError(i18n.errorMsg);
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { loadData(); }, []);  // eslint-disable-line react-hooks/exhaustive-deps

  // ── Busca por título (com debounce simples) ──
  useEffect(() => {
    if (!query.trim()) {
      setDisplayed(activeTab === "top10" ? top10 : allMovies);
      return;
    }
    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const results = await searchMovies(query);
        setDisplayed(results);
      } catch {
        setError(i18n.errorMsg);
      } finally {
        setLoading(false);
      }
    }, 350);
    return () => clearTimeout(timer);
  }, [query]);  // eslint-disable-line react-hooks/exhaustive-deps

  // ── Troca de aba ──
  useEffect(() => {
    if (!query.trim()) {
      setDisplayed(activeTab === "top10" ? top10 : allMovies);
    }
  }, [activeTab, allMovies, top10]);  // eslint-disable-line react-hooks/exhaustive-deps

  // ── Aplica filtros ──
  async function handleApplyFilters() {
    setLoading(true);
    setError(null);
    try {
      const active = Object.fromEntries(
        Object.entries(filters).filter(([, v]) => v !== "" && v !== 0)
      );
      const results = await fetchFilteredMovies(active as Parameters<typeof fetchFilteredMovies>[0]);
      setDisplayed(results);
    } catch {
      setError(i18n.errorMsg);
    } finally {
      setLoading(false);
    }
  }

  function handleResetFilters() {
    setFilters({ genre: "", minRating: 0, language: "", year: 0 });
    setDisplayed(activeTab === "top10" ? top10 : allMovies);
    setQuery("");
  }

  // ── Estilos base ──
  const bg    = darkMode ? "#0D1117" : "#F0F4FA";
  const card  = darkMode ? "#161B22" : "#FFFFFF";
  const text  = darkMode ? "#E6EDF3" : "#1F4E79";
  const muted = darkMode ? "#8B949E" : "#555";

  return (
    <div style={{ minHeight: "100vh", background: bg, fontFamily: "Segoe UI, sans-serif",
                  color: text, transition: "background 0.3s" }}>

      {/* ── Header ── */}
      <header style={{
        background: darkMode ? "#161B22" : "#1F4E79",
        color: "#fff", padding: "0 24px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        height: 60, boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
        position: "sticky", top: 0, zIndex: 100,
      }}>
        <h1 style={{ margin: 0, fontSize: 22, fontWeight: 800, letterSpacing: 1 }}>
          🎬 CineMatch
        </h1>
        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
          {/* Trocar idioma */}
          <button
            onClick={() => setLanguage(language === "pt" ? "en" : "pt")}
            style={{
              background: "rgba(255,255,255,0.15)", color: "#fff",
              border: "1px solid rgba(255,255,255,0.3)", borderRadius: 6,
              padding: "4px 12px", cursor: "pointer", fontSize: 13,
            }}
          >
            {language === "pt" ? "🇧🇷 PT" : "🇺🇸 EN"}
          </button>
          {/* Dark mode */}
          <button
            onClick={() => setDarkMode(!darkMode)}
            title="Alternar Dark Mode"
            style={{
              background: "rgba(255,255,255,0.15)", color: "#fff",
              border: "1px solid rgba(255,255,255,0.3)", borderRadius: 6,
              padding: "4px 12px", cursor: "pointer", fontSize: 16,
            }}
          >
            {darkMode ? "☀️" : "🌙"}
          </button>
        </div>
      </header>

      <main style={{ maxWidth: 1280, margin: "0 auto", padding: "24px 16px" }}>

        {/* ── Search bar ── */}
        <input
          type="text"
          placeholder={i18n.search}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          style={{
            width: "100%", boxSizing: "border-box",
            padding: "12px 16px", fontSize: 15,
            border: "2px solid #4472C4", borderRadius: 8,
            background: card, color: text, outline: "none",
            marginBottom: 20,
          }}
        />

        {/* ── Abas ── */}
        <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
          {(["todos", "top10"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                padding: "8px 20px", borderRadius: 6, cursor: "pointer",
                border: "2px solid #4472C4", fontWeight: 700, fontSize: 13,
                background: activeTab === tab ? "#4472C4" : "transparent",
                color: activeTab === tab ? "#fff" : "#4472C4",
              }}
            >
              {tab === "todos" ? i18n.todos : i18n.top10}
            </button>
          ))}
        </div>

        {/* ── Filtros ── */}
        <details style={{ marginBottom: 20 }}>
          <summary style={{
            cursor: "pointer", fontWeight: 700, fontSize: 14,
            color: "#4472C4", userSelect: "none",
          }}>
            🔍 {i18n.filter}
          </summary>
          <div style={{
            display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))",
            gap: 12, padding: "14px 0",
          }}>
            <div>
              <label style={{ fontSize: 12, color: muted }}>{i18n.genre}</label>
              <select
                value={filters.genre}
                onChange={(e) => setFilters({ ...filters, genre: e.target.value })}
                style={{ width: "100%", padding: "8px", borderRadius: 6,
                         border: "1px solid #4472C4", background: card, color: text }}
              >
                <option value="">Todos</option>
                {["Ação", "Drama", "Ficção Científica", "Crime", "Thriller", "Comédia"]
                  .map((g) => <option key={g} value={g}>{g}</option>)}
              </select>
            </div>
            <div>
              <label style={{ fontSize: 12, color: muted }}>
                {i18n.minRating}: {filters.minRating || "—"}
              </label>
              <input
                type="range" min={0} max={10} step={0.5}
                value={filters.minRating}
                onChange={(e) => setFilters({ ...filters, minRating: Number(e.target.value) })}
                style={{ width: "100%" }}
              />
            </div>
            <div>
              <label style={{ fontSize: 12, color: muted }}>{i18n.year}</label>
              <input
                type="number" placeholder="2023"
                value={filters.year || ""}
                onChange={(e) => setFilters({ ...filters, year: Number(e.target.value) })}
                style={{ width: "100%", padding: "8px", borderRadius: 6,
                         border: "1px solid #4472C4", background: card, color: text }}
              />
            </div>
            <div>
              <label style={{ fontSize: 12, color: muted }}>{i18n.lang}</label>
              <select
                value={filters.language}
                onChange={(e) => setFilters({ ...filters, language: e.target.value })}
                style={{ width: "100%", padding: "8px", borderRadius: 6,
                         border: "1px solid #4472C4", background: card, color: text }}
              >
                <option value="">Todos</option>
                <option value="pt-BR">Português</option>
                <option value="en-US">Inglês</option>
                <option value="ko">Coreano</option>
              </select>
            </div>
            <div style={{ display: "flex", alignItems: "flex-end", gap: 8 }}>
              <button
                onClick={handleApplyFilters}
                style={{
                  flex: 1, padding: "9px", borderRadius: 6, border: "none",
                  background: "#4472C4", color: "#fff", fontWeight: 700,
                  cursor: "pointer", fontSize: 13,
                }}
              >
                Aplicar
              </button>
              <button
                onClick={handleResetFilters}
                style={{
                  padding: "9px 14px", borderRadius: 6,
                  border: "1px solid #4472C4", background: "transparent",
                  color: "#4472C4", cursor: "pointer", fontSize: 13,
                }}
              >
                ↺
              </button>
            </div>
          </div>
        </details>

        {/* ── Resultados ── */}
        {error && <ErrorBanner message={error} onRetry={loadData} />}
        {!error && !loading && (
          <p style={{ fontSize: 13, color: muted, marginBottom: 16 }}>
            {i18n.results(displayed.length)}
          </p>
        )}
        {loading ? (
          <Spinner />
        ) : (
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))",
            gap: 20,
          }}>
            {displayed.map((m) => (
              <MovieCard key={m.id} movie={m} />
            ))}
            {displayed.length === 0 && (
              <p style={{ color: muted, gridColumn: "1/-1", textAlign: "center", paddingTop: 32 }}>
                Nenhum filme encontrado.
              </p>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
