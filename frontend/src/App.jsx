import { createBrowserRouter, RouterProvider } from "react-router-dom";
// import {
//   Home,
//   Signup,
//   Signin,
//   AdminDashboard,
//   AdminSignin,
//   AdminSignup,
// } from "./Pages";
import {
  Home,
  Signin,
  Signup,
  AdminDashboard,
  AdminSignin,
  AdminSignup,
} from "./Pages";
import "./App.css";

const router = createBrowserRouter([
  { path: "/admin/dashboard", element: <AdminDashboard /> },
  { path: "/admin/adminsignin", element: <AdminSignin /> },
  { path: "/admin/adminsignup", element: <AdminSignup /> },
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
