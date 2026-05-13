import { Film, Tv, Sparkles, TrendingUp, Heart, Clock } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export function Categories() {
  const { t } = useTranslation();

  const categories = [
    { name: t('categories.movies'), icon: Film, color: 'bg-blue-500' },
    { name: t('categories.series'), icon: Tv, color: 'bg-purple-500' },
    { name: t('categories.popular'), icon: TrendingUp, color: 'bg-red-500' },
    { name: t('categories.new'), icon: Sparkles, color: 'bg-green-500' },
    { name: t('categories.favorites'), icon: Heart, color: 'bg-pink-500' },
    { name: t('categories.watchLater'), icon: Clock, color: 'bg-orange-500' },
  ];

  return (
    <section className="py-12 bg-gradient-to-b from-white to-gray-50 dark:from-black dark:to-gray-900">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl md:text-3xl text-gray-900 dark:text-white mb-8">{t('categories.title')}</h2>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
          {categories.map((category) => {
            const Icon = category.icon;
            return (
              <button
                key={category.name}
                className="group relative overflow-hidden rounded-lg p-6 bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10 border border-gray-300 dark:border-white/10 hover:border-gray-400 dark:hover:border-white/20 transition-all"
              >
                <div className={`${category.color} w-12 h-12 rounded-full flex items-center justify-center mb-3 mx-auto group-hover:scale-110 transition-transform`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <p className="text-gray-900 dark:text-white text-sm text-center">{category.name}</p>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}