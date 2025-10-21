import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  Users,
  Shield,
  Plus,
  Edit,
  Trash2,
  Save,
  X,
  Check,
  Lock,
  Unlock,
  AlertCircle,
  Eye,
  EyeOff
} from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Switch } from './ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from './ui/alert-dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { ScrollArea } from './ui/scroll-area';
import { Separator } from './ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { toast } from 'sonner';
import { useRolePermission, type Role, type Permission, type User } from './contexts/RolePermissionContext';

export const AdminRoleManagement: React.FC = () => {
  const {
    roles,
    permissions,
    users,
    createRole,
    updateRole,
    deleteRole,
    assignRole,
    getRoleById,
    getUsersByRole
  } = useRolePermission();

  // States
  const [activeTab, setActiveTab] = useState('roles');
  const [showCreateRoleDialog, setShowCreateRoleDialog] = useState(false);
  const [editingRole, setEditingRole] = useState<Role | null>(null);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  // Form states
  const [roleForm, setRoleForm] = useState({
    name: '',
    description: '',
    permissions: [] as string[]
  });

  // Permission categories
  const permissionCategories = {
    read: permissions.filter(p => p.category === 'read'),
    write: permissions.filter(p => p.category === 'write'),
    validate: permissions.filter(p => p.category === 'validate'),
    cancel: permissions.filter(p => p.category === 'cancel'),
    refund: permissions.filter(p => p.category === 'refund'),
    publish: permissions.filter(p => p.category === 'publish'),
    admin: permissions.filter(p => p.category === 'admin')
  };

  // Create or update role
  const handleSaveRole = async () => {
    if (!roleForm.name.trim()) {
      toast.error('Le nom du rôle est requis');
      return;
    }

    try {
      if (editingRole) {
        await updateRole(editingRole.id, {
          name: roleForm.name,
          description: roleForm.description,
          permissions: roleForm.permissions
        });
        toast.success('Rôle modifié avec succès');
      } else {
        await createRole({
          name: roleForm.name,
          description: roleForm.description,
          permissions: roleForm.permissions
        });
        toast.success('Rôle créé avec succès');
      }

      // Reset form
      setRoleForm({ name: '', description: '', permissions: [] });
      setShowCreateRoleDialog(false);
      setEditingRole(null);
    } catch (error) {
      toast.error('Erreur lors de la sauvegarde');
    }
  };

  // Delete role
  const handleDeleteRole = async (roleId: string) => {
    const usersWithRole = getUsersByRole(roleId);
    if (usersWithRole.length > 0) {
      toast.error(`Impossible de supprimer : ${usersWithRole.length} utilisateur(s) ont ce rôle`);
      return;
    }

    try {
      await deleteRole(roleId);
      toast.success('Rôle supprimé avec succès');
    } catch (error) {
      toast.error('Erreur lors de la suppression');
    }
  };

  // Edit role
  const handleEditRole = (role: Role) => {
    setEditingRole(role);
    setRoleForm({
      name: role.name,
      description: role.description,
      permissions: [...role.permissions]
    });
    setShowCreateRoleDialog(true);
  };

  // Toggle permission
  const handleTogglePermission = (permissionId: string) => {
    setRoleForm(prev => ({
      ...prev,
      permissions: prev.permissions.includes(permissionId)
        ? prev.permissions.filter(p => p !== permissionId)
        : [...prev.permissions, permissionId]
    }));
  };

  // Assign role to user
  const handleAssignRole = async (userId: string, roleId: string) => {
    try {
      await assignRole(userId, roleId);
      toast.success('Rôle assigné avec succès');
    } catch (error) {
      toast.error('Erreur lors de l\'assignation');
    }
  };

  // Get permission category color
  const getCategoryColor = (category: string) => {
    const colors = {
      read: 'bg-blue-100 text-blue-800',
      write: 'bg-green-100 text-green-800',
      validate: 'bg-purple-100 text-purple-800',
      cancel: 'bg-red-100 text-red-800',
      refund: 'bg-orange-100 text-orange-800',
      publish: 'bg-indigo-100 text-indigo-800',
      admin: 'bg-gray-100 text-gray-800'
    };
    return colors[category as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900">Gestion des rôles et permissions</h2>
          <p className="text-gray-600">Configurez les rôles utilisateurs et leurs permissions</p>
        </div>
        <Button
          onClick={() => {
            setEditingRole(null);
            setRoleForm({ name: '', description: '', permissions: [] });
            setShowCreateRoleDialog(true);
          }}
          style={{ backgroundColor: 'rgba(192, 54, 24, 0.9)' }}
        >
          <Plus className="w-4 h-4 mr-2" />
          Nouveau rôle
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="roles">Rôles</TabsTrigger>
          <TabsTrigger value="permissions">Permissions</TabsTrigger>
          <TabsTrigger value="users">Utilisateurs</TabsTrigger>
        </TabsList>

        {/* Roles Tab */}
        <TabsContent value="roles" className="space-y-4">
          <div className="grid gap-4">
            {roles.map(role => (
              <Card key={role.id}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <Shield className="w-5 h-5" style={{ color: 'rgba(192, 54, 24, 0.9)' }} />
                        <h3 className="text-lg font-semibold">{role.name}</h3>
                        <Badge variant="outline">
                          {getUsersByRole(role.id).length} utilisateur(s)
                        </Badge>
                      </div>
                      
                      <p className="text-gray-600 mb-4">{role.description}</p>
                      
                      <div className="space-y-2">
                        <Label className="text-sm font-medium text-gray-700">
                          Permissions ({role.permissions.length})
                        </Label>
                        <div className="flex flex-wrap gap-2">
                          {role.permissions.slice(0, 6).map(permissionId => {
                            const permission = permissions.find(p => p.id === permissionId);
                            return permission ? (
                              <Badge
                                key={permissionId}
                                variant="secondary"
                                className={getCategoryColor(permission.category)}
                              >
                                {permission.name}
                              </Badge>
                            ) : null;
                          })}
                          {role.permissions.length > 6 && (
                            <Badge variant="outline">
                              +{role.permissions.length - 6} autres
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2 ml-4">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditRole(role)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-red-600 hover:text-red-700"
                            disabled={getUsersByRole(role.id).length > 0}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Supprimer le rôle</AlertDialogTitle>
                            <AlertDialogDescription>
                              Êtes-vous sûr de vouloir supprimer le rôle "{role.name}" ? 
                              Cette action est irréversible.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Annuler</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDeleteRole(role.id)}
                              className="bg-red-600 hover:bg-red-700"
                            >
                              Supprimer
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Permissions Tab */}
        <TabsContent value="permissions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Permissions système</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {Object.entries(permissionCategories).map(([category, categoryPermissions]) => (
                  <div key={category}>
                    <h3 className="text-lg font-medium mb-3 capitalize">
                      {category === 'read' && 'Lecture'}
                      {category === 'write' && 'Écriture'}
                      {category === 'validate' && 'Validation'}
                      {category === 'cancel' && 'Annulation'}
                      {category === 'refund' && 'Remboursement'}
                      {category === 'publish' && 'Publication'}
                      {category === 'admin' && 'Administration'}
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {categoryPermissions.map(permission => (
                        <div key={permission.id} className="border rounded-lg p-3 bg-gray-50">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h4 className="font-medium">{permission.name}</h4>
                              <p className="text-sm text-gray-600">{permission.description}</p>
                            </div>
                            <Badge className={getCategoryColor(permission.category)}>
                              {permission.category}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                    {category !== 'admin' && <Separator className="my-4" />}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Users Tab */}
        <TabsContent value="users" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Gestion des utilisateurs</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Utilisateur</TableHead>
                    <TableHead>Département</TableHead>
                    <TableHead>Rôle actuel</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead>Dernière connexion</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map(user => {
                    const userRole = getRoleById(user.roleId);
                    return (
                      <TableRow key={user.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{user.name}</div>
                            <div className="text-sm text-gray-600">{user.email}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="capitalize">
                            {user.department}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge className={getCategoryColor('admin')}>
                            {userRole?.name || 'Aucun rôle'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={user.status === 'active' ? 'default' : 'secondary'}
                            className={
                              user.status === 'active'
                                ? 'bg-green-100 text-green-800'
                                : user.status === 'suspended'
                                ? 'bg-red-100 text-red-800'
                                : 'bg-gray-100 text-gray-800'
                            }
                          >
                            {user.status === 'active' && 'Actif'}
                            {user.status === 'inactive' && 'Inactif'}
                            {user.status === 'suspended' && 'Suspendu'}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-sm text-gray-600">
                          {user.lastLogin ? new Date(user.lastLogin).toLocaleDateString('fr-FR') : 'Jamais'}
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setSelectedUser(user)}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Create/Edit Role Dialog */}
      <Dialog open={showCreateRoleDialog} onOpenChange={setShowCreateRoleDialog}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingRole ? 'Modifier le rôle' : 'Créer un nouveau rôle'}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="roleName">Nom du rôle *</Label>
                <Input
                  id="roleName"
                  value={roleForm.name}
                  onChange={(e) => setRoleForm(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Nom du rôle"
                />
              </div>
              <div>
                <Label>Permissions sélectionnées</Label>
                <div className="text-sm text-gray-600">
                  {roleForm.permissions.length} permission(s)
                </div>
              </div>
            </div>

            <div>
              <Label htmlFor="roleDescription">Description</Label>
              <Textarea
                id="roleDescription"
                value={roleForm.description}
                onChange={(e) => setRoleForm(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Description du rôle et de ses responsabilités"
                rows={3}
              />
            </div>

            <div className="space-y-4">
              <Label className="text-base font-medium">Permissions</Label>
              
              {Object.entries(permissionCategories).map(([category, categoryPermissions]) => (
                <div key={category} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-medium capitalize">
                      {category === 'read' && 'Lecture'}
                      {category === 'write' && 'Écriture'}
                      {category === 'validate' && 'Validation'}
                      {category === 'cancel' && 'Annulation'}
                      {category === 'refund' && 'Remboursement'}
                      {category === 'publish' && 'Publication'}
                      {category === 'admin' && 'Administration'}
                    </h3>
                    <Badge className={getCategoryColor(category)}>
                      {categoryPermissions.filter(p => roleForm.permissions.includes(p.id)).length}/
                      {categoryPermissions.length}
                    </Badge>
                  </div>
                  
                  <div className="space-y-2">
                    {categoryPermissions.map(permission => (
                      <div key={permission.id} className="flex items-center space-x-3">
                        <Switch
                          checked={roleForm.permissions.includes(permission.id)}
                          onCheckedChange={() => handleTogglePermission(permission.id)}
                        />
                        <div className="flex-1">
                          <Label className="font-medium">{permission.name}</Label>
                          <p className="text-sm text-gray-600">{permission.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-end space-x-2">
              <Button
                variant="outline"
                onClick={() => {
                  setShowCreateRoleDialog(false);
                  setEditingRole(null);
                  setRoleForm({ name: '', description: '', permissions: [] });
                }}
              >
                Annuler
              </Button>
              <Button
                onClick={handleSaveRole}
                style={{ backgroundColor: 'rgba(192, 54, 24, 0.9)' }}
              >
                <Save className="w-4 h-4 mr-2" />
                {editingRole ? 'Modifier' : 'Créer'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* User Role Assignment Dialog */}
      {selectedUser && (
        <Dialog open={!!selectedUser} onOpenChange={() => setSelectedUser(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Modifier l'utilisateur</DialogTitle>
            </DialogHeader>

            <div className="space-y-4">
              <div>
                <Label className="text-sm font-medium text-gray-600">Utilisateur</Label>
                <p className="font-semibold">{selectedUser.name}</p>
                <p className="text-sm text-gray-600">{selectedUser.email}</p>
              </div>

              <div>
                <Label className="text-sm font-medium text-gray-600">Rôle actuel</Label>
                <p className="font-semibold">{getRoleById(selectedUser.roleId)?.name}</p>
              </div>

              <div className="space-y-2">
                <Label>Nouveau rôle</Label>
                <div className="space-y-2">
                  {roles.map(role => (
                    <div key={role.id} className="flex items-center space-x-3">
                      <Button
                        variant={selectedUser.roleId === role.id ? "default" : "outline"}
                        size="sm"
                        onClick={() => handleAssignRole(selectedUser.id, role.id)}
                        className="w-full justify-start"
                      >
                        <Shield className="w-4 h-4 mr-2" />
                        {role.name}
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};