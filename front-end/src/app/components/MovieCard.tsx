import { Star, Plus } from 'lucide-react';
import { Button } from './ui/button';

interface MovieCardProps {
  title: string;
  image: string;
  rating: number;
  year: string;
  genre: string;
}

export function MovieCard({ title, image, rating, year, genre }: MovieCardProps) {
  return (
    <div className="group relative overflow-hidden rounded-lg transition-transform hover:scale-105 cursor-pointer shadow-md dark:shadow-none">
      <div className="aspect-[2/3] overflow-hidden bg-gray-200 dark:bg-gray-800">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover transition-transform group-hover:scale-110"
        />
      </div>

      {/* Overlay on hover */}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-4">
        <h3 className="text-white mb-2">{title}</h3>
        <div className="flex items-center gap-2 text-sm text-gray-300 mb-3">
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 fill-yellow-500 text-yellow-500" />
            <span>{rating}</span>
          </div>
          <span>•</span>
          <span>{year}</span>
          <span>•</span>
          <span>{genre}</span>
        </div>
        <Button size="sm" className="w-full bg-white text-black hover:bg-gray-200 gap-2">
          <Plus className="w-4 h-4" />
          Adicionar à Lista
        </Button>
      </div>

      {/* Rating badge */}
      <div className="absolute top-2 right-2 bg-white/90 dark:bg-black/80 backdrop-blur-sm px-2 py-1 rounded flex items-center gap-1 text-sm">
        <Star className="w-3 h-3 fill-yellow-500 text-yellow-500" />
        <span className="text-gray-900 dark:text-white">{rating}</span>
      </div>
    </div>
  );
}
