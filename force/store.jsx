import React, { useState, useCallback } from 'react';
import { ApiUser, ApiRole } from './api'; // Relative path from ./store.jsx to ./api.jsx
import { User, Role } from './domain'; // Relative path from ./store.jsx to ./domain.jsx

/**
 * @typedef {import('./domain').User} User
 * @typedef {import('./domain').Role} Role
 */

/**
 * Custom hook for managing user-related business logic and state.
 * Implements capabilities for loading, adding, saving, and removing users.
 *
 * @returns {{
 *   users: User[],
 *   userError: string | null,
 *   loadUsers: () => Promise<{ users: User[], error: string | null }>,
 *   addUser: (user: User) => Promise<{ success: boolean, error: string | null }>,
 *   saveUser: (userId: string, user: User) => Promise<{ success: boolean, error: string | null }>,
 *   removeUser: (userId: string) => Promise<{ success: boolean, error: string | null }>
 * }}
 */
export const useUserStore = () => {
  const [users, setUsers] = useState([]);
  const [userError, setUserError] = useState(null);

  /**
   * Calls ApiUser to fetch all users and updates the application state.
   * @returns {Promise<{ users: User[], error: string | null }>}
   */
  const loadUsers = useCallback(async () => {
    setUserError(null); // Clear previous errors
    const { users: fetchedUsers, errorMessage } = await ApiUser.fetchAllUsers();

    if (errorMessage) {
      setUserError(errorMessage);
      return { users: [], error: errorMessage };
    }

    setUsers(fetchedUsers);
    return { users: fetchedUsers, error: null };
  }, []);

  /**
   * Validates and sends a new user to ApiUser.
   * Updates the local user list upon success.
   * @param {User} user - The user object to add.
   * @returns {Promise<{ success: boolean, error: string | null }>}
   */
  const addUser = useCallback(async (user) => {
    setUserError(null); // Clear previous errors
    const { success, errorMessage } = await ApiUser.createUser(user);

    if (errorMessage) {
      setUserError(errorMessage);
      return { success: false, error: errorMessage };
    }

    if (success) {
      // Optimistically add the new user to the state.
      // In a real application, the API would typically return the full created user object,
      // including its server-generated ID. For this mock, we assume the input 'user'
      // is sufficient and add a temporary ID if not present.
      setUsers(prevUsers => [...prevUsers, { ...user, userId: user.userId || `temp-${Date.now()}` }]);
    }
    return { success, error: errorMessage };
  }, []);

  /**
   * Updates an existing user via ApiUser.
   * Updates the local user list upon success.
   * @param {string} userId - The ID of the user to update.
   * @param {User} user - The updated user object.
   * @returns {Promise<{ success: boolean, error: string | null }>}
   */
  const saveUser = useCallback(async (userId, user) => {
    setUserError(null); // Clear previous errors
    const { success, errorMessage } = await ApiUser.updateUser(userId, user);

    if (errorMessage) {
      setUserError(errorMessage);
      return { success: false, error: errorMessage };
    }

    if (success) {
      setUsers(prevUsers =>
        prevUsers.map(u => (u.userId === userId ? { ...u, ...user } : u))
      );
    }
    return { success, error: errorMessage };
  }, []);

  /**
   * Removes a user via ApiUser and updates the local list.
   * @param {string} userId - The ID of the user to remove.
   * @returns {Promise<{ success: boolean, error: string | null }>}
   */
  const removeUser = useCallback(async (userId) => {
    setUserError(null); // Clear previous errors
    const { success, errorMessage } = await ApiUser.deleteUser(userId);

    if (errorMessage) {
      setUserError(errorMessage);
      return { success: false, error: errorMessage };
    }

    if (success) {
      setUsers(prevUsers => prevUsers.filter(u => u.userId !== userId));
    }
    return { success, error: errorMessage };
  }, []);

  return {
    users,
    userError,
    loadUsers,
    addUser,
    saveUser,
    removeUser,
  };
};

/**
 * Custom hook for managing role-related business logic and state.
 * Implements capabilities for loading, adding, saving, and removing roles.
 *
 * @returns {{
 *   roles: Role[],
 *   roleError: string | null,
 *   loadRoles: () => Promise<{ roles: Role[], error: string | null }>,
 *   addRole: (role: Role) => Promise<{ success: boolean, error: string | null }>,
 *   saveRole: (roleId: string, role: Role) => Promise<{ success: boolean, error: string | null }>,
 *   removeRole: (roleId: string) => Promise<{ success: boolean, error: string | null }>
 * }}
 */
export const useRoleStore = () => {
  const [roles, setRoles] = useState([]);
  const [roleError, setRoleError] = useState(null);

  /**
   * Calls ApiRole to fetch all roles.
   * @returns {Promise<{ roles: Role[], error: string | null }>}
   */
  const loadRoles = useCallback(async () => {
    setRoleError(null); // Clear previous errors
    const { roles: fetchedRoles, errorMessage } = await ApiRole.fetchAllRoles();

    if (errorMessage) {
      setRoleError(errorMessage);
      return { roles: [], error: errorMessage };
    }

    setRoles(fetchedRoles);
    return { roles: fetchedRoles, error: null };
  }, []);

  /**
   * Adds a new role via ApiRole.
   * Updates the local role list upon success.
   * @param {Role} role - The role object to add.
   * @returns {Promise<{ success: boolean, error: string | null }>}
   */
  const addRole = useCallback(async (role) => {
    setRoleError(null); // Clear previous errors
    const { success, errorMessage } = await ApiRole.createRole(role);

    if (errorMessage) {
      setRoleError(errorMessage);
      return { success: false, error: errorMessage };
    }

    if (success) {
      // Optimistically add the new role to the state.
      // Similar to addUser, assuming client-side ID generation for mock purposes.
      setRoles(prevRoles => [...prevRoles, { ...role, roleId: role.roleId || `temp-${Date.now()}` }]);
    }
    return { success, error: errorMessage };
  }, []);

  /**
   * Updates an existing role via ApiRole.
   * Updates the local role list upon success.
   * @param {string} roleId - The ID of the role to update.
   * @param {Role} role - The updated role object.
   * @returns {Promise<{ success: boolean, error: string | null }>}
   */
  const saveRole = useCallback(async (roleId, role) => {
    setRoleError(null); // Clear previous errors
    const { success, errorMessage } = await ApiRole.updateRole(roleId, role);

    if (errorMessage) {
      setRoleError(errorMessage);
      return { success: false, error: errorMessage };
    }

    if (success) {
      setRoles(prevRoles =>
        prevRoles.map(r => (r.roleId === roleId ? { ...r, ...role } : r))
      );
    }
    return { success, error: errorMessage };
  }, []);

  /**
   * Removes a role via ApiRole.
   * Updates the local role list upon success.
   * @param {string} roleId - The ID of the role to remove.
   * @returns {Promise<{ success: boolean, error: string | null }>}
   */
  const removeRole = useCallback(async (roleId) => {
    setRoleError(null); // Clear previous errors
    const { success, errorMessage } = await ApiRole.deleteRole(roleId);

    if (errorMessage) {
      setRoleError(errorMessage);
      return { success: false, error: errorMessage };
    }

    if (success) {
      setRoles(prevRoles => prevRoles.filter(r => r.roleId !== roleId));
    }
    return { success, error: errorMessage };
  }, []);

  return {
    roles,
    roleError,
    loadRoles,
    addRole,
    saveRole,
    removeRole,
  };
};