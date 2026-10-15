import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { BLOG_POSTS } from './data/blogs';
import { BlogPost, CategoryFilter, SortOption, ViewMode } from './types';
import { Header } from './components/Header';
import { HeroFeatured } from './components/HeroFeatured';
import { BlogGrid } from './components/BlogGrid';
import { ArticleView } from './components/ArticleView';
import { SavedDrawer } from './components/SavedDrawer';
import { NewsletterModal } from './components/NewsletterModal';
import { Footer } from './components/Footer';
import { updatePageSeo, HOME_SEO } from './utils/seo';

// Helper to convert category to clean URL slug
function categoryToPath(category: CategoryFilter): string {
  if (category === 'All') return '/';
  return `/category/${category.toLowerCase().replace(/ & /g, '-').replace(/\s+/g, '-')}`;
}

// Helper to match URL path to category
function pathToCategory(pathname: string): CategoryFilter | null {
  if (pathname === '/' || pathname === '') return 'All';
  if (pathname === '/category/deep-dives') return 'Deep Dives';
  if (pathname === '/category/design-tech') return 'Design & Tech';
  if (pathname === '/category/culture-indie') return 'Culture & Indie';
  if (pathname === '/category/esports-retro') return 'Esports & Retro';
  return null;
}

export default function App() {
  // Theme state - defaults to sleek gaming dark mode
  const [isDark, setIsDark] = useState<boolean>(() => {
    const saved = localStorage.getItem('polychron_theme');
    if (saved) return saved === 'dark';
    return true; // Default dark for gaming aesthetic
  });

  // Selected article ID
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);

  // Category and search filtering
  const [activeCategory, setActiveCategory] = useState<CategoryFilter>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('latest');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');

  // Bookmarked articles state
  const [savedPostIds, setSavedPostIds] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem('polychron_saved_posts');
      return stored ? JSON.parse(stored) : ['elden-ring-open-world', 'cyberpunk-2077-resurrection'];
    } catch {
      return ['elden-ring-open-world'];
    }
  });

  // Drawer & Modal state
  const [isSavedDrawerOpen, setIsSavedDrawerOpen] = useState(false);
  const [isNewsletterOpen, setIsNewsletterOpen] = useState(false);

  // Sync theme to DOM
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('polychron_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('polychron_theme', 'light');
    }
  }, [isDark]);

  // Persist saved posts
  useEffect(() => {
    try {
      localStorage.setItem('polychron_saved_posts', JSON.stringify(savedPostIds));
    } catch {
      // ignore
    }
  }, [savedPostIds]);

  // Route resolver based on pathname or hash
  const resolveRoute = useCallback(() => {
    const path = window.location.pathname;
    const hash = window.location.hash.replace('#', '');

    // Check if path matches an article urlPath or slug
    const matchedArticle = BLOG_POSTS.find(
      (p) => p.urlPath === path || p.slug === hash || p.id === hash || path.includes(p.slug)
    );

    if (matchedArticle) {
      setSelectedPostId(matchedArticle.id);
      setIsSavedDrawerOpen(false);
      updatePageSeo(matchedArticle.seo, matchedArticle);
      return;
    }

    if (path === '/saved' || hash === 'saved') {
      setIsSavedDrawerOpen(true);
      setSelectedPostId(null);
      return;
    }

    const matchedCat = pathToCategory(path);
    if (matchedCat) {
      setActiveCategory(matchedCat);
      setSelectedPostId(null);
      setIsSavedDrawerOpen(false);
      updatePageSeo({
        ...HOME_SEO,
        pageTitle: matchedCat === 'All' ? HOME_SEO.pageTitle : `${matchedCat} Gaming Essays & Critiques | Polychron`,
        canonicalPath: categoryToPath(matchedCat),
      });
      return;
    }

    // Default to Home
    setSelectedPostId(null);
    updatePageSeo(HOME_SEO);
  }, []);

  // Initialize and listen to popstate (browser back/forward)
  useEffect(() => {
    resolveRoute();
    const handlePopState = () => {
      resolveRoute();
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [resolveRoute]);

  // Handle selecting an article with clean unique URL
  const handleSelectPost = (post: BlogPost) => {
    setSelectedPostId(post.id);
    setIsSavedDrawerOpen(false);
    window.history.pushState({ postId: post.id }, '', post.urlPath);
    updatePageSeo(post.seo, post);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handle navigating home with clean URL
  const handleNavigateHome = () => {
    setSelectedPostId(null);
    setActiveCategory('All');
    setSearchQuery('');
    window.history.pushState({}, '', '/');
    updatePageSeo(HOME_SEO);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handle selecting a category with clean URL
  const handleSelectCategory = (category: CategoryFilter) => {
    setActiveCategory(category);
    setSelectedPostId(null);
    const newPath = categoryToPath(category);
    window.history.pushState({ category }, '', newPath);
    updatePageSeo({
      ...HOME_SEO,
      pageTitle: category === 'All' ? HOME_SEO.pageTitle : `${category} Gaming Essays & Critiques | Polychron`,
      canonicalPath: newPath,
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Toggle saving an article
  const handleToggleSave = (e: React.MouseEvent, post: BlogPost) => {
    e.stopPropagation();
    setSavedPostIds((prev) => {
      if (prev.includes(post.id)) {
        return prev.filter((id) => id !== post.id);
      } else {
        return [...prev, post.id];
      }
    });
  };

  const isSaved = (id: string) => savedPostIds.includes(id);

  // Filtered & sorted posts list
  const filteredPosts = useMemo(() => {
    let result = [...BLOG_POSTS];

    // Category filter
    if (activeCategory !== 'All') {
      result = result.filter((p) => p.categoryGroup === activeCategory);
    }

    // Search query filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.subtitle.toLowerCase().includes(q) ||
          p.excerpt.toLowerCase().includes(q) ||
          p.author.name.toLowerCase().includes(q) ||
          p.tags.some((t) => t.toLowerCase().includes(q)) ||
          p.category.toLowerCase().includes(q) ||
          p.seo.mainKeyword.toLowerCase().includes(q)
      );
    }

    // Sort order
    if (sortBy === 'popular') {
      result.sort((a, b) => b.likes - a.likes);
    } else if (sortBy === 'readTime') {
      result.sort((a, b) => b.readTimeMinutes - a.readTimeMinutes);
    } else if (sortBy === 'rating') {
      result.sort((a, b) => b.ratingScore.localeCompare(a.ratingScore));
    }

    return result;
  }, [activeCategory, searchQuery, sortBy]);

  // Featured and secondary posts for hero section
  const leadPost = BLOG_POSTS.find((p) => p.featured) || BLOG_POSTS[0];
  const secondaryHeroPosts = BLOG_POSTS.filter((p) => p.editorPick && p.id !== leadPost.id);

  // Saved posts objects
  const savedPosts = useMemo(() => {
    return BLOG_POSTS.filter((p) => savedPostIds.includes(p.id));
  }, [savedPostIds]);

  const activePost = selectedPostId ? BLOG_POSTS.find((p) => p.id === selectedPostId) : null;

  return (
    <div className="min-h-screen flex flex-col bg-[#fafaf9] dark:bg-[#0c0d0e] text-stone-900 dark:text-stone-100 transition-colors duration-200 selection:bg-amber-500/20 selection:text-amber-600">
      
      {/* Top Bar Header with Semantic Anchor Links */}
      <Header
        activeCategory={activeCategory}
        onNavigateHome={handleNavigateHome}
        onSelectCategory={handleSelectCategory}
        savedCount={savedPostIds.length}
        onOpenSaved={() => {
          setIsSavedDrawerOpen(true);
          window.history.pushState({}, '', '/saved');
        }}
        isDark={isDark}
        onToggleTheme={() => setIsDark((prev) => !prev)}
        onOpenNewsletter={() => setIsNewsletterOpen(true)}
      />

      {/* Main Page Area */}
      <main className="flex-1">
        {activePost ? (
          /* Single Article Reading View */
          <ArticleView
            post={activePost}
            allPosts={BLOG_POSTS}
            onBack={handleNavigateHome}
            onSelectPost={handleSelectPost}
            isSaved={isSaved(activePost.id)}
            onToggleSave={handleToggleSave}
          />
        ) : (
          /* Catalog Front-Page View */
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
            
            {/* Show Lead Hero Story when not searching and viewing 'All' */}
            {activeCategory === 'All' && !searchQuery && (
              <HeroFeatured
                leadPost={leadPost}
                secondaryPosts={secondaryHeroPosts}
                onSelectPost={handleSelectPost}
                isSaved={isSaved}
                onToggleSave={handleToggleSave}
              />
            )}

            {/* Catalog Grid of All 10 Essays */}
            <BlogGrid
              posts={filteredPosts}
              allPostsCount={BLOG_POSTS.length}
              activeCategory={activeCategory}
              onSelectCategory={handleSelectCategory}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              sortBy={sortBy}
              onSortChange={setSortBy}
              viewMode={viewMode}
              onViewModeChange={setViewMode}
              onSelectPost={handleSelectPost}
              isSaved={isSaved}
              onToggleSave={handleToggleSave}
              onClearFilters={() => {
                handleSelectCategory('All');
                setSearchQuery('');
                setSortBy('latest');
              }}
            />
          </div>
        )}
      </main>

      {/* Slide-over Saved Articles Drawer */}
      <SavedDrawer
        isOpen={isSavedDrawerOpen}
        onClose={() => {
          setIsSavedDrawerOpen(false);
          if (window.location.pathname === '/saved') {
            window.history.pushState({}, '', activePost ? activePost.urlPath : categoryToPath(activeCategory));
          }
        }}
        savedPosts={savedPosts}
        onSelectPost={handleSelectPost}
        onRemoveSaved={(id) => setSavedPostIds((prev) => prev.filter((pId) => pId !== id))}
        onClearAll={() => setSavedPostIds([])}
      />

      {/* Newsletter Subscription Modal */}
      <NewsletterModal
        isOpen={isNewsletterOpen}
        onClose={() => setIsNewsletterOpen(false)}
      />

      {/* Editorial Footer with Explicit Links */}
      <Footer
        onSelectCategory={handleSelectCategory}
        onOpenNewsletter={() => setIsNewsletterOpen(true)}
        onScrollToTop={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      />

    </div>
  );
}
