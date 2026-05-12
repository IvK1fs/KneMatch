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
      className="group relative flex gap-4 bg-white dark:bg-gray-900 rounded-lg overflow-hidden border border-gray-300 dark:border-white/10 hover:border-yellow-500/50 transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl hover:shadow-yellow-500/20 cursor-pointer"
    >
      {/* Rank Number - Large Background */}
      <div className="relative flex-shrink-0 w-32 flex items-center justify-center">
        <div className="absolute inset-0 bg-gradient-to-r from-yellow-600 to-yellow-500 opacity-20 group-hover:opacity-30 transition-opacity" />
        <span className="text-[120px] font-black text-gray-900/10 dark:text-white/10 group-hover:text-gray-900/20 dark:group-hover:text-white/20 transition-colors leading-none select-none">
          {rank}
        </span>
        <div className="absolute top-4 left-4">
          <div className="bg-yellow-500 text-black font-black text-2xl w-12 h-12 rounded flex items-center justify-center shadow-lg">
            {rank}
          </div>
        </div>
      </div>

      {/* Image */}
      <div className="relative w-40 flex-shrink-0 overflow-hidden">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        {isNew && (
          <div className="absolute top-2 left-2">
            <Badge className="bg-red-600 animate-pulse">NOVO</Badge>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 py-6 pr-6 flex flex-col justify-between">
        <div>
          <div className="flex items-start justify-between mb-3">
            <div>
              <h3 className="text-2xl text-gray-900 dark:text-white mb-2 group-hover:text-yellow-500 dark:group-hover:text-yellow-400 transition-colors">
                {title}
              </h3>
              <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
                <span className="text-gray-500">{genre}</span>
                <span>•</span>
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 fill-yellow-500 text-yellow-500" />
                  <span className="text-gray-900 dark:text-white">{rating}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 text-sm mb-4">
            <TrendingUp className="w-4 h-4 text-green-500" />
            <span className="text-gray-700 dark:text-gray-300">{views} visualizações esta semana</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
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
      <div className="absolute top-4 right-4 bg-white/90 dark:bg-black/80 backdrop-blur-sm px-3 py-1 rounded-full border border-yellow-500/50">
        <span className="text-yellow-500 font-bold">#{rank}</span>
      </div>
    </div>
  );
}
