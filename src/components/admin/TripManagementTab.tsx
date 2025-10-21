import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Plus, Edit, Eye, Trash2, Route, MapPin, Clock, DollarSign, Users, Globe } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Switch } from '../ui/switch';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { toast } from 'sonner';
import { useOperationalData } from '../contexts/OperationalDataContext';

export const TripManagementTab: React.FC = () => {
  const { trips, buses, updateTripStatus, publishTripToPublic, updatePublicRoute, removePublicTrip } = useOperationalData();
  const [showNewTripModal, setShowNewTripModal] = useState(false);
  const [editingTrip, setEditingTrip] = useState<any>(null);

  const gabonCities = [
    { value: 'libreville', label: 'Libreville', province: 'Estuaire' },
    { value: 'port-gentil', label: 'Port-Gentil', province: 'Ogooué-Maritime' },
    { value: 'franceville', label: 'Franceville', province: 'Haut-Ogooué' },
    { value: 'oyem', label: 'Oyem', province: 'Woleu-Ntem' },
    { value: 'lambarene', label: 'Lambaréné', province: 'Moyen-Ogooué' },
    { value: 'mouila', label: 'Mouila', province: 'Ngounié' },
    { value: 'tchibanga', label: 'Tchibanga', province: 'Nyanga' },
    { value: 'koulamoutou', label: 'Koulamoutou', province: 'Ogooué-Lolo' },
    { value: 'makokou', label: 'Makokou', province: 'Ogooué-Ivindo' }
  ];

  const handleCreateTrip = () => {
    // API: createTrip()
    
    // 🔥 NEW: Publier automatiquement le trajet sur la page publique
    // Note: Dans un vrai scénario, vous créeriez d'abord le trajet via l'API
    // puis appelleriez publishTripToPublic avec les données du trajet créé
    
    toast.success('Trajet créé avec succès');
    setShowNewTripModal(false);
    
    // Exemple: publishTripToPublic(newTrip) sera appelé après la création API
  };

  const handleUpdateTrip = (tripId: string, updates: any) => {
    // API: updateTrip(tripId, updates)
    
    // 🔥 NEW: Mettre à jour le trajet sur la page publique
    const trip = trips.find(t => t.id === tripId);
    if (trip) {
      updatePublicRoute(trip);
    }
    
    toast.success('Trajet mis à jour');
    setEditingTrip(null);
  };

  const handleDeleteTrip = (tripId: string) => {
    // API: deleteTrip(tripId)
    
    // 🔥 NEW: Retirer le trajet de la page publique
    removePublicTrip(tripId);
    
    toast.success('Trajet supprimé');
  };

  return (
    <div className="space-y-8">
      {/* En-tête avec statistiques rapides */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Trajets Actifs</p>
                <p className="text-2xl font-bold text-green-600">
                  {trips.filter(t => t.status === 'active').length}
                </p>
              </div>
              <Route className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Trajets</p>
                <p className="text-2xl font-bold text-blue-600">{trips.length}</p>
              </div>
              <MapPin className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Revenus Journaliers</p>
                <p className="text-2xl font-bold text-purple-600">
                  {trips.reduce((sum, trip) => sum + (trip.price * trip.occupiedSeats), 0).toLocaleString()}
                </p>
              </div>
              <DollarSign className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Taux Moyen</p>
                <p className="text-2xl font-bold text-orange-600">
                  {Math.round((trips.reduce((sum, trip) => sum + trip.occupiedSeats, 0) / trips.reduce((sum, trip) => sum + trip.capacity, 0)) * 100) || 0}%
                </p>
              </div>
              <Users className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Actions et filtres */}
      <div className="flex justify-between items-center">
        <div className="flex space-x-6">
          <Select>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Filtrer par statut" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les trajets</SelectItem>
              <SelectItem value="active">Actifs seulement</SelectItem>
              <SelectItem value="inactive">Inactifs seulement</SelectItem>
            </SelectContent>
          </Select>

          <Select>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Filtrer par ville" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Toutes les villes</SelectItem>
              {gabonCities.map((city) => (
                <SelectItem key={city.value} value={city.value}>
                  {city.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          {/* 🔥 NEW: Bouton de test de synchronisation */}
          <Button 
            variant="outline"
            onClick={() => {
              const demoTrip: any = {
                id: `demo_${Date.now()}`,
                route: 'LBV-OYM',
                departure: 'Libreville',
                arrival: 'Oyem',
                departureTime: '09:00',
                arrivalTime: '15:00',
                date: new Date().toISOString().split('T')[0],
                maxCapacity: 40,
                currentOccupancy: 0,
                price: 18000,
                bus: buses[0],
                driver: { name: 'Demo Driver' },
                passengers: [],
                status: 'scheduled',
                createdAt: new Date()
              };
              publishTripToPublic(demoTrip);
              toast.success('🚀 Trajet de démonstration publié !', {
                description: 'Consultez la page publique pour voir le nouveau trajet'
              });
            }}
            title="Publier un trajet de démonstration"
          >
            <Globe className="h-4 w-4 mr-2" />
            Test Sync
          </Button>
        </div>

        <Dialog open={showNewTripModal} onOpenChange={setShowNewTripModal}>
          <DialogTrigger asChild>
            <Button style={{ backgroundColor: '#C03618' }} className="text-white">
              <Plus className="h-4 w-4 mr-2" />
              Nouveau Trajet
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Créer un nouveau trajet</DialogTitle>
              <DialogDescription>
                Configurez un nouveau trajet avec toutes ses caractéristiques
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-8 py-6">
              {/* Informations de base */}
              <div className="space-y-6">
                <h4 className="font-semibold text-lg">Informations de base</h4>
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="departure">Ville de départ</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner..." />
                      </SelectTrigger>
                      <SelectContent>
                        {gabonCities.map((city) => (
                          <SelectItem key={city.value} value={city.value}>
                            {city.label} ({city.province})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="arrival">Ville d'arrivée</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner..." />
                      </SelectTrigger>
                      <SelectContent>
                        {gabonCities.map((city) => (
                          <SelectItem key={city.value} value={city.value}>
                            {city.label} ({city.province})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {/* Détails du trajet */}
              <div className="space-y-6">
                <h4 className="font-semibold text-lg">Détails du trajet</h4>
                <div className="grid grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="price">Prix (FCFA)</Label>
                    <Input id="price" type="number" placeholder="15000" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="duration">Durée estimée (heures)</Label>
                    <Input id="duration" type="number" step="0.5" placeholder="4.5" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="distance">Distance (km)</Label>
                    <Input id="distance" type="number" placeholder="350" />
                  </div>
                </div>
              </div>

              {/* Bus et capacité */}
              <div className="space-y-6">
                <h4 className="font-semibold text-lg">Bus et capacité</h4>
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="bus-assignment">Bus assigné</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner un bus..." />
                      </SelectTrigger>
                      <SelectContent>
                        {buses.map((bus) => (
                          <SelectItem key={bus.id} value={bus.id}>
                            {bus.plateNumber} - {bus.capacity} places ({bus.type})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="capacity">Nombre de places</Label>
                    <Input id="capacity" type="number" placeholder="45" />
                  </div>
                </div>
              </div>

              {/* Description et notes */}
              <div className="space-y-6">
                <h4 className="font-semibold text-lg">Description</h4>
                <div className="space-y-4">
                  <Label htmlFor="description">Description du trajet</Label>
                  <Textarea 
                    id="description" 
                    placeholder="Trajet confortable avec climatisation, WiFi et arrêts dans les principales villes..."
                    rows={4}
                  />
                </div>
              </div>

              {/* Options avancées */}
              <div className="space-y-6">
                <h4 className="font-semibold text-lg">Options</h4>
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Switch id="active" />
                    <Label htmlFor="active">Trajet actif et disponible à la réservation</Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Switch id="wifi" />
                    <Label htmlFor="wifi">WiFi disponible</Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Switch id="ac" />
                    <Label htmlFor="ac">Climatisation</Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Switch id="meals" />
                    <Label htmlFor="meals">Collation incluse</Label>
                  </div>
                </div>
              </div>

              {/* Arrêts intermédiaires */}
              <div className="space-y-6">
                <h4 className="font-semibold text-lg">Arrêts intermédiaires (optionnel)</h4>
                <div className="space-y-4">
                  <Label>Villes d'arrêt</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {gabonCities.slice(0, 6).map((city) => (
                      <div key={city.value} className="flex items-center space-x-2">
                        <input type="checkbox" id={`stop-${city.value}`} className="rounded" />
                        <Label htmlFor={`stop-${city.value}`} className="text-sm">{city.label}</Label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex justify-end space-x-4 pt-6 border-t">
              <Button variant="outline" onClick={() => setShowNewTripModal(false)}>
                Annuler
              </Button>
              <Button 
                style={{ backgroundColor: '#C03618' }} 
                className="text-white"
                onClick={handleCreateTrip}
              >
                <Route className="h-4 w-4 mr-2" />
                Créer le trajet
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Table des trajets */}
      <Card>
        <CardHeader className="pb-6">
          <CardTitle className="text-xl">Liste des trajets</CardTitle>
          <CardDescription className="text-base">
            Gérez tous vos trajets depuis cette interface
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Trajet</TableHead>
                  <TableHead>Bus</TableHead>
                  <TableHead>Prix</TableHead>
                  <TableHead>Durée</TableHead>
                  <TableHead>Occupation</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {trips.map((trip) => (
                  <TableRow key={trip.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{trip.departure} → {trip.arrival}</div>
                        <div className="text-sm text-gray-500">{trip.distance}km</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">#{trip.busNumber}</div>
                        <div className="text-sm text-gray-500">{trip.capacity} places</div>
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">{trip.price.toLocaleString()} FCFA</TableCell>
                    <TableCell>{trip.duration}</TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{trip.occupiedSeats}/{trip.capacity}</div>
                        <div className="text-sm text-gray-500">
                          {Math.round((trip.occupiedSeats / trip.capacity) * 100)}%
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={trip.status === 'active' ? 'default' : 'secondary'}>
                        {trip.status === 'active' ? 'Actif' : 'Inactif'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => setEditingTrip(trip)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          style={{ backgroundColor: '#C03618', color: 'white' }}
                          onClick={() => {
                            publishTripToPublic(trip);
                            toast.success('Trajet publié sur la page publique');
                          }}
                          title="Publier sur la page publique"
                        >
                          <Globe className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleDeleteTrip(trip.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};