import React, { useState, useEffect } from 'react';
import PropTypes from "prop-types";

export function AddLinkModal({ isOpen, onClose, onSave, editLink }) {
  const [url, setUrl] = useState('');
  const [title, setTitle] = useState('');
  const [favicon, setFavicon] = useState('');
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (editLink) {
      setUrl(editLink.url || '');
      setTitle(editLink.title || '');
      setFavicon(editLink.favicon || '');
      setTags(editLink.tags || []); 
    } else {
      setUrl('');
      setTitle('');
      setFavicon('');
      setTags([]);
      setTagInput('');
    }
  }, [editLink, isOpen]);

  const fetchPreview = async (inputUrl) => {
    setIsLoading(true);
    try {
      const domain = new URL(inputUrl).hostname;
      setFavicon(`https://icon.horse/icon/${domain}`);
      if (!title) {
        setTitle(domain.replace('www.', ''));
      }
    } catch {
      setFavicon(''); 
    }
    setIsLoading(false);
  };

  const handleUrlChange = (e) => {
    const newUrl = e.target.value;
    setUrl(newUrl);

    try {
      new URL(newUrl);
      fetchPreview(newUrl);
    } catch {
      setFavicon('');
    }
  };

  const handleAddTag = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault(); 
      const newTag = tagInput.trim();
      if (newTag && !tags.includes(newTag)) {
        setTags([...tags, newTag]);
        setTagInput(''); 
      }
    }
  };

  const removeTag = (tagToRemove) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!url || !title) return;
    let finalTags = [...tags];
    if (tagInput.trim() && !finalTags.includes(tagInput.trim())) {
      finalTags.push(tagInput.trim());
    }
    onSave({
      url,
      title,
      favicon,
      tags: finalTags,
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <button
        type="button"
        aria-label="Close modal"
        className="absolute inset-0 bg-black/80 backdrop-blur-sm cursor-default transition-opacity"
        onClick={onClose}
      />
      
      {/* Modal Dialog */}
      <div className="relative bg-[#12151C] border border-white/[0.08] rounded-2xl shadow-2xl shadow-black/80 w-full max-w-lg p-6 sm:p-8 overflow-hidden z-10 text-slate-100 font-sans selection:bg-emerald-500/20 selection:text-emerald-400">
        
        {/* Background Subtle Accent Glow */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500/05 blur-3xl rounded-full pointer-events-none" />

        {/* Modal Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold tracking-tight text-white">
            {editLink ? 'Edit Resource' : 'Add New Resource'}
          </h2>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
          >
            <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M6 18L18 6M6 6l12 12" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* URL Input */}
          <div>
            <label 
              htmlFor="url"
              className="block text-xs font-medium text-slate-300 mb-1.5 tracking-wide"
            >
              URL
            </label>
            <input
              id="url"
              type="url"
              value={url}
              onChange={handleUrlChange}
              placeholder="https://example.com"
              required
              className="w-full px-3.5 py-2.5 bg-[#0A0C10] border border-white/10 text-slate-100 text-sm placeholder:text-slate-600 rounded-lg focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-all"
            />
          </div>

          {/* Loading Indicator */}
          {isLoading && (
            <div className="flex items-center gap-2 text-xs text-emerald-400 animate-pulse">
              <svg className="animate-spin h-3.5 w-3.5" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" className="opacity-25"></circle>
                <path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Fetching preview metadata...
            </div>
          )}

          {/* Favicon & Site Preview Card */}
          {favicon && (
            <div className="flex items-center gap-3 p-3 bg-[#0A0C10] border border-white/[0.08] rounded-lg">
              <img
                src={favicon}
                alt=""
                className="w-7 h-7 rounded bg-white/5 p-1 object-contain"
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
              <div className="flex-1 min-w-0">
                <p className="font-medium text-slate-200 truncate text-xs">
                  {title || 'Preview'}
                </p>
                <p className="text-[11px] text-slate-500 truncate">{url}</p>
              </div>
            </div>
          )}

          {/* Title Input */}
          <div>
            <label 
              htmlFor="title"
              className="block text-xs font-medium text-slate-300 mb-1.5 tracking-wide"
            >
              Title
            </label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Resource title"
              required
              className="w-full px-3.5 py-2.5 bg-[#0A0C10] border border-white/10 text-slate-100 text-sm placeholder:text-slate-600 rounded-lg focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-all"
            />
          </div>

          {/* Tags Section */}
          <div>
            <label
              htmlFor="tags"
              className="block text-xs font-medium text-slate-300 mb-1.5 tracking-wide"
            >
              Tags
            </label>
            <input
              id="tags"
              type="text"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={handleAddTag}
              placeholder="Press Enter to add tags"
              className="w-full px-3.5 py-2.5 bg-[#0A0C10] border border-white/10 text-slate-100 text-sm placeholder:text-slate-600 rounded-lg focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-all"
            />

            {tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-2.5">
                {tags.map(tag => (
                  <span
                    key={tag}
                    className="px-2.5 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-md text-xs font-medium flex items-center gap-1.5 transition-colors"
                  >
                    #{tag}
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="hover:text-emerald-200"
                    >
                      <svg width="10" height="10" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path d="M6 18L18 6M6 6l12 12" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4 border-t border-white/[0.08] mt-6">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 font-medium text-sm rounded-lg transition-colors"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="flex-1 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold text-sm rounded-lg transition-all shadow-lg shadow-emerald-500/20 active:scale-[0.98]"
            >
              {editLink ? 'Update Link' : 'Save Link'}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}

AddLinkModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  editLink: PropTypes.shape({
    url: PropTypes.string,
    title: PropTypes.string,
    favicon: PropTypes.string,
    tags: PropTypes.arrayOf(PropTypes.string),
  }),
};