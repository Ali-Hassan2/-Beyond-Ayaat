import React from 'react'
import './AdminDash.css'
import { Link } from 'react-router-dom'

const Admin_Manage = () => {
  return (
    <div class="adminmanage">
        <div >
        <h2 class="heading" >Admin Management</h2>
        </div>

        <div class="adminmanagecontainer">
            <div class="adminmanagebox">
                <h3>All Admins List:</h3>
               
            </div>
            <div>
                <button class="adminmanagebutton">
                    <Link to="/admin/adminsignup">Add Admin</Link>
                </button>
                 <button class="adminmanagebutton">
                    <Link>Remove Admin</Link>
                </button>
            </div>

        </div>



    </div>
  )
}

export { Admin_Manage }