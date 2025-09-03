
import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="bg-gray-800 p-4 shadow-md z-10">
      <h1 className="text-xl font-bold text-center text-gray-100">
        Gemini Smart Router UI
      </h1>
      <p className="text-center text-sm text-gray-400 mt-1">A UI to demonstrate intelligent model routing for trivial and complex queries.</p>
    </header>
  );
};

export default Header;
