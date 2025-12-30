import React from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';

const { FiLayers, FiSettings, FiCalendar, FiFileText } = FiIcons;

const PackageSummary = () => {
  const keyDetails = [
    {
      icon: FiLayers,
      label: "Diagnostic Range",
      value: "Full Range",
      color: "text-blue-600"
    },
    {
      icon: FiSettings,
      label: "Customizable",
      value: "Flexible Plans",
      color: "text-green-600"
    },
    {
      icon: FiCalendar,
      label: "Availability",
      value: "7 Days/Week",
      color: "text-orange-600"
    },
    {
      icon: FiFileText,
      label: "Reports",
      value: "Digital Copy",
      color: "text-purple-600"
    }
  ];

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Services Offered
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Choose from individual tests or comprehensive health packages tailored to your needs.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left - Overview */}
          <div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Comprehensive Diagnostics
              </h3>
              <p className="text-lg text-gray-700 leading-relaxed mb-4">
                We offer a full range of diagnostic lab tests including <span className="font-semibold text-blue-600">Blood Tests, Pathology, and Imaging</span>.
              </p>
              <ul className="space-y-3">
                <li className="flex items-center gap-3 text-gray-700">
                  <SafeIcon icon={FiIcons.FiCheck} className="text-green-500" />
                  Pre-defined health packages for full body checkups
                </li>
                <li className="flex items-center gap-3 text-gray-700">
                  <SafeIcon icon={FiIcons.FiCheck} className="text-green-500" />
                  Vitamin screening and specialized profiles
                </li>
                <li className="flex items-center gap-3 text-gray-700">
                  <SafeIcon icon={FiIcons.FiCheck} className="text-green-500" />
                  Flexibility to choose individual tests
                </li>
              </ul>
            </div>
          </div>

          {/* Right - Key Details */}
          <div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="grid grid-cols-2 gap-4"
          >
            {keyDetails.map((detail, index) => (
              <div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
              >
                <div className={`p-3 rounded-full bg-gray-50 w-12 h-12 flex items-center justify-center mb-3 ${detail.color}`}>
                  <SafeIcon icon={detail.icon} className="text-xl" />
                </div>
                <p className="text-sm font-medium text-gray-500">
                  {detail.label}
                </p>
                <p className="text-lg font-bold text-gray-900">
                  {detail.value}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default PackageSummary;