"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { getCategories } from "../lib/firebase-service"
import type { Category } from "@/lib/types"
import { Card, CardContent } from "@/components/ui/card"
import { Prompt } from "next/font/google"
import { motion, AnimatePresence, MotionConfig } from "framer-motion"
import { Gloria_Hallelujah } from "next/font/google"
import { DynaPuff } from "next/font/google"

const dynapuff = DynaPuff({
  subsets: ["latin"],
  weight: "400",
})


const gloriahallelujah = Gloria_Hallelujah({ subsets: ["latin"], weight: "400" });

const schoolbell = Prompt({
  weight: "400",
  subsets: ["latin"],
})

export default function PopularCategories() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true)
        const categoriesData = await getCategories()
        setCategories(categoriesData)
        setError(null)
      } catch (err) {
        console.error("Error fetching categories:", err)
        setError("Failed to load categories. Please try again later.")
      } finally {
        setLoading(false)
      }
    }

    fetchCategories()
  }, [])

  return (
    <MotionConfig reducedMotion="user">
      <section className={`${dynapuff.className} w-full py-12 px-4 md:px-6 bg-gradient-to-tr from-rose-300  via-cyan-100 to-slate-50  bg-cover bg-no-repeat`}>
        <motion.div
          className="container mx-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7 }}
        >
          <motion.h2
            className={`${dynapuff.className} text-4xl md:text-4xl font-bold py-8 text-center mb-12 text-purple-800`}
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.8,
              type: "spring",
              stiffness: 100,
            }}
          >
            MOST POPULAR CATEGORIES
          </motion.h2>

          <AnimatePresence mode="wait">
            {loading ? (
              <motion.div
                key="loading"
                className="w-full py-12 flex flex-col items-center justify-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <motion.div
                  className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full"
                  animate={{ rotate: 360 }}
                  transition={{
                    duration: 1.5,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "linear",
                  }}
                />
                <motion.p
                  className="mt-4 text-xl font-medium text-purple-500"
                  animate={{
                    opacity: [0.5, 1, 0.5],
                    scale: [0.98, 1.02, 0.98],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Number.POSITIVE_INFINITY,
                    repeatType: "reverse",
                  }}
                >
                  Loading categories...
                </motion.p>
              </motion.div>
            ) : error ? (
              <motion.div
                key="error"
                className="w-full py-12 text-center text-red-500"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.5 }}
              >
                <motion.div
                  animate={{
                    x: [0, -5, 5, -5, 5, 0],
                  }}
                  transition={{
                    duration: 0.5,
                    delay: 0.2,
                  }}
                >
                  {error}
                </motion.div>
              </motion.div>
            ) : (
              <motion.div
                key="content"
                className="flex flex-wrap justify-center gap-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
              >
                {categories.map((category, i) => (
                  <motion.div
                    key={category.id}
                    initial={{ opacity: 0, y: 50 }}
                    animate={{
                      opacity: 1,
                      y: 0,
                      transition: {
                        duration: 0.6,
                        delay: i * 0.1,
                        type: "spring",
                        damping: 12,
                      },
                    }}
                    exit={{ opacity: 0, y: 20 }}
                  >
                    <Link href={`/categories/${category.id}`} className="block">
                      <motion.div
                        whileHover={{
                          scale: 1.05,
                          boxShadow: "0 10px 25px rgba(104, 58, 237, 0.2)",
                        }}
                        whileTap={{ scale: 0.98 }}
                        transition={{
                          type: "spring",
                          stiffness: 400,
                          damping: 17,
                        }}
                      >
                        <Card className="w-64 h-64 overflow-hidden border-0 rounded-xl shadow-md">
                          <div className="relative w-full h-full">
                            {category.image ? (
                              <Image
                                src={category.image || "/placeholder.svg"}
                                alt={category.name}
                                fill
                                className="object-cover"
                              />
                            ) : (
                              <div className="bg-purple-300 w-full h-full" />
                            )}
                            <motion.div
                              className="absolute inset-0 bg-purple-900/60 flex items-center justify-center"
                              initial={{ opacity: 0.7 }}
                              whileHover={{
                                opacity: 0.9,
                                background: "rgba(100, 34, 100, 0.7)",
                              }}
                            >
                              <CardContent className="p-0">
                                <motion.h3
                                  className={`text-white text-2xl font-bold text-center px-4`}
                                  whileHover={{ scale: 1.1 }}
                                  transition={{ type: "spring", stiffness: 300 }}
                                >
                                  {category.name.toUpperCase()}
                                </motion.h3>
                              </CardContent>
                            </motion.div>
                          </div>
                        </Card>
                      </motion.div>
                    </Link>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </section>
    </MotionConfig>
  )
}
