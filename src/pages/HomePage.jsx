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
    if (pages.some(p => p.slug === pageSlug)) {
      setActivePage(pageSlug);
    } else {
      navigate('/');
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