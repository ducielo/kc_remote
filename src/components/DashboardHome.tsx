import React from 'react';
import { motion } from 'motion/react';
import { Calendar, Clock, Users, TrendingUp, AlertCircle, CheckCircle } from 'lucide-react';
import { Card } from './ui/card';

interface DashboardHomeProps {
  userRole: 'admin' | 'agent' | 'driver';
  userName: string;
  todayTasks: {
    total: number;
    completed: number;
    pending: number;
  };
  quickStats: Array<{
    label: string;
    value: string | number;
    icon: React.ComponentType<any>;
    color: string;
    trend?: string;
  }>;
  todaySchedule: Array<{
    time: string;
    title: string;
    status: 'completed' | 'pending' | 'active';
    location?: string;
  }>;
}

export const DashboardHome: React.FC<DashboardHomeProps> = ({
  userRole,
  userName,
  todayTasks,
  quickStats,
  todaySchedule
}) => {
  const getRoleTitle = () => {
    switch (userRole) {
      case 'admin': return 'Administrateur';
      case 'agent': return 'Agent Contrôleur';
      case 'driver': return 'Chauffeur';
      default: return 'Utilisateur';
    }
  };

  const getRoleColor = () => {
    switch (userRole) {
      case 'admin': return 'text-blue-600';
      case 'agent': return 'text-green-600';
      case 'driver': return 'text-orange-600';
      default: return 'text-gray-600';
    }
  };

  const getWelcomeMessage = () => {
    const hour = new Date().getHours();
    let greeting = 'Bonne journée';
    
    if (hour < 12) greeting = 'Bonjour';
    else if (hour < 18) greeting = 'Bon après-midi';
    else greeting = 'Bonsoir';

    return `${greeting}, ${userName}`;
  };

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-6"
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900 mb-1">
              {getWelcomeMessage()}
            </h1>
            <p className={`${getRoleColor()} font-medium`}>
              {getRoleTitle()} - Karis Continental
            </p>
            <p className="text-gray-600 text-sm mt-1">
              {new Date().toLocaleDateString('fr-FR', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-gray-900">
              {todayTasks.completed}/{todayTasks.total}
            </div>
            <p className="text-sm text-gray-600">Tâches complétées</p>
          </div>
        </div>
      </motion.div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {quickStats.map((stat, index) => {
          const IconComponent = stat.icon;
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="p-4 hover:shadow-md transition-shadow">
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-lg ${stat.color.replace('text-', 'bg-').replace('600', '100')}`}>
                    <IconComponent className={`w-5 h-5 ${stat.color}`} />
                  </div>
                  <div className="flex-1">
                    <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
                    <p className="text-sm text-gray-600">{stat.label}</p>
                    {stat.trend && (
                      <p className="text-xs text-green-600">{stat.trend}</p>
                    )}
                  </div>
                </div>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Today's Schedule */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Card className="p-6">
          <div className="flex items-center space-x-2 mb-4">
            <Calendar className="w-5 h-5 text-gray-600" />
            <h3 className="text-lg font-semibold text-gray-900">Planning du jour</h3>
          </div>

          <div className="space-y-3">
            {todaySchedule.map((item, index) => (
              <div key={index} className="flex items-center space-x-4 p-3 rounded-lg bg-gray-50">
                <div className="text-sm font-medium text-gray-600 w-16">
                  {item.time}
                </div>
                <div 
                  className={`w-3 h-3 rounded-full ${
                    item.status === 'completed' ? 'bg-green-500' :
                    item.status === 'active' ? 'bg-blue-500' :
                    'bg-gray-300'
                  }`}
                />
                <div className="flex-1">
                  <p className="font-medium text-gray-900">{item.title}</p>
                  {item.location && (
                    <p className="text-sm text-gray-600">{item.location}</p>
                  )}
                </div>
                <div className="flex items-center">
                  {item.status === 'completed' ? (
                    <CheckCircle className="w-4 h-4 text-green-500" />
                  ) : item.status === 'active' ? (
                    <Clock className="w-4 h-4 text-blue-500" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-gray-400" />
                  )}
                </div>
              </div>
            ))}
          </div>
        </Card>
      </motion.div>
    </div>
  );
};