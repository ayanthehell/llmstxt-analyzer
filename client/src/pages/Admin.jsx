import React, { useState, useEffect } from 'react';
import { signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';
import { Lock, Save, LayoutTemplate, FileText, Settings, Loader2, CheckCircle2, HelpCircle, Plus, Trash2, BookOpen, Edit2, ArrowLeft, Wrench } from 'lucide-react';
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
    try {
      await signInWithEmailAndPassword(auth, 'admin@llmstxt.in.net', password);
      setIsAuthenticated(true);
    } catch (err) {
      setLoginError('Invalid password or user not found. Ensure admin@llmstxt.in.net exists in Firebase Auth.');
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    setSaveSuccess(false);
    try {
      const docRef = doc(db, "content", "website");
      await setDoc(docRef, formData);
      await refreshCMS();
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      alert('Failed to save changes. Make sure you are logged in and have permission.');
      console.error(err);
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

  const handleNestedChange = (section, parentKey, childKey, value) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [parentKey]: {
          ...prev[section]?.[parentKey],
          [childKey]: value
        }
      }
    }));
  };

  const handleArrayChange = (section, arrayKey, index, field, value) => {
    setFormData(prev => {
      const newArray = [...(prev[section]?.[arrayKey] || [])];
      newArray[index] = { ...newArray[index], [field]: value };
      return {
        ...prev,
        [section]: {
          ...prev[section],
          [arrayKey]: newArray
        }
      };
    });
  };

  const addArrayItem = (section, arrayKey, template) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [arrayKey]: [...(prev[section]?.[arrayKey] || []), template]
      }
    }));
  };

  const removeArrayItem = (section, arrayKey, index) => {
    setFormData(prev => {
      const newArray = [...(prev[section]?.[arrayKey] || [])];
      newArray.splice(index, 1);
      return {
        ...prev,
        [section]: {
          ...prev[section],
          [arrayKey]: newArray
        }
      };
    });
  };

  const handleNestedArrayChange = (section, parentKey, arrayKey, index, field, value) => {
    setFormData(prev => {
      const newArray = [...(prev[section]?.[parentKey]?.[arrayKey] || [])];
      newArray[index] = { ...newArray[index], [field]: value };
      return {
        ...prev,
        [section]: {
          ...prev[section],
          [parentKey]: {
            ...prev[section]?.[parentKey],
            [arrayKey]: newArray
          }
        }
      };
    });
  };

  const addNestedArrayItem = (section, parentKey, arrayKey, template) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [parentKey]: {
          ...prev[section]?.[parentKey],
          [arrayKey]: [...(prev[section]?.[parentKey]?.[arrayKey] || []), template]
        }
      }
    }));
  };

  const removeNestedArrayItem = (section, parentKey, arrayKey, index) => {
    setFormData(prev => {
      const newArray = [...(prev[section]?.[parentKey]?.[arrayKey] || [])];
      newArray.splice(index, 1);
      return {
        ...prev,
        [section]: {
          ...prev[section],
          [parentKey]: {
            ...prev[section]?.[parentKey],
            [arrayKey]: newArray
          }
        }
      };
    });
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

  const renderArrayInput = (sectionKey, arrayKey, itemTemplate) => {
    const arr = formData[sectionKey]?.[arrayKey] || [];
    return (
      <div className="space-y-4 mb-6 border border-gray-200 rounded-2xl p-4 bg-gray-50/50">
        <h4 className="font-bold text-gray-800 capitalize">{arrayKey}</h4>
        {arr.map((item, idx) => (
          <div key={idx} className="glass-panel p-4 rounded-xl border border-gray-200 relative">
            <button 
              onClick={() => removeArrayItem(sectionKey, arrayKey, idx)}
              className="absolute top-2 right-2 text-red-500 hover:text-red-700 transition-colors"
              title="Remove"
            >
              <Trash2 className="w-4 h-4" />
            </button>
            <div className="grid gap-3 pt-4">
              {Object.keys(item).map(field => (
                <div key={field}>
                  <label className="block text-xs font-semibold text-gray-600 mb-1 capitalize">{field}</label>
                  {field === 'answer' || field.includes('desc') || item[field].length > 100 ? (
                    <textarea
                      value={item[field]}
                      onChange={e => handleArrayChange(sectionKey, arrayKey, idx, field, e.target.value)}
                      className="w-full glass-input rounded-xl px-4 py-2 resize-none"
                      rows="3"
                    />
                  ) : (
                    <input
                      type="text"
                      value={item[field]}
                      onChange={e => handleArrayChange(sectionKey, arrayKey, idx, field, e.target.value)}
                      className="w-full glass-input rounded-xl px-4 py-2"
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
        <button 
          onClick={() => addArrayItem(sectionKey, arrayKey, itemTemplate)}
          className="w-full py-2 border-2 border-dashed border-gray-300 rounded-xl text-gray-500 font-medium hover:border-blue-400 hover:text-blue-600 transition-colors flex items-center justify-center gap-2 text-sm"
        >
          <Plus className="w-4 h-4" /> Add Item
        </button>
      </div>
    );
  };

  const renderNestedArrayInput = (sectionKey, parentKey, arrayKey, itemTemplate) => {
    const arr = formData[sectionKey]?.[parentKey]?.[arrayKey] || [];
    return (
      <div className="space-y-4 mb-4 border border-blue-100 rounded-xl p-4 bg-white shadow-sm">
        <h5 className="font-bold text-blue-800 capitalize text-sm">{arrayKey}</h5>
        {arr.map((item, idx) => (
          <div key={idx} className="bg-slate-50 p-3 rounded-lg border border-gray-200 relative">
            <button 
              onClick={() => removeNestedArrayItem(sectionKey, parentKey, arrayKey, idx)}
              className="absolute top-2 right-2 text-red-500 hover:text-red-700 transition-colors"
              title="Remove"
            >
              <Trash2 className="w-4 h-4" />
            </button>
            <div className="grid gap-2 pt-4">
              {Object.keys(item).map(field => (
                <div key={field}>
                  <label className="block text-[10px] uppercase font-bold text-gray-500 mb-1">{field}</label>
                  <input
                    type="text"
                    value={item[field]}
                    onChange={e => handleNestedArrayChange(sectionKey, parentKey, arrayKey, idx, field, e.target.value)}
                    className="w-full glass-input rounded-lg px-3 py-1.5 text-sm"
                  />
                </div>
              ))}
            </div>
          </div>
        ))}
        <button 
          onClick={() => addNestedArrayItem(sectionKey, parentKey, arrayKey, itemTemplate)}
          className="w-full py-2 border border-dashed border-blue-300 rounded-lg text-blue-500 font-medium hover:bg-blue-50 transition-colors flex items-center justify-center gap-1 text-xs"
        >
          <Plus className="w-3 h-3" /> Add {arrayKey}
        </button>
      </div>
    );
  };

  const renderObjectInput = (sectionKey, objKey) => {
    const obj = formData[sectionKey]?.[objKey] || {};
    return (
      <div className="mb-6 border border-gray-200 rounded-2xl p-4 bg-gray-50/50">
        <h4 className="font-bold text-gray-800 capitalize mb-4">{objKey}</h4>
        <div className="space-y-4">
          {Object.keys(obj).map(field => {
            if (Array.isArray(obj[field])) {
              let template = { title: '', desc: '' };
              return <div key={field}>{renderNestedArrayInput(sectionKey, objKey, field, template)}</div>;
            }
            return (
              <div key={field}>
                <label className="block text-xs font-semibold text-gray-600 mb-1 capitalize">{field.replace(/([A-Z])/g, ' $1').trim()}</label>
                {obj[field].length > 80 || obj[field].includes('<p>') || field.startsWith('p') || field.includes('Text') ? (
                  <textarea
                    value={obj[field]}
                    onChange={e => handleNestedChange(sectionKey, objKey, field, e.target.value)}
                    className="w-full glass-input rounded-xl px-4 py-2 resize-none"
                    rows="3"
                  />
                ) : (
                  <input
                    type="text"
                    value={obj[field]}
                    onChange={e => handleNestedChange(sectionKey, objKey, field, e.target.value)}
                    className="w-full glass-input rounded-xl px-4 py-2"
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
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

    // Generic Object Rendering
    return Object.keys(sectionData).map(key => {
      if (Array.isArray(sectionData[key])) {
        // Steps, faqs, useCases
        let template = { icon: 'Search', title: '', desc: '' };
        if (key === 'faqs') template = { question: '', answer: '' };
        if (key === 'steps') template = { icon: 'Search', title: '', description: '' };

        return <div key={key}>{renderArrayInput(sectionKey, key, template)}</div>;
      }

      if (typeof sectionData[key] === 'object' && sectionData[key] !== null) {
        // whatIs
        return <div key={key}>{renderObjectInput(sectionKey, key)}</div>;
      }

      return (
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
      );
    });
  };

  const tabs = [
    { id: 'home', icon: LayoutTemplate, label: 'Home Page' },
    { id: 'about', icon: BookOpen, label: 'About Page' },
    { id: 'emiCalculator', icon: Wrench, label: 'EMI Calculator' },
    { id: 'sipCalculator', icon: Wrench, label: 'SIP Calculator' },
    { id: 'gstCalculator', icon: Wrench, label: 'GST Calculator' },
    { id: 'electricityBillCalculator', icon: Wrench, label: 'Electricity Bill' },
    { id: 'cgpaConverter', icon: Wrench, label: 'CGPA Converter' },
    { id: 'landUnitConverter', icon: Wrench, label: 'Land Converter' },
    { id: 'salarySlipGenerator', icon: Wrench, label: 'Salary Slip' },
    { id: 'rentAgreementGenerator', icon: Wrench, label: 'Rent Agreement' },
    { id: 'leaveApplicationGenerator', icon: Wrench, label: 'Leave App' },
    { id: 'robotsTxtGenerator', icon: Wrench, label: 'Robots.txt Gen' },
    { id: 'llmsTxtBuilder', icon: Wrench, label: 'llms.txt Builder' },
    { id: 'seo', icon: Settings, label: 'Global SEO' },
    { id: 'faqs', icon: HelpCircle, label: 'Global FAQs' },
    { id: 'blogs', icon: BookOpen, label: 'Blogs' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 flex flex-col md:flex-row gap-8 min-h-[80vh]">
      {/* Sidebar */}
      <div className="w-full md:w-64 shrink-0 space-y-1 h-[75vh] overflow-y-auto custom-scrollbar pr-2">
        <div className="mb-6 px-4 sticky top-0 bg-white/80 backdrop-blur-md py-2 z-10">
          <h2 className="text-xl font-bold text-gray-900">CMS Admin</h2>
          <p className="text-sm text-gray-500">Manage page content</p>
        </div>
        
        {tabs.map(tab => (
          <button 
            key={tab.id}
            onClick={() => { setActiveTab(tab.id); setEditingBlogId(null); }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors text-left font-medium ${activeTab === tab.id ? 'bg-blue-50 text-blue-700' : 'text-gray-600 hover:bg-gray-50'}`}
          >
            <tab.icon className="w-4 h-4 shrink-0" /> <span className="text-sm">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Main Content Area */}
      <div className="flex-1 glass-panel rounded-3xl p-6 md:p-8 h-[80vh] overflow-y-auto custom-scrollbar">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8 pb-4 border-b border-gray-100 sticky top-0 bg-white/80 backdrop-blur-md z-10 pt-2">
          <h2 className="text-2xl font-bold text-gray-900 capitalize">
            {activeTab === 'blogs' && editingBlogId ? 'Edit Blog' : `${activeTab.replace(/([A-Z])/g, ' $1').trim()} Editor`}
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

        <div className="max-w-4xl">
          {renderInputs(activeTab)}
        </div>
      </div>
    </div>
  );
};

export default Admin;
