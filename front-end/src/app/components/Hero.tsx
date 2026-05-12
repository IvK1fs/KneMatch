import { Play, Info } from 'lucide-react';
import { Button } from './ui/button';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';

export function Hero() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <section className="relative h-screen w-full overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img 
          src="https://images.unsplash.com/photo-1739433437912-cca661ba902f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaW5lbWElMjBtb3ZpZSUyMHRoZWF0ZXJ8ZW58MXx8fHwxNzc0ODgwOTY2fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
          alt="Cinema"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-transparent to-transparent" />
      </div>
      
      {/* Content */}
      <div className="relative container mx-auto px-4 h-full flex items-center">
        <div className="max-w-2xl space-y-6">
          <div className="inline-block px-3 py-1 bg-red-600 text-white text-sm rounded">
            {t('hero.featuredBadge')}
          </div>
          <h2 className="text-5xl md:text-6xl lg:text-7xl text-white">
            {t('hero.title')}
          </h2>
          <p className="text-lg md:text-xl text-gray-300 max-w-xl">
            {t('hero.description')}
          </p>
          
          <div className="flex flex-wrap gap-4 pt-4">
            <Button 
              size="lg" 
              className="bg-white text-black hover:bg-gray-200 gap-2"
              onClick={() => navigate('/search')}
            >
              <Play className="w-5 h-5 fill-current" />
              {t('hero.startButton')}
            </Button>
            <Button size="lg" variant="outline" className="bg-white/10 text-white border-white/20 hover:bg-white/20 gap-2">
              <Info className="w-5 h-5" />
              {t('hero.moreInfoButton')}
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}