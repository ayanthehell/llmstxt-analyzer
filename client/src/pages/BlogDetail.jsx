import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useCMS } from '../components/CMSContext';
import { Loader2, ArrowLeft, Calendar, Tag, ChevronRight, Sparkles, ArrowRight } from 'lucide-react';
import SEO, { SITE_URL, SITE_NAME } from '../components/SEO';

const BlogDetail = () => {
  const { slug } = useParams();
  const { cmsData, loading } = useCMS();

  if (loading || !cmsData) {
    return <div className="min-h-screen flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-blue-500"/></div>;
  }

  const blogs = cmsData.blogs || [];
  const blog = blogs.find(b => b.slug === slug && b.status === 'published');

  if (!blog) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center px-4">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">404</h1>
        <p className="text-xl text-gray-600 mb-8">Article not found.</p>
        <Link to="/blog" className="glass-button-primary px-6 py-3 rounded-full font-medium flex items-center gap-2">
          <ArrowLeft className="w-4 h-4" /> Back to Blog
        </Link>
      </div>
    );
  }

  const tags = blog.tags ? blog.tags.split(',').map(t => t.trim()).filter(Boolean) : [];

  // Article + BreadcrumbList schemas
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": blog.title,
    "description": blog.metaDescription || blog.title,
    "url": `${SITE_URL}/blog/${blog.slug}`,
    "datePublished": blog.createdAt,
    "dateModified": blog.updatedAt || blog.createdAt,
    "author": {
      "@type": "Organization",
      "name": SITE_NAME,
      "url": SITE_URL
    },
    "publisher": {
      "@type": "Organization",
      "name": SITE_NAME,
      "url": SITE_URL
    },
    ...(blog.featureImage ? { "image": blog.featureImage } : {}),
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `${SITE_URL}/blog/${blog.slug}`
    },
    ...(blog.category ? { "articleSection": blog.category } : {}),
    ...(tags.length > 0 ? { "keywords": tags.join(', ') } : {})
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": SITE_URL
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Blog",
        "item": `${SITE_URL}/blog`
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": blog.title,
        "item": `${SITE_URL}/blog/${blog.slug}`
      }
    ]
  };

  // Related articles (other published blogs, excluding current)
  const relatedBlogs = blogs
    .filter(b => b.status === 'published' && b.slug !== slug)
    .slice(0, 3);

  return (
    <article className="flex flex-col items-center w-full min-h-screen bg-white">
      <SEO 
        title={blog.metaTitle || `${blog.title} | ${SITE_NAME} Blog`}
        description={blog.metaDescription}
        canonical={`/blog/${blog.slug}`}
        ogImage={blog.featureImage}
        twitterCard={blog.featureImage ? 'summary_large_image' : 'summary'}
        schema={[articleSchema, breadcrumbSchema]}
      />
      
      {/* Breadcrumb + Hero Section */}
      <div className="w-full bg-gray-50/50 border-b border-gray-100 pt-16 pb-12 px-4">
        <div className="max-w-3xl mx-auto">
          {/* Breadcrumb Navigation */}
          <nav className="mb-8" aria-label="Breadcrumb">
            <ol className="flex items-center gap-2 text-sm text-gray-500">
              <li><Link to="/" className="hover:text-blue-600 transition-colors">Home</Link></li>
              <li><ChevronRight className="w-3 h-3" /></li>
              <li><Link to="/blog" className="hover:text-blue-600 transition-colors">Blog</Link></li>
              <li><ChevronRight className="w-3 h-3" /></li>
              <li className="text-gray-900 font-medium truncate max-w-[200px]">{blog.title}</li>
            </ol>
          </nav>
          
          {blog.category && (
            <div className="inline-block bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide mb-6">
              {blog.category}
            </div>
          )}
          
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-6 leading-tight">
            {blog.title}
          </h1>
          
          <div className="flex flex-wrap items-center gap-6 text-sm text-gray-500">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <time dateTime={blog.createdAt}>
                {new Date(blog.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
              </time>
            </div>
          </div>
        </div>
      </div>

      {/* Feature Image */}
      {blog.featureImage && (
        <div className="w-full max-w-5xl mx-auto px-4 -mt-8 relative z-10">
          <div className="rounded-3xl overflow-hidden shadow-xl bg-white border border-gray-100 aspect-[21/9] md:aspect-[21/9]">
            <img 
              src={blog.featureImage} 
              alt={blog.imageAlt || blog.title} 
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      )}

      {/* Body Content */}
      <div className="w-full max-w-3xl mx-auto px-4 py-16">
        <div 
          className="prose prose-lg md:prose-xl prose-blue max-w-none text-gray-700 prose-headings:text-gray-900 prose-a:text-blue-600 hover:prose-a:text-blue-500 prose-img:rounded-2xl prose-img:shadow-md"
          dangerouslySetInnerHTML={{ __html: blog.body }}
        />
        
        {/* Tags */}
        {tags.length > 0 && (
          <div className="mt-16 pt-8 border-t border-gray-100">
            <div className="flex flex-wrap items-center gap-2">
              <Tag className="w-5 h-5 text-gray-400 mr-2" />
              {tags.map((tag, idx) => (
                <span key={idx} className="bg-gray-100 text-gray-700 px-3 py-1.5 rounded-lg text-sm font-medium">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Related Articles */}
        {relatedBlogs.length > 0 && (
          <div className="mt-16 pt-8 border-t border-gray-100">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Related Articles</h2>
            <div className="grid md:grid-cols-3 gap-4">
              {relatedBlogs.map(related => (
                <Link key={related.id} to={`/blog/${related.slug}`} className="glass-panel p-4 rounded-xl hover:border-blue-200 hover:shadow-lg transition-all duration-300 group">
                  <h3 className="font-bold text-gray-900 mb-2 text-sm line-clamp-2 group-hover:text-blue-600 transition-colors">{related.title}</h3>
                  <p className="text-xs text-gray-500 line-clamp-2">{related.metaDescription || 'Read more...'}</p>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* CTA: Try the Analyzer */}
        <div className="mt-16 glass-panel p-8 rounded-2xl bg-blue-50/30 border border-blue-100/50 text-center">
          <Sparkles className="w-8 h-8 text-blue-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-900 mb-3">Ready to optimize your site for AI search?</h2>
          <p className="text-gray-600 mb-6 max-w-lg mx-auto">
            Run a free audit on your website's llms.txt file to see how AI search engines interpret your content.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/" className="inline-flex items-center gap-2 glass-button-primary rounded-full px-6 py-3 font-semibold">
              Run Free Audit <ArrowRight className="w-4 h-4" />
            </Link>
            <Link to="/generate" className="inline-flex items-center gap-2 glass-panel px-6 py-3 rounded-full font-semibold text-gray-700 hover:text-blue-600 hover:border-blue-300 transition-colors">
              Generate llms.txt <Sparkles className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
};

export default BlogDetail;
