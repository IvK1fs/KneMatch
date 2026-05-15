// src/app/pages/UpcomingPage.tsx  –  CineMatch  |  Sprint 1  |  RF27
// Conectada a getUpcoming() do src/services/api.ts
// Sem dados hardcoded — tudo vem do mock (ou do back quando USAR_MOCK = false)

import { useState, useEffect } from "react";
import { getUpcoming, type UpcomingMovie } from "../../services/api";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatarData(iso: string): string {
  const date = new Date(iso + "T00:00:00");
  return date.toLocaleDateString("pt-BR", {
    day: "2-digit", month: "long", year: "numeric",
  });
}

function diasAte(iso: string): number {
  const lancamento = new Date(iso + "T00:00:00");
  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);
  return Math.ceil((lancamento.getTime() - hoje.getTime()) / (1000 * 60 * 60 * 24));
}

function BadgeContagem({ releaseDate }: { releaseDate: string }) {
  const dias = diasAte(releaseDate);
  if (dias < 0)  return <span style={badgeStyle("#BDD7EE", "#1F4E79")}>Lançado</span>;
  if (dias === 0) return <span style={badgeStyle("#4472C4", "#fff")}>Hoje!</span>;
  return <span style={badgeStyle("#EBF3FB", "#4472C4")}>em {dias} dia{dias !== 1 ? "s" : ""}</span>;
}

function badgeStyle(bg: string, color: string): React.CSSProperties {
  return { background: bg, color, borderRadius: 20, padding: "3px 12px", fontSize: 12, fontWeight: 700, whiteSpace: "nowrap" };
}

function Spinner() {
  return (
    <div style={{ display: "flex", justifyContent: "center", padding: "48px 0" }}>
      <div style={{ width: 40, height: 40, border: "3px solid #BDD7EE", borderTopColor: "#4472C4", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

// ─── Card ─────────────────────────────────────────────────────────────────────

function UpcomingCard({ movie }: { movie: UpcomingMovie }) {
  return (
    <div style={{ display: "flex", gap: 16, background: "#fff", borderRadius: 10, boxShadow: "0 2px 8px rgba(68,114,196,0.10)", padding: 16, alignItems: "flex-start" }}>
      <img
        src={movie.posterUrl}
        alt={movie.title}
        style={{ width: 90, height: 135, objectFit: "cover", borderRadius: 6, flexShrink: 0 }}
        onError={(e) => { (e.currentTarget as HTMLImageElement).src = `https://placehold.co/90x135/BDD7EE/1F4E79?text=${encodeURIComponent(movie.title)}`; }}
      />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap", marginBottom: 4 }}>
          <h3 style={{ margin: 0, fontSize: 15, fontWeight: 800, color: "#1F4E79" }}>{movie.title}</h3>
          <BadgeContagem releaseDate={movie.releaseDate} />
        </div>
        <p style={{ margin: "0 0 8px", fontSize: 12, color: "#888" }}>
          🗓️ {formatarData(movie.releaseDate)} · {movie.genre.join(", ")}
        </p>
        <p style={{ margin: 0, fontSize: 13, color: "#444", display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
          {movie.synopsis}
        </p>
      </div>
    </div>
  );
}

// ─── Página principal ─────────────────────────────────────────────────────────

export default function UpcomingPage() {
  const [filmes,   setFilmes]   = useState<UpcomingMovie[]>([]);
  const [loading,  setLoading]  = useState(true);
  const [erro,     setErro]     = useState(false);
  const [ordenar,  setOrdenar]  = useState<"data" | "titulo">("data");

  // ── Busca os dados ao montar o componente ──
  useEffect(() => {
    async function carregar() {
      setLoading(true);
      setErro(false);
      try {
        const data = await getUpcoming(); // ← vem do src/services/api.ts
        setFilmes(data);
      } catch (err) {
        console.error("[UpcomingPage] getUpcoming falhou:", err);
        setErro(true);
      } finally {
        setLoading(false);
      }
    }
    carregar();
  }, []);

  const ordenados = [...filmes].sort((a, b) =>
    ordenar === "data"
      ? a.releaseDate.localeCompare(b.releaseDate)
      : a.title.localeCompare(b.title)
  );

  return (
    <div style={{ minHeight: "100vh", background: "#F0F4FA", fontFamily: "Segoe UI, sans-serif" }}>

      {/* Header */}
      <header style={{ background: "#1F4E79", color: "#fff", padding: "0 24px", height: 60, display: "flex", alignItems: "center", boxShadow: "0 2px 8px rgba(0,0,0,0.2)", position: "sticky", top: 0, zIndex: 100 }}>
        <h1 style={{ margin: 0, fontSize: 22, fontWeight: 800 }}>🎬 CineMatch</h1>
      </header>

      <main style={{ maxWidth: 860, margin: "0 auto", padding: "24px 16px" }}>

        {/* Título */}
        <div style={{ marginBottom: 24 }}>
          <h2 style={{ margin: 0, fontSize: 24, fontWeight: 800, color: "#1F4E79" }}>🗓️ Lançamentos Futuros</h2>
          <p style={{ margin: "4px 0 0", fontSize: 14, color: "#666" }}>Filmes confirmados para os próximos meses</p>
        </div>

        {/* Ordenação */}
        <div style={{ display: "flex", gap: 8, marginBottom: 20, alignItems: "center" }}>
          <span style={{ fontSize: 13, color: "#666" }}>Ordenar por:</span>
          {(["data", "titulo"] as const).map((op) => (
            <button
              key={op}
              onClick={() => setOrdenar(op)}
              style={{ padding: "6px 16px", borderRadius: 6, cursor: "pointer", border: "2px solid #4472C4", fontSize: 12, fontWeight: 700, background: ordenar === op ? "#4472C4" : "transparent", color: ordenar === op ? "#fff" : "#4472C4" }}
            >
              {op === "data" ? "Data" : "Título"}
            </button>
          ))}
        </div>

        {/* Conteúdo */}
        {loading && <Spinner />}

        {erro && (
          <div style={{ background: "#FFF3CD", border: "1px solid #FFCA2C", borderRadius: 8, padding: "12px 16px", display: "flex", alignItems: "center", gap: 12 }}>
            <span>⚠️</span>
            <span style={{ flex: 1, fontSize: 14, color: "#664D03" }}>Não foi possível carregar os lançamentos.</span>
            <button onClick={() => window.location.reload()} style={{ background: "#4472C4", color: "#fff", border: "none", borderRadius: 6, padding: "6px 14px", cursor: "pointer", fontSize: 13 }}>
              Tentar novamente
            </button>
          </div>
        )}

        {!loading && !erro && (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {ordenados.map((m) => <UpcomingCard key={m.id} movie={m} />)}
            {ordenados.length === 0 && (
              <p style={{ textAlign: "center", color: "#888", paddingTop: 32 }}>Nenhum lançamento encontrado.</p>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
