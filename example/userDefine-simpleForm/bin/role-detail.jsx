import React, { useState, useEffect, useCallback } from 'react';
import { useRoleStore } from './store';
/**
 * @typedef {Object} Role
 * @property {string} [roleId] - The unique identifier for the role. Optional for new roles.
 * @property {string} name - The name of the role.
 * @property {string} [description] - A description of the role.
 */

/**
 * RoleDetail component for creating and editing roles.
 *
 * @param {Object} props - The component props.
 * @param {Role | null} props.role - The role object to edit, or null for a new role.
 * @param {function(): void} props.onSaveSuccess - Callback function to execute after a successful save.
 * @param {function(string): void} props.onSaveFailure - Callback function to execute after a failed save, with an error message.
 * @param {function(): void} props.onCancel - Callback function to execute when the cancel button is clicked.
 */
export default function RoleDetail({ role, onSaveSuccess, onSaveFailure, onCancel }) {
  const [name, setName] = useState(role?.name || '');
  const [description, setDescription] = useState(role?.description || '');
  const [errors, setErrors] = useState({});
  const [isSaving, setIsSaving] = useState(false);

  const { addRole, saveRole } = useRoleStore();

  // Effect to update form fields when the 'role' prop changes (e.g., for editing a different role)
  useEffect(() => {
    setName(role?.name || '');
    setDescription(role?.description || '');
    setErrors({}); // Clear errors when role changes
  }, [role]);

  /**
   * Handles the form submission for saving a role.
   * Validates fields and calls the appropriate store action (add or save).
   * @param {Event} event - The form submission event.
   */
  const handleSave = useCallback(async (event) => {
    event.preventDefault();
    setIsSaving(true);
    setErrors({}); // Clear previous errors

    const newErrors = {};
    if (!name.trim()) {
      newErrors.name = 'Name is required.';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setIsSaving(false);
      return;
    }

    const roleData = { name, description };
    let result;

    try {
      if (role && role.roleId) {
        // Editing an existing role
        result = await saveRole(role.roleId, roleData);
      } else {
        // Adding a new role
        result = await addRole(roleData);
      }

      if (result.success) {
        onSaveSuccess();
      } else {
        onSaveFailure(result.error || 'An unknown error occurred during save.');
      }
    } catch (error) {
      console.error('Error saving role:', error);
      onSaveFailure(error.message || 'An unexpected error occurred.');
    } finally {
      setIsSaving(false);
    }
  }, [name, description, role, addRole, saveRole, onSaveSuccess, onSaveFailure]);

  /**
   * Handles the cancel action, invoking the onCancel callback.
   */
  const handleCancel = useCallback(() => {
    onCancel();
  }, [onCancel]);

  const formTitle = role && role.roleId ? 'Edit Role' : 'New Role';

  return (
    <div className="max-w-md mx-auto p-6 bg-white shadow-md rounded-lg">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">{formTitle}</h1>
      <form onSubmit={handleSave}>
        <div className="mb-4">
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
            Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="name"
            className={`mt-1 block w-full px-3 py-2 border ${errors.name ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            disabled={isSaving}
          />
          {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
        </div>

        <div className="mb-6">
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            id="description"
            rows="3"
            className={`mt-1 block w-full px-3 py-2 border ${errors.description ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            disabled={isSaving}
          ></textarea>
          {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description}</p>}
        </div>

        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={handleCancel}
            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            disabled={isSaving}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isSaving}
          >
            {isSaving ? 'Saving...' : 'Save'}
          </button>
        </div>
      </form>
    </div>
  );
}