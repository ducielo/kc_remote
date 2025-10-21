import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Truck, Route, Users, AlertTriangle, Download, MapPin, Clock, Eye } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { toast } from 'sonner';
import { useOperationalData } from './contexts/OperationalDataContext';

export function DriverDashboardSimple() {
  const [activeTab, setActiveTab] = useState('overview');
  const [incidentReport, setIncidentReport] = useState('');
  const [incidentType, setIncidentType] = useState('');
  const [showPassengersDialog, setShowPassengersDialog] = useState(false);
  const [selectedTripForPassengers, setSelectedTripForPassengers] = useState<any>(null);

  // Utiliser le contexte opérationnel pour accéder aux réservations créées par l'Agent
  const { getAllReservations } = useOperationalData();
  
  // Récupérer toutes les réservations créées par l'Agent
  const allReservations = getAllReservations();

  const mockData = {
    assignedTrips: 2,
    totalPassengers: 67,
    completedTrips: 1,
    pendingTrips: 1
  };

  const todayTrips = [
    {
      id: 1,
      route: 'Libreville → Port-Gentil',
      departure: '08:00',
      arrival: 'Port-Gentil',
      departureTime: '08:00',
      passengers: 42,
      capacity: 50,
      status: 'completed',
      bus: 'KC-001'
    },
    {
      id: 2,
      route: 'Port-Gentil → Libreville',
      departure: '14:00',
      arrival: 'Libreville',
      departureTime: '14:00',
      passengers: 25,
      capacity: 50,
      status: 'pending',
      bus: 'KC-001'
    }
  ];

  const handleViewPassengers = (trip: any) => {
    setSelectedTripForPassengers(trip);
    setShowPassengersDialog(true);
  };

  // Générer des passagers fictifs pour la démo + réservations de l'Agent
  const generatePassengersForTrip = (trip: any) => {
    const passengers = [];
    const names = [
      'Jean Mbeng', 'Marie Obiang', 'Pierre Ndong', 'Sophie Ondo',
      'André Mba', 'Catherine Nguema', 'François Ella', 'Hélène Bongo',
      'Paul Engone', 'Juliette Mintsa', 'Michel Owono', 'Claire Nze'
    ];
    
    // Ajouter les passagers fictifs
    const passengerCount = trip.passengers || 0;
    for (let i = 0; i < Math.min(passengerCount, 10); i++) {
      passengers.push({
        id: `PAX${trip.id}-${i + 1}`,
        ticketNumber: `TKT-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
        name: names[i % names.length],
        seatNumber: `${Math.floor(i / 4) + 1}${String.fromCharCode(65 + (i % 4))}`,
        phone: `+241 0${Math.floor(Math.random() * 9) + 1} ${Math.floor(Math.random() * 90 + 10)} ${Math.floor(Math.random() * 90 + 10)} ${Math.floor(Math.random() * 90 + 10)}`,
        source: 'fictif'
      });
    }

    // Ajouter les réservations réelles créées par l'Agent (synchronisées en temps réel)
    allReservations.forEach((reservation, index) => {
      passengers.push({
        id: reservation.id,
        ticketNumber: reservation.ticketId || `TKT-${reservation.id.substr(-6).toUpperCase()}`,
        name: reservation.passengerName,
        seatNumber: reservation.seatNumber || `${Math.floor(index / 4) + 3}${String.fromCharCode(65 + (index % 4))}`,
        phone: reservation.phone,
        source: 'agent'
      });
    });

    return passengers;
  };

  const handleIncidentReport = () => {
    if (!incidentReport.trim() || !incidentType) {
      toast.error('Veuillez remplir tous les champs');
      return;
    }
    
    toast.success('Incident déclaré avec succès');
    setIncidentReport('');
    setIncidentType('');
  };

  return (
    <div className="space-y-6">
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
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
                    {mockData.assignedTrips}
                  </p>
                </div>
                <div className="p-3 bg-orange-100 rounded-lg">
                  <Route className="w-6 h-6 text-orange-600" />
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
                  <p className="text-sm text-gray-600">Total passagers</p>
                  <p className="text-2xl font-semibold text-gray-900">
                    {mockData.totalPassengers}
                  </p>
                </div>
                <div className="p-3 bg-blue-100 rounded-lg">
                  <Users className="w-6 h-6 text-blue-600" />
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
                  <p className="text-sm text-gray-600">Trajets complétés</p>
                  <p className="text-2xl font-semibold text-gray-900">
                    {mockData.completedTrips}
                  </p>
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
          transition={{ delay: 0.4 }}
        >
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">En attente</p>
                  <p className="text-2xl font-semibold text-gray-900">
                    {mockData.pendingTrips}
                  </p>
                </div>
                <div className="p-3 bg-yellow-100 rounded-lg">
                  <Clock className="w-6 h-6 text-yellow-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
          <TabsTrigger value="trips">Mes trajets</TabsTrigger>
          <TabsTrigger value="passengers">Passagers</TabsTrigger>
          <TabsTrigger value="incidents">Incidents</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Tableau de bord Chauffeur</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                  <h3 className="font-medium text-orange-800 mb-2">Fonctionnalités disponibles :</h3>
                  <ul className="text-sm text-orange-700 space-y-1">
                    <li>• Consultation des trajets assignés</li>
                    <li>• Téléchargement listes passagers</li>
                    <li>• Déclaration d'incidents route</li>
                    <li>• Mode hors ligne disponible</li>
                  </ul>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Button 
                    className="h-24 flex flex-col items-center justify-center bg-orange-600 hover:bg-orange-700"
                    onClick={() => setActiveTab('trips')}
                  >
                    <Route className="w-8 h-8 mb-2" />
                    Voir mes trajets
                  </Button>
                  <Button 
                    variant="outline"
                    className="h-24 flex flex-col items-center justify-center"
                    onClick={() => setActiveTab('incidents')}
                  >
                    <AlertTriangle className="w-8 h-8 mb-2" />
                    Déclarer un incident
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="trips" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Mes trajets du jour</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {todayTrips.map(trip => (
                  <div key={trip.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium flex items-center gap-2">
                          <MapPin className="w-4 h-4" />
                          {trip.route}
                        </h4>
                        <p className="text-sm text-gray-500 flex items-center gap-2 mt-1">
                          <Clock className="w-4 h-4" />
                          {trip.departure} - {trip.arrival} • Bus: {trip.bus}
                        </p>
                        <p className="text-sm text-gray-500 mt-1">
                          Passagers: {trip.passengers}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge 
                          variant={trip.status === 'completed' ? 'default' : 'secondary'}
                          className={trip.status === 'completed' ? 'bg-green-100 text-green-800' : ''}
                        >
                          {trip.status === 'completed' ? 'Terminé' : 'En attente'}
                        </Badge>
                        <Button variant="outline" size="sm">
                          <Download className="w-4 h-4 mr-2" />
                          Liste
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="passengers" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Listes de passagers</span>
                {allReservations.length > 0 && (
                  <Badge className="bg-green-100 text-green-800">
                    <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse mr-2"></span>
                    {allReservations.length} réservation(s) Agent synchronisée(s)
                  </Badge>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {todayTrips.map(trip => (
                  <div key={trip.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">{trip.route}</h4>
                        <p className="text-sm text-gray-500">
                          Départ: {trip.departure} • Bus: {trip.bus}
                        </p>
                        <p className="text-sm text-gray-500">
                          Passagers: {trip.passengers + allReservations.length}/{trip.capacity}
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleViewPassengers(trip)}
                        >
                          <Eye className="w-4 h-4 mr-2" />
                          Voir passagers
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => toast.success('Liste exportée en PDF')}
                        >
                          <Download className="w-4 h-4 mr-2" />
                          Télécharger PDF
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="incidents" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Déclaration d'incident</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Type d'incident</label>
                  <Select value={incidentType} onValueChange={setIncidentType}>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner le type d'incident" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="mechanical">Problème mécanique</SelectItem>
                      <SelectItem value="traffic">Embouteillage</SelectItem>
                      <SelectItem value="weather">Météo</SelectItem>
                      <SelectItem value="road">État de la route</SelectItem>
                      <SelectItem value="passenger">Incident passager</SelectItem>
                      <SelectItem value="other">Autre</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Description de l'incident</label>
                  <Textarea
                    value={incidentReport}
                    onChange={(e) => setIncidentReport(e.target.value)}
                    placeholder="Décrivez l'incident en détail..."
                    rows={4}
                  />
                </div>

                <Button 
                  onClick={handleIncidentReport}
                  className="w-full bg-red-600 hover:bg-red-700"
                >
                  <AlertTriangle className="w-4 h-4 mr-2" />
                  Déclarer l'incident
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Dialog Liste des passagers synchronisée */}
      <Dialog open={showPassengersDialog} onOpenChange={setShowPassengersDialog}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" style={{ color: 'rgba(192, 54, 24, 0.9)' }} />
              Liste des Passagers (Synchronisée en temps réel)
            </DialogTitle>
            <DialogDescription>
              {selectedTripForPassengers && (
                <>
                  {selectedTripForPassengers.route} • 
                  Départ: {selectedTripForPassengers.departure} • 
                  Bus: {selectedTripForPassengers.bus}
                </>
              )}
            </DialogDescription>
          </DialogHeader>

          {selectedTripForPassengers && (
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="text-sm text-gray-600">Total passagers</p>
                  <p className="text-2xl">{selectedTripForPassengers.passengers + allReservations.length}/{selectedTripForPassengers.capacity}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Places disponibles</p>
                  <p className="text-2xl">{selectedTripForPassengers.capacity - (selectedTripForPassengers.passengers + allReservations.length)}</p>
                </div>
                {allReservations.length > 0 && (
                  <div>
                    <p className="text-sm text-gray-600">Réservations Agent</p>
                    <p className="text-2xl text-green-600">{allReservations.length}</p>
                  </div>
                )}
              </div>

              <div className="border rounded-lg">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>#</TableHead>
                      <TableHead>N° Ticket</TableHead>
                      <TableHead>Nom du passager</TableHead>
                      <TableHead>Siège</TableHead>
                      <TableHead>Téléphone</TableHead>
                      <TableHead>Source</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {generatePassengersForTrip(selectedTripForPassengers).map((passenger, index) => (
                      <TableRow key={passenger.id}>
                        <TableCell>{index + 1}</TableCell>
                        <TableCell>
                          <code className="px-2 py-1 bg-gray-100 rounded text-sm">
                            {passenger.ticketNumber}
                          </code>
                        </TableCell>
                        <TableCell>{passenger.name}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{passenger.seatNumber}</Badge>
                        </TableCell>
                        <TableCell className="text-sm text-gray-600">
                          {passenger.phone}
                        </TableCell>
                        <TableCell>
                          {passenger.source === 'agent' ? (
                            <Badge className="bg-green-100 text-green-800">
                              Agent
                            </Badge>
                          ) : (
                            <Badge variant="secondary">
                              Système
                            </Badge>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    toast.success('Liste exportée en PDF');
                  }}
                >
                  <Download className="w-4 h-4 mr-2" />
                  Exporter en PDF
                </Button>
                <Button
                  onClick={() => setShowPassengersDialog(false)}
                  style={{ backgroundColor: 'rgba(192, 54, 24, 0.9)' }}
                >
                  Fermer
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}