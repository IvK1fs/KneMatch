import { Play, Bell, Calendar, Clock } from 'lucide-react';
import { Button } from './ui/button';
import { useState, useEffect } from 'react';

interface FeaturedUpcomingProps {
  title: string;
  image: string;
  releaseDate: string;
  description: string;
  genre: string;
}

export function FeaturedUpcoming({ 
  title, 
  image, 
  releaseDate, 
  description,
  genre 
}: FeaturedUpcomingProps) {
  const [countdown, setCountdown] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const calculateCountdown = () => {
      const release = new Date(releaseDate).getTime();
      const now = new Date().getTime();
      const difference = release - now;

      if (difference > 0) {
        setCountdown({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((difference % (1000 * 60)) / 1000)
        });
      }
    };

    calculateCountdown();
    const interval = setInterval(calculateCountdown, 1000);

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
    <section className="relative h-[600px] w-full overflow-hidden mb-12">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img 
          src={image}
          alt={title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/50 to-transparent" />
      </div>
      
      {/* Content */}
      <div className="relative container mx-auto px-4 h-full flex items-center">
        <div className="max-w-2xl space-y-6">
          <div className="inline-block px-4 py-1.5 bg-red-600 text-white text-sm rounded-full">
            Próximo Grande Lançamento
          </div>
          
          <h2 className="text-5xl md:text-6xl lg:text-7xl text-white">
            {title}
          </h2>
          
          <div className="flex items-center gap-4 text-gray-300">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              <span>{formatDate(releaseDate)}</span>
            </div>
            <span>•</span>
            <span>{genre}</span>
          </div>

          <p className="text-lg text-gray-300 max-w-xl">
            {description}
          </p>

          {/* Countdown Timer */}
          <div className="grid grid-cols-4 gap-4 max-w-md pt-4">
            <div className="bg-black/60 backdrop-blur-sm rounded-lg p-4 text-center border border-white/20">
              <div className="text-3xl text-white mb-1">{countdown.days}</div>
              <div className="text-xs text-gray-400 uppercase">Dias</div>
            </div>
            <div className="bg-black/60 backdrop-blur-sm rounded-lg p-4 text-center border border-white/20">
              <div className="text-3xl text-white mb-1">{countdown.hours}</div>
              <div className="text-xs text-gray-400 uppercase">Horas</div>
            </div>
            <div className="bg-black/60 backdrop-blur-sm rounded-lg p-4 text-center border border-white/20">
              <div className="text-3xl text-white mb-1">{countdown.minutes}</div>
              <div className="text-xs text-gray-400 uppercase">Min</div>
            </div>
            <div className="bg-black/60 backdrop-blur-sm rounded-lg p-4 text-center border border-white/20">
              <div className="text-3xl text-white mb-1">{countdown.seconds}</div>
              <div className="text-xs text-gray-400 uppercase">Seg</div>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-4 pt-4">
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white gap-2">
              <Bell className="w-5 h-5" />
              Me Notificar
            </Button>
            <Button size="lg" variant="outline" className="bg-white/10 text-white border-white/20 hover:bg-white/20 gap-2">
              <Play className="w-5 h-5" />
              Ver Trailer
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
