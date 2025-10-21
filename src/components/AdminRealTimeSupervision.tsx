import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import {
  Monitor,
  Bus,
  Users,
  DollarSign,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  Clock,
  MapPin,
  RefreshCw,
  Eye,
  Bell,
  Activity,
  Zap,
  Target,
  BarChart3,
  PieChart,
  ArrowUp,
  ArrowDown,
  AlertCircle
} from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { useOperationalData } from './contexts/OperationalDataContext';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart as RechartsPieChart, Cell, LineChart, Line, Area, AreaChart } from 'recharts';

export const AdminRealTimeSupervision: React.FC = () => {
  const { trips, buses, drivers, incidents, getRealTimeStats, getFillingRate, routes } = useOperationalData();
  
  // States for real-time data
  const [realTimeStats, setRealTimeStats] = useState({
    activeTrips: 0,
    totalRevenue: 0,
    occupancyRate: 0,
    incidentCount: 0
  });
  
  const [fillingRate, setFillingRate] = useState(0);
  const [lastUpdate, setLastUpdate] = useState(new Date());

  // Mock data for charts
  const [revenueData] = useState([
    { time: '00:00', revenue: 0 },
    { time: '06:00', revenue: 125000 },
    { time: '08:00', revenue: 450000 },
    { time: '12:00', revenue: 780000 },
    { time: '16:00', revenue: 1200000 },
    { time: '20:00', revenue: 1450000 },
    { time: '24:00', revenue: 1650000 }
  ]);

  const [occupancyTrend] = useState([
    { time: '00:00', occupancy: 0 },
    { time: '06:00', occupancy: 15 },
    { time: '08:00', occupancy: 85 },
    { time: '12:00', occupancy: 92 },
    { time: '16:00', occupancy: 78 },
    { time: '20:00', occupancy: 45 },
    { time: '24:00', occupancy: 12 }
  ]);

  const [routePerformance] = useState([
    { route: 'LBV-PG', bookings: 45, revenue: 1125000, occupancy: 90 },
    { route: 'LBV-FCV', bookings: 28, revenue: 980000, occupancy: 80 },
    { route: 'LBV-OYE', bookings: 22, revenue: 660000, occupancy: 73 },
    { route: 'PG-FCV', bookings: 18, revenue: 540000, occupancy: 67 }
  ]);

  const [paymentMethodData] = useState([
    { name: 'Mobile Money', value: 65, color: '#22c55e' },
    { name: 'Espèces', value: 25, color: '#3b82f6' },
    { name: 'Carte bancaire', value: 10, color: '#f59e0b' }
  ]);

  // Update real-time stats
  useEffect(() => {
    const updateStats = async () => {
      try {
        const stats = await getRealTimeStats();
        const filling = await getFillingRate();
        
        setRealTimeStats(stats);
        setFillingRate(filling);
        setLastUpdate(new Date());
      } catch (error) {
        console.error('Error fetching real-time stats:', error);
      }
    };

    // Initial load
    updateStats();

    // Update every 30 seconds
    const interval = setInterval(updateStats, 30000);
    return () => clearInterval(interval);
  }, [getRealTimeStats, getFillingRate]);

  // Get active buses
  const activeBuses = buses.filter(bus => bus.status === 'in_service');
  const availableBuses = buses.filter(bus => bus.status === 'available');
  const maintenanceBuses = buses.filter(bus => bus.status === 'maintenance');

  // Get active drivers
  const activeDrivers = drivers.filter(driver => driver.status === 'driving');
  const availableDrivers = drivers.filter(driver => driver.status === 'available');

  // Get recent incidents
  const recentIncidents = incidents
    .filter(incident => incident.status === 'reported' || incident.status === 'investigating')
    .sort((a, b) => b.reportedAt.getTime() - a.reportedAt.getTime())
    .slice(0, 5);

  // Calculate trends
  const calculateTrend = (current: number, previous: number) => {
    if (previous === 0) return 0;
    return ((current - previous) / previous) * 100;
  };

  // Mock previous data for trends
  const revenueTrend = calculateTrend(realTimeStats.totalRevenue, 1400000);
  const occupancyTrendPercent = calculateTrend(realTimeStats.occupancyRate, 75);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900">Supervision en temps réel</h2>
          <p className="text-gray-600">
            Dernière mise à jour: {lastUpdate.toLocaleTimeString('fr-FR')}
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            <Activity className="w-3 h-3 mr-1" />
            Système actif
          </Badge>
          <Button variant="outline" size="sm">
            <RefreshCw className="w-4 h-4 mr-2" />
            Actualiser
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Trajets actifs</p>
                <p className="text-2xl font-semibold">{realTimeStats.activeTrips}</p>
                <div className="flex items-center mt-1">
                  <Badge variant="secondary" className="text-xs">
                    {trips.filter(t => t.status === 'scheduled').length} programmés
                  </Badge>
                </div>
              </div>
              <div className="p-3 rounded-full" style={{ backgroundColor: 'rgba(192, 54, 24, 0.1)' }}>
                <Bus className="w-6 h-6" style={{ color: 'rgba(192, 54, 24, 0.9)' }} />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Chiffre d'affaires</p>
                <p className="text-2xl font-semibold">{(realTimeStats.totalRevenue / 1000000).toFixed(1)}M FCFA</p>
                <div className="flex items-center mt-1">
                  {revenueTrend >= 0 ? (
                    <ArrowUp className="w-3 h-3 text-green-600 mr-1" />
                  ) : (
                    <ArrowDown className="w-3 h-3 text-red-600 mr-1" />
                  )}
                  <span className={`text-xs ${revenueTrend >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {Math.abs(revenueTrend).toFixed(1)}%
                  </span>
                </div>
              </div>
              <div className="p-3 rounded-full bg-green-100">
                <DollarSign className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Taux de remplissage</p>
                <p className="text-2xl font-semibold">{fillingRate.toFixed(1)}%</p>
                <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                  <div 
                    className="h-2 rounded-full transition-all duration-500"
                    style={{ 
                      width: `${fillingRate}%`,
                      backgroundColor: fillingRate > 80 ? '#22c55e' : fillingRate > 60 ? '#f59e0b' : '#ef4444'
                    }}
                  />
                </div>
              </div>
              <div className="p-3 rounded-full bg-blue-100">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Incidents actifs</p>
                <p className="text-2xl font-semibold">{realTimeStats.incidentCount}</p>
                <div className="flex items-center mt-1">
                  <Badge 
                    variant={realTimeStats.incidentCount === 0 ? "secondary" : "destructive"}
                    className="text-xs"
                  >
                    {realTimeStats.incidentCount === 0 ? 'Aucun incident' : `${realTimeStats.incidentCount} à traiter`}
                  </Badge>
                </div>
              </div>
              <div className={`p-3 rounded-full ${realTimeStats.incidentCount === 0 ? 'bg-green-100' : 'bg-red-100'}`}>
                {realTimeStats.incidentCount === 0 ? (
                  <CheckCircle className="w-6 h-6 text-green-600" />
                ) : (
                  <AlertTriangle className="w-6 h-6 text-red-600" />
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
          <TabsTrigger value="revenue">Revenus</TabsTrigger>
          <TabsTrigger value="fleet">Flotte</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="incidents">Incidents</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <BarChart3 className="w-5 h-5" />
                  <span>Taux d'occupation - Aujourd'hui</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={occupancyTrend}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="time" />
                    <YAxis />
                    <Tooltip />
                    <Area 
                      type="monotone" 
                      dataKey="occupancy" 
                      stroke="rgba(192, 54, 24, 0.9)" 
                      fill="rgba(192, 54, 24, 0.1)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <PieChart className="w-5 h-5" />
                  <span>Répartition des paiements</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <RechartsPieChart>
                    <Tooltip />
                    <RechartsPieChart 
                      data={paymentMethodData} 
                      cx="50%" 
                      cy="50%" 
                      innerRadius={60} 
                      outerRadius={100}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {paymentMethodData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </RechartsPieChart>
                  </RechartsPieChart>
                </ResponsiveContainer>
                <div className="flex justify-center space-x-6 mt-4">
                  {paymentMethodData.map((entry, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: entry.color }}
                      />
                      <span className="text-sm">{entry.name} ({entry.value}%)</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Fleet Status */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Bus className="w-5 h-5" />
                  <span>État de la flotte</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">En service</span>
                  <Badge className="bg-green-100 text-green-800">
                    {activeBuses.length}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Disponibles</span>
                  <Badge variant="secondary">
                    {availableBuses.length}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Maintenance</span>
                  <Badge className="bg-orange-100 text-orange-800">
                    {maintenanceBuses.length}
                  </Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Users className="w-5 h-5" />
                  <span>Chauffeurs</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">En mission</span>
                  <Badge className="bg-blue-100 text-blue-800">
                    {activeDrivers.length}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Disponibles</span>
                  <Badge variant="secondary">
                    {availableDrivers.length}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Au repos</span>
                  <Badge variant="outline">
                    {drivers.filter(d => d.status === 'resting').length}
                  </Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Target className="w-5 h-5" />
                  <span>Objectifs du jour</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-gray-600">Revenus</span>
                    <span className="text-sm font-medium">1.2M / 2M</span>
                  </div>
                  <Progress value={60} className="h-2" />
                </div>
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-gray-600">Occupation</span>
                    <span className="text-sm font-medium">75%</span>
                  </div>
                  <Progress value={75} className="h-2" />
                </div>
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-gray-600">Satisfaction</span>
                    <span className="text-sm font-medium">4.2/5</span>
                  </div>
                  <Progress value={84} className="h-2" />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Revenue Tab */}
        <TabsContent value="revenue" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Évolution des revenus - Aujourd'hui</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <AreaChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="time" />
                  <YAxis />
                  <Tooltip 
                    formatter={(value: number) => [`${(value / 1000).toFixed(0)}k FCFA`, 'Revenus']}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="revenue" 
                    stroke="#22c55e" 
                    fill="#22c55e20"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Performance par route</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Route</TableHead>
                      <TableHead>Réservations</TableHead>
                      <TableHead>Revenus</TableHead>
                      <TableHead>Occupation</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {routePerformance.map((route, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">{route.route}</TableCell>
                        <TableCell>{route.bookings}</TableCell>
                        <TableCell>{(route.revenue / 1000).toFixed(0)}k</TableCell>
                        <TableCell>
                          <Badge variant={route.occupancy > 80 ? 'default' : 'secondary'}>
                            {route.occupancy}%
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Métriques financières</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                  <span className="text-sm text-gray-600">Revenus bruts</span>
                  <span className="font-semibold">{(realTimeStats.totalRevenue / 1000).toFixed(0)}k FCFA</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                  <span className="text-sm text-gray-600">Revenus moyens/trajet</span>
                  <span className="font-semibold">
                    {realTimeStats.activeTrips > 0 
                      ? (realTimeStats.totalRevenue / realTimeStats.activeTrips / 1000).toFixed(0) 
                      : 0}k FCFA
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                  <span className="text-sm text-gray-600">Taux de remplissage</span>
                  <span className="font-semibold">{fillingRate.toFixed(1)}%</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-green-50 rounded">
                  <span className="text-sm text-green-700">Projection du jour</span>
                  <span className="font-semibold text-green-700">
                    {((realTimeStats.totalRevenue * 1.4) / 1000000).toFixed(1)}M FCFA
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Fleet Tab */}
        <TabsContent value="fleet" className="space-y-6">
          <div className="grid gap-4">
            {buses.map(bus => (
              <Card key={bus.id}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className={`p-2 rounded-full ${
                        bus.status === 'in_service' ? 'bg-green-100' :
                        bus.status === 'available' ? 'bg-blue-100' :
                        bus.status === 'maintenance' ? 'bg-orange-100' :
                        'bg-red-100'
                      }`}>
                        <Bus className={`w-5 h-5 ${
                          bus.status === 'in_service' ? 'text-green-600' :
                          bus.status === 'available' ? 'text-blue-600' :
                          bus.status === 'maintenance' ? 'text-orange-600' :
                          'text-red-600'
                        }`} />
                      </div>
                      <div>
                        <h3 className="font-semibold">{bus.registration}</h3>
                        <p className="text-sm text-gray-600">{bus.model} - {bus.capacity} places</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <Badge variant={
                          bus.status === 'in_service' ? 'default' :
                          bus.status === 'available' ? 'secondary' :
                          bus.status === 'maintenance' ? 'destructive' :
                          'outline'
                        }>
                          {bus.status === 'in_service' ? 'En service' :
                           bus.status === 'available' ? 'Disponible' :
                           bus.status === 'maintenance' ? 'Maintenance' :
                           'Hors service'}
                        </Badge>
                        <p className="text-xs text-gray-500 mt-1">
                          {bus.mileage.toLocaleString()} km
                        </p>
                      </div>
                      
                      <div className="text-right text-sm">
                        <p className="text-gray-600">Prochaine révision</p>
                        <p className={`font-medium ${
                          (bus.nextMaintenance.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24) <= 15 
                            ? 'text-orange-600' 
                            : 'text-green-600'
                        }`}>
                          {bus.nextMaintenance.toLocaleDateString('fr-FR')}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Performance Tab */}
        <TabsContent value="performance" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Performance des routes</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={routePerformance}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="route" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="bookings" fill="rgba(192, 54, 24, 0.9)" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Incidents Tab */}
        <TabsContent value="incidents" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <AlertTriangle className="w-5 h-5" />
                <span>Incidents récents</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {recentIncidents.length > 0 ? (
                <div className="space-y-3">
                  {recentIncidents.map(incident => (
                    <div key={incident.id} className="border rounded-lg p-4 bg-gray-50">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <Badge variant={
                              incident.severity === 'critical' ? 'destructive' :
                              incident.severity === 'high' ? 'destructive' :
                              incident.severity === 'medium' ? 'secondary' :
                              'outline'
                            }>
                              {incident.severity === 'critical' ? 'Critique' :
                               incident.severity === 'high' ? 'Élevée' :
                               incident.severity === 'medium' ? 'Moyenne' :
                               'Faible'}
                            </Badge>
                            <Badge variant="outline">
                              {incident.type === 'mechanical' ? 'Mécanique' :
                               incident.type === 'accident' ? 'Accident' :
                               incident.type === 'passenger' ? 'Passager' :
                               incident.type === 'route' ? 'Route' :
                               'Autre'}
                            </Badge>
                          </div>
                          <h3 className="font-medium">{incident.title}</h3>
                          <p className="text-sm text-gray-600">{incident.description}</p>
                          <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                            <span className="flex items-center space-x-1">
                              <MapPin className="w-3 h-3" />
                              <span>{incident.location}</span>
                            </span>
                            <span className="flex items-center space-x-1">
                              <Clock className="w-3 h-3" />
                              <span>{incident.reportedAt.toLocaleString('fr-FR')}</span>
                            </span>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-2 ml-4">
                          <Badge variant={incident.status === 'reported' ? 'destructive' : 'secondary'}>
                            {incident.status === 'reported' ? 'Signalé' : 'En cours'}
                          </Badge>
                          <Button variant="outline" size="sm">
                            <Eye className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Aucun incident actif
                  </h3>
                  <p className="text-gray-600">
                    Toutes les opérations se déroulent normalement.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};