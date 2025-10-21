import React, { createContext, useContext, useState, useEffect } from 'react';

// Types pour les rôles et permissions
export interface Permission {
  id: string;
  name: string;
  description: string;
  category: 'read' | 'write' | 'validate' | 'cancel' | 'publish' | 'refund' | 'admin';
}

export interface Role {
  id: string;
  name: string;
  description: string;
  permissions: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface User {
  id: string;
  name: string;
  email: string;
  roleId: string;
  department: 'admin' | 'agent' | 'driver';
  status: 'active' | 'inactive' | 'suspended';
  lastLogin?: Date;
  createdAt: Date;
}

interface RolePermissionContextType {
  // Roles
  roles: Role[];
  createRole: (role: Omit<Role, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateRole: (roleId: string, updates: Partial<Role>) => Promise<void>;
  deleteRole: (roleId: string) => Promise<void>;
  
  // Permissions
  permissions: Permission[];
  
  // Users
  users: User[];
  assignRole: (userId: string, roleId: string) => Promise<void>;
  getUserPermissions: (userId: string) => string[];
  hasPermission: (userId: string, permissionId: string) => boolean;
  
  // Utility functions
  getRoleById: (roleId: string) => Role | undefined;
  getUsersByRole: (roleId: string) => User[];
}

const RolePermissionContext = createContext<RolePermissionContextType | undefined>(undefined);

// Permissions prédéfinies
const defaultPermissions: Permission[] = [
  // Lecture
  { id: 'read_trips', name: 'Consulter les trajets', description: 'Voir la liste des trajets', category: 'read' },
  { id: 'read_schedules', name: 'Consulter les horaires', description: 'Voir les horaires', category: 'read' },
  { id: 'read_tickets', name: 'Consulter les billets', description: 'Voir les billets', category: 'read' },
  { id: 'read_reports', name: 'Consulter les rapports', description: 'Voir les statistiques et rapports', category: 'read' },
  
  // Écriture
  { id: 'write_trips', name: 'Gérer les trajets', description: 'Créer, modifier, supprimer les trajets', category: 'write' },
  { id: 'write_schedules', name: 'Gérer les horaires', description: 'Modifier les horaires', category: 'write' },
  { id: 'write_tickets', name: 'Créer des réservations', description: 'Créer des réservations sur place', category: 'write' },
  { id: 'write_content', name: 'Gérer le contenu', description: 'Modifier le contenu du site', category: 'write' },
  
  // Validation
  { id: 'validate_passenger_list', name: 'Valider liste passagers', description: 'Valider et générer PDF des passagers', category: 'validate' },
  { id: 'validate_payments', name: 'Valider les paiements', description: 'Rapprocher et valider les paiements', category: 'validate' },
  
  // Annulation/Remboursement
  { id: 'cancel_tickets', name: 'Annuler les billets', description: 'Annuler des réservations', category: 'cancel' },
  { id: 'refund_tickets', name: 'Rembourser les billets', description: 'Effectuer des remboursements', category: 'refund' },
  
  // Publication
  { id: 'publish_content', name: 'Publier du contenu', description: 'Publier sur le site public', category: 'publish' },
  { id: 'publish_schedules', name: 'Publier les horaires', description: 'Publier les changements d\'horaires', category: 'publish' },
  
  // Administration
  { id: 'admin_users', name: 'Gérer les utilisateurs', description: 'Créer, modifier, supprimer des utilisateurs', category: 'admin' },
  { id: 'admin_roles', name: 'Gérer les rôles', description: 'Créer et modifier les rôles', category: 'admin' },
  { id: 'admin_settings', name: 'Paramètres système', description: 'Modifier les paramètres système', category: 'admin' },
  { id: 'admin_reports', name: 'Rapports avancés', description: 'Accès aux rapports complets', category: 'admin' }
];

// Rôles par défaut
const defaultRoles: Role[] = [
  {
    id: 'admin',
    name: 'Administrateur',
    description: 'Accès complet à toutes les fonctionnalités',
    permissions: defaultPermissions.map(p => p.id),
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'agent',
    name: 'Agent/Contrôleur',
    description: 'Gestion des opérations terrain',
    permissions: [
      'read_trips', 'read_schedules', 'read_tickets',
      'write_tickets', 'validate_passenger_list', 'validate_payments',
      'cancel_tickets', 'refund_tickets'
    ],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'driver',
    name: 'Chauffeur',
    description: 'Consultation des missions et rapport d\'incidents',
    permissions: [
      'read_trips', 'read_schedules', 'read_tickets'
    ],
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

// Utilisateurs exemple
const defaultUsers: User[] = [
  {
    id: 'user1',
    name: 'Admin Principal',
    email: 'admin@karis.ga',
    roleId: 'admin',
    department: 'admin',
    status: 'active',
    lastLogin: new Date(),
    createdAt: new Date()
  },
  {
    id: 'user2',
    name: 'Agent Libreville',
    email: 'agent.libreville@karis.ga',
    roleId: 'agent',
    department: 'agent',
    status: 'active',
    lastLogin: new Date(Date.now() - 2 * 60 * 60 * 1000),
    createdAt: new Date()
  },
  {
    id: 'user3',
    name: 'Chauffeur KC-001',
    email: 'driver.kc001@karis.ga',
    roleId: 'driver',
    department: 'driver',
    status: 'active',
    lastLogin: new Date(Date.now() - 4 * 60 * 60 * 1000),
    createdAt: new Date()
  }
];

export const RolePermissionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [roles, setRoles] = useState<Role[]>(defaultRoles);
  const [permissions] = useState<Permission[]>(defaultPermissions);
  const [users, setUsers] = useState<User[]>(defaultUsers);

  // API: createRole
  const createRole = async (roleData: Omit<Role, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newRole: Role = {
      ...roleData,
      id: `role_${Date.now()}`,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    setRoles(prev => [...prev, newRole]);
    // API: await createRoleAPI(newRole);
  };

  // API: updateRole
  const updateRole = async (roleId: string, updates: Partial<Role>) => {
    setRoles(prev => prev.map(role => 
      role.id === roleId 
        ? { ...role, ...updates, updatedAt: new Date() }
        : role
    ));
    // API: await updateRoleAPI(roleId, updates);
  };

  // API: deleteRole
  const deleteRole = async (roleId: string) => {
    setRoles(prev => prev.filter(role => role.id !== roleId));
    // API: await deleteRoleAPI(roleId);
  };

  // API: assignRole
  const assignRole = async (userId: string, roleId: string) => {
    setUsers(prev => prev.map(user =>
      user.id === userId 
        ? { ...user, roleId }
        : user
    ));
    // API: await assignRoleAPI(userId, roleId);
  };

  const getUserPermissions = (userId: string): string[] => {
    const user = users.find(u => u.id === userId);
    if (!user) return [];
    
    const role = roles.find(r => r.id === user.roleId);
    return role ? role.permissions : [];
  };

  const hasPermission = (userId: string, permissionId: string): boolean => {
    const userPermissions = getUserPermissions(userId);
    return userPermissions.includes(permissionId);
  };

  const getRoleById = (roleId: string): Role | undefined => {
    return roles.find(role => role.id === roleId);
  };

  const getUsersByRole = (roleId: string): User[] => {
    return users.filter(user => user.roleId === roleId);
  };

  return (
    <RolePermissionContext.Provider value={{
      roles,
      createRole,
      updateRole,
      deleteRole,
      permissions,
      users,
      assignRole,
      getUserPermissions,
      hasPermission,
      getRoleById,
      getUsersByRole
    }}>
      {children}
    </RolePermissionContext.Provider>
  );
};

export const useRolePermission = () => {
  const context = useContext(RolePermissionContext);
  if (context === undefined) {
    throw new Error('useRolePermission must be used within a RolePermissionProvider');
  }
  return context;
};