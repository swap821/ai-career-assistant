/**
 * AI Career Assistant - useInterview Hook
 * 
 * Custom hook for managing the AI mock interview flow.
 * Handles interview setup, question generation, answer evaluation,
 * scoring, and results compilation with gamification elements.
 */

import { useState, useCallback, useRef } from 'react'
import { generateInterview, evaluateAnswer } from '@/api/client'

// Interview flow stages
const STAGES = {
  SETUP: 'setup',
  INTERVIEW: 'interview',
  RESULTS: 'results',
}

// Question type configurations with gamification styling
const QUESTION_TYPES = [
  { id: 'technical', label: 'Technical', color: 'bg-blue-500', icon: 'code' },
  { id: 'behavioral', label: 'Behavioral', color: 'bg-purple-500', icon: 'users' },
  { id: 'system_design', label: 'System Design', color: 'bg-amber-500', icon: 'layout' },
  { id: 'project_deep_dive', label: 'Project Deep-Dive', color: 'bg-emerald-500', icon: 'folder' },
]

// Difficulty levels with scoring multipliers
const DIFFICULTY = {
  easy: { label: 'Easy', multiplier: 1, color: 'bg-emerald-500', textColor: 'text-emerald-400' },
  medium: { label: 'Medium', multiplier: 1.5, color: 'bg-amber-500', textColor: 'text-amber-400' },
  hard: { label: 'Hard', multiplier: 2, color: 'bg-red-500', textColor: 'text-red-400' },
}

export const useInterview = () => {
  // Flow stage
  const [stage, setStage] = useState(STAGES.SETUP)

  // Configuration
  const [numQuestions, setNumQuestions] = useState(5)
  const [selectedTypes, setSelectedTypes] = useState(['technical'])
  const [resumeData, setResumeData] = useState(null)

  // Questions and answers
  const [questions, setQuestions] = useState([])
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [currentAnswer, setCurrentAnswer] = useState('')
  const [evaluations, setEvaluations] = useState([])

  // Loading and error states
  const [isGenerating, setIsGenerating] = useState(false)
  const [isEvaluating, setIsEvaluating] = useState(false)
  const [error, setError] = useState(null)

  // Timer ref for tracking answer time
  const timerRef = useRef(null)
  const [answerTime, setAnswerTime] = useState(0)
  const [isTimerRunning, setIsTimerRunning] = useState(false)

  /**
   * Toggle question type selection
   * @param {string} typeId - Question type ID
   */
  const toggleQuestionType = useCallback((typeId) => {
    setSelectedTypes((prev) => {
      if (prev.includes(typeId)) {
        // Don't allow deselecting the last type
        if (prev.length === 1) return prev
        return prev.filter((t) => t !== typeId)
      }
      return [...prev, typeId]
    })
  }, [])

  /**
   * Start timer for current question
   */
  const startTimer = useCallback(() => {
    setAnswerTime(0)
    setIsTimerRunning(true)
    timerRef.current = setInterval(() => {
      setAnswerTime((prev) => prev + 1)
    }, 1000)
  }, [])

  /**
   * Stop timer
   */
  const stopTimer = useCallback(() => {
    setIsTimerRunning(false)
    if (timerRef.current) {
      clearInterval(timerRef.current)
      timerRef.current = null
    }
  }, [])

  /**
   * Generate interview questions from API
   */
  const startInterview = useCallback(async () => {
    if (!resumeData) return

    setIsGenerating(true)
    setError(null)

    try {
      const data = await generateInterview(resumeData, numQuestions, selectedTypes)
      setQuestions(data.questions || [])
      setCurrentQuestionIndex(0)
      setCurrentAnswer('')
      setEvaluations([])
      setStage(STAGES.INTERVIEW)
      // Auto-start timer for first question
      startTimer()
    } catch (err) {
      setError(err.message)
    } finally {
      setIsGenerating(false)
    }
  }, [resumeData, numQuestions, selectedTypes, startTimer])

  /**
   * Submit answer and get AI evaluation
   */
  const submitAnswer = useCallback(async () => {
    if (!currentAnswer.trim()) return

    stopTimer()
    setIsEvaluating(true)
    setError(null)

    const currentQuestion = questions[currentQuestionIndex]

    try {
      const evaluation = await evaluateAnswer(currentQuestion.text, currentAnswer)

      // Add timing and question metadata to evaluation
      const enrichedEvaluation = {
        ...evaluation,
        questionIndex: currentQuestionIndex,
        question: currentQuestion,
        answer: currentAnswer,
        answerTime,
        difficulty: currentQuestion.difficulty || 'medium',
      }

      setEvaluations((prev) => [...prev, enrichedEvaluation])
    } catch (err) {
      // Even if evaluation fails, record the answer
      setEvaluations((prev) => [
        ...prev,
        {
          questionIndex: currentQuestionIndex,
          question: currentQuestion,
          answer: currentAnswer,
          answerTime,
          score: 0,
          feedback: 'Unable to evaluate. Please try again.',
          strengths: [],
          improvements: ['Try providing a more detailed answer'],
          difficulty: currentQuestion.difficulty || 'medium',
          error: err.message,
        },
      ])
    } finally {
      setIsEvaluating(false)
    }
  }, [currentAnswer, questions, currentQuestionIndex, answerTime, stopTimer])

  /**
   * Move to next question
   */
  const nextQuestion = useCallback(() => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1)
      setCurrentAnswer('')
      startTimer()
    } else {
      // Interview complete
      stopTimer()
      setStage(STAGES.RESULTS)
    }
  }, [currentQuestionIndex, questions.length, startTimer, stopTimer])

  /**
   * Skip current question without answering
   */
  const skipQuestion = useCallback(() => {
    const currentQuestion = questions[currentQuestionIndex]

    setEvaluations((prev) => [
      ...prev,
      {
        questionIndex: currentQuestionIndex,
        question: currentQuestion,
        answer: '[Skipped]',
        answerTime: 0,
        score: 0,
        feedback: 'Question was skipped.',
        strengths: [],
        improvements: ['Practice answering this type of question'],
        difficulty: currentQuestion.difficulty || 'medium',
      },
    ])

    nextQuestion()
  }, [currentQuestionIndex, questions, nextQuestion])

  /**
   * Reset and restart interview with same config
   */
  const restartInterview = useCallback(() => {
    setStage(STAGES.SETUP)
    setQuestions([])
    setCurrentQuestionIndex(0)
    setCurrentAnswer('')
    setEvaluations([])
    setError(null)
    stopTimer()
    setAnswerTime(0)
  }, [stopTimer])

  /**
   * Calculate overall interview score
   */
  const overallScore = evaluations.length > 0
    ? Math.round(
        evaluations.reduce((sum, e) => sum + (e.score || 0), 0) / evaluations.length
      )
    : 0

  /**
   * Calculate score by category
   */
  const scoresByCategory = evaluations.reduce((acc, e) => {
    const category = e.question?.type || 'general'
    if (!acc[category]) {
      acc[category] = { total: 0, count: 0 }
    }
    acc[category].total += e.score || 0
    acc[category].count += 1
    return acc
  }, {})

  // Convert to averages
  const categoryAverages = Object.entries(scoresByCategory).map(([category, data]) => ({
    category,
    average: Math.round(data.total / data.count),
    count: data.count,
  }))

  /**
   * Get current question
   */
  const currentQuestion = questions[currentQuestionIndex] || null

  /**
   * Get current evaluation (if answered)
   */
  const currentEvaluation = evaluations.find(
    (e) => e.questionIndex === currentQuestionIndex
  ) || null

  /**
   * Check if current question has been answered
   */
  const isAnswered = evaluations.some(
    (e) => e.questionIndex === currentQuestionIndex
  )

  /**
   * Get performance tier based on score
   */
  const getPerformanceTier = (score) => {
    if (score >= 9) return { label: 'Expert', color: 'text-purple-400', bg: 'bg-purple-500/20' }
    if (score >= 7) return { label: 'Strong', color: 'text-emerald-400', bg: 'bg-emerald-500/20' }
    if (score >= 5) return { label: 'Good', color: 'text-blue-400', bg: 'bg-blue-500/20' }
    if (score >= 3) return { label: 'Developing', color: 'text-amber-400', bg: 'bg-amber-500/20' }
    return { label: 'Needs Work', color: 'text-red-400', bg: 'bg-red-500/20' }
  }

  return {
    // Constants
    STAGES,
    QUESTION_TYPES,
    DIFFICULTY,

    // State
    stage,
    numQuestions,
    selectedTypes,
    resumeData,
    questions,
    currentQuestionIndex,
    currentAnswer,
    currentQuestion,
    currentEvaluation,
    evaluations,
    isGenerating,
    isEvaluating,
    isAnswered,
    error,
    answerTime,
    isTimerRunning,
    overallScore,
    categoryAverages,
    progress: questions.length > 0 ? ((currentQuestionIndex + (isAnswered ? 1 : 0)) / questions.length) * 100 : 0,

    // Computed
    isComplete: stage === STAGES.RESULTS,
    isSetup: stage === STAGES.SETUP,
    isInterview: stage === STAGES.INTERVIEW,
    totalQuestions: questions.length,
    answeredCount: evaluations.length,

    // Setters
    setNumQuestions,
    setSelectedTypes,
    setResumeData,
    setCurrentAnswer,

    // Actions
    toggleQuestionType,
    startInterview,
    submitAnswer,
    nextQuestion,
    skipQuestion,
    restartInterview,
    startTimer,
    stopTimer,
    getPerformanceTier,
  }
}

export default useInterview
