import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Users, Eye, EyeOff, Loader2, X, ArrowLeft } from 'lucide-react';
import { useAuth } from './AuthContext';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Alert, AlertDescription } from './ui/alert';

interface AgentLoginProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const AgentLogin: React.FC<AgentLoginProps> = ({ isOpen, onClose, onSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    if (!email || !password) {
      setError('Veuillez remplir tous les champs');
      setIsLoading(false);
      return;
    }

    try {
      // API placeholder: loginAgent({ email, password })
      await new Promise(resolve => setTimeout(resolve, 1500)); // Simulation API call
      
      // API: loginAgent({ email, password }) -> { success, token }
      // Validation des identifiants de démonstration
      if (email === 'agent@karis-continental.ga' && password === 'agent123') {
        // TODO: onSuccess => routeTo('/dashboard/agent')
        onSuccess();
        setEmail('');
        setPassword('');
      } else {
        setError('Identifiants incorrects. Essayez agent@karis-continental.ga / agent123');
      }
    } catch (error) {
      setError('Erreur de connexion. Veuillez réessayer.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-white rounded-xl shadow-2xl w-full max-w-lg mx-auto overflow-hidden max-h-[95vh] flex flex-col"
      >
        {/* Header */}
        <div className="px-6 py-4 border-b flex items-center justify-between bg-green-600">
          <div className="flex items-center space-x-2 text-white">
            <Users className="w-5 h-5" />
            <h2 className="text-lg font-semibold">Connexion Agent</h2>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={onClose}
              className="text-white hover:text-gray-200 transition-colors p-1 rounded hover:bg-white hover:bg-opacity-10"
              title="Retour"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <button
              onClick={onClose}
              className="text-white hover:text-gray-200 transition-colors p-1 rounded hover:bg-white hover:bg-opacity-10"
              title="Fermer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 flex-1 overflow-y-auto">
          <div className="text-center mb-6">
            <div className="inline-flex p-3 bg-green-100 rounded-full mb-3">
              <Users className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-1">Espace Agent Contrôleur</h3>
            <p className="text-sm text-gray-600">
              Accédez à vos outils de validation et de gestion terrain
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <Alert className="border-red-200 bg-red-50">
                <AlertDescription className="text-red-700">{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="agent-email" className="text-gray-700 font-medium">
                Email professionnel
              </Label>
              <Input
                id="agent-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="votre-email@karis-continental.ga"
                disabled={isLoading}
                className="bg-white border border-gray-300 text-gray-900 placeholder-gray-500 focus:border-green-500 focus:ring-green-200"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="agent-password" className="text-gray-700 font-medium">
                Mot de passe
              </Label>
              <div className="relative">
                <Input
                  id="agent-password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  disabled={isLoading}
                  className="bg-white border border-gray-300 text-gray-900 placeholder-gray-500 focus:border-green-500 focus:ring-green-200 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  disabled={isLoading}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="text-sm text-gray-600 bg-green-50 p-3 rounded-lg border border-green-200">
              <p className="font-medium text-green-800 mb-1">Identifiants de démonstration :</p>
              <p className="text-green-700">Email: agent@karis-continental.ga</p>
              <p className="text-green-700">Mot de passe: agent123</p>
            </div>

            <div className="bg-gray-50 p-3 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-2">Fonctionnalités disponibles :</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Validation des listes de passagers</li>
                <li>• Gestion des remboursements</li>
                <li>• Saisie de nouvelles réservations</li>
                <li>• Contrôle qualité embarquement</li>
              </ul>
            </div>

            <div className="mt-6 pt-4 border-t bg-white">
              <div className="flex space-x-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={onClose}
                  disabled={isLoading}
                  className="flex-1"
                >
                  Annuler
                </Button>
                <Button
                  type="submit"
                  disabled={isLoading || !email.trim() || !password.trim()}
                  className="flex-1 bg-green-600 hover:bg-green-700 disabled:opacity-50"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Connexion...
                    </>
                  ) : (
                    'Se connecter'
                  )}
                </Button>
              </div>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
};