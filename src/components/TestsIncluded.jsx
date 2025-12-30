import React from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';

const { FiActivity, FiDroplet, FiHeart, FiFilter } = FiIcons;

const TestsIncluded = () => {
  const popularTests = [
    { name: "Kidney Function Test (KFT)", icon: FiFilter },
    { name: "Liver Function Test (LFT)", icon: FiActivity },
    { name: "Lipid Profile", icon: FiHeart },
    { name: "Complete Blood Count (CBC)", icon: FiDroplet },
    { name: "Thyroid Profile", icon: FiActivity },
    { name: "Diabetes Screening", icon: FiActivity }
  ];

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Popular Tests & Options</h2>
          <p className="text-gray-600">Customize your checkup or choose from our popular range</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {popularTests.map((test, index) => (
            <div
              key={index}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4 hover:border-blue-300 transition-colors cursor-pointer"
            >
              <div className="bg-blue-50 p-3 rounded-lg">
                <SafeIcon icon={test.icon} className="text-xl text-blue-600" />
              </div>
              <span className="font-semibold text-gray-800">{test.name}</span>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
           <button className="text-blue-600 font-semibold hover:underline flex items-center justify-center gap-2 mx-auto">
             View All 3000+ Available Tests <SafeIcon icon={FiIcons.FiArrowRight} />
           </button>
        </div>
      </div>
    </section>
  );
};

export default TestsIncluded;