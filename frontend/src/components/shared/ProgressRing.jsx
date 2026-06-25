/**
 * AI Career Assistant - ProgressRing Component
 * 
 * Reusable animated SVG circular progress indicator.
 * Used for displaying match percentages, scores, and completion rates.
 * Features color-coded rings based on score value with smooth animations.
 */

import React from 'react'
import { motion } from 'framer-motion'

/**
 * ProgressRing - Animated circular progress component
 * @param {number} percentage - Value between 0-100
 * @param {number} size - Diameter of the ring in pixels
 * @param {number} strokeWidth - Thickness of the ring
 * @param {string} className - Additional CSS classes
 * @param {boolean} showLabel - Whether to show percentage text in center
 * @param {ReactNode} children - Optional content to render inside ring
 */
const ProgressRing = ({
  percentage = 0,
  size = 120,
  strokeWidth = 8,
  className = '',
  showLabel = true,
  children,
}) => {
  // Ensure percentage is within bounds
  const clampedPercentage = Math.min(100, Math.max(0, percentage))

  // Calculate ring dimensions
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const strokeDashoffset = circumference - (clampedPercentage / 100) * circumference

  // Determine color based on score
  const getColor = () => {
    if (clampedPercentage >= 75) return '#10b981' // emerald-500
    if (clampedPercentage >= 50) return '#f59e0b'  // amber-500
    return '#ef4444' // red-500
  }

  const getGlowColor = () => {
    if (clampedPercentage >= 75) return 'rgba(16, 185, 129, 0.3)'
    if (clampedPercentage >= 50) return 'rgba(245, 158, 11, 0.3)'
    return 'rgba(239, 68, 68, 0.3)'
  }

  const color = getColor()
  const glowColor = getGlowColor()

  return (
    <div className={`relative inline-flex items-center justify-center ${className}`}>
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="transform -rotate-90"
      >
        {/* Background ring track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="rgba(255, 255, 255, 0.05)"
          strokeWidth={strokeWidth}
        />

        {/* Animated progress ring */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{
            duration: 1.2,
            ease: [0.4, 0, 0.2, 1], // Custom easing for smooth animation
            delay: 0.2,
          }}
          style={{
            filter: `drop-shadow(0 0 6px ${glowColor})`,
          }}
        />
      </svg>

      {/* Center content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        {showLabel && (
          <motion.span
            className="text-2xl font-bold"
            style={{ color }}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            {Math.round(clampedPercentage)}%
          </motion.span>
        )}
        {children}
      </div>
    </div>
  )
}

export default ProgressRing
