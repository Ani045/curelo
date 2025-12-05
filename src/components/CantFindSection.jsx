import React from 'react';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';

const { FiArrowRight, FiMessageCircle } = FiIcons;

const CantFindSection = () => {
  return (
    <section className="bg-[#e0f7fa] py-10 border-t border-[#b2ebf2]">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between max-w-5xl mx-auto gap-6">
          
          <div className="text-center md:text-left">
            <h2 className="text-2xl md:text-3xl font-extrabold text-[#143a69] mb-2">
              Can't find what you need?
            </h2>
            <a href="#" className="inline-flex items-center gap-2 text-[#143a69] font-semibold hover:text-[#0f2d52] transition-colors group">
              Say 'hi' to connect with our Health Experts! 
              <SafeIcon icon={FiArrowRight} className="transform group-hover:translate-x-1 transition-transform" />
            </a>
          </div>

          <div className="relative group cursor-pointer">
            <div className="absolute inset-0 bg-[#7bdb81] rounded-full blur-lg opacity-40 group-hover:opacity-60 transition-opacity animate-pulse"></div>
            <div className="relative w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-lg border-2 border-[#7bdb81]">
              <img 
                src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg" 
                alt="WhatsApp" 
                className="w-10 h-10"
              />
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default CantFindSection;