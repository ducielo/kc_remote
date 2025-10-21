import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MapPin, Clock, CheckCircle, XCircle, Loader2, Wifi } from 'lucide-react';
import { usePublicData } from './contexts/PublicDataContext';
import { toast } from 'sonner';

// Interface pour les destinations avec statut
interface DestinationWithStatus {
  name: string;
  province?: string;
  isAvailable: boolean;
  dailyProgram: boolean;
  href: string;
  priority: number;
}

// Mapping des provinces du Gabon
const provinceMapping: Record<string, string> = {
  'Libreville': 'Estuaire',
  'Port-Gentil': 'Ogooué-Maritime',
  'Franceville': 'Haut-Ogooué',
  'Oyem': 'Woleu-Ntem',
  'Moanda': 'Haut-Ogooué',
  'Lambaréné': 'Moyen-Ogooué',
  'Tchibanga': 'Nyanga',
  'Koulamoutou': 'Ogooué-Lolo',
  'Bitam': 'Woleu-Ntem',
  'Gamba': 'Ogooué-Maritime',
  'Makokou': 'Ogooué-Ivindo',
  'Mouila': 'Ngounié'
};

export const PopularDestinations: React.FC = () => {
  const { 
    destinations, 
    getCityStatus, 
    isLoading, 
    lastUpdated,
    refreshPublicData 
  } = usePublicData();
  
  const [activeTab, setActiveTab] = useState<'villes' | 'provinces'>('villes');
  const [displayDestinations, setDisplayDestinations] = useState<DestinationWithStatus[]>([]);
  const [provinceStats, setProvinceStats] = useState<Record<string, { available: number; total: number }>>({});

  // Mise à jour des destinations basées sur les données du contexte
  useEffect(() => {
    // API: getPopularDestinationsWithStatus()
    console.log('📤 API Call: getPopularDestinationsWithStatus');

    if (activeTab === 'villes') {
      // Transformation des données pour les villes
      const cityDestinations: DestinationWithStatus[] = destinations
        .map(dest => ({
          name: dest.cityName,
          province: dest.province,
          isAvailable: dest.isAvailable,
          dailyProgram: dest.dailyProgram,
          href: `#search-${dest.cityName.toLowerCase()}`,
          priority: dest.popularity
        }))
        .sort((a, b) => {
          // Trier par: disponible d'abord, puis par popularité
          if (a.isAvailable && !b.isAvailable) return -1;
          if (!a.isAvailable && b.isAvailable) return 1;
          return b.priority - a.priority;
        });

      setDisplayDestinations(cityDestinations);
      console.log('📥 API Response: city destinations loaded:', cityDestinations.length);

    } else {
      // Transformation des données pour les provinces
      const provinces = Array.from(new Set(destinations.map(d => d.province)));
      const provinceDestinations: DestinationWithStatus[] = provinces.map(province => {
        const citiesInProvince = destinations.filter(d => d.province === province);
        const availableCities = citiesInProvince.filter(d => d.isAvailable);
        const avgPopularity = citiesInProvince.reduce((sum, city) => sum + city.popularity, 0) / citiesInProvince.length;
        
        return {
          name: province,
          isAvailable: availableCities.length > 0,
          dailyProgram: availableCities.some(city => city.dailyProgram),
          href: `#province-${province.toLowerCase()}`,
          priority: avgPopularity
        };
      }).sort((a, b) => {
        if (a.isAvailable && !b.isAvailable) return -1;
        if (!a.isAvailable && b.isAvailable) return 1;
        return b.priority - a.priority;
      });

      setDisplayDestinations(provinceDestinations);

      // Calcul des statistiques par province
      const stats: Record<string, { available: number; total: number }> = {};
      provinces.forEach(province => {
        const citiesInProvince = destinations.filter(d => d.province === province);
        const availableCities = citiesInProvince.filter(d => d.isAvailable);
        stats[province] = {
          available: availableCities.length,
          total: citiesInProvince.length
        };
      });
      setProvinceStats(stats);

      console.log('📥 API Response: province destinations loaded:', provinceDestinations.length);
    }
  }, [destinations, activeTab]);

  // Gestion du clic sur une destination
  const handleDestinationClick = async (destination: DestinationWithStatus) => {
    if (!destination.isAvailable) {
      toast.info(`${destination.name} n'est pas disponible actuellement`, {
        description: 'Cette destination sera bientôt disponible'
      });
      return;
    }

    // API: selectDestination({ destinationName, type })
    console.log('📤 API Call: selectDestination', { 
      destinationName: destination.name, 
      type: activeTab 
    });

    try {
      // Simulation d'un appel API
      await new Promise(resolve => setTimeout(resolve, 300));
      
      toast.success(`${destination.name} sélectionnée`, {
        description: destination.dailyProgram ? 'Programme journalier disponible' : 'Voyages sur réservation'
      });

      // Scroll vers la barre de recherche et pré-remplir
      const searchSection = document.querySelector('[data-search-form]');
      if (searchSection) {
        searchSection.scrollIntoView({ behavior: 'smooth' });
        
        // Trigger pour pré-remplir la destination dans le formulaire de recherche
        const event = new CustomEvent('destination-selected', {
          detail: { destination: destination.name, available: destination.isAvailable }
        });
        window.dispatchEvent(event);
      }

      console.log('📥 API Response: destination selected successfully');

    } catch (error) {
      toast.error('Erreur lors de la sélection');
      console.error('❌ Erreur de sélection:', error);
    }
  };

  // Composant d'icône de statut
  const StatusIcon: React.FC<{ destination: DestinationWithStatus }> = ({ destination }) => {
    if (destination.isAvailable) {
      return destination.dailyProgram ? (
        <CheckCircle className="w-4 h-4 text-green-500" />
      ) : (
        <Clock className="w-4 h-4 text-orange-500" />
      );
    }
    return <XCircle className="w-4 h-4 text-red-400" />;
  };

  // Calcul des statistiques globales
  const totalDestinations = displayDestinations.length;
  const availableDestinations = displayDestinations.filter(d => d.isAvailable).length;
  const dailyProgramDestinations = displayDestinations.filter(d => d.dailyProgram).length;

  if (isLoading) {
    return (
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-red-600 mr-3" />
            <span className="text-gray-600">Chargement des destinations...</span>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl md:text-4xl text-gray-800 mb-4">
            Destinations populaires au Gabon
          </h2>
          
          {/* Statistiques en temps réel */}
          <div className="flex items-center justify-center space-x-6 mb-8 text-sm text-gray-600">
            <div className="flex items-center space-x-1">
              <Wifi className="w-4 h-4 text-green-500" />
              <span>Temps réel</span>
            </div>
            <div className="flex items-center space-x-1">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span>{availableDestinations} disponibles</span>
            </div>
            <div className="flex items-center space-x-1">
              <Clock className="w-4 h-4 text-orange-500" />
              <span>{dailyProgramDestinations} programmes journaliers</span>
            </div>
          </div>
          
          {/* Tab Navigation */}
          <div className="flex justify-center">
            <div className="inline-flex bg-gray-100 rounded-lg p-1">
              <motion.button
                onClick={() => setActiveTab('villes')}
                className={`px-6 py-2 rounded-md transition-all ${
                  activeTab === 'villes'
                    ? 'bg-white text-[#B94B30] shadow-sm'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Villes ({destinations.length})
              </motion.button>
              <motion.button
                onClick={() => setActiveTab('provinces')}
                className={`px-6 py-2 rounded-md transition-all ${
                  activeTab === 'provinces'
                    ? 'bg-white text-[#B94B30] shadow-sm'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Provinces (9)
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* Destinations Grid */}
        <AnimatePresence mode="wait">
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4"
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
          >
            {displayDestinations.map((destination, index) => (
              <motion.button
                key={destination.name}
                onClick={() => handleDestinationClick(destination)}
                className={`group relative p-4 text-left rounded-lg border-2 transition-all duration-300 ${
                  destination.isAvailable
                    ? 'border-gray-200 hover:border-red-300 hover:bg-red-50 cursor-pointer'
                    : 'border-gray-100 bg-gray-50 cursor-not-allowed opacity-60'
                }`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                whileHover={{ 
                  scale: destination.isAvailable ? 1.02 : 1, 
                  y: destination.isAvailable ? -2 : 0 
                }}
                whileTap={{ scale: destination.isAvailable ? 0.98 : 1 }}
              >
                {/* Badge de statut */}
                <div className="absolute top-2 right-2">
                  <StatusIcon destination={destination} />
                </div>

                {/* Nom de la destination */}
                <div className="mb-2">
                  <h3 className={`font-medium ${
                    destination.isAvailable ? 'text-gray-800 group-hover:text-red-600' : 'text-gray-500'
                  }`}>
                    {destination.name}
                  </h3>
                  
                  {/* Informations additionnelles pour les villes */}
                  {activeTab === 'villes' && destination.province && (
                    <p className="text-xs text-gray-500 mt-1">
                      {destination.province}
                    </p>
                  )}
                  
                  {/* Statistiques pour les provinces */}
                  {activeTab === 'provinces' && provinceStats[destination.name] && (
                    <p className="text-xs text-gray-500 mt-1">
                      {provinceStats[destination.name].available} / {provinceStats[destination.name].total} villes
                    </p>
                  )}
                </div>

                {/* Indicateurs de statut */}
                <div className="flex items-center space-x-2 text-xs">
                  {destination.isAvailable ? (
                    <>
                      <span className="flex items-center space-x-1 text-green-600">
                        <CheckCircle className="w-3 h-3" />
                        <span>Disponible</span>
                      </span>
                      {destination.dailyProgram && (
                        <span className="flex items-center space-x-1 text-orange-600">
                          <Clock className="w-3 h-3" />
                          <span>Journalier</span>
                        </span>
                      )}
                    </>
                  ) : (
                    <span className="flex items-center space-x-1 text-red-400">
                      <XCircle className="w-3 h-3" />
                      <span>Indisponible</span>
                    </span>
                  )}
                </div>

                {/* Effet de hover pour les destinations disponibles */}
                {destination.isAvailable && (
                  <div className="absolute inset-0 border-2 border-transparent group-hover:border-red-300 rounded-lg transition-colors pointer-events-none" />
                )}
              </motion.button>
            ))}
          </motion.div>
        </AnimatePresence>

        {/* Légende */}
        <motion.div 
          className="mt-8 text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <div className="inline-flex items-center space-x-6 text-sm text-gray-600 bg-gray-50 px-6 py-3 rounded-lg">
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span>Disponible maintenant</span>
            </div>
            <div className="flex items-center space-x-2">
              <Clock className="w-4 h-4 text-orange-500" />
              <span>Programme journalier</span>
            </div>
            <div className="flex items-center space-x-2">
              <XCircle className="w-4 h-4 text-red-400" />
              <span>Temporairement indisponible</span>
            </div>
          </div>
        </motion.div>

        {/* Dernière mise à jour */}
        {lastUpdated && (
          <div className="text-center mt-4">
            <p className="text-xs text-gray-500">
              Dernière mise à jour: {lastUpdated.toLocaleString('fr-FR')}
            </p>
          </div>
        )}
      </div>
    </section>
  );
};