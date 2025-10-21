import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  Users,
  CheckCircle,
  DollarSign,
  FileText,
  Clock,
  Search,
  Plus,
  CreditCard,
  Phone,
  Mail,
  MapPin,
  Calendar,
  User,
  Ticket,
  Loader2,
  Check,
  Eye,
  Download,
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { ScrollArea } from './ui/scroll-area';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { toast } from 'sonner';
import { useOperationalData } from './contexts/OperationalDataContext';

interface AgentDashboardFixedProps {
  agentId?: string;
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

export const AgentDashboardFixed: React.FC<AgentDashboardFixedProps> = ({ agentId = 'agent001' }) => {
  // States
  const [activeTab, setActiveTab] = useState('reservations');
  const [selectedTrip, setSelectedTrip] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassengersDialog, setShowPassengersDialog] = useState(false);
  const [selectedTripForPassengers, setSelectedTripForPassengers] = useState<any>(null);
  const [showEditPassengerDialog, setShowEditPassengerDialog] = useState(false);
  const [showDeleteConfirmDialog, setShowDeleteConfirmDialog] = useState(false);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const [selectedPassenger, setSelectedPassenger] = useState<any>(null);
  const [selectedReservationForDetails, setSelectedReservationForDetails] = useState<any>(null);
  
  // État pour modification de passager
  const [editPassengerData, setEditPassengerData] = useState({
    name: '',
    phone: '',
    seatNumber: ''
  });
  
  // 🔥 Utiliser le contexte opérationnel
  const { createOnSiteReservation, validatePassengerList, getAllReservations } = useOperationalData();
  
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

  // 🔥 Récupérer les réservations du contexte
  const todayReservations = getAllReservations();

  // Mock trips for today (à remplacer par les données du contexte si nécessaire)
  const todayTrips = [
    {
      id: 'trip1',
      departure: 'Libreville',
      arrival: 'Port-Gentil',
      departureTime: '08:00',
      bus: 'KC-001',
      passengers: 32,
      capacity: 45
    },
    {
      id: 'trip2',
      departure: 'Libreville',
      arrival: 'Franceville',
      departureTime: '06:00',
      bus: 'KC-002',
      passengers: 28,
      capacity: 50
    }
  ];

  // Create on-site reservation
  const handleCreateReservation = async () => {
    if (!reservationForm.passengerName || !reservationForm.passengerPhone || !reservationForm.tripId) {
      toast.error('Veuillez remplir tous les champs obligatoires');
      return;
    }

    setIsLoading(true);
    try {
      const result = await createOnSiteReservation(reservationForm);
      
      toast.success('Réservation créée avec succès', {
        description: `Ticket: ${result.reservation?.ticketId || 'N/A'}`
      });
      
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
    setIsLoading(true);
    try {
      await validatePassengerList(tripId);
      toast.success('Liste des passagers validée et PDF généré');
    } catch (error) {
      toast.error('Erreur lors de la validation');
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewPassengers = (trip: any) => {
    setSelectedTripForPassengers(trip);
    setShowPassengersDialog(true);
  };

  // Générer des passagers fictifs pour la démo
  const generatePassengersForTrip = (trip: any) => {
    const passengers = [];
    const passengerCount = trip.passengers || 0;
    const names = [
      'Jean Mbeng', 'Marie Obiang', 'Pierre Ndong', 'Sophie Ondo',
      'André Mba', 'Catherine Nguema', 'François Ella', 'Hélène Bongo',
      'Paul Engone', 'Juliette Mintsa', 'Michel Owono', 'Claire Nze'
    ];
    
    for (let i = 0; i < passengerCount; i++) {
      passengers.push({
        id: `PAX${trip.id}-${i + 1}`,
        ticketNumber: `TKT-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
        name: names[i % names.length],
        seatNumber: `${Math.floor(i / 4) + 1}${String.fromCharCode(65 + (i % 4))}`,
        phone: `+241 0${Math.floor(Math.random() * 9) + 1} ${Math.floor(Math.random() * 90 + 10)} ${Math.floor(Math.random() * 90 + 10)} ${Math.floor(Math.random() * 90 + 10)}`
      });
    }
    return passengers;
  };

  // Modifier un passager
  const handleEditPassenger = (passenger: any) => {
    setSelectedPassenger(passenger);
    setEditPassengerData({
      name: passenger.name,
      phone: passenger.phone,
      seatNumber: passenger.seatNumber
    });
    setShowEditPassengerDialog(true);
  };

  // Sauvegarder les modifications du passager
  const handleSavePassengerEdit = () => {
    if (!editPassengerData.name || !editPassengerData.phone || !editPassengerData.seatNumber) {
      toast.error('Veuillez remplir tous les champs');
      return;
    }

    // Log de l'action pour l'admin
    const agentAction = {
      type: 'PASSENGER_MODIFIED',
      agentId: agentId,
      timestamp: new Date().toISOString(),
      details: {
        passengerId: selectedPassenger.id,
        ticketNumber: selectedPassenger.ticketNumber,
        oldData: {
          name: selectedPassenger.name,
          phone: selectedPassenger.phone,
          seatNumber: selectedPassenger.seatNumber
        },
        newData: editPassengerData
      }
    };

    // Émettre l'événement pour l'admin
    window.dispatchEvent(new CustomEvent('agent:passenger:modified', {
      detail: agentAction
    }));

    toast.success('Passager modifié avec succès', {
      description: `${editPassengerData.name} - Siège ${editPassengerData.seatNumber}`
    });

    setShowEditPassengerDialog(false);
    setSelectedPassenger(null);
  };

  // Supprimer un passager
  const handleDeletePassenger = (passenger: any) => {
    setSelectedPassenger(passenger);
    setShowDeleteConfirmDialog(true);
  };

  // Confirmer la suppression
  const handleConfirmDelete = () => {
    // Log de l'action pour l'admin
    const agentAction = {
      type: 'PASSENGER_DELETED',
      agentId: agentId,
      timestamp: new Date().toISOString(),
      details: {
        passengerId: selectedPassenger.id,
        ticketNumber: selectedPassenger.ticketNumber,
        passengerName: selectedPassenger.name,
        seatNumber: selectedPassenger.seatNumber,
        phone: selectedPassenger.phone
      }
    };

    // Émettre l'événement pour l'admin
    window.dispatchEvent(new CustomEvent('agent:passenger:deleted', {
      detail: agentAction
    }));

    toast.success('Passager supprimé avec succès', {
      description: `${selectedPassenger.name} - Ticket ${selectedPassenger.ticketNumber}`
    });

    setShowDeleteConfirmDialog(false);
    setSelectedPassenger(null);
  };

  // Reconcile payment
  const handlePaymentReconciliation = async () => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
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

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard Agent</h1>
          <p className="text-gray-600">Interface opérationnelle terrain - Agent #{agentId}</p>
        </div>
        <Badge variant="secondary" className="bg-green-100 text-green-800">
          <CheckCircle className="w-3 h-3 mr-1" />
          Agent actif
        </Badge>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
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
                  {/* 🔥 Badge de synchronisation */}
                  {todayReservations.length > 0 && (
                    <p className="text-xs text-green-600 mt-1 flex items-center gap-1">
                      <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                      Synchronisé avec la page publique
                    </p>
                  )}
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
              
              {/* 🔥 Indicateur de synchronisation */}
              {todayReservations.length > 0 && (
                <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center gap-2 text-sm text-green-800">
                    <CheckCircle className="w-4 h-4" />
                    <span>
                      {todayReservations.length} réservation(s) synchronisée(s) avec la page publique
                    </span>
                  </div>
                </div>
              )}
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
                          <Button variant="outline" size="sm">
                            <Eye className="w-4 h-4" />
                          </Button>
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
                          onClick={() => handleViewPassengers(trip)}
                        >
                          <Eye className="w-4 h-4 mr-2" />
                          Voir passagers
                        </Button>
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
                          onClick={() => handleValidatePassengerList(trip.id)}
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
                  <Label htmlFor="amountRecon">Montant</Label>
                  <Input
                    id="amountRecon"
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
                    Rapprochement en cours...
                  </>
                ) : (
                  <>
                    <CreditCard className="w-4 h-4 mr-2" />
                    Effectuer le rapprochement
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Dialog Liste des passagers */}
      <Dialog open={showPassengersDialog} onOpenChange={setShowPassengersDialog}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" style={{ color: 'rgba(192, 54, 24, 0.9)' }} />
              Liste des Passagers
            </DialogTitle>
            <DialogDescription>
              {selectedTripForPassengers && (
                <>
                  {selectedTripForPassengers.departure} → {selectedTripForPassengers.arrival} • 
                  Départ: {selectedTripForPassengers.departureTime} • 
                  Bus: {selectedTripForPassengers.bus}
                </>
              )}
            </DialogDescription>
          </DialogHeader>

          {selectedTripForPassengers && (
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="text-sm text-gray-600">Total passagers</p>
                  <p className="text-2xl">{selectedTripForPassengers.passengers}/{selectedTripForPassengers.capacity}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Places disponibles</p>
                  <p className="text-2xl">{selectedTripForPassengers.capacity - selectedTripForPassengers.passengers}</p>
                </div>
              </div>

              <div className="border rounded-lg">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>#</TableHead>
                      <TableHead>N° Ticket</TableHead>
                      <TableHead>Nom du passager</TableHead>
                      <TableHead>Siège</TableHead>
                      <TableHead>Téléphone</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {generatePassengersForTrip(selectedTripForPassengers).map((passenger, index) => (
                      <TableRow key={passenger.id}>
                        <TableCell>{index + 1}</TableCell>
                        <TableCell>
                          <code className="px-2 py-1 bg-gray-100 rounded text-sm">
                            {passenger.ticketNumber}
                          </code>
                        </TableCell>
                        <TableCell>{passenger.name}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{passenger.seatNumber}</Badge>
                        </TableCell>
                        <TableCell className="text-sm text-gray-600">
                          {passenger.phone}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleEditPassenger(passenger)}
                              title="Modifier"
                            >
                              <Edit className="h-4 w-4 text-blue-600" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleDeletePassenger(passenger)}
                              title="Supprimer"
                            >
                              <Trash2 className="h-4 w-4 text-red-600" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    toast.success('Liste exportée en PDF');
                  }}
                >
                  <Download className="w-4 h-4 mr-2" />
                  Exporter en PDF
                </Button>
                <Button
                  onClick={() => setShowPassengersDialog(false)}
                  style={{ backgroundColor: 'rgba(192, 54, 24, 0.9)' }}
                >
                  Fermer
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Dialog Modifier Passager */}
      <Dialog open={showEditPassengerDialog} onOpenChange={setShowEditPassengerDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Edit className="h-5 w-5" style={{ color: 'rgba(192, 54, 24, 0.9)' }} />
              Modifier Passager
            </DialogTitle>
            <DialogDescription>
              {selectedPassenger && `Ticket: ${selectedPassenger.ticketNumber}`}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <Label>Nom complet *</Label>
              <Input
                value={editPassengerData.name}
                onChange={(e) => setEditPassengerData({ ...editPassengerData, name: e.target.value })}
                placeholder="Nom du passager"
              />
            </div>

            <div>
              <Label>Téléphone *</Label>
              <Input
                value={editPassengerData.phone}
                onChange={(e) => setEditPassengerData({ ...editPassengerData, phone: e.target.value })}
                placeholder="+241 XX XX XX XX"
              />
            </div>

            <div>
              <Label>Numéro de siège *</Label>
              <Input
                value={editPassengerData.seatNumber}
                onChange={(e) => setEditPassengerData({ ...editPassengerData, seatNumber: e.target.value })}
                placeholder="Ex: 1A, 2B"
              />
            </div>

            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-800">
                ℹ️ Cette modification sera automatiquement notifiée à l'administrateur et visible dans son espace de supervision.
              </p>
            </div>

            <div className="flex justify-end gap-2">
              <Button 
                variant="outline" 
                onClick={() => setShowEditPassengerDialog(false)}
              >
                Annuler
              </Button>
              <Button 
                onClick={handleSavePassengerEdit}
                style={{ backgroundColor: 'rgba(192, 54, 24, 0.9)' }}
                className="text-white hover:opacity-90"
              >
                <Check className="h-4 w-4 mr-2" />
                Enregistrer
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Dialog Confirmation Suppression */}
      <Dialog open={showDeleteConfirmDialog} onOpenChange={setShowDeleteConfirmDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-600">
              <Trash2 className="h-5 w-5" />
              Supprimer Passager
            </DialogTitle>
            <DialogDescription>
              {selectedPassenger && `${selectedPassenger.name} - Ticket: ${selectedPassenger.ticketNumber}`}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-800">
                ⚠️ <strong>Attention :</strong> Cette action supprimera définitivement ce passager du trajet.
                Le siège {selectedPassenger?.seatNumber} sera libéré.
              </p>
            </div>

            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-800">
                ℹ️ Cette suppression sera automatiquement notifiée à l'administrateur et enregistrée dans les logs du système.
              </p>
            </div>

            <div className="flex justify-end gap-2">
              <Button 
                variant="outline" 
                onClick={() => setShowDeleteConfirmDialog(false)}
              >
                Annuler
              </Button>
              <Button 
                onClick={handleConfirmDelete}
                variant="destructive"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Confirmer la suppression
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Dialog Détails Passager et Trajet */}
      <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5" style={{ color: 'rgba(192, 54, 24, 0.9)' }} />
              Détails de la Réservation
            </DialogTitle>
            <DialogDescription>
              Informations complètes du passager et du trajet
            </DialogDescription>
          </DialogHeader>

          {selectedReservationForDetails && (
            <div className="space-y-6">
              {/* Informations du Passager */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Informations du Passager
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm text-gray-500">Nom complet</Label>
                      <p className="text-base mt-1">{selectedReservationForDetails.passenger}</p>
                    </div>
                    <div>
                      <Label className="text-sm text-gray-500">N° Réservation</Label>
                      <p className="text-base mt-1">
                        <code className="px-2 py-1 bg-gray-100 rounded">
                          {selectedReservationForDetails.id}
                        </code>
                      </p>
                    </div>
                    <div>
                      <Label className="text-sm text-gray-500">Téléphone</Label>
                      <p className="text-base mt-1 flex items-center gap-2">
                        <Phone className="h-4 w-4 text-gray-400" />
                        +241 01 23 45 67
                      </p>
                    </div>
                    <div>
                      <Label className="text-sm text-gray-500">Email</Label>
                      <p className="text-base mt-1 flex items-center gap-2">
                        <Mail className="h-4 w-4 text-gray-400" />
                        passager@example.ga
                      </p>
                    </div>
                    <div>
                      <Label className="text-sm text-gray-500">Siège</Label>
                      <p className="text-base mt-1">
                        <Badge variant="outline" className="text-base">
                          {selectedReservationForDetails.seat}
                        </Badge>
                      </p>
                    </div>
                    <div>
                      <Label className="text-sm text-gray-500">Statut</Label>
                      <p className="text-base mt-1">
                        <Badge 
                          variant={
                            selectedReservationForDetails.status === 'confirmé' ? 'default' : 
                            selectedReservationForDetails.status === 'en attente' ? 'secondary' : 
                            'destructive'
                          }
                        >
                          {selectedReservationForDetails.status}
                        </Badge>
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Informations du Trajet */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <MapPin className="h-5 w-5" />
                    Détails du Trajet
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm text-gray-500">Départ</Label>
                      <p className="text-base mt-1 flex items-center gap-2">
                        <MapPin className="h-4 w-4" style={{ color: 'rgba(192, 54, 24, 0.9)' }} />
                        {selectedReservationForDetails.route.split(' → ')[0]}
                      </p>
                    </div>
                    <div>
                      <Label className="text-sm text-gray-500">Arrivée</Label>
                      <p className="text-base mt-1 flex items-center gap-2">
                        <MapPin className="h-4 w-4" style={{ color: 'rgba(192, 54, 24, 0.9)' }} />
                        {selectedReservationForDetails.route.split(' → ')[1]}
                      </p>
                    </div>
                    <div>
                      <Label className="text-sm text-gray-500">Date et heure</Label>
                      <p className="text-base mt-1 flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-gray-400" />
                        {selectedReservationForDetails.date} à {selectedReservationForDetails.time}
                      </p>
                    </div>
                    <div>
                      <Label className="text-sm text-gray-500">Durée estimée</Label>
                      <p className="text-base mt-1 flex items-center gap-2">
                        <Clock className="h-4 w-4 text-gray-400" />
                        4h30
                      </p>
                    </div>
                    <div>
                      <Label className="text-sm text-gray-500">Type de bus</Label>
                      <p className="text-base mt-1">Standard climatisé</p>
                    </div>
                    <div>
                      <Label className="text-sm text-gray-500">Places disponibles</Label>
                      <p className="text-base mt-1">12/45 places</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Informations de Paiement */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <CreditCard className="h-5 w-5" />
                    Informations de Paiement
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm text-gray-500">Montant total</Label>
                      <p className="text-xl mt-1" style={{ color: 'rgba(192, 54, 24, 0.9)' }}>
                        {selectedReservationForDetails.amount.toLocaleString()} F CFA
                      </p>
                    </div>
                    <div>
                      <Label className="text-sm text-gray-500">Méthode de paiement</Label>
                      <p className="text-base mt-1">
                        <Badge variant="outline">
                          {selectedReservationForDetails.paymentMethod === 'cash' ? 'Espèces' :
                           selectedReservationForDetails.paymentMethod === 'mobile_money' ? 'Mobile Money' :
                           selectedReservationForDetails.paymentMethod === 'card' ? 'Carte bancaire' :
                           'En attente'}
                        </Badge>
                      </p>
                    </div>
                    <div>
                      <Label className="text-sm text-gray-500">Statut paiement</Label>
                      <p className="text-base mt-1">
                        <Badge variant="default" className="bg-green-500">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Payé
                        </Badge>
                      </p>
                    </div>
                    <div>
                      <Label className="text-sm text-gray-500">Date de paiement</Label>
                      <p className="text-base mt-1">{selectedReservationForDetails.date}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Actions */}
              <div className="flex justify-end gap-2">
                <Button 
                  variant="outline" 
                  onClick={() => {
                    toast.success('Ticket téléchargé');
                  }}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Télécharger le ticket
                </Button>
                <Button 
                  onClick={() => setShowDetailsDialog(false)}
                  style={{ backgroundColor: 'rgba(192, 54, 24, 0.9)' }}
                  className="text-white"
                >
                  Fermer
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};