import { MovieCard } from './MovieCard';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from './ui/button';

interface Content {
  id: number;
  title: string;
  image: string;
  rating: number;
  year: string;
  genre: string;
}

interface ContentRowProps {
  title: string;
  items: Content[];
}

export function ContentRow({ title, items }: ContentRowProps) {
  return (
    <section className="py-8">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl md:text-3xl text-gray-900 dark:text-white">{title}</h2>
          <div className="hidden md:flex gap-2">
            <Button variant="ghost" size="icon" className="text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-white/10">
              <ChevronLeft className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="icon" className="text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-white/10">
              <ChevronRight className="w-5 h-5" />
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {items.map((item) => (
            <MovieCard
              key={item.id}
              title={item.title}
              image={item.image}
              rating={item.rating}
              year={item.year}
              genre={item.genre}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
