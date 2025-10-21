import React from 'react';
import { motion } from 'motion/react';
import { ExternalLink, MapPin, Bus } from 'lucide-react';
import busPassengerImage from '/src/assets/80ee91e4f7cc521d08f7a597e385852bdb8fbcab.png';

interface DestinationCardProps {
  title: string;
  description: string;
  imageUrl: string;
  buttonText: string;
  onButtonClick?: () => void;
  price?: string;
  lines?: number;
  isAvailable?: boolean;
}

export const DestinationCard: React.FC<DestinationCardProps> = ({
  title,
  description,
  imageUrl,
  buttonText,
  onButtonClick,
  price,
  lines,
  isAvailable = true
}) => {
  return (
    <motion.div 
      className={`bg-white rounded-2xl overflow-hidden shadow-lg ${
        !isAvailable ? 'opacity-75' : ''
      }`}
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
      whileHover={{ scale: isAvailable ? 1.02 : 1 }}
    >
      {/* Badge de statut */}
      {!isAvailable && (
        <div className="absolute top-4 right-4 z-10">
          <div className="bg-red-500 text-white text-xs px-3 py-1 rounded-full">
            Indisponible
          </div>
        </div>
      )}

      {/* Image de la destination ou passager */}
      <div className="relative h-64 overflow-hidden">
        <img 
          src={busPassengerImage} 
          alt={title}
          className="w-full h-full object-cover"
        />
        
        {/* Overlay avec informations en surimpression */}
        {(price || lines) && (
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
            <div className="flex items-center space-x-4 text-white text-sm">
              {price && (
                <div className="flex items-center space-x-1">
                  <MapPin className="w-4 h-4" />
                  <span>{price}</span>
                </div>
              )}
              {lines && (
                <div className="flex items-center space-x-1">
                  <Bus className="w-4 h-4" />
                  <span>{lines} lignes</span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
      
      {/* Contenu texte */}
      <div className="p-6 bg-white">
        <h3 className={`text-2xl mb-3 ${
          isAvailable ? 'text-[#C03618]' : 'text-gray-500'
        }`}>
          {title}
        </h3>
        
        <p className={`mb-6 leading-relaxed ${
          isAvailable ? 'text-[#C03618]/90' : 'text-gray-500'
        }`}>
          {description}
        </p>

        {/* Bouton d'action */}
        <motion.button 
          onClick={onButtonClick}
          disabled={!isAvailable}
          className={`px-6 py-3 rounded-lg transition-colors flex items-center space-x-2 w-full justify-center ${
            isAvailable 
              ? 'text-white cursor-pointer' 
              : 'text-gray-400 bg-gray-200 cursor-not-allowed'
          }`}
          style={{ 
            backgroundColor: isAvailable ? '#C03618' : undefined,
          }}
          whileHover={isAvailable ? { 
            scale: 1.02,
            backgroundColor: 'rgba(192, 54, 24, 0.9)'
          } : {}}
          whileTap={isAvailable ? { scale: 0.98 } : {}}
        >
          <span>{isAvailable ? buttonText : 'Temporairement indisponible'}</span>
          <ExternalLink className="w-4 h-4" />
        </motion.button>
      </div>
    </motion.div>
  );
};