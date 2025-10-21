import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Bell, 
  X, 
  Ticket, 
  RefreshCw, 
  AlertTriangle, 
  Settings,
  CheckCircle,
  XCircle,
  Info,
  AlertCircle,
  Monitor
} from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { ScrollArea } from './ui/scroll-area';
import { Separator } from './ui/separator';
import { type Notification } from './hooks/useNotifications';
import { BookingDetailsModal, RefundProcessModal, MaintenanceModal, SystemUpdateModal, ClearAllNotificationsModal } from './NotificationModals';

interface NotificationPanelProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: Notification[];
  unreadCount: number;
  onMarkAsRead: (id: string) => void;
  onRemoveNotification: (id: string) => void;
  onMarkAllAsRead: () => void;
  onClearAll: () => void;
  onUpdateNotificationStatus?: (id: string, status: Notification['status']) => void;
}

export const NotificationPanel: React.FC<NotificationPanelProps> = ({
  isOpen,
  onClose,
  notifications,
  unreadCount,
  onMarkAsRead,
  onRemoveNotification,
  onMarkAllAsRead,
  onClearAll,
  onUpdateNotificationStatus
}) => {
  // États pour les modales
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [showRefundModal, setShowRefundModal] = useState(false);
  const [showMaintenanceModal, setShowMaintenanceModal] = useState(false);
  const [showSystemUpdateModal, setShowSystemUpdateModal] = useState(false);
  const [showClearAllModal, setShowClearAllModal] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState<string>('');
  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'booking': return <Ticket className="w-4 h-4" />;
      case 'refund': return <RefreshCw className="w-4 h-4" />;
      case 'maintenance': return <AlertTriangle className="w-4 h-4" />;
      case 'system': return <Monitor className="w-4 h-4" />;
      case 'success': return <CheckCircle className="w-4 h-4" />;
      case 'error': return <XCircle className="w-4 h-4" />;
      case 'warning': return <AlertCircle className="w-4 h-4" />;
      case 'info': return <Info className="w-4 h-4" />;
      default: return <Bell className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status?: Notification['status']) => {
    switch (status) {
      case 'new': return 'bg-blue-100 text-blue-800';
      case 'processing': return 'bg-yellow-100 text-yellow-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'failed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status?: Notification['status']) => {
    switch (status) {
      case 'new': return 'Nouveau';
      case 'processing': return 'En cours';
      case 'completed': return 'Terminé';
      case 'failed': return 'Échec';
      default: return 'Non défini';
    }
  };

  // Gestionnaires d'événements pour les actions des notifications
  const handleNotificationAction = (notification: Notification) => {
    if (!notification.action) return;

    switch (notification.type) {
      case 'booking':
        setSelectedItemId(notification.relatedId || '');
        setShowBookingModal(true);
        break;
      case 'refund':
        setSelectedItemId(notification.relatedId || '');
        setShowRefundModal(true);
        break;
      case 'maintenance':
        setSelectedItemId(notification.relatedId || '');
        setShowMaintenanceModal(true);
        break;
      case 'system':
        setShowSystemUpdateModal(true);
        break;
      default:
        notification.action.handler();
    }

    // Marquer la notification comme lue si elle ne l'est pas
    if (!notification.read) {
      onMarkAsRead(notification.id);
    }

    // Mettre à jour le statut si disponible
    if (onUpdateNotificationStatus && notification.status === 'new') {
      onUpdateNotificationStatus(notification.id, 'processing');
    }
  };

  const handleClearAll = () => {
    setShowClearAllModal(true);
  };

  const getPriorityColor = (priority: Notification['priority']) => {
    switch (priority) {
      case 'high': return 'text-red-500';
      case 'medium': return 'text-yellow-500';
      case 'low': return 'text-blue-500';
      default: return 'text-gray-500';
    }
  };

  const getTypeColor = (type: Notification['type']) => {
    switch (type) {
      case 'success': return 'text-green-500';
      case 'error': return 'text-red-500';
      case 'warning': return 'text-yellow-500';
      case 'info': return 'text-blue-500';
      case 'booking': return 'text-purple-500';
      case 'refund': return 'text-orange-500';
      case 'maintenance': return 'text-yellow-600';
      case 'system': return 'text-gray-500';
      default: return 'text-gray-500';
    }
  };

  const formatRelativeTime = (date: Date) => {
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) {
      return 'À l\'instant';
    } else if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60);
      return `Il y a ${minutes} min`;
    } else if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600);
      return `Il y a ${hours}h`;
    } else {
      const days = Math.floor(diffInSeconds / 86400);
      return `Il y a ${days}j`;
    }
  };

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ 
              type: "spring", 
              stiffness: 400, 
              damping: 25,
              duration: 0.2 
            }}
            className="absolute right-0 top-full mt-2 w-96 bg-white rounded-lg shadow-xl border z-50 overflow-hidden"
          >
          {/* Header */}
          <div className="p-4 border-b flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Bell className="w-5 h-5 text-gray-600" />
              <div>
                <h3 className="font-semibold text-gray-900">Notifications</h3>
                <p className="text-sm text-gray-500">
                  {unreadCount} non lue{unreadCount !== 1 ? 's' : ''}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              {unreadCount > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onMarkAllAsRead}
                  className="text-xs"
                >
                  Tout marquer lu
                </Button>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="p-1"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Quick Actions */}
          {notifications.length > 0 && (
            <div className="p-3 bg-gray-50 border-b">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Actions rapides:</span>
                <div className="space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleClearAll}
                    className="text-xs h-7 text-red-600 hover:text-red-700"
                  >
                    Tout supprimer
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Notifications List */}
          <ScrollArea className="max-h-96">
            {notifications.length === 0 ? (
              <div className="p-8 text-center">
                <Bell className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <h4 className="text-lg font-medium text-gray-900 mb-2">
                  Aucune notification
                </h4>
                <p className="text-gray-500 text-sm">
                  Vous êtes à jour ! Toutes les notifications ont été lues.
                </p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {notifications.map((notification, index) => (
                  <motion.div
                    key={notification.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className={`p-4 hover:bg-gray-50 cursor-pointer transition-colors duration-150 ${
                      !notification.read ? 'bg-blue-50 border-l-2 border-l-blue-400' : ''
                    }`}
                    onClick={() => !notification.read && onMarkAsRead(notification.id)}
                  >
                    <div className="flex items-start space-x-3">
                      <div className={`mt-1 flex-shrink-0 ${getTypeColor(notification.type)}`}>
                        {getNotificationIcon(notification.type)}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center space-x-2 mb-1">
                              <h4 className="text-sm font-medium text-gray-900 truncate">
                                {notification.title}
                              </h4>
                              {!notification.read && (
                                <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0"></div>
                              )}
                              {notification.status && (
                                <Badge className={`text-xs px-2 py-0.5 ${getStatusColor(notification.status)}`}>
                                  {getStatusLabel(notification.status)}
                                </Badge>
                              )}
                            </div>
                            <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                              {notification.message}
                            </p>
                            
                            <div className="flex items-center justify-between mt-3">
                              <div className="flex items-center space-x-2">
                                <span className="text-xs text-gray-400">
                                  {formatRelativeTime(notification.timestamp)}
                                </span>
                                <div className={`w-1 h-1 rounded-full ${getPriorityColor(notification.priority)} bg-current`}></div>
                                <span className={`text-xs font-medium ${getPriorityColor(notification.priority)}`}>
                                  {notification.priority === 'high' ? 'Urgent' : 
                                   notification.priority === 'medium' ? 'Important' : 'Normal'}
                                </span>
                              </div>
                              
                              {notification.action && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleNotificationAction(notification);
                                  }}
                                  className="text-xs h-6 px-2 hover:bg-red-50"
                                  style={{ color: 'rgba(192, 54, 24, 0.9)' }}
                                >
                                  {notification.action.label}
                                </Button>
                              )}
                            </div>
                          </div>
                          
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              onRemoveNotification(notification.id);
                            }}
                            className="p-1 h-auto text-gray-400 hover:text-red-500 ml-2 flex-shrink-0"
                          >
                            <X className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </ScrollArea>

          {/* Footer */}
          {notifications.length > 0 && (
            <div className="p-3 bg-gray-50 border-t">
              <div className="flex items-center justify-center">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-xs"
                  style={{ color: 'rgba(192, 54, 24, 0.9)' }}
                >
                  Voir toutes les notifications
                </Button>
              </div>
            </div>
          )}
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Modales pour les actions des notifications */}
      <BookingDetailsModal
        isOpen={showBookingModal}
        onClose={() => setShowBookingModal(false)}
        bookingId={selectedItemId}
      />
      
      <RefundProcessModal
        isOpen={showRefundModal}
        onClose={() => setShowRefundModal(false)}
        ticketId={selectedItemId}
      />
      
      <MaintenanceModal
        isOpen={showMaintenanceModal}
        onClose={() => setShowMaintenanceModal(false)}
        busId={selectedItemId}
      />
      
      <SystemUpdateModal
        isOpen={showSystemUpdateModal}
        onClose={() => setShowSystemUpdateModal(false)}
      />
      
      <ClearAllNotificationsModal
        isOpen={showClearAllModal}
        onClose={() => setShowClearAllModal(false)}
        onConfirm={onClearAll}
        notificationCount={notifications.length}
      />
    </>
  );
};