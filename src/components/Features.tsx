import React from 'react';
import { motion } from 'motion/react';
import { Globe, Wifi, Calendar, Users } from 'lucide-react';

const features = [
  {
    icon: Globe,
    title: "Nous vous connectons au Gabon",
    description: "Les possibilités sont infinies. Partez à la découverte des 9 provinces du Gabon, de Libreville à Franceville."
  },
  {
    icon: Wifi,
    title: "Votre confort en déplacement",
    description: "Détendez-vous et profitez du Wi-Fi gratuit, des prises électriques et des espaces généreux pour vos jambes. C'est ça les bus modernes."
  },
  {
    icon: Calendar,
    title: "Choisissez, réservez, voyagez",
    description: "De votre écran à votre siège en quelques secondes. Vous réservez, on s'occupe du reste."
  },
  {
    icon: Users,
    title: "Voyager ensemble",
    description: "Faire d'incroyables la route en choisissant les transports collectifs pour votre voyage."
  }
];

export const Features: React.FC = () => {
  return (
    <section className="pt-44 pb-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              className="text-center"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -5 }}
            >
              <motion.div 
                className="inline-flex items-center justify-center w-16 h-16 text-white rounded-full mb-4"
                style={{ backgroundColor: 'rgba(192, 54, 24, 0.9)' }}
                whileHover={{ scale: 1.1, rotate: 5 }}
              >
                <feature.icon className="w-8 h-8" />
              </motion.div>
              <h3 className="text-xl mb-3 text-gray-800">
                {feature.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};