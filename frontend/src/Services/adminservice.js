import axios from "axios";

export const getadmins = async () => {
    const token = localStorage.getItem("admintoken");
   try{
    const res = await axios.get("http://localhost:3004/admin/amgm/getadmins",{
        headers:{
            Authorization:`Bearer ${token}`,
        },

        });
        

        return res.data.data;
    }
    catch(err){
        console.error("Error fetching admins:", err);
    }
}





    

   
    


