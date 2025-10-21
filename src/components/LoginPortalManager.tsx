import React, { useState } from 'react';
import { SecurePortal } from './SecurePortal';
import { AdminLogin } from './AdminLogin';
import { AgentLogin } from './AgentLogin';
import { DriverLogin } from './DriverLogin';
import { MiniAdminDashboard } from './MiniAdminDashboard';
import { AgentDashboardFull } from './AgentDashboardFull';
import { DriverDashboardFull } from './DriverDashboardFull';

interface LoginPortalManagerProps {
  isPortalOpen: boolean;
  onClosePortal: () => void;
}

export const LoginPortalManager: React.FC<LoginPortalManagerProps> = ({ 
  isPortalOpen, 
  onClosePortal 
}) => {
  const [activeLoginModal, setActiveLoginModal] = useState<string | null>(null);
  const [activeDashboard, setActiveDashboard] = useState<string | null>(null);

  const handleRoleSelect = (role: string) => {
    onClosePortal();
    setActiveLoginModal(role);
  };

  const handleLoginSuccess = (role: string) => {
    setActiveLoginModal(null);
    setActiveDashboard(role);
  };

  const handleCloseAll = () => {
    setActiveLoginModal(null);
    setActiveDashboard(null);
  };

  return (
    <>
      {/* Portal principal */}
      <SecurePortal
        isOpen={isPortalOpen}
        onClose={onClosePortal}
        onRoleSelect={handleRoleSelect}
      />

      {/* Modals de connexion */}
      <AdminLogin
        isOpen={activeLoginModal === 'admin'}
        onClose={() => setActiveLoginModal(null)}
        onSuccess={() => handleLoginSuccess('admin')}
      />

      <AgentLogin
        isOpen={activeLoginModal === 'agent'}
        onClose={() => setActiveLoginModal(null)}
        onSuccess={() => handleLoginSuccess('agent')}
      />

      <DriverLogin
        isOpen={activeLoginModal === 'driver'}
        onClose={() => setActiveLoginModal(null)}
        onSuccess={() => handleLoginSuccess('driver')}
      />

      {/* Dashboards */}
      <MiniAdminDashboard
        isOpen={activeDashboard === 'admin'}
        onClose={handleCloseAll}
      />

      <AgentDashboardFull
        isOpen={activeDashboard === 'agent'}
        onClose={handleCloseAll}
      />

      <DriverDashboardFull
        isOpen={activeDashboard === 'driver'}
        onClose={handleCloseAll}
      />
    </>
  );
};