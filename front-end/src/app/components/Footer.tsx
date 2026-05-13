import { Facebook, Twitter, Instagram, Youtube } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="bg-gray-100 dark:bg-black border-t border-gray-300 dark:border-white/10 py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <h3 className="text-gray-900 dark:text-white mb-4">CineMatch</h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              {t('footer.description')}
            </p>
          </div>

          <div>
            <h4 className="text-gray-900 dark:text-white mb-4 text-sm">{t('footer.navigation')}</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white text-sm transition-colors">{t('footer.home')}</a></li>
              <li><a href="#" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white text-sm transition-colors">{t('footer.movies')}</a></li>
              <li><a href="#" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white text-sm transition-colors">{t('footer.series')}</a></li>
              <li><a href="#" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white text-sm transition-colors">{t('footer.myList')}</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-gray-900 dark:text-white mb-4 text-sm">{t('footer.support')}</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white text-sm transition-colors">{t('footer.helpCenter')}</a></li>
              <li><a href="#" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white text-sm transition-colors">{t('footer.terms')}</a></li>
              <li><a href="#" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white text-sm transition-colors">{t('footer.privacy')}</a></li>
              <li><a href="#" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white text-sm transition-colors">{t('footer.contact')}</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-gray-900 dark:text-white mb-4 text-sm">{t('footer.socialMedia')}</h4>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 bg-gray-300 dark:bg-white/10 hover:bg-gray-400 dark:hover:bg-white/20 rounded-full flex items-center justify-center transition-colors">
                <Facebook className="w-5 h-5 text-gray-900 dark:text-white" />
              </a>
              <a href="#" className="w-10 h-10 bg-gray-300 dark:bg-white/10 hover:bg-gray-400 dark:hover:bg-white/20 rounded-full flex items-center justify-center transition-colors">
                <Twitter className="w-5 h-5 text-gray-900 dark:text-white" />
              </a>
              <a href="#" className="w-10 h-10 bg-gray-300 dark:bg-white/10 hover:bg-gray-400 dark:hover:bg-white/20 rounded-full flex items-center justify-center transition-colors">
                <Instagram className="w-5 h-5 text-gray-900 dark:text-white" />
              </a>
              <a href="#" className="w-10 h-10 bg-gray-300 dark:bg-white/10 hover:bg-gray-400 dark:hover:bg-white/20 rounded-full flex items-center justify-center transition-colors">
                <Youtube className="w-5 h-5 text-gray-900 dark:text-white" />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-300 dark:border-white/10 pt-8 text-center text-gray-600 dark:text-gray-400 text-sm">
          <p>{t('footer.copyright')}</p>
        </div>
      </div>
    </footer>
  );
}