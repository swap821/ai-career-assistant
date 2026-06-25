/**
 * AI Career Assistant - API Client
 * 
 * Axios-based HTTP client for communicating with the Flask backend.
 * All API endpoints are organized by module (resume, interview, jobs, skills).
 * Includes error handling wrapper and upload progress tracking.
 */

import axios from 'axios'

// Base API URL from environment variables or default to localhost
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, // 30 second timeout
})

// Request interceptor for logging/debugging
apiClient.interceptors.request.use(
  (config) => {
    console.log(`[API Request] ${config.method?.toUpperCase()} ${config.url}`)
    return config
  },
  (error) => {
    console.error('[API Request Error]', error)
    return Promise.reject(error)
  }
)

// Response interceptor for consistent error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const errorMessage = error.response?.data?.error || error.message || 'An unexpected error occurred'
    console.error('[API Error]', errorMessage)
    return Promise.reject(new Error(errorMessage))
  }
)

// ==========================================
// RESUME MODULE API
// ==========================================

/**
 * Upload and parse a resume file (PDF or DOCX)
 * @param {File} file - The resume file to upload
 * @param {Function} onProgress - Callback for upload progress (0-100)
 * @returns {Promise<Object>} Parsed resume data
 */
export const parseResume = async (file, onProgress = null) => {
  const formData = new FormData()
  formData.append('file', file)

  const config = {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  }

  // Add upload progress tracking if callback provided
  if (onProgress) {
    config.onUploadProgress = (progressEvent) => {
      const percentCompleted = Math.round(
        (progressEvent.loaded * 100) / progressEvent.total
      )
      onProgress(percentCompleted)
    }
  }

  const response = await apiClient.post('/api/resume/parse', formData, config)
  return response.data
}

/**
 * Analyze skill gaps between resume and job description
 * @param {string} resumeText - Parsed resume text
 * @param {string} jobDescription - Job description text
 * @returns {Promise<Object>} Skill gap analysis results
 */
export const analyzeSkills = async (resumeText, jobDescription) => {
  const response = await apiClient.post('/api/resume/analyze-skills', {
    resume_text: resumeText,
    job_description: jobDescription,
  })
  return response.data
}

/**
 * Compare resume against a specific job title
 * @param {string} resumeText - Parsed resume text
 * @param {string} jobTitle - Job title to compare against
 * @returns {Promise<Object>} Job match score and analysis
 */
export const compareJob = async (resumeText, jobTitle) => {
  const response = await apiClient.post('/api/resume/compare-job', {
    resume_text: resumeText,
    job_title: jobTitle,
  })
  return response.data
}

// ==========================================
// INTERVIEW MODULE API
// ==========================================

/**
 * Generate AI interview questions based on resume
 * @param {Object} resumeData - Parsed resume data
 * @param {number} numQuestions - Number of questions to generate (5, 10, or 15)
 * @param {string[]} questionTypes - Types of questions to include
 * @returns {Promise<Object>} Generated interview questions
 */
export const generateInterview = async (resumeData, numQuestions = 5, questionTypes = ['technical']) => {
  const response = await apiClient.post('/api/interview/generate', {
    resume_data: resumeData,
    num_questions: numQuestions,
    question_types: questionTypes,
  })
  return response.data
}

/**
 * Evaluate user's interview answer
 * @param {string} question - The interview question
 * @param {string} userAnswer - User's answer text
 * @returns {Promise<Object>} AI feedback and score
 */
export const evaluateAnswer = async (question, userAnswer) => {
  const response = await apiClient.post('/api/interview/evaluate', {
    question,
    user_answer: userAnswer,
  })
  return response.data
}

// ==========================================
// JOBS MODULE API
// ==========================================

/**
 * Get list of job templates
 * @returns {Promise<Array>} List of job template objects
 */
export const getJobTemplates = async () => {
  const response = await apiClient.get('/api/jobs/templates')
  return response.data
}

/**
 * Match resume against all available jobs
 * @param {string} resumeText - Parsed resume text
 * @returns {Promise<Array>} Ranked job matches
 */
export const matchAllJobs = async (resumeText) => {
  const response = await apiClient.get('/api/jobs/match-all', {
    params: { resume_text: resumeText },
  })
  return response.data
}

// ==========================================
// SKILLS MODULE API
// ==========================================

/**
 * Get database of known skills with categories
 * @returns {Promise<Array>} List of skills with metadata
 */
export const getSkillsDatabase = async () => {
  const response = await apiClient.get('/api/skills/database')
  return response.data
}

// ==========================================
// ERROR HANDLING WRAPPER
// ==========================================

/**
 * Wraps an API call with consistent error handling
 * @param {Function} apiCall - Async API function to execute
 * @param {Object} options - Options for error handling
 * @returns {Promise<Object>} API response or error object
 */
export const withErrorHandling = async (apiCall, options = {}) => {
  const { fallbackValue = null, onError = null } = options

  try {
    const result = await apiCall()
    return { success: true, data: result, error: null }
  } catch (error) {
    if (onError) onError(error.message)
    return { success: false, data: fallbackValue, error: error.message }
  }
}

export default apiClient
