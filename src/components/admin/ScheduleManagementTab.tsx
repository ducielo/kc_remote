import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Plus, Edit, Clock, Calendar, Bus, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Label } from '../ui/label';
import { Switch } from '../ui/switch';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { toast } from 'sonner';
import { useOperationalData } from '../contexts/OperationalDataContext';

export const ScheduleManagementTab: React.FC = () => {
  const { trips, buses, drivers } = useOperationalData();
  const [showNewScheduleModal, setShowNewScheduleModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  // Générer des horaires d'exemple
  const schedules = trips.map((trip, index) => ({
    id: `schedule-${trip.id}`,
    tripId: trip.id,
    trip: trip,
    date: selectedDate,
    departureTime: trip.departureTime,
    arrivalTime: trip.arrivalTime,
    frequency: index % 3 === 0 ? 'daily' : index % 3 === 1 ? 'weekly' : 'custom',
    daysOfWeek: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'],
    isActive: Math.random() > 0.2,
    driver: drivers[index % drivers.length],
    bus: buses.find(b => b.id === trip.busId) || buses[0]
  }));

  const handleCreateSchedule = () => {
    // API: createSchedule()
    toast.success('Horaire créé avec succès');
    setShowNewScheduleModal(false);
  };

  const toggleScheduleStatus = (scheduleId: string) => {
    // API: updateScheduleStatus(scheduleId)
    toast.success('Statut de l\'horaire mis à jour');
  };

  const weekDays = [
    { id: 'monday', label: 'Lundi', short: 'Lun' },
    { id: 'tuesday', label: 'Mardi', short: 'Mar' },
    { id: 'wednesday', label: 'Mercredi', short: 'Mer' },
    { id: 'thursday', label: 'Jeudi', short: 'Jeu' },
    { id: 'friday', label: 'Vendredi', short: 'Ven' },
    { id: 'saturday', label: 'Samedi', short: 'Sam' },
    { id: 'sunday', label: 'Dimanche', short: 'Dim' }
  ];

  return (
    <div className="space-y-6">
      {/* En-tête avec statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Horaires Actifs</p>
                <p className="text-2xl font-bold text-green-600">
                  {schedules.filter(s => s.isActive).length}
                </p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Horaires Quotidiens</p>
                <p className="text-2xl font-bold text-blue-600">
                  {schedules.filter(s => s.frequency === 'daily').length}
                </p>
              </div>
              <Calendar className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Bus en Service</p>
                <p className="text-2xl font-bold text-purple-600">
                  {new Set(schedules.filter(s => s.isActive).map(s => s.bus.id)).size}
                </p>
              </div>
              <Bus className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Chauffeurs Actifs</p>
                <p className="text-2xl font-bold text-orange-600">
                  {new Set(schedules.filter(s => s.isActive).map(s => s.driver.id)).size}
                </p>
              </div>
              <CheckCircle className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filtres et actions */}
      <div className="flex justify-between items-center">
        <div className="flex space-x-4">
          <div className="space-y-2">
            <Label htmlFor="date-filter">Date</Label>
            <Input
              id="date-filter"
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-48"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="frequency-filter">Fréquence</Label>
            <Select>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Toutes les fréquences" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Toutes les fréquences</SelectItem>
                <SelectItem value="daily">Quotidien</SelectItem>
                <SelectItem value="weekly">Hebdomadaire</SelectItem>
                <SelectItem value="custom">Personnalisé</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <Dialog open={showNewScheduleModal} onOpenChange={setShowNewScheduleModal}>
          <DialogTrigger asChild>
            <Button style={{ backgroundColor: '#C03618' }} className="text-white">
              <Plus className="h-4 w-4 mr-2" />
              Nouvel Horaire
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Créer un nouvel horaire</DialogTitle>
              <DialogDescription>
                Planifiez les heures de départ et d'arrivée pour vos trajets
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-6 py-4">
              {/* Sélection du trajet */}
              <div className="space-y-4">
                <h4 className="font-semibold text-lg">Trajet et véhicule</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="route">Trajet</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Choisir un trajet..." />
                      </SelectTrigger>
                      <SelectContent>
                        {trips.map((trip) => (
                          <SelectItem key={trip.id} value={trip.id}>
                            {trip.departure} → {trip.arrival} ({trip.price.toLocaleString()} FCFA)
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="bus">Bus assigné</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner un bus..." />
                      </SelectTrigger>
                      <SelectContent>
                        {buses.filter(b => b.status === 'active').map((bus) => (
                          <SelectItem key={bus.id} value={bus.id}>
                            {bus.plateNumber} - {bus.capacity} places ({bus.type})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="driver">Chauffeur assigné</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner un chauffeur..." />
                    </SelectTrigger>
                    <SelectContent>
                      {drivers.filter(d => d.status === 'active').map((driver) => (
                        <SelectItem key={driver.id} value={driver.id}>
                          {driver.name} - Licence: {driver.licenseNumber}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Horaires */}
              <div className="space-y-4">
                <h4 className="font-semibold text-lg">Horaires</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="departure-time">Heure de départ</Label>
                    <Input id="departure-time" type="time" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="arrival-time">Heure d'arrivée estimée</Label>
                    <Input id="arrival-time" type="time" />
                  </div>
                </div>
              </div>

              {/* Fréquence */}
              <div className="space-y-4">
                <h4 className="font-semibold text-lg">Fréquence et récurrence</h4>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="frequency">Type de fréquence</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="daily">Quotidien</SelectItem>
                        <SelectItem value="weekly">Hebdomadaire</SelectItem>
                        <SelectItem value="custom">Personnalisé</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Jours de fonctionnement</Label>
                    <div className="grid grid-cols-4 gap-4">
                      {weekDays.map((day) => (
                        <div key={day.id} className="flex items-center space-x-2">
                          <input 
                            type="checkbox" 
                            id={day.id} 
                            className="rounded" 
                            defaultChecked={day.id !== 'saturday' && day.id !== 'sunday'}
                          />
                          <Label htmlFor={day.id} className="text-sm">{day.short}</Label>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Période de validité */}
              <div className="space-y-4">
                <h4 className="font-semibold text-lg">Période de validité</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="start-date">Date de début</Label>
                    <Input id="start-date" type="date" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="end-date">Date de fin (optionnel)</Label>
                    <Input id="end-date" type="date" />
                  </div>
                </div>
              </div>

              {/* Options */}
              <div className="space-y-4">
                <h4 className="font-semibold text-lg">Options</h4>
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Switch id="active-schedule" defaultChecked />
                    <Label htmlFor="active-schedule">Horaire actif</Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Switch id="auto-booking" />
                    <Label htmlFor="auto-booking">Réservation automatique ouverte</Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Switch id="notifications" defaultChecked />
                    <Label htmlFor="notifications">Notifications automatiques</Label>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex justify-end space-x-2 pt-4 border-t">
              <Button variant="outline" onClick={() => setShowNewScheduleModal(false)}>
                Annuler
              </Button>
              <Button 
                style={{ backgroundColor: '#C03618' }} 
                className="text-white"
                onClick={handleCreateSchedule}
              >
                <Clock className="h-4 w-4 mr-2" />
                Créer l'horaire
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Vue des horaires en grille */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {schedules.map((schedule) => (
          <motion.div
            key={schedule.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Card className={`relative ${schedule.isActive ? 'border-green-200 bg-green-50' : 'border-gray-200'}`}>
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-base">
                      {schedule.trip.departure} → {schedule.trip.arrival}
                    </CardTitle>
                    <CardDescription>
                      Bus #{schedule.bus.plateNumber}
                    </CardDescription>
                  </div>
                  <Badge variant={schedule.isActive ? 'default' : 'secondary'}>
                    {schedule.isActive ? 'Actif' : 'Inactif'}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-2">
                    <Clock className="h-4 w-4 text-gray-500" />
                    <span className="text-sm text-gray-600">Départ:</span>
                  </div>
                  <span className="font-semibold">{schedule.departureTime}</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-2">
                    <Clock className="h-4 w-4 text-gray-500" />
                    <span className="text-sm text-gray-600">Arrivée:</span>
                  </div>
                  <span className="font-semibold">{schedule.arrivalTime}</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4 text-gray-500" />
                    <span className="text-sm text-gray-600">Fréquence:</span>
                  </div>
                  <Badge variant="outline">
                    {schedule.frequency === 'daily' ? 'Quotidien' : 
                     schedule.frequency === 'weekly' ? 'Hebdomadaire' : 'Personnalisé'}
                  </Badge>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Chauffeur:</span>
                  <span className="text-sm font-medium">{schedule.driver.name}</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Places:</span>
                  <span className="text-sm font-medium">
                    {schedule.trip.occupiedSeats}/{schedule.trip.capacity}
                  </span>
                </div>
                
                <div className="flex justify-between items-center pt-2">
                  <div className="flex space-x-1">
                    <Button variant="outline" size="sm">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm">
                      <Calendar className="h-4 w-4" />
                    </Button>
                  </div>
                  <Switch
                    checked={schedule.isActive}
                    onCheckedChange={() => toggleScheduleStatus(schedule.id)}
                  />
                </div>
                
                {/* Jours de la semaine */}
                <div className="pt-2 border-t">
                  <div className="flex space-x-1">
                    {weekDays.map((day) => (
                      <div
                        key={day.id}
                        className={`text-xs px-1 py-1 rounded ${
                          schedule.daysOfWeek.includes(day.id)
                            ? 'bg-green-100 text-green-700'
                            : 'bg-gray-100 text-gray-500'
                        }`}
                      >
                        {day.short}
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
};