import React, { useState, useEffect, useRef } from 'react';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import { useCMS } from '../context/CMSContext';

const { FiUser, FiPhone, FiMapPin, FiCheck, FiSearch, FiHome, FiFileText, FiUsers, FiChevronDown, FiX } = FiIcons;

/**
 * Extracts and sanitizes the URL slug from window.location
 * Returns the path segments after the domain (e.g., "thyroid-test" from "/thyroid-test")
 * Security measures:
 * - Removes leading/trailing slashes
 * - Replaces multiple slashes with underscores
 * - Removes potentially dangerous characters
 * - Limits length to prevent abuse
 * - Returns empty string for homepage
 */
const getUrlSlug = () => {
  try {
    if (typeof window === 'undefined') return '';

    // Get the pathname from the URL
    const pathname = window.location.pathname;

    // Remove leading and trailing slashes
    let slug = pathname.replace(/^\/+|\/+$/g, '');

    // Replace remaining slashes with underscores (for subdirectories)
    slug = slug.replace(/\//g, '_');

    // Remove any potentially dangerous characters - only allow alphanumeric, hyphens, underscores
    slug = slug.replace(/[^a-zA-Z0-9\-_]/g, '');

    // Limit length to prevent abuse (max 100 characters)
    slug = slug.substring(0, 100);

    // Return the sanitized slug or empty string for homepage
    return slug || '';
  } catch (error) {
    console.error('Error extracting URL slug:', error);
    return '';
  }
};

// All available services
const SERVICES_LIST = [
  "TSH Thyroid Stimulating Hormone",
  "RBS- Random Blood Sugar",
  "FBS - Fasting Blood Sugar",
  "Cholesterol Total",
  "Advance Full Body Package With Vitamins",
  "Advance Full Body Package With HBA1C",
  "Corporate Package",
  "CBC - Complete Blood Count",
  "Basic Full Body Package",
  "Advance Full Body Package",
  "HbA1C-Glycosylated Hb",
  "Urine Routine And Microscopy",
  "Liver Profile/Liver Function Test/LFT",
  "PP2BS - Post Prandial Blood Sugar",
  "Lipid Profile",
  "Kidney Profile/Kidney Function Test/KFT",
  "Health Package Basic",
  "CRP - C Reactive Protein",
  "Thyroid Profile",
  "Health Camp (RBS+TSH)",
  "Executive Health Package",
  "Creatinine",
  "Hb-Hemoglobin",
  "Urine C/S- Urine Culture And Sensitivity",
  "ESR - Erythrocyte Sedimentation Rate",
  "UA -Uric Acid",
  "Vitamin B12",
  "Blood Grouping And RH Factor",
  "Convenience & Kit Charges",
  "SGPT",
  "Health Camp (FBS+TSH)",
  "Diwali Special Vitamin Package",
  "Repeat Test",
  "Widal - Slide Method",
  "Ackno Health Package",
  "T4 -Thyroxine",
  "T3-Triiodothyronine",
  "Advance Full Body Package - Male",
  "PT - Prothrombin Time",
  "IGE LEVEL - SERUM IMMUNOGLOBULIN LEVEL",
  "Advance Full Body Package - Female",
  "Ferritin",
  "TSH Ultrasensitive",
  "PSA (Total)- Prostate Specific Antigen",
  "CA - Calcium",
  "HBsAg (Rapid)",
  "Navratri Special Vitamin Package",
  "PRL - Prolactin",
  "Advance Senior Citizen Full Body Package",
  "Hb Electrophoresis By HPLC",
  "IGG LEVEL - Serum Immuno Globulin G Level",
  "SGOT",
  "Advance Fever Package",
  "Vitamin B12 + Vit D Combo",
  "25 Hydroxy Vitamin D",
  "AMH - Anti Mullerian Hormone",
  "Testosterone Total",
  "Advance Full Body Package",
  "Basic Vitamins Package",
  "HIV (Rapid)-Human Immunodeficiency Virus (Rapid)",
  "HEALTHHEART VITAMIN PACKAGE (HHVP)",
  "Iron",
  "Camp Health Package",
  "Basic Pre Operative Package",
  "MP - Malaria Parasite",
  "Blood C/S - Blood Culture & Sensitivity",
  "Insulin Fasting",
  "Allergy Comprehensive Package",
  "RA Factor (Rheumatoid Arthritis Factor)",
  "Stool Routine & Microscopic Examination",
  "Basic Fever Package",
  "Eye Examination",
  "TTG/IGA - Tissue Transglutaminase/IGA",
  "Electrolytes",
  "PLT - Platelet",
  "Anti CCP - Anti Cyclic Citrullinated Peptide",
  "Urea",
  "Iron Studies",
  "Diwali Special Basic Silver Package",
  "MG - Magnesium",
  "Vitamin D",
  "F.T4 - Free Thyroxine (FT4)",
  "RAD Chest X-Ray",
  "RPR VDRL",
  "Amylase",
  "Rubella IGG",
  "RAD Pulmonary Function Test (Pft)",
  "Free Thyroid Profile",
  "Jio B",
  "Complete Hemogram",
  "Hard Copy Report Charges",
  "APTT - Activated Partial Thromboplastin Time",
  "LH-Luteinizing Hormone",
  "Typhi Dot",
  "FSH - Follicle Stimulating Hormone",
  "COVID 19 RT-PCR",
  "PS - Peripheral Smear Study",
  "Malarial Antigen - Falciparum/Vivax",
  "Anti TPO - Anti Thyroid Peroxidase Antibodies",
  "LDH-Lactate Dehydrogenase",
  "Double Marker",
  "LBC-Liquid Based Cytology",
  "Lipase",
  "K-Potassium",
  "Beta HCG - Beta Human Chorionic Gonadotropin-B HCG",
  "High Sensitivity CRP (HS CRP)",
  "Urine Protein Creatinine Ratio",
  "Na - Sodium",
  "E2 - Estradiol",
  "CA 125 - Cancer Antigen 125",
  "ALP- Alkaline Phosphtase",
  "TGL - Triglyceride",
  "Bilirubin - Bilirubin Total",
  "RAD USG Whole Abdomen",
  "C-Peptide",
  "BUN - Blood Urea Nitrogen",
  "CEA - Carcinoembryonic Antigen",
  "Coagulation Profile",
  "AEC - Absolute Eosinophil Count",
  "Basic Routine",
  "QUADRUPLE MARKER",
  "Anti HCV (Rapid)",
  "Fever Profile With Dengue Package",
  "24 Hour Urine Protein",
  "Dengue NS1 (Rapid)",
  "GCT 75g Glucose",
  "Cholesterol HDL - Direct",
  "Free Testosterone",
  "Homocysteine",
  "Widal - Tube Method",
  "ANA By ELISA - Antinuclear Antibody By ELISA",
  "Sickling",
  "F.T3 - Free Triiodothyronine (FT3)",
  "Basic Panel",
  "C-Peptide (Fasting)",
  "Basic Antenatal Package",
  "Albumin",
  "Curelo Fit Premium Package (Curelofit)",
  "Progesterone Level",
  "Vitamin D3",
  "Aerobic Culture",
  "Cortisol (Am)",
  "Basic PCOD Package",
  "CPK - Creatine Phosphokinase",
  "Advance Antenatal Package",
  "Beta HCG (Quantitative) - Maternal",
  "Jio A",
  "Basic Diabetes Package",
  "Bile Acid",
  "Tacrolimus",
  "Retic Count (Auto)",
  "Allergy Test - Food Non Veg",
  "Basic Iron Deficiency Package",
  "DHEA - Sulfate",
  "Biopsy Small",
  "AFP - Alpha Fetoprotein",
  "RAD Cardio Electrocardiogram",
  "Insulin PP",
  "Total Protein",
  "Basic Fertility Package",
  "Basic Full Body Package With TSH",
  "PTH - Parathyroid Hormone",
  "Culture And Sensitivity",
  "GFR-Glomerular Filtration Rate",
  "HAV IgM",
  "Arthritis Profile",
  "Jio 1.1",
  "HCO3-Bicarbonate",
  "Typhoid",
  "Curelo Elite Package",
  "1 25 Dihydroxy Vitamin D",
  "Dengue IgM - Rapid Test",
  "1+1 Curelo Fit Premium Package (Curelofit)",
  "CPK MB - Creatine Phosphokinase MB",
  "17 OH Hydroxy Progesterone",
  "HLA B27 DNA Qualitative PCR",
  "Troponin-I",
  "Anti HCV",
  "PSA (Free)- Prostate Specific Antigen",
  "Diabetic",
  "Folate",
  "D-Dimer",
  "GCT-Glucose Challenge Test For Pregnancy One Sample 1Hr",
  "TB Gold -Tuberculosis Gold",
  "Homa IR",
  "Rubella IgM",
  "Jio 1.2",
  "Basic Heart Package",
  "Varicella Zoster IgG/ Chicken Pox IgG",
  "LDL-Cholesterol",
  "VIT D (25 OH CHOL)",
  "Anti HBsAg",
  "RAD Echocardiogram",
  "Coombs Test-Indirect",
  "Calprotectin Fecal",
  "Dengue NS1 (Elisa/ELFA)",
  "Dengue IgG (Elisa)",
  "Microalbumin Spot Urine",
  "ANA By IF - Antinuclear Antibody By Immuno Fluorosence",
  "ACE - Angiotensin Converting Enzyme",
  "Torch IGM",
  "HIV I & II-Human Immunodeficiency Virus-I & II",
  "CA 19.9 - Cancer Antigen 19.9",
  "Bilirubin Total & Direct",
  "HLA B27 By Flowcytometry",
  "Chikungunya IgM",
  "Jio 1.3",
  "RAD Audiometry",
  "Ionised Calcium",
  "TgAb - Anti Thyroglobulin",
  "IHC Panel - Immunohistochemistry Panel",
  "HBsAg By CMIA-Hepatitis B Surface Antigen By Chemiluminescent Microparticle Immuno Assay",
  "LP A - Lipoprotein A",
  "STD Profile Basic",
  "PROCALCITONIN",
  "OGTT - Oral Glucose Tolerance Test",
  "Fibrinogen",
  "Testosterone Free & Total",
  "NT-Pro BNP (N-terminal Pro Brain Natriuretic Peptide)",
  "PO4 - PHOSPHORUS",
  "Iron Profile With Ferritin",
  "Allergy Test - Food Veg + Non Veg",
  "Biopsy Medium",
  "Reticulocyte Count",
  "Allergy Test - Drugs",
  "TTG/IgG - Tissue Transglutaminase/IgG",
  "HBV Quantitative-Viral Load",
  "TSH Receptor Antibody",
  "Cortisol",
  "Zinc Level",
  "Culture & Sensitivity - Sputum",
  "Cervical Screening",
  "Basic Anemia Package",
  "CK-MB - Creatine Kinase MB",
  "AFB STAIN - Acid Fast Bacilli Stain",
  "PROTEINS",
  "Culture Aerobic Urine",
  "Biopsy Large",
  "IGA LEVEL - Serum Immuno Globulin A Level",
  "Dengue IgM (Elisa)",
  "Anti HBs - Anti Hepatitis B Surface - Hepatitis B Surface Antibody - HBsAb",
  "Beta HCG Total Quantitative",
  "TB PCR (IPAQT)",
  "Apolipoprotein B",
  "ANA Profile -Anti Nuclear Antibody",
  "Stool Reducing Substances",
  "Troponin-T",
  "Vitamin Gold Health Package",
  "AFB SPUTUM",
  "IG E",
  "Advance Diabetes Package",
  "ASO - Anti Streptolysin O",
  "Navratri Special Basic Silver Package",
  "HEV IgM - Hepatitis E Virus IgM",
  "IGM LEVEL - Serum Immuno Globulin M Level",
  "ENA-Extractable Nuclear Antigen",
  "Coombs Test-Direct",
  "Allergy Package",
  "Cyclosporine",
  "CA 15.3 - Cancer Antigen 15.3",
  "Slide & Block Issue",
  "Occult Blood",
  "SHBG-Sex Hormone Binding Globulin",
  "AMH Plus Profile",
  "RAD MRI Brain",
  "NIPT"
];

// Recommended services to show by default
const RECOMMENDED_SERVICES = [
  "Basic Full Body Package",
  "Advance Full Body Package",
  "CBC - Complete Blood Count",
  "Thyroid Profile",
  "Lipid Profile",
  "Vitamin D",
  "Vitamin B12",
  "Health Package Basic"
];

// Searchable Service Select Component
const ServiceSelect = ({ value, onChange, placeholder = "Select Service/Test" }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const dropdownRef = useRef(null);
  const inputRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
        setSearchQuery('');
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Filter services based on search query
  const filteredServices = searchQuery.trim()
    ? SERVICES_LIST.filter(service =>
      service.toLowerCase().includes(searchQuery.toLowerCase())
    )
    : RECOMMENDED_SERVICES;

  const handleSelect = (service) => {
    onChange(service);
    setIsOpen(false);
    setSearchQuery('');
  };

  const handleClear = (e) => {
    e.stopPropagation();
    onChange('');
    setSearchQuery('');
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Main Button/Display */}
      <div
        className="w-full pl-11 pr-10 py-3 border border-gray-200 rounded-full text-sm focus-within:ring-1 focus-within:ring-blue-500 focus-within:border-blue-500 outline-none transition-all bg-white cursor-pointer flex items-center"
        onClick={() => {
          setIsOpen(!isOpen);
          setTimeout(() => inputRef.current?.focus(), 100);
        }}
      >
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <SafeIcon icon={FiSearch} className="text-gray-400" />
        </div>
        <span className={value ? "text-gray-800" : "text-gray-400"}>
          {value || placeholder}
        </span>
        {value && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-10 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-100 rounded-full"
          >
            <SafeIcon icon={FiX} className="text-gray-400 w-3.5 h-3.5" />
          </button>
        )}
        <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
          <SafeIcon icon={FiChevronDown} className={`text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </div>
      </div>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute z-50 w-full mt-2 bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden">
          {/* Search Input */}
          <div className="p-2 border-b border-gray-100">
            <div className="relative">
              <SafeIcon icon={FiSearch} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                ref={inputRef}
                type="text"
                placeholder="Search tests & packages..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none"
              />
            </div>
          </div>

          {/* Results */}
          <div className="max-h-48 overflow-y-auto">
            {!searchQuery.trim() && (
              <div className="px-3 py-2 text-xs font-semibold text-gray-500 bg-gray-50">
                Recommended Tests
              </div>
            )}
            {filteredServices.length > 0 ? (
              filteredServices.map((service, index) => (
                <div
                  key={index}
                  onClick={() => handleSelect(service)}
                  className={`px-3 py-2.5 text-sm cursor-pointer hover:bg-blue-50 transition-colors ${value === service ? 'bg-blue-50 text-blue-600 font-medium' : 'text-gray-700'
                    }`}
                >
                  {service}
                </div>
              ))
            ) : (
              <div className="px-3 py-4 text-sm text-gray-500 text-center">
                No tests found matching "{searchQuery}"
              </div>
            )}
            {searchQuery.trim() && filteredServices.length > 0 && (
              <div className="px-3 py-2 text-xs text-gray-400 border-t border-gray-100 text-center">
                {filteredServices.length} result{filteredServices.length !== 1 ? 's' : ''} found
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

const HeroSection = ({ selectedPackage }) => {
  const { data } = useCMS();
  const { hero } = data;

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    city: '',
    service: ''
  });

  // Auto-fill service when a package is selected from "Book Now"
  useEffect(() => {
    if (selectedPackage) {
      setFormData(prev => ({ ...prev, service: selectedPackage }));
    }
  }, [selectedPackage]);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const [isSmallDevice, setIsSmallDevice] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsSmallDevice(window.innerWidth < 400);
    };
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Get the URL slug for tracking which landing page the lead came from
      const urlSlug = getUrlSlug();

      // Send form data as simple object - the API will transform it to LeadSquared format
      const payload = {
        name: formData.name,
        phone: formData.phone,
        city: formData.city,
        service: formData.service,
        source: 'Google_lp',  // Hidden field - can be customized per page/campaign
        utmSource: urlSlug    // Maps to mx_utm_source - extracted from URL path (e.g., "thyroid-test")
      };

      // Submit to serverless API endpoint
      const response = await fetch('/api/lead', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      });

      const result = await response.json();

      if (response.ok && result.success) {
        // Success - reset form
        setFormData({
          name: '',
          phone: '',
          city: '',
          service: ''
        });
        alert('Thank you! Your request has been submitted successfully.');
      } else {
        // Show validation errors if present
        if (result.details && Array.isArray(result.details)) {
          alert(result.details.join('\n'));
        } else {
          throw new Error(result.error || 'Submission failed');
        }
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('There was an error submitting your request. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="bg-[#f2f4f7] pt-2 pb-4 lg:py-10">
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row gap-3 lg:gap-6 items-start">

          {/* LEFT COLUMN: 65% width - Banner & USP Icons (Desktop) */}
          <div className="w-full lg:w-[65%] flex flex-col gap-3 lg:gap-8">

            {/* Main Banner Image - Responsive based on screen size */}
            <div className="relative rounded-xl lg:rounded-2xl overflow-hidden shadow-sm bg-white">
              {/* Small Device Banner (< 400px like iPhone SE) - Full image */}
              {isSmallDevice && (
                <img
                  src={hero.smallBanner}
                  alt="Full Body Checkup Banner"
                  className="w-full h-auto"
                />
              )}
              {/* Regular Mobile Banner (400px - 1023px) - Full image */}
              {!isSmallDevice && (
                <img
                  src={hero.mobileBanner}
                  alt="Full Body Checkup Banner"
                  className="w-full h-auto lg:hidden"
                />
              )}
              {/* Desktop Banner (1024px+) */}
              <img
                src={hero.desktopBanner}
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
                      <p className="text-xs font-bold text-slate-800">{hero.offerTitle}</p>
                      <div className="flex items-center justify-between mt-1">
                        <span className="text-[10px] text-gray-500">{hero.offerSubtitle}</span>
                        <div className="text-right">
                          <span className="text-green-600 font-bold text-sm">Free</span>
                          <span className="text-gray-400 line-through text-[10px] ml-1">{hero.offerPriceOriginal}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Form Fields */}
                  <form className="space-y-3" onSubmit={handleSubmit}>

                    {/* Name */}
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <SafeIcon icon={FiUser} className="text-gray-400" />
                      </div>
                      <input
                        type="text"
                        id="hero-name-input-mobile"
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

                    {/* Service Selection */}
                    <ServiceSelect
                      value={formData.service}
                      onChange={(value) => setFormData(prev => ({ ...prev, service: value }))}
                      placeholder="Select Service/Test"
                    />

                    {/* Submit Button */}

                    <button
                      type="submit"


                      disabled={isSubmitting}
                      className="w-full bg-[#143a69] hover:bg-[#0f2d52] disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-bold py-3 rounded-full uppercase tracking-wider transition-colors shadow-sm text-base mt-4"
                    >
                      {isSubmitting ? 'SUBMITTING...' : 'SUBMIT'}
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
                {hero.usps.map((point, index) => (
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
                {hero.usps.map((point, index) => (
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
                    <p className="text-xs font-bold text-slate-800">{hero.offerTitle}</p>
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-[10px] text-gray-500">{hero.offerSubtitle}</span>
                      <div className="text-right">
                        <span className="text-green-600 font-bold text-sm">Free</span>
                        <span className="text-gray-400 line-through text-[10px] ml-1">{hero.offerPriceOriginal}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Form Fields */}
                <form className="space-y-3" onSubmit={handleSubmit}>

                  {/* Name */}
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <SafeIcon icon={FiUser} className="text-gray-400" />
                    </div>
                    <input
                      type="text"
                      id="hero-name-input-desktop"
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

                  {/* Service Selection */}
                  <ServiceSelect
                    value={formData.service}
                    onChange={(value) => setFormData(prev => ({ ...prev, service: value }))}
                    placeholder="Select Service/Test"
                  />

                  {/* Submit Button */}
                  <button
                    type="submit"



                    disabled={isSubmitting}
                    className="w-full bg-[#143a69] hover:bg-[#0f2d52] disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-bold py-3 rounded-full uppercase tracking-wider transition-colors shadow-sm text-base mt-4"
                  >
                    {isSubmitting ? 'SUBMITTING...' : 'SUBMIT'}
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