import { useState } from 'react';
import { Search, Menu, Moon, Sun, User, X, LogIn } from 'lucide-react';
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
  const { isAuthenticated, user, logout } = useAuth();
  const { t } = useTranslation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (path: string) => {
    return location.pathname === path
      ? 'text-gray-900 dark:text-white'
      : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white';
  };

  const navLinks = [
    { to: '/', label: t('header.home') },
    { to: '/upcoming', label: t('header.upcoming') },
    { to: '/top-10', label: t('header.ranking') },
    { to: '/search?type=movie', label: t('header.movies') },
    { to: '/search?type=tv', label: t('header.series') },
  ];

  const handleNavClick = (to: string) => {
    navigate(to);
    setMobileMenuOpen(false);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/90 dark:bg-black/90 backdrop-blur-sm border-b border-gray-200 dark:border-white/10">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link to="/">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white cursor-pointer hover:text-blue-500 dark:hover:text-blue-400 transition-colors">CineMatch</h1>
          </Link>
          <nav className="hidden md:flex items-center gap-6">
            {navLinks.map(link => (
              <Link key={link.to} to={link.to} className={`${isActive(link.to.split('?')[0])} transition-colors`}>
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-4">
          {/* Busca desktop */}
          <Button
            onClick={() => navigate('/search')}
            variant="ghost"
            className="hidden md:flex items-center gap-2 bg-gray-200 dark:bg-white/10 rounded-full px-4 py-2 text-gray-900 dark:text-white hover:bg-gray-300 dark:hover:bg-white/20"
          >
            <Search className="w-4 h-4 text-gray-600 dark:text-gray-300" />
            <span className="text-gray-500 dark:text-gray-400">{t('header.search')}</span>
          </Button>

          {/* Busca mobile */}
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

          {/* Auth — desktop */}
          {isAuthenticated ? (
            <Button
              onClick={() => navigate('/profile')}
              variant="ghost"
              size="icon"
              className="hidden md:inline-flex text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-white/10 transition-colors"
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

          {/* Hambúrguer — mobile */}
          <Button
            variant="ghost"
            size="icon"
            className="text-gray-900 dark:text-white md:hidden"
            onClick={() => setMobileMenuOpen(prev => !prev)}
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
        </div>
      </div>

      {/* Menu mobile */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white dark:bg-black border-t border-gray-200 dark:border-white/10 px-4 py-4 flex flex-col gap-3">
          {navLinks.map(link => (
            <button
              key={link.to}
              className={`${isActive(link.to.split('?')[0])} text-left text-base py-1 transition-colors`}
              onClick={() => handleNavClick(link.to)}
            >
              {link.label}
            </button>
          ))}

          <div className="border-t border-gray-200 dark:border-white/10 pt-3 mt-1 flex flex-col gap-2">
            {isAuthenticated ? (
              <>
                <button
                  className="flex items-center gap-2 text-gray-700 dark:text-gray-200 py-1 text-left"
                  onClick={() => { navigate('/profile'); setMobileMenuOpen(false); }}
                >
                  <User className="w-5 h-5" />
                  {user?.name}
                </button>
                <button
                  className="flex items-center gap-2 text-red-500 py-1 text-left"
                  onClick={() => { logout(); setMobileMenuOpen(false); }}
                >
                  {t('auth.signIn')}
                </button>
              </>
            ) : (
              <>
                <button
                  className="flex items-center gap-2 text-gray-700 dark:text-gray-200 py-1 text-left"
                  onClick={() => { navigate('/login'); setMobileMenuOpen(false); }}
                >
                  <LogIn className="w-5 h-5" />
                  {t('auth.signIn')}
                </button>
                <button
                  className="flex items-center gap-2 text-[#e50914] py-1 text-left font-medium"
                  onClick={() => { navigate('/login?tab=signup'); setMobileMenuOpen(false); }}
                >
                  {t('auth.signUp')}
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
