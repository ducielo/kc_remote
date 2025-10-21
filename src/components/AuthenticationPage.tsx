import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Shield, Users, Truck, X, Eye, EyeOff } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent } from './ui/card';
import { Dialog, DialogContent } from './ui/dialog';

interface AuthenticationPageProps {
  onClose: () => void;
  onAuthenticated: (role: 'admin' | 'agent' | 'driver') => void;
}

type UserRole = 'admin' | 'agent' | 'driver';

interface LoginForm {
  email: string;
  password: string;
  showPassword: boolean;
}

export function AuthenticationPage({ onClose, onAuthenticated }: AuthenticationPageProps) {
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  const [loginForm, setLoginForm] = useState<LoginForm>({
    email: '',
    password: '',
    showPassword: false
  });
  const [isLoading, setIsLoading] = useState(false);

  const roleConfig = {
    admin: {
      title: 'Espace Administrateur',
      description: 'Gérer les rôles, trajets, paiements et supervision temps réel',
      icon: Shield,
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
      textColor: 'text-blue-700',
      features: [
        'Gestion des utilisateurs et permissions',
        'Configuration des routes et horaires',
        'Supervision temps réel des opérations',
        'Analyse des rapports financiers'
      ],
      demoCredentials: {
        email: 'admin@karis-continental.ga',
        password: 'admin123'
      }
    },
    agent: {
      title: 'Espace Agent (Contrôleur)',
      description: 'Valider les passagers, gérer les remboursements et saisir les réservations',
      icon: Users,
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
      textColor: 'text-green-700',
      features: [
        'Validation des listes de passagers',
        'Gestion des remboursements',
        'Saisie de nouvelles réservations',
        'Contrôle qualité embarquement'
      ],
      demoCredentials: {
        email: 'agent@karis-continental.ga',
        password: 'agent123'
      }
    },
    driver: {
      title: 'Espace Chauffeur',
      description: 'Consulter les trajets, télécharger les listes et déclarer les incidents',
      icon: Truck,
      color: 'from-orange-500 to-orange-600',
      bgColor: 'bg-orange-50',
      borderColor: 'border-orange-200',
      textColor: 'text-orange-700',
      features: [
        'Consultation des trajets assignés',
        'Téléchargement listes passagers',
        'Déclaration d\'incidents route',
        'Mode hors ligne disponible'
      ],
      demoCredentials: {
        email: 'chauffeur@karis-continental.ga',
        password: 'chauffeur123'
      }
    }
  };

  const handleRoleSelect = (role: UserRole) => {
    setSelectedRole(role);
    setLoginForm({
      email: roleConfig[role].demoCredentials.email,
      password: '',
      showPassword: false
    });
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRole) return;

    setIsLoading(true);
    
    // Simulation d'authentification
    setTimeout(() => {
      const config = roleConfig[selectedRole];
      if (loginForm.email === config.demoCredentials.email && 
          loginForm.password === config.demoCredentials.password) {
        onAuthenticated(selectedRole);
      } else {
        alert('Identifiants incorrects. Utilisez les identifiants de démonstration.');
      }
      setIsLoading(false);
    }, 1500);
  };

  const handleInputChange = (field: keyof LoginForm, value: string | boolean) => {
    setLoginForm(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="w-full max-w-6xl bg-white rounded-3xl shadow-2xl overflow-hidden max-h-[95vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-[#C03618] to-[#E04628] p-8 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-6 right-6 p-2 hover:bg-white/20 rounded-full transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
          <div className="flex items-center gap-3">
            <div className="bg-white/20 p-3 rounded-lg">
              <Shield className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Espace Sécurisé</h1>
              <p className="text-white/90">Portail professionnel Karis Continental - Back-Office Intégré</p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-10">
          {!selectedRole ? (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {(Object.entries(roleConfig) as [UserRole, typeof roleConfig.admin][]).map(([role, config]) => {
                const Icon = config.icon;
                return (
                  <motion.div
                    key={role}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: role === 'admin' ? 0 : role === 'agent' ? 0.1 : 0.2 }}
                    whileHover={{ y: -5 }}
                    className="group cursor-pointer"
                    onClick={() => handleRoleSelect(role)}
                  >
                    <Card className={`${config.bgColor} ${config.borderColor} border-2 hover:shadow-xl transition-all duration-300 h-full`}>
                      <CardContent className="p-8">
                        <div className="text-center mb-6">
                          <div className={`inline-flex p-4 rounded-2xl bg-gradient-to-r ${config.color} text-white mb-4`}>
                            <Icon className="w-12 h-12" />
                          </div>
                          <h3 className={`text-xl font-bold ${config.textColor} mb-2`}>
                            {config.title}
                          </h3>
                          <p className="text-gray-600 text-sm leading-relaxed">
                            {config.description}
                          </p>
                        </div>

                        <ul className="space-y-3 mb-6">
                          {config.features.map((feature, index) => (
                            <li key={index} className="flex items-start gap-2 text-sm">
                              <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${config.color} mt-2 flex-shrink-0`} />
                              <span className="text-gray-700">{feature}</span>
                            </li>
                          ))}
                        </ul>

                        <Button 
                          className={`w-full bg-gradient-to-r ${config.color} hover:opacity-90 text-white border-0 group-hover:scale-105 transition-transform`}
                        >
                          Se connecter
                          <motion.div
                            className="ml-2"
                            animate={{ x: [0, 5, 0] }}
                            transition={{ repeat: Infinity, duration: 1.5 }}
                          >
                            →
                          </motion.div>
                        </Button>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          ) : (
            <div className="max-w-md mx-auto">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="text-center mb-10"
              >
                <div className={`inline-flex p-4 rounded-2xl bg-gradient-to-r ${roleConfig[selectedRole].color} text-white mb-4`}>
                  {React.createElement(roleConfig[selectedRole].icon, { className: "w-8 h-8" })}
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Connexion {roleConfig[selectedRole].title.split(' ')[1]}
                </h2>
              </motion.div>

              <form onSubmit={handleLogin} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="email">Email administrateur</Label>
                  <Input
                    id="email"
                    type="email"
                    value={loginForm.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    placeholder="admin@karis-continental.ga"
                    className="bg-gray-50"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Mot de passe</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={loginForm.showPassword ? 'text' : 'password'}
                      value={loginForm.password}
                      onChange={(e) => handleInputChange('password', e.target.value)}
                      placeholder="••••••••"
                      className="bg-gray-50 pr-10"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => handleInputChange('showPassword', !loginForm.showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    >
                      {loginForm.showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-sm text-blue-800 font-medium mb-2">
                    Identifiants de démonstration :
                  </p>
                  <p className="text-xs text-blue-700">
                    Email: {roleConfig[selectedRole].demoCredentials.email}<br />
                    Mot de passe: {roleConfig[selectedRole].demoCredentials.password}
                  </p>
                </div>

                <div className="flex gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setSelectedRole(null)}
                    className="flex-1"
                  >
                    Annuler
                  </Button>
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className={`flex-1 bg-gradient-to-r ${roleConfig[selectedRole].color} hover:opacity-90 text-white border-0`}
                  >
                    {isLoading ? (
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ repeat: Infinity, duration: 1 }}
                        className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                      />
                    ) : (
                      'Se connecter'
                    )}
                  </Button>
                </div>
              </form>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}