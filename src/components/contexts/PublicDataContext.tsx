import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { toast } from 'sonner';

// Types pour les données publiques
export interface CityCardData {
  id: string;
  name: string;
  description: string;
  routeCount: number;
  minPrice: number;
  destinations: string[];
  image: string;
  isActive: boolean;
  featured: boolean;
}

export interface RouteData {
  id: string;
  from: string;
  to: string;
  price: number;
  duration: string;
  isActive: boolean;
  availability: number;
  departureTime: string;
  arrivalTime: string;
}

export interface DestinationData {
  id: string;
  cityName: string;
  province: string;
  isAvailable: boolean;
  dailyProgram: boolean;
  price: number;
  lines: number;
  image: string;
  description: string;
  popularity: number;
}

export interface PublicDataState {
  // Cartes de villes pour la page d'accueil
  cityCards: CityCardData[];
  
  // Routes disponibles pour la recherche
  availableRoutes: RouteData[];
  
  // Destinations populaires
  destinations: DestinationData[];
  
  // Prochaine destination en vedette
  featuredDestination: DestinationData | null;
  
  // Villes actives/inactives
  cityAvailability: Record<string, boolean>;
  
  // État de chargement
  isLoading: boolean;
  
  // Dernière mise à jour
  lastUpdated: Date | null;
}

interface PublicDataContextType extends PublicDataState {
  // Actions de mise à jour
  updateCityCard: (cityCard: CityCardData) => void;
  updateRoute: (route: RouteData) => void;
  updateDestination: (destination: DestinationData) => void;
  setFeaturedDestination: (destination: DestinationData) => void;
  toggleCityAvailability: (cityId: string, status: boolean) => void;
  
  // Actions de recherche
  searchRoutes: (from: string, to: string, date: string, passengers: number) => RouteData[];
  getAvailableCities: () => string[];
  getCityStatus: (cityName: string) => boolean;
  
  // Synchronisation en temps réel
  syncWithAdmin: () => Promise<void>;
  refreshPublicData: () => Promise<void>;
  
  // 🔥 NEW: Fonctions pour enregistrer des callbacks d'événements
  onAgentReservationCreated: (callback: (data: any) => void) => () => void;
  onDriverLocationUpdated: (callback: (data: any) => void) => () => void;
  onDriverDelayReported: (callback: (data: any) => void) => () => void;
}

const PublicDataContext = createContext<PublicDataContextType | undefined>(undefined);

// Données mock initiales (en attendant l'intégration API)
const initialCityCards: CityCardData[] = [
  {
    id: 'lib-001',
    name: 'Libreville',
    description: 'Capitale économique du Gabon',
    routeCount: 15,
    minPrice: 8500,
    destinations: ['Port-Gentil', 'Oyem', 'Franceville'],
    image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96',
    isActive: true,
    featured: true
  },
  {
    id: 'pg-002',
    name: 'Port-Gentil',
    description: 'Capitale pétrolière',
    routeCount: 12,
    minPrice: 12000,
    destinations: ['Libreville', 'Lambaréné', 'Gamba'],
    image: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5',
    isActive: true,
    featured: false
  },
  {
    id: 'oyem-003',
    name: 'Oyem',
    description: 'Porte d\'entrée vers le Cameroun',
    routeCount: 8,
    minPrice: 15000,
    destinations: ['Libreville', 'Bitam', 'Mitzic'],
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4',
    isActive: true,
    featured: false
  },
  {
    id: 'fville-004',
    name: 'Franceville',
    description: 'Centre minier du Haut-Ogooué',
    routeCount: 10,
    minPrice: 18000,
    destinations: ['Libreville', 'Moanda', 'Koulamoutou'],
    image: 'https://images.unsplash.com/photo-1586348943529-beaae6c28db9',
    isActive: true,
    featured: false
  },
  {
    id: 'lamb-005',
    name: 'Lambaréné',
    description: 'Ville historique du Moyen-Ogooué',
    routeCount: 6,
    minPrice: 10000,
    destinations: ['Libreville', 'Port-Gentil', 'Mouila'],
    image: 'https://images.unsplash.com/photo-1547036967-23d11aacaee0',
    isActive: true,
    featured: false
  }
];

const initialRoutes: RouteData[] = [
  {
    id: 'route-001',
    from: 'Libreville',
    to: 'Port-Gentil',
    price: 12000,
    duration: '4h30',
    isActive: true,
    availability: 25,
    departureTime: '08:00',
    arrivalTime: '12:30'
  },
  {
    id: 'route-002',
    from: 'Libreville',
    to: 'Oyem',
    price: 15000,
    duration: '6h00',
    isActive: true,
    availability: 18,
    departureTime: '07:00',
    arrivalTime: '13:00'
  },
  {
    id: 'route-003',
    from: 'Libreville',
    to: 'Franceville',
    price: 18000,
    duration: '8h00',
    isActive: true,
    availability: 12,
    departureTime: '06:00',
    arrivalTime: '14:00'
  }
];

const initialDestinations: DestinationData[] = [
  {
    id: 'dest-001',
    cityName: 'Libreville',
    province: 'Estuaire',
    isAvailable: true,
    dailyProgram: true,
    price: 8500,
    lines: 15,
    image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96',
    description: 'Capitale économique et administrative',
    popularity: 95
  },
  {
    id: 'dest-002',
    cityName: 'Port-Gentil',
    province: 'Ogooué-Maritime',
    isAvailable: true,
    dailyProgram: true,
    price: 12000,
    lines: 12,
    image: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5',
    description: 'Capitale pétrolière du Gabon',
    popularity: 88
  },
  {
    id: 'dest-003',
    cityName: 'Oyem',
    province: 'Woleu-Ntem',
    isAvailable: true,
    dailyProgram: false,
    price: 15000,
    lines: 8,
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4',
    description: 'Porte d\'entrée vers le Cameroun',
    popularity: 72
  },
  {
    id: 'dest-004',
    cityName: 'Franceville',
    province: 'Haut-Ogooué',
    isAvailable: true,
    dailyProgram: false,
    price: 18000,
    lines: 10,
    image: 'https://images.unsplash.com/photo-1586348943529-beaae6c28db9',
    description: 'Centre minier important',
    popularity: 78
  },
  {
    id: 'dest-005',
    cityName: 'Lambaréné',
    province: 'Moyen-Ogooué',
    isAvailable: true,
    dailyProgram: true,
    price: 10000,
    lines: 6,
    image: 'https://images.unsplash.com/photo-1571115764595-644a1f56a55c',
    description: 'Ville historique d\'Albert Schweitzer',
    popularity: 65
  },
  {
    id: 'dest-006',
    cityName: 'Moanda',
    province: 'Haut-Ogooué',
    isAvailable: true,
    dailyProgram: true,
    price: 20000,
    lines: 3,
    image: 'https://images.unsplash.com/photo-1564516514161-2eba3a4b333c',
    description: 'Ville minière du manganèse',
    popularity: 38
  }
];

export function PublicDataProvider({ children }: { children: ReactNode }) {
  const [publicData, setPublicData] = useState<PublicDataState>({
    cityCards: initialCityCards,
    availableRoutes: initialRoutes,
    destinations: initialDestinations,
    featuredDestination: initialDestinations[0],
    cityAvailability: initialDestinations.reduce((acc, dest) => {
      acc[dest.cityName] = dest.isAvailable;
      return acc;
    }, {} as Record<string, boolean>),
    isLoading: false,
    lastUpdated: new Date()
  });

  // 🔥 NEW: Écouter les événements de synchronisation Agent → Public
  useEffect(() => {
    const handleAgentReservation = (event: CustomEvent) => {
      const { tripId, passenger } = event.detail;
      console.log('🎫 Sync reçu: Nouvelle réservation agent', { tripId, passenger });
      
      // Mettre à jour les places disponibles dans les routes
      setPublicData(prev => ({
        ...prev,
        availableRoutes: prev.availableRoutes.map(route => {
          if (route.id === tripId) {
            return { ...route, availability: route.availability - 1 };
          }
          return route;
        }),
        lastUpdated: new Date()
      }));
      
      toast.success('Places mises à jour en temps réel');
    };

    const handleDriverLocation = (event: CustomEvent) => {
      const { tripId, location } = event.detail;
      console.log('📍 Sync reçu: Position chauffeur mise à jour', { tripId, location });
      
      // Vous pouvez stocker la position dans un état local si nécessaire
      // toast.info(`Trajet ${tripId}: Position mise à jour`); // Notification désactivée
    };

    const handleDriverDelay = (event: CustomEvent) => {
      const { tripId, delayMinutes, reason } = event.detail;
      console.log('⏰ Sync reçu: Retard signalé', { tripId, delayMinutes, reason });
      
      toast.warning(`Retard de ${delayMinutes}min: ${reason}`);
    };

    // 🔥 NEW: Écouter les événements Admin → Public
    const handleAdminTripPublished = (event: CustomEvent) => {
      const { trip } = event.detail;
      console.log('📢 Sync reçu: Trajet publié par l\'admin', trip);
      
      // Ajouter le nouveau trajet dans availableRoutes
      setPublicData(prev => ({
        ...prev,
        availableRoutes: [...prev.availableRoutes, trip],
        lastUpdated: new Date()
      }));
      
      toast.success(`Nouveau trajet disponible: ${trip.from} → ${trip.to}`, {
        description: `Départ à ${trip.departureTime} - ${trip.availability} places disponibles`
      });
    };

    const handleAdminRouteUpdated = (event: CustomEvent) => {
      const { trip } = event.detail;
      console.log('🔄 Sync reçu: Trajet mis à jour par l\'admin', trip);
      
      // Mettre à jour le trajet existant
      setPublicData(prev => ({
        ...prev,
        availableRoutes: prev.availableRoutes.map(route =>
          route.id === trip.id ? trip : route
        ),
        lastUpdated: new Date()
      }));
      
      toast.info(`Trajet mis à jour: ${trip.from} → ${trip.to}`);
    };

    const handleAdminTripRemoved = (event: CustomEvent) => {
      const { tripId } = event.detail;
      console.log('🗑️ Sync reçu: Trajet retiré par l\'admin', tripId);
      
      // Retirer le trajet de la liste
      setPublicData(prev => ({
        ...prev,
        availableRoutes: prev.availableRoutes.filter(route => route.id !== tripId),
        lastUpdated: new Date()
      }));
      
      toast.info('Un trajet a été retiré');
    };

    // Écouter les événements personnalisés
    window.addEventListener('agent:reservation:created', handleAgentReservation as EventListener);
    window.addEventListener('driver:location:updated', handleDriverLocation as EventListener);
    window.addEventListener('driver:delay:reported', handleDriverDelay as EventListener);
    // 🔥 NEW: Écouter les événements admin
    window.addEventListener('admin:trip:published', handleAdminTripPublished as EventListener);
    window.addEventListener('admin:route:updated', handleAdminRouteUpdated as EventListener);
    window.addEventListener('admin:trip:removed', handleAdminTripRemoved as EventListener);

    return () => {
      window.removeEventListener('agent:reservation:created', handleAgentReservation as EventListener);
      window.removeEventListener('driver:location:updated', handleDriverLocation as EventListener);
      window.removeEventListener('driver:delay:reported', handleDriverDelay as EventListener);
      // 🔥 NEW: Nettoyer les listeners admin
      window.removeEventListener('admin:trip:published', handleAdminTripPublished as EventListener);
      window.removeEventListener('admin:route:updated', handleAdminRouteUpdated as EventListener);
      window.removeEventListener('admin:trip:removed', handleAdminTripRemoved as EventListener);
    };
  }, []);

  // Simulation de synchronisation en temps réel
  useEffect(() => {
    const interval = setInterval(() => {
      // API: syncPublicDataRealtime()
      // Simule la réception de mises à jour depuis le dashboard admin
      console.log('🔄 Synchronisation temps réel avec le dashboard admin...');
    }, 30000); // Toutes les 30 secondes

    return () => clearInterval(interval);
  }, []);

  const updateCityCard = (cityCard: CityCardData) => {
    // API: publishCityCard({ cityName, description, routes, price, destinations })
    setPublicData(prev => ({
      ...prev,
      cityCards: prev.cityCards.map(card => 
        card.id === cityCard.id ? cityCard : card
      ),
      lastUpdated: new Date()
    }));
    
    toast.success(`Carte de ${cityCard.name} mise à jour avec succès`);
    console.log('📤 API Call: publishCityCard', cityCard);
  };

  const updateRoute = (route: RouteData) => {
    // API: updateRouteAvailability({ routeId, availability, price, schedule })
    setPublicData(prev => ({
      ...prev,
      availableRoutes: prev.availableRoutes.map(r => 
        r.id === route.id ? route : r
      ),
      lastUpdated: new Date()
    }));
    
    toast.success(`Route ${route.from} → ${route.to} mise à jour`);
    console.log('📤 API Call: updateRouteAvailability', route);
  };

  const updateDestination = (destination: DestinationData) => {
    // API: updateDestinationInfo({ cityId, price, lines, availability, description })
    setPublicData(prev => ({
      ...prev,
      destinations: prev.destinations.map(dest => 
        dest.id === destination.id ? destination : dest
      ),
      cityAvailability: {
        ...prev.cityAvailability,
        [destination.cityName]: destination.isAvailable
      },
      lastUpdated: new Date()
    }));
    
    toast.success(`Destination ${destination.cityName} mise à jour`);
    console.log('📤 API Call: updateDestinationInfo', destination);
  };

  const setFeaturedDestination = (destination: DestinationData) => {
    // API: publishDestination({ city, price, lines, image })
    setPublicData(prev => ({
      ...prev,
      featuredDestination: destination,
      lastUpdated: new Date()
    }));
    
    toast.success(`${destination.cityName} définie comme destination vedette`);
    console.log('📤 API Call: publishDestination', destination);
  };

  const toggleCityAvailability = (cityId: string, status: boolean) => {
    // API: toggleCityAvailability({ cityId, status })
    const cityName = publicData.destinations.find(d => d.id === cityId)?.cityName;
    
    setPublicData(prev => ({
      ...prev,
      destinations: prev.destinations.map(dest => 
        dest.id === cityId ? { ...dest, isAvailable: status } : dest
      ),
      cityAvailability: {
        ...prev.cityAvailability,
        [cityName || '']: status
      },
      lastUpdated: new Date()
    }));
    
    toast.success(`${cityName} ${status ? 'activée' : 'désactivée'} avec succès`);
    console.log('📤 API Call: toggleCityAvailability', { cityId, status });
  };

  const searchRoutes = (from: string, to: string, date: string, passengers: number): RouteData[] => {
    // API: getAvailableRoutes({ from, to, date, passengers })
    const routes = publicData.availableRoutes.filter(route => 
      route.isActive && 
      route.from.toLowerCase() === from.toLowerCase() && 
      route.to.toLowerCase() === to.toLowerCase() &&
      route.availability >= passengers
    );
    
    console.log('📤 API Call: getAvailableRoutes', { from, to, date, passengers });
    console.log('📥 API Response: routes found:', routes.length);
    
    return routes;
  };

  const getAvailableCities = (): string[] => {
    const cities = Array.from(new Set([
      ...publicData.availableRoutes.filter(r => r.isActive).map(r => r.from),
      ...publicData.availableRoutes.filter(r => r.isActive).map(r => r.to)
    ]));
    
    console.log('📤 API Call: getAvailableCities');
    console.log('📥 API Response: available cities:', cities);
    
    return cities;
  };

  const getCityStatus = (cityName: string): boolean => {
    return publicData.cityAvailability[cityName] || false;
  };

  const syncWithAdmin = async () => {
    // API: syncPublicDataWithAdmin()
    setPublicData(prev => ({ ...prev, isLoading: true }));
    
    try {
      // Simulation d'appel API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setPublicData(prev => ({
        ...prev,
        isLoading: false,
        lastUpdated: new Date()
      }));
      
      toast.success('Synchronisation avec le dashboard admin réussie');
      console.log('📤 API Call: syncPublicDataWithAdmin');
      console.log('✅ Données publiques synchronisées');
      
    } catch (error) {
      setPublicData(prev => ({ ...prev, isLoading: false }));
      toast.error('Erreur lors de la synchronisation');
      console.error('❌ Erreur de synchronisation:', error);
    }
  };

  const refreshPublicData = async () => {
    // API: refreshAllPublicData()
    setPublicData(prev => ({ ...prev, isLoading: true }));
    
    try {
      // Simulation d'appel API pour récupérer les dernières données
      await new Promise(resolve => setTimeout(resolve, 800));
      
      setPublicData(prev => ({
        ...prev,
        isLoading: false,
        lastUpdated: new Date()
      }));
      
      toast.success('Données publiques actualisées');
      console.log('📤 API Call: refreshAllPublicData');
      
    } catch (error) {
      setPublicData(prev => ({ ...prev, isLoading: false }));
      toast.error('Erreur lors de l\'actualisation');
      console.error('❌ Erreur d\'actualisation:', error);
    }
  };

  // 🔥 NEW: Fonctions pour enregistrer des callbacks d'événements
  const onAgentReservationCreated = (callback: (data: any) => void) => {
    const handler = (event: CustomEvent) => callback(event.detail);
    window.addEventListener('agent:reservation:created', handler as EventListener);
    return () => window.removeEventListener('agent:reservation:created', handler as EventListener);
  };

  const onDriverLocationUpdated = (callback: (data: any) => void) => {
    const handler = (event: CustomEvent) => callback(event.detail);
    window.addEventListener('driver:location:updated', handler as EventListener);
    return () => window.removeEventListener('driver:location:updated', handler as EventListener);
  };

  const onDriverDelayReported = (callback: (data: any) => void) => {
    const handler = (event: CustomEvent) => callback(event.detail);
    window.addEventListener('driver:delay:reported', handler as EventListener);
    return () => window.removeEventListener('driver:delay:reported', handler as EventListener);
  };

  const contextValue: PublicDataContextType = {
    ...publicData,
    updateCityCard,
    updateRoute,
    updateDestination,
    setFeaturedDestination,
    toggleCityAvailability,
    searchRoutes,
    getAvailableCities,
    getCityStatus,
    syncWithAdmin,
    refreshPublicData,
    // 🔥 NEW
    onAgentReservationCreated,
    onDriverLocationUpdated,
    onDriverDelayReported
  };

  return (
    <PublicDataContext.Provider value={contextValue}>
      {children}
    </PublicDataContext.Provider>
  );
}

export function usePublicData() {
  const context = useContext(PublicDataContext);
  if (context === undefined) {
    throw new Error('usePublicData must be used within a PublicDataProvider');
  }
  return context;
}

// Hook pour la synchronisation automatique
export function useRealtimeSync() {
  const { syncWithAdmin, lastUpdated } = usePublicData();
  
  useEffect(() => {
    // Synchronisation automatique toutes les minutes
    const interval = setInterval(() => {
      syncWithAdmin();
    }, 60000);
    
    // Synchronisation lors du focus de la fenêtre
    const handleFocus = () => {
      if (lastUpdated && Date.now() - lastUpdated.getTime() > 30000) {
        syncWithAdmin();
      }
    };
    
    window.addEventListener('focus', handleFocus);
    
    return () => {
      clearInterval(interval);
      window.removeEventListener('focus', handleFocus);
    };
  }, [syncWithAdmin, lastUpdated]);
}