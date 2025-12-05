import React from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';

const { FiCheckCircle, FiMap, FiHome, FiActivity } = FiIcons;

const USPSection = () => {
  const uspPoints = [
    {
      icon: FiActivity,
      title: "3000+ Lab Tests Available",
      description: "Comprehensive range of diagnostics"
    },
    {
      icon: FiMap,
      title: "Network of 1500+ Labs",
      description: "Trusted partners across India"
    },
    {
      icon: FiHome,
      title: "Free Home Sample Collection",
      description: "Convenience at your doorstep"
    },
    {
      icon: FiCheckCircle,
      title: "100% Report Accuracy",
      description: "Certified labs & quick reports"
    }
  ];

  return (
    <section className="bg-white py-12 border-b border-gray-100">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-2xl lg:text-3xl font-bold text-gray-800">
            Why Choose Curelo Health?
          </h2>
          <p className="text-gray-600 mt-2">Your trusted partner for accurate diagnostics</p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {uspPoints.map((point, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="flex flex-col items-center text-center group"
            >
              <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mb-4 group-hover:bg-blue-100 transition-colors">
                <SafeIcon 
                  icon={point.icon} 
                  className="text-3xl text-blue-600" 
                />
              </div>
              <h3 className="text-lg font-bold text-gray-800 mb-1">
                {point.title}
              </h3>
              <p className="text-sm text-gray-500">
                {point.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default USPSection;