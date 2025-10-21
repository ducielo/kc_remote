import React from 'react';
import { motion } from 'motion/react';
import { Clock, Users, MapPin, Wifi, Coffee, Zap, Shield } from 'lucide-react';
import { Badge } from './ui/badge';
import { Button } from './ui/button';

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

interface TripCardProps {
  trip: Trip;
  onClick: () => void;
}

export const TripCard: React.FC<TripCardProps> = ({ trip, onClick }) => {
  const amenityIcons = {
    'WiFi gratuit': Wifi,
    'Collations': Coffee,
    'Prises électriques': Zap,
    'Assurance': Shield
  };

  return (
    <motion.div
      className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer"
      onClick={onClick}
      whileHover={{ 
        scale: 1.02,
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
      }}
      whileTap={{ scale: 0.98 }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-4">
          <div className="text-center">
            <p className="text-xl font-bold">{trip.departureTime}</p>
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
            <p className="text-xl font-bold">{trip.arrivalTime}</p>
            <p className="text-sm text-gray-600">{trip.arrival}</p>
          </div>
        </div>
      </div>

      {/* Trip Info */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-1 text-sm text-gray-600">
            <MapPin className="w-4 h-4" />
            <span>{trip.date}</span>
          </div>
          <div className="flex items-center space-x-1 text-sm text-gray-600">
            <Users className="w-4 h-4" />
            <span>{trip.availableSeats} places</span>
          </div>
        </div>
        <Badge variant="secondary">{trip.busType}</Badge>
      </div>

      {/* Amenities */}
      <div className="flex flex-wrap gap-2 mb-4">
        {trip.amenities.slice(0, 3).map((amenity) => {
          const IconComponent = amenityIcons[amenity as keyof typeof amenityIcons];
          return (
            <div key={amenity} className="flex items-center space-x-1 text-xs text-gray-600 bg-gray-50 px-2 py-1 rounded">
              {IconComponent && <IconComponent className="w-3 h-3" />}
              <span>{amenity}</span>
            </div>
          );
        })}
        {trip.amenities.length > 3 && (
          <div className="text-xs text-gray-500 bg-gray-50 px-2 py-1 rounded">
            +{trip.amenities.length - 3} autres
          </div>
        )}
      </div>

      {/* Price and Action */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600">À partir de</p>
          <p className="text-2xl font-bold" style={{ color: 'rgba(192, 54, 24, 0.9)' }}>
            {trip.price.toLocaleString()} {trip.currency}
          </p>
        </div>
        <Button
          style={{ backgroundColor: 'rgba(192, 54, 24, 0.9)' }}
          onClick={(e) => {
            e.stopPropagation();
            onClick();
          }}
        >
          Voir détails
        </Button>
      </div>
    </motion.div>
  );
};