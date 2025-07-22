import React, { useEffect, useState } from "react";
import { AiOutlineLeft, AiOutlineRight } from "react-icons/ai";
import one from "../../assets/Home3-Assets/one.jpg";
import two from "../../assets/Home3-Assets/two.jpg";
import thre from "../../assets/Home3-Assets/thre.jpg";
import four from "../../assets/Home3-Assets/four.jpg";
import five from "../../assets/Home3-Assets/fiv.jpg";
import si from "../../assets/Home3-Assets/si.jpg";

function Home3() {
  const images = [
    { src: one, text: "Uncover Divine Wisdom in Every Verse" },
    { src: two, text: "Discover the Science Within the Qur’an" },
    { src: thre, text: "Explore the Hidden Signs of Creation" },
    { src: four, text: "Journey Through Revelation & Reality" },
    { src: five, text: "Illuminate Your Mind with Truth" },
    { src: si, text: "Beyond Ayaat: A Path to Understanding" },
  ];

  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % images.length);
    }, 2000);
    return () => clearInterval(interval);
  }, [images.length]);

  const goNext = () => setCurrent((prev) => (prev + 1) % images.length);
  const goPrev = () =>
    setCurrent((prev) => (prev - 1 + images.length) % images.length);

  return (
    <div className="w-full h-[100vh] overflow-hidden relative">
      <div
        className="flex w-full h-full transition-transform duration-700 ease-in-out"
        style={{ transform: `translateX(-${current * 100}%)` }}
      >
        {images.map((item, index) => (
          <div key={index} className="relative w-full h-full flex-shrink-0">
            <img
              src={item.src}
              alt={`slide-${index}`}
              className="w-full h-full object-cover"
            />
            <div className="absolute top-0 left-0 w-full h-full bg-black/50" />
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center z-10 px-4">
              <h1 className="text-white font-extrabold text-2xl sm:text-4xl md:text-5xl lg:text-6xl drop-shadow-lg">
                {item.text}
              </h1>
            </div>
          </div>
        ))}
      </div>

      <div className="absolute top-1/2 left-0 right-0 flex justify-between items-center px-5 z-20">
        <button
          onClick={goPrev}
          className="bg-black/60 text-white p-3 rounded-full hover:bg-black/80 transition"
        >
          <AiOutlineLeft size={24} />
        </button>
        <button
          onClick={goNext}
          className="bg-black/60 text-white p-3 rounded-full hover:bg-black/80 transition"
        >
          <AiOutlineRight size={24} />
        </button>
      </div>
    </div>
  );
}

export { Home3 };
