import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Bus, MapPin, ArrowRight, Clock, Loader2, Wifi, WifiOff } from 'lucide-react';
import { usePublicData } from './contexts/PublicDataContext';
import { useAdminContent } from './contexts/AdminContentProvider';
import { toast } from 'sonner';

// Interface pour compatibilité avec les données dynamiques
interface DestinationCardDisplayData {
  id: string;
  name: string;
  description: string;
  lines: number;
  price: string;
  destinations: string[];
  icon: React.ReactNode;
  isActive?: boolean;
  featured?: boolean;
  lastUpdated?: Date;
}

// Composant d'icône générique basé sur le nom de la ville
const CityIcon: React.FC<{ cityName: string; isActive?: boolean }> = ({ cityName, isActive = true }) => {
  const getIconColor = () => {
    if (!isActive) return 'text-gray-400';
    
    const colorMap: Record<string, string> = {
      'Libreville': 'text-red-500',
      'Port-Gentil': 'text-indigo-600',
      'Oyem': 'text-green-600',
      'Franceville': 'text-purple-600',
      'Moanda': 'text-amber-700',
      'Lambaréné': 'text-cyan-500'
    };
    return colorMap[cityName] || 'text-blue-500';
  };

  return (
    <div className="w-12 h-12 flex items-center justify-center">
      <svg viewBox="0 0 24 24" className={`w-8 h-8 ${getIconColor()}`}>
        <path fill="currentColor" d="M12 2l8 8-8 8V2z"/>
        <path fill="currentColor" d="M4 2v18l8-8-8-8z"/>
      </svg>
      {!isActive && (
        <div className="absolute inset-0 bg-gray-200 bg-opacity-50 rounded-full flex items-center justify-center">
          <Clock className="w-4 h-4 text-gray-500" />
        </div>
      )}
    </div>
  );
};

// Composant de statut de connexion en temps réel
const RealtimeStatus: React.FC<{ isConnected: boolean; lastUpdate?: Date | null }> = ({ isConnected, lastUpdate }) => {
  return (
    <div className="flex items-center space-x-1 text-xs text-gray-500 mb-2">
      {isConnected ? (
        <Wifi className="w-3 h-3 text-green-500" />
      ) : (
        <WifiOff className="w-3 h-3 text-red-500" />
      )}
      <span>
        {lastUpdate ? 
          `Mis à jour ${lastUpdate.toLocaleTimeString('fr-FR')}` : 
          'En attente de mise à jour...'
        }
      </span>
    </div>
  );
};

export const DestinationCards: React.FC = () => {
  const { 
    cityCards, 
    isLoading, 
    lastUpdated, 
    refreshPublicData,
    getCityStatus,
    destinations 
  } = usePublicData();
  
  // Utiliser les données de l'administrateur pour la synchronisation
  const { 
    getPublishedRoutes, 
    getPublishedContent, 
    getAvailableDestinations 
  } = useAdminContent();
  
  const [displayData, setDisplayData] = useState<DestinationCardDisplayData[]>([]);
  const [isConnected, setIsConnected] = useState(true);

  // Transformation des données du contexte vers le format d'affichage
  useEffect(() => {
    // API: getCityCardsForPublicDisplay() - Synchronisé avec AdminContentProvider
    console.log('📤 API Call: getCityCardsForPublicDisplay (Admin Sync)');
    
    // Obtenir les trajets publiés par l'administrateur
    const publishedRoutes = getPublishedRoutes();
    const adminContent = getPublishedContent();
    
    // Créer un mapping des destinations depuis les trajets administrateur
    const destinationMap = new Map<string, {
      routeCount: number;
      minPrice: number;
      destinations: Set<string>;
    }>();
    
    publishedRoutes.forEach(route => {
      if (!destinationMap.has(route.arrival)) {
        destinationMap.set(route.arrival, {
          routeCount: 0,
          minPrice: route.price,
          destinations: new Set()
        });
      }
      
      const dest = destinationMap.get(route.arrival)!;
      dest.routeCount += 1;
      dest.minPrice = Math.min(dest.minPrice, route.price);
      dest.destinations.add(route.departure);
    });
    
    // Transformer en format d'affichage
    const transformedData: DestinationCardDisplayData[] = Array.from(destinationMap.entries())
      .map(([cityName, data], index) => {
        // Chercher dans les données existantes pour compatibilité
        const existingCity = cityCards.find(city => city.name === cityName);
        
        return {
          id: existingCity?.id || `admin-${index}`,
          name: cityName,
          description: existingCity?.description || `Destination vers ${cityName}`,
          lines: data.routeCount,
          price: `dès ${data.minPrice.toLocaleString()} F`,
          destinations: Array.from(data.destinations),
          icon: <CityIcon cityName={cityName} isActive={true} />,
          isActive: true, // Les trajets publiés sont toujours actifs
          featured: existingCity?.featured || false,
          lastUpdated: new Date()
        };
      })
      .sort((a, b) => {
        // Les destinations vedettes en premier
        if (a.featured && !b.featured) return -1;
        if (!a.featured && b.featured) return 1;
        return a.name.localeCompare(b.name);
      });

    // Fallback vers les données existantes si pas de contenu admin
    const finalData = transformedData.length > 0 ? transformedData : 
      cityCards
        .filter(city => city.isActive)
        .map(city => ({
          id: city.id,
          name: city.name,
          description: city.description,
          lines: city.routeCount,
          price: `dès ${city.minPrice.toLocaleString()} F`,
          destinations: city.destinations,
          icon: <CityIcon cityName={city.name} isActive={getCityStatus(city.name)} />,
          isActive: getCityStatus(city.name),
          featured: city.featured,
          lastUpdated: lastUpdated
        }))
        .sort((a, b) => {
          if (a.featured && !b.featured) return -1;
          if (!a.featured && b.featured) return 1;
          return a.name.localeCompare(b.name);
        });

    // Destinations de fallback pour garantir 4 cartes minimum
    const fallbackDestinations = [
      {
        id: 'fallback-mouila',
        name: 'Mouila',
        description: 'Capitale de la province de Ngounié, porte d\'entrée vers le sud',
        lines: 6,
        price: 'dès 12 500 F',
        destinations: ['Libreville', 'Lambaréné'],
        icon: <CityIcon cityName="Mouila" isActive={true} />,
        isActive: true,
        featured: false,
        lastUpdated: new Date()
      },
      {
        id: 'fallback-libreville',
        name: 'Libreville',
        description: 'Capitale économique et administrative du Gabon',
        lines: 15,
        price: 'dès 8 500 F',
        destinations: ['Port-Gentil', 'Oyem', 'Franceville'],
        icon: <CityIcon cityName="Libreville" isActive={true} />,
        isActive: true,
        featured: true,
        lastUpdated: new Date()
      }
    ];

    // Compléter avec les destinations de fallback si moins de 4
    let completeData = [...finalData];
    const existingNames = new Set(finalData.map(d => d.name));
    
    for (const fallback of fallbackDestinations) {
      if (completeData.length >= 4) break;
      if (!existingNames.has(fallback.name)) {
        completeData.push(fallback);
        existingNames.add(fallback.name);
      }
    }

    setDisplayData(completeData);
    console.log('📥 API Response: city cards synchronized with admin data:', completeData.length);
  }, [cityCards, lastUpdated, getCityStatus, getPublishedRoutes, getPublishedContent]);

  // Simulation de la connectivité temps réel
  useEffect(() => {
    const checkConnection = () => {
      setIsConnected(navigator.onLine);
    };

    window.addEventListener('online', checkConnection);
    window.addEventListener('offline', checkConnection);
    
    return () => {
      window.removeEventListener('online', checkConnection);
      window.removeEventListener('offline', checkConnection);
    };
  }, []);

  // Gestion du clic sur "Voir les horaires"
  const handleViewSchedules = async (cityName: string, cityId: string) => {
    // API: getSchedulesForCity({ cityId, cityName })
    console.log('📤 API Call: getSchedulesForCity', { cityId, cityName });
    
    try {
      // Simulation d'un appel API
      await new Promise(resolve => setTimeout(resolve, 500));
      
      toast.success(`Horaires de ${cityName} chargés avec succès`);
      console.log('📥 API Response: schedules loaded for', cityName);
      
      // Ici, vous pourriez naviguer vers une page de détails ou ouvrir un modal
      // Par exemple: router.push(`/schedules/${cityId}`);
      
    } catch (error) {
      toast.error(`Erreur lors du chargement des horaires de ${cityName}`);
      console.error('❌ Erreur lors du chargement des horaires:', error);
    }
  };

  // Gestion du rafraîchissement manuel
  const handleRefresh = async () => {
    // API: refreshCityCardsData()
    console.log('📤 API Call: refreshCityCardsData');
    
    try {
      await refreshPublicData();
      toast.success('Données actualisées avec succès');
    } catch (error) {
      toast.error('Erreur lors de l\'actualisation');
    }
  };

  if (isLoading) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-red-600 mr-3" />
            <span className="text-gray-600">Chargement des destinations...</span>
          </div>
        </div>
      </section>
    );
  }

  if (displayData.length === 0) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-6xl mx-auto"
          >
            {/* Header */}
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl mb-4">Destinations populaires</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Découvrez nos destinations les plus prisées à travers le Gabon
              </p>
            </div>

            {destinations && destinations.filter(dest => dest.isAvailable).length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {(() => {
                  const availableDestinations = destinations.filter(dest => dest.isAvailable);
                  
                  // Destinations supplémentaires pour compléter jusqu'à 4
                  const additionalDestinations = [
                    {
                      id: 'dest-libreville-main',
                      cityName: 'Libreville',
                      province: 'Estuaire',
                      isAvailable: true,
                      dailyProgram: true,
                      price: 8500,
                      lines: 15,
                      image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96',
                      description: 'Capitale économique et administrative du Gabon',
                      popularity: 95
                    },
                    {
                      id: 'dest-koulamoutou',
                      cityName: 'Koulamoutou',
                      province: 'Ogooué-Lolo',
                      isAvailable: true,
                      dailyProgram: true,
                      price: 16500,
                      lines: 5,
                      image: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957',
                      description: 'Capitale de la province d\'Ogooué-Lolo, centre commercial de la région',
                      popularity: 85
                    },
                    {
                      id: 'dest-lambarene',
                      cityName: 'Lambaréné',
                      province: 'Moyen-Ogooué',
                      isAvailable: true,
                      dailyProgram: true,
                      price: 12000,
                      lines: 8,
                      image: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800',
                      description: 'Ville historique sur les rives de l\'Ogooué, célèbre pour l\'hôpital Albert Schweitzer',
                      popularity: 80
                    },
                    {
                      id: 'dest-moanda',
                      cityName: 'Moanda',
                      province: 'Haut-Ogooué',
                      isAvailable: true,
                      dailyProgram: true,
                      price: 18000,
                      lines: 4,
                      image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4',
                      description: 'Centre minier du Gabon, ville moderne en pleine expansion',
                      popularity: 75
                    }
                  ];
                  
                  // Combiner les destinations disponibles avec les destinations supplémentaires
                  let displayDestinations = [...availableDestinations];
                  
                  // Ajouter des destinations supplémentaires si nécessaire pour atteindre 4
                  for (const additionalDest of additionalDestinations) {
                    if (displayDestinations.length >= 4) break;
                    // Vérifier si cette destination n'est pas déjà présente
                    const exists = displayDestinations.some(dest => dest.cityName === additionalDest.cityName);
                    if (!exists) {
                      displayDestinations.push(additionalDest);
                    }
                  }
                  
                  // Limiter à exactement 4 destinations
                  displayDestinations = displayDestinations.slice(0, 4);
                  
                  return displayDestinations.map((destination, index) => (
                  <motion.div
                    key={destination.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
                  >
                    <div className="relative h-48">
                      <img
                        src={destination.image}
                        alt={destination.cityName}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                      <div className="absolute bottom-4 left-4 text-white">
                        <h3 className="text-xl mb-1">{destination.cityName}</h3>
                        <div className="flex items-center space-x-1">
                          <MapPin className="w-4 h-4" />
                          <span className="text-sm">{destination.province}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="p-6">
                      <p className="text-gray-600 mb-4 text-sm">
                        {destination.description}
                      </p>
                      
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <div className="flex items-center space-x-1">
                            <Bus className="w-4 h-4" />
                            <span>{destination.lines} trajets</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <MapPin className="w-4 h-4" />
                            <span>{destination.province}</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm text-gray-500">À partir de</div>
                          <div className="text-lg" style={{ color: '#C03618' }}>
                            {destination.price.toLocaleString()} F
                          </div>
                        </div>
                      </div>
                      
                      <motion.button
                        className="w-full text-white py-2 rounded-lg flex items-center justify-center space-x-2 transition-colors"
                        style={{ backgroundColor: '#C03618' }}
                        whileHover={{ backgroundColor: 'rgba(192, 54, 24, 0.9)' }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => {
                          // Pré-remplir le formulaire avec cette destination
                          const heroSection = document.querySelector('main');
                          if (heroSection) {
                            heroSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                          }
                        }}
                      >
                        <span>Réserver</span>
                        <ArrowRight className="w-4 h-4" />
                      </motion.button>
                    </div>
                  </motion.div>
                  ));
                })()}
              </div>
            ) : (
              <div className="text-center py-12">
                <MapPin className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl text-gray-600 mb-2">Aucune destination disponible</h3>
                <p className="text-gray-500 mb-6">
                  L'administrateur n'a pas encore activé de trajets pour ces destinations. Consultez l'espace administrateur → Trajets pour publier des destinations.
                </p>
                <motion.button
                  onClick={handleRefresh}
                  disabled={isLoading}
                  className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center space-x-2 mx-auto"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {isLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <span>Actualiser</span>
                  )}
                </motion.button>
              </div>
            )}
          </motion.div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-6 lg:px-8">
        {/* En-tête avec statut temps réel */}
        <div className="text-center mb-12">
          <RealtimeStatus isConnected={isConnected} lastUpdate={lastUpdated} />
          <div className="text-sm text-gray-500">
            {displayData.length} destination{displayData.length > 1 ? 's' : ''} disponible{displayData.length > 1 ? 's' : ''}
          </div>
        </div>

        {/* Grille des cartes de destinations */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          {displayData.map((destination, index) => (
            <motion.div
              key={destination.id}
              className={`bg-white rounded-lg shadow-md overflow-hidden border-2 transition-all duration-300 ${
                destination.featured 
                  ? 'border-red-200 shadow-lg ring-1 ring-red-100' 
                  : destination.isActive 
                    ? 'border-gray-200 hover:border-red-200' 
                    : 'border-gray-100 opacity-75'
              }`}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ 
                y: destination.isActive ? -5 : 0, 
                boxShadow: destination.isActive ? '0 10px 25px rgba(0,0,0,0.1)' : undefined 
              }}
            >
              {/* Badge pour destination vedette */}
              {destination.featured && (
                <div className="bg-red-600 text-white text-xs px-3 py-1 text-center">
                  ⭐ Destination vedette
                </div>
              )}

              {/* En-tête avec icône et nom */}
              <div className="p-8 text-center">
                <div className="flex justify-center mb-4 relative">
                  {destination.icon}
                  {!destination.isActive && (
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-gray-400 rounded-full flex items-center justify-center">
                      <Clock className="w-2 h-2 text-white" />
                    </div>
                  )}
                </div>
                
                <h3 className={`text-xl mb-2 ${destination.isActive ? 'text-gray-800' : 'text-gray-500'}`}>
                  {destination.name}
                  {!destination.isActive && <span className="text-sm ml-2">(Indisponible)</span>}
                </h3>
                
                <p className={`text-sm mb-4 ${destination.isActive ? 'text-gray-600' : 'text-gray-400'}`}>
                  {destination.description}
                </p>
                
                {/* Informations lignes et prix */}
                <div className="flex items-center justify-center space-x-4 mb-6">
                  <div className={`flex items-center space-x-1 ${destination.isActive ? 'text-gray-600' : 'text-gray-400'}`}>
                    <Bus className="w-4 h-4" />
                    <span className="text-sm">{destination.lines} lignes</span>
                  </div>
                  <div className={`flex items-center space-x-1 ${destination.isActive ? 'text-gray-600' : 'text-gray-400'}`}>
                    <MapPin className="w-4 h-4" />
                    <span className="text-sm">{destination.price}</span>
                  </div>
                </div>
              </div>

              {/* Section destinations populaires */}
              <div className="px-6 pb-6">
                <div className="text-center mb-4">
                  <span className="text-xs text-gray-500 tracking-wide uppercase">
                    Destinations populaires
                  </span>
                </div>
                
                <div className="flex flex-wrap justify-center gap-2 mb-6">
                  {destination.destinations.map((dest, destIndex) => (
                    <span
                      key={destIndex}
                      className={`px-3 py-1 rounded-full text-sm ${
                        destination.isActive 
                          ? 'bg-gray-100 text-gray-700' 
                          : 'bg-gray-50 text-gray-400'
                      }`}
                    >
                      {dest}
                    </span>
                  ))}
                </div>

                {/* Bouton */}
                <motion.button
                  className={`w-full py-3 rounded-lg transition-all flex items-center justify-center space-x-2 ${
                    destination.isActive
                      ? 'text-white hover:opacity-90'
                      : 'text-gray-400 bg-gray-100 cursor-not-allowed'
                  }`}
                  style={{ 
                    backgroundColor: destination.isActive ? '#C03618' : undefined 
                  }}
                  onClick={() => destination.isActive && handleViewSchedules(destination.name, destination.id)}
                  disabled={!destination.isActive}
                  whileHover={{ 
                    scale: destination.isActive ? 1.02 : 1,
                    backgroundColor: destination.isActive ? 'rgba(192, 54, 24, 0.9)' : undefined
                  }}
                  whileTap={{ scale: destination.isActive ? 0.98 : 1 }}
                >
                  <span>
                    {destination.isActive ? 'Voir les horaires' : 'Bientôt disponible'}
                  </span>
                  {destination.isActive && <ArrowRight className="w-4 h-4" />}
                </motion.button>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Bouton de rafraîchissement */}
        <div className="text-center mt-8">
          <motion.button
            onClick={handleRefresh}
            className="text-gray-600 hover:text-red-600 text-sm flex items-center justify-center space-x-2 mx-auto"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Clock className="w-4 h-4" />
            <span>Actualiser les données</span>
          </motion.button>
        </div>
      </div>
    </section>
  );
};