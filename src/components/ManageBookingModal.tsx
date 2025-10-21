import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  X, 
  Search, 
  Calendar, 
  MapPin, 
  User, 
  Phone, 
  Mail,
  Edit,
  Trash2,
  Download,
  QrCode
} from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { Alert, AlertDescription } from './ui/alert';
import { toast } from 'sonner';

interface Booking {
  id: string;
  referenceNumber: string;
  passenger: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
  };
  trip: {
    departure: string;
    arrival: string;
    date: string;
    departureTime: string;
    arrivalTime: string;
    duration: string;
  };
  status: 'confirmé' | 'en_attente' | 'annulé';
  price: number;
  currency: string;
  bookingDate: string;
  seatNumber?: string;
}

interface ManageBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ManageBookingModal: React.FC<ManageBookingModalProps> = ({ isOpen, onClose }) => {
  const [searchType, setSearchType] = useState<'reference' | 'email'>('reference');
  const [searchValue, setSearchValue] = useState('');
  const [foundBooking, setFoundBooking] = useState<Booking | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  // Données de démonstration
  const demoBookings: Booking[] = [
    {
      id: '1',
      referenceNumber: 'KC-2024-001',
      passenger: {
        firstName: 'Jean',
        lastName: 'Mboma',
        email: 'jean.mboma@email.com',
        phone: '+241 XX XX XX XX'
      },
      trip: {
        departure: 'Libreville',
        arrival: 'Port-Gentil',
        date: '15 janvier 2024',
        departureTime: '08:00',
        arrivalTime: '14:30',
        duration: '6h 30min'
      },
      status: 'confirmé',
      price: 25000,
      currency: 'XAF',
      bookingDate: '10 janvier 2024',
      seatNumber: 'A12'
    },
    {
      id: '2',
      referenceNumber: 'KC-2024-002',
      passenger: {
        firstName: 'Marie',
        lastName: 'Ngoua',
        email: 'marie.ngoua@email.com',
        phone: '+241 YY YY YY YY'
      },
      trip: {
        departure: 'Franceville',
        arrival: 'Libreville',
        date: '16 janvier 2024',
        departureTime: '06:00',
        arrivalTime: '14:45',
        duration: '8h 45min'
      },
      status: 'en_attente',
      price: 35000,
      currency: 'XAF',
      bookingDate: '11 janvier 2024'
    }
  ];

  const handleSearch = async () => {
    setIsSearching(true);
    
    // Simulation d'appel API
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    let booking = null;
    if (searchType === 'reference') {
      booking = demoBookings.find(b => b.referenceNumber.toLowerCase().includes(searchValue.toLowerCase()));
    } else {
      booking = demoBookings.find(b => b.passenger.email.toLowerCase().includes(searchValue.toLowerCase()));
    }
    
    setFoundBooking(booking || null);
    setIsSearching(false);
    
    if (!booking) {
      toast.error('Aucune réservation trouvée', {
        description: 'Vérifiez votre numéro de référence ou email'
      });
    }
  };

  const handleCancelBooking = async () => {
    if (!foundBooking) return;
    
    toast.success('Réservation annulée', {
      description: 'Votre réservation a été annulée avec succès'
    });
    
    setFoundBooking({
      ...foundBooking,
      status: 'annulé'
    });
  };

  const handleDownloadTicket = () => {
    toast.success('Téléchargement en cours', {
      description: 'Votre billet est en cours de téléchargement'
    });
  };

  if (!isOpen) return null;

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
            <h2 className="text-lg font-semibold">Gérer ma réservation</h2>
            <p className="text-sm opacity-90">Rechercher et modifier vos réservations</p>
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
          {!foundBooking ? (
            /* Search Form */
            <div className="space-y-6">
              <div>
                <h3 className="font-medium mb-4">Rechercher votre réservation</h3>
                
                {/* Search Type Selector */}
                <div className="flex space-x-4 mb-4">
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="radio"
                      value="reference"
                      checked={searchType === 'reference'}
                      onChange={(e) => setSearchType(e.target.value as 'reference')}
                      className="text-red-600"
                    />
                    <span>Numéro de référence</span>
                  </label>
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="radio"
                      value="email"
                      checked={searchType === 'email'}
                      onChange={(e) => setSearchType(e.target.value as 'email')}
                      className="text-red-600"
                    />
                    <span>Adresse email</span>
                  </label>
                </div>

                {/* Search Input */}
                <div className="space-y-2">
                  <Label htmlFor="search">
                    {searchType === 'reference' ? 'Numéro de référence' : 'Adresse email'}
                  </Label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      id="search"
                      value={searchValue}
                      onChange={(e) => setSearchValue(e.target.value)}
                      placeholder={
                        searchType === 'reference' 
                          ? 'Ex: KC-2024-001' 
                          : 'Ex: jean.mboma@email.com'
                      }
                      className="pl-10"
                      onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                    />
                  </div>
                </div>

                <Button
                  onClick={handleSearch}
                  disabled={!searchValue || isSearching}
                  className="w-full mt-4"
                  style={{ backgroundColor: 'rgba(192, 54, 24, 0.9)' }}
                >
                  {isSearching ? 'Recherche...' : 'Rechercher'}
                </Button>
              </div>

              {/* Demo Data Info */}
              <Alert className="bg-blue-50 border-blue-200">
                <AlertDescription>
                  <p className="font-medium mb-2">Données de démonstration :</p>
                  <p className="text-sm">• Référence: KC-2024-001 ou KC-2024-002</p>
                  <p className="text-sm">• Email: jean.mboma@email.com ou marie.ngoua@email.com</p>
                </AlertDescription>
              </Alert>
            </div>
          ) : (
            /* Booking Details */
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="font-medium">Détails de la réservation</h3>
                <Button
                  variant="outline"
                  onClick={() => {
                    setFoundBooking(null);
                    setSearchValue('');
                  }}
                >
                  Nouvelle recherche
                </Button>
              </div>

              {/* Booking Info */}
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-medium">Référence: {foundBooking.referenceNumber}</h4>
                  <Badge 
                    variant={
                      foundBooking.status === 'confirmé' ? 'default' :
                      foundBooking.status === 'en_attente' ? 'secondary' : 'destructive'
                    }
                  >
                    {foundBooking.status === 'confirmé' ? 'Confirmé' :
                     foundBooking.status === 'en_attente' ? 'En attente' : 'Annulé'}
                  </Badge>
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-600">Réservé le:</p>
                    <p className="font-medium">{foundBooking.bookingDate}</p>
                  </div>
                  {foundBooking.seatNumber && (
                    <div>
                      <p className="text-gray-600">Siège:</p>
                      <p className="font-medium">{foundBooking.seatNumber}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Passenger Info */}
              <div>
                <h4 className="font-medium mb-3 flex items-center">
                  <User className="w-4 h-4 mr-2" />
                  Informations passager
                </h4>
                <div className="space-y-2 text-sm">
                  <p>
                    <span className="text-gray-600">Nom:</span> 
                    <span className="ml-2 font-medium">
                      {foundBooking.passenger.firstName} {foundBooking.passenger.lastName}
                    </span>
                  </p>
                  <p className="flex items-center">
                    <Mail className="w-3 h-3 mr-1 text-gray-400" />
                    <span className="text-gray-600">Email:</span>
                    <span className="ml-2">{foundBooking.passenger.email}</span>
                  </p>
                  <p className="flex items-center">
                    <Phone className="w-3 h-3 mr-1 text-gray-400" />
                    <span className="text-gray-600">Téléphone:</span>
                    <span className="ml-2">{foundBooking.passenger.phone}</span>
                  </p>
                </div>
              </div>

              <Separator />

              {/* Trip Info */}
              <div>
                <h4 className="font-medium mb-3 flex items-center">
                  <MapPin className="w-4 h-4 mr-2" />
                  Détails du voyage
                </h4>
                
                <div className="flex items-center justify-between mb-4">
                  <div className="text-center">
                    <p className="text-xl font-bold">{foundBooking.trip.departureTime}</p>
                    <p className="text-sm text-gray-600">{foundBooking.trip.departure}</p>
                  </div>
                  <div className="flex-1 flex flex-col items-center">
                    <div className="w-full h-px bg-gray-300"></div>
                    <p className="text-xs text-gray-500 mt-1">{foundBooking.trip.duration}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xl font-bold">{foundBooking.trip.arrivalTime}</p>
                    <p className="text-sm text-gray-600">{foundBooking.trip.arrival}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-4 text-sm text-gray-600">
                  <div className="flex items-center space-x-1">
                    <Calendar className="w-4 h-4" />
                    <span>{foundBooking.trip.date}</span>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Price */}
              <div className="flex items-center justify-between">
                <span className="font-medium">Total payé:</span>
                <span className="text-xl font-bold" style={{ color: 'rgba(192, 54, 24, 0.9)' }}>
                  {foundBooking.price.toLocaleString()} {foundBooking.currency}
                </span>
              </div>

              {/* Actions */}
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <Button
                    variant="outline"
                    onClick={handleDownloadTicket}
                    className="flex items-center justify-center space-x-2"
                  >
                    <Download className="w-4 h-4" />
                    <span>Télécharger</span>
                  </Button>
                  <Button
                    variant="outline"
                    className="flex items-center justify-center space-x-2"
                  >
                    <QrCode className="w-4 h-4" />
                    <span>QR Code</span>
                  </Button>
                </div>
                
                {foundBooking.status === 'confirmé' && (
                  <div className="grid grid-cols-2 gap-3">
                    <Button
                      variant="outline"
                      onClick={() => setIsEditing(true)}
                      className="flex items-center justify-center space-x-2"
                    >
                      <Edit className="w-4 h-4" />
                      <span>Modifier</span>
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={handleCancelBooking}
                      className="flex items-center justify-center space-x-2"
                    >
                      <Trash2 className="w-4 h-4" />
                      <span>Annuler</span>
                    </Button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};