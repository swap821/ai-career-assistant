/**
 * AI Career Assistant - Navbar Component
 * 
 * Top navigation bar with branding, user profile placeholder,
 * and GitHub link. Features glassmorphism effect and responsive design.
 */

import React from 'react'
import { motion } from 'framer-motion'
import { Github, User, Sparkles, Menu, X } from 'lucide-react'

/**
 * Navbar - Top navigation bar
 * @param {boolean} sidebarOpen - Whether sidebar is currently open
 * @param {Function} toggleSidebar - Function to toggle sidebar
 */
const Navbar = ({ sidebarOpen, toggleSidebar }) => {
  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="fixed top-0 left-0 right-0 z-50 h-16"
    >
      {/* Glassmorphism background */}
      <div className="absolute inset-0 bg-dark-bg/80 backdrop-blur-xl border-b border-dark-border" />

      <div className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between">
        {/* Left: Menu toggle (mobile) + Logo */}
        <div className="flex items-center gap-3">
          {/* Mobile menu toggle */}
          <button
            onClick={toggleSidebar}
            className="lg:hidden p-2 rounded-lg hover:bg-white/5 transition-colors"
            aria-label="Toggle sidebar"
          >
            {sidebarOpen ? (
              <X size={20} className="text-gray-400" />
            ) : (
              <Menu size={20} className="text-gray-400" />
            )}
          </button>

          {/* Logo & Brand */}
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent-cyn 
                            flex items-center justify-center shadow-glow-primary">
              <Sparkles size={18} className="text-white" />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-lg font-bold text-white leading-tight">
                AI Career Assistant
              </h1>
              <p className="text-[10px] text-gray-500 leading-tight -mt-0.5">
                YOUR INTERVIEW COPILOT
              </p>
            </div>
          </div>
        </div>

        {/* Right: GitHub + Profile */}
        <div className="flex items-center gap-2">
          {/* GitHub link */}
          <a
            href="https://github.com/swapnil/ai-career-assistant"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm text-gray-400 
                       hover:text-white hover:bg-white/5 transition-all duration-200"
          >
            <Github size={18} />
            <span className="hidden sm:inline">GitHub</span>
          </a>

          {/* Divider */}
          <div className="w-px h-6 bg-dark-border hidden sm:block" />

          {/* User profile placeholder */}
          <div className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-white/5 transition-colors cursor-pointer">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary/30 to-accent-purple/30 
                            border border-primary/30 flex items-center justify-center">
              <User size={16} className="text-primary-light" />
            </div>
            <div className="hidden md:block">
              <p className="text-sm font-medium text-white leading-tight">Swapnil Kumar</p>
              <p className="text-[10px] text-gray-500 leading-tight">BCA Student</p>
            </div>
          </div>
        </div>
      </div>
    </motion.nav>
  )
}

export default Navbar
