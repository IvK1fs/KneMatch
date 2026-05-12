import { Filter, SlidersHorizontal } from 'lucide-react';
import { Button } from './ui/button';
import { Tabs, TabsList, TabsTrigger } from './ui/tabs';

export function FilterBar() {
  return (
    <div className="bg-gray-900/50 border-y border-white/10 py-4 sticky top-[73px] z-40 backdrop-blur-sm">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          {/* Type Filter */}
          <Tabs defaultValue="all" className="w-full md:w-auto">
            <TabsList className="bg-black/50 border border-white/10">
              <TabsTrigger value="all" className="data-[state=active]:bg-blue-600">
                Todos
              </TabsTrigger>
              <TabsTrigger value="movies" className="data-[state=active]:bg-blue-600">
                Filmes
              </TabsTrigger>
              <TabsTrigger value="series" className="data-[state=active]:bg-blue-600">
                Séries
              </TabsTrigger>
            </TabsList>
          </Tabs>

          {/* Date Range */}
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm" className="border-white/20 text-white hover:bg-white/10">
              Esta Semana
            </Button>
            <Button variant="outline" size="sm" className="border-white/20 text-white hover:bg-white/10">
              Este Mês
            </Button>
            <Button variant="outline" size="sm" className="border-white/20 text-white hover:bg-white/10">
              Próximos 3 Meses
            </Button>
          </div>

          {/* More Filters */}
          <Button variant="outline" size="sm" className="border-white/20 text-white hover:bg-white/10 gap-2">
            <SlidersHorizontal className="w-4 h-4" />
            Mais Filtros
          </Button>
        </div>
      </div>
    </div>
  );
}
