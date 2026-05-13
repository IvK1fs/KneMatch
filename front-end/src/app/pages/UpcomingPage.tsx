import { FeaturedUpcoming } from '../components/FeaturedUpcoming';
import { FilterBar } from '../components/FilterBar';
import { UpcomingCard } from '../components/UpcomingCard';
import { TimelineSection } from '../components/TimelineSection';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';

const featuredRelease = {
  title: 'Ecos do Futuro',
  image: 'https://images.unsplash.com/photo-1762356121454-877acbd554bb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx1cGNvbWluZyUyMG1vdmllJTIwcHJlbWllcmV8ZW58MXx8fHwxNzc0OTk1NDg4fDA&ixlib=rb-4.1.0&q=80&w=1080',
  releaseDate: '2026-04-15',
  description: 'Uma jornada épica através do tempo e espaço que desafia os limites da realidade. Prepare-se para uma experiência cinematográfica inesquecível.',
  genre: 'Ficção Científica',
};

const upcomingReleases = [
  {
    title: 'A Última Fronteira',
    image: 'https://images.unsplash.com/photo-1717903775083-8ad2a38483a5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxuZXclMjBmaWxtJTIwcmVsZWFzZXxlbnwxfHx8fDE3NzQ5OTU0ODh8MA&ixlib=rb-4.1.0&q=80&w=1080',
    releaseDate: '2026-04-08',
    genre: 'Ação',
    type: 'movie' as const,
    rating: 8.7,
    description: 'Um grupo de exploradores embarca em uma missão perigosa para salvar a humanidade. Ação intensa e visuais impressionantes aguardam nesta aventura épica.',
  },
  {
    title: 'Sombras da Noite',
    image: 'https://images.unsplash.com/photo-1690650553995-cc5109870e00?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxibG9ja2J1c3RlciUyMG1vdmllJTIwcG9zdGVyfGVufDF8fHx8MTc3NDk5NTQ4OXww&ixlib=rb-4.1.0&q=80&w=1080',
    releaseDate: '2026-04-22',
    genre: 'Suspense',
    type: 'series' as const,
    rating: 9.1,
    description: 'Uma série original que explora os mistérios mais sombrios da mente humana. Cada episódio traz uma nova reviravolta que vai te deixar sem fôlego.',
  },
  {
    title: 'Horizonte Perdido',
    image: 'https://images.unsplash.com/photo-1762417420551-2fec32ed3595?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaW5lbWElMjBwcmVtaWVyZSUyMGV2ZW50fGVufDF8fHx8MTc3NDk5NTQ4OXww&ixlib=rb-4.1.0&q=80&w=1080',
    releaseDate: '2026-05-01',
    genre: 'Drama',
    type: 'movie' as const,
    rating: 8.9,
    description: 'Uma história emocionante sobre amor, perda e redenção. Atuações premiadas e uma narrativa envolvente que toca o coração.',
  },
  {
    title: 'Crônicas Galácticas',
    image: 'https://images.unsplash.com/photo-1586606806753-4be049463bf6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0diUyMHNob3clMjBwcmVtaWVyZXxlbnwxfHx8fDE3NzQ5OTU0ODl8MA&ixlib=rb-4.1.0&q=80&w=1080',
    releaseDate: '2026-05-15',
    genre: 'Ficção Científica',
    type: 'series' as const,
    rating: 9.3,
    description: 'A mais ambiciosa série de ficção científica já produzida. Efeitos visuais de última geração e uma história que redefine o gênero.',
  },
  {
    title: 'Risadas e Lágrimas',
    image: 'https://images.unsplash.com/photo-1688678004647-945d5aaf91c1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb3ZpZSUyMHRoZWF0ZXIlMjBzY3JlZW58ZW58MXx8fHwxNzc0OTk1NDg5fDA&ixlib=rb-4.1.0&q=80&w=1080',
    releaseDate: '2026-06-01',
    genre: 'Comédia Dramática',
    type: 'movie' as const,
    rating: 8.4,
    description: 'Uma comédia comovente que equilibra perfeitamente humor e emoção. Uma celebração da vida e das relações humanas.',
  },
  {
    title: 'O Enigma Final',
    image: 'https://images.unsplash.com/photo-1612544409025-e1f6a56c1152?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmaWxtJTIwcHJvZHVjdGlvbiUyMHNldHxlbnwxfHx8fDE3NzQ5OTU0OTB8MA&ixlib=rb-4.1.0&q=80&w=1080',
    releaseDate: '2026-06-15',
    genre: 'Mistério',
    type: 'series' as const,
    rating: 9.0,
    description: 'Um thriller psicológico que desafia sua percepção da realidade. Prepare-se para questionar tudo que você pensava saber.',
  },
];

const aprilReleases = [
  {
    date: '2026-04-05',
    title: 'Cidade dos Sonhos',
    type: 'movie' as const,
    image: 'https://images.unsplash.com/photo-1609741199878-3e8ebdb1dbc7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxob2xseXdvb2QlMjBwcmVtaWVyZXxlbnwxfHx8fDE3NzQ5OTU0OTB8MA&ixlib=rb-4.1.0&q=80&w=1080',
  },
  {
    date: '2026-04-08',
    title: 'A Última Fronteira',
    type: 'movie' as const,
    image: 'https://images.unsplash.com/photo-1717903775083-8ad2a38483a5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxuZXclMjBmaWxtJTIwcmVsZWFzZXxlbnwxfHx8fDE3NzQ5OTU0ODh8MA&ixlib=rb-4.1.0&q=80&w=1080',
  },
  {
    date: '2026-04-15',
    title: 'Ecos do Futuro',
    type: 'movie' as const,
    image: 'https://images.unsplash.com/photo-1762356121454-877acbd554bb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx1cGNvbWluZyUyMG1vdmllJTIwcHJlbWllcmV8ZW58MXx8fHwxNzc0OTk1NDg4fDA&ixlib=rb-4.1.0&q=80&w=1080',
  },
  {
    date: '2026-04-22',
    title: 'Sombras da Noite',
    type: 'series' as const,
    image: 'https://images.unsplash.com/photo-1690650553995-cc5109870e00?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxibG9ja2J1c3RlciUyMG1vdmllJTIwcG9zdGVyfGVufDF8fHx8MTc3NDk5NTQ4OXww&ixlib=rb-4.1.0&q=80&w=1080',
  },
];

const mayReleases = [
  {
    date: '2026-05-01',
    title: 'Horizonte Perdido',
    type: 'movie' as const,
    image: 'https://images.unsplash.com/photo-1762417420551-2fec32ed3595?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaW5lbWElMjBwcmVtaWVyZSUyMGV2ZW50fGVufDF8fHx8MTc3NDk5NTQ4OXww&ixlib=rb-4.1.0&q=80&w=1080',
  },
  {
    date: '2026-05-15',
    title: 'Crônicas Galácticas',
    type: 'series' as const,
    image: 'https://images.unsplash.com/photo-1586606806753-4be049463bf6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0diUyMHNob3clMjBwcmVtaWVyZXxlbnwxfHx8fDE3NzQ5OTU0ODl8MA&ixlib=rb-4.1.0&q=80&w=1080',
  },
  {
    date: '2026-05-20',
    title: 'Aventuras Urbanas',
    type: 'movie' as const,
    image: 'https://images.unsplash.com/photo-1612544409025-e1f6a56c1152?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmaWxtJTIwcHJvZHVjdGlvbiUyMHNldHxlbnwxfHx8fDE3NzQ5OTU0OTB8MA&ixlib=rb-4.1.0&q=80&w=1080',
  },
];

export function UpcomingPage() {
  return (
    <div className="pt-[73px]">
      <FeaturedUpcoming {...featuredRelease} />

      <FilterBar />

      <div className="bg-gradient-to-b from-black to-gray-900 py-12">
        <div className="container mx-auto px-4">
          <Tabs defaultValue="grid" className="w-full">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl text-white">Próximos Lançamentos</h2>
              <TabsList className="bg-black/50 border border-white/10">
                <TabsTrigger value="grid" className="data-[state=active]:bg-blue-600">
                  Grade
                </TabsTrigger>
                <TabsTrigger value="timeline" className="data-[state=active]:bg-blue-600">
                  Calendário
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="grid" className="space-y-6">
              {upcomingReleases.map((release, index) => (
                <UpcomingCard key={index} {...release} />
              ))}
            </TabsContent>

            <TabsContent value="timeline" className="space-y-8">
              <TimelineSection month="Abril 2026" items={aprilReleases} />
              <TimelineSection month="Maio 2026" items={mayReleases} />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
