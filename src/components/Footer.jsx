import { useCMS } from '../context/CMSContext';

const Footer = () => {
  const { data } = useCMS();
  const phoneNumber = data.contact?.phone || '+91 806 977 0000';

  return (
    <footer className="bg-[#143a69] text-white py-12 overflow-hidden">
      <div className="container mx-auto px-4">
        {/* Logo and One-liner - Centered */}
        <div className="flex flex-col items-center text-center">
          <img
            src="https://brandingpioneers.co.in/curelo-health/Blue-Background-PNG.png"
            alt="Curelo Health"
            className="h-16 w-auto mb-4"
          />
          <p className="text-gray-300 text-sm max-w-xl">
            Connecting you with India's most trusted diagnostic labs for accurate testing and better health.
          </p>

          {/* Contact Number */}
          <div className="mt-4 text-center">
            <p className="text-white font-semibold mb-2">Contact Us</p>
            <a
              href={`tel:${phoneNumber}`}
              className="text-gray-300 hover:text-white transition-colors"
            >
              {phoneNumber}
            </a>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-white/20 pt-8 mt-8 text-center">
          {/* Disclaimer */}
          <div className="mb-6">
            <p className="text-xs text-gray-400 font-semibold mb-2">Disclaimer:</p>
            <p className="text-xs text-gray-400 max-w-3xl mx-auto leading-relaxed">
              The information provided on this website is for general informational purposes only and should not be considered medical advice, diagnosis, or treatment. Results may vary from person to person. Please consult a qualified healthcare professional before making any health-related decisions. By using this website, you confirm that you are 18 years or older.
            </p>
          </div>
          <p className="text-xs text-gray-400">
            © 2026 Curelo Health. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;