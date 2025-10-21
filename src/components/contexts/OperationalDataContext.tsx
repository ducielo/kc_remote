import React, { createContext, useContext, useState, useEffect } from 'react';

// Types pour les données opérationnelles
export interface Trip {
  id: string;
  route: string;
  departure: string;
  arrival: string;
  departureTime: string;
  arrivalTime: string;
  date: string;
  bus: Bus;
  driver: Driver;
  passengers: Passenger[];
  status: 'scheduled' | 'boarding' | 'departed' | 'arrived' | 'cancelled';
  maxCapacity: number;
  currentOccupancy: number;
  price: number;
  createdAt: Date;
}

export interface Bus {
  id: string;
  registration: string;
  model: string;
  capacity: number;
  status: 'available' | 'in_service' | 'maintenance' | 'out_of_service';
  lastMaintenance: Date;
  nextMaintenance: Date;
  mileage: number;
  features: string[];
}

export interface Driver {
  id: string;
  name: string;
  email: string;
  phone: string;
  licenseNumber: string;
  licenseExpiry: Date;
  status: 'available' | 'driving' | 'resting' | 'off_duty';
  currentTrip?: string;
  totalTrips: number;
  rating: number;
}

export interface Passenger {
  id: string;
  ticketId: string;
  name: string;
  phone: string;
  email?: string;
  seatNumber: string;
  boardingStatus: 'not_boarded' | 'boarded' | 'no_show';
  ticketStatus: 'pending' | 'paid' | 'cancelled' | 'refunded';
  paymentMethod?: 'cash' | 'mobile_money' | 'card';
  checkInTime?: Date;
}

export interface Incident {
  id: string;
  tripId: string;
  driverId: string;
  type: 'mechanical' | 'accident' | 'passenger' | 'route' | 'other';
  severity: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  description: string;
  location: string;
  reportedAt: Date;
  status: 'reported' | 'investigating' | 'resolved' | 'closed';
  images?: string[];
  resolution?: string;
  resolvedAt?: Date;
}

export interface RouteConfig {
  id: string;
  name: string;
  departure: string;
  arrival: string;
  distance: number;
  estimatedDuration: number;
  basePrice: number;
  isActive: boolean;
  promotions: Promotion[];
  cancellationPolicy: CancellationPolicy;
  waypoints: string[];
}

export interface Promotion {
  id: string;
  title: string;
  description: string;
  discount: number;
  discountType: 'percentage' | 'fixed';
  validFrom: Date;
  validTo: Date;
  isActive: boolean;
  conditions: string[];
}

export interface CancellationPolicy {
  id: string;
  name: string;
  rules: {
    timeBeforeDeparture: number; // heures
    refundPercentage: number;
  }[];
}

interface OperationalDataContextType {
  // Trips
  trips: Trip[];
  getUpcomingTrips: (driverId?: string) => Trip[];
  getTripById: (tripId: string) => Trip | undefined;
  updateTripStatus: (tripId: string, status: Trip['status']) => Promise<void>;
  
  // Buses
  buses: Bus[];
  getBusById: (busId: string) => Bus | undefined;
  updateBusStatus: (busId: string, status: Bus['status']) => Promise<void>;
  
  // Drivers
  drivers: Driver[];
  getDriverById: (driverId: string) => Driver | undefined;
  updateDriverStatus: (driverId: string, status: Driver['status']) => Promise<void>;
  
  // Passengers
  validatePassengerList: (tripId: string) => Promise<{ success: boolean; pdfUrl?: string }>;
  updatePassengerStatus: (passengerId: string, status: Passenger['boardingStatus']) => Promise<void>;
  
  // Incidents
  incidents: Incident[];
  reportIncident: (incident: Omit<Incident, 'id' | 'reportedAt' | 'status'>) => Promise<void>;
  updateIncidentStatus: (incidentId: string, status: Incident['status'], resolution?: string) => Promise<void>;
  
  // Routes & Pricing
  routes: RouteConfig[];
  updateRouteConfig: (routeId: string, config: Partial<RouteConfig>) => Promise<void>;
  
  // Analytics
  getFillingRate: () => Promise<number>;
  getRealTimeStats: () => Promise<{
    activeTrips: number;
    totalRevenue: number;
    occupancyRate: number;
    incidentCount: number;
  }>;
  
  // 🔥 NEW: Agent operations that sync to public
  createOnSiteReservation: (reservation: {
    tripId: string;
    passengerName: string;
    passengerPhone: string;
    passengerEmail?: string;
    seatNumber: string;
    amount: number;
    paymentMethod: 'cash' | 'mobile_money' | 'pending';
  }) => Promise<{ 
    success: boolean; 
    reservationId?: string;
    reservation?: any;
  }>;
  
  // 🔥 NEW: Get reservations
  getAllReservations: () => any[];
  getTripReservations: (tripId: string) => any[];
  
  // 🔥 NEW: Driver operations that sync to public
  updateTripLocation: (tripId: string, location: { lat: number; lng: number; address: string }) => Promise<void>;
  reportDelay: (tripId: string, delayMinutes: number, reason: string) => Promise<void>;
  
  // 🔥 NEW: Get public-facing data
  getPublicTrips: () => Trip[];
  getPublicIncidents: () => Incident[];
  
  // 🔥 NEW: Admin operations that sync to public page
  publishTripToPublic: (trip: Trip) => Promise<void>;
  updatePublicRoute: (trip: Trip) => Promise<void>;
  removePublicTrip: (tripId: string) => Promise<void>;
}

const OperationalDataContext = createContext<OperationalDataContextType | undefined>(undefined);

// Données mock
const mockBuses: Bus[] = [
  {
    id: 'KC-001',
    registration: 'KC-001-GA',
    model: 'Mercedes Sprinter',
    capacity: 50,
    status: 'in_service',
    lastMaintenance: new Date('2024-12-15'),
    nextMaintenance: new Date('2025-01-15'),
    mileage: 45000,
    features: ['AC', 'WiFi', 'USB Charging', 'Seatbelts']
  },
  {
    id: 'KC-002',
    registration: 'KC-002-GA',
    model: 'Iveco Daily',
    capacity: 35,
    status: 'available',
    lastMaintenance: new Date('2024-12-10'),
    nextMaintenance: new Date('2025-01-10'),
    mileage: 32000,
    features: ['AC', 'Seatbelts']
  }
];

const mockDrivers: Driver[] = [
  {
    id: 'driver1',
    name: 'Jean-Baptiste Akue',
    email: 'jb.akue@karis.ga',
    phone: '+241 06 12 34 56',
    licenseNumber: 'DL-123456',
    licenseExpiry: new Date('2025-06-15'),
    status: 'driving',
    currentTrip: 'trip1',
    totalTrips: 245,
    rating: 4.8
  },
  {
    id: 'driver2',
    name: 'Marie Nkomo',
    email: 'm.nkomo@karis.ga',
    phone: '+241 06 23 45 67',
    licenseNumber: 'DL-789012',
    licenseExpiry: new Date('2025-08-20'),
    status: 'available',
    totalTrips: 189,
    rating: 4.9
  }
];

const mockTrips: Trip[] = [
  {
    id: 'trip1',
    route: 'LBV-PG',
    departure: 'Libreville',
    arrival: 'Port-Gentil',
    departureTime: '08:00',
    arrivalTime: '14:30',
    date: '2025-01-02',
    bus: mockBuses[0],
    driver: mockDrivers[0],
    passengers: [],
    status: 'departed',
    maxCapacity: 50,
    currentOccupancy: 42,
    price: 25000,
    createdAt: new Date()
  },
  {
    id: 'trip2',
    route: 'LBV-FCV',
    departure: 'Libreville',
    arrival: 'Franceville',
    departureTime: '06:00',
    arrivalTime: '14:45',
    date: '2025-01-02',
    bus: mockBuses[1],
    driver: mockDrivers[1],
    passengers: [],
    status: 'scheduled',
    maxCapacity: 35,
    currentOccupancy: 28,
    price: 35000,
    createdAt: new Date()
  }
];

const mockRoutes: RouteConfig[] = [
  {
    id: 'route1',
    name: 'Libreville - Port-Gentil',
    departure: 'Libreville',
    arrival: 'Port-Gentil',
    distance: 350,
    estimatedDuration: 390, // minutes
    basePrice: 25000,
    isActive: true,
    promotions: [],
    cancellationPolicy: {
      id: 'policy1',
      name: 'Standard',
      rules: [
        { timeBeforeDeparture: 48, refundPercentage: 100 },
        { timeBeforeDeparture: 24, refundPercentage: 50 },
        { timeBeforeDeparture: 0, refundPercentage: 0 }
      ]
    },
    waypoints: ['Ndjolé', 'Lambaréné']
  }
];

export const OperationalDataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [trips, setTrips] = useState<Trip[]>(mockTrips);
  const [buses] = useState<Bus[]>(mockBuses);
  const [drivers, setDrivers] = useState<Driver[]>(mockDrivers);
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [routes, setRoutes] = useState<RouteConfig[]>(mockRoutes);
  
  // 🔥 NEW: État pour les réservations créées par l'agent
  const [allReservations, setAllReservations] = useState<Array<{
    id: string;
    ticketId: string;
    tripId: string;
    passengerName: string;
    phone: string;
    email?: string;
    seatNumber: string;
    amount: number;
    paymentMethod: 'cash' | 'mobile_money' | 'pending';
    status: 'paid' | 'pending' | 'cancelled';
    createdAt: Date;
    departure: string;
    arrival: string;
    departureTime: string;
  }>>([
    // 🔥 Données de démonstration
    {
      id: 'res1',
      ticketId: 'TK001',
      tripId: '1',
      passengerName: 'Alain Mbongo',
      phone: '+241 06 12 34 56',
      email: 'alain.mbongo@email.com',
      seatNumber: 'A12',
      amount: 25000,
      paymentMethod: 'cash',
      status: 'paid',
      createdAt: new Date(),
      departure: 'Libreville',
      arrival: 'Port-Gentil',
      departureTime: '08:00'
    },
    {
      id: 'res2',
      ticketId: 'TK002',
      tripId: '3',
      passengerName: 'Marie Nkomo',
      phone: '+241 06 23 45 67',
      email: 'marie.nkomo@email.com',
      seatNumber: 'B05',
      amount: 35000,
      paymentMethod: 'mobile_money',
      status: 'pending',
      createdAt: new Date(),
      departure: 'Libreville',
      arrival: 'Franceville',
      departureTime: '06:00'
    }
  ]);

  // API: getUpcomingTrips
  const getUpcomingTrips = (driverId?: string): Trip[] => {
    const now = new Date();
    return trips.filter(trip => {
      const tripDate = new Date(trip.date);
      const isUpcoming = tripDate >= now || trip.status === 'scheduled' || trip.status === 'boarding';
      return driverId ? isUpcoming && trip.driver.id === driverId : isUpcoming;
    });
  };

  const getTripById = (tripId: string): Trip | undefined => {
    return trips.find(trip => trip.id === tripId);
  };

  // API: updateTripStatus
  const updateTripStatus = async (tripId: string, status: Trip['status']) => {
    setTrips(prev => prev.map(trip =>
      trip.id === tripId ? { ...trip, status } : trip
    ));
    // API: await updateTripStatusAPI(tripId, status);
  };

  const getBusById = (busId: string): Bus | undefined => {
    return buses.find(bus => bus.id === busId);
  };

  // API: updateBusStatus
  const updateBusStatus = async (busId: string, status: Bus['status']) => {
    // API: await updateBusStatusAPI(busId, status);
  };

  const getDriverById = (driverId: string): Driver | undefined => {
    return drivers.find(driver => driver.id === driverId);
  };

  // API: updateDriverStatus
  const updateDriverStatus = async (driverId: string, status: Driver['status']) => {
    setDrivers(prev => prev.map(driver =>
      driver.id === driverId ? { ...driver, status } : driver
    ));
    // API: await updateDriverStatusAPI(driverId, status);
  };

  // API: validatePassengerList
  const validatePassengerList = async (tripId: string): Promise<{ success: boolean; pdfUrl?: string }> => {
    // API: const result = await generatePassengerListPDF(tripId);
    // Mock implementation
    await new Promise(resolve => setTimeout(resolve, 2000));
    return { 
      success: true, 
      pdfUrl: `/api/trips/${tripId}/passenger-list.pdf` 
    };
  };

  // API: updatePassengerStatus
  const updatePassengerStatus = async (passengerId: string, status: Passenger['boardingStatus']) => {
    // API: await updatePassengerStatusAPI(passengerId, status);
  };

  // API: reportIncident
  const reportIncident = async (incidentData: Omit<Incident, 'id' | 'reportedAt' | 'status'>) => {
    const newIncident: Incident = {
      ...incidentData,
      id: `incident_${Date.now()}`,
      reportedAt: new Date(),
      status: 'reported'
    };
    setIncidents(prev => [newIncident, ...prev]);
    // API: await reportIncidentAPI(newIncident);
  };

  // API: updateIncidentStatus
  const updateIncidentStatus = async (incidentId: string, status: Incident['status'], resolution?: string) => {
    setIncidents(prev => prev.map(incident =>
      incident.id === incidentId
        ? { 
            ...incident, 
            status, 
            resolution,
            resolvedAt: status === 'resolved' ? new Date() : incident.resolvedAt
          }
        : incident
    ));
    // API: await updateIncidentStatusAPI(incidentId, status, resolution);
  };

  // API: updateRouteConfig
  const updateRouteConfig = async (routeId: string, config: Partial<RouteConfig>) => {
    setRoutes(prev => prev.map(route =>
      route.id === routeId ? { ...route, ...config } : route
    ));
    // API: await updateRouteConfigAPI(routeId, config);
  };

  // API: getFillingRate
  const getFillingRate = async (): Promise<number> => {
    const totalCapacity = trips.reduce((sum, trip) => sum + trip.maxCapacity, 0);
    const totalOccupancy = trips.reduce((sum, trip) => sum + trip.currentOccupancy, 0);
    return totalCapacity > 0 ? (totalOccupancy / totalCapacity) * 100 : 0;
  };

  // API: getRealTimeStats
  const getRealTimeStats = async () => {
    const activeTrips = trips.filter(trip => 
      trip.status === 'departed' || trip.status === 'boarding'
    ).length;
    
    const totalRevenue = trips
      .filter(trip => trip.status !== 'cancelled')
      .reduce((sum, trip) => sum + (trip.price * trip.currentOccupancy), 0);
    
    const occupancyRate = await getFillingRate();
    
    const incidentCount = incidents.filter(incident => 
      incident.status === 'reported' || incident.status === 'investigating'
    ).length;

    return {
      activeTrips,
      totalRevenue,
      occupancyRate,
      incidentCount
    };
  };

  // 🔥 NEW: Agent operations that sync to public
  const createOnSiteReservation = async (reservation: {
    tripId: string;
    passengerName: string;
    passengerPhone: string;
    passengerEmail?: string;
    seatNumber: string;
    amount: number;
    paymentMethod: 'cash' | 'mobile_money' | 'pending';
  }) => {
    // Trouver le trajet correspondant
    const trip = trips.find(t => t.id === reservation.tripId);
    if (!trip) {
      throw new Error('Trajet non trouvé');
    }

    // Créer le nouveau passager
    const newPassenger: Passenger = {
      id: `passenger_${Date.now()}`,
      ticketId: `TK${Date.now().toString().slice(-6)}`,
      name: reservation.passengerName,
      phone: reservation.passengerPhone,
      email: reservation.passengerEmail,
      seatNumber: reservation.seatNumber,
      boardingStatus: 'not_boarded',
      ticketStatus: reservation.paymentMethod === 'cash' || reservation.paymentMethod === 'mobile_money' ? 'paid' : 'pending',
      paymentMethod: reservation.paymentMethod
    };

    // Créer l'objet réservation complet pour l'affichage
    const fullReservation = {
      id: newPassenger.id,
      ticketId: newPassenger.ticketId,
      tripId: reservation.tripId,
      passengerName: reservation.passengerName,
      phone: reservation.passengerPhone,
      email: reservation.passengerEmail,
      seatNumber: reservation.seatNumber,
      amount: reservation.amount,
      paymentMethod: reservation.paymentMethod,
      status: newPassenger.ticketStatus,
      createdAt: new Date(),
      departure: trip.departure,
      arrival: trip.arrival,
      departureTime: trip.departureTime
    };

    // Ajouter à la liste des réservations
    setAllReservations(prev => [fullReservation, ...prev]);

    // Mettre à jour le trajet avec le nouveau passager
    setTrips(prev => prev.map(t => {
      if (t.id === reservation.tripId) {
        return {
          ...t,
          passengers: [...t.passengers, newPassenger],
          currentOccupancy: t.currentOccupancy + 1
        };
      }
      return t;
    }));

    // 🔥 Émettre un événement pour synchroniser avec PublicDataContext
    window.dispatchEvent(new CustomEvent('agent:reservation:created', {
      detail: { 
        tripId: reservation.tripId, 
        passenger: newPassenger,
        reservation: fullReservation
      }
    }));
    
    console.log('✅ Agent → Public sync: Nouvelle réservation créée', newPassenger);
    
    return { 
      success: true, 
      reservationId: newPassenger.id,
      reservation: fullReservation
    };
  };

  // 🔥 NEW: Get reservations functions
  const getAllReservations = () => {
    return allReservations;
  };

  const getTripReservations = (tripId: string) => {
    return allReservations.filter(res => res.tripId === tripId);
  };

  // 🔥 NEW: Driver operations that sync to public
  const updateTripLocation = async (tripId: string, location: { lat: number; lng: number; address: string }) => {
    // Émettre un événement pour synchroniser avec PublicDataContext
    window.dispatchEvent(new CustomEvent('driver:location:updated', {
      detail: { tripId, location }
    }));
    
    console.log('✅ Driver → Public sync: Position mise à jour', { tripId, location });
  };

  const reportDelay = async (tripId: string, delayMinutes: number, reason: string) => {
    // Mettre à jour le trajet avec le retard
    setTrips(prev => prev.map(trip => {
      if (trip.id === tripId) {
        return {
          ...trip,
          status: 'departed' as const,
          // Vous pouvez ajouter un champ delay si nécessaire
        };
      }
      return trip;
    }));
    
    // Émettre un événement pour synchroniser avec PublicDataContext
    window.dispatchEvent(new CustomEvent('driver:delay:reported', {
      detail: { tripId, delayMinutes, reason }
    }));
    
    console.log('✅ Driver → Public sync: Retard signalé', { tripId, delayMinutes, reason });
  };

  // 🔥 NEW: Get public-facing data
  const getPublicTrips = (): Trip[] => {
    return trips.filter(trip => 
      trip.status === 'departed' || trip.status === 'boarding'
    );
  };

  const getPublicIncidents = (): Incident[] => {
    return incidents.filter(incident => 
      incident.status === 'reported' || incident.status === 'investigating'
    );
  };

  // 🔥 NEW: Admin → Public sync
  const publishTripToPublic = async (trip: Trip) => {
    // Émettre un événement pour synchroniser avec PublicDataContext
    window.dispatchEvent(new CustomEvent('admin:trip:published', {
      detail: { 
        trip: {
          id: trip.id,
          from: trip.departure,
          to: trip.arrival,
          price: trip.price,
          duration: `${Math.floor((new Date(`2000-01-01 ${trip.arrivalTime}`) - new Date(`2000-01-01 ${trip.departureTime}`)) / 3600000)}h`,
          isActive: true,
          availability: trip.maxCapacity - trip.currentOccupancy,
          departureTime: trip.departureTime,
          arrivalTime: trip.arrivalTime,
          date: trip.date
        }
      }
    }));
    
    console.log('✅ Admin → Public sync: Trajet publié sur la page publique', trip);
  };

  const updatePublicRoute = async (trip: Trip) => {
    // Émettre un événement pour synchroniser avec PublicDataContext
    window.dispatchEvent(new CustomEvent('admin:route:updated', {
      detail: { 
        trip: {
          id: trip.id,
          from: trip.departure,
          to: trip.arrival,
          price: trip.price,
          duration: `${Math.floor((new Date(`2000-01-01 ${trip.arrivalTime}`) - new Date(`2000-01-01 ${trip.departureTime}`)) / 3600000)}h`,
          isActive: true,
          availability: trip.maxCapacity - trip.currentOccupancy,
          departureTime: trip.departureTime,
          arrivalTime: trip.arrivalTime,
          date: trip.date
        }
      }
    }));
    
    console.log('✅ Admin → Public sync: Trajet mis à jour sur la page publique', trip);
  };

  const removePublicTrip = async (tripId: string) => {
    // Émettre un événement pour synchroniser avec PublicDataContext
    window.dispatchEvent(new CustomEvent('admin:trip:removed', {
      detail: { tripId }
    }));
    
    console.log('✅ Admin → Public sync: Trajet retiré de la page publique', tripId);
  };

  return (
    <OperationalDataContext.Provider value={{
      trips,
      getUpcomingTrips,
      getTripById,
      updateTripStatus,
      buses,
      getBusById,
      updateBusStatus,
      drivers,
      getDriverById,
      updateDriverStatus,
      validatePassengerList,
      updatePassengerStatus,
      incidents,
      reportIncident,
      updateIncidentStatus,
      routes,
      updateRouteConfig,
      getFillingRate,
      getRealTimeStats,
      // 🔥 NEW: Sync functions
      createOnSiteReservation,
      getAllReservations,
      getTripReservations,
      updateTripLocation,
      reportDelay,
      getPublicTrips,
      getPublicIncidents,
      // 🔥 NEW: Admin → Public sync
      publishTripToPublic,
      updatePublicRoute,
      removePublicTrip
    }}>
      {children}
    </OperationalDataContext.Provider>
  );
};

// Hook personnalisé pour utiliser le contexte
export const useOperationalData = () => {
  const context = useContext(OperationalDataContext);
  if (!context) {
    throw new Error('useOperationalData must be used within OperationalDataProvider');
  }
  return context;
};