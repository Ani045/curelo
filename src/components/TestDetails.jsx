import React from 'react';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import { useCMS } from '../context/CMSContext';

const { FiFileText, FiUser, FiHome, FiClock } = FiIcons;

const TestDetails = () => {
  const { data } = useCMS();
  const { testDetails } = data;

  const icons = [FiFileText, FiUser, FiHome, FiClock];

  return (
    <section className="py-12 bg-white">
      <div className="container mx-auto px-4">

        {/* 1. Header & Description */}
        <div className="mb-10">
          <h2 className="text-2xl font-bold text-gray-800 uppercase mb-4 tracking-wide">
            Test Details
          </h2>
          <p className="text-gray-600 leading-relaxed text-[15px] lg:text-base text-justify lg:text-left">
            {testDetails.description}
          </p>
        </div>

        {/* 2. Info Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">

          {testDetails.cards.map((card, index) => (
            <div key={index} className="bg-white border border-gray-100 p-4 rounded-xl shadow-[0_2px_15px_rgba(0,0,0,0.04)] flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-gray-50 flex items-center justify-center shrink-0">
                <SafeIcon icon={icons[index]} className="text-xl text-gray-500" />
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-0.5">{card.title || card.sub}</p>
                <p className="text-[#e11d48] font-bold text-base">{card.value}</p>
              </div>
            </div>
          ))}

        </div>

        {/* 3. Promotional Banner Image */}
        <div className="w-full rounded-2xl overflow-hidden shadow-sm">
          <img
            src={testDetails.bannerImage}
            alt="Smart Health Report Banner"
            className="w-full h-auto object-cover block"
          />
        </div>

      </div>
    </section>
  );
};

export default TestDetails;