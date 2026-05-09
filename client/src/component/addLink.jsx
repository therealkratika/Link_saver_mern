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

    } catch (error) {
      console.error('Invalid URL');
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
      // ignore invalid URL
    }
  };

  const handleAddTag = (e) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();

      const newTag = tagInput.trim();

      if (!tags.includes(newTag)) {
        setTags([...tags, newTag]);
      }

      setTagInput('');
    }
  };

  const removeTag = (tagToRemove) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

const handleSubmit = (e) => {

  e.preventDefault();

  if (!url || !title) return;

  console.log("TAGS BEFORE SAVE:", tags);

  onSave({
    url,
    title,
    favicon,
    tags,
  });

  onClose();
};

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      
      <div className="absolute inset-0 bg-gray-900/50 backdrop-blur-sm"
        onClick={onClose}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
       if (e.key === "Enter" || e.key === " ") {
         onClose();
      }
    }}
  />
      
      <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-lg p-6 overflow-hidden">
        
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">
            {editLink ? 'Edit Link' : 'Add New Link'}
          </h2>

          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M6 18L18 6M6 6l12 12" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label 
              htmlFor='url'
            className="block text-sm font-semibold text-gray-700 mb-2">URL</label>
            <input
              id="url"
              type="url"
              value={url}
              onChange={handleUrlChange}
              placeholder="https://example.com"
              required
              className="w-full px-4 py-2.5 border border-gray-300 bg-white text-gray-900 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
            />
          </div>
          {isLoading && (
            <div className="flex items-center gap-2 text-sm text-blue-600 animate-pulse">
              <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
              </svg>
              Fetching preview...
            </div>
          )}
          {favicon && (
            <div className="flex items-center gap-3 p-3 bg-gray-50 border border-gray-100 rounded-xl">
              <img
                src={favicon}
                alt=""
                className="w-8 h-8 rounded-md shadow-sm"
                onError={(e) => {
                  e.target.src = 'https://via.placeholder.com/32';
                }}
              />
              <div className="flex-1 min-w-0">
                <p className="font-bold text-gray-900 truncate text-sm">
                  {title || 'Preview'}
                </p>
                <p className="text-xs text-gray-500 truncate">{url}</p>
              </div>
            </div>
          )}
          <div>
            <label 
            htmlFor='title'
            className="block text-sm font-semibold text-gray-700 mb-2"
            >Title
            </label>
            <input
              id = "title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Page title"
              required
              className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
          <div>
            <label
             htmlFor='tags'
             className="block text-sm font-semibold text-gray-700 mb-2">Tags</label>
            <input
              id="tags"
              type="text"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={handleAddTag}
              placeholder="Press Enter to add tags"
              className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
            />

            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3">
                {tags.map(tag => (
                  <span
                    key={tag}
                    className="px-3 py-1 bg-blue-50 text-blue-600 rounded-lg text-sm font-bold flex items-center gap-2 border border-blue-100"
                  >
                    #{tag}
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="hover:text-blue-800"
                    >
                      <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path d="M6 18L18 6M6 6l12 12" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 font-semibold transition-colors"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 font-bold shadow-lg shadow-blue-200 transition-all active:scale-95"
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