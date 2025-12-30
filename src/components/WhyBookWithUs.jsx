import React from 'react';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';

const { FiCheckCircle, FiClock, FiThumbsUp, FiCalendar } = FiIcons;

const WhyBookWithUs = () => {
  const features = [
    { icon: FiCheckCircle, title: "Quality", description: "Follow Stringent Quality Control", color: "text-blue-500" },
    { icon: FiClock, title: "On-Time Services", description: "Sample Collection & Reports", color: "text-orange-400" },
    { icon: FiThumbsUp, title: "Convenience", description: "At-Home & In-Lab Services", color: "text-yellow-500" },
    { icon: FiCalendar, title: "Availability", description: "365 days a year", color: "text-pink-500" }
  ];

  return (
    <section className="bg-white pb-16 hidden lg:block">
      <div className="container mx-auto px-4">
        {/* Gray Container */}
        <div className="bg-[#e9ecef] rounded-[30px] p-8 md:p-12">

          {/* Header */}
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-[#143a69] mb-2">
              Why <span className="font-extrabold">Book Tests</span> With us ?
            </h2>
            <p className="text-gray-500 text-sm md:text-base">
              Trusted by 90 Lakhs+ satisfied customers
            </p>
          </div>

          {/* Cards Grid */}
          <div className="grid md:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-2xl p-6 text-center shadow-sm hover:shadow-md transition-shadow"
              >
                {/* Icon */}
                <div className="flex justify-center mb-4 relative">
                  <SafeIcon icon={feature.icon} className="text-4xl text-[#143a69]" />
                  <div className="absolute -top-1 -right-2 text-[#7bdb81] text-xs">✦</div>
                </div>

                {/* Dotted Separator */}
                <div className="border-b-2 border-dotted border-gray-200 w-full mb-4"></div>

                {/* Content */}
                <h3 className="text-[#143a69] font-bold text-lg mb-2">{feature.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed max-w-[150px] mx-auto">
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