import React, { useState, useMemo, useEffect } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Sidebar } from '../component/sidebar';
import { LinkCard } from '../component/linkcard';
import { AddLinkModal } from '../component/addLink';
import { EmptyState } from '../component/emptyState';
import { SearchBar } from '../component/search';
import { LinkSDK } from '../Api/linkSDK';
import { AuthSDK } from '../Api/AuthSDK';

export function Dashboard({ showToast }) {
  const navigate = useNavigate();
  const location = useLocation();

  const [links, setLinks] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingLink, setEditingLink] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const currentView = location.pathname.split('/').pop() || 'home';

  useEffect(() => {
    let isMounted = true;
    const fetchLinks = async () => {
      try {
        const res = await LinkSDK.getLinks();
        if (isMounted) {
          setLinks(res.data);
        }
      } catch (err) {
        console.error(err);
        if (isMounted) {
          showToast?.('Failed to load links');
        }
      }
    };

    fetchLinks();
    return () => {
      isMounted = false;
    };
  }, [showToast]);

  const handleLogout = () => {
    AuthSDK.logout();
    navigate('/login');
  };

  const handleToggleFavorite = async (id) => {
    const previousLinks = [...links];

    setLinks((prev) =>
      prev.map((link) =>
        link._id === id
          ? {
              ...link,
              isFavorite: !link.isFavorite,
            }
          : link
      )
    );

    try {
      await LinkSDK.toggleFavorite(id);
      showToast?.('Updated favorites');
    } catch (err) {
      console.error(err);
      setLinks(previousLinks);
      showToast?.('Failed to update favorite');
    }
  };

  const handleEdit = (id) => {
    const link = links.find((l) => l._id === id);
    if (link) {
      setEditingLink(link);
      setIsModalOpen(true);
    }
  };

  const handleDelete = async (id) => {
    const previousLinks = [...links];

    setLinks((prev) => prev.filter((link) => link._id !== id));

    try {
      await LinkSDK.deleteLink(id);
      showToast?.('Link deleted');
    } catch (err) {
      console.error(err);
      setLinks(previousLinks);
      showToast?.('Failed to delete link');
    }
  };

  const handleSaveLink = async (linkData) => {
    try {
      let validatedUrl = linkData.url.trim();

      if (
        !validatedUrl.startsWith('http://') &&
        !validatedUrl.startsWith('https://')
      ) {
        validatedUrl = `https://${validatedUrl}`;
      }

      new URL(validatedUrl);

      const safeData = {
        ...linkData,
        url: validatedUrl,
      };

      if (editingLink) {
        const res = await LinkSDK.updateLink(editingLink._id, safeData);

        setLinks((prev) =>
          prev.map((link) =>
            link._id === editingLink._id ? res.data : link
          )
        );

        showToast?.('Link updated successfully');
        setEditingLink(null);
      } else {
        const res = await LinkSDK.createLink(safeData);

        setLinks((prev) => [res.data, ...prev]);
        showToast?.('New link saved');
      }

      setIsModalOpen(false);
    } catch (err) {
      console.error(err);
      showToast?.(err?.response?.data?.msg || 'Invalid URL');
    }
  };

  const allTags = useMemo(() => {
    const tagSet = new Set();
    links.forEach((link) =>
      link.tags?.forEach((tag) => tagSet.add(tag))
    );
    return Array.from(tagSet).sort((a, b) => a.localeCompare(b));
  }, [links]);

  const filteredLinks = useMemo(() => {
    let filtered = links;

    if (currentView === 'favorites') {
      filtered = filtered.filter((l) => l.isFavorite);
    }

    if (selectedTag) {
      filtered = filtered.filter((l) => l.tags?.includes(selectedTag));
    }

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (link) =>
          link.title?.toLowerCase().includes(q) ||
          link.url?.toLowerCase().includes(q)
      );
    }

    return filtered;
  }, [links, currentView, searchQuery, selectedTag]);

  return (
    <div className="flex h-screen bg-gray-50 text-gray-900 font-sans">
      <Sidebar
        currentView={currentView}
        onViewChange={(view) =>
          navigate(`/dashboard/${view === 'home' ? '' : view}`)
        }
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        onLogout={handleLogout}
      />

      <main className="flex-1 overflow-auto">
        <div className="max-w-7xl mx-auto p-4 md:p-8 pt-20 md:pt-8">
          <div className="flex items-center justify-between mb-6 md:hidden">
            <button
              type="button"
              onClick={() => setIsSidebarOpen(true)}
              className="p-2 rounded-lg border border-gray-200 bg-white shadow-sm hover:bg-gray-50"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-6 h-6 text-gray-700"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>

            <button
              type="button"
              onClick={() => {
                setEditingLink(null);
                setIsModalOpen(true);
              }}
              className="px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white rounded-lg transition-all shadow-sm font-medium"
            >
              Add Link
            </button>
          </div>

          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold capitalize">
                {currentView === 'dashboard'
                  ? 'Overview'
                  : currentView.replace('-', ' ')}
              </h2>

              <p className="text-gray-500 mt-1">
                {currentView === 'tags'
                  ? `${allTags.length} tags`
                  : `${filteredLinks.length} links`}
              </p>
            </div>

            <button
              type="button"
              onClick={() => {
                setEditingLink(null);
                setIsModalOpen(true);
              }}
              className="hidden md:flex px-6 py-3 bg-violet-600 hover:bg-violet-700 text-white rounded-xl transition-all items-center gap-2 shadow-sm font-semibold"
            >
              <svg
                width="20"
                height="20"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                viewBox="0 0 24 24"
              >
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
              Add Link
            </button>
          </div>

          <Routes>
            <Route
              path="tags"
              element={
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {allTags.map((tag) => (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => {
                        setSelectedTag(tag);
                        navigate('/dashboard');
                      }}
                      className="p-6 bg-white border border-gray-200 rounded-2xl hover:border-violet-500 hover:shadow-md transition-all text-left group"
                    >
                      <div className="text-2xl mb-2">🏷️</div>
                      <h3 className="font-bold text-gray-800 group-hover:text-violet-600 transition-colors">
                        #{tag}
                      </h3>
                    </button>
                  ))}
                </div>
              }
            />

            <Route
              path="*"
              element={
                <>
                  <div className="mb-6">
                    <SearchBar
                      value={searchQuery}
                      onChange={setSearchQuery}
                    />
                  </div>

                  {selectedTag && (
                    <div className="mb-4 flex items-center gap-2">
                      <span className="px-3 py-1 bg-violet-50 text-violet-600 rounded-full text-sm font-semibold border border-violet-100">
                        #{selectedTag}
                      </span>

                      <button
                        type="button"
                        onClick={() => setSelectedTag(null)}
                        className="text-sm text-gray-400 hover:text-gray-600 underline"
                      >
                        Clear filter
                      </button>
                    </div>
                  )}

                  {filteredLinks.length === 0 ? (
                    <EmptyState
                      title="No links found"
                      onAddLink={() => setIsModalOpen(true)}
                    />
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {filteredLinks.map((link) => (
                        <LinkCard
                          key={link._id}
                          link={link}
                          onToggleFavorite={() =>
                            handleToggleFavorite(link._id)
                          }
                          onEdit={() => handleEdit(link._id)}
                          onDelete={() => handleDelete(link._id)}
                          showToast={showToast}
                        />
                      ))}
                    </div>
                  )}
                </>
              }
            />
          </Routes>
        </div>
      </main>

      <AddLinkModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveLink}
        editLink={editingLink}
      />
    </div>
  );
}

Dashboard.propTypes = {
  showToast: PropTypes.func.isRequired,
};