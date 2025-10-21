import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { MapPin, Clock, CheckCircle, AlertCircle, Wifi, Calendar, RefreshCw } from 'lucide-react';
import { useAdminContent } from './contexts/AdminContentProvider';
import { toast } from 'sonner';
import { Badge } from './ui/badge';
import { Button } from './ui/button';

interface DestinationStatus {
  id: string;
  cityName: string;
  province: string;
  status: 'available' | 'daily' | 'unavailable';
  routeCount: number;
  lastUpdate: Date;
}

// Mapping des provinces du Gabon
const GABON_PROVINCES = {
  'Libreville': 'Estuaire',
  'Port-Gentil': 'Ogooué-Maritime', 
  'Franceville': 'Haut-Ogooué',
  'Oyem': 'Woleu-Ntem',
  'Lambaréné': 'Moyen-Ogooué',
  'Moanda': 'Haut-Ogooué',
  'Tchibanga': 'Nyanga',
  'Mouila': 'Ngounié',
  'Makokou': 'Ogooué-Ivindo'
};

export const PopularDestinationsGabon: React.FC = () => {
  const { 
    getPublishedRoutes, 
    getPublishedSchedules,
    getPublishedContent 
  } = useAdminContent();
  
  const [destinations, setDestinations] = useState<DestinationStatus[]>([]);
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'cities' | 'provinces'>('cities');
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());
  const [availableCount, setAvailableCount] = useState(0);
  const [dailyPrograms, setDailyPrograms] = useState(0);

  // Générer les destinations depuis les données admin
  useEffect(() => {
    const publishedRoutes = getPublishedRoutes();
    const publishedSchedules = getPublishedSchedules();
    const adminContent = getPublishedContent();

    if (!adminContent) {
      // Si l'admin n'a pas publié de contenu, afficher un message
      setDestinations([]);
      return;
    }

    // Grouper les trajets par destination
    const destinationMap = new Map<string, {
      cityName: string;
      province: string;
      routeCount: number;
      hasActiveSchedules: boolean;
      hasDailySchedules: boolean;
    }>();

    publishedRoutes.forEach(route => {
      const destination = route.arrival;
      const existing = destinationMap.get(destination);
      
      // Vérifier s'il y a des horaires actifs pour cette route
      const routeSchedules = publishedSchedules.filter(schedule => 
        schedule.routeId === route.id && schedule.isActive
      );
      
      const hasActiveSchedules = routeSchedules.length > 0;
      const hasDailySchedules = routeSchedules.some(schedule => 
        schedule.times.length >= 2 // Plus de 2 horaires = programme journalier
      );

      if (existing) {
        destinationMap.set(destination, {
          ...existing,
          routeCount: existing.routeCount + 1,
          hasActiveSchedules: existing.hasActiveSchedules || hasActiveSchedules,
          hasDailySchedules: existing.hasDailySchedules || hasDailySchedules
        });
      } else {
        destinationMap.set(destination, {
          cityName: destination,
          province: GABON_PROVINCES[destination as keyof typeof GABON_PROVINCES] || 'Province inconnue',
          routeCount: 1,
          hasActiveSchedules,
          hasDailySchedules
        });
      }
    });

    // Convertir en array avec statuts
    const destinationArray: DestinationStatus[] = Array.from(destinationMap.entries()).map(([city, data], index) => {
      let status: 'available' | 'daily' | 'unavailable' = 'unavailable';
      
      if (data.hasActiveSchedules) {
        status = data.hasDailySchedules ? 'daily' : 'available';
      }

      return {
        id: `dest-${index}`,
        cityName: data.cityName,
        province: data.province,
        status,
        routeCount: data.routeCount,
        lastUpdate: new Date()
      };
    });

    setDestinations(destinationArray);
    setLastUpdate(new Date());
    
    // Calculer les statistiques
    const available = destinationArray.filter(d => d.status === 'available').length;
    const daily = destinationArray.filter(d => d.status === 'daily').length;
    setAvailableCount(available + daily);
    setDailyPrograms(daily);

    console.log('📥 Destinations générées depuis AdminContent:', destinationArray.length);
  }, [getPublishedRoutes, getPublishedSchedules, getPublishedContent]);

  const getStatusInfo = (status: 'available' | 'daily' | 'unavailable') => {
    switch (status) {
      case 'available':
        return {
          icon: <CheckCircle className="w-4 h-4" />,
          label: 'Disponible',
          bgColor: 'bg-green-50 border-green-200',
          textColor: 'text-green-700',
          badgeColor: 'bg-green-100 text-green-800'
        };
      case 'daily':
        return {
          icon: <Calendar className="w-4 h-4" />,
          label: 'Journalier',
          bgColor: 'bg-orange-50 border-orange-200',
          textColor: 'text-orange-700',
          badgeColor: 'bg-orange-100 text-orange-800'
        };
      case 'unavailable':
        return {
          icon: <AlertCircle className="w-4 h-4" />,
          label: 'Indisponible',
          bgColor: 'bg-red-50 border-red-200',
          textColor: 'text-red-700',
          badgeColor: 'bg-red-100 text-red-800'
        };
    }
  };

  const handleRefresh = async () => {
    toast.success('Données actualisées');
    setLastUpdate(new Date());
  };

  const filteredDestinations = destinations.filter(dest => {
    if (selectedFilter === 'all') return true;
    if (selectedFilter === 'cities') return true; // Toutes les villes
    if (selectedFilter === 'provinces') return true; // Toutes les provinces
    return true;
  });

  const adminContent = getPublishedContent();

  if (!adminContent) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h2 className="text-3xl md:text-4xl mb-4">Destinations populaires au Gabon</h2>
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 max-w-2xl mx-auto">
              <AlertCircle className="w-8 h-8 text-yellow-600 mx-auto mb-4" />
              <h3 className="text-lg text-yellow-800 mb-2">Contenu non publié</h3>
              <p className="text-yellow-700">
                L'administrateur n'a pas encore publié de contenu pour cette section. 
                Connectez-vous à l'espace administrateur pour configurer les destinations.
              </p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="max-w-6xl mx-auto"
        >
          {/* Header */}
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl mb-4">
              {adminContent.destinationsTitle || 'Destinations populaires au Gabon'}
            </h2>
            
            {/* Statuts temps réel */}
            <div className="flex items-center justify-center space-x-6 mb-6">
              <div className="flex items-center space-x-2 text-green-600">
                <Wifi className="w-4 h-4" />
                <span className="text-sm">Temps réel</span>
              </div>
              <div className="flex items-center space-x-2 text-green-600">
                <CheckCircle className="w-4 h-4" />
                <span className="text-sm">{availableCount} disponibles</span>
              </div>
              <div className="flex items-center space-x-2 text-orange-600">
                <Calendar className="w-4 h-4" />
                <span className="text-sm">{dailyPrograms} programmes journaliers</span>
              </div>
            </div>

            {/* Filtres */}
            <div className="flex justify-center mb-6">
              <div className="bg-white rounded-lg p-1 shadow-sm border">
                <button
                  onClick={() => {
                    setSelectedFilter('cities');
                    toast.success(`Affichage par villes - ${destinations.length} destinations`);
                  }}
                  className={`px-4 py-2 rounded-md text-sm transition-colors ${
                    selectedFilter === 'cities'
                      ? 'bg-red-100 text-red-700 border border-red-200'
                      : 'text-gray-600 hover:text-gray-800'
                  }`}
                >
                  Villes ({destinations.length})
                </button>
                <button
                  onClick={() => {
                    setSelectedFilter('provinces');
                    const provinceCount = new Set(destinations.map(d => d.province)).size;
                    toast.success(`Affichage par provinces - ${provinceCount} provinces actives`);
                  }}
                  className={`px-4 py-2 rounded-md text-sm transition-colors ${
                    selectedFilter === 'provinces'
                      ? 'bg-red-100 text-red-700 border border-red-200'
                      : 'text-gray-600 hover:text-gray-800'
                  }`}
                >
                  Provinces ({new Set(destinations.map(d => d.province)).size})
                </button>
              </div>
            </div>

            {/* Affichage conditionnel selon le filtre */}
            {selectedFilter === 'provinces' && (
              <div className="mb-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <h3 className="text-lg mb-4 text-blue-800">Vue par provinces du Gabon</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {Array.from(new Set(destinations.map(d => d.province))).map(province => {
                    const provinceCities = destinations.filter(d => d.province === province);
                    const availableInProvince = provinceCities.filter(d => d.status !== 'unavailable').length;
                    
                    return (
                      <div key={province} className="bg-white p-4 rounded-lg border">
                        <h4 className="text-red-700 mb-2">{province}</h4>
                        <div className="space-y-1 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Villes desservies:</span>
                            <span>{provinceCities.length}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Disponibles:</span>
                            <span className="text-green-600">{availableInProvince}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Total trajets:</span>
                            <span>{provinceCities.reduce((sum, city) => sum + city.routeCount, 0)}</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Grille des destinations */}
          {filteredDestinations.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {filteredDestinations.map((destination, index) => {
                const statusInfo = getStatusInfo(destination.status);
                
                return (
                  <motion.div
                    key={destination.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    className={`rounded-lg border-2 p-6 transition-all duration-300 ${statusInfo.bgColor} ${
                      destination.status !== 'unavailable' 
                        ? 'hover:shadow-lg cursor-pointer' 
                        : 'opacity-75'
                    }`}
                  >
                    {/* En-tête avec statut */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-2">
                        <div className={statusInfo.textColor}>
                          {statusInfo.icon}
                        </div>
                        <Badge className={statusInfo.badgeColor}>
                          {statusInfo.label}
                        </Badge>
                      </div>
                      {destination.status === 'daily' && (
                        <Badge variant="outline" className="text-orange-600 border-orange-300">
                          Journalier
                        </Badge>
                      )}
                    </div>

                    {/* Informations ville */}
                    <div className="mb-4">
                      <h3 className={`text-xl mb-1 ${statusInfo.textColor}`}>
                        {destination.cityName}
                      </h3>
                      <div className="flex items-center space-x-1 text-gray-600">
                        <MapPin className="w-4 h-4" />
                        <span className="text-sm">{destination.province}</span>
                      </div>
                    </div>

                    {/* Statut et détails */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Trajets actifs</span>
                        <span className={statusInfo.textColor}>
                          {destination.routeCount} ligne{destination.routeCount > 1 ? 's' : ''}
                        </span>
                      </div>
                      
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Statut</span>
                        <div className="flex items-center space-x-1">
                          <div className={statusInfo.textColor}>
                            {statusInfo.icon}
                          </div>
                          <span className={statusInfo.textColor}>
                            {statusInfo.label}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Action si disponible */}
                    {destination.status !== 'unavailable' && (
                      <div className="mt-4 pt-4 border-t border-gray-200">
                        <Button 
                          size="sm" 
                          className="w-full"
                          style={{ backgroundColor: '#C03618' }}
                          onClick={() => {
                            toast.success(`Consultation des horaires pour ${destination.cityName}`);
                          }}
                        >
                          Voir les horaires
                        </Button>
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12">
              <AlertCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl text-gray-600 mb-2">Aucune destination configurée</h3>
              <p className="text-gray-500 mb-6">
                L'administrateur n'a pas encore publié de trajets. 
                Connectez-vous à l'espace administrateur pour configurer les destinations.
              </p>
            </div>
          )}

          {/* Légende et dernière mise à jour */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
              {/* Légende */}
              <div className="flex flex-wrap items-center gap-4 text-sm">
                <div className="flex items-center space-x-1">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span className="text-gray-600">Disponible maintenant</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Calendar className="w-4 h-4 text-orange-600" />
                  <span className="text-gray-600">Programme journalier</span>
                </div>
                <div className="flex items-center space-x-1">
                  <AlertCircle className="w-4 h-4 text-red-600" />
                  <span className="text-gray-600">Temporairement indisponible</span>
                </div>
              </div>

              {/* Dernière mise à jour */}
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-500">
                  Dernière mise à jour: {lastUpdate.toLocaleString('fr-FR')}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleRefresh}
                  className="flex items-center space-x-1"
                >
                  <RefreshCw className="w-3 h-3" />
                  <span>Actualiser</span>
                </Button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};