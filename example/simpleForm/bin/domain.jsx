/**
 * @typedef {object} User
 * @property {string} userId - The unique identifier for the user.
 * @property {string} name - The name of the user.
 * @property {string} email - The email address of the user.
 * @property {'admin'|'editor'|'viewer'} role - The role of the user.
 * @property {'active'|'inactive'|'pending'} status - The status of the user account.
 * @property {string} createdAt - The creation timestamp (ISO 8601 string).
 * @property {string} updatedAt - The last update timestamp (ISO 8601 string).
 */

/**
 * Represents the structure and default values for a User domain object.
 * @type {User}
 */
export const User = {
  userId: '',
  name: '',
  email: '',
  role: 'viewer', // Default role
  status: 'pending', // Default status
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

/**
 * @typedef {object} Role
 * @property {string} roleId - The unique identifier for the role.
 * @property {string} name - The name of the role.
 * @property {string} description - A description of the role.
 */

/**
 * Represents the structure and default values for a Role domain object.
 * @type {Role}
 */
export const Role = {
  roleId: '',
  name: '',
  description: '',
};