import React from 'react';
import { FiCalendar } from 'react-icons/fi';

const StickyCTAs = () => {
    const scrollToForm = () => {
        const nameInput = document.getElementById('hero-name-input-desktop');
        if (nameInput) {
            nameInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
            setTimeout(() => nameInput.focus(), 500);
        }
    };

    return (
        <div className="fixed right-0 top-1/2 -translate-y-1/2 z-[100] hidden lg:flex flex-col gap-3 pointer-events-none">
            {/* Book Now Button */}
            <button
                onClick={scrollToForm}
                className="group flex items-center bg-[#143a69] text-white p-3 rounded-l-full shadow-lg transition-all duration-300 translate-x-[calc(100%-52px)] hover:translate-x-0 pointer-events-auto"
            >
                <div className="flex items-center justify-center w-7 h-7 shrink-0">
                    <FiCalendar className="w-6 h-6" />
                </div>
                <span className="ml-3 mr-4 font-bold whitespace-nowrap overflow-hidden transition-all duration-300 w-0 group-hover:w-auto opacity-0 group-hover:opacity-100 uppercase tracking-wider">
                    Book Now
                </span>
            </button>
        </div>
    );
};

export default StickyCTAs;
