/**
 * AI Career Assistant - Sidebar Component
 * 
 * Navigation sidebar with 4 module links, active state highlighting,
 * and collapsible design for mobile (bottom nav) and desktop.
 * Uses Framer Motion for smooth transitions.
 */

import React from 'react'
import { NavLink } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  FileText,
  BarChart3,
  Mic,
  Briefcase,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'

// Navigation items configuration
const NAV_ITEMS = [
  {
    id: 'resume',
    label: 'Resume Parser',
    path: '/resume',
    icon: FileText,
    description: 'Upload & parse resumes',
    color: 'from-blue-500 to-cyan-500',
    activeColor: 'text-blue-400',
  },
  {
    id: 'skills',
    label: 'Skill Analyzer',
    path: '/skills',
    icon: BarChart3,
    description: 'Analyze skill gaps',
    color: 'from-purple-500 to-pink-500',
    activeColor: 'text-purple-400',
  },
  {
    id: 'interview',
    label: 'Mock Interview',
    path: '/interview',
    icon: Mic,
    description: 'AI-powered practice',
    color: 'from-emerald-500 to-teal-500',
    activeColor: 'text-emerald-400',
  },
  {
    id: 'jobs',
    label: 'Job Matcher',
    path: '/jobs',
    icon: Briefcase,
    description: 'Find matching jobs',
    color: 'from-amber-500 to-orange-500',
    activeColor: 'text-amber-400',
  },
]

/**
 * Sidebar - Navigation sidebar component
 * @param {boolean} isOpen - Whether sidebar is open
 * @param {Function} onToggle - Toggle sidebar callback
 * @param {boolean} isMobile - Whether in mobile mode
 */
const Sidebar = ({ isOpen, onToggle, isMobile }) => {
  // Mobile bottom navigation
  if (isMobile) {
    return (
      <motion.nav
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        className="fixed bottom-0 left-0 right-0 z-50 bg-dark-bg/95 backdrop-blur-xl 
                   border-t border-dark-border safe-area-pb"
      >
        <div className="flex items-center justify-around px-2 py-2">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.id}
              to={item.path}
              className={({ isActive }) => `
                flex flex-col items-center gap-1 px-3 py-2 rounded-xl transition-all duration-200
                ${isActive 
                  ? 'bg-white/10 ' + item.activeColor 
                  : 'text-gray-500 hover:text-gray-300 hover:bg-white/5'
                }
              `}
            >
              <item.icon size={20} />
              <span className="text-[10px] font-medium">{item.label.split(' ')[0]}</span>
            </NavLink>
          ))}
        </div>
      </motion.nav>
    )
  }

  // Desktop sidebar
  return (
    <motion.aside
      initial={{ x: -20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.4, delay: 0.1 }}
      className={`fixed left-0 top-16 bottom-0 z-40 transition-all duration-300 ${
        isOpen ? 'w-64' : 'w-20'
      }`}
    >
      <div className="h-full bg-dark-card/50 backdrop-blur-xl border-r border-dark-border flex flex-col">
        {/* Toggle button */}
        <button
          onClick={onToggle}
          className="absolute -right-3 top-6 w-6 h-6 rounded-full bg-dark-elevated 
                     border border-dark-border flex items-center justify-center
                     hover:bg-dark-bg transition-colors z-10"
        >
          {isOpen ? <ChevronLeft size={14} /> : <ChevronRight size={14} />}
        </button>

        {/* Navigation items */}
        <nav className="flex-1 px-3 py-6 space-y-2">
          {NAV_ITEMS.map((item, index) => (
            <NavLink
              key={item.id}
              to={item.path}
              className={({ isActive }) => `
                relative flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 group
                ${isActive 
                  ? 'bg-white/10 ' + item.activeColor 
                  : 'text-gray-400 hover:text-gray-200 hover:bg-white/5'
                }
              `}
            >
              {({ isActive }) => (
                <>
                  {/* Active indicator */}
                  {isActive && (
                    <motion.div
                      layoutId="activeNavIndicator"
                      className={`absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 rounded-r-full 
                                  bg-gradient-to-b ${item.color}`}
                      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                    />
                  )}

                  {/* Icon with gradient background when active */}
                  <div className={`relative flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center
                                  transition-all duration-200
                                  ${isActive 
                                    ? `bg-gradient-to-br ${item.color} text-white shadow-lg` 
                                    : 'bg-white/5 group-hover:bg-white/10'
                                  }`}
                  >
                    <item.icon size={20} />
                  </div>

                  {/* Label and description - shown when expanded */}
                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ opacity: 0, width: 0 }}
                        animate={{ opacity: 1, width: 'auto' }}
                        exit={{ opacity: 0, width: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden whitespace-nowrap"
                      >
                        <p className="font-medium text-sm">{item.label}</p>
                        <p className="text-[11px] text-gray-500">{item.description}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Footer info - only when expanded */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="px-4 py-4 border-t border-dark-border"
            >
              <div className="bg-dark-elevated rounded-xl p-3">
                <p className="text-xs text-gray-500 mb-1">Current Status</p>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-xs text-emerald-400 font-medium">Ready</span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.aside>
  )
}

export default Sidebar
