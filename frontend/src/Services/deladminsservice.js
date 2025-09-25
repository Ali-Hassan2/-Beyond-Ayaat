import axios from "axios";

 export const deladmins = async (adminId) => {
    const token = localStorage.getItem("admintoken");
   try{
    const res = await axios.delete(`http://localhost:3004/admin/amgm/deleteadmin/${adminId}`,{
        headers:{
            Authorization:`Bearer ${token}`,
        },
        });
        
console.log("Here is the ",response.message);
        return res.data;
    }
    catch(err){
        console.error("Error deleting admin:", err);
    }
}