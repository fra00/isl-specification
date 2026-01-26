import React, { useState } from 'react';
import SideBar from './sidebar';
import UserPage from './user-page';
import RolePage from './role-page';

/**
 * Component: Home
 * Role: Presentation
 * Content: Label "Welcome to User Role Management"
 */
const Home = () => {
  return (
    <div style={{ padding: '20px', fontSize: '24px', color: '#333' }}>
      Welcome to User Role Management
    </div>
  );
};

/**
 * Component: MainPage
 * Role: Presentation
 *
 * Capabilities:
 * - renderMainPage: Renders the main page with SideBar and dynamic content.
 * - switchView: Updates the displayed content based on the selected menu item.
 */
const MainPage = () => {
  // State to manage which content component is currently displayed
  const [activeMenuItem, setActiveMenuItem] = useState('home'); // Default to 'home'

  /**
   * Capability: switchView
   * Contract: Updates the displayed content based on the menu identifier received from the SideBar.
   * @param {string} menuItemId - The identifier of the selected menu item (e.g., 'home', 'user', 'roles').
   */
  const handleMenuSelection = (menuItemId) => {
    setActiveMenuItem(menuItemId);
  };

  // Determine which component to render based on activeMenuItem
  const renderContent = () => {
    switch (activeMenuItem) {
      case 'home':
        return <Home />;
      case 'user':
        return <UserPage />;
      case 'roles':
        return <RolePage />;
      default:
        return <Home />; // Fallback to Home
    }
  };

  /**
   * Capability: renderMainPage
   * Contract: Render the main page for user role management.
   * Trigger: On Page Load (Blank page)
   *
   * Appearance:
   * - SideBar on the left.
   * - Main Screen for content.
   */
  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      {/* SideBar Component */}
      <SideBar handleMenuSelection={handleMenuSelection} />

      {/* Main Content Area */}
      <main style={{ flexGrow: 1, marginLeft: '240px', padding: '20px', backgroundColor: '#f0f2f5' }}>
        {renderContent()}
      </main>
    </div>
  );
};

export default MainPage;