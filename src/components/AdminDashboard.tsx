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
  Image as ImageIcon,
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
  Database,
  PieChart,
  BarChart2,
  LineChart,
  Package,
  Zap,
  Shield,
  Truck,
  UserCheck,
  FileCheck,
  Target,
  Briefcase,
  HelpCircle,
  Info,
  ExternalLink,
  Copy,
  RefreshCcw,
  Power,
  Wifi,
  Signal,
  Battery,
  Network,
  CloudUpload,
  Layers,
  BookOpen,
  Bookmark,
  Flag,
  Hash,
  Link,
  Tag,
  Award,
  Gem,
  Crown,
  Zap as Lightning
} from 'lucide-react';
import { useAuth } from './AuthContext';
import { useAdminContent } from './contexts/AdminContentProvider';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Switch } from './ui/switch';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from './ui/alert-dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Progress } from './ui/progress';
import { Calendar as CalendarComponent } from './ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { Checkbox } from './ui/checkbox';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { BackOfficeIntegration } from './BackOfficeIntegration';
import { BackOfficeTestPanel } from './BackOfficeTestPanel';
import { useBackOffice } from './hooks/useBackOffice';

interface AdminDashboardProps {
  onClose: () => void;
}

type ActiveSection = 'dashboard' | 'routes' | 'schedules' | 'tickets' | 'refunds' | 'content' | 'stats' | 'settings' | 'users' | 'analytics';

interface Route {
  id: string;
  departure: string;
  arrival: string;
  distance: number;
  duration: string;
  status: 'active' | 'inactive' | 'maintenance';
  price: number;
  description: string;
  createdAt: string;
  updatedAt: string;
}

interface Schedule {
  id: string;
  routeId: string;
  route: string;
  departureTime: string;
  arrivalTime: string;
  frequency: string[];
  validFrom: string;
  validTo: string;
  busType: string;
  totalSeats: number;
  availableSeats: number;
  price: number;
  status: 'active' | 'suspended' | 'delayed';
  driverId: string;
  driverName: string;
  amenities: string[];
}

interface Ticket {
  id: string;
  ticketNumber: string;
  passengerName: string;
  passengerEmail: string;
  passengerPhone: string;
  route: string;
  departure: string;
  arrival: string;
  departureDate: string;
  departureTime: string;
  seatNumber: string;
  price: number;
  status: 'confirmed' | 'pending' | 'cancelled' | 'used';
  paymentStatus: 'paid' | 'pending' | 'refunded';
  bookingDate: string;
  busType: string;
  specialRequests: string;
}

interface ContentItem {
  id: string;
  type: 'announcement' | 'promotion' | 'news' | 'service_update';
  title: string;
  content: string;
  imageUrl?: string;
  status: 'published' | 'draft' | 'archived';
  publishDate: string;
  expiryDate?: string;
  priority: 'low' | 'medium' | 'high';
  targetAudience: 'all' | 'customers' | 'agents' | 'drivers';
  views: number;
  clicks: number;
}

interface SystemUser {
  id: string;
  username: string;
  email: string;
  role: 'admin' | 'agent' | 'driver';
  fullName: string;
  phone: string;
  status: 'active' | 'suspended' | 'pending';
  lastLogin: string;
  createdAt: string;
  permissions: string[];
  assignedRoutes?: string[];
  totalTrips?: number;
  rating?: number;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onClose }) => {
  const { logout } = useAuth();
  const [activeSection, setActiveSection] = useState<ActiveSection>('dashboard');
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  
  // Hook pour le back-office
  const backOffice = useBackOffice({ role: 'admin', userId: 'admin001' });

  // États pour les données
  const [routes, setRoutes] = useState<Route[]>([]);
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [contentItems, setContentItems] = useState<ContentItem[]>([]);
  const [users, setUsers] = useState<SystemUser[]>([]);

  // États pour les modales
  const [showRouteModal, setShowRouteModal] = useState(false);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [showTicketModal, setShowTicketModal] = useState(false);
  const [showContentModal, setShowContentModal] = useState(false);
  const [showUserModal, setShowUserModal] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);

  // États pour les statistiques
  const [dashboardStats, setDashboardStats] = useState({
    totalRoutes: 0,
    activeSchedules: 0,
    todayTickets: 0,
    revenue: 0,
    activeUsers: 0,
    systemHealth: 98,
    pendingRefunds: 0,
    newBookings: 0
  });

  // Données mockées pour l'initialisation
  useEffect(() => {
    loadMockData();
  }, []);

  const loadMockData = () => {
    // Routes mockées
    const mockRoutes: Route[] = [
      {
        id: '1',
        departure: 'Libreville',
        arrival: 'Port-Gentil',
        distance: 250,
        duration: '6h 30min',
        status: 'active',
        price: 25000,
        description: 'Route principale vers Port-Gentil',
        createdAt: '2025-01-01',
        updatedAt: '2025-01-15'
      },
      {
        id: '2',
        departure: 'Libreville',
        arrival: 'Franceville',
        distance: 420,
        duration: '8h 45min',
        status: 'active',
        price: 35000,
        description: 'Route vers le Sud-Est',
        createdAt: '2025-01-01',
        updatedAt: '2025-01-10'
      },
      {
        id: '3',
        departure: 'Libreville',
        arrival: 'Oyem',
        distance: 320,
        duration: '5h 15min',
        status: 'active',
        price: 22000,
        description: 'Route vers le Nord',
        createdAt: '2025-01-01',
        updatedAt: '2025-01-12'
      }
    ];

    // Horaires mockés
    const mockSchedules: Schedule[] = [
      {
        id: '1',
        routeId: '1',
        route: 'Libreville → Port-Gentil',
        departureTime: '08:00',
        arrivalTime: '14:30',
        frequency: ['Lundi', 'Mercredi', 'Vendredi'],
        validFrom: '2025-01-01',
        validTo: '2025-12-31',
        busType: 'Bus Premium',
        totalSeats: 45,
        availableSeats: 12,
        price: 25000,
        status: 'active',
        driverId: 'D001',
        driverName: 'Jean Baptiste',
        amenities: ['WiFi gratuit', 'Collations', 'Prises électriques', 'Assurance']
      },
      {
        id: '2',
        routeId: '1',
        route: 'Libreville → Port-Gentil',
        departureTime: '14:00',
        arrivalTime: '20:30',
        frequency: ['Mardi', 'Jeudi', 'Samedi'],
        validFrom: '2025-01-01',
        validTo: '2025-12-31',
        busType: 'Bus Standard',
        totalSeats: 50,
        availableSeats: 8,
        price: 22000,
        status: 'active',
        driverId: 'D002',
        driverName: 'Marie Ngomo',
        amenities: ['WiFi gratuit', 'Assurance']
      }
    ];

    // Billets mockés
    const mockTickets: Ticket[] = [
      {
        id: '1',
        ticketNumber: 'KC2025001',
        passengerName: 'Alain Mbang',
        passengerEmail: 'alain.mbang@email.com',
        passengerPhone: '+241 06 12 34 56',
        route: 'Libreville → Port-Gentil',
        departure: 'Libreville',
        arrival: 'Port-Gentil',
        departureDate: '15/01/2025',
        departureTime: '08:00',
        seatNumber: 'A12',
        price: 25000,
        status: 'confirmed',
        paymentStatus: 'paid',
        bookingDate: '10/01/2025',
        busType: 'Bus Premium',
        specialRequests: 'Siège côté fenêtre'
      },
      {
        id: '2',
        ticketNumber: 'KC2025002',
        passengerName: 'Sylvie Obame',
        passengerEmail: 'sylvie.obame@email.com',
        passengerPhone: '+241 07 98 76 54',
        route: 'Libreville → Franceville',
        departure: 'Libreville',
        arrival: 'Franceville',
        departureDate: '16/01/2025',
        departureTime: '06:00',
        seatNumber: 'B08',
        price: 35000,
        status: 'pending',
        paymentStatus: 'pending',
        bookingDate: '12/01/2025',
        busType: 'Bus VIP',
        specialRequests: 'Repas végétarien'
      }
    ];

    // Contenu mocké
    const mockContent: ContentItem[] = [
      {
        id: '1',
        type: 'announcement',
        title: 'Nouvelle route vers Lambaréné',
        content: 'Nous sommes heureux d\'annoncer l\'ouverture de notre nouvelle ligne vers Lambaréné avec des départs quotidiens.',
        status: 'published',
        publishDate: '2025-01-10',
        priority: 'high',
        targetAudience: 'all',
        views: 1250,
        clicks: 89
      },
      {
        id: '2',
        type: 'promotion',
        title: 'Promo étudiant -20%',
        content: 'Profitez de 20% de réduction sur tous nos trajets avec votre carte étudiant valide.',
        status: 'published',
        publishDate: '2025-01-05',
        expiryDate: '2025-02-28',
        priority: 'medium',
        targetAudience: 'customers',
        views: 2100,
        clicks: 156
      }
    ];

    // Utilisateurs mockés
    const mockUsers: SystemUser[] = [
      {
        id: '1',
        username: 'admin001',
        email: 'admin@kariscontinental.ga',
        role: 'admin',
        fullName: 'Pierre Mendame',
        phone: '+241 06 11 22 33',
        status: 'active',
        lastLogin: '2025-01-15 14:30',
        createdAt: '2024-12-01',
        permissions: ['full_access']
      },
      {
        id: '2',
        username: 'agent001',
        email: 'agent1@kariscontinental.ga',
        role: 'agent',
        fullName: 'Grace Nzigou',
        phone: '+241 07 44 55 66',
        status: 'active',
        lastLogin: '2025-01-15 16:45',
        createdAt: '2025-01-02',
        permissions: ['ticket_management', 'customer_support'],
        totalTrips: 145
      },
      {
        id: '3',
        username: 'driver001',
        email: 'driver1@kariscontinental.ga',
        role: 'driver',
        fullName: 'Marc Ondo',
        phone: '+241 06 77 88 99',
        status: 'active',
        lastLogin: '2025-01-15 18:20',
        createdAt: '2025-01-03',
        permissions: ['trip_management'],
        assignedRoutes: ['Libreville → Port-Gentil', 'Port-Gentil → Libreville'],
        totalTrips: 89,
        rating: 4.8
      }
    ];

    setRoutes(mockRoutes);
    setSchedules(mockSchedules);
    setTickets(mockTickets);
    setContentItems(mockContent);
    setUsers(mockUsers);

    // Statistiques
    setDashboardStats({
      totalRoutes: mockRoutes.length,
      activeSchedules: mockSchedules.filter(s => s.status === 'active').length,
      todayTickets: mockTickets.filter(t => t.departureDate === '15/01/2025').length,
      revenue: mockTickets.reduce((sum, t) => sum + (t.paymentStatus === 'paid' ? t.price : 0), 0),
      activeUsers: mockUsers.filter(u => u.status === 'active').length,
      systemHealth: 98,
      pendingRefunds: 3,
      newBookings: mockTickets.filter(t => t.status === 'pending').length
    });
  };

  const handleLogout = () => {
    logout();
    onClose();
    toast.success('Déconnexion réussie');
  };

  const menuItems = [
    { id: 'dashboard', label: 'Tableau de bord', icon: Home },
    { id: 'routes', label: 'Trajets', icon: Route },
    { id: 'schedules', label: 'Horaires', icon: Clock },
    { id: 'tickets', label: 'Billets', icon: Ticket },
    { id: 'refunds', label: 'Remboursements', icon: RefreshCw },
    { id: 'content', label: 'Contenu', icon: FileText },
    { id: 'stats', label: 'Statistiques', icon: BarChart3 },
    { id: 'users', label: 'Utilisateurs', icon: Users },
    { id: 'analytics', label: 'Analyses', icon: PieChart },
    { id: 'backoffice', label: 'Back-Office', icon: Database },
    { id: 'settings', label: 'Paramètres', icon: Settings }
  ];

  const renderDashboard = () => (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Tableau de bord</h1>
          <p className="text-gray-600">Vue d'ensemble du système Karis Continental</p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="secondary" className="bg-green-100 text-green-800">
            <Activity className="w-3 h-3 mr-1" />
            Système opérationnel
          </Badge>
        </div>
      </div>

      {/* Statistiques principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Trajets</p>
                <p className="text-2xl font-bold text-gray-900">{dashboardStats.totalRoutes}</p>
              </div>
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <Route className="w-4 h-4 text-blue-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
              <span className="text-green-600">+2 ce mois</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Horaires Actifs</p>
                <p className="text-2xl font-bold text-gray-900">{dashboardStats.activeSchedules}</p>
              </div>
              <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                <Clock className="w-4 h-4 text-green-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <CheckCircle className="w-4 h-4 text-green-500 mr-1" />
              <span className="text-green-600">Tous fonctionnels</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Billets Aujourd'hui</p>
                <p className="text-2xl font-bold text-gray-900">{dashboardStats.todayTickets}</p>
              </div>
              <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                <Ticket className="w-4 h-4 text-purple-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
              <span className="text-green-600">+8% vs hier</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Revenus</p>
                <p className="text-2xl font-bold text-gray-900">{dashboardStats.revenue.toLocaleString()} XAF</p>
              </div>
              <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center">
                <DollarSign className="w-4 h-4 text-yellow-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
              <span className="text-green-600">+15% ce mois</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Activité récente et alertes */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Activity className="w-5 h-5 mr-2" />
              Activité Récente
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Nouveau billet vendu</p>
                  <p className="text-xs text-gray-500">KC2025003 - il y a 5 min</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Horaire mis à jour</p>
                  <p className="text-xs text-gray-500">Libreville → Oyem - il y a 12 min</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Demande de remboursement</p>
                  <p className="text-xs text-gray-500">Ticket KC2025001 - il y a 25 min</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <AlertTriangle className="w-5 h-5 mr-2 text-amber-500" />
              Alertes Système
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-amber-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <AlertTriangle className="w-4 h-4 text-amber-500" />
                  <div>
                    <p className="text-sm font-medium">Maintenance Bus #12</p>
                    <p className="text-xs text-gray-500">Prévue demain 08:00</p>
                  </div>
                </div>
                <Button size="sm" variant="outline">Voir</Button>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <Info className="w-4 h-4 text-blue-500" />
                  <div>
                    <p className="text-sm font-medium">Nouvelle inscription Agent</p>
                    <p className="text-xs text-gray-500">En attente d'approbation</p>
                  </div>
                </div>
                <Button size="sm" variant="outline">Approuver</Button>
              </div>

              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <div>
                    <p className="text-sm font-medium">Sauvegarde effectuée</p>
                    <p className="text-xs text-gray-500">Aujourd'hui 03:00</p>
                  </div>
                </div>
                <Badge variant="secondary" className="bg-green-100 text-green-800">OK</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* État du système */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Monitor className="w-5 h-5 mr-2" />
            État du Système
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <Database className="w-8 h-8 text-green-600" />
              </div>
              <p className="text-sm font-medium">Base de données</p>
              <p className="text-xs text-green-600">Opérationnelle</p>
              <Progress value={98} className="mt-2" />
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <Globe className="w-8 h-8 text-blue-600" />
              </div>
              <p className="text-sm font-medium">Site Web</p>
              <p className="text-xs text-blue-600">En ligne</p>
              <Progress value={100} className="mt-2" />
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <CreditCard className="w-8 h-8 text-purple-600" />
              </div>
              <p className="text-sm font-medium">Paiements</p>
              <p className="text-xs text-purple-600">Actif</p>
              <Progress value={95} className="mt-2" />
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <Shield className="w-8 h-8 text-orange-600" />
              </div>
              <p className="text-sm font-medium">Sécurité</p>
              <p className="text-xs text-orange-600">Protégé</p>
              <Progress value={99} className="mt-2" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderRoutes = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gestion des Trajets</h1>
          <p className="text-gray-600">Gérez tous les trajets disponibles</p>
        </div>
        <Button 
          onClick={async () => {
            // Utilisation du back-office si disponible
            if ((window as any).backOfficeActions) {
              try {
                const result = await (window as any).backOfficeActions.executeAction('loadRoutes');
                console.log('Routes chargées via back-office:', result);
              } catch (error) {
                console.error('Erreur back-office:', error);
              }
            }
            setShowRouteModal(true);
          }}
          className="bg-[#C03618] hover:bg-[#A02E14]"
        >
          <Plus className="w-4 h-4 mr-2" />
          Nouveau Trajet
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Trajets Actifs ({routes.length})</CardTitle>
            <div className="flex items-center space-x-2">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Rechercher un trajet..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8 w-64"
                />
              </div>
              <Button variant="outline" size="sm">
                <Filter className="w-4 h-4 mr-2" />
                Filtrer
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Route</TableHead>
                <TableHead>Distance</TableHead>
                <TableHead>Durée</TableHead>
                <TableHead>Prix</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead>Dernière MAJ</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {routes.map((route) => (
                <TableRow key={route.id}>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <MapPin className="w-4 h-4 text-gray-400" />
                      <span className="font-medium">{route.departure} → {route.arrival}</span>
                    </div>
                  </TableCell>
                  <TableCell>{route.distance} km</TableCell>
                  <TableCell>{route.duration}</TableCell>
                  <TableCell>{route.price.toLocaleString()} XAF</TableCell>
                  <TableCell>
                    <Badge 
                      variant={route.status === 'active' ? 'default' : route.status === 'inactive' ? 'secondary' : 'destructive'}
                      className={
                        route.status === 'active' 
                          ? 'bg-green-100 text-green-800' 
                          : route.status === 'inactive'
                          ? 'bg-gray-100 text-gray-800'
                          : 'bg-orange-100 text-orange-800'
                      }
                    >
                      {route.status === 'active' ? 'Actif' : route.status === 'inactive' ? 'Inactif' : 'Maintenance'}
                    </Badge>
                  </TableCell>
                  <TableCell>{route.updatedAt}</TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => {
                          setEditingItem(route);
                          setShowRouteModal(true);
                        }}
                      >
                        <Edit className="w-3 h-3" />
                      </Button>
                      <Button size="sm" variant="outline">
                        <Eye className="w-3 h-3" />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button size="sm" variant="outline" className="text-red-600 hover:text-red-700">
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Supprimer le trajet</AlertDialogTitle>
                            <AlertDialogDescription>
                              Êtes-vous sûr de vouloir supprimer ce trajet ? Cette action est irréversible.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Annuler</AlertDialogCancel>
                            <AlertDialogAction 
                              className="bg-red-600 hover:bg-red-700"
                              onClick={() => {
                                setRoutes(routes.filter(r => r.id !== route.id));
                                toast.success('Trajet supprimé avec succès');
                              }}
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
        </CardContent>
      </Card>
    </div>
  );

  const renderSchedules = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gestion des Horaires</h1>
          <p className="text-gray-600">Planifiez et gérez les horaires de départ</p>
        </div>
        <Button 
          onClick={() => setShowScheduleModal(true)}
          className="bg-[#C03618] hover:bg-[#A02E14]"
        >
          <Plus className="w-4 h-4 mr-2" />
          Nouvel Horaire
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Horaires Programmés</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Route</TableHead>
                  <TableHead>Départ</TableHead>
                  <TableHead>Arrivée</TableHead>
                  <TableHead>Fréquence</TableHead>
                  <TableHead>Bus</TableHead>
                  <TableHead>Occupancy</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {schedules.map((schedule) => (
                  <TableRow key={schedule.id}>
                    <TableCell>
                      <div className="font-medium">{schedule.route}</div>
                      <div className="text-xs text-gray-500">{schedule.driverName}</div>
                    </TableCell>
                    <TableCell>{schedule.departureTime}</TableCell>
                    <TableCell>{schedule.arrivalTime}</TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {schedule.frequency.map((day, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {day.substring(0, 3)}
                          </Badge>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell>{schedule.busType}</TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Progress 
                          value={((schedule.totalSeats - schedule.availableSeats) / schedule.totalSeats) * 100} 
                          className="w-16 h-2"
                        />
                        <span className="text-xs text-gray-600">
                          {schedule.totalSeats - schedule.availableSeats}/{schedule.totalSeats}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant={schedule.status === 'active' ? 'default' : schedule.status === 'delayed' ? 'destructive' : 'secondary'}
                        className={
                          schedule.status === 'active' 
                            ? 'bg-green-100 text-green-800' 
                            : schedule.status === 'delayed'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }
                      >
                        {schedule.status === 'active' ? 'Actif' : schedule.status === 'delayed' ? 'Retardé' : 'Suspendu'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-1">
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => {
                            setEditingItem(schedule);
                            setShowScheduleModal(true);
                          }}
                        >
                          <Edit className="w-3 h-3" />
                        </Button>
                        <Button size="sm" variant="outline">
                          <Eye className="w-3 h-3" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Calendrier</CardTitle>
          </CardHeader>
          <CardContent>
            <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start text-left font-normal"
                >
                  <Calendar className="mr-2 h-4 w-4" />
                  {selectedDate ? format(selectedDate, 'dd/MM/yyyy') : 'Sélectionner'}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <CalendarComponent
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            
            <div className="mt-4 space-y-2">
              <div className="text-xs font-medium text-gray-600">Aujourd'hui</div>
              <div className="space-y-1">
                <div className="text-xs p-2 bg-green-50 rounded border-l-2 border-green-500">
                  <div className="font-medium">08:00 - LBV → PG</div>
                  <div className="text-gray-600">Bus Premium</div>
                </div>
                <div className="text-xs p-2 bg-blue-50 rounded border-l-2 border-blue-500">
                  <div className="font-medium">14:00 - LBV → PG</div>
                  <div className="text-gray-600">Bus Standard</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const renderTickets = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gestion des Billets</h1>
          <p className="text-gray-600">Consultez et gérez tous les billets vendus</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Exporter
          </Button>
          <Button 
            onClick={() => setShowTicketModal(true)}
            className="bg-[#C03618] hover:bg-[#A02E14]"
          >
            <Plus className="w-4 h-4 mr-2" />
            Nouveau Billet
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Billets</p>
                <p className="text-xl font-bold">{tickets.length}</p>
              </div>
              <Ticket className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Confirmés</p>
                <p className="text-xl font-bold text-green-600">
                  {tickets.filter(t => t.status === 'confirmed').length}
                </p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">En attente</p>
                <p className="text-xl font-bold text-yellow-600">
                  {tickets.filter(t => t.status === 'pending').length}
                </p>
              </div>
              <Clock className="w-8 h-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Annulés</p>
                <p className="text-xl font-bold text-red-600">
                  {tickets.filter(t => t.status === 'cancelled').length}
                </p>
              </div>
              <XCircle className="w-8 h-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Liste des Billets</CardTitle>
            <div className="flex items-center space-x-2">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Rechercher par numéro ou nom..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8 w-64"
                />
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>N° Billet</TableHead>
                <TableHead>Passager</TableHead>
                <TableHead>Route</TableHead>
                <TableHead>Date & Heure</TableHead>
                <TableHead>Siège</TableHead>
                <TableHead>Prix</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead>Paiement</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tickets.map((ticket) => (
                <TableRow key={ticket.id}>
                  <TableCell>
                    <div className="font-medium">{ticket.ticketNumber}</div>
                    <div className="text-xs text-gray-500">
                      Réservé le {ticket.bookingDate}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{ticket.passengerName}</div>
                      <div className="text-xs text-gray-500">{ticket.passengerEmail}</div>
                      <div className="text-xs text-gray-500">{ticket.passengerPhone}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="font-medium">{ticket.route}</div>
                    <div className="text-xs text-gray-500">{ticket.busType}</div>
                  </TableCell>
                  <TableCell>
                    <div className="font-medium">{ticket.departureDate}</div>
                    <div className="text-xs text-gray-500">{ticket.departureTime}</div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{ticket.seatNumber}</Badge>
                  </TableCell>
                  <TableCell>{ticket.price.toLocaleString()} XAF</TableCell>
                  <TableCell>
                    <Badge 
                      variant={
                        ticket.status === 'confirmed' ? 'default' : 
                        ticket.status === 'pending' ? 'secondary' : 
                        ticket.status === 'used' ? 'outline' : 'destructive'
                      }
                      className={
                        ticket.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                        ticket.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        ticket.status === 'used' ? 'bg-blue-100 text-blue-800' :
                        'bg-red-100 text-red-800'
                      }
                    >
                      {ticket.status === 'confirmed' ? 'Confirmé' :
                       ticket.status === 'pending' ? 'En attente' :
                       ticket.status === 'used' ? 'Utilisé' : 'Annulé'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge 
                      variant={ticket.paymentStatus === 'paid' ? 'default' : ticket.paymentStatus === 'pending' ? 'secondary' : 'destructive'}
                      className={
                        ticket.paymentStatus === 'paid' ? 'bg-green-100 text-green-800' :
                        ticket.paymentStatus === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }
                    >
                      {ticket.paymentStatus === 'paid' ? 'Payé' :
                       ticket.paymentStatus === 'pending' ? 'En attente' : 'Remboursé'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-1">
                      <Button size="sm" variant="outline">
                        <Eye className="w-3 h-3" />
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => {
                          setEditingItem(ticket);
                          setShowTicketModal(true);
                        }}
                      >
                        <Edit className="w-3 h-3" />
                      </Button>
                      <Button size="sm" variant="outline">
                        <Download className="w-3 h-3" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );

  const renderContent = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gestion du Contenu</h1>
          <p className="text-gray-600">Gérez les annonces, promotions et actualités</p>
        </div>
        <Button 
          onClick={() => setShowContentModal(true)}
          className="bg-[#C03618] hover:bg-[#A02E14]"
        >
          <Plus className="w-4 h-4 mr-2" />
          Nouveau Contenu
        </Button>
      </div>

      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">Tout</TabsTrigger>
          <TabsTrigger value="announcement">Annonces</TabsTrigger>
          <TabsTrigger value="promotion">Promotions</TabsTrigger>
          <TabsTrigger value="news">Actualités</TabsTrigger>
          <TabsTrigger value="service_update">Mises à jour</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {contentItems.map((item) => (
              <Card key={item.id} className="relative">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <Badge 
                      variant="outline"
                      className={
                        item.type === 'announcement' ? 'bg-blue-100 text-blue-800' :
                        item.type === 'promotion' ? 'bg-green-100 text-green-800' :
                        item.type === 'news' ? 'bg-purple-100 text-purple-800' :
                        'bg-orange-100 text-orange-800'
                      }
                    >
                      {item.type === 'announcement' ? 'Annonce' :
                       item.type === 'promotion' ? 'Promotion' :
                       item.type === 'news' ? 'Actualité' : 'Mise à jour'}
                    </Badge>
                    <div className="flex items-center space-x-1">
                      <Badge 
                        variant={item.status === 'published' ? 'default' : item.status === 'draft' ? 'secondary' : 'outline'}
                        className={
                          item.status === 'published' ? 'bg-green-100 text-green-800' :
                          item.status === 'draft' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-gray-100 text-gray-800'
                        }
                      >
                        {item.status === 'published' ? 'Publié' :
                         item.status === 'draft' ? 'Brouillon' : 'Archivé'}
                      </Badge>
                    </div>
                  </div>
                  <CardTitle className="text-lg">{item.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-4 line-clamp-3">{item.content}</p>
                  
                  <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                    <span>Publié le {item.publishDate}</span>
                    <div className="flex items-center space-x-2">
                      <div className="flex items-center space-x-1">
                        <Eye className="w-3 h-3" />
                        <span>{item.views}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <ExternalLink className="w-3 h-3" />
                        <span>{item.clicks}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className={`w-2 h-2 rounded-full ${
                        item.priority === 'high' ? 'bg-red-500' :
                        item.priority === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
                      }`}></div>
                      <span className="text-xs text-gray-500">
                        Priorité {item.priority === 'high' ? 'Haute' : item.priority === 'medium' ? 'Moyenne' : 'Basse'}
                      </span>
                    </div>
                    
                    <div className="flex items-center space-x-1">
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => {
                          setEditingItem(item);
                          setShowContentModal(true);
                        }}
                      >
                        <Edit className="w-3 h-3" />
                      </Button>
                      <Button size="sm" variant="outline">
                        <Eye className="w-3 h-3" />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button size="sm" variant="outline" className="text-red-600">
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Supprimer le contenu</AlertDialogTitle>
                            <AlertDialogDescription>
                              Êtes-vous sûr de vouloir supprimer ce contenu ? Cette action est irréversible.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Annuler</AlertDialogCancel>
                            <AlertDialogAction 
                              className="bg-red-600 hover:bg-red-700"
                              onClick={() => {
                                setContentItems(contentItems.filter(c => c.id !== item.id));
                                toast.success('Contenu supprimé avec succès');
                              }}
                            >
                              Supprimer
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );

  const renderUsers = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gestion des Utilisateurs</h1>
          <p className="text-gray-600">Gérez les comptes administrateurs, agents et chauffeurs</p>
        </div>
        <Button 
          onClick={() => setShowUserModal(true)}
          className="bg-[#C03618] hover:bg-[#A02E14]"
        >
          <Plus className="w-4 h-4 mr-2" />
          Nouvel Utilisateur
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Administrateurs</p>
                <p className="text-xl font-bold">{users.filter(u => u.role === 'admin').length}</p>
              </div>
              <Shield className="w-8 h-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Agents</p>
                <p className="text-xl font-bold">{users.filter(u => u.role === 'agent').length}</p>
              </div>
              <UserCheck className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Chauffeurs</p>
                <p className="text-xl font-bold">{users.filter(u => u.role === 'driver').length}</p>
              </div>
              <Truck className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Liste des Utilisateurs</CardTitle>
            <div className="flex items-center space-x-2">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Rechercher un utilisateur..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8 w-64"
                />
              </div>
              <Select defaultValue="all">
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Rôle" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="agent">Agent</SelectItem>
                  <SelectItem value="driver">Chauffeur</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Utilisateur</TableHead>
                <TableHead>Rôle</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Dernière connexion</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead>Performance</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      <Avatar>
                        <AvatarFallback>
                          {user.fullName.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{user.fullName}</div>
                        <div className="text-sm text-gray-500">@{user.username}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge 
                      variant="outline"
                      className={
                        user.role === 'admin' ? 'bg-red-100 text-red-800' :
                        user.role === 'agent' ? 'bg-blue-100 text-blue-800' :
                        'bg-green-100 text-green-800'
                      }
                    >
                      {user.role === 'admin' ? 'Administrateur' :
                       user.role === 'agent' ? 'Agent' : 'Chauffeur'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="text-sm">{user.email}</div>
                      <div className="text-sm text-gray-500">{user.phone}</div>
                    </div>
                  </TableCell>
                  <TableCell>{user.lastLogin}</TableCell>
                  <TableCell>
                    <Badge 
                      variant={user.status === 'active' ? 'default' : user.status === 'suspended' ? 'destructive' : 'secondary'}
                      className={
                        user.status === 'active' ? 'bg-green-100 text-green-800' :
                        user.status === 'suspended' ? 'bg-red-100 text-red-800' :
                        'bg-yellow-100 text-yellow-800'
                      }
                    >
                      {user.status === 'active' ? 'Actif' :
                       user.status === 'suspended' ? 'Suspendu' : 'En attente'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {user.role === 'driver' && (
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          <Star className="w-3 h-3 text-yellow-500" />
                          <span className="text-sm">{user.rating}/5</span>
                        </div>
                        <div className="text-xs text-gray-500">{user.totalTrips} trajets</div>
                      </div>
                    )}
                    {user.role === 'agent' && (
                      <div className="text-sm text-gray-500">{user.totalTrips} billets traités</div>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-1">
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => {
                          setEditingItem(user);
                          setShowUserModal(true);
                        }}
                      >
                        <Edit className="w-3 h-3" />
                      </Button>
                      <Button size="sm" variant="outline">
                        <Eye className="w-3 h-3" />
                      </Button>
                      {user.status === 'active' ? (
                        <Button size="sm" variant="outline" className="text-orange-600">
                          <Lock className="w-3 h-3" />
                        </Button>
                      ) : (
                        <Button size="sm" variant="outline" className="text-green-600">
                          <CheckCircle className="w-3 h-3" />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );

  const renderActiveContent = () => {
    switch (activeSection) {
      case 'dashboard': return renderDashboard();
      case 'routes': return renderRoutes();
      case 'schedules': return renderSchedules();
      case 'tickets': return renderTickets();
      case 'refunds': return <div className="p-8 text-center text-gray-500">Gestion des remboursements - En développement</div>;
      case 'content': return renderContent();
      case 'stats': return <div className="p-8 text-center text-gray-500">Statistiques détaillées - En développement</div>;
      case 'users': return renderUsers();
      case 'analytics': return <div className="p-8 text-center text-gray-500">Analyses avancées - En développement</div>;
      case 'settings': return (
        <div className="p-6 space-y-6">
          <BackOfficeTestPanel />
        </div>
      );
      default: return renderDashboard();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-xl flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-8 h-8 bg-[#C03618] rounded-lg flex items-center justify-center">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="font-bold text-gray-900">Admin Dashboard</h2>
              <p className="text-xs text-gray-500">Karis Continental</p>
            </div>
          </div>
          
          {/* Intégration Back-Office */}
          <BackOfficeIntegration 
            role="admin" 
            activeSection={activeSection}
            onDataLoaded={(data) => console.log('Données chargées:', data)}
            onError={(error) => console.error('Erreur back-office:', error)}
          />
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => setActiveSection(item.id as ActiveSection)}
                className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
                  activeSection === item.id
                    ? 'bg-[#C03618] text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="text-sm font-medium">{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200">
          <button
            onClick={handleLogout}
            className="w-full flex items-center space-x-3 px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span className="text-sm font-medium">Déconnexion</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col bg-gray-50">
        {/* Top Bar */}
        <div className="bg-white border-b border-gray-200 p-6 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h1 className="text-lg font-semibold text-gray-900">
              {menuItems.find(item => item.id === activeSection)?.label}
            </h1>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span>Système en ligne</span>
            </div>
            <Button
              onClick={onClose}
              variant="outline"
              size="sm"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-8">
          {renderActiveContent()}
        </div>
      </div>
    </div>
  );
};