import React from 'react';
import { Bookmark, Sun, Moon, Sparkles } from 'lucide-react';
import { CategoryFilter } from '../types';

interface HeaderProps {
  activeCategory: CategoryFilter;
  onNavigateHome: () => void;
  onSelectCategory: (category: CategoryFilter) => void;
  savedCount: number;
  onOpenSaved: () => void;
  isDark: boolean;
  onToggleTheme: () => void;
  onOpenNewsletter: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeCategory,
  onNavigateHome,
  onSelectCategory,
  savedCount,
  onOpenSaved,
  isDark,
  onToggleTheme,
  onOpenNewsletter,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-stone-50/90 dark:bg-[#0c0d0e]/90 border-b border-stone-200 dark:border-neutral-800 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        
        {/* Zone 1: Single text element wordmark with descriptive anchor text */}
        <a
          href="/"
          onClick={(e) => {
            e.preventDefault();
            onNavigateHome();
          }}
          className="text-left group flex items-baseline gap-2 whitespace-nowrap shrink-0 focus:outline-none"
          title="Polychron Gaming Journal Home"
        >
          <span className="font-brand text-xl sm:text-2xl font-bold tracking-wider text-stone-900 dark:text-stone-100 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
            POLYCHRON
          </span>
          <span className="text-xs uppercase tracking-widest text-stone-500 dark:text-neutral-500 font-sans hidden sm:inline">
            Gaming Journal
          </span>
        </a>

        {/* Zone 2: 4–5 single-line clean nav links with semantic anchor text */}
        <nav aria-label="Primary editorial categories" className="hidden md:flex items-center gap-6 lg:gap-8 text-sm font-medium">
          <a
            href="/"
            onClick={(e) => {
              e.preventDefault();
              onSelectCategory('All');
            }}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 ${
              activeCategory === 'All'
                ? 'text-amber-600 dark:text-amber-400 font-semibold border-b-2 border-amber-500'
                : 'text-stone-600 dark:text-neutral-400 hover:text-stone-900 dark:hover:text-stone-100'
            }`}
          >
            All Essays
          </a>
          <a
            href="/category/deep-dives"
            onClick={(e) => {
              e.preventDefault();
              onSelectCategory('Deep Dives');
            }}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 ${
              activeCategory === 'Deep Dives'
                ? 'text-amber-600 dark:text-amber-400 font-semibold border-b-2 border-amber-500'
                : 'text-stone-600 dark:text-neutral-400 hover:text-stone-900 dark:hover:text-stone-100'
            }`}
          >
            Deep Dives
          </a>
          <a
            href="/category/design-tech"
            onClick={(e) => {
              e.preventDefault();
              onSelectCategory('Design & Tech');
            }}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 ${
              activeCategory === 'Design & Tech'
                ? 'text-amber-600 dark:text-amber-400 font-semibold border-b-2 border-amber-500'
                : 'text-stone-600 dark:text-neutral-400 hover:text-stone-900 dark:hover:text-stone-100'
            }`}
          >
            Design & Tech
          </a>
          <a
            href="/category/culture-indie"
            onClick={(e) => {
              e.preventDefault();
              onSelectCategory('Culture & Indie');
            }}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 ${
              activeCategory === 'Culture & Indie'
                ? 'text-amber-600 dark:text-amber-400 font-semibold border-b-2 border-amber-500'
                : 'text-stone-600 dark:text-neutral-400 hover:text-stone-900 dark:hover:text-stone-100'
            }`}
          >
            Culture & Indie
          </a>
          <a
            href="/category/esports-retro"
            onClick={(e) => {
              e.preventDefault();
              onSelectCategory('Esports & Retro');
            }}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 ${
              activeCategory === 'Esports & Retro'
                ? 'text-amber-600 dark:text-amber-400 font-semibold border-b-2 border-amber-500'
                : 'text-stone-600 dark:text-neutral-400 hover:text-stone-900 dark:hover:text-stone-100'
            }`}
          >
            Esports & Retro
          </a>
        </nav>

        {/* Zone 3: 1 primary action + theme toggle */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={onToggleTheme}
            aria-label="Toggle visual theme between dark and light"
            className="p-2 text-stone-600 dark:text-neutral-400 hover:text-stone-900 dark:hover:text-stone-100 rounded-md hover:bg-stone-200/50 dark:hover:bg-neutral-800 transition-colors"
          >
            {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-stone-700" />}
          </button>

          <a
            href="/saved"
            onClick={(e) => {
              e.preventDefault();
              onOpenSaved();
            }}
            className="flex items-center gap-2 px-3.5 py-1.5 text-xs font-semibold rounded-md border border-stone-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-stone-800 dark:text-neutral-200 hover:bg-stone-100 dark:hover:bg-neutral-800 transition-colors whitespace-nowrap shrink-0"
          >
            <Bookmark className={`w-3.5 h-3.5 ${savedCount > 0 ? 'fill-amber-500 text-amber-500' : ''}`} />
            <span>Saved Reading List</span>
            {savedCount > 0 && (
              <span className="font-data text-[11px] tabular-nums text-amber-600 dark:text-amber-400">
                ({savedCount})
              </span>
            )}
          </a>

          <button
            onClick={onOpenNewsletter}
            className="hidden sm:inline-flex items-center gap-1.5 px-4 py-1.5 text-xs font-medium text-white bg-stone-900 dark:bg-stone-100 dark:text-stone-950 rounded-md hover:bg-stone-800 dark:hover:bg-white transition-colors whitespace-nowrap shrink-0 shadow-xs"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Subscribe to Weekly Dispatch</span>
          </button>
        </div>
      </div>
    </header>
  );
};
