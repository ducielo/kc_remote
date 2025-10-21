import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Search, Filter, MapPin, Calendar } from 'lucide-react';
import { useAdminContent } from './contexts/AdminContentProvider';
import { usePublicData } from './contexts/PublicDataContext';
import { TripCard } from './TripCard';
import { TripDetailsModal } from './TripDetailsModal';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { toast } from 'sonner';

interface Trip {
  id: string;
  departure: string;
  arrival: string;
  departureTime: string;
  arrivalTime: string;
  duration: string;
  date: string;
  price: number;
  currency: string;
  availableSeats: number;
  busType: string;
  amenities: string[];
}

interface AvailableTripsProps {
  searchResults?: {
    departure: string;
    arrival: string;
    date: string;
  } | null;
}

export const AvailableTrips: React.FC<AvailableTripsProps> = ({ searchResults }) => {
  const { getPublishedRoutes } = useAdminContent();
  const { 
    availableRoutes, 
    onAgentReservationCreated, 
    onDriverLocationUpdated,
    onDriverDelayReported 
  } = usePublicData();
  
  const [selectedTrip, setSelectedTrip] = useState<Trip | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [sortBy, setSortBy] = useState('price');
  const [filterBy, setFilterBy] = useState('all');

  // 🔥 NEW: Écouter les événements de synchronisation
  useEffect(() => {
    // Écouter les réservations de l'agent
    const unsubscribeReservation = onAgentReservationCreated((data) => {
      console.log('📥 AvailableTrips: Réservation agent reçue', data);
      toast.success('Places mises à jour suite à une réservation agent', {
        description: `Trajet ${data.tripId}`
      });
    });

    // Écouter les mises à jour de position du chauffeur
    const unsubscribeLocation = onDriverLocationUpdated((data) => {
      console.log('📥 AvailableTrips: Position chauffeur mise à jour', data);
    });

    // Écouter les retards signalés
    const unsubscribeDelay = onDriverDelayReported((data) => {
      console.log('📥 AvailableTrips: Retard signalé', data);
      toast.warning(`Retard signalé: ${data.delayMinutes}min`, {
        description: data.reason
      });
    });

    return () => {
      unsubscribeReservation();
      unsubscribeLocation();
      unsubscribeDelay();
    };
  }, [onAgentReservationCreated, onDriverLocationUpdated, onDriverDelayReported]);

  // Données de démonstration des trajets (fallback si pas de données admin)
  const trips: Trip[] = [
    {
      id: '1',
      departure: 'Libreville',
      arrival: 'Port-Gentil',
      departureTime: '08:00',
      arrivalTime: '14:30',
      duration: '6h 30min',
      date: '15/01/2025',
      price: 25000,
      currency: 'XAF',
      availableSeats: 12,
      busType: 'Bus Premium',
      amenities: ['WiFi gratuit', 'Collations', 'Prises électriques', 'Assurance']
    },
    {
      id: '2',
      departure: 'Libreville',
      arrival: 'Port-Gentil',
      departureTime: '14:00',
      arrivalTime: '20:30',
      duration: '6h 30min',
      date: '15/01/2025',
      price: 22000,
      currency: 'XAF',
      availableSeats: 8,
      busType: 'Bus Standard',
      amenities: ['WiFi gratuit', 'Assurance']
    },
    {
      id: '3',
      departure: 'Libreville',
      arrival: 'Franceville',
      departureTime: '06:00',
      arrivalTime: '14:45',
      duration: '8h 45min',
      date: '15/01/2025',
      price: 35000,
      currency: 'XAF',
      availableSeats: 15,
      busType: 'Bus VIP',
      amenities: ['WiFi gratuit', 'Collations', 'Prises électriques', 'Assurance']
    },
    {
      id: '4',
      departure: 'Libreville',
      arrival: 'Oyem',
      departureTime: '09:30',
      arrivalTime: '14:45',
      duration: '5h 15min',
      date: '15/01/2025',
      price: 22000,
      currency: 'XAF',
      availableSeats: 6,
      busType: 'Bus Premium',
      amenities: ['WiFi gratuit', 'Collations', 'Prises électriques']
    },
    {
      id: '5',
      departure: 'Libreville',
      arrival: 'Lambaréné',
      departureTime: '11:00',
      arrivalTime: '14:20',
      duration: '3h 20min',
      date: '15/01/2025',
      price: 18000,
      currency: 'XAF',
      availableSeats: 20,
      busType: 'Bus Standard',
      amenities: ['WiFi gratuit', 'Assurance']
    },
    {
      id: '6',
      departure: 'Port-Gentil',
      arrival: 'Libreville',
      departureTime: '07:00',
      arrivalTime: '13:30',
      duration: '6h 30min',
      date: '16/01/2025',
      price: 25000,
      currency: 'XAF',
      availableSeats: 18,
      busType: 'Bus Premium',
      amenities: ['WiFi gratuit', 'Collations', 'Prises électriques', 'Assurance']
    }
  ];

  // Fonction pour transformer les trajets admin en format Trip
  const getTripsFromAdmin = (): Trip[] => {
    const publishedRoutes = getPublishedRoutes();
    
    return publishedRoutes.map(route => ({
      id: route.id,
      departure: route.departure,
      arrival: route.arrival,
      departureTime: route.departureTime,
      arrivalTime: route.arrivalTime,
      duration: route.duration || '6h',
      date: new Date().toLocaleDateString('fr-FR'),
      price: route.price,
      currency: 'XAF',
      availableSeats: route.seats,
      busType: route.busType || 'Bus Standard',
      amenities: route.amenities || ['WiFi gratuit', 'Assurance']
    }));
  };

  // Utiliser les trajets admin ou fallback vers les données par défaut
  const allTrips = (() => {
    const adminTrips = getTripsFromAdmin();
    return adminTrips.length > 0 ? adminTrips : trips;
  })();

  const handleTripClick = (trip: Trip) => {
    setSelectedTrip(trip);
    setIsModalOpen(true);
  };

  const filteredAndSortedTrips = allTrips
    .filter(trip => {
      if (filterBy === 'all') return true;
      if (filterBy === 'premium') return trip.busType.includes('Premium') || trip.busType.includes('VIP');
      if (filterBy === 'standard') return trip.busType.includes('Standard');
      return true;
    })
    .sort((a, b) => {
      if (sortBy === 'price') return a.price - b.price;
      if (sortBy === 'time') return a.departureTime.localeCompare(b.departureTime);
      if (sortBy === 'duration') return a.duration.localeCompare(b.duration);
      return 0;
    });

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
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              {searchResults ? 'Résultats de votre recherche' : 'Trajets disponibles'}
            </h2>
            {searchResults && (
              <div className="flex items-center justify-center space-x-4 text-gray-600">
                <div className="flex items-center space-x-2">
                  <MapPin className="w-4 h-4" />
                  <span>{searchResults.departure} → {searchResults.arrival}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4" />
                  <span>{searchResults.date}</span>
                </div>
              </div>
            )}
            <p className="text-gray-600 mt-2">
              {filteredAndSortedTrips.length} trajet{filteredAndSortedTrips.length > 1 ? 's' : ''} trouvé{filteredAndSortedTrips.length > 1 ? 's' : ''}
            </p>
          </div>

          {/* Filters and Sort */}
          <div className="flex flex-col md:flex-row gap-4 mb-8 bg-white p-4 rounded-lg shadow-sm">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Rechercher une destination..."
                  className="pl-10"
                />
              </div>
            </div>
            
            <div className="flex gap-4">
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Trier par" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="price">Prix croissant</SelectItem>
                  <SelectItem value="time">Heure de départ</SelectItem>
                  <SelectItem value="duration">Durée</SelectItem>
                </SelectContent>
              </Select>

              <Select value={filterBy} onValueChange={setFilterBy}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Filtrer" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les bus</SelectItem>
                  <SelectItem value="premium">Premium/VIP</SelectItem>
                  <SelectItem value="standard">Standard</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Trip Cards */}
          <div className="grid gap-6">
            {filteredAndSortedTrips.map((trip, index) => (
              <motion.div
                key={trip.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
              >
                <TripCard
                  trip={trip}
                  onClick={() => handleTripClick(trip)}
                />
              </motion.div>
            ))}
          </div>

          {filteredAndSortedTrips.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">Aucun trajet trouvé pour vos critères.</p>
              <Button 
                className="mt-4"
                variant="outline"
                onClick={() => {
                  setSortBy('price');
                  setFilterBy('all');
                }}
              >
                Effacer les filtres
              </Button>
            </div>
          )}

          {/* Load More Button */}
          {filteredAndSortedTrips.length > 0 && (
            <div className="text-center mt-12">
              <Button 
                variant="outline" 
                className="px-8 py-3"
                style={{ borderColor: 'rgba(192, 54, 24, 0.9)', color: 'rgba(192, 54, 24, 0.9)' }}
              >
                Voir plus de trajets
              </Button>
            </div>
          )}
        </motion.div>
      </div>

      {/* Trip Details Modal */}
      <TripDetailsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        trip={selectedTrip}
      />
    </section>
  );
};