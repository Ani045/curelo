import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCMS } from '../context/CMSContext';
import DefaultTemplate from '../templates/DefaultTemplate';
import MinimalTemplate from '../templates/MinimalTemplate';

const HomePage = () => {
  const params = useParams();
  const slug = params['*'];
  const navigate = useNavigate();
  const { data, activeTemplate, setActivePage, getAllPages, loading, hasError, activePageSlug } = useCMS();

  useEffect(() => {
    if (loading) return;

    // Clean slug: remove trailing slash and leading/trailing whitespace
    const cleanSlug = (slug || '').replace(/\/$/, '').trim();
    const pageSlug = cleanSlug || 'home';
    const pages = getAllPages();
    const pageExists = pages.some(p => p.slug === pageSlug);

    console.log(`[Router] Checking slug: "${pageSlug}". Exists: ${pageExists}. loading: ${loading}, hasError: ${hasError}`);

    if (pageExists) {
      setActivePage(pageSlug);
    } else if (cleanSlug && !loading && !hasError) {
      // ONLY redirect if we are CERTAIN it doesn't exist (loading is false and no server error)
      console.warn(`[Router] Page "${cleanSlug}" not found in merged state. Redirecting to home.`);
      navigate('/', { replace: true });
    } else if (hasError) {
      console.error(`[Router] Server error detected while checking for "${pageSlug}". Redirection paused to prevent false 404.`);
    }
  }, [slug, setActivePage, getAllPages, navigate, loading, hasError]);

  const currentSlug = (slug || '').replace(/\/$/, '') || 'home';

  if (loading || activePageSlug !== currentSlug || !data || !data.hero) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center gap-4">
        <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
        <div className="text-xl font-semibold text-gray-400">
          {hasError ? 'Difficulty reaching server. Trying local data...' : 'Loading Page Data...'}
        </div>
        {hasError && (
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-bold"
          >
            Retry Update
          </button>
        )}
      </div>
    );
  }

  const renderTemplate = () => {
    switch (activeTemplate) {
      case 'minimal':
        return <MinimalTemplate />;
      case 'default':
      default:
        return <DefaultTemplate />;
    }
  };

  return renderTemplate();
};

export default HomePage;