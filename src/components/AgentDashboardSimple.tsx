import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Users, CheckCircle, DollarSign, RefreshCw, Search, Download } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Input } from './ui/input';
import { toast } from 'sonner';

export function AgentDashboardSimple() {
  const [activeTab, setActiveTab] = useState('overview');

  const mockData = {
    todayReservations: 8,
    pendingValidations: 3,
    totalRevenue: 245000,
    refundsToday: 2
  };

  return (
    <div className="space-y-6">
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Réservations du jour</p>
                  <p className="text-2xl font-semibold text-gray-900">
                    {mockData.todayReservations}
                  </p>
                </div>
                <div className="p-3 bg-green-100 rounded-lg">
                  <Users className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Validations en attente</p>
                  <p className="text-2xl font-semibold text-gray-900">
                    {mockData.pendingValidations}
                  </p>
                </div>
                <div className="p-3 bg-blue-100 rounded-lg">
                  <CheckCircle className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Revenus du jour</p>
                  <p className="text-2xl font-semibold text-gray-900">
                    {mockData.totalRevenue.toLocaleString()} XAF
                  </p>
                </div>
                <div className="p-3 bg-yellow-100 rounded-lg">
                  <DollarSign className="w-6 h-6 text-yellow-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Remboursements</p>
                  <p className="text-2xl font-semibold text-gray-900">
                    {mockData.refundsToday}
                  </p>
                </div>
                <div className="p-3 bg-red-100 rounded-lg">
                  <RefreshCw className="w-6 h-6 text-red-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
          <TabsTrigger value="passengers">Passagers</TabsTrigger>
          <TabsTrigger value="validation">Validation</TabsTrigger>
          <TabsTrigger value="refunds">Remboursements</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Tableau de bord Agent (Contrôleur)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <h3 className="font-medium text-green-800 mb-2">Fonctionnalités disponibles :</h3>
                  <ul className="text-sm text-green-700 space-y-1">
                    <li>• Validation des listes de passagers</li>
                    <li>• Gestion des remboursements</li>
                    <li>• Saisie de nouvelles réservations</li>
                    <li>• Contrôle qualité embarquement</li>
                  </ul>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Button 
                    className="h-24 flex flex-col items-center justify-center bg-green-600 hover:bg-green-700"
                    onClick={() => setActiveTab('validation')}
                  >
                    <CheckCircle className="w-8 h-8 mb-2" />
                    Valider les listes
                  </Button>
                  <Button 
                    variant="outline"
                    className="h-24 flex flex-col items-center justify-center"
                    onClick={() => setActiveTab('refunds')}
                  >
                    <RefreshCw className="w-8 h-8 mb-2" />
                    Gérer les remboursements
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="passengers" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Gestion des passagers</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex gap-4">
                  <Input placeholder="Rechercher un passager..." className="flex-1" />
                  <Button>
                    <Search className="w-4 h-4 mr-2" />
                    Rechercher
                  </Button>
                </div>
                <p className="text-gray-600">Liste des passagers et réservations du jour...</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="validation" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Validation des listes de passagers</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { id: 1, route: 'Libreville → Port-Gentil', departure: '08:00', passengers: '42/50' },
                  { id: 2, route: 'Libreville → Franceville', departure: '06:00', passengers: '38/45' },
                  { id: 3, route: 'Libreville → Oyem', departure: '14:00', passengers: '25/40' }
                ].map(trip => (
                  <div key={trip.id} className="border rounded-lg p-4 flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">{trip.route}</h4>
                      <p className="text-sm text-gray-500">
                        Départ: {trip.departure} • Passagers: {trip.passengers}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <Download className="w-4 h-4 mr-2" />
                        PDF
                      </Button>
                      <Button 
                        size="sm" 
                        className="bg-green-600 hover:bg-green-700"
                        onClick={() => toast.success('Liste validée avec succès')}
                      >
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Valider
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="refunds" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Gestion des remboursements</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <p className="text-sm text-yellow-800">
                    <strong>Règle des 48h :</strong> Les remboursements ne sont autorisés que si la demande 
                    est effectuée au moins 48h avant le départ.
                  </p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input placeholder="Numéro de ticket" />
                  <Input placeholder="Montant" type="number" />
                </div>
                
                <Button 
                  className="w-full bg-red-600 hover:bg-red-700"
                  onClick={() => toast.success('Demande de remboursement traitée')}
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Traiter le remboursement
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}