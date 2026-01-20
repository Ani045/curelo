import React, { useState, useEffect, useRef } from 'react';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import { useCMS } from '../context/CMSContext';

const { FiUser, FiPhone, FiMapPin, FiCheck, FiHome, FiFileText, FiUsers, FiChevronDown } = FiIcons;

// Available cities for the dropdown
const CITIES_LIST = [
  "Delhi",
  "Noida",
  "Gurgaon",
  "Ghaziabad",
  "Faridabad",
  "Vadodara",
  "Ahmedabad"
];

/**
 * Extracts and sanitizes the URL slug from window.location
 * Returns the path segments after the domain (e.g., "thyroid-test" from "/thyroid-test")
 * Security measures:
 * - Removes leading/trailing slashes
 * - Replaces multiple slashes with underscores
 * - Removes potentially dangerous characters
 * - Limits length to prevent abuse
 * - Returns empty string for homepage
 */
const getUrlSlug = () => {
  try {
    if (typeof window === 'undefined') return '';

    // Get the pathname from the URL
    const pathname = window.location.pathname;

    // Remove leading and trailing slashes
    let slug = pathname.replace(/^\/+|\/+$/g, '');

    // Replace remaining slashes with underscores (for subdirectories)
    slug = slug.replace(/\//g, '_');

    // Remove any potentially dangerous characters - only allow alphanumeric, hyphens, underscores
    slug = slug.replace(/[^a-zA-Z0-9\-_]/g, '');

    // Limit length to prevent abuse (max 100 characters)
    slug = slug.substring(0, 100);

    // Return the sanitized slug or empty string for homepage
    return slug || '';
  } catch (error) {
    console.error('Error extracting URL slug:', error);
    return '';
  }
};


// Cooldown duration in hours
const COOLDOWN_HOURS = 5;
const COOLDOWN_KEY = 'curelo_form_submitted';

// Check if form is in cooldown period
const isInCooldown = () => {
  try {
    const submitted = localStorage.getItem(COOLDOWN_KEY);
    if (!submitted) return false;

    const submittedTime = parseInt(submitted, 10);
    const now = Date.now();
    const cooldownMs = COOLDOWN_HOURS * 60 * 60 * 1000;

    return (now - submittedTime) < cooldownMs;
  } catch {
    return false;
  }
};

// Set cooldown in localStorage
const setCooldown = () => {
  try {
    localStorage.setItem(COOLDOWN_KEY, Date.now().toString());
  } catch {
    // localStorage not available
  }
};

const HeroSection = () => {
  const { data } = useCMS();
  const { hero } = data;

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    city: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showToast, setShowToast] = useState(false);

  const [isSmallDevice, setIsSmallDevice] = useState(false);

  // Check cooldown on mount
  useEffect(() => {
    if (isInCooldown()) {
      setIsSubmitted(true);
    }
  }, []);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsSmallDevice(window.innerWidth < 400);
    };
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Get the URL slug for tracking which landing page the lead came from
      const urlSlug = getUrlSlug();

      // Send form data as simple object - the API will transform it to LeadSquared format
      const payload = {
        name: formData.name,
        phone: formData.phone,
        city: formData.city,
        source: 'Google_lp',  // Hidden field - can be customized per page/campaign
        utmSource: urlSlug    // Maps to mx_utm_source - extracted from URL path (e.g., "thyroid-test")
      };

      // Submit to serverless API endpoint
      const response = await fetch('/api/lead', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      });

      const result = await response.json();

      if (response.ok && result.success) {
        // Success - set cooldown and show success state
        setCooldown();
        setIsSubmitted(true);
        setShowToast(true);

        // Auto-hide toast after 5 seconds
        setTimeout(() => {
          setShowToast(false);
        }, 5000);
      } else {
        // Show validation errors if present
        if (result.details && Array.isArray(result.details)) {
          alert(result.details.join('\n'));
        } else {
          throw new Error(result.error || 'Submission failed');
        }
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('There was an error submitting your request. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <section className="bg-[#f2f4f7] pt-2 pb-4 lg:py-10">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-3 lg:gap-6 items-start">

            {/* LEFT COLUMN: 65% width - Banner & USP Icons (Desktop) */}
            <div className="w-full lg:w-[65%] flex flex-col gap-3 lg:gap-8">

              {/* Main Banner Image - Responsive based on screen size */}
              <div className="relative rounded-xl lg:rounded-2xl overflow-hidden shadow-sm bg-white">
                {/* Small Device Banner (< 400px like iPhone SE) - Full image */}
                {isSmallDevice && (
                  <img
                    src={hero.smallBanner}
                    alt="Full Body Checkup Banner"
                    className="w-full h-auto"
                  />
                )}
                {/* Regular Mobile Banner (400px - 1023px) - Full image */}
                {!isSmallDevice && (
                  <img
                    src={hero.mobileBanner}
                    alt="Full Body Checkup Banner"
                    className="w-full h-auto lg:hidden"
                  />
                )}
                {/* Desktop Banner (1024px+) */}
                <img
                  src={hero.desktopBanner}
                  alt="Full Body Checkup Banner"
                  className="w-full h-auto object-cover hidden lg:block"
                />
              </div>


              {/* MOBILE: Form Section - After Banner */}
              <div className="lg:hidden">
                <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">

                  {/* Form Header */}
                  <div className="pt-5 pb-2 px-5">
                    <h2 className="text-lg font-bold text-slate-800">Book Your Test Today</h2>
                  </div>

                  <div className="px-5 pb-5 space-y-3 relative">

                    {/* Success Overlay */}
                    {isSubmitted && (
                      <div className="absolute inset-0 z-20 flex items-center justify-center bg-white/80 backdrop-blur-sm rounded-xl">
                        <div className="text-center px-4">
                          <h3 className="text-xl font-bold text-[#143a69] leading-tight">
                            Request received! Our agents will contact you soon.
                          </h3>
                        </div>
                      </div>
                    )}

                    {/* Offer Box */}
                    <div className={`bg-white border border-green-200 rounded-xl p-3 flex items-center gap-3 shadow-[0_2px_8px_rgba(0,0,0,0.05)] ${isSubmitted ? 'opacity-30 blur-[2px]' : ''}`}>
                      <div className="w-10 h-10 rounded-full bg-orange-100 shrink-0 flex items-center justify-center overflow-hidden">
                        <span className="text-xl">🥗</span>
                      </div>
                      <div className="flex-1">
                        <p className="text-xs font-bold text-slate-800">{hero.offerTitle}</p>
                        <div className="flex items-center justify-between mt-1">
                          <span className="text-[10px] text-gray-500">{hero.offerSubtitle}</span>
                          <div className="text-right">
                            <span className="text-green-600 font-bold text-sm">Free</span>
                            <span className="text-gray-400 line-through text-[10px] ml-1">{hero.offerPriceOriginal}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Form Fields */}
                    <form className={`space-y-3 ${isSubmitted ? 'opacity-30 blur-[2px] pointer-events-none' : ''}`} onSubmit={handleSubmit}>

                      {/* Name */}
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                          <SafeIcon icon={FiUser} className="text-gray-400" />
                        </div>
                        <input
                          type="text"
                          id="hero-name-input-mobile"
                          name="name"
                          placeholder="Enter Name"
                          className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-full text-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all placeholder-gray-400 bg-white"
                          value={formData.name}
                          onChange={handleInputChange}
                        />
                      </div>

                      {/* Phone */}
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                          <span className="text-gray-400 font-medium text-sm">+91</span>
                        </div>
                        <input
                          type="tel"
                          name="phone"
                          placeholder="Enter Phone Number"
                          className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-full text-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all placeholder-gray-400 bg-white"
                          value={formData.phone}
                          onChange={handleInputChange}
                        />
                      </div>

                      {/* City */}
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                          <SafeIcon icon={FiMapPin} className="text-gray-400" />
                        </div>
                        <select
                          name="city"
                          className="w-full pl-11 pr-10 py-3 border border-gray-200 rounded-full text-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-white appearance-none cursor-pointer"
                          value={formData.city}
                          onChange={handleInputChange}
                          style={{ color: formData.city ? '#1f2937' : '#9ca3af' }}
                        >
                          <option value="" disabled>Select City</option>
                          {CITIES_LIST.map((city, index) => (
                            <option key={index} value={city} style={{ color: '#1f2937' }}>{city}</option>
                          ))}
                        </select>
                        <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                          <SafeIcon icon={FiChevronDown} className="text-gray-400" />
                        </div>
                      </div>

                      {/* Submit Button */}

                      <button
                        type="submit"


                        disabled={isSubmitting}
                        className="w-full bg-[#143a69] hover:bg-[#0f2d52] disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-bold py-3 rounded-full uppercase tracking-wider transition-colors shadow-sm text-base mt-4"
                      >
                        {isSubmitting ? 'SUBMITTING...' : 'SUBMIT'}
                      </button>
                      <p className="text-[9px] text-gray-400 text-center pt-1">
                        *Prices are subject to change as per city
                      </p>
                    </form>
                  </div>

                  {/* Testimonial Footer */}
                  <div className="bg-[#eef8ff] p-4 flex items-center gap-3 border-t border-blue-50">
                    <div className="relative shrink-0">
                      <img
                        src="https://brandingpioneers.co.in/curelo-health/Shreyas.png"
                        alt="Shreyas Iyer"
                        className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-sm object-top"
                      />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs font-bold text-[#0f172a] leading-tight mb-1 italic">
                        "I trust Curelo Labs for me and my family"
                      </p>
                      <div>
                        <p className="text-[10px] font-bold text-gray-800">Shreyas Iyer</p>
                        <p className="text-[9px] text-gray-500">Indian Cricketer</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* MOBILE: Why Choose Section */}
              <div className="text-center lg:hidden">
                <h2 className="text-xl font-bold text-gray-800 mb-6 font-sans">
                  Why Choose Curelo Health?
                </h2>
                <div className="grid grid-cols-2 gap-4 px-2">
                  {hero.usps.map((point, index) => (
                    <div
                      key={index}
                      className="flex flex-col items-center text-center gap-3"
                    >
                      <div className="w-16 h-16 bg-white rounded-full shadow-sm flex items-center justify-center border border-gray-100 p-3">
                        <img src={point.icon} alt={point.title} className="w-full h-full object-contain" />
                      </div>
                      <h3 className="text-xs font-semibold text-gray-800 leading-tight max-w-[140px]">
                        {point.title}
                      </h3>
                    </div>
                  ))}
                </div>
              </div>

              {/* USP Section - Desktop Only */}
              <div className="text-center hidden lg:block">
                <h2 className="text-xl lg:text-2xl font-bold text-gray-800 mb-6 font-sans">
                  Why Choose Curelo Health?
                </h2>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 px-2">
                  {hero.usps.map((point, index) => (
                    <div
                      key={index}
                      className="flex flex-col items-center text-center gap-3"
                    >
                      <div className="w-16 h-16 bg-white rounded-full shadow-sm flex items-center justify-center border border-gray-100 p-3">
                        <img src={point.icon} alt={point.title} className="w-full h-full object-contain" />
                      </div>
                      <h3 className="text-xs lg:text-sm font-semibold text-gray-800 leading-tight max-w-[140px]">
                        {point.title}
                      </h3>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN: 35% width - Booking Form Card (Desktop Only) */}
            <div className="w-full lg:w-[35%] hidden lg:block">
              <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100 sticky top-4">

                {/* Form Header */}
                <div className="pt-6 pb-2 px-6">
                  <h2 className="text-xl font-bold text-slate-800">Book Your Test Today</h2>
                </div>

                <div className="px-6 pb-6 space-y-4 relative">

                  {/* Success Overlay */}
                  {isSubmitted && (
                    <div className="absolute inset-0 z-20 flex items-center justify-center bg-white/80 backdrop-blur-sm rounded-xl">
                      <div className="text-center px-4">
                        <h3 className="text-xl font-bold text-[#143a69] leading-tight">
                          Request received! Our agents will contact you soon.
                        </h3>
                      </div>
                    </div>
                  )}

                  {/* Offer Box */}
                  <div className={`bg-white border border-green-200 rounded-xl p-3 flex items-center gap-3 shadow-[0_2px_8px_rgba(0,0,0,0.05)] ${isSubmitted ? 'opacity-30 blur-[2px]' : ''}`}>
                    <div className="w-10 h-10 rounded-full bg-orange-100 shrink-0 flex items-center justify-center overflow-hidden">
                      <span className="text-xl">🥗</span>
                    </div>
                    <div className="flex-1">
                      <p className="text-xs font-bold text-slate-800">{hero.offerTitle}</p>
                      <div className="flex items-center justify-between mt-1">
                        <span className="text-[10px] text-gray-500">{hero.offerSubtitle}</span>
                        <div className="text-right">
                          <span className="text-green-600 font-bold text-sm">Free</span>
                          <span className="text-gray-400 line-through text-[10px] ml-1">{hero.offerPriceOriginal}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Form Fields */}
                  <form className={`space-y-3 ${isSubmitted ? 'opacity-30 blur-[2px] pointer-events-none' : ''}`} onSubmit={handleSubmit}>

                    {/* Name */}
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <SafeIcon icon={FiUser} className="text-gray-400" />
                      </div>
                      <input
                        type="text"
                        id="hero-name-input-desktop"
                        name="name"
                        placeholder="Enter Name"
                        className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-full text-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all placeholder-gray-400 bg-white"
                        value={formData.name}
                        onChange={handleInputChange}
                      />
                    </div>

                    {/* Phone */}
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <span className="text-gray-400 font-medium text-sm">+91</span>
                      </div>
                      <input
                        type="tel"
                        name="phone"
                        placeholder="Enter Phone Number"
                        className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-full text-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all placeholder-gray-400 bg-white"
                        value={formData.phone}
                        onChange={handleInputChange}
                      />
                    </div>

                    {/* City */}
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <SafeIcon icon={FiMapPin} className="text-gray-400" />
                      </div>
                      <select
                        name="city"
                        className="w-full pl-11 pr-10 py-3 border border-gray-200 rounded-full text-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-white appearance-none cursor-pointer"
                        value={formData.city}
                        onChange={handleInputChange}
                        style={{ color: formData.city ? '#1f2937' : '#9ca3af' }}
                      >
                        <option value="" disabled>Select City</option>
                        {CITIES_LIST.map((city, index) => (
                          <option key={index} value={city} style={{ color: '#1f2937' }}>{city}</option>
                        ))}
                      </select>
                      <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                        <SafeIcon icon={FiChevronDown} className="text-gray-400" />
                      </div>
                    </div>

                    {/* Submit Button */}
                    <button
                      type="submit"



                      disabled={isSubmitting}
                      className="w-full bg-[#143a69] hover:bg-[#0f2d52] disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-bold py-3 rounded-full uppercase tracking-wider transition-colors shadow-sm text-base mt-4"
                    >
                      {isSubmitting ? 'SUBMITTING...' : 'SUBMIT'}
                    </button>
                    <p className="text-[9px] text-gray-400 text-center pt-1">
                      *Prices are subject to change as per city
                    </p>
                  </form>
                </div>

                {/* Testimonial Footer (Inside Card) */}
                <div className="bg-[#eef8ff] p-4 flex items-center gap-3 border-t border-blue-50">
                  <div className="relative shrink-0">
                    <img
                      src="https://brandingpioneers.co.in/curelo-health/Shreyas.png"
                      alt="Shreyas Iyer"
                      className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-sm object-top"
                    />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-bold text-[#0f172a] leading-tight mb-1 italic">
                      "I trust Curelo Labs for me and my family"
                    </p>
                    <div>
                      <p className="text-[10px] font-bold text-gray-800">Shreyas Iyer</p>
                      <p className="text-[9px] text-gray-500">Indian Cricketer</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Toast Notification */}
      {showToast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 animate-slide-up">
          <div className="bg-white rounded-xl shadow-2xl border border-gray-200 px-5 py-4 flex items-start gap-3 max-w-sm">
            <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center shrink-0">
              <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div className="flex-1">
              <p className="font-semibold text-gray-800">Success</p>
              <p className="text-sm text-gray-600">Thank you for reaching out us. Our support team will contact you soon.</p>
            </div>
            <button
              onClick={() => setShowToast(false)}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default HeroSection;