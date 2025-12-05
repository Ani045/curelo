import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';

const { FiStar, FiChevronLeft, FiChevronRight, FiCheckCircle } = FiIcons;

const TestimonialsSection = () => {
  const scrollRef = useRef(null);

  const scroll = (direction) => {
    if (scrollRef.current) {
      const { current } = scrollRef;
      const scrollAmount = 350;
      if (direction === 'left') {
        current.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
      } else {
        current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
      }
    }
  };

  const reviews = [
    {
      name: "Meera Sharma",
      location: "Delhi",
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80",
      title: "Fast and Professional Service",
      text: "I recently took the Fit India Full Body Checkup with Vitamin B12 and was impressed with the efficiency. The sample collection was smooth and hygienic. I received detailed reports within 12 hours.",
      rating: 5
    },
    {
      name: "Pooja Verma",
      location: "Jammu, J&K",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=150&q=80",
      title: "Timely and Accurate Results",
      text: "Booking an online appointment for the Vitamin Screening was easy, and the doorstep service was very convenient. I received accurate results on time. Excellent service!",
      rating: 5
    },
    {
      name: "Raj Patel",
      location: "Bangalore",
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80",
      title: "Clear and Understandable Reports",
      text: "I opted for the Advance Plus Full Body Checkup. The free doctor consultation was a great addition, helping me interpret the results effectively. Thank you, Curelo!",
      rating: 4
    },
    {
      name: "Simran Kaur",
      location: "Noida",
      image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80",
      title: "Excellent Home Collection",
      text: "The phlebotomist arrived exactly on time and was very professional. Painless sample collection and the report delivery was super fast via WhatsApp. Highly recommended.",
      rating: 5
    }
  ];

  return (
    <section className="py-16 bg-white overflow-hidden">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex flex-col md:flex-row items-center justify-between mb-10 gap-6">
          <div className="flex items-center gap-4">
            <img src="https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg" alt="Google" className="h-8" />
            <div className="flex flex-col">
              <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                Reviews 
                <span className="flex items-center text-yellow-400 text-xl">
                  <SafeIcon icon={FiStar} fill="currentColor" />
                  <span className="text-gray-600 font-normal text-lg ml-2">4.6 (21300+ Ratings)</span>
                </span>
              </h2>
            </div>
          </div>
          
          {/* Navigation Buttons */}
          <div className="flex gap-2">
            <button onClick={() => scroll('left')} className="p-3 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 transition-colors">
              <SafeIcon icon={FiChevronLeft} className="text-xl" />
            </button>
            <button onClick={() => scroll('right')} className="p-3 rounded-full bg-[#143a69] hover:bg-[#0f2d52] text-white transition-colors shadow-lg">
              <SafeIcon icon={FiChevronRight} className="text-xl" />
            </button>
          </div>
        </div>

        {/* Reviews Carousel */}
        <div 
          ref={scrollRef}
          className="flex gap-6 overflow-x-auto pb-8 snap-x scroll-smooth hide-scrollbar"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {reviews.map((review, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="min-w-[300px] md:min-w-[380px] bg-white rounded-2xl p-6 border border-gray-100 shadow-lg hover:shadow-xl transition-all snap-center flex flex-col"
            >
              <div className="flex items-center gap-4 mb-4">
                <img src={review.image} alt={review.name} className="w-14 h-14 rounded-full object-cover border-2 border-[#7bdb81]" />
                <div>
                  <h4 className="font-bold text-[#143a69]">{review.name}</h4>
                  <p className="text-sm text-gray-500">{review.location}</p>
                </div>
                <div className="ml-auto bg-green-50 px-2 py-1 rounded text-xs font-bold text-green-600 flex items-center gap-1">
                  {review.rating} <SafeIcon icon={FiStar} className="fill-current" />
                </div>
              </div>

              <h3 className="font-bold text-gray-800 mb-3 text-lg">"{review.title}"</h3>
              <p className="text-gray-600 text-sm leading-relaxed flex-1">
                {review.text}
              </p>

              <div className="mt-4 pt-4 border-t border-gray-100 flex items-center gap-2 text-xs text-gray-400">
                 <SafeIcon icon={FiCheckCircle} className="text-[#7bdb81]" /> Verified Patient
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;