import { createBrowserRouter, RouterProvider } from "react-router-dom"
import {
  Home,
  Signin,
  Signup,
  AdminDashboard,
  AdminSignin,
  AdminSignup,
  AdminManage,
  BlogsAll,
} from "./Pages"
import "./App.css"

const router = createBrowserRouter([
  { path: "/", element: <Home /> },
  { path: "/signup", element: <Signup /> },
  { path: "/signin", element: <Signin /> },
  { path: "/blogs", element: <BlogsAll /> },
  { path: "/admin/dashboard", element: <AdminDashboard /> },
  { path: "/admin/adminsignin", element: <AdminSignin /> },
  { path: "/admin/adminsignup", element: <AdminSignup /> },
  { path: "/admin/addadmin", element: <AdminManage /> },
])

function App() {
  return (
    <div>
      <RouterProvider router={router} />
    </div>
  )
}

export default App
