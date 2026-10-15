import React from 'react';
import { BlogPost, CategoryFilter, SortOption, ViewMode } from '../types';
import { BlogCard } from './BlogCard';
import { Search, LayoutGrid, List, SlidersHorizontal, X } from 'lucide-react';

interface BlogGridProps {
  posts: BlogPost[];
  allPostsCount: number;
  activeCategory: CategoryFilter;
  onSelectCategory: (cat: CategoryFilter) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  sortBy: SortOption;
  onSortChange: (sort: SortOption) => void;
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  onSelectPost: (post: BlogPost) => void;
  isSaved: (id: string) => boolean;
  onToggleSave: (e: React.MouseEvent, post: BlogPost) => void;
  onClearFilters: () => void;
}

export const BlogGrid: React.FC<BlogGridProps> = ({
  posts,
  allPostsCount,
  activeCategory,
  onSelectCategory,
  searchQuery,
  onSearchChange,
  sortBy,
  onSortChange,
  viewMode,
  onViewModeChange,
  onSelectPost,
  isSaved,
  onToggleSave,
  onClearFilters,
}) => {
  const categories: CategoryFilter[] = [
    'All',
    'Deep Dives',
    'Design & Tech',
    'Culture & Indie',
    'Esports & Retro',
  ];

  return (
    <section className="mb-20">
      {/* Controls Bar: Search, Category Buttons, Sorting & View Toggle */}
      <div className="flex flex-col gap-5 mb-8">
        
        {/* Row 1: Search & Sort & View Mode */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          {/* Search Input */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400 dark:text-neutral-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search 10 gaming essays, authors, or mechanics..."
              className="w-full pl-10 pr-9 py-2 text-sm bg-white dark:bg-[#121316] border border-stone-200 dark:border-neutral-800 rounded-lg text-stone-900 dark:text-stone-100 placeholder-stone-400 dark:placeholder-neutral-500 focus:outline-none focus:border-amber-500 dark:focus:border-amber-400 transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => onSearchChange('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700 dark:hover:text-stone-200"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Sort & View Mode Controls */}
          <div className="flex items-center gap-3 self-end sm:self-auto">
            <div className="flex items-center gap-2 text-xs text-stone-500 dark:text-neutral-400">
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <label htmlFor="sort-select" className="sr-only">Sort Articles</label>
              <select
                id="sort-select"
                value={sortBy}
                onChange={(e) => onSortChange(e.target.value as SortOption)}
                className="bg-white dark:bg-[#121316] border border-stone-200 dark:border-neutral-800 rounded-md py-1.5 px-2.5 text-xs text-stone-800 dark:text-stone-200 focus:outline-none focus:border-amber-500 font-medium"
              >
                <option value="latest">Sort: Latest Published</option>
                <option value="popular">Sort: Most Popular</option>
                <option value="readTime">Sort: Reading Time</option>
                <option value="rating">Sort: Critical Score</option>
              </select>
            </div>

            {/* View Mode Toggle */}
            <div className="flex items-center bg-stone-200/70 dark:bg-neutral-800 p-1 rounded-md">
              <button
                onClick={() => onViewModeChange('grid')}
                aria-label="Grid layout"
                className={`p-1.5 rounded transition-colors ${
                  viewMode === 'grid'
                    ? 'bg-white dark:bg-neutral-900 text-stone-900 dark:text-stone-100 shadow-xs'
                    : 'text-stone-600 dark:text-neutral-400 hover:text-stone-900'
                }`}
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                onClick={() => onViewModeChange('editorial')}
                aria-label="Editorial list layout"
                className={`p-1.5 rounded transition-colors ${
                  viewMode === 'editorial'
                    ? 'bg-white dark:bg-neutral-900 text-stone-900 dark:text-stone-100 shadow-xs'
                    : 'text-stone-600 dark:text-neutral-400 hover:text-stone-900'
                }`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Row 2: Interactive Filter Buttons (allowed as functional controls) */}
        <div className="flex items-center justify-between border-b border-stone-200 dark:border-neutral-800 pb-3 overflow-x-auto no-scrollbar">
          <div className="flex items-center gap-1.5">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => onSelectCategory(cat)}
                className={`px-3.5 py-1.5 text-xs font-medium rounded-md whitespace-nowrap shrink-0 transition-colors ${
                  activeCategory === cat
                    ? 'bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-950 font-semibold shadow-xs'
                    : 'text-stone-600 dark:text-neutral-400 hover:bg-stone-200/50 dark:hover:bg-neutral-800 hover:text-stone-900 dark:hover:text-stone-100'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="text-xs text-stone-500 dark:text-neutral-500 font-data whitespace-nowrap shrink-0 pl-4">
            Showing <span className="tabular-nums font-semibold text-stone-800 dark:text-stone-200">{posts.length}</span> of <span className="tabular-nums">{allPostsCount}</span> essays
          </div>
        </div>

      </div>

      {/* Grid or Editorial View */}
      {posts.length === 0 ? (
        <div className="text-center py-20 border border-dashed border-stone-300 dark:border-neutral-800 rounded-xl p-8">
          <p className="font-editorial text-2xl text-stone-800 dark:text-stone-200 mb-2">
            No gaming essays match your filter
          </p>
          <p className="text-sm text-stone-500 dark:text-neutral-400 mb-6">
            Try adjusting your search query or reset category filters to view all 10 essays.
          </p>
          <button
            onClick={onClearFilters}
            className="px-4 py-2 text-xs font-semibold bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 rounded-md hover:bg-stone-800 transition-colors"
          >
            Reset All Filters
          </button>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {posts.map((post) => (
            <BlogCard
              key={post.id}
              post={post}
              onSelect={onSelectPost}
              isSaved={isSaved(post.id)}
              onToggleSave={onToggleSave}
              viewMode="grid"
            />
          ))}
        </div>
      ) : (
        <div className="divide-y divide-stone-200 dark:divide-neutral-800">
          {posts.map((post) => (
            <BlogCard
              key={post.id}
              post={post}
              onSelect={onSelectPost}
              isSaved={isSaved(post.id)}
              onToggleSave={onToggleSave}
              viewMode="editorial"
            />
          ))}
        </div>
      )}
    </section>
  );
};
