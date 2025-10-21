import { useState, useEffect, useCallback } from 'react';
import { BackOfficeFactory, BackOfficeManager } from '../../back-office';
import { toast } from 'sonner';

export interface UseBackOfficeProps {
  role: 'admin' | 'agent' | 'driver';
  userId?: string;
}

export interface BackOfficeState {
  isInitialized: boolean;
  isLoading: boolean;
  module: any | null;
  error: string | null;
}

export function useBackOffice({ role, userId = 'current-user' }: UseBackOfficeProps) {
  const [state, setState] = useState<BackOfficeState>({
    isInitialized: false,
    isLoading: false,
    module: null,
    error: null
  });

  const initialize = useCallback(async () => {
    if (state.isInitialized || state.isLoading) return;

    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      // Initialiser le gestionnaire si nécessaire
      if (!BackOfficeManager.isReady()) {
        BackOfficeManager.initialize({
          logLevel: 1, // INFO
          maxLogEntries: 1000,
          enableEventBusLogging: true
        });
      }

      // Créer le module approprié
      const module = await BackOfficeFactory.initializeForDashboard(role, userId);

      setState({
        isInitialized: true,
        isLoading: false,
        module,
        error: null
      });

      toast.success(`Back-office ${role} initialisé`);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue';
      setState({
        isInitialized: false,
        isLoading: false,
        module: null,
        error: errorMessage
      });

      toast.error(`Erreur d'initialisation: ${errorMessage}`);
    }
  }, [role, userId, state.isInitialized, state.isLoading]);

  const loadSectionData = useCallback(async (section: string) => {
    if (!state.module) {
      toast.error('Module non initialisé');
      return;
    }

    try {
      setState(prev => ({ ...prev, isLoading: true }));

      switch (section) {
        case 'trips':
          await state.module.loadTrips();
          break;
        case 'tickets':
          await state.module.loadTickets();
          break;
        case 'users':
          await state.module.loadUsers();
          break;
        case 'vehicles':
          await state.module.loadVehicles();
          break;
        case 'reports':
          await state.module.loadReports();
          break;
        case 'dashboard':
          await state.module.loadDashboardData();
          break;
        default:
          console.log(`Section ${section} non gérée`);
      }

      setState(prev => ({ ...prev, isLoading: false }));
      toast.success(`Données ${section} chargées`);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue';
      setState(prev => ({ ...prev, isLoading: false, error: errorMessage }));
      toast.error(`Erreur de chargement: ${errorMessage}`);
    }
  }, [state.module]);

  const executeAction = useCallback(async (action: string, data?: any) => {
    if (!state.module) {
      toast.error('Module non initialisé');
      return false;
    }

    try {
      setState(prev => ({ ...prev, isLoading: true }));

      let result;
      switch (action) {
        case 'createTrip':
          result = await state.module.createTrip(data);
          break;
        case 'updateTrip':
          result = await state.module.updateTrip(data.id, data);
          break;
        case 'deleteTrip':
          result = await state.module.deleteTrip(data.id);
          break;
        case 'createUser':
          result = await state.module.createUser(data);
          break;
        case 'updateUser':
          result = await state.module.updateUser(data.id, data);
          break;
        case 'deleteUser':
          result = await state.module.deleteUser(data.id);
          break;
        case 'generateReport':
          result = await state.module.generateReport(data.type, data.params);
          break;
        default:
          throw new Error(`Action ${action} non reconnue`);
      }

      setState(prev => ({ ...prev, isLoading: false }));
      toast.success(`Action ${action} exécutée avec succès`);
      return result;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue';
      setState(prev => ({ ...prev, isLoading: false, error: errorMessage }));
      toast.error(`Erreur d'exécution: ${errorMessage}`);
      return false;
    }
  }, [state.module]);

  const getStats = useCallback(() => {
    if (!state.module) return null;
    return BackOfficeFactory.getSystemStats();
  }, [state.module]);

  const cleanup = useCallback(async () => {
    if (state.module && userId) {
      BackOfficeFactory.unregisterModule(userId);
    }
  }, [state.module, userId]);

  useEffect(() => {
    initialize();
    return () => {
      cleanup();
    };
  }, [initialize, cleanup]);

  return {
    ...state,
    initialize,
    loadSectionData,
    executeAction,
    getStats,
    cleanup
  };
}