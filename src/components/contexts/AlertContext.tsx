import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'sonner';

export interface Alert {
  id: string;
  type: 'payment_confirmed' | 'maintenance_upcoming' | 'contract_expiring' | 'incident_reported';
  title: string;
  message: string;
  data: any;
  triggeredAt: Date;
  status: 'active' | 'acknowledged' | 'resolved';
  priority: 'low' | 'medium' | 'high' | 'critical';
  targetUsers: string[]; // User IDs who should receive this alert
}

interface AlertContextType {
  alerts: Alert[];
  addAlert: (alert: Omit<Alert, 'id' | 'triggeredAt' | 'status'>) => void;
  acknowledgeAlert: (alertId: string) => void;
  resolveAlert: (alertId: string) => void;
  getActiveAlerts: (userId?: string) => Alert[];
  getAlertsByType: (type: Alert['type']) => Alert[];
  
  // Alert triggers - implementing business criteria
  triggerPaymentConfirmed: (ticketId: string, paymentData: any) => void;
  triggerMaintenanceAlert: (busId: string, daysUntilMaintenance: number) => void;
  triggerContractAlert: (contractId: string, daysUntilExpiry: number) => void;
  triggerIncidentAlert: (incidentId: string, severity: string, location: string) => void;
}

const AlertContext = createContext<AlertContextType | undefined>(undefined);

export const AlertProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [alerts, setAlerts] = useState<Alert[]>([]);

  // Add alert
  const addAlert = (alertData: Omit<Alert, 'id' | 'triggeredAt' | 'status'>) => {
    const newAlert: Alert = {
      ...alertData,
      id: `alert_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      triggeredAt: new Date(),
      status: 'active'
    };
    
    setAlerts(prev => [newAlert, ...prev]);
    
    // Show toast notification
    const toastMessage = `${newAlert.title}: ${newAlert.message}`;
    switch (newAlert.priority) {
      case 'critical':
        toast.error(toastMessage, { duration: 10000 });
        break;
      case 'high':
        toast.error(toastMessage, { duration: 8000 });
        break;
      case 'medium':
        toast.warning(toastMessage, { duration: 6000 });
        break;
      default:
        toast.info(toastMessage, { duration: 4000 });
    }
  };

  // Acknowledge alert
  const acknowledgeAlert = (alertId: string) => {
    setAlerts(prev => prev.map(alert =>
      alert.id === alertId ? { ...alert, status: 'acknowledged' } : alert
    ));
  };

  // Resolve alert
  const resolveAlert = (alertId: string) => {
    setAlerts(prev => prev.map(alert =>
      alert.id === alertId ? { ...alert, status: 'resolved' } : alert
    ));
  };

  // Get active alerts for user
  const getActiveAlerts = (userId?: string): Alert[] => {
    return alerts.filter(alert => {
      const isActive = alert.status === 'active';
      const isForUser = !userId || alert.targetUsers.includes(userId) || alert.targetUsers.includes('all');
      return isActive && isForUser;
    });
  };

  // Get alerts by type
  const getAlertsByType = (type: Alert['type']): Alert[] => {
    return alerts.filter(alert => alert.type === type);
  };

  // ✅ Critère d'acceptation: Paiement confirmé
  // À la réception d'un webhook success, le statut passe en « PAYÉE » ; 
  // un SMS est envoyé <60 s et le billet PDF <5 min.
  const triggerPaymentConfirmed = (ticketId: string, paymentData: any) => {
    addAlert({
      type: 'payment_confirmed',
      title: 'Paiement confirmé',
      message: `Paiement confirmé pour le billet ${ticketId}. SMS envoyé et PDF en génération.`,
      data: { ticketId, paymentData, timestamp: new Date() },
      priority: 'medium',
      targetUsers: ['all'] // Notify all agents and admins
    });

    // Simulate SMS sending (< 60s)
    setTimeout(() => {
      console.log(`📱 SMS sent for ticket ${ticketId} - ${new Date().toISOString()}`);
      // API: sendPaymentSMS(ticketId)
    }, 30000); // 30s simulation

    // Simulate PDF generation (< 5min)
    setTimeout(() => {
      console.log(`📄 PDF generated for ticket ${ticketId} - ${new Date().toISOString()}`);
      // API: generateTicketPDF(ticketId)
    }, 180000); // 3min simulation
  };

  // ✅ Critère d'acceptation: Alerte maintenance J-15
  // Une tâche planifiée déclenche maintenance.upcoming avec notification et badge.
  const triggerMaintenanceAlert = (busId: string, daysUntilMaintenance: number) => {
    if (daysUntilMaintenance <= 15 && daysUntilMaintenance > 0) {
      addAlert({
        type: 'maintenance_upcoming',
        title: 'Maintenance programmée',
        message: `Le bus ${busId} doit passer en maintenance dans ${daysUntilMaintenance} jour(s).`,
        data: { busId, daysUntilMaintenance, scheduledDate: new Date(Date.now() + daysUntilMaintenance * 24 * 60 * 60 * 1000) },
        priority: daysUntilMaintenance <= 7 ? 'high' : 'medium',
        targetUsers: ['admin', 'ops'] // Admin and Operations team
      });
    }
  };

  // ✅ Critère d'acceptation: Alerte contrat J-15
  // Événement sponsorship.starts_soon/ends_soon déclenché à J-15 → 
  // notification automatique à l'Admin & Commercial.
  const triggerContractAlert = (contractId: string, daysUntilExpiry: number) => {
    if (daysUntilExpiry <= 15 && daysUntilExpiry > 0) {
      addAlert({
        type: 'contract_expiring',
        title: 'Contrat arrivant à échéance',
        message: `Le contrat ${contractId} expire dans ${daysUntilExpiry} jour(s). Action requise.`,
        data: { contractId, daysUntilExpiry, expiryDate: new Date(Date.now() + daysUntilExpiry * 24 * 60 * 60 * 1000) },
        priority: daysUntilExpiry <= 7 ? 'critical' : 'high',
        targetUsers: ['admin', 'commercial'] // Admin and Commercial team
      });
    }
  };

  // ✅ Critère d'acceptation: Incident signalé
  // Chaque incident crée un événement incident.reported et une alerte pour Admin & Ops.
  const triggerIncidentAlert = (incidentId: string, severity: string, location: string) => {
    const priorityMap = {
      'low': 'low' as const,
      'medium': 'medium' as const,
      'high': 'high' as const,
      'critical': 'critical' as const
    };

    addAlert({
      type: 'incident_reported',
      title: 'Incident signalé',
      message: `Incident de niveau ${severity} signalé à ${location}. Intervention requise.`,
      data: { incidentId, severity, location, reportedAt: new Date() },
      priority: priorityMap[severity as keyof typeof priorityMap] || 'medium',
      targetUsers: ['admin', 'ops'] // Admin and Operations team
    });

    // Log the incident event
    console.log(`🚨 INCIDENT REPORTED: ${incidentId} - ${severity} at ${location} - ${new Date().toISOString()}`);
  };

  // Simulate scheduled tasks for maintenance alerts
  useEffect(() => {
    const interval = setInterval(() => {
      // This would normally be done by backend scheduled tasks
      // Here we simulate checking maintenance dates
      console.log('🔍 Checking maintenance schedules...');
      
      // Mock data - in real app this would come from API
      const mockBuses = [
        { id: 'KC-001', nextMaintenance: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000) }, // 10 days
        { id: 'KC-002', nextMaintenance: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000) }   // 5 days
      ];

      mockBuses.forEach(bus => {
        const daysUntilMaintenance = Math.ceil((bus.nextMaintenance.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
        if (daysUntilMaintenance <= 15 && daysUntilMaintenance > 0) {
          // Check if alert already exists
          const existingAlert = alerts.find(alert => 
            alert.type === 'maintenance_upcoming' && 
            alert.data.busId === bus.id &&
            alert.status === 'active'
          );
          
          if (!existingAlert) {
            triggerMaintenanceAlert(bus.id, daysUntilMaintenance);
          }
        }
      });
    }, 60000); // Check every minute (in production this would be less frequent)

    return () => clearInterval(interval);
  }, [alerts]);

  return (
    <AlertContext.Provider value={{
      alerts,
      addAlert,
      acknowledgeAlert,
      resolveAlert,
      getActiveAlerts,
      getAlertsByType,
      triggerPaymentConfirmed,
      triggerMaintenanceAlert,
      triggerContractAlert,
      triggerIncidentAlert
    }}>
      {children}
    </AlertContext.Provider>
  );
};

export const useAlerts = () => {
  const context = useContext(AlertContext);
  if (context === undefined) {
    throw new Error('useAlerts must be used within an AlertProvider');
  }
  return context;
};