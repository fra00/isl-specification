import React, { useState, useEffect, useCallback } from 'react';
import { useUserStore, useRoleStore } from "./store";
import { User, Role } from "./domain"; // Assuming User and Role are exported as named exports from domain.jsx

/**
 * @typedef {Object} UserDetailProps
 * @property {User | null} [user] - The user object to pre-fill the form for editing. If null or undefined, it's a new user.
 * @property {() => void} onSaveSuccess - Callback function to be called after a successful save operation.
 * @property {() => void} onCancel - Callback function to be called when the cancel button is clicked.
 */

/**
 * UserDetail component for creating and editing users.
 *
 * @param {UserDetailProps} props
 */
export default function UserDetail({ user, onSaveSuccess, onCancel }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [selectedRole, setSelectedRole] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const { addUser, saveUser } = useUserStore();
  const { roles, loadRoles } = useRoleStore();

  // Hardcoded status options based on User domain definition
  const statusOptions = ['active', 'inactive', 'pending'];

  /**
   * Effect to load roles when the component mounts.
   */
  useEffect(() => {
    loadRoles();
  }, [loadRoles]);

  /**
   * Effect to populate form fields when a user prop is provided (for editing).
   */
  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setEmail(user.email || '');
      setSelectedRole(user.role || '');
      setSelectedStatus(user.status || '');
    } else {
      // Reset form for new user
      setName('');
      setEmail('');
      setSelectedRole('');
      setSelectedStatus('');
    }
    setErrors({}); // Clear errors on user change
  }, [user]);

  /**
   * Validates the form fields.
   * @returns {boolean} True if the form is valid, false otherwise.
   */
  const validateForm = useCallback(() => {
    const newErrors = {};
    if (!name.trim()) {
      newErrors.name = 'Name is required.';
    }
    if (!email.trim()) {
      newErrors.email = 'Email is required.';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Email is invalid.';
    }
    if (!selectedRole) {
      newErrors.role = 'Role is required.';
    }
    if (!selectedStatus) {
      newErrors.status = 'Status is required.';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [name, email, selectedRole, selectedStatus]);

  /**
   * Handles the save operation for creating or updating a user.
   * @type {() => Promise<void>}
   */
  const handleSave = useCallback(async () => {
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    const userData = {
      name,
      email,
      role: selectedRole,
      status: selectedStatus,
    };

    let result;
    if (user && user.userId) {
      // Editing existing user
      result = await saveUser(user.userId, userData);
    } else {
      // Creating new user
      result = await addUser(userData);
    }

    if (result.success) {
      onSaveSuccess();
    } else {
      // Handle error, e.g., display a toast or update local error state
      console.error("Save failed:", result.error);
      setErrors(prev => ({ ...prev, form: result.error || 'An unexpected error occurred.' }));
    }
    setIsLoading(false);
  }, [name, email, selectedRole, selectedStatus, user, validateForm, addUser, saveUser, onSaveSuccess]);

  /**
   * Handles the cancel operation.
   * @type {() => void}
   */
  const handleCancel = useCallback(() => {
    onCancel();
  }, [onCancel]);

  return (
    <div className="max-w-lg mx-auto p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">
        {user ? 'Edit User' : 'New User'}
      </h2>

      <form onSubmit={(e) => { e.preventDefault(); handleSave(); }}>
        {/* Name Input */}
        <div className="mb-4">
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Name</label>
          <input
            type="text"
            id="name"
            className={`mt-1 block w-full px-3 py-2 border ${errors.name ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
        </div>

        {/* Email Input */}
        <div className="mb-4">
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input
            type="email"
            id="email"
            className={`mt-1 block w-full px-3 py-2 border ${errors.email ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
        </div>

        {/* Role Dropdown */}
        <div className="mb-4">
          <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">Role</label>
          <select
            id="role"
            className={`mt-1 block w-full pl-3 pr-10 py-2 text-base border ${errors.role ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md`}
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
            required
          >
            <option value="">Select a role</option>
            {roles.map((r) => (
              <option key={r.roleId} value={r.name.toLowerCase()}>
                {r.name}
              </option>
            ))}
          </select>
          {errors.role && <p className="mt-1 text-sm text-red-600">{errors.role}</p>}
        </div>

        {/* Status Dropdown */}
        <div className="mb-6">
          <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">Status</label>
          <select
            id="status"
            className={`mt-1 block w-full pl-3 pr-10 py-2 text-base border ${errors.status ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md`}
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            required
          >
            <option value="">Select a status</option>
            {statusOptions.map((s) => (
              <option key={s} value={s}>
                {s.charAt(0).toUpperCase() + s.slice(1)}
              </option>
            ))}
          </select>
          {errors.status && <p className="mt-1 text-sm text-red-600">{errors.status}</p>}
        </div>

        {errors.form && <p className="mb-4 text-sm text-red-600 text-center">{errors.form}</p>}

        {/* Action Buttons */}
        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={handleCancel}
            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            disabled={isLoading}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            disabled={isLoading}
          >
            {isLoading ? 'Saving...' : 'Save'}
          </button>
        </div>
      </form>
    </div>
  );
}