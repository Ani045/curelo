import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCMS } from '../context/CMSContext';
import DefaultTemplate from '../templates/DefaultTemplate';
import MinimalTemplate from '../templates/MinimalTemplate';

const HomePage = () => {
  const params = useParams();
  const slug = params['*'];
  const navigate = useNavigate();
  const { data, activeTemplate, setActivePage, getAllPages, loading } = useCMS();

  useEffect(() => {
    if (loading) return; // Wait for CMS data to load before checking slug existence

    const pageSlug = slug || 'home';
    const pages = getAllPages();
    const pageExists = pages.some(p => p.slug === pageSlug);

    if (pageExists) {
      setActivePage(pageSlug);
    } else if (slug) {
      // Only redirect if there was a slug and it was invalid
      navigate('/', { replace: true });
    }
  }, [slug, setActivePage, getAllPages, navigate, loading]);

  if (!data || !data.hero) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-xl font-semibold text-gray-400 animate-pulse">Loading Page Data...</div>
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