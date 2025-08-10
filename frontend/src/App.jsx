import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Home } from "./Pages/Home";
import { Signin } from "./Pages/Signin";
import { Signup } from "./Pages/Signup";
import { AdminDashboard } from "./Pages/Admin/AdminDashboard"
import { AdminSignin } from "./Pages/Admin/AdminSignin";  
import { AdminSignup } from "./Pages/Admin/AdminSignup";
import "./App.css";




const router = createBrowserRouter([
  { path: "/admin/dashboard", element: <AdminDashboard/>},
  { path: "/admin/adminsignin", element: <AdminSignin/>},
  { path: "/admin/adminsignup", element: <AdminSignup/>},
  { path: "/", element: <Home /> },
  { path: "/signup", element: <Signup /> },
  { path: "/signin", element: <Signin /> },
]);

function App() {


  return (
    <div>
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
