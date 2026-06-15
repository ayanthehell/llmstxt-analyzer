import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Lock, Save, LayoutTemplate, FileText, Settings, Loader2, CheckCircle2, HelpCircle, Plus, Trash2, BookOpen, Edit2, ArrowLeft } from 'lucide-react';
import { useCMS } from '../components/CMSContext';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const Admin = () => {
  const { cmsData, refreshCMS } = useCMS();
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [formData, setFormData] = useState(null);
  const [activeTab, setActiveTab] = useState('home');
  const [editingBlogId, setEditingBlogId] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [loginError, setLoginError] = useState('');

  // Initialize form data when CMS data loads
  useEffect(() => {
    if (cmsData && !formData) {
      setFormData(JSON.parse(JSON.stringify(cmsData))); // deep copy
    }
  }, [cmsData]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError('');
    // Try a dummy save to verify password
    try {
      let apiUrl = '/api/cms';
      if (import.meta.env.VITE_API_URL) apiUrl = import.meta.env.VITE_API_URL.replace('/analyze', '/cms');
      
      // We send the existing data to verify
      await axios.post(apiUrl, { data: cmsData || {}, password });
      setIsAuthenticated(true);
    } catch (err) {
      setLoginError('Invalid password.');
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    setSaveSuccess(false);
    try {
      let apiUrl = '/api/cms';
      if (import.meta.env.VITE_API_URL) apiUrl = import.meta.env.VITE_API_URL.replace('/analyze', '/cms');
      
      await axios.post(apiUrl, { data: formData, password });
      await refreshCMS();
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      alert('Failed to save changes.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleChange = (section, key, value) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [key]: value
      }
    }));
  };

  const handleFaqChange = (index, key, value) => {
    setFormData(prev => {
      const newFaqs = [...(prev.faqs || [])];
      newFaqs[index] = { ...newFaqs[index], [key]: value };
      return { ...prev, faqs: newFaqs };
    });
  };

  const addFaq = () => {
    setFormData(prev => ({
      ...prev,
      faqs: [...(prev.faqs || []), { question: 'New Question', answer: 'New Answer' }]
    }));
  };

  const removeFaq = (index) => {
    setFormData(prev => {
      const newFaqs = [...(prev.faqs || [])];
      newFaqs.splice(index, 1);
      return { ...prev, faqs: newFaqs };
    });
  };

  const createNewBlog = () => {
    const newId = Date.now().toString();
    setFormData(prev => ({
      ...prev,
      blogs: [...(prev.blogs || []), {
        id: newId,
        title: 'New Blog Post',
        slug: 'new-blog-post-' + newId,
        category: 'General',
        tags: '',
        featureImage: '',
        imageAlt: '',
        metaTitle: '',
        metaDescription: '',
        body: '<p>Start writing your blog post here...</p>',
        status: 'draft',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }]
    }));
    setEditingBlogId(newId);
  };

  const handleBlogChange = (id, key, value) => {
    setFormData(prev => {
      const newBlogs = [...(prev.blogs || [])];
      const blogIndex = newBlogs.findIndex(b => b.id === id);
      if (blogIndex > -1) {
        newBlogs[blogIndex] = { ...newBlogs[blogIndex], [key]: value, updatedAt: new Date().toISOString() };
      }
      return { ...prev, blogs: newBlogs };
    });
  };

  const deleteBlog = (id) => {
    if (confirm('Are you sure you want to delete this blog post?')) {
      setFormData(prev => ({
        ...prev,
        blogs: prev.blogs.filter(b => b.id !== id)
      }));
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center p-4">
        <div className="glass-panel p-8 max-w-md w-full rounded-3xl">
          <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-6 mx-auto">
            <Lock className="w-6 h-6 text-gray-700" />
          </div>
          <h1 className="text-2xl font-bold text-center mb-6 text-gray-900">Admin Login</h1>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <input
                type="password"
                placeholder="Master Password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full glass-input rounded-xl px-4 py-3"
                required
              />
            </div>
            {loginError && <p className="text-red-500 text-sm text-center">{loginError}</p>}
            <button type="submit" className="w-full glass-button-primary rounded-xl px-4 py-3 font-semibold">
              Enter Dashboard
            </button>
          </form>
        </div>
      </div>
    );
  }

  if (!formData) return <div className="text-center py-20"><Loader2 className="w-8 h-8 animate-spin mx-auto text-blue-500"/></div>;

  const quillModules = {
    toolbar: [
      [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      ['link', 'clean']
    ],
  };

  const renderInputs = (sectionKey) => {
    const sectionData = formData[sectionKey];
    if (!sectionData && sectionKey !== 'blogs') return null;
    
    if (sectionKey === 'blogs') {
      const blogs = formData.blogs || [];

      if (editingBlogId) {
        const blog = blogs.find(b => b.id === editingBlogId);
        if (!blog) {
          setEditingBlogId(null);
          return null;
        }

        return (
          <div className="space-y-6">
            <button 
              onClick={() => setEditingBlogId(null)}
              className="flex items-center gap-2 text-gray-500 hover:text-blue-600 transition-colors font-medium mb-4"
            >
              <ArrowLeft className="w-4 h-4" /> Back to Blogs
            </button>
            
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input
                  type="text"
                  value={blog.title}
                  onChange={e => handleBlogChange(blog.id, 'title', e.target.value)}
                  className="w-full glass-input rounded-xl px-4 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Slug (URL)</label>
                <input
                  type="text"
                  value={blog.slug}
                  onChange={e => handleBlogChange(blog.id, 'slug', e.target.value)}
                  className="w-full glass-input rounded-xl px-4 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <input
                  type="text"
                  value={blog.category}
                  onChange={e => handleBlogChange(blog.id, 'category', e.target.value)}
                  className="w-full glass-input rounded-xl px-4 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tags (comma separated)</label>
                <input
                  type="text"
                  value={blog.tags}
                  onChange={e => handleBlogChange(blog.id, 'tags', e.target.value)}
                  className="w-full glass-input rounded-xl px-4 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Feature Image URL</label>
                <input
                  type="text"
                  value={blog.featureImage}
                  onChange={e => handleBlogChange(blog.id, 'featureImage', e.target.value)}
                  className="w-full glass-input rounded-xl px-4 py-2"
                  placeholder="https://example.com/image.jpg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Image Alt Text</label>
                <input
                  type="text"
                  value={blog.imageAlt}
                  onChange={e => handleBlogChange(blog.id, 'imageAlt', e.target.value)}
                  className="w-full glass-input rounded-xl px-4 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Meta Title</label>
                <input
                  type="text"
                  value={blog.metaTitle}
                  onChange={e => handleBlogChange(blog.id, 'metaTitle', e.target.value)}
                  className="w-full glass-input rounded-xl px-4 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Meta Description</label>
                <input
                  type="text"
                  value={blog.metaDescription}
                  onChange={e => handleBlogChange(blog.id, 'metaDescription', e.target.value)}
                  className="w-full glass-input rounded-xl px-4 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                  value={blog.status}
                  onChange={e => handleBlogChange(blog.id, 'status', e.target.value)}
                  className="w-full glass-input rounded-xl px-4 py-2"
                >
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 mt-4">Blog Body</label>
              <div className="bg-white rounded-xl overflow-hidden border border-gray-200">
                <ReactQuill 
                  theme="snow"
                  modules={quillModules}
                  value={blog.body} 
                  onChange={(content) => handleBlogChange(blog.id, 'body', content)} 
                />
              </div>
            </div>
          </div>
        );
      }

      return (
        <div className="space-y-4">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold text-gray-900">Manage Blogs</h3>
            <button 
              onClick={createNewBlog}
              className="glass-button-primary px-4 py-2 rounded-xl text-sm font-medium flex items-center gap-2"
            >
              <Plus className="w-4 h-4" /> Add New Blog
            </button>
          </div>
          
          {blogs.length === 0 ? (
            <div className="text-center py-10 text-gray-500 bg-gray-50 rounded-2xl border border-gray-100">
              No blogs found. Create your first post!
            </div>
          ) : (
            <div className="grid gap-4">
              {blogs.map(blog => (
                <div key={blog.id} className="glass-panel p-4 rounded-xl flex items-center justify-between group">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-lg bg-gray-100 overflow-hidden shrink-0">
                      {blog.featureImage ? (
                        <img src={blog.featureImage} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                          <BookOpen className="w-5 h-5" />
                        </div>
                      )}
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">{blog.title}</h4>
                      <div className="flex gap-2 text-xs text-gray-500 mt-1">
                        <span className={`px-2 py-0.5 rounded-full ${blog.status === 'published' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                          {blog.status}
                        </span>
                        <span>{new Date(blog.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => setEditingBlogId(blog.id)}
                      className="p-2 text-gray-400 hover:text-blue-600 transition-colors bg-white rounded-lg border border-gray-200 shadow-sm"
                      title="Edit"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => deleteBlog(blog.id)}
                      className="p-2 text-gray-400 hover:text-red-600 transition-colors bg-white rounded-lg border border-gray-200 shadow-sm"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      );
    }

    if (sectionKey === 'faqs') {
      return (
        <div className="space-y-6">
          {sectionData.map((faq, idx) => (
            <div key={idx} className="glass-panel p-4 rounded-2xl border border-gray-200 relative">
              <button 
                onClick={() => removeFaq(idx)}
                className="absolute top-4 right-4 text-red-500 hover:text-red-700 transition-colors"
                title="Remove FAQ"
              >
                <Trash2 className="w-5 h-5" />
              </button>
              <div className="mb-3 pr-8">
                <label className="block text-sm font-medium text-gray-700 mb-1">Question</label>
                <input
                  type="text"
                  value={faq.question}
                  onChange={e => handleFaqChange(idx, 'question', e.target.value)}
                  className="w-full glass-input rounded-xl px-4 py-2 font-medium"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Answer</label>
                <div className="bg-white rounded-xl overflow-hidden border border-gray-200">
                  <ReactQuill 
                    theme="snow"
                    modules={quillModules}
                    value={faq.answer} 
                    onChange={(content) => handleFaqChange(idx, 'answer', content)} 
                  />
                </div>
              </div>
            </div>
          ))}
          <button 
            onClick={addFaq}
            className="w-full py-3 border-2 border-dashed border-gray-300 rounded-2xl text-gray-500 font-medium hover:border-blue-400 hover:text-blue-600 transition-colors flex items-center justify-center gap-2"
          >
            <Plus className="w-5 h-5" /> Add New FAQ
          </button>
        </div>
      );
    }

    return Object.keys(sectionData).map(key => (
      <div key={key} className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1 capitalize">
          {key.replace(/([A-Z])/g, ' $1').trim()}
        </label>
        {sectionData[key].length > 100 || sectionData[key].includes('<p>') ? (
          <div className="bg-white rounded-xl overflow-hidden border border-gray-200">
            <ReactQuill 
              theme="snow"
              modules={quillModules}
              value={sectionData[key]} 
              onChange={(content) => handleChange(sectionKey, key, content)} 
            />
          </div>
        ) : (
          <input
            type="text"
            value={sectionData[key]}
            onChange={e => handleChange(sectionKey, key, e.target.value)}
            className="w-full glass-input rounded-xl px-4 py-2"
          />
        )}
      </div>
    ));
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-12 flex flex-col md:flex-row gap-8 min-h-[80vh]">
      {/* Sidebar */}
      <div className="w-full md:w-64 shrink-0 space-y-2">
        <div className="mb-8 px-4">
          <h2 className="text-xl font-bold text-gray-900">CMS Admin</h2>
          <p className="text-sm text-gray-500">Manage page content</p>
        </div>
        
        <button 
          onClick={() => setActiveTab('home')}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors font-medium ${activeTab === 'home' ? 'bg-blue-50 text-blue-700' : 'text-gray-600 hover:bg-gray-50'}`}
        >
          <LayoutTemplate className="w-5 h-5" /> Home Page
        </button>

        <button 
          onClick={() => setActiveTab('seo')}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors font-medium ${activeTab === 'seo' ? 'bg-blue-50 text-blue-700' : 'text-gray-600 hover:bg-gray-50'}`}
        >
          <Settings className="w-5 h-5" /> Global SEO
        </button>
        <button 
          onClick={() => { setActiveTab('faqs'); setEditingBlogId(null); }}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors font-medium ${activeTab === 'faqs' ? 'bg-blue-50 text-blue-700' : 'text-gray-600 hover:bg-gray-50'}`}
        >
          <HelpCircle className="w-5 h-5" /> FAQs
        </button>
        <button 
          onClick={() => { setActiveTab('blogs'); setEditingBlogId(null); }}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors font-medium ${activeTab === 'blogs' ? 'bg-blue-50 text-blue-700' : 'text-gray-600 hover:bg-gray-50'}`}
        >
          <BookOpen className="w-5 h-5" /> Blogs
        </button>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 glass-panel rounded-3xl p-6 md:p-8">
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-gray-100">
          <h2 className="text-2xl font-bold text-gray-900 capitalize">
            {activeTab === 'blogs' && editingBlogId ? 'Edit Blog' : `${activeTab} Editor`}
          </h2>
          <button 
            onClick={handleSave}
            disabled={isSaving}
            className="glass-button-primary rounded-xl px-6 py-2.5 font-semibold flex items-center gap-2"
          >
            {isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : 
             saveSuccess ? <CheckCircle2 className="w-5 h-5" /> : <Save className="w-5 h-5" />}
            {saveSuccess ? 'Saved!' : 'Save Changes'}
          </button>
        </div>

        <div className="max-w-3xl">
          {renderInputs(activeTab)}
        </div>
      </div>
    </div>
  );
};

export default Admin;
