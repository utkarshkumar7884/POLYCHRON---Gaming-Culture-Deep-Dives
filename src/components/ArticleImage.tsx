import React, { useState } from 'react';
import { Gamepad2, Compass, Cpu, Volume2, Flame, Sparkles } from 'lucide-react';

interface ArticleImageProps {
  src: string;
  alt: string;
  className?: string;
  category?: string;
  aspectRatio?: '16:9' | '4:3' | '1:1' | 'auto';
  priority?: boolean;
  sizeConstraint?: 'small' | 'medium' | 'standard';
}

export const ArticleImage: React.FC<ArticleImageProps> = ({
  src,
  alt,
  className = '',
  category = 'Gaming Deep Dive',
  aspectRatio = '16:9',
  priority = false,
  sizeConstraint = 'standard'
}) => {
  const [hasError, setHasError] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  // Determine category thematic icon & theme for resilient fallback
  const getThematicDetails = (cat: string) => {
    const c = cat.toLowerCase();
    if (c.includes('world') || c.includes('solitude')) {
      return {
        icon: Compass,
        gradient: 'from-amber-950/80 via-stone-900 to-black',
        accent: 'text-amber-400'
      };
    }
    if (c.includes('cyber') || c.includes('tech') || c.includes('engine') || c.includes('ai') || c.includes('physics')) {
      return {
        icon: Cpu,
        gradient: 'from-cyan-950/80 via-slate-900 to-black',
        accent: 'text-cyan-400'
      };
    }
    if (c.includes('audio') || c.includes('sound') || c.includes('music')) {
      return {
        icon: Volume2,
        gradient: 'from-violet-950/80 via-stone-900 to-black',
        accent: 'text-violet-400'
      };
    }
    if (c.includes('action') || c.includes('shooter') || c.includes('speed') || c.includes('esport')) {
      return {
        icon: Flame,
        gradient: 'from-rose-950/80 via-zinc-900 to-black',
        accent: 'text-rose-400'
      };
    }
    if (c.includes('cozy') || c.includes('indie')) {
      return {
        icon: Sparkles,
        gradient: 'from-emerald-950/80 via-stone-900 to-black',
        accent: 'text-emerald-400'
      };
    }
    return {
      icon: Gamepad2,
      gradient: 'from-zinc-900 via-neutral-900 to-black',
      accent: 'text-amber-400'
    };
  };

  const { icon: CategoryIcon, gradient, accent } = getThematicDetails(category);

  const aspectClass =
    aspectRatio === '16:9'
      ? 'aspect-[16/9]'
      : aspectRatio === '4:3'
      ? 'aspect-[4/3]'
      : aspectRatio === '1:1'
      ? 'aspect-square'
      : '';

  const maxConstraintClass = 
    sizeConstraint === 'small' 
      ? 'max-w-xs mx-auto' 
      : sizeConstraint === 'medium'
      ? 'max-w-xl mx-auto'
      : '';

  if (hasError || !src) {
    return (
      <div
        className={`relative overflow-hidden w-full ${maxConstraintClass} ${aspectClass} bg-gradient-to-br ${gradient} flex flex-col items-center justify-center p-6 border border-neutral-800/80 ${className}`}
        role="img"
        aria-label={alt}
      >
        <div className="absolute inset-0 bg-[radial-gradient(#ffffff0a_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />
        <CategoryIcon className={`w-8 h-8 ${accent} opacity-80 mb-2`} />
        <span className="text-[11px] uppercase tracking-widest text-neutral-400 font-medium">
          {category}
        </span>
        <span className="text-xs text-neutral-300 text-center max-w-xs mt-1 font-editorial line-clamp-2">
          {alt}
        </span>
      </div>
    );
  }

  return (
    <div className={`relative overflow-hidden w-full ${maxConstraintClass} ${aspectClass} bg-neutral-900 ${className}`}>
      {/* Background placeholder while image decodes */}
      <div
        className={`absolute inset-0 bg-gradient-to-br ${gradient} transition-opacity duration-500 ${
          isLoaded ? 'opacity-0 pointer-events-none' : 'opacity-100'
        } flex items-center justify-center`}
      >
        <CategoryIcon className={`w-7 h-7 ${accent} opacity-40 animate-pulse`} />
      </div>

      <img
        src={src}
        alt={alt}
        referrerPolicy="no-referrer"
        loading={priority ? 'eager' : 'lazy'}
        decoding="async"
        onLoad={() => setIsLoaded(true)}
        onError={() => setHasError(true)}
        className={`w-full h-full object-cover transition-all duration-500 ${
          isLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-102'
        }`}
      />
    </div>
  );
};
