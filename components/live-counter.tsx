"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"

interface LiveCounterProps {
  value: number
  prefix?: string
  suffix?: string
  duration?: number
  decimals?: number
  fluctuation?: number
  increment?: number
  interval?: number
  className?: string
}

export default function LiveCounter({
  value,
  prefix = "",
  suffix = "",
  duration = 2,
  decimals = 0,
  fluctuation = 0,
  increment = 0,
  interval = 5000,
  className = "",
}: LiveCounterProps) {
  const [displayValue, setDisplayValue] = useState(0)
  const [targetValue, setTargetValue] = useState(value)

  // Initial animation
  useEffect(() => {
    const startTime = Date.now()
    const initialValue = 0
    const finalValue = value

    const updateValue = () => {
      const now = Date.now()
      const elapsed = now - startTime
      const progress = Math.min(elapsed / (duration * 1000), 1)

      // Easing function (ease-out)
      const easedProgress = 1 - Math.pow(1 - progress, 3)

      const currentValue = initialValue + (finalValue - initialValue) * easedProgress
      setDisplayValue(currentValue)

      if (progress < 1) {
        requestAnimationFrame(updateValue)
      }
    }

    requestAnimationFrame(updateValue)
  }, [value, duration])

  // Random fluctuations or increments
  useEffect(() => {
    if (fluctuation > 0 || increment > 0) {
      const timer = setInterval(() => {
        if (fluctuation > 0) {
          // Random fluctuation within range
          const randomChange = (Math.random() * 2 - 1) * fluctuation * value
          setTargetValue(value + randomChange)
        } else if (increment > 0) {
          // Steady increment
          setTargetValue((prev) => prev + increment)
        }
      }, interval)

      return () => clearInterval(timer)
    }
  }, [value, fluctuation, increment, interval])

  // Animate to new target value
  useEffect(() => {
    if (targetValue !== value && fluctuation === 0 && increment === 0) {
      setTargetValue(value)
    }

    const startTime = Date.now()
    const initialValue = displayValue
    const finalValue = targetValue

    const updateValue = () => {
      const now = Date.now()
      const elapsed = now - startTime
      const progress = Math.min(elapsed / (duration * 500), 1)

      // Easing function (ease-out)
      const easedProgress = 1 - Math.pow(1 - progress, 2)

      const currentValue = initialValue + (finalValue - initialValue) * easedProgress
      setDisplayValue(currentValue)

      if (progress < 1) {
        requestAnimationFrame(updateValue)
      }
    }

    requestAnimationFrame(updateValue)
  }, [targetValue])

  // Format the display value
  const formattedValue = new Intl.NumberFormat("en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(displayValue)

  return (
    <motion.span
      className={className}
      animate={{
        scale: [1, 1.02, 1],
        color: targetValue > value ? ["#10b981", "#10b981", "currentColor"] : undefined,
      }}
      transition={{ duration: 0.5 }}
    >
      {prefix}
      {formattedValue}
      {suffix}
    </motion.span>
  )
}
