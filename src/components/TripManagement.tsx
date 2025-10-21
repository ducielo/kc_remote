import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  Search, 
  Filter,
  MapPin,
  Clock,
  DollarSign,
  Bus,
  Users,
  Calendar,
  Settings,
  Save,
  X,
  CheckCircle,
  AlertCircle,
  Power,
  PowerOff,
  Download,
  Upload,
  Copy,
  MoreHorizontal,
  Zap,
  BarChart3,
  TrendingUp,
  Activity,
  Loader2,
  AlertTriangle,
  Info
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Badge } from './ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { Textarea } from './ui/textarea';
import { Switch } from './ui/switch';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from './ui/alert-dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from './ui/dropdown-menu';
import { Progress } from './ui/progress';
import { Separator } from './ui/separator';
import { toast } from 'sonner';

interface Trip {
  id: string;
  departure: string;
  arrival: string;
  duration: string;
  price: number;
  bus: string;
  frequency: 'daily' | 'weekly' | 'weekend';
  status: 'active' | 'maintenance' | 'cancelled' | 'suspended';
  passengers: number;
  capacity: number;
  nextDeparture: string;
  description?: string;
  amenities: string[];
  isEnabled: boolean;
  createdAt: string;
  updatedAt: string;
  totalBookings: number;
  revenue: number;
  averageRating: number;
  lastBooking?: string;
  operationalDays: string[];
  estimatedDuration: string;
  actualDuration?: string;
  delayHistory: number[];
  popularityIndex: number;
}

interface TripFormData {
  departure: string;
  arrival: string;
  duration: string;
  price: string;
  bus: string;
  frequency: 'daily' | 'weekly' | 'weekend';
  status: 'active' | 'maintenance' | 'cancelled';
  capacity: string;
  description: string;
  amenities: string[];
}

interface TripManagementProps {
  className?: string;
}

export const TripManagement: React.FC<TripManagementProps> = ({ className = '' }) => {
  const [trips, setTrips] = useState<Trip[]>([
    {
      id: '1',
      departure: 'Libreville',
      arrival: 'Port-Gentil',
      duration: '6h 30min',
      price: 25000,
      bus: 'KC-001',
      frequency: 'daily',
      status: 'active',
      passengers: 45,
      capacity: 50,
      nextDeparture: '2024-01-15 08:00',
      description: 'Trajet direct avec pause déjeuner à Lambaréné',
      amenities: ['Climatisation', 'WiFi', 'Collations'],
      isEnabled: true,
      createdAt: '2024-01-01T10:00:00Z',
      updatedAt: '2024-01-14T15:30:00Z',
      totalBookings: 1847,
      revenue: 46175000,
      averageRating: 4.6,
      lastBooking: '2024-01-14T18:45:00Z',
      operationalDays: ['lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi', 'dimanche'],
      estimatedDuration: '6h 30min',
      actualDuration: '6h 45min',
      delayHistory: [15, 12, 8, 20, 5],
      popularityIndex: 95
    },
    {
      id: '2',
      departure: 'Libreville',
      arrival: 'Franceville',
      duration: '8h 45min',
      price: 35000,
      bus: 'KC-002',
      frequency: 'weekly',
      status: 'active',
      passengers: 38,
      capacity: 50,
      nextDeparture: '2024-01-16 06:00',
      description: 'Trajet avec arrêts multiples',
      amenities: ['Climatisation', 'Repas inclus', 'Télévision'],
      isEnabled: true,
      createdAt: '2024-01-01T10:00:00Z',
      updatedAt: '2024-01-13T09:20:00Z',
      totalBookings: 1203,
      revenue: 42105000,
      averageRating: 4.3,
      lastBooking: '2024-01-13T14:20:00Z',
      operationalDays: ['mardi', 'jeudi', 'samedi'],
      estimatedDuration: '8h 45min',
      actualDuration: '9h 10min',
      delayHistory: [25, 30, 18, 35, 22],
      popularityIndex: 78
    },
    {
      id: '3',
      departure: 'Port-Gentil',
      arrival: 'Oyem',
      duration: '10h 15min',
      price: 42000,
      bus: 'KC-003',
      frequency: 'weekend',
      status: 'maintenance',
      passengers: 0,
      capacity: 45,
      nextDeparture: '2024-01-20 05:30',
      description: 'Service de weekend via Libreville',
      amenities: ['Climatisation', 'WiFi'],
      isEnabled: false,
      createdAt: '2024-01-01T10:00:00Z',
      updatedAt: '2024-01-12T16:00:00Z',
      totalBookings: 456,
      revenue: 19152000,
      averageRating: 4.1,
      lastBooking: '2024-01-11T11:30:00Z',
      operationalDays: ['samedi', 'dimanche'],
      estimatedDuration: '10h 15min',
      actualDuration: '10h 30min',
      delayHistory: [15, 20, 10, 25, 18],
      popularityIndex: 62
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterFrequency, setFilterFrequency] = useState('all');
  const [sortBy, setSortBy] = useState('popularity');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  const [editingTrip, setEditingTrip] = useState<Trip | null>(null);
  const [selectedTrip, setSelectedTrip] = useState<Trip | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bulkActions, setBulkActions] = useState(false);
  const [selectedTrips, setSelectedTrips] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
  const [quickFilters, setQuickFilters] = useState({
    highPerformance: false,
    needsAttention: false,
    recentlyUpdated: false
  });

  const [formData, setFormData] = useState<TripFormData>({
    departure: '',
    arrival: '',
    duration: '',
    price: '',
    bus: '',
    frequency: 'daily',
    status: 'active',
    capacity: '',
    description: '',
    amenities: []
  });

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const cities = [
    'Libreville', 'Port-Gentil', 'Franceville', 'Oyem', 'Lambaréné', 
    'Mouila', 'Tchibanga', 'Makokou', 'Gamba'
  ];

  const buses = [
    'KC-001', 'KC-002', 'KC-003', 'KC-004', 'KC-005', 'KC-006', 'KC-007'
  ];

  const availableAmenities = [
    'Climatisation', 'WiFi', 'Télévision', 'Prises électriques',
    'Repas inclus', 'Collations', 'Couvertures', 'Toilettes'
  ];

  // Advanced filtering and sorting
  const filteredTrips = trips.filter(trip => {
    const matchesSearch = trip.departure.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         trip.arrival.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         trip.bus.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         trip.description?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filterStatus === 'all' || trip.status === filterStatus;
    const matchesFrequency = filterFrequency === 'all' || trip.frequency === filterFrequency;
    
    // Quick filters
    const matchesQuickFilters = 
      (!quickFilters.highPerformance || trip.popularityIndex >= 80) &&
      (!quickFilters.needsAttention || trip.status === 'maintenance' || trip.delayHistory.reduce((a, b) => a + b, 0) / trip.delayHistory.length > 20) &&
      (!quickFilters.recentlyUpdated || new Date(trip.updatedAt) > new Date(Date.now() - 24 * 60 * 60 * 1000));
    
    return matchesSearch && matchesStatus && matchesFrequency && matchesQuickFilters;
  }).sort((a, b) => {
    let comparison = 0;
    
    switch (sortBy) {
      case 'popularity':
        comparison = a.popularityIndex - b.popularityIndex;
        break;
      case 'revenue':
        comparison = a.revenue - b.revenue;
        break;
      case 'bookings':
        comparison = a.totalBookings - b.totalBookings;
        break;
      case 'rating':
        comparison = a.averageRating - b.averageRating;
        break;
      case 'price':
        comparison = a.price - b.price;
        break;
      case 'departure':
        comparison = a.departure.localeCompare(b.departure);
        break;
      case 'updated':
        comparison = new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime();
        break;
      default:
        comparison = 0;
    }
    
    return sortOrder === 'desc' ? -comparison : comparison;
  });

  // Real-time stats
  const stats = {
    total: trips.length,
    active: trips.filter(t => t.status === 'active' && t.isEnabled).length,
    maintenance: trips.filter(t => t.status === 'maintenance').length,
    suspended: trips.filter(t => t.status === 'suspended' || !t.isEnabled).length,
    totalRevenue: trips.reduce((sum, t) => sum + t.revenue, 0),
    totalBookings: trips.reduce((sum, t) => sum + t.totalBookings, 0),
    averageRating: trips.reduce((sum, t) => sum + t.averageRating, 0) / trips.length,
    averageDelay: trips.reduce((sum, t) => sum + (t.delayHistory.reduce((a, b) => a + b, 0) / t.delayHistory.length), 0) / trips.length
  };

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!formData.departure) errors.departure = 'Ville de départ requise';
    if (!formData.arrival) errors.arrival = 'Ville d\'arrivée requise';
    if (formData.departure === formData.arrival) errors.arrival = 'Les villes doivent être différentes';
    if (!formData.duration) errors.duration = 'Durée requise';
    if (!formData.price || parseFloat(formData.price) <= 0) errors.price = 'Prix valide requis';
    if (!formData.bus) errors.bus = 'Bus requis';
    if (!formData.capacity || parseInt(formData.capacity) <= 0) errors.capacity = 'Capacité valide requise';

    // Check if bus is already assigned to another active trip
    const busAlreadyUsed = trips.some(trip => 
      trip.bus === formData.bus && 
      trip.id !== editingTrip?.id && 
      trip.status === 'active'
    );
    if (busAlreadyUsed) {
      errors.bus = 'Ce bus est déjà assigné à un autre trajet actif';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const resetForm = () => {
    setFormData({
      departure: '',
      arrival: '',
      duration: '',
      price: '',
      bus: '',
      frequency: 'daily',
      status: 'active',
      capacity: '',
      description: '',
      amenities: []
    });
    setFormErrors({});
  };

  // Advanced functions
  const handleBulkStatusUpdate = async (newStatus: Trip['status']) => {
    if (selectedTrips.length === 0) return;
    
    setIsSubmitting(true);
    try {
      // API: bulkUpdateTripStatus()
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setTrips(prev => 
        prev.map(trip => 
          selectedTrips.includes(trip.id) 
            ? { ...trip, status: newStatus, updatedAt: new Date().toISOString() }
            : trip
        )
      );
      
      toast.success(`${selectedTrips.length} trajet(s) mis à jour vers "${newStatus}"`);
      setSelectedTrips([]);
      setBulkActions(false);
    } catch (error) {
      toast.error('Erreur lors de la mise à jour en lot');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleEnable = async (tripId: string, enabled: boolean) => {
    try {
      // API: toggleTripStatus()
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setTrips(prev => 
        prev.map(trip => 
          trip.id === tripId 
            ? { 
                ...trip, 
                isEnabled: enabled,
                status: enabled ? 'active' : 'suspended',
                updatedAt: new Date().toISOString()
              }
            : trip
        )
      );
      
      toast.success(`Trajet ${enabled ? 'activé' : 'désactivé'} avec succès`);
    } catch (error) {
      toast.error('Erreur lors du changement de statut');
    }
  };

  const handleDuplicateTrip = async (trip: Trip) => {
    try {
      // API: duplicateTrip()
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const newTrip: Trip = {
        ...trip,
        id: Date.now().toString(),
        bus: '', // Reset bus assignment
        status: 'active',
        isEnabled: true,
        passengers: 0,
        totalBookings: 0,
        revenue: 0,
        averageRating: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        delayHistory: []
      };
      
      setTrips(prev => [newTrip, ...prev]);
      toast.success('Trajet dupliqué avec succès');
    } catch (error) {
      toast.error('Erreur lors de la duplication');
    }
  };

  const handleExportTrips = () => {
    // API: exportTrips()
    const csvContent = [
      'ID,Départ,Arrivée,Durée,Prix,Bus,Fréquence,Statut,Capacité,Réservations,Revenus,Note,Popularité',
      ...filteredTrips.map(trip =>
        `${trip.id},${trip.departure},${trip.arrival},${trip.duration},${trip.price},${trip.bus},${trip.frequency},${trip.status},${trip.capacity},${trip.totalBookings},${trip.revenue},${trip.averageRating},${trip.popularityIndex}`
      )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `trajets-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast.success('Export terminé');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('Veuillez corriger les erreurs du formulaire');
      return;
    }

    setIsSubmitting(true);

    try {
      const isEdit = !!editingTrip;
      
      // API: createTrip() or updateTrip()
      const apiCall = isEdit ? 'updateTrip' : 'createTrip';
      console.log(`API Call: ${apiCall}()`, { formData });
      
      await new Promise(resolve => setTimeout(resolve, 1500));

      const now = new Date().toISOString();
      const tripData: Trip = {
        id: editingTrip?.id || `trip_${Date.now()}`,
        departure: formData.departure,
        arrival: formData.arrival,
        duration: formData.duration,
        price: parseFloat(formData.price),
        bus: formData.bus,
        frequency: formData.frequency,
        status: formData.status,
        passengers: editingTrip?.passengers || 0,
        capacity: parseInt(formData.capacity),
        nextDeparture: editingTrip?.nextDeparture || new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        description: formData.description,
        amenities: formData.amenities,
        isEnabled: true,
        createdAt: editingTrip?.createdAt || now,
        updatedAt: now,
        totalBookings: editingTrip?.totalBookings || 0,
        revenue: editingTrip?.revenue || 0,
        averageRating: editingTrip?.averageRating || 0,
        operationalDays: ['lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi', 'dimanche'],
        estimatedDuration: formData.duration,
        delayHistory: editingTrip?.delayHistory || [],
        popularityIndex: editingTrip?.popularityIndex || Math.floor(Math.random() * 40) + 60
      };

      if (editingTrip) {
        setTrips(prev => prev.map(trip => trip.id === editingTrip.id ? tripData : trip));
        toast.success('Trajet mis à jour avec succès');
        
        // API integration point
        console.log('API: Trip updated successfully', { tripId: tripData.id, changes: tripData });
      } else {
        setTrips(prev => [tripData, ...prev]);
        toast.success('Trajet créé avec succès');
        
        // API integration point
        console.log('API: Trip created successfully', { newTrip: tripData });
      }

      setShowCreateModal(false);
      setEditingTrip(null);
      resetForm();

    } catch (error) {
      console.error('API Error:', error);
      toast.error('Erreur lors de l\'enregistrement du trajet');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (trip: Trip) => {
    setEditingTrip(trip);
    setFormData({
      departure: trip.departure,
      arrival: trip.arrival,
      duration: trip.duration,
      price: trip.price.toString(),
      bus: trip.bus,
      frequency: trip.frequency,
      status: trip.status,
      capacity: trip.capacity.toString(),
      description: trip.description || '',
      amenities: trip.amenities || []
    });
    setShowCreateModal(true);
  };

  const handleViewDetails = (trip: Trip) => {
    setSelectedTrip(trip);
    setShowDetailsModal(true);
  };

  const confirmDelete = (tripId: string) => {
    setShowDeleteConfirm(tripId);
  };

  const handleDelete = async (tripId: string) => {
    try {
      // API: deleteTrip()
      console.log('API: deleteTrip()', { tripId });
      await new Promise(resolve => setTimeout(resolve, 800));
      
      setTrips(prev => prev.filter(trip => trip.id !== tripId));
      setShowDeleteConfirm(null);
      toast.success('Trajet supprimé avec succès');
      
      // API integration point
      console.log('API: Trip deleted successfully', { deletedTripId: tripId });
    } catch (error) {
      console.error('API Error:', error);
      toast.error('Erreur lors de la suppression du trajet');
    }
  };

  const handleSelectTrip = (tripId: string) => {
    setSelectedTrips(prev => 
      prev.includes(tripId) 
        ? prev.filter(id => id !== tripId)
        : [...prev, tripId]
    );
  };

  const handleSelectAll = () => {
    if (selectedTrips.length === filteredTrips.length) {
      setSelectedTrips([]);
    } else {
      setSelectedTrips(filteredTrips.map(trip => trip.id));
    }
  };

  const toggleAmenity = (amenity: string) => {
    setFormData(prev => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter(a => a !== amenity)
        : [...prev.amenities, amenity]
    }));
  };

  const getStatusColor = (status: Trip['status']) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'maintenance':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'suspended':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusLabel = (status: Trip['status']) => {
    switch (status) {
      case 'active':
        return 'Actif';
      case 'maintenance':
        return 'Maintenance';
      case 'cancelled':
        return 'Annulé';
      case 'suspended':
        return 'Suspendu';
      default:
        return 'Inconnu';
    }
  };

  const getPopularityColor = (index: number) => {
    if (index >= 80) return 'text-green-600';
    if (index >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR').format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Performance Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Trajets</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
              <Bus className="w-8 h-8 text-blue-600" />
            </div>
            <div className="mt-2 flex items-center text-sm">
              <TrendingUp className="w-4 h-4 text-green-600 mr-1" />
              <span className="text-green-600">{stats.active} actifs</span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Revenus Total</p>
                <p className="text-2xl font-bold">{formatCurrency(stats.totalRevenue / 1000000)}M</p>
              </div>
              <DollarSign className="w-8 h-8 text-green-600" />
            </div>
            <div className="mt-2 text-sm text-gray-600">
              XAF sur {formatCurrency(stats.totalBookings)} réservations
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Note Moyenne</p>
                <p className="text-2xl font-bold">{stats.averageRating.toFixed(1)}/5</p>
              </div>
              <Activity className="w-8 h-8 text-yellow-600" />
            </div>
            <div className="mt-2 text-sm text-gray-600">
              Satisfaction clients
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Retard Moyen</p>
                <p className="text-2xl font-bold">{Math.round(stats.averageDelay)}min</p>
              </div>
              <Clock className="w-8 h-8 text-orange-600" />
            </div>
            <div className="mt-2 text-sm text-gray-600">
              Performance ponctualité
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Management Panel */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center space-x-2">
                <Bus className="w-5 h-5" />
                <span>Gestion des Trajets</span>
                <Badge variant="outline" className="ml-2">
                  {filteredTrips.length} résultat{filteredTrips.length > 1 ? 's' : ''}
                </Badge>
              </CardTitle>
              <CardDescription>
                Créez, modifiez et gérez tous vos trajets de transport
              </CardDescription>
            </div>
            <div className="flex items-center space-x-2">
              {selectedTrips.length > 0 && (
                <Button
                  variant="outline"
                  onClick={() => setBulkActions(true)}
                  className="text-blue-600 border-blue-200 hover:bg-blue-50"
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Actions groupées ({selectedTrips.length})
                </Button>
              )}
              <Button
                variant="outline"
                onClick={handleExportTrips}
                disabled={filteredTrips.length === 0}
              >
                <Download className="w-4 h-4 mr-2" />
                Exporter
              </Button>
              <Button
                onClick={() => {
                  resetForm();
                  setEditingTrip(null);
                  setShowCreateModal(true);
                }}
                style={{ backgroundColor: 'rgba(192, 54, 24, 0.9)' }}
              >
                <Plus className="w-4 h-4 mr-2" />
                Nouveau Trajet
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Advanced Filters & Search */}
          <div className="space-y-4 mb-6">
            <div className="flex items-center space-x-4">
              <div className="flex-1 max-w-md">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Rechercher par ville, bus, description..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 bg-white border border-gray-300 text-gray-900 placeholder-gray-500"
                  />
                </div>
              </div>
              
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Statut" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les statuts</SelectItem>
                  <SelectItem value="active">Actifs</SelectItem>
                  <SelectItem value="maintenance">Maintenance</SelectItem>
                  <SelectItem value="suspended">Suspendus</SelectItem>
                  <SelectItem value="cancelled">Annulés</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={filterFrequency} onValueChange={setFilterFrequency}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Fréquence" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Toutes fréquences</SelectItem>
                  <SelectItem value="daily">Quotidien</SelectItem>
                  <SelectItem value="weekly">Hebdomadaire</SelectItem>
                  <SelectItem value="weekend">Week-end</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Trier par" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="popularity">Popularité</SelectItem>
                  <SelectItem value="revenue">Revenus</SelectItem>
                  <SelectItem value="bookings">Réservations</SelectItem>
                  <SelectItem value="rating">Note</SelectItem>
                  <SelectItem value="price">Prix</SelectItem>
                  <SelectItem value="departure">Départ</SelectItem>
                  <SelectItem value="updated">Dernière MAJ</SelectItem>
                </SelectContent>
              </Select>
              
              <Button
                variant="outline"
                onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                className="px-3"
              >
                {sortOrder === 'asc' ? '↑' : '↓'}
              </Button>
            </div>
            
            {/* Quick Filters */}
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">Filtres rapides:</span>
              <div className="flex items-center space-x-2">
                <Switch
                  id="high-performance"
                  checked={quickFilters.highPerformance}
                  onCheckedChange={(checked) => 
                    setQuickFilters(prev => ({ ...prev, highPerformance: checked }))
                  }
                />
                <Label htmlFor="high-performance" className="text-sm">Haute performance</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="needs-attention"
                  checked={quickFilters.needsAttention}
                  onCheckedChange={(checked) => 
                    setQuickFilters(prev => ({ ...prev, needsAttention: checked }))
                  }
                />
                <Label htmlFor="needs-attention" className="text-sm">Nécessite attention</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="recently-updated"
                  checked={quickFilters.recentlyUpdated}
                  onCheckedChange={(checked) => 
                    setQuickFilters(prev => ({ ...prev, recentlyUpdated: checked }))
                  }
                />
                <Label htmlFor="recently-updated" className="text-sm">Récemment modifiés</Label>
              </div>
            </div>
          </div>

          {/* Bulk Actions Bar */}
          {selectedTrips.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <input
                    type="checkbox"
                    checked={selectedTrips.length === filteredTrips.length}
                    onChange={handleSelectAll}
                    className="w-4 h-4 text-blue-600"
                  />
                  <span className="text-sm font-medium">
                    {selectedTrips.length} trajet{selectedTrips.length > 1 ? 's' : ''} sélectionné{selectedTrips.length > 1 ? 's' : ''}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleBulkStatusUpdate('active')}
                    disabled={isSubmitting}
                  >
                    <Power className="w-4 h-4 mr-1" />
                    Activer
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleBulkStatusUpdate('suspended')}
                    disabled={isSubmitting}
                  >
                    <PowerOff className="w-4 h-4 mr-1" />
                    Suspendre
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedTrips([])}
                  >
                    <X className="w-4 h-4 mr-1" />
                    Annuler
                  </Button>
                </div>
              </div>
            </motion.div>
          )}

          {/* Enhanced Trips List */}
          <div className="space-y-4">
            <AnimatePresence>
              {filteredTrips.map((trip, index) => {
                const isSelected = selectedTrips.includes(trip.id);
                const occupancyRate = Math.round((trip.passengers / trip.capacity) * 100);
                
                return (
                  <motion.div
                    key={trip.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ delay: index * 0.05 }}
                    className={`border rounded-lg p-4 transition-all duration-200 ${
                      isSelected 
                        ? 'ring-2 ring-blue-500 bg-blue-50 shadow-md' 
                        : 'hover:shadow-md hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-3 flex-1">
                        {/* Selection Checkbox */}
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => handleSelectTrip(trip.id)}
                          className="mt-2 w-4 h-4 text-blue-600"
                        />
                        
                        <div className="flex-1">
                          {/* Header Row */}
                          <div className="flex items-center space-x-4 mb-3">
                            <h4 className="text-lg font-semibold text-gray-900">
                              {trip.departure} → {trip.arrival}
                            </h4>
                            <Badge className={getStatusColor(trip.status)}>
                              {getStatusLabel(trip.status)}
                            </Badge>
                            {!trip.isEnabled && (
                              <Badge variant="outline" className="text-gray-500 border-gray-300">
                                Désactivé
                              </Badge>
                            )}
                            <div className="flex items-center space-x-1">
                              <Switch
                                checked={trip.isEnabled}
                                onCheckedChange={(checked) => handleToggleEnable(trip.id, checked)}
                                disabled={trip.status === 'maintenance'}
                              />
                              <span className="text-xs text-gray-500">
                                {trip.isEnabled ? 'Activé' : 'Désactivé'}
                              </span>
                            </div>
                          </div>
                          
                          {/* Main Info Grid */}
                          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm mb-3">
                            <div className="flex items-center space-x-1">
                              <Clock className="w-4 h-4 text-gray-500" />
                              <span>{trip.duration}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <DollarSign className="w-4 h-4 text-green-600" />
                              <span className="font-medium">{formatCurrency(trip.price)} XAF</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Bus className="w-4 h-4 text-blue-600" />
                              <span>{trip.bus}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Users className="w-4 h-4 text-purple-600" />
                              <span>{trip.passengers}/{trip.capacity}</span>
                              <div className="ml-2 w-8 bg-gray-200 rounded-full h-2">
                                <div
                                  className={`h-2 rounded-full ${
                                    occupancyRate >= 90 ? 'bg-red-500' :
                                    occupancyRate >= 70 ? 'bg-yellow-500' : 'bg-green-500'
                                  }`}
                                  style={{ width: `${occupancyRate}%` }}
                                />
                              </div>
                            </div>
                            <div className="flex items-center space-x-1">
                              <BarChart3 className="w-4 h-4 text-orange-600" />
                              <span className={getPopularityColor(trip.popularityIndex)}>
                                {trip.popularityIndex}%
                              </span>
                            </div>
                          </div>
                          
                          {/* Performance Metrics */}
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs text-gray-600 mb-3">
                            <div>
                              <span className="text-gray-500">Revenus:</span>
                              <div className="font-medium">{formatCurrency(trip.revenue / 1000)}K XAF</div>
                            </div>
                            <div>
                              <span className="text-gray-500">Réservations:</span>
                              <div className="font-medium">{formatCurrency(trip.totalBookings)}</div>
                            </div>
                            <div>
                              <span className="text-gray-500">Note:</span>
                              <div className="font-medium flex items-center">
                                ⭐ {trip.averageRating.toFixed(1)}/5
                              </div>
                            </div>
                            <div>
                              <span className="text-gray-500">Retard moyen:</span>
                              <div className="font-medium">
                                {Math.round(trip.delayHistory.reduce((a, b) => a + b, 0) / trip.delayHistory.length || 0)}min
                              </div>
                            </div>
                          </div>

                          {/* Amenities */}
                          {trip.amenities && trip.amenities.length > 0 && (
                            <div className="flex flex-wrap gap-1 mb-2">
                              {trip.amenities.slice(0, 4).map((amenity) => (
                                <Badge key={amenity} variant="outline" className="text-xs">
                                  {amenity}
                                </Badge>
                              ))}
                              {trip.amenities.length > 4 && (
                                <Badge variant="outline" className="text-xs">
                                  +{trip.amenities.length - 4}
                                </Badge>
                              )}
                            </div>
                          )}

                          {/* Footer with Last Update */}
                          <div className="flex items-center justify-between text-xs text-gray-500">
                            <span>Modifié le {formatDate(trip.updatedAt)}</span>
                            <span className="capitalize">{trip.frequency}</span>
                          </div>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex items-center space-x-1 ml-4">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleViewDetails(trip)}
                          className="text-blue-600 hover:bg-blue-50"
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleEdit(trip)}>
                              <Edit className="w-4 h-4 mr-2" />
                              Modifier
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleDuplicateTrip(trip)}>
                              <Copy className="w-4 h-4 mr-2" />
                              Dupliquer
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem 
                              onClick={() => confirmDelete(trip.id)}
                              className="text-red-600 focus:text-red-600"
                            >
                              <Trash2 className="w-4 h-4 mr-2" />
                              Supprimer
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>

            {filteredTrips.length === 0 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-12"
              >
                <Bus className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-medium text-gray-900 mb-2">
                  Aucun trajet trouvé
                </h3>
                <p className="text-gray-600 mb-6 max-w-md mx-auto">
                  {searchTerm || filterStatus !== 'all' || Object.values(quickFilters).some(Boolean)
                    ? 'Aucun trajet ne correspond à vos critères de recherche. Essayez de modifier les filtres.'
                    : 'Commencez par créer votre premier trajet pour développer votre réseau de transport.'}
                </p>
                {(!searchTerm && filterStatus === 'all' && !Object.values(quickFilters).some(Boolean)) && (
                  <div className="space-y-3">
                    <Button
                      onClick={() => {
                        resetForm();
                        setEditingTrip(null);
                        setShowCreateModal(true);
                      }}
                      style={{ backgroundColor: 'rgba(192, 54, 24, 0.9)' }}
                      className="px-6"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Créer votre premier trajet
                    </Button>
                    <p className="text-sm text-gray-500">
                      ou consultez notre guide de démarrage rapide
                    </p>
                  </div>
                )}
                {(searchTerm || filterStatus !== 'all' || Object.values(quickFilters).some(Boolean)) && (
                  <Button
                    variant="outline"
                    onClick={() => {
                      setSearchTerm('');
                      setFilterStatus('all');
                      setFilterFrequency('all');
                      setQuickFilters({ highPerformance: false, needsAttention: false, recentlyUpdated: false });
                    }}
                  >
                    Réinitialiser les filtres
                  </Button>
                )}
              </motion.div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Trip Details Modal */}
      <Dialog open={showDetailsModal} onOpenChange={setShowDetailsModal}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <Bus className="w-5 h-5" />
              <span>Détails du trajet</span>
            </DialogTitle>
            <DialogDescription>
              Informations complètes et métriques de performance
            </DialogDescription>
          </DialogHeader>

          {selectedTrip && (
            <div className="space-y-6">
              {/* Header Information */}
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-lg">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-2xl font-bold text-gray-900">
                    {selectedTrip.departure} → {selectedTrip.arrival}
                  </h3>
                  <div className="flex space-x-2">
                    <Badge className={getStatusColor(selectedTrip.status)}>
                      {getStatusLabel(selectedTrip.status)}
                    </Badge>
                    {!selectedTrip.isEnabled && (
                      <Badge variant="outline" className="text-gray-500">
                        Désactivé
                      </Badge>
                    )}
                  </div>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-600">
                      {formatCurrency(selectedTrip.price)}
                    </div>
                    <div className="text-sm text-gray-600">Prix (XAF)</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-600">
                      {selectedTrip.averageRating.toFixed(1)}
                    </div>
                    <div className="text-sm text-gray-600">Note moyenne</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-purple-600">
                      {selectedTrip.popularityIndex}%
                    </div>
                    <div className="text-sm text-gray-600">Popularité</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-orange-600">
                      {formatCurrency(selectedTrip.totalBookings)}
                    </div>
                    <div className="text-sm text-gray-600">Réservations</div>
                  </div>
                </div>
              </div>

              {/* Performance Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Performance Financière</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span>Revenus totaux:</span>
                      <span className="font-bold text-green-600">
                        {formatCurrency(selectedTrip.revenue)} XAF
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Revenus par trajet:</span>
                      <span className="font-medium">
                        {formatCurrency(Math.round(selectedTrip.revenue / selectedTrip.totalBookings || 0))} XAF
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Taux d'occupation moyen:</span>
                      <span className="font-medium">
                        {Math.round((selectedTrip.passengers / selectedTrip.capacity) * 100)}%
                      </span>
                    </div>
                    <Progress 
                      value={(selectedTrip.passengers / selectedTrip.capacity) * 100} 
                      className="h-2"
                    />
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Performance Opérationnelle</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span>Durée estimée:</span>
                      <span className="font-medium">{selectedTrip.estimatedDuration}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Durée réelle moyenne:</span>
                      <span className="font-medium">{selectedTrip.actualDuration || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Retard moyen:</span>
                      <span className="font-medium text-orange-600">
                        {Math.round(selectedTrip.delayHistory.reduce((a, b) => a + b, 0) / selectedTrip.delayHistory.length || 0)} min
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Fréquence:</span>
                      <span className="font-medium capitalize">{selectedTrip.frequency}</span>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Additional Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium mb-3">Informations du trajet</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Bus assigné:</span>
                      <span className="font-medium">{selectedTrip.bus}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Capacité:</span>
                      <span className="font-medium">{selectedTrip.capacity} places</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Créé le:</span>
                      <span className="font-medium">{formatDate(selectedTrip.createdAt)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Dernière modification:</span>
                      <span className="font-medium">{formatDate(selectedTrip.updatedAt)}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-3">Équipements et services</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedTrip.amenities.map((amenity) => (
                      <Badge key={amenity} variant="outline">
                        {amenity}
                      </Badge>
                    ))}
                  </div>
                  {selectedTrip.description && (
                    <div className="mt-4">
                      <h5 className="font-medium mb-2">Description</h5>
                      <p className="text-sm text-gray-600">{selectedTrip.description}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end space-x-3 pt-4 border-t">
                <Button
                  variant="outline"
                  onClick={() => handleEdit(selectedTrip)}
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Modifier
                </Button>
                <Button
                  variant="outline"
                  onClick={() => handleDuplicateTrip(selectedTrip)}
                >
                  <Copy className="w-4 h-4 mr-2" />
                  Dupliquer
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setShowDetailsModal(false)}
                >
                  Fermer
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!showDeleteConfirm} onOpenChange={() => setShowDeleteConfirm(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center space-x-2">
              <AlertTriangle className="w-5 h-5 text-red-600" />
              <span>Confirmer la suppression</span>
            </AlertDialogTitle>
            <AlertDialogDescription>
              Êtes-vous sûr de vouloir supprimer ce trajet ? Cette action est irréversible et toutes les données associées seront perdues.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setShowDeleteConfirm(null)}>
              Annuler
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => showDeleteConfirm && handleDelete(showDeleteConfirm)}
              className="bg-red-600 hover:bg-red-700"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Supprimer définitivement
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Create/Edit Modal */}
      <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              {editingTrip ? (
                <>
                  <Edit className="w-5 h-5" />
                  <span>Modifier le trajet</span>
                </>
              ) : (
                <>
                  <Plus className="w-5 h-5" />
                  <span>Créer un nouveau trajet</span>
                </>
              )}
            </DialogTitle>
            <DialogDescription>
              {editingTrip 
                ? 'Modifiez les informations du trajet existant. Les changements seront appliqués immédiatement.'
                : 'Remplissez toutes les informations nécessaires pour créer un nouveau trajet dans votre réseau.'}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Form Progress Indicator */}
            <div className="flex items-center space-x-2 mb-6">
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                <span className="text-xs text-gray-600">Informations de base</span>
              </div>
              <div className="w-8 h-px bg-gray-300"></div>
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                <span className="text-xs text-gray-600">Configuration</span>
              </div>
              <div className="w-8 h-px bg-gray-300"></div>
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                <span className="text-xs text-gray-600">Services</span>
              </div>
            </div>
            {/* Section 1: Route Information */}
            <div className="bg-gray-50 p-4 rounded-lg space-y-4">
              <h3 className="font-medium text-gray-900 flex items-center">
                <MapPin className="w-4 h-4 mr-2" />
                Informations de l'itinéraire
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="departure" className="flex items-center">
                    Ville de départ *
                    <Info className="w-3 h-3 ml-1 text-gray-500" />
                  </Label>
                  <Select 
                    value={formData.departure} 
                    onValueChange={(value) => setFormData(prev => ({ ...prev, departure: value }))}
                  >
                    <SelectTrigger className="bg-white">
                      <SelectValue placeholder="Sélectionnez la ville de départ..." />
                    </SelectTrigger>
                    <SelectContent>
                      {cities.map((city) => (
                        <SelectItem key={city} value={city}>
                          <div className="flex items-center">
                            <MapPin className="w-3 h-3 mr-2 text-gray-500" />
                            {city}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {formErrors.departure && (
                    <p className="text-sm text-red-600 flex items-center">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      {formErrors.departure}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="arrival" className="flex items-center">
                    Ville d'arrivée *
                    <Info className="w-3 h-3 ml-1 text-gray-500" />
                  </Label>
                  <Select 
                    value={formData.arrival} 
                    onValueChange={(value) => setFormData(prev => ({ ...prev, arrival: value }))}
                  >
                    <SelectTrigger className="bg-white">
                      <SelectValue placeholder="Sélectionnez la ville d'arrivée..." />
                    </SelectTrigger>
                    <SelectContent>
                      {cities.filter(city => city !== formData.departure).map((city) => (
                        <SelectItem key={city} value={city}>
                          <div className="flex items-center">
                            <MapPin className="w-3 h-3 mr-2 text-gray-500" />
                            {city}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {formErrors.arrival && (
                    <p className="text-sm text-red-600 flex items-center">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      {formErrors.arrival}
                    </p>
                  )}
                </div>
              </div>

              {/* Route Preview */}
              {formData.departure && formData.arrival && (
                <div className="bg-blue-50 border border-blue-200 p-3 rounded-lg">
                  <div className="flex items-center justify-center text-blue-800">
                    <MapPin className="w-4 h-4 mr-2" />
                    <span className="font-medium">{formData.departure}</span>
                    <div className="mx-4 flex-1 h-px bg-blue-300 relative">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="bg-blue-50 px-2">
                          <Bus className="w-4 h-4 text-blue-600" />
                        </div>
                      </div>
                    </div>
                    <span className="font-medium">{formData.arrival}</span>
                    <MapPin className="w-4 h-4 ml-2" />
                  </div>
                </div>
              )}
            </div>

            {/* Section 2: Trip Configuration */}
            <div className="bg-gray-50 p-4 rounded-lg space-y-4">
              <h3 className="font-medium text-gray-900 flex items-center">
                <Settings className="w-4 h-4 mr-2" />
                Configuration du trajet
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="duration" className="flex items-center">
                    <Clock className="w-3 h-3 mr-1" />
                    Durée du trajet *
                  </Label>
                  <Input
                    id="duration"
                    placeholder="ex: 6h 30min"
                    value={formData.duration}
                    onChange={(e) => setFormData(prev => ({ ...prev, duration: e.target.value }))}
                    className="bg-white border border-gray-300 text-gray-900 placeholder-gray-500"
                  />
                  {formErrors.duration && (
                    <p className="text-sm text-red-600 flex items-center">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      {formErrors.duration}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="price" className="flex items-center">
                    <DollarSign className="w-3 h-3 mr-1" />
                    Prix (XAF) *
                  </Label>
                  <Input
                    id="price"
                    type="number"
                    placeholder="ex: 25000"
                    value={formData.price}
                    onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                    className="bg-white border border-gray-300 text-gray-900 placeholder-gray-500"
                  />
                  {formErrors.price && (
                    <p className="text-sm text-red-600 flex items-center">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      {formErrors.price}
                    </p>
                  )}
                  {formData.price && !isNaN(parseFloat(formData.price)) && (
                    <p className="text-xs text-green-600">
                      ≈ {formatCurrency(parseFloat(formData.price))} XAF
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="capacity" className="flex items-center">
                    <Users className="w-3 h-3 mr-1" />
                    Capacité *
                  </Label>
                  <Input
                    id="capacity"
                    type="number"
                    placeholder="ex: 50"
                    value={formData.capacity}
                    onChange={(e) => setFormData(prev => ({ ...prev, capacity: e.target.value }))}
                    className="bg-white border border-gray-300 text-gray-900 placeholder-gray-500"
                  />
                  {formErrors.capacity && (
                    <p className="text-sm text-red-600 flex items-center">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      {formErrors.capacity}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Section 3: Fleet Assignment */}
            <div className="bg-gray-50 p-4 rounded-lg space-y-4">
              <h3 className="font-medium text-gray-900 flex items-center">
                <Bus className="w-4 h-4 mr-2" />
                Assignation de véhicule et planification
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="bus" className="flex items-center">
                    <Bus className="w-3 h-3 mr-1" />
                    Bus assigné *
                  </Label>
                  <Select 
                    value={formData.bus} 
                    onValueChange={(value) => setFormData(prev => ({ ...prev, bus: value }))}
                  >
                    <SelectTrigger className="bg-white">
                      <SelectValue placeholder="Sélectionnez un bus..." />
                    </SelectTrigger>
                    <SelectContent>
                      {buses.map((bus) => {
                        const isUsed = trips.some(trip => 
                          trip.bus === bus && 
                          trip.id !== editingTrip?.id && 
                          trip.status === 'active'
                        );
                        return (
                          <SelectItem key={bus} value={bus} disabled={isUsed}>
                            <div className="flex items-center justify-between w-full">
                              <span>{bus}</span>
                              {isUsed && (
                                <Badge variant="outline" className="ml-2 text-xs">
                                  En service
                                </Badge>
                              )}
                            </div>
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                  {formErrors.bus && (
                    <p className="text-sm text-red-600 flex items-center">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      {formErrors.bus}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="frequency" className="flex items-center">
                    <Calendar className="w-3 h-3 mr-1" />
                    Fréquence
                  </Label>
                  <Select 
                    value={formData.frequency} 
                    onValueChange={(value: 'daily' | 'weekly' | 'weekend') => 
                      setFormData(prev => ({ ...prev, frequency: value }))
                    }
                  >
                    <SelectTrigger className="bg-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="daily">
                        <div className="flex items-center">
                          <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                          Quotidien (7j/7)
                        </div>
                      </SelectItem>
                      <SelectItem value="weekly">
                        <div className="flex items-center">
                          <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                          Hebdomadaire
                        </div>
                      </SelectItem>
                      <SelectItem value="weekend">
                        <div className="flex items-center">
                          <div className="w-2 h-2 bg-purple-500 rounded-full mr-2"></div>
                          Week-end uniquement
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="status" className="flex items-center">
                    <Activity className="w-3 h-3 mr-1" />
                    Statut initial
                  </Label>
                  <Select 
                    value={formData.status} 
                    onValueChange={(value: 'active' | 'maintenance' | 'cancelled' | 'suspended') => 
                      setFormData(prev => ({ ...prev, status: value }))
                    }
                  >
                    <SelectTrigger className="bg-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">
                        <div className="flex items-center">
                          <CheckCircle className="w-3 h-3 mr-2 text-green-600" />
                          Actif
                        </div>
                      </SelectItem>
                      <SelectItem value="maintenance">
                        <div className="flex items-center">
                          <AlertTriangle className="w-3 h-3 mr-2 text-yellow-600" />
                          Maintenance
                        </div>
                      </SelectItem>
                      <SelectItem value="suspended">
                        <div className="flex items-center">
                          <AlertCircle className="w-3 h-3 mr-2 text-orange-600" />
                          Suspendu
                        </div>
                      </SelectItem>
                      <SelectItem value="cancelled">
                        <div className="flex items-center">
                          <X className="w-3 h-3 mr-2 text-red-600" />
                          Annulé
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Section 4: Description and Services */}
            <div className="bg-gray-50 p-4 rounded-lg space-y-4">
              <h3 className="font-medium text-gray-900 flex items-center">
                <Zap className="w-4 h-4 mr-2" />
                Services et description
              </h3>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="description">Description du trajet</Label>
                  <Textarea
                    id="description"
                    placeholder="Décrivez les spécificités de ce trajet (arrêts, durée, conditions particulières...)."
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    className="bg-white border border-gray-300 text-gray-900 placeholder-gray-500"
                    rows={3}
                  />
                  <p className="text-xs text-gray-500">
                    Cette description sera visible par les clients lors de la réservation.
                  </p>
                </div>

                {/* Enhanced Amenities Selection */}
                <div className="space-y-3">
                  <Label className="flex items-center">
                    Équipements et services inclus
                    <Badge variant="outline" className="ml-2 text-xs">
                      {formData.amenities.length} sélectionné{formData.amenities.length > 1 ? 's' : ''}
                    </Badge>
                  </Label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {availableAmenities.map((amenity) => (
                      <div 
                        key={amenity} 
                        className={`flex items-center space-x-2 p-2 rounded-lg border transition-colors ${
                          formData.amenities.includes(amenity) 
                            ? 'bg-blue-50 border-blue-200' 
                            : 'bg-white border-gray-200 hover:bg-gray-50'
                        }`}
                      >
                        <Switch
                          id={amenity}
                          checked={formData.amenities.includes(amenity)}
                          onCheckedChange={() => toggleAmenity(amenity)}
                        />
                        <Label htmlFor={amenity} className="text-sm cursor-pointer flex-1">
                          {amenity}
                        </Label>
                      </div>
                    ))}
                  </div>
                  <p className="text-xs text-gray-500">
                    Les équipements sélectionnés seront affichés aux clients et influenceront les réservations.
                  </p>
                </div>
              </div>
            </div>

            {/* Form Summary */}
            {(formData.departure && formData.arrival && formData.price) && (
              <div className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 p-4 rounded-lg">
                <h4 className="font-medium text-green-800 mb-2">Aperçu du trajet</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Itinéraire:</span>
                    <div className="font-medium">{formData.departure} → {formData.arrival}</div>
                  </div>
                  <div>
                    <span className="text-gray-600">Prix:</span>
                    <div className="font-medium text-green-600">
                      {formatCurrency(parseFloat(formData.price) || 0)} XAF
                    </div>
                  </div>
                  <div>
                    <span className="text-gray-600">Durée:</span>
                    <div className="font-medium">{formData.duration || 'Non définie'}</div>
                  </div>
                  <div>
                    <span className="text-gray-600">Capacité:</span>
                    <div className="font-medium">{formData.capacity || 0} places</div>
                  </div>
                </div>
              </div>
            )}

            {/* Form Actions */}
            <Separator />
            <div className="flex justify-between items-center pt-4">
              <div className="text-sm text-gray-500">
                * Champs obligatoires
              </div>
              <div className="flex space-x-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setShowCreateModal(false);
                    resetForm();
                    setEditingTrip(null);
                  }}
                  disabled={isSubmitting}
                >
                  <X className="w-4 h-4 mr-2" />
                  Annuler
                </Button>
                {editingTrip && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      resetForm();
                      setEditingTrip(null);
                    }}
                    disabled={isSubmitting}
                  >
                    Réinitialiser
                  </Button>
                )}
                <Button
                  type="submit"
                  disabled={isSubmitting || !formData.departure || !formData.arrival || !formData.price}
                  style={{ backgroundColor: 'rgba(192, 54, 24, 0.9)' }}
                  className="min-w-[120px]"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      {editingTrip ? 'Modification...' : 'Création...'}
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      {editingTrip ? 'Modifier le trajet' : 'Créer le trajet'}
                    </>
                  )}
                </Button>
              </div>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};