import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Truck,
  Calendar,
  Users,
  MapPin,
  Clock,
  AlertTriangle,
  FileText,
  Download,
  Wifi,
  WifiOff,
  Battery,
  Navigation,
  Wrench,
  AlertCircle,
  CheckCircle,
  XCircle,
  Phone,
  Camera,
  Send,
  LogOut,
  Fuel,
  Gauge,
  Shield,
  Star,
  Route,
  Info,
  X,
  Loader2,
  Check,
  Eye,
  Plus
} from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { ScrollArea } from './ui/scroll-area';
import { Separator } from './ui/separator';
import { Progress } from './ui/progress';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { toast } from 'sonner';
import { useOperationalData } from './contexts/OperationalDataContext';

interface DriverDashboardProps {
  isOpen: boolean;
  onClose: () => void;
  driverId: string;
}

interface Incident {
  id: string;
  type: 'mechanical' | 'road' | 'passenger' | 'weather' | 'other';
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  location: string;
  reportedAt: Date;
  status: 'reported' | 'acknowledged' | 'resolved';
}

interface VehicleStatus {
  fuelLevel: number;
  batteryLevel: number;
  temperature: number;
  lastMaintenance: Date;
  nextMaintenance: Date;
  kmSinceLastMaintenance: number;
}

export const DriverDashboard: React.FC<DriverDashboardProps> = ({ isOpen, onClose, driverId }) => {
  const { trips, getDriverTrips } = useOperationalData();
  
  // States
  const [activeTab, setActiveTab] = useState('trips');
  const [isOnline, setIsOnline] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedTrip, setSelectedTrip] = useState<any>(null);
  const [showIncidentDialog, setShowIncidentDialog] = useState(false);
  const [showTripDetails, setShowTripDetails] = useState(false);
  
  // Incident form
  const [incidentForm, setIncidentForm] = useState<Partial<Incident>>({
    type: 'mechanical',
    severity: 'medium',
    description: '',
    location: ''
  });

  // Mock driver data
  const driverInfo = {
    id: driverId,
    name: 'Paul Ekomy',
    license: 'GB123456',
    phone: '+241 06 78 90 12',
    rating: 4.7,
    totalTrips: 1247,
    experience: '8 ans'
  };

  // Mock vehicle status
  const [vehicleStatus] = useState<VehicleStatus>({
    fuelLevel: 85,
    batteryLevel: 92,
    temperature: 87,
    lastMaintenance: new Date('2025-01-01'),
    nextMaintenance: new Date('2025-03-01'),
    kmSinceLastMaintenance: 15420
  });

  // Mock assigned trips
  const [assignedTrips] = useState([
    {
      id: 'trip1',
      departure: 'Libreville',
      arrival: 'Port-Gentil',
      date: '2025-01-16',
      departureTime: '08:00',
      arrivalTime: '14:30',
      bus: {
        registration: 'KC-001',
        model: 'Mercedes Sprinter',
        capacity: 50
      },
      passengers: 45,
      status: 'scheduled',
      distance: '320 km',
      estimatedDuration: '6h 30min'
    },
    {
      id: 'trip2',
      departure: 'Port-Gentil',
      arrival: 'Libreville',
      date: '2025-01-16',
      departureTime: '16:00',
      arrivalTime: '22:30',
      bus: {
        registration: 'KC-001',
        model: 'Mercedes Sprinter',
        capacity: 50
      },
      passengers: 38,
      status: 'scheduled',
      distance: '320 km',
      estimatedDuration: '6h 30min'
    }
  ]);

  // Mock passenger list
  const [passengerList] = useState([
    {
      id: 'p1',
      name: 'Jean Mboma',
      phone: '+241 06 12 34 56',
      seatNumber: 'A12',
      ticketId: 'TK001',
      status: 'confirmed'
    },
    {
      id: 'p2',
      name: 'Marie Nkomo',
      phone: '+241 06 23 45 67',
      seatNumber: 'B05',
      ticketId: 'TK002',
      status: 'confirmed'
    },
    {
      id: 'p3',
      name: 'Paul Akoue',
      phone: '+241 06 34 56 78',
      seatNumber: 'C08',
      ticketId: 'TK003',
      status: 'pending'
    }
  ]);

  // Check online status
  useEffect(() => {
    const checkOnlineStatus = () => {
      setIsOnline(navigator.onLine);
    };

    window.addEventListener('online', checkOnlineStatus);
    window.addEventListener('offline', checkOnlineStatus);

    return () => {
      window.removeEventListener('online', checkOnlineStatus);
      window.removeEventListener('offline', checkOnlineStatus);
    };
  }, []);

  // Download passenger list
  const handleDownloadPassengerList = async (tripId: string) => {
    setIsLoading(true);
    try {
      // API: downloadPassengerList(tripId)
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast.success('Liste des passagers téléchargée');
      console.log(`Driver ${driverId} downloaded passenger list for trip ${tripId}`);
    } catch (error) {
      if (!isOnline) {
        toast.info('Liste sauvegardée pour synchronisation ultérieure');
      } else {
        toast.error('Erreur lors du téléchargement');
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Report incident
  const handleReportIncident = async () => {
    if (!incidentForm.description || !incidentForm.location) {
      toast.error('Veuillez remplir tous les champs obligatoires');
      return;
    }

    setIsLoading(true);
    try {
      // API: reportIncident(incidentForm)
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const newIncident: Incident = {
        id: `INC${Date.now()}`,
        type: incidentForm.type as any,
        severity: incidentForm.severity as any,
        description: incidentForm.description!,
        location: incidentForm.location!,
        reportedAt: new Date(),
        status: 'reported'
      };

      toast.success('Incident signalé avec succès');
      
      // Reset form and close dialog
      setIncidentForm({
        type: 'mechanical',
        severity: 'medium',
        description: '',
        location: ''
      });
      setShowIncidentDialog(false);
      
      console.log(`Driver ${driverId} reported incident:`, newIncident);
    } catch (error) {
      if (!isOnline) {
        toast.info('Incident sauvegardé pour envoi ultérieur');
        setShowIncidentDialog(false);
      } else {
        toast.error('Erreur lors du signalement');
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Start trip
  const handleStartTrip = async (tripId: string) => {
    setIsLoading(true);
    try {
      // API: startTrip(tripId)
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast.success('Trajet démarré');
      console.log(`Driver ${driverId} started trip ${tripId}`);
    } catch (error) {
      toast.error('Erreur lors du démarrage');
    } finally {
      setIsLoading(false);
    }
  };

  // End trip
  const handleEndTrip = async (tripId: string) => {
    setIsLoading(true);
    try {
      // API: endTrip(tripId)
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast.success('Trajet terminé');
      console.log(`Driver ${driverId} ended trip ${tripId}`);
    } catch (error) {
      toast.error('Erreur lors de la finalisation');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-50 z-50 overflow-auto dashboard-modal">
      {/* Header */}
      <header className="bg-white border-b px-8 py-6 sticky top-0 z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3">
              <div 
                className="p-2 rounded-lg text-white"
                style={{ backgroundColor: 'rgba(192, 54, 24, 0.9)' }}
              >
                <Truck className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-2xl font-semibold text-gray-900">Dashboard Chauffeur</h1>
                <p className="text-gray-600">Interface mobile terrain</p>
              </div>
            </div>
            
            {/* Online Status */}
            <div className={`flex items-center space-x-2 px-3 py-1 rounded-full text-sm ${
              isOnline ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
            }`}>
              {isOnline ? (
                <>
                  <Wifi className="w-4 h-4" />
                  <span>En ligne</span>
                </>
              ) : (
                <>
                  <WifiOff className="w-4 h-4" />
                  <span>Hors ligne</span>
                </>
              )}
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <p className="text-sm font-medium text-gray-900">{driverInfo.name}</p>
              <p className="text-xs text-gray-500">Permis: {driverInfo.license}</p>
            </div>
            <Button variant="outline" onClick={onClose}>
              <X className="w-4 h-4 mr-2" />
              Fermer
            </Button>
          </div>
        </div>
      </header>

      <main className="p-8 max-w-7xl mx-auto">
        {/* Driver Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Trajets assignés</p>
                    <p className="text-2xl font-semibold text-gray-900">
                      {assignedTrips.length}
                    </p>
                  </div>
                  <div className="p-3 bg-blue-100 rounded-lg">
                    <Route className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Véhicule</p>
                    <p className="text-2xl font-semibold text-gray-900">KC-001</p>
                  </div>
                  <div className="p-3 bg-green-100 rounded-lg">
                    <Truck className="w-6 h-6 text-green-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Note chauffeur</p>
                    <div className="flex items-center space-x-1">
                      <p className="text-2xl font-semibold text-gray-900">{driverInfo.rating}</p>
                      <Star className="w-5 h-5 text-yellow-500 fill-current" />
                    </div>
                  </div>
                  <div className="p-3 bg-yellow-100 rounded-lg">
                    <Star className="w-6 h-6 text-yellow-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Expérience</p>
                    <p className="text-2xl font-semibold text-gray-900">{driverInfo.experience}</p>
                  </div>
                  <div className="p-3 bg-purple-100 rounded-lg">
                    <Shield className="w-6 h-6 text-purple-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Vehicle Status */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Gauge className="w-5 h-5" />
              <span>État du véhicule KC-001</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Carburant</span>
                  <span className="text-sm text-gray-600">{vehicleStatus.fuelLevel}%</span>
                </div>
                <Progress value={vehicleStatus.fuelLevel} className="mb-2" />
                <div className="flex items-center space-x-2">
                  <Fuel className="w-4 h-4 text-blue-600" />
                  <span className="text-xs text-gray-500">Autonomie: ~400km</span>
                </div>
              </div>
              
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Batterie</span>
                  <span className="text-sm text-gray-600">{vehicleStatus.batteryLevel}%</span>
                </div>
                <Progress value={vehicleStatus.batteryLevel} className="mb-2" />
                <div className="flex items-center space-x-2">
                  <Battery className="w-4 h-4 text-green-600" />
                  <span className="text-xs text-gray-500">État excellent</span>
                </div>
              </div>
              
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Température moteur</span>
                  <span className="text-sm text-gray-600">{vehicleStatus.temperature}°C</span>
                </div>
                <Progress value={(vehicleStatus.temperature / 120) * 100} className="mb-2" />
                <div className="flex items-center space-x-2">
                  <Gauge className="w-4 h-4 text-orange-600" />
                  <span className="text-xs text-gray-500">Température normale</span>
                </div>
              </div>
            </div>
            
            <Separator className="my-6" />
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <p className="text-gray-600">Dernière révision</p>
                <p className="font-medium">{vehicleStatus.lastMaintenance.toLocaleDateString('fr-FR')}</p>
              </div>
              <div>
                <p className="text-gray-600">Prochaine révision</p>
                <p className="font-medium">{vehicleStatus.nextMaintenance.toLocaleDateString('fr-FR')}</p>
              </div>
              <div>
                <p className="text-gray-600">Kilométrage depuis révision</p>
                <p className="font-medium">{vehicleStatus.kmSinceLastMaintenance.toLocaleString()} km</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="trips">Mes trajets</TabsTrigger>
            <TabsTrigger value="passengers">Listes passagers</TabsTrigger>
            <TabsTrigger value="incidents">Signaler incident</TabsTrigger>
          </TabsList>

          {/* Trips Tab */}
          <TabsContent value="trips" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Calendar className="w-5 h-5" />
                  <span>Trajets assignés</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {assignedTrips.map((trip) => (
                    <div key={trip.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-4 mb-2">
                            <h4 className="font-medium text-lg">{trip.departure} → {trip.arrival}</h4>
                            <Badge variant={trip.status === 'scheduled' ? 'default' : 'secondary'}>
                              {trip.status === 'scheduled' ? 'Programmé' : trip.status}
                            </Badge>
                          </div>
                          
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600">
                            <div>
                              <p className="font-medium">Date</p>
                              <p>{new Date(trip.date).toLocaleDateString('fr-FR')}</p>
                            </div>
                            <div>
                              <p className="font-medium">Départ</p>
                              <p>{trip.departureTime}</p>
                            </div>
                            <div>
                              <p className="font-medium">Arrivée</p>
                              <p>{trip.arrivalTime}</p>
                            </div>
                            <div>
                              <p className="font-medium">Passagers</p>
                              <p>{trip.passengers}/{trip.bus.capacity}</p>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setSelectedTrip(trip);
                              setShowTripDetails(true);
                            }}
                          >
                            <Eye className="w-4 h-4 mr-2" />
                            Détails
                          </Button>
                          
                          {trip.status === 'scheduled' && (
                            <Button
                              onClick={() => handleStartTrip(trip.id)}
                              disabled={isLoading}
                              style={{ backgroundColor: 'rgba(192, 54, 24, 0.9)' }}
                            >
                              {isLoading ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                              ) : (
                                <>
                                  <Check className="w-4 h-4 mr-2" />
                                  Démarrer
                                </>
                              )}
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Passengers Tab */}
          <TabsContent value="passengers" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center space-x-2">
                    <Users className="w-5 h-5" />
                    <span>Liste des passagers</span>
                  </CardTitle>
                  <Button
                    onClick={() => handleDownloadPassengerList('trip1')}
                    disabled={isLoading}
                    style={{ backgroundColor: 'rgba(192, 54, 24, 0.9)' }}
                  >
                    {isLoading ? (
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      <Download className="w-4 h-4 mr-2" />
                    )}
                    Télécharger PDF
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-64">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Passager</TableHead>
                        <TableHead>Téléphone</TableHead>
                        <TableHead>Siège</TableHead>
                        <TableHead>Ticket</TableHead>
                        <TableHead>Statut</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {passengerList.map((passenger) => (
                        <TableRow key={passenger.id}>
                          <TableCell className="font-medium">{passenger.name}</TableCell>
                          <TableCell>{passenger.phone}</TableCell>
                          <TableCell>{passenger.seatNumber}</TableCell>
                          <TableCell>{passenger.ticketId}</TableCell>
                          <TableCell>
                            <Badge variant={passenger.status === 'confirmed' ? 'default' : 'secondary'}>
                              {passenger.status === 'confirmed' ? 'Confirmé' : 'En attente'}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </ScrollArea>
                
                {!isOnline && (
                  <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <WifiOff className="w-5 h-5 text-yellow-600" />
                      <p className="text-sm text-yellow-800">
                        Mode hors ligne activé. Les données sont disponibles localement.
                      </p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Incidents Tab */}
          <TabsContent value="incidents" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <AlertTriangle className="w-5 h-5" />
                  <span>Signaler un incident</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div>
                    <Label htmlFor="incidentType">Type d'incident</Label>
                    <Select 
                      value={incidentForm.type} 
                      onValueChange={(value) => setIncidentForm(prev => ({ ...prev, type: value as any }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="mechanical">Problème mécanique</SelectItem>
                        <SelectItem value="road">Problème routier</SelectItem>
                        <SelectItem value="passenger">Incident passager</SelectItem>
                        <SelectItem value="weather">Conditions météo</SelectItem>
                        <SelectItem value="other">Autre</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="incidentSeverity">Gravité</Label>
                    <Select 
                      value={incidentForm.severity} 
                      onValueChange={(value) => setIncidentForm(prev => ({ ...prev, severity: value as any }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Faible</SelectItem>
                        <SelectItem value="medium">Moyenne</SelectItem>
                        <SelectItem value="high">Élevée</SelectItem>
                        <SelectItem value="critical">Critique</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="incidentLocation">Localisation</Label>
                    <Input
                      id="incidentLocation"
                      value={incidentForm.location}
                      onChange={(e) => setIncidentForm(prev => ({ ...prev, location: e.target.value }))}
                      placeholder="Ex: PK 45, route Libreville-Port-Gentil"
                    />
                  </div>
                  
                  <div>
                    <Label>Coordonnées GPS</Label>
                    <Button 
                      variant="outline" 
                      className="w-full"
                      onClick={() => {
                        if (navigator.geolocation) {
                          navigator.geolocation.getCurrentPosition((position) => {
                            const coords = `${position.coords.latitude}, ${position.coords.longitude}`;
                            setIncidentForm(prev => ({ ...prev, location: prev.location + ` (${coords})` }));
                            toast.success('Position GPS ajoutée');
                          });
                        }
                      }}
                    >
                      <Navigation className="w-4 h-4 mr-2" />
                      Ajouter position GPS
                    </Button>
                  </div>
                  
                  <div className="md:col-span-2">
                    <Label htmlFor="incidentDescription">Description de l'incident</Label>
                    <Textarea
                      id="incidentDescription"
                      value={incidentForm.description}
                      onChange={(e) => setIncidentForm(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="Décrivez l'incident en détail..."
                      rows={4}
                    />
                  </div>
                </div>

                <div className="flex space-x-4">
                  <Button
                    onClick={handleReportIncident}
                    disabled={isLoading}
                    className="flex-1"
                    style={{ backgroundColor: 'rgba(192, 54, 24, 0.9)' }}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Envoi en cours...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4 mr-2" />
                        Signaler l'incident
                      </>
                    )}
                  </Button>
                  
                  <Button variant="outline" className="flex-shrink-0">
                    <Camera className="w-4 h-4 mr-2" />
                    Ajouter photo
                  </Button>
                </div>

                {!isOnline && (
                  <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <Info className="w-5 h-5 text-blue-600" />
                      <p className="text-sm text-blue-800">
                        Mode hors ligne : l'incident sera envoyé dès que la connexion sera rétablie.
                      </p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Trip Details Dialog */}
        <Dialog open={showTripDetails} onOpenChange={setShowTripDetails}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Détails du trajet</DialogTitle>
            </DialogHeader>
            {selectedTrip && (
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-gray-600">Itinéraire</Label>
                    <p className="font-semibold text-lg">
                      {selectedTrip.departure} → {selectedTrip.arrival}
                    </p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-600">Distance</Label>
                    <p className="font-semibold">{selectedTrip.distance}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-600">Date</Label>
                    <p className="font-semibold">
                      {new Date(selectedTrip.date).toLocaleDateString('fr-FR')}
                    </p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-600">Durée estimée</Label>
                    <p className="font-semibold">{selectedTrip.estimatedDuration}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-600">Heure de départ</Label>
                    <p className="font-semibold">{selectedTrip.departureTime}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-600">Heure d'arrivée</Label>
                    <p className="font-semibold">{selectedTrip.arrivalTime}</p>
                  </div>
                </div>

                <Separator />

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-gray-600">Bus assigné</Label>
                    <p className="font-semibold">{selectedTrip.bus.registration}</p>
                    <p className="text-sm text-gray-500">{selectedTrip.bus.model}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-600">Passagers</Label>
                    <p className="font-semibold">
                      {selectedTrip.passengers}/{selectedTrip.bus.capacity}
                    </p>
                  </div>
                </div>

                <div className="flex justify-end space-x-2">
                  <Button
                    onClick={() => handleDownloadPassengerList(selectedTrip.id)}
                    disabled={isLoading}
                    variant="outline"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Liste passagers
                  </Button>
                  <Button
                    onClick={() => handleStartTrip(selectedTrip.id)}
                    disabled={isLoading}
                    style={{ backgroundColor: 'rgba(192, 54, 24, 0.9)' }}
                  >
                    {isLoading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <>
                        <Check className="w-4 h-4 mr-2" />
                        Démarrer le trajet
                      </>
                    )}
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </main>
    </div>
  );
};