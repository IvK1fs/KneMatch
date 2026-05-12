import { useState } from 'react';
import { ChevronRight, Calendar, Bell, BellOff } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';

interface UpcomingItem {
  id: number;
  title: string;
  image: string;
  releaseDate: string;
  genre: string;
  type: 'movie' | 'series';
  description?: string;
}

interface UpcomingSectionProps {
  items: UpcomingItem[];
  onItemClick?: (item: UpcomingItem) => void;
}

export function UpcomingSection({ items, onItemClick }: UpcomingSectionProps) {
  const [reminders, setReminders] = useState<Set<number>>(new Set());
  const [filter, setFilter] = useState<'all' | 'movie' | 'series'>('all');

  const toggleReminder = (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setReminders(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = date.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
      return 'Disponível agora';
    } else if (diffDays === 0) {
      return 'Estreia hoje';
    } else if (diffDays === 1) {
      return 'Estreia amanhã';
    } else if (diffDays <= 7) {
      return `Estreia em ${diffDays} dias`;
    } else {
      return `Estreia em ${date.toLocaleDateString('pt-BR', { day: '2-digit', month: 'long' })}`;
    }
  };

  const filteredItems = filter === 'all' 
    ? items 
    : items.filter(item => item.type === filter);

  return (
    <section className="py-12 bg-white dark:bg-black">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <h2 className="text-3xl text-gray-900 dark:text-white">Upcoming</h2>
            <Badge variant="outline" className="bg-red-600/20 border-red-600 text-red-400 px-3 py-1">
              {filteredItems.length} lançamentos
            </Badge>
          </div>

          {/* Filter Buttons */}
          <div className="flex gap-2">
            <Button
              size="sm"
              variant={filter === 'all' ? 'default' : 'outline'}
              onClick={() => setFilter('all')}
              className={filter === 'all' ? 'bg-blue-600 hover:bg-blue-700' : 'border-gray-400 dark:border-white/20 text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-white/10'}
            >
              Todos
            </Button>
            <Button
              size="sm"
              variant={filter === 'movie' ? 'default' : 'outline'}
              onClick={() => setFilter('movie')}
              className={filter === 'movie' ? 'bg-blue-600 hover:bg-blue-700' : 'border-gray-400 dark:border-white/20 text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-white/10'}
            >
              Filmes
            </Button>
            <Button
              size="sm"
              variant={filter === 'series' ? 'default' : 'outline'}
              onClick={() => setFilter('series')}
              className={filter === 'series' ? 'bg-blue-600 hover:bg-blue-700' : 'border-gray-400 dark:border-white/20 text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-white/10'}
            >
              Séries
            </Button>
          </div>
        </div>

        {/* Scrollable Cards */}
        <div className="relative">
          <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide scroll-smooth snap-x snap-mandatory">
            {filteredItems.map((item) => {
              const hasReminder = reminders.has(item.id);
              const daysUntil = Math.ceil((new Date(item.releaseDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
              const isComingSoon = daysUntil <= 7 && daysUntil >= 0;

              return (
                <div
                  key={item.id}
                  onClick={() => onItemClick?.(item)}
                  className="group relative flex-shrink-0 w-[280px] snap-start cursor-pointer"
                >
                  {/* Card */}
                  <div className="relative bg-white dark:bg-gray-900 rounded-lg overflow-hidden border border-gray-300 dark:border-white/10 hover:border-blue-500/50 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/20">
                    {/* Image */}
                    <div className="relative aspect-[2/3] overflow-hidden">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />

                      {/* Gradient Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-white dark:from-gray-900 via-white/60 dark:via-gray-900/60 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />

                      {/* Type Badge */}
                      <div className="absolute top-3 left-3">
                        <Badge className={item.type === 'movie' ? 'bg-blue-600' : 'bg-purple-600'}>
                          {item.type === 'movie' ? 'Filme' : 'Série'}
                        </Badge>
                      </div>

                      {/* Coming Soon Badge */}
                      {isComingSoon && (
                        <div className="absolute top-3 right-3">
                          <Badge className="bg-red-600 animate-pulse">
                            Em breve
                          </Badge>
                        </div>
                      )}

                      {/* Reminder Button */}
                      <button
                        onClick={(e) => toggleReminder(item.id, e)}
                        className={`absolute bottom-3 right-3 p-2 rounded-full backdrop-blur-sm transition-all duration-300 ${
                          hasReminder
                            ? 'bg-blue-600 text-white scale-110'
                            : 'bg-gray-800/60 dark:bg-black/60 text-white hover:bg-gray-800/80 dark:hover:bg-black/80'
                        }`}
                      >
                        {hasReminder ? (
                          <Bell className="w-5 h-5 fill-current" />
                        ) : (
                          <BellOff className="w-5 h-5" />
                        )}
                      </button>
                    </div>

                    {/* Content */}
                    <div className="p-4">
                      <h3 className="text-gray-900 dark:text-white text-lg mb-2 line-clamp-2 group-hover:text-blue-500 dark:group-hover:text-blue-400 transition-colors">
                        {item.title}
                      </h3>

                      <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-2">
                        <Calendar className="w-4 h-4" />
                        <span className={isComingSoon ? 'text-red-500 dark:text-red-400 font-medium' : ''}>
                          {formatDate(item.releaseDate)}
                        </span>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-500">{item.genre}</span>
                        <ChevronRight className="w-5 h-5 text-gray-500 group-hover:text-blue-500 dark:group-hover:text-blue-400 transition-colors" />
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Scroll Indicator */}
          <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-white dark:from-black to-transparent pointer-events-none" />
        </div>

        {/* View All Button */}
        <div className="flex justify-center mt-8">
          <Button variant="outline" className="border-gray-400 dark:border-white/20 text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-white/10 gap-2">
            Ver todos os lançamentos
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </section>
  );
}
