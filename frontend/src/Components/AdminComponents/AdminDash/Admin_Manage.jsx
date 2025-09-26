import React, { useEffect, useState } from "react";
import "./AdminDash.css";
import { useNavigate } from "react-router-dom";
import { getadmins } from "../../../Services/adminservice";
import { delAdmins } from "../../../Services/deladminsservice";
import { showToast } from "../../../Utils";
import { ToastContainer } from "react-toastify";

const Admin_Manage = () => {
  const navigate = useNavigate();
  const [admins, setAdmins] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [adminName, setAdminName] = useState("");
  const [selectedAdmin, setSelectedAdmin] = useState(null);
  const [success, setsucces] = useState("");

  const gotoSignup = () => {
    navigate("/admin/adminsignup", { state: { fromDashboard: true } });
  };

  useEffect(() => {
    const fetchAdmins = async () => {
      const data = await getadmins();
      setAdmins(data);
    };
    fetchAdmins();
  }, []);

  const handleDeleteClick = (admin) => {
    setSelectedAdmin(admin);
    setShowModal(true);
  };

  const confirmDelete = async () => {
    if (!selectedAdmin) return;

    try {
      await delAdmins(selectedAdmin._id);

      showToast("admin deleted successfully", "success");

      setShowModal(false);
      setAdminName("");

      setAdmins(admins.filter((a) => a._id !== selectedAdmin._id));
    } catch (err) {
      alert("Error deleting admin");
    }
  };

  return (
    <div className="adminmanage">
      <h2 className="heading">Admin Management</h2>

      <div className="adminmanagecontainer">
        <div className="adminmanagebox">
          <h2 className="font-bold mb-4">Admin List</h2>
          <table style={{ borderCollapse: "collapse", width: "100%" }}>
            <thead>
              <tr>
                <th style={{ border: "2px solid black", padding: "8px" }}>
                  Admin No
                </th>
                <th style={{ border: "2px solid black", padding: "8px" }}>
                  Full Name
                </th>
                <th style={{ border: "2px solid black", padding: "8px" }}>
                  Email
                </th>
                <th style={{ border: "2px solid black", padding: "8px" }}>
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {admins.map((admin, index) => (
                <tr key={admin._id}>
                  <td style={{ border: "2px solid black", padding: "8px" }}>
                    {index + 1}
                  </td>
                  <td style={{ border: "2px solid black", padding: "8px" }}>
                    {admin.first_name} {admin.last_name}
                  </td>
                  <td style={{ border: "2px solid black", padding: "8px" }}>
                    {admin.email}
                  </td>
                  <td style={{ border: "2px solid black", padding: "8px" }}>
                    <button
                      onClick={() => handleDeleteClick(admin)}
                      className="bg-red-500 text-white px-3 py-1 rounded"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div>
          <button className="adminmanagebutton" onClick={gotoSignup}>
            Add Admin
          </button>
        </div>
      </div>

      {showModal && selectedAdmin && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white p-6 rounded shadow-lg w-96">
            <h3 className="text-lg font-semibold mb-3">Confirm Delete</h3>
            <p>
              Type <b>{selectedAdmin.first_name}</b> to confirm deletion:
            </p>
            <input
              type="text"
              value={adminName}
              onChange={(e) => setAdminName(e.target.value)}
              placeholder="Admin name"
              className="border p-2 w-full mt-2"
            />
            <div className="flex justify-end gap-3 mt-4">
              <button
                className="px-4 py-2 bg-gray-300 rounded"
                onClick={() => setShowModal(false)}
              >
                Cancel
              </button>
              <button
                disabled={adminName !== selectedAdmin.first_name}
                className={`px-4 py-2 rounded ${
                  adminName === selectedAdmin.first_name
                    ? "bg-red-500 text-white"
                    : "bg-gray-400 text-gray-200 cursor-not-allowed"
                }`}
                onClick={confirmDelete}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
      {success && <p className="success">{success}</p>}
      <ToastContainer />
    </div>
  );
};

export { Admin_Manage };
