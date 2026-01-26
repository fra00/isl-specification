import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Assuming react-router-dom for navigation
import { Role } from './domain'; // Relative import based on implementation path
import { useRoleStore } from './store'; // Relative import based on implementation path

/**
 * RoleDetail Component
 *
 * Form component for creating and editing roles.
 *
 * @param {object} props
 * @param {Role | null} props.role - The role object to edit, or null for a new role.
 */
const RoleDetail = ({ role }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const { addRole, saveRole } = useRoleStore();

  useEffect(() => {
    if (role) {
      setName(role.name || '');
      setDescription(role.description || '');
    } else {
      setName('');
      setDescription('');
    }
    setErrors({}); // Clear errors on role change
  }, [role]);

  /**
   * Validates the form fields.
   * @returns {boolean} True if the form is valid, false otherwise.
   */
  const validateForm = () => {
    const newErrors = {};
    if (!name.trim()) {
      newErrors.name = 'Name is required.';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /**
   * Handles the save action for the role form.
   *
   * @param {React.FormEvent} event - The form submission event.
   */
  const handleSave = async (event) => {
    event.preventDefault();

    if (!validateForm()) {
      return;
    }

    const roleToSave = {
      ...role, // Preserve existing roleId if editing
      name: name.trim(),
      description: description.trim(),
    };

    let success = false;
    let error = null;

    if (roleToSave.roleId) {
      // IF role has ID: Call RoleStore.saveRole.
      const result = await saveRole(roleToSave.roleId, roleToSave);
      success = result.success;
      error = result.error;
    } else {
      // ELSE: Call RoleStore.addRole.
      const result = await addRole(roleToSave);
      success = result.success;
      error = result.error;
    }

    if (success) {
      // Navigate back to Role List.
      navigate('/roles'); // Assuming '/roles' is the list page
    } else {
      // Handle error, e.g., display a toast or update error state
      console.error('Failed to save role:', error);
      setErrors(prev => ({ ...prev, form: error || 'An unexpected error occurred.' }));
    }
  };

  /**
   * Handles the cancel action, returning to the role list.
   */
  const handleCancel = () => {
    // Navigate back to Role List.
    navigate('/roles'); // Assuming '/roles' is the list page
  };

  const formTitle = role && role.roleId ? 'Edit Role' : 'New Role';

  return (
    <div className="role-detail-container">
      <h2>{formTitle}</h2>
      <form onSubmit={handleSave}>
        {errors.form && <p className="error-message">{errors.form}</p>}

        <div className="form-group">
          <label htmlFor="roleName">Name:</label>
          <input
            type="text"
            id="roleName"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            aria-describedby="name-error"
          />
          {errors.name && <p id="name-error" className="error-message">{errors.name}</p>}
        </div>

        <div className="form-group">
          <label htmlFor="roleDescription">Description:</label>
          <textarea
            id="roleDescription"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <div className="form-actions">
          <button type="submit" className="primary-button">Save</button>
          <button type="button" onClick={handleCancel} className="secondary-button">Cancel</button>
        </div>
      </form>
    </div>
  );
};

export default RoleDetail;