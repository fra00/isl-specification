import { useState, useCallback } from "react";
import { User, Role } from "./domain"; // Relative path from ./store.jsx to ./domain.jsx
import { useApiUser, useApiRole } from "./api"; // Relative path from ./store.jsx to ./api.jsx

/**
 * @typedef {import("./domain").User} User
 * @typedef {import("./domain").Role} Role
 */

/**
 * Custom hook for managing user-related business logic and state.
 * @returns {{
 *   users: User[],
 *   loadingUsers: boolean,
 *   userError: string | null,
 *   loadUsers: () => Promise<{ users: User[], error: string | null }>,
 *   addUser: (user: User) => Promise<{ success: boolean, error: string | null }>,
 *   saveUser: (userId: string, user: User) => Promise<{ success: boolean, error: string | null }>,
 *   removeUser: (userId: string) => Promise<{ success: boolean, error: string | null }>
 * }}
 */
export const useUserStore = () => {
  const [users, setUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [userError, setUserError] = useState(null);

  const { fetchAllUsers, createUser, updateUser, deleteUser } = useApiUser();

  /**
   * Calls ApiUser to fetch all users and updates the application state.
   * @returns {Promise<{ users: User[], error: string | null }>}
   */
  const loadUsers = useCallback(async () => {
    setLoadingUsers(true);
    setUserError(null);
    const { users: fetchedUsers, errorMessage } = await fetchAllUsers();
    if (errorMessage) {
      setUserError(errorMessage);
      setLoadingUsers(false);
      return { users: [], error: errorMessage };
    }
    setUsers(fetchedUsers);
    setLoadingUsers(false);
    return { users: fetchedUsers, error: null };
  }, [fetchAllUsers]);

  /**
   * Validates and sends a new user to ApiUser.
   * If successful, updates the local user list.
   * @param {User} user - The user object to add.
   * @returns {Promise<{ success: boolean, error: string | null }>}
   */
  const addUser = useCallback(async (user) => {
    setLoadingUsers(true);
    setUserError(null);
    const { success, errorMessage } = await createUser(user);
    if (errorMessage) {
      setUserError(errorMessage);
      setLoadingUsers(false);
      return { success: false, error: errorMessage };
    }
    if (success) {
      // Assuming the user object passed already has a userId or the API handles ID generation.
      // If the API returned the created user with its final ID, we would use that to update state.
      setUsers((prevUsers) => [...prevUsers, user]);
    }
    setLoadingUsers(false);
    return { success, error: null };
  }, [createUser]);

  /**
   * Updates an existing user via ApiUser.
   * If successful, updates the local user list.
   * @param {string} userId - The ID of the user to update.
   * @param {User} user - The updated user object.
   * @returns {Promise<{ success: boolean, error: string | null }>}
   */
  const saveUser = useCallback(async (userId, user) => {
    setLoadingUsers(true);
    setUserError(null);
    const { success, errorMessage } = await updateUser(userId, user);
    if (errorMessage) {
      setUserError(errorMessage);
      setLoadingUsers(false);
      return { success: false, error: errorMessage };
    }
    if (success) {
      setUsers((prevUsers) =>
        prevUsers.map((u) => (u.userId === userId ? { ...u, ...user } : u))
      );
    }
    setLoadingUsers(false);
    return { success, error: null };
  }, [updateUser]);

  /**
   * Removes a user via ApiUser and updates the local list.
   * @param {string} userId - The ID of the user to remove.
   * @returns {Promise<{ success: boolean, error: string | null }>}
   */
  const removeUser = useCallback(async (userId) => {
    setLoadingUsers(true);
    setUserError(null);
    const { success, errorMessage } = await deleteUser(userId);
    if (errorMessage) {
      setUserError(errorMessage);
      setLoadingUsers(false);
      return { success: false, error: errorMessage };
    }
    if (success) {
      setUsers((prevUsers) => prevUsers.filter((u) => u.userId !== userId));
    }
    setLoadingUsers(false);
    return { success, error: null };
  }, [deleteUser]);

  return {
    users,
    loadingUsers,
    userError,
    loadUsers,
    addUser,
    saveUser,
    removeUser,
  };
};

/**
 * Custom hook for managing role-related business logic and state.
 * @returns {{
 *   roles: Role[],
 *   loadingRoles: boolean,
 *   roleError: string | null,
 *   loadRoles: () => Promise<{ roles: Role[], error: string | null }>,
 *   addRole: (role: Role) => Promise<{ success: boolean, error: string | null }>,
 *   saveRole: (roleId: string, role: Role) => Promise<{ success: boolean, error: string | null }>,
 *   removeRole: (roleId: string) => Promise<{ success: boolean, error: string | null }>
 * }}
 */
export const useRoleStore = () => {
  const [roles, setRoles] = useState([]);
  const [loadingRoles, setLoadingRoles] = useState(false);
  const [roleError, setRoleError] = useState(null);

  const { fetchAllRoles, createRole, updateRole, deleteRole } = useApiRole();

  /**
   * Calls ApiRole to fetch all roles.
   * @returns {Promise<{ roles: Role[], error: string | null }>}
   */
  const loadRoles = useCallback(async () => {
    setLoadingRoles(true);
    setRoleError(null);
    const { roles: fetchedRoles, errorMessage } = await fetchAllRoles();
    if (errorMessage) {
      setRoleError(errorMessage);
      setLoadingRoles(false);
      return { roles: [], error: errorMessage };
    }
    setRoles(fetchedRoles);
    setLoadingRoles(false);
    return { roles: fetchedRoles, error: null };
  }, [fetchAllRoles]);

  /**
   * Adds a new role via ApiRole.
   * If successful, updates the local role list.
   * @param {Role} role - The role object to add.
   * @returns {Promise<{ success: boolean, error: string | null }>}
   */
  const addRole = useCallback(async (role) => {
    setLoadingRoles(true);
    setRoleError(null);
    const { success, errorMessage } = await createRole(role);
    if (errorMessage) {
      setRoleError(errorMessage);
      setLoadingRoles(false);
      return { success: false, error: errorMessage };
    }
    if (success) {
      // Assuming the role object passed already has a roleId or the API handles ID generation.
      setRoles((prevRoles) => [...prevRoles, role]);
    }
    setLoadingRoles(false);
    return { success, error: null };
  }, [createRole]);

  /**
   * Updates an existing role via ApiRole.
   * If successful, updates the local role list.
   * @param {string} roleId - The ID of the role to update.
   * @param {Role} role - The updated role object.
   * @returns {Promise<{ success: boolean, error: string | null }>}
   */
  const saveRole = useCallback(async (roleId, role) => {
    setLoadingRoles(true);
    setRoleError(null);
    const { success, errorMessage } = await updateRole(roleId, role);
    if (errorMessage) {
      setRoleError(errorMessage);
      setLoadingRoles(false);
      return { success: false, error: errorMessage };
    }
    if (success) {
      setRoles((prevRoles) =>
        prevRoles.map((r) => (r.roleId === roleId ? { ...r, ...role } : r))
      );
    }
    setLoadingRoles(false);
    return { success, error: null };
  }, [updateRole]);

  /**
   * Removes a role via ApiRole.
   * If successful, updates the local role list.
   * @param {string} roleId - The ID of the role to remove.
   * @returns {Promise<{ success: boolean, error: string | null }>}
   */
  const removeRole = useCallback(async (roleId) => {
    setLoadingRoles(true);
    setRoleError(null);
    const { success, errorMessage } = await deleteRole(roleId);
    if (errorMessage) {
      setRoleError(errorMessage);
      setLoadingRoles(false);
      return { success: false, error: errorMessage };
    }
    if (success) {
      setRoles((prevRoles) => prevRoles.filter((r) => r.roleId !== roleId));
    }
    setLoadingRoles(false);
    return { success, error: null };
  }, [deleteRole]);

  return {
    roles,
    loadingRoles,
    roleError,
    loadRoles,
    addRole,
    saveRole,
    removeRole,
  };
};