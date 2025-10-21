import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Home,
  Route,
  Clock,
  Ticket,
  RefreshCw,
  FileText,
  BarChart3,
  Settings,
  LogOut,
  Users,
  DollarSign,
  TrendingUp,
  CheckCircle,
  AlertTriangle,
  Activity,
  Database,
  PieChart,
  Shield,
  X,
  Plus,
  Eye,
  Edit,
  Trash2,
  Search,
  Filter,
  Download,
  Monitor,
  Globe,
  CreditCard,
  Info
} from 'lucide-react';
import { useAuth } from './AuthContext';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Progress } from './ui/progress';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { toast } from 'sonner';

interface AdminDashboardSimpleProps {
  onClose?: () => void;
}

type ActiveSection = 'dashboard' | 'routes' | 'schedules' | 'tickets' | 'refunds' | 'content' | 'stats' | 'settings' | 'users' | 'analytics' | 'backoffice';

export const AdminDashboardSimple: React.FC<AdminDashboardSimpleProps> = ({ onClose }) => {
  const { logout } = useAuth();
  const [activeSection, setActiveSection] = useState<ActiveSection>('dashboard');
  const [searchQuery, setSearchQuery] = useState('');

  // États pour les statistiques
  const [dashboardStats] = useState({
    totalRoutes: 12,
    activeSchedules: 8,
    todayTickets: 45,
    revenue: 1125000,
    activeUsers: 156,
    systemHealth: 98,
    pendingRefunds: 3,
    newBookings: 28
  });

  const handleLogout = () => {
    if (logout) {
      logout();
    }
    if (onClose) {
      onClose();
    }
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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Tableau de bord Administrateur</h1>
          <p className="text-gray-600">Vue d'ensemble du système Karis Continental</p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="secondary" className="bg-blue-100 text-blue-800">
            <Database className="w-3 h-3 mr-1" />
            Back-Office Intégré
          </Badge>
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
                  <p className="text-sm font-medium">Nouvelle réservation</p>
                  <p className="text-xs text-gray-500">Agent terrain - il y a 25 min</p>
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

  const renderBackOffice = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Back-Office Intégré</h1>
          <p className="text-gray-600">Système de gestion back-office complet pour Karis Continental</p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="secondary" className="bg-blue-100 text-blue-800">
            <Database className="w-3 h-3 mr-1" />
            Mode Back-Office
          </Badge>
        </div>
      </div>

      {/* Interface du Back-Office */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Panneau de contrôle principal */}
        <div className="lg:col-span-3">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Database className="w-5 h-5 mr-2" />
                Panneau de Contrôle Back-Office
              </CardTitle>
              <CardDescription>
                Gestion centralisée de tous les aspects opérationnels
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="overview" className="space-y-4">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
                  <TabsTrigger value="operations">Opérations</TabsTrigger>
                  <TabsTrigger value="analytics">Analytics</TabsTrigger>
                  <TabsTrigger value="monitoring">Monitoring</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card>
                      <CardContent className="p-4">
                        <div className="flex items-center space-x-2">
                          <Route className="w-8 h-8 text-blue-600" />
                          <div>
                            <p className="text-2xl font-bold">24</p>
                            <p className="text-sm text-gray-600">Routes actives</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardContent className="p-4">
                        <div className="flex items-center space-x-2">
                          <Users className="w-8 h-8 text-green-600" />
                          <div>
                            <p className="text-2xl font-bold">18</p>
                            <p className="text-sm text-gray-600">Véhicules en service</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardContent className="p-4">
                        <div className="flex items-center space-x-2">
                          <Users className="w-8 h-8 text-purple-600" />
                          <div>
                            <p className="text-2xl font-bold">245</p>
                            <p className="text-sm text-gray-600">Passagers aujourd'hui</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  <Card>
                    <CardHeader>
                      <CardTitle>Actions Rapides</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        <Button 
                          variant="outline" 
                          className="flex flex-col h-auto p-4 space-y-2"
                          onClick={() => toast.success('Voyage créé avec succès')}
                        >
                          <Plus className="w-6 h-6" />
                          <span className="text-xs">Créer voyage</span>
                        </Button>
                        
                        <Button 
                          variant="outline" 
                          className="flex flex-col h-auto p-4 space-y-2"
                          onClick={() => toast.success('Interface utilisateurs ouverte')}
                        >
                          <Users className="w-6 h-6" />
                          <span className="text-xs">Gérer utilisateurs</span>
                        </Button>
                        
                        <Button 
                          variant="outline" 
                          className="flex flex-col h-auto p-4 space-y-2"
                          onClick={() => toast.success('Rapport généré avec succès')}
                        >
                          <BarChart3 className="w-6 h-6" />
                          <span className="text-xs">Générer rapport</span>
                        </Button>
                        
                        <Button 
                          variant="outline" 
                          className="flex flex-col h-auto p-4 space-y-2"
                          onClick={() => {
                            toast.info('Sauvegarde en cours...');
                            setTimeout(() => toast.success('Sauvegarde terminée'), 2000);
                          }}
                        >
                          <Download className="w-6 h-6" />
                          <span className="text-xs">Sauvegarder</span>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="operations" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Gestion Opérationnelle</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600 mb-4">
                        Interface pour la gestion des opérations quotidiennes
                      </p>
                      <div className="space-y-3">
                        <Button 
                          className="w-full justify-start" 
                          variant="outline"
                          onClick={() => {
                            setActiveSection('routes');
                            toast.success('Accès à la gestion des trajets et horaires - Les modifications s\'afficheront sur la page d\'accueil');
                          }}
                        >
                          <Route className="w-4 h-4 mr-2" />
                          Gestion des trajets et horaires
                        </Button>
                        <Button 
                          className="w-full justify-start" 
                          variant="outline"
                          onClick={() => {
                            setActiveSection('tickets');
                            toast.success('Accès au système de billetterie');
                          }}
                        >
                          <Ticket className="w-4 h-4 mr-2" />
                          Système de billetterie
                        </Button>
                        <Button 
                          className="w-full justify-start" 
                          variant="outline"
                          onClick={() => {
                            toast.info('Module de gestion de flotte - En développement');
                          }}
                        >
                          <Users className="w-4 h-4 mr-2" />
                          Gestion de flotte
                        </Button>
                        <Button 
                          className="w-full justify-start" 
                          variant="outline"
                          onClick={() => {
                            setActiveSection('users');
                            toast.success('Accès à la gestion du personnel');
                          }}
                        >
                          <Users className="w-4 h-4 mr-2" />
                          Gestion du personnel
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="analytics" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Analytics et Rapports</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600 mb-4">
                        Analyses approfondies et rapports détaillés
                      </p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="p-4 border rounded-lg">
                          <h4 className="font-medium mb-2">Revenus mensuels</h4>
                          <p className="text-2xl font-bold text-green-600">2,450,000 XAF</p>
                          <p className="text-sm text-gray-500">+12% vs mois dernier</p>
                        </div>
                        <div className="p-4 border rounded-lg">
                          <h4 className="font-medium mb-2">Taux d'occupation</h4>
                          <p className="text-2xl font-bold text-blue-600">78%</p>
                          <p className="text-sm text-gray-500">Moyenne hebdomadaire</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="monitoring" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Monitoring Système</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                          <div className="flex items-center space-x-3">
                            <CheckCircle className="w-5 h-5 text-green-600" />
                            <div>
                              <p className="font-medium">Base de données</p>
                              <p className="text-sm text-gray-600">Opérationnelle</p>
                            </div>
                          </div>
                          <Badge variant="secondary" className="bg-green-100 text-green-800">
                            98% uptime
                          </Badge>
                        </div>
                        
                        <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                          <div className="flex items-center space-x-3">
                            <Globe className="w-5 h-5 text-blue-600" />
                            <div>
                              <p className="font-medium">API Services</p>
                              <p className="text-sm text-gray-600">Tous fonctionnels</p>
                            </div>
                          </div>
                          <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                            200ms avg
                          </Badge>
                        </div>
                        
                        <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                          <div className="flex items-center space-x-3">
                            <Shield className="w-5 h-5 text-purple-600" />
                            <div>
                              <p className="font-medium">Sécurité</p>
                              <p className="text-sm text-gray-600">Tous systèmes sécurisés</p>
                            </div>
                          </div>
                          <Badge variant="secondary" className="bg-purple-100 text-purple-800">
                            Niveau 5
                          </Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>

        {/* Panneau latéral */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">État du Back-Office</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">Connexion</span>
                <Badge variant="default">Connecté</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Dernière sync</span>
                <span className="text-xs text-gray-500">Il y a 2 min</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Événements</span>
                <span className="text-xs text-green-600">24 aujourd'hui</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Logs Récents</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="text-xs p-2 bg-green-50 rounded border-l-2 border-green-500">
                <p className="font-medium">Voyage créé</p>
                <p className="text-gray-600">14:32</p>
              </div>
              <div className="text-xs p-2 bg-blue-50 rounded border-l-2 border-blue-500">
                <p className="font-medium">Utilisateur connecté</p>
                <p className="text-gray-600">14:28</p>
              </div>
              <div className="text-xs p-2 bg-yellow-50 rounded border-l-2 border-yellow-500">
                <p className="font-medium">Maintenance prévue</p>
                <p className="text-gray-600">14:15</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Panneau de test du back-office */}
      <Card>
        <CardHeader>
          <CardTitle>Test et Développement</CardTitle>
          <CardDescription>
            Le système back-office est entièrement intégré dans l'interface administrateur
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-gray-600">
              Le système back-office est entièrement intégré dans l'interface administrateur.
              Toutes les fonctionnalités de gestion sont disponibles via les différentes sections du dashboard.
            </p>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-green-50 rounded-lg">
                <p className="font-medium text-green-800">Services Actifs</p>
                <p className="text-sm text-green-600">12 modules fonctionnels</p>
              </div>
              <div className="p-4 bg-blue-50 rounded-lg">
                <p className="font-medium text-blue-800">API Backend</p>
                <p className="text-sm text-blue-600">Mode développement</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard':
        return renderDashboard();
      case 'backoffice':
        return renderBackOffice();
      default:
        return (
          <div className="p-6">
            <h2 className="text-xl font-bold mb-4">
              {menuItems.find(item => item.id === activeSection)?.label}
            </h2>
            <p className="text-gray-600">Interface en cours de développement...</p>
          </div>
        );
    }
  };

  // Mode simple sans modal pour AuthenticatedApp
  return (
    <div className="space-y-6">
      {/* Navigation en tabs */}
      <div className="border-b">
        <nav className="flex space-x-8 overflow-x-auto">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => setActiveSection(item.id as ActiveSection)}
                className={`flex items-center space-x-2 py-4 px-2 border-b-2 transition-colors whitespace-nowrap ${
                  activeSection === item.id
                    ? 'border-[#C03618] text-[#C03618]'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="text-sm font-medium">{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Contenu */}
      <motion.div
        key={activeSection}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
      >
        {renderContent()}
      </motion.div>
    </div>
  );
};