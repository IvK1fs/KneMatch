// TrendingSection.tsx  –  CineMatch  |  Sprint 1  |  RF26
//
// Seção de Trending da Semana para a HomePage.
// Conectada a getTrending() de src/services/api.ts
//
// Uso na HomePage:
//   import TrendingSection from "../components/TrendingSection";
//   <TrendingSection darkMode={darkMode} />

import { useState, useEffect, useRef } from "react";
import { getTrending, type Title } from "../../services/api";

const TMDB_IMAGE_BASE = "https://image.tmdb.org/t/p/w300";

// ─── Utilitários ──────────────────────────────────────────────────────────────

function RankBadge({ rank }: { rank: number }) {
  const top3Colors: Record<number, { bg: string; color: string }> = {
    1: { bg: "#FFD700", color: "#1a1a1a" },
    2: { bg: "#C0C0C0", color: "#1a1a1a" },
    3: { bg: "#CD7F32", color: "#fff" },
  };
  const style = top3Colors[rank] ?? { bg: "#4472C4", color: "#fff" };

  return (
    <div style={{
      position: "absolute", top: 8, left: 8,
      width: 30, height: 30, borderRadius: "50%",
      background: style.bg, color: style.color,
      display: "flex", alignItems: "center", justifyContent: "center",
      fontWeight: 900, fontSize: rank <= 3 ? 13 : 12,
      boxShadow: "0 2px 6px rgba(0,0,0,0.4)",
      zIndex: 2,
    }}>
      {rank}
    </div>
  );
}

function Spinner() {
  return (
    <div style={{ display: "flex", justifyContent: "center", padding: "40px 0" }}>
      <div style={{
        width: 36, height: 36,
        border: "3px solid #BDD7EE",
        borderTopColor: "#4472C4",
        borderRadius: "50%",
        animation: "spin 0.8s linear infinite",
      }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

// ─── Card de trending ─────────────────────────────────────────────────────────

function TrendingCard({
  item,
  rank,
  darkMode,
}: {
  item: Title;
  rank: number;
  darkMode: boolean;
}) {
  const cardBg   = darkMode ? "#1C2333" : "#FFFFFF";
  const textMain = darkMode ? "#E6EDF3" : "#1F4E79";
  const textSub  = darkMode ? "#8B949E" : "#666";

  const title = item.title ?? item.name ?? "Sem título";
  const year  = (item.release_date ?? item.first_air_date ?? "").slice(0, 4);
  const poster = item.poster_path
    ? `${TMDB_IMAGE_BASE}${item.poster_path}`
    : `https://placehold.co/160x240/BDD7EE/1F4E79?text=${encodeURIComponent(title)}`;

  return (
    <div
      style={{
        flex: "0 0 160px",
        background: cardBg,
        borderRadius: 10,
        overflow: "hidden",
        position: "relative",
        boxShadow: "0 2px 10px rgba(0,0,0,0.15)",
        transition: "transform 0.2s, box-shadow 0.2s",
        cursor: "pointer",
      }}
      onMouseEnter={(e) => {
        const el = e.currentTarget as HTMLDivElement;
        el.style.transform = "translateY(-5px) scale(1.02)";
        el.style.boxShadow = "0 8px 24px rgba(68,114,196,0.3)";
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget as HTMLDivElement;
        el.style.transform = "";
        el.style.boxShadow = "0 2px 10px rgba(0,0,0,0.15)";
      }}
    >
      {/* Poster */}
      <div style={{ position: "relative" }}>
        <img
          src={poster}
          alt={title}
          style={{
            width: "100%", aspectRatio: "2/3",
            objectFit: "cover", display: "block",
          }}
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).src =
              `https://placehold.co/160x240/BDD7EE/1F4E79?text=${encodeURIComponent(title)}`;
          }}
        />
        <RankBadge rank={rank} />

        {/* Gradiente inferior */}
        <div style={{
          position: "absolute", bottom: 0, left: 0, right: 0, height: 60,
          background: "linear-gradient(to top, rgba(0,0,0,0.7), transparent)",
        }}>
          <span style={{
            position: "absolute", bottom: 6, right: 8,
            background: "rgba(68,114,196,0.9)", color: "#fff",
            borderRadius: 4, padding: "2px 7px", fontSize: 12, fontWeight: 700,
          }}>
            ★ {item.vote_average.toFixed(1)}
          </span>
        </div>
      </div>

      {/* Info */}
      <div style={{ padding: "10px 12px 12px" }}>
        <h4 style={{
          margin: 0, fontSize: 13, fontWeight: 700, color: textMain,
          whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
        }}>
          {title}
        </h4>
        <p style={{ margin: "3px 0 0", fontSize: 11, color: textSub }}>
          {year}
        </p>
      </div>
    </div>
  );
}

// ─── Componente principal ─────────────────────────────────────────────────────

interface TrendingSectionProps {
  darkMode: boolean;
}

export default function TrendingSection({ darkMode }: TrendingSectionProps) {
  const [items,   setItems]   = useState<Title[]>([]);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  async function load() {
    setLoading(true);
    setError(false);
    try {
      const data = await getTrending();
      setItems(data.results);
    } catch (err) {
      console.error("[TrendingSection] getTrending failed:", err);
      setError(true);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  function scroll(direction: "left" | "right") {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollBy({ left: direction === "left" ? -360 : 360, behavior: "smooth" });
  }

  const headingColor = darkMode ? "#E6EDF3" : "#1F4E79";
  const mutedColor   = darkMode ? "#8B949E" : "#666";
  const btnBg        = darkMode ? "#1C2333" : "#fff";
  const btnColor     = darkMode ? "#E6EDF3" : "#4472C4";

  return (
    <section style={{ marginBottom: 40 }}>

      {/* Cabeçalho */}
      <div style={{
        display: "flex", alignItems: "center",
        justifyContent: "space-between", marginBottom: 16,
      }}>
        <div>
          <h2 style={{ margin: 0, fontSize: 20, fontWeight: 800, color: headingColor }}>
            🔥 Trending da Semana
          </h2>
          <p style={{ margin: "2px 0 0", fontSize: 13, color: mutedColor }}>
            Os títulos mais assistidos nos últimos 7 dias
          </p>
        </div>

        {!loading && !error && (
          <div style={{ display: "flex", gap: 8 }}>
            {(["left", "right"] as const).map((dir) => (
              <button
                key={dir}
                onClick={() => scroll(dir)}
                aria-label={dir === "left" ? "Anterior" : "Próximo"}
                style={{
                  width: 36, height: 36, borderRadius: "50%",
                  border: `2px solid #4472C4`,
                  background: btnBg, color: btnColor,
                  cursor: "pointer", fontSize: 16,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  transition: "background 0.15s",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.background = "#4472C4";
                  (e.currentTarget as HTMLButtonElement).style.color = "#fff";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.background = btnBg;
                  (e.currentTarget as HTMLButtonElement).style.color = btnColor;
                }}
              >
                {dir === "left" ? "‹" : "›"}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Conteúdo */}
      {loading && <Spinner />}

      {error && (
        <div style={{
          background: "#FFF3CD", border: "1px solid #FFCA2C",
          borderRadius: 8, padding: "12px 16px",
          display: "flex", alignItems: "center", gap: 12,
        }}>
          <span>⚠️</span>
          <span style={{ flex: 1, fontSize: 14, color: "#664D03" }}>
            Não foi possível carregar o trending.
          </span>
          <button
            onClick={load}
            style={{
              background: "#4472C4", color: "#fff", border: "none",
              borderRadius: 6, padding: "6px 14px", cursor: "pointer", fontSize: 13,
            }}
          >
            Tentar novamente
          </button>
        </div>
      )}

      {!loading && !error && (
        <>
          <div
            ref={scrollRef}
            style={{
              display: "flex",
              gap: 16,
              overflowX: "auto",
              scrollSnapType: "x mandatory",
              paddingBottom: 12,
              scrollbarWidth: "none",
              msOverflowStyle: "none",
            }}
          >
            <style>{`.trending-scroll::-webkit-scrollbar { display: none; }`}</style>
            {items.map((item, index) => (
              <div key={item.id} style={{ scrollSnapAlign: "start" }}>
                <TrendingCard item={item} rank={index + 1} darkMode={darkMode} />
              </div>
            ))}
          </div>

          <p style={{
            margin: "8px 0 0", fontSize: 12, color: mutedColor, textAlign: "right",
          }}>
            {items.length} títulos em destaque esta semana
          </p>
        </>
      )}
    </section>
  );
}
