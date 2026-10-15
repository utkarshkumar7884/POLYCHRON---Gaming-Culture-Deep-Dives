import { BlogPost, SeoMetadata } from '../types';

export const SITE_NAME = 'Polychron';
export const SITE_ORIGIN = typeof window !== 'undefined' ? window.location.origin : 'https://polychron.journal';

export const HOME_SEO: SeoMetadata = {
  pageTitle: 'Polychron | Long-Form Video Game Essays & Critique',
  metaDescription: 'Read long-form video game essays and design critiques on Polychron. Deep dives into level geometry, soundscapes, game physics, and industry retrospectives.',
  mainKeyword: 'video game essays',
  relatedKeywords: ['game design critiques', 'gaming deep dives'],
  canonicalPath: '/',
};

export function updatePageSeo(seo: SeoMetadata, post?: BlogPost) {
  if (typeof document === 'undefined') return;

  // 1. Update Title tag
  document.title = seo.pageTitle;

  // 2. Helper to set or create meta tags
  const setMeta = (nameOrProp: string, value: string, isProperty = false) => {
    const attr = isProperty ? 'property' : 'name';
    let el = document.querySelector(`meta[${attr}="${nameOrProp}"]`) as HTMLMetaElement;
    if (!el) {
      el = document.createElement('meta');
      el.setAttribute(attr, nameOrProp);
      document.head.appendChild(el);
    }
    el.content = value;
  };

  // 3. Update Meta Description & Keywords
  setMeta('description', seo.metaDescription);
  const keywordsStr = [seo.mainKeyword, ...seo.relatedKeywords].join(', ');
  setMeta('keywords', keywordsStr);

  // 4. Update Canonical Link
  const fullUrl = `${SITE_ORIGIN}${seo.canonicalPath}`;
  let canonicalEl = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
  if (!canonicalEl) {
    canonicalEl = document.createElement('link');
    canonicalEl.setAttribute('rel', 'canonical');
    document.head.appendChild(canonicalEl);
  }
  canonicalEl.href = fullUrl;

  // 5. OpenGraph Tags
  setMeta('og:title', seo.pageTitle, true);
  setMeta('og:description', seo.metaDescription, true);
  setMeta('og:url', fullUrl, true);
  setMeta('og:site_name', SITE_NAME, true);
  setMeta('og:type', post ? 'article' : 'website', true);

  // 6. Twitter Card Tags
  setMeta('twitter:card', 'summary_large_image');
  setMeta('twitter:title', seo.pageTitle);
  setMeta('twitter:description', seo.metaDescription);

  if (post) {
    setMeta('og:image', post.heroImage.startsWith('http') ? post.heroImage : `${SITE_ORIGIN}${post.heroImage}`, true);
    setMeta('twitter:image', post.heroImage.startsWith('http') ? post.heroImage : `${SITE_ORIGIN}${post.heroImage}`);
  }

  // 7. Inject Schema.org JSON-LD
  let jsonLdScript = document.getElementById('seo-jsonld') as HTMLScriptElement;
  if (!jsonLdScript) {
    jsonLdScript = document.createElement('script');
    jsonLdScript.id = 'seo-jsonld';
    jsonLdScript.type = 'application/ld+json';
    document.head.appendChild(jsonLdScript);
  }

  if (post) {
    const articleSchema: Record<string, unknown> = {
      '@context': 'https://schema.org',
      '@type': 'BlogPosting',
      headline: post.title,
      description: seo.metaDescription,
      keywords: keywordsStr,
      url: fullUrl,
      datePublished: post.publishedAt,
      author: {
        '@type': 'Person',
        name: post.author.name,
        jobTitle: post.author.title,
      },
      publisher: {
        '@type': 'Organization',
        name: SITE_NAME,
        url: SITE_ORIGIN,
      },
      image: post.heroImage.startsWith('http') ? post.heroImage : `${SITE_ORIGIN}${post.heroImage}`,
      mainEntityOfPage: {
        '@type': 'WebPage',
        '@id': fullUrl,
      },
    };

    // If AEO FAQ Schema is present, wrap in Graph with FAQPage
    if (seo.faqSchema && seo.faqSchema.length > 0) {
      const faqSchema = {
        '@type': 'FAQPage',
        mainEntity: seo.faqSchema.map((item) => ({
          '@type': 'Question',
          name: item.question,
          acceptedAnswer: {
            '@type': 'Answer',
            text: item.answer,
          },
        })),
      };

      jsonLdScript.textContent = JSON.stringify({
        '@context': 'https://schema.org',
        '@graph': [articleSchema, faqSchema],
      });
    } else {
      jsonLdScript.textContent = JSON.stringify(articleSchema);
    }
  } else {
    // Collection / Home Page Schema
    const websiteSchema = {
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      name: SITE_NAME,
      headline: seo.pageTitle,
      description: seo.metaDescription,
      keywords: keywordsStr,
      url: fullUrl,
    };
    jsonLdScript.textContent = JSON.stringify(websiteSchema);
  }
}
