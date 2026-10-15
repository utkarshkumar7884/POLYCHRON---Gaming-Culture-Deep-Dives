export interface Author {
  name: string;
  title: string;
  avatar: string;
  bio: string;
}

export interface CommentItem {
  id: string;
  author: string;
  avatar: string;
  date: string;
  content: string;
  upvotes: number;
  userUpvoted?: boolean;
}

export interface ArticleSection {
  id: string;
  title: string;
  paragraphs: string[];
  pullQuote?: string;
  keyInsight?: string;
  statBadge?: {
    label: string;
    value: string;
  };
  inlineImage?: {
    src: string;
    caption: string;
  };
}

export interface VerdictSummary {
  headline: string;
  keyStrengths: string[];
  keyNuances: string[];
  verdictScore: string;
  bottomLine: string;
}

export type CategoryFilter = 
  | 'All'
  | 'Deep Dives'
  | 'Design & Tech'
  | 'Culture & Indie'
  | 'Esports & Retro';

export interface SeoMetadata {
  pageTitle: string; // 50-60 characters
  metaDescription: string; // 140-160 characters
  mainKeyword: string;
  relatedKeywords: [string, string];
  canonicalPath: string;
  faqSchema?: Array<{
    question: string;
    answer: string;
  }>;
}

export interface BlogPost {
  id: string;
  slug: string;
  urlPath: string; // e.g. /blog/elden-ring-open-world-design
  title: string;
  subtitle: string;
  excerpt: string;
  category: string;
  categoryGroup: Exclude<CategoryFilter, 'All'>;
  author: Author;
  publishedAt: string;
  readTimeMinutes: number;
  heroImage: string;
  imageCaption: string;
  imageAlt: string; // descriptive alt text
  featured?: boolean;
  editorPick?: boolean;
  trendingRank?: number;
  ratingScore: string;
  tags: string[];
  likes: number;
  seo: SeoMetadata;
  isAeoFormatted?: boolean; // Flag for articles with AEO Question & Answer subheadings
  sections: ArticleSection[];
  verdict: VerdictSummary;
  comments: CommentItem[];
  relatedIds: string[];
}

export type ThemeMode = 'dark' | 'light' | 'midnight';
export type ViewMode = 'grid' | 'editorial';
export type SortOption = 'latest' | 'popular' | 'readTime' | 'rating';
