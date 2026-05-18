import { useState } from 'react';
import { UpcomingSection } from '../components/UpcomingSection';
import { UpcomingModal } from '../components/UpcomingModal';

const upcomingItems = [
  {
    id: 1,
    title: 'Ecos do Futuro',
    image: 'https://images.unsplash.com/photo-1762356121454-877acbd554bb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx1cGNvbWluZyUyMG1vdmllJTIwcHJlbWllcmV8ZW58MXx8fHwxNzc0OTk1NDg4fDA&ixlib=rb-4.1.0&q=80&w=1080',
    releaseDate: '2026-04-15',
    genre: 'Ficção Científica',
    type: 'movie' as const,
    description: 'Uma jornada épica através do tempo e espaço que desafia os limites da realidade. Prepare-se para uma experiência cinematográfica inesquecível.',
  },
  {
    id: 2,
    title: 'A Última Fronteira',
    image: 'https://images.unsplash.com/photo-1717903775083-8ad2a38483a5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxuZXclMjBmaWxtJTIwcmVsZWFzZXxlbnwxfHx8fDE3NzQ5OTU0ODh8MA&ixlib=rb-4.1.0&q=80&w=1080',
    releaseDate: '2026-04-08',
    genre: 'Ação',
    type: 'movie' as const,
    description: 'Um grupo de exploradores embarca em uma missão perigosa para salvar a humanidade. Ação intensa e visuais impressionantes aguardam nesta aventura épica.',
  },
  {
    id: 3,
    title: 'Sombras da Noite',
    image: 'https://images.unsplash.com/photo-1690650553995-cc5109870e00?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxibG9ja2J1c3RlciUyMG1vdmllJTIwcG9zdGVyfGVufDF8fHx8MTc3NDk5NTQ4OXww&ixlib=rb-4.1.0&q=80&w=1080',
    releaseDate: '2026-04-22',
    genre: 'Suspense',
    type: 'series' as const,
    description: 'Uma série original que explora os mistérios mais sombrios da mente humana. Cada episódio traz uma nova reviravolta que vai te deixar sem fôlego.',
  },
  {
    id: 4,
    title: 'Horizonte Perdido',
    image: 'https://images.unsplash.com/photo-1762417420551-2fec32ed3595?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaW5lbWElMjBwcmVtaWVyZSUyMGV2ZW50fGVufDF8fHx8MTc3NDk5NTQ4OXww&ixlib=rb-4.1.0&q=80&w=1080',
    releaseDate: '2026-05-01',
    genre: 'Drama',
    type: 'movie' as const,
    description: 'Uma história emocionante sobre amor, perda e redenção. Atuações premiadas e uma narrativa envolvente que toca o coração.',
  },
  {
    id: 5,
    title: 'Crônicas Galácticas',
    image: 'https://images.unsplash.com/photo-1586606806753-4be049463bf6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0diUyMHNob3clMjBwcmVtaWVyZXxlbnwxfHx8fDE3NzQ5OTU0ODl8MA&ixlib=rb-4.1.0&q=80&w=1080',
    releaseDate: '2026-05-15',
    genre: 'Ficção Científica',
    type: 'series' as const,
    description: 'A mais ambiciosa série de ficção científica já produzida. Efeitos visuais de última geração e uma história que redefine o gênero.',
  },
  {
    id: 6,
    title: 'Risadas e Lágrimas',
    image: 'https://images.unsplash.com/photo-1688678004647-945d5aaf91c1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb3ZpZSUyMHRoZWF0ZXIlMjBzY3JlZW58ZW58MXx8fHwxNzc0OTk1NDg5fDA&ixlib=rb-4.1.0&q=80&w=1080',
    releaseDate: '2026-06-01',
    genre: 'Comédia Dramática',
    type: 'movie' as const,
    description: 'Uma comédia comovente que equilibra perfeitamente humor e emoção. Uma celebração da vida e das relações humanas.',
  },
  {
    id: 7,
    title: 'O Enigma Final',
    image: 'https://images.unsplash.com/photo-1612544409025-e1f6a56c1152?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmaWxtJTIwcHJvZHVjdGlvbiUyMHNldHxlbnwxfHx8fDE3NzQ5OTU0OTB8MA&ixlib=rb-4.1.0&q=80&w=1080',
    releaseDate: '2026-06-15',
    genre: 'Mistério',
    type: 'series' as const,
    description: 'Um thriller psicológico que desafia sua percepção da realidade. Prepare-se para questionar tudo que você pensava saber.',
  },
  {
    id: 8,
    title: 'Cidade dos Sonhos',
    image: 'https://images.unsplash.com/photo-1609741199878-3e8ebdb1dbc7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxob2xseXdvb2QlMjBwcmVtaWVyZXxlbnwxfHx8fDE3NzQ5OTU0OTB8MA&ixlib=rb-4.1.0&q=80&w=1080',
    releaseDate: '2026-04-05',
    genre: 'Romance',
    type: 'movie' as const,
    description: 'Uma história de amor inesquecível ambientada nas luzes brilhantes da cidade grande. Paixão, sonhos e destino se entrelaçam nesta obra-prima romântica.',
  },
  {
    id: 9,
    title: 'Tempestade de Fogo',
    image: 'https://images.unsplash.com/photo-1762356121454-877acbd554bb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx1cGNvbWluZyUyMG1vdmllJTIwcHJlbWllcmV8ZW58MXx8fHwxNzc0OTk1NDg4fDA&ixlib=rb-4.1.0&q=80&w=1080',
    releaseDate: '2026-07-01',
    genre: 'Ação',
    type: 'movie' as const,
    description: 'Explosões, perseguições de tirar o fôlego e sequências de ação espetaculares. O maior blockbuster do verão promete entreter do início ao fim.',
  },
  {
    id: 10,
    title: 'Memórias Esquecidas',
    image: 'https://images.unsplash.com/photo-1717903775083-8ad2a38483a5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxuZXclMjBmaWxtJTIwcmVsZWFzZXxlbnwxfHx8fDE3NzQ5OTU0ODh8MA&ixlib=rb-4.1.0&q=80&w=1080',
    releaseDate: '2026-07-15',
    genre: 'Thriller Psicológico',
    type: 'series' as const,
    description: 'Uma série intrigante sobre memórias perdidas e identidades ocultas. Cada episódio revela uma nova camada de mistério.',
  },
];

export function UpcomingShowcasePage() {
  const [selectedItem, setSelectedItem] = useState<typeof upcomingItems[0] | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleItemClick = (item: typeof upcomingItems[0]) => {
    setSelectedItem(item);
    setIsModalOpen(true);
  };

  return (
    <div className="pt-[73px] min-h-screen bg-white dark:bg-black">
      {/* Hero Section */}
      <section className="relative h-[300px] bg-gradient-to-b from-blue-100 dark:from-blue-900/20 to-white dark:to-black flex items-center">
        <div className="container mx-auto px-4">
          <h1 className="text-5xl md:text-6xl text-gray-900 dark:text-white mb-4">Upcoming</h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl">
            Fique por dentro dos próximos lançamentos e não perca nenhuma estreia.
            Ative lembretes para seus favoritos!
          </p>
        </div>
      </section>

      {/* Upcoming Section */}
      <UpcomingSection items={upcomingItems} onItemClick={handleItemClick} />

      {/* Modal */}
      <UpcomingModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        item={selectedItem}
      />
    </div>
  );
}
