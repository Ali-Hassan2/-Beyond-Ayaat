import React from "react";
import { Navbar, Home2, Home3, Landing } from "../Components/HomeComponents";
function Home() {
  return (
    <div>
      <Landing />
      <Home2 title={"How its Works"} />
      <Home3 />
    </div>
  );
}

export default Home;
