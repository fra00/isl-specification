import React, { useCallback } from 'react';

/**
 * @typedef {object} SideBarProps
 * @property {function(string): void} handleMenuSelection - Function to call when a menu item is selected.
 * @property {string} [activeMenuId] - The ID of the currently active menu item. Used to apply active styling.
 * @property {function(): void} [toggleSidebar] - Function to toggle the visibility of the sidebar.
 *   This capability is exposed as a prop but not triggered by any UI element within this component,
 *   as no specific UI trigger was defined in the appearance or content sections.
 */

/**
 * SideBar Component for User Role Management.
 * Renders a fixed left sidebar with navigation links.
 *
 * @param {SideBarProps} props - The properties for the SideBar component.
 * @returns {JSX.Element} The rendered sidebar component.
 */
export default function SideBar({ handleMenuSelection, activeMenuId, toggleSidebar }) {
  const menuItems = [
    { id: 'home', label: 'Home', icon: 'fa-home' },
    { id: 'user', label: 'User', icon: 'fa-user-shield' },
    { id: 'roles', label: 'Roles', icon: 'fa-users-cog' },
  ];

  /**
   * Handles the click event for a menu item.
   * Calls the `handleMenuSelection` prop with the ID of the selected menu item.
   *
   * @param {string} menuId - The ID of the selected menu item.
   */
  const onMenuItemClick = useCallback((menuId) => {
    if (handleMenuSelection) {
      handleMenuSelection(menuId);
    }
  }, [handleMenuSelection]);

  return (
    <div className="fixed left-0 top-0 w-60 h-screen bg-gray-900 text-gray-50 text-sm p-4">
      <nav>
        <ul>
          {menuItems.map((item) => (
            <li key={item.id} className="mb-2">
              <button
                type="button"
                onClick={() => onMenuItemClick(item.id)}
                className={`
                  flex items-center w-full h-10 px-3 rounded-lg
                  hover:bg-gray-800
                  ${activeMenuId === item.id ? 'bg-blue-600 text-white' : ''}
                  transition-colors duration-200 ease-in-out
                `}
              >
                {/*
                  NOTE: Icons are assumed to be from a library like Font Awesome.
                  Ensure Font Awesome (or equivalent) is included in your project
                  for these classes (e.g., fa-solid fa-home) to render correctly.
                */}
                <i className={`fa-solid ${item.icon} mr-3 text-lg`}></i>
                <span>{item.label}</span>
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}