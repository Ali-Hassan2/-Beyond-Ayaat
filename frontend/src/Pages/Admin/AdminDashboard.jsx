import React from 'react'
import { Admin_Dashboard } from '../../Components/AdminComponents/AdminDash/Admin_Dashboard'

const AdminDashboard = () => {
  const checkadmin = localStorage.getItem("admintoken")
  if(!checkadmin){
    window.location.href = "/admin/adminsignin"
  }
  
  return (
    <div>
      
      <Admin_Dashboard/> 
      </div>
  )
}

export { AdminDashboard }