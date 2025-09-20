import React from "react"
import { Landing, Navbar, Home2, Home3 } from "../Components"
function Home() {
  return (
    <div>
      <Landing />
      <Home2 title={"How its Works"} />
      <Home3 />
    </div>
  )
}

export { Home }
