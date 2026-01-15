import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import { useCMS } from '../context/CMSContext';

const { FiChevronDown, FiChevronUp, FiHelpCircle, FiPhone } = FiIcons;

const FAQSection = () => {
  const { data } = useCMS();
  const { faqs, contact } = data;
  const phoneNumber = contact?.phone || '+918069770000';
  const [openFAQ, setOpenFAQ] = useState(null);

  const toggleFAQ = (index) => {
    setOpenFAQ(openFAQ === index ? null : index);
  };

  return (
    <section className="py-14 bg-white">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-8 items-center">

          {/* Left - FAQ Section */}
          <div
            className="pr-0 lg:pr-8"
          >
            {/* Header */}
            <div className="mb-8">
              <h2 className="text-2xl lg:text-3xl font-bold text-[#143a69] mb-3">
                {faqs.title}
              </h2>
              <p className="text-gray-600 text-sm lg:text-base">
                {faqs.subtitle}
              </p>
            </div>

            {/* FAQ Items - Compact Design */}
            <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
              {faqs.items.map((faq, index) => (
                <div
                  key={index}
                  className="border border-gray-200 rounded-xl overflow-hidden bg-white transition-all duration-300 hover:border-[#143a69]/30 hover:shadow-sm"
                >
                  <button
                    onClick={() => toggleFAQ(index)}
                    className="w-full p-3.5 text-left flex justify-between items-center bg-gray-50/50 hover:bg-gray-50 transition-colors group"
                  >
                    <span className="font-semibold text-gray-800 text-sm lg:text-base pr-4">
                      {faq.question}
                    </span>
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-[#7bdb81]/10 flex items-center justify-center group-hover:bg-[#7bdb81]/20 transition-colors">
                        <SafeIcon
                          icon={openFAQ === index ? FiChevronUp : FiChevronDown}
                          className="text-[#143a69] text-sm"
                        />
                      </div>
                    </div>
                  </button>

                  <AnimatePresence>
                    {openFAQ === index && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className="overflow-hidden"
                      >
                        <div className="p-3.5 bg-white text-gray-600 text-sm leading-relaxed border-t border-gray-100">
                          {faq.answer}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>

            {/* Contact Info */}
            <div
              className="mt-6 p-4 bg-[#143a69]/5 rounded-xl border border-[#143a69]/10"
            >
              <div className="flex items-center gap-6">
                <a
                  href={`tel:${phoneNumber}`}
                  className="relative group cursor-pointer"
                >
                  <div className="absolute inset-0 bg-[#143a69] rounded-full blur-lg opacity-40 group-hover:opacity-60 transition-opacity"></div>
                  <div className="relative w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-lg border-2 border-[#143a69] hover:scale-110 transition-transform">
                    <SafeIcon icon={FiPhone} className="w-6 h-6 text-[#143a69]" />
                  </div>
                </a>
                <div>
                  <p className="text-[#143a69] font-semibold text-sm">Still have questions?</p>
                  <p className="text-gray-600 text-xs">Call us at {phoneNumber}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right - Image */}
          <div
            className="relative"
          >
            <div className="relative rounded-2xl overflow-hidden shadow-xl">
              {/* Decorative background */}
              <div className="absolute inset-0 bg-gradient-to-br from-[#143a69]/10 to-[#7bdb81]/10 z-0"></div>

              {/* Image with object-position for top focus */}
              <img
                src="https://brandingpioneers.co.in/curelo-health/Shreyas.png"
                alt="Shreyas Iyer"
                className="relative z-10 w-full h-auto object-cover max-h-[500px] lg:max-h-[600px] object-top"
              />

              {/* Overlay gradient */}
              <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-black/20 to-transparent z-20"></div>

              {/* Floating badge */}
              <div
                className="absolute top-6 right-6 bg-white rounded-full p-3 shadow-lg z-30"
              >
                <div className="w-12 h-12 bg-[#143a69] rounded-full flex items-center justify-center">
                  <SafeIcon icon={FiPhone} className="text-white text-xl" />
                </div>
              </div>
            </div>

            {/* Bottom accent */}
            <div className="mt-4 flex justify-center">
              <div className="w-24 h-1 bg-gradient-to-r from-[#143a69] to-[#7bdb81] rounded-full"></div>
            </div>
          </div>

        </div>
      </div>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f5f9;
          border-radius: 2px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 2px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #94a3b8;
        }
      `}</style>
    </section>
  );
};

export default FAQSection;