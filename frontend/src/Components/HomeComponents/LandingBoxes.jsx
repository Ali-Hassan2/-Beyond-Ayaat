import React from "react";
import "./LandingBoxes.css";

function LandingBoxes({ box }) {
  return (
    <div className="flip-box w-full sm:w-[45%] md:w-[18%] h-[260px] m-2">
      <div className="flip-box-inner shadow-2xl rounded-2xl">
        <div className="flip-box-front bg-white/10 backdrop-blur-md rounded-2xl flex flex-col items-center justify-center p-4 text-white">
          {box.image}
          <h1 className="text-lg font-semibold mt-4 text-center">
            {box.label}
          </h1>
        </div>

        <div className="flip-box-back  rounded-2xl flex flex-col items-center justify-center p-4 text-black text-center">
          <h1 className="text-xl font-bold mb-2 " style={{ color: "#48AFB6" }}>
            {box.label}
          </h1>
          <p className="text-sm " style={{ color: "#FFFFFF" }}>
            {box.desc}
          </p>
          <button className="mt-5 rounded-full text-sm w-[100px] h-[40px] text-white border border-white hover:bg-[#48AFB6] cursor-pointer hover:border-none transition duration-300 ease-in-out">
            Go There
          </button>
        </div>
      </div>
    </div>
  );
}

export default LandingBoxes;
