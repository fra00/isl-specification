import React, { useState, useEffect, useCallback } from 'react';
import { useUserStore } from './store.jsx';
import UserDetail from './user-detail.jsx';
import { User } from './domain.jsx'; // Assuming User type is exported from domain.jsx

/**
 * @typedef {import('./domain.jsx').User} User
 * @typedef {import('./domain.jsx').Role} Role
 */

/**
 * Main Page for User Management
 * @returns {JSX.Element} The UserPage component
 */
export default function UserPage() {
  const {
    users,
    userError,
    loadUsers,
    removeUser,
  } = useUserStore();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  /** @type {[User | null, React.Dispatch<React.SetStateAction<User | null>>]} */
  const [editingUser, setEditingUser] = useState(null);
  const [showUserDetail, setShowUserDetail] = useState(false);

  /**
   * Loads the list of users from the store.
   * @returns {Promise<void>}
   */
  const renderUserList = useCallback(async () => {
    setLoading(true);
    setError(null);
    const { users: fetchedUsers, error: fetchError } = await loadUsers();
    if (fetchError) {
      setError(fetchError);
    }
    setLoading(false);
  }, [loadUsers]);

  // Initial load of users
  useEffect(() => {
    renderUserList();
  }, [renderUserList]);

  /**
   * Triggers the display of the UserDetail form for creating a new user.
   */
  const handleAddUser = useCallback(() => {
    setEditingUser(null); // No user to edit, so it's a new user
    setShowUserDetail(true);
  }, []);

  /**
   * Triggers the display of the UserDetail form for editing an existing user.
   * @param {string} userId - The ID of the user to edit.
   */
  const handleEditUser = useCallback((userId) => {
    const userToEdit = users.find(user => user.userId === userId);
    if (userToEdit) {
      setEditingUser(userToEdit);
      setShowUserDetail(true);
    } else {
      setError("User not found for editing.");
    }
  }, [users]);

  /**
   * Handles the deletion of a user.
   * @param {string} userId - The ID of the user to delete.
   */
  const handleDeleteUser = useCallback(async (userId) => {
    // 1. Confirm deletion with the user.
    if (window.confirm("Are you sure you want to delete this user?")) {
      // 2. Call UserStore.removeUser(userId).
      const { success, error: removeError } = await removeUser(userId);
      if (success) {
        // 3. Refresh the list via renderUserList.
        await renderUserList();
      } else {
        setError(removeError || "Failed to delete user.");
      }
    }
  }, [removeUser, renderUserList]);

  /**
   * Callback for when UserDetail form is successfully saved.
   */
  const handleSaveSuccess = useCallback(async () => {
    setShowUserDetail(false);
    setEditingUser(null);
    await renderUserList(); // Refresh the list
  }, [renderUserList]);

  /**
   * Callback for when UserDetail form is cancelled.
   */
  const handleCancelUserDetail = useCallback(() => {
    setShowUserDetail(false);
    setEditingUser(null);
  }, []);

  if (loading) {
    return <div className="p-4 text-center text-gray-600">Loading users...</div>;
  }

  if (userError || error) {
    return <div className="p-4 text-center text-red-600">Error: {userError || error}</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">User Management</h1>

      {showUserDetail ? (
        <UserDetail
          user={editingUser}
          onSaveSuccess={handleSaveSuccess}
          onCancel={handleCancelUserDetail}
        />
      ) : (
        <>
          <div className="flex justify-end mb-4">
            <button
              onClick={handleAddUser}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md flex items-center shadow-md transition duration-300 ease-in-out"
            >
              <svg
                className="w-5 h-5 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                ></path>
              </svg>
              Add New User
            </button>
          </div>

          <div className="bg-white shadow-lg rounded-lg overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Role
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Created At
                  </th>
                  <th scope="col" className="relative px-6 py-3">
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {users.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                      No users found.
                    </td>
                  </tr>
                ) : (
                  users.map((user) => (
                    <tr key={user.userId}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {user.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {user.email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {user.role}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          user.status === 'active' ? 'bg-green-100 text-green-800' :
                          user.status === 'inactive' ? 'bg-red-100 text-red-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {user.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => handleEditUser(user.userId)}
                          className="text-indigo-600 hover:text-indigo-900 mr-3"
                          title="Edit User"
                        >
                          <svg
                            className="w-5 h-5 inline-block"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                            ></path>
                          </svg>
                        </button>
                        <button
                          onClick={() => handleDeleteUser(user.userId)}
                          className="text-red-600 hover:text-red-900"
                          title="Delete User"
                        >
                          <svg
                            className="w-5 h-5 inline-block"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            ></path>
                          </svg>
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}