import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Ticket, 
  Search, 
  Filter, 
  Eye, 
  Edit, 
  X,
  Check,
  AlertTriangle,
  User,
  Calendar,
  MapPin,
  CreditCard,
  Phone,
  Mail,
  Clock,
  Printer,
  Download,
  RefreshCw,
  Ban,
  CheckCircle,
  DollarSign,
  TrendingUp,
  FileText,
  Send,
  MessageSquare,
  Shield,
  Copy,
  QrCode,
  Smartphone,
  Globe,
  AlertTriangle,
  Info,
  Plus,
  Settings,
  MoreHorizontal,
  ArrowUpDown,
  Calendar as CalendarIcon,
  Users,
  Zap,
  Bell,
  History,
  Star,
  Percent,
  Gift,
  RotateCcw
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Badge } from './ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { Separator } from './ui/separator';
import { ScrollArea } from './ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { toast } from 'sonner';

interface BookingTicket {
  id: string;
  ticketNumber: string;
  passengerName: string;
  passengerEmail: string;
  passengerPhone: string;
  departure: string;
  arrival: string;
  departureDate: string;
  departureTime: string;
  seatNumber: string;
  price: number;
  originalPrice: number;
  discountApplied?: number;
  paymentStatus: 'paid' | 'pending' | 'failed' | 'refunded' | 'partial';
  bookingStatus: 'confirmed' | 'cancelled' | 'no-show' | 'checked-in' | 'boarding' | 'completed';
  bookingDate: string;
  paymentMethod: 'card' | 'mobile' | 'cash' | 'bank' | 'voucher';
  bus: string;
  specialRequests?: string;
  passengerType: 'adult' | 'child' | 'senior' | 'student';
  emergencyContact?: string;
  checkedInAt?: string;
  checkedInBy?: string;
  refundReason?: string;
  refundAmount?: number;
  refundDate?: string;
  qrCode: string;
  loyaltyPoints?: number;
  promotionCode?: string;
  groupBookingId?: string;
  notes?: string;
  paymentReference?: string;
  insuranceAdded: boolean;
  baggageWeight?: number;
  priority: 'normal' | 'high' | 'urgent';
  communicationPreference: 'email' | 'sms' | 'both';
  lastNotificationSent?: string;
  refundEligible: boolean;
  cancellationFee?: number;
}

interface TicketManagementProps {
  className?: string;
}

export const TicketManagement: React.FC<TicketManagementProps> = ({ className = '' }) => {
  const [tickets, setTickets] = useState<BookingTicket[]>([
    {
      id: '1',
      ticketNumber: 'KC-001-240115-001',
      passengerName: 'Jean Marie Obame',
      passengerEmail: 'jean.obame@gmail.com',
      passengerPhone: '+241 06 12 34 56',
      departure: 'Libreville',
      arrival: 'Port-Gentil',
      departureDate: '2024-01-15',
      departureTime: '08:00',
      seatNumber: '12A',
      price: 25000,
      originalPrice: 30000,
      discountApplied: 5000,
      paymentStatus: 'paid',
      bookingStatus: 'confirmed',
      bookingDate: '2024-01-10T14:30:00Z',
      paymentMethod: 'card',
      bus: 'KC-001',
      passengerType: 'adult',
      emergencyContact: '+241 06 98 76 54',
      qrCode: 'KC001240115001QR',
      loyaltyPoints: 250,
      promotionCode: 'PROMO10',
      insuranceAdded: true,
      baggageWeight: 23,
      priority: 'normal',
      communicationPreference: 'both',
      refundEligible: true,
      cancellationFee: 2500
    },
    {
      id: '2',
      ticketNumber: 'KC-002-240116-002',
      passengerName: 'Marie Claire Nguema',
      passengerEmail: 'marie.nguema@yahoo.fr',
      passengerPhone: '+241 07 23 45 67',
      departure: 'Libreville',
      arrival: 'Franceville',
      departureDate: '2024-01-16',
      departureTime: '06:00',
      seatNumber: '8B',
      price: 35000,
      originalPrice: 35000,
      paymentStatus: 'paid',
      bookingStatus: 'checked-in',
      bookingDate: '2024-01-12T09:15:00Z',
      paymentMethod: 'mobile',
      bus: 'KC-002',
      specialRequests: 'Siège fenêtre',
      passengerType: 'adult',
      checkedInAt: '2024-01-16T05:30:00Z',
      checkedInBy: 'Agent-001',
      qrCode: 'KC002240116002QR',
      loyaltyPoints: 350,
      insuranceAdded: false,
      baggageWeight: 18,
      priority: 'high',
      communicationPreference: 'sms',
      refundEligible: false,
      cancellationFee: 3500,
      paymentReference: 'PAY-KC-202401160001'
    },
    {
      id: '3',
      ticketNumber: 'KC-001-240117-003',
      passengerName: 'Paul Mboutsou',
      passengerEmail: 'paul.mboutsou@hotmail.com',
      passengerPhone: '+241 05 34 56 78',
      departure: 'Port-Gentil',
      arrival: 'Libreville',
      departureDate: '2024-01-17',
      departureTime: '10:00',
      seatNumber: '15C',
      price: 25000,
      originalPrice: 25000,
      paymentStatus: 'pending',
      bookingStatus: 'confirmed',
      bookingDate: '2024-01-13T16:45:00Z',
      paymentMethod: 'bank',
      bus: 'KC-001',
      passengerType: 'adult',
      qrCode: 'KC001240117003QR',
      loyaltyPoints: 0,
      insuranceAdded: true,
      baggageWeight: 20,
      priority: 'urgent',
      communicationPreference: 'email',
      refundEligible: true,
      cancellationFee: 2500,
      lastNotificationSent: '2024-01-14T10:00:00Z'
    },
    {
      id: '4',
      ticketNumber: 'KC-003-240118-004',
      passengerName: 'Grace Ondo',
      passengerEmail: 'grace.ondo@gmail.com',
      passengerPhone: '+241 06 45 67 89',
      departure: 'Libreville',
      arrival: 'Oyem',
      departureDate: '2024-01-18',
      departureTime: '07:30',
      seatNumber: '3A',
      price: 30000,
      originalPrice: 30000,
      paymentStatus: 'failed',
      bookingStatus: 'cancelled',
      bookingDate: '2024-01-11T11:20:00Z',
      paymentMethod: 'card',
      bus: 'KC-003',
      passengerType: 'student',
      qrCode: 'KC003240118004QR',
      loyaltyPoints: 0,
      insuranceAdded: false,
      priority: 'normal',
      communicationPreference: 'email',
      refundEligible: false,
      refundReason: 'Paiement échoué',
      notes: 'Tentative de paiement multiple échouée'
    },
    {
      id: '5',
      ticketNumber: 'KC-002-240119-005',
      passengerName: 'Albert Nzigou',
      passengerEmail: 'albert.nzigou@gmail.com',
      passengerPhone: '+241 07 11 22 33',
      departure: 'Franceville',
      arrival: 'Libreville',
      departureDate: '2024-01-19',
      departureTime: '16:00',
      seatNumber: '22D',
      price: 31500,
      originalPrice: 35000,
      discountApplied: 3500,
      paymentStatus: 'refunded',
      bookingStatus: 'cancelled',
      bookingDate: '2024-01-14T08:30:00Z',
      paymentMethod: 'mobile',
      bus: 'KC-002',
      passengerType: 'senior',
      qrCode: 'KC002240119005QR',
      loyaltyPoints: 150,
      promotionCode: 'SENIOR10',
      insuranceAdded: true,
      priority: 'normal',
      communicationPreference: 'sms',
      refundEligible: true,
      refundReason: 'Annulation volontaire',
      refundAmount: 28000,
      refundDate: '2024-01-15T14:00:00Z',
      cancellationFee: 3500,
      notes: 'Remboursement traité avec succès'
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterPayment, setFilterPayment] = useState('all');
  const [filterPriority, setFilterPriority] = useState('all');
  const [filterDate, setFilterDate] = useState('');
  const [sortBy, setSortBy] = useState('bookingDate');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [selectedTicket, setSelectedTicket] = useState<BookingTicket | null>(null);
  const [selectedTickets, setSelectedTickets] = useState<string[]>([]);
  const [showTicketModal, setShowTicketModal] = useState(false);
  const [showRefundModal, setShowRefundModal] = useState(false);
  const [showCreateTicketModal, setShowCreateTicketModal] = useState(false);
  const [showBulkActionsModal, setShowBulkActionsModal] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [viewMode, setViewMode] = useState<'list' | 'grid' | 'timeline'>('list');
  const [quickFilters, setQuickFilters] = useState({
    needsAttention: false,
    pendingPayments: false,
    refundRequests: false,
    highPriority: false,
    todayDepartures: false
  });
  const [autoRefresh, setAutoRefresh] = useState(true);

  // Auto-refresh every 30 seconds
  useEffect(() => {
    if (!autoRefresh) return;
    
    const interval = setInterval(() => {
      // API: refreshTicketData()
      console.log('Auto-refreshing ticket data...');
    }, 30000);

    return () => clearInterval(interval);
  }, [autoRefresh]);

  const filteredTickets = tickets.filter(ticket => {
    const matchesSearch = 
      ticket.ticketNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.passengerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.passengerEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.passengerPhone.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.departure.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.arrival.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.bus.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.seatNumber.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filterStatus === 'all' || ticket.bookingStatus === filterStatus;
    const matchesPayment = filterPayment === 'all' || ticket.paymentStatus === filterPayment;
    const matchesPriority = filterPriority === 'all' || ticket.priority === filterPriority;
    const matchesDate = !filterDate || ticket.departureDate === filterDate;
    
    // Quick filters
    const matchesQuickFilters = 
      (!quickFilters.needsAttention || ticket.bookingStatus === 'cancelled' || ticket.paymentStatus === 'failed') &&
      (!quickFilters.pendingPayments || ticket.paymentStatus === 'pending') &&
      (!quickFilters.refundRequests || ticket.paymentStatus === 'refunded' || ticket.refundReason) &&
      (!quickFilters.highPriority || ticket.priority === 'high' || ticket.priority === 'urgent') &&
      (!quickFilters.todayDepartures || ticket.departureDate === new Date().toISOString().split('T')[0]);
    
    return matchesSearch && matchesStatus && matchesPayment && matchesPriority && matchesDate && matchesQuickFilters;
  }).sort((a, b) => {
    let comparison = 0;
    
    switch (sortBy) {
      case 'bookingDate':
        comparison = new Date(a.bookingDate).getTime() - new Date(b.bookingDate).getTime();
        break;
      case 'departureDate':
        comparison = new Date(a.departureDate).getTime() - new Date(b.departureDate).getTime();
        break;
      case 'price':
        comparison = a.price - b.price;
        break;
      case 'passenger':
        comparison = a.passengerName.localeCompare(b.passengerName);
        break;
      case 'status':
        comparison = a.bookingStatus.localeCompare(b.bookingStatus);
        break;
      case 'priority':
        const priorityOrder = { urgent: 3, high: 2, normal: 1 };
        comparison = priorityOrder[a.priority] - priorityOrder[b.priority];
        break;
      default:
        comparison = 0;
    }
    
    return sortOrder === 'desc' ? -comparison : comparison;
  });

  const getPaymentStatusColor = (status: BookingTicket['paymentStatus']) => {
    switch (status) {
      case 'paid':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'failed':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'refunded':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getBookingStatusColor = (status: BookingTicket['bookingStatus']) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'checked-in':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'no-show':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPaymentStatusLabel = (status: BookingTicket['paymentStatus']) => {
    switch (status) {
      case 'paid': return 'Payé';
      case 'pending': return 'En attente';
      case 'failed': return 'Échec';
      case 'refunded': return 'Remboursé';
      default: return 'Inconnu';
    }
  };

  const getBookingStatusLabel = (status: BookingTicket['bookingStatus']) => {
    switch (status) {
      case 'confirmed': return 'Confirmé';
      case 'checked-in': return 'Enregistré';
      case 'cancelled': return 'Annulé';
      case 'no-show': return 'Absent';
      default: return 'Inconnu';
    }
  };

  const getPaymentMethodLabel = (method: BookingTicket['paymentMethod']) => {
    switch (method) {
      case 'card': return 'Carte bancaire';
      case 'mobile': return 'Mobile Money';
      case 'cash': return 'Espèces';
      case 'bank': return 'Virement';
      default: return 'Inconnu';
    }
  };

  const handleViewTicket = (ticket: BookingTicket) => {
    setSelectedTicket(ticket);
    setShowTicketModal(true);
  };

  const handleUpdateTicketStatus = async (ticketId: string, newStatus: BookingTicket['bookingStatus']) => {
    try {
      // API: updateTicketStatus()
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setTickets(prev =>
        prev.map(ticket =>
          ticket.id === ticketId ? { ...ticket, bookingStatus: newStatus } : ticket
        )
      );

      toast.success('Statut du billet mis à jour');
    } catch (error) {
      toast.error('Erreur lors de la mise à jour');
    }
  };

  const handleRefundTicket = async (ticketId: string) => {
    try {
      // API: refundTicket()
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setTickets(prev =>
        prev.map(ticket =>
          ticket.id === ticketId 
            ? { ...ticket, paymentStatus: 'refunded', bookingStatus: 'cancelled' } 
            : ticket
        )
      );

      toast.success('Remboursement traité');
    } catch (error) {
      toast.error('Erreur lors du remboursement');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
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

  // Enhanced statistics with more metrics
  const stats = {
    total: tickets.length,
    confirmed: tickets.filter(t => t.bookingStatus === 'confirmed').length,
    checkedIn: tickets.filter(t => t.bookingStatus === 'checked-in').length,
    cancelled: tickets.filter(t => t.bookingStatus === 'cancelled').length,
    completed: tickets.filter(t => t.bookingStatus === 'completed').length,
    paid: tickets.filter(t => t.paymentStatus === 'paid').length,
    pending: tickets.filter(t => t.paymentStatus === 'pending').length,
    refunded: tickets.filter(t => t.paymentStatus === 'refunded').length,
    revenue: tickets.filter(t => t.paymentStatus === 'paid').reduce((sum, t) => sum + t.price, 0),
    pendingAmount: tickets.filter(t => t.paymentStatus === 'pending').reduce((sum, t) => sum + t.price, 0),
    refundedAmount: tickets.filter(t => t.paymentStatus === 'refunded').reduce((sum, t) => sum + (t.refundAmount || 0), 0),
    averageTicketValue: tickets.length > 0 ? tickets.reduce((sum, t) => sum + t.price, 0) / tickets.length : 0,
    totalLoyaltyPoints: tickets.reduce((sum, t) => sum + (t.loyaltyPoints || 0), 0),
    highPriority: tickets.filter(t => t.priority === 'high' || t.priority === 'urgent').length,
    needsAttention: tickets.filter(t => 
      t.paymentStatus === 'failed' || 
      t.paymentStatus === 'pending' || 
      t.bookingStatus === 'cancelled'
    ).length
  };

  const toggleTicketSelection = (ticketId: string) => {
    setSelectedTickets(prev =>
      prev.includes(ticketId)
        ? prev.filter(id => id !== ticketId)
        : [...prev, ticketId]
    );
  };

  const selectAllTickets = () => {
    if (selectedTickets.length === filteredTickets.length) {
      setSelectedTickets([]);
    } else {
      setSelectedTickets(filteredTickets.map(t => t.id));
    }
  };

  const handleBulkAction = async (action: string) => {
    if (selectedTickets.length === 0) {
      toast.error('Aucun billet sélectionné');
      return;
    }

    setIsProcessing(true);
    try {
      // API: bulkTicketAction()
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      switch (action) {
        case 'cancel':
          setTickets(prev => prev.map(ticket =>
            selectedTickets.includes(ticket.id)
              ? { ...ticket, bookingStatus: 'cancelled' as const }
              : ticket
          ));
          toast.success(`${selectedTickets.length} billet(s) annulé(s)`);
          break;
        case 'refund':
          setTickets(prev => prev.map(ticket =>
            selectedTickets.includes(ticket.id)
              ? { 
                  ...ticket, 
                  paymentStatus: 'refunded' as const,
                  bookingStatus: 'cancelled' as const,
                  refundAmount: ticket.price * 0.8
                }
              : ticket
          ));
          toast.success(`${selectedTickets.length} remboursement(s) traité(s)`);
          break;
        case 'checkin':
          setTickets(prev => prev.map(ticket =>
            selectedTickets.includes(ticket.id) && ticket.bookingStatus === 'confirmed'
              ? { 
                  ...ticket, 
                  bookingStatus: 'checked-in' as const,
                  checkedInAt: new Date().toISOString(),
                  checkedInBy: 'Admin'
                }
              : ticket
          ));
          toast.success(`${selectedTickets.length} billet(s) enregistré(s)`);
          break;
        case 'resend':
          // API: resendTicketNotifications()
          toast.success(`Notifications renvoyées pour ${selectedTickets.length} billet(s)`);
          break;
      }
      
      setSelectedTickets([]);
      setShowBulkActionsModal(false);
    } catch (error) {
      toast.error('Erreur lors de l\'action groupée');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCreateTicket = async (ticketData: any) => {
    setIsProcessing(true);
    try {
      // API: createTicket()
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const newTicket: BookingTicket = {
        id: Date.now().toString(),
        ticketNumber: `KC-${Date.now().toString().slice(-6)}`,
        ...ticketData,
        bookingDate: new Date().toISOString(),
        qrCode: `QR-${Date.now()}`,
        loyaltyPoints: Math.floor(ticketData.price * 0.01),
        refundEligible: true,
        cancellationFee: ticketData.price * 0.1,
        priority: 'normal',
        communicationPreference: 'email',
        insuranceAdded: false
      };
      
      setTickets(prev => [...prev, newTicket]);
      setShowCreateTicketModal(false);
      toast.success('Nouveau billet créé avec succès');
    } catch (error) {
      toast.error('Erreur lors de la création du billet');
    } finally {
      setIsProcessing(false);
    }
  };

  const generateTicketReport = () => {
    // API: generateTicketReport()
    const reportData = [
      'Numéro billet,Passager,Email,Téléphone,Départ,Arrivée,Date départ,Siège,Prix,Statut réservation,Statut paiement,Mode paiement,Date réservation',
      ...filteredTickets.map(ticket =>
        `${ticket.ticketNumber},${ticket.passengerName},${ticket.passengerEmail},${ticket.passengerPhone},${ticket.departure},${ticket.arrival},${ticket.departureDate},${ticket.seatNumber},${ticket.price},${ticket.bookingStatus},${ticket.paymentStatus},${ticket.paymentMethod},${ticket.bookingDate}`
      )
    ].join('\n');

    const blob = new Blob([reportData], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `billets-rapport-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast.success('Rapport exporté avec succès');
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header with stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">{stats.total}</div>
            <div className="text-sm text-gray-600">Total billets</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">{stats.paid}</div>
            <div className="text-sm text-gray-600">Billets payés</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
            <div className="text-sm text-gray-600">Paiements en attente</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-purple-600">
              {(stats.revenue / 1000000).toFixed(1)}M
            </div>
            <div className="text-sm text-gray-600">Revenus (XAF)</div>
          </CardContent>
        </Card>
      </div>

      {/* Main content */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center space-x-2">
                <Ticket className="w-5 h-5" />
                <span>Gestion des Billets</span>
              </CardTitle>
              <CardDescription>
                Gérez les réservations et billets de vos passagers
              </CardDescription>
            </div>
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
                <SelectValue placeholder="Statut réservation" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les statuts</SelectItem>
                <SelectItem value="confirmed">Confirmés</SelectItem>
                <SelectItem value="checked-in">Enregistrés</SelectItem>
                <SelectItem value="cancelled">Annulés</SelectItem>
                <SelectItem value="no-show">Absents</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterPayment} onValueChange={setFilterPayment}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Statut paiement" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous paiements</SelectItem>
                <SelectItem value="paid">Payés</SelectItem>
                <SelectItem value="pending">En attente</SelectItem>
                <SelectItem value="failed">Échecs</SelectItem>
                <SelectItem value="refunded">Remboursés</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Tickets List */}
          <div className="space-y-4">
            <AnimatePresence>
              {filteredTickets.map((ticket, index) => (
                <motion.div
                  key={ticket.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ delay: index * 0.05 }}
                  className="border rounded-lg p-4 hover:shadow-md transition-shadow duration-200"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-4 mb-3">
                        <h4 className="font-semibold text-lg">{ticket.ticketNumber}</h4>
                        <Badge className={getBookingStatusColor(ticket.bookingStatus)}>
                          {getBookingStatusLabel(ticket.bookingStatus)}
                        </Badge>
                        <Badge className={getPaymentStatusColor(ticket.paymentStatus)}>
                          {getPaymentStatusLabel(ticket.paymentStatus)}
                        </Badge>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <span className="text-gray-500">Passager:</span>
                          <div className="font-medium flex items-center">
                            <User className="w-3 h-3 mr-1" />
                            {ticket.passengerName}
                          </div>
                        </div>
                        <div>
                          <span className="text-gray-500">Trajet:</span>
                          <div className="font-medium flex items-center">
                            <MapPin className="w-3 h-3 mr-1" />
                            {ticket.departure} → {ticket.arrival}
                          </div>
                        </div>
                        <div>
                          <span className="text-gray-500">Date départ:</span>
                          <div className="font-medium flex items-center">
                            <Calendar className="w-3 h-3 mr-1" />
                            {formatDate(ticket.departureDate)} à {ticket.departureTime}
                          </div>
                        </div>
                        <div>
                          <span className="text-gray-500">Siège:</span>
                          <div className="font-medium">{ticket.seatNumber}</div>
                        </div>
                      </div>

                      <div className="mt-2 flex items-center justify-between">
                        <div className="flex items-center space-x-4 text-sm text-gray-600">
                          <span>{ticket.price.toLocaleString()} XAF</span>
                          <span>Bus: {ticket.bus}</span>
                          <span>{getPaymentMethodLabel(ticket.paymentMethod)}</span>
                        </div>
                        <div className="text-xs text-gray-500">
                          Réservé le {formatDateTime(ticket.bookingDate)}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2 ml-4">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleViewTicket(ticket)}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      
                      {ticket.bookingStatus === 'confirmed' && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleUpdateTicketStatus(ticket.id, 'checked-in')}
                        >
                          <CheckCircle className="w-4 h-4 text-green-600" />
                        </Button>
                      )}

                      {ticket.paymentStatus === 'paid' && ticket.bookingStatus !== 'cancelled' && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRefundTicket(ticket.id)}
                          className="text-blue-600 hover:bg-blue-50"
                        >
                          <RefreshCw className="w-4 h-4" />
                        </Button>
                      )}

                      {ticket.bookingStatus !== 'cancelled' && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleUpdateTicketStatus(ticket.id, 'cancelled')}
                          className="text-red-500 hover:bg-red-50"
                        >
                          <Ban className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {filteredTickets.length === 0 && (
              <div className="text-center py-12">
                <Ticket className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Aucun billet trouvé
                </h3>
                <p className="text-gray-600">
                  {searchTerm || filterStatus !== 'all' || filterPayment !== 'all'
                    ? 'Aucun billet ne correspond à vos critères de recherche.'
                    : 'Aucun billet n\'a été émis pour le moment.'}
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Ticket Detail Modal */}
      <Dialog open={showTicketModal} onOpenChange={setShowTicketModal}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Détails du billet</DialogTitle>
            <DialogDescription>
              Informations complètes de la réservation
            </DialogDescription>
          </DialogHeader>

          {selectedTicket && (
            <div className="space-y-6">
              {/* Ticket Header */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">{selectedTicket.ticketNumber}</h3>
                  <div className="flex space-x-2">
                    <Badge className={getBookingStatusColor(selectedTicket.bookingStatus)}>
                      {getBookingStatusLabel(selectedTicket.bookingStatus)}
                    </Badge>
                    <Badge className={getPaymentStatusColor(selectedTicket.paymentStatus)}>
                      {getPaymentStatusLabel(selectedTicket.paymentStatus)}
                    </Badge>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">Prix total:</span>
                    <div className="font-medium text-lg">{selectedTicket.price.toLocaleString()} XAF</div>
                  </div>
                  <div>
                    <span className="text-gray-500">Mode de paiement:</span>
                    <div className="font-medium">{getPaymentMethodLabel(selectedTicket.paymentMethod)}</div>
                  </div>
                </div>
              </div>

              {/* Passenger Info */}
              <div>
                <h4 className="font-medium mb-3 flex items-center">
                  <User className="w-4 h-4 mr-2" />
                  Informations passager
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <Label>Nom complet</Label>
                    <div className="font-medium">{selectedTicket.passengerName}</div>
                  </div>
                  <div>
                    <Label>Email</Label>
                    <div className="font-medium flex items-center">
                      <Mail className="w-3 h-3 mr-1" />
                      {selectedTicket.passengerEmail}
                    </div>
                  </div>
                  <div>
                    <Label>Téléphone</Label>
                    <div className="font-medium flex items-center">
                      <Phone className="w-3 h-3 mr-1" />
                      {selectedTicket.passengerPhone}
                    </div>
                  </div>
                  {selectedTicket.specialRequests && (
                    <div>
                      <Label>Demandes spéciales</Label>
                      <div className="font-medium">{selectedTicket.specialRequests}</div>
                    </div>
                  )}
                </div>
              </div>

              <Separator />

              {/* Trip Info */}
              <div>
                <h4 className="font-medium mb-3 flex items-center">
                  <MapPin className="w-4 h-4 mr-2" />
                  Détails du voyage
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <Label>Départ</Label>
                    <div className="font-medium">{selectedTicket.departure}</div>
                  </div>
                  <div>
                    <Label>Arrivée</Label>
                    <div className="font-medium">{selectedTicket.arrival}</div>
                  </div>
                  <div>
                    <Label>Date et heure de départ</Label>
                    <div className="font-medium flex items-center">
                      <Calendar className="w-3 h-3 mr-1" />
                      {formatDate(selectedTicket.departureDate)} à {selectedTicket.departureTime}
                    </div>
                  </div>
                  <div>
                    <Label>Bus assigné</Label>
                    <div className="font-medium">{selectedTicket.bus}</div>
                  </div>
                  <div>
                    <Label>Numéro de siège</Label>
                    <div className="font-medium text-lg">{selectedTicket.seatNumber}</div>
                  </div>
                  <div>
                    <Label>Réservé le</Label>
                    <div className="font-medium flex items-center">
                      <Clock className="w-3 h-3 mr-1" />
                      {formatDateTime(selectedTicket.bookingDate)}
                    </div>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Actions */}
              <div className="flex justify-end space-x-3">
                <Button variant="outline">
                  <Printer className="w-4 h-4 mr-2" />
                  Imprimer
                </Button>
                <Button variant="outline">
                  <Download className="w-4 h-4 mr-2" />
                  Télécharger PDF
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => {
                    navigator.clipboard.writeText(`${window.location.origin}/ticket/${selectedTicket.ticketNumber}`);
                    toast.success('Lien copié dans le presse-papiers');
                  }}
                >
                  Copier lien
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};