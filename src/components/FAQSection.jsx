import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';

const { FiChevronDown, FiChevronUp, FiHelpCircle } = FiIcons;

const FAQSection = () => {
  const [openFAQ, setOpenFAQ] = useState(null);

  const faqs = [
    {
      question: "How does the home sample collection work?",
      answer: "Once you book a test, a certified phlebotomist will visit your home at your scheduled time to collect samples. The service is free of cost."
    },
    {
      question: "Which labs are affiliated with Curelo?",
      answer: "We partner with over 1500+ top NABL certified labs across India to ensure you get the most accurate and reliable diagnostic services."
    },
    {
      question: "Do you serve in Delhi/NCR?",
      answer: "Yes, we have extensive coverage across Delhi, Noida, Gurgaon, Ghaziabad, and Faridabad with multiple collection centers."
    },
    {
      question: "How soon will I get my reports?",
      answer: "Reports are typically generated within 12-24 hours depending on the test, and are delivered digitally via Email or WhatsApp."
    },
    {
      question: "What payment methods do you accept?",
      answer: "We accept all major debit/credit cards, UPI, net banking, and cash on home collection."
    },
    {
      question: "Can I cancel or reschedule my appointment?",
      answer: "Yes, you can cancel or reschedule your appointment up to 2 hours before the scheduled time without any charges."
    },
    {
      question: "Is fasting required for all tests?",
      answer: "Not all tests require fasting. Specific requirements will be mentioned in your test details. Generally, 10-12 hours fasting is needed for lipid and glucose tests."
    },
    {
      question: "How do I download my reports?",
      answer: "Reports are automatically sent to your email and WhatsApp. You can also download them from our website using your registered mobile number."
    }
  ];

  const toggleFAQ = (index) => {
    setOpenFAQ(openFAQ === index ? null : index);
  };

  return (
    <section className="py-14 bg-white">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-8 items-center">

          {/* Left - FAQ Section */}
          <div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="pr-0 lg:pr-8"
          >
            {/* Header */}
            <div className="mb-8">
              <h2 className="text-2xl lg:text-3xl font-bold text-[#143a69] mb-3">
                Frequently Asked Questions
              </h2>
              <p className="text-gray-600 text-sm lg:text-base">
                Find answers to common questions about our services
              </p>
            </div>

            {/* FAQ Items - Compact Design */}
            <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
              {faqs.map((faq, index) => (
                <div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
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
                      <div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className="overflow-hidden"
                      >
                        <div className="p-3.5 bg-white text-gray-600 text-sm leading-relaxed border-t border-gray-100">
                          {faq.answer}
                        </div>
                      </div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>

            {/* Contact Info */}
            <div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              className="mt-6 p-4 bg-[#143a69]/5 rounded-xl border border-[#143a69]/10"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#7bdb81] rounded-full flex items-center justify-center">
                  <SafeIcon icon={FiHelpCircle} className="text-white text-lg" />
                </div>
                <div>
                  <p className="text-[#143a69] font-semibold text-sm">Still have questions?</p>
                  <p className="text-gray-600 text-xs">Call us at +91 806 977 0000</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right - Image */}
          <div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
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
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.8, type: "spring" }}
                className="absolute top-6 right-6 bg-white rounded-full p-3 shadow-lg z-30"
              >
                <div className="w-12 h-12 bg-[#7bdb81] rounded-full flex items-center justify-center">
                  <SafeIcon icon={FiHelpCircle} className="text-white text-xl" />
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