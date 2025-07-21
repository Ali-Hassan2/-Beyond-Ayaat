import { useState } from 'react'
import {createBrowserRouter,RouterProvider} from 'react-router-dom'
import Home from './Pages/Home'
import './App.css'


const router = createBrowserRouter([
  {path:'/',element:<Home/>},
])

function App() {

  return (
    <div>
      <RouterProvider router={router}/>
    </div>
  )
}

export default App
