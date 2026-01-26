import { useCallback } from 'react';
import { User, Role } from './domain'; // Import User and Role as per dependency interface

/**
 * @typedef {'admin' | 'editor' | 'viewer'} UserRoleEnum
 * @typedef {'active' | 'inactive' | 'pending'} UserStatusEnum
 */

/**
 * @typedef {object} User
 * @property {string} userId
 * @property {string} name
 * @property {string} email
 * @property {UserRoleEnum} role
 * @property {UserStatusEnum} status
 * @property {string} createdAt - ISO 8601 date string
 * @property {string} updatedAt - ISO 8601 date string
 */

/**
 * @typedef {object} Role
 * @property {string} roleId
 * @property {string} name
 * @property {string} description
 */

/** @type {User[]} */
let _mockUsers = [
  { userId: '1', name: 'Alice Smith', email: 'alice@example.com', role: 'admin', status: 'active', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { userId: '2', name: 'Bob Johnson', email: 'bob@example.com', role: 'editor', status: 'active', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { userId: '3', name: 'Charlie Brown', email: 'charlie@example.com', role: 'viewer', status: 'inactive', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
];

/** @type {Role[]} */
let _mockRoles = [
  { roleId: 'r1', name: 'admin', description: 'Administrator role' },
  { roleId: 'r2', name: 'editor', description: 'Editor role' },
  { roleId: 'r3', name: 'viewer', description: 'Viewer role' },
];

/**
 * Helper function to simulate network delay.
 * @param {number} ms - The delay in milliseconds.
 * @returns {Promise<void>}
 */
const simulateDelay = (ms = 500) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Mock API layer for User management.
 * Simulates data persistence and retrieval for users in-memory.
 * @returns {{
 *   fetchAllUsers: () => Promise<{ users: User[] | null, errorMessage: string | null }>,
 *   createUser: (user: Omit<User, 'userId' | 'createdAt' | 'updatedAt'> & Partial<Pick<User, 'userId'>>) => Promise<{ success: boolean, errorMessage: string | null }>,
 *   updateUser: (userId: string, user: Partial<Omit<User, 'userId' | 'createdAt' | 'updatedAt'>>) => Promise<{ success: boolean, errorMessage: string | null }>,
 *   deleteUser: (userId: string) => Promise<{ success: boolean, errorMessage: string | null }>
 * }}
 */
export const useApiUser = () => {
  /**
   * Retrieves the list of all users.
   * @returns {Promise<{ users: User[] | null, errorMessage: string | null }>}
   */
  const fetchAllUsers = useCallback(async () => {
    await simulateDelay();
    try {
      return { users: [..._mockUsers], errorMessage: null };
    } catch (error) {
      console.error("Error fetching users:", error);
      return { users: null, errorMessage: "Failed to fetch users." };
    }
  }, []);

  /**
   * Creates a new user.
   * @param {Omit<User, 'userId' | 'createdAt' | 'updatedAt'> & Partial<Pick<User, 'userId'>>} user - The user object to create.
   * @returns {Promise<{ success: boolean, errorMessage: string | null }>}
   */
  const createUser = useCallback(async (user) => {
    await simulateDelay();
    try {
      const newUserId = user.userId || `user-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      if (_mockUsers.some(u => u.userId === newUserId)) {
        return { success: false, errorMessage: "User with this ID already exists." };
      }
      const now = new Date().toISOString();
      const newUser = {
        ...user,
        userId: newUserId,
        createdAt: now,
        updatedAt: now,
      };
      _mockUsers.push(newUser);
      return { success: true, errorMessage: null };
    } catch (error) {
      console.error("Error creating user:", error);
      return { success: false, errorMessage: "Failed to create user." };
    }
  }, []);

  /**
   * Updates an existing user.
   * @param {string} userId - The ID of the user to update.
   * @param {Partial<Omit<User, 'userId' | 'createdAt' | 'updatedAt'>>} user - The partial user object with updated properties.
   * @returns {Promise<{ success: boolean, errorMessage: string | null }>}
   */
  const updateUser = useCallback(async (userId, user) => {
    await simulateDelay();
    try {
      const index = _mockUsers.findIndex(u => u.userId === userId);
      if (index === -1) {
        return { success: false, errorMessage: "User not found." };
      }
      const updatedUser = {
        ..._mockUsers[index],
        ...user,
        userId: userId, // Ensure ID doesn't change
        updatedAt: new Date().toISOString(),
      };
      _mockUsers[index] = updatedUser;
      return { success: true, errorMessage: null };
    } catch (error) {
      console.error("Error updating user:", error);
      return { success: false, errorMessage: "Failed to update user." };
    }
  }, []);

  /**
   * Deletes a user.
   * @param {string} userId - The ID of the user to delete.
   * @returns {Promise<{ success: boolean, errorMessage: string | null }>}
   */
  const deleteUser = useCallback(async (userId) => {
    await simulateDelay();
    try {
      const initialLength = _mockUsers.length;
      _mockUsers = _mockUsers.filter(u => u.userId !== userId);
      if (_mockUsers.length === initialLength) {
        return { success: false, errorMessage: "User not found." };
      }
      return { success: true, errorMessage: null };
    } catch (error) {
      console.error("Error deleting user:", error);
      return { success: false, errorMessage: "Failed to delete user." };
    }
  }, []);

  return {
    fetchAllUsers,
    createUser,
    updateUser,
    deleteUser,
  };
};

/**
 * Mock API layer for Role management.
 * Simulates data persistence and retrieval for roles in-memory.
 * @returns {{
 *   fetchAllRoles: () => Promise<{ roles: Role[] | null, errorMessage: string | null }>,
 *   createRole: (role: Omit<Role, 'roleId'> & Partial<Pick<Role, 'roleId'>>) => Promise<{ success: boolean, errorMessage: string | null }>,
 *   updateRole: (roleId: string, role: Partial<Omit<Role, 'roleId'>>) => Promise<{ success: boolean, errorMessage: string | null }>,
 *   deleteRole: (roleId: string) => Promise<{ success: boolean, errorMessage: string | null }>
 * }}
 */
export const useApiRole = () => {
  /**
   * Retrieves the list of all roles.
   * @returns {Promise<{ roles: Role[] | null, errorMessage: string | null }>}
   */
  const fetchAllRoles = useCallback(async () => {
    await simulateDelay();
    try {
      return { roles: [..._mockRoles], errorMessage: null };
    } catch (error) {
      console.error("Error fetching roles:", error);
      return { roles: null, errorMessage: "Failed to fetch roles." };
    }
  }, []);

  /**
   * Creates a new role.
   * @param {Omit<Role, 'roleId'> & Partial<Pick<Role, 'roleId'>>} role - The role object to create.
   * @returns {Promise<{ success: boolean, errorMessage: string | null }>}
   */
  const createRole = useCallback(async (role) => {
    await simulateDelay();
    try {
      const newRoleId = role.roleId || `role-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      if (_mockRoles.some(r => r.roleId === newRoleId)) {
        return { success: false, errorMessage: "Role with this ID already exists." };
      }
      _mockRoles.push({ ...role, roleId: newRoleId });
      return { success: true, errorMessage: null };
    } catch (error) {
      console.error("Error creating role:", error);
      return { success: false, errorMessage: "Failed to create role." };
    }
  }, []);

  /**
   * Updates an existing role.
   * @param {string} roleId - The ID of the role to update.
   * @param {Partial<Omit<Role, 'roleId'>>} role - The partial role object with updated properties.
   * @returns {Promise<{ success: boolean, errorMessage: string | null }>}
   */
  const updateRole = useCallback(async (roleId, role) => {
    await simulateDelay();
    try {
      const index = _mockRoles.findIndex(r => r.roleId === roleId);
      if (index === -1) {
        return { success: false, errorMessage: "Role not found." };
      }
      const updatedRole = {
        ..._mockRoles[index],
        ...role,
        roleId: roleId, // Ensure ID doesn't change
      };
      _mockRoles[index] = updatedRole;
      return { success: true, errorMessage: null };
    } catch (error) {
      console.error("Error updating role:", error);
      return { success: false, errorMessage: "Failed to update role." };
    }
  }, []);

  /**
   * Deletes a role.
   * @param {string} roleId - The ID of the role to delete.
   * @returns {Promise<{ success: boolean, errorMessage: string | null }>}
   */
  const deleteRole = useCallback(async (roleId) => {
    await simulateDelay();
    try {
      const initialLength = _mockRoles.length;
      _mockRoles = _mockRoles.filter(r => r.roleId !== roleId);
      if (_mockRoles.length === initialLength) {
        return { success: false, errorMessage: "Role not found." };
      }
      return { success: true, errorMessage: null };
    } catch (error) {
      console.error("Error deleting role:", error);
      return { success: false, errorMessage: "Failed to delete role." };
    }
  }, []);

  return {
    fetchAllRoles,
    createRole,
    updateRole,
    deleteRole,
  };
};