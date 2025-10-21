import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Shield, Users, Truck, ArrowRight, ArrowLeft, X, Lock } from 'lucide-react';
import { AdminLogin } from './AdminLogin';
import { AgentLogin } from './AgentLogin';
import { DriverLogin } from './DriverLogin';

interface SecurePortalProps {
  isOpen: boolean;
  onClose: () => void;
  onRoleSelect?: (role: string) => void;
}

export const SecurePortal: React.FC<SecurePortalProps> = ({ isOpen, onClose, onRoleSelect }) => {
  const [selectedRole, setSelectedRole] = useState<string | null>(null);

  const roles = [
    {
      id: 'admin',
      title: 'Espace Administrateur',
      description: 'Gérer les rôles, trajets, paiements et supervision temps réel',
      icon: Shield,
      iconColor: 'text-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
      hoverColor: 'hover:bg-blue-100',
      features: [
        'Gestion des utilisateurs et permissions',
        'Configuration des routes et horaires',
        'Supervision temps réel des opérations',
        'Analyse des rapports financiers'
      ]
    },
    {
      id: 'agent',
      title: 'Espace Agent (Contrôleur)',
      description: 'Valider les passagers, gérer les remboursements et saisir les réservations',
      icon: Users,
      iconColor: 'text-green-600',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
      hoverColor: 'hover:bg-green-100',
      features: [
        'Validation des listes de passagers',
        'Gestion des remboursements',
        'Saisie de nouvelles réservations',
        'Contrôle qualité embarquement'
      ]
    },
    {
      id: 'driver',
      title: 'Espace Chauffeur',
      description: 'Consulter les trajets, télécharger les listes et déclarer les incidents',
      icon: Truck,
      iconColor: 'text-orange-600',
      bgColor: 'bg-orange-50',
      borderColor: 'border-orange-200',
      hoverColor: 'hover:bg-orange-100',
      features: [
        'Consultation des trajets assignés',
        'Téléchargement listes passagers',
        'Déclaration d\'incidents route',
        'Mode hors ligne disponible'
      ]
    }
  ];

  const handleRoleSelect = (roleId: string) => {
    if (onRoleSelect) {
      onRoleSelect(roleId);
    } else {
      setSelectedRole(roleId);
    }
  };

  const handleBackToSelection = () => {
    setSelectedRole(null);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl max-h-[95vh] overflow-y-auto"
      >
        {/* Header */}
        <div 
          className="px-8 py-6 border-b flex items-center justify-between"
          style={{ backgroundColor: 'rgba(192, 54, 24, 0.9)' }}
        >
          <div className="flex items-center space-x-3 text-white">
            <div className="p-2 bg-white bg-opacity-20 rounded-lg">
              <Lock className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-2xl font-semibold">Espace Sécurisé</h2>
              <p className="text-orange-100 text-sm">Portail professionnel Karis Continental</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:text-gray-200 transition-colors p-2 rounded-lg hover:bg-white hover:bg-opacity-10"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-8 min-h-[60vh] modal-content">
          {!selectedRole ? (
            <div>
              <div className="text-center mb-8">
                <h3 className="text-xl text-gray-900 mb-2">Sélectionnez votre espace de travail</h3>
                <p className="text-gray-600">Choisissez le type d'accès correspondant à votre fonction</p>
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                {roles.map((role) => {
                  const IconComponent = role.icon;
                  return (
                    <motion.div
                      key={role.id}
                      whileHover={{ scale: 1.02, y: -4 }}
                      whileTap={{ scale: 0.98 }}
                      className={`${role.bgColor} ${role.borderColor} ${role.hoverColor} border-2 rounded-xl p-6 cursor-pointer transition-all duration-300 shadow-lg hover:shadow-xl`}
                      onClick={() => handleRoleSelect(role.id)}
                    >
                      <div className="text-center mb-4">
                        <div className={`inline-flex p-4 rounded-full ${role.bgColor} border ${role.borderColor} mb-3`}>
                          <IconComponent className={`w-8 h-8 ${role.iconColor}`} />
                        </div>
                        <h4 className="text-lg font-semibold text-gray-900 mb-2">{role.title}</h4>
                        <p className="text-gray-600 text-sm leading-relaxed">{role.description}</p>
                      </div>

                      <div className="space-y-2 mb-6">
                        {role.features.map((feature, index) => (
                          <div key={index} className="flex items-center text-sm text-gray-700">
                            <div className={`w-1.5 h-1.5 rounded-full ${role.iconColor.replace('text-', 'bg-')} mr-2 flex-shrink-0`}></div>
                            <span>{feature}</span>
                          </div>
                        ))}
                      </div>

                      <motion.button
                        whileHover={{ x: 4 }}
                        className={`w-full flex items-center justify-center space-x-2 px-4 py-3 rounded-lg transition-colors ${role.iconColor.replace('text-', 'bg-').replace('600', '600')} text-white hover:${role.iconColor.replace('text-', 'bg-').replace('600', '700')}`}
                        style={{ 
                          backgroundColor: role.iconColor.includes('blue') ? '#2563eb' : 
                                         role.iconColor.includes('green') ? '#059669' : '#ea580c'
                        }}
                      >
                        <span>Se connecter</span>
                        <ArrowRight className="w-4 h-4" />
                      </motion.button>
                    </motion.div>
                  );
                })}
              </div>

              <div className="mt-8 p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-2 text-gray-700 mb-2">
                  <Shield className="w-4 h-4" />
                  <span className="font-medium">Sécurité & Confidentialité</span>
                </div>
                <p className="text-sm text-gray-600">
                  Karis Continental n'est pas conçu pour collecter des données personnelles sensibles. 
                  Tous les accès sont sécurisés et les données de démonstration sont utilisées à des fins de test uniquement.
                </p>
              </div>
            </div>
          ) : (
            <div className="text-center">
              <button
                onClick={handleBackToSelection}
                className="inline-flex items-center space-x-2 text-gray-600 hover:text-gray-800 mb-6"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Retour à la sélection</span>
              </button>
              
              {selectedRole === 'admin' && (
                <div className="text-center">
                  <div className="inline-flex p-4 bg-blue-100 rounded-full mb-4">
                    <Shield className="w-8 h-8 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Redirection vers la connexion Admin
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Vous allez être redirigé vers la page de connexion Administrateur...
                  </p>
                  <div className="text-sm text-gray-500">
                    Veuillez patienter quelques secondes.
                  </div>
                </div>
              )}
              
              {selectedRole === 'agent' && (
                <div className="text-center">
                  <div className="inline-flex p-4 bg-green-100 rounded-full mb-4">
                    <Users className="w-8 h-8 text-green-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Redirection vers la connexion Agent
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Vous allez être redirigé vers la page de connexion Agent...
                  </p>
                  <div className="text-sm text-gray-500">
                    Veuillez patienter quelques secondes.
                  </div>
                </div>
              )}
              
              {selectedRole === 'driver' && (
                <div className="text-center">
                  <div className="inline-flex p-4 bg-orange-100 rounded-full mb-4">
                    <Truck className="w-8 h-8 text-orange-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Redirection vers la connexion Chauffeur
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Vous allez être redirigé vers la page de connexion Chauffeur...
                  </p>
                  <div className="text-sm text-gray-500">
                    Veuillez patienter quelques secondes.
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};