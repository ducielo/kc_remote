import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MapPin, ArrowRight, Bus } from 'lucide-react';


interface ProvinceData {
  id: string;
  name: string;
  description: string;
  lines: number;
  price: string;
  position: { x: number; y: number }; // Position en pourcentage
  color: string;
  imageUrl: string;
}

const provincesData: ProvinceData[] = [
  {
    id: 'libreville',
    name: 'Libreville',
    description: 'Capitale économique du Gabon',
    lines: 25,
    price: 'dès 2500 F',
    position: { x: 15, y: 35 },
    color: '#ef4444',
    imageUrl: 'https://images.unsplash.com/photo-1599474462637-eeedfe72b12f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxMaWJyZXZpbGxlJTIwR2Fib24lMjBjaXR5JTIwc2t5bGluZXxlbnwxfHx8fDE3NTg4MzY0NDN8MA&ixlib=rb-4.1.0&q=80&w=400'
  },
  {
    id: 'oyem',
    name: 'Oyem',
    description: 'Porte d\'entrée vers le Cameroun',
    lines: 12,
    price: 'dès 3000 F',
    position: { x: 35, y: 15 },
    color: '#22c55e',
    imageUrl: 'https://images.unsplash.com/photo-1706059925519-78af8b8dbd10?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxPeWVtJTIwR2Fib24lMjBmb3Jlc3QlMjBjaXR5fGVufDF8fHx8MTc1ODgzNjQ0NXww&ixlib=rb-4.1.0&q=80&w=400'
  },
  {
    id: 'makokou',
    name: 'Makokou',
    description: 'Au cœur de la forêt équatoriale',
    lines: 6,
    price: 'dès 4500 F',
    position: { x: 55, y: 25 },
    color: '#10b981',
    imageUrl: 'https://images.unsplash.com/photo-1657742153368-de43773c46cf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxNYWtva291JTIwR2Fib24lMjBlcXVhdG9yaWFsJTIwZm9yZXN0fGVufDF8fHx8MTc1ODgzNjQ2NXww&ixlib=rb-4.1.0&q=80&w=400'
  },
  {
    id: 'port-gentil',
    name: 'Port-Gentil',
    description: 'Capitale pétrolière du Gabon',
    lines: 18,
    price: 'dès 3500 F',
    position: { x: 25, y: 55 },
    color: '#6366f1',
    imageUrl: 'https://images.unsplash.com/photo-1678471293111-6111cc3ef6bf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxQb3J0JTIwR2VudGlsJTIwR2Fib24lMjBjb2FzdGFsJTIwY2l0eXxlbnwxfHx8fDE3NTg4MzY0NDl8MA&ixlib=rb-4.1.0&q=80&w=400'
  },
  {
    id: 'lambarene',
    name: 'Lambaréné',
    description: 'Ville historique sur l\'Ogooué',
    lines: 11,
    price: 'dès 2800 F',
    position: { x: 45, y: 45 },
    color: '#06b6d4',
    imageUrl: 'https://images.unsplash.com/photo-1724075831292-3521fab63d81?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxMYW1iYXJlbmUlMjBHYWJvbiUyMHJpdmVyJTIwY2l0eXxlbnwxfHx8fDE3NTg4MzY0NTR8MA&ixlib=rb-4.1.0&q=80&w=400'
  },
  {
    id: 'mouila',
    name: 'Mouila',
    description: 'Centre de la région de la Ngounié',
    lines: 8,
    price: 'dès 3200 F',
    position: { x: 40, y: 65 },
    color: '#3b82f6',
    imageUrl: 'https://images.unsplash.com/photo-1698314970887-840801fa6cd7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxNb3VpbGElMjBHYWJvbiUyMGZvcmVzdCUyMHRvd258ZW58MXx8fHwxNzU4ODM2NDYwfDA&ixlib=rb-4.1.0&q=80&w=400'
  },
  {
    id: 'franceville',
    name: 'Franceville',
    description: 'Capitale du Haut-Ogooué',
    lines: 15,
    price: 'dès 5500 F',
    position: { x: 75, y: 70 },
    color: '#8b5cf6',
    imageUrl: 'https://images.unsplash.com/photo-1680200023508-5289ae3de157?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxGcmFuY2V2aWxsZSUyMEdhYm9uJTIwbWluaW5nJTIwY2l0eXxlbnwxfHx8fDE3NTg4MzY0NTF8MA&ixlib=rb-4.1.0&q=80&w=400'
  },
  {
    id: 'moanda',
    name: 'Moanda',
    description: 'Ville minière au cœur de la forêt',
    lines: 10,
    price: 'dès 4000 F',
    position: { x: 85, y: 55 },
    color: '#f59e0b',
    imageUrl: 'https://images.unsplash.com/photo-1708484999046-e9ccbab4bac0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxNb2FuZGElMjBHYWJvbiUyMG1pbmluZyUyMG1vdW50YWluc3xlbnwxfHx8fDE3NTg4MzY0NTd8MA&ixlib=rb-4.1.0&q=80&w=400'
  },
  {
    id: 'tchibanga',
    name: 'Tchibanga',
    description: 'Porte du sud du Gabon',
    lines: 7,
    price: 'dès 4200 F',
    position: { x: 30, y: 85 },
    color: '#ea580c',
    imageUrl: 'https://images.unsplash.com/photo-1680200023508-5289ae3de157?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxUY2hpYmFuZ2ElMjBHYWJvbiUyMHNvdXRoZXJuJTIwY2l0eXxlbnwxfHx8fDE3NTg4MzY0NjJ8MA&ixlib=rb-4.1.0&q=80&w=400'
  }
];

export function InteractiveMap() {
  const [hoveredProvince, setHoveredProvince] = useState<string | null>(null);
  const [selectedProvince, setSelectedProvince] = useState<ProvinceData | null>(null);

  const handleProvinceClick = (province: ProvinceData) => {
    setSelectedProvince(province);
  };

  const closeModal = () => {
    setSelectedProvince(null);
  };

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Layout en deux colonnes : texte à gauche, carte à droite */}
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Colonne gauche : Texte et bouton */}
          <motion.div
            className="lg:pr-8"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl lg:text-5xl text-gray-900 mb-8 leading-tight">
              Quelle sera votre
              <br />
              prochaine
              <br />
              <span style={{ color: '#C03618' }}>destination ?</span>
            </h2>
            
            <motion.button
              className="flex items-center space-x-3 text-white px-8 py-4 rounded-lg shadow-lg transition-all mb-6"
              style={{ backgroundColor: '#C03618' }}
              whileHover={{ 
                backgroundColor: 'rgba(192, 54, 24, 0.9)',
                scale: 1.05,
                boxShadow: '0 10px 25px rgba(192, 54, 24, 0.3)'
              }}
              whileTap={{ scale: 0.98 }}
            >
              <MapPin className="w-5 h-5" />
              <span className="text-lg">Explorez la carte</span>
              <ArrowRight className="w-5 h-5" />
            </motion.button>
            
            <p className="text-gray-600 text-lg leading-relaxed">
              Découvrez toutes les provinces du Gabon desservies par nos lignes de bus. 
              Cliquez sur une province pour voir plus d'informations.
            </p>
          </motion.div>

          {/* Colonne droite : Carte interactive */}
          <motion.div
            className="relative"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            {/* Container de la carte */}
            <div className="relative bg-white rounded-2xl shadow-2xl overflow-hidden border">
              {/* Header de la carte */}
              <div className="text-white p-4" style={{ backgroundColor: '#C03618' }}>
                <div className="flex items-center justify-between">
                  <h3 className="text-lg">Carte du Gabon</h3>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                    <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                    <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                    <span className="text-sm ml-2">Live Map</span>
                  </div>
                </div>
              </div>

              {/* Carte avec points interactifs */}
              <div className="relative h-96 bg-white overflow-visible">
                
                {/* Points des provinces */}
                {provincesData.map((province, index) => (
                  <motion.div
                    key={province.id}
                    className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer"
                    style={{
                      left: `${province.position.x}%`,
                      top: `${province.position.y}%`,
                    }}
                    initial={{ scale: 0, opacity: 0 }}
                    whileInView={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    whileHover={{ scale: 1.1 }}
                    onHoverStart={() => setHoveredProvince(province.id)}
                    onHoverEnd={() => setHoveredProvince(null)}
                    onClick={() => handleProvinceClick(province)}
                  >
                    {/* Container avec nom seulement */}
                    <motion.div
                      className="flex flex-col items-center"
                      animate={{
                        scale: hoveredProvince === province.id ? 1.1 : 1,
                      }}
                    >
                      {/* Nom de la province */}
                      <motion.div
                        className="bg-white px-3 py-2 rounded-lg shadow-md text-sm whitespace-nowrap border-2"
                        style={{ 
                          borderColor: province.color,
                          color: province.color 
                        }}
                        animate={{
                          backgroundColor: hoveredProvince === province.id ? province.color : 'white',
                          color: hoveredProvince === province.id ? 'white' : province.color,
                          boxShadow: hoveredProvince === province.id 
                            ? `0 0 20px ${province.color}40` 
                            : '0 4px 12px rgba(0,0,0,0.15)'
                        }}
                      >
                        {province.name}
                      </motion.div>
                    </motion.div>
                    
                    {/* Popup détaillé au survol */}
                    <AnimatePresence>
                      {hoveredProvince === province.id && (
                        <motion.div
                          className={`absolute left-1/2 transform -translate-x-1/2 bg-white rounded-lg shadow-xl p-4 min-w-56 z-[9999] border ${
                            province.position.y < 50 ? 'top-20' : 'bottom-20'
                          }`}
                          style={{ borderColor: province.color }}
                          initial={{ opacity: 0, y: 10, scale: 0.9 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 10, scale: 0.9 }}
                          transition={{ duration: 0.2 }}
                        >
                          <div className="text-center">
                            {/* Image plus grande */}
                            <div className="w-16 h-16 mx-auto mb-3 rounded-lg overflow-hidden shadow-md">
                              <img
                                src={province.imageUrl}
                                alt={province.name}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            
                            <h4 className="text-gray-800 mb-1">{province.name}</h4>
                            <p className="text-gray-600 text-sm mb-3">{province.description}</p>
                            
                            <div className="flex items-center justify-center space-x-4 text-xs text-gray-500 mb-3">
                              <div className="flex items-center space-x-1">
                                <Bus className="w-3 h-3" />
                                <span>{province.lines} lignes</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <MapPin className="w-3 h-3" />
                                <span>{province.price}</span>
                              </div>
                            </div>
                            
                            <button
                              className="text-white px-3 py-1 rounded text-xs transition-colors"
                              style={{ backgroundColor: province.color }}
                            >
                              Voir les détails
                            </button>
                          </div>
                          
                          {/* Flèche du popup */}
                          <div 
                            className={`absolute left-1/2 transform -translate-x-1/2 w-0 h-0 ${
                              province.position.y < 50 ? 'bottom-full' : 'top-full'
                            }`}
                            style={{
                              borderLeft: '8px solid transparent',
                              borderRight: '8px solid transparent',
                              ...(province.position.y < 50 
                                ? { borderBottom: '8px solid white' }
                                : { borderTop: '8px solid white' }
                              )
                            }}
                          />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Modal détaillée */}
      <AnimatePresence>
        {selectedProvince && (
          <motion.div
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeModal}
          >
            <motion.div
              className="bg-white rounded-xl overflow-hidden max-w-md w-full shadow-2xl"
              initial={{ scale: 0.7, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.7, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Image de header */}
              <div className="relative h-48 overflow-hidden">
                <img
                  src={selectedProvince.imageUrl}
                  alt={selectedProvince.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                <div className="absolute bottom-4 left-4 text-white">
                  <h3 className="text-2xl mb-1">
                    {selectedProvince.name}
                  </h3>
                  <p className="text-white/90 text-sm">
                    {selectedProvince.description}
                  </p>
                </div>
                <div 
                  className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: selectedProvince.color }}
                >
                  <MapPin className="w-5 h-5 text-white" />
                </div>
              </div>
              
              <div className="p-6">
                <div className="flex items-center justify-center space-x-8 mb-6">
                  <div className="text-center">
                    <div className="text-2xl text-gray-800">{selectedProvince.lines}</div>
                    <div className="text-sm text-gray-500">Lignes disponibles</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl" style={{ color: selectedProvince.color }}>
                      {selectedProvince.price}
                    </div>
                    <div className="text-sm text-gray-500">À partir de</div>
                  </div>
                </div>
                
                <motion.button
                  className="w-full text-white py-3 rounded-lg flex items-center justify-center space-x-2"
                  style={{ backgroundColor: '#C03618' }}
                  whileHover={{ backgroundColor: 'rgba(192, 54, 24, 0.9)' }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    // Pré-remplir le formulaire de recherche avec la destination
                    const searchForm = document.querySelector('select[placeholder*="destination"]') as HTMLSelectElement;
                    const dateInput = document.querySelector('input[type="date"]') as HTMLInputElement;
                    
                    if (searchForm) {
                      // Essayer de sélectionner la destination dans le formulaire
                      const options = searchForm.querySelectorAll('option');
                      for (let option of options) {
                        if (option.textContent?.includes(selectedProvince.name)) {
                          searchForm.value = option.value;
                          break;
                        }
                      }
                    }
                    
                    if (dateInput && !dateInput.value) {
                      // Définir la date par défaut à demain
                      const tomorrow = new Date();
                      tomorrow.setDate(tomorrow.getDate() + 1);
                      dateInput.value = tomorrow.toISOString().split('T')[0];
                    }
                    
                    // Fermer le modal
                    setSelectedProvince(null);
                    
                    // Scroll vers le formulaire de recherche
                    setTimeout(() => {
                      const heroSection = document.querySelector('main');
                      if (heroSection) {
                        heroSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                      }
                    }, 300);
                  }}
                >
                  <span>Réserver un voyage</span>
                  <ArrowRight className="w-4 h-4" />
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}