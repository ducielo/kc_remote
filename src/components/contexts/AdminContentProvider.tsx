import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Types pour les données administrateur
interface AdminRoute {
  id: string;
  departure: string;
  arrival: string;
  departureTime: string;
  arrivalTime: string;
  price: number;
  seats: number;
  isAvailable: boolean;
  isPublished: boolean;
  description?: string;
  duration?: string;
  busType?: string;
  amenities?: string[];
}

interface AdminSchedule {
  id: string;
  routeId: string;
  date: string;
  times: string[];
  isActive: boolean;
  isPublished: boolean;
}

interface AdminTicket {
  id: string;
  routeId: string;
  passengerName: string;
  seatNumber: string;
  status: 'active' | 'used' | 'cancelled';
  price: number;
  bookingDate: string;
  travelDate: string;
  isPublished: boolean;
}

interface AdminContent {
  heroTitle?: string;
  heroDescription?: string;
  featuresTitle?: string;
  features?: Array<{
    title: string;
    description: string;
    icon: string;
  }>;
  destinationsTitle?: string;
  isPublished: boolean;
}

interface AdminStatistics {
  totalTrips: number;
  totalPassengers: number;
  totalRevenue: number;
  satisfactionRate: number;
  isPublished: boolean;
}

interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'agent' | 'driver' | 'passenger';
  status: 'active' | 'inactive';
  registrationDate: string;
}

interface AdminContentContextType {
  // Routes/Trajets
  routes: AdminRoute[];
  addRoute: (route: Omit<AdminRoute, 'id'>) => void;
  updateRoute: (id: string, route: Partial<AdminRoute>) => void;
  deleteRoute: (id: string) => void;
  publishRoute: (id: string) => void;
  unpublishRoute: (id: string) => void;
  
  // Schedules/Horaires
  schedules: AdminSchedule[];
  addSchedule: (schedule: Omit<AdminSchedule, 'id'>) => void;
  updateSchedule: (id: string, schedule: Partial<AdminSchedule>) => void;
  deleteSchedule: (id: string) => void;
  publishSchedule: (id: string) => void;
  unpublishSchedule: (id: string) => void;
  
  // Tickets/Billets
  tickets: AdminTicket[];
  addTicket: (ticket: Omit<AdminTicket, 'id'>) => void;
  updateTicket: (id: string, ticket: Partial<AdminTicket>) => void;
  deleteTicket: (id: string) => void;
  
  // Content/Contenu
  content: AdminContent;
  updateContent: (content: Partial<AdminContent>) => void;
  publishContent: () => void;
  unpublishContent: () => void;
  
  // Statistics/Statistiques
  statistics: AdminStatistics;
  updateStatistics: (stats: Partial<AdminStatistics>) => void;
  publishStatistics: () => void;
  unpublishStatistics: () => void;
  
  // Users/Utilisateurs
  users: AdminUser[];
  addUser: (user: Omit<AdminUser, 'id'>) => void;
  updateUser: (id: string, user: Partial<AdminUser>) => void;
  deleteUser: (id: string) => void;
  
  // Getters pour données publiques (uniquement les éléments publiés)
  getPublishedRoutes: () => AdminRoute[];
  getPublishedSchedules: () => AdminSchedule[];
  getPublishedContent: () => AdminContent | null;
  getPublishedStatistics: () => AdminStatistics | null;
  getAvailableDestinations: () => string[];
}

const AdminContentContext = createContext<AdminContentContextType | undefined>(undefined);

// Données initiales par défaut
const defaultRoutes: AdminRoute[] = [
  {
    id: '1',
    departure: 'Libreville',
    arrival: 'Port-Gentil',
    departureTime: '08:00',
    arrivalTime: '12:00',
    price: 15000,
    seats: 45,
    isAvailable: true,
    isPublished: true,
    description: 'Trajet direct vers Port-Gentil',
    duration: '4h',
    busType: 'VIP',
    amenities: ['WiFi', 'Climatisation', 'Collation']
  },
  {
    id: '2',
    departure: 'Libreville',
    arrival: 'Franceville',
    departureTime: '06:00',
    arrivalTime: '14:00',
    price: 25000,
    seats: 45,
    isAvailable: true,
    isPublished: true,
    description: 'Trajet vers Franceville via Lambaréné',
    duration: '8h',
    busType: 'Standard',
    amenities: ['Climatisation', 'Arrêts repas']
  },
  {
    id: '3',
    departure: 'Libreville',
    arrival: 'Oyem',
    departureTime: '09:00',
    arrivalTime: '15:00',
    price: 20000,
    seats: 40,
    isAvailable: true,
    isPublished: true,
    description: 'Trajet vers le nord du Gabon',
    duration: '6h',
    busType: 'VIP',
    amenities: ['WiFi', 'Climatisation', 'Boissons']
  }
];

const defaultSchedules: AdminSchedule[] = [
  {
    id: '1',
    routeId: '1',
    date: '2024-12-15',
    times: ['08:00', '14:00', '20:00'],
    isActive: true,
    isPublished: true
  },
  {
    id: '2',
    routeId: '2',
    date: '2024-12-15',
    times: ['06:00', '12:00'],
    isActive: true,
    isPublished: true
  }
];

const defaultContent: AdminContent = {
  heroTitle: 'Voyagez à travers le Gabon avec Karis Continental',
  heroDescription: 'Réservez vos billets en ligne et voyagez confortablement vers toutes les provinces du Gabon',
  featuresTitle: 'Pourquoi choisir Karis Continental ?',
  features: [
    {
      title: 'Confort garanti',
      description: 'Bus modernes avec climatisation et sièges confortables',
      icon: 'shield'
    },
    {
      title: 'Ponctualité',
      description: 'Départs à l\'heure et respect des horaires',
      icon: 'clock'
    },
    {
      title: 'Sécurité',
      description: 'Chauffeurs expérimentés et véhicules contrôlés',
      icon: 'shield-check'
    }
  ],
  destinationsTitle: 'Destinations populaires',
  isPublished: true
};

const defaultStatistics: AdminStatistics = {
  totalTrips: 1250,
  totalPassengers: 15680,
  totalRevenue: 187500000,
  satisfactionRate: 94.5,
  isPublished: true
};

const defaultUsers: AdminUser[] = [
  {
    id: '1',
    name: 'Admin Principal',
    email: 'admin@kariscontinental.ga',
    role: 'admin',
    status: 'active',
    registrationDate: '2024-01-01'
  }
];

export function AdminContentProvider({ children }: { children: ReactNode }) {
  const [routes, setRoutes] = useState<AdminRoute[]>(defaultRoutes);
  const [schedules, setSchedules] = useState<AdminSchedule[]>(defaultSchedules);
  const [tickets, setTickets] = useState<AdminTicket[]>([]);
  const [content, setContent] = useState<AdminContent>(defaultContent);
  const [statistics, setStatistics] = useState<AdminStatistics>(defaultStatistics);
  const [users, setUsers] = useState<AdminUser[]>(defaultUsers);

  // Routes functions
  const addRoute = (route: Omit<AdminRoute, 'id'>) => {
    const newRoute = { ...route, id: Date.now().toString() };
    setRoutes(prev => [...prev, newRoute]);
  };

  const updateRoute = (id: string, routeUpdate: Partial<AdminRoute>) => {
    setRoutes(prev => prev.map(route => 
      route.id === id ? { ...route, ...routeUpdate } : route
    ));
  };

  const deleteRoute = (id: string) => {
    setRoutes(prev => prev.filter(route => route.id !== id));
  };

  const publishRoute = (id: string) => {
    updateRoute(id, { isPublished: true });
  };

  const unpublishRoute = (id: string) => {
    updateRoute(id, { isPublished: false });
  };

  // Schedules functions
  const addSchedule = (schedule: Omit<AdminSchedule, 'id'>) => {
    const newSchedule = { ...schedule, id: Date.now().toString() };
    setSchedules(prev => [...prev, newSchedule]);
  };

  const updateSchedule = (id: string, scheduleUpdate: Partial<AdminSchedule>) => {
    setSchedules(prev => prev.map(schedule => 
      schedule.id === id ? { ...schedule, ...scheduleUpdate } : schedule
    ));
  };

  const deleteSchedule = (id: string) => {
    setSchedules(prev => prev.filter(schedule => schedule.id !== id));
  };

  const publishSchedule = (id: string) => {
    updateSchedule(id, { isPublished: true });
  };

  const unpublishSchedule = (id: string) => {
    updateSchedule(id, { isPublished: false });
  };

  // Tickets functions
  const addTicket = (ticket: Omit<AdminTicket, 'id'>) => {
    const newTicket = { ...ticket, id: Date.now().toString() };
    setTickets(prev => [...prev, newTicket]);
  };

  const updateTicket = (id: string, ticketUpdate: Partial<AdminTicket>) => {
    setTickets(prev => prev.map(ticket => 
      ticket.id === id ? { ...ticket, ...ticketUpdate } : ticket
    ));
  };

  const deleteTicket = (id: string) => {
    setTickets(prev => prev.filter(ticket => ticket.id !== id));
  };

  // Content functions
  const updateContent = (contentUpdate: Partial<AdminContent>) => {
    setContent(prev => ({ ...prev, ...contentUpdate }));
  };

  const publishContent = () => {
    setContent(prev => ({ ...prev, isPublished: true }));
  };

  const unpublishContent = () => {
    setContent(prev => ({ ...prev, isPublished: false }));
  };

  // Statistics functions
  const updateStatistics = (statsUpdate: Partial<AdminStatistics>) => {
    setStatistics(prev => ({ ...prev, ...statsUpdate }));
  };

  const publishStatistics = () => {
    setStatistics(prev => ({ ...prev, isPublished: true }));
  };

  const unpublishStatistics = () => {
    setStatistics(prev => ({ ...prev, isPublished: false }));
  };

  // Users functions
  const addUser = (user: Omit<AdminUser, 'id'>) => {
    const newUser = { ...user, id: Date.now().toString() };
    setUsers(prev => [...prev, newUser]);
  };

  const updateUser = (id: string, userUpdate: Partial<AdminUser>) => {
    setUsers(prev => prev.map(user => 
      user.id === id ? { ...user, ...userUpdate } : user
    ));
  };

  const deleteUser = (id: string) => {
    setUsers(prev => prev.filter(user => user.id !== id));
  };

  // Public getters (only published content)
  const getPublishedRoutes = () => {
    return routes.filter(route => route.isPublished && route.isAvailable);
  };

  const getPublishedSchedules = () => {
    return schedules.filter(schedule => schedule.isPublished && schedule.isActive);
  };

  const getPublishedContent = () => {
    return content.isPublished ? content : null;
  };

  const getPublishedStatistics = () => {
    return statistics.isPublished ? statistics : null;
  };

  const getAvailableDestinations = () => {
    const publishedRoutes = getPublishedRoutes();
    const destinations = new Set<string>();
    publishedRoutes.forEach(route => {
      destinations.add(route.arrival);
    });
    return Array.from(destinations);
  };

  const value: AdminContentContextType = {
    routes,
    addRoute,
    updateRoute,
    deleteRoute,
    publishRoute,
    unpublishRoute,
    schedules,
    addSchedule,
    updateSchedule,
    deleteSchedule,
    publishSchedule,
    unpublishSchedule,
    tickets,
    addTicket,
    updateTicket,
    deleteTicket,
    content,
    updateContent,
    publishContent,
    unpublishContent,
    statistics,
    updateStatistics,
    publishStatistics,
    unpublishStatistics,
    users,
    addUser,
    updateUser,
    deleteUser,
    getPublishedRoutes,
    getPublishedSchedules,
    getPublishedContent,
    getPublishedStatistics,
    getAvailableDestinations
  };

  return (
    <AdminContentContext.Provider value={value}>
      {children}
    </AdminContentContext.Provider>
  );
}

export function useAdminContent() {
  const context = useContext(AdminContentContext);
  if (context === undefined) {
    throw new Error('useAdminContent must be used within an AdminContentProvider');
  }
  return context;
}