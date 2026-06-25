/**
 * AI Career Assistant - App Component
 * 
 * Main application layout with React Router configuration.
 * Manages sidebar state, responsive breakpoints, and global layout.
 * Provides shared context (resume data) to all module components.
 */

import React, { useState, useEffect } from 'react'
import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'

// Layout components
import Navbar from '@/components/Navbar'
import Sidebar from '@/components/Sidebar'
import Footer from '@/components/Footer'

// Module components
import ResumeParser from '@/components/ResumeParser'
import SkillAnalyzer from '@/components/SkillAnalyzer'
import MockInterview from '@/components/MockInterview'
import JobMatcher from '@/components/JobMatcher'

// Custom hooks
import { useResume } from '@/hooks/useResume'

// Page transition variants
const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
}

/**
 * App - Root component with routing and layout
 */
const App = () => {
  // Sidebar state
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [isMobile, setIsMobile] = useState(false)

  // Get resume hook for shared state
  const resumeHook = useResume()

  // Current location for page transitions
  const location = useLocation()

  // Handle responsive sidebar
  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 1024
      setIsMobile(mobile)
      if (mobile) {
        setSidebarOpen(false)
      }
    }

    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Close sidebar on route change (mobile)
  useEffect(() => {
    if (isMobile) {
      setSidebarOpen(false)
    }
  }, [location.pathname, isMobile])

  // Toggle sidebar
  const toggleSidebar = () => setSidebarOpen((prev) => !prev)

  // Calculate sidebar width for main content offset
  const sidebarWidth = isMobile ? 0 : sidebarOpen ? 256 : 80

  return (
    <div className="min-h-screen bg-dark-bg text-white">
      {/* Navbar */}
      <Navbar sidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar} />

      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} onToggle={toggleSidebar} isMobile={isMobile} />

      {/* Main content area */}
      <motion.main
        className="min-h-screen pt-16 transition-all duration-300"
        style={{ marginLeft: isMobile ? 0 : sidebarWidth }}
      >
        <div className={`${isMobile ? 'pb-20' : ''}`}>
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
              className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto"
            >
              <Routes>
                {/* Resume Parser - Module 1 */}
                <Route
                  path="/resume"
                  element={<ResumeParser resumeHook={resumeHook} />}
                />

                {/* Skill Analyzer - Module 2 */}
                <Route
                  path="/skills"
                  element={<SkillAnalyzer resumeHook={resumeHook} />}
                />

                {/* Mock Interview - Module 3 */}
                <Route
                  path="/interview"
                  element={<MockInterview resumeHook={resumeHook} />}
                />

                {/* Job Matcher - Module 4 */}
                <Route
                  path="/jobs"
                  element={<JobMatcher resumeHook={resumeHook} />}
                />

                {/* Default redirect to Resume Parser */}
                <Route path="*" element={<Navigate to="/resume" replace />} />
              </Routes>
            </motion.div>
          </AnimatePresence>

          {/* Footer */}
          <Footer />
        </div>
      </motion.main>

      {/* Mobile sidebar overlay */}
      {isMobile && sidebarOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-30"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  )
}

export default App
