"use client"

import { type ReactNode, useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"

interface MorphingShapeProps {
  startIcon: ReactNode
  endIcon: ReactNode
  delay?: number
}

export default function MorphingShape({ startIcon, endIcon, delay = 0 }: MorphingShapeProps) {
  const [showStart, setShowStart] = useState(true)

  useEffect(() => {
    const interval = setInterval(() => {
      setShowStart((prev) => !prev)
    }, 3000)

    // Initial delay
    const initialDelay = setTimeout(() => {
      setShowStart(false)
    }, delay * 1000)

    return () => {
      clearInterval(interval)
      clearTimeout(initialDelay)
    }
  }, [delay])

  return (
    <div className="relative h-16 w-16 flex items-center justify-center">
      <AnimatePresence mode="wait">
        {showStart ? (
          <motion.div
            key="start"
            initial={{ opacity: 0, scale: 0.8, rotate: -10 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            exit={{ opacity: 0, scale: 0.8, rotate: 10 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0 flex items-center justify-center"
          >
            {startIcon}
          </motion.div>
        ) : (
          <motion.div
            key="end"
            initial={{ opacity: 0, scale: 0.8, rotate: 10 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            exit={{ opacity: 0, scale: 0.8, rotate: -10 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0 flex items-center justify-center"
          >
            {endIcon}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
