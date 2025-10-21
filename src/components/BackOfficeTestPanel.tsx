import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { 
  Play, 
  CheckCircle, 
  XCircle, 
  Loader2, 
  Settings, 
  Activity,
  Users,
  Truck,
  BarChart3,
  Shield,
  AlertTriangle
} from 'lucide-react';
import { toast } from 'sonner';
import { SimpleBackOfficeTest } from './SimpleBackOfficeTest';

interface TestResult {
  name: string;
  status: 'pending' | 'running' | 'success' | 'error';
  message?: string;
  duration?: number;
}

export const BackOfficeTestPanel: React.FC = () => {
  const [tests, setTests] = useState<TestResult[]>([
    { name: 'Initialisation BackOffice', status: 'pending' },
    { name: 'Module Admin', status: 'pending' },
    { name: 'Module Agent', status: 'pending' },
    { name: 'Module Chauffeur', status: 'pending' },
    { name: 'Permissions Admin', status: 'pending' },
    { name: 'Intégration Dashboard', status: 'pending' },
    { name: 'EventBus', status: 'pending' },
    { name: 'Logger', status: 'pending' }
  ]);

  const [isRunning, setIsRunning] = useState(false);
  const [globalResult, setGlobalResult] = useState<'idle' | 'running' | 'success' | 'error'>('idle');

  const updateTest = (name: string, updates: Partial<TestResult>) => {
    setTests(prev => prev.map(test => 
      test.name === name ? { ...test, ...updates } : test
    ));
  };

  const runTest = async (testName: string): Promise<boolean> => {
    updateTest(testName, { status: 'running' });
    const startTime = Date.now();

    try {
      switch (testName) {
        case 'Initialisation BackOffice':
          // Test d'initialisation
          const { BackOfficeManager } = await import('../back-office');
          BackOfficeManager.initialize({
            logLevel: 1,
            maxLogEntries: 100,
            enableEventBusLogging: true
          });
          await new Promise(resolve => setTimeout(resolve, 500));
          break;

        case 'Module Admin':
          const { BackOfficeFactory } = await import('../back-office');
          const adminModule = await BackOfficeFactory.createAdminModule();
          if (!adminModule) throw new Error('Module admin non créé');
          break;

        case 'Module Agent':
          const { BackOfficeFactory: Factory2 } = await import('../back-office');
          const agentModule = await Factory2.createAgentModule('test-agent');
          if (!agentModule) throw new Error('Module agent non créé');
          break;

        case 'Module Chauffeur':
          const { BackOfficeFactory: Factory3 } = await import('../back-office');
          const driverModule = await Factory3.createDriverModule('test-driver');
          if (!driverModule) throw new Error('Module chauffeur non créé');
          break;

        case 'Permissions Admin':
          // Test que l'admin peut accéder aux fonctions agent et chauffeur
          const { BackOfficeFactory: Factory4 } = await import('../back-office');
          const admin = await Factory4.createAdminModule();
          const canDoAgent = typeof admin.performAgentActions === 'function';
          const canDoDriver = typeof admin.performDriverActions === 'function';
          if (!canDoAgent || !canDoDriver) {
            throw new Error('Admin ne peut pas accéder à toutes les fonctions');
          }
          break;

        case 'Intégration Dashboard':
          // Test de l'intégration avec les dashboards
          if (!(window as any).backOfficeActions) {
            throw new Error('Actions back-office non disponibles');
          }
          break;

        case 'EventBus':
          const { eventBus } = await import('../back-office');
          eventBus.publish('test:event', { test: true });
          const stats = eventBus.getStats();
          if (!stats) throw new Error('EventBus non fonctionnel');
          break;

        case 'Logger':
          const { logger } = await import('../back-office');
          logger.info('test', 'Test du logger');
          const logStats = logger.getStats();
          if (!logStats) throw new Error('Logger non fonctionnel');
          break;

        default:
          throw new Error(`Test ${testName} non implémenté`);
      }

      const duration = Date.now() - startTime;
      updateTest(testName, { 
        status: 'success', 
        message: 'OK',
        duration 
      });
      return true;

    } catch (error) {
      const duration = Date.now() - startTime;
      const message = error instanceof Error ? error.message : 'Erreur inconnue';
      updateTest(testName, { 
        status: 'error', 
        message,
        duration 
      });
      return false;
    }
  };

  const runAllTests = async () => {
    setIsRunning(true);
    setGlobalResult('running');
    
    const results: boolean[] = [];
    
    for (const test of tests) {
      const result = await runTest(test.name);
      results.push(result);
      
      // Petite pause pour l'UX
      await new Promise(resolve => setTimeout(resolve, 200));
    }

    const allPassed = results.every(r => r);
    setGlobalResult(allPassed ? 'success' : 'error');
    setIsRunning(false);

    if (allPassed) {
      toast.success('🎉 Tous les tests sont passés ! Le back-office fonctionne parfaitement.');
    } else {
      toast.error('❌ Certains tests ont échoué. Vérifiez les détails.');
    }
  };

  const resetTests = () => {
    setTests(prev => prev.map(test => ({ 
      ...test, 
      status: 'pending', 
      message: undefined,
      duration: undefined 
    })));
    setGlobalResult('idle');
  };

  const getStatusIcon = (status: TestResult['status']) => {
    switch (status) {
      case 'running':
        return <Loader2 className="w-4 h-4 animate-spin text-blue-500" />;
      case 'success':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'error':
        return <XCircle className="w-4 h-4 text-red-500" />;
      default:
        return <div className="w-4 h-4 rounded-full bg-gray-300" />;
    }
  };

  const getStatusColor = (status: TestResult['status']) => {
    switch (status) {
      case 'running': return 'secondary';
      case 'success': return 'default';
      case 'error': return 'destructive';
      default: return 'outline';
    }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[#C03618] bg-opacity-10 rounded-lg">
              <Settings className="w-6 h-6 text-[#C03618]" />
            </div>
            <div>
              <CardTitle>Test Back-Office Karis Continental</CardTitle>
              <CardDescription>
                Vérification du fonctionnement du système back-office
              </CardDescription>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {globalResult !== 'idle' && (
              <Badge variant={
                globalResult === 'running' ? 'secondary' :
                globalResult === 'success' ? 'default' : 'destructive'
              }>
                {globalResult === 'running' && <Loader2 className="w-3 h-3 animate-spin mr-1" />}
                {globalResult === 'running' ? 'En cours...' :
                 globalResult === 'success' ? 'Succès' : 'Échec'}
              </Badge>
            )}
            
            <Button
              onClick={runAllTests}
              disabled={isRunning}
              className="bg-[#C03618] hover:bg-[#A02E14]"
            >
              {isRunning ? (
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
              ) : (
                <Play className="w-4 h-4 mr-2" />
              )}
              {isRunning ? 'Tests en cours...' : 'Lancer tous les tests'}
            </Button>
            
            <Button
              onClick={resetTests}
              variant="outline"
              disabled={isRunning}
            >
              Reset
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <Tabs defaultValue="tests" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="tests">Tests</TabsTrigger>
            <TabsTrigger value="modules">Modules</TabsTrigger>
            <TabsTrigger value="stats">Statistiques</TabsTrigger>
          </TabsList>

          <TabsContent value="tests" className="space-y-4">
            {/* Test rapide en haut */}
            <div className="mb-6">
              <SimpleBackOfficeTest />
            </div>
            
            <div className="grid gap-3">
              {tests.map((test, index) => (
                <motion.div
                  key={test.name}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50"
                >
                  <div className="flex items-center gap-3">
                    {getStatusIcon(test.status)}
                    <div>
                      <div className="font-medium">{test.name}</div>
                      {test.message && (
                        <div className={`text-sm ${
                          test.status === 'error' ? 'text-red-600' : 'text-gray-600'
                        }`}>
                          {test.message}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {test.duration && (
                      <span className="text-xs text-gray-500">
                        {test.duration}ms
                      </span>
                    )}
                    <Badge variant={getStatusColor(test.status)} className="text-xs">
                      {test.status}
                    </Badge>
                  </div>
                </motion.div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="modules" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-2">
                    <Shield className="w-5 h-5 text-red-600" />
                    <CardTitle className="text-sm">Admin</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-xs text-gray-600 space-y-1">
                    <div>• Gestion complète</div>
                    <div>• Tous les accès</div>
                    <div>• Supervision temps réel</div>
                    <div>• Rapports avancés</div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-2">
                    <Users className="w-5 h-5 text-blue-600" />
                    <CardTitle className="text-sm">Agent</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-xs text-gray-600 space-y-1">
                    <div>• Gestion billets</div>
                    <div>• Enregistrement passagers</div>
                    <div>• Équipes terrain</div>
                    <div>• Réconciliation cash</div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-2">
                    <Truck className="w-5 h-5 text-green-600" />
                    <CardTitle className="text-sm">Chauffeur</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-xs text-gray-600 space-y-1">
                    <div>• Gestion trajets</div>
                    <div>• Inspections véhicule</div>
                    <div>• Tracking GPS</div>
                    <div>• Signalement urgences</div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="stats" className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center space-x-2">
                    <Activity className="w-4 h-4 text-[#C03618]" />
                    <div className="text-xs text-gray-600">Modules Actifs</div>
                  </div>
                  <div className="text-2xl font-bold">3</div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center space-x-2">
                    <BarChart3 className="w-4 h-4 text-blue-600" />
                    <div className="text-xs text-gray-600">Tests Passés</div>
                  </div>
                  <div className="text-2xl font-bold">
                    {tests.filter(t => t.status === 'success').length}/
                    {tests.length}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <div className="text-xs text-gray-600">Statut</div>
                  </div>
                  <div className="text-2xl font-bold">
                    {globalResult === 'success' ? '✓' : 
                     globalResult === 'error' ? '✗' : '○'}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center space-x-2">
                    <AlertTriangle className="w-4 h-4 text-yellow-600" />
                    <div className="text-xs text-gray-600">Erreurs</div>
                  </div>
                  <div className="text-2xl font-bold">
                    {tests.filter(t => t.status === 'error').length}
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Architecture Back-Office</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-xs text-gray-600 space-y-2">
                  <div><strong>Services:</strong> AdminService, AgentService, DriverService, TripService, UserService, VehicleService</div>
                  <div><strong>Modules:</strong> AdminModule, AgentModule, DriverModule</div>
                  <div><strong>Utilitaires:</strong> EventBus, Logger, BackOfficeFactory</div>
                  <div><strong>Intégration:</strong> DashboardIntegration, useBackOffice hook</div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};