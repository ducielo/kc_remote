import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle, X, Activity } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';

export const SyncDemoPanel: React.FC = () => {
  const [events, setEvents] = useState<Array<{
    id: string;
    type: string;
    message: string;
    timestamp: Date;
  }>>([]);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Écouter tous les événements de synchronisation
    const eventTypes = [
      'admin:route:published',
      'admin:schedule:updated',
      'admin:destination:activated',
      'agent:reservation:created',
      'agent:list:validated',
      'driver:location:updated',
      'driver:delay:reported',
      'driver:incident:reported'
    ];

    const handleEvent = (eventType: string) => (event: any) => {
      const newEvent = {
        id: `event_${Date.now()}`,
        type: eventType,
        message: getEventMessage(eventType, event.detail),
        timestamp: new Date()
      };
      
      setEvents(prev => [newEvent, ...prev.slice(0, 9)]);
      setIsVisible(true);
      
      // Auto-hide après 3 secondes si pas d'activité
      setTimeout(() => {
        setIsVisible(false);
      }, 3000);
    };

    eventTypes.forEach(type => {
      window.addEventListener(type, handleEvent(type));
    });

    return () => {
      eventTypes.forEach(type => {
        window.removeEventListener(type, handleEvent(type));
      });
    };
  }, []);

  const getEventMessage = (type: string, detail: any) => {
    switch (type) {
      case 'agent:reservation:created':
        return `Nouvelle réservation: ${detail.passenger?.name || 'N/A'}`;
      case 'admin:route:published':
        return `Nouveau trajet publié`;
      case 'driver:location:updated':
        return `Position GPS mise à jour`;
      case 'driver:delay:reported':
        return `Retard signalé: ${detail.delayMinutes}min`;
      default:
        return `Événement: ${type}`;
    }
  };

  const getEventColor = (type: string) => {
    if (type.startsWith('admin')) return 'bg-blue-500';
    if (type.startsWith('agent')) return 'bg-green-500';
    if (type.startsWith('driver')) return 'bg-orange-500';
    return 'bg-gray-500';
  };

  if (events.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 100 }}
          >
            <Card className="w-80 shadow-lg border-2 border-green-500">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Activity className="w-4 h-4 text-green-500 animate-pulse" />
                    Synchronisation en temps réel
                  </CardTitle>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsVisible(false)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-2">
                {events.slice(0, 3).map((event) => (
                  <div
                    key={event.id}
                    className="flex items-start gap-2 text-sm p-2 bg-gray-50 rounded"
                  >
                    <div className={`w-2 h-2 rounded-full mt-1 ${getEventColor(event.type)}`} />
                    <div className="flex-1">
                      <p className="font-medium">{event.message}</p>
                      <p className="text-xs text-gray-500">
                        {event.timestamp.toLocaleTimeString()}
                      </p>
                    </div>
                    <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
                  </div>
                ))}
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Toggle button when hidden */}
      {!isVisible && events.length > 0 && (
        <Button
          onClick={() => setIsVisible(true)}
          className="rounded-full w-12 h-12 shadow-lg"
          style={{ backgroundColor: 'rgba(192, 54, 24, 0.9)' }}
        >
          <Badge className="absolute -top-1 -right-1 w-5 h-5 p-0 flex items-center justify-center bg-green-500">
            {events.length}
          </Badge>
          <Activity className="w-5 h-5" />
        </Button>
      )}
    </div>
  );
};
