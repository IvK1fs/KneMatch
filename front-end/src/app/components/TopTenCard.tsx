import { Play, Plus, TrendingUp, Star } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';

interface TopTenCardProps {
  rank: number;
  title: string;
  image: string;
  genre: string;
  rating: number;
  views: string;
  isNew?: boolean;
  onClick?: () => void;
}

export function TopTenCard({ 
  rank, 
  title, 
  image, 
  genre, 
  rating, 
  views,
  isNew = false,
  onClick 
}: TopTenCardProps) {
  return (
    <div
      onClick={onClick}
      className="group relative flex gap-2 sm:gap-4 bg-white dark:bg-gray-900 rounded-lg overflow-hidden border border-gray-300 dark:border-white/10 hover:border-yellow-500/50 transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl hover:shadow-yellow-500/20 cursor-pointer"
    >
      {/* Rank Number */}
      <div className="relative flex-shrink-0 w-12 sm:w-32 flex items-center justify-center">
        <div className="absolute inset-0 bg-gradient-to-r from-yellow-600 to-yellow-500 opacity-20 group-hover:opacity-30 transition-opacity" />
        <span className="hidden sm:block text-[120px] font-black text-gray-900/10 dark:text-white/10 group-hover:text-gray-900/20 dark:group-hover:text-white/20 transition-colors leading-none select-none">
          {rank}
        </span>
        <div className="sm:absolute sm:top-4 sm:left-4">
          <div className="bg-yellow-500 text-black font-black text-base sm:text-2xl w-8 h-8 sm:w-12 sm:h-12 rounded flex items-center justify-center shadow-lg">
            {rank}
          </div>
        </div>
      </div>

      {/* Image */}
      <div className="relative w-20 sm:w-40 flex-shrink-0 overflow-hidden">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        {isNew && (
          <div className="absolute top-2 left-2">
            <Badge className="bg-red-600 animate-pulse text-xs">NOVO</Badge>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 py-3 sm:py-6 pr-3 sm:pr-6 flex flex-col justify-between min-w-0">
        <div>
          <div className="flex items-start justify-between mb-1 sm:mb-3">
            <div className="min-w-0 pr-8 sm:pr-0">
              <h3 className="text-sm sm:text-2xl text-gray-900 dark:text-white mb-1 sm:mb-2 group-hover:text-yellow-500 dark:group-hover:text-yellow-400 transition-colors line-clamp-2">
                {title}
              </h3>
              <div className="flex items-center gap-1 sm:gap-3 text-xs sm:text-sm text-gray-600 dark:text-gray-400 flex-wrap">
                <span className="text-gray-500">{genre}</span>
                <span>•</span>
                <div className="flex items-center gap-1">
                  <Star className="w-3 h-3 sm:w-4 sm:h-4 fill-yellow-500 text-yellow-500" />
                  <span className="text-gray-900 dark:text-white">{rating}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="hidden sm:flex items-center gap-2 text-sm mb-4">
            <TrendingUp className="w-4 h-4 text-green-500" />
            <span className="text-gray-700 dark:text-gray-300">{views} visualizações esta semana</span>
          </div>
        </div>

        {/* Actions — só desktop */}
        <div className="hidden sm:flex gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button size="sm" className="bg-white text-black hover:bg-gray-200 gap-2">
            <Play className="w-4 h-4 fill-current" />
            Assistir
          </Button>
          <Button size="sm" variant="outline" className="border-gray-400 dark:border-white/20 text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-white/10 gap-2">
            <Plus className="w-4 h-4" />
            Minha Lista
          </Button>
        </div>
      </div>

      {/* Rank Badge on Right */}
      <div className="absolute top-2 right-2 sm:top-4 sm:right-4 bg-white/90 dark:bg-black/80 backdrop-blur-sm px-2 sm:px-3 py-1 rounded-full border border-yellow-500/50">
        <span className="text-yellow-500 font-bold text-xs sm:text-sm">#{rank}</span>
      </div>
    </div>
  );
}
