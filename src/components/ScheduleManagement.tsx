import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Clock, 
  Calendar, 
  Plus, 
  Edit, 
  Trash2, 
  Save, 
  X,
  CheckCircle,
  AlertCircle,
  MapPin,
  Bus,
  Users,
  Filter,
  Search,
  Download,
  Upload,
  RefreshCw,
  Zap,
  BarChart3,
  TrendingUp,
  Activity,
  Bell,
  Power,
  PowerOff,
  Loader2,
  Copy,
  MoreHorizontal,
  ArrowUp,
  ArrowDown,
  Settings,
  AlertTriangle,
  Info,
  PlayCircle,
  PauseCircle
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Badge } from './ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { Switch } from './ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { toast } from 'sonner';

interface Schedule {
  id: string;
  tripId: string;
  departure: string;
  arrival: string;
  departureTime: string;
  arrivalTime: string;
  bus: string;
  frequency: string[];
  status: 'active' | 'suspended' | 'full' | 'cancelled' | 'delayed';
  availableSeats: number;
  totalSeats: number;
  price: number;
  isEnabled: boolean;
  createdAt: string;
  updatedAt: string;
  actualDepartureTime?: string;
  actualArrivalTime?: string;
  delayMinutes: number;
  driver?: string;
  estimatedRevenue: number;
  currentBookings: number;
  lastModifiedBy: string;
  repeatPattern: 'daily' | 'weekly' | 'custom';
  validFrom: string;
  validTo: string;
  notes?: string;
  priority: 'low' | 'medium' | 'high';
  weatherDependent: boolean;
  maintenanceWindow?: string;
}

interface ScheduleManagementProps {
  className?: string;
}

export const ScheduleManagement: React.FC<ScheduleManagementProps> = ({ className = '' }) => {
  const [schedules, setSchedules] = useState<Schedule[]>([
    {
      id: '1',
      tripId: 'trip-001',
      departure: 'Libreville',
      arrival: 'Port-Gentil',
      departureTime: '08:00',
      arrivalTime: '14:30',
      bus: 'KC-001',
      frequency: ['lundi', 'mercredi', 'vendredi'],
      status: 'active',
      availableSeats: 12,
      totalSeats: 50,
      price: 25000,
      isEnabled: true,
      createdAt: '2024-01-01T10:00:00Z',
      updatedAt: '2024-01-14T15:30:00Z',
      actualDepartureTime: '08:05',
      actualArrivalTime: '14:35',
      delayMinutes: 5,
      driver: 'Jean Mbadinga',
      estimatedRevenue: 950000,
      currentBookings: 38,
      lastModifiedBy: 'Admin',
      repeatPattern: 'weekly',
      validFrom: '2024-01-01',
      validTo: '2024-12-31',
      notes: 'Service régulier avec pause déjeuner',
      priority: 'high',
      weatherDependent: false
    },
    {
      id: '2',
      tripId: 'trip-002',
      departure: 'Libreville',
      arrival: 'Franceville',
      departureTime: '06:00',
      arrivalTime: '14:45',
      bus: 'KC-002',
      frequency: ['mardi', 'jeudi', 'samedi'],
      status: 'active',
      availableSeats: 28,
      totalSeats: 50,
      price: 35000,
      isEnabled: true,
      createdAt: '2024-01-01T10:00:00Z',
      updatedAt: '2024-01-13T09:20:00Z',
      actualDepartureTime: '06:15',
      actualArrivalTime: '15:00',
      delayMinutes: 15,
      driver: 'Marie Nzoghe',
      estimatedRevenue: 770000,
      currentBookings: 22,
      lastModifiedBy: 'Admin',
      repeatPattern: 'weekly',
      validFrom: '2024-01-01',
      validTo: '2024-12-31',
      notes: 'Trajet avec arrêts multiples',
      priority: 'medium',
      weatherDependent: true
    },
    {
      id: '3',
      tripId: 'trip-003',
      departure: 'Port-Gentil',
      arrival: 'Oyem',
      departureTime: '05:30',
      arrivalTime: '15:45',
      bus: 'KC-003',
      frequency: ['samedi', 'dimanche'],
      status: 'suspended',
      availableSeats: 45,
      totalSeats: 45,
      price: 42000,
      isEnabled: false,
      createdAt: '2024-01-01T10:00:00Z',
      updatedAt: '2024-01-12T16:00:00Z',
      delayMinutes: 0,
      driver: 'Paul Ekomy',
      estimatedRevenue: 0,
      currentBookings: 0,
      lastModifiedBy: 'Admin',
      repeatPattern: 'weekly',
      validFrom: '2024-01-01',
      validTo: '2024-12-31',
      notes: 'Service suspendu pour maintenance',
      priority: 'low',
      weatherDependent: false,
      maintenanceWindow: '2024-01-15 - 2024-01-20'
    },
    {
      id: '4',
      tripId: 'trip-004',
      departure: 'Franceville',
      arrival: 'Libreville',
      departureTime: '16:00',
      arrivalTime: '23:30',
      bus: 'KC-002',
      frequency: ['mardi', 'jeudi', 'samedi'],
      status: 'delayed',
      availableSeats: 35,
      totalSeats: 50,
      price: 35000,
      isEnabled: true,
      createdAt: '2024-01-01T10:00:00Z',
      updatedAt: '2024-01-14T16:45:00Z',
      actualDepartureTime: '16:30',
      delayMinutes: 30,
      driver: 'Marie Nzoghe',
      estimatedRevenue: 525000,
      currentBookings: 15,
      lastModifiedBy: 'Admin',
      repeatPattern: 'weekly',
      validFrom: '2024-01-01',
      validTo: '2024-12-31',
      notes: 'Retard dû aux conditions routières',
      priority: 'high',
      weatherDependent: true
    }
  ]);

  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterPriority, setFilterPriority] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('departureTime');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [showBulkEdit, setShowBulkEdit] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedSchedules, setSelectedSchedules] = useState<string[]>([]);
  const [editingSchedule, setEditingSchedule] = useState<Schedule | null>(null);
  const [selectedSchedule, setSelectedSchedule] = useState<Schedule | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [viewMode, setViewMode] = useState<'timeline' | 'list' | 'calendar'>('list');
  const [autoRefresh, setAutoRefresh] = useState(false);
  const [showRealTimeUpdates, setShowRealTimeUpdates] = useState(true);
  const [quickFilters, setQuickFilters] = useState({
    delayed: false,
    highOccupancy: false,
    needsAttention: false,
    todayOnly: false
  });

  const daysOfWeek = ['lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi', 'dimanche'];

  // Advanced filtering and sorting
  const filteredSchedules = schedules.filter(schedule => {
    const matchesSearch = schedule.departure.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         schedule.arrival.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         schedule.bus.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         schedule.driver?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         schedule.notes?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filterStatus === 'all' || schedule.status === filterStatus;
    const matchesPriority = filterPriority === 'all' || schedule.priority === filterPriority;
    
    // Quick filters
    const matchesQuickFilters = 
      (!quickFilters.delayed || schedule.delayMinutes > 0) &&
      (!quickFilters.highOccupancy || (schedule.totalSeats - schedule.availableSeats) / schedule.totalSeats >= 0.8) &&
      (!quickFilters.needsAttention || schedule.status === 'delayed' || schedule.status === 'suspended') &&
      (!quickFilters.todayOnly || schedule.frequency.includes(new Date().toLocaleDateString('fr-FR', { weekday: 'long' })));
    
    return matchesSearch && matchesStatus && matchesPriority && matchesQuickFilters;
  }).sort((a, b) => {
    let comparison = 0;
    
    switch (sortBy) {
      case 'departureTime':
        comparison = a.departureTime.localeCompare(b.departureTime);
        break;
      case 'delay':
        comparison = a.delayMinutes - b.delayMinutes;
        break;
      case 'occupancy':
        const occupancyA = (a.totalSeats - a.availableSeats) / a.totalSeats;
        const occupancyB = (b.totalSeats - b.availableSeats) / b.totalSeats;
        comparison = occupancyA - occupancyB;
        break;
      case 'revenue':
        comparison = a.estimatedRevenue - b.estimatedRevenue;
        break;
      case 'priority':
        const priorityOrder = { high: 3, medium: 2, low: 1 };
        comparison = priorityOrder[a.priority] - priorityOrder[b.priority];
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

  // Real-time statistics
  const stats = {
    total: schedules.length,
    active: schedules.filter(s => s.status === 'active' && s.isEnabled).length,
    delayed: schedules.filter(s => s.delayMinutes > 0).length,
    suspended: schedules.filter(s => s.status === 'suspended' || !s.isEnabled).length,
    totalRevenue: schedules.reduce((sum, s) => sum + s.estimatedRevenue, 0),
    totalBookings: schedules.reduce((sum, s) => sum + s.currentBookings, 0),
    averageDelay: schedules.reduce((sum, s) => sum + s.delayMinutes, 0) / schedules.length,
    occupancyRate: (schedules.reduce((sum, s) => sum + (s.totalSeats - s.availableSeats), 0) / schedules.reduce((sum, s) => sum + s.totalSeats, 0)) * 100
  };

  const getStatusColor = (status: Schedule['status']) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'suspended':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'full':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'cancelled':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'delayed':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusLabel = (status: Schedule['status']) => {
    switch (status) {
      case 'active':
        return 'Actif';
      case 'suspended':
        return 'Suspendu';
      case 'full':
        return 'Complet';
      case 'cancelled':
        return 'Annulé';
      case 'delayed':
        return 'En retard';
      default:
        return 'Inconnu';
    }
  };

  const getPriorityColor = (priority: Schedule['priority']) => {
    switch (priority) {
      case 'high':
        return 'text-red-600';
      case 'medium':
        return 'text-yellow-600';
      case 'low':
        return 'text-green-600';
      default:
        return 'text-gray-600';
    }
  };

  const getOccupancyPercentage = (available: number, total: number) => {
    return ((total - available) / total) * 100;
  };

  const getOccupancyColor = (percentage: number) => {
    if (percentage >= 90) return 'text-red-600';
    if (percentage >= 70) return 'text-yellow-600';
    return 'text-green-600';
  };

  const toggleScheduleSelection = (scheduleId: string) => {
    setSelectedSchedules(prev =>
      prev.includes(scheduleId)
        ? prev.filter(id => id !== scheduleId)
        : [...prev, scheduleId]
    );
  };

  const handleBulkStatusUpdate = async (newStatus: Schedule['status']) => {
    try {
      // API: bulkUpdateScheduleStatus()
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setSchedules(prev =>
        prev.map(schedule =>
          selectedSchedules.includes(schedule.id)
            ? { ...schedule, status: newStatus }
            : schedule
        )
      );

      toast.success(`${selectedSchedules.length} horaire(s) mis à jour`);
      setSelectedSchedules([]);
      setShowBulkEdit(false);
    } catch (error) {
      toast.error('Erreur lors de la mise à jour');
    }
  };

  const exportSchedules = () => {
    // API: exportSchedules()
    const csvContent = [
      'Départ,Arrivée,Heure Départ,Heure Arrivée,Bus,Fréquence,Statut,Places Disponibles,Prix',
      ...filteredSchedules.map(schedule =>
        `${schedule.departure},${schedule.arrival},${schedule.departureTime},${schedule.arrivalTime},${schedule.bus},"${schedule.frequency.join(', ')}",${schedule.status},${schedule.availableSeats},${schedule.price}`
      )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `horaires-${selectedDate}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
    
    toast.success('Export terminé');
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header with Real-time Stats */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center space-x-2">
                <Clock className="w-5 h-5" />
                <span>Gestion des Horaires</span>
                {showRealTimeUpdates && (
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="w-2 h-2 bg-green-500 rounded-full"
                  />
                )}
              </CardTitle>
              <CardDescription>
                Planifiez et gérez les horaires de vos trajets avec mise à jour temps réel
              </CardDescription>
            </div>
            <div className="flex items-center space-x-2">
              <div className="flex items-center space-x-2 text-sm">
                <Switch
                  checked={autoRefresh}
                  onCheckedChange={setAutoRefresh}
                />
                <span className="text-gray-600">Auto-refresh</span>
              </div>
              <Button
                variant="outline"
                onClick={() => window.location.reload()}
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Actualiser
              </Button>
              <Button
                variant="outline"
                onClick={exportSchedules}
                disabled={filteredSchedules.length === 0}
              >
                <Download className="w-4 h-4 mr-2" />
                Exporter
              </Button>
              <Button
                onClick={() => setShowCreateModal(true)}
                style={{ backgroundColor: 'rgba(192, 54, 24, 0.9)' }}
                className="text-white hover:bg-opacity-80"
              >
                <Plus className="w-4 h-4 mr-2" />
                Nouvel horaire
              </Button>
              <Button
                onClick={() => setShowBulkEdit(true)}
                disabled={selectedSchedules.length === 0}
                variant="outline"
              >
                <Edit className="w-4 h-4 mr-2" />
                Modification en lot ({selectedSchedules.length})
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Advanced Filters and View Controls */}
          <Tabs value={viewMode} onValueChange={(value) => setViewMode(value as any)} className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <TabsList>
                <TabsTrigger value="list">
                  <BarChart3 className="w-4 h-4 mr-2" />
                  Liste
                </TabsTrigger>
                <TabsTrigger value="timeline">
                  <Activity className="w-4 h-4 mr-2" />
                  Timeline
                </TabsTrigger>
                <TabsTrigger value="calendar">
                  <Calendar className="w-4 h-4 mr-2" />
                  Calendrier
                </TabsTrigger>
              </TabsList>
              
              <div className="flex items-center space-x-2">
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="departureTime">Heure départ</SelectItem>
                    <SelectItem value="delay">Retard</SelectItem>
                    <SelectItem value="occupancy">Occupation</SelectItem>
                    <SelectItem value="revenue">Revenus</SelectItem>
                    <SelectItem value="priority">Priorité</SelectItem>
                    <SelectItem value="updated">Dernière MAJ</SelectItem>
                  </SelectContent>
                </Select>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                >
                  {sortOrder === 'asc' ? <ArrowUp className="w-4 h-4" /> : <ArrowDown className="w-4 h-4" />}
                </Button>
              </div>
            </div>
          </Tabs>

          {/* Search and Filters */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Rechercher horaires..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-white border border-gray-300 text-gray-900 placeholder-gray-500"
              />
            </div>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger>
                <SelectValue placeholder="Statut" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les statuts</SelectItem>
                <SelectItem value="active">Actifs</SelectItem>
                <SelectItem value="suspended">Suspendus</SelectItem>
                <SelectItem value="delayed">En retard</SelectItem>
                <SelectItem value="full">Complets</SelectItem>
                <SelectItem value="cancelled">Annulés</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterPriority} onValueChange={setFilterPriority}>
              <SelectTrigger>
                <SelectValue placeholder="Priorité" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Toutes priorités</SelectItem>
                <SelectItem value="high">Haute</SelectItem>
                <SelectItem value="medium">Moyenne</SelectItem>
                <SelectItem value="low">Basse</SelectItem>
              </SelectContent>
            </Select>
            <Input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="bg-white border border-gray-300 text-gray-900"
            />
            <Button variant="outline" className="w-full">
              <Filter className="w-4 h-4 mr-2" />
              Plus de filtres
            </Button>
          </div>

          {/* Quick Filters */}
          <div className="flex flex-wrap gap-2 mb-6">
            <Button
              variant={quickFilters.delayed ? "default" : "outline"}
              size="sm"
              onClick={() => setQuickFilters(prev => ({ ...prev, delayed: !prev.delayed }))}
              style={quickFilters.delayed ? { backgroundColor: 'rgba(192, 54, 24, 0.9)' } : {}}
            >
              <AlertTriangle className="w-3 h-3 mr-1" />
              En retard ({schedules.filter(s => s.delayMinutes > 0).length})
            </Button>
            <Button
              variant={quickFilters.highOccupancy ? "default" : "outline"}
              size="sm"
              onClick={() => setQuickFilters(prev => ({ ...prev, highOccupancy: !prev.highOccupancy }))}
              style={quickFilters.highOccupancy ? { backgroundColor: 'rgba(192, 54, 24, 0.9)' } : {}}
            >
              <Users className="w-3 h-3 mr-1" />
              Forte occupation ({schedules.filter(s => (s.totalSeats - s.availableSeats) / s.totalSeats >= 0.8).length})
            </Button>
            <Button
              variant={quickFilters.needsAttention ? "default" : "outline"}
              size="sm"
              onClick={() => setQuickFilters(prev => ({ ...prev, needsAttention: !prev.needsAttention }))}
              style={quickFilters.needsAttention ? { backgroundColor: 'rgba(192, 54, 24, 0.9)' } : {}}
            >
              <Bell className="w-3 h-3 mr-1" />
              Attention requise ({schedules.filter(s => s.status === 'delayed' || s.status === 'suspended').length})
            </Button>
            <Button
              variant={quickFilters.todayOnly ? "default" : "outline"}
              size="sm"
              onClick={() => setQuickFilters(prev => ({ ...prev, todayOnly: !prev.todayOnly }))}
              style={quickFilters.todayOnly ? { backgroundColor: 'rgba(192, 54, 24, 0.9)' } : {}}
            >
              <Clock className="w-3 h-3 mr-1" />
              Aujourd'hui seulement
            </Button>
          </div>

          {/* Real-time Dashboard Stats */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{stats.total}</div>
              <div className="text-xs text-gray-600">Total horaires</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{stats.active}</div>
              <div className="text-xs text-gray-600">Actifs</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">{stats.delayed}</div>
              <div className="text-xs text-gray-600">En retard</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {(stats.totalRevenue / 1000000).toFixed(1)}M
              </div>
              <div className="text-xs text-gray-600">Revenus XAF</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600">
                {stats.occupancyRate.toFixed(0)}%
              </div>
              <div className="text-xs text-gray-600">Taux occupation</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Schedule Grid */}
      <div className="grid gap-4">
        <AnimatePresence>
          {filteredSchedules.map((schedule, index) => {
            const occupancyPercentage = getOccupancyPercentage(schedule.availableSeats, schedule.totalSeats);
            const isSelected = selectedSchedules.includes(schedule.id);

            return (
              <motion.div
                key={schedule.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className={`transition-all duration-200 ${
                  isSelected ? 'ring-2 ring-red-500 bg-red-50' : 'hover:shadow-md'
                }`}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      {/* Schedule Info */}
                      <div className="flex-1">
                        <div className="flex items-center space-x-4 mb-3">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => toggleScheduleSelection(schedule.id)}
                            className="w-4 h-4 text-red-600"
                          />
                          <div className="flex items-center space-x-2">
                            <MapPin className="w-4 h-4 text-gray-500" />
                            <span className="font-semibold text-lg">
                              {schedule.departure} → {schedule.arrival}
                            </span>
                          </div>
                          <Badge className={getStatusColor(schedule.status)}>
                            {getStatusLabel(schedule.status)}
                          </Badge>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <span className="text-gray-500">Départ:</span>
                            <div className="font-medium">{schedule.departureTime}</div>
                          </div>
                          <div>
                            <span className="text-gray-500">Arrivée:</span>
                            <div className="font-medium">{schedule.arrivalTime}</div>
                          </div>
                          <div>
                            <span className="text-gray-500">Bus:</span>
                            <div className="font-medium flex items-center">
                              <Bus className="w-3 h-3 mr-1" />
                              {schedule.bus}
                            </div>
                          </div>
                          <div>
                            <span className="text-gray-500">Prix:</span>
                            <div className="font-medium">{schedule.price.toLocaleString()} XAF</div>
                          </div>
                        </div>

                        <div className="mt-3 flex items-center justify-between">
                          <div className="flex flex-wrap gap-1">
                            {schedule.frequency.map((day) => (
                              <Badge key={day} variant="outline" className="text-xs">
                                {day.charAt(0).toUpperCase() + day.slice(1, 3)}
                              </Badge>
                            ))}
                          </div>
                          
                          <div className="flex items-center space-x-4">
                            <div className="text-right">
                              <div className={`text-sm font-medium ${getOccupancyColor(occupancyPercentage)}`}>
                                {schedule.availableSeats}/{schedule.totalSeats} places
                              </div>
                              <div className="text-xs text-gray-500">
                                {occupancyPercentage.toFixed(0)}% occupé
                              </div>
                            </div>
                            
                            <div className="w-16 bg-gray-200 rounded-full h-2">
                              <div
                                className={`h-2 rounded-full transition-all duration-300 ${
                                  occupancyPercentage >= 90 ? 'bg-red-500' :
                                  occupancyPercentage >= 70 ? 'bg-yellow-500' : 'bg-green-500'
                                }`}
                                style={{ width: `${occupancyPercentage}%` }}
                              />
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center space-x-2 ml-4">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => {
                            setEditingSchedule(schedule);
                            setShowCreateModal(true);
                          }}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => {
                            setSelectedSchedule(schedule);
                            setShowDetailsModal(true);
                          }}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => {
                            // API: duplicateSchedule()
                            const newSchedule = { 
                              ...schedule, 
                              id: Date.now().toString(),
                              createdAt: new Date().toISOString(),
                              updatedAt: new Date().toISOString()
                            };
                            setSchedules(prev => [...prev, newSchedule]);
                            toast.success('Horaire dupliqué');
                          }}
                        >
                          <Copy className="w-4 h-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => {
                            const newStatus = schedule.isEnabled ? false : true;
                            // API: toggleScheduleStatus()
                            setSchedules(prev => 
                              prev.map(s => 
                                s.id === schedule.id 
                                  ? { ...s, isEnabled: newStatus, status: newStatus ? 'active' : 'suspended' }
                                  : s
                              )
                            );
                            toast.success(`Horaire ${newStatus ? 'activé' : 'désactivé'}`);
                          }}
                        >
                          {schedule.isEnabled ? (
                            <PowerOff className="w-4 h-4 text-yellow-600" />
                          ) : (
                            <Power className="w-4 h-4 text-green-600" />
                          )}
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          className="text-red-500 hover:bg-red-50"
                          onClick={() => {
                            if (window.confirm('Êtes-vous sûr de vouloir supprimer cet horaire ?')) {
                              // API: deleteSchedule()
                              setSchedules(prev => prev.filter(s => s.id !== schedule.id));
                              toast.success('Horaire supprimé');
                            }
                          }}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </AnimatePresence>

        {filteredSchedules.length === 0 && (
          <Card>
            <CardContent className="text-center py-12">
              <Clock className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Aucun horaire trouvé
              </h3>
              <p className="text-gray-600">
                {searchTerm || filterStatus !== 'all'
                  ? 'Aucun horaire ne correspond à vos critères.'
                  : 'Aucun horaire configuré pour cette période.'}
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Bulk Edit Modal */}
      <Dialog open={showBulkEdit} onOpenChange={setShowBulkEdit}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Modification en lot</DialogTitle>
            <DialogDescription>
              Modifiez le statut de {selectedSchedules.length} horaire(s) sélectionné(s)
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-3">
              <Label>Nouveau statut</Label>
              <div className="grid grid-cols-3 gap-3">
                <Button
                  variant="outline"
                  onClick={() => handleBulkStatusUpdate('active')}
                  className="h-16 flex-col space-y-2"
                >
                  <CheckCircle className="w-6 h-6 text-green-600" />
                  <span>Actif</span>
                </Button>
                <Button
                  variant="outline"
                  onClick={() => handleBulkStatusUpdate('suspended')}
                  className="h-16 flex-col space-y-2"
                >
                  <AlertCircle className="w-6 h-6 text-yellow-600" />
                  <span>Suspendu</span>
                </Button>
                <Button
                  variant="outline"
                  onClick={() => handleBulkStatusUpdate('full')}
                  className="h-16 flex-col space-y-2"
                >
                  <Users className="w-6 h-6 text-red-600" />
                  <span>Complet</span>
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Create/Edit Schedule Modal */}
      <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingSchedule ? 'Modifier l\'horaire' : 'Créer un nouvel horaire'}
            </DialogTitle>
            <DialogDescription>
              {editingSchedule ? 'Modifiez les détails de cet horaire' : 'Configurez un nouvel horaire pour vos trajets'}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={async (e) => {
            e.preventDefault();
            setIsSubmitting(true);
            
            try {
              const formData = new FormData(e.currentTarget);
              const scheduleData = {
                departure: formData.get('departure') as string,
                arrival: formData.get('arrival') as string,
                departureTime: formData.get('departureTime') as string,
                arrivalTime: formData.get('arrivalTime') as string,
                bus: formData.get('bus') as string,
                price: parseInt(formData.get('price') as string),
                totalSeats: parseInt(formData.get('totalSeats') as string),
                frequency: Array.from(formData.getAll('frequency')) as string[],
                priority: formData.get('priority') as Schedule['priority'],
                repeatPattern: formData.get('repeatPattern') as Schedule['repeatPattern'],
                validFrom: formData.get('validFrom') as string,
                validTo: formData.get('validTo') as string,
                notes: formData.get('notes') as string,
                weatherDependent: formData.get('weatherDependent') === 'on',
                driver: formData.get('driver') as string
              };

              // Validation
              if (!scheduleData.departure || !scheduleData.arrival) {
                throw new Error('Départ et arrivée sont obligatoires');
              }
              if (!scheduleData.departureTime || !scheduleData.arrivalTime) {
                throw new Error('Heures de départ et d\'arrivée sont obligatoires');
              }
              if (scheduleData.frequency.length === 0) {
                throw new Error('Au moins un jour de fréquence est requis');
              }

              // API: createSchedule() or updateSchedule()
              await new Promise(resolve => setTimeout(resolve, 1000));

              if (editingSchedule) {
                setSchedules(prev => prev.map(s => 
                  s.id === editingSchedule.id 
                    ? { 
                        ...s, 
                        ...scheduleData,
                        updatedAt: new Date().toISOString(),
                        lastModifiedBy: 'Admin',
                        availableSeats: scheduleData.totalSeats,
                        estimatedRevenue: scheduleData.totalSeats * scheduleData.price * 0.7
                      }
                    : s
                ));
                toast.success('Horaire mis à jour avec succès');
              } else {
                const newSchedule: Schedule = {
                  id: Date.now().toString(),
                  tripId: `trip-${Date.now()}`,
                  ...scheduleData,
                  status: 'active',
                  isEnabled: true,
                  availableSeats: scheduleData.totalSeats,
                  createdAt: new Date().toISOString(),
                  updatedAt: new Date().toISOString(),
                  delayMinutes: 0,
                  estimatedRevenue: scheduleData.totalSeats * scheduleData.price * 0.7,
                  currentBookings: 0,
                  lastModifiedBy: 'Admin'
                };
                setSchedules(prev => [...prev, newSchedule]);
                toast.success('Nouvel horaire créé avec succès');
              }

              setShowCreateModal(false);
              setEditingSchedule(null);
            } catch (error: any) {
              toast.error(error.message || 'Erreur lors de la sauvegarde');
            } finally {
              setIsSubmitting(false);
            }
          }}>
            <div className="space-y-6 py-4">
              {/* Basic Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="departure">Ville de départ *</Label>
                  <Select name="departure" defaultValue={editingSchedule?.departure}>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner le départ" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Libreville">Libreville</SelectItem>
                      <SelectItem value="Port-Gentil">Port-Gentil</SelectItem>
                      <SelectItem value="Franceville">Franceville</SelectItem>
                      <SelectItem value="Oyem">Oyem</SelectItem>
                      <SelectItem value="Lambaréné">Lambaréné</SelectItem>
                      <SelectItem value="Mouila">Mouila</SelectItem>
                      <SelectItem value="Tchibanga">Tchibanga</SelectItem>
                      <SelectItem value="Koulamoutou">Koulamoutou</SelectItem>
                      <SelectItem value="Makokou">Makokou</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="arrival">Ville d'arrivée *</Label>
                  <Select name="arrival" defaultValue={editingSchedule?.arrival}>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner l'arrivée" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Libreville">Libreville</SelectItem>
                      <SelectItem value="Port-Gentil">Port-Gentil</SelectItem>
                      <SelectItem value="Franceville">Franceville</SelectItem>
                      <SelectItem value="Oyem">Oyem</SelectItem>
                      <SelectItem value="Lambaréné">Lambaréné</SelectItem>
                      <SelectItem value="Mouila">Mouila</SelectItem>
                      <SelectItem value="Tchibanga">Tchibanga</SelectItem>
                      <SelectItem value="Koulamoutou">Koulamoutou</SelectItem>
                      <SelectItem value="Makokou">Makokou</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Time and Vehicle */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <Label htmlFor="departureTime">Heure départ *</Label>
                  <Input
                    name="departureTime"
                    type="time"
                    defaultValue={editingSchedule?.departureTime}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="arrivalTime">Heure arrivée *</Label>
                  <Input
                    name="arrivalTime"
                    type="time"
                    defaultValue={editingSchedule?.arrivalTime}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="bus">Bus assigné *</Label>
                  <Select name="bus" defaultValue={editingSchedule?.bus}>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner un bus" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="KC-001">KC-001 (50 places)</SelectItem>
                      <SelectItem value="KC-002">KC-002 (50 places)</SelectItem>
                      <SelectItem value="KC-003">KC-003 (45 places)</SelectItem>
                      <SelectItem value="KC-004">KC-004 (55 places)</SelectItem>
                      <SelectItem value="KC-005">KC-005 (50 places)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="driver">Chauffeur</Label>
                  <Input
                    name="driver"
                    placeholder="Nom du chauffeur"
                    defaultValue={editingSchedule?.driver}
                  />
                </div>
              </div>

              {/* Pricing and Capacity */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="price">Prix (XAF) *</Label>
                  <Input
                    name="price"
                    type="number"
                    min="0"
                    step="1000"
                    placeholder="25000"
                    defaultValue={editingSchedule?.price}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="totalSeats">Nombre total de places *</Label>
                  <Input
                    name="totalSeats"
                    type="number"
                    min="1"
                    max="60"
                    placeholder="50"
                    defaultValue={editingSchedule?.totalSeats}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="priority">Priorité</Label>
                  <Select name="priority" defaultValue={editingSchedule?.priority || 'medium'}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Basse</SelectItem>
                      <SelectItem value="medium">Moyenne</SelectItem>
                      <SelectItem value="high">Haute</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Schedule Pattern */}
              <div>
                <Label>Fréquence (jours de la semaine) *</Label>
                <div className="grid grid-cols-4 md:grid-cols-7 gap-2 mt-2">
                  {daysOfWeek.map((day) => (
                    <label key={day} className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        name="frequency"
                        value={day}
                        defaultChecked={editingSchedule?.frequency.includes(day)}
                        className="w-4 h-4 text-red-600"
                      />
                      <span className="text-sm">{day.charAt(0).toUpperCase() + day.slice(1, 3)}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Advanced Settings */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="repeatPattern">Type de répétition</Label>
                  <Select name="repeatPattern" defaultValue={editingSchedule?.repeatPattern || 'weekly'}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="daily">Quotidien</SelectItem>
                      <SelectItem value="weekly">Hebdomadaire</SelectItem>
                      <SelectItem value="custom">Personnalisé</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center space-x-2 pt-6">
                  <input
                    type="checkbox"
                    name="weatherDependent"
                    defaultChecked={editingSchedule?.weatherDependent}
                    className="w-4 h-4 text-red-600"
                  />
                  <Label>Dépendant de la météo</Label>
                </div>
              </div>

              {/* Validity Period */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="validFrom">Valide du *</Label>
                  <Input
                    name="validFrom"
                    type="date"
                    defaultValue={editingSchedule?.validFrom}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="validTo">Valide jusqu'au *</Label>
                  <Input
                    name="validTo"
                    type="date"
                    defaultValue={editingSchedule?.validTo}
                    required
                  />
                </div>
              </div>

              {/* Notes */}
              <div>
                <Label htmlFor="notes">Notes et commentaires</Label>
                <textarea
                  name="notes"
                  className="w-full h-20 px-3 py-2 border border-gray-300 rounded-md"
                  placeholder="Informations additionnelles..."
                  defaultValue={editingSchedule?.notes}
                />
              </div>
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <Button type="button" variant="outline" onClick={() => {
                setShowCreateModal(false);
                setEditingSchedule(null);
              }}>
                Annuler
              </Button>
              <Button 
                type="submit" 
                disabled={isSubmitting}
                style={{ backgroundColor: 'rgba(192, 54, 24, 0.9)' }}
                className="text-white hover:bg-opacity-80"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Sauvegarde...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    {editingSchedule ? 'Mettre à jour' : 'Créer l\'horaire'}
                  </>
                )}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Schedule Details Modal */}
      <Dialog open={showDetailsModal} onOpenChange={setShowDetailsModal}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Détails de l'horaire</DialogTitle>
            <DialogDescription>
              Informations complètes et suivi en temps réel
            </DialogDescription>
          </DialogHeader>

          {selectedSchedule && (
            <div className="space-y-6 py-4">
              {/* Header with Status */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">
                    {selectedSchedule.departure} → {selectedSchedule.arrival}
                  </h3>
                  <div className="flex space-x-2">
                    <Badge className={getStatusColor(selectedSchedule.status)}>
                      {getStatusLabel(selectedSchedule.status)}
                    </Badge>
                    <Badge className={`${getPriorityColor(selectedSchedule.priority)} border`}>
                      Priorité {selectedSchedule.priority}
                    </Badge>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">Horaire:</span>
                    <div className="font-medium">{selectedSchedule.departureTime} - {selectedSchedule.arrivalTime}</div>
                  </div>
                  <div>
                    <span className="text-gray-500">Bus:</span>
                    <div className="font-medium">{selectedSchedule.bus}</div>
                  </div>
                  <div>
                    <span className="text-gray-500">Chauffeur:</span>
                    <div className="font-medium">{selectedSchedule.driver || 'Non assigné'}</div>
                  </div>
                  <div>
                    <span className="text-gray-500">Prix:</span>
                    <div className="font-medium">{selectedSchedule.price.toLocaleString()} XAF</div>
                  </div>
                </div>
              </div>

              {/* Real-time Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardContent className="p-4 text-center">
                    <div className={`text-2xl font-bold ${getOccupancyColor(getOccupancyPercentage(selectedSchedule.availableSeats, selectedSchedule.totalSeats))}`}>
                      {selectedSchedule.currentBookings}/{selectedSchedule.totalSeats}
                    </div>
                    <div className="text-sm text-gray-600">Places réservées</div>
                    <div className="text-xs text-gray-500">
                      {getOccupancyPercentage(selectedSchedule.availableSeats, selectedSchedule.totalSeats).toFixed(0)}% d'occupation
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-green-600">
                      {(selectedSchedule.estimatedRevenue / 1000).toFixed(0)}K
                    </div>
                    <div className="text-sm text-gray-600">Revenus estimés</div>
                    <div className="text-xs text-gray-500">XAF</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <div className={`text-2xl font-bold ${selectedSchedule.delayMinutes > 0 ? 'text-red-600' : 'text-green-600'}`}>
                      {selectedSchedule.delayMinutes > 0 ? `+${selectedSchedule.delayMinutes}` : '0'}
                    </div>
                    <div className="text-sm text-gray-600">Minutes de retard</div>
                    <div className="text-xs text-gray-500">
                      {selectedSchedule.delayMinutes > 0 ? 'En retard' : 'À l\'heure'}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Schedule Pattern */}
              <div>
                <h4 className="font-medium mb-3">Fréquence et récurrence</h4>
                <div className="bg-white border rounded-lg p-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500">Jours de service:</span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {selectedSchedule.frequency.map((day) => (
                          <Badge key={day} variant="outline" className="text-xs">
                            {day.charAt(0).toUpperCase() + day.slice(1)}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div>
                      <span className="text-gray-500">Période de validité:</span>
                      <div className="font-medium">
                        Du {new Date(selectedSchedule.validFrom).toLocaleDateString('fr-FR')} 
                        au {new Date(selectedSchedule.validTo).toLocaleDateString('fr-FR')}
                      </div>
                    </div>
                    <div>
                      <span className="text-gray-500">Type de répétition:</span>
                      <div className="font-medium capitalize">{selectedSchedule.repeatPattern}</div>
                    </div>
                    <div>
                      <span className="text-gray-500">Dépendant météo:</span>
                      <div className="font-medium">
                        {selectedSchedule.weatherDependent ? 'Oui' : 'Non'}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Additional Info */}
              {selectedSchedule.notes && (
                <div>
                  <h4 className="font-medium mb-3">Notes et commentaires</h4>
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <p className="text-sm">{selectedSchedule.notes}</p>
                  </div>
                </div>
              )}

              {/* Maintenance Window */}
              {selectedSchedule.maintenanceWindow && (
                <div>
                  <h4 className="font-medium mb-3">Fenêtre de maintenance</h4>
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <p className="text-sm">{selectedSchedule.maintenanceWindow}</p>
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex justify-end space-x-3 pt-4">
                <Button 
                  variant="outline"
                  onClick={() => {
                    setEditingSchedule(selectedSchedule);
                    setShowDetailsModal(false);
                    setShowCreateModal(true);
                  }}
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Modifier
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => {
                    // API: generateScheduleReport()
                    toast.success('Rapport généré');
                  }}
                >
                  <Download className="w-4 h-4 mr-2" />
                  Rapport
                </Button>
                <Button 
                  style={{ backgroundColor: 'rgba(192, 54, 24, 0.9)' }}
                  className="text-white hover:bg-opacity-80"
                  onClick={() => {
                    // API: sendScheduleNotification()
                    toast.success('Notification envoyée aux passagers');
                  }}
                >
                  <Bell className="w-4 h-4 mr-2" />
                  Notifier passagers
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};