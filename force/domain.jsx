/**
 * Project: Domain Simple Form
 * Version: 1.0.0
 * ISL Version: 1.6.1
 * Created: 2026-01-23
 * Implementation: ./domain.jsx
 *
 * This file defines the structure of the core domain entities: User and Role.
 * It exports constant objects representing the schema for these entities,
 * adhering to the 'Backend' role by focusing on data structure rather than UI.
 */

/**
 * @typedef {object} User
 * @property {string | null} userId - The unique identifier for the user.
 * @property {string} name - The user's full name.
 * @property {string} email - The user's email address.
 * @property {'admin' | 'editor' | 'viewer' | null} role - The user's role within the system.
 * @property {'active' | 'inactive' | 'pending' | null} status - The current status of the user account.
 * @property {Date | string | null} createdAt - The timestamp when the user was created.
 * @property {Date | string | null} updatedAt - The timestamp when the user was last updated.
 */

/**
 * Represents the schema for a User domain object.
 * Role: Backend - Defines the data structure.
 * Constraint: Must export a constant object named `User`.
 * @type {User}
 */
export const User = {
  userId: null, // Identity
  name: '',
  email: '',
  role: null, // enum (admin, editor, viewer)
  status: null, // enum (active, inactive, pending)
  createdAt: null, // datetime
  updatedAt: null, // datetime
};

/**
 * @typedef {object} Role
 * @property {string | null} roleId - The unique identifier for the role.
 * @property {string} name - The name of the role (e.g., "Administrator").
 * @property {string} description - A brief description of the role's permissions or purpose.
 */

/**
 * Represents the schema for a Role domain object.
 * Role: Backend - Defines the data structure.
 * Constraint: Must export a constant object named `Role`.
 * @type {Role}
 */
export const Role = {
  roleId: null, // Identity
  name: '',
  description: '',
};