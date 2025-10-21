import React, { useEffect } from 'react';
import { useBackOffice } from './hooks/useBackOffice';
import { Badge } from './ui/badge';
import { AlertCircle, CheckCircle, Loader2 } from 'lucide-react';

interface BackOfficeIntegrationProps {
  role: 'admin' | 'agent' | 'driver';
  userId?: string;
  activeSection?: string;
  onDataLoaded?: (data: any) => void;
  onError?: (error: string) => void;
}

export const BackOfficeIntegration: React.FC<BackOfficeIntegrationProps> = ({
  role,
  userId,
  activeSection,
  onDataLoaded,
  onError
}) => {
  const backOffice = useBackOffice({ role, userId });

  useEffect(() => {
    if (backOffice.isInitialized && activeSection) {
      backOffice.loadSectionData(activeSection);
    }
  }, [backOffice.isInitialized, activeSection, backOffice.loadSectionData]);

  useEffect(() => {
    if (backOffice.error && onError) {
      onError(backOffice.error);
    }
  }, [backOffice.error, onError]);

  const getStatusColor = () => {
    if (backOffice.error) return 'destructive';
    if (backOffice.isInitialized) return 'default';
    if (backOffice.isLoading) return 'secondary';
    return 'outline';
  };

  const getStatusIcon = () => {
    if (backOffice.error) return <AlertCircle className="w-3 h-3" />;
    if (backOffice.isInitialized) return <CheckCircle className="w-3 h-3" />;
    if (backOffice.isLoading) return <Loader2 className="w-3 h-3 animate-spin" />;
    return null;
  };

  const getStatusText = () => {
    if (backOffice.error) return 'Erreur';
    if (backOffice.isInitialized) return 'Connecté';
    if (backOffice.isLoading) return 'Connexion...';
    return 'Déconnecté';
  };

  // Exposer les fonctions du back-office via le contexte global
  useEffect(() => {
    if (backOffice.isInitialized && backOffice.module) {
      // Stocker les références globalement pour utilisation dans les dashboards
      (window as any).backOfficeModule = backOffice.module;
      (window as any).backOfficeActions = {
        executeAction: backOffice.executeAction,
        loadSectionData: backOffice.loadSectionData,
        getStats: backOffice.getStats
      };
    }

    return () => {
      // Nettoyage
      delete (window as any).backOfficeModule;
      delete (window as any).backOfficeActions;
    };
  }, [backOffice.isInitialized, backOffice.module, backOffice.executeAction, backOffice.loadSectionData, backOffice.getStats]);

  return (
    <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
      <Badge variant={getStatusColor()} className="text-xs flex items-center gap-1">
        {getStatusIcon()}
        Back-Office {getStatusText()}
      </Badge>
      
      {backOffice.isInitialized && (
        <Badge variant="outline" className="text-xs">
          {role.toUpperCase()}
        </Badge>
      )}

      {backOffice.error && (
        <span className="text-xs text-red-600 truncate max-w-[200px]" title={backOffice.error}>
          {backOffice.error}
        </span>
      )}
    </div>
  );
};