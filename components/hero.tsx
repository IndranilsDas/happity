"use client"

import { useState, useRef, useEffect } from "react"
import { Search, ChevronDown } from "lucide-react"
import { motion, useAnimation, useInView } from "framer-motion"

interface HeroProps {
  onSearch: (location: string, age: string, day: string) => void
  onDirectSearch: (query: string) => void
}

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" },
  },
}

const popIn = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.7, ease: "easeOut" },
  },
}

export default function Hero({ onSearch, onDirectSearch }: HeroProps) {
  const [location, setLocation] = useState("")
  const [age, setAge] = useState("")
  const [day, setDay] = useState("")
  const [directQuery, setDirectQuery] = useState("")

  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })
  const controls = useAnimation()

  useEffect(() => {
    if (isInView) {
      controls.start("visible")
    }
  }, [isInView, controls])

  const handleSearch = () => {
    onSearch(location, age, day)
  }

  const handleDirectSearch = () => {
    onDirectSearch(directQuery)
  }

  return (
    <section
      ref={ref}
      className="relative bg-purple-700 py-16 md:py-24 h-[85vh]"
    >
      <div
        className="absolute inset-0 bg-cover bg-center opacity-30"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1533483595632-c5f0e57a1936?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80')",
        }}
      ></div>
      <div className="relative z-10 max-w-6xl mx-auto px-4 text-center">
        <motion.h1
          className="text-3xl md:text-5xl font-bold text-white mb-12"
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
              className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-full leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-purple-500 focus:border-purple-500"
            />
          </div>
          <div className="relative flex-1">
            <select
              className="block w-full pl-3 pr-10 py-3 border border-gray-300 rounded-full leading-5 bg-white focus:outline-none focus:ring-purple-500 focus:border-purple-500 appearance-none"
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
              className="block w-full pl-3 pr-10 py-3 border border-gray-300 rounded-full leading-5 bg-white focus:outline-none focus:ring-purple-500 focus:border-purple-500 appearance-none"
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

        <motion.div
          className="mt-8"
          variants={fadeUp}
          initial="hidden"
          animate={controls}
        >
          <p className="text-white mb-4">
            Already know which class you&apos;re looking for?
          </p>
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
  )
}
