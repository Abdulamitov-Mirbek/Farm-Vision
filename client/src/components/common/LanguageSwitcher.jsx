// src/components/common/LanguageSwitcher.jsx
import React, { useState, useRef, useEffect } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { Globe, ChevronDown } from 'lucide-react';

const LanguageSwitcher = () => {
  const { language, changeLanguage, availableLanguages } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const currentLang = availableLanguages.find(lang => lang.code === language);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-1 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors"
        aria-label="Switch language"
      >
        <Globe size={18} className="text-gray-600" />
        <span className="text-base">{currentLang?.flag}</span>
        <ChevronDown size={14} className={`text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-40 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50 animate-slideDown">
          {availableLanguages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => {
                changeLanguage(lang.code);
                setIsOpen(false);
              }}
              className={`w-full flex items-center px-4 py-2 text-sm hover:bg-gray-50 transition-colors ${
                language === lang.code ? 'text-green-600 bg-green-50' : 'text-gray-700'
              }`}
            >
              <span className="mr-2 text-base">{lang.flag}</span>
              <span className="flex-1 text-left">{lang.name}</span>
              {language === lang.code && (
                <span className="text-green-600 text-xs">✓</span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default LanguageSwitcher;