import React, { useState, useEffect, useCallback } from 'react';
import { User } from './domain'; // Assuming User is exported from domain.jsx
import { useUserStore } from './store'; // Assuming useUserStore is exported from store.jsx
import { UserDetail } from './user-detail'; // Assuming UserDetail is exported from user-detail.jsx

/**
 * UserPage Component
 * Main Page for User Management
 * Role: Presentation
 */
export function UserPage() {
  const {
    users,
    loadUsers,
    addUser,
    saveUser,
    removeUser,
    error: storeError // Assuming the store provides an error state
  } = useUserStore();

  const [showUserDetailForm, setShowUserDetailForm] = useState(false);
  const [editingUser, setEditingUser] = useState(null); // User | null

  // Capability: renderUserList - Flow Step 1: Call UserStore.loadUsers to fetch data.
  // This effect runs once on component mount to load the initial list of users.
  useEffect(() => {
    loadUsers();
  }, [loadUsers]); // loadUsers is expected to be stable or memoized by useUserStore

  // Capability: handleAddUser
  const handleAddUser = useCallback(() => {
    setEditingUser(null); // Clear any user being edited
    setShowUserDetailForm(true); // Show the UserDetail form for a new user
  }, []);

  // Capability: handleEditUser
  const handleEditUser = useCallback((userId) => {
    const userToEdit = users.find(user => user.userId === userId);
    if (userToEdit) {
      setEditingUser(userToEdit); // Set the user to be edited
      setShowUserDetailForm(true); // Show the UserDetail form
    }
  }, [users]);

  // Capability: handleDeleteUser
  const handleDeleteUser = useCallback(async (userId) => {
    // Flow Step 1: Confirm deletion with the user.
    if (window.confirm('Are you sure you want to delete this user?')) {
      // Flow Step 2: Call UserStore.removeUser(userId).
      const { success, error } = await removeUser(userId);
      if (success) {
        console.log(`User ${userId} deleted successfully.`);
        // Flow Step 3: Refresh the list via renderUserList.
        loadUsers();
      } else {
        console.error(`Error deleting user ${userId}:`, error);
        alert(`Failed to delete user: ${error}`);
      }
    }
  }, [removeUser, loadUsers]);

  // Callback for UserDetail's handleSave
  const handleUserDetailSave = useCallback(async (userData) => {
    let result;
    if (editingUser) {
      // If editing an existing user
      result = await saveUser(editingUser.userId, userData);
    } else {
      // If adding a new user
      result = await addUser(userData);
    }

    if (result.success) {
      setShowUserDetailForm(false); // Hide the form
      setEditingUser(null); // Clear editing user
      loadUsers(); // Refresh the user list
    } else {
      alert(`Failed to save user: ${result.error}`);
    }
  }, [editingUser, addUser, saveUser, loadUsers]);

  // Callback for UserDetail's handleCancel
  const handleUserDetailCancel = useCallback(() => {
    setShowUserDetailForm(false); // Hide the form
    setEditingUser(null); // Clear editing user
  }, []);

  // Render the Grid with the user list (Flow Step 2 of renderUserList)
  return (
    <div style={{ padding: '20px' }}>
      <h1>User Management</h1>

      {showUserDetailForm ? (
        <UserDetail
          user={editingUser}
          handleSave={handleUserDetailSave}
          handleCancel={handleUserDetailCancel}
        />
      ) : (
        <>
          <button
            onClick={handleAddUser}
            style={{
              padding: '10px 15px',
              backgroundColor: '#28a745',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              marginBottom: '20px',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <span style={{ marginRight: '8px' }}>&#x271A;</span> Add New User
          </button>

          {storeError && <p style={{ color: 'red' }}>Error: {storeError}</p>}

          <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
            <thead>
              <tr style={{ backgroundColor: '#f2f2f2' }}>
                <th style={tableHeaderStyle}>Name</th>
                <th style={tableHeaderStyle}>Email</th>
                <th style={tableHeaderStyle}>Role</th>
                <th style={tableHeaderStyle}>Status</th>
                <th style={tableHeaderStyle}>Created At</th>
                <th style={tableHeaderStyle}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.length === 0 ? (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', padding: '10px' }}>No users found.</td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr key={user.userId} style={{ borderBottom: '1px solid #ddd' }}>
                    <td style={tableCellStyle}>{user.name}</td>
                    <td style={tableCellStyle}>{user.email}</td>
                    <td style={tableCellStyle}>{user.role}</td>
                    <td style={tableCellStyle}>{user.status}</td>
                    <td style={tableCellStyle}>{new Date(user.createdAt).toLocaleDateString()}</td>
                    <td style={tableCellStyle}>
                      <button
                        onClick={() => handleEditUser(user.userId)}
                        style={{
                          marginRight: '5px',
                          padding: '5px 10px',
                          backgroundColor: '#007bff',
                          color: 'white',
                          border: 'none',
                          borderRadius: '3px',
                          cursor: 'pointer',
                        }}
                      >
                        &#x270E; {/* Pencil icon */}
                      </button>
                      <button
                        onClick={() => handleDeleteUser(user.userId)}
                        style={{
                          padding: '5px 10px',
                          backgroundColor: '#dc3545',
                          color: 'white',
                          border: 'none',
                          borderRadius: '3px',
                          cursor: 'pointer',
                        }}
                      >
                        &#x1F5D1; {/* Trash can icon */}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
}

// Basic inline styles for the table
const tableHeaderStyle = {
  padding: '12px',
  textAlign: 'left',
  borderBottom: '1px solid #ddd',
};

const tableCellStyle = {
  padding: '10px',
  textAlign: 'left',
  borderBottom: '1px solid #ddd',
};