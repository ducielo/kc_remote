import React, { useState } from 'react';
import { motion } from 'motion/react';
import { X, Home, Users, Settings, BarChart3, LogOut } from 'lucide-react';
import { DashboardHome } from './DashboardHome';
import { getAdminMockData } from './mockData';

interface MiniAdminDashboardProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MiniAdminDashboard: React.FC<MiniAdminDashboardProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState('home');
  const [incidentNotifications, setIncidentNotifications] = useState<any[]>([]);
  const adminData = getAdminMockData();

  // Écouter les événements d'incidents
  React.useEffect(() => {
    const handleIncidentReported = async (event: CustomEvent) => {
      const incident = event.detail;
      setIncidentNotifications(prev => [incident, ...prev.slice(0, 4)]);
      
      // Notification toast pour l'admin
      const { toast } = await import('sonner');
      toast.warning(`Nouvel incident signalé: ${incident.type}`, {
        description: `Par ${incident.driverId} - Bus ${incident.busId}`,
        action: {
          label: 'Voir détails',
          onClick: () => console.log('Détails incident:', incident)
        }
      });
    };

    window.addEventListener('incident.reported', handleIncidentReported as EventListener);
    return () => {
      window.removeEventListener('incident.reported', handleIncidentReported as EventListener);
    };
  }, []);

  const tabs = [
    { id: 'home', label: 'Accueil', icon: Home },
    { id: 'users', label: 'Utilisateurs', icon: Users },
    { id: 'analytics', label: 'Analyses', icon: BarChart3 },
    { id: 'settings', label: 'Paramètres', icon: Settings },
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-white rounded-xl shadow-2xl w-full max-w-7xl h-[90vh] overflow-hidden flex"
      >
        {/* Sidebar */}
        <div className="w-64 bg-blue-600 text-white p-6">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl font-semibold">Admin Dashboard</h2>
            <button
              onClick={onClose}
              className="text-white hover:text-gray-300 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <nav className="space-y-2">
            {tabs.map((tab) => {
              const IconComponent = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                    activeTab === tab.id
                      ? 'bg-white bg-opacity-20'
                      : 'hover:bg-white hover:bg-opacity-10'
                  }`}
                >
                  <IconComponent className="w-5 h-5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Notifications d'incidents */}
          {incidentNotifications.length > 0 && (
            <div className="mt-6 bg-red-100 border border-red-200 rounded-lg p-3">
              <h4 className="font-medium mb-2 text-sm text-red-800">🚨 Incidents récents</h4>
              <div className="text-xs space-y-1 max-h-32 overflow-y-auto">
                {incidentNotifications.slice(0, 3).map((incident, index) => (
                  <div key={index} className="text-red-700 bg-white bg-opacity-50 p-2 rounded">
                    <div className="font-medium">{incident.type}</div>
                    <div className="text-red-600">{incident.driverId} - {incident.busId}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="mt-6 pt-4 border-t border-blue-500">
            <button
              onClick={onClose}
              className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-white hover:bg-opacity-10 transition-colors"
            >
              <LogOut className="w-5 h-5" />
              <span>Déconnexion</span>
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-6 overflow-y-auto">
          {activeTab === 'home' && (
            <DashboardHome
              userRole={adminData.userRole}
              userName={adminData.userName}
              todayTasks={adminData.todayTasks}
              quickStats={adminData.quickStats}
              todaySchedule={adminData.todaySchedule}
            />
          )}

          {activeTab === 'users' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-semibold text-gray-900">Gestion des Utilisateurs</h3>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  Ajouter Utilisateur
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="text-2xl font-semibold text-blue-800">8</div>
                  <div className="text-sm text-blue-600">Administrateurs</div>
                </div>
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="text-2xl font-semibold text-green-800">25</div>
                  <div className="text-sm text-green-600">Agents</div>
                </div>
                <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                  <div className="text-2xl font-semibold text-orange-800">47</div>
                  <div className="text-sm text-orange-600">Chauffeurs</div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow">
                <div className="p-4 border-b">
                  <div className="flex items-center space-x-4">
                    <input
                      type="text"
                      placeholder="Rechercher un utilisateur..."
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg"
                    />
                    <select className="px-3 py-2 border border-gray-300 rounded-lg">
                      <option>Tous les rôles</option>
                      <option>Administrateur</option>
                      <option>Agent</option>
                      <option>Chauffeur</option>
                    </select>
                  </div>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="text-left p-4">Utilisateur</th>
                        <th className="text-left p-4">Rôle</th>
                        <th className="text-left p-4">Email</th>
                        <th className="text-left p-4">Statut</th>
                        <th className="text-left p-4">Dernière connexion</th>
                        <th className="text-left p-4">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        { name: 'Marie Nguema', role: 'Agent', email: 'marie.nguema@karis.ga', status: 'Actif', lastLogin: '2024-01-15 14:30' },
                        { name: 'Jean Obame', role: 'Chauffeur', email: 'jean.obame@karis.ga', status: 'Actif', lastLogin: '2024-01-15 08:15' },
                        { name: 'Sophie Andeme', role: 'Administrateur', email: 'sophie.andeme@karis.ga', status: 'Actif', lastLogin: '2024-01-15 16:45' },
                        { name: 'Pierre Nze', role: 'Chauffeur', email: 'pierre.nze@karis.ga', status: 'Inactif', lastLogin: '2024-01-10 12:00' },
                      ].map((user) => (
                        <tr key={user.email} className="border-t">
                          <td className="p-4">
                            <div className="flex items-center space-x-3">
                              <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                                {user.name.split(' ').map(n => n[0]).join('')}
                              </div>
                              <span className="font-medium">{user.name}</span>
                            </div>
                          </td>
                          <td className="p-4">
                            <span className={`px-2 py-1 text-xs rounded-full ${
                              user.role === 'Administrateur' ? 'bg-blue-100 text-blue-800' :
                              user.role === 'Agent' ? 'bg-green-100 text-green-800' :
                              'bg-orange-100 text-orange-800'
                            }`}>
                              {user.role}
                            </span>
                          </td>
                          <td className="p-4 text-gray-600">{user.email}</td>
                          <td className="p-4">
                            <span className={`px-2 py-1 text-xs rounded-full ${
                              user.status === 'Actif' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                            }`}>
                              {user.status}
                            </span>
                          </td>
                          <td className="p-4 text-gray-600 text-sm">{user.lastLogin}</td>
                          <td className="p-4 space-x-2">
                            <button className="text-blue-600 hover:text-blue-800 text-sm">Modifier</button>
                            <button className="text-red-600 hover:text-red-800 text-sm">Désactiver</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'analytics' && (
            <div className="space-y-6">
              <h3 className="text-2xl font-semibold text-gray-900">Analyses & Rapports</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white border rounded-lg p-4">
                  <div className="text-2xl font-semibold text-gray-900">1,247</div>
                  <div className="text-sm text-gray-600">Voyages ce mois</div>
                  <div className="text-xs text-green-600 mt-1">+12% vs mois dernier</div>
                </div>
                <div className="bg-white border rounded-lg p-4">
                  <div className="text-2xl font-semibold text-gray-900">45,678</div>
                  <div className="text-sm text-gray-600">Passagers transportés</div>
                  <div className="text-xs text-green-600 mt-1">+8% vs mois dernier</div>
                </div>
                <div className="bg-white border rounded-lg p-4">
                  <div className="text-2xl font-semibold text-gray-900">18.5M</div>
                  <div className="text-sm text-gray-600">Chiffre d'affaires (FCFA)</div>
                  <div className="text-xs text-green-600 mt-1">+15% vs mois dernier</div>
                </div>
                <div className="bg-white border rounded-lg p-4">
                  <div className="text-2xl font-semibold text-gray-900">87%</div>
                  <div className="text-sm text-gray-600">Taux d'occupation</div>
                  <div className="text-xs text-red-600 mt-1">-3% vs mois dernier</div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white border rounded-lg p-6">
                  <h4 className="font-medium text-gray-900 mb-4">Routes Populaires</h4>
                  <div className="space-y-3">
                    {[
                      { route: 'Libreville ↔ Port-Gentil', trips: 324, revenue: 4860000 },
                      { route: 'Libreville ↔ Franceville', trips: 198, revenue: 4950000 },
                      { route: 'Libreville ↔ Oyem', trips: 156, revenue: 3120000 },
                      { route: 'Port-Gentil ↔ Franceville', trips: 89, revenue: 2670000 },
                    ].map((route) => (
                      <div key={route.route} className="flex items-center justify-between py-2">
                        <div>
                          <div className="font-medium text-gray-900">{route.route}</div>
                          <div className="text-sm text-gray-600">{route.trips} voyages</div>
                        </div>
                        <div className="text-blue-600 font-medium">
                          {(route.revenue / 1000000).toFixed(1)}M FCFA
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white border rounded-lg p-6">
                  <h4 className="font-medium text-gray-900 mb-4">Performance Mensuelle</h4>
                  <div className="space-y-4">
                    {[
                      { month: 'Janvier', trips: 1247, revenue: 18.5, growth: 12 },
                      { month: 'Décembre', trips: 1112, revenue: 16.8, growth: 8 },
                      { month: 'Novembre', trips: 1034, revenue: 15.6, growth: -2 },
                      { month: 'Octobre', trips: 1156, revenue: 17.2, growth: 15 },
                    ].map((month) => (
                      <div key={month.month} className="flex items-center justify-between">
                        <div>
                          <div className="font-medium text-gray-900">{month.month}</div>
                          <div className="text-sm text-gray-600">{month.trips} voyages</div>
                        </div>
                        <div className="text-right">
                          <div className="font-medium text-gray-900">{month.revenue}M FCFA</div>
                          <div className={`text-sm ${month.growth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {month.growth >= 0 ? '+' : ''}{month.growth}%
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="space-y-6">
              <h3 className="text-2xl font-semibold text-gray-900">Paramètres Système</h3>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-6">
                  <div className="bg-white border rounded-lg p-6">
                    <h4 className="font-medium text-gray-900 mb-4">Configuration Générale</h4>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium text-gray-900">Maintenance programmée</div>
                          <div className="text-sm text-gray-600">Activer le mode maintenance</div>
                        </div>
                        <div className="w-12 h-6 bg-gray-200 rounded-full relative">
                          <div className="w-5 h-5 bg-white rounded-full absolute left-0.5 top-0.5 shadow"></div>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium text-gray-900">Notifications SMS</div>
                          <div className="text-sm text-gray-600">Notifications aux passagers</div>
                        </div>
                        <div className="w-12 h-6 bg-blue-600 rounded-full relative">
                          <div className="w-5 h-5 bg-white rounded-full absolute right-0.5 top-0.5 shadow"></div>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium text-gray-900">Suivi GPS temps réel</div>
                          <div className="text-sm text-gray-600">Localisation des bus</div>
                        </div>
                        <div className="w-12 h-6 bg-blue-600 rounded-full relative">
                          <div className="w-5 h-5 bg-white rounded-full absolute right-0.5 top-0.5 shadow"></div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white border rounded-lg p-6">
                    <h4 className="font-medium text-gray-900 mb-4">Tarification</h4>
                    <div className="space-y-3">
                      {[
                        { route: 'Libreville → Port-Gentil', price: 15000 },
                        { route: 'Libreville → Franceville', price: 25000 },
                        { route: 'Libreville → Oyem', price: 20000 },
                        { route: 'Port-Gentil → Franceville', price: 30000 },
                      ].map((route) => (
                        <div key={route.route} className="flex items-center justify-between">
                          <span className="text-gray-900">{route.route}</span>
                          <div className="flex items-center space-x-2">
                            <input
                              type="number"
                              value={route.price}
                              className="w-24 px-2 py-1 border border-gray-300 rounded text-sm"
                            />
                            <span className="text-sm text-gray-600">FCFA</span>
                          </div>
                        </div>
                      ))}
                    </div>
                    <button className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors">
                      Mettre à jour les tarifs
                    </button>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="bg-white border rounded-lg p-6">
                    <h4 className="font-medium text-gray-900 mb-4">Gestion de la Flotte</h4>
                    <div className="space-y-3">
                      {[
                        { id: 'KCB-001', status: 'En service', route: 'Libreville-Port-Gentil' },
                        { id: 'KCB-002', status: 'Maintenance', route: 'Indisponible' },
                        { id: 'KCB-003', status: 'En service', route: 'Libreville-Franceville' },
                        { id: 'KCB-004', status: 'En service', route: 'Libreville-Oyem' },
                        { id: 'KCB-005', status: 'Pause', route: 'Libreville' },
                      ].map((bus) => (
                        <div key={bus.id} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                          <div>
                            <div className="font-medium text-gray-900">{bus.id}</div>
                            <div className="text-sm text-gray-600">{bus.route}</div>
                          </div>
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            bus.status === 'En service' ? 'bg-green-100 text-green-800' :
                            bus.status === 'Maintenance' ? 'bg-red-100 text-red-800' :
                            'bg-yellow-100 text-yellow-800'
                          }`}>
                            {bus.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-white border rounded-lg p-6">
                    <h4 className="font-medium text-gray-900 mb-4">Sauvegarde & Sécurité</h4>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium text-gray-900">Dernière sauvegarde</div>
                          <div className="text-sm text-gray-600">{new Date().toLocaleString()}</div>
                        </div>
                        <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">
                          Réussie
                        </span>
                      </div>
                      <button className="w-full px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors">
                        Lancer une sauvegarde
                      </button>
                      <div className="text-xs text-gray-500">
                        Sauvegarde automatique quotidienne à 02:00
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};