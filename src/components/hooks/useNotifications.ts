import { useState, useCallback } from 'react';

export interface Notification {
  id: string;
  type: 'booking' | 'refund' | 'maintenance' | 'system' | 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  priority: 'low' | 'medium' | 'high';
  status?: 'new' | 'processing' | 'completed' | 'failed';
  relatedId?: string; // ID de l'élément associé (booking, bus, etc.)
  action?: {
    label: string;
    handler: () => void;
  };
}

export const useNotifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      type: 'booking',
      title: 'Nouvelle réservation',
      message: 'Réservation #KC-2024-1234 - Libreville → Port-Gentil',
      timestamp: new Date(Date.now() - 5 * 60 * 1000),
      read: false,
      priority: 'medium',
      status: 'new',
      relatedId: '1234',
      action: {
        label: 'Voir détails',
        handler: () => console.log('View booking details for 1234')
      }
    },
    {
      id: '2',
      type: 'refund',
      title: 'Demande de remboursement',
      message: 'Client demande remboursement pour le billet #KC-2024-5678',
      timestamp: new Date(Date.now() - 15 * 60 * 1000),
      read: false,
      priority: 'high',
      status: 'new',
      relatedId: '5678',
      action: {
        label: 'Traiter',
        handler: () => console.log('Process refund for 5678')
      }
    },
    {
      id: '3',
      type: 'maintenance',
      title: 'Maintenance programmée',
      message: 'Bus KC-001 - Maintenance dans 2 jours',
      timestamp: new Date(Date.now() - 60 * 60 * 1000),
      read: true,
      priority: 'low',
      status: 'completed',
      relatedId: 'KC-001',
      action: {
        label: 'Maintenance',
        handler: () => console.log('View maintenance for KC-001')
      }
    },
    {
      id: '4',
      type: 'system',
      title: 'Mise à jour système',
      message: 'Une nouvelle version du dashboard est disponible',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      read: false,
      priority: 'medium',
      status: 'new',
      action: {
        label: 'Mise à jour système',
        handler: () => console.log('View system update')
      }
    }
  ]);

  const addNotification = useCallback((notification: Omit<Notification, 'id' | 'timestamp'>) => {
    const newNotification: Notification = {
      ...notification,
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      timestamp: new Date(),
      status: notification.status || 'new'
    };
    
    setNotifications(prev => [newNotification, ...prev]);
    return newNotification.id;
  }, []);

  const updateNotificationStatus = useCallback((id: string, status: Notification['status']) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === id ? { ...notif, status } : notif
      )
    );
  }, []);

  const markAsRead = useCallback((id: string) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
  }, []);

  const markAllAsRead = useCallback(() => {
    setNotifications(prev => 
      prev.map(notif => ({ ...notif, read: true }))
    );
  }, []);

  const removeNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(notif => notif.id !== id));
  }, []);

  const clearAll = useCallback(() => {
    setNotifications([]);
  }, []);

  const getUnreadCount = useCallback(() => {
    return notifications.filter(n => !n.read).length;
  }, [notifications]);

  const getNotificationsByType = useCallback((type: Notification['type']) => {
    return notifications.filter(n => n.type === type);
  }, [notifications]);

  const getNotificationsByPriority = useCallback((priority: Notification['priority']) => {
    return notifications.filter(n => n.priority === priority);
  }, [notifications]);

  return {
    notifications,
    addNotification,
    markAsRead,
    markAllAsRead,
    removeNotification,
    clearAll,
    updateNotificationStatus,
    unreadCount: getUnreadCount(),
    getNotificationsByType,
    getNotificationsByPriority
  };
};