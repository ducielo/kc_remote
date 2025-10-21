import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Home,
  Bus,
  Clock,
  Ticket,
  RefreshCw,
  FileText,
  BarChart3,
  Settings,
  LogOut,
  Plus,
  Edit,
  Trash2,
  X,
  Users,
  MapPin,
  DollarSign,
  TrendingUp,
  Calendar,
  Eye,
  CheckCircle,
  XCircle,
  AlertCircle,
  Upload,
  Search,
  Filter,
  Download,
  Bell,
  CreditCard,
  Save,
  Loader2,
  Check,
  AlertTriangle,
  MessageSquare,
  Monitor,
  Globe,
  UploadCloud,
  FileImage,
  Star,
  Clock3,
  Phone,
  Mail,
  Lock,
  Menu,
  Navigation,
  Route,
  ShieldCheck,
  Activity,
  UserCheck,
  Building,
  Plane
} from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Switch } from './ui/switch';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { toast } from 'sonner';
import { useAdminContent } from './contexts/AdminContentProvider';
import { useOperationalData } from './contexts/OperationalDataContext';
import { usePublicData } from './contexts/PublicDataContext';
import { TripManagementTab } from './admin/TripManagementTab';
import { ScheduleManagementTab } from './admin/ScheduleManagementTab';
import { TicketManagementTab } from './admin/TicketManagementTab';
import { PaymentManagement } from '../back-office/components/management/PaymentManagement';
import { DisputeManagement } from '../back-office/components/management/DisputeManagement';
import { PassengerManagement } from '../back-office/components/management/PassengerManagement';
import { AccessControlManagement } from '../back-office/components/management/AccessControlManagement';

interface AdminDashboardTabbedProps {
  onLogout: () => void;
}

export const AdminDashboardTabbed: React.FC<AdminDashboardTabbedProps> = ({ onLogout }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedMainTab, setSelectedMainTab] = useState('trajets');
  
  const { adminContent, updateContent } = useAdminContent();
  const { trips, buses, drivers, getTripsByRoute, updateTripStatus } = useOperationalData();
  const { syncWithAdmin } = usePublicData();

  const [isLoading, setIsLoading] = useState(false);

  // Statistiques en temps réel
  const stats = {
    totalTrips: trips.length,
    activeTrips: trips.filter(t => t.status === 'active').length,
    totalRevenue: trips.reduce((sum, trip) => sum + (trip.price * trip.occupiedSeats), 0),
    occupancyRate: Math.round((trips.reduce((sum, trip) => sum + trip.occupiedSeats, 0) / trips.reduce((sum, trip) => sum + trip.capacity, 0)) * 100) || 0
  };

  // Navigation latérale
  const sidebarItems = [
    { id: 'overview', label: 'Vue d\'ensemble', icon: Home },
    { id: 'content', label: 'Contenu du site', icon: Globe },
    { id: 'payments', label: 'Paiements & Remboursements', icon: CreditCard },
    { id: 'disputes', label: 'Litiges & Résolutions', icon: AlertTriangle },
    { id: 'passengers', label: 'Gestion Voyageurs', icon: Users },
    { id: 'access-control', label: 'Contrôle d\'Accès', icon: ShieldCheck },
    { id: 'reports', label: 'Rapports', icon: BarChart3 },
    { id: 'settings', label: 'Paramètres', icon: Settings }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-40">
        <div className="px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Bus className="h-8 w-8" style={{ color: '#C03618' }} />
                <h1 className="text-2xl font-bold text-gray-900">Karis Continental Admin</h1>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                <Activity className="h-3 w-3 mr-1" />
                Système actif
              </Badge>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  syncWithAdmin();
                  toast.success('Données synchronisées');
                }}
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Synchroniser
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={onLogout}
              >
                <LogOut className="h-4 w-4 mr-2" />
                Déconnexion
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex h-screen">
        {/* Sidebar */}
        <aside className="w-72 bg-white shadow-sm border-r">
          <div className="p-8">
            <nav className="space-y-4">
              {sidebarItems.map((item) => (
                <Button
                  key={item.id}
                  variant={activeTab === item.id ? "default" : "ghost"}
                  className={`w-full justify-start ${
                    activeTab === item.id 
                      ? 'bg-red-50 text-red-700 border-red-200' 
                      : 'hover:bg-gray-50'
                  }`}
                  onClick={() => setActiveTab(item.id)}
                >
                  <item.icon className="h-4 w-4 mr-3" />
                  {item.label}
                </Button>
              ))}
            </nav>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-auto">
          <div className="p-8">
            {activeTab === 'overview' && (
              <div className="space-y-8">
                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Trajets Totaux</CardTitle>
                      <Bus className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{stats.totalTrips}</div>
                      <p className="text-xs text-muted-foreground">
                        {stats.activeTrips} actifs
                      </p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Revenus</CardTitle>
                      <DollarSign className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{stats.totalRevenue.toLocaleString()} FCFA</div>
                      <p className="text-xs text-muted-foreground">
                        Ce mois
                      </p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Taux d'occupation</CardTitle>
                      <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{stats.occupancyRate}%</div>
                      <p className="text-xs text-muted-foreground">
                        Moyenne générale
                      </p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Bus Actifs</CardTitle>
                      <CheckCircle className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{buses.filter(b => b.status === 'active').length}</div>
                      <p className="text-xs text-muted-foreground">
                        Sur {buses.length} total
                      </p>
                    </CardContent>
                  </Card>
                </div>

                {/* Onglets principaux pour Trajets, Horaires, Billets */}
                <Card>
                  <CardHeader className="pb-6">
                    <CardTitle className="text-xl">Gestion Opérationnelle</CardTitle>
                    <CardDescription className="text-base">
                      Gérez vos trajets, horaires et billets depuis cette interface centralisée
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <Tabs value={selectedMainTab} onValueChange={setSelectedMainTab}>
                      <TabsList className="grid w-full grid-cols-3">
                        <TabsTrigger value="trajets" className="flex items-center gap-2">
                          <Route className="h-4 w-4" />
                          Trajets
                        </TabsTrigger>
                        <TabsTrigger value="horaires" className="flex items-center gap-2">
                          <Clock className="h-4 w-4" />
                          Horaires
                        </TabsTrigger>
                        <TabsTrigger value="billets" className="flex items-center gap-2">
                          <Ticket className="h-4 w-4" />
                          Billets
                        </TabsTrigger>
                      </TabsList>

                      {/* ONGLET TRAJETS */}
                      <TabsContent value="trajets">
                        <TripManagementTab />
                      </TabsContent>

                      {/* ONGLET HORAIRES */}
                      <TabsContent value="horaires">
                        <ScheduleManagementTab />
                      </TabsContent>

                      {/* ONGLET BILLETS */}
                      <TabsContent value="billets">
                        <TicketManagementTab />
                      </TabsContent>
                    </Tabs>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Autres onglets existants */}
            {activeTab === 'content' && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold">Gestion du contenu</h2>
                <p className="text-gray-600">Interface pour gérer le contenu affiché sur le site public</p>
              </div>
            )}

            {/* PAIEMENTS & REMBOURSEMENTS */}
            {activeTab === 'payments' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">Paiements & Remboursements</h2>
                    <p className="text-gray-600 mt-1">
                      Gestion complète des paiements effectués par les voyageurs et traitement des remboursements
                    </p>
                  </div>
                  <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                    <CreditCard className="h-3 w-3 mr-1" />
                    Système de paiement
                  </Badge>
                </div>
                <PaymentManagement />
              </div>
            )}

            {/* LITIGES & RÉSOLUTIONS */}
            {activeTab === 'disputes' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">Litiges & Résolutions</h2>
                    <p className="text-gray-600 mt-1">
                      Résolution des problèmes, réclamations et processus de remboursement au bénéfice des voyageurs
                    </p>
                  </div>
                  <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">
                    <AlertTriangle className="h-3 w-3 mr-1" />
                    Support client
                  </Badge>
                </div>
                <DisputeManagement />
              </div>
            )}

            {/* GESTION VOYAGEURS */}
            {activeTab === 'passengers' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">Gestion des Voyageurs</h2>
                    <p className="text-gray-600 mt-1">
                      Ajouts, suppressions et modifications des voyageurs dans les trajets en cours ou à venir
                    </p>
                  </div>
                  <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                    <Users className="h-3 w-3 mr-1" />
                    Gestion passagers
                  </Badge>
                </div>
                <PassengerManagement />
              </div>
            )}

            {/* CONTRÔLE D'ACCÈS */}
            {activeTab === 'access-control' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">Contrôle d'Accès</h2>
                    <p className="text-gray-600 mt-1">
                      Blocage, gestion des permissions et contrôle de connexion des agents et chauffeurs
                    </p>
                  </div>
                  <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                    <ShieldCheck className="h-3 w-3 mr-1" />
                    Sécurité & permissions
                  </Badge>
                </div>
                <AccessControlManagement />
              </div>
            )}

            {activeTab === 'reports' && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold">Rapports et analyses</h2>
                <p className="text-gray-600">Tableaux de bord et statistiques détaillées</p>
              </div>
            )}

            {activeTab === 'settings' && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold">Paramètres système</h2>
                <p className="text-gray-600">Configuration générale de l'application</p>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};