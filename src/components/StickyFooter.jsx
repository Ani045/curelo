import React, { useState, useEffect } from 'react';

const StickyFooter = () => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Find the inline mobile form inside HeroSection
      // It's the first form element inside the hero section on mobile
      const heroSection = document.querySelector('section');
      if (heroSection) {
        const inlineForm = heroSection.querySelector('form');
        if (inlineForm) {
          const formTop = inlineForm.getBoundingClientRect().top;
          // Show sticky form as soon as the form starts scrolling past the top of viewport
          setShowForm(formTop < 0);
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    // Initial check
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div
      className={`fixed bottom-0 left-0 w-full bg-[#7bdb81] z-50 shadow-[0_-4px_10px_rgba(0,0,0,0.1)] py-3 px-3 md:px-4 md:py-4 border-t border-[#65c46b] transition-transform duration-300 overflow-hidden ${showForm ? 'translate-y-0' : 'translate-y-full'
        }`}
    >
      <div className="container mx-auto max-w-5xl px-2">
        <form className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-3 md:gap-6" onSubmit={(e) => e.preventDefault()}>
          {/* Name Input */}
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <label className="text-[#143a69] font-bold text-sm whitespace-nowrap hidden md:block">Name</label>
            <input
              type="text"
              placeholder="Enter Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full sm:w-40 md:w-64 px-3 py-2 rounded-lg bg-white border border-[#143a69]/20 focus:border-[#143a69] outline-none text-gray-800 text-sm placeholder-gray-400 shadow-inner"
            />
          </div>

          {/* Phone Input */}
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <label className="text-[#143a69] font-bold text-sm whitespace-nowrap hidden md:block">Phone Number</label>
            <input
              type="tel"
              placeholder="Enter Phone Number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full sm:w-40 md:w-64 px-3 py-2 rounded-lg bg-white border border-[#143a69]/20 focus:border-[#143a69] outline-none text-gray-800 text-sm placeholder-gray-400 shadow-inner"
            />
          </div>

          {/* Submit Button with Phone */}
          <button className="w-full sm:w-auto bg-[#143a69] hover:bg-[#0f2d52] text-white font-bold py-2 sm:py-2.5 px-6 sm:px-8 rounded-lg transition-all shadow-md hover:shadow-lg text-sm uppercase tracking-wide transform hover:scale-105 flex items-center justify-center gap-2">
            <a href="tel:+91 806 977 0000" className="flex items-center gap-2">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
              </svg>
              Book Now
            </a>
          </button>
        </form>
      </div>
    </div>
  );
};

export default StickyFooter;