import React, { useState, useEffect } from 'react';

const StickyFooter = () => {
  const [showButton, setShowButton] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Find the inline mobile form inside HeroSection
      // It's the first form element inside the hero section on mobile
      const heroSection = document.querySelector('section');
      if (heroSection) {
        const inlineForm = heroSection.querySelector('form');
        if (inlineForm) {
          const formTop = inlineForm.getBoundingClientRect().top;
          // Show sticky button as soon as the form starts scrolling past the top of viewport
          setShowButton(formTop < 0);
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    // Initial check
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToForm = () => {
    // Check if we're on desktop (lg breakpoint)
    const isDesktop = window.innerWidth >= 1024;
    let nameInput;

    if (isDesktop) {
      nameInput = document.getElementById('hero-name-input-desktop');
    } else {
      nameInput = document.getElementById('hero-name-input-mobile');
    }

    if (nameInput) {
      nameInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
      setTimeout(() => nameInput.focus(), 500);
    }
  };

  return (
    <div
      className={`fixed bottom-0 left-0 w-full bg-[#7bdb81] z-50 shadow-[0_-4px_10px_rgba(0,0,0,0.1)] py-3 px-4 border-t border-[#65c46b] transition-transform duration-300 lg:hidden ${showButton ? 'translate-y-0' : 'translate-y-full'
        }`}
    >
      <div className="container mx-auto max-w-5xl">
        <button
          onClick={scrollToForm}
          className="w-full bg-[#143a69] hover:bg-[#0f2d52] text-white font-bold py-3 px-6 rounded-lg transition-all shadow-md hover:shadow-lg text-base uppercase tracking-wide flex items-center justify-center gap-2"
        >
          Book Now
        </button>
      </div>
    </div>
  );
};

export default StickyFooter;