import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { LogOut, Shield, Users, Truck } from 'lucide-react';
import { Button } from './ui/button';
import { AdminDashboardTabbed } from './AdminDashboardTabbed';
import { AgentDashboardFixed } from './AgentDashboardFixed';
import { DriverDashboardSimple } from './DriverDashboardSimple';

interface AuthenticatedAppProps {
  role: 'admin' | 'agent' | 'driver';
  onLogout: () => void;
}

const roleConfig = {
  admin: {
    title: 'Dashboard Administrateur',
    icon: Shield,
    color: 'from-blue-500 to-blue-600',
    component: AdminDashboardTabbed
  },
  agent: {
    title: 'Dashboard Agent (Contrôleur)',
    icon: Users,
    color: 'from-green-500 to-green-600',
    component: AgentDashboardFixed
  },
  driver: {
    title: 'Dashboard Chauffeur',
    icon: Truck,
    color: 'from-orange-500 to-orange-600',
    component: DriverDashboardSimple
  }
};

export function AuthenticatedApp({ role, onLogout }: AuthenticatedAppProps) {
  const config = roleConfig[role];
  const DashboardComponent = config.component;
  const Icon = config.icon;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-gray-50"
    >
      {/* Header avec déconnexion */}
      <div className={`bg-gradient-to-r ${config.color} text-white shadow-lg`}>
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-white/20 p-2 rounded-lg">
                <Icon className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-xl font-bold">{config.title}</h1>
                <p className="text-white/90 text-sm">Karis Continental</p>
              </div>
            </div>
            <Button
              onClick={onLogout}
              variant="outline"
              className="bg-white/10 border-white/20 text-white hover:bg-white/20"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Déconnexion
            </Button>
          </div>
        </div>
      </div>

      {/* Dashboard Content */}
      <div className="flex min-h-screen bg-gray-50">
        {role === 'agent' ? (
          <DashboardComponent agentId="agent001" />
        ) : (
          <DashboardComponent />
        )}
      </div>
    </motion.div>
  );
}