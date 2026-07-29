import React from 'react';
import { UserProfile } from '../types';
import { BrandLogo } from './BrandLogo';
import { useLanguage } from '../i18n/translations';
import {
  Bell,
  Search,
  Menu,
  X,
  Sparkles,
  ChevronDown,
  Moon,
  Sun,
  Globe
} from 'lucide-react';

interface NavbarProps {
  currentUser: UserProfile;
  allUsers: UserProfile[];
  onSelectUser: (user: UserProfile) => void;
  onOpenSearch: () => void;
  activeAlertsCount: number;
  onNavigateToAlerts: () => void;
  darkMode: boolean;
  onToggleDarkMode: () => void;
  isMobileMenuOpen?: boolean;
  onToggleMobileMenu?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentUser,
  allUsers,
  onSelectUser,
  onOpenSearch,
  activeAlertsCount,
  onNavigateToAlerts,
  darkMode,
  onToggleDarkMode,
  isMobileMenuOpen = false,
  onToggleMobileMenu,
}) => {
  const [showUserDropdown, setShowUserDropdown] = React.useState(false);
  const { language, setLanguage, t } = useLanguage();

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md transition-colors">
      <div className="flex h-16 items-center justify-between px-3 sm:px-6">
        
        {/* Left Brand Title, Mobile Menu Button & Logo */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Mobile Hamburger Button */}
          {onToggleMobileMenu && (
            <button
              onClick={onToggleMobileMenu}
              className="lg:hidden p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition"
              aria-label="Menu"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5 text-orange-500" /> : <Menu className="w-5 h-5" />}
            </button>
          )}

          <BrandLogo size="md" variant="full" />
          
          <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 dark:bg-blue-950/80 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
            <Sparkles className="w-3 h-3 text-orange-500" /> {t('copilotBadge')}
          </span>
        </div>

        {/* Global Quick Search Button (Desktop) */}
        <div className="flex-1 max-w-md mx-4 hidden md:block">
          <button
            onClick={onOpenSearch}
            className="w-full flex items-center justify-between px-3.5 py-2 text-xs font-medium text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800/80 hover:bg-slate-200/80 dark:hover:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 transition"
          >
            <div className="flex items-center gap-2">
              <Search className="w-4 h-4 text-slate-400" />
              <span>{t('searchPlaceholder')}</span>
            </div>
            <kbd className="px-1.5 py-0.5 text-[10px] bg-white dark:bg-slate-900 rounded border border-slate-300 dark:border-slate-600 shadow-xs">⌘K</kbd>
          </button>
        </div>

        {/* Right Action Icons & User Switcher */}
        <div className="flex items-center gap-1.5 sm:gap-2">

          {/* Language Switcher Pill */}
          <div className="flex items-center p-0.5 bg-slate-100 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
            <button
              onClick={() => setLanguage('fr')}
              className={`px-2 py-1 text-[11px] font-bold rounded-md transition-all ${
                language === 'fr'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
              title="Passer en Français"
            >
              FR
            </button>
            <button
              onClick={() => setLanguage('en')}
              className={`px-2 py-1 text-[11px] font-bold rounded-md transition-all ${
                language === 'en'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
              title="Switch to English"
            >
              EN
            </button>
          </div>

          {/* Quick Search Mobile Icon */}
          <button
            onClick={onOpenSearch}
            className="md:hidden p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition"
            title="Recherche"
          >
            <Search className="w-5 h-5" />
          </button>

          {/* Theme Toggle Button */}
          <button
            onClick={onToggleDarkMode}
            className="p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition"
            title="Basculer le thème"
          >
            {darkMode ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5" />}
          </button>

          {/* Smart Alerts Notification Bell */}
          <button
            onClick={onNavigateToAlerts}
            className="relative p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition"
            title="Alertes Intelligentes"
          >
            <Bell className="w-5 h-5" />
            {activeAlertsCount > 0 && (
              <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-orange-600 text-[10px] font-bold text-white shadow-xs">
                {activeAlertsCount}
              </span>
            )}
          </button>

          {/* Role & Profile Selector Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowUserDropdown(!showUserDropdown)}
              className="flex items-center gap-1.5 sm:gap-2 pl-1.5 sm:pl-2 pr-2 sm:pr-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition"
            >
              <img
                src={currentUser.avatarUrl}
                alt={currentUser.firstName}
                className="w-7 h-7 sm:w-8 sm:h-8 rounded-full object-cover ring-2 ring-blue-600/30"
              />
              <div className="text-left hidden sm:block">
                <p className="text-xs font-semibold text-slate-800 dark:text-slate-100 leading-tight">
                  {currentUser.firstName} {currentUser.lastName}
                </p>
                <span className={`inline-block px-1.5 py-0.2 text-[10px] font-bold rounded ${
                  currentUser.role === 'Administrateur'
                    ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/60 dark:text-purple-300'
                    : currentUser.role === 'Manager'
                    ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/60 dark:text-blue-300'
                    : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/60 dark:text-emerald-300'
                }`}>
                  {currentUser.role}
                </span>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {/* Profile Selector Menu */}
            {showUserDropdown && (
              <div className="absolute right-0 mt-2 w-64 rounded-xl bg-white dark:bg-slate-900 shadow-xl border border-slate-200 dark:border-slate-800 py-2 z-50 animate-in fade-in slide-in-from-top-2">
                <div className="px-3 py-2 border-b border-slate-100 dark:border-slate-800">
                  <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    Changer de Profil Utilisateur
                  </p>
                </div>
                {allUsers.map((u) => (
                  <button
                    key={u.id}
                    onClick={() => {
                      onSelectUser(u);
                      setShowUserDropdown(false);
                    }}
                    className={`w-full flex items-center gap-3 px-3 py-2 text-left text-xs transition ${
                      u.id === currentUser.id
                        ? 'bg-blue-50 dark:bg-blue-950/60 font-medium text-blue-700 dark:text-blue-300'
                        : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    <img src={u.avatarUrl} alt={u.firstName} className="w-7 h-7 rounded-full object-cover" />
                    <div className="flex-1">
                      <p className="font-semibold">{u.firstName} {u.lastName}</p>
                      <p className="text-[10px] text-slate-500">{u.role} • {u.department}</p>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

        </div>
      </div>
    </header>
  );
};

