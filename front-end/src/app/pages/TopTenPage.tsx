import { useState } from 'react';
import { Trophy, Film, Tv, TrendingUp, Calendar } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { TopTenCard } from '../components/TopTenCard';
import { Badge } from '../components/ui/badge';

const topMovies = [
  {
    rank: 1,
    title: 'Horizonte de Fogo',
    image: 'https://images.unsplash.com/photo-1728724383030-5ac7f7a645d8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwb3B1bGFyJTIwbW92aWUlMjBibG9ja2J1c3RlcnxlbnwxfHx8fDE3NzUwNDU1MTV8MA&ixlib=rb-4.1.0&q=80&w=1080',
    genre: 'Ação',
    rating: 9.2,
    views: '2.5M',
    isNew: true,
  },
  {
    rank: 2,
    title: 'Ecos do Passado',
    image: 'https://images.unsplash.com/photo-1670035718898-c37d6996d939?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0cmVuZGluZyUyMGZpbG0lMjByZWxlYXNlfGVufDF8fHx8MTc3NTA0NTUxNXww&ixlib=rb-4.1.0&q=80&w=1080',
    genre: 'Drama',
    rating: 9.0,
    views: '2.1M',
    isNew: false,
  },
  {
    rank: 3,
    title: 'Invasão Silenciosa',
    image: 'https://images.unsplash.com/photo-1717903775083-8ad2a38483a5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0b3AlMjByYXRlZCUyMG1vdmllfGVufDF8fHx8MTc3NTA0NTUxNXww&ixlib=rb-4.1.0&q=80&w=1080',
    genre: 'Ficção Científica',
    rating: 8.9,
    views: '1.9M',
    isNew: true,
  },
  {
    rank: 4,
    title: 'A Última Testemunha',
    image: 'https://images.unsplash.com/photo-1648538836903-aa4e9ea103ac?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhd2FyZCUyMHdpbm5pbmclMjBmaWxtfGVufDF8fHx8MTc3NTA0NTUxNnww&ixlib=rb-4.1.0&q=80&w=1080',
    genre: 'Suspense',
    rating: 8.7,
    views: '1.7M',
    isNew: false,
  },
  {
    rank: 5,
    title: 'Coração Valente',
    image: 'https://images.unsplash.com/photo-1728724383030-5ac7f7a645d8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwb3B1bGFyJTIwbW92aWUlMjBibG9ja2J1c3RlcnxlbnwxfHx8fDE3NzUwNDU1MTV8MA&ixlib=rb-4.1.0&q=80&w=1080',
    genre: 'Romance',
    rating: 8.5,
    views: '1.5M',
    isNew: false,
  },
  {
    rank: 6,
    title: 'Risadas do Caos',
    image: 'https://images.unsplash.com/photo-1670035718898-c37d6996d939?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0cmVuZGluZyUyMGZpbG0lMjByZWxlYXNlfGVufDF8fHx8MTc3NTA0NTUxNXww&ixlib=rb-4.1.0&q=80&w=1080',
    genre: 'Comédia',
    rating: 8.3,
    views: '1.3M',
    isNew: false,
  },
  {
    rank: 7,
    title: 'Sombras da Noite',
    image: 'https://images.unsplash.com/photo-1717903775083-8ad2a38483a5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0b3AlMjByYXRlZCUyMG1vdmllfGVufDF8fHx8MTc3NTA0NTUxNXww&ixlib=rb-4.1.0&q=80&w=1080',
    genre: 'Terror',
    rating: 8.2,
    views: '1.2M',
    isNew: true,
  },
  {
    rank: 8,
    title: 'Jornada sem Volta',
    image: 'https://images.unsplash.com/photo-1648538836903-aa4e9ea103ac?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhd2FyZCUyMHdpbm5pbmclMjBmaWxtfGVufDF8fHx8MTc3NTA0NTUxNnww&ixlib=rb-4.1.0&q=80&w=1080',
    genre: 'Aventura',
    rating: 8.1,
    views: '1.1M',
    isNew: false,
  },
  {
    rank: 9,
    title: 'O Resgate Final',
    image: 'https://images.unsplash.com/photo-1728724383030-5ac7f7a645d8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwb3B1bGFyJTIwbW92aWUlMjBibG9ja2J1c3RlcnxlbnwxfHx8fDE3NzUwNDU1MTV8MA&ixlib=rb-4.1.0&q=80&w=1080',
    genre: 'Ação',
    rating: 8.0,
    views: '1.0M',
    isNew: false,
  },
  {
    rank: 10,
    title: 'Memórias Perdidas',
    image: 'https://images.unsplash.com/photo-1670035718898-c37d6996d939?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0cmVuZGluZyUyMGZpbG0lMjByZWxlYXNlfGVufDF8fHx8MTc3NTA0NTUxNXww&ixlib=rb-4.1.0&q=80&w=1080',
    genre: 'Mistério',
    rating: 7.9,
    views: '950K',
    isNew: false,
  },
];

const topSeries = [
  {
    rank: 1,
    title: 'Dinastia do Poder',
    image: 'https://images.unsplash.com/photo-1759446334429-bb1f2d1d9f13?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiZXN0JTIwc2VyaWVzJTIwc2hvd3xlbnwxfHx8fDE3NzUwNDU1MTZ8MA&ixlib=rb-4.1.0&q=80&w=1080',
    genre: 'Drama',
    rating: 9.4,
    views: '3.2M',
    isNew: true,
  },
  {
    rank: 2,
    title: 'Crônicas Galácticas',
    image: 'https://images.unsplash.com/photo-1717903775083-8ad2a38483a5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0b3AlMjByYXRlZCUyMG1vdmllfGVufDF8fHx8MTc3NTA0NTUxNXww&ixlib=rb-4.1.0&q=80&w=1080',
    genre: 'Ficção Científica',
    rating: 9.3,
    views: '2.8M',
    isNew: true,
  },
  {
    rank: 3,
    title: 'Conspiração Global',
    image: 'https://images.unsplash.com/photo-1648538836903-aa4e9ea103ac?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhd2FyZCUyMHdpbm5pbmclMjBmaWxtfGVufDF8fHx8MTc3NTA0NTUxNnww&ixlib=rb-4.1.0&q=80&w=1080',
    genre: 'Suspense',
    rating: 9.1,
    views: '2.5M',
    isNew: false,
  },
  {
    rank: 4,
    title: 'Amor em Tempos de Guerra',
    image: 'https://images.unsplash.com/photo-1728724383030-5ac7f7a645d8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwb3B1bGFyJTIwbW92aWUlMjBibG9ja2J1c3RlcnxlbnwxfHx8fDE3NzUwNDU1MTV8MA&ixlib=rb-4.1.0&q=80&w=1080',
    genre: 'Romance',
    rating: 9.0,
    views: '2.3M',
    isNew: false,
  },
  {
    rank: 5,
    title: 'Investigação Criminal',
    image: 'https://images.unsplash.com/photo-1670035718898-c37d6996d939?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0cmVuZGluZyUyMGZpbG0lMjByZWxlYXNlfGVufDF8fHx8MTc3NTA0NTUxNXww&ixlib=rb-4.1.0&q=80&w=1080',
    genre: 'Policial',
    rating: 8.9,
    views: '2.1M',
    isNew: false,
  },
  {
    rank: 6,
    title: 'Família Moderna',
    image: 'https://images.unsplash.com/photo-1759446334429-bb1f2d1d9f13?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiZXN0JTIwc2VyaWVzJTIwc2hvd3xlbnwxfHx8fDE3NzUwNDU1MTZ8MA&ixlib=rb-4.1.0&q=80&w=1080',
    genre: 'Comédia',
    rating: 8.7,
    views: '1.9M',
    isNew: true,
  },
  {
    rank: 7,
    title: 'O Labirinto',
    image: 'https://images.unsplash.com/photo-1717903775083-8ad2a38483a5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0b3AlMjByYXRlZCUyMG1vdmllfGVufDF8fHx8MTc3NTA0NTUxNXww&ixlib=rb-4.1.0&q=80&w=1080',
    genre: 'Mistério',
    rating: 8.6,
    views: '1.7M',
    isNew: false,
  },
  {
    rank: 8,
    title: 'Império das Sombras',
    image: 'https://images.unsplash.com/photo-1648538836903-aa4e9ea103ac?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhd2FyZCUyMHdpbm5pbmclMjBmaWxtfGVufDF8fHx8MTc3NTA0NTUxNnww&ixlib=rb-4.1.0&q=80&w=1080',
    genre: 'Fantasy',
    rating: 8.5,
    views: '1.6M',
    isNew: false,
  },
  {
    rank: 9,
    title: 'Território Hostil',
    image: 'https://images.unsplash.com/photo-1728724383030-5ac7f7a645d8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwb3B1bGFyJTIwbW92aWUlMjBibG9ja2J1c3RlcnxlbnwxfHx8fDE3NzUwNDU1MTV8MA&ixlib=rb-4.1.0&q=80&w=1080',
    genre: 'Ação',
    rating: 8.4,
    views: '1.5M',
    isNew: false,
  },
  {
    rank: 10,
    title: 'Destinos Cruzados',
    image: 'https://images.unsplash.com/photo-1670035718898-c37d6996d939?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0cmVuZGluZyUyMGZpbG0lMjByZWxlYXNlfGVufDF8fHx8MTc3NTA0NTUxNXww&ixlib=rb-4.1.0&q=80&w=1080',
    genre: 'Drama',
    rating: 8.3,
    views: '1.4M',
    isNew: true,
  },
];

export function TopTenPage() {
  const [selectedTab, setSelectedTab] = useState('movies');

  return (
    <div className="pt-[73px] min-h-screen bg-white dark:bg-black">
      {/* Hero Section */}
      <section className="relative py-16 bg-gradient-to-b from-yellow-100 dark:from-yellow-900/10 via-white dark:via-black to-white dark:to-black">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-4 mb-4">
            <div className="bg-yellow-500 text-black p-3 rounded-lg">
              <Trophy className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-5xl md:text-6xl text-gray-900 dark:text-white mb-2">Ranking</h1>
              <div className="flex items-center gap-3">
                <Badge variant="outline" className="bg-yellow-500/20 border-yellow-500 text-yellow-600 dark:text-yellow-400">
                  <Calendar className="w-3 h-3 mr-1" />
                  Esta Semana
                </Badge>
                <Badge variant="outline" className="bg-gray-200 dark:bg-white/10 border-gray-400 dark:border-white/20 text-gray-900 dark:text-white">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  Atualizado diariamente
                </Badge>
              </div>
            </div>
          </div>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl">
            Os filmes e séries mais populares da semana, baseados em visualizações,
            avaliações e engajamento da comunidade.
          </p>
        </div>
      </section>

      {/* Top 10 Lists */}
      <div className="container mx-auto px-4 py-12">
        <Tabs defaultValue="movies" value={selectedTab} onValueChange={setSelectedTab}>
          {/* Tab Switcher */}
          <div className="flex justify-center mb-12">
            <TabsList className="bg-gray-100 dark:bg-gray-900 border border-gray-300 dark:border-white/10 p-1">
              <TabsTrigger 
                value="movies" 
                className="data-[state=active]:bg-yellow-500 data-[state=active]:text-black gap-2 px-8"
              >
                <Film className="w-5 h-5" />
                Ranking Filmes
              </TabsTrigger>
              <TabsTrigger 
                value="series" 
                className="data-[state=active]:bg-yellow-500 data-[state=active]:text-black gap-2 px-8"
              >
                <Tv className="w-5 h-5" />
                Ranking Séries
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Movies List */}
          <TabsContent value="movies" className="space-y-4">
            {topMovies.map((movie) => (
              <TopTenCard
                key={movie.rank}
                rank={movie.rank}
                title={movie.title}
                image={movie.image}
                genre={movie.genre}
                rating={movie.rating}
                views={movie.views}
                isNew={movie.isNew}
              />
            ))}
          </TabsContent>

          {/* Series List */}
          <TabsContent value="series" className="space-y-4">
            {topSeries.map((series) => (
              <TopTenCard
                key={series.rank}
                rank={series.rank}
                title={series.title}
                image={series.image}
                genre={series.genre}
                rating={series.rating}
                views={series.views}
                isNew={series.isNew}
              />
            ))}
          </TabsContent>
        </Tabs>
      </div>

      {/* Stats Section */}
      <section className="border-t border-gray-300 dark:border-white/10 py-12 bg-gray-100 dark:bg-gray-900/30">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl text-yellow-500 mb-2">2.5M+</div>
              <div className="text-gray-600 dark:text-gray-400">Visualizações Totais</div>
            </div>
            <div>
              <div className="text-4xl text-yellow-500 mb-2">10</div>
              <div className="text-gray-600 dark:text-gray-400">Títulos em Destaque</div>
            </div>
            <div>
              <div className="text-4xl text-yellow-500 mb-2">Diária</div>
              <div className="text-gray-600 dark:text-gray-400">Atualização</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}