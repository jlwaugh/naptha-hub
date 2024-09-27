'use client';

import { useState } from 'react';

export default function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <nav className="bg-black shadow-lg">
      <div className="flex justify-between items-center h-16">
        <div className="text-[#FAFAFB] text-2xl font-bold pl-8">Naptha Hub</div>
        <div className="pr-8">
          {!isLoggedIn ? (
            <>
              <button className="text-[#FAFAFB] bg-[#1A1A28] hover:bg-[#2A2A38] px-3 py-2 rounded mr-3 text-md">
                Sign Up
              </button>
              <button 
                className="text-[#FAFAFB] bg-[#1A1A28] hover:bg-[#2A2A38] px-3 py-2 rounded text-md"
                onClick={() => setIsLoggedIn(true)}
              >
                Login
              </button>
            </>
          ) : (
            <button 
              className="text-[#FAFAFB] bg-[#1A1A28] hover:bg-[#2A2A38] px-3 py-2 rounded text-md"
              onClick={() => setIsLoggedIn(false)}
            >
              Logout
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}