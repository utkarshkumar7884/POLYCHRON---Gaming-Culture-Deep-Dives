import React from 'react';
import { BlogPost } from '../types';
import { ArticleImage } from './ArticleImage';
import { ArrowUpRight, Bookmark, Clock, Tag } from 'lucide-react';

interface HeroFeaturedProps {
  leadPost: BlogPost;
  secondaryPosts: BlogPost[];
  onSelectPost: (post: BlogPost) => void;
  isSaved: (id: string) => boolean;
  onToggleSave: (e: React.MouseEvent, post: BlogPost) => void;
}

export const HeroFeatured: React.FC<HeroFeaturedProps> = ({
  leadPost,
  secondaryPosts,
  onSelectPost,
  isSaved,
  onToggleSave,
}) => {
  return (
    <section className="mb-14 border-b border-stone-200 dark:border-neutral-800 pb-12">
      {/* Editorial Department Header */}
      <div className="flex items-center justify-between border-b border-stone-300 dark:border-neutral-800 pb-3 mb-8">
        <div className="flex items-center gap-3">
          <span className="text-xs uppercase tracking-widest text-stone-900 dark:text-stone-200 font-semibold">
            The Lead Critique
          </span>
          <span className="text-stone-400 dark:text-neutral-600" aria-hidden="true">·</span>
          <span className="text-xs text-stone-500 dark:text-neutral-500 font-data">
            Vol. XIV Edition
          </span>
        </div>
        <span className="text-xs text-stone-500 dark:text-neutral-500 font-data hidden sm:inline">
          Curated Editorial Selection
        </span>
      </div>

      {/* 3-Tier Salience Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-stretch">
        
        {/* Tier 1: Dominant Lead Story (Col 1-8) */}
        <div className="lg:col-span-8 flex flex-col group">
          <div className="relative overflow-hidden rounded-md border border-stone-200 dark:border-neutral-800 mb-5 shadow-xs max-w-3xl">
            <a
              href={leadPost.urlPath}
              onClick={(e) => {
                e.preventDefault();
                onSelectPost(leadPost);
              }}
              title={`Read ${leadPost.title}`}
              className="block"
            >
              <ArticleImage
                src={leadPost.heroImage}
                alt={leadPost.imageAlt}
                category={leadPost.category}
                aspectRatio="16:9"
                priority={true}
                sizeConstraint="standard"
                className="group-hover:scale-[1.01] transition-transform duration-500 ease-out"
              />
            </a>
            {/* Quick action button inside media corner */}
            <button
              onClick={(e) => onToggleSave(e, leadPost)}
              aria-label={isSaved(leadPost.id) ? 'Remove lead essay from saved reading list' : 'Save lead essay to reading list'}
              className="absolute top-4 right-4 z-10 p-2.5 rounded-md bg-stone-900/80 hover:bg-stone-900 text-stone-200 backdrop-blur-md transition-colors shadow-md"
            >
              <Bookmark className={`w-4 h-4 ${isSaved(leadPost.id) ? 'fill-amber-400 text-amber-400' : ''}`} />
            </button>
          </div>

          {/* Clean Unboxed Metadata */}
          <div className="flex flex-wrap items-center gap-2 text-xs text-stone-500 dark:text-neutral-400 mb-2.5">
            <span className="font-semibold text-amber-700 dark:text-amber-400 tracking-wide uppercase">
              {leadPost.category}
            </span>
            <span aria-hidden="true">·</span>
            <span>{leadPost.publishedAt}</span>
            <span aria-hidden="true">·</span>
            <span className="flex items-center gap-1 font-data tabular-nums">
              <Clock className="w-3 h-3 inline" />
              {leadPost.readTimeMinutes} min read
            </span>
            <span aria-hidden="true">·</span>
            <span className="font-data font-semibold text-stone-800 dark:text-stone-200">
              Score: {leadPost.ratingScore}
            </span>
          </div>

          {/* Lead Headline as Semantic Link */}
          <h1 className="font-editorial text-3xl sm:text-4xl lg:text-[2.65rem] font-medium leading-[1.18] text-stone-900 dark:text-stone-100 mb-3 [text-wrap:balance]">
            <a
              href={leadPost.urlPath}
              onClick={(e) => {
                e.preventDefault();
                onSelectPost(leadPost);
              }}
              className="hover:text-amber-600 dark:hover:text-amber-400 transition-colors"
            >
              {leadPost.title}
            </a>
          </h1>

          {/* Deck/Subtitle */}
          <p className="text-base sm:text-lg text-stone-600 dark:text-neutral-300 font-editorial leading-relaxed mb-4 line-clamp-3">
            {leadPost.subtitle}
          </p>

          {/* Keyword Transparency Badge for AI Studio & Searchers */}
          <div className="flex flex-wrap items-center gap-2 mb-4 text-[11px] text-stone-500 dark:text-neutral-400">
            <span className="flex items-center gap-1 font-semibold text-stone-700 dark:text-stone-300">
              <Tag className="w-3 h-3 text-amber-600" />
              Main Keyword:
            </span>
            <span className="font-mono text-amber-700 dark:text-amber-400">{leadPost.seo.mainKeyword}</span>
            <span aria-hidden="true">·</span>
            <span>Related: {leadPost.seo.relatedKeywords.join(', ')}</span>
          </div>

          {/* Author Byline with Explicit Link Anchor Text */}
          <div className="flex items-center justify-between mt-auto pt-3 border-t border-stone-200 dark:border-neutral-800 text-xs text-stone-500 dark:text-neutral-400">
            <div className="flex items-center gap-2.5">
              <img
                src={leadPost.author.avatar}
                alt={`Portrait of ${leadPost.author.name}, ${leadPost.author.title}`}
                referrerPolicy="no-referrer"
                loading="lazy"
                className="w-7 h-7 rounded-full object-cover border border-stone-300 dark:border-neutral-700"
              />
              <div>
                <span className="font-semibold text-stone-900 dark:text-stone-200">
                  {leadPost.author.name}
                </span>
                <span className="text-stone-400 dark:text-neutral-500 ml-1.5 hidden sm:inline">
                  {leadPost.author.title}
                </span>
              </div>
            </div>
            
            <a
              href={leadPost.urlPath}
              onClick={(e) => {
                e.preventDefault();
                onSelectPost(leadPost);
              }}
              className="flex items-center gap-1 text-amber-600 dark:text-amber-400 font-medium hover:underline transition-transform"
            >
              <span>Read the full Elden Ring open world critique</span>
              <ArrowUpRight className="w-4 h-4" />
            </a>
          </div>
        </div>

        {/* Tier 2: Secondary Features Rail (Col 9-12) */}
        <div className="lg:col-span-4 flex flex-col justify-between divide-y divide-stone-200 dark:divide-neutral-800">
          <div className="pb-3 mb-2">
            <span className="text-xs uppercase tracking-widest text-stone-500 dark:text-neutral-400 font-semibold">
              Essential Dispatches
            </span>
          </div>

          {secondaryPosts.slice(0, 2).map((post) => (
            <article
              key={post.id}
              className="group flex flex-col py-6 first:pt-2 last:pb-0"
            >
              <div className="relative overflow-hidden rounded-md border border-stone-200 dark:border-neutral-800 mb-3 shadow-xs">
                <a
                  href={post.urlPath}
                  onClick={(e) => {
                    e.preventDefault();
                    onSelectPost(post);
                  }}
                  title={`Read essay: ${post.title}`}
                  className="block"
                >
                  <ArticleImage
                    src={post.heroImage}
                    alt={post.imageAlt}
                    category={post.category}
                    aspectRatio="16:9"
                    sizeConstraint="standard"
                    className="group-hover:scale-103 transition-transform duration-500 ease-out"
                  />
                </a>
              </div>

              {/* Unboxed Metadata */}
              <div className="flex items-center gap-2 text-xs text-stone-500 dark:text-neutral-400 mb-1.5">
                <span className="text-amber-700 dark:text-amber-400 font-medium uppercase tracking-wider text-[11px]">
                  {post.categoryGroup}
                </span>
                <span aria-hidden="true">·</span>
                <span className="font-data tabular-nums">{post.readTimeMinutes} min</span>
              </div>

              <h2 className="font-editorial text-xl font-medium text-stone-900 dark:text-stone-100 leading-snug mb-2 [text-wrap:balance]">
                <a
                  href={post.urlPath}
                  onClick={(e) => {
                    e.preventDefault();
                    onSelectPost(post);
                  }}
                  className="hover:text-amber-600 dark:hover:text-amber-400 transition-colors"
                >
                  {post.title}
                </a>
              </h2>

              <p className="text-sm text-stone-600 dark:text-neutral-400 line-clamp-2 leading-relaxed mb-3 font-editorial">
                {post.excerpt}
              </p>

              <div className="flex items-center justify-between text-xs text-stone-500 dark:text-neutral-500 pt-2">
                <span>By {post.author.name}</span>
                <a
                  href={post.urlPath}
                  onClick={(e) => {
                    e.preventDefault();
                    onSelectPost(post);
                  }}
                  className="text-amber-600 dark:text-amber-400 hover:underline font-medium"
                >
                  Read full critique →
                </a>
              </div>
            </article>
          ))}
        </div>

      </div>
    </section>
  );
};
