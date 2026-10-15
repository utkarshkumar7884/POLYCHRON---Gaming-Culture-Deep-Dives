import React from 'react';
import { CategoryFilter } from '../types';

interface FooterProps {
  onSelectCategory: (cat: CategoryFilter) => void;
  onOpenNewsletter: () => void;
  onScrollToTop: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onSelectCategory,
  onOpenNewsletter,
  onScrollToTop,
}) => {
  return (
    <footer className="border-t border-stone-200 dark:border-neutral-800 bg-white dark:bg-[#0c0d0e] transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
          
          {/* Brand & Manifesto */}
          <div className="md:col-span-5 space-y-4">
            <div className="flex items-baseline gap-2">
              <a
                href="/"
                className="font-brand text-2xl font-bold tracking-wider text-stone-900 dark:text-stone-100 hover:text-amber-600 transition-colors"
                title="Polychron Gaming Journal"
              >
                POLYCHRON
              </a>
              <span className="text-xs uppercase tracking-widest text-stone-500 font-sans">
                Est. 2026
              </span>
            </div>
            <p className="text-sm text-stone-600 dark:text-neutral-400 font-editorial leading-relaxed max-w-sm">
              An independent journal of video game aesthetics, acoustic architecture, and system psychology. Published in long-form essays without advertisements or algorithmic clickbait.
            </p>
            <div className="text-xs text-stone-400 dark:text-neutral-500 font-data pt-2">
              Print Edition · Vol. XIV · Digital Monograph
            </div>
          </div>

          {/* Departments with Descriptive Anchor Texts */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="text-xs uppercase tracking-widest font-semibold text-stone-900 dark:text-stone-200">
              Critique Sections
            </h4>
            <ul className="space-y-2 text-xs text-stone-600 dark:text-neutral-400">
              <li>
                <a
                  href="/category/deep-dives"
                  onClick={(e) => {
                    e.preventDefault();
                    onSelectCategory('Deep Dives');
                  }}
                  className="hover:text-amber-600 dark:hover:text-amber-400 transition-colors"
                >
                  Browse Deep Dives and World Design essays
                </a>
              </li>
              <li>
                <a
                  href="/category/design-tech"
                  onClick={(e) => {
                    e.preventDefault();
                    onSelectCategory('Design & Tech');
                  }}
                  className="hover:text-amber-600 dark:hover:text-amber-400 transition-colors"
                >
                  Browse Engine Tech and Acoustics essays
                </a>
              </li>
              <li>
                <a
                  href="/category/culture-indie"
                  onClick={(e) => {
                    e.preventDefault();
                    onSelectCategory('Culture & Indie');
                  }}
                  className="hover:text-amber-600 dark:hover:text-amber-400 transition-colors"
                >
                  Browse Culture and Indie Spaces essays
                </a>
              </li>
              <li>
                <a
                  href="/category/esports-retro"
                  onClick={(e) => {
                    e.preventDefault();
                    onSelectCategory('Esports & Retro');
                  }}
                  className="hover:text-amber-600 dark:hover:text-amber-400 transition-colors"
                >
                  Browse Esports, Speedruns and Retro essays
                </a>
              </li>
            </ul>
          </div>

          {/* Publication & Actions */}
          <div className="md:col-span-4 space-y-3">
            <h4 className="text-xs uppercase tracking-widest font-semibold text-stone-900 dark:text-stone-200">
              Reader Dispatches
            </h4>
            <p className="text-xs text-stone-600 dark:text-neutral-400 font-editorial leading-relaxed">
              Every Sunday morning, we publish an essay on level geometry, adaptive music theory, or classic glitches.
            </p>
            <button
              onClick={onOpenNewsletter}
              className="inline-flex items-center text-xs font-semibold text-amber-700 dark:text-amber-400 hover:underline"
            >
              <span>Subscribe to the Polychron Weekly Dispatch →</span>
            </button>
          </div>

        </div>

        {/* Bottom Hairline Divider */}
        <div className="mt-12 pt-8 border-t border-stone-200 dark:border-neutral-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-500 dark:text-neutral-500">
          <div>
            © 2026 Polychron Interactive Media. All ten essays authored with editorial care.
          </div>
          <button
            onClick={onScrollToTop}
            className="hover:text-stone-900 dark:hover:text-stone-100 transition-colors"
          >
            <span>Return to top of page ↑</span>
          </button>
        </div>
      </div>
    </footer>
  );
};
