import React from 'react'
import './AdminDash.css'
import { Link } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'


const Admin_Manage = () => {
    const navigate = useNavigate();

    const gotoSignup=()=>{
        navigate("/admin/adminsignup",{state: { fromDashboard: true }});
    };



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
                <button class="adminmanagebutton" onClick={gotoSignup} >
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