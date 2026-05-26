import { useState, useEffect, useRef } from "react";
import { getTrending, type Title } from "../../services/api";
import { ChevronLeft, ChevronRight, Star, Plus } from "lucide-react";
import { Button } from "./ui/button";

const TMDB_IMAGE_BASE = "https://image.tmdb.org/t/p/w300";

function getPosterUrl(item: Title) {
  if (item.poster_path) return `${TMDB_IMAGE_BASE}${item.poster_path}`;
  const title = item.title ?? item.name ?? "";
  return `https://placehold.co/300x450/1a1a1a/ffffff?text=${encodeURIComponent(title)}`;
}

export default function TrendingSection() {
  const [items, setItems] = useState<Title[]>([]);
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    getTrending()
      .then((data) => setItems(data.results))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  function scroll(dir: "left" | "right") {
    scrollRef.current?.scrollBy({ left: dir === "left" ? -480 : 480, behavior: "smooth" });
  }

  return (
    <section className="py-8">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl md:text-3xl text-gray-900 dark:text-white">Popular</h2>
          <div className="hidden md:flex gap-2">
            <Button variant="ghost" size="icon" onClick={() => scroll("left")} className="text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-white/10">
              <ChevronLeft className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="icon" onClick={() => scroll("right")} className="text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-white/10">
              <ChevronRight className="w-5 h-5" />
            </Button>
          </div>
        </div>

        <div
          ref={scrollRef}
          className="flex gap-4 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {loading
            ? Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="flex-none w-44 sm:w-48 md:w-56 aspect-[2/3] rounded-lg bg-gray-200 dark:bg-gray-800 animate-pulse" />
              ))
            : items.map((item) => {
                const title = item.title ?? item.name ?? "Sem título";
                const year = (item.release_date ?? item.first_air_date ?? "").slice(0, 4);
                const type = item.media_type ?? (item.title ? "movie" : "tv");

                return (
                  <div
                    key={item.id}
                    onClick={() => { window.location.href = `/details/${item.id}?type=${type}`; }}
                    className="flex-none w-44 sm:w-48 md:w-56 group relative overflow-hidden rounded-lg transition-transform hover:scale-105 cursor-pointer shadow-md dark:shadow-none"
                  >
                    <div className="aspect-[2/3] overflow-hidden bg-gray-200 dark:bg-gray-800">
                      <img
                        src={getPosterUrl(item)}
                        alt={title}
                        className="w-full h-full object-cover transition-transform group-hover:scale-110"
                        onError={(e) => {
                          (e.currentTarget as HTMLImageElement).src =
                            `https://placehold.co/300x450/1a1a1a/ffffff?text=${encodeURIComponent(title)}`;
                        }}
                      />
                    </div>

                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-3">
                      <h3 className="text-white text-sm mb-1 line-clamp-2">{title}</h3>
                      <div className="flex items-center gap-1 text-xs text-gray-300 mb-2">
                        <Star className="w-3 h-3 fill-yellow-500 text-yellow-500" />
                        <span>{item.vote_average.toFixed(1)}</span>
                        {year && <><span>•</span><span>{year}</span></>}
                      </div>
                      <Button size="sm" className="w-full bg-white text-black hover:bg-gray-200 gap-1 text-xs h-7">
                        <Plus className="w-3 h-3" />
                        Adicionar
                      </Button>
                    </div>

                    <div className="absolute top-2 right-2 bg-white/90 dark:bg-black/80 backdrop-blur-sm px-2 py-1 rounded flex items-center gap-1 text-xs">
                      <Star className="w-3 h-3 fill-yellow-500 text-yellow-500" />
                      <span className="text-gray-900 dark:text-white">{item.vote_average.toFixed(1)}</span>
                    </div>
                  </div>
                );
              })}
        </div>
      </div>
    </section>
  );
}
