import React from 'react';
import MainContent from "./main-content";

/**
 * @typedef {object} MainPageProps
 * // No props defined for MainPage
 */

/**
 * Main page of the web application.
 * This component renders the MainContent which is the primary area for flow chart interaction.
 *
 * @param {MainPageProps} props - The props for the MainPage component.
 * @returns {JSX.Element} The rendered Main Page component.
 */
export default function MainPage() {
  return (
    <div className="flex flex-col h-screen w-screen bg-gray-100">
      {/* The MainContent component handles the core logic and UI for the flow chart. */}
      <MainContent />
    </div>
  );
}