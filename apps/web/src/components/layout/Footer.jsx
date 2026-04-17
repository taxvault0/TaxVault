import React from 'react';

const Footer = () => {
  return (
    <footer className="border-t bg-white px-4 py-4 sm:px-6 lg:px-8">
      <div className="mx-auto flex w-full max-w-[1600px] flex-col gap-3 text-sm text-gray-500 md:flex-row md:items-center md:justify-between">
        
        {/* Left */}
        <div className="flex items-center gap-2">
          <span className="font-semibold text-gray-700">TaxVault</span>
          <span>© {new Date().getFullYear()}</span>
        </div>

        {/* Center Links */}
        <div className="flex flex-wrap items-center gap-4">
          <button className="hover:text-gray-700 transition">
            Privacy Policy
          </button>
          <button className="hover:text-gray-700 transition">
            Terms of Service
          </button>
          <button className="hover:text-gray-700 transition">
            Support
          </button>
        </div>

        {/* Right */}
        <div className="text-xs text-gray-400">
          v1.0.0
        </div>

      </div>
    </footer>
  );
};

export default Footer;

