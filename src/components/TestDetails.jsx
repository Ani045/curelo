import React from 'react';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';

const { FiFileText, FiUser, FiHome, FiClock } = FiIcons;

const TestDetails = () => {
  return (
    <section className="py-12 bg-white">
      <div className="container mx-auto px-4">
        
        {/* 1. Header & Description */}
        <div className="mb-10">
          <h2 className="text-2xl font-bold text-gray-800 uppercase mb-4 tracking-wide">
            Test Details
          </h2>
          <p className="text-gray-600 leading-relaxed text-[15px] lg:text-base text-justify lg:text-left">
            Your body gives signals before a problem becomes serious—are you paying attention? This package helps you catch early signs of health issues so you can take action on time. It includes 68 important tests to check your liver, kidney, blood health, and more—giving you a complete health update with a single test. Curelo Health is among the most trusted pathology labs near you, offering affordable health packages and accurate diagnostics. Whether you're looking for laboratories near me or a nearby pathology center, our experts ensure quick home sample collection and accurate digital report delivery.
          </p>
        </div>

        {/* 2. Info Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
          
          {/* Card 1: Reports */}
          <div className="bg-white border border-gray-100 p-4 rounded-xl shadow-[0_2px_15px_rgba(0,0,0,0.04)] flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-gray-50 flex items-center justify-center shrink-0">
              <SafeIcon icon={FiFileText} className="text-xl text-gray-500" />
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-0.5">Get Reports in</p>
              <p className="text-[#e11d48] font-bold text-base">15 Hours</p>
            </div>
          </div>

          {/* Card 2: Fasting */}
          <div className="bg-white border border-gray-100 p-4 rounded-xl shadow-[0_2px_15px_rgba(0,0,0,0.04)] flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-gray-50 flex items-center justify-center shrink-0">
               <SafeIcon icon={FiUser} className="text-xl text-gray-500" />
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-0.5">Fasting Requirement</p>
              <p className="text-[#e11d48] font-bold text-sm leading-tight">
                10-12 Hrs fasting Required
              </p>
            </div>
          </div>

          {/* Card 3: Home Collection */}
          <div className="bg-white border border-gray-100 p-4 rounded-xl shadow-[0_2px_15px_rgba(0,0,0,0.04)] flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-gray-50 flex items-center justify-center shrink-0">
               <SafeIcon icon={FiHome} className="text-xl text-gray-500" />
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-0.5">Home Collection</p>
              <p className="text-[#e11d48] font-bold text-base">Available</p>
            </div>
          </div>

          {/* Card 4: Age Group */}
          <div className="bg-white border border-gray-100 p-4 rounded-xl shadow-[0_2px_15px_rgba(0,0,0,0.04)] flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-gray-50 flex items-center justify-center shrink-0">
               <SafeIcon icon={FiClock} className="text-xl text-gray-500" />
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-0.5">Age Group</p>
              <p className="text-[#e11d48] font-bold text-base">5-99</p>
            </div>
          </div>

        </div>

        {/* 3. Promotional Banner Image */}
        <div className="w-full rounded-2xl overflow-hidden shadow-sm">
          <img 
            src="https://brandingpioneers.co.in/curelo-health/test.png" 
            alt="Smart Health Report Banner" 
            className="w-full h-auto object-cover block"
          />
        </div>

      </div>
    </section>
  );
};

export default TestDetails;