import React from 'react';
import { motion } from 'motion/react';
import { useAdminContent } from './contexts/AdminContentProvider';

const brands = [
  { name: 'KARIS CONTINENTAL', active: true },
  { name: 'GABON TRANSPORT', active: false },
  { name: 'LIBREVILLE LINES', active: false },
  { name: 'EQUATORIAL TOURS', active: false }
];

export const Statistics: React.FC = () => {
  const { getPublishedStatistics } = useAdminContent();
  
  // Obtenir les statistiques publiées par l'administrateur
  const adminStats = getPublishedStatistics();
  
  // Valeurs par défaut si pas de statistiques admin
  const stats = adminStats || {
    totalTrips: 1250,
    totalPassengers: 2000000,
    totalRevenue: 187500000,
    satisfactionRate: 94.5
  };

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        {/* Main statistic */}
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <div className="max-w-4xl mx-auto">
            <p className="text-sm md:text-base text-gray-500 uppercase tracking-wider mb-6">
              Confiance & Excellence
            </p>
            <h2 className="text-4xl md:text-5xl lg:text-6xl leading-tight text-gray-900 mb-8">
              La solution de voyage privilégiée par{' '}
              <span 
                className="bg-gradient-to-r from-red-600 to-orange-500 bg-clip-text text-transparent font-semibold"
                style={{ WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}
              >
                + de 2 millions
              </span>
              <br />
              <span className="text-gray-700">de Gabonais en 2025</span>
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-red-600 to-orange-500 mx-auto rounded-full"></div>
          </div>
        </motion.div>

        {/* Brand logos */}
        <motion.div 
          className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-5xl mx-auto"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          viewport={{ once: true }}
        >
          {brands.map((brand, index) => (
            <motion.div
              key={brand.name}
              className={`text-center py-6 px-4 rounded-xl transition-all duration-300 ${
                brand.active 
                  ? 'bg-gradient-to-br from-red-50 to-orange-50 border-2 border-red-100 shadow-lg' 
                  : 'bg-gray-50 border border-gray-200 hover:bg-gray-100'
              }`}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.02, y: -2 }}
            >
              <div 
                className={`text-lg md:text-xl font-semibold tracking-tight ${
                  brand.active 
                    ? 'text-red-600' 
                    : 'text-gray-400'
                }`}
              >
                {brand.name}
              </div>
              {brand.active && (
                <div className="mt-2 text-xs text-red-500 font-medium uppercase tracking-wider">
                  Réseau Principal
                </div>
              )}
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};