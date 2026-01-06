import React from 'react';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import { useCMS } from '../context/CMSContext';

const { FiCheckCircle, FiClock, FiThumbsUp, FiCalendar } = FiIcons;

const WhyBookWithUs = () => {
  const { data } = useCMS();
  const { whyChooseUs } = data;

  // Icon mapping
  const iconMap = {
    FiCheckCircle,
    FiClock,
    FiThumbsUp,
    FiCalendar
  };

  return (
    <section className="bg-white pb-16 hidden lg:block">
      <div className="container mx-auto px-4">
        {/* Gray Container */}
        <div className="bg-[#e9ecef] rounded-[30px] p-8 md:p-12">

          {/* Header */}
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-[#143a69] mb-2">
              {whyChooseUs.title}
            </h2>
            <p className="text-gray-500 text-sm md:text-base">
              {whyChooseUs.subtitle}
            </p>
          </div>

          {/* Cards Grid */}
          <div className="grid md:grid-cols-4 gap-6">
            {whyChooseUs.features.map((feature, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl p-6 text-center shadow-sm hover:shadow-md transition-shadow"
              >
                {/* Icon */}
                <div className="flex justify-center mb-4 relative">
                  <SafeIcon icon={iconMap[feature.icon] || FiCheckCircle} className="text-4xl text-[#143a69]" />
                  <div className="absolute -top-1 -right-2 text-[#7bdb81] text-xs">✦</div>
                </div>

                {/* Dotted Separator */}
                <div className="border-b-2 border-dotted border-gray-200 w-full mb-4"></div>

                {/* Content */}
                <h3 className="text-[#143a69] font-bold text-lg mb-2">{feature.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed max-w-[200px] mx-auto">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyBookWithUs;