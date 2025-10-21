import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  RefreshCw, 
  Search, 
  Filter, 
  Eye, 
  Check, 
  X,
  AlertTriangle,
  Clock,
  User,
  Calendar,
  CreditCard,
  FileText,
  Download,
  DollarSign,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Badge } from './ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { Textarea } from './ui/textarea';
import { Separator } from './ui/separator';
import { toast } from 'sonner';

interface RefundRequest {
  id: string;
  ticketNumber: string;
  passengerName: string;
  passengerEmail: string;
  originalAmount: number;
  refundAmount: number;
  reason: string;
  requestDate: string;
  status: 'pending' | 'approved' | 'rejected' | 'processed' | 'completed';
  departure: string;
  arrival: string;
  departureDate: string;
  paymentMethod: 'card' | 'mobile' | 'cash' | 'bank';
  processedBy?: string;
  processedDate?: string;
  adminNotes?: string;
  documents?: string[];
}

interface RefundManagementProps {
  className?: string;
}

export const RefundManagement: React.FC<RefundManagementProps> = ({ className = '' }) => {
  const [refunds, setRefunds] = useState<RefundRequest[]>([
    {
      id: '1',
      ticketNumber: 'KC-001-240115-001',
      passengerName: 'Jean Marie Obame',
      passengerEmail: 'jean.obame@gmail.com',
      originalAmount: 25000,
      refundAmount: 22500,
      reason: 'Annulation pour raisons familiales urgentes',
      requestDate: '2024-01-12T10:30:00Z',
      status: 'pending',
      departure: 'Libreville',
      arrival: 'Port-Gentil',
      departureDate: '2024-01-15',
      paymentMethod: 'card'
    },
    {
      id: '2',
      ticketNumber: 'KC-002-240116-002',
      passengerName: 'Marie Claire Nguema',
      passengerEmail: 'marie.nguema@yahoo.fr',
      originalAmount: 35000,
      refundAmount: 35000,
      reason: 'Bus en panne, trajet annulé par la compagnie',
      requestDate: '2024-01-13T14:15:00Z',
      status: 'approved',
      departure: 'Libreville',
      arrival: 'Franceville',
      departureDate: '2024-01-16',
      paymentMethod: 'mobile',
      processedBy: 'Admin',
      processedDate: '2024-01-13T16:00:00Z',
      adminNotes: 'Remboursement intégral car annulation de notre fait'
    },
    {
      id: '3',
      ticketNumber: 'KC-003-240117-003',
      passengerName: 'Paul Mboutsou',
      passengerEmail: 'paul.mboutsou@hotmail.com',
      originalAmount: 30000,
      refundAmount: 24000,
      reason: 'Changement de plans professionnels',
      requestDate: '2024-01-10T09:45:00Z',
      status: 'processed',
      departure: 'Libreville',
      arrival: 'Oyem',
      departureDate: '2024-01-18',
      paymentMethod: 'bank',
      processedBy: 'Admin',
      processedDate: '2024-01-11T11:30:00Z',
      adminNotes: 'Frais de 20% appliqués selon politique'
    },
    {
      id: '4',
      ticketNumber: 'KC-001-240119-004',
      passengerName: 'Grace Ondo',
      passengerEmail: 'grace.ondo@gmail.com',
      originalAmount: 25000,
      refundAmount: 0,
      reason: 'Demande tardive (moins de 24h avant départ)',
      requestDate: '2024-01-18T20:00:00Z',
      status: 'rejected',
      departure: 'Port-Gentil',
      arrival: 'Libreville',
      departureDate: '2024-01-19',
      paymentMethod: 'card',
      processedBy: 'Admin',
      processedDate: '2024-01-18T21:00:00Z',
      adminNotes: 'Demande hors délai selon nos conditions générales'
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedRefund, setSelectedRefund] = useState<RefundRequest | null>(null);
  const [showRefundModal, setShowRefundModal] = useState(false);
  const [adminNotes, setAdminNotes] = useState('');
  const [customRefundAmount, setCustomRefundAmount] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const filteredRefunds = refunds.filter(refund => {
    const matchesSearch = 
      refund.ticketNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      refund.passengerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      refund.passengerEmail.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filterStatus === 'all' || refund.status === filterStatus;
    
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: RefundRequest['status']) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'approved':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'rejected':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'processed':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusLabel = (status: RefundRequest['status']) => {
    switch (status) {
      case 'pending': return 'En attente';
      case 'approved': return 'Approuvé';
      case 'rejected': return 'Rejeté';
      case 'processed': return 'Traité';
      case 'completed': return 'Terminé';
      default: return 'Inconnu';
    }
  };

  const getPaymentMethodLabel = (method: RefundRequest['paymentMethod']) => {
    switch (method) {
      case 'card': return 'Carte bancaire';
      case 'mobile': return 'Mobile Money';
      case 'cash': return 'Espèces';
      case 'bank': return 'Virement';
      default: return 'Inconnu';
    }
  };

  const handleViewRefund = (refund: RefundRequest) => {
    setSelectedRefund(refund);
    setAdminNotes(refund.adminNotes || '');
    setCustomRefundAmount(refund.refundAmount.toString());
    setShowRefundModal(true);
  };

  const handleProcessRefund = async (action: 'approve' | 'reject') => {
    if (!selectedRefund) return;

    setIsProcessing(true);
    try {
      // API: processRefund()
      await new Promise(resolve => setTimeout(resolve, 1500));

      const updatedRefund: RefundRequest = {
        ...selectedRefund,
        status: action === 'approve' ? 'approved' : 'rejected',
        refundAmount: action === 'approve' ? parseFloat(customRefundAmount) || 0 : 0,
        adminNotes,
        processedBy: 'Admin', // Should be actual admin name
        processedDate: new Date().toISOString()
      };

      setRefunds(prev =>
        prev.map(refund =>
          refund.id === selectedRefund.id ? updatedRefund : refund
        )
      );

      toast.success(action === 'approve' ? 'Remboursement approuvé' : 'Demande rejetée');
      setShowRefundModal(false);

    } catch (error) {
      toast.error('Erreur lors du traitement');
    } finally {
      setIsProcessing(false);
    }
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const calculateRefundFee = (originalAmount: number, reason: string) => {
    // Logique de calcul des frais selon la raison
    if (reason.includes('compagnie') || reason.includes('panne')) return 0; // Pas de frais si c'est notre faute
    if (reason.includes('tardive')) return originalAmount; // Pas de remboursement si tardif
    return originalAmount * 0.2; // 20% de frais standard
  };

  const stats = {
    total: refunds.length,
    pending: refunds.filter(r => r.status === 'pending').length,
    approved: refunds.filter(r => r.status === 'approved').length,
    rejected: refunds.filter(r => r.status === 'rejected').length,
    totalAmount: refunds.filter(r => r.status === 'approved' || r.status === 'processed').reduce((sum, r) => sum + r.refundAmount, 0)
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">{stats.total}</div>
            <div className="text-sm text-gray-600">Total demandes</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
            <div className="text-sm text-gray-600">En attente</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">{stats.approved}</div>
            <div className="text-sm text-gray-600">Approuvées</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-red-600">{stats.rejected}</div>
            <div className="text-sm text-gray-600">Rejetées</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-purple-600">
              {(stats.totalAmount / 1000000).toFixed(1)}M
            </div>
            <div className="text-sm text-gray-600">Montant remboursé (XAF)</div>
          </CardContent>
        </Card>
      </div>

      {/* Main content */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center space-x-2">
                <RefreshCw className="w-5 h-5" />
                <span>Gestion des Remboursements</span>
              </CardTitle>
              <CardDescription>
                Traitez les demandes de remboursement de vos clients
              </CardDescription>
            </div>
            <Button variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Exporter rapport
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {/* Filters */}
          <div className="flex items-center space-x-4 mb-6">
            <div className="flex-1 max-w-sm">
              <Input
                placeholder="Rechercher par nom, email, n° billet..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-white border border-gray-300 text-gray-900 placeholder-gray-500"
              />
            </div>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Statut" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les statuts</SelectItem>
                <SelectItem value="pending">En attente</SelectItem>
                <SelectItem value="approved">Approuvées</SelectItem>
                <SelectItem value="rejected">Rejetées</SelectItem>
                <SelectItem value="processed">Traitées</SelectItem>
                <SelectItem value="completed">Terminées</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Refunds List */}
          <div className="space-y-4">
            <AnimatePresence>
              {filteredRefunds.map((refund, index) => (
                <motion.div
                  key={refund.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ delay: index * 0.05 }}
                  className="border rounded-lg p-4 hover:shadow-md transition-shadow duration-200"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-4 mb-3">
                        <h4 className="font-semibold text-lg">{refund.ticketNumber}</h4>
                        <Badge className={getStatusColor(refund.status)}>
                          {getStatusLabel(refund.status)}
                        </Badge>
                        {refund.status === 'pending' && (
                          <Badge className="bg-orange-100 text-orange-800 border-orange-200">
                            <Clock className="w-3 h-3 mr-1" />
                            Urgent
                          </Badge>
                        )}
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-3">
                        <div>
                          <span className="text-gray-500">Passager:</span>
                          <div className="font-medium flex items-center">
                            <User className="w-3 h-3 mr-1" />
                            {refund.passengerName}
                          </div>
                        </div>
                        <div>
                          <span className="text-gray-500">Montant original:</span>
                          <div className="font-medium">{refund.originalAmount.toLocaleString()} XAF</div>
                        </div>
                        <div>
                          <span className="text-gray-500">Montant remboursement:</span>
                          <div className={`font-medium ${refund.refundAmount > 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {refund.refundAmount.toLocaleString()} XAF
                          </div>
                        </div>
                        <div>
                          <span className="text-gray-500">Date demande:</span>
                          <div className="font-medium flex items-center">
                            <Calendar className="w-3 h-3 mr-1" />
                            {formatDate(refund.requestDate)}
                          </div>
                        </div>
                      </div>

                      <div className="text-sm">
                        <span className="text-gray-500">Raison:</span>
                        <div className="mt-1 text-gray-700 italic">"{refund.reason}"</div>
                      </div>

                      {refund.adminNotes && (
                        <div className="mt-2 text-sm">
                          <span className="text-gray-500">Note admin:</span>
                          <div className="mt-1 text-gray-700 bg-gray-50 p-2 rounded">
                            {refund.adminNotes}
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center space-x-2 ml-4">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleViewRefund(refund)}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>

                      {refund.status === 'pending' && (
                        <>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              handleViewRefund(refund);
                              // Auto-set to approve
                            }}
                            className="text-green-600 hover:bg-green-50"
                          >
                            <Check className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              handleViewRefund(refund);
                              // Auto-set to reject
                            }}
                            className="text-red-500 hover:bg-red-50"
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {filteredRefunds.length === 0 && (
              <div className="text-center py-12">
                <RefreshCw className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Aucune demande de remboursement
                </h3>
                <p className="text-gray-600">
                  {searchTerm || filterStatus !== 'all'
                    ? 'Aucune demande ne correspond à vos critères.'
                    : 'Aucune demande de remboursement pour le moment.'}
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Refund Detail Modal */}
      <Dialog open={showRefundModal} onOpenChange={setShowRefundModal}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Traitement de la demande de remboursement</DialogTitle>
            <DialogDescription>
              Examinez et traitez cette demande de remboursement
            </DialogDescription>
          </DialogHeader>

          {selectedRefund && (
            <div className="space-y-6">
              {/* Refund Summary */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">{selectedRefund.ticketNumber}</h3>
                  <Badge className={getStatusColor(selectedRefund.status)}>
                    {getStatusLabel(selectedRefund.status)}
                  </Badge>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">Montant original:</span>
                    <div className="font-medium text-lg">{selectedRefund.originalAmount.toLocaleString()} XAF</div>
                  </div>
                  <div>
                    <span className="text-gray-500">Mode de paiement:</span>
                    <div className="font-medium">{getPaymentMethodLabel(selectedRefund.paymentMethod)}</div>
                  </div>
                </div>
              </div>

              {/* Passenger & Trip Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium mb-3 flex items-center">
                    <User className="w-4 h-4 mr-2" />
                    Informations passager
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div>
                      <Label>Nom</Label>
                      <div className="font-medium">{selectedRefund.passengerName}</div>
                    </div>
                    <div>
                      <Label>Email</Label>
                      <div className="font-medium">{selectedRefund.passengerEmail}</div>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-3 flex items-center">
                    <Calendar className="w-4 h-4 mr-2" />
                    Détails du voyage
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div>
                      <Label>Trajet</Label>
                      <div className="font-medium">{selectedRefund.departure} → {selectedRefund.arrival}</div>
                    </div>
                    <div>
                      <Label>Date de départ</Label>
                      <div className="font-medium">{formatDate(selectedRefund.departureDate)}</div>
                    </div>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Refund Details */}
              <div>
                <h4 className="font-medium mb-3 flex items-center">
                  <FileText className="w-4 h-4 mr-2" />
                  Détails de la demande
                </h4>
                <div className="space-y-3">
                  <div>
                    <Label>Raison du remboursement</Label>
                    <div className="mt-1 p-3 bg-gray-50 rounded text-sm italic">
                      "{selectedRefund.reason}"
                    </div>
                  </div>
                  <div>
                    <Label>Date de la demande</Label>
                    <div className="font-medium">{formatDateTime(selectedRefund.requestDate)}</div>
                  </div>
                </div>
              </div>

              {selectedRefund.status === 'pending' && (
                <>
                  <Separator />

                  {/* Processing Form */}
                  <div className="space-y-4">
                    <h4 className="font-medium">Traitement de la demande</h4>
                    
                    <div className="space-y-2">
                      <Label htmlFor="refundAmount">Montant du remboursement (XAF)</Label>
                      <Input
                        id="refundAmount"
                        type="number"
                        value={customRefundAmount}
                        onChange={(e) => setCustomRefundAmount(e.target.value)}
                        className="bg-white border border-gray-300 text-gray-900"
                        placeholder="Montant à rembourser"
                      />
                      <div className="text-xs text-gray-500">
                        Montant original: {selectedRefund.originalAmount.toLocaleString()} XAF
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="adminNotes">Notes administrateur</Label>
                      <Textarea
                        id="adminNotes"
                        value={adminNotes}
                        onChange={(e) => setAdminNotes(e.target.value)}
                        className="bg-white border border-gray-300 text-gray-900 placeholder-gray-500"
                        placeholder="Ajoutez des notes sur votre décision..."
                        rows={3}
                      />
                    </div>
                  </div>
                </>
              )}

              {selectedRefund.processedBy && (
                <div className="bg-blue-50 p-3 rounded-lg text-sm">
                  <div className="font-medium">Traité par: {selectedRefund.processedBy}</div>
                  <div className="text-gray-600">Le {formatDateTime(selectedRefund.processedDate!)}</div>
                </div>
              )}

              <Separator />

              {/* Actions */}
              <div className="flex justify-end space-x-3">
                {selectedRefund.status === 'pending' && (
                  <>
                    <Button
                      variant="outline"
                      onClick={() => handleProcessRefund('reject')}
                      disabled={isProcessing}
                      className="text-red-600 border-red-200 hover:bg-red-50"
                    >
                      {isProcessing ? (
                        <Clock className="w-4 h-4 mr-2 animate-spin" />
                      ) : (
                        <XCircle className="w-4 h-4 mr-2" />
                      )}
                      Rejeter
                    </Button>
                    <Button
                      onClick={() => handleProcessRefund('approve')}
                      disabled={isProcessing || !customRefundAmount}
                      style={{ backgroundColor: 'rgba(192, 54, 24, 0.9)' }}
                    >
                      {isProcessing ? (
                        <Clock className="w-4 h-4 mr-2 animate-spin" />
                      ) : (
                        <CheckCircle className="w-4 h-4 mr-2" />
                      )}
                      Approuver
                    </Button>
                  </>
                )}
                {selectedRefund.status !== 'pending' && (
                  <Button variant="outline">
                    <Download className="w-4 h-4 mr-2" />
                    Télécharger reçu
                  </Button>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};