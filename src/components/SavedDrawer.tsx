import React from 'react';
import { BlogPost } from '../types';
import { X, Trash2, ArrowRight, Bookmark } from 'lucide-react';
import { ArticleImage } from './ArticleImage';

interface SavedDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  savedPosts: BlogPost[];
  onSelectPost: (post: BlogPost) => void;
  onRemoveSaved: (id: string) => void;
  onClearAll: () => void;
}

export const SavedDrawer: React.FC<SavedDrawerProps> = ({
  isOpen,
  onClose,
  savedPosts,
  onSelectPost,
  onRemoveSaved,
  onClearAll,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
      />

      {/* Drawer */}
      <div className="absolute inset-y-0 right-0 max-w-md w-full bg-stone-50 dark:bg-[#101114] shadow-2xl flex flex-col border-l border-stone-200 dark:border-neutral-800">
        {/* Drawer Header */}
        <div className="p-5 border-b border-stone-200 dark:border-neutral-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bookmark className="w-4 h-4 text-amber-500 fill-amber-500" />
            <h2 className="font-editorial text-xl font-semibold text-stone-900 dark:text-stone-100">
              Saved Reading List
            </h2>
            <span className="text-xs font-data text-stone-500 tabular-nums">
              ({savedPosts.length})
            </span>
          </div>
          <button
            onClick={onClose}
            aria-label="Close saved reading list drawer"
            className="p-1.5 rounded-md hover:bg-stone-200 dark:hover:bg-neutral-800 text-stone-500 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Drawer Content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {savedPosts.length === 0 ? (
            <div className="text-center py-16 px-4">
              <Bookmark className="w-10 h-10 text-stone-300 dark:text-neutral-700 mx-auto mb-3" />
              <p className="font-editorial text-lg text-stone-800 dark:text-stone-200 mb-1">
                Your reading list is empty
              </p>
              <p className="text-xs text-stone-500 dark:text-neutral-400 max-w-xs mx-auto">
                Click the bookmark icon on any gaming critique or deep dive to save it for offline contemplation.
              </p>
            </div>
          ) : (
            savedPosts.map((post) => (
              <div
                key={post.id}
                className="group relative p-3 rounded-lg border border-stone-200 dark:border-neutral-800 bg-white dark:bg-[#141518] flex gap-3 hover:border-amber-400/40 transition-colors"
              >
                <div className="w-20 shrink-0 rounded overflow-hidden">
                  <a
                    href={post.urlPath}
                    onClick={(e) => {
                      e.preventDefault();
                      onSelectPost(post);
                      onClose();
                    }}
                    title={`Open saved article: ${post.title}`}
                    className="block"
                  >
                    <ArticleImage
                      src={post.heroImage}
                      alt={post.imageAlt}
                      category={post.category}
                      aspectRatio="16:9"
                      sizeConstraint="small"
                    />
                  </a>
                </div>

                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] font-semibold uppercase text-amber-700 dark:text-amber-400">
                      {post.categoryGroup} · {post.readTimeMinutes}m
                    </span>
                    <h3 className="font-editorial text-sm font-medium text-stone-900 dark:text-stone-100 line-clamp-2 mt-0.5">
                      <a
                        href={post.urlPath}
                        onClick={(e) => {
                          e.preventDefault();
                          onSelectPost(post);
                          onClose();
                        }}
                        className="hover:text-amber-600 transition-colors"
                      >
                        {post.title}
                      </a>
                    </h3>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-stone-400 pt-2">
                    <span>By {post.author.name}</span>
                    <button
                      onClick={() => onRemoveSaved(post.id)}
                      className="text-stone-400 hover:text-rose-500 transition-colors p-1"
                      aria-label={`Remove ${post.title} from saved reading list`}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Drawer Footer */}
        {savedPosts.length > 0 && (
          <div className="p-4 border-t border-stone-200 dark:border-neutral-800 bg-stone-100/60 dark:bg-[#0c0d0e]/60 flex items-center justify-between">
            <button
              onClick={onClearAll}
              className="text-xs text-stone-500 hover:text-rose-600 dark:hover:text-rose-400 transition-colors"
            >
              <span>Clear all saved essays</span>
            </button>
            <a
              href={savedPosts[0].urlPath}
              onClick={(e) => {
                e.preventDefault();
                onSelectPost(savedPosts[0]);
                onClose();
              }}
              className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-stone-900 dark:bg-stone-100 dark:text-stone-950 rounded-md hover:bg-stone-800 transition-colors"
            >
              <span>Read first saved essay</span>
              <ArrowRight className="w-3 h-3" />
            </a>
          </div>
        )}
      </div>
    </div>
  );
};
