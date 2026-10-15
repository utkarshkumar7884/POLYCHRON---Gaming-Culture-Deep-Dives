import React from 'react';
import { BlogPost } from '../types';
import { ArticleImage } from './ArticleImage';
import { Bookmark, Clock, ArrowRight, Heart } from 'lucide-react';

interface BlogCardProps {
  post: BlogPost;
  onSelect: (post: BlogPost) => void;
  isSaved: boolean;
  onToggleSave: (e: React.MouseEvent, post: BlogPost) => void;
  viewMode?: 'grid' | 'editorial';
}

export const BlogCard: React.FC<BlogCardProps> = ({
  post,
  onSelect,
  isSaved,
  onToggleSave,
  viewMode = 'grid',
}) => {
  if (viewMode === 'editorial') {
    return (
      <article className="group py-6 border-b border-stone-200 dark:border-neutral-800 flex flex-col md:flex-row gap-6 items-start justify-between hover:bg-stone-100/50 dark:hover:bg-neutral-900/40 p-4 rounded-lg transition-colors">
        <div className="flex-1 flex flex-col">
          {/* Metadata */}
          <div className="flex items-center gap-2 text-xs text-stone-500 dark:text-neutral-400 mb-2">
            <span className="font-semibold text-amber-700 dark:text-amber-400 uppercase tracking-wider text-[11px]">
              {post.categoryGroup}
            </span>
            <span aria-hidden="true">·</span>
            <span>{post.publishedAt}</span>
            <span aria-hidden="true">·</span>
            <span className="font-data tabular-nums">{post.readTimeMinutes} min read</span>
            <span aria-hidden="true">·</span>
            <span className="font-data text-stone-700 dark:text-neutral-300">Score {post.ratingScore}</span>
          </div>

          <h3 className="font-editorial text-2xl font-medium text-stone-900 dark:text-stone-100 mb-2 [text-wrap:balance]">
            <a
              href={post.urlPath}
              onClick={(e) => {
                e.preventDefault();
                onSelect(post);
              }}
              className="hover:text-amber-600 dark:hover:text-amber-400 transition-colors"
            >
              {post.title}
            </a>
          </h3>

          <p className="text-sm text-stone-600 dark:text-neutral-300 font-editorial leading-relaxed mb-3 line-clamp-2 max-w-3xl">
            {post.excerpt}
          </p>

          {/* Keywords transparency */}
          <div className="text-[11px] text-stone-400 dark:text-neutral-500 mb-3">
            <span className="font-semibold text-stone-600 dark:text-neutral-400">Target Keywords: </span>
            <span className="font-mono">{post.seo.mainKeyword}</span> · {post.seo.relatedKeywords[0]}
          </div>

          <div className="flex items-center gap-6 text-xs text-stone-500 dark:text-neutral-400 mt-auto">
            <div className="flex items-center gap-2">
              <img
                src={post.author.avatar}
                alt={`Photo of author ${post.author.name}`}
                referrerPolicy="no-referrer"
                loading="lazy"
                className="w-5 h-5 rounded-full object-cover"
              />
              <span className="font-medium text-stone-800 dark:text-stone-300">{post.author.name}</span>
            </div>
            <div className="flex items-center gap-1 font-data tabular-nums">
              <Heart className="w-3.5 h-3.5 text-stone-400" />
              <span>{post.likes}</span>
            </div>
            <a
              href={post.urlPath}
              onClick={(e) => {
                e.preventDefault();
                onSelect(post);
              }}
              className="text-amber-600 dark:text-amber-400 hover:underline font-medium ml-auto flex items-center gap-1"
            >
              <span>Read complete critique</span>
              <ArrowRight className="w-3 h-3" />
            </a>
          </div>
        </div>

        <div className="w-full md:w-52 shrink-0 relative overflow-hidden rounded-md border border-stone-200 dark:border-neutral-800">
          <a
            href={post.urlPath}
            onClick={(e) => {
              e.preventDefault();
              onSelect(post);
            }}
            title={`Read ${post.title}`}
            className="block"
          >
            <ArticleImage
              src={post.heroImage}
              alt={post.imageAlt}
              category={post.category}
              aspectRatio="16:9"
              sizeConstraint="small"
              className="group-hover:scale-103 transition-transform duration-500"
            />
          </a>
          <button
            onClick={(e) => onToggleSave(e, post)}
            aria-label={isSaved ? `Remove ${post.title} from saved reading list` : `Save ${post.title} to reading list`}
            className="absolute top-2 right-2 p-1.5 rounded-md bg-stone-900/80 hover:bg-stone-900 text-stone-200 backdrop-blur-md transition-colors"
          >
            <Bookmark className={`w-3.5 h-3.5 ${isSaved ? 'fill-amber-400 text-amber-400' : ''}`} />
          </button>
        </div>
      </article>
    );
  }

  return (
    <article className="group flex flex-col h-full bg-white dark:bg-[#121316] rounded-lg border border-stone-200 dark:border-neutral-800/80 overflow-hidden shadow-xs hover:border-amber-400/40 dark:hover:border-neutral-700 transition-all duration-300">
      {/* Visual Header */}
      <div className="relative overflow-hidden">
        <a
          href={post.urlPath}
          onClick={(e) => {
            e.preventDefault();
            onSelect(post);
          }}
          title={`Read article: ${post.title}`}
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
        <button
          onClick={(e) => onToggleSave(e, post)}
          aria-label={isSaved ? `Remove ${post.title} from saved reading list` : `Save ${post.title} to reading list`}
          className="absolute top-3 right-3 z-10 p-2 rounded-md bg-stone-900/75 hover:bg-stone-900 text-stone-200 backdrop-blur-md transition-colors shadow-sm"
        >
          <Bookmark className={`w-3.5 h-3.5 ${isSaved ? 'fill-amber-400 text-amber-400' : ''}`} />
        </button>
      </div>

      {/* Card Content Container */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Clean Unboxed Metadata */}
          <div className="flex items-center gap-2 text-xs text-stone-500 dark:text-neutral-400 mb-2">
            <span className="font-semibold text-amber-700 dark:text-amber-400 uppercase tracking-wider text-[11px]">
              {post.categoryGroup}
            </span>
            <span aria-hidden="true">·</span>
            <span className="font-data tabular-nums flex items-center gap-1">
              <Clock className="w-3 h-3 inline" />
              {post.readTimeMinutes} min
            </span>
          </div>

          {/* Title as Anchor */}
          <h3 className="font-editorial text-xl font-medium text-stone-900 dark:text-stone-100 leading-snug mb-2.5 [text-wrap:balance]">
            <a
              href={post.urlPath}
              onClick={(e) => {
                e.preventDefault();
                onSelect(post);
              }}
              className="hover:text-amber-600 dark:hover:text-amber-400 transition-colors"
            >
              {post.title}
            </a>
          </h3>

          {/* Excerpt */}
          <p className="text-sm text-stone-600 dark:text-neutral-400 font-editorial leading-relaxed line-clamp-3 mb-3">
            {post.excerpt}
          </p>

          {/* Keyword Transparency indicator */}
          <div className="text-[11px] text-stone-400 dark:text-neutral-500 mb-3 truncate">
            <span className="font-medium text-stone-600 dark:text-neutral-400">Keyword: </span>
            <span className="font-mono text-stone-600 dark:text-neutral-300">{post.seo.mainKeyword}</span>
          </div>
        </div>

        {/* Card Footer: Author + Score + Descriptive Anchor Link */}
        <div className="pt-4 border-t border-stone-100 dark:border-neutral-800/80 flex items-center justify-between text-xs text-stone-500 dark:text-neutral-400 mt-auto">
          <div className="flex items-center gap-2">
            <img
              src={post.author.avatar}
              alt={`Avatar of writer ${post.author.name}`}
              referrerPolicy="no-referrer"
              loading="lazy"
              className="w-6 h-6 rounded-full object-cover border border-stone-200 dark:border-neutral-700"
            />
            <span className="font-medium text-stone-800 dark:text-stone-300 truncate max-w-[100px]">
              {post.author.name}
            </span>
          </div>

          <a
            href={post.urlPath}
            onClick={(e) => {
              e.preventDefault();
              onSelect(post);
            }}
            className="text-amber-600 dark:text-amber-400 hover:underline font-semibold flex items-center gap-1"
          >
            <span>Read full critique</span>
            <ArrowRight className="w-3 h-3" />
          </a>
        </div>
      </div>
    </article>
  );
};
