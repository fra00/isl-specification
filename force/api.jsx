import { User, Role } from "./domain";

// --- Mock Data Store ---
// In a real application, this would interact with a database or external service.
// For a mock API, we simulate an in-memory store.
let mockUsers = [
  {
    userId: "user-1",
    name: "Alice Smith",
    email: "alice@example.com",
    role: "admin",
    status: "active",
    createdAt: new Date("2023-01-01T10:00:00Z"),
    updatedAt: new Date("2023-01-01T10:00:00Z"),
  },
  {
    userId: "user-2",
    name: "Bob Johnson",
    email: "bob@example.com",
    role: "editor",
    status: "active",
    createdAt: new Date("2023-01-05T11:30:00Z"),
    updatedAt: new Date("2023-01-05T11:30:00Z"),
  },
];

let mockRoles = [
  { roleId: "role-1", name: "admin", description: "Administrator role" },
  { roleId: "role-2", name: "editor", description: "Editor role" },
  { roleId: "role-3", name: "viewer", description: "Viewer role" },
];

// --- Component: ApiUser ---
/**
 * Mock API layer for User management.
 * @type {object}
 */
export const ApiUser = {
  /**
   * Retrieves the list of all users.
   * @returns {{users: User[], errorMessage: string | null}}
   */
  fetchAllUsers: () => {
    try {
      // Simulate API delay
      // await new Promise(resolve => setTimeout(resolve, 500));
      return { users: [...mockUsers], errorMessage: null };
    } catch (error) {
      console.error("Error fetching users:", error);
      return { users: [], errorMessage: "Failed to fetch users." };
    }
  },

  /**
   * Creates a new user.
   * @param {User} user - The user object to create.
   * @returns {{success: boolean, errorMessage: string | null}}
   */
  createUser: (user) => {
    try {
      // Simulate API delay
      // await new Promise(resolve => setTimeout(resolve, 500));
      const newUserId = `user-${Date.now()}`;
      const now = new Date();
      const newUser = {
        ...user,
        userId: newUserId,
        createdAt: now,
        updatedAt: now,
      };
      mockUsers.push(newUser);
      return { success: true, errorMessage: null };
    } catch (error) {
      console.error("Error creating user:", error);
      return { success: false, errorMessage: "Failed to create user." };
    }
  },

  /**
   * Updates an existing user.
   * @param {string} userId - The ID of the user to update.
   * @param {User} user - The updated user object.
   * @returns {{success: boolean, errorMessage: string | null}}
   */
  updateUser: (userId, user) => {
    try {
      // Simulate API delay
      // await new Promise(resolve => setTimeout(resolve, 500));
      const index = mockUsers.findIndex((u) => u.userId === userId);
      if (index !== -1) {
        mockUsers[index] = {
          ...mockUsers[index],
          ...user,
          userId: userId, // Ensure userId remains consistent
          updatedAt: new Date(),
        };
        return { success: true, errorMessage: null };
      }
      return { success: false, errorMessage: "User not found." };
    } catch (error) {
      console.error("Error updating user:", error);
      return { success: false, errorMessage: "Failed to update user." };
    }
  },

  /**
   * Deletes a user.
   * @param {string} userId - The ID of the user to delete.
   * @returns {{success: boolean, errorMessage: string | null}}
   */
  deleteUser: (userId) => {
    try {
      // Simulate API delay
      // await new Promise(resolve => setTimeout(resolve, 500));
      const initialLength = mockUsers.length;
      mockUsers = mockUsers.filter((u) => u.userId !== userId);
      if (mockUsers.length < initialLength) {
        return { success: true, errorMessage: null };
      }
      return { success: false, errorMessage: "User not found." };
    } catch (error) {
      console.error("Error deleting user:", error);
      return { success: false, errorMessage: "Failed to delete user." };
    }
  },
};

// --- Component: ApiRole ---
/**
 * Mock API layer for Role management.
 * @type {object}
 */
export const ApiRole = {
  /**
   * Retrieves the list of all roles.
   * @returns {{roles: Role[], errorMessage: string | null}}
   */
  fetchAllRoles: () => {
    try {
      // Simulate API delay
      // await new Promise(resolve => setTimeout(resolve, 500));
      return { roles: [...mockRoles], errorMessage: null };
    } catch (error) {
      console.error("Error fetching roles:", error);
      return { roles: [], errorMessage: "Failed to fetch roles." };
    }
  },

  /**
   * Creates a new role.
   * @param {Role} role - The role object to create.
   * @returns {{success: boolean, errorMessage: string | null}}
   */
  createRole: (role) => {
    try {
      // Simulate API delay
      // await new Promise(resolve => setTimeout(resolve, 500));
      const newRoleId = `role-${Date.now()}`;
      const newRole = { ...role, roleId: newRoleId };
      mockRoles.push(newRole);
      return { success: true, errorMessage: null };
    } catch (error) {
      console.error("Error creating role:", error);
      return { success: false, errorMessage: "Failed to create role." };
    }
  },

  /**
   * Updates an existing role.
   * @param {string} roleId - The ID of the role to update.
   * @param {Role} role - The updated role object.
   * @returns {{success: boolean, errorMessage: string | null}}
   */
  updateRole: (roleId, role) => {
    try {
      // Simulate API delay
      // await new Promise(resolve => setTimeout(resolve, 500));
      const index = mockRoles.findIndex((r) => r.roleId === roleId);
      if (index !== -1) {
        mockRoles[index] = { ...mockRoles[index], ...role, roleId: roleId }; // Ensure roleId remains consistent
        return { success: true, errorMessage: null };
      }
      return { success: false, errorMessage: "Role not found." };
    } catch (error) {
      console.error("Error updating role:", error);
      return { success: false, errorMessage: "Failed to update role." };
    }
  },

  /**
   * Deletes a role.
   * @param {string} roleId - The ID of the role to delete.
   * @returns {{success: boolean, errorMessage: string | null}}
   */
  deleteRole: (roleId) => {
    try {
      // Simulate API delay
      // await new Promise(resolve => setTimeout(resolve, 500));
      const initialLength = mockRoles.length;
      mockRoles = mockRoles.filter((r) => r.roleId !== roleId);
      if (mockRoles.length < initialLength) {
        return { success: true, errorMessage: null };
      }
      return { success: false, errorMessage: "Role not found." };
    } catch (error) {
      console.error("Error deleting role:", error);
      return { success: false, errorMessage: "Failed to delete role." };
    }
  },
};