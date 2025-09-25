import React, { useEffect } from 'react'
import './AdminDash.css'
import { Link } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import { getadmins } from '../../../Services/adminservice'
import { useState } from 'react'


const Admin_Manage = () => {
    const navigate = useNavigate();

    const gotoSignup=()=>{
        navigate("/admin/adminsignup",{state: { fromDashboard: true }});
    };

    const [admins,setadmins]=useState([]);

    useEffect(()=>{
        const fetchAdmins=async()=>{
            const data=await getadmins();
            setadmins(data);
        
    };
     fetchAdmins();
    },[]);



  return (
    <div className="adminmanage">
        <div >
        <h2 className="heading">Admin Management</h2>
        </div>

        <div className="adminmanagecontainer">
            <div className="adminmanagebox">
                <div>
      <h2 className="font-bold mb-4">Admin List</h2>
      <table style={{ borderCollapse: "collapse", width: "100%" }}>
        <thead>
          <tr>
            <th style={{ border: "2px solid black", padding: "8px" }}>Admin No</th>
            <th style={{ border: "2px solid black", padding: "8px" }}>Full Name</th>
            <th style={{ border: "2px solid black", padding: "8px" }}>Email</th>
          </tr>
        </thead>
        <tbody>
          {admins.map((admin, index) => (
            <tr key={admin._id}>
              <td style={{ border: "2px solid black", padding: "8px" }}>{index + 1}</td>
              <td style={{ border: "2px solid black", padding: "8px" }}>
                {admin.first_name} {admin.last_name}
              </td>
              <td style={{ border: "2px solid black", padding: "8px" }}>{admin.email}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
            </div>
            <div>
                <button className="adminmanagebutton" onClick={gotoSignup} >
                    Add Admin
                </button>
                 <button className="adminmanagebutton">
                    <Link>Remove Admin</Link>
                </button>
            </div>

        </div>



    </div>
  )
}

export { Admin_Manage }