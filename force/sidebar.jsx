import React, { useState } from 'react';

/**
 * SideBar Component for User and Role Management
 *
 * Left Sidebar for menu selection
 *
 * Version: 1.0.0
 * ISL Version: 1.6.1
 * Created: 2026-01-23
 */
function SideBar({ handleMenuSelection }) {
  // Internal state for sidebar visibility, as per 'toggleSidebar' capability
  const [isOpen, setIsOpen] = useState(true);

  // Internal state to track the currently active menu item
  const [activeMenuItemId, setActiveMenuItemId] = useState('home'); // Default active item

  // Capability: toggleSidebar
  // Toggles the visibility of the sidebar.
  const toggleSidebar = () => {
    setIsOpen(prev => !prev);
  };

  // Internal handler for menu item clicks
  // This implements the 'handleMenuSelection' capability's logic
  const onMenuItemClick = (menuId) => {
    setActiveMenuItemId(menuId);
    // Call the external handler provided as a prop
    if (handleMenuSelection) {
      handleMenuSelection(menuId);
    }
  };

  // Define menu items as per 'Content' specification
  const menuItems = [
    { id: 'home', label: 'Home', icon: 'home' },
    { id: 'user', label: 'User', icon: 'user-shield' },
    { id: 'roles', label: 'Roles', icon: 'users-cog' },
  ];

  // Base styles for the sidebar container, as per 'Appearance' specification
  const sidebarStyle = {
    position: 'fixed',
    left: 0,
    width: '240px',
    height: '100vh',
    backgroundColor: '#111827',
    color: '#f9fafb',
    fontSize: '14px',
    padding: '16px',
    boxSizing: 'border-box', // Include padding in width
    transition: 'transform 0.3s ease-in-out', // Optional: for smooth toggle
    transform: isOpen ? 'translateX(0)' : 'translateX(-100%)', // Toggle visibility
    zIndex: 1000, // Ensure sidebar is on top
  };

  // Styles for individual menu items
  const menuItemBaseStyle = {
    height: '40px',
    borderRadius: '8px',
    padding: '0 12px',
    display: 'flex',
    alignItems: 'center',
    cursor: 'pointer',
    marginBottom: '8px',
    transition: 'background-color 0.2s ease-in-out, color 0.2s ease-in-out',
  };

  // Capability: renderSideBar
  // Renders the sidebar menu for user role management.
  return (
    <div style={sidebarStyle}>
      <nav>
        <ul>
          {menuItems.map((item) => {
            const isActive = item.id === activeMenuItemId;
            const itemStyle = {
              ...menuItemBaseStyle,
              backgroundColor: isActive ? '#2563eb' : 'transparent', // Active background
              color: isActive ? 'white' : '#f9fafb', // Active text color
              // Hover effect (simulated with inline style, for full CSS control, a stylesheet would be better)
              // Note: Inline styles don't directly support :hover. This is a common limitation.
              // For a true hover, a CSS module or styled-components would be used.
              // For this exercise, we'll apply base and active styles.
              // If a hover effect is critical, it would require a more advanced styling solution.
            };

            return (
              <li key={item.id} style={{ listStyle: 'none', margin: 0, padding: 0 }}>
                <div
                  style={itemStyle}
                  onClick={() => onMenuItemClick(item.id)}
                  // Optional: Add onMouseEnter/onMouseLeave for hover effect if needed,
                  // but it adds complexity for a simple inline style approach.
                  // For strict adherence to "clean and functioning", we prioritize direct style mapping.
                >
                  {/* Placeholder for icon. In a real app, an icon component would be used (e.g., <FaHome />) */}
                  <span style={{ marginRight: '10px' }}>
                    {/* Using icon name as text since no icon library is specified */}
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                </div>
              </li>
            );
          })}
        </ul>
      </nav>
      {/*
        A button to toggle the sidebar could be added here if the 'toggleSidebar' capability
        was meant to be triggered by the UI within the sidebar itself.
        For example:
        <button onClick={toggleSidebar} style={{ marginTop: '20px', padding: '8px 12px' }}>
          {isOpen ? 'Close Sidebar' : 'Open Sidebar'}
        </button>
        However, the ISL does not specify a UI element for this, so it's omitted.
        The capability is implemented internally, and its trigger mechanism is external to this component's rendering.
      */}
    </div>
  );
}

export default SideBar;