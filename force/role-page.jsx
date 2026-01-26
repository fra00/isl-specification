import React, { useState, useEffect, useCallback } from 'react';
import { useRoleStore } from './store'; // IMPL PATH: ./store.jsx
import { RoleDetail } from './role-detail'; // IMPL PATH: ./role-detail.jsx
import { Role } from './domain'; // IMPL PATH: ./domain.jsx (assuming Role is exported)

/**
 * @typedef {import('./domain').Role} Role
 */

/**
 * RolePage Component
 * Main Page for Role Management
 * Role: Presentation
 */
const RolePage = () => {
  const {
    roles: storedRoles, // Renamed to avoid conflict with local state
    loadRoles,
    addRole,
    saveRole,
    removeRole,
    loading,
    error,
  } = useRoleStore();

  const [roles, setRoles] = useState([]);
  const [showDetailForm, setShowDetailForm] = useState(false);
  const [editingRole, setEditingRole] = useState(null); // Role object for editing, null for new

  /**
   * Capability: renderRoleList
   * Displays the list of roles fetched from the store.
   * Flow:
   * 1. Call `RoleStore.loadRoles` to fetch data.
   * 2. Render the Grid with the role list.
   */
  const fetchRoles = useCallback(async () => {
    const { roles: fetchedRoles, error: fetchError } = await loadRoles();
    if (fetchError) {
      console.error("Failed to load roles:", fetchError);
      // Optionally, set an error state to display to the user
    } else {
      setRoles(fetchedRoles || []);
    }
  }, [loadRoles]);

  // Initial load of roles when the component mounts
  useEffect(() => {
    fetchRoles();
  }, [fetchRoles]);

  /**
   * Capability: handleAddRole
   * Triggers the navigation or display of the RoleDetail form for creating a new role.
   */
  const handleAddRole = () => {
    setEditingRole(null); // No role to edit, so it's a new role
    setShowDetailForm(true);
  };

  /**
   * Capability: handleEditRole
   * Triggers the navigation or display of the RoleDetail form for editing an existing role.
   * @param {string} roleId - The ID of the role to edit.
   */
  const handleEditRole = (roleId) => {
    const roleToEdit = roles.find((r) => r.roleId === roleId);
    if (roleToEdit) {
      setEditingRole(roleToEdit);
      setShowDetailForm(true);
    } else {
      console.warn(`Role with ID ${roleId} not found for editing.`);
    }
  };

  /**
   * Capability: handleDeleteRole
   * Handles the deletion of a role.
   * Flow:
   * 1. Confirm deletion with the user.
   * 2. Call `RoleStore.removeRole(roleId)`.
   * 3. Refresh the list via `renderRoleList`.
   * @param {string} roleId - The ID of the role to delete.
   */
  const handleDeleteRole = async (roleId) => {
    // 1. Confirm deletion with the user.
    if (window.confirm('Are you sure you want to delete this role?')) {
      // 2. Call `RoleStore.removeRole(roleId)`.
      const { success, error: deleteError } = await removeRole(roleId);
      if (success) {
        console.log(`Role ${roleId} deleted successfully.`);
        // 3. Refresh the list via `renderRoleList`.
        fetchRoles();
      } else {
        console.error(`Failed to delete role ${roleId}:`, deleteError);
        alert(`Error deleting role: ${deleteError}`);
      }
    }
  };

  /**
   * Callback for RoleDetail's handleSave.
   * Handles saving a new role or updating an existing one.
   * @param {Role} roleData - The role data from the form.
   */
  const handleDetailSave = async (roleData) => {
    let success = false;
    let saveError = null;

    if (editingRole) {
      // Update existing role
      ({ success, error: saveError } = await saveRole(editingRole.roleId, roleData));
    } else {
      // Add new role
      ({ success, error: saveError } = await addRole(roleData));
    }

    if (success) {
      setShowDetailForm(false);
      setEditingRole(null);
      fetchRoles(); // Refresh the list
    } else {
      console.error("Failed to save role:", saveError);
      alert(`Error saving role: ${saveError}`);
    }
  };

  /**
   * Callback for RoleDetail's handleCancel.
   * Cancels the role creation/editing operation.
   */
  const handleDetailCancel = () => {
    setShowDetailForm(false);
    setEditingRole(null);
  };

  if (showDetailForm) {
    return (
      <RoleDetail
        role={editingRole}
        handleSave={handleDetailSave}
        handleCancel={handleDetailCancel}
      />
    );
  }

  return (
    <div className="role-management-page">
      <h1>Role Management</h1>

      <button onClick={handleAddRole} disabled={loading}>
        <span role="img" aria-label="plus icon">➕</span> Add New Role
      </button>

      {loading && <p>Loading roles...</p>}
      {error && <p style={{ color: 'red' }}>Error: {error}</p>}

      {!loading && !error && roles.length === 0 && (
        <p>No roles found. Click "Add New Role" to create one.</p>
      )}

      {!loading && !error && roles.length > 0 && (
        <table border="1" style={{ width: '100%', marginTop: '20px', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={{ padding: '8px', textAlign: 'left' }}>Name</th>
              <th style={{ padding: '8px', textAlign: 'left' }}>Description</th>
              <th style={{ padding: '8px', textAlign: 'center' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {roles.map((role) => (
              <tr key={role.roleId}>
                <td style={{ padding: '8px' }}>{role.name}</td>
                <td style={{ padding: '8px' }}>{role.description}</td>
                <td style={{ padding: '8px', textAlign: 'center' }}>
                  <button onClick={() => handleEditRole(role.roleId)} style={{ marginRight: '5px' }}>
                    <span role="img" aria-label="pencil icon">✏️</span> Edit
                  </button>
                  <button onClick={() => handleDeleteRole(role.roleId)}>
                    <span role="img" aria-label="trash icon">🗑️</span> Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default RolePage;