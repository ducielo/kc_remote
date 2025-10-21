import React, { useState } from 'react';
import { motion } from 'motion/react';
import { X, Home, CheckCircle, DollarSign, Calendar, LogOut } from 'lucide-react';
import { DashboardHome } from './DashboardHome';
import { getAgentMockData } from './mockData';

interface MiniAgentDashboardProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MiniAgentDashboard: React.FC<MiniAgentDashboardProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState('home');
  const agentData = getAgentMockData();

  const tabs = [
    { id: 'home', label: 'Accueil', icon: Home },
    { id: 'validation', label: 'Validation', icon: CheckCircle },
    { id: 'bookings', label: 'Réservations', icon: Calendar },
    { id: 'refunds', label: 'Remboursements', icon: DollarSign },
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
        <div className="w-64 bg-green-600 text-white p-6">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl font-semibold">Agent Dashboard</h2>
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
              userRole={agentData.userRole}
              userName={agentData.userName}
              todayTasks={agentData.todayTasks}
              quickStats={agentData.quickStats}
              todaySchedule={agentData.todaySchedule}
            />
          )}

          {activeTab === 'validation' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-semibold text-gray-900">Validation Passagers</h3>
                <div className="text-sm text-gray-500">
                  {new Date().toLocaleDateString()}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                  { id: '001', route: 'Libreville → Port-Gentil', time: '08:00', passengers: 45, validated: 42, bus: 'KCB-001' },
                  { id: '002', route: 'Libreville → Franceville', time: '10:30', passengers: 38, validated: 38, bus: 'KCB-002' },
                  { id: '003', route: 'Port-Gentil → Libreville', time: '14:00', passengers: 52, validated: 48, bus: 'KCB-003' },
                  { id: '004', route: 'Franceville → Libreville', time: '16:30', passengers: 41, validated: 35, bus: 'KCB-004' },
                ].map((trip) => (
                  <div key={trip.id} className="bg-white border rounded-lg p-4 shadow-sm">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-gray-900">{trip.bus}</span>
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        trip.validated === trip.passengers ? 'bg-green-100 text-green-800' : 'bg-orange-100 text-orange-800'
                      }`}>
                        {trip.validated === trip.passengers ? 'Complet' : 'En cours'}
                      </span>
                    </div>
                    <div className="text-sm text-gray-600 mb-2">{trip.route}</div>
                    <div className="text-sm text-gray-500 mb-3">Départ: {trip.time}</div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">
                        {trip.validated}/{trip.passengers} validés
                      </span>
                      <button className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700 transition-colors">
                        Scanner
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'bookings' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-semibold text-gray-900">Gestion Réservations</h3>
                <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                  Nouvelle Réservation
                </button>
              </div>

              <div className="bg-white rounded-lg shadow">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="text-left p-4">Référence</th>
                        <th className="text-left p-4">Passager</th>
                        <th className="text-left p-4">Trajet</th>
                        <th className="text-left p-4">Date</th>
                        <th className="text-left p-4">Prix</th>
                        <th className="text-left p-4">Statut</th>
                        <th className="text-left p-4">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        { ref: 'KC24001', name: 'Marie Ngema', route: 'Libreville → Port-Gentil', date: '2024-01-15', price: '15,000', status: 'Confirmé' },
                        { ref: 'KC24002', name: 'Jean Obame', route: 'Port-Gentil → Libreville', date: '2024-01-16', price: '15,000', status: 'En attente' },
                        { ref: 'KC24003', name: 'Sophie Andeme', route: 'Libreville → Franceville', date: '2024-01-17', price: '25,000', status: 'Confirmé' },
                      ].map((booking) => (
                        <tr key={booking.ref} className="border-t">
                          <td className="p-4 font-medium">{booking.ref}</td>
                          <td className="p-4">{booking.name}</td>
                          <td className="p-4">{booking.route}</td>
                          <td className="p-4">{booking.date}</td>
                          <td className="p-4">{booking.price} FCFA</td>
                          <td className="p-4">
                            <span className={`px-2 py-1 text-xs rounded-full ${
                              booking.status === 'Confirmé' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                            }`}>
                              {booking.status}
                            </span>
                          </td>
                          <td className="p-4">
                            <button className="text-blue-600 hover:text-blue-800 text-sm">Modifier</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'refunds' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-semibold text-gray-900">Demandes de Remboursement</h3>
                <div className="text-sm text-gray-500">
                  Dernière mise à jour: {new Date().toLocaleTimeString()}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <div className="text-2xl font-semibold text-yellow-800">7</div>
                  <div className="text-sm text-yellow-600">En attente</div>
                </div>
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="text-2xl font-semibold text-green-800">15</div>
                  <div className="text-sm text-green-600">Approuvés</div>
                </div>
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <div className="text-2xl font-semibold text-red-800">2</div>
                  <div className="text-sm text-red-600">Refusés</div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="text-left p-4">Référence</th>
                        <th className="text-left p-4">Passager</th>
                        <th className="text-left p-4">Montant</th>
                        <th className="text-left p-4">Motif</th>
                        <th className="text-left p-4">Date Demande</th>
                        <th className="text-left p-4">Statut</th>
                        <th className="text-left p-4">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        { ref: 'RB24001', name: 'Alice Mba', amount: '15,000', reason: 'Annulation voyage', date: '2024-01-10', status: 'En attente' },
                        { ref: 'RB24002', name: 'Pierre Nze', amount: '25,000', reason: 'Problème médical', date: '2024-01-12', status: 'Approuvé' },
                        { ref: 'RB24003', name: 'Claire Akue', amount: '15,000', reason: 'Changement planning', date: '2024-01-14', status: 'En attente' },
                      ].map((refund) => (
                        <tr key={refund.ref} className="border-t">
                          <td className="p-4 font-medium">{refund.ref}</td>
                          <td className="p-4">{refund.name}</td>
                          <td className="p-4">{refund.amount} FCFA</td>
                          <td className="p-4">{refund.reason}</td>
                          <td className="p-4">{refund.date}</td>
                          <td className="p-4">
                            <span className={`px-2 py-1 text-xs rounded-full ${
                              refund.status === 'Approuvé' ? 'bg-green-100 text-green-800' : 
                              refund.status === 'En attente' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-red-100 text-red-800'
                            }`}>
                              {refund.status}
                            </span>
                          </td>
                          <td className="p-4 space-x-2">
                            {refund.status === 'En attente' && (
                              <>
                                <button className="text-green-600 hover:text-green-800 text-sm">Approuver</button>
                                <button className="text-red-600 hover:text-red-800 text-sm">Refuser</button>
                              </>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};