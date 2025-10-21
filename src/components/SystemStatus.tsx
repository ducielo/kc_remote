import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Server, 
  Database, 
  Globe, 
  Shield, 
  AlertTriangle, 
  CheckCircle, 
  XCircle,
  Clock,
  Wifi,
  HardDrive,
  Cpu,
  Activity,
  Zap
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Button } from './ui/button';

interface SystemService {
  id: string;
  name: string;
  status: 'online' | 'offline' | 'warning' | 'maintenance';
  uptime: string;
  lastCheck: Date;
  responseTime: number;
  icon: React.ReactNode;
  description: string;
}

interface SystemMetric {
  id: string;
  name: string;
  value: number;
  max: number;
  unit: string;
  status: 'good' | 'warning' | 'critical';
  icon: React.ReactNode;
}

interface SystemStatusProps {
  className?: string;
}

export const SystemStatus: React.FC<SystemStatusProps> = ({ className = '' }) => {
  const [services, setServices] = useState<SystemService[]>([
    {
      id: 'web',
      name: 'Site Web',
      status: 'online',
      uptime: '99.98%',
      lastCheck: new Date(),
      responseTime: 245,
      icon: <Globe className="w-4 h-4" />,
      description: 'Interface publique'
    },
    {
      id: 'api',
      name: 'API Backend',
      status: 'online',
      uptime: '99.95%',
      lastCheck: new Date(),
      responseTime: 180,
      icon: <Server className="w-4 h-4" />,
      description: 'Services de réservation'
    },
    {
      id: 'database',
      name: 'Base de données',
      status: 'online',
      uptime: '99.99%',
      lastCheck: new Date(),
      responseTime: 120,
      icon: <Database className="w-4 h-4" />,
      description: 'Stockage des données'
    },
    {
      id: 'payment',
      name: 'Système de paiement',
      status: 'warning',
      uptime: '98.50%',
      lastCheck: new Date(),
      responseTime: 850,
      icon: <Shield className="w-4 h-4" />,
      description: 'Passerelle de paiement'
    }
  ]);

  const [metrics, setMetrics] = useState<SystemMetric[]>([
    {
      id: 'cpu',
      name: 'CPU',
      value: 45,
      max: 100,
      unit: '%',
      status: 'good',
      icon: <Cpu className="w-4 h-4" />
    },
    {
      id: 'memory',
      name: 'Mémoire',
      value: 68,
      max: 100,
      unit: '%',
      status: 'warning',
      icon: <Activity className="w-4 h-4" />
    },
    {
      id: 'storage',
      name: 'Stockage',
      value: 35,
      max: 100,
      unit: '%',
      status: 'good',
      icon: <HardDrive className="w-4 h-4" />
    },
    {
      id: 'bandwidth',
      name: 'Bande passante',
      value: 22,
      max: 100,
      unit: '%',
      status: 'good',
      icon: <Wifi className="w-4 h-4" />
    }
  ]);

  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      // Update metrics with random variations
      setMetrics(prev => prev.map(metric => {
        const variation = (Math.random() - 0.5) * 10;
        let newValue = Math.max(0, Math.min(100, metric.value + variation));
        
        let status: SystemMetric['status'] = 'good';
        if (newValue > 80) status = 'critical';
        else if (newValue > 60) status = 'warning';

        return { ...metric, value: newValue, status };
      }));

      // Update service response times
      setServices(prev => prev.map(service => ({
        ...service,
        responseTime: Math.max(50, service.responseTime + (Math.random() - 0.5) * 100),
        lastCheck: new Date()
      })));

      setLastUpdate(new Date());
    }, 5000); // Update every 5 seconds

    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status: SystemService['status']) => {
    switch (status) {
      case 'online':
        return 'text-green-500';
      case 'warning':
        return 'text-yellow-500';
      case 'offline':
        return 'text-red-500';
      case 'maintenance':
        return 'text-blue-500';
      default:
        return 'text-gray-500';
    }
  };

  const getStatusIcon = (status: SystemService['status']) => {
    switch (status) {
      case 'online':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'warning':
        return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
      case 'offline':
        return <XCircle className="w-4 h-4 text-red-500" />;
      case 'maintenance':
        return <Clock className="w-4 h-4 text-blue-500" />;
      default:
        return <XCircle className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusBadge = (status: SystemService['status']) => {
    switch (status) {
      case 'online':
        return <Badge className="bg-green-100 text-green-800 border-green-200">En ligne</Badge>;
      case 'warning':
        return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">Attention</Badge>;
      case 'offline':
        return <Badge className="bg-red-100 text-red-800 border-red-200">Hors ligne</Badge>;
      case 'maintenance':
        return <Badge className="bg-blue-100 text-blue-800 border-blue-200">Maintenance</Badge>;
      default:
        return <Badge variant="secondary">Inconnu</Badge>;
    }
  };

  const getMetricColor = (status: SystemMetric['status']) => {
    switch (status) {
      case 'good':
        return 'text-green-600';
      case 'warning':
        return 'text-yellow-600';
      case 'critical':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  const getProgressColor = (status: SystemMetric['status']) => {
    switch (status) {
      case 'critical':
        return 'bg-red-500';
      case 'warning':
        return 'bg-yellow-500';
      default:
        return 'bg-green-500';
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    // API: refreshSystemStatus()
    await new Promise(resolve => setTimeout(resolve, 1000));
    setLastUpdate(new Date());
    setIsRefreshing(false);
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* System Overview */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="flex items-center space-x-2">
              <Activity className="w-5 h-5" />
              <span>État du Système</span>
            </CardTitle>
            <CardDescription>
              Surveillance en temps réel des services
            </CardDescription>
          </div>
          <div className="flex items-center space-x-3">
            <div className="text-right">
              <p className="text-xs text-gray-500">Dernière mise à jour</p>
              <p className="text-sm font-medium">
                {lastUpdate.toLocaleTimeString('fr-FR')}
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              disabled={isRefreshing}
            >
              {isRefreshing ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                >
                  <Zap className="w-4 h-4" />
                </motion.div>
              ) : (
                <Zap className="w-4 h-4" />
              )}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {services.map((service, index) => (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="p-3 border rounded-lg hover:bg-gray-50 transition-colors duration-200"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <div className={getStatusColor(service.status)}>
                      {service.icon}
                    </div>
                    <span className="font-medium text-sm">{service.name}</span>
                  </div>
                  {getStatusIcon(service.status)}
                </div>
                
                <div className="space-y-1">
                  {getStatusBadge(service.status)}
                  <p className="text-xs text-gray-500">{service.description}</p>
                  <div className="flex justify-between text-xs">
                    <span>Uptime: {service.uptime}</span>
                    <span>{service.responseTime}ms</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* System Metrics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Cpu className="w-5 h-5" />
            <span>Métriques Système</span>
          </CardTitle>
          <CardDescription>
            Utilisation des ressources serveur
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {metrics.map((metric, index) => (
              <motion.div
                key={metric.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className="space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className={getMetricColor(metric.status)}>
                      {metric.icon}
                    </div>
                    <span className="text-sm font-medium">{metric.name}</span>
                  </div>
                  <span className={`text-sm font-bold ${getMetricColor(metric.status)}`}>
                    {metric.value.toFixed(1)}{metric.unit}
                  </span>
                </div>
                
                <div className="space-y-1">
                  <Progress 
                    value={metric.value} 
                    className="h-2"
                  />
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>0{metric.unit}</span>
                    <span>{metric.max}{metric.unit}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Alerts & Incidents */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <AlertTriangle className="w-5 h-5" />
            <span>Alertes & Incidents</span>
          </CardTitle>
          <CardDescription>
            Incidents actifs et résolutions récentes
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <AnimatePresence>
              {services.filter(s => s.status === 'warning' || s.status === 'offline').length === 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex items-center justify-center py-8 text-center"
                >
                  <div>
                    <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-3" />
                    <h4 className="text-lg font-medium text-gray-900 mb-2">
                      Tous les systèmes opérationnels
                    </h4>
                    <p className="text-gray-600">
                      Aucun incident actuel. Tous les services fonctionnent normalement.
                    </p>
                  </div>
                </motion.div>
              ) : (
                services
                  .filter(s => s.status === 'warning' || s.status === 'offline')
                  .map((service, index) => (
                    <motion.div
                      key={service.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center justify-between p-3 border border-yellow-200 bg-yellow-50 rounded-lg"
                    >
                      <div className="flex items-center space-x-3">
                        <AlertTriangle className="w-5 h-5 text-yellow-600" />
                        <div>
                          <h4 className="font-medium text-yellow-900">
                            {service.name} - {service.status === 'warning' ? 'Performance dégradée' : 'Service indisponible'}
                          </h4>
                          <p className="text-sm text-yellow-700">
                            Temps de réponse élevé: {service.responseTime}ms
                          </p>
                        </div>
                      </div>
                      <Button size="sm" variant="outline">
                        Investiguer
                      </Button>
                    </motion.div>
                  ))
              )}
            </AnimatePresence>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};