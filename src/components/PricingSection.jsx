import React from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';

const { FiCheck, FiArrowRight } = FiIcons;

const PricingSection = ({ onPackageSelect }) => {
  const handleBookNow = () => {
    const packageName = "Full Body Health Checkup";

    // Call the callback to update selectedPackage in parent
    if (onPackageSelect) {
      onPackageSelect(packageName);
    }

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
    <section className="py-16 bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-xl overflow-hidden">
          <div className="grid md:grid-cols-2">
            <div className="p-8 lg:p-12 bg-blue-600 text-white flex flex-col justify-center">
              <h3 className="text-2xl font-bold mb-2">Full Body Health Checkup</h3>
              <p className="opacity-90 mb-6">Comprehensive screening for total peace of mind</p>

              <div className="mb-6">
                <span className="text-5xl font-bold">₹799</span>
                <span className="text-xl opacity-75 line-through ml-3">₹1999</span>
              </div>

              <button
                onClick={handleBookNow}
                className="bg-white text-blue-600 font-bold py-3 px-8 rounded-lg shadow-lg hover:bg-gray-50 transition-colors w-full"
              >
                BOOK NOW
              </button>
            </div>

            <div className="p-8 lg:p-12 bg-white">
              <h4 className="font-bold text-gray-900 mb-4 text-lg">Package Inclusions:</h4>
              <ul className="space-y-4">
                <li className="flex items-center gap-3">
                  <div className="bg-green-100 p-1 rounded-full">
                    <SafeIcon icon={FiCheck} className="text-green-600 text-sm" />
                  </div>
                  <span className="text-gray-700">Free Home Sample Collection</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="bg-green-100 p-1 rounded-full">
                    <SafeIcon icon={FiCheck} className="text-green-600 text-sm" />
                  </div>
                  <span className="text-gray-700">Digital Reports via Email/WhatsApp</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="bg-green-100 p-1 rounded-full">
                    <SafeIcon icon={FiCheck} className="text-green-600 text-sm" />
                  </div>
                  <span className="text-gray-700">50+ Essential Parameters</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="bg-green-100 p-1 rounded-full">
                    <SafeIcon icon={FiCheck} className="text-green-600 text-sm" />
                  </div>
                  <span className="text-gray-700">Doctor Consultation Included</span>
                </li>
              </ul>

              <div className="mt-8 pt-6 border-t border-gray-100">
                <p className="text-sm text-center text-gray-500">
                  *Affordable & Transparent Pricing. No hidden charges.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PricingSection;