import React from "react";
import {
  FaSearch,
  FaLightbulb,
  FaBookOpen,
  FaHandsHelping,
} from "react-icons/fa";
import { TbMicroscope, TbTargetArrow } from "react-icons/tb";
import { GiThink } from "react-icons/gi";
import { BsStars } from "react-icons/bs";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";

function Home2(props) {
  const { ref: headerRef, inView: headerInView } = useInView({
    triggerOnce: false,
    threshold: 0.2,
  });

  const variants = {
    hidden: { opacity: 0, y: -40 },
    visible: { opacity: 1, y: 0 },
  };

  const firstRow = [
    {
      image: <FaSearch size={50} />,
      label: "Explore Ayahs",
      description: "Read Quranic Ayahs with deep meanings and translations in depth.",
    },
    {
      image: <TbMicroscope size={50} />,
      label: "Match with Science",
      description: "See how they align with established modern Science.",
    },
    {
      image: <FaLightbulb size={50} />,
      label: "Build your Iman",
      description: "Gain knowledge, clarity and stronger and lasting faith.",
    },
  ];

  const secondRow = [
    {
      image: <FaBookOpen size={50} />,
      label: "Scientific Tafsir",
      description: "Understand Tafsir with scientific interpretations.",
    },
    {
      image: <TbTargetArrow size={50} />,
      label: "Purpose of Life",
      description: "Discover your divine purpose through Quranic wisdom.",
    },
    {
      image: <FaHandsHelping size={50} />,
      label: "Apply in Life",
      description: "Turn knowledge into action for a meaningful life.",
    },
  ];

  const CardVariants = {
    hidden: { opacity: 0, y: 60 },
    visible: { opacity: 1, y: 0 },
  };

  const Card = ({ box, index }) => {
    const { ref, inView } = useInView({ triggerOnce: false, threshold: 0.2 });
    return (
      <motion.div
        ref={ref}
        variants={CardVariants}
        initial="hidden"
        animate={inView ? "visible" : "hidden"}
        transition={{ duration: 0.6, delay: index * 0.2 }}
        className="w-[300px] h-[170px] flex"
      >
        <div className="w-[40%] flex items-start justify-center pt-2">
          {box.image}
        </div>
        <div className="w-[60%] flex flex-col items-start pt-2 pb-6 gap-2">
          <h1 className="text-[27px] w-[300px] font-semibold">{box.label}</h1>
          <p className="w-[250px] text-[22px]">{box.description}</p>
        </div>
      </motion.div>
    );
  };

  return (
    <div className="section-2 w-full min-h-[100vh] overflow-hidden">
      <div className="header w-full h-fit text-center pt-[40px]">
        <motion.h1
          ref={headerRef}
          variants={variants}
          initial="hidden"
          animate={headerInView ? "visible" : "hidden"}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="text-6xl"
        >
          {props.title}
        </motion.h1>
      </div>

      <div className="cards h-fit w-full flex items-center justify-center gap-[200px] pt-[70px] pr-[100px]">
        {firstRow.map((box, index) => (
          <div key={`row1-${index}`}>
            <Card box={box} index={index} />
          </div>
        ))}
      </div>

      <div className="cards h-fit w-full flex items-center justify-center gap-[200px] pt-[70px] pr-[100px]">
        {secondRow.map((box, index) => (
          <div key={`row2-${index}`}>
            <Card box={box} index={index + 3} />
          </div>
        ))}
      </div>

      <div className="w-full text-center mt-[160px] px-4 ">
        <p className="text-3xl md:text-3xl font-semibold text-gray-800 italic mb-4">
          {
            "أَوَلَمْ يَنظُرُوا فِي مَلَكُوتِ السَّمَاوَاتِ وَالْأَرْضِ وَمَا خَلَقَ اللَّهُ مِن شَيْءٍ"
          }
        </p>
        <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto mt-[px]">
          “Have they not reflected upon the dominion of the heavens and the
          earth, and all that Allah has created?”
          <span className="block mt-2 text-base text-gray-500">
            [Surah Al-A’raf – 7:185]
          </span>
        </p>
      </div>
    </div>
  );
}

export { Home2 };
