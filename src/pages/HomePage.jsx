import React, { useState } from 'react';
import HeroSection from '../components/HeroSection';
import TestDetails from '../components/TestDetails';
import MostBookedPackages from '../components/MostBookedPackages';
import WhyBookWithUs from '../components/WhyBookWithUs';
import CantFindSection from '../components/CantFindSection';
import FAQSection from '../components/FAQSection';
import TestimonialsSection from '../components/TestimonialsSection';
import Footer from '../components/Footer';
import StickyFooter from '../components/StickyFooter';

const HomePage = () => {
  const [selectedPackage, setSelectedPackage] = useState(null);

  const handlePackageSelect = (packageTitle) => {
    setSelectedPackage(packageTitle);
  };

  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      <HeroSection selectedPackage={selectedPackage} />
      <TestDetails />
      <MostBookedPackages onPackageSelect={handlePackageSelect} />

      {/* Why Book With Us (Includes Blue CTA Banner) */}
      <WhyBookWithUs />

      {/* Reviews Section */}
      <TestimonialsSection />

      {/* Can't Find / Help Section */}
      <CantFindSection />

      {/* FAQ Section */}
      <FAQSection />

      {/* Footer only - removed all other sections */}
      <Footer />
      <StickyFooter />
    </div>
  );
};

export default HomePage;