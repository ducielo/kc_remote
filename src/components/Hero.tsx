import React from 'react';
import { motion } from 'motion/react';
import { SearchForm } from './SearchForm';
import heroImage from '/src/assets/66b5f50a4137f28f129e0271d950e6ae57b5efc3.png';

interface HeroProps {
  onSearch?: (searchData: { departure: string; arrival: string; date: string; passengers: number }) => void;
}

export const Hero: React.FC<HeroProps> = ({ onSearch }) => {
  return (
    <section className="relative min-h-[400px] flex items-center justify-center">
      {/* Background */}
      <div 
        className="absolute inset-0"
        style={{ 
          backgroundImage: `url(${heroImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      />
      
      {/* Content */}
      <div className="relative z-20 container mx-auto px-4">
        {/* Title and Search Form grouped together - positioned to overlap with next section */}
        <div className="transform translate-y-[80%]">
          <div className="max-w-5xl mx-auto mb-6">
            <motion.h1 
              className="text-white text-2xl md:text-3xl lg:text-4xl text-left"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              Voyages en bus pas chers à travers le Gabon
            </motion.h1>
          </div>
          <SearchForm />
        </div>
      </div>
    </section>
  );
};