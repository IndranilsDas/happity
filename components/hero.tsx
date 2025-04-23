"use client";

import { useState, useRef, useEffect } from "react";
import { Search, ChevronDown } from "lucide-react";
import { motion, useAnimation, useInView } from "framer-motion";
import { FaPaw } from "react-icons/fa";
import { HiMiniPuzzlePiece } from "react-icons/hi2";
import { Fuzzy_Bubbles } from "next/font/google";
import { Over_the_Rainbow } from "next/font/google";
import { Indie_Flower } from "next/font/google";
import { Sunshiney } from "next/font/google";
import { Rock_Salt } from "next/font/google";
import { Grechen_Fuemen } from "next/font/google";
import { Knewave } from "next/font/google";
import { Gloria_Hallelujah } from "next/font/google";
import { FaUmbrellaBeach } from "react-icons/fa6";
import { RiBearSmileFill } from "react-icons/ri";
import { GiMusicalNotes } from "react-icons/gi";
import { BiSolidBabyCarriage } from "react-icons/bi";
import { RiStarSmileFill } from "react-icons/ri";
import { FaRegFaceSmileBeam } from "react-icons/fa6";
import { DynaPuff } from "next/font/google";

const gloriahallelujah = Gloria_Hallelujah({ subsets: ["latin"], weight: "400" });
const knewave = Knewave({ subsets: ["latin"], weight: "400" });
const grechenFuemen = Grechen_Fuemen({ subsets: ["latin"], weight: "400" });
const rockSalt = Rock_Salt({ subsets: ["latin"], weight: "400" });
const fuzzyBubbles = Fuzzy_Bubbles({ subsets: ["latin"], weight: "700" });
const overTheRainbow = Over_the_Rainbow({ subsets: ["latin"], weight: "400" });
const indieFlower = Indie_Flower({ subsets: ["latin"], weight: "400" });
const sunshiney = Sunshiney({ subsets: ["latin"], weight: "400" });
const dynapuff = DynaPuff({
  subsets: ["latin"],
  weight: "400",
})

interface HeroProps {
  onSearch: (location: string, age: string, day: string) => void;
  onDirectSearch: (query: string) => void;
}

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

const popIn = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.7, ease: "easeOut" } },
};

// common bounce settings for subtle up/down motion
const bounceTransition = {
  y: { duration: 3, repeat: Infinity, repeatType: "mirror", ease: "easeInOut" },
  x: { duration: 6, repeat: Infinity, repeatType: "mirror", ease: "easeInOut" },
};

const floatVariant = {
  animate: {
    y: [0, -20, 0],
    x: [0, 10, -10, 0],
    transition: bounceTransition,
  },
};

const pawVariant = {
  animate: {
    y: [0, -15, 0],
    rotate: [0, 360],
    transition: {
      y: { duration: 3, repeat: Infinity, repeatType: "mirror", ease: "easeInOut" },
      rotate: { duration: 20, repeat: Infinity, ease: "linear" },
    },
  },
};

const rotateVariant = {
  animate: {
    y: [0, -10, 0],
    x: [0, 5, -5, 0],
    rotate: [0, 360],
    transition: {
      ...bounceTransition,
      rotate: { duration: 20, repeat: Infinity, ease: "linear" },
    },
  },
};

const rotateantiVariant = {
  animate: {
    y: [0, -10, 0],
    x: [0, 5, -5, 0],
    rotate: [0, -360],
    transition: {
      ...bounceTransition,
      rotate: { duration: 20, repeat: Infinity, ease: "linear" },
    },
  },
};

export default function Hero({ onSearch, onDirectSearch }: HeroProps) {
  const [location, setLocation] = useState("");
  const [age, setAge] = useState("");
  const [day, setDay] = useState("");
  const [directQuery, setDirectQuery] = useState("");

  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const controls = useAnimation();

  useEffect(() => {
    if (isInView) controls.start("visible");
  }, [isInView, controls]);

  const handleSearch = () => onSearch(location, age, day);
  const handleDirectSearch = () => onDirectSearch(directQuery);

  return (
    <section ref={ref} className="relative py-16 md:py-24 h-screen overflow-hidden">
      {/* Floating Shapes */}
      <motion.div
        className="absolute top-10 left-5 w-24 h-24 bg-red-300 opacity-100 rounded-full flex justify-center items-center"
        variants={pawVariant}
        animate="animate"
      >
        <FaPaw size={48} color="#840C0D" />
      </motion.div>

      <motion.div
        className="absolute top-1/2 left-1/2 w-52 h-52 bg-violet-300 opacity-100 rounded-full flex justify-center items-center transform -translate-x-1/2 -translate-y-1/2"
        variants={pawVariant}
        animate="animate"
      >
        <FaPaw size={90} color="#4E0A6D" />
      </motion.div>

      <motion.div
        className="absolute top-1/3 right-10 w-28 h-28 bg-blue-300 opacity-70 rounded-lg flex justify-center items-center"
        variants={rotateVariant}
        animate="animate"
      >
        <HiMiniPuzzlePiece size={65} color="#2652F6" />
      </motion.div>

      <motion.div
        className="absolute bottom-10 left-20 w-40 h-40 bg-yellow-600 opacity-100 rounded-full flex items-center justify-center"
        variants={rotateantiVariant}
        animate="animate"
      >
        <FaUmbrellaBeach size={60} color="#E4EB25" />
      </motion.div>

      <motion.div
        className="absolute bottom-10 right-1/3 w-16 h-16 bg-green-300 opacity-100 rounded-full"
        variants={floatVariant}
        animate="animate"
      />

      {/* Bear Shape */}
      <motion.div
        className="absolute bottom-20 right-20 w-32 h-32 bg-orange-300 opacity-100 rounded-[10px] flex justify-center items-center"
        variants={rotateantiVariant}
        animate="animate"
      >
        <RiBearSmileFill size={64} color="#FFA500" />
      </motion.div>

      {/* Additional Floating Shapes */}
      <motion.div
        className="absolute top-5 right-1/4 w-20 h-20 bg-pink-300 opacity-90 rounded-full flex justify-center items-center"
        variants={floatVariant}
        animate="animate"
      >
        <GiMusicalNotes size={40} color="#FF69B4" />
      </motion.div>

      <motion.div
        className="absolute top-40 left-3/4 w-24 h-24 bg-gray-300 opacity-80 rounded-full flex justify-center items-center"
        variants={rotateVariant}
        animate="animate"
      >
        <BiSolidBabyCarriage size={50} color="#4B5563" />
      </motion.div>

      <motion.div
        className="absolute bottom-32 left-10 w-16 h-16 bg-indigo-300 opacity-90 rounded-full flex justify-center items-center"
        variants={rotateantiVariant}
        animate="animate"
      >
        <RiStarSmileFill size={36} color="#3B82F6" />
      </motion.div>

      <motion.div
        className="absolute bottom-1/4 right-1/2 w-20 h-20 bg-teal-300 opacity-90 rounded-full flex justify-center items-center"
        variants={floatVariant}
        animate="animate"
      >
        <FaRegFaceSmileBeam size={40} color="#14B8A6" />
      </motion.div>

      {/* Background overlay */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-50 backdrop-blur-sm bg-rose-100 bg-[url('https://images.unsplash.com/photo-1533483595632-c5f0e57a1936?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80')]"
        
      />

      {/* Content */}
      <div className="relative z-10 max-w-6xl mx-auto px-4 text-center">
        <motion.h1
          className={`${dynapuff.className} text-shadow-md sm:text-2xl md:text-4xl text-black mb-12 [text-shadow:0.5px_0_0_#fff,-0.5px_0_0_#fff,0_0.5px_0_#fff,0_-0.5px_0_#fff]`}
          variants={popIn}
          initial="hidden"
          animate={controls}
        >
          FIND BABY AND TODDLER CLASSES NEAR YOU
        </motion.h1>

        <motion.div
          className="flex flex-col md:flex-row gap-2 max-w-4xl mx-auto mb-8"
          variants={fadeUp}
          initial="hidden"
          animate={controls}
        >
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Enter location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-full bg-white placeholder-gray-500 focus:outline-none focus:ring-purple-500 focus:border-purple-500"
            />
          </div>
          <div className="relative flex-1">
            <select
              className="block w-full pl-3 pr-10 py-3 border border-gray-300 rounded-full bg-white focus:outline-none focus:ring-purple-500 focus:border-purple-500 appearance-none"
              value={age}
              onChange={(e) => setAge(e.target.value)}
            >
              <option value="">What age?</option>
              <option value="0-6">0-6 months</option>
              <option value="6-12">6-12 months</option>
              <option value="1-2">1-2 years</option>
              <option value="2-3">2-3 years</option>
              <option value="3-5">3-5 years</option>
            </select>
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <ChevronDown className="h-5 w-5 text-gray-400" />
            </div>
          </div>
          <div className="relative flex-1">
            <select
              className="block w-full pl-3 pr-10 py-3 border border-gray-300 rounded-full bg-white focus:outline-none focus:ring-purple-500 focus:border-purple-500 appearance-none"
              value={day}
              onChange={(e) => setDay(e.target.value)}
            >
              <option value="">Which day?</option>
              <option value="Monday">Monday</option>
              <option value="Tuesday">Tuesday</option>
              <option value="Wednesday">Wednesday</option>
              <option value="Thursday">Thursday</option>
              <option value="Friday">Friday</option>
              <option value="Saturday">Saturday</option>
              <option value="Sunday">Sunday</option>
            </select>
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <ChevronDown className="h-5 w-5 text-gray-400" />
            </div>
          </div>
          <button
            className="bg-yellow-400 hover:bg-yellow-500 text-black font-bold py-3 px-8 rounded-full"
            onClick={handleSearch}
          >
            GO!
          </button>
        </motion.div>

        <motion.div className="mt-8" variants={fadeUp} initial="hidden" animate={controls}>
          <p className="text-white mb-4">Already know which class you're looking for?</p>
          <div className="flex max-w-xl mx-auto">
            <input
              type="text"
              placeholder="Enter the class name here"
              value={directQuery}
              onChange={(e) => setDirectQuery(e.target.value)}
              className="flex-1 px-4 py-3 rounded-full border border-gray-300 focus:outline-none focus:ring-purple-500 focus:border-purple-500"
            />
            <button
              className="bg-yellow-400 hover:bg-yellow-500 text-black px-4 py-2 rounded-full"
              onClick={handleDirectSearch}
            >
              <Search className="h-5 w-5" />
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
