import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, Home, CheckCircle, DollarSign, Calendar, LogOut, Plus, 
  Download, Users, Clock, MapPin, CreditCard, AlertCircle,
  Search, Filter, Eye, FileText, Printer, CheckCheck
} from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { toast } from 'sonner';
import { Alert, AlertDescription } from './ui/alert';

interface AgentDashboardFullProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AgentDashboardFull: React.FC<AgentDashboardFullProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState('home');
  const [isLoading, setIsLoading] = useState(false);
  const [showCreateReservation, setShowCreateReservation] = useState(false);
  const [showRefundForm, setShowRefundForm] = useState(false);
  const [showReconciliation, setShowReconciliation] = useState(false);
  
  // États pour les données
  const [reservations, setReservations] = useState([
    { id: 'KC24001', passenger: 'Marie Ngema', route: 'Libreville → Port-Gentil', date: '2024-01-15', price: 15000, status: 'Confirmé', paymentStatus: 'PAID' },
    { id: 'KC24002', passenger: 'Jean Obame', route: 'Port-Gentil → Libreville', date: '2024-01-16', price: 15000, status: 'En attente', paymentStatus: 'PENDING' },
    { id: 'KC24003', passenger: 'Sophie Andeme', route: 'Libreville → Franceville', date: '2024-01-17', price: 25000, status: 'Confirmé', paymentStatus: 'PAID' },
  ]);

  const [trips] = useState([
    { id: '001', route: 'Libreville → Port-Gentil', time: '08:00', passengers: 45, validated: 42, bus: 'KCB-001', status: 'En cours' },
    { id: '002', route: 'Libreville → Franceville', time: '10:30', passengers: 38, validated: 38, bus: 'KCB-002', status: 'Validé' },
    { id: '003', route: 'Port-Gentil → Libreville', time: '14:00', passengers: 52, validated: 48, bus: 'KCB-003', status: 'En cours' },
  ]);

  const [events, setEvents] = useState<string[]>([]);

  const addEvent = (message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setEvents(prev => [`${timestamp} - ${message}`, ...prev.slice(0, 9)]);
  };

  // Gestion des actions
  const handleCreateReservation = async (formData: any) => {
    setIsLoading(true);
    try {
      // API: createOnSiteReservation(payload)
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newReservation = {
        id: `KC${Date.now()}`,
        passenger: `${formData.firstName} ${formData.lastName}`,
        route: `${formData.departure} → ${formData.arrival}`,
        date: formData.date,
        price: parseInt(formData.price),
        status: 'Confirmé',
        paymentStatus: 'PAID'
      };
      
      setReservations(prev => [newReservation, ...prev]);
      addEvent(`Réservation créée: ${newReservation.id} pour ${newReservation.passenger}`);
      toast.success('Réservation créée avec succès');
      setShowCreateReservation(false);
    } catch (error) {
      toast.error('Erreur lors de la création de la réservation');
    } finally {
      setIsLoading(false);
    }
  };

  const handleValidatePassengers = async (tripId: string) => {
    setIsLoading(true);
    try {
      // API: generatePassengerListPDF(tripId) => URL PDF + horodatage
      await new Promise(resolve => setTimeout(resolve, 1500));
      const pdfUrl = `https://karis-continental.ga/pdf/trip-${tripId}-${Date.now()}.pdf`;
      addEvent(`PDF généré pour le trajet ${tripId}: Liste figée et horodatée`);
      toast.success('Liste des passagers validée - PDF généré');
      
      // Simuler le téléchargement du PDF
      window.open(pdfUrl, '_blank');
    } catch (error) {
      toast.error('Erreur lors de la validation');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInitiateRefund = async (reservationId: string, reason: string) => {
    setIsLoading(true);
    try {
      const reservation = reservations.find(r => r.id === reservationId);
      if (!reservation) return;

      const reservationDate = new Date(reservation.date);
      const now = new Date();
      const hoursDiff = (now.getTime() - reservationDate.getTime()) / (1000 * 3600);

      // API: initiateRefund(ticketId) => reject if > 48h
      if (hoursDiff > 48) {
        toast.error('Remboursement refusé: Délai de 48h dépassé');
        addEvent(`Remboursement refusé pour ${reservationId}: Délai dépassé (${Math.round(hoursDiff)}h)`);
        return;
      }

      await new Promise(resolve => setTimeout(resolve, 1000));
      addEvent(`Remboursement initié pour ${reservationId}: ${reason}`);
      toast.success('Demande de remboursement traitée');
      setShowRefundForm(false);
    } catch (error) {
      toast.error('Erreur lors du traitement du remboursement');
    } finally {
      setIsLoading(false);
    }
  };

  const handleReconcilePayment = async (transactionId: string) => {
    setIsLoading(true);
    try {
      // API: reconcilePayment(transactionId) => updates status to PAID
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Simuler la recherche de transaction
      if (transactionId.startsWith('TXN')) {
        const updatedReservations = reservations.map(r => 
          r.paymentStatus === 'PENDING' ? { ...r, paymentStatus: 'PAID' } : r
        );
        setReservations(updatedReservations);
        addEvent(`Paiement rapproché: Transaction ${transactionId} trouvée - Statut mis à jour`);
        toast.success('Paiement rapproché avec succès');
      } else {
        toast.error('Transaction non trouvée');
        addEvent(`Échec rapprochement: Transaction ${transactionId} introuvable`);
      }
      setShowReconciliation(false);
    } catch (error) {
      toast.error('Erreur lors du rapprochement');
    } finally {
      setIsLoading(false);
    }
  };

  const tabs = [
    { id: 'home', label: 'Tableau de bord', icon: Home },
    { id: 'validation', label: 'Validation', icon: CheckCircle },
    { id: 'bookings', label: 'Réservations', icon: Calendar },
    { id: 'refunds', label: 'Remboursements', icon: DollarSign },
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-white rounded-xl shadow-2xl w-full max-w-7xl h-[90vh] sm:h-[95vh] overflow-hidden flex flex-col sm:flex-row"
      >
        {/* Sidebar */}
        <div className="w-full sm:w-64 bg-green-600 text-white p-4 sm:p-6 flex flex-col">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl font-semibold">Agent Contrôleur</h2>
            <button
              onClick={onClose}
              className="text-white hover:text-gray-300 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <nav className="space-y-2 flex-1">
            {tabs.map((tab) => {
              const IconComponent = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                    activeTab === tab.id
                      ? 'bg-white bg-opacity-20'
                      : 'hover:bg-white hover:bg-opacity-10'
                  }`}
                >
                  <IconComponent className="w-5 h-5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Journal des événements */}
          <div className="mt-6 bg-white bg-opacity-10 rounded-lg p-3">
            <h4 className="font-medium mb-2 text-sm">Journal d'activité</h4>
            <div className="text-xs space-y-1 max-h-32 overflow-y-auto">
              {events.slice(0, 5).map((event, index) => (
                <div key={index} className="text-green-100 opacity-90">
                  {event}
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-green-500">
            <button
              onClick={onClose}
              className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-white hover:bg-opacity-10 transition-colors"
            >
              <LogOut className="w-5 h-5" />
              <span>Déconnexion</span>
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-4 sm:p-6 overflow-y-auto">
          <AnimatePresence mode="wait">
            {activeTab === 'home' && (
              <motion.div
                key="home"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-6"
              >
                <h3 className="text-2xl font-semibold text-gray-900">Tableau de Bord - Agent Contrôleur</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-600">Trajets Aujourd'hui</p>
                          <p className="text-2xl font-semibold">{trips.length}</p>
                        </div>
                        <Calendar className="w-8 h-8 text-green-600" />
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-600">Passagers Validés</p>
                          <p className="text-2xl font-semibold">{trips.reduce((acc, trip) => acc + trip.validated, 0)}</p>
                        </div>
                        <CheckCircle className="w-8 h-8 text-green-600" />
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-600">Réservations Actives</p>
                          <p className="text-2xl font-semibold">{reservations.length}</p>
                        </div>
                        <Users className="w-8 h-8 text-green-600" />
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-600">Paiements En Retard</p>
                          <p className="text-2xl font-semibold">{reservations.filter(r => r.paymentStatus === 'PENDING').length}</p>
                        </div>
                        <AlertCircle className="w-8 h-8 text-orange-600" />
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Trajets en cours de validation</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {trips.filter(trip => trip.status === 'En cours').map(trip => (
                          <div key={trip.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <div>
                              <p className="font-medium">{trip.route}</p>
                              <p className="text-sm text-gray-600">{trip.time} - {trip.bus}</p>
                              <p className="text-sm text-green-600">{trip.validated}/{trip.passengers} validés</p>
                            </div>
                            <Button
                              size="sm"
                              onClick={() => handleValidatePassengers(trip.id)}
                              disabled={isLoading}
                              className="bg-green-600 hover:bg-green-700"
                            >
                              Valider
                            </Button>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Actions rapides</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <Button
                          onClick={() => setShowCreateReservation(true)}
                          className="w-full justify-start bg-green-600 hover:bg-green-700"
                        >
                          <Plus className="w-4 h-4 mr-2" />
                          Nouvelle réservation sur place
                        </Button>
                        <Button
                          onClick={() => setShowRefundForm(true)}
                          variant="outline"
                          className="w-full justify-start"
                        >
                          <DollarSign className="w-4 h-4 mr-2" />
                          Traiter un remboursement
                        </Button>
                        <Button
                          onClick={() => setShowReconciliation(true)}
                          variant="outline"
                          className="w-full justify-start"
                        >
                          <CreditCard className="w-4 h-4 mr-2" />
                          Rapprochement paiement
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </motion.div>
            )}

            {activeTab === 'validation' && (
              <motion.div
                key="validation"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-6"
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-2xl font-semibold text-gray-900">Validation Passagers</h3>
                  <Badge variant="outline" className="text-green-600 border-green-200">
                    {trips.filter(t => t.status === 'En cours').length} trajets en attente
                  </Badge>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {trips.map((trip) => (
                    <Card key={trip.id} className="border-l-4 border-l-green-500">
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-lg">{trip.bus}</CardTitle>
                          <Badge 
                            variant={trip.status === 'Validé' ? 'default' : 'secondary'}
                            className={trip.status === 'Validé' ? 'bg-green-100 text-green-800' : ''}
                          >
                            {trip.status}
                          </Badge>
                        </div>
                        <CardDescription>{trip.route}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-600">Départ:</span>
                            <span className="font-medium">{trip.time}</span>
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-600">Validation:</span>
                            <span className="font-medium">{trip.validated}/{trip.passengers}</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-green-600 h-2 rounded-full transition-all duration-300"
                              style={{ width: `${(trip.validated / trip.passengers) * 100}%` }}
                            />
                          </div>
                          <div className="flex space-x-2 pt-2">
                            <Button
                              size="sm"
                              onClick={() => handleValidatePassengers(trip.id)}
                              disabled={isLoading || trip.status === 'Validé'}
                              className="flex-1 bg-green-600 hover:bg-green-700"
                            >
                              <CheckCheck className="w-4 h-4 mr-2" />
                              {trip.status === 'Validé' ? 'Validé' : 'Valider'}
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => toast.info(`Scan QR pour ${trip.bus}`)}
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                <Alert>
                  <FileText className="w-4 h-4" />
                  <AlertDescription>
                    La validation génère un PDF horodaté et immuable de la liste des passagers. 
                    Une fois validé, le document ne peut plus être modifié.
                  </AlertDescription>
                </Alert>
              </motion.div>
            )}

            {activeTab === 'bookings' && (
              <motion.div
                key="bookings"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-6"
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-2xl font-semibold text-gray-900">Gestion des Réservations</h3>
                  <Button 
                    onClick={() => setShowCreateReservation(true)}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Nouvelle Réservation
                  </Button>
                </div>

                <Card>
                  <CardContent className="p-6">
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b">
                            <th className="text-left p-3 font-medium">Référence</th>
                            <th className="text-left p-3 font-medium">Passager</th>
                            <th className="text-left p-3 font-medium">Trajet</th>
                            <th className="text-left p-3 font-medium">Date</th>
                            <th className="text-left p-3 font-medium">Prix</th>
                            <th className="text-left p-3 font-medium">Statut</th>
                            <th className="text-left p-3 font-medium">Paiement</th>
                            <th className="text-left p-3 font-medium">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {reservations.map((booking) => (
                            <tr key={booking.id} className="border-b hover:bg-gray-50">
                              <td className="p-3 font-medium">{booking.id}</td>
                              <td className="p-3">{booking.passenger}</td>
                              <td className="p-3">{booking.route}</td>
                              <td className="p-3">{booking.date}</td>
                              <td className="p-3">{booking.price.toLocaleString()} FCFA</td>
                              <td className="p-3">
                                <Badge 
                                  variant={booking.status === 'Confirmé' ? 'default' : 'secondary'}
                                  className={booking.status === 'Confirmé' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}
                                >
                                  {booking.status}
                                </Badge>
                              </td>
                              <td className="p-3">
                                <Badge 
                                  variant={booking.paymentStatus === 'PAID' ? 'default' : 'destructive'}
                                  className={booking.paymentStatus === 'PAID' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}
                                >
                                  {booking.paymentStatus === 'PAID' ? 'Payé' : 'En attente'}
                                </Badge>
                              </td>
                              <td className="p-3">
                                <div className="flex space-x-2">
                                  <Button 
                                    size="sm" 
                                    variant="outline"
                                    onClick={() => toast.info(`Modification de ${booking.id}`)}
                                  >
                                    Modifier
                                  </Button>
                                  <Button 
                                    size="sm" 
                                    variant="outline"
                                    onClick={() => toast.info(`Détails de ${booking.id}`)}
                                  >
                                    <Eye className="w-4 h-4" />
                                  </Button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {activeTab === 'refunds' && (
              <motion.div
                key="refunds"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-6"
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-2xl font-semibold text-gray-900">Gestion des Remboursements</h3>
                  <Button 
                    onClick={() => setShowRefundForm(true)}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <DollarSign className="w-4 h-4 mr-2" />
                    Traiter Remboursement
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card className="border-l-4 border-l-yellow-500">
                    <CardContent className="p-4">
                      <div className="text-2xl font-semibold text-yellow-800">7</div>
                      <div className="text-sm text-yellow-600">En attente</div>
                    </CardContent>
                  </Card>
                  <Card className="border-l-4 border-l-green-500">
                    <CardContent className="p-4">
                      <div className="text-2xl font-semibold text-green-800">15</div>
                      <div className="text-sm text-green-600">Approuvés</div>
                    </CardContent>
                  </Card>
                  <Card className="border-l-4 border-l-red-500">
                    <CardContent className="p-4">
                      <div className="text-2xl font-semibold text-red-800">2</div>
                      <div className="text-sm text-red-600">Refusés (&gt;48h)</div>
                    </CardContent>
                  </Card>
                </div>

                <Alert>
                  <Clock className="w-4 h-4" />
                  <AlertDescription>
                    <strong>Règle métier importante:</strong> Les remboursements ne sont possibles que dans les 48 heures suivant l'achat du billet.
                  </AlertDescription>
                </Alert>

                <Card>
                  <CardContent className="p-6">
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b">
                            <th className="text-left p-3 font-medium">Référence</th>
                            <th className="text-left p-3 font-medium">Passager</th>
                            <th className="text-left p-3 font-medium">Montant</th>
                            <th className="text-left p-3 font-medium">Motif</th>
                            <th className="text-left p-3 font-medium">Date Demande</th>
                            <th className="text-left p-3 font-medium">Délai</th>
                            <th className="text-left p-3 font-medium">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {[
                            { ref: 'RB24001', name: 'Alice Mba', amount: 15000, reason: 'Annulation voyage', date: '2024-01-10', hours: 25 },
                            { ref: 'RB24002', name: 'Pierre Nze', amount: 25000, reason: 'Problème médical', date: '2024-01-12', hours: 15 },
                            { ref: 'RB24003', name: 'Claire Akue', amount: 15000, reason: 'Changement planning', date: '2024-01-14', hours: 60 },
                          ].map((refund) => (
                            <tr key={refund.ref} className="border-b hover:bg-gray-50">
                              <td className="p-3 font-medium">{refund.ref}</td>
                              <td className="p-3">{refund.name}</td>
                              <td className="p-3">{refund.amount.toLocaleString()} FCFA</td>
                              <td className="p-3">{refund.reason}</td>
                              <td className="p-3">{refund.date}</td>
                              <td className="p-3">
                                <Badge 
                                  variant={refund.hours > 48 ? 'destructive' : 'default'}
                                  className={refund.hours > 48 ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}
                                >
                                  {refund.hours}h
                                </Badge>
                              </td>
                              <td className="p-3">
                                <div className="flex space-x-2">
                                  {refund.hours <= 48 ? (
                                    <>
                                      <Button 
                                        size="sm" 
                                        onClick={() => handleInitiateRefund(refund.ref, refund.reason)}
                                        className="bg-green-600 hover:bg-green-700"
                                        disabled={isLoading}
                                      >
                                        Approuver
                                      </Button>
                                      <Button 
                                        size="sm" 
                                        variant="outline"
                                        onClick={() => toast.info(`Refus de ${refund.ref}`)}
                                      >
                                        Refuser
                                      </Button>
                                    </>
                                  ) : (
                                    <Badge variant="destructive">Délai dépassé</Badge>
                                  )}
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* Modales */}
      <AnimatePresence>
        {showCreateReservation && (
          <CreateReservationModal
            onClose={() => setShowCreateReservation(false)}
            onSubmit={handleCreateReservation}
            isLoading={isLoading}
          />
        )}
        
        {showRefundForm && (
          <RefundFormModal
            onClose={() => setShowRefundForm(false)}
            onSubmit={handleInitiateRefund}
            isLoading={isLoading}
          />
        )}
        
        {showReconciliation && (
          <ReconciliationModal
            onClose={() => setShowReconciliation(false)}
            onSubmit={handleReconcilePayment}
            isLoading={isLoading}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

// Modales auxiliaires
const CreateReservationModal: React.FC<{
  onClose: () => void;
  onSubmit: (data: any) => void;
  isLoading: boolean;
}> = ({ onClose, onSubmit, isLoading }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    departure: '',
    arrival: '',
    date: '',
    price: '15000'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white rounded-xl p-6 w-full max-w-md"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Nouvelle Réservation</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="firstName">Prénom</Label>
              <Input
                id="firstName"
                value={formData.firstName}
                onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
                required
              />
            </div>
            <div>
              <Label htmlFor="lastName">Nom</Label>
              <Input
                id="lastName"
                value={formData.lastName}
                onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
                required
              />
            </div>
          </div>

          <div>
            <Label htmlFor="phone">Téléphone</Label>
            <Input
              id="phone"
              value={formData.phone}
              onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
              placeholder="+241 XX XX XX XX"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="departure">Départ</Label>
              <Select value={formData.departure} onValueChange={(value) => setFormData(prev => ({ ...prev, departure: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Choisir" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Libreville">Libreville</SelectItem>
                  <SelectItem value="Port-Gentil">Port-Gentil</SelectItem>
                  <SelectItem value="Franceville">Franceville</SelectItem>
                  <SelectItem value="Oyem">Oyem</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="arrival">Arrivée</Label>
              <Select value={formData.arrival} onValueChange={(value) => setFormData(prev => ({ ...prev, arrival: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Choisir" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Libreville">Libreville</SelectItem>
                  <SelectItem value="Port-Gentil">Port-Gentil</SelectItem>
                  <SelectItem value="Franceville">Franceville</SelectItem>
                  <SelectItem value="Oyem">Oyem</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="date">Date de voyage</Label>
            <Input
              id="date"
              type="date"
              value={formData.date}
              onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
              required
            />
          </div>

          <div>
            <Label htmlFor="price">Prix (FCFA)</Label>
            <Input
              id="price"
              type="number"
              value={formData.price}
              onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
              required
            />
          </div>

          <div className="flex space-x-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
              Annuler
            </Button>
            <Button 
              type="submit" 
              disabled={isLoading}
              className="flex-1 bg-green-600 hover:bg-green-700"
            >
              {isLoading ? 'Création...' : 'Créer'}
            </Button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

const RefundFormModal: React.FC<{
  onClose: () => void;
  onSubmit: (reservationId: string, reason: string) => void;
  isLoading: boolean;
}> = ({ onClose, onSubmit, isLoading }) => {
  const [reservationId, setReservationId] = useState('');
  const [reason, setReason] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(reservationId, reason);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white rounded-xl p-6 w-full max-w-md"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Traiter un Remboursement</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <Alert className="mb-4">
          <Clock className="w-4 h-4" />
          <AlertDescription>
            Attention: Les remboursements ne sont autorisés que dans les 48h suivant l'achat.
          </AlertDescription>
        </Alert>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="reservationId">Référence de réservation</Label>
            <Input
              id="reservationId"
              value={reservationId}
              onChange={(e) => setReservationId(e.target.value)}
              placeholder="KC24001"
              required
            />
          </div>

          <div>
            <Label htmlFor="reason">Motif du remboursement</Label>
            <Select value={reason} onValueChange={setReason}>
              <SelectTrigger>
                <SelectValue placeholder="Choisir un motif" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Annulation voyage">Annulation voyage</SelectItem>
                <SelectItem value="Problème médical">Problème médical</SelectItem>
                <SelectItem value="Changement planning">Changement planning</SelectItem>
                <SelectItem value="Problème technique">Problème technique</SelectItem>
                <SelectItem value="Autre">Autre</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex space-x-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
              Annuler
            </Button>
            <Button 
              type="submit" 
              disabled={isLoading || !reservationId || !reason}
              className="flex-1 bg-green-600 hover:bg-green-700"
            >
              {isLoading ? 'Traitement...' : 'Traiter'}
            </Button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

const ReconciliationModal: React.FC<{
  onClose: () => void;
  onSubmit: (transactionId: string) => void;
  isLoading: boolean;
}> = ({ onClose, onSubmit, isLoading }) => {
  const [transactionId, setTransactionId] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(transactionId);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white rounded-xl p-6 w-full max-w-md"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Rapprochement Paiement</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <Alert className="mb-4">
          <CreditCard className="w-4 h-4" />
          <AlertDescription>
            Saisissez le numéro de transaction pour mettre à jour le statut des paiements en retard.
          </AlertDescription>
        </Alert>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="transactionId">Numéro de transaction</Label>
            <Input
              id="transactionId"
              value={transactionId}
              onChange={(e) => setTransactionId(e.target.value)}
              placeholder="TXN123456789"
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              Exemple: TXN123456789 (transaction existante pour démonstration)
            </p>
          </div>

          <div className="flex space-x-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
              Annuler
            </Button>
            <Button 
              type="submit" 
              disabled={isLoading || !transactionId}
              className="flex-1 bg-green-600 hover:bg-green-700"
            >
              {isLoading ? 'Recherche...' : 'Rapprocher'}
            </Button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};