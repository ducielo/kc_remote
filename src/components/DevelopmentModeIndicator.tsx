import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { 
  Settings, 
  Database, 
  Wifi, 
  WifiOff, 
  ToggleLeft, 
  ToggleRight,
  Info,
  AlertTriangle
} from 'lucide-react';
import { toast } from 'sonner';

export const DevelopmentModeIndicator: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [useRealAPI, setUseRealAPI] = useState(
    localStorage.getItem('karis_use_real_api') === 'true'
  );

  const toggleAPIMode = () => {
    const newMode = !useRealAPI;
    setUseRealAPI(newMode);
    
    if (newMode) {
      localStorage.setItem('karis_use_real_api', 'true');
      toast.success('🌐 Mode API réelle activé');
    } else {
      localStorage.removeItem('karis_use_real_api');
      toast.success('🔧 Mode développement activé');
    }
    
    // Recharger la page pour appliquer les changements
    setTimeout(() => {
      window.location.reload();
    }, 1000);
  };

  const isDevelopment = !useRealAPI;

  return (
    <motion.div
      className="fixed bottom-4 right-4 z-50"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 2 }}
    >
      <div className="space-y-2">
        {/* Indicateur principal */}
        <motion.div
          onClick={() => setIsExpanded(!isExpanded)}
          className="cursor-pointer"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Badge 
            variant={isDevelopment ? "secondary" : "default"} 
            className="flex items-center gap-2 px-3 py-2 text-sm shadow-lg"
          >
            {isDevelopment ? (
              <>
                <Settings className="w-4 h-4 animate-spin" />
                Mode Développement
              </>
            ) : (
              <>
                <Database className="w-4 h-4" />
                API Réelle
              </>
            )}
          </Badge>
        </motion.div>

        {/* Panneau étendu */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.9 }}
              transition={{ duration: 0.2 }}
            >
              <Card className="w-80 shadow-xl border-2">
                <CardContent className="p-4 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {isDevelopment ? (
                        <WifiOff className="w-5 h-5 text-orange-500" />
                      ) : (
                        <Wifi className="w-5 h-5 text-green-500" />
                      )}
                      <span className="font-medium">
                        {isDevelopment ? 'Données Simulées' : 'API Backend'}
                      </span>
                    </div>
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={toggleAPIMode}
                      className="flex items-center gap-2"
                    >
                      {isDevelopment ? (
                        <ToggleLeft className="w-5 h-5 text-gray-400" />
                      ) : (
                        <ToggleRight className="w-5 h-5 text-green-500" />
                      )}
                    </Button>
                  </div>

                  {isDevelopment ? (
                    <div className="space-y-3">
                      <div className="flex items-start gap-2 p-3 bg-orange-50 rounded-lg">
                        <Info className="w-4 h-4 text-orange-600 mt-0.5 flex-shrink-0" />
                        <div className="text-sm">
                          <div className="font-medium text-orange-800">Mode Développement</div>
                          <div className="text-orange-700">
                            Le système utilise des données simulées. 
                            Toutes les fonctionnalités sont testables en local.
                          </div>
                        </div>
                      </div>

                      <div className="text-xs text-gray-600 space-y-1">
                        <div>✅ <strong>Données mockées</strong> disponibles</div>
                        <div>✅ <strong>Back-office</strong> fonctionnel</div>
                        <div>✅ <strong>Dashboards</strong> interactifs</div>
                        <div>✅ <strong>Tests</strong> complets</div>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div className="flex items-start gap-2 p-3 bg-green-50 rounded-lg">
                        <Database className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                        <div className="text-sm">
                          <div className="font-medium text-green-800">API Backend</div>
                          <div className="text-green-700">
                            Le système utilise l'API backend réelle.
                            Nécessite un serveur backend fonctionnel.
                          </div>
                        </div>
                      </div>

                      <div className="flex items-start gap-2 p-3 bg-yellow-50 rounded-lg">
                        <AlertTriangle className="w-4 h-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                        <div className="text-sm text-yellow-700">
                          Assurez-vous que le serveur backend est démarré et accessible.
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setIsExpanded(false)}
                      className="flex-1"
                    >
                      Fermer
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={toggleAPIMode}
                      className="flex-1"
                    >
                      Basculer vers {isDevelopment ? 'API' : 'Mock'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};