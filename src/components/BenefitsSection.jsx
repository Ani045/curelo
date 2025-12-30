import React from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';

const { FiClock, FiGrid, FiShield, FiHeart } = FiIcons;

const BenefitsSection = () => {
  const benefits = [
    {
      icon: FiClock,
      title: "Convenient & Easy",
      description: "Book online and get sample collected from home. No travel required - ideal for busy schedules."
    },
    {
      icon: FiGrid,
      title: "Wide Test Coverage",
      description: "With 3000+ tests available, we cover everything from basic blood work to advanced diagnostics."
    },
    {
      icon: FiShield,
      title: "Trusted & Reliable",
      description: "Partnered with 1500+ established labs across India ensuring accurate and reliable results."
    },
    {
      icon: FiHeart,
      title: "Preventive Care",
      description: "Easy access to regular health screening helps in early detection and ongoing health monitoring."
    }
  ];

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Why You Need This
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Experience the Curelo advantage for your health and wellness
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {benefits.map((benefit, index) => (
            <div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="bg-white p-6 rounded-2xl border border-gray-100 hover:shadow-xl transition-all duration-300 group text-center"
            >
              <div className="bg-blue-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <SafeIcon 
                  icon={benefit.icon} 
                  className="text-2xl text-blue-600" 
                />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                {benefit.title}
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                {benefit.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BenefitsSection;