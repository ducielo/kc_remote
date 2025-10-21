import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, Home, Bus, Download, AlertTriangle, LogOut, MapPin, 
  Clock, Users, Fuel, Settings, Wifi, WifiOff, Eye,
  FileText, Navigation, Phone, Camera, CheckCircle
} from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { toast } from 'sonner';
import { Alert, AlertDescription } from './ui/alert';
import { Textarea } from './ui/textarea';
import { useOperationalData } from './contexts/OperationalDataContext';

interface DriverDashboardFullProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DriverDashboardFull: React.FC<DriverDashboardFullProps> = ({ isOpen, onClose }) => {
  // 🔥 NEW: Utiliser le contexte opérationnel pour la synchronisation
  const { updateTripLocation, reportDelay, reportIncident } = useOperationalData();
  
  const [activeTab, setActiveTab] = useState('home');
  const [isLoading, setIsLoading] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [showIncidentForm, setShowIncidentForm] = useState(false);
  const [gpsLocation, setGpsLocation] = useState({ lat: 0.3842, lng: 9.4673 });
  
  // États pour les données
  const [trips] = useState([
    { 
      id: '001', 
      route: 'Libreville → Port-Gentil', 
      time: '08:00', 
      passengers: 45, 
      status: 'Terminé',
      distance: '280 km',
      duration: '4h30',
      fuel: 95
    },
    { 
      id: '002', 
      route: 'Port-Gentil → Libreville', 
      time: '14:00', 
      passengers: 52, 
      status: 'En cours',
      distance: '280 km',
      duration: '4h30',
      fuel: 65
    },
    { 
      id: '003', 
      route: 'Libreville → Oyem', 
      time: '18:30', 
      passengers: 38, 
      status: 'Programmé',
      distance: '320 km',
      duration: '5h15',
      fuel: 85
    },
  ]);

  const [busDetails] = useState({
    id: 'KCB-007',
    model: 'Mercedes Tourismo',
    capacity: 55,
    immatriculation: 'GA-001-KC',
    nextMaintenance: '2024-02-15',
    mileage: 87432,
    fuelLevel: 65,
    status: 'En service'
  });

  const [events, setEvents] = useState<string[]>([]);

  const addEvent = (message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setEvents(prev => [`${timestamp} - ${message}`, ...prev.slice(0, 9)]);
  };

  // Gestion du statut en ligne/hors ligne
  useEffect(() => {
    const handleOnlineStatus = () => {
      const online = navigator.onLine;
      setIsOnline(online);
      if (online) {
        addEvent('Connexion rétablie - Synchronisation en cours');
        toast.success('Connexion rétablie');
      } else {
        addEvent('Mode hors ligne activé');
        toast.info('Mode hors ligne - Les données seront synchronisées à la reconnexion');
      }
    };

    window.addEventListener('online', handleOnlineStatus);
    window.addEventListener('offline', handleOnlineStatus);
    
    return () => {
      window.removeEventListener('online', handleOnlineStatus);
      window.removeEventListener('offline', handleOnlineStatus);
    };
  }, []);

  // Simulation GPS avec synchronisation vers la page publique
  useEffect(() => {
    const interval = setInterval(() => {
      const activeTrip = trips.find(t => t.status === 'En cours');
      if (activeTrip) {
        const newLocation = {
          lat: gpsLocation.lat + (Math.random() - 0.5) * 0.001,
          lng: gpsLocation.lng + (Math.random() - 0.5) * 0.001
        };
        
        setGpsLocation(newLocation);
        
        // 🔥 Synchroniser la position avec la page publique
        updateTripLocation(activeTrip.id, {
          ...newLocation,
          address: 'Route Libreville-Port-Gentil'
        });
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [trips, gpsLocation, updateTripLocation]);

  // Actions du chauffeur
  const handleDownloadPassengerList = async (tripId: string) => {
    setIsLoading(true);
    try {
      // API: getPassengerListPDF(tripId) => mock URL
      await new Promise(resolve => setTimeout(resolve, 1500));
      const pdfUrl = `https://karis-continental.ga/pdf/passengers-${tripId}-${Date.now()}.pdf`;
      
      if (!isOnline) {
        // Stockage hors ligne
        localStorage.setItem(`passenger_list_${tripId}`, JSON.stringify({
          url: pdfUrl,
          downloaded: Date.now(),
          tripId
        }));
        addEvent(`Liste passagers ${tripId} téléchargée (mode hors ligne)`);
        toast.success('Liste téléchargée et disponible hors ligne');
      } else {
        addEvent(`Liste passagers ${tripId} téléchargée`);
        toast.success('Liste des passagers téléchargée');
        // Simuler l'ouverture du PDF
        window.open(pdfUrl, '_blank');
      }
    } catch (error) {
      toast.error('Erreur lors du téléchargement');
    } finally {
      setIsLoading(false);
    }
  };

  const handleReportIncident = async (incidentData: any) => {
    setIsLoading(true);
    try {
      const incident = {
        id: `INC${Date.now()}`,
        type: incidentData.type,
        description: incidentData.description,
        location: `${gpsLocation.lat.toFixed(4)}°N, ${gpsLocation.lng.toFixed(4)}°E`,
        timestamp: new Date().toISOString(),
        driverId: 'CHAUFF001',
        busId: busDetails.id
      };

      // 🔥 Utiliser la fonction du contexte pour synchroniser avec la page publique
      await reportIncident({
        tripId: trips.find(t => t.status === 'En cours')?.id || 'trip-001',
        driverId: 'CHAUFF001',
        type: incidentData.type as 'mechanical' | 'accident' | 'passenger' | 'route' | 'other',
        severity: incidentData.severity || 'medium' as 'low' | 'medium' | 'high' | 'critical',
        title: incidentData.type,
        description: incidentData.description,
        location: incident.location
      });
      
      addEvent(`Incident signalé: ${incident.type} - ID: ${incident.id}`);
      toast.success('Incident signalé avec succès', {
        description: `Référence: ${incident.id}`
      });
      
      setShowIncidentForm(false);
    } catch (error) {
      toast.error('Erreur lors du signalement');
    } finally {
      setIsLoading(false);
    }
  };

  const handleStartTrip = (tripId: string) => {
    addEvent(`Trajet ${tripId} démarré - Position GPS activée`);
    toast.success('Trajet en cours - GPS activé');
    
    // 🔥 Synchroniser le démarrage du trajet avec la page publique
    updateTripLocation(tripId, {
      lat: gpsLocation.lat,
      lng: gpsLocation.lng,
      address: 'Départ Libreville'
    });
  };

  const handlePauseTrip = (tripId: string) => {
    addEvent(`Trajet ${tripId} en pause`);
    toast.info('Trajet mis en pause');
  };
  
  // 🔥 NEW: Fonction pour signaler un retard
  const handleReportDelay = async (tripId: string, minutes: number, reason: string) => {
    try {
      await reportDelay(tripId, minutes, reason);
      addEvent(`Retard signalé: ${minutes}min - ${reason}`);
      toast.warning(`Retard de ${minutes}min signalé`);
    } catch (error) {
      toast.error('Erreur lors du signalement du retard');
    }
  };

  const tabs = [
    { id: 'home', label: 'Tableau de bord', icon: Home },
    { id: 'trips', label: 'Mes Trajets', icon: Bus },
    { id: 'passengers', label: 'Listes Passagers', icon: Download },
    { id: 'incidents', label: 'Incidents', icon: AlertTriangle },
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-white rounded-xl shadow-2xl w-full max-w-7xl h-[90vh] sm:h-[95vh] overflow-hidden flex flex-col sm:flex-row"
      >
        {/* Sidebar */}
        <div className="w-full sm:w-64 bg-orange-600 text-white p-4 sm:p-6 flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Chauffeur</h2>
            <button
              onClick={onClose}
              className="text-white hover:text-gray-300 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Status en ligne/hors ligne */}
          <div className="mb-6 p-3 bg-white bg-opacity-10 rounded-lg">
            <div className="flex items-center space-x-2">
              {isOnline ? (
                <Wifi className="w-4 h-4 text-green-300" />
              ) : (
                <WifiOff className="w-4 h-4 text-red-300" />
              )}
              <span className="text-sm">
                {isOnline ? 'En ligne' : 'Mode hors ligne'}
              </span>
            </div>
            {!isOnline && (
              <p className="text-xs text-orange-200 mt-1">
                Données synchronisées à la reconnexion
              </p>
            )}
          </div>

          {/* Informations du bus */}
          <div className="mb-6 p-3 bg-white bg-opacity-10 rounded-lg">
            <div className="text-sm font-medium mb-1">Bus assigné</div>
            <div className="text-orange-100">{busDetails.id}</div>
            <div className="text-xs text-orange-200">{busDetails.immatriculation}</div>
            <div className="flex items-center mt-2 text-xs">
              <Fuel className="w-3 h-3 mr-1" />
              <span>Carburant: {busDetails.fuelLevel}%</span>
            </div>
          </div>

          <nav className="space-y-2 flex-1">
            {tabs.map((tab) => {
              const IconComponent = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                    activeTab === tab.id
                      ? 'bg-white bg-opacity-20'
                      : 'hover:bg-white hover:bg-opacity-10'
                  }`}
                >
                  <IconComponent className="w-5 h-5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Journal des événements */}
          <div className="mt-6 bg-white bg-opacity-10 rounded-lg p-3">
            <h4 className="font-medium mb-2 text-sm">Journal d'activité</h4>
            <div className="text-xs space-y-1 max-h-32 overflow-y-auto">
              {events.slice(0, 5).map((event, index) => (
                <div key={index} className="text-orange-100 opacity-90">
                  {event}
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-orange-500">
            <button
              onClick={onClose}
              className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-white hover:bg-opacity-10 transition-colors"
            >
              <LogOut className="w-5 h-5" />
              <span>Déconnexion</span>
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-4 sm:p-6 overflow-y-auto">
          <AnimatePresence mode="wait">
            {activeTab === 'home' && (
              <motion.div
                key="home"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-6"
              >
                <h3 className="text-2xl font-semibold text-gray-900">Tableau de Bord - Chauffeur</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-600">Trajets Aujourd'hui</p>
                          <p className="text-2xl font-semibold">{trips.length}</p>
                        </div>
                        <Bus className="w-8 h-8 text-orange-600" />
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-600">Passagers Transportés</p>
                          <p className="text-2xl font-semibold">{trips.reduce((acc, trip) => acc + trip.passengers, 0)}</p>
                        </div>
                        <Users className="w-8 h-8 text-orange-600" />
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-600">Carburant</p>
                          <p className="text-2xl font-semibold">{busDetails.fuelLevel}%</p>
                        </div>
                        <Fuel className="w-8 h-8 text-orange-600" />
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-600">Position GPS</p>
                          <p className="text-sm font-semibold">{gpsLocation.lat.toFixed(4)}°N</p>
                        </div>
                        <Navigation className="w-8 h-8 text-orange-600" />
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Trajet en cours</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {trips.filter(trip => trip.status === 'En cours').map(trip => (
                        <div key={trip.id} className="space-y-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-medium text-lg">{trip.route}</p>
                              <p className="text-sm text-gray-600">Départ: {trip.time}</p>
                              <p className="text-sm text-gray-600">{trip.passengers} passagers • {trip.distance}</p>
                            </div>
                            <Badge className="bg-blue-100 text-blue-800">En cours</Badge>
                          </div>
                          
                          <div className="bg-gray-50 p-4 rounded-lg">
                            <div className="flex items-center justify-between text-sm mb-2">
                              <span>Position actuelle:</span>
                              <span className="font-mono">{gpsLocation.lat.toFixed(4)}°N, {gpsLocation.lng.toFixed(4)}°E</span>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                              <span>Carburant:</span>
                              <span className={trip.fuel < 30 ? 'text-red-600' : 'text-green-600'}>
                                {trip.fuel}%
                              </span>
                            </div>
                          </div>

                          <div className="flex space-x-2">
                            <Button
                              size="sm"
                              onClick={() => handlePauseTrip(trip.id)}
                              variant="outline"
                              className="flex-1"
                            >
                              <Clock className="w-4 h-4 mr-2" />
                              Pause
                            </Button>
                            <Button
                              size="sm"
                              onClick={() => setShowIncidentForm(true)}
                              variant="outline"
                              className="flex-1"
                            >
                              <AlertTriangle className="w-4 h-4 mr-2" />
                              Incident
                            </Button>
                            <Button
                              size="sm"
                              onClick={() => toast.info('Appel au dispatch')}
                              variant="outline"
                            >
                              <Phone className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      )) || (
                        <div className="text-center py-8 text-gray-500">
                          <Bus className="w-12 h-12 mx-auto mb-2 opacity-50" />
                          <p>Aucun trajet en cours</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Détails du Bus</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between py-2 border-b">
                          <span className="text-gray-600">Modèle:</span>
                          <span className="font-medium">{busDetails.model}</span>
                        </div>
                        <div className="flex items-center justify-between py-2 border-b">
                          <span className="text-gray-600">Capacité:</span>
                          <span className="font-medium">{busDetails.capacity} places</span>
                        </div>
                        <div className="flex items-center justify-between py-2 border-b">
                          <span className="text-gray-600">Kilométrage:</span>
                          <span className="font-medium">{busDetails.mileage.toLocaleString()} km</span>
                        </div>
                        <div className="flex items-center justify-between py-2 border-b">
                          <span className="text-gray-600">Prochaine révision:</span>
                          <span className="font-medium">{busDetails.nextMaintenance}</span>
                        </div>
                        <div className="flex items-center justify-between py-2">
                          <span className="text-gray-600">Statut:</span>
                          <Badge className="bg-green-100 text-green-800">{busDetails.status}</Badge>
                        </div>
                        
                        <div className="mt-4 p-3 bg-orange-50 rounded-lg">
                          <div className="flex items-center space-x-2 text-orange-800">
                            <Fuel className="w-4 h-4" />
                            <span className="font-medium">Niveau de carburant</span>
                          </div>
                          <div className="w-full bg-orange-200 rounded-full h-2 mt-2">
                            <div 
                              className={`h-2 rounded-full transition-all duration-300 ${
                                busDetails.fuelLevel < 30 ? 'bg-red-500' : 
                                busDetails.fuelLevel < 50 ? 'bg-yellow-500' : 'bg-green-500'
                              }`}
                              style={{ width: `${busDetails.fuelLevel}%` }}
                            />
                          </div>
                          <div className="text-sm text-orange-700 mt-1">{busDetails.fuelLevel}%</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </motion.div>
            )}

            {activeTab === 'trips' && (
              <motion.div
                key="trips"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-6"
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-2xl font-semibold text-gray-900">Mes Trajets</h3>
                  <Badge variant="outline" className="text-orange-600 border-orange-200">
                    Bus assigné: {busDetails.id}
                  </Badge>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h4 className="font-medium text-gray-900">Trajets d'Aujourd'hui</h4>
                    {trips.map((trip) => (
                      <Card key={trip.id} className={`border-l-4 ${
                        trip.status === 'Terminé' ? 'border-l-green-500' :
                        trip.status === 'En cours' ? 'border-l-blue-500' :
                        'border-l-gray-400'
                      }`}>
                        <CardHeader className="pb-3">
                          <div className="flex items-center justify-between">
                            <CardTitle className="text-lg">{trip.route}</CardTitle>
                            <Badge 
                              variant={trip.status === 'Terminé' ? 'default' : 'secondary'}
                              className={
                                trip.status === 'Terminé' ? 'bg-green-100 text-green-800' :
                                trip.status === 'En cours' ? 'bg-blue-100 text-blue-800' :
                                'bg-gray-100 text-gray-800'
                              }
                            >
                              {trip.status}
                            </Badge>
                          </div>
                          <CardDescription>
                            <div className="flex items-center space-x-4 text-sm">
                              <span>🕒 {trip.time}</span>
                              <span>👥 {trip.passengers} passagers</span>
                              <span>📍 {trip.distance}</span>
                            </div>
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="flex space-x-2">
                            {trip.status === 'En cours' && (
                              <>
                                <Button 
                                  size="sm" 
                                  onClick={() => toast.info(`Position GPS pour ${trip.route}`)}
                                  className="bg-orange-600 hover:bg-orange-700"
                                >
                                  <Navigation className="w-4 h-4 mr-2" />
                                  Position GPS
                                </Button>
                                <Button 
                                  size="sm" 
                                  variant="outline"
                                  onClick={() => handlePauseTrip(trip.id)}
                                >
                                  <Clock className="w-4 h-4" />
                                </Button>
                              </>
                            )}
                            {trip.status === 'Programmé' && (
                              <Button 
                                size="sm" 
                                onClick={() => handleStartTrip(trip.id)}
                                className="bg-green-600 hover:bg-green-700"
                              >
                                <CheckCircle className="w-4 h-4 mr-2" />
                                Démarrer
                              </Button>
                            )}
                            {trip.status === 'Terminé' && (
                              <Badge variant="outline" className="text-green-600">
                                <CheckCircle className="w-3 h-3 mr-1" />
                                Terminé
                              </Badge>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-medium text-gray-900">Planning de la Semaine</h4>
                    <Card>
                      <CardContent className="p-4">
                        <div className="space-y-3">
                          {[
                            { day: 'Lundi', trips: 3, hours: '8h - 19h', status: 'completed' },
                            { day: 'Mardi', trips: 2, hours: '9h - 17h', status: 'completed' },
                            { day: 'Mercredi', trips: 4, hours: '7h - 20h', status: 'current' },
                            { day: 'Jeudi', trips: 3, hours: '8h - 18h', status: 'upcoming' },
                            { day: 'Vendredi', trips: 2, hours: '10h - 16h', status: 'upcoming' },
                            { day: 'Samedi', trips: 1, hours: '14h - 18h', status: 'upcoming' },
                            { day: 'Dimanche', trips: 0, hours: 'Repos', status: 'rest' },
                          ].map((day) => (
                            <div key={day.day} className={`flex items-center justify-between py-2 px-3 rounded ${
                              day.status === 'current' ? 'bg-orange-50 border border-orange-200' : ''
                            }`}>
                              <span className={`font-medium ${day.status === 'current' ? 'text-orange-800' : ''}`}>
                                {day.day}
                              </span>
                              <span className="text-sm text-gray-600">{day.trips} trajets</span>
                              <span className={`text-sm ${
                                day.status === 'current' ? 'text-orange-600' : 'text-gray-600'
                              }`}>
                                {day.hours}
                              </span>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'passengers' && (
              <motion.div
                key="passengers"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-6"
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-2xl font-semibold text-gray-900">Listes Passagers</h3>
                  <Button 
                    onClick={() => toast.info('Synchronisation des listes')}
                    className="bg-orange-600 hover:bg-orange-700"
                    disabled={!isOnline}
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Synchroniser
                  </Button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {trips.map((trip) => (
                    <Card key={trip.id} className="border">
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <div>
                            <CardTitle className="text-lg">{trip.route}</CardTitle>
                            <CardDescription>{trip.time} - {trip.passengers} passagers</CardDescription>
                          </div>
                          <Badge 
                            variant={localStorage.getItem(`passenger_list_${trip.id}`) ? 'default' : 'secondary'}
                            className={localStorage.getItem(`passenger_list_${trip.id}`) ? 'bg-green-100 text-green-800' : ''}
                          >
                            {localStorage.getItem(`passenger_list_${trip.id}`) ? 'Téléchargé' : 'En attente'}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <Button
                            onClick={() => handleDownloadPassengerList(trip.id)}
                            disabled={isLoading}
                            className="w-full bg-orange-50 text-orange-700 border border-orange-200 hover:bg-orange-100"
                          >
                            <Download className="w-4 h-4 mr-2" />
                            {isLoading ? 'Téléchargement...' : 'Télécharger Liste'}
                          </Button>
                          
                          {localStorage.getItem(`passenger_list_${trip.id}`) && (
                            <>
                              <div className="text-xs text-gray-500 text-center">
                                Disponible hors ligne • Dernière sync: {new Date().toLocaleTimeString()}
                              </div>
                              <Button
                                variant="outline"
                                size="sm"
                                className="w-full"
                                onClick={() => toast.info(`Ouverture de la liste ${trip.id}`)}
                              >
                                <Eye className="w-4 h-4 mr-2" />
                                Consulter hors ligne
                              </Button>
                            </>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                <Alert>
                  <Download className="w-4 h-4" />
                  <AlertDescription>
                    <strong>Mode Hors Ligne:</strong> Les listes téléchargées restent disponibles même sans connexion internet. 
                    Synchronisez régulièrement pour obtenir les dernières mises à jour.
                  </AlertDescription>
                </Alert>
              </motion.div>
            )}

            {activeTab === 'incidents' && (
              <motion.div
                key="incidents"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-6"
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-2xl font-semibold text-gray-900">Signalement d'Incidents</h3>
                  <Button 
                    onClick={() => setShowIncidentForm(true)}
                    className="bg-red-600 hover:bg-red-700"
                  >
                    <AlertTriangle className="w-4 h-4 mr-2" />
                    Signaler Incident
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h4 className="font-medium text-gray-900">Mes Signalements Récents</h4>
                    
                    {[
                      { id: 'INC001', type: 'Panne', description: 'Problème moteur sur N1', date: '2024-01-14', status: 'En cours', severity: 'high' },
                      { id: 'INC002', type: 'Retard', description: 'Embouteillage Libreville', date: '2024-01-13', status: 'Résolu', severity: 'medium' },
                      { id: 'INC003', type: 'Accident', description: 'Accrochage mineur', date: '2024-01-12', status: 'Traité', severity: 'high' },
                    ].map((incident) => (
                      <Card key={incident.id} className="border-l-4 border-l-red-500">
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-medium text-gray-900">#{incident.id}</span>
                            <div className="flex items-center space-x-2">
                              <span className={`w-2 h-2 rounded-full ${
                                incident.severity === 'high' ? 'bg-red-400' : 'bg-yellow-400'
                              }`}></span>
                              <Badge 
                                variant={incident.status === 'Résolu' || incident.status === 'Traité' ? 'default' : 'secondary'}
                                className={incident.status === 'Résolu' || incident.status === 'Traité' ? 'bg-green-100 text-green-800' : 'bg-orange-100 text-orange-800'}
                              >
                                {incident.status}
                              </Badge>
                            </div>
                          </div>
                          <div className="text-sm font-medium text-gray-700 mb-1">{incident.type}</div>
                          <div className="text-sm text-gray-600 mb-2">{incident.description}</div>
                          <div className="text-xs text-gray-500">{incident.date}</div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-medium text-gray-900">Signalement Rapide</h4>
                    
                    <Card>
                      <CardContent className="p-4">
                        <div className="space-y-4">
                          <div className="grid grid-cols-2 gap-3">
                            {[
                              { type: 'Panne', icon: '🔧', color: 'bg-red-50 text-red-700 border-red-200', action: () => setShowIncidentForm(true) },
                              { type: 'Retard', icon: '⏰', color: 'bg-yellow-50 text-yellow-700 border-yellow-200', action: () => setShowIncidentForm(true) },
                              { type: 'Accident', icon: '⚠️', color: 'bg-orange-50 text-orange-700 border-orange-200', action: () => setShowIncidentForm(true) },
                              { type: 'Autre', icon: '📝', color: 'bg-gray-50 text-gray-700 border-gray-200', action: () => setShowIncidentForm(true) },
                            ].map((type) => (
                              <button
                                key={type.type}
                                onClick={type.action}
                                className={`p-3 border rounded-lg hover:shadow-sm transition-all ${type.color}`}
                              >
                                <div className="text-lg mb-1">{type.icon}</div>
                                <div className="text-sm font-medium">{type.type}</div>
                              </button>
                            ))}
                          </div>
                          
                          <div className="border-t pt-4">
                            <h5 className="font-medium text-gray-900 mb-2">Informations GPS Actuelles</h5>
                            <div className="text-sm text-gray-600 space-y-1 bg-gray-50 p-3 rounded font-mono">
                              <div>Position: {gpsLocation.lat.toFixed(4)}°N, {gpsLocation.lng.toFixed(4)}°E</div>
                              <div>Bus: {busDetails.id} ({busDetails.immatriculation})</div>
                              <div>Horodatage: {new Date().toLocaleTimeString()}</div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* Modale de signalement d'incident */}
      <AnimatePresence>
        {showIncidentForm && (
          <IncidentFormModal
            onClose={() => setShowIncidentForm(false)}
            onSubmit={handleReportIncident}
            isLoading={isLoading}
            currentLocation={gpsLocation}
            busInfo={busDetails}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

// Modale de signalement d'incident
const IncidentFormModal: React.FC<{
  onClose: () => void;
  onSubmit: (data: any) => void;
  isLoading: boolean;
  currentLocation: { lat: number; lng: number };
  busInfo: any;
}> = ({ onClose, onSubmit, isLoading, currentLocation, busInfo }) => {
  const [formData, setFormData] = useState({
    type: '',
    description: '',
    severity: 'medium',
    includeLocation: true
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const incidentData = {
      ...formData,
      location: formData.includeLocation ? currentLocation : null,
      busId: busInfo.id,
      timestamp: new Date().toISOString()
    };
    onSubmit(incidentData);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white rounded-xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Signaler un Incident</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <Alert className="mb-4">
          <AlertTriangle className="w-4 h-4" />
          <AlertDescription>
            En cas d'urgence, contactez immédiatement les secours au 1730 ou 18.
          </AlertDescription>
        </Alert>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="incidentType">Type d'incident</Label>
            <Select value={formData.type} onValueChange={(value) => setFormData(prev => ({ ...prev, type: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="Choisir le type d'incident" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Panne">🔧 Panne mécanique</SelectItem>
                <SelectItem value="Accident">⚠️ Accident</SelectItem>
                <SelectItem value="Retard">⏰ Retard important</SelectItem>
                <SelectItem value="Problème passager">👥 Problème avec passager</SelectItem>
                <SelectItem value="Route">🛣️ Problème de route</SelectItem>
                <SelectItem value="Météo">🌧️ Conditions météorologiques</SelectItem>
                <SelectItem value="Autre">📝 Autre</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="severity">Gravité</Label>
            <Select value={formData.severity} onValueChange={(value) => setFormData(prev => ({ ...prev, severity: value }))}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">🟢 Faible - Information</SelectItem>
                <SelectItem value="medium">🟡 Moyenne - Attention requise</SelectItem>
                <SelectItem value="high">🔴 Élevée - Intervention urgente</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="description">Description détaillée</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Décrivez l'incident de manière précise..."
              rows={4}
              required
            />
          </div>

          <div className="bg-gray-50 p-3 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <Label htmlFor="includeLocation" className="text-sm">Inclure la position GPS</Label>
              <input
                type="checkbox"
                id="includeLocation"
                checked={formData.includeLocation}
                onChange={(e) => setFormData(prev => ({ ...prev, includeLocation: e.target.checked }))}
                className="rounded"
              />
            </div>
            {formData.includeLocation && (
              <div className="text-xs text-gray-600 font-mono space-y-1">
                <div>📍 {currentLocation.lat.toFixed(4)}°N, {currentLocation.lng.toFixed(4)}°E</div>
                <div>🚌 {busInfo.id} ({busInfo.immatriculation})</div>
                <div>🕒 {new Date().toLocaleString()}</div>
              </div>
            )}
          </div>

          <div className="flex space-x-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
              Annuler
            </Button>
            <Button 
              type="submit" 
              disabled={isLoading || !formData.type || !formData.description}
              className="flex-1 bg-red-600 hover:bg-red-700"
            >
              {isLoading ? 'Envoi...' : 'Signaler'}
            </Button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};