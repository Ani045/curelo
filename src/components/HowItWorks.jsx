import React from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';

const { FiMapPin, FiUserCheck, FiHome, FiSmartphone } = FiIcons;

const HowItWorks = () => {
  const steps = [
    {
      icon: FiMapPin,
      title: "Select Location",
      description: "Choose your city (Delhi/NCR) and select required test or package."
    },
    {
      icon: FiUserCheck,
      title: "Book Online",
      description: "Provide your details and schedule a convenient time slot."
    },
    {
      icon: FiHome,
      title: "Home Collection",
      description: "Certified phlebotomist visits your home to collect sample for free."
    },
    {
      icon: FiSmartphone,
      title: "Digital Reports",
      description: "Get accurate reports delivered to your Email or WhatsApp quickly."
    }
  ];

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">How It Works</h2>
          <p className="text-gray-600">Simple 4-step process to better health</p>
        </div>

        <div className="grid md:grid-cols-4 gap-8 relative">
          {/* Connecting Line (Desktop) */}
          <div className="hidden md:block absolute top-12 left-0 right-0 h-0.5 bg-gray-100 -z-10"></div>

          {steps.map((step, index) => (
            <div key={index} className="flex flex-col items-center text-center bg-white p-4">
              <div className="w-24 h-24 bg-white border-4 border-blue-50 rounded-full flex items-center justify-center mb-6 shadow-sm">
                <SafeIcon icon={step.icon} className="text-3xl text-blue-600" />
              </div>
              <h3 className="font-bold text-lg text-gray-900 mb-2">{step.title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;