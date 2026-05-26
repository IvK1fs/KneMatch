import { Hero } from '../components/Hero';
import { Categories } from '../components/Categories';
import { ContentRow } from '../components/ContentRow';
import TrendingSection from '../components/TrendingSection';
import { useTranslation } from 'react-i18next';

const topSeries = [
  { id: 7, title: 'Série do Momento', image: 'https://images.unsplash.com/photo-1631387019069-2ff599943f9a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0diUyMHNlcmllcyUyMHByb2R1Y3Rpb258ZW58MXx8fHwxNzc0OTY4MzE1fDA&ixlib=rb-4.1.0&q=80&w=1080', rating: 9.1, year: '2026', genre: 'Drama' },
  { id: 8, title: 'Streaming Hit', image: 'https://images.unsplash.com/photo-1765478006677-69c86984c934?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdHJlYW1pbmclMjB0ZWxldmlzaW9uJTIwc2hvd3xlbnwxfHx8fDE3NzQ5NjgzMTV8MA&ixlib=rb-4.1.0&q=80&w=1080', rating: 8.9, year: '2025', genre: 'Ação' },
  { id: 9, title: 'Suspense Total', image: 'https://images.unsplash.com/photo-1762115445557-967c1504ffe9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0aHJpbGxlciUyMHN1c3BlbnNlJTIwbW92aWV8ZW58MXx8fHwxNzc0OTY1MzUxfDA&ixlib=rb-4.1.0&q=80&w=1080', rating: 9.3, year: '2026', genre: 'Suspense' },
  { id: 10, title: 'Comédia Divertida', image: 'https://images.unsplash.com/photo-1758525862263-af89b090fb56?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb21lZHklMjBmaWxtJTIwc2NlbmV8ZW58MXx8fHwxNzc0OTY4MzE0fDA&ixlib=rb-4.1.0&q=80&w=1080', rating: 8.4, year: '2025', genre: 'Comédia' },
  { id: 11, title: 'Sci-Fi Original', image: 'https://images.unsplash.com/photo-1759267960211-5f445be05c93?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzY2llbmNlJTIwZmljdGlvbiUyMG1vdmllfGVufDF8fHx8MTc3NDk0NDUxMnww&ixlib=rb-4.1.0&q=80&w=1080', rating: 8.6, year: '2026', genre: 'Ficção' },
  { id: 12, title: 'Drama Intenso', image: 'https://images.unsplash.com/photo-1767244490204-74aa6a4c6df9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkcmFtYSUyMGZpbG0lMjBzY2VuZXxlbnwxfHx8fDE3NzQ5NjgzMTR8MA&ixlib=rb-4.1.0&q=80&w=1080', rating: 9.0, year: '2026', genre: 'Drama' },
];

const recommended = [
  { id: 13, title: 'Para Você', image: 'https://images.unsplash.com/photo-1645808651017-c5e3018553c7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhY3Rpb24lMjBtb3ZpZSUyMHNjZW5lfGVufDF8fHx8MTc3NDg5MjQxM3ww&ixlib=rb-4.1.0&q=80&w=1080', rating: 8.2, year: '2025', genre: 'Ação' },
  { id: 14, title: 'Escolha Perfeita', image: 'https://images.unsplash.com/photo-1631387019069-2ff599943f9a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0diUyMHNlcmllcyUyMHByb2R1Y3Rpb258ZW58MXx8fHwxNzc0OTY4MzE1fDA&ixlib=rb-4.1.0&q=80&w=1080', rating: 8.8, year: '2026', genre: 'Drama' },
  { id: 15, title: 'Recomendação Top', image: 'https://images.unsplash.com/photo-1765478006677-69c86984c934?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdHJlYW1pbmclMjB0ZWxldmlzaW9uJTIwc2hvd3xlbnwxfHx8fDE3NzQ5NjgzMTV8MA&ixlib=rb-4.1.0&q=80&w=1080', rating: 9.1, year: '2025', genre: 'Suspense' },
  { id: 16, title: 'Favorito do Mês', image: 'https://images.unsplash.com/photo-1759267960211-5f445be05c93?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzY2llbmNlJTIwZmljdGlvbiUyMG1vdmllfGVufDF8fHx8MTc3NDk0NDUxMnww&ixlib=rb-4.1.0&q=80&w=1080', rating: 8.5, year: '2026', genre: 'Ficção' },
  { id: 17, title: 'Mais Assistido', image: 'https://images.unsplash.com/photo-1758525862263-af89b090fb56?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb21lZHklMjBmaWxtJTIwc2NlbmV8ZW58MXx8fHwxNzc0OTY4MzE0fDA&ixlib=rb-4.1.0&q=80&w=1080', rating: 7.8, year: '2025', genre: 'Comédia' },
  { id: 18, title: 'Descoberta Especial', image: 'https://images.unsplash.com/photo-1767244490204-74aa6a4c6df9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkcmFtYSUyMGZpbG0lMjBzY2VuZXxlbnwxfHx8fDE3NzQ5NjgzMTR8MA&ixlib=rb-4.1.0&q=80&w=1080', rating: 8.9, year: '2026', genre: 'Drama' },
];

export function HomePage() {
  const { t } = useTranslation();

  return (
    <>
      <Hero />
      <Categories />
      <div className="bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-black">
        <TrendingSection />
        <ContentRow title={t('home.popularSeries')} items={topSeries} />
        <ContentRow title={t('home.recommendedForYou')} items={recommended} />
      </div>
    </>
  );
}