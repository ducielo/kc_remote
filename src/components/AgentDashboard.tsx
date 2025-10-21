import { motion, AnimatePresence } from 'motion/react';
import {
  Users,
  CheckCircle,
  DollarSign,
  RefreshCw,
  FileText,
  Clock,
  AlertTriangle,
  Search,
  Filter,
  Download,
  Eye,
  Plus,
  CreditCard,
  Phone,
  Mail,
  MapPin,
  Calendar,
  User,
  Ticket,
  XCircle,
  AlertCircle,
  Loader2,
  Check,
  LogOut,
  Home,
  TrendingUp,
  X,
  Edit,
  Trash2
} from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from './ui/alert-dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { ScrollArea } from './ui/scroll-area';
import { Separator } from './ui/separator';
import { toast } from 'sonner';
import { useOperationalData } from './contexts/OperationalDataContext';
import { useRolePermission } from './contexts/RolePermissionContext';

interface AgentDashboardProps {
  isOpen: boolean;
  onClose: () => void;
  agentId: string;
}

interface OnSiteReservation {
  passengerName: string;
  passengerPhone: string;
  passengerEmail: string;
  tripId: string;
  seatNumber: string;
  paymentMethod: 'cash' | 'mobile_money' | 'pending';
  amount: number;
}



interface PaymentReconciliation {
  transactionId: string;
  ticketId: string;
  amount: number;
  paymentMethod: 'mobile_money' | 'card';
}

interface RefundForm {
  ticketId: string;
  reason: string;
  refundAmount: number;
}

export const AgentDashboard: React.FC<AgentDashboardProps> = ({ isOpen, onClose, agentId }) => {
  const { trips, getUpcomingTrips, validatePassengerList } = useOperationalData();
  const { hasPermission } = useRolePermission();
  
  // States
  const [activeTab, setActiveTab] = useState('reservations');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTrip, setSelectedTrip] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassengerListModal, setShowPassengerListModal] = useState(false);
  const [selectedTripForValidation, setSelectedTripForValidation] = useState<any>(null);
  
  // Form states
  const [reservationForm, setReservationForm] = useState<OnSiteReservation>({
    passengerName: '',
    passengerPhone: '',
    passengerEmail: '',
    tripId: '',
    seatNumber: '',
    paymentMethod: 'cash',
    amount: 0
  });
  

  
  const [reconciliationForm, setReconciliationForm] = useState<PaymentReconciliation>({
    transactionId: '',
    ticketId: '',
    amount: 0,
    paymentMethod: 'mobile_money'
  });

  const [refundForm, setRefundForm] = useState<RefundForm>({
    ticketId: '',
    reason: '',
    refundAmount: 0
  });

  // Mock data for today's reservations
  const [todayReservations] = useState([
    {
      id: 'res1',
      ticketId: 'TK001',
      passengerName: 'Alain Mbongo',
      phone: '+241 06 12 34 56',
      tripId: 'trip1',
      departure: 'Libreville',
      arrival: 'Port-Gentil',
      departureTime: '08:00',
      seatNumber: 'A12',
      status: 'paid',
      amount: 25000,
      paymentMethod: 'cash',
      createdAt: new Date()
    },
    {
      id: 'res2',
      ticketId: 'TK002',
      passengerName: 'Marie Nkomo',
      phone: '+241 06 23 45 67',
      tripId: 'trip2',
      departure: 'Libreville',
      arrival: 'Franceville',
      departureTime: '06:00',
      seatNumber: 'B05',
      status: 'pending',
      amount: 35000,
      paymentMethod: 'pending',
      createdAt: new Date()
    }
  ]);

  // Mock passenger lists for validation
  const getPassengerListForTrip = (tripId: string) => {
    const mockPassengers = {
      'trip1': [
        { ticketId: 'TK001', name: 'Alain Mbongo', phone: '+241 06 12 34 56', seat: 'A12', status: 'confirmed' },
        { ticketId: 'TK003', name: 'Paul Obame', phone: '+241 06 11 22 33', seat: 'A14', status: 'confirmed' },
        { ticketId: 'TK004', name: 'Sophie Nguema', phone: '+241 06 44 55 66', seat: 'B02', status: 'confirmed' },
        { ticketId: 'TK005', name: 'Jean-Marie Ella', phone: '+241 06 77 88 99', seat: 'B08', status: 'pending' },
        { ticketId: 'TK006', name: 'Fatou Mbolo', phone: '+241 06 33 44 55', seat: 'C01', status: 'confirmed' },
      ],
      'trip2': [
        { ticketId: 'TK002', name: 'Marie Nkomo', phone: '+241 06 23 45 67', seat: 'B05', status: 'pending' },
        { ticketId: 'TK007', name: 'Pierre Bekale', phone: '+241 06 55 66 77', seat: 'A01', status: 'confirmed' },
        { ticketId: 'TK008', name: 'Aissatou Ba', phone: '+241 06 88 99 00', seat: 'A05', status: 'confirmed' },
        { ticketId: 'TK009', name: 'Christian Moukagni', phone: '+241 06 12 34 78', seat: 'C12', status: 'confirmed' },
      ]
    };
    return mockPassengers[tripId as keyof typeof mockPassengers] || [];
  };

  // Get today's trips
  const todayTrips = getUpcomingTrips().filter(trip => {
    const today = new Date().toISOString().split('T')[0];
    return trip.date === today;
  });

  // Create on-site reservation
  const handleCreateReservation = async () => {
    if (!reservationForm.passengerName || !reservationForm.passengerPhone || !reservationForm.tripId) {
      toast.error('Veuillez remplir tous les champs obligatoires');
      return;
    }

    setIsLoading(true);
    try {
      // API: createOnSiteReservation(reservationForm)
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast.success('Réservation créée avec succès');
      
      // Reset form
      setReservationForm({
        passengerName: '',
        passengerPhone: '',
        passengerEmail: '',
        tripId: '',
        seatNumber: '',
        paymentMethod: 'cash',
        amount: 0
      });
    } catch (error) {
      toast.error('Erreur lors de la création de la réservation');
    } finally {
      setIsLoading(false);
    }
  };

  // Validate passenger list
  const handleValidatePassengerList = async (tripId: string) => {
    if (!hasPermission(agentId, 'validate_passenger_list')) {
      toast.error('Vous n\'avez pas l\'autorisation de valider les listes');
      return;
    }

    setIsLoading(true);
    try {
      const result = await validatePassengerList(tripId);
      if (result.success) {
        toast.success('Liste des passagers validée et PDF généré');
        // Add audit log
        console.log(`Agent ${agentId} validated passenger list for trip ${tripId} at ${new Date().toISOString()}`);
        setShowPassengerListModal(false);
      }
    } catch (error) {
      toast.error('Erreur lors de la validation');
    } finally {
      setIsLoading(false);
    }
  };

  // Show passenger list before validation
  const handleShowPassengerList = (trip: any) => {
    setSelectedTripForValidation(trip);
    setShowPassengerListModal(true);
  };

  // Process refund
  const handleRefund = async () => {
    if (!hasPermission(agentId, 'refund_tickets')) {
      toast.error('Vous n\'avez pas l\'autorisation d\'effectuer des remboursements');
      return;
    }

    // Check 48h rule
    const ticket = todayReservations.find(r => r.ticketId === refundForm.ticketId);
    if (ticket) {
      const hoursUntilDeparture = (new Date(ticket.departureTime).getTime() - new Date().getTime()) / (1000 * 60 * 60);
      if (hoursUntilDeparture < 48) {
        toast.error('Remboursement impossible : délai de 48h dépassé');
        return;
      }
    }

    setIsLoading(true);
    try {
      // API: initiateRefund(refundForm)
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast.success('Remboursement initié avec succès');
      
      // Reset form
      setRefundForm({
        ticketId: '',
        reason: '',
        refundAmount: 0
      });
    } catch (error) {
      toast.error('Erreur lors du remboursement');
    } finally {
      setIsLoading(false);
    }
  };

  // Reconcile payment
  const handlePaymentReconciliation = async () => {
    if (!hasPermission(agentId, 'validate_payments')) {
      toast.error('Vous n\'avez pas l\'autorisation de valider les paiements');
      return;
    }

    setIsLoading(true);
    try {
      // API: reconcilePayment(reconciliationForm)
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast.success('Paiement rapproché avec succès');
      
      // Reset form
      setReconciliationForm({
        transactionId: '',
        ticketId: '',
        amount: 0,
        paymentMethod: 'mobile_money'
      });
    } catch (error) {
      toast.error('Erreur lors du rapprochement');
    } finally {
      setIsLoading(false);
    }
  };

  // Edit reservation
  const handleEditReservation = async (reservationId: string) => {
    const reservation = todayReservations.find(r => r.id === reservationId);
    if (!reservation) return;
    
    setReservationForm({
      passengerName: reservation.passengerName,
      passengerPhone: reservation.phone,
      passengerEmail: '',
      tripId: reservation.tripId,
      seatNumber: reservation.seatNumber,
      paymentMethod: reservation.paymentMethod as any,
      amount: reservation.amount
    });
    
    toast.info('Modification de la réservation - Formulaire pré-rempli');
  };

  // Delete reservation
  const handleDeleteReservation = async (reservationId: string) => {
    setIsLoading(true);
    try {
      // API: deleteReservation(reservationId)
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast.success('Réservation supprimée avec succès');
      console.log(`Agent ${agentId} deleted reservation ${reservationId}`);
    } catch (error) {
      toast.error('Erreur lors de la suppression');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-50 z-50 overflow-auto dashboard-modal">
      {/* Header */}
      <header className="bg-white border-b px-8 py-6 sticky top-0 z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3">
              <div 
                className="p-2 rounded-lg text-white"
                style={{ backgroundColor: 'rgba(192, 54, 24, 0.9)' }}
              >
                <Users className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-2xl font-semibold text-gray-900">Dashboard Agent</h1>
                <p className="text-gray-600">Interface opérationnelle terrain</p>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <p className="text-sm font-medium text-gray-900">Agent #{agentId}</p>
              <p className="text-xs text-gray-500">Contrôleur de terrain</p>
            </div>
            <Button variant="outline" onClick={onClose}>
              <X className="w-4 h-4 mr-2" />
              Fermer
            </Button>
          </div>
        </div>
      </header>

      <main className="p-8 max-w-7xl mx-auto">
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Réservations du jour</p>
                    <p className="text-2xl font-semibold text-gray-900">
                      {todayReservations.length}
                    </p>
                  </div>
                  <div className="p-3 bg-green-100 rounded-lg">
                    <Ticket className="w-6 h-6 text-green-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Trajets à valider</p>
                    <p className="text-2xl font-semibold text-gray-900">
                      {todayTrips.length}
                    </p>
                  </div>
                  <div className="p-3 bg-blue-100 rounded-lg">
                    <CheckCircle className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Montant encaissé</p>
                    <p className="text-2xl font-semibold text-gray-900">
                      {todayReservations.reduce((sum, r) => sum + r.amount, 0).toLocaleString()} XAF
                    </p>
                  </div>
                  <div className="p-3 bg-yellow-100 rounded-lg">
                    <DollarSign className="w-6 h-6 text-yellow-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Qualité service</p>
                    <p className="text-2xl font-semibold text-gray-900">98%</p>
                  </div>
                  <div className="p-3 bg-green-100 rounded-lg">
                    <CheckCircle className="w-6 h-6 text-green-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="reservations">Réservations sur place</TabsTrigger>
            <TabsTrigger value="validation">Validation listes</TabsTrigger>
            <TabsTrigger value="reconciliation">Rapprochement</TabsTrigger>
          </TabsList>

          {/* On-site Reservations Tab */}
          <TabsContent value="reservations" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Plus className="w-5 h-5" />
                  <span>Nouvelle réservation sur place</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div>
                    <Label htmlFor="passengerName">Nom du passager *</Label>
                    <Input
                      id="passengerName"
                      value={reservationForm.passengerName}
                      onChange={(e) => setReservationForm(prev => ({ ...prev, passengerName: e.target.value }))}
                      placeholder="Jean Dupont"
                    />
                  </div>
                  <div>
                    <Label htmlFor="passengerPhone">Téléphone *</Label>
                    <Input
                      id="passengerPhone"
                      value={reservationForm.passengerPhone}
                      onChange={(e) => setReservationForm(prev => ({ ...prev, passengerPhone: e.target.value }))}
                      placeholder="+241 06 12 34 56"
                    />
                  </div>
                  <div>
                    <Label htmlFor="passengerEmail">Email</Label>
                    <Input
                      id="passengerEmail"
                      type="email"
                      value={reservationForm.passengerEmail}
                      onChange={(e) => setReservationForm(prev => ({ ...prev, passengerEmail: e.target.value }))}
                      placeholder="jean@email.com"
                    />
                  </div>
                  <div>
                    <Label htmlFor="tripSelect">Trajet *</Label>
                    <Select value={reservationForm.tripId} onValueChange={(value) => setReservationForm(prev => ({ ...prev, tripId: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner un trajet" />
                      </SelectTrigger>
                      <SelectContent>
                        {todayTrips.map(trip => (
                          <SelectItem key={trip.id} value={trip.id}>
                            {trip.departure} → {trip.arrival} ({trip.departureTime})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="seatNumber">Numéro de siège</Label>
                    <Input
                      id="seatNumber"
                      value={reservationForm.seatNumber}
                      onChange={(e) => setReservationForm(prev => ({ ...prev, seatNumber: e.target.value }))}
                      placeholder="A12"
                    />
                  </div>
                  <div>
                    <Label htmlFor="paymentMethod">Mode de paiement</Label>
                    <Select value={reservationForm.paymentMethod} onValueChange={(value: any) => setReservationForm(prev => ({ ...prev, paymentMethod: value }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="cash">Espèces</SelectItem>
                        <SelectItem value="mobile_money">Mobile Money</SelectItem>
                        <SelectItem value="pending">En attente</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="amount">Montant</Label>
                    <Input
                      id="amount"
                      type="number"
                      value={reservationForm.amount}
                      onChange={(e) => setReservationForm(prev => ({ ...prev, amount: Number(e.target.value) }))}
                      placeholder="25000"
                    />
                  </div>
                </div>

                <Button 
                  onClick={handleCreateReservation}
                  disabled={isLoading}
                  className="w-full"
                  style={{ backgroundColor: 'rgba(192, 54, 24, 0.9)' }}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Création en cours...
                    </>
                  ) : (
                    <>
                      <Plus className="w-4 h-4 mr-2" />
                      Créer la réservation
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            {/* Today's Reservations List */}
            <Card>
              <CardHeader>
                <CardTitle>Réservations du jour</CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-64">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Passager</TableHead>
                        <TableHead>Trajet</TableHead>
                        <TableHead>Siège</TableHead>
                        <TableHead>Montant</TableHead>
                        <TableHead>Statut</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {todayReservations.map((reservation) => (
                        <TableRow key={reservation.id}>
                          <TableCell>
                            <div>
                              <p className="font-medium">{reservation.passengerName}</p>
                              <p className="text-sm text-gray-500">{reservation.phone}</p>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div>
                              <p>{reservation.departure} → {reservation.arrival}</p>
                              <p className="text-sm text-gray-500">{reservation.departureTime}</p>
                            </div>
                          </TableCell>
                          <TableCell>{reservation.seatNumber}</TableCell>
                          <TableCell>{reservation.amount.toLocaleString()} XAF</TableCell>
                          <TableCell>
                            <Badge variant={reservation.status === 'paid' ? 'default' : 'secondary'}>
                              {reservation.status === 'paid' ? 'Payé' : 'En attente'}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Button variant="outline" size="sm">
                                <Eye className="w-4 h-4" />
                              </Button>
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => handleEditReservation(reservation.id)}
                              >
                                <Edit className="w-4 h-4" />
                              </Button>
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button variant="outline" size="sm">
                                    <Trash2 className="w-4 h-4 text-red-600" />
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
                                    <AlertDialogDescription>
                                      Êtes-vous sûr de vouloir supprimer la réservation de {reservation.passengerName} ? Cette action est irréversible.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>Annuler</AlertDialogCancel>
                                    <AlertDialogAction
                                      onClick={() => handleDeleteReservation(reservation.id)}
                                      className="bg-red-600 hover:bg-red-700"
                                    >
                                      Supprimer
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Passenger List Validation Tab */}
          <TabsContent value="validation" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <CheckCircle className="w-5 h-5" />
                  <span>Validation des listes de passagers</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {todayTrips.map((trip) => (
                    <div key={trip.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium">{trip.departure} → {trip.arrival}</h4>
                          <p className="text-sm text-gray-500">
                            Départ: {trip.departureTime} • Bus: {trip.bus}
                          </p>
                          <p className="text-sm text-gray-500">
                            Passagers: {trip.passengers}/{trip.capacity}
                          </p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleValidatePassengerList(trip.id)}
                            disabled={isLoading}
                          >
                            <Download className="w-4 h-4 mr-2" />
                            Télécharger PDF
                          </Button>
                          <Button
                            onClick={() => handleShowPassengerList(trip)}
                            disabled={isLoading}
                            style={{ backgroundColor: 'rgba(192, 54, 24, 0.9)' }}
                          >
                            {isLoading ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              <>
                                <Check className="w-4 h-4 mr-2" />
                                Valider
                              </>
                            )}
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>



          {/* Payment Reconciliation Tab */}
          <TabsContent value="reconciliation" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <CreditCard className="w-5 h-5" />
                  <span>Rapprochement des paiements</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div>
                    <Label htmlFor="transactionId">ID Transaction</Label>
                    <Input
                      id="transactionId"
                      value={reconciliationForm.transactionId}
                      onChange={(e) => setReconciliationForm(prev => ({ ...prev, transactionId: e.target.value }))}
                      placeholder="TXN123456789"
                    />
                  </div>
                  <div>
                    <Label htmlFor="ticketIdRecon">Numéro de ticket</Label>
                    <Input
                      id="ticketIdRecon"
                      value={reconciliationForm.ticketId}
                      onChange={(e) => setReconciliationForm(prev => ({ ...prev, ticketId: e.target.value }))}
                      placeholder="TK001"
                    />
                  </div>
                  <div>
                    <Label htmlFor="amount">Montant</Label>
                    <Input
                      id="amount"
                      type="number"
                      value={reconciliationForm.amount}
                      onChange={(e) => setReconciliationForm(prev => ({ ...prev, amount: Number(e.target.value) }))}
                      placeholder="25000"
                    />
                  </div>
                  <div>
                    <Label htmlFor="paymentMethodRecon">Mode de paiement</Label>
                    <Select value={reconciliationForm.paymentMethod} onValueChange={(value: any) => setReconciliationForm(prev => ({ ...prev, paymentMethod: value }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="mobile_money">Mobile Money</SelectItem>
                        <SelectItem value="card">Carte bancaire</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <Button 
                  onClick={handlePaymentReconciliation}
                  disabled={isLoading}
                  className="w-full"
                  style={{ backgroundColor: 'rgba(192, 54, 24, 0.9)' }}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Vérification...
                    </>
                  ) : (
                    <>
                      <Search className="w-4 h-4 mr-2" />
                      Rapprocher le paiement
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      {/* Passenger List Validation Modal */}
      <Dialog open={showPassengerListModal} onOpenChange={setShowPassengerListModal}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <Users className="w-5 h-5" />
              <span>Liste des passagers - Validation</span>
            </DialogTitle>
          </DialogHeader>
          
          {selectedTripForValidation && (
            <div className="space-y-4">
              {/* Trip Details */}
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold">
                        {selectedTripForValidation.departure} → {selectedTripForValidation.arrival}
                      </h3>
                      <p className="text-sm text-gray-600">
                        Départ: {selectedTripForValidation.departureTime} • Bus: {selectedTripForValidation.bus}
                      </p>
                      <p className="text-sm text-gray-600">
                        Passagers: {selectedTripForValidation.passengers}/{selectedTripForValidation.capacity}
                      </p>
                    </div>
                    <Badge variant="outline" className="text-blue-600">
                      {getPassengerListForTrip(selectedTripForValidation.id).length} passager(s)
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              {/* Passenger List */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Liste complète des passagers</CardTitle>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-96">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Ticket</TableHead>
                          <TableHead>Nom du passager</TableHead>
                          <TableHead>Téléphone</TableHead>
                          <TableHead>Siège</TableHead>
                          <TableHead>Statut</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {getPassengerListForTrip(selectedTripForValidation.id).map((passenger, index) => (
                          <TableRow key={passenger.ticketId}>
                            <TableCell className="font-mono text-sm">
                              {passenger.ticketId}
                            </TableCell>
                            <TableCell className="font-medium">
                              {passenger.name}
                            </TableCell>
                            <TableCell className="text-sm text-gray-600">
                              {passenger.phone}
                            </TableCell>
                            <TableCell>
                              <Badge variant="outline">
                                {passenger.seat}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <Badge variant={passenger.status === 'confirmed' ? 'default' : 'secondary'}>
                                {passenger.status === 'confirmed' ? 'Confirmé' : 'En attente'}
                              </Badge>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </ScrollArea>
                </CardContent>
              </Card>

              {/* Action Buttons */}
              <div className="flex items-center justify-between pt-4 border-t">
                <div className="text-sm text-gray-600">
                  <p>
                    <span className="font-medium">
                      {getPassengerListForTrip(selectedTripForValidation.id).filter(p => p.status === 'confirmed').length}
                    </span> passager(s) confirmé(s) • 
                    <span className="font-medium ml-1">
                      {getPassengerListForTrip(selectedTripForValidation.id).filter(p => p.status === 'pending').length}
                    </span> en attente
                  </p>
                </div>
                <div className="flex items-center space-x-3">
                  <Button
                    variant="outline"
                    onClick={() => setShowPassengerListModal(false)}
                  >
                    Annuler
                  </Button>
                  <Button
                    onClick={() => handleValidatePassengerList(selectedTripForValidation.id)}
                    disabled={isLoading}
                    style={{ backgroundColor: 'rgba(192, 54, 24, 0.9)' }}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Validation...
                      </>
                    ) : (
                      <>
                        <Check className="w-4 h-4 mr-2" />
                        Valider la liste
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};