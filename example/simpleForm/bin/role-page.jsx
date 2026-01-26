import React, { useState, useEffect, useCallback } from 'react';
import { useRoleStore } from "./store";
import RoleDetail from "./role-detail";

/**
 * @typedef {Object} Role
 * @property {string} roleId
 * @property {string} name
 * @property {string} description
 */

/**
 * Main Page for Role Management
 * @returns {JSX.Element} The Role Management page component.
 */
export default function RolePage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showRoleDetail, setShowRoleDetail] = useState(false);
  /** @type {Role | null} */
  const [editingRole, setEditingRole] = useState(null);

  const {
    roles: storeRoles,
    roleError: storeRoleError,
    loadRoles: loadRolesFromStore,
    removeRole,
  } = useRoleStore();

  /**
   * @capability renderRoleList
   * Displays the list of roles fetched from the store.
   * Flow:
   * 1. Call `RoleStore.loadRoles` to fetch data.
   * 2. Render the Grid with the role list.
   */
  const loadRolesData = useCallback(async () => {
    setLoading(true);
    setError(null);
    const { error: fetchError } = await loadRolesFromStore();
    if (fetchError) {
      setError(fetchError);
    }
    setLoading(false);
  }, [loadRolesFromStore]);

  useEffect(() => {
    loadRolesData();
  }, [loadRolesData]);

  useEffect(() => {
    if (storeRoleError) {
      setError(storeRoleError);
    }
  }, [storeRoleError]);

  /**
   * @capability handleAddRole
   * Triggers the navigation or display of the RoleDetail form for creating a new role.
   */
  const handleAddRole = useCallback(() => {
    setEditingRole(null); // Indicate new role
    setShowRoleDetail(true);
  }, []);

  /**
   * @capability handleEditRole
   * Triggers the navigation or display of the RoleDetail form for editing an existing role.
   * @param {string} roleId - The ID of the role to edit.
   */
  const handleEditRole = useCallback((roleId) => {
    const roleToEdit = storeRoles.find(role => role.roleId === roleId);
    if (roleToEdit) {
      setEditingRole(roleToEdit);
      setShowRoleDetail(true);
    } else {
      setError("Role not found for editing.");
    }
  }, [storeRoles]);

  /**
   * @capability handleDeleteRole
   * Handles the deletion of a role.
   * Flow:
   * 1. Confirm deletion with the user.
   * 2. Call `RoleStore.removeRole(roleId)`.
   * 3. Refresh the list via `renderRoleList`.
   * @param {string} roleId - The ID of the role to delete.
   */
  const handleDeleteRole = useCallback(async (roleId) => {
    if (window.confirm("Are you sure you want to delete this role?")) {
      const { success, error: deleteError } = await removeRole(roleId);
      if (success) {
        await loadRolesData(); // Refresh the list after successful deletion
      } else {
        setError(deleteError || "Failed to delete role.");
      }
    }
  }, [removeRole, loadRolesData]);

  /**
   * Callback for when RoleDetail successfully saves a role.
   */
  const handleDetailSaveSuccess = useCallback(() => {
    setShowRoleDetail(false);
    setEditingRole(null);
    loadRolesData(); // Refresh list
  }, [loadRolesData]);

  /**
   * Callback for when RoleDetail fails to save a role.
   * @param {string} errorMessage - The error message from the save operation.
   */
  const handleDetailSaveFailure = useCallback((errorMessage) => {
    setError(errorMessage);
  }, []);

  /**
   * Callback for when RoleDetail cancels the operation.
   */
  const handleDetailCancel = useCallback(() => {
    setShowRoleDetail(false);
    setEditingRole(null);
  }, []);

  if (showRoleDetail) {
    return (
      <div className="p-6 max-w-4xl mx-auto bg-white rounded-xl shadow-md space-y-4">
        <RoleDetail
          role={editingRole}
          onSaveSuccess={handleDetailSaveSuccess}
          onSaveFailure={handleDetailSaveFailure}
          onCancel={handleDetailCancel}
        />
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto bg-white rounded-xl shadow-md space-y-4">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Role Management</h1>

      <button
        onClick={handleAddRole}
        className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg flex items-center space-x-2 transition duration-150 ease-in-out"
      >
        <span className="text-xl">+</span>
        <span>Add New Role</span>
      </button>

      {loading && (
        <p className="text-gray-600">Loading roles...</p>
      )}

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Error:</strong>
          <span className="block sm:inline"> {error}</span>
        </div>
      )}

      {!loading && !error && storeRoles.length === 0 && (
        <p className="text-gray-600">No roles found. Add a new role to get started!</p>
      )}

      {!loading && !error && storeRoles.length > 0 && (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 shadow-sm rounded-lg overflow-hidden">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Description
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {storeRoles.map((role) => (
                <tr key={role.roleId}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {role.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {role.description}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => handleEditRole(role.roleId)}
                      className="text-indigo-600 hover:text-indigo-900 mr-4"
                      title="Edit"
                    >
                      {/* Placeholder for pencil icon */}
                      <span className="sr-only">Edit</span>
                      ✏️
                    </button>
                    <button
                      onClick={() => handleDeleteRole(role.roleId)}
                      className="text-red-600 hover:text-red-900"
                      title="Delete"
                    >
                      {/* Placeholder for trash icon */}
                      <span className="sr-only">Delete</span>
                      🗑️
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}