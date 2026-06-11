"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"

export function SplashScreen() {
  const [show, setShow] = useState(false)

  useEffect(() => {
    // Only show the splash screen once per session
    const hasShown = sessionStorage.getItem("splashShown")
    if (!hasShown) {
      setShow(true)
      // Hide the splash screen after 2.5 seconds
      const timer = setTimeout(() => {
        setShow(false)
        sessionStorage.setItem("splashShown", "true")
      }, 2500)
      return () => clearTimeout(timer)
    }
  }, [])

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          key="splash"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-white"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <Image 
              src="/logo.png" 
              alt="Maison Auto" 
              width={600} 
              height={200} 
              className="w-[80vw] max-w-md h-auto object-contain" 
              priority
            />
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="mt-16 overflow-hidden rounded-full bg-gray-200 w-64 h-1"
          >
            <motion.div
              initial={{ width: "0%" }}
              animate={{ width: "100%" }}
              transition={{ duration: 2, ease: "easeInOut" }}
              className="h-full bg-black"
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
