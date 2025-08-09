import React from "react";
import { Navbar, Home2, Home3, Landing } from "../Components/HomeComponents";
import { createContext, useContext, useEffect, useState } from "react";

export const NameContext = createContext();

function Home() {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));
  const [name, setName] = useState("");

  useEffect(() => {
    if (token) {
      setName(user?.first_name);
    }
  });

  return (
    <div>
      <NameContext.Provider value={name}>
        <Landing />
      </NameContext.Provider>

      <Home2 title={"How its Works"} />
      <Home3 />
    </div>
  );
}

export { Home };
