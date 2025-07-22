import React from "react";
import { Navbar } from "./Navbar";
import LandingBoxes from "./LandingBoxes";
import { IoMdTimer } from "react-icons/io";
import { FaEarthAfrica } from "react-icons/fa6";
import { TbGalaxy } from "react-icons/tb";
import { GiHumanPyramid } from "react-icons/gi";

const box_Data = [
  {
    image: <IoMdTimer size={60} className="" />,
    label: "Space & Time",
    desc: "Explore the mysteries of time, relativity, and the vast cosmos.",
  },
  {
    image: <FaEarthAfrica size={60} className="" />,
    label: "Earth & Science",
    desc: "Dive into geoscience, climate, and Earth’s natural wonders.",
  },
  {
    image: <TbGalaxy size={60} className="" />,
    label: "Dark Energy Portals",
    desc: "Unveil the hidden forces shaping our universe’s fate.",
  },
  {
    image: <GiHumanPyramid size={60} className="" />,
    label: "Human Biology",
    desc: "Understand the design and function of the human body.",
  },
];
function Landing({ props }) {
  return (
    <div
      className="w-full min-h-screen overflow-x-hidden "
      style={{
        backgroundImage: `
              radial-gradient(circle at center, rgba(255, 255, 255, 0.05), transparent 40%),
              linear-gradient(to right top, #010812, #060c18, #080f1d, #0a1222, #0d1527, #0d1527, #0d1628, #0d1628, #0a1222, #080f1d, #060c18, #010a14)
            `,
      }}
    >
      <Navbar />

      <div className="up-content h-[200px] flex items-center justify-center text-4xl sm:text-5xl md:text-6xl lg:text-8xl flex-col mt-[70px] gap-2 text-center px-4 overflow-hidden ">
        <h1 className="text-white tracking-[3px] font-semibold">
          Explore the Hidden Wisdom
        </h1>
        <h1 className="text-white tracking-[3px] font-semibold">
          of the Qur'an
        </h1>
      </div>

      <div className="small-line h-auto flex items-center justify-center text-base sm:text-xl md:text-2xl mt-[30px] text-white/70 font-light px-4 text-center overflow-hidden">
        Explore how Quranic Ayahs reflect truths revealed by modern science
      </div>

      <div className="buttons h-auto w-full flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-[50px] mt-[50px] px-4 overflow-hidden">
        <button
          className="w-full sm:w-[200px] h-[50px] text-[16px] sm:text-[20px] rounded-md text-white cursor-pointer"
          style={{ backgroundColor: "#48AFB6" }}
        >
          Start Exploring
        </button>
        <button className="w-full sm:w-[250px] h-[50px] text-[16px] sm:text-[20px] rounded-md border border-white/30 text-white cursor-pointer">
          Read About the Vision
        </button>
      </div>
      <div className="boxes flex flex-wrap mt-10 justify-center gap-[50px] overflow-hidden">
        {box_Data.map((box, index) => (
          <LandingBoxes box={box} key={index} />
        ))}
      </div>
    </div>
  );
}

export { Landing };
