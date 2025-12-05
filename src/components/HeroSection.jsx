import React, { useState } from 'react';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';

const { FiUser, FiPhone, FiMapPin, FiCheck, FiSearch, FiHome, FiFileText, FiUsers } = FiIcons;

const HeroSection = () => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    city: '',
    whatsapp: true,
    privacy: true
  });

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const uspPoints = [
    { icon: 'https://brandingpioneers.co.in/curelo-health/icon1.png', title: "100% Honest Pricing" },
    { icon: 'https://brandingpioneers.co.in/curelo-health/icon2.png', title: "India's Widest Home Collection Network" },
    { icon: 'https://brandingpioneers.co.in/curelo-health/icon3.png', title: "100% Report Accuracy Guaranteed" },
    { icon: 'https://brandingpioneers.co.in/curelo-health/icon4.png', title: "70+ Lakhs Patients Served" }
  ];

  return (
    <section className="bg-[#f2f4f7] py-8 lg:py-10">
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row gap-6 items-start">

          {/* LEFT COLUMN: 65% width - Banner & USP Icons (Desktop) */}
          <div className="w-full lg:w-[65%] flex flex-col gap-8">

            {/* Main Banner Image - Mobile vs Desktop images */}
            <div className="relative rounded-2xl overflow-hidden shadow-sm bg-white">
              {/* Mobile Banner */}
              <img
                src="https://brandingpioneers.co.in/curelo-health/mob.png"
                alt="Full Body Checkup Banner"
                className="w-full h-auto object-cover block lg:hidden"
              />
              {/* Desktop Banner */}
              <img
                src="https://brandingpioneers.co.in/curelo-health/hero.png"
                alt="Full Body Checkup Banner"
                className="w-full h-auto object-cover hidden lg:block"
              />
            </div>

            {/* MOBILE: Form Section - After Banner */}
            <div className="lg:hidden">
              <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">

                {/* Form Header */}
                <div className="pt-5 pb-2 px-5">
                  <h2 className="text-lg font-bold text-slate-800">Book Your Test Today</h2>
                </div>

                <div className="px-5 pb-5 space-y-3">

                  {/* Offer Box */}
                  <div className="bg-white border border-green-200 rounded-xl p-3 flex items-center gap-3 shadow-[0_2px_8px_rgba(0,0,0,0.05)]">
                    <div className="w-10 h-10 rounded-full bg-orange-100 shrink-0 flex items-center justify-center overflow-hidden">
                      <span className="text-xl">🥗</span>
                    </div>
                    <div className="flex-1">
                      <p className="text-xs font-bold text-slate-800">Get Report Consultation & Diet Plan</p>
                      <div className="flex items-center justify-between mt-1">
                        <span className="text-[10px] text-gray-500">with your Booking!</span>
                        <div className="text-right">
                          <span className="text-green-600 font-bold text-sm">Free</span>
                          <span className="text-gray-400 line-through text-[10px] ml-1">₹799</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Form Fields */}
                  <form className="space-y-3">

                    {/* Name */}
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <SafeIcon icon={FiUser} className="text-gray-400" />
                      </div>
                      <input
                        type="text"
                        name="name"
                        placeholder="Enter Name"
                        className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-full text-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all placeholder-gray-400 bg-white"
                        value={formData.name}
                        onChange={handleInputChange}
                      />
                    </div>

                    {/* Phone */}
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <span className="text-gray-400 font-medium text-sm">+91</span>
                      </div>
                      <input
                        type="tel"
                        name="phone"
                        placeholder="Enter Phone Number"
                        className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-full text-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all placeholder-gray-400 bg-white"
                        value={formData.phone}
                        onChange={handleInputChange}
                      />
                    </div>

                    {/* City */}
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <SafeIcon icon={FiMapPin} className="text-gray-400" />
                      </div>
                      <input
                        type="text"
                        name="city"
                        placeholder="Enter City"
                        className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-full text-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all placeholder-gray-400 bg-white"
                        value={formData.city}
                        onChange={handleInputChange}
                      />
                    </div>

                    {/* Checkboxes */}
                    <div className="space-y-2 pt-1">
                      <label className="flex items-start gap-2 cursor-pointer group">
                        <div className="relative flex items-center mt-0.5">
                          <input
                            type="checkbox"
                            name="whatsapp"
                            checked={formData.whatsapp}
                            onChange={handleInputChange}
                            className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                        </div>
                        <span className="text-[11px] text-gray-500 group-hover:text-gray-700">
                          Opt-in for WhatsApp updates
                        </span>
                      </label>
                      <label className="flex items-start gap-2 cursor-pointer group">
                        <div className="relative flex items-center mt-0.5">
                          <input
                            type="checkbox"
                            name="privacy"
                            checked={formData.privacy}
                            onChange={handleInputChange}
                            className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                        </div>
                        <span className="text-[10px] text-gray-500 group-hover:text-gray-700 leading-tight">
                          You hereby affirm & authorise Curelo Health to process the personal data as per the <a href="#" className="underline text-gray-600">Privacy Policy.</a>
                        </span>
                      </label>
                    </div>

                    {/* Submit Button */}
                    <button type="button" className="w-full bg-[#bfbfbf] hover:bg-gray-400 text-white font-bold py-3 rounded-full uppercase tracking-wider transition-colors shadow-sm text-base mt-2">
                      SUBMIT
                    </button>
                    <p className="text-[9px] text-gray-400 text-center pt-1">
                      *Prices are subject to change as per city
                    </p>
                  </form>
                </div>

                {/* Testimonial Footer */}
                <div className="bg-[#eef8ff] p-4 flex items-center gap-3 border-t border-blue-50">
                  <div className="relative shrink-0">
                    <img
                      src="https://brandingpioneers.co.in/curelo-health/Shreyas.png"
                      alt="Shreyas Iyer"
                      className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-sm object-top"
                    />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-bold text-[#0f172a] leading-tight mb-1 italic">
                      "I trust Curelo Labs for me and my family"
                    </p>
                    <div>
                      <p className="text-[10px] font-bold text-gray-800">Shreyas Iyer</p>
                      <p className="text-[9px] text-gray-500">Indian Cricketer</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* MOBILE: Why Choose Section */}
            <div className="text-center lg:hidden">
              <h2 className="text-xl font-bold text-gray-800 mb-6 font-sans">
                Why Choose Curelo Health?
              </h2>
              <div className="grid grid-cols-2 gap-4 px-2">
                {uspPoints.map((point, index) => (
                  <div
                    key={index}
                    className="flex flex-col items-center text-center gap-3"
                  >
                    <div className="w-16 h-16 bg-white rounded-full shadow-sm flex items-center justify-center border border-gray-100 p-3">
                      <img src={point.icon} alt={point.title} className="w-full h-full object-contain" />
                    </div>
                    <h3 className="text-xs font-semibold text-gray-800 leading-tight max-w-[140px]">
                      {point.title}
                    </h3>
                  </div>
                ))}
              </div>
            </div>

            {/* USP Section - Desktop Only */}
            <div className="text-center hidden lg:block">
              <h2 className="text-xl lg:text-2xl font-bold text-gray-800 mb-6 font-sans">
                Why Choose Curelo Health?
              </h2>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 px-2">
                {uspPoints.map((point, index) => (
                  <div
                    key={index}
                    className="flex flex-col items-center text-center gap-3"
                  >
                    <div className="w-16 h-16 bg-white rounded-full shadow-sm flex items-center justify-center border border-gray-100 p-3">
                      <img src={point.icon} alt={point.title} className="w-full h-full object-contain" />
                    </div>
                    <h3 className="text-xs lg:text-sm font-semibold text-gray-800 leading-tight max-w-[140px]">
                      {point.title}
                    </h3>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: 35% width - Booking Form Card (Desktop Only) */}
          <div className="w-full lg:w-[35%] hidden lg:block">
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100 sticky top-4">

              {/* Form Header */}
              <div className="pt-6 pb-2 px-6">
                <h2 className="text-xl font-bold text-slate-800">Book Your Test Today</h2>
              </div>

              <div className="px-6 pb-6 space-y-4">

                {/* Offer Box */}
                <div className="bg-white border border-green-200 rounded-xl p-3 flex items-center gap-3 shadow-[0_2px_8px_rgba(0,0,0,0.05)]">
                  <div className="w-10 h-10 rounded-full bg-orange-100 shrink-0 flex items-center justify-center overflow-hidden">
                    <span className="text-xl">🥗</span>
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-bold text-slate-800">Get Report Consultation & Diet Plan</p>
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-[10px] text-gray-500">with your Booking!</span>
                      <div className="text-right">
                        <span className="text-green-600 font-bold text-sm">Free</span>
                        <span className="text-gray-400 line-through text-[10px] ml-1">₹799</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Form Fields */}
                <form className="space-y-3">

                  {/* Name */}
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <SafeIcon icon={FiUser} className="text-gray-400" />
                    </div>
                    <input
                      type="text"
                      name="name"
                      placeholder="Enter Name"
                      className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-full text-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all placeholder-gray-400 bg-white"
                      value={formData.name}
                      onChange={handleInputChange}
                    />
                  </div>

                  {/* Phone */}
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <span className="text-gray-400 font-medium text-sm">+91</span>
                    </div>
                    <input
                      type="tel"
                      name="phone"
                      placeholder="Enter Phone Number"
                      className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-full text-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all placeholder-gray-400 bg-white"
                      value={formData.phone}
                      onChange={handleInputChange}
                    />
                  </div>

                  {/* City */}
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <SafeIcon icon={FiMapPin} className="text-gray-400" />
                    </div>
                    <input
                      type="text"
                      name="city"
                      placeholder="Enter City"
                      className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-full text-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all placeholder-gray-400 bg-white"
                      value={formData.city}
                      onChange={handleInputChange}
                    />
                  </div>

                  {/* Checkboxes */}
                  <div className="space-y-2 pt-1">
                    <label className="flex items-start gap-2 cursor-pointer group">
                      <div className="relative flex items-center mt-0.5">
                        <input
                          type="checkbox"
                          name="whatsapp"
                          checked={formData.whatsapp}
                          onChange={handleInputChange}
                          className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                      </div>
                      <span className="text-[11px] text-gray-500 group-hover:text-gray-700">
                        Opt-in for WhatsApp updates
                      </span>
                    </label>
                    <label className="flex items-start gap-2 cursor-pointer group">
                      <div className="relative flex items-center mt-0.5">
                        <input
                          type="checkbox"
                          name="privacy"
                          checked={formData.privacy}
                          onChange={handleInputChange}
                          className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                      </div>
                      <span className="text-[10px] text-gray-500 group-hover:text-gray-700 leading-tight">
                        You hereby affirm & authorise Curelo Health to process the personal data as per the <a href="#" className="underline text-gray-600">Privacy Policy.</a>
                      </span>
                    </label>
                  </div>

                  {/* Submit Button */}
                  <button type="button" className="w-full bg-[#bfbfbf] hover:bg-gray-400 text-white font-bold py-3 rounded-full uppercase tracking-wider transition-colors shadow-sm text-base mt-2">
                    SUBMIT
                  </button>
                  <p className="text-[9px] text-gray-400 text-center pt-1">
                    *Prices are subject to change as per city
                  </p>
                </form>
              </div>

              {/* Testimonial Footer (Inside Card) */}
              <div className="bg-[#eef8ff] p-4 flex items-center gap-3 border-t border-blue-50">
                <div className="relative shrink-0">
                  <img
                    src="https://brandingpioneers.co.in/curelo-health/Shreyas.png"
                    alt="Shreyas Iyer"
                    className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-sm object-top"
                  />
                </div>
                <div className="flex-1">
                  <p className="text-xs font-bold text-[#0f172a] leading-tight mb-1 italic">
                    "I trust Curelo Labs for me and my family"
                  </p>
                  <div>
                    <p className="text-[10px] font-bold text-gray-800">Shreyas Iyer</p>
                    <p className="text-[9px] text-gray-500">Indian Cricketer</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;