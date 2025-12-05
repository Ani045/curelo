import React from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';

const { FiActivity, FiSun, FiShield } = FiIcons;

const AdditionalPackages = () => {
  const packages = [
    {
      name: "Advance Full Body Checkup",
      price: "₹1299",
      desc: "Includes 80+ parameters including Vitamin D & B12",
      icon: FiActivity
    },
    {
      name: "Vitamin Screening Profile",
      price: "₹699",
      desc: "Essential vitamins check for energy and immunity",
      icon: FiSun
    },
    {
      name: "Senior Citizen Care",
      price: "₹999",
      desc: "Specialized tests for age-related health monitoring",
      icon: FiShield
    }
  ];

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">Popular Packages in Delhi/NCR</h2>
        
        <div className="grid md:grid-cols-3 gap-8">
          {packages.map((pkg, index) => (
            <motion.div
              key={index}
              whileHover={{ y: -5 }}
              className="border border-gray-200 rounded-2xl p-6 hover:shadow-xl transition-all"
            >
              <div className="bg-blue-50 w-12 h-12 rounded-lg flex items-center justify-center mb-4 text-blue-600">
                <SafeIcon icon={pkg.icon} className="text-2xl" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">{pkg.name}</h3>
              <p className="text-gray-500 mb-4 h-12">{pkg.desc}</p>
              <div className="flex items-center justify-between mt-4">
                <span className="text-2xl font-bold text-blue-600">{pkg.price}</span>
                <button className="px-4 py-2 bg-gray-900 text-white rounded-lg text-sm font-semibold hover:bg-gray-800 transition-colors">
                  Book Now
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AdditionalPackages;