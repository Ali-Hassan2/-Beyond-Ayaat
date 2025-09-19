import React from 'react'
import Admin_Nav from './Admin_Nav' 
import './AdminDash.css'
import { useContext } from 'react'
import { UserContext } from '../../../Context/UserContext.jsx'
import { useEffect, useState } from 'react'
import { Link } from "react-router-dom";

function Admin_Dashboard() {

  const { adname } = useContext(UserContext);
  const [name2, setName2] = useState("");
  const admintoken = localStorage.getItem("admintoken");


  useEffect(() => {
    if (adname) {
      setName2(adname);
    } else {
     setName2("Admin,Login to continue");

    }
  });

  return (
    <div>
    <div class="admindash" >
      <Admin_Nav />
<div className="mt-8 px-6">
  <div class="dashcontain">
    <div className="bg-gradient-to-r from-purple-500 via-pink-500 to-red-500
                    text-white rounded-full w-40 h-40 flex flex-col 
                    items-center justify-center shadow-xl 
                    text-center px-4">
      <h1 className="text-lg font-bold">Hi,</h1>
      <p className="text-md font-semibold">{name2} </p>
    </div>
  
  </div>
</div>
    </div>
   


    </div>
  )
}

export { Admin_Dashboard }