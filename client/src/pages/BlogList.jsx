import React from 'react';
import { Link } from 'react-router-dom';
import { useCMS } from '../components/CMSContext';
import { Loader2, BookOpen, ChevronRight } from 'lucide-react';
import SEO, { SITE_URL, SITE_NAME } from '../components/SEO';

const BlogList = () => {
  const { cmsData, loading } = useCMS();

  if (loading || !cmsData) {
    return <div className="min-h-[60vh] flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-blue-500"/></div>;
  }

  const blogs = (cmsData.blogs || []).filter(b => b.status === 'published');

  // CollectionPage + BreadcrumbList schemas
  const collectionSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": "Blog — LLMS.TXT Analyzer",
    "url": `${SITE_URL}/blog`,
    "description": "Read the latest articles, guides, and updates about Generative Engine Optimization (GEO) and AI Search readiness.",
    "isPartOf": {
      "@type": "WebSite",
      "name": SITE_NAME,
      "url": SITE_URL
    }
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
      }
    ]
  };

  return (
    <div className="flex flex-col items-center w-full min-h-[80vh]">
      <SEO 
        title="Blog — AI Search Optimization Guides & News | LLMS.TXT Analyzer" 
        description="Read the latest articles, guides, and updates about Generative Engine Optimization (GEO), llms.txt best practices, and AI search readiness."
        canonical="/blog"
        schema={[collectionSchema, breadcrumbSchema]}
      />

      {/* Breadcrumb Navigation */}
      <nav className="w-full max-w-7xl mx-auto px-4 pt-8" aria-label="Breadcrumb">
        <ol className="flex items-center gap-2 text-sm text-slate-9000">
          <li><Link to="/" className="hover:text-blue-400 transition-colors">Home</Link></li>
          <li><ChevronRight className="w-3 h-3" /></li>
          <li className="text-slate-800 font-medium">Blog</li>
        </ol>
      </nav>
      
      <div className="w-full max-w-7xl mx-auto px-4 py-16">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">Latest Articles</h1>
          <p className="text-xl text-slate-600">
            Insights, guides, and news about <Link to="/about" className="text-blue-400 hover:underline">AI search readiness</Link> and Generative Engine Optimization.
          </p>
        </div>

        {blogs.length === 0 ? (
          <div className="text-center py-20 text-slate-600 glass-panel max-w-2xl mx-auto">
            <BookOpen className="w-12 h-12 text-slate-600 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-slate-900 mb-2">No posts yet</h3>
            <p>Check back soon for new articles!</p>
            <Link to="/" className="inline-block mt-6 text-blue-400 hover:underline font-medium">Try the Analyzer →</Link>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogs.map(blog => (
              <Link key={blog.id} to={`/blog/${blog.slug}`} className="glass-panel rounded-3xl overflow-hidden group hover:border-blue-200 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 flex flex-col">
                <div className="w-full h-48 bg-gray-100 relative overflow-hidden">
                  {blog.featureImage ? (
                    <img 
                      src={blog.featureImage} 
                      alt={blog.imageAlt || blog.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-blue-50 text-blue-200">
                      <BookOpen className="w-12 h-12" />
                    </div>
                  )}
                  {blog.category && (
                    <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-blue-600 shadow-sm uppercase tracking-wide">
                      {blog.category}
                    </div>
                  )}
                </div>
                
                <div className="p-6 flex flex-col flex-1">
                  <div className="text-xs text-gray-500 mb-3 flex items-center gap-2">
                    <time dateTime={blog.createdAt}>
                      {new Date(blog.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                    </time>
                  </div>
                  
                  <h3 className="text-xl font-bold text-slate-900 mb-3 line-clamp-2 group-hover:text-blue-400 transition-colors">
                    {blog.title}
                  </h3>
                  
                  <p className="text-slate-600 mb-6 line-clamp-3 flex-1 text-sm">
                    {blog.metaDescription || "Read more about this topic..."}
                  </p>
                  
                  <div className="mt-auto flex items-center text-blue-600 font-semibold text-sm group/btn">
                    Read Article 
                    <ChevronRight className="w-4 h-4 ml-1 group-hover/btn:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default BlogList;
