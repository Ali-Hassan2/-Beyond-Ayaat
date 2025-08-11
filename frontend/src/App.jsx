import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./App.css";
import { Home, Signup, Signin } from "./Pages";

const router = createBrowserRouter([
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
