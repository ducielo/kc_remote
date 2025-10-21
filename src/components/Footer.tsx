import React from 'react';
import { motion } from 'motion/react';
import { Facebook, Twitter, Instagram, Youtube, Globe, Smartphone } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import logoImage from '/src/assets/e5bac0c71e8f85bcfad1951e40b6e4ad412d3bad.png';

interface FooterProps {}

export const Footer: React.FC<FooterProps> = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <div className="flex items-center space-x-2 mb-6">
              <ImageWithFallback 
                src={logoImage} 
                alt="Karis Continental Logo" 
                className="h-8"
              />
            </div>
            <p className="text-gray-400 leading-relaxed mb-6">
              Votre partenaire de confiance pour voyager à travers le Gabon. 
              Confort, sécurité et prix abordables garantis.
            </p>
            <div className="flex space-x-4">
              <motion.a 
                href="#" 
                className="text-gray-400 hover:text-white transition-colors"
                style={{ '&:hover': { color: 'rgba(192, 54, 24, 0.9)' } }}
                whileHover={{ scale: 1.2 }}
              >
                <Facebook className="w-5 h-5" />
              </motion.a>
              <motion.a 
                href="#" 
                className="text-gray-400 hover:text-white transition-colors"
                style={{ '&:hover': { color: 'rgba(192, 54, 24, 0.9)' } }}
                whileHover={{ scale: 1.2 }}
              >
                <Twitter className="w-5 h-5" />
              </motion.a>
              <motion.a 
                href="#" 
                className="text-gray-400 hover:text-white transition-colors"
                style={{ '&:hover': { color: 'rgba(192, 54, 24, 0.9)' } }}
                whileHover={{ scale: 1.2 }}
              >
                <Instagram className="w-5 h-5" />
              </motion.a>
              <motion.a 
                href="#" 
                className="text-gray-400 hover:text-white transition-colors"
                style={{ '&:hover': { color: 'rgba(192, 54, 24, 0.9)' } }}
                whileHover={{ scale: 1.2 }}
              >
                <Youtube className="w-5 h-5" />
              </motion.a>
            </div>
          </motion.div>

          {/* Services */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
          >
            <h4 className="text-lg mb-6">Services</h4>
            <ul className="space-y-3">
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Réserver un billet</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Gérer ma réservation</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Annulation gratuite</a></li>
              <li>
                <button
                  onClick={() => {
                    const event = new CustomEvent('show-contact-page');
                    window.dispatchEvent(event);
                  }}
                  className="text-gray-400 hover:text-white transition-colors text-left"
                >
                  Nous contacter
                </button>
              </li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Objets trouvés</a></li>
            </ul>
          </motion.div>

          {/* Company */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <h4 className="text-lg mb-6">Entreprise</h4>
            <ul className="space-y-3">
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">À propos de nous</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Carrières</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Presse</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Partenaires</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Développement durable</a></li>
            </ul>
          </motion.div>

          {/* Download App */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
          >
            <h4 className="text-lg mb-6">Application mobile</h4>
            <p className="text-gray-400 mb-6">
              Téléchargez notre app pour réserver vos billets en déplacement
            </p>
            <div className="space-y-3">
              <motion.a 
                href="#" 
                className="flex items-center space-x-3 bg-gray-800 hover:bg-gray-700 p-3 rounded-lg transition-colors"
                whileHover={{ scale: 1.02 }}
              >
                <Smartphone className="w-6 h-6" style={{ color: 'rgba(192, 54, 24, 0.9)' }} />
                <div>
                  <div className="text-sm">Télécharger sur</div>
                  <div>App Store</div>
                </div>
              </motion.a>
              <motion.a 
                href="#" 
                className="flex items-center space-x-3 bg-gray-800 hover:bg-gray-700 p-3 rounded-lg transition-colors"
                whileHover={{ scale: 1.02 }}
              >
                <Smartphone className="w-6 h-6" style={{ color: 'rgba(192, 54, 24, 0.9)' }} />
                <div>
                  <div className="text-sm">Disponible sur</div>
                  <div>Google Play</div>
                </div>
              </motion.a>
            </div>
          </motion.div>
        </div>

        {/* Bottom Section */}
        <motion.div 
          className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
        >
          <div className="flex flex-wrap items-center gap-6 mb-4 md:mb-0">
            <span className="text-gray-400">© {currentYear} Karis Continental. Tous droits réservés.</span>
            <a href="#" className="text-gray-400 hover:text-white transition-colors">Conditions générales</a>
            <a href="#" className="text-gray-400 hover:text-white transition-colors">Politique de confidentialité</a>
            <a href="#" className="text-gray-400 hover:text-white transition-colors">Cookies</a>
          </div>
          <div className="flex items-center space-x-2 text-gray-400">
            <Globe className="w-4 h-4" />
            <span>Français (Gabon)</span>
          </div>
        </motion.div>
      </div>
    </footer>
  );
};