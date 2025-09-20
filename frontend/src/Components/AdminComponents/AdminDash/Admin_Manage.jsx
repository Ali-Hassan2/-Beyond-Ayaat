import React from "react"
import { Link } from "react-router-dom"
import "./AdminDash.css"



const Admin_Manage = () => {
  


  return (
    <div class="adminmanage">
      <div>
        <h2 class="heading">Admin Management</h2>
      </div>
      <div class="adminmanagecontainer">
        <div class="adminmanagebox">
          <h3>All Admins List:</h3>
        </div>


        
            <div>
                <button class="adminmanagebutton" >
                    Add Admin
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
