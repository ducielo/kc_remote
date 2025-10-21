import { Users, TrendingUp, DollarSign, Calendar, Bus, CheckCircle, AlertCircle, Truck } from 'lucide-react';

export const getAdminMockData = () => ({
  userRole: 'admin' as const,
  userName: 'Marie Dubois',
  todayTasks: {
    total: 8,
    completed: 5,
    pending: 3
  },
  quickStats: [
    {
      label: 'Revenus du jour',
      value: '2.4M FCFA',
      icon: DollarSign,
      color: 'text-green-600',
      trend: '+12% vs hier'
    },
    {
      label: 'Trajets actifs',
      value: 24,
      icon: Bus,
      color: 'text-blue-600',
      trend: '3 retards'
    },
    {
      label: 'Utilisateurs',
      value: 1247,
      icon: Users,
      color: 'text-purple-600',
      trend: '+15 aujourd\'hui'
    },
    {
      label: 'Performance',
      value: '94%',
      icon: TrendingUp,
      color: 'text-orange-600',
      trend: 'Excellent'
    }
  ],
  todaySchedule: [
    {
      time: '08:00',
      title: 'Réunion équipe opérationnelle',
      status: 'completed' as const,
      location: 'Salle de conférence'
    },
    {
      time: '10:30',
      title: 'Révision budgets trimestriels',
      status: 'completed' as const,
      location: 'Bureau direction'
    },
    {
      time: '14:00',
      title: 'Supervision temps réel',
      status: 'active' as const,
      location: 'Centre de contrôle'
    },
    {
      time: '16:00',
      title: 'Validation nouveaux trajets',
      status: 'pending' as const,
      location: 'Bureau direction'
    },
    {
      time: '17:30',
      title: 'Rapport financier hebdomadaire',
      status: 'pending' as const,
      location: 'Bureau direction'
    }
  ]
});

export const getAgentMockData = () => ({
  userRole: 'agent' as const,
  userName: 'Paul Mengue',
  todayTasks: {
    total: 12,
    completed: 8,
    pending: 4
  },
  quickStats: [
    {
      label: 'Passagers validés',
      value: 156,
      icon: CheckCircle,
      color: 'text-green-600',
      trend: '+23 vs hier'
    },
    {
      label: 'Réservations créées',
      value: 18,
      icon: Calendar,
      color: 'text-blue-600',
      trend: 'Objectif: 20'
    },
    {
      label: 'Remboursements',
      value: 3,
      icon: DollarSign,
      color: 'text-orange-600',
      trend: '45K FCFA'
    },
    {
      label: 'Incidents signalés',
      value: 2,
      icon: AlertCircle,
      color: 'text-red-600',
      trend: 'Résolus'
    }
  ],
  todaySchedule: [
    {
      time: '06:30',
      title: 'Départ Libreville → Port-Gentil',
      status: 'completed' as const,
      location: 'Gare routière Libreville'
    },
    {
      time: '07:00',
      title: 'Validation passagers (LBV-PG-001)',
      status: 'completed' as const,
      location: 'Quai 3'
    },
    {
      time: '12:00',
      title: 'Pause déjeuner',
      status: 'completed' as const,
      location: 'Port-Gentil'
    },
    {
      time: '14:30',
      title: 'Départ Port-Gentil → Libreville',
      status: 'active' as const,
      location: 'Gare routière Port-Gentil'
    },
    {
      time: '15:00',
      title: 'Validation passagers (PG-LBV-002)',
      status: 'pending' as const,
      location: 'Quai 1'
    },
    {
      time: '18:00',
      title: 'Arrivée et rapport de mission',
      status: 'pending' as const,
      location: 'Gare routière Libreville'
    }
  ]
});

export const getDriverMockData = () => ({
  userRole: 'driver' as const,
  userName: 'Jean-Claude Obame',
  todayTasks: {
    total: 6,
    completed: 4,
    pending: 2
  },
  quickStats: [
    {
      label: 'Trajets du jour',
      value: 3,
      icon: Bus,
      color: 'text-blue-600',
      trend: '2 complétés'
    },
    {
      label: 'Passagers transportés',
      value: 89,
      icon: Users,
      color: 'text-green-600',
      trend: 'Capacité: 95%'
    },
    {
      label: 'Distance parcourue',
      value: '420 km',
      icon: Truck,
      color: 'text-orange-600',
      trend: 'Carburant: OK'
    },
    {
      label: 'Ponctualité',
      value: '98%',
      icon: CheckCircle,
      color: 'text-purple-600',
      trend: 'Excellent'
    }
  ],
  todaySchedule: [
    {
      time: '05:30',
      title: 'Contrôle véhicule pré-trajet',
      status: 'completed' as const,
      location: 'Garage Karis Continental'
    },
    {
      time: '06:30',
      title: 'Trajet 1: LBV → Franceville',
      status: 'completed' as const,
      location: 'Bus KC-001'
    },
    {
      time: '12:00',
      title: 'Pause déjeuner et vérifications',
      status: 'completed' as const,
      location: 'Franceville'
    },
    {
      time: '14:00',
      title: 'Trajet 2: Franceville → LBV',
      status: 'active' as const,
      location: 'Bus KC-001'
    },
    {
      time: '18:30',
      title: 'Retour garage et rapport',
      status: 'pending' as const,
      location: 'Garage Karis Continental'
    },
    {
      time: '19:00',
      title: 'Maintenance préventive véhicule',
      status: 'pending' as const,
      location: 'Atelier'
    }
  ]
});