import React, { useState } from 'react';
import { motion } from 'motion/react';
import { X, Home, Bus, Download, AlertTriangle, LogOut, Wifi, WifiOff } from 'lucide-react';
import { DashboardHome } from './DashboardHome';
import { getDriverMockData } from './mockData';

interface MiniDriverDashboardProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MiniDriverDashboard: React.FC<MiniDriverDashboardProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState('home');
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const driverData = getDriverMockData();

  React.useEffect(() => {
    const handleOnlineStatus = () => setIsOnline(navigator.onLine);
    window.addEventListener('online', handleOnlineStatus);
    window.addEventListener('offline', handleOnlineStatus);
    
    return () => {
      window.removeEventListener('online', handleOnlineStatus);
      window.removeEventListener('offline', handleOnlineStatus);
    };
  }, []);

  const tabs = [
    { id: 'home', label: 'Accueil', icon: Home },
    { id: 'trips', label: 'Mes Trajets', icon: Bus },
    { id: 'passengers', label: 'Listes Passagers', icon: Download },
    { id: 'incidents', label: 'Incidents', icon: AlertTriangle },
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
        <div className="w-64 bg-orange-600 text-white p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Driver Dashboard</h2>
            <button
              onClick={onClose}
              className="text-white hover:text-gray-300 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Status en ligne/hors ligne */}
          <div className="mb-6 p-3 bg-white bg-opacity-10 rounded-lg">
            <div className="flex items-center space-x-2">
              {isOnline ? (
                <Wifi className="w-4 h-4 text-green-300" />
              ) : (
                <WifiOff className="w-4 h-4 text-red-300" />
              )}
              <span className="text-sm">
                {isOnline ? 'En ligne' : 'Mode hors ligne'}
              </span>
            </div>
            {!isOnline && (
              <p className="text-xs text-orange-200 mt-1">
                Les données seront synchronisées lors de la reconnexion
              </p>
            )}
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

          <div className="mt-auto pt-8">
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
              userRole={driverData.userRole}
              userName={driverData.userName}
              todayTasks={driverData.todayTasks}
              quickStats={driverData.quickStats}
              todaySchedule={driverData.todaySchedule}
            />
          )}

          {activeTab === 'trips' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-semibold text-gray-900">Mes Trajets</h3>
                <div className="text-sm text-gray-500">
                  Bus assigné: KCB-007
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-medium text-gray-900">Trajets d'Aujourd'hui</h4>
                  {[
                    { id: '001', route: 'Libreville → Port-Gentil', time: '08:00', status: 'Terminé', passengers: 45 },
                    { id: '002', route: 'Port-Gentil → Libreville', time: '14:00', status: 'En cours', passengers: 52 },
                    { id: '003', route: 'Libreville → Oyem', time: '18:30', status: 'Programmé', passengers: 38 },
                  ].map((trip) => (
                    <div key={trip.id} className="bg-white border rounded-lg p-4 shadow-sm">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-gray-900">{trip.route}</span>
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          trip.status === 'Terminé' ? 'bg-green-100 text-green-800' :
                          trip.status === 'En cours' ? 'bg-blue-100 text-blue-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {trip.status}
                        </span>
                      </div>
                      <div className="text-orange-600 font-medium mb-1">{trip.time}</div>
                      <div className="text-sm text-gray-600">{trip.passengers} passagers</div>
                      {trip.status === 'En cours' && (
                        <div className="mt-3 flex space-x-2">
                          <button className="px-3 py-1 bg-orange-600 text-white text-sm rounded hover:bg-orange-700">
                            Position GPS
                          </button>
                          <button className="px-3 py-1 bg-gray-600 text-white text-sm rounded hover:bg-gray-700">
                            Pause
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                <div className="space-y-4">
                  <h4 className="font-medium text-gray-900">Planning de la Semaine</h4>
                  <div className="bg-white border rounded-lg p-4">
                    <div className="space-y-3">
                      {[
                        { day: 'Lundi', trips: 3, hours: '8h - 19h' },
                        { day: 'Mardi', trips: 2, hours: '9h - 17h' },
                        { day: 'Mercredi', trips: 4, hours: '7h - 20h' },
                        { day: 'Jeudi', trips: 3, hours: '8h - 18h' },
                        { day: 'Vendredi', trips: 2, hours: '10h - 16h' },
                        { day: 'Samedi', trips: 1, hours: '14h - 18h' },
                        { day: 'Dimanche', trips: 0, hours: 'Repos' },
                      ].map((day) => (
                        <div key={day.day} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                          <span className="font-medium">{day.day}</span>
                          <span className="text-sm text-gray-600">{day.trips} trajets</span>
                          <span className="text-sm text-orange-600">{day.hours}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'passengers' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-semibold text-gray-900">Listes Passagers</h3>
                <button className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors flex items-center space-x-2">
                  <Download className="w-4 h-4" />
                  <span>Synchroniser</span>
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {[
                  { id: '001', route: 'Libreville → Port-Gentil', time: '08:00', passengers: 45, downloaded: true },
                  { id: '002', route: 'Port-Gentil → Libreville', time: '14:00', passengers: 52, downloaded: true },
                  { id: '003', route: 'Libreville → Oyem', time: '18:30', passengers: 38, downloaded: false },
                ].map((trip) => (
                  <div key={trip.id} className="bg-white border rounded-lg p-4 shadow-sm">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <div className="font-medium text-gray-900">{trip.route}</div>
                        <div className="text-sm text-gray-600">{trip.time} - {trip.passengers} passagers</div>
                      </div>
                      <div className={`px-2 py-1 text-xs rounded-full ${
                        trip.downloaded ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {trip.downloaded ? 'Téléchargé' : 'En attente'}
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <button className="w-full px-3 py-2 bg-orange-50 text-orange-700 rounded hover:bg-orange-100 transition-colors flex items-center justify-center space-x-2">
                        <Download className="w-4 h-4" />
                        <span>Télécharger Liste</span>
                      </button>
                      
                      {trip.downloaded && (
                        <div className="text-xs text-gray-500 text-center">
                          Disponible hors ligne • Dernière sync: {new Date().toLocaleTimeString()}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0">
                    <div className="w-2 h-2 bg-orange-400 rounded-full mt-2"></div>
                  </div>
                  <div>
                    <h4 className="font-medium text-orange-800">Mode Hors Ligne</h4>
                    <p className="text-sm text-orange-600 mt-1">
                      Les listes téléchargées restent disponibles même sans connexion internet. 
                      Synchronisez régulièrement pour obtenir les dernières mises à jour.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'incidents' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-semibold text-gray-900">Signalement d'Incidents</h3>
                <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
                  Signaler Incident
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-medium text-gray-900">Mes Signalements</h4>
                  
                  {[
                    { id: 'INC001', type: 'Panne', description: 'Problème moteur sur N1', date: '2024-01-14', status: 'En cours', severity: 'high' },
                    { id: 'INC002', type: 'Retard', description: 'Embouteillage Libreville', date: '2024-01-13', status: 'Résolu', severity: 'medium' },
                    { id: 'INC003', type: 'Accident', description: 'Accrochage mineur', date: '2024-01-12', status: 'Traité', severity: 'high' },
                  ].map((incident) => (
                    <div key={incident.id} className="bg-white border rounded-lg p-4 shadow-sm">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-gray-900">#{incident.id}</span>
                        <div className="flex items-center space-x-2">
                          <span className={`w-2 h-2 rounded-full ${
                            incident.severity === 'high' ? 'bg-red-400' : 'bg-yellow-400'
                          }`}></span>
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            incident.status === 'Résolu' || incident.status === 'Traité' ? 'bg-green-100 text-green-800' :
                            'bg-orange-100 text-orange-800'
                          }`}>
                            {incident.status}
                          </span>
                        </div>
                      </div>
                      <div className="text-sm font-medium text-gray-700 mb-1">{incident.type}</div>
                      <div className="text-sm text-gray-600 mb-2">{incident.description}</div>
                      <div className="text-xs text-gray-500">{incident.date}</div>
                    </div>
                  ))}
                </div>

                <div className="space-y-4">
                  <h4 className="font-medium text-gray-900">Signalement Rapide</h4>
                  
                  <div className="bg-white border rounded-lg p-4">
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-3">
                        {[
                          { type: 'Panne', icon: '🔧', color: 'bg-red-50 text-red-700 border-red-200' },
                          { type: 'Retard', icon: '⏰', color: 'bg-yellow-50 text-yellow-700 border-yellow-200' },
                          { type: 'Accident', icon: '⚠️', color: 'bg-orange-50 text-orange-700 border-orange-200' },
                          { type: 'Autre', icon: '📝', color: 'bg-gray-50 text-gray-700 border-gray-200' },
                        ].map((type) => (
                          <button
                            key={type.type}
                            className={`p-3 border rounded-lg hover:shadow-sm transition-all ${type.color}`}
                          >
                            <div className="text-lg mb-1">{type.icon}</div>
                            <div className="text-sm font-medium">{type.type}</div>
                          </button>
                        ))}
                      </div>
                      
                      <div className="border-t pt-4">
                        <h5 className="font-medium text-gray-900 mb-2">Informations GPS</h5>
                        <div className="text-sm text-gray-600 space-y-1">
                          <div>Position: 0.3842° N, 9.4673° E</div>
                          <div>Vitesse: 65 km/h</div>
                          <div>Direction: Nord-Est</div>
                        </div>
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