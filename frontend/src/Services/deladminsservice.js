import axios from "axios";

export const delAdmins = async (adminId) => {
  const token = localStorage.getItem("admintoken");
  try {
    const res = await axios.delete(
      `http://localhost:3004/admin/amgm/deleteadmin/${adminId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    console.log("Here is the response:", res.data.message);
    return res.data;
  } catch (err) {
    console.error("Error deleting admin:", err);
    throw err;
  }
};
