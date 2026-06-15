import React from 'react';
import { Helmet } from 'react-helmet-async';

const SITE_URL = 'https://www.llmstxt.in.net';
const SITE_NAME = 'LLMS.TXT Analyzer';

/**
 * SEO Component — Manages document head for SEO using Helmet.
 * 
 * Props:
 * - title: Page title
 * - description: Meta description
 * - canonical: Canonical path (e.g., "/about")
 * - ogImage: Open Graph image URL
 * - schema: JSON-LD structured data object or array of objects
 * - twitterCard: "summary" | "summary_large_image"
 */
const SEO = ({ title, description, canonical, ogImage, schema, twitterCard = 'summary' }) => {
  const fullCanonical = canonical ? (canonical.startsWith('http') ? canonical : `${SITE_URL}${canonical}`) : null;
  const schemas = schema ? (Array.isArray(schema) ? schema : [schema]) : [];

  return (
    <Helmet>
      {title && <title>{title}</title>}
      {title && <meta property="og:title" content={title} />}
      {title && <meta name="twitter:title" content={title} />}

      {description && <meta name="description" content={description} />}
      {description && <meta property="og:description" content={description} />}
      {description && <meta name="twitter:description" content={description} />}

      {fullCanonical && <link rel="canonical" href={fullCanonical} />}
      {fullCanonical && <meta property="og:url" content={fullCanonical} />}

      {ogImage && <meta property="og:image" content={ogImage} />}
      {ogImage && <meta name="twitter:image" content={ogImage} />}

      <meta name="twitter:card" content={twitterCard} />
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content={SITE_NAME} />

      {schemas.map((s, i) => (
        <script key={i} type="application/ld+json">
          {JSON.stringify(s)}
        </script>
      ))}
    </Helmet>
  );
};

export default SEO;
export { SITE_URL, SITE_NAME };
