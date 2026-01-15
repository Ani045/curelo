import React, { useState } from 'react';
import HeroSection from '../components/HeroSection';
import MostBookedPackages from '../components/MostBookedPackages';
import FAQSection from '../components/FAQSection';
import Footer from '../components/Footer';
import StickyFooter from '../components/StickyFooter';

const MinimalTemplate = () => {
    const [selectedPackage, setSelectedPackage] = useState(null);

    const handlePackageSelect = (packageTitle) => {
        setSelectedPackage(packageTitle);
    };

    return (
        <div className="min-h-screen bg-white overflow-x-hidden">
            <HeroSection selectedPackage={selectedPackage} />

            <div className="py-12 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 text-center">
                    <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Featured Packages</h2>
                    <p className="text-gray-600 mb-8">Choose from our most popular health checkups.</p>
                </div>
                <MostBookedPackages onPackageSelect={handlePackageSelect} />
            </div>

            <FAQSection />
            <Footer />
            <StickyFooter />
        </div>
    );
};

export default MinimalTemplate;
