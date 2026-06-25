/**
 * AI Career Assistant - SkillTag Component
 * 
 * Reusable skill badge with color-coding and category icons.
 * Used throughout the app to display skills with visual indicators
 * for matched/missing/neutral states and category information.
 */

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import {
  Code2,
  Cloud,
  Database,
  Layout,
  Server,
  Wrench,
  Brain,
  Smartphone,
  Globe,
  Cpu,
  GitBranch,
  Terminal,
  Layers,
  Box,
  Star,
} from 'lucide-react'

// Map skill categories to icons
const CATEGORY_ICONS = {
  language: Code2,
  frontend: Layout,
  backend: Server,
  database: Database,
  cloud: Cloud,
  devops: Wrench,
  ml: Brain,
  mobile: Smartphone,
  web: Globe,
  tool: Wrench,
  framework: Layers,
  library: Box,
  ai: Brain,
  data: Database,
  version_control: GitBranch,
  os: Terminal,
  default: Star,
}

/**
 * SkillTag - Reusable skill badge component
 * @param {string} name - Skill name to display
 * @param {string} category - Skill category for icon selection
 * @param {string} variant - Visual variant: 'matched' | 'missing' | 'neutral'
 * @param {string} size - Size variant: 'sm' | 'md' | 'lg'
 * @param {boolean} showIcon - Whether to show category icon
 * @param {boolean} tooltip - Whether to show tooltip on hover
 * @param {string} description - Tooltip description text
 * @param {Function} onClick - Click handler
 * @param {boolean} animated - Whether to animate entrance
 * @param {number} index - Index for stagger animation
 */
const SkillTag = ({
  name,
  category = 'default',
  variant = 'neutral',
  size = 'md',
  showIcon = true,
  tooltip = false,
  description = '',
  onClick,
  animated = true,
  index = 0,
}) => {
  const [isHovered, setIsHovered] = useState(false)

  // Get icon component for category
  const IconComponent = CATEGORY_ICONS[category] || CATEGORY_ICONS.default

  // Variant-based styling
  const variantStyles = {
    matched: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/25',
    missing: 'bg-red-500/15 text-red-400 border-red-500/30 hover:bg-red-500/25',
    neutral: 'bg-blue-500/15 text-blue-400 border-blue-500/30 hover:bg-blue-500/25',
    warning: 'bg-amber-500/15 text-amber-400 border-amber-500/30 hover:bg-amber-500/25',
  }

  // Size-based styling
  const sizeStyles = {
    sm: 'px-2 py-0.5 text-xs gap-1',
    md: 'px-3 py-1 text-sm gap-1.5',
    lg: 'px-4 py-2 text-base gap-2',
  }

  // Icon sizes
  const iconSizes = {
    sm: 12,
    md: 14,
    lg: 16,
  }

  const baseClasses = `
    inline-flex items-center rounded-full border font-medium
    transition-all duration-200 cursor-default
    ${variantStyles[variant] || variantStyles.neutral}
    ${sizeStyles[size] || sizeStyles.md}
    ${onClick ? 'cursor-pointer active:scale-95' : ''}
  `

  const TagContent = (
    <>
      {showIcon && <IconComponent size={iconSizes[size]} className="flex-shrink-0" />}
      <span>{name}</span>
    </>
  )

  const motionProps = animated
    ? {
        initial: { opacity: 0, scale: 0.8 },
        animate: { opacity: 1, scale: 1 },
        transition: { duration: 0.3, delay: index * 0.05 },
      }
    : {}

  // Tooltip wrapper
  if (tooltip && description) {
    return (
      <motion.div
        className="relative inline-block"
        {...motionProps}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <span className={baseClasses} onClick={onClick}>
          {TagContent}
        </span>

        {/* Tooltip popup */}
        {isHovered && (
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 rounded-lg 
                       bg-dark-elevated border border-dark-border shadow-xl z-50 w-48"
          >
            <p className="text-xs text-gray-300">{description}</p>
            <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-px">
              <div className="w-2 h-2 bg-dark-elevated border-r border-b border-dark-border rotate-45" />
            </div>
          </motion.div>
        )}
      </motion.div>
    )
  }

  return (
    <motion.span className={baseClasses} {...motionProps} onClick={onClick}>
      {TagContent}
    </motion.span>
  )
}

export default SkillTag
