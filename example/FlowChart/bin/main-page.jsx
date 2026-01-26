import React from 'react';
import MainContent from "./main-content";

/**
 * Main page of the web application.
 * @returns {JSX.Element} The Main Page component.
 */
export default function MainPage() {
  return (
    <div className="w-full h-full flex flex-col">
      <MainContent />
    </div>
  );
}