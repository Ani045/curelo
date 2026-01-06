
import React, { createContext, useState, useEffect, useContext } from 'react';

const CMSContext = createContext();

export const useCMS = () => useContext(CMSContext);

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
  }
};

export const CMSProvider = ({ children }) => {
  const [data, setData] = useState(() => {
    const savedData = localStorage.getItem('curelo_cms_data');
    if (savedData) {
      const parsed = JSON.parse(savedData);
      return {
        ...defaultData,
        ...parsed,
        hero: { ...defaultData.hero, ...parsed.hero },
        testDetails: { ...defaultData.testDetails, ...parsed.testDetails },
        mostBookedPackages: { ...defaultData.mostBookedPackages, ...parsed.mostBookedPackages },
        whyChooseUs: { ...defaultData.whyChooseUs, ...parsed.whyChooseUs || {} },
        faqs: { ...defaultData.faqs, ...parsed.faqs || {} }
      };
    }
    return defaultData;
  });

  useEffect(() => {
    localStorage.setItem('curelo_cms_data', JSON.stringify(data));
  }, [data]);

  const updateSection = (section, newData) => {
    setData(prev => ({
      ...prev,
      [section]: { ...prev[section], ...newData }
    }));
  };

  const updateUSP = (index, field, value) => {
    setData(prev => {
      const newUSPs = [...prev.hero.usps];
      newUSPs[index] = { ...newUSPs[index], [field]: value };
      return {
        ...prev,
        hero: { ...prev.hero, usps: newUSPs }
      };
    });
  };

  const updateTestCard = (index, field, value) => {
    setData(prev => {
      const newCards = [...prev.testDetails.cards];
      newCards[index] = { ...newCards[index], [field]: value };
      return {
        ...prev,
        testDetails: { ...prev.testDetails, cards: newCards }
      };
    });
  };

  const updatePackage = (index, field, value) => {
    setData(prev => {
      const newPackages = [...prev.mostBookedPackages.packages];
      newPackages[index] = { ...newPackages[index], [field]: value };
      return {
        ...prev,
        mostBookedPackages: { ...prev.mostBookedPackages, packages: newPackages }
      };
    });
  };

  return (
    <CMSContext.Provider value={{ data, updateSection, updateUSP, updateTestCard, updatePackage }}>
      {children}
    </CMSContext.Provider>
  );
};
