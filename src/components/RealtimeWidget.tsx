import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Activity, 
  Users, 
  TrendingUp, 
  Clock, 
  AlertTriangle,
  CheckCircle,
  DollarSign,
  Bus
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';

interface RealtimeEvent {
  id: string;
  type: 'booking' | 'payment' | 'cancellation' | 'check-in';
  title: string;
  description: string;
  timestamp: Date;
  value?: number;
  color: string;
}

interface RealtimeWidgetProps {
  className?: string;
}

export const RealtimeWidget: React.FC<RealtimeWidgetProps> = ({ className = '' }) => {
  const [events, setEvents] = useState<RealtimeEvent[]>([]);
  const [stats, setStats] = useState({
    onlineUsers: 42,
    todayBookings: 18,
    revenue: 425000,
    activeTrips: 12
  });

  // Simulate real-time events
  useEffect(() => {
    const eventTypes = [
      {
        type: 'booking' as const,
        templates: [
          'Nouvelle réservation Libreville → Port-Gentil',
          'Réservation confirmée pour Franceville',
          'Nouveau billet émis pour Oyem'
        ],
        color: 'text-green-600'
      },
      {
        type: 'payment' as const,
        templates: [
          'Paiement reçu - 25,000 XAF',
          'Transaction Mobile Money réussie',
          'Paiement carte bancaire validé'
        ],
        color: 'text-blue-600'
      },
      {
        type: 'check-in' as const,
        templates: [
          'Passager enregistré - Bus KC-001',
          'Check-in confirmé pour le trajet 08h00',
          'Embarquement validé'
        ],
        color: 'text-purple-600'
      }
    ];

    const interval = setInterval(() => {
      const eventType = eventTypes[Math.floor(Math.random() * eventTypes.length)];
      const template = eventType.templates[Math.floor(Math.random() * eventType.templates.length)];
      
      const newEvent: RealtimeEvent = {
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
        type: eventType.type,
        title: template,
        description: `Il y a ${Math.floor(Math.random() * 5) + 1} minute${Math.random() > 0.5 ? 's' : ''}`,
        timestamp: new Date(),
        value: eventType.type === 'payment' ? Math.floor(Math.random() * 50000) + 15000 : undefined,
        color: eventType.color
      };

      setEvents(prev => [newEvent, ...prev.slice(0, 9)]); // Keep only 10 most recent

      // Update stats
      setStats(prev => ({
        ...prev,
        onlineUsers: Math.max(10, prev.onlineUsers + (Math.random() - 0.5) * 5),
        todayBookings: eventType.type === 'booking' ? prev.todayBookings + 1 : prev.todayBookings,
        revenue: eventType.type === 'payment' && newEvent.value ? prev.revenue + newEvent.value : prev.revenue
      }));
    }, 3000 + Math.random() * 4000); // Random interval between 3-7 seconds

    return () => clearInterval(interval);
  }, []);

  const getEventIcon = (type: RealtimeEvent['type']) => {
    switch (type) {
      case 'booking':
        return <Users className="w-4 h-4" />;
      case 'payment':
        return <DollarSign className="w-4 h-4" />;
      case 'check-in':
        return <CheckCircle className="w-4 h-4" />;
      default:
        return <Activity className="w-4 h-4" />;
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XAF',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount).replace('XAF', 'XAF');
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Real-time stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center space-x-2 mb-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm text-gray-600">En ligne</span>
            </div>
            <div className="text-2xl font-bold text-gray-900">
              {Math.floor(stats.onlineUsers)}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center space-x-1 mb-2">
              <Users className="w-4 h-4 text-blue-600" />
              <span className="text-sm text-gray-600">Aujourd'hui</span>
            </div>
            <div className="text-2xl font-bold text-blue-600">
              {stats.todayBookings}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center space-x-1 mb-2">
              <DollarSign className="w-4 h-4 text-green-600" />
              <span className="text-sm text-gray-600">Revenus</span>
            </div>
            <div className="text-lg font-bold text-green-600">
              {formatCurrency(stats.revenue)}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center space-x-1 mb-2">
              <Bus className="w-4 h-4 text-purple-600" />
              <span className="text-sm text-gray-600">Trajets actifs</span>
            </div>
            <div className="text-2xl font-bold text-purple-600">
              {stats.activeTrips}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Real-time activity feed */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Activity className="w-5 h-5" />
            <span>Activité en temps réel</span>
          </CardTitle>
          <CardDescription>
            Flux d'activité de votre plateforme
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 max-h-80 overflow-y-auto">
            <AnimatePresence>
              {events.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Activity className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p>En attente d'activité...</p>
                </div>
              ) : (
                events.map((event, index) => (
                  <motion.div
                    key={event.id}
                    initial={{ opacity: 0, x: -20, scale: 0.95 }}
                    animate={{ opacity: 1, x: 0, scale: 1 }}
                    exit={{ opacity: 0, x: 20, scale: 0.95 }}
                    transition={{ 
                      duration: 0.3, 
                      delay: index * 0.05,
                      type: "spring",
                      stiffness: 500,
                      damping: 30
                    }}
                    className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200"
                  >
                    <div className={`${event.color} flex-shrink-0`}>
                      {getEventIcon(event.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-sm text-gray-900 truncate">
                        {event.title}
                      </div>
                      <div className="text-xs text-gray-500">
                        {event.description}
                      </div>
                    </div>
                    {event.value && (
                      <div className="text-sm font-medium text-green-600">
                        +{event.value.toLocaleString()} XAF
                      </div>
                    )}
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse flex-shrink-0"></div>
                  </motion.div>
                ))
              )}
            </AnimatePresence>
          </div>
        </CardContent>
      </Card>

      {/* System status indicator */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              <div>
                <div className="font-medium text-sm">Tous les systèmes opérationnels</div>
                <div className="text-xs text-gray-500">Dernière vérification: maintenant</div>
              </div>
            </div>
            <Badge className="bg-green-100 text-green-800 border-green-200">
              <CheckCircle className="w-3 h-3 mr-1" />
              Stable
            </Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};