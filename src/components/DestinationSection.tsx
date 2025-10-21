import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { ArrowRight, MapPin, Clock, Star, Loader2 } from 'lucide-react';
import { usePublicData } from './contexts/PublicDataContext';
import { DestinationCard } from './DestinationCard';
import { toast } from 'sonner';

interface DestinationSectionProps {}

export const DestinationSection: React.FC<DestinationSectionProps> = () => {
  const { 
    featuredDestination, 
    destinations, 
    setFeaturedDestination, 
    isLoading 
  } = usePublicData();
  
  const [displayContent, setDisplayContent] = useState({
    title: '',
    subtitle: '',
    description: '',
    price: '',
    lines: 0,
    imageUrl: '/api/placeholder/400/300',
    destinations: [] as string[]
  });

  // Mise à jour du contenu basé sur la destination vedette
  useEffect(() => {
    // API: getFeaturedDestinationContent()
    console.log('📤 API Call: getFeaturedDestinationContent');

    if (featuredDestination) {
      setDisplayContent({
        title: `Découvrez ${featuredDestination.cityName}`,
        subtitle: `${featuredDestination.province} • ${featuredDestination.cityName}`,
        description: featuredDestination.description || `Explorez ${featuredDestination.cityName}, une destination incontournable du Gabon avec ses ${featuredDestination.lines} lignes de transport et des prix à partir de ${featuredDestination.price.toLocaleString()} FCFA.`,
        price: `dès ${featuredDestination.price.toLocaleString()} FCFA`,
        lines: featuredDestination.lines,
        imageUrl: featuredDestination.image || '/api/placeholder/400/300',
        destinations: destinations
          .filter(d => d.province === featuredDestination.province && d.id !== featuredDestination.id)
          .slice(0, 3)
          .map(d => d.cityName)
      });

      console.log('📥 API Response: featured destination content loaded:', featuredDestination.cityName);
    } else {
      // Contenu par défaut si aucune destination vedette
      setDisplayContent({
        title: 'Quelle sera votre prochaine destination ?',
        subtitle: 'Réseau Karis Continental',
        description: 'Découvrez notre réseau de transport à travers les 9 provinces du Gabon. Des trajets confortables, des prix abordables et un service de qualité vous attendent.',
        price: 'À partir de 8 500 FCFA',
        lines: destinations.reduce((sum, dest) => sum + dest.lines, 0),
        imageUrl: '/api/placeholder/400/300',
        destinations: destinations
          .filter(d => d.isAvailable)
          .slice(0, 3)
          .map(d => d.cityName)
      });
    }
  }, [featuredDestination, destinations]);

  // Gestion du clic sur "Réserver un voyage"
  const handleBookTrip = async () => {
    if (!featuredDestination) {
      toast.info('Sélectionnez d\'abord une destination');
      return;
    }

    // API: startBookingProcess({ destinationId, cityName })
    console.log('📤 API Call: startBookingProcess', {
      destinationId: featuredDestination.id,
      cityName: featuredDestination.cityName
    });

    try {
      await new Promise(resolve => setTimeout(resolve, 500));

      toast.success(`Réservation pour ${featuredDestination.cityName}`, {
        description: 'Vous allez être redirigé vers le formulaire de réservation'
      });

      // Scroll vers le formulaire de recherche
      const searchSection = document.querySelector('[data-search-form]') || 
                           document.getElementById('search-form') ||
                           document.querySelector('.search-form');
      
      if (searchSection) {
        searchSection.scrollIntoView({ behavior: 'smooth' });
        
        // Déclencher un événement pour pré-remplir le formulaire
        const event = new CustomEvent('destination-selected', {
          detail: { 
            destination: featuredDestination.cityName, 
            available: featuredDestination.isAvailable 
          }
        });
        window.dispatchEvent(event);
      }

      console.log('📥 API Response: booking initiated successfully');

    } catch (error) {
      toast.error('Erreur lors de l\'initialisation de la réservation');
      console.error('❌ Erreur de réservation:', error);
    }
  };

  // Gestion du changement de destination vedette (pour les tests)
  const handleChangeDestination = () => {
    const availableDestinations = destinations.filter(d => d.isAvailable && d.id !== featuredDestination?.id);
    if (availableDestinations.length === 0) return;

    const nextDestination = availableDestinations[Math.floor(Math.random() * availableDestinations.length)];
    setFeaturedDestination(nextDestination);
    
    toast.success(`${nextDestination.cityName} est maintenant en vedette`);
  };

  if (isLoading) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-red-600 mr-3" />
            <span className="text-gray-600">Chargement de la destination vedette...</span>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        {/* Badge de destination vedette */}
        {featuredDestination && (
          <motion.div 
            className="text-center mb-8"
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-red-500 to-orange-500 text-white px-6 py-2 rounded-full shadow-lg">
              <Star className="w-4 h-4 fill-current" />
              <span className="font-medium">Destination vedette</span>
              <Star className="w-4 h-4 fill-current" />
            </div>
          </motion.div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          {/* Carte de destination dynamique */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <DestinationCard
              title={displayContent.title}
              description={displayContent.description}
              imageUrl={displayContent.imageUrl}
              buttonText="Réserver un voyage"
              onButtonClick={handleBookTrip}
              price={displayContent.price}
              lines={displayContent.lines}
              isAvailable={featuredDestination?.isAvailable ?? true}
            />
          </motion.div>

          {/* Contenu descriptif dynamique */}
          <motion.div 
            className="space-y-6"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <div>
              <div className="flex items-center space-x-2 text-sm text-gray-500 mb-2">
                <MapPin className="w-4 h-4" />
                <span>{displayContent.subtitle}</span>
              </div>
              <h2 className="text-3xl md:text-4xl text-gray-800 mb-4">
                Réservez des billets de bus avec Karis Continental !
              </h2>
            </div>
            
            <div className="space-y-4 text-gray-600">
              <p>
                Envie de voyager au <strong>Gabon</strong> ? Karis Continental vous emmène grâce à son vaste réseau de lignes de bus ! 
                Avec plus de {displayContent.lines} lignes à travers les 9 provinces, vous trouverez sûrement le trajet idéal pour votre voyage. 
                Nos bus tout confort vous permettront de voyager facilement et à petit prix, que ce soit pour les loisirs ou pour vous évader.
              </p>
              
              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <h3 className="text-xl text-gray-800 mb-3 flex items-center space-x-2">
                  <Clock className="w-5 h-5 text-red-600" />
                  <span>Informations en temps réel</span>
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium text-gray-700">Prix:</span>
                    <span className="ml-2 text-red-600 font-semibold">{displayContent.price}</span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Lignes disponibles:</span>
                    <span className="ml-2 text-gray-600">{displayContent.lines}</span>
                  </div>
                  {featuredDestination && (
                    <>
                      <div>
                        <span className="font-medium text-gray-700">Province:</span>
                        <span className="ml-2 text-gray-600">{featuredDestination.province}</span>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">Statut:</span>
                        <span className={`ml-2 font-medium ${featuredDestination.isAvailable ? 'text-green-600' : 'text-red-500'}`}>
                          {featuredDestination.isAvailable ? 'Disponible' : 'Indisponible'}
                        </span>
                      </div>
                    </>
                  )}
                </div>
              </div>
              
              <h3 className="text-xl text-gray-800">
                Itinéraires et horaires adaptés à vos besoins
              </h3>
              
              <p>
                Voyager devient facile avec Karis Continental à bord de nos bus confortables et modernes. 
                Nous vous proposons des départs fréquents avec des horaires flexibles. 
                Notre réseau dessert les principales villes du Gabon.
                {displayContent.destinations.length > 0 && (
                  <span>
                    {' '}Depuis cette destination, vous pouvez rejoindre : {displayContent.destinations.join(', ')}.
                  </span>
                )}
              </p>

            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};