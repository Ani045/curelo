import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';

const { FiChevronLeft, FiChevronRight } = FiIcons;

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

  const baseReviews = [
    {
      name: "Krupa Goswami",
      image: "https://curelohealth.com/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fclient1.f345aa7c.png&w=1920&q=75",
      text: "I am totally impressed by the services of Curelo, the phlebotomist arrived on time and collected the sample maintaining hygiene, also received my Test reports on time. I would definitely recommend using Curelo to book lab tests."
    },
    {
      name: "Pradeep Chavan",
      image: "https://curelohealth.com/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fclient2.3ab3b57b.png&w=1920&q=75",
      text: "Choosing Curelo to book my Lab Tests made my experience very time saving and smooth. They deliver the blood samples to the lab we select, which is just perfect."
    },
    {
      name: "Bhavna Nigam",
      image: "https://curelohealth.com/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fclient3.f7bc8047.png&w=1920&q=75",
      text: "From collecting my test sample from my living room to receiving the test reports was in all a very smooth and time saving journey. I would definitely be using Curelo for my future Blood Tests as well."
    }
  ];

  const reviews = [...baseReviews, ...baseReviews, ...baseReviews, ...baseReviews];

  return (
    <section className="py-16 bg-white overflow-hidden">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex flex-col md:flex-row items-center justify-between mb-10 gap-6">
          <div className="flex items-center gap-4">
            <div className="flex flex-col">
              <h2 className="text-3xl font-bold text-[#143a69] flex items-center gap-2">
                What Our Patients Say
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
              className="min-w-[300px] md:min-w-[380px] bg-white rounded-2xl p-8 border border-gray-100 shadow-lg hover:shadow-xl transition-all snap-center flex flex-col items-center text-center"
            >
              <img src={review.image} alt={review.name} className="w-20 h-20 rounded-full object-cover border-4 border-[#7bdb81] mb-6 shadow-sm" />

              <p className="text-gray-600 text-base leading-relaxed flex-1 italic mb-6">
                "{review.text}"
              </p>

              <div className="mt-auto pt-4 border-t border-gray-100 w-full">
                <h4 className="font-bold text-[#143a69] text-lg">{review.name}</h4>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;