import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  Route,
  MapPin,
  DollarSign,
  Clock,
  Settings,
  Plus,
  Edit,
  Save,
  X,
  AlertCircle,
  TrendingUp,
  TrendingDown,
  Percent,
  Calendar,
  Eye,
  ToggleLeft,
  ToggleRight,
  Trash2
} from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Switch } from './ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Separator } from './ui/separator';
import { toast } from 'sonner';
import { useOperationalData, type RouteConfig, type Promotion, type CancellationPolicy } from './contexts/OperationalDataContext';

export const AdminRouteManagement: React.FC = () => {
  const { routes, updateRouteConfig } = useOperationalData();

  // States
  const [activeTab, setActiveTab] = useState('routes');
  const [editingRoute, setEditingRoute] = useState<RouteConfig | null>(null);
  const [showRouteDialog, setShowRouteDialog] = useState(false);
  const [showPromotionDialog, setShowPromotionDialog] = useState(false);
  const [selectedRoute, setSelectedRoute] = useState<string>('');

  // Forms
  const [routeForm, setRouteForm] = useState({
    name: '',
    departure: '',
    arrival: '',
    distance: 0,
    estimatedDuration: 0,
    basePrice: 0,
    isActive: true,
    waypoints: [] as string[]
  });

  const [promotionForm, setPromotionForm] = useState({
    title: '',
    description: '',
    discount: 0,
    discountType: 'percentage' as 'percentage' | 'fixed',
    validFrom: '',
    validTo: '',
    isActive: true,
    conditions: [] as string[]
  });

  const [cancellationForm, setCancellationForm] = useState({
    name: '',
    rules: [
      { timeBeforeDeparture: 48, refundPercentage: 100 },
      { timeBeforeDeparture: 24, refundPercentage: 50 },
      { timeBeforeDeparture: 0, refundPercentage: 0 }
    ]
  });

  // Gabon provinces for routes
  const gabonProvinces = [
    'Libreville', 'Port-Gentil', 'Franceville', 'Oyem', 'Mouila',
    'Lambaréné', 'Tchibanga', 'Bitam', 'Gamba', 'Makokou'
  ];

  // Save route configuration
  const handleSaveRoute = async () => {
    if (!routeForm.name || !routeForm.departure || !routeForm.arrival) {
      toast.error('Veuillez remplir tous les champs obligatoires');
      return;
    }

    try {
      if (editingRoute) {
        await updateRouteConfig(editingRoute.id, {
          name: routeForm.name,
          departure: routeForm.departure,
          arrival: routeForm.arrival,
          distance: routeForm.distance,
          estimatedDuration: routeForm.estimatedDuration,
          basePrice: routeForm.basePrice,
          isActive: routeForm.isActive,
          waypoints: routeForm.waypoints
        });
        toast.success('Configuration de route mise à jour');
      } else {
        // API: createRouteConfig
        toast.success('Nouvelle route créée');
      }

      setShowRouteDialog(false);
      setEditingRoute(null);
      resetRouteForm();
    } catch (error) {
      toast.error('Erreur lors de la sauvegarde');
    }
  };

  // Save promotion
  const handleSavePromotion = async () => {
    if (!promotionForm.title || !selectedRoute) {
      toast.error('Veuillez remplir tous les champs obligatoires');
      return;
    }

    try {
      // API: createPromotion
      toast.success('Promotion créée avec succès');
      setShowPromotionDialog(false);
      resetPromotionForm();
    } catch (error) {
      toast.error('Erreur lors de la création de la promotion');
    }
  };

  // Update pricing in real-time
  const handleUpdatePricing = async (routeId: string, newPrice: number) => {
    try {
      await updateRouteConfig(routeId, { basePrice: newPrice });
      toast.success('Tarif mis à jour en temps réel');
    } catch (error) {
      toast.error('Erreur lors de la mise à jour');
    }
  };

  // Toggle route status
  const handleToggleRouteStatus = async (routeId: string, isActive: boolean) => {
    try {
      await updateRouteConfig(routeId, { isActive });
      toast.success(`Route ${isActive ? 'activée' : 'désactivée'}`);
    } catch (error) {
      toast.error('Erreur lors de la modification');
    }
  };

  const resetRouteForm = () => {
    setRouteForm({
      name: '',
      departure: '',
      arrival: '',
      distance: 0,
      estimatedDuration: 0,
      basePrice: 0,
      isActive: true,
      waypoints: []
    });
  };

  const resetPromotionForm = () => {
    setPromotionForm({
      title: '',
      description: '',
      discount: 0,
      discountType: 'percentage',
      validFrom: '',
      validTo: '',
      isActive: true,
      conditions: []
    });
  };

  const editRoute = (route: RouteConfig) => {
    setEditingRoute(route);
    setRouteForm({
      name: route.name,
      departure: route.departure,
      arrival: route.arrival,
      distance: route.distance,
      estimatedDuration: route.estimatedDuration,
      basePrice: route.basePrice,
      isActive: route.isActive,
      waypoints: [...route.waypoints]
    });
    setShowRouteDialog(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900">Paramétrage des routes et tarifs</h2>
          <p className="text-gray-600">Configurez les itinéraires, prix et politiques en temps réel</p>
        </div>
        <div className="flex space-x-2">
          <Button
            onClick={() => {
              setEditingRoute(null);
              resetRouteForm();
              setShowRouteDialog(true);
            }}
            style={{ backgroundColor: 'rgba(192, 54, 24, 0.9)' }}
          >
            <Plus className="w-4 h-4 mr-2" />
            Nouvelle route
          </Button>
          <Button
            onClick={() => setShowPromotionDialog(true)}
            variant="outline"
          >
            <Percent className="w-4 h-4 mr-2" />
            Nouvelle promotion
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="routes">Routes</TabsTrigger>
          <TabsTrigger value="pricing">Tarification</TabsTrigger>
          <TabsTrigger value="promotions">Promotions</TabsTrigger>
          <TabsTrigger value="policies">Politiques</TabsTrigger>
        </TabsList>

        {/* Routes Management */}
        <TabsContent value="routes" className="space-y-4">
          <div className="grid gap-4">
            {routes.map(route => (
              <Card key={route.id} className={`${route.isActive ? '' : 'opacity-60'}`}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <Route className="w-5 h-5" style={{ color: 'rgba(192, 54, 24, 0.9)' }} />
                        <h3 className="text-lg font-semibold">{route.name}</h3>
                        <Badge variant={route.isActive ? 'default' : 'secondary'}>
                          {route.isActive ? 'Active' : 'Inactive'}
                        </Badge>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                        <div>
                          <Label className="text-sm font-medium text-gray-600">Trajet</Label>
                          <p className="font-semibold">{route.departure} → {route.arrival}</p>
                        </div>
                        <div>
                          <Label className="text-sm font-medium text-gray-600">Distance</Label>
                          <p className="font-semibold">{route.distance} km</p>
                        </div>
                        <div>
                          <Label className="text-sm font-medium text-gray-600">Durée</Label>
                          <p className="font-semibold">{Math.floor(route.estimatedDuration / 60)}h{route.estimatedDuration % 60}min</p>
                        </div>
                        <div>
                          <Label className="text-sm font-medium text-gray-600">Tarif de base</Label>
                          <p className="font-semibold">{route.basePrice.toLocaleString()} FCFA</p>
                        </div>
                      </div>

                      {route.waypoints.length > 0 && (
                        <div>
                          <Label className="text-sm font-medium text-gray-600">Étapes</Label>
                          <div className="flex flex-wrap gap-2 mt-1">
                            {route.waypoints.map((waypoint, index) => (
                              <Badge key={index} variant="outline">
                                {waypoint}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center space-x-2 ml-4">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleToggleRouteStatus(route.id, !route.isActive)}
                      >
                        {route.isActive ? (
                          <ToggleRight className="w-4 h-4 text-green-600" />
                        ) : (
                          <ToggleLeft className="w-4 h-4 text-gray-400" />
                        )}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => editRoute(route)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Pricing Management */}
        <TabsContent value="pricing" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <DollarSign className="w-5 h-5" />
                <span>Ajustement des tarifs en temps réel</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {routes.filter(r => r.isActive).map(route => (
                  <div key={route.id} className="border rounded-lg p-4 bg-gray-50">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h3 className="font-medium">{route.name}</h3>
                        <p className="text-sm text-gray-600">{route.departure} → {route.arrival}</p>
                      </div>
                      <div className="text-right">
                        <Label className="text-sm font-medium text-gray-600">Tarif actuel</Label>
                        <p className="text-lg font-semibold">{route.basePrice.toLocaleString()} FCFA</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor={`price-${route.id}`}>Nouveau tarif</Label>
                        <div className="flex space-x-2">
                          <Input
                            id={`price-${route.id}`}
                            type="number"
                            defaultValue={route.basePrice}
                            placeholder="Nouveau prix"
                          />
                          <Button
                            size="sm"
                            onClick={(e) => {
                              const input = e.currentTarget.parentElement?.querySelector('input') as HTMLInputElement;
                              if (input) {
                                handleUpdatePricing(route.id, Number(input.value));
                              }
                            }}
                            style={{ backgroundColor: 'rgba(192, 54, 24, 0.9)' }}
                          >
                            <Save className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label>Actions rapides</Label>
                        <div className="flex space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleUpdatePricing(route.id, route.basePrice * 0.9)}
                          >
                            <TrendingDown className="w-4 h-4 mr-1" />
                            -10%
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleUpdatePricing(route.id, route.basePrice * 1.1)}
                          >
                            <TrendingUp className="w-4 h-4 mr-1" />
                            +10%
                          </Button>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label>Promotions actives</Label>
                        <div className="text-sm">
                          {route.promotions.filter(p => p.isActive).length > 0 ? (
                            <Badge variant="secondary">
                              {route.promotions.filter(p => p.isActive).length} promotion(s)
                            </Badge>
                          ) : (
                            <span className="text-gray-500">Aucune promotion</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Promotions Management */}
        <TabsContent value="promotions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Promotions actives</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {routes.map(route => 
                  route.promotions.filter(p => p.isActive).map(promotion => (
                    <div key={promotion.id} className="border rounded-lg p-4 bg-green-50 border-green-200">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <Percent className="w-4 h-4 text-green-600" />
                            <h3 className="font-medium">{promotion.title}</h3>
                            <Badge className="bg-green-100 text-green-800">
                              -{promotion.discount}{promotion.discountType === 'percentage' ? '%' : ' FCFA'}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600 mb-2">{promotion.description}</p>
                          <div className="text-xs text-gray-500">
                            Valide du {new Date(promotion.validFrom).toLocaleDateString()} 
                            au {new Date(promotion.validTo).toLocaleDateString()}
                          </div>
                        </div>
                        <div className="flex items-center space-x-2 ml-4">
                          <Button variant="outline" size="sm">
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button variant="outline" size="sm" className="text-red-600">
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Policies Management */}
        <TabsContent value="policies" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Politiques d'annulation</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {routes.map(route => (
                  <div key={route.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-medium">{route.name}</h3>
                      <Badge variant="outline">
                        {route.cancellationPolicy.name}
                      </Badge>
                    </div>

                    <div className="space-y-3">
                      {route.cancellationPolicy.rules.map((rule, index) => (
                        <div key={index} className="flex items-center justify-between bg-gray-50 rounded p-3">
                          <div className="flex items-center space-x-3">
                            <Clock className="w-4 h-4 text-gray-500" />
                            <span className="text-sm">
                              {rule.timeBeforeDeparture > 0 
                                ? `Plus de ${rule.timeBeforeDeparture}h avant le départ`
                                : 'Moins de 24h avant le départ'
                              }
                            </span>
                          </div>
                          <Badge variant={rule.refundPercentage === 100 ? 'default' : rule.refundPercentage > 0 ? 'secondary' : 'destructive'}>
                            {rule.refundPercentage}% remboursé
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Route Dialog */}
      <Dialog open={showRouteDialog} onOpenChange={setShowRouteDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editingRoute ? 'Modifier la route' : 'Nouvelle route'}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="routeName">Nom de la route *</Label>
                <Input
                  id="routeName"
                  value={routeForm.name}
                  onChange={(e) => setRouteForm(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Libreville - Port-Gentil"
                />
              </div>
              <div className="flex items-center space-x-2 pt-6">
                <Switch
                  checked={routeForm.isActive}
                  onCheckedChange={(checked) => setRouteForm(prev => ({ ...prev, isActive: checked }))}
                />
                <Label>Route active</Label>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="departure">Ville de départ *</Label>
                <Select value={routeForm.departure} onValueChange={(value) => setRouteForm(prev => ({ ...prev, departure: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner..." />
                  </SelectTrigger>
                  <SelectContent>
                    {gabonProvinces.map(city => (
                      <SelectItem key={city} value={city}>{city}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="arrival">Ville d'arrivée *</Label>
                <Select value={routeForm.arrival} onValueChange={(value) => setRouteForm(prev => ({ ...prev, arrival: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner..." />
                  </SelectTrigger>
                  <SelectContent>
                    {gabonProvinces.map(city => (
                      <SelectItem key={city} value={city}>{city}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label htmlFor="distance">Distance (km)</Label>
                <Input
                  id="distance"
                  type="number"
                  value={routeForm.distance}
                  onChange={(e) => setRouteForm(prev => ({ ...prev, distance: Number(e.target.value) }))}
                  placeholder="350"
                />
              </div>
              <div>
                <Label htmlFor="duration">Durée (minutes)</Label>
                <Input
                  id="duration"
                  type="number"
                  value={routeForm.estimatedDuration}
                  onChange={(e) => setRouteForm(prev => ({ ...prev, estimatedDuration: Number(e.target.value) }))}
                  placeholder="390"
                />
              </div>
              <div>
                <Label htmlFor="basePrice">Tarif de base (FCFA)</Label>
                <Input
                  id="basePrice"
                  type="number"
                  value={routeForm.basePrice}
                  onChange={(e) => setRouteForm(prev => ({ ...prev, basePrice: Number(e.target.value) }))}
                  placeholder="25000"
                />
              </div>
            </div>

            <div className="flex justify-end space-x-2">
              <Button
                variant="outline"
                onClick={() => {
                  setShowRouteDialog(false);
                  setEditingRoute(null);
                  resetRouteForm();
                }}
              >
                Annuler
              </Button>
              <Button
                onClick={handleSaveRoute}
                style={{ backgroundColor: 'rgba(192, 54, 24, 0.9)' }}
              >
                <Save className="w-4 h-4 mr-2" />
                {editingRoute ? 'Modifier' : 'Créer'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Promotion Dialog */}
      <Dialog open={showPromotionDialog} onOpenChange={setShowPromotionDialog}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Nouvelle promotion</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label htmlFor="promoRoute">Route concernée *</Label>
              <Select value={selectedRoute} onValueChange={setSelectedRoute}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner une route..." />
                </SelectTrigger>
                <SelectContent>
                  {routes.filter(r => r.isActive).map(route => (
                    <SelectItem key={route.id} value={route.id}>
                      {route.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="promoTitle">Titre de la promotion *</Label>
              <Input
                id="promoTitle"
                value={promotionForm.title}
                onChange={(e) => setPromotionForm(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Promotion de fin d'année"
              />
            </div>

            <div>
              <Label htmlFor="promoDescription">Description</Label>
              <Textarea
                id="promoDescription"
                value={promotionForm.description}
                onChange={(e) => setPromotionForm(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Décrivez les conditions de la promotion..."
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="discountType">Type de réduction</Label>
                <Select value={promotionForm.discountType} onValueChange={(value: any) => setPromotionForm(prev => ({ ...prev, discountType: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="percentage">Pourcentage</SelectItem>
                    <SelectItem value="fixed">Montant fixe</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="discount">Réduction</Label>
                <Input
                  id="discount"
                  type="number"
                  value={promotionForm.discount}
                  onChange={(e) => setPromotionForm(prev => ({ ...prev, discount: Number(e.target.value) }))}
                  placeholder={promotionForm.discountType === 'percentage' ? '20' : '5000'}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="validFrom">Valide à partir du</Label>
                <Input
                  id="validFrom"
                  type="date"
                  value={promotionForm.validFrom}
                  onChange={(e) => setPromotionForm(prev => ({ ...prev, validFrom: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="validTo">Valide jusqu'au</Label>
                <Input
                  id="validTo"
                  type="date"
                  value={promotionForm.validTo}
                  onChange={(e) => setPromotionForm(prev => ({ ...prev, validTo: e.target.value }))}
                />
              </div>
            </div>

            <div className="flex justify-end space-x-2">
              <Button
                variant="outline"
                onClick={() => {
                  setShowPromotionDialog(false);
                  resetPromotionForm();
                  setSelectedRoute('');
                }}
              >
                Annuler
              </Button>
              <Button
                onClick={handleSavePromotion}
                style={{ backgroundColor: 'rgba(192, 54, 24, 0.9)' }}
              >
                <Save className="w-4 h-4 mr-2" />
                Créer la promotion
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};