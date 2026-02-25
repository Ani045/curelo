import React from 'react';
import { FiPhone } from 'react-icons/fi';
import { FaWhatsapp } from 'react-icons/fa';
import { useCMS } from '../context/CMSContext';

const StickyCTAs = () => {
    const { data } = useCMS();
    const contact = data.contact || {
        phone: '+918069770000',
        whatsapp: '918069770000',
        whatsappMessage: 'Hi, I need help finding a health package.'
    };

    const whatsappUrl = `https://wa.me/${contact.whatsapp}?text=${encodeURIComponent(contact.whatsappMessage)}`;
    const phoneUrl = `tel:${contact.phone}`;

    return (
        <div className="fixed right-0 top-1/2 -translate-y-1/2 z-[100] hidden lg:flex flex-col gap-3 pointer-events-none">
            {/* WhatsApp Button */}
            <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center bg-[#25D366] text-white p-3 rounded-l-full shadow-lg transition-all duration-300 translate-x-[calc(100%-52px)] hover:translate-x-0 pointer-events-auto"
            >
                <div className="flex items-center justify-center w-7 h-7 shrink-0">
                    <FaWhatsapp className="w-6 h-6" />
                </div>
                <span className="ml-3 mr-4 font-bold whitespace-nowrap overflow-hidden transition-all duration-300 w-0 group-hover:w-auto opacity-0 group-hover:opacity-100">
                    WhatsApp us
                </span>
            </a>

            {/* Call Button */}
            <a
                href={phoneUrl}
                className="group flex items-center bg-[#143a69] text-white p-3 rounded-l-full shadow-lg transition-all duration-300 translate-x-[calc(100%-52px)] hover:translate-x-0 pointer-events-auto"
            >
                <div className="flex items-center justify-center w-7 h-7 shrink-0">
                    <FiPhone className="w-5 h-5" />
                </div>
                <span className="ml-3 mr-4 font-bold whitespace-nowrap overflow-hidden transition-all duration-300 w-0 group-hover:w-auto opacity-0 group-hover:opacity-100">
                    Call us
                </span>
            </a>
        </div>
    );
};

export default StickyCTAs;
