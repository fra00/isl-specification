import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Assuming react-router-dom for navigation

// Import domain concepts
// Relative path calculation:
// Current file: ./user-detail.jsx
// Dependency:    ./domain.jsx
// Both are in the same root, so relative path is "./domain"
import { User } from './domain'; 

// Import store capabilities
// Relative path calculation:
// Current file: ./user-detail.jsx
// Dependency:    ./store.jsx
// Both are in the same root, so relative path is "./store"
import { useUserStore } from './store';

/**
 * UserDetail Component
 * Form component for creating and editing users.
 * Role: Presentation
 */
function UserDetail({ user: initialUser }) {
  const navigate = useNavigate();
  const { addUser, saveUser } = useUserStore();

  // State for form fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('viewer'); // Default role as per domain enum
  const [status, setStatus] = useState('active'); // Default status as per domain enum
  const [errors, setErrors] = useState({});

  // Populate form fields when initialUser prop changes (for editing)
  useEffect(() => {
    if (initialUser) {
      setName(initialUser.name || '');
      setEmail(initialUser.email || '');
      setRole(initialUser.role || 'viewer');
      setStatus(initialUser.status || 'active');
    } else {
      // Reset form for new user creation
      setName('');
      setEmail('');
      setRole('viewer');
      setStatus('active');
    }
    setErrors({}); // Clear errors on user change
  }, [initialUser]);

  /**
   * handleSave Capability
   * Validates and submits the form data to the store.
   * @param {React.FormEvent} event - The form submission event.
   */
  const handleSave = async (event) => {
    event.preventDefault();

    // 1. Validate form fields.
    const newErrors = {};
    if (!name.trim()) {
      newErrors.name = 'Name is required.';
    }
    if (!email.trim()) {
      newErrors.email = 'Email is required.';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Email is invalid.';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({}); // Clear previous errors

    // Construct the user object from current form state
    const userToSave = {
      name,
      email,
      role,
      status,
      // Preserve existing userId if editing, otherwise it will be undefined for new user
      ...(initialUser && initialUser.userId && { userId: initialUser.userId }),
      // createdAt and updatedAt are typically handled by the backend or store logic
      // and are not directly editable in this form.
    };

    let success = false;
    let error = null;

    // 2. IF valid:
    if (initialUser && initialUser.userId) {
      // IF user has ID: Call UserStore.saveUser.
      const result = await saveUser(initialUser.userId, userToSave);
      success = result.success;
      error = result.error;
    } else {
      // ELSE: Call UserStore.addUser.
      const result = await addUser(userToSave);
      success = result.success;
      error = result.error;
    }

    if (success) {
      // 3. Navigate back to User List.
      navigate('/users'); // Assuming '/users' is the path to the user list
    } else {
      console.error('Failed to save user:', error);
      // Optionally, display an error message to the user
      setErrors({ form: error || 'An unexpected error occurred.' });
    }
  };

  /**
   * handleCancel Capability
   * Cancels the operation and returns to the user list.
   */
  const handleCancel = () => {
    navigate('/users'); // Assuming '/users' is the path to the user list
  };

  /**
   * renderUserForm Capability (implicitly handled by JSX return)
   * Renders the form populated with user data (if editing) or empty (if creating).
   */
  return (
    <div className="user-detail-container">
      <h2>{initialUser && initialUser.userId ? 'Edit User' : 'New User'}</h2>

      {errors.form && <p style={{ color: 'red' }}>{errors.form}</p>}

      <form onSubmit={handleSave}>
        <div>
          <label htmlFor="name">Name:</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          {errors.name && <p style={{ color: 'red' }}>{errors.name}</p>}
        </div>

        <div>
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          {errors.email && <p style={{ color: 'red' }}>{errors.email}</p>}
        </div>

        <div>
          <label htmlFor="role">Role:</label>
          <select id="role" value={role} onChange={(e) => setRole(e.target.value)}>
            <option value="admin">Admin</option>
            <option value="editor">Editor</option>
            <option value="viewer">Viewer</option>
          </select>
        </div>

        <div>
          <label htmlFor="status">Status:</label>
          <select id="status" value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="pending">Pending</option>
          </select>
        </div>

        <div className="form-actions">
          <button type="submit" className="primary-button">Save</button>
          <button type="button" onClick={handleCancel} className="secondary-button">Cancel</button>
        </div>
      </form>
    </div>
  );
}

export default UserDetail;