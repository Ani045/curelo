import React from 'react';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import { useCMS } from '../context/CMSContext';

const { FiArrowRight, FiMessageCircle, FiPhone } = FiIcons;

const CantFindSection = () => {
  const { data } = useCMS();
  const { contact } = data;
  const whatsappNumber = contact?.whatsapp || '918069770000';
  const phoneNumber = contact?.phone || '+918069770000';
  const whatsappMessage = contact?.whatsappMessage || 'Hi, I need help finding a health package.';

  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`;

  return (
    <section className="bg-[#e0f7fa] py-10 border-t border-[#b2ebf2]">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between max-w-5xl mx-auto gap-6">

          <div className="text-center md:text-left">
            <h2 className="text-2xl md:text-3xl font-extrabold text-[#143a69] mb-2">
              Can't find what you need?
            </h2>
            <p className="text-[#143a69] font-semibold">
              Say 'hi' to connect with our Health Experts!
            </p>
          </div>

          <div className="flex items-center gap-4">
            {/* Call Button */}
            <a
              href={`tel:${phoneNumber}`}
              className="relative group cursor-pointer"
            >
              <div className="absolute inset-0 bg-[#143a69] rounded-full blur-lg opacity-40 group-hover:opacity-60 transition-opacity"></div>
              <div className="relative w-14 h-14 bg-white rounded-full flex items-center justify-center shadow-lg border-2 border-[#143a69] hover:scale-110 transition-transform">
                <SafeIcon icon={FiPhone} className="w-7 h-7 text-[#143a69]" />
              </div>
            </a>

            {/* WhatsApp Button */}
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="relative group cursor-pointer"
            >
              <div className="absolute inset-0 bg-[#7bdb81] rounded-full blur-lg opacity-40 group-hover:opacity-60 transition-opacity animate-pulse"></div>
              <div className="relative w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-lg border-2 border-[#7bdb81] hover:scale-110 transition-transform">
                <img
                  src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg"
                  alt="WhatsApp"
                  className="w-10 h-10"
                />
              </div>
            </a>
          </div>

        </div>
      </div>
    </section>
  );
};

export default CantFindSection;