import React, { useState, useEffect, useRef } from 'react';
import { ArrowRightLeft, MapPin, Calendar, Users, Search, Loader2, AlertCircle, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { toast } from 'sonner';
import { usePublicData } from './contexts/PublicDataContext';
import { useAdminContent } from './contexts/AdminContentProvider';
import { Calendar as CalendarComponent } from './ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { format, addDays } from 'date-fns';
import { fr } from 'date-fns/locale';

interface SearchFormProps {
  onSearch?: (searchData: { departure: string; arrival: string; date: string; passengers: number }) => void;
}

export const SearchForm: React.FC<SearchFormProps> = ({ onSearch }) => {
  const { 
    getAvailableCities, 
    searchRoutes, 
    isLoading,
    getCityStatus 
  } = usePublicData();
  
  // Utiliser les données de l'administrateur pour les villes disponibles
  const { 
    getPublishedRoutes, 
    getAvailableDestinations 
  } = useAdminContent();
  
  const [tripType, setTripType] = useState<'aller-simple' | 'aller-retour'>('aller-simple');
  const [fromCity, setFromCity] = useState('');
  const [toCity, setToCity] = useState('');
  const [departDate, setDepartDate] = useState<Date | undefined>(new Date());
  const [returnDate, setReturnDate] = useState<Date | undefined>();
  const [passengers, setPassengers] = useState(1);
  
  // États pour les données dynamiques
  const [availableCities, setAvailableCities] = useState<string[]>([]);
  const [fromSuggestions, setFromSuggestions] = useState<string[]>([]);
  const [toSuggestions, setToSuggestions] = useState<string[]>([]);
  const [showFromSuggestions, setShowFromSuggestions] = useState(false);
  const [showToSuggestions, setShowToSuggestions] = useState(false);
  const [searchingRoutes, setSearchingRoutes] = useState(false);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [isReturnCalendarOpen, setIsReturnCalendarOpen] = useState(false);

  // Refs pour fermer les suggestions quand on clique ailleurs
  const fromRef = useRef<HTMLDivElement>(null);
  const toRef = useRef<HTMLDivElement>(null);

  // Chargement des villes disponibles depuis le contexte (synchronisé avec admin)
  useEffect(() => {
    // API: getAvailableCitiesForSearch() - Synchronisé avec AdminContentProvider
    console.log('📤 API Call: getAvailableCitiesForSearch (Admin Sync)');
    
    // Obtenir les trajets publiés par l'administrateur
    const publishedRoutes = getPublishedRoutes();
    const adminDestinations = getAvailableDestinations();
    
    // Extraire toutes les villes de départ et d'arrivée des trajets publiés
    const adminCities = new Set<string>();
    publishedRoutes.forEach(route => {
      adminCities.add(route.departure);
      adminCities.add(route.arrival);
    });
    
    // Fallback vers les données existantes si pas de données admin
    const cities = adminCities.size > 0 ? Array.from(adminCities) : getAvailableCities();
    setAvailableCities(cities);
    
    console.log('📥 API Response: available cities synchronized with admin:', cities.length, cities);
  }, [getAvailableCities, getPublishedRoutes, getAvailableDestinations]);

  // Filtrage des suggestions pour la ville de départ
  useEffect(() => {
    if (fromCity.length >= 2) {
      const filtered = availableCities.filter(city => 
        city.toLowerCase().includes(fromCity.toLowerCase()) &&
        getCityStatus(city) // Vérifier que la ville est active
      );
      setFromSuggestions(filtered);
      setShowFromSuggestions(filtered.length > 0 && fromCity !== '' && !filtered.includes(fromCity));
    } else {
      setFromSuggestions([]);
      setShowFromSuggestions(false);
    }
  }, [fromCity, availableCities, getCityStatus]);

  // Filtrage des suggestions pour la ville d'arrivée
  useEffect(() => {
    if (toCity.length >= 2) {
      const filtered = availableCities.filter(city => 
        city.toLowerCase().includes(toCity.toLowerCase()) &&
        city !== fromCity && // Exclure la ville de départ
        getCityStatus(city) // Vérifier que la ville est active
      );
      setToSuggestions(filtered);
      setShowToSuggestions(filtered.length > 0 && toCity !== '' && !filtered.includes(toCity));
    } else {
      setToSuggestions([]);
      setShowToSuggestions(false);
    }
  }, [toCity, availableCities, fromCity, getCityStatus]);

  // Fermer les suggestions quand on clique ailleurs
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (fromRef.current && !fromRef.current.contains(event.target as Node)) {
        setShowFromSuggestions(false);
      }
      if (toRef.current && !toRef.current.contains(event.target as Node)) {
        setShowToSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const swapCities = () => {
    if (!fromCity && !toCity) {
      toast.info('Veuillez d\'abord saisir des villes');
      return;
    }

    const temp = fromCity;
    setFromCity(toCity);
    setToCity(temp);
    
    // Fermer les suggestions lors du swap
    setShowFromSuggestions(false);
    setShowToSuggestions(false);

    toast.success('Villes échangées');
  };

  const handleSearch = async () => {
    // Validation des champs
    if (!fromCity || !toCity) {
      toast.error('Veuillez remplir les champs de départ et d\'arrivée');
      return;
    }

    if (fromCity === toCity) {
      toast.error('La ville de départ et d\'arrivée ne peuvent pas être identiques');
      return;
    }

    // Vérifier que les villes sont disponibles
    if (!getCityStatus(fromCity)) {
      toast.error(`${fromCity} n'est pas disponible actuellement`, {
        description: 'Veuillez choisir une autre ville de départ'
      });
      return;
    }

    if (!getCityStatus(toCity)) {
      toast.error(`${toCity} n'est pas disponible actuellement`, {
        description: 'Veuillez choisir une autre destination'
      });
      return;
    }

    setSearchingRoutes(true);

    try {
      // Simulation d'un délai pour l'expérience utilisateur
      await new Promise(resolve => setTimeout(resolve, 800));

      // API: searchAvailableRoutes({ from, to, date, passengers })
      const formattedDate = departDate ? format(departDate, 'dd/MM/yyyy', { locale: fr }) : 'Aujourd\'hui';
      console.log('📤 API Call: searchAvailableRoutes', { 
        from: fromCity, 
        to: toCity, 
        date: formattedDate, 
        passengers 
      });

      // Recherche des routes disponibles
      const routes = searchRoutes(fromCity, toCity, formattedDate, passengers);
      
      if (routes.length === 0) {
        toast.error(`Aucun trajet disponible pour ${fromCity} → ${toCity}`, {
          description: 'Essayez de modifier vos critères de recherche'
        });
        console.log('📥 API Response: no routes found');
        return;
      }

      const searchData = {
        departure: fromCity,
        arrival: toCity,
        date: formattedDate,
        passengers
      };

      // Fermer les suggestions
      setShowFromSuggestions(false);
      setShowToSuggestions(false);

      if (onSearch) {
        onSearch(searchData);
      } else {
        // Scroll to available trips section if no handler provided
        const tripsSection = document.getElementById('available-trips');
        if (tripsSection) {
          tripsSection.scrollIntoView({ behavior: 'smooth' });
        }
      }

      toast.success('Recherche effectuée !', {
        description: `${routes.length} trajet${routes.length > 1 ? 's' : ''} trouvé${routes.length > 1 ? 's' : ''} pour ${fromCity} → ${toCity}`
      });

      console.log('📥 API Response: routes found:', routes.length);

    } catch (error) {
      toast.error('Erreur lors de la recherche', {
        description: 'Veuillez réessayer dans quelques instants'
      });
      console.error('❌ Erreur de recherche:', error);
    } finally {
      setSearchingRoutes(false);
    }
  };

  // Sélection d'une suggestion
  const selectFromSuggestion = (city: string) => {
    setFromCity(city);
    setShowFromSuggestions(false);
  };

  const selectToSuggestion = (city: string) => {
    setToCity(city);
    setShowToSuggestions(false);
  };

  // Composant de suggestion
  const SuggestionList: React.FC<{
    suggestions: string[];
    onSelect: (city: string) => void;
    show: boolean;
  }> = ({ suggestions, onSelect, show }) => (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto"
        >
          {suggestions.map((city, index) => (
            <motion.button
              key={city}
              onClick={() => onSelect(city)}
              className="w-full text-left px-4 py-3 hover:bg-gray-50 flex items-center justify-between transition-colors"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: index * 0.05 }}
            >
              <div className="flex items-center space-x-3">
                <MapPin className="w-4 h-4 text-gray-400" />
                <span className="text-gray-800">{city}</span>
              </div>
              {getCityStatus(city) && (
                <Check className="w-4 h-4 text-green-500" />
              )}
            </motion.button>
          ))}
        </motion.div>
      )}
    </AnimatePresence>
  );

  return (
    <motion.div 
      className="bg-white rounded-xl shadow-2xl p-4 max-w-5xl mx-auto relative"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.3 }}
    >
      {/* Trip Type Selector */}
      <div className="flex space-x-6 mb-6">
        <motion.label 
          className="flex items-center space-x-2 cursor-pointer"
          whileHover={{ scale: 1.02 }}
        >
          <div className="relative">
            <input
              type="radio"
              value="aller-simple"
              checked={tripType === 'aller-simple'}
              onChange={(e) => setTripType(e.target.value as 'aller-simple')}
              className={`w-4 h-4 border-2 rounded-full appearance-none relative ${
                tripType === 'aller-simple' 
                  ? 'border-green-600 bg-green-600' 
                  : 'border-gray-400 bg-white'
              }`}
            />
            {tripType === 'aller-simple' && (
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-white rounded-full"></div>
            )}
          </div>
          <span className="text-gray-800 font-medium text-sm">Aller simple</span>
        </motion.label>
        <motion.label 
          className="flex items-center space-x-2 cursor-pointer"
          whileHover={{ scale: 1.02 }}
        >
          <div className="relative">
            <input
              type="radio"
              value="aller-retour"
              checked={tripType === 'aller-retour'}
              onChange={(e) => setTripType(e.target.value as 'aller-retour')}
              className={`w-4 h-4 border-2 rounded-full appearance-none relative ${
                tripType === 'aller-retour' 
                  ? 'border-gray-700 bg-gray-700' 
                  : 'border-gray-400 bg-white'
              }`}
            />
            {tripType === 'aller-retour' && (
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-white rounded-full"></div>
            )}
          </div>
          <span className="text-gray-800 font-medium text-sm">Aller-retour</span>
        </motion.label>
      </div>

      {/* Search Form Fields */}
      <div className="flex flex-col md:flex-row gap-2 items-stretch">
        {/* From City */}
        <div className="flex-1 min-w-0 relative" ref={fromRef}>
          <label className="block text-xs text-gray-500 mb-1 ml-1">De</label>
          <motion.div 
            className="relative"
            whileFocus={{ scale: 1.01 }}
          >
            <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 z-10" />
            <input
              type="text"
              value={fromCity}
              onChange={(e) => {
                setFromCity(e.target.value);
                setShowFromSuggestions(true);
              }}
              onFocus={() => fromCity.length >= 2 && setShowFromSuggestions(true)}
              placeholder="Ville de départ..."
              className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:border-transparent bg-gray-50 transition-colors ${
                fromCity && !getCityStatus(fromCity) && availableCities.includes(fromCity)
                  ? 'border-red-300 bg-red-50' 
                  : fromCity && getCityStatus(fromCity)
                    ? 'border-green-300 bg-green-50'
                    : 'border-gray-300'
              }`}
              style={{ '--tw-ring-color': 'rgba(192, 54, 24, 0.9)' } as any}
            />
            {fromCity && availableCities.includes(fromCity) && (
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                {getCityStatus(fromCity) ? (
                  <Check className="w-4 h-4 text-green-500" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-red-500" />
                )}
              </div>
            )}
          </motion.div>
          <SuggestionList 
            suggestions={fromSuggestions} 
            onSelect={selectFromSuggestion} 
            show={showFromSuggestions} 
          />
        </div>

        {/* Swap Button */}
        <div className="flex justify-center items-end pb-1">
          <motion.button
            onClick={swapCities}
            className="p-2 hover:bg-orange-50 rounded-full transition-colors"
            style={{ color: 'rgba(192, 54, 24, 0.9)' }}
            whileHover={{ scale: 1.1, rotate: 180 }}
            whileTap={{ scale: 0.95 }}
            disabled={isLoading}
          >
            <ArrowRightLeft className="w-4 h-4" />
          </motion.button>
        </div>

        {/* To City */}
        <div className="flex-1 min-w-0 relative" ref={toRef}>
          <label className="block text-xs text-gray-500 mb-1 ml-1">À</label>
          <motion.div 
            className="relative"
            whileFocus={{ scale: 1.01 }}
          >
            <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 z-10" />
            <input
              type="text"
              value={toCity}
              onChange={(e) => {
                setToCity(e.target.value);
                setShowToSuggestions(true);
              }}
              onFocus={() => toCity.length >= 2 && setShowToSuggestions(true)}
              placeholder="Destination..."
              className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:border-transparent bg-gray-50 transition-colors ${
                toCity && !getCityStatus(toCity) && availableCities.includes(toCity)
                  ? 'border-red-300 bg-red-50' 
                  : toCity && getCityStatus(toCity)
                    ? 'border-green-300 bg-green-50'
                    : 'border-gray-300'
              }`}
              style={{ '--tw-ring-color': 'rgba(192, 54, 24, 0.9)' } as any}
            />
            {toCity && availableCities.includes(toCity) && (
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                {getCityStatus(toCity) ? (
                  <Check className="w-4 h-4 text-green-500" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-red-500" />
                )}
              </div>
            )}
          </motion.div>
          <SuggestionList 
            suggestions={toSuggestions} 
            onSelect={selectToSuggestion} 
            show={showToSuggestions} 
          />
        </div>

        {/* Departure Date */}
        <div className="flex-1 min-w-0">
          <label className="block text-xs text-gray-500 mb-1 ml-1">Départ</label>
          <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
            <PopoverTrigger asChild>
              <motion.button
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent bg-gray-50 text-left transition-colors h-[52px]"
                style={{ '--tw-ring-color': 'rgba(192, 54, 24, 0.9)' } as any}
                whileFocus={{ scale: 1.01 }}
              >
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <span className="text-gray-800">
                  {departDate ? format(departDate, 'dd/MM/yyyy') : 'Sélectionner une date'}
                </span>
              </motion.button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0 z-[60]" align="start">
              <CalendarComponent
                mode="single"
                selected={departDate}
                onSelect={(date) => {
                  setDepartDate(date);
                  setIsCalendarOpen(false);
                }}
                disabled={(date) => date < new Date()}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>

        {/* Return Date (visible uniquement pour aller-retour) */}
        {tripType === 'aller-retour' && (
          <div className="flex-1 min-w-0">
            <label className="block text-xs text-gray-500 mb-1 ml-1">Retour</label>
            <Popover open={isReturnCalendarOpen} onOpenChange={setIsReturnCalendarOpen}>
              <PopoverTrigger asChild>
                <motion.button
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent bg-gray-50 text-left transition-colors h-[52px]"
                  style={{ '--tw-ring-color': 'rgba(192, 54, 24, 0.9)' } as any}
                  whileFocus={{ scale: 1.01 }}
                >
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <span className="text-gray-800">
                    {returnDate ? format(returnDate, 'dd/MM/yyyy') : 'Sélectionner une date'}
                  </span>
                </motion.button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 z-[60]" align="start">
                <CalendarComponent
                  mode="single"
                  selected={returnDate}
                  onSelect={(date) => {
                    setReturnDate(date);
                    setIsReturnCalendarOpen(false);
                  }}
                  disabled={(date) => date < (departDate || new Date())}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
        )}

        {/* Passengers */}
        <div className="flex-1 min-w-0">
          <label className="block text-xs text-gray-500 mb-1 ml-1">Passagers</label>
          <motion.div 
            className="relative"
            whileFocus={{ scale: 1.01 }}
          >
            <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <select
              value={passengers}
              onChange={(e) => setPassengers(Number(e.target.value))}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent appearance-none bg-gray-50"
              style={{ '--tw-ring-color': 'rgba(192, 54, 24, 0.9)' } as any}
            >
              {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
                <option key={num} value={num}>
                  {num} adulte{num > 1 ? 's' : ''}
                </option>
              ))}
            </select>
          </motion.div>
        </div>

        {/* Search Button */}
        <div className="flex items-end">
          <motion.button
            onClick={handleSearch}
            disabled={isLoading || searchingRoutes || !fromCity || !toCity}
            className="text-white py-3 px-8 rounded-lg transition-all flex items-center justify-center space-x-2 h-[52px] disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ 
              backgroundColor: '#C03618',
              boxShadow: '0 2px 4px rgba(192, 54, 24, 0.2)'
            }}
            whileHover={{ 
              scale: (!isLoading && !searchingRoutes && fromCity && toCity) ? 1.02 : 1,
              backgroundColor: (!isLoading && !searchingRoutes && fromCity && toCity) ? '#A82E14' : undefined
            }}
            whileTap={{ scale: (!isLoading && !searchingRoutes && fromCity && toCity) ? 0.98 : 1 }}
          >
            {searchingRoutes ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span className="font-medium">Recherche...</span>
              </>
            ) : (
              <>
                <Search className="w-4 h-4" />
                <span className="font-medium">Chercher</span>
              </>
            )}
          </motion.button>
        </div>
      </div>

      {/* Informations disponibilité en temps réel */}
      {availableCities.length > 0 && (
        <div className="mt-4 text-center">
          <p className="text-xs text-gray-500">
            {availableCities.filter(city => getCityStatus(city)).length} villes disponibles sur {availableCities.length}
            {isLoading && <span className="ml-2">• Mise à jour en cours...</span>}
          </p>
        </div>
      )}
    </motion.div>
  );
};