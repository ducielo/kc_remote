import React, { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { CheckCircle, XCircle, Loader2, Play } from 'lucide-react';
import { toast } from 'sonner';

export const SimpleBackOfficeTest: React.FC = () => {
  const [isTestingAdmin, setIsTestingAdmin] = useState(false);
  const [adminResult, setAdminResult] = useState<'idle' | 'success' | 'error'>('idle');

  const testAdminModule = async () => {
    setIsTestingAdmin(true);
    setAdminResult('idle');

    try {
      console.log('🚀 Test du module Admin...');
      
      // Test d'import
      const { BackOfficeFactory, BackOfficeManager } = await import('../back-office');
      console.log('✅ Import réussi');

      // Test d'initialisation du manager
      BackOfficeManager.initialize({
        logLevel: 1,
        maxLogEntries: 100,
        enableEventBusLogging: true
      });
      console.log('✅ BackOfficeManager initialisé');

      // Test de création du module admin
      const adminModule = await BackOfficeFactory.createAdminModule();
      console.log('✅ AdminModule créé:', adminModule);

      // Test d'une méthode simple
      const result = await adminModule.getDashboardData();
      console.log('✅ getDashboardData réussi:', result);

      // Test des données mockées
      const trips = await adminModule.loadTrips();
      console.log('✅ loadTrips réussi:', trips);

      const users = await adminModule.loadUsers();
      console.log('✅ loadUsers réussi:', users);

      setAdminResult('success');
      toast.success('🎉 Module Admin fonctionne parfaitement !');

    } catch (error) {
      console.error('❌ Erreur test Admin:', error);
      setAdminResult('error');
      toast.error(`❌ Erreur: ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
    } finally {
      setIsTestingAdmin(false);
    }
  };

  const getStatusIcon = (status: 'idle' | 'success' | 'error') => {
    switch (status) {
      case 'success':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'error':
        return <XCircle className="w-4 h-4 text-red-500" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: 'idle' | 'success' | 'error') => {
    switch (status) {
      case 'success': return 'default';
      case 'error': return 'destructive';
      default: return 'outline';
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <div className="p-2 bg-[#C03618] bg-opacity-10 rounded-lg">
            <Play className="w-5 h-5 text-[#C03618]" />
          </div>
          Test Rapide Back-Office
        </CardTitle>
        <CardDescription>
          Test simple pour vérifier que le système back-office fonctionne
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="flex items-center justify-between p-4 border rounded-lg">
          <div className="flex items-center gap-3">
            {isTestingAdmin && <Loader2 className="w-4 h-4 animate-spin text-blue-500" />}
            {!isTestingAdmin && getStatusIcon(adminResult)}
            <div>
              <div className="font-medium">Module Administrateur</div>
              <div className="text-sm text-gray-600">
                Test d'initialisation et de fonctionnement de base
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Badge variant={getStatusColor(adminResult)} className="text-xs">
              {adminResult === 'idle' ? 'En attente' :
               adminResult === 'success' ? 'Succès' : 'Échec'}
            </Badge>
            <Button
              onClick={testAdminModule}
              disabled={isTestingAdmin}
              size="sm"
              className="bg-[#C03618] hover:bg-[#A02E14]"
            >
              {isTestingAdmin ? (
                <Loader2 className="w-3 h-3 animate-spin mr-1" />
              ) : (
                <Play className="w-3 h-3 mr-1" />
              )}
              {isTestingAdmin ? 'Test...' : 'Tester'}
            </Button>
          </div>
        </div>

        <div className="text-xs text-gray-500 bg-gray-50 p-3 rounded">
          <strong>Ce test vérifie :</strong>
          <ul className="mt-1 space-y-1 list-disc list-inside">
            <li>Import des modules back-office</li>
            <li>Initialisation du BackOfficeManager</li>
            <li>Création du module AdminModule</li>
            <li>Fonctionnement des méthodes de base</li>
          </ul>
        </div>

        {adminResult === 'success' && (
          <div className="text-sm text-green-700 bg-green-50 p-3 rounded border border-green-200">
            ✅ <strong>Succès !</strong> Le système back-office fonctionne correctement. 
            Vous pouvez maintenant utiliser tous les dashboards avec le back-office intégré.
          </div>
        )}

        {adminResult === 'error' && (
          <div className="text-sm text-red-700 bg-red-50 p-3 rounded border border-red-200">
            ❌ <strong>Erreur détectée.</strong> Vérifiez la console pour plus de détails.
            Le problème peut être dans l'import des modules ou la configuration.
          </div>
        )}
      </CardContent>
    </Card>
  );
};