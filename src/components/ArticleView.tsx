import React, { useState, useEffect } from 'react';
import { BlogPost, CommentItem } from '../types';
import { ArticleImage } from './ArticleImage';
import { updatePageSeo } from '../utils/seo';
import { 
  ArrowLeft, 
  Bookmark, 
  Heart, 
  Share2, 
  Clock, 
  Check, 
  MessageSquare, 
  ChevronRight,
  ThumbsUp,
  Send,
  BookOpen,
  Tag,
  HelpCircle,
  FileCheck2
} from 'lucide-react';

interface ArticleViewProps {
  post: BlogPost;
  allPosts: BlogPost[];
  onBack: () => void;
  onSelectPost: (post: BlogPost) => void;
  isSaved: boolean;
  onToggleSave: (e: React.MouseEvent, post: BlogPost) => void;
}

export const ArticleView: React.FC<ArticleViewProps> = ({
  post,
  allPosts,
  onBack,
  onSelectPost,
  isSaved,
  onToggleSave,
}) => {
  // Update document title, meta tags, and JSON-LD schema dynamically
  useEffect(() => {
    updatePageSeo(post.seo, post);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [post]);

  // Reading state
  const [scrollProgress, setScrollProgress] = useState(0);
  const [fontSize, setFontSize] = useState<'normal' | 'large' | 'larger'>('normal');
  const [likes, setLikes] = useState(post.likes);
  const [hasLiked, setHasLiked] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [activeSectionId, setActiveSectionId] = useState(post.sections[0]?.id || '');
  
  // Comments state
  const [comments, setComments] = useState<CommentItem[]>(post.comments || []);
  const [authorName, setAuthorName] = useState('');
  const [commentText, setCommentText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Scroll listener for reading progress bar and active TOC section
  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        const progress = Math.min(100, Math.max(0, (window.scrollY / totalHeight) * 100));
        setScrollProgress(progress);
      }

      // Check active section
      for (const section of post.sections) {
        const element = document.getElementById(section.id);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= 220 && rect.bottom >= 80) {
            setActiveSectionId(section.id);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [post]);

  // Scroll to section smoothly
  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setActiveSectionId(id);
    }
  };

  // Like / Applause handler
  const handleLike = () => {
    if (hasLiked) {
      setLikes((prev) => prev - 1);
      setHasLiked(false);
    } else {
      setLikes((prev) => prev + 1);
      setHasLiked(true);
    }
  };

  // Copy share link
  const handleShare = () => {
    const shareUrl = `${window.location.origin}${post.urlPath}`;
    navigator.clipboard?.writeText(shareUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  // Submit comment
  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    setIsSubmitting(true);
    const newComment: CommentItem = {
      id: `comment-${Date.now()}`,
      author: authorName.trim() || 'Fellow Player',
      avatar: '/images/avatars/reader_avatar.svg',
      date: 'Just now',
      content: commentText.trim(),
      upvotes: 1,
      userUpvoted: true,
    };

    setTimeout(() => {
      setComments((prev) => [newComment, ...prev]);
      setCommentText('');
      setIsSubmitting(false);
    }, 200);
  };

  // Upvote comment
  const handleUpvoteComment = (commentId: string) => {
    setComments((prev) =>
      prev.map((c) => {
        if (c.id === commentId) {
          const userUpvoted = !c.userUpvoted;
          return {
            ...c,
            upvotes: userUpvoted ? c.upvotes + 1 : c.upvotes - 1,
            userUpvoted,
          };
        }
        return c;
      })
    );
  };

  // Find related posts
  const relatedPosts = allPosts
    .filter((p) => p.id !== post.id && (post.relatedIds?.includes(p.id) || p.categoryGroup === post.categoryGroup))
    .slice(0, 3);

  const fontClass =
    fontSize === 'normal'
      ? 'text-lg leading-[1.8]'
      : fontSize === 'large'
      ? 'text-xl leading-[1.85]'
      : 'text-2xl leading-[1.9]';

  return (
    <article className="min-h-screen">
      {/* Fixed top reading depth progress bar */}
      <div className="fixed top-0 left-0 right-0 h-1 bg-stone-200 dark:bg-neutral-800 z-50">
        <div
          className="h-full bg-amber-500 transition-all duration-150 ease-out"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      {/* Navigation & Controls Bar */}
      <div className="border-b border-stone-200 dark:border-neutral-800/80 bg-white/70 dark:bg-[#0c0d0e]/70 backdrop-blur-md sticky top-16 z-30 py-3 mb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
          <a
            href="/"
            onClick={(e) => {
              e.preventDefault();
              onBack();
            }}
            className="flex items-center gap-2 text-xs font-semibold text-stone-600 dark:text-neutral-400 hover:text-stone-900 dark:hover:text-stone-100 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Polychron gaming journal archive</span>
          </a>

          {/* Quick Reader Controls */}
          <div className="flex items-center gap-3">
            {/* Font size toggles with explicit labels */}
            <div className="flex items-center border border-stone-200 dark:border-neutral-800 rounded-md p-0.5 text-xs">
              <button
                onClick={() => setFontSize('normal')}
                className={`px-2 py-0.5 rounded ${fontSize === 'normal' ? 'bg-stone-200 dark:bg-neutral-800 font-bold' : 'text-stone-500'}`}
                title="Default body font size"
                aria-label="Set standard reading font size"
              >
                A
              </button>
              <button
                onClick={() => setFontSize('large')}
                className={`px-2 py-0.5 rounded ${fontSize === 'large' ? 'bg-stone-200 dark:bg-neutral-800 font-bold' : 'text-stone-500'}`}
                title="Larger body font size"
                aria-label="Set larger reading font size"
              >
                A+
              </button>
            </div>

            {/* Like with anchor text */}
            <button
              onClick={handleLike}
              aria-label={`Applause for this critique. Current claps: ${likes}`}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-medium border transition-colors ${
                hasLiked
                  ? 'border-rose-400 bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400'
                  : 'border-stone-200 dark:border-neutral-800 hover:bg-stone-100 dark:hover:bg-neutral-800 text-stone-700 dark:text-neutral-300'
              }`}
            >
              <Heart className={`w-3.5 h-3.5 ${hasLiked ? 'fill-rose-500 text-rose-500' : ''}`} />
              <span className="font-data tabular-nums">{likes}</span>
              <span className="hidden sm:inline text-[11px] text-stone-500">Claps</span>
            </button>

            {/* Bookmark with accessible label */}
            <button
              onClick={(e) => onToggleSave(e, post)}
              aria-label={isSaved ? `Remove ${post.title} from saved reading list` : `Save ${post.title} to reading list`}
              className="p-1.5 rounded-md border border-stone-200 dark:border-neutral-800 text-stone-700 dark:text-neutral-300 hover:bg-stone-100 dark:hover:bg-neutral-800 transition-colors"
            >
              <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-amber-500 text-amber-500' : ''}`} />
            </button>

            {/* Share link with descriptive anchor text */}
            <button
              onClick={handleShare}
              aria-label="Copy canonical link for this gaming essay"
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-md border border-stone-200 dark:border-neutral-800 text-xs font-medium text-stone-700 dark:text-neutral-300 hover:bg-stone-100 dark:hover:bg-neutral-800 transition-colors"
            >
              {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Share2 className="w-3.5 h-3.5" />}
              <span>{copiedLink ? 'Link Copied' : 'Share Essay'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Article Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Editorial Header */}
        <header className="max-w-3xl mx-auto mb-10 text-center sm:text-left">
          {/* Category & Date Unboxed */}
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 text-xs text-stone-500 dark:text-neutral-400 mb-3">
            <span className="font-semibold text-amber-700 dark:text-amber-400 uppercase tracking-widest text-[11px]">
              {post.category}
            </span>
            <span aria-hidden="true">·</span>
            <span>{post.publishedAt}</span>
            <span aria-hidden="true">·</span>
            <span className="flex items-center gap-1 font-data tabular-nums">
              <Clock className="w-3.5 h-3.5 inline" />
              {post.readTimeMinutes} min read
            </span>
            <span aria-hidden="true">·</span>
            <span className="font-data font-semibold text-stone-800 dark:text-stone-200">
              Score: {post.ratingScore}
            </span>
          </div>

          {/* Headline */}
          <h1 className="font-editorial text-3xl sm:text-4xl lg:text-5xl font-medium text-stone-900 dark:text-stone-100 leading-[1.16] mb-4 [text-wrap:balance]">
            {post.title}
          </h1>

          {/* Subtitle / Deck */}
          <p className="font-editorial text-lg sm:text-xl text-stone-600 dark:text-neutral-300 leading-relaxed mb-6">
            {post.subtitle}
          </p>

          {/* SEO & AEO Keyword Transparency Bar */}
          <div className="p-3.5 mb-6 rounded-lg bg-stone-100/80 dark:bg-[#131417] border border-stone-200 dark:border-neutral-800 text-xs text-stone-600 dark:text-neutral-300 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="flex items-center gap-1 font-semibold text-stone-800 dark:text-stone-200">
                <Tag className="w-3 h-3 text-amber-600" />
                Main Keyword:
              </span>
              <span className="font-mono px-1.5 py-0.5 rounded bg-white dark:bg-neutral-800 border border-stone-200 dark:border-neutral-700 text-amber-700 dark:text-amber-400 font-semibold">
                {post.seo.mainKeyword}
              </span>
              <span className="text-stone-400" aria-hidden="true">·</span>
              <span className="font-medium text-stone-500 dark:text-neutral-400">Related Keywords:</span>
              <span className="font-mono text-stone-700 dark:text-neutral-300">{post.seo.relatedKeywords[0]}</span>
              <span aria-hidden="true">·</span>
              <span className="font-mono text-stone-700 dark:text-neutral-300">{post.seo.relatedKeywords[1]}</span>
            </div>

            {post.isAeoFormatted && (
              <div className="flex items-center gap-1.5 text-emerald-700 dark:text-emerald-400 font-semibold text-[11px] whitespace-nowrap">
                <HelpCircle className="w-3.5 h-3.5" />
                <span>AEO Optimized Q&A Structure</span>
              </div>
            )}
          </div>

          {/* Author Card */}
          <div className="flex items-center gap-3 py-3 border-y border-stone-200 dark:border-neutral-800">
            <img
              src={post.author.avatar}
              alt={`Author portrait of ${post.author.name}, ${post.author.title}`}
              referrerPolicy="no-referrer"
              loading="lazy"
              className="w-10 h-10 rounded-full object-cover border border-stone-300 dark:border-neutral-700"
            />
            <div>
              <p className="text-sm font-semibold text-stone-900 dark:text-stone-200">
                {post.author.name}
              </p>
              <p className="text-xs text-stone-500 dark:text-neutral-400">
                {post.author.title}
              </p>
            </div>
          </div>
        </header>

        {/* Hero Visual Presentation (Restrained size with descriptive alt) */}
        <div className="max-w-3xl mx-auto mb-12">
          <div className="rounded-lg overflow-hidden border border-stone-200 dark:border-neutral-800 shadow-md">
            <ArticleImage
              src={post.heroImage}
              alt={post.imageAlt}
              category={post.category}
              aspectRatio="16:9"
              priority={true}
              sizeConstraint="standard"
            />
          </div>
          {post.imageCaption && (
            <p className="text-xs font-editorial italic text-stone-500 dark:text-neutral-500 mt-2.5 text-center">
              Fig. 1 — {post.imageCaption}
            </p>
          )}
        </div>

        {/* 2-Column Asymmetric Reading Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 max-w-5xl mx-auto">
          
          {/* Left Column: Main Reading Essay (Cols 1-8) */}
          <div className="lg:col-span-8">
            {post.sections.map((section, idx) => (
              <section
                key={section.id}
                id={section.id}
                className="mb-12 scroll-mt-36"
              >
                {/* H2 subheadings: for AEO articles, formatted as direct questions */}
                <h2 className="font-editorial text-2xl sm:text-3xl font-medium text-stone-900 dark:text-stone-100 mb-5 border-b border-stone-200/60 dark:border-neutral-800/80 pb-2">
                  {section.title}
                </h2>

                {/* If AEO formatted, highlight the direct answer in the first paragraph */}
                {post.isAeoFormatted && idx < 2 ? (
                  <div className="mb-6 p-4 rounded-lg bg-amber-50/60 dark:bg-amber-950/20 border-l-2 border-amber-500 text-stone-900 dark:text-stone-100">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400 block mb-1">
                      Direct Answer:
                    </span>
                    <p className={`font-editorial ${fontClass} font-normal`}>
                      {section.paragraphs[0]}
                    </p>
                  </div>
                ) : (
                  <p
                    className={`font-editorial ${fontClass} text-stone-800 dark:text-stone-200 mb-6 ${
                      idx === 0 ? 'drop-cap' : ''
                    }`}
                  >
                    {section.paragraphs[0]}
                  </p>
                )}

                {/* Remaining paragraphs */}
                {section.paragraphs.slice(1).map((p, pIdx) => (
                  <p
                    key={pIdx + 1}
                    className={`font-editorial ${fontClass} text-stone-800 dark:text-stone-200 mb-6`}
                  >
                    {p}
                  </p>
                ))}

                {/* Pull Quote */}
                {section.pullQuote && (
                  <blockquote className="my-8 py-6 px-6 border-y border-stone-300 dark:border-neutral-800 text-center">
                    <p className="font-editorial italic text-xl sm:text-2xl text-stone-900 dark:text-stone-100 leading-snug">
                      "{section.pullQuote}"
                    </p>
                  </blockquote>
                )}

                {/* Key Insight */}
                {section.keyInsight && (
                  <div className="my-6 p-4 rounded-md bg-stone-100 dark:bg-[#151619] border border-stone-200 dark:border-neutral-800 text-sm text-stone-700 dark:text-neutral-300">
                    <span className="font-semibold text-amber-700 dark:text-amber-400 mr-2 uppercase text-xs tracking-wider">
                      Critical Takeaway:
                    </span>
                    <span className="font-editorial">{section.keyInsight}</span>
                  </div>
                )}
              </section>
            ))}

            {/* Verdict & Critique Box */}
            <div className="my-12 p-6 sm:p-8 rounded-lg border border-stone-300 dark:border-neutral-700 bg-white dark:bg-[#121316] shadow-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200 dark:border-neutral-800 pb-4 mb-6">
                <div>
                  <span className="text-xs uppercase tracking-widest text-amber-700 dark:text-amber-400 font-bold">
                    Critical Verdict
                  </span>
                  <h3 className="font-editorial text-2xl font-semibold text-stone-900 dark:text-stone-100 mt-1">
                    {post.verdict.headline}
                  </h3>
                </div>
                <div className="text-right sm:text-right shrink-0">
                  <div className="text-2xl sm:text-3xl font-data font-bold text-amber-600 dark:text-amber-400 tabular-nums">
                    {post.verdict.verdictScore}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <h4 className="text-xs uppercase tracking-wider font-semibold text-emerald-700 dark:text-emerald-400 mb-3">
                    Mastery & Triumphs
                  </h4>
                  <ul className="space-y-2 text-sm text-stone-700 dark:text-neutral-300 font-editorial">
                    {post.verdict.keyStrengths.map((s, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-emerald-600 font-bold">✓</span>
                        <span>{s}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="text-xs uppercase tracking-wider font-semibold text-stone-600 dark:text-neutral-400 mb-3">
                    Nuances & Caveats
                  </h4>
                  <ul className="space-y-2 text-sm text-stone-700 dark:text-neutral-300 font-editorial">
                    {post.verdict.keyNuances.map((n, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-stone-400">•</span>
                        <span>{n}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="pt-4 border-t border-stone-200 dark:border-neutral-800 text-sm text-stone-700 dark:text-neutral-300 font-editorial leading-relaxed">
                <span className="font-semibold text-stone-900 dark:text-stone-100">Bottom Line: </span>
                {post.verdict.bottomLine}
              </div>
            </div>

            {/* Tags Cloud */}
            <div className="flex flex-wrap items-center gap-2 pt-4 border-t border-stone-200 dark:border-neutral-800 text-xs text-stone-500 dark:text-neutral-400">
              <span className="font-semibold uppercase tracking-wider">Filed Under:</span>
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="hover:text-amber-600 dark:hover:text-amber-400 cursor-default transition-colors"
                >
                  #{tag}
                </span>
              ))}
            </div>

            {/* Author Extended Bio */}
            <div className="my-10 p-6 rounded-lg bg-stone-100 dark:bg-[#131417] border border-stone-200 dark:border-neutral-800 flex items-start gap-4">
              <img
                src={post.author.avatar}
                alt={`Photo of author ${post.author.name}`}
                referrerPolicy="no-referrer"
                loading="lazy"
                className="w-12 h-12 rounded-full object-cover shrink-0"
              />
              <div>
                <p className="text-sm font-bold text-stone-900 dark:text-stone-100">
                  Written by {post.author.name}
                </p>
                <p className="text-xs text-amber-700 dark:text-amber-400 mb-2">
                  {post.author.title}
                </p>
                <p className="text-xs sm:text-sm text-stone-600 dark:text-neutral-400 leading-relaxed">
                  {post.author.bio}
                </p>
              </div>
            </div>

            {/* Comments & Discussion */}
            <section className="mt-14 pt-8 border-t border-stone-300 dark:border-neutral-800">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-editorial text-2xl font-semibold text-stone-900 dark:text-stone-100 flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-amber-600" />
                  <span>Reader Discussion ({comments.length})</span>
                </h3>
              </div>

              {/* Leave a comment form */}
              <form onSubmit={handleAddComment} className="mb-8 p-4 rounded-lg border border-stone-200 dark:border-neutral-800 bg-white dark:bg-[#121316]">
                <div className="mb-3">
                  <label htmlFor="author-name" className="block text-xs font-medium text-stone-600 dark:text-neutral-400 mb-1">
                    Your Name or Handle
                  </label>
                  <input
                    id="author-name"
                    type="text"
                    value={authorName}
                    onChange={(e) => setAuthorName(e.target.value)}
                    placeholder="e.g. TarnishedScholar"
                    className="w-full text-xs px-3 py-2 bg-stone-50 dark:bg-neutral-900 border border-stone-200 dark:border-neutral-700 rounded-md focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="comment-text" className="block text-xs font-medium text-stone-600 dark:text-neutral-400 mb-1">
                    Your Critique or Perspective
                  </label>
                  <textarea
                    id="comment-text"
                    rows={3}
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    placeholder="Share your perspective on this essay's arguments..."
                    required
                    className="w-full text-xs p-3 bg-stone-50 dark:bg-neutral-900 border border-stone-200 dark:border-neutral-700 rounded-md focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={isSubmitting || !commentText.trim()}
                    className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-stone-900 dark:bg-stone-100 dark:text-stone-900 rounded-md hover:bg-stone-800 transition-colors disabled:opacity-50"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Publish Comment</span>
                  </button>
                </div>
              </form>

              {/* Comments list */}
              <div className="space-y-4">
                {comments.map((comment) => (
                  <div
                    key={comment.id}
                    className="p-4 rounded-lg border border-stone-200/80 dark:border-neutral-800/80 bg-stone-50/50 dark:bg-[#101114]"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <img
                          src={comment.avatar}
                          alt={`Avatar of commenter ${comment.author}`}
                          referrerPolicy="no-referrer"
                          loading="lazy"
                          className="w-6 h-6 rounded-full object-cover"
                        />
                        <span className="text-xs font-semibold text-stone-900 dark:text-stone-200">
                          {comment.author}
                        </span>
                        <span className="text-xs text-stone-400 dark:text-neutral-500">
                          · {comment.date}
                        </span>
                      </div>

                      <button
                        onClick={() => handleUpvoteComment(comment.id)}
                        aria-label={`Upvote comment by ${comment.author}`}
                        className={`flex items-center gap-1 text-xs px-2 py-0.5 rounded transition-colors ${
                          comment.userUpvoted
                            ? 'text-amber-600 bg-amber-50 dark:bg-amber-950/40 font-semibold'
                            : 'text-stone-500 hover:text-stone-900 dark:hover:text-stone-200'
                        }`}
                      >
                        <ThumbsUp className="w-3 h-3" />
                        <span className="font-data tabular-nums">{comment.upvotes}</span>
                      </button>
                    </div>

                    <p className="text-xs sm:text-sm text-stone-700 dark:text-neutral-300 font-editorial leading-relaxed pl-8">
                      {comment.content}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Right Column: Sticky Table of Contents & Stats Rail (Cols 9-12) */}
          <aside className="lg:col-span-4 hidden lg:block">
            <div className="sticky top-32 space-y-8">
              
              {/* Table of Contents with Explicit Anchor Text */}
              <div className="p-5 rounded-lg border border-stone-200 dark:border-neutral-800 bg-white dark:bg-[#121316]">
                <h3 className="text-xs uppercase tracking-widest font-semibold text-stone-900 dark:text-stone-200 mb-4 flex items-center gap-2">
                  <BookOpen className="w-3.5 h-3.5 text-amber-600" />
                  <span>Article Contents</span>
                </h3>

                <nav aria-label="Table of contents" className="space-y-1">
                  {post.sections.map((section, idx) => (
                    <button
                      key={section.id}
                      onClick={() => scrollToSection(section.id)}
                      className={`w-full text-left py-1.5 px-2 rounded text-xs transition-colors block truncate ${
                        activeSectionId === section.id
                          ? 'font-bold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/30'
                          : 'text-stone-600 dark:text-neutral-400 hover:text-stone-900 dark:hover:text-stone-200'
                      }`}
                    >
                      <span className="font-data mr-2 text-stone-400">{idx + 1}.</span>
                      <span>Jump to: {section.title}</span>
                    </button>
                  ))}
                </nav>
              </div>

              {/* SEO Snapshot Panel */}
              <div className="p-5 rounded-lg border border-stone-200 dark:border-neutral-800 bg-white dark:bg-[#121316]">
                <h4 className="text-xs uppercase tracking-widest text-stone-500 dark:text-neutral-400 font-medium mb-3 flex items-center gap-1.5">
                  <FileCheck2 className="w-3.5 h-3.5 text-amber-600" />
                  <span>Metadata & Search Intent</span>
                </h4>
                <div className="space-y-3 font-data text-xs">
                  <div className="border-b border-stone-100 dark:border-neutral-800 pb-2">
                    <span className="text-stone-400 block text-[11px] mb-0.5">Primary Target Keyword</span>
                    <span className="font-semibold text-amber-600 dark:text-amber-400 font-mono text-[11px]">{post.seo.mainKeyword}</span>
                  </div>
                  <div className="border-b border-stone-100 dark:border-neutral-800 pb-2">
                    <span className="text-stone-400 block text-[11px] mb-0.5">Canonical URL</span>
                    <span className="font-mono text-stone-800 dark:text-stone-200 text-[10px] break-all">{post.urlPath}</span>
                  </div>
                  <div className="flex justify-between border-b border-stone-100 dark:border-neutral-800 pb-2">
                    <span className="text-stone-500">Read Time</span>
                    <span className="font-semibold text-stone-900 dark:text-stone-100">{post.readTimeMinutes} Minutes</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-500">Critical Verdict</span>
                    <span className="font-semibold text-amber-600">{post.ratingScore}</span>
                  </div>
                </div>
              </div>

            </div>
          </aside>

        </div>

        {/* Related Articles Section with Explicit Link Anchor Text */}
        {relatedPosts.length > 0 && (
          <section className="mt-20 pt-12 border-t border-stone-300 dark:border-neutral-800">
            <h3 className="font-editorial text-2xl sm:text-3xl font-medium text-stone-900 dark:text-stone-100 mb-8">
              More Dispatches from the Archive
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedPosts.map((related) => (
                <article
                  key={related.id}
                  className="group flex flex-col p-4 rounded-lg border border-stone-200 dark:border-neutral-800 bg-white dark:bg-[#121316] hover:border-amber-400/40 transition-colors"
                >
                  <div className="rounded-md overflow-hidden mb-3">
                    <a
                      href={related.urlPath}
                      onClick={(e) => {
                        e.preventDefault();
                        onSelectPost(related);
                      }}
                      title={`Read essay: ${related.title}`}
                      className="block"
                    >
                      <ArticleImage
                        src={related.heroImage}
                        alt={related.imageAlt}
                        category={related.category}
                        aspectRatio="16:9"
                        sizeConstraint="small"
                        className="group-hover:scale-103 transition-transform duration-500"
                      />
                    </a>
                  </div>
                  <div className="text-[11px] font-semibold text-amber-700 dark:text-amber-400 uppercase mb-1">
                    {related.categoryGroup} · {related.readTimeMinutes} min
                  </div>
                  <h4 className="font-editorial text-lg font-medium text-stone-900 dark:text-stone-100 mb-2 leading-snug">
                    <a
                      href={related.urlPath}
                      onClick={(e) => {
                        e.preventDefault();
                        onSelectPost(related);
                      }}
                      className="hover:text-amber-600 transition-colors"
                    >
                      {related.title}
                    </a>
                  </h4>
                  <p className="text-xs text-stone-600 dark:text-neutral-400 font-editorial line-clamp-2 mb-3">
                    {related.excerpt}
                  </p>
                  <div className="text-xs text-stone-400 mt-auto flex items-center justify-between pt-2">
                    <span>By {related.author.name}</span>
                    <a
                      href={related.urlPath}
                      onClick={(e) => {
                        e.preventDefault();
                        onSelectPost(related);
                      }}
                      className="text-amber-600 dark:text-amber-400 font-semibold hover:underline flex items-center gap-1"
                    >
                      <span>Read essay</span>
                      <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    </a>
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}

      </div>
    </article>
  );
};
