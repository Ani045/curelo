import React from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import { useCMS } from '../context/CMSContext';

const { FiActivity, FiDroplet, FiHeart, FiFilter, FiShield, FiThermometer, FiFileText, FiZap, FiStar, FiUsers, FiCheck } = FiIcons;

const MostBookedPackages = () => {
  const { data } = useCMS();
  const { mostBookedPackages } = data;

  // Icons map to reconstruct the icons
  const iconMap = {
    HbA1c: FiActivity,
    Lipid: FiDroplet,
    Liver: FiFilter,
    Kidney: FiActivity,
    Heart: FiHeart,
    Default: FiCheck
  };

  // Helper to merge CMS data with static icon/tag logic (since CMS doesn't store Icon components)
  const packagesWithMetadata = mostBookedPackages.packages.map((pkg, i) => {
    // Reconstruct tags based on some logic or keep them static/hardcoded for now as per plan
    // For this demo, we'll keep the tags static from the original code but apply title/price from CMS
    // A more advanced CMS would allow editing tags too, but that requires a complex UI.
    const originalTags = [
      [
        { name: "HbA1c", icon: FiActivity },
        { name: "Lipid", icon: FiDroplet },
        { name: "Liver", icon: FiFilter },
        { name: "Kidney", icon: FiActivity }
      ],
      [
        { name: "Heart", icon: FiHeart },
        { name: "HbA1c", icon: FiActivity },
        { name: "Lipid", icon: FiDroplet },
        { name: "Liver", icon: FiFilter }
      ],
      [
        { name: "Heart", icon: FiHeart },
        { name: "HbA1c", icon: FiActivity },
        { name: "Lipid", icon: FiDroplet },
        { name: "Liver", icon: FiFilter }
      ]
    ];
    return { ...pkg, tags: originalTags[i] || [] };
  });

  return (
    <section className="py-4 bg-gray-50">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-[#143a69] mb-3">{mostBookedPackages.title}</h2>
          <p className="text-gray-600 text-sm">{mostBookedPackages.subtitle}</p>
        </div>

        {/* Packages Grid - Compact Design */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {packagesWithMetadata.map((pkg, index) => (
            <div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -4 }}
              className={`relative bg-white rounded-2xl p-5 border transition-all duration-300 flex flex-col ${pkg.recommended
                ? 'border-[#143a69] shadow-lg ring-1 ring-[#143a69]/20'
                : 'border-gray-200 shadow-md hover:shadow-lg hover:border-[#143a69]/30'
                }`}
            >
              {/* Recommended Badge */}
              {pkg.recommended && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-[#143a69] text-white text-[10px] font-bold px-3 py-1 rounded-full shadow-md flex items-center gap-1 z-10">
                  <SafeIcon icon={FiStar} className="text-[#7bdb81]" /> RECOMMENDED
                </div>
              )}

              {/* Title */}
              <h3 className="text-[16px] font-bold text-[#143a69] mb-4 mt-2 leading-snug min-h-[44px]">
                {pkg.title}
              </h3>

              {/* Tags - Compact */}
              <div className="flex flex-wrap gap-1.5 mb-4">
                {pkg.tags.slice(0, 4).map((tag, idx) => (
                  <span key={idx} className="inline-flex items-center gap-1 bg-[#143a69]/5 text-[#143a69] text-[10px] font-medium px-2 py-1 rounded-md border border-[#143a69]/10">
                    <SafeIcon icon={tag.icon} className="text-[10px]" />
                    {tag.name}
                  </span>
                ))}
                {pkg.extraTags && pkg.extraTags.length > 0 && (
                  <span className="inline-flex items-center gap-1 bg-[#7bdb81]/10 text-[#143a69] text-[10px] font-medium px-2 py-1 rounded-md border border-[#7bdb81]/20">
                    +{pkg.extraTags.length} More
                  </span>
                )}
              </div>

              {/* Info Row - Compact */}
              <div className="flex items-center gap-3 mb-5 text-[11px] text-gray-600 bg-gray-50 p-2 rounded-lg border border-gray-100">
                <div className="flex items-center gap-1.5 flex-1 justify-center border-r border-gray-200 pr-2">
                  <SafeIcon icon={FiThermometer} className="text-[#7bdb81]" />
                  <span className="font-semibold text-gray-800">{pkg.includes}</span>
                </div>
                <div className="flex items-center gap-1.5 flex-1 justify-center">
                  <SafeIcon icon={FiFileText} className="text-[#7bdb81]" />
                  <span className="font-semibold text-gray-800">{pkg.reportTime}</span>
                </div>
              </div>

              {/* Footer - Compact */}
              <div className="mt-auto pt-4 border-t border-dashed border-gray-200 flex items-center justify-between">
                <div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-xl font-bold text-[#143a69]">{pkg.price}</span>
                    <span className="text-xs text-gray-400 line-through">{pkg.originalPrice}</span>
                  </div>
                  <div className="text-[10px] text-[#7bdb81] font-bold">
                    {pkg.discount}
                  </div>
                </div>

                <button className="bg-[#143a69] hover:bg-[#0f2d52] text-white text-xs font-bold py-2.5 px-5 rounded-lg transition-colors shadow-md hover:shadow-lg">
                  Book Now
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* GIF Section - Separate Mobile and Desktop GIFs */}
        <div className="w-full overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm mb-4">
          {/* Mobile GIF */}
          <img
            src={mostBookedPackages.mobileGif}
            alt="Health Promotion GIF"
            className="w-full h-full object-cover block md:hidden"
          />
          {/* Desktop GIF */}
          <img
            src={mostBookedPackages.desktopGif}
            alt="Health Promotion GIF"
            className="w-full h-[120px] object-cover hidden md:block"
          />
        </div>

      </div>
    </section>
  );
};

export default MostBookedPackages;