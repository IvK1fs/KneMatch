import { Search, Menu, Moon, Sun, User } from 'lucide-react';
import { Button } from './ui/button';
import { Link, useLocation, useNavigate } from 'react-router';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import { LanguageSwitcher } from './LanguageSwitcher';
import { useTranslation } from 'react-i18next';

export function Header() {
  const location = useLocation();
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const { isAuthenticated } = useAuth();
  const { t } = useTranslation();

  const isActive = (path: string) => {
    return location.pathname === path
      ? 'text-gray-900 dark:text-white'
      : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white';
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/90 dark:bg-black/90 backdrop-blur-sm border-b border-gray-200 dark:border-white/10">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link to="/">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white cursor-pointer hover:text-blue-500 dark:hover:text-blue-400 transition-colors">CineMatch</h1>
          </Link>
          <nav className="hidden md:flex items-center gap-6">
            <Link to="/" className={`${isActive('/')} transition-colors`}>{t('header.home')}</Link>
            <Link to="/upcoming" className={`${isActive('/upcoming-showcase')} transition-colors`}>{t('header.upcoming')}</Link>
            <Link to="/top-10" className={`${isActive('/top-10')} transition-colors`}>{t('header.ranking')}</Link>
            <Link to="/search?type=movie" className={`${isActive('/search')} transition-colors`}>{t('header.movies')}</Link>
            <Link to="/search?type=tv" className={`${isActive('/search')} transition-colors`}>{t('header.series')}</Link>
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <Button
            onClick={() => navigate('/search')}
            variant="ghost"
            className="hidden md:flex items-center gap-2 bg-gray-200 dark:bg-white/10 rounded-full px-4 py-2 text-gray-900 dark:text-white hover:bg-gray-300 dark:hover:bg-white/20"
          >
            <Search className="w-4 h-4 text-gray-600 dark:text-gray-300" />
            <span className="text-gray-500 dark:text-gray-400">{t('header.search')}</span>
          </Button>
          <Button
            onClick={() => navigate('/search')}
            variant="ghost"
            size="icon"
            className="text-gray-900 dark:text-white md:hidden"
          >
            <Search className="w-5 h-5" />
          </Button>
          <LanguageSwitcher />
          <Button
            onClick={toggleTheme}
            variant="ghost"
            size="icon"
            className="text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-white/10 transition-colors"
            aria-label={theme === 'dark' ? t('header.themeToggleDark') : t('header.themeToggleLight')}
          >
            {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </Button>
          {isAuthenticated ? (
            <Button
              onClick={() => navigate('/profile')}
              variant="ghost"
              size="icon"
              className="text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-white/10 transition-colors"
            >
              <User className="w-5 h-5" />
            </Button>
          ) : (
            <Button
              onClick={() => navigate('/login')}
              className="bg-[#e50914] hover:bg-[#c40812] text-white hidden md:inline-flex"
            >
              {t('auth.signIn')}
            </Button>
          )}
          <Button variant="ghost" size="icon" className="text-gray-900 dark:text-white md:hidden">
            <Menu className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </header>
  );
}