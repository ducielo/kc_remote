import React, { useState } from 'react';
import { Menu, X, Globe, User, Shield, Lock } from 'lucide-react';
import { motion } from 'motion/react';
import { LoginPortalManager } from './LoginPortalManager';
import { ManageBookingModal } from './ManageBookingModal';
import { useAuth } from './AuthContext';
import { ImageWithFallback } from './figma/ImageWithFallback';
import logoImage from '/src/assets/e5bac0c71e8f85bcfad1951e40b6e4ad412d3bad.png';

interface HeaderProps {
  isMenuOpen: boolean;
  setIsMenuOpen: (open: boolean) => void;
  onShowAuth?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ isMenuOpen, setIsMenuOpen, onShowAuth }) => {
  const { isAuthenticated, isAdmin } = useAuth();
  const [showSecurePortal, setShowSecurePortal] = useState(false);
  const [showManageBooking, setShowManageBooking] = useState(false);
  return (
    <motion.header 
      className="text-white sticky top-0 z-50"
      style={{ backgroundColor: 'rgba(192, 54, 24, 0.9)' }}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="w-full px-0">
        <div className="flex items-center h-16">
          {/* Logo - aligned to the very left */}
          <motion.div 
            className="flex items-center h-full ml-0 mr-4"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 400 }}
          >
            <ImageWithFallback 
              src={logoImage} 
              alt="Karis Continental Logo" 
              className="h-full py-0.5 pl-4"
            />
          </motion.div>

          {/* Navigation and User buttons - all aligned to the right */}
          <div className="hidden md:flex items-center space-x-8 ml-auto mr-4">
            <motion.button 
              onClick={() => {
                const searchSection = document.querySelector('[data-search-form]') || 
                                     document.getElementById('search-form') ||
                                     document.querySelector('.search-form') ||
                                     document.querySelector('section');
                searchSection?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="hover:text-orange-200 transition-colors"
              whileHover={{ y: -2 }}
            >
              Organisez votre voyage
            </motion.button>
            <motion.button 
              onClick={() => {
                const featuresSection = document.querySelector('#features') ||
                                       document.querySelector('[data-features]') ||
                                       document.querySelectorAll('section')[1];
                featuresSection?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="hover:text-orange-200 transition-colors"
              whileHover={{ y: -2 }}
            >
              Services
            </motion.button>
            <motion.button 
              onClick={() => setShowManageBooking(true)}
              className="hover:text-orange-200 transition-colors text-left"
              whileHover={{ y: -2 }}
            >
              Gérer ma réservation
            </motion.button>
            <motion.button 
              onClick={() => {
                const tripsSection = document.getElementById('available-trips') ||
                                    document.querySelector('[data-trips]') ||
                                    document.querySelectorAll('section')[4];
                tripsSection?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="hover:text-orange-200 transition-colors"
              whileHover={{ y: -2 }}
            >
              Suivez votre trajet
            </motion.button>
            <motion.button 
              onClick={() => {
                const footerSection = document.querySelector('footer') ||
                                     document.querySelectorAll('section')[6];
                footerSection?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="hover:text-orange-200 transition-colors"
              whileHover={{ y: -2 }}
            >
              Aide
            </motion.button>
            
            {/* Separator */}
            <div className="h-6 w-px bg-orange-300 opacity-60"></div>
            
            {/* Authentication button */}
            <motion.button 
              className="group flex items-center space-x-2 px-4 py-2 rounded-lg border border-white border-opacity-40 hover:border-opacity-60 transition-all hover:bg-white hover:bg-opacity-10"
              whileHover={{ scale: 1.05 }}
              onClick={() => onShowAuth && onShowAuth()}
            >
              <Shield className="w-4 h-4 text-white group-hover:text-gray-900 transition-colors duration-200" />
              <span className="text-white font-medium group-hover:text-gray-900 transition-colors duration-200">Connexion</span>
            </motion.button>
          </div>

          {/* Mobile Menu Button - aligned to the right */}
          <motion.button
            className="md:hidden ml-auto mr-4"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            whileTap={{ scale: 0.95 }}
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </motion.button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <motion.div 
            className="md:hidden py-4 border-t border-orange-400"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            <div className="flex flex-col space-y-4">
              <button 
                onClick={() => {
                  const searchSection = document.querySelector('[data-search-form]') || 
                                       document.getElementById('search-form') ||
                                       document.querySelector('.search-form') ||
                                       document.querySelector('section');
                  searchSection?.scrollIntoView({ behavior: 'smooth' });
                  setIsMenuOpen(false);
                }}
                className="hover:text-orange-200 transition-colors text-left"
              >
                Organisez votre voyage
              </button>
              <button 
                onClick={() => {
                  const featuresSection = document.querySelector('#features') ||
                                         document.querySelector('[data-features]') ||
                                         document.querySelectorAll('section')[1];
                  featuresSection?.scrollIntoView({ behavior: 'smooth' });
                  setIsMenuOpen(false);
                }}
                className="hover:text-orange-200 transition-colors text-left"
              >
                Services
              </button>
              <button 
                onClick={() => setShowManageBooking(true)}
                className="hover:text-orange-200 transition-colors text-left"
              >
                Gérer ma réservation
              </button>
              <button 
                onClick={() => {
                  const tripsSection = document.getElementById('available-trips') ||
                                      document.querySelector('[data-trips]') ||
                                      document.querySelectorAll('section')[4];
                  tripsSection?.scrollIntoView({ behavior: 'smooth' });
                  setIsMenuOpen(false);
                }}
                className="hover:text-orange-200 transition-colors text-left"
              >
                Suivez votre trajet
              </button>
              <button 
                onClick={() => {
                  const footerSection = document.querySelector('footer') ||
                                       document.querySelectorAll('section')[6];
                  footerSection?.scrollIntoView({ behavior: 'smooth' });
                  setIsMenuOpen(false);
                }}
                className="hover:text-orange-200 transition-colors text-left"
              >
                Aide
              </button>
              <div className="flex items-center space-x-4 pt-4 border-t border-orange-400">
                <button 
                  className="flex items-center space-x-2 px-4 py-2 rounded-lg border border-white border-opacity-40 hover:border-opacity-60 transition-all"
                  onClick={() => {
                    if (onShowAuth) onShowAuth();
                    setIsMenuOpen(false);
                  }}
                >
                  <Shield className="w-4 h-4 text-white" />
                  <span className="text-white font-medium">Connexion</span>
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Modals */}
      <LoginPortalManager
        isPortalOpen={showSecurePortal}
        onClosePortal={() => setShowSecurePortal(false)}
      />

      <ManageBookingModal
        isOpen={showManageBooking}
        onClose={() => setShowManageBooking(false)}
      />
    </motion.header>
  );
};