import { useEffect } from 'react';

const SITE_URL = 'https://llmstxt-analyzer.com';
const SITE_NAME = 'LLMS.TXT Analyzer';

/**
 * SEO Component — Manages document head for SEO.
 * 
 * Props:
 * - title: Page title
 * - description: Meta description
 * - canonical: Canonical path (e.g., "/about") — auto-prepends SITE_URL
 * - ogImage: Open Graph image URL
 * - schema: JSON-LD structured data object or array of objects
 * - twitterCard: "summary" | "summary_large_image" (default: "summary")
 */
const SEO = ({ title, description, canonical, ogImage, schema, twitterCard = 'summary' }) => {
  const schemaString = schema ? JSON.stringify(schema) : '';

  useEffect(() => {
    // --- Title ---
    if (title) {
      document.title = title;
      setMeta('property', 'og:title', title);
      setMeta('name', 'twitter:title', title);
    }

    // --- Description ---
    if (description) {
      setMeta('name', 'description', description);
      setMeta('property', 'og:description', description);
      setMeta('name', 'twitter:description', description);
    }

    // --- Canonical URL ---
    if (canonical) {
      const fullCanonical = canonical.startsWith('http') ? canonical : `${SITE_URL}${canonical}`;
      let link = document.querySelector('link[rel="canonical"]');
      if (!link) {
        link = document.createElement('link');
        link.setAttribute('rel', 'canonical');
        document.head.appendChild(link);
      }
      link.setAttribute('href', fullCanonical);
      setMeta('property', 'og:url', fullCanonical);
    }

    // --- OG Image ---
    if (ogImage) {
      setMeta('property', 'og:image', ogImage);
      setMeta('name', 'twitter:image', ogImage);
    }

    // --- Twitter Card ---
    setMeta('name', 'twitter:card', twitterCard);

    // --- OG Type ---
    setMeta('property', 'og:type', 'website');
    setMeta('property', 'og:site_name', SITE_NAME);

    // --- JSON-LD Structured Data ---
    // Remove any previously injected schemas from this component
    const existingScripts = document.querySelectorAll('script[data-seo-component]');
    existingScripts.forEach(s => s.remove());

    if (schemaString) {
      const parsedSchemas = JSON.parse(schemaString);
      const schemas = Array.isArray(parsedSchemas) ? parsedSchemas : [parsedSchemas];
      schemas.forEach((s, i) => {
        const script = document.createElement('script');
        script.type = 'application/ld+json';
        script.setAttribute('data-seo-component', `schema-${i}`);
        script.textContent = JSON.stringify(s);
        document.head.appendChild(script);
      });
    }

    // Cleanup on unmount
    return () => {
      const scripts = document.querySelectorAll('script[data-seo-component]');
      scripts.forEach(s => s.remove());
    };
  }, [title, description, canonical, ogImage, schemaString, twitterCard]);

  return null;
};

/**
 * Helper: Create or update a meta tag.
 */
function setMeta(attr, key, value) {
  let el = document.querySelector(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute('content', value);
}

export default SEO;
export { SITE_URL, SITE_NAME };
