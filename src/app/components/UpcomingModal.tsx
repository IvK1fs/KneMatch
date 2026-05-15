import { X, Calendar, Play, Bell, Star, Clock } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { useState, useEffect } from 'react';

interface UpcomingModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  item: {
    id: number;
    title: string;
    image: string;
    releaseDate: string;
    genre: string;
    type: 'movie' | 'series';
    description?: string;
  } | null;
}

export function UpcomingModal({ open, onOpenChange, item }: UpcomingModalProps) {
  const [hasReminder, setHasReminder] = useState(false);
  const [countdown, setCountdown] = useState({ days: 0, hours: 0, minutes: 0 });

  useEffect(() => {
    if (!item) return;

    const calculateCountdown = () => {
      const release = new Date(item.releaseDate).getTime();
      const now = new Date().getTime();
      const difference = release - now;

      if (difference > 0) {
        setCountdown({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60))
        });
      }
    };

    calculateCountdown();
    const interval = setInterval(calculateCountdown, 60000); // Update every minute

    return () => clearInterval(interval);
  }, [item]);

  if (!item) return null;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      weekday: 'long'
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl bg-gray-900 border-white/10 p-0 overflow-hidden">
        {/* Hero Image */}
        <div className="relative h-[400px] w-full">
          <img
            src={item.image}
            alt={item.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/60 to-transparent" />
          
          {/* Close Button */}
          <button
            onClick={() => onOpenChange(false)}
            className="absolute top-4 right-4 p-2 bg-black/60 hover:bg-black/80 rounded-full backdrop-blur-sm transition-colors"
          >
            <X className="w-5 h-5 text-white" />
          </button>

          {/* Content Overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-8">
            <div className="flex items-center gap-3 mb-4">
              <Badge className={item.type === 'movie' ? 'bg-blue-600' : 'bg-purple-600'}>
                {item.type === 'movie' ? 'Filme' : 'Série'}
              </Badge>
              <Badge variant="outline" className="bg-white/10 border-white/20 text-white">
                {item.genre}
              </Badge>
            </div>
            
            <h2 className="text-4xl text-white mb-4">{item.title}</h2>
            
            <div className="flex items-center gap-6 text-gray-300 mb-6">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                <span>{formatDate(item.releaseDate)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Details */}
        <div className="p-8">
          {/* Countdown */}
          <div className="mb-8">
            <h3 className="text-white text-lg mb-4 flex items-center gap-2">
              <Clock className="w-5 h-5 text-blue-400" />
              Tempo até o lançamento
            </h3>
            <div className="grid grid-cols-3 gap-4 max-w-md">
              <div className="bg-black/40 rounded-lg p-4 text-center border border-white/10">
                <div className="text-3xl text-white mb-1">{countdown.days}</div>
                <div className="text-xs text-gray-400 uppercase">Dias</div>
              </div>
              <div className="bg-black/40 rounded-lg p-4 text-center border border-white/10">
                <div className="text-3xl text-white mb-1">{countdown.hours}</div>
                <div className="text-xs text-gray-400 uppercase">Horas</div>
              </div>
              <div className="bg-black/40 rounded-lg p-4 text-center border border-white/10">
                <div className="text-3xl text-white mb-1">{countdown.minutes}</div>
                <div className="text-xs text-gray-400 uppercase">Minutos</div>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="mb-8">
            <h3 className="text-white text-lg mb-3">Sinopse</h3>
            <p className="text-gray-300 leading-relaxed">
              {item.description || 
                'Uma experiência cinematográfica inesquecível que promete revolucionar o gênero. Com um elenco estelar e produção de alto nível, este lançamento é um dos mais aguardados do ano. Prepare-se para uma jornada épica repleta de emoção, suspense e momentos inesquecíveis que vão te manter na beira do assento do início ao fim.'}
            </p>
          </div>

          {/* Actions */}
          <div className="flex flex-wrap gap-4">
            <Button 
              size="lg"
              onClick={() => setHasReminder(!hasReminder)}
              className={`gap-2 ${hasReminder ? 'bg-green-600 hover:bg-green-700' : 'bg-blue-600 hover:bg-blue-700'}`}
            >
              <Bell className={`w-5 h-5 ${hasReminder ? 'fill-current' : ''}`} />
              {hasReminder ? 'Lembrete Ativado' : 'Ativar Lembrete'}
            </Button>
            <Button size="lg" variant="outline" className="gap-2 border-white/20 text-white hover:bg-white/10">
              <Play className="w-5 h-5" />
              Ver Trailer
            </Button>
            <Button size="lg" variant="outline" className="gap-2 border-white/20 text-white hover:bg-white/10">
              <Star className="w-5 h-5" />
              Adicionar aos Favoritos
            </Button>
          </div>

          {/* Additional Info */}
          <div className="mt-8 pt-8 border-t border-white/10">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-500">Tipo:</span>
                <span className="text-white ml-2">{item.type === 'movie' ? 'Filme' : 'Série'}</span>
              </div>
              <div>
                <span className="text-gray-500">Gênero:</span>
                <span className="text-white ml-2">{item.genre}</span>
              </div>
              <div>
                <span className="text-gray-500">Data de Lançamento:</span>
                <span className="text-white ml-2">
                  {new Date(item.releaseDate).toLocaleDateString('pt-BR')}
                </span>
              </div>
              <div>
                <span className="text-gray-500">Status:</span>
                <span className="text-yellow-400 ml-2">Em breve</span>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
