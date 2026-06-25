/**
 * AI Career Assistant - useResume Hook
 * 
 * Custom hook for managing parsed resume state across the application.
 * Provides resume data, loading states, and CRUD operations.
 * Persists resume data to localStorage for session continuity.
 */

import { useState, useCallback, useEffect } from 'react'
import { parseResume } from '@/api/client'

// Sample resume data for testing without uploading
const SAMPLE_RESUME = {
  name: 'Swapnil Kumar',
  email: 'swapnil.kumar@email.com',
  phone: '+91-98765-43210',
  skills: [
    { name: 'Python', category: 'language', level: 'advanced' },
    { name: 'JavaScript', category: 'language', level: 'advanced' },
    { name: 'React', category: 'frontend', level: 'intermediate' },
    { name: 'Node.js', category: 'backend', level: 'intermediate' },
    { name: 'TensorFlow', category: 'ml', level: 'beginner' },
    { name: 'SQL', category: 'database', level: 'intermediate' },
    { name: 'Git', category: 'tool', level: 'advanced' },
    { name: 'Docker', category: 'devops', level: 'beginner' },
    { name: 'AWS', category: 'cloud', level: 'beginner' },
    { name: 'HTML/CSS', category: 'frontend', level: 'advanced' },
  ],
  experience: [
    {
      id: 1,
      title: 'Web Development Intern',
      company: 'TechStart Solutions',
      duration: 'Jun 2024 - Present',
      description: 'Built responsive web applications using React and Node.js. Collaborated with senior developers on API design and database optimization.',
      skills: ['React', 'Node.js', 'MongoDB', 'Git'],
    },
    {
      id: 2,
      title: 'Freelance Developer',
      company: 'Self-employed',
      duration: 'Jan 2024 - May 2024',
      description: 'Developed custom websites and web applications for small businesses. Managed client relationships and project timelines.',
      skills: ['JavaScript', 'HTML/CSS', 'WordPress', 'Figma'],
    },
  ],
  education: [
    {
      id: 1,
      degree: 'Bachelor of Computer Applications (BCA)',
      institution: 'Patna University',
      duration: '2023 - 2026',
      cgpa: '8.5/10',
    },
    {
      id: 2,
      degree: 'Senior Secondary (12th)',
      institution: 'DAV Public School',
      duration: '2021 - 2023',
      percentage: '92%',
    },
  ],
  projects: [
    {
      id: 1,
      name: 'AI Chatbot Assistant',
      description: 'Built an intelligent chatbot using Python and TensorFlow for automated customer support. Integrated with Flask API and deployed on Heroku.',
      tech: ['Python', 'TensorFlow', 'Flask', 'NLP'],
      link: 'https://github.com/swapnil/chatbot',
    },
    {
      id: 2,
      name: 'E-Commerce Dashboard',
      description: 'Full-stack dashboard for managing products, orders, and analytics. Features real-time data visualization with Chart.js.',
      tech: ['React', 'Node.js', 'MongoDB', 'Chart.js'],
      link: 'https://github.com/swapnil/ecommerce-dashboard',
    },
    {
      id: 3,
      name: 'Weather Prediction App',
      description: 'Machine learning model that predicts weather patterns based on historical data. Achieved 85% accuracy on test dataset.',
      tech: ['Python', 'scikit-learn', 'Pandas', 'Matplotlib'],
      link: 'https://github.com/swapnil/weather-ml',
    },
  ],
  certifications: [
    { name: 'AWS Cloud Practitioner', issuer: 'Amazon Web Services', year: '2024' },
    { name: 'Machine Learning Specialization', issuer: 'Coursera (Stanford)', year: '2024' },
  ],
  raw_text: 'Swapnil Kumar - BCA Student with expertise in Python, JavaScript, React, and Machine Learning.',
}

const STORAGE_KEY = 'ai_career_assistant_resume'

export const useResume = () => {
  // Resume data state - try to load from localStorage on init
  const [resumeData, setResumeData] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      return stored ? JSON.parse(stored) : null
    } catch {
      return null
    }
  })

  // Loading and error states
  const [isLoading, setIsLoading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [error, setError] = useState(null)

  // Persist to localStorage whenever resumeData changes
  useEffect(() => {
    if (resumeData) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(resumeData))
    }
  }, [resumeData])

  /**
   * Upload and parse a resume file
   * @param {File} file - PDF or DOCX file
   */
  const uploadResume = useCallback(async (file) => {
    setIsLoading(true)
    setUploadProgress(0)
    setError(null)

    try {
      const onProgress = (progress) => setUploadProgress(progress)
      const data = await parseResume(file, onProgress)
      setResumeData(data)
      return { success: true, data }
    } catch (err) {
      setError(err.message)
      return { success: false, error: err.message }
    } finally {
      setIsLoading(false)
      setUploadProgress(0)
    }
  }, [])

  /**
   * Load sample resume data for testing
   */
  const loadSampleResume = useCallback(() => {
    setResumeData(SAMPLE_RESUME)
    setError(null)
  }, [])

  /**
   * Clear resume data from state and storage
   */
  const clearResume = useCallback(() => {
    setResumeData(null)
    setError(null)
    localStorage.removeItem(STORAGE_KEY)
  }, [])

  /**
   * Export resume data as JSON file
   */
  const exportAsJSON = useCallback(() => {
    if (!resumeData) return

    const dataStr = JSON.stringify(resumeData, null, 2)
    const blob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `${resumeData.name?.replace(/\s+/g, '_') || 'resume'}_parsed.json`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }, [resumeData])

  /**
   * Check if a specific skill exists in the resume
   * @param {string} skillName - Skill to check
   */
  const hasSkill = useCallback((skillName) => {
    if (!resumeData?.skills) return false
    return resumeData.skills.some(
      (s) => s.name.toLowerCase() === skillName.toLowerCase()
    )
  }, [resumeData])

  /**
   * Get skills by category
   * @param {string} category - Skill category filter
   */
  const getSkillsByCategory = useCallback((category) => {
    if (!resumeData?.skills) return []
    return resumeData.skills.filter((s) => s.category === category)
  }, [resumeData])

  return {
    // State
    resumeData,
    isLoading,
    uploadProgress,
    error,
    hasResume: !!resumeData,

    // Actions
    uploadResume,
    loadSampleResume,
    clearResume,
    exportAsJSON,
    hasSkill,
    getSkillsByCategory,
    setResumeData,
  }
}

export default useResume
