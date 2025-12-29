import { useState, useEffect } from 'react';
import AdminLayout from '../../components/AdminLayout';
import { useRoles } from '../../hooks/useRoles';
import CreateRoleModal from '../../components/admin/CreateRoleModal';
import EditRoleModal from '../../components/admin/EditRoleModal';
import RolePermissionsModal from '../../components/admin/RolePermissionsModal';
import ConfirmDialog from '../../components/admin/ConfirmDialog';

const Roles = () => {
  const { roles, loading, fetchRoles, deleteRole } = useRoles();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showPermissionsModal, setShowPermissionsModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [selectedRole, setSelectedRole] = useState(null);
  const [roleToDelete, setRoleToDelete] = useState(null);

  useEffect(() => {
    fetchRoles();
  }, []);

  const getRoleColor = (roleName) => {
    switch (roleName) {
      case 'super_admin':
        return 'bg-gradient-to-r from-primary to-primary';
      case 'admin':
        return 'bg-gradient-to-r from-primary to-primary';
      case 'moderator':
        return 'bg-gradient-to-r from-cyan-500 to-blue-500';
      case 'user':
        return 'bg-gradient-to-r from-gray-500 to-gray-600';
      default:
        return 'bg-gradient-to-r from-primary to-primary';
    }
  };

  const handleDeleteRole = (roleId) => {
    setRoleToDelete(roleId);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = async () => {
    const result = await deleteRole(roleToDelete);
    if (result.success) {
      fetchRoles();
    }
    setRoleToDelete(null);
  };

  const handleEditRole = (role) => {
    setSelectedRole(role);
    setShowEditModal(true);
  };

  const handleViewPermissions = (role) => {
    setSelectedRole(role);
    setShowPermissionsModal(true);
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-card rounded-lg shadow-md p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-foreground">Role Management</h2>
              <p className="text-sm sm:text-base text-muted-foreground mt-1">Manage system roles and permissions</p>
            </div>
            <button
              onClick={() => setShowCreateModal(true)}
              className="w-full sm:w-auto px-6 py-2 bg-gradient-to-r from-primary to-primary text-white rounded-full hover:from-primary/90 hover:to-primary/90 transition-all duration-300 transform hover:scale-105"
            >
              <i className="ri-add-line mr-2"></i>
              Create Role
            </button>
          </div>
        </div>

        {/* Roles Grid */}
        {roles.length === 0 ? (
          <div className="bg-card rounded-lg shadow-md p-12 text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-muted mb-6">
              <i className="ri-shield-user-line text-4xl text-muted-foreground"></i>
            </div>
            <h3 className="text-2xl font-bold text-foreground mb-3">No Roles Found</h3>
            <p className="text-muted-foreground max-w-md mx-auto mb-8">
              Get started by creating your first role to manage user permissions and access control.
            </p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="px-6 py-3 bg-gradient-to-r from-primary to-primary text-white rounded-full hover:from-primary/90 hover:to-primary/90 transition-all duration-300 transform hover:scale-105"
            >
              <i className="ri-add-line mr-2"></i>
              Create Your First Role
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {roles.map((role) => (
            <div
              key={role.id}
              className="bg-card rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-300"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 ${getRoleColor(role.name)} rounded-full flex items-center justify-center`}>
                  <i className="ri-shield-user-line text-white text-xl"></i>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleViewPermissions(role)}
                    className="p-2 text-primary hover:text-primary/90 transition-colors duration-200"
                    title="Manage Permissions"
                  >
                    <i className="ri-settings-line"></i>
                  </button>
                  <button
                    onClick={() => handleEditRole(role)}
                    className="p-2 text-green-600 dark:text-green-400 hover:text-green-800 dark:text-green-200 transition-colors duration-200"
                    title="Edit Role"
                  >
                    <i className="ri-edit-line"></i>
                  </button>
                </div>
              </div>

              <h3 className="text-lg font-semibold text-foreground mb-2">
                {role.name}
              </h3>
              <p className="text-sm text-muted-foreground mb-3">
                {role.description || 'No description provided'}
              </p>

              <div className="flex items-center justify-end text-sm">
                {role.id <= 4 && (
                  <span className="px-2 py-1 bg-primary text-primary-foreground rounded-full text-xs font-medium">
                    System Role
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
        )}

        <CreateRoleModal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          onSuccess={fetchRoles}
        />

        <EditRoleModal
          isOpen={showEditModal}
          onClose={() => {
            setShowEditModal(false);
            setSelectedRole(null);
          }}
          role={selectedRole}
          onSuccess={fetchRoles}
        />

        <RolePermissionsModal
          isOpen={showPermissionsModal}
          onClose={() => {
            setShowPermissionsModal(false);
            setSelectedRole(null);
          }}
          role={selectedRole}
        />

        <ConfirmDialog
          isOpen={showDeleteConfirm}
          onClose={() => setShowDeleteConfirm(false)}
          onConfirm={confirmDelete}
          title="Delete Role"
          message="Are you sure you want to delete this role? This action cannot be undone."
          confirmText="Delete"
          type="danger"
        />
      </div>
    </AdminLayout>
  );
};

export default Roles;
