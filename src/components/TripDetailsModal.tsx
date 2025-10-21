import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  X, 
  MapPin, 
  Clock, 
  Calendar, 
  Users, 
  Wifi, 
  Coffee, 
  Zap, 
  Shield,
  CreditCard,
  Phone,
  Mail,
  User,
  Ticket,
  Eye
} from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { toast } from 'sonner';
import { useOperationalData } from './contexts/OperationalDataContext';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { ScrollArea } from './ui/scroll-area';

interface Trip {
  id: string;
  departure: string;
  arrival: string;
  departureTime: string;
  arrivalTime: string;
  duration: string;
  date: string;
  price: number;
  currency: string;
  availableSeats: number;
  busType: string;
  amenities: string[];
}

interface TripDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  trip: Trip | null;
}

export const TripDetailsModal: React.FC<TripDetailsModalProps> = ({ isOpen, onClose, trip }) => {
  const [step, setStep] = useState<'details' | 'booking' | 'payment'>('details');
  const [passengerInfo, setPassengerInfo] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    idNumber: '',
    seatPreference: 'window'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // 🔥 Récupérer les réservations depuis le contexte
  const { getTripReservations } = useOperationalData();
  const [tripReservations, setTripReservations] = useState<any[]>([]);
  
  // 🔥 Écouter les nouvelles réservations créées par l'agent
  useEffect(() => {
    const handleNewReservation = (event: any) => {
      const { tripId } = event.detail;
      if (trip && trip.id === tripId) {
        // Recharger les réservations pour ce trajet
        setTripReservations(getTripReservations(trip.id));
        toast.info('Une nouvelle réservation a été ajoutée à ce trajet');
      }
    };
    
    window.addEventListener('agent:reservation:created', handleNewReservation);
    
    return () => {
      window.removeEventListener('agent:reservation:created', handleNewReservation);
    };
  }, [trip, getTripReservations]);
  
  // 🔥 Charger les réservations quand le modal s'ouvre
  useEffect(() => {
    if (trip && isOpen) {
      setTripReservations(getTripReservations(trip.id));
    }
  }, [trip, isOpen, getTripReservations]);

  const amenityIcons = {
    'WiFi gratuit': Wifi,
    'Collations': Coffee,
    'Prises électriques': Zap,
    'Assurance': Shield
  };

  const handleBooking = async () => {
    setIsSubmitting(true);
    
    // Simulation d'API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    toast.success('Réservation confirmée !', {
      description: `Votre billet pour ${trip?.departure} → ${trip?.arrival} a été réservé avec succès.`
    });
    
    setIsSubmitting(false);
    onClose();
    setStep('details');
    setPassengerInfo({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      idNumber: '',
      seatPreference: 'window'
    });
  };

  if (!isOpen || !trip) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden"
      >
        {/* Header */}
        <div 
          className="px-6 py-4 border-b flex items-center justify-between"
          style={{ backgroundColor: 'rgba(192, 54, 24, 0.9)' }}
        >
          <div className="text-white">
            <h2 className="text-lg font-semibold">
              {step === 'details' && 'Détails du trajet'}
              {step === 'booking' && 'Informations passager'}
              {step === 'payment' && 'Paiement'}
            </h2>
            <p className="text-sm opacity-90">{trip.departure} → {trip.arrival}</p>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:text-gray-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-80px)]">
          {step === 'details' && (
            <div className="space-y-6">
              <Tabs defaultValue="info" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="info">Informations</TabsTrigger>
                  <TabsTrigger value="passengers">
                    Passagers ({tripReservations.length})
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="info" className="space-y-6 mt-4">
                  {/* Trip Overview */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="text-center">
                        <p className="text-2xl font-bold">{trip.departureTime}</p>
                        <p className="text-sm text-gray-600">{trip.departure}</p>
                      </div>
                      <div className="flex-1 flex flex-col items-center">
                        <div className="w-full h-px bg-gray-300 relative">
                          <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white px-2">
                            <Clock className="w-4 h-4 text-gray-400" />
                          </div>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">{trip.duration}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-bold">{trip.arrivalTime}</p>
                        <p className="text-sm text-gray-600">{trip.arrival}</p>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  {/* Trip Info */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center space-x-3">
                      <Calendar className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="font-medium">Date</p>
                        <p className="text-sm text-gray-600">{trip.date}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Users className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="font-medium">Places disponibles</p>
                        <p className="text-sm text-gray-600">{trip.availableSeats - tripReservations.length} places</p>
                      </div>
                    </div>
                  </div>

                  {/* Bus Type & Amenities */}
                  <div>
                    <h3 className="font-medium mb-3">Type de bus et services</h3>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <p className="font-medium mb-2">{trip.busType}</p>
                      <div className="flex flex-wrap gap-2">
                        {trip.amenities.map((amenity) => {
                          const IconComponent = amenityIcons[amenity as keyof typeof amenityIcons];
                          return (
                            <Badge key={amenity} variant="secondary" className="flex items-center space-x-1">
                              {IconComponent && <IconComponent className="w-3 h-3" />}
                              <span>{amenity}</span>
                            </Badge>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  {/* Price */}
                  <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">Prix par personne</p>
                        <p className="text-2xl font-bold" style={{ color: 'rgba(192, 54, 24, 0.9)' }}>
                          {trip.price.toLocaleString()} {trip.currency}
                        </p>
                      </div>
                      <Button 
                        onClick={() => setStep('booking')}
                        style={{ backgroundColor: 'rgba(192, 54, 24, 0.9)' }}
                      >
                        Réserver maintenant
                      </Button>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="passengers" className="mt-4">
                  {/* 🔥 Liste des passagers réservés */}
                  {tripReservations.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      <Ticket className="w-12 h-12 mx-auto mb-3 opacity-50" />
                      <p>Aucune réservation pour ce trajet</p>
                    </div>
                  ) : (
                    <ScrollArea className="h-[400px]">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Ticket</TableHead>
                            <TableHead>Passager</TableHead>
                            <TableHead>Siège</TableHead>
                            <TableHead>Montant</TableHead>
                            <TableHead>Statut</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {tripReservations.map((reservation) => (
                            <TableRow key={reservation.id}>
                              <TableCell className="font-mono text-sm">
                                {reservation.ticketId}
                              </TableCell>
                              <TableCell>
                                <div>
                                  <p className="font-medium">{reservation.passengerName}</p>
                                  <p className="text-sm text-gray-500">{reservation.phone}</p>
                                </div>
                              </TableCell>
                              <TableCell>{reservation.seatNumber}</TableCell>
                              <TableCell>{reservation.amount.toLocaleString()} XAF</TableCell>
                              <TableCell>
                                <Badge variant={reservation.status === 'paid' ? 'default' : 'secondary'}>
                                  {reservation.status === 'paid' ? 'Payé' : 'En attente'}
                                </Badge>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </ScrollArea>
                  )}
                </TabsContent>
              </Tabs>
            </div>
          )}

          {step === 'booking' && (
            <div className="space-y-4">
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <h3 className="font-medium">Récapitulatif du trajet</h3>
                <p className="text-sm text-gray-600">{trip.departure} → {trip.arrival}</p>
                <p className="text-sm text-gray-600">{trip.date} à {trip.departureTime}</p>
                <p className="font-medium" style={{ color: 'rgba(192, 54, 24, 0.9)' }}>
                  {trip.price.toLocaleString()} {trip.currency}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">Prénom *</Label>
                  <Input
                    id="firstName"
                    value={passengerInfo.firstName}
                    onChange={(e) => setPassengerInfo({...passengerInfo, firstName: e.target.value})}
                    placeholder="Jean"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Nom *</Label>
                  <Input
                    id="lastName"
                    value={passengerInfo.lastName}
                    onChange={(e) => setPassengerInfo({...passengerInfo, lastName: e.target.value})}
                    placeholder="Mboma"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    id="email"
                    type="email"
                    value={passengerInfo.email}
                    onChange={(e) => setPassengerInfo({...passengerInfo, email: e.target.value})}
                    placeholder="jean.mboma@email.com"
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Téléphone *</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    id="phone"
                    value={passengerInfo.phone}
                    onChange={(e) => setPassengerInfo({...passengerInfo, phone: e.target.value})}
                    placeholder="+241 XX XX XX XX"
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="idNumber">Numéro de pièce d'identité *</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    id="idNumber"
                    value={passengerInfo.idNumber}
                    onChange={(e) => setPassengerInfo({...passengerInfo, idNumber: e.target.value})}
                    placeholder="CNI ou Passeport"
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="flex justify-between pt-4">
                <Button variant="outline" onClick={() => setStep('details')}>
                  Retour
                </Button>
                <Button 
                  onClick={() => setStep('payment')}
                  style={{ backgroundColor: 'rgba(192, 54, 24, 0.9)' }}
                  disabled={!passengerInfo.firstName || !passengerInfo.lastName || !passengerInfo.email || !passengerInfo.phone || !passengerInfo.idNumber}
                >
                  Continuer vers le paiement
                </Button>
              </div>
            </div>
          )}

          {step === 'payment' && (
            <div className="space-y-6">
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-medium mb-2">Récapitulatif de la réservation</h3>
                <div className="space-y-1 text-sm">
                  <p><span className="font-medium">Passager:</span> {passengerInfo.firstName} {passengerInfo.lastName}</p>
                  <p><span className="font-medium">Trajet:</span> {trip.departure} → {trip.arrival}</p>
                  <p><span className="font-medium">Date:</span> {trip.date} à {trip.departureTime}</p>
                  <p><span className="font-medium">Email:</span> {passengerInfo.email}</p>
                  <p><span className="font-medium">Téléphone:</span> {passengerInfo.phone}</p>
                </div>
              </div>

              <div className="border border-orange-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-medium">Méthodes de paiement</h3>
                  <CreditCard className="w-5 h-5 text-gray-400" />
                </div>
                
                <div className="space-y-3">
                  <div className="p-3 border rounded-lg bg-orange-50 border-orange-200">
                    <p className="font-medium">Paiement Mobile Money</p>
                    <p className="text-sm text-gray-600">Airtel Money, Moov Money</p>
                  </div>
                  <div className="p-3 border rounded-lg">
                    <p className="font-medium">Carte bancaire</p>
                    <p className="text-sm text-gray-600">Visa, Mastercard</p>
                  </div>
                  <div className="p-3 border rounded-lg">
                    <p className="font-medium">Paiement à la gare</p>
                    <p className="text-sm text-gray-600">Espèces lors de l'embarquement</p>
                  </div>
                </div>
              </div>

              <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <span className="font-medium">Total à payer:</span>
                  <span className="text-xl font-bold" style={{ color: 'rgba(192, 54, 24, 0.9)' }}>
                    {trip.price.toLocaleString()} {trip.currency}
                  </span>
                </div>
              </div>

              <div className="flex justify-between">
                <Button variant="outline" onClick={() => setStep('booking')}>
                  Retour
                </Button>
                <Button 
                  onClick={handleBooking}
                  disabled={isSubmitting}
                  style={{ backgroundColor: 'rgba(192, 54, 24, 0.9)' }}
                >
                  {isSubmitting ? 'Confirmation...' : 'Confirmer la réservation'}
                </Button>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};