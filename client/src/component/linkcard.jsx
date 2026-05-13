import React from 'react';
import PropTypes from 'prop-types';
const LOCAL_FALLBACK_IMAGE = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IiNhYmFkYmQiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIj48cmVjdCB4PSIyIiB5PSIyIiB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHJ4PSI1IiByeT0iNSI+PC9yZWN0Pjwvc3ZnPg==';

export function LinkCard({ link, onToggleFavorite, onEdit, onDelete, showToast }) {
  
  const handleCopy = (e) => {
    e.stopPropagation();
    if (!link.url) return;
    
    navigator.clipboard.writeText(link.url)
      .then(() => {
        if (showToast) showToast('Link copied!');
      })
      .catch(() => {
        if (showToast) showToast('Failed to copy');
      });
  };

  const handleOpen = () => {
    try {
      const cleanUrl = link.url.trim(); 
      const parsedUrl = new URL(cleanUrl);
      const isSafeProtocol = parsedUrl.protocol === "http:" || parsedUrl.protocol === "https:";

      if (isSafeProtocol) {
        window.open(parsedUrl.href, "_blank", "noopener,noreferrer");
      } else {
        showToast?.("Invalid URL protocol");
      }
    } catch {
      showToast?.("Invalid URL");
    }
  };

  const formatDate = (date) => {
    if (!date) return '';
    const d = new Date(date);
    const now = new Date();
    const diff = now.getTime() - d.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days === 0) return 'Today';
    if (days === 1) return 'Yesterday';
    if (days < 7 && days > 0) return `${days} days ago`;
    return d.toLocaleDateString();
  };

  const getFavicon = () => {
    try {
      if (!link.url) return LOCAL_FALLBACK_IMAGE;
      const domain = new URL(link.url).hostname;
      return `https://icon.horse/icon/${domain}`;
    } catch {
      return LOCAL_FALLBACK_IMAGE;
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleOpen();
    }
  };

  return (
    <button
      type="button"
      onClick={handleOpen}
      onKeyDown={handleKeyDown}
      aria-label={`Open ${link.title}`}
      className="w-full text-left bg-white rounded-xl border border-gray-200 p-4 shadow-sm hover:shadow-md transition-all cursor-pointer group focus:outline-none focus:ring-2 focus:ring-violet-500"
    >
      <div className="flex items-start gap-3 mb-3">
        <img
          src={link.favicon || getFavicon()}
          alt=""
          className="w-6 h-6 rounded mt-0.5 object-contain"
          onError={(e) => {
            e.target.onerror = null; 
            e.target.src = LOCAL_FALLBACK_IMAGE;
          }}
        />

        <div className="flex-1 min-w-0">
          <h3 className="font-medium text-gray-900 truncate mb-1 group-hover:text-violet-600 transition-colors">
            {link.title || 'Untitled Link'}
          </h3>
          <p className="text-sm text-gray-500 truncate">{link.url}</p>
        </div>

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite(link._id);
          }}
          aria-label={link.isFavorite ? "Remove from favorites" : "Add to favorites"}
          className={`flex-shrink-0 transition-colors ${link.isFavorite ? 'text-yellow-500' : 'text-gray-300 hover:text-yellow-400'}`}
        >
          <svg width="20" height="20" fill={link.isFavorite ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
          </svg>
        </button>
      </div>

      {link.tags?.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-3">
          {link.tags.map((tag) => (
            <span key={tag} className="px-2.5 py-0.5 text-xs font-medium bg-violet-50 text-violet-600 rounded-full border border-violet-100">
              #{tag}
            </span>
          ))}
        </div>
      )}

      <div className="flex items-center justify-between pt-3 border-t border-gray-100">
        <span className="text-xs text-gray-400 font-medium">
          {formatDate(link.createdAt)}
        </span>

        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={handleCopy}
            className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded transition-all"
            title="Copy URL"
          >
            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
              <rect x="9" y="9" width="13" height="13" rx="2"></rect>
              <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"></path>
            </svg>
          </button>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onEdit(link._id);
            }}
            className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-gray-100 rounded transition-all"
            title="Edit Link"
          >
            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"></path>
              <path d="M18.5 2.5a2.121 2.121 0 113 3L12 15l-4 1 1-4 9.5-9.5z"></path>
            </svg>
          </button>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onDelete(link._id);
            }}
            className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-gray-100 rounded transition-all"
            title="Delete Link"
          >
            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M3 6h18"></path>
              <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6"></path>
              <path d="M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2"></path>
            </svg>
          </button>
        </div>
      </div>
    </button>
  );
}

LinkCard.propTypes = {
  link: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    url: PropTypes.string.isRequired,
    title: PropTypes.string,
    favicon: PropTypes.string,
    isFavorite: PropTypes.bool,
    tags: PropTypes.arrayOf(PropTypes.string),
    createdAt: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Date)]),
  }).isRequired,
  onToggleFavorite: PropTypes.func.isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  showToast: PropTypes.func,
};