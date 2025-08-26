import React, { useState } from "react";
import { Link } from "react-router-dom";

export default function Admin_Nav() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="w-full shadow-md">
      
      <div className="bg-[#11114e] text-white text-center py-10 font-bold text-4xl">
        ADMIN DASHBOARD
      </div>

      <nav className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white px-8 py-5 flex items-center justify-between">
      <div className="text-3xl font-extrabold tracking-wide">Beyond Ayaat</div>

      
        <ul className="hidden md:flex space-x-8 text-lg font-medium">
          <li className="hover:text-yellow-300 transition" >
            <Link to="/" >Home</Link>
          </li>
          <li className="hover:text-yellow-300 transition">Topic Manage</li>
          <li className="hover:text-yellow-300 transition">Blogs Manage</li>
        </ul>

      
        <div
          className="md:hidden cursor-pointer"
          onClick={() => setIsOpen(!isOpen)}
        >
          <div className="w-6 h-1 bg-white mb-1 rounded"></div>
          <div className="w-6 h-1 bg-white mb-1 rounded"></div>
          <div className="w-6 h-1 bg-white rounded"></div>
        </div>
      </nav>

     
      {isOpen && (
        <div className="md:hidden bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white px-6 py-3 space-y-3 text-center font-medium animate-slide-down">
          <div className="hover:text-yellow-300 transition">Home</div>
          <div className="hover:text-yellow-300 transition">Topic Mgmt</div>
          <div className="hover:text-yellow-300 transition">Blogs Mgmt</div>
        </div>
      )}
    </div>
  );
}
