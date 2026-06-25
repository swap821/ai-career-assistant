/**
 * AI Career Assistant - Footer Component
 * 
 * Simple footer with branding, copyright, and attribution.
 * Styled to match the dark theme with subtle text.
 */

import React from 'react'
import { motion } from 'framer-motion'
import { Heart, Code2 } from 'lucide-react'

/**
 * Footer - Dashboard footer
 */
const Footer = () => {
  return (
    <motion.footer
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="mt-auto py-6 border-t border-dark-border"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Left: Attribution */}
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <span>Built by</span>
            <span className="font-semibold text-gray-300">Swapnil Kumar</span>
            <span className="flex items-center gap-1">
              with <Heart size={14} className="text-red-500 fill-red-500" />
            </span>
          </div>

          {/* Center: Brand tagline */}
          <div className="flex items-center gap-2 text-sm">
            <Code2 size={16} className="text-primary" />
            <span className="text-gray-400">
              AI Career Assistant — Your Interview Copilot
            </span>
          </div>

          {/* Right: Year */}
          <div className="text-sm text-gray-600">
            © {new Date().getFullYear()}
          </div>
        </div>
      </div>
    </motion.footer>
  )
}

export default Footer
