import React from "react";
import { GiGalaxy } from "react-icons/gi";
import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav className="w-full h-auto md:h-[100px] flex flex-col md:flex-row justify-center items-center bg-transparent text-white overflow-hidden ">
      <div className="left w-full md:flex-1 flex justify-center md:justify-start items-center h-[80px] gap-4 md:pl-[100px]">
        <GiGalaxy
          size={30}
          className="md:size-[40px] relative md:left-[65px]"
        />
        <h1 className="text-xl md:text-2xl font-bold relative md:left-[65px]">
          Beyond Ayaat.
        </h1>
      </div>

      <div className="right w-full md:flex-1 flex flex-col md:flex-row gap-4 md:gap-[50px] h-auto md:h-full items-center justify-center text-sm md:text-lg md:pl-[430px] pb-4 md:pb-0 overflow-hidden">
        <h4>
          <Link to="">Home</Link>
        </h4>
        <h4>
          <Link to="/topics">Topics</Link>
        </h4>
        <h4>
          <Link to="/articles">Articles</Link>
        </h4>
        <div className="flex  gap-5">
          <button className="border border-white/30 px-3 py-1 md:p-2 rounded-lg bg-transparent">
            <Link to="/signin">Signin</Link>
          </button>
          <button className="border border-white/30 px-3 py-1 md:p-2 rounded-lg  bg-[#48AFB6] ">
            <Link to="/signup">Signup</Link>
          </button>
        </div>
      </div>
    </nav>
  );
}

export { Navbar };
