import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCMS } from '../context/CMSContext';
import DefaultTemplate from '../templates/DefaultTemplate';
import MinimalTemplate from '../templates/MinimalTemplate';

const HomePage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { data, activeTemplate, setActivePage, getAllPages } = useCMS();

  useEffect(() => {
    const pageSlug = slug || 'home';
    const pages = getAllPages();
    const pageExists = pages.some(p => p.slug === pageSlug);

    if (pageExists) {
      setActivePage(pageSlug);
    } else if (slug) {
      // Only redirect if there was a slug and it was invalid
      navigate('/', { replace: true });
    }
  }, [slug, setActivePage, getAllPages, navigate]);

  if (!data) return null;

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