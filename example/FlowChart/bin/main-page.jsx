import React from 'react';
import MainContent from "./main-content";

/**
 * MainPage component represents the main page of the web application.
 * It primarily renders the MainContent component.
 *
 * @returns {JSX.Element} The rendered main page.
 */
export default function MainPage() {
  return (
    <div className="flex flex-col h-screen w-screen bg-gray-100">
      {/* MainContent is the primary content area where the flow chart tools are managed. */}
      <MainContent />
    </div>
  );
}