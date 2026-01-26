import React, { useState, useCallback } from 'react';
import SideBar from './sidebar';
import UserPage from './user-page';
import RolePage from './role-page';

/**
 * Home dashboard component.
 * Displays a welcome message for the User Role Management application.
 * @returns {JSX.Element} The Home dashboard UI.
 */
export const Home = () => {
  return (
    <div className="p-4 text-2xl font-semibold text-gray-800">
      Welcome to User Role Management
    </div>
  );
};

/**
 * MainPage component.
 * Serves as the main layout for the User Role Management application,
 * integrating the SideBar and dynamically displaying content based on menu selection.
 * @returns {JSX.Element} The main application page UI.
 */
export default function MainPage() {
  const [activeMenuId, setActiveMenuId] = useState('home');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  /**
   * Handles menu item selection from the SideBar.
   * Updates the active menu ID, which in turn switches the main content view.
   * @param {string} menuId - The identifier of the selected menu item (e.g., "home", "user", "roles").
   */
  const handleMenuSelection = useCallback((menuId) => {
    setActiveMenuId(menuId);
  }, []);

  /**
   * Toggles the visibility state of the sidebar.
   * This function is passed to the SideBar component, allowing it to request a toggle.
   */
  const toggleSidebar = useCallback(() => {
    setIsSidebarOpen(prev => !prev);
  }, []);

  /**
   * Renders the appropriate main content component based on the activeMenuId state.
   * @returns {JSX.Element} The component corresponding to the active menu.
   */
  const renderMainContent = () => {
    switch (activeMenuId) {
      case 'user':
        return <UserPage />;
      case 'roles':
        return <RolePage />;
      case 'home':
      default:
        return <Home />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar Container */}
      <div
        className={`transition-all duration-300 ease-in-out ${
          isSidebarOpen ? 'w-60' : 'w-0 overflow-hidden'
        }`}
      >
        <SideBar
          handleMenuSelection={handleMenuSelection}
          activeMenuId={activeMenuId}
          toggleSidebar={toggleSidebar}
        />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 p-4 overflow-auto">
        {renderMainContent()}
      </div>
    </div>
  );
}