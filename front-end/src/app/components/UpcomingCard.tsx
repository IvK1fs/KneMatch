import { Calendar, Bell, Star, Clock } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { useState, useEffect } from 'react';

interface UpcomingCardProps {
  title: string;
  image: string;
  releaseDate: string;
  genre: string;
  type: 'movie' | 'series';
  rating?: number;
  description: string;
}

export function UpcomingCard({ 
  title, 
  image, 
  releaseDate, 
  genre, 
  type,
  rating,
  description 
}: UpcomingCardProps) {
  const [timeLeft, setTimeLeft] = useState('');
  const [isNotified, setIsNotified] = useState(false);

  useEffect(() => {
    const calculateTimeLeft = () => {
      const release = new Date(releaseDate).getTime();
      const now = new Date().getTime();
      const difference = release - now;

      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        
        if (days > 0) {
          setTimeLeft(`${days} dias`);
        } else {
          setTimeLeft(`${hours} horas`);
        }
      } else {
        setTimeLeft('Disponível agora');
      }
    };

    calculateTimeLeft();
    const interval = setInterval(calculateTimeLeft, 1000 * 60); // Update every minute

    return () => clearInterval(interval);
  }, [releaseDate]);

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });
  };

  return (
    <div className="group relative bg-gray-900 rounded-lg overflow-hidden border border-white/10 hover:border-white/30 transition-all hover:scale-[1.02]">
      <div className="grid md:grid-cols-[300px_1fr] gap-0">
        // DEPOIS
<div className="relative overflow-hidden" style={{ width: '100%', maxWidth: '300px', height: '450px', flexShrink: 0 }}>
  <img 
    src={image}
    alt={title}
    className="w-full h-full object-cover transition-transform group-hover:scale-110"
    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
  />
          <div className="absolute top-3 left-3 flex gap-2">
            <Badge className={type === 'movie' ? 'bg-blue-600' : 'bg-purple-600'}>
              {type === 'movie' ? 'Filme' : 'Série'}
            </Badge>
          </div>
          {rating && (
            <div className="absolute bottom-3 left-3 bg-black/80 backdrop-blur-sm px-3 py-1.5 rounded-full flex items-center gap-1.5">
              <Star className="w-4 h-4 fill-yellow-500 text-yellow-500" />
              <span className="text-white">{rating}</span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-6 flex flex-col">
          <div className="flex-1">
            <h3 className="text-2xl text-white mb-2 group-hover:text-blue-400 transition-colors">
              {title}
            </h3>
            
            <div className="flex flex-wrap items-center gap-3 text-sm text-gray-400 mb-4">
              <div className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4" />
                <span>{formatDate(releaseDate)}</span>
              </div>
              <span>•</span>
              <span>{genre}</span>
            </div>

            <p className="text-gray-300 mb-4 line-clamp-3">
              {description}
            </p>

            {/* Countdown */}
            <div className="inline-flex items-center gap-2 bg-red-600/20 border border-red-600/50 text-red-400 px-4 py-2 rounded-full mb-4">
              <Clock className="w-4 h-4" />
              <span className="font-medium">{timeLeft}</span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-wrap gap-3 pt-4 border-t border-white/10">
            <Button 
              onClick={() => setIsNotified(!isNotified)}
              className={`flex-1 gap-2 ${isNotified ? 'bg-green-600 hover:bg-green-700' : 'bg-blue-600 hover:bg-blue-700'}`}
            >
              <Bell className={`w-4 h-4 ${isNotified ? 'fill-current' : ''}`} />
              {isNotified ? 'Notificação Ativada' : 'Me Notificar'}
            </Button>
            <Button variant="outline" className="border-white/20 text-white hover:bg-white/10">
              Ver Detalhes
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
