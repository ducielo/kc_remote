import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Truck, Eye, EyeOff, Loader2, X, ArrowLeft, Wifi, WifiOff } from 'lucide-react';
import { useAuth } from './AuthContext';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Alert, AlertDescription } from './ui/alert';

interface DriverLoginProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const DriverLogin: React.FC<DriverLoginProps> = ({ isOpen, onClose, onSuccess }) => {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  React.useEffect(() => {
    const handleOnlineStatus = () => setIsOnline(navigator.onLine);
    window.addEventListener('online', handleOnlineStatus);
    window.addEventListener('offline', handleOnlineStatus);
    
    return () => {
      window.removeEventListener('online', handleOnlineStatus);
      window.removeEventListener('offline', handleOnlineStatus);
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    if (!identifier || !password) {
      setError('Veuillez remplir tous les champs');
      setIsLoading(false);
      return;
    }

    try {
      // API placeholder: loginDriver({ identifier, password })
      await new Promise(resolve => setTimeout(resolve, 1500)); // Simulation API call
      
      // API: loginDriver({ identifier, password }) -> { success, token }
      // Validation des identifiants de démonstration
      if ((identifier === 'CHAUFF001' || identifier === 'chauffeur@karis-continental.ga') && password === 'driver123') {
        // TODO: onSuccess => routeTo('/dashboard/chauffeur')
        onSuccess();
        setIdentifier('');
        setPassword('');
      } else {
        setError('Identifiants incorrects. Essayez CHAUFF001 / driver123');
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
        className="bg-white rounded-xl shadow-2xl w-full max-w-lg mx-auto overflow-hidden max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="px-6 py-4 border-b flex items-center justify-between bg-orange-600">
          <div className="flex items-center space-x-2 text-white">
            <Truck className="w-5 h-5" />
            <h2 className="text-lg font-semibold">Connexion Chauffeur</h2>
          </div>
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-1">
              {isOnline ? (
                <Wifi className="w-4 h-4 text-green-300" />
              ) : (
                <WifiOff className="w-4 h-4 text-red-300" />
              )}
              <span className="text-xs text-white opacity-80">
                {isOnline ? 'En ligne' : 'Hors ligne'}
              </span>
            </div>
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
        <div className="p-6">
          <div className="text-center mb-6">
            <div className="inline-flex p-3 bg-orange-100 rounded-full mb-3">
              <Truck className="w-6 h-6 text-orange-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-1">Espace Chauffeur</h3>
            <p className="text-sm text-gray-600">
              Consultez vos trajets et gérez vos missions
            </p>
            {!isOnline && (
              <div className="mt-2 p-2 bg-orange-50 border border-orange-200 rounded text-xs text-orange-700">
                Mode hors ligne - synchronisation différée
              </div>
            )}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <Alert className="border-red-200 bg-red-50">
                <AlertDescription className="text-red-700">{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="driver-identifier" className="text-gray-700 font-medium">
                Identifiant chauffeur
              </Label>
              <Input
                id="driver-identifier"
                type="text"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder="CHAUFF001 ou email@karis-continental.ga"
                disabled={isLoading}
                className="bg-white border border-gray-300 text-gray-900 placeholder-gray-500 focus:border-orange-500 focus:ring-orange-200"
              />
              <p className="text-xs text-gray-500">
                Utilisez votre code chauffeur ou votre adresse email
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="driver-password" className="text-gray-700 font-medium">
                Mot de passe
              </Label>
              <div className="relative">
                <Input
                  id="driver-password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  disabled={isLoading}
                  className="bg-white border border-gray-300 text-gray-900 placeholder-gray-500 focus:border-orange-500 focus:ring-orange-200 pr-10"
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

            <div className="text-sm text-gray-600 bg-orange-50 p-3 rounded-lg border border-orange-200">
              <p className="font-medium text-orange-800 mb-1">Identifiants de démonstration :</p>
              <p className="text-orange-700">Identifiant: CHAUFF001</p>
              <p className="text-orange-700">Mot de passe: driver123</p>
            </div>

            <div className="bg-gray-50 p-3 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-2">Fonctionnalités disponibles :</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Consultation des trajets assignés</li>
                <li>• Téléchargement listes passagers</li>
                <li>• Déclaration d'incidents route</li>
                <li>• Mode hors ligne disponible</li>
              </ul>
            </div>

            <div className="sticky bottom-0 bg-white pt-4 border-t mt-4">
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
                  disabled={isLoading || !identifier.trim() || !password.trim()}
                  className="flex-1 bg-orange-600 hover:bg-orange-700 disabled:opacity-50"
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