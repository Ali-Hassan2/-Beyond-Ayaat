import React, { useState } from "react"
import { Link, useNavigate } from "react-router-dom"

function Admin_Nav() {
  const [isOpen, setIsOpen] = useState(false)
  const navigate = useNavigate()

  const handlelogout = () => {
    localStorage.clear()
    navigate("/admin/adminsignin")
  }

  const nav_map = [
    { className: "hover:text-yellow-300 transition", Text: "Home", path: "/" },
    {
      className: "hover:text-yellow-300 transition",
      Text: "Topic Manage",
      path: "/admin/topics",
    },
    {
      className: "hover:text-yellow-300 transition",
      Text: "Blogs Manage",
      path: "/admin/blogs",
    },
    {
      className: "hover:text-yellow-300 transition",
      Text: "Admin Manage",
      path: "/admin/addadmin",
    },
    {
      className: "hover:text-yellow-300 transition",
      Text: "Logout",
      path: "/logout",
    },
  ]
  return (
    <div className="w-full shadow-md">
      <div className="bg-[#11114e] text-white text-center py-10 font-bold text-4xl">
        ADMIN DASHBOARD
      </div>
      <nav className="bg-blue-900 text-white px-8 py-5 flex items-center justify-between">
        <div className="text-3xl font-extrabold tracking-wide">
          Beyond Ayaat
        </div>

        <ul className="hidden md:flex space-x-8 text-lg font-medium">
          {nav_map.map((nv, idx) => {
            return nv.Text === "Logout" ? (
              <li key={idx} onClick={handlelogout} className={nv.className}>
                {nv.Text}
              </li>
            ) : (
              <li key={idx} className={nv.className}>
                <Link to={nv.path}>{nv.Text}</Link>
              </li>
            )
          })}
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
  )
}

export { Admin_Nav }
