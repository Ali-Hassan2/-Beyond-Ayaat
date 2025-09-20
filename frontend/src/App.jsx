import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import {Home} from './Pages/Home';
import {Signin} from './Pages/Signin';
import {Signup} from './Pages/Signup';
import './App.css';

const router = createBrowserRouter([
  { path: '/',
   element: <Home /> },

   { path: '/signup',
    element: < Signup /> },
   


  { path: '/signin', 
   element: <Signin /> },
   
]);

function App() {
  return (
    <div>
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
