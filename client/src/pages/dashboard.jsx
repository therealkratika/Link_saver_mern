import React, { useState, useMemo, useEffect } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
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

  const currentView =
    location.pathname.split('/').pop() || 'home';

  useEffect(() => {

    const fetchLinks = async () => {
      try {

        const res = await LinkSDK.getLinks();

        setLinks(res.data);

      } catch (err) {
        console.error(err);
      }
    };

    fetchLinks();

  }, []);
  const handleLogout = () => {
    AuthSDK.logout();
    navigate("/login");
    window.location.reload();
  };
  const handleToggleFavorite = async (id) => {
    try {

      await LinkSDK.toggleFavorite(id);

      setLinks(prev =>
        prev.map(link =>
          link._id === id
            ? {
                ...link,
                isFavorite: !link.isFavorite
              }
            : link
        )
      );

      showToast('Updated favorites');

    } catch (err) {
      console.error(err);
    }
  };
  const handleEdit = (id) => {

    const link = links.find(l => l._id === id);

    if (link) {
      setEditingLink(link);
      setIsModalOpen(true);
    }
  };
  const handleDelete = async (id) => {
    try {

      await LinkSDK.deleteLink(id);

      setLinks(prev =>
        prev.filter(link => link._id !== id)
      );

      showToast('Link deleted');

    } catch (err) {
      console.error(err);
    }
  };
const handleSaveLink = async (linkData) => {

  try {

    let validatedUrl = linkData.url.trim();

    if (
      !validatedUrl.startsWith("http://") &&
      !validatedUrl.startsWith("https://")
    ) {
      validatedUrl = `https://${validatedUrl}`;
    }

    new URL(validatedUrl);

    const safeData = {
      ...linkData,
      url: validatedUrl,
    };

    console.log("SAFE DATA:", safeData);

    if (editingLink) {

      const res = await LinkSDK.updateLink(
        editingLink._id,
        safeData
      );

      setLinks(prev =>
        prev.map(link =>
          link._id === editingLink._id
            ? res.data
            : link
        )
      );

      showToast("Link updated successfully");

      setEditingLink(null);

    } else {

      const res = await LinkSDK.createLink(
        safeData
      );

      setLinks(prev => [
        res.data,
        ...prev
      ]);

      showToast("New link saved");
    }

    setIsModalOpen(false);

  } catch (err) {

    console.error(err);

    showToast(
      err?.response?.data?.msg ||
      "Invalid URL"
    );
  }
};
  const allTags = useMemo(() => {

    const tagSet = new Set();

    links.forEach(link =>
      link.tags?.forEach(tag => tagSet.add(tag))
    );

    return Array.from(tagSet).sort();

  }, [links]);
  const filteredLinks = useMemo(() => {

    let filtered = links;

    if (currentView === 'favorites') {
      filtered = filtered.filter(l => l.isFavorite);
    }

    if (selectedTag) {
      filtered = filtered.filter(l =>
        l.tags?.includes(selectedTag)
      );
    }

    if (searchQuery) {

      const q = searchQuery.toLowerCase();

      filtered = filtered.filter(link =>
        link.title.toLowerCase().includes(q) ||
        link.url.toLowerCase().includes(q)
      );
    }

    return filtered;

  }, [
    links,
    currentView,
    searchQuery,
    selectedTag
  ]);

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
              onClick={() => {
                setEditingLink(null);
                setIsModalOpen(true);
              }}
              className="hidden md:flex px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all items-center gap-2 shadow-sm font-semibold"
            >
              Add Link
            </button>

          </div>

          <Routes>

            <Route
              path="tags"
              element={
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">

                  {allTags.map(tag => (

                    <button
                      key={tag}
                      onClick={() => {
                        setSelectedTag(tag);
                        navigate('/dashboard');
                      }}
                      className="p-6 bg-white border border-gray-200 rounded-2xl hover:border-blue-500 hover:shadow-md transition-all text-left group"
                    >
                      <div className="text-2xl mb-2">
                        🏷️
                      </div>

                      <h3 className="font-bold text-gray-800">
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

                      <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-sm font-semibold">
                        #{selectedTag}
                      </span>

                      <button
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

                      {filteredLinks.map(link => (

                        <LinkCard
                          key={link._id}
                          link={link}
                          onToggleFavorite={() =>
                            handleToggleFavorite(link._id)
                          }
                          onEdit={() =>
                            handleEdit(link._id)
                          }
                          onDelete={() =>
                            handleDelete(link._id)
                          }
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