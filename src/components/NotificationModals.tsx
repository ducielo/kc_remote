import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Ticket, 
  RefreshCw, 
  Bus, 
  User, 
  Calendar, 
  MapPin, 
  CreditCard,
  Check,
  X,
  AlertTriangle,
  Download,
  Phone,
  Mail,
  Clock,
  DollarSign,
  FileText,
  System,
  Monitor
} from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from './ui/alert-dialog';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Textarea } from './ui/textarea';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Separator } from './ui/separator';
import { ScrollArea } from './ui/scroll-area';
import { toast } from 'sonner';

// Modal pour les détails de réservation
interface BookingDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  bookingId: string;
}

export const BookingDetailsModal: React.FC<BookingDetailsModalProps> = ({ 
  isOpen, 
  onClose, 
  bookingId 
}) => {
  // Données simulées de la réservation
  const bookingData = {
    id: bookingId,
    reference: '#KC-2024-1234',
    status: 'confirmed',
    passenger: {
      name: 'Marie Mboma',
      email: 'marie.mboma@email.com',
      phone: '+241 06 12 34 56',
      id: 'ID123456789'
    },
    trip: {
      departure: 'Libreville',
      arrival: 'Port-Gentil',
      date: '2024-01-15',
      time: '08:00',
      duration: '6h 30min',
      bus: 'KC-001',
      seat: '14A'
    },
    payment: {
      amount: 25000,
      method: 'Carte bancaire',
      transactionId: 'TXN789123456',
      status: 'paid'
    },
    bookingDate: '2024-01-10 14:30'
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Ticket className="w-5 h-5" style={{ color: 'rgba(192, 54, 24, 0.9)' }} />
            <span>Détails de la réservation</span>
          </DialogTitle>
          <DialogDescription>
            Informations complètes sur la réservation {bookingData.reference}
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-[60vh] pr-4">
          <div className="space-y-6">
            {/* Status et référence */}
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Référence {bookingData.reference}</CardTitle>
                  <Badge 
                    className="bg-green-100 text-green-800 border-green-200"
                  >
                    <Check className="w-3 h-3 mr-1" />
                    Confirmée
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center text-sm text-gray-600">
                  <Calendar className="w-4 h-4 mr-2" />
                  Réservée le {bookingData.bookingDate}
                </div>
              </CardContent>
            </Card>

            {/* Informations passager */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <User className="w-4 h-4" />
                  <span>Informations passager</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-gray-600">Nom complet</Label>
                    <p className="text-gray-900">{bookingData.passenger.name}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-600">Pièce d'identité</Label>
                    <p className="text-gray-900">{bookingData.passenger.id}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center space-x-2">
                    <Mail className="w-4 h-4 text-gray-400" />
                    <span className="text-sm">{bookingData.passenger.email}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Phone className="w-4 h-4 text-gray-400" />
                    <span className="text-sm">{bookingData.passenger.phone}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Détails du trajet */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <MapPin className="w-4 h-4" />
                  <span>Détails du trajet</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="text-center">
                    <p className="font-semibold text-lg">{bookingData.trip.departure}</p>
                    <p className="text-sm text-gray-500">{bookingData.trip.time}</p>
                  </div>
                  <div className="flex-1 mx-4">
                    <div className="border-t-2 border-dashed border-gray-300 relative">
                      <Bus className="w-4 h-4 text-gray-400 absolute -top-2 left-1/2 transform -translate-x-1/2 bg-white" />
                    </div>
                    <p className="text-xs text-gray-500 text-center mt-1">{bookingData.trip.duration}</p>
                  </div>
                  <div className="text-center">
                    <p className="font-semibold text-lg">{bookingData.trip.arrival}</p>
                    <p className="text-sm text-gray-500">14:30</p>
                  </div>
                </div>
                
                <Separator />
                
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <Label className="text-gray-600">Date</Label>
                    <p className="font-medium">{bookingData.trip.date}</p>
                  </div>
                  <div>
                    <Label className="text-gray-600">Bus</Label>
                    <p className="font-medium">{bookingData.trip.bus}</p>
                  </div>
                  <div>
                    <Label className="text-gray-600">Siège</Label>
                    <p className="font-medium">{bookingData.trip.seat}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Informations de paiement */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <CreditCard className="w-4 h-4" />
                  <span>Paiement</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Montant total</span>
                  <span className="text-xl font-semibold">{bookingData.payment.amount.toLocaleString()} FCFA</span>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <Label className="text-gray-600">Méthode</Label>
                    <p className="font-medium">{bookingData.payment.method}</p>
                  </div>
                  <div>
                    <Label className="text-gray-600">Transaction</Label>
                    <p className="font-medium text-xs">{bookingData.payment.transactionId}</p>
                  </div>
                </div>
                <Badge className="bg-green-100 text-green-800 border-green-200 w-fit">
                  <Check className="w-3 h-3 mr-1" />
                  Paiement confirmé
                </Badge>
              </CardContent>
            </Card>
          </div>
        </ScrollArea>

        <div className="flex justify-end space-x-3 pt-4 border-t">
          <Button variant="outline" onClick={onClose}>
            Fermer
          </Button>
          <Button 
            className="bg-blue-600 hover:bg-blue-700"
            onClick={() => {
              // API: downloadTicket(bookingData.id)
              toast.success('Billet téléchargé avec succès');
            }}
          >
            <Download className="w-4 h-4 mr-2" />
            Télécharger le billet
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

// Modal pour le traitement des remboursements
interface RefundProcessModalProps {
  isOpen: boolean;
  onClose: () => void;
  ticketId: string;
}

export const RefundProcessModal: React.FC<RefundProcessModalProps> = ({ 
  isOpen, 
  onClose, 
  ticketId 
}) => {
  const [refundAmount, setRefundAmount] = useState('');
  const [refundReason, setRefundReason] = useState('');
  const [refundMethod, setRefundMethod] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const ticketData = {
    id: ticketId,
    reference: '#KC-2024-5678',
    passenger: 'Jean Obame',
    amount: 25000,
    trip: 'Libreville → Port-Gentil',
    date: '2024-01-15',
    status: 'paid'
  };

  const handleProcessRefund = async () => {
    if (!refundAmount || !refundReason || !refundMethod) {
      toast.error('Veuillez remplir tous les champs requis');
      return;
    }

    setIsProcessing(true);
    
    try {
      // API: processRefund({ ticketId, amount: refundAmount, reason: refundReason, method: refundMethod })
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast.success('Remboursement traité avec succès');
      onClose();
    } catch (error) {
      toast.error('Erreur lors du traitement du remboursement');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <RefreshCw className="w-5 h-5" style={{ color: 'rgba(192, 54, 24, 0.9)' }} />
            <span>Traitement du remboursement</span>
          </DialogTitle>
          <DialogDescription>
            Traiter la demande de remboursement pour {ticketData.reference}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Informations du billet */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Informations du billet</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Référence:</span>
                <span className="font-medium">{ticketData.reference}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Passager:</span>
                <span className="font-medium">{ticketData.passenger}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Trajet:</span>
                <span className="font-medium">{ticketData.trip}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Montant original:</span>
                <span className="font-medium">{ticketData.amount.toLocaleString()} FCFA</span>
              </div>
            </CardContent>
          </Card>

          {/* Formulaire de remboursement */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="refund-amount">Montant du remboursement *</Label>
              <Input
                id="refund-amount"
                type="number"
                placeholder="Montant en FCFA"
                value={refundAmount}
                onChange={(e) => setRefundAmount(e.target.value)}
                max={ticketData.amount}
              />
              <p className="text-xs text-gray-500 mt-1">
                Maximum: {ticketData.amount.toLocaleString()} FCFA
              </p>
            </div>

            <div>
              <Label htmlFor="refund-method">Méthode de remboursement *</Label>
              <Select value={refundMethod} onValueChange={setRefundMethod}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner une méthode" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="bank">Virement bancaire</SelectItem>
                  <SelectItem value="mobile">Mobile Money</SelectItem>
                  <SelectItem value="cash">Espèces en agence</SelectItem>
                  <SelectItem value="credit">Crédit pour futur voyage</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="refund-reason">Motif du remboursement *</Label>
              <Textarea
                id="refund-reason"
                placeholder="Expliquez le motif du remboursement..."
                value={refundReason}
                onChange={(e) => setRefundReason(e.target.value)}
                rows={3}
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-3 pt-4 border-t">
          <Button variant="outline" onClick={onClose} disabled={isProcessing}>
            Annuler
          </Button>
          <Button 
            onClick={handleProcessRefund}
            disabled={isProcessing}
            style={{ backgroundColor: 'rgba(192, 54, 24, 0.9)' }}
          >
            {isProcessing ? (
              <>
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                Traitement...
              </>
            ) : (
              <>
                <Check className="w-4 h-4 mr-2" />
                Traiter le remboursement
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

// Modal pour la maintenance des véhicules
interface MaintenanceModalProps {
  isOpen: boolean;
  onClose: () => void;
  busId: string;
}

export const MaintenanceModal: React.FC<MaintenanceModalProps> = ({ 
  isOpen, 
  onClose, 
  busId 
}) => {
  const busData = {
    id: busId,
    code: 'KC-001',
    model: 'Mercedes Sprinter',
    nextMaintenance: '2024-01-17',
    mileage: 85340,
    status: 'active',
    lastMaintenance: '2023-12-15'
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Bus className="w-5 h-5" style={{ color: 'rgba(192, 54, 24, 0.9)' }} />
            <span>Maintenance du véhicule</span>
          </DialogTitle>
          <DialogDescription>
            Informations de maintenance pour {busData.code}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Informations du véhicule</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <Label className="text-gray-600">Code véhicule</Label>
                  <p className="font-medium">{busData.code}</p>
                </div>
                <div>
                  <Label className="text-gray-600">Modèle</Label>
                  <p className="font-medium">{busData.model}</p>
                </div>
                <div>
                  <Label className="text-gray-600">Kilométrage</Label>
                  <p className="font-medium">{busData.mileage.toLocaleString()} km</p>
                </div>
                <div>
                  <Label className="text-gray-600">Statut</Label>
                  <Badge className="bg-green-100 text-green-800 border-green-200">
                    En service
                  </Badge>
                </div>
              </div>

              <Separator />

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Dernière maintenance:</span>
                  <span className="font-medium">{busData.lastMaintenance}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Prochaine maintenance:</span>
                  <span className="font-medium text-orange-600">{busData.nextMaintenance}</span>
                </div>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                <div className="flex items-center space-x-2">
                  <AlertTriangle className="w-4 h-4 text-yellow-600" />
                  <span className="text-sm font-medium text-yellow-800">
                    Maintenance programmée dans 2 jours
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex justify-end space-x-3 pt-4 border-t">
          <Button variant="outline" onClick={onClose}>
            Fermer
          </Button>
          <Button 
            style={{ backgroundColor: 'rgba(192, 54, 24, 0.9)' }}
            onClick={() => {
              // API: scheduleMaintenance(busData.id)
              toast.success('Maintenance programmée avec succès');
              onClose();
            }}
          >
            <Clock className="w-4 h-4 mr-2" />
            Programmer maintenance
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

// Modal pour les mises à jour système
interface SystemUpdateModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SystemUpdateModal: React.FC<SystemUpdateModalProps> = ({ 
  isOpen, 
  onClose 
}) => {
  const updateData = {
    version: '2.1.4',
    releaseDate: '2024-01-10',
    changes: [
      'Amélioration des performances du dashboard',
      'Correction de bugs dans le système de réservation',
      'Nouvelle interface pour la gestion des remboursements',
      'Optimisation du système de notifications',
      'Mise à jour des graphiques et statistiques'
    ],
    security: [
      'Renforcement de la sécurité des paiements',
      'Mise à jour des certificats SSL'
    ]
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Monitor className="w-5 h-5" style={{ color: 'rgba(192, 54, 24, 0.9)' }} />
            <span>Mise à jour système</span>
          </DialogTitle>
          <DialogDescription>
            Détails de la mise à jour version {updateData.version}
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-[60vh] pr-4">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Informations de version</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Version:</span>
                  <span className="font-medium">{updateData.version}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Date de sortie:</span>
                  <span className="font-medium">{updateData.releaseDate}</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center space-x-2">
                  <FileText className="w-4 h-4" />
                  <span>Nouvelles fonctionnalités et améliorations</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {updateData.changes.map((change, index) => (
                    <li key={index} className="flex items-start space-x-2 text-sm">
                      <Check className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>{change}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center space-x-2">
                  <AlertTriangle className="w-4 h-4 text-orange-500" />
                  <span>Améliorations de sécurité</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {updateData.security.map((item, index) => (
                    <li key={index} className="flex items-start space-x-2 text-sm">
                      <AlertTriangle className="w-4 h-4 text-orange-500 mt-0.5 flex-shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start space-x-2">
                <FileText className="w-5 h-5 text-blue-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-blue-900">Note importante</h4>
                  <p className="text-sm text-blue-700 mt-1">
                    Cette mise à jour sera appliquée automatiquement lors de votre prochaine connexion. 
                    Aucune action de votre part n'est requise.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </ScrollArea>

        <div className="flex justify-end space-x-3 pt-4 border-t">
          <Button variant="outline" onClick={onClose}>
            Fermer
          </Button>
          <Button 
            style={{ backgroundColor: 'rgba(192, 54, 24, 0.9)' }}
            onClick={() => {
              // API: markUpdateAsRead()
              toast.success('Mise à jour marquée comme lue');
              onClose();
            }}
          >
            <Check className="w-4 h-4 mr-2" />
            Marquer comme lu
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

// Modal de confirmation pour supprimer toutes les notifications
interface ClearAllNotificationsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  notificationCount: number;
}

export const ClearAllNotificationsModal: React.FC<ClearAllNotificationsModalProps> = ({ 
  isOpen, 
  onClose, 
  onConfirm,
  notificationCount 
}) => {
  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center space-x-2">
            <AlertTriangle className="w-5 h-5 text-orange-500" />
            <span>Supprimer toutes les notifications</span>
          </AlertDialogTitle>
          <AlertDialogDescription>
            Êtes-vous sûr de vouloir supprimer toutes les {notificationCount} notifications ? 
            Cette action est irréversible.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onClose}>Annuler</AlertDialogCancel>
          <AlertDialogAction 
            onClick={() => {
              onConfirm();
              onClose();
              toast.success('Toutes les notifications ont été supprimées');
            }}
            className="bg-red-600 hover:bg-red-700"
          >
            <X className="w-4 h-4 mr-2" />
            Tout supprimer
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};