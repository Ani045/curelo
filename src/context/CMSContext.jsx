
import React, { createContext, useState, useEffect, useContext, useCallback } from 'react';

const CMSContext = createContext();

export const useCMS = () => useContext(CMSContext);

// ... (defaultData remains the same)

const defaultData = {
  hero: {
    desktopBanner: "https://brandingpioneers.co.in/curelo-health/hero.png",
    mobileBanner: "https://brandingpioneers.co.in/curelo-health/mob.png",
    smallBanner: "https://brandingpioneers.co.in/curelo-health/small-ban.png",
    offerTitle: "Get Report Consultation & Diet Plan",
    offerSubtitle: "with your Booking!",
    offerPriceOriginal: "₹799",
    usps: [
      { icon: 'https://brandingpioneers.co.in/curelo-health/icon1.png', title: "100% Honest Pricing" },
      { icon: 'https://brandingpioneers.co.in/curelo-health/icon2.png', title: "India's Widest Home Collection Network" },
      { icon: 'https://brandingpioneers.co.in/curelo-health/icon3.png', title: "100% Report Accuracy Guaranteed" },
      { icon: 'https://brandingpioneers.co.in/curelo-health/icon4.png', title: "70+ Lakhs Patients Served" }
    ]
  },
  testDetails: {
    description: "Your body gives signals before a problem becomes serious—are you paying attention? This package helps you catch early signs of health issues so you can take action on time. It includes 68 important tests to check your liver, kidney, blood health, and more—giving you a complete health update with a single test. Curelo Health is among the most trusted pathology labs near you, offering affordable health packages and accurate diagnostics. Whether you're looking for laboratories near me or a nearby pathology center, our experts ensure quick home sample collection and accurate digital report delivery.",
    bannerImage: "https://brandingpioneers.co.in/curelo-health/test.png",
    cards: [
      { title: "Get Reports in", value: "15 Hours", sub: "Get Reports in" },
      { title: "Fasting Requirement", value: "10-12 Hrs fasting Required", sub: "Fasting Requirement" },
      { title: "Home Collection", value: "Available", sub: "Home Collection" },
      { title: "Age Group", value: "5-99", sub: "Age Group" }
    ]
  },
  mostBookedPackages: {
    title: "Our Most Booked Packages",
    subtitle: "Comprehensive health checkups for your wellness",
    packages: [
      {
        title: "Fit India Full Body Checkup with Free HbA1c",
        includes: "90 Parameters",
        reportTime: "12 hours",
        price: "₹1249",
        originalPrice: "₹5947",
        discount: "78% OFF",
        recommended: false,
        extraTags: ["Infection", "Thyroid"]
      },
      {
        title: "Fit India Full Body with Vitamin Screening & Heart Test",
        includes: "96 Parameters",
        reportTime: "12 hours",
        price: "₹1799",
        originalPrice: "₹8566",
        discount: "78% OFF",
        recommended: true,
        extraTags: ["Kidney", "Infection"]
      },
      {
        title: "Advance Plus Full Body Checkup",
        includes: "100 Parameters",
        reportTime: "12 hours",
        price: "₹2499",
        originalPrice: "₹9955",
        discount: "74% OFF",
        recommended: false,
        extraTags: ["Kidney", "Infection"]
      }
    ]
  },
  whyChooseUs: {
    title: "Why Book Tests With us ?",
    subtitle: "Trusted by 90 Lakhs+ satisfied customers",
    features: [
      { icon: "FiCheckCircle", title: "Quality", description: "Follow Stringent Quality Control" },
      { icon: "FiClock", title: "On-Time Services", description: "Sample Collection & Reports" },
      { icon: "FiThumbsUp", title: "Convenience", description: "At-Home & In-Lab Services" },
      { icon: "FiCalendar", title: "Availability", description: "365 days a year" }
    ]
  },
  faqs: {
    title: "Frequently Asked Questions",
    subtitle: "Find answers to common questions about our services",
    items: [
      {
        question: "How does the home sample collection work?",
        answer: "Once you book a test, a certified phlebotomist will visit your home at your scheduled time to collect samples. The service is free of cost."
      },
      {
        question: "Which labs are affiliated with Curelo?",
        answer: "We partner with over 1500+ top NABL certified labs across India to ensure you get the most accurate and reliable diagnostic services."
      },
      {
        question: "Do you serve in Delhi/NCR?",
        answer: "Yes, we have extensive coverage across Delhi, Noida, Gurgaon, Ghaziabad, and Faridabad with multiple collection centers."
      },
      {
        question: "How soon will I get my reports?",
        answer: "Reports are typically generated within 12-24 hours depending on the test, and are delivered digitally via Email or WhatsApp."
      }
    ]
  },
  contact: {
    phone: '+918069770000',
    whatsapp: '918069770000',
    whatsappMessage: 'Hi, I need help finding a health package.'
  }
};

const API_URL = '/api/cms';

const compressImage = (base64Str, maxWidth = 1200, quality = 0.7) => {
  return new Promise((resolve) => {
    const img = new Image();
    img.src = base64Str;
    img.onload = () => {
      const canvas = document.createElement('canvas');
      let width = img.width;
      let height = img.height;

      if (width > maxWidth) {
        height = Math.round((height * maxWidth) / width);
        width = maxWidth;
      }

      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, width, height);
      resolve(canvas.toDataURL('image/jpeg', quality));
    };
    img.onerror = () => resolve(base64Str); // Fallback to original if error
  });
};

export const CMSProvider = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [state, setState] = useState(() => {
    const initialState = {
      pages: {
        home: {
          title: 'Home Page',
          slug: 'home',
          template: 'default',
          data: defaultData
        }
      },
      activePageSlug: 'home'
    };

    try {
      const savedData = localStorage.getItem('curelo_multi_cms_data');
      if (savedData) {
        const parsed = JSON.parse(savedData);
        if (!parsed || !parsed.pages) return initialState;

        // Ensure all pages have the latest default sections
        const mergedPages = {};
        Object.keys(parsed.pages).forEach(slug => {
          mergedPages[slug] = {
            ...parsed.pages[slug],
            template: parsed.pages[slug].template || 'default',
            data: {
              ...defaultData,
              ...parsed.pages[slug].data
            }
          };
        });
        return {
          ...parsed,
          pages: mergedPages,
          activePageSlug: parsed.activePageSlug || 'home'
        };
      }

      // Migration from old single-page format
      const oldData = localStorage.getItem('curelo_cms_data');
      if (oldData) {
        const parsed = JSON.parse(oldData);
        if (!parsed) return initialState;

        return {
          pages: {
            home: {
              title: 'Home Page',
              slug: 'home',
              template: 'default',
              data: {
                ...defaultData,
                ...parsed,
                hero: { ...defaultData.hero, ...parsed.hero },
                testDetails: { ...defaultData.testDetails, ...parsed.testDetails },
                mostBookedPackages: { ...defaultData.mostBookedPackages, ...parsed.mostBookedPackages },
                whyChooseUs: { ...defaultData.whyChooseUs, ...parsed.whyChooseUs || {} },
                faqs: { ...defaultData.faqs, ...parsed.faqs || {} },
                contact: { ...defaultData.contact, ...parsed.contact || {} }
              }
            }
          },
          activePageSlug: 'home'
        };
      }
    } catch (error) {
      console.error('Error initializing CMS state from localStorage:', error);
    }

    return initialState;
  });

  useEffect(() => {
    const fetchCMSData = async () => {
      try {
        const response = await fetch(API_URL);
        const serverData = await response.json();

        if (serverData && serverData.pages) {
          // Safety: Always ensure 'home' exists in the server data
          if (!serverData.pages.home) {
            serverData.pages.home = {
              title: 'Home Page',
              slug: 'home',
              template: 'default',
              data: defaultData
            };
          }
          setState(serverData);
        }
      } catch (error) {
        console.error('Failed to fetch CMS data from server:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCMSData();
  }, []);

  // Still keep localStorage as a temporary backup for the current session
  useEffect(() => {
    try {
      localStorage.setItem('curelo_multi_cms_data', JSON.stringify(state));
    } catch (error) {
      if (error.name === 'QuotaExceededError' || error.name === 'NS_ERROR_DOM_QUOTA_REACHED') {
        console.warn('CMS backup storage limit reached (likely due to large images). Changes are only saved in session memory until you Publish.');
      } else {
        console.error('Failed to save CMS data to localStorage:', error);
      }
    }
  }, [state]);

  const saveToServer = useCallback(async (dataToSave = state) => {
    setSaving(true);
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataToSave),
      });

      if (response.status === 413) {
        throw new Error('Total image size too large! Please use smaller images or compress them (Max total size: 50MB).');
      }

      if (!response.ok) {
        const errorText = await response.text();
        let errorMessage = 'Failed to save';
        try {
          const errorData = JSON.parse(errorText);
          errorMessage = errorData.error || errorData.message || errorMessage;
        } catch (e) {
          // If not JSON, use a generic message or snippet of the response
          errorMessage = `Server error (${response.status})`;
        }
        throw new Error(errorMessage);
      }

      const result = await response.json();
      return { success: true };
    } catch (error) {
      console.error('Error saving to server:', error);
      return { success: false, error: error.message || 'An unexpected error occurred' };
    } finally {
      setSaving(false);
    }
  }, [state]);

  // Defensive data selection
  const activePage = (state.pages && state.pages[state.activePageSlug])
    || (state.pages && state.pages['home'])
    || { title: 'Home', slug: 'home', template: 'default', data: defaultData };

  const data = activePage.data || defaultData;

  const setActivePage = useCallback((slug) => {
    if (state.pages[slug]) {
      setState(prev => ({ ...prev, activePageSlug: slug }));
    }
  }, [state.pages]);

  const createPage = useCallback((slug, title, template = 'default') => {
    if (state.pages[slug]) return false;

    setState(prev => ({
      ...prev,
      pages: {
        ...prev.pages,
        [slug]: {
          title,
          slug,
          template,
          data: defaultData
        }
      }
    }));
    return true;
  }, [state.pages]);

  const updatePageTemplate = useCallback((slug, template) => {
    setState(prev => ({
      ...prev,
      pages: {
        ...prev.pages,
        [slug]: {
          ...prev.pages[slug],
          template
        }
      }
    }));
  }, []);

  const deletePage = useCallback((slug) => {
    if (slug === 'home') return false;

    setState(prev => {
      const newPages = { ...prev.pages };
      delete newPages[slug];
      return {
        ...prev,
        pages: newPages,
        activePageSlug: prev.activePageSlug === slug ? 'home' : prev.activePageSlug
      };
    });
    return true;
  }, []);

  const getAllPages = useCallback(() => {
    return Object.values(state.pages).map(p => ({ title: p.title, slug: p.slug, template: p.template }));
  }, [state.pages]);

  const updateSection = useCallback((section, newData) => {
    setState(prev => {
      const currentPage = prev.pages[prev.activePageSlug];
      return {
        ...prev,
        pages: {
          ...prev.pages,
          [prev.activePageSlug]: {
            ...currentPage,
            data: {
              ...currentPage.data,
              [section]: { ...currentPage.data[section], ...newData }
            }
          }
        }
      };
    });
  }, []);

  const updateSectionAndSave = useCallback(async (section, newData) => {
    let latestState;
    setState(prev => {
      const currentPage = prev.pages[prev.activePageSlug];
      latestState = {
        ...prev,
        pages: {
          ...prev.pages,
          [prev.activePageSlug]: {
            ...currentPage,
            data: {
              ...currentPage.data,
              [section]: { ...currentPage.data[section], ...newData }
            }
          }
        }
      };
      return latestState;
    });

    // Use the latest state for saving
    return await saveToServer(latestState);
  }, [saveToServer]);

  const updateUSP = useCallback((index, field, value) => {
    setState(prev => {
      const currentPage = prev.pages[prev.activePageSlug];
      const newUSPs = [...currentPage.data.hero.usps];
      newUSPs[index] = { ...newUSPs[index], [field]: value };
      return {
        ...prev,
        pages: {
          ...prev.pages,
          [prev.activePageSlug]: {
            ...currentPage,
            data: {
              ...currentPage.data,
              hero: { ...currentPage.data.hero, usps: newUSPs }
            }
          }
        }
      };
    });
  }, []);

  const updateTestCard = useCallback((index, field, value) => {
    setState(prev => {
      const currentPage = prev.pages[prev.activePageSlug];
      const newCards = [...currentPage.data.testDetails.cards];
      newCards[index] = { ...newCards[index], [field]: value };
      return {
        ...prev,
        pages: {
          ...prev.pages,
          [prev.activePageSlug]: {
            ...currentPage,
            data: {
              ...currentPage.data,
              testDetails: { ...currentPage.data.testDetails, cards: newCards }
            }
          }
        }
      };
    });
  }, []);

  const updatePackage = useCallback((index, field, value) => {
    setState(prev => {
      const currentPage = prev.pages[prev.activePageSlug];
      const newPackages = [...currentPage.data.mostBookedPackages.packages];
      newPackages[index] = { ...newPackages[index], [field]: value };
      return {
        ...prev,
        pages: {
          ...prev.pages,
          [prev.activePageSlug]: {
            ...currentPage,
            data: {
              ...currentPage.data,
              mostBookedPackages: { ...currentPage.data.mostBookedPackages, packages: newPackages }
            }
          }
        }
      };
    });
  }, []);

  return (
    <CMSContext.Provider value={{
      data,
      activePageSlug: state.activePageSlug,
      activeTemplate: activePage.template,
      setActivePage,
      createPage,
      updatePageTemplate,
      deletePage,
      getAllPages,
      updatePackage,
      updateSection,
      updateSectionAndSave,
      updateUSP,
      updateTestCard,
      saveToServer,
      loading,
      saving
    }}>
      {children}
    </CMSContext.Provider>
  );
};
