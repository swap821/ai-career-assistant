/**
 * AI Career Assistant - MockInterview Component (Module 3)
 * 
 * AI-powered mock interview module with gamification vibes.
 * Features setup screen, question cards with timer, AI evaluation,
 * and comprehensive results with performance breakdown.
 */

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Mic,
  Clock,
  ChevronRight,
  SkipForward,
  RotateCcw,
  Trophy,
  Target,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  XCircle,
  Zap,
  MessageSquare,
  Settings,
  Play,
  Award,
  Flame,
  Star,
  Lightbulb,
  ArrowRight,
  FolderOpen,
} from 'lucide-react'
import ProgressRing from '@/components/shared/ProgressRing'
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
  Tooltip,
} from 'recharts'

// Question types with styling
const QUESTION_TYPES = [
  { id: 'technical', label: 'Technical', color: 'from-blue-500 to-cyan-500', icon: Zap },
  { id: 'behavioral', label: 'Behavioral', color: 'from-purple-500 to-pink-500', icon: MessageSquare },
  { id: 'system_design', label: 'System Design', color: 'from-amber-500 to-orange-500', icon: Target },
  { id: 'project_deep_dive', label: 'Project Deep-Dive', color: 'from-emerald-500 to-teal-500', icon: FolderOpen },
]

// Difficulty config
const DIFFICULTY_CONFIG = {
  easy: { color: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30', label: 'Easy' },
  medium: { color: 'bg-amber-500/20 text-amber-400 border-amber-500/30', label: 'Medium' },
  hard: { color: 'bg-red-500/20 text-red-400 border-red-500/30', label: 'Hard' },
}

// Animation variants
const cardVariants = {
  initial: { opacity: 0, y: 30, scale: 0.95 },
  animate: { opacity: 1, y: 0, scale: 1 },
  exit: { opacity: 0, y: -30, scale: 0.95 },
}

// Sample questions for demo
const SAMPLE_QUESTIONS = [
  {
    id: 1,
    text: 'Explain the difference between let, const, and var in JavaScript. When would you use each?',
    type: 'technical',
    difficulty: 'easy',
    category: 'JavaScript',
  },
  {
    id: 2,
    text: 'Describe a time when you had to debug a complex issue in production. What was your approach?',
    type: 'behavioral',
    difficulty: 'medium',
    category: 'Problem Solving',
  },
  {
    id: 3,
    text: 'Design a URL shortening service like bit.ly. How would you handle high traffic and ensure scalability?',
    type: 'system_design',
    difficulty: 'hard',
    category: 'System Design',
  },
  {
    id: 4,
    text: 'Walk me through your AI Chatbot project. What ML model did you use and why?',
    type: 'project_deep_dive',
    difficulty: 'medium',
    category: 'Projects',
  },
  {
    id: 5,
    text: 'What is the Event Loop in Node.js and how does it handle asynchronous operations?',
    type: 'technical',
    difficulty: 'medium',
    category: 'Node.js',
  },
  {
    id: 6,
    text: 'Tell me about a time you disagreed with a team member. How did you resolve it?',
    type: 'behavioral',
    difficulty: 'easy',
    category: 'Teamwork',
  },
  {
    id: 7,
    text: 'Design a real-time notification system for a social media platform.',
    type: 'system_design',
    difficulty: 'hard',
    category: 'System Design',
  },
  {
    id: 8,
    text: 'Explain how you would optimize a React application that has performance issues.',
    type: 'technical',
    difficulty: 'medium',
    category: 'React',
  },
  {
    id: 9,
    text: 'What was the most challenging technical decision you made in your E-Commerce Dashboard project?',
    type: 'project_deep_dive',
    difficulty: 'hard',
    category: 'Projects',
  },
  {
    id: 10,
    text: 'Describe a situation where you had to learn a new technology quickly to meet a deadline.',
    type: 'behavioral',
    difficulty: 'easy',
    category: 'Adaptability',
  },
]

/**
 * MockInterview - Module 3: AI Mock Interview
 * @param {Object} resumeHook - useResume hook instance
 */
const MockInterview = ({ resumeHook }) => {
  const { resumeData, hasResume, loadSampleResume } = resumeHook

  // Interview stages
  const [stage, setStage] = useState('setup') // setup | interview | results

  // Configuration
  const [numQuestions, setNumQuestions] = useState(5)
  const [selectedTypes, setSelectedTypes] = useState(['technical', 'behavioral'])
  const [isGenerating, setIsGenerating] = useState(false)

  // Interview state
  const [questions, setQuestions] = useState([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [answer, setAnswer] = useState('')
  const [evaluations, setEvaluations] = useState([])
  const [isEvaluating, setIsEvaluating] = useState(false)

  // Timer
  const [timer, setTimer] = useState(0)
  const [isTimerRunning, setIsTimerRunning] = useState(false)

  // Start timer
  useEffect(() => {
    let interval
    if (isTimerRunning) {
      interval = setInterval(() => setTimer((t) => t + 1), 1000)
    }
    return () => clearInterval(interval)
  }, [isTimerRunning])

  // Format timer
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  /**
   * Toggle question type
   */
  const toggleType = (typeId) => {
    setSelectedTypes((prev) => {
      if (prev.includes(typeId)) {
        if (prev.length === 1) return prev // Keep at least one
        return prev.filter((t) => t !== typeId)
      }
      return [...prev, typeId]
    })
  }

  /**
   * Generate questions
   */
  const generateQuestions = () => {
    setIsGenerating(true)

    // Simulate API call
    setTimeout(() => {
      // Filter by selected types and pick random questions
      const filtered = SAMPLE_QUESTIONS.filter((q) => selectedTypes.includes(q.type))
      const shuffled = [...filtered].sort(() => Math.random() - 0.5)
      const selected = shuffled.slice(0, Math.min(numQuestions, shuffled.length))

      // If not enough, fill with random
      while (selected.length < numQuestions) {
        selected.push(SAMPLE_QUESTIONS[selected.length % SAMPLE_QUESTIONS.length])
      }

      setQuestions(selected)
      setCurrentIndex(0)
      setAnswer('')
      setEvaluations([])
      setTimer(0)
      setIsTimerRunning(true)
      setStage('interview')
      setIsGenerating(false)
    }, 1500)
  }

  /**
   * Submit answer for evaluation
   */
  const submitAnswer = () => {
    if (!answer.trim()) return

    setIsTimerRunning(false)
    setIsEvaluating(true)

    const currentQuestion = questions[currentIndex]

    // Simulate AI evaluation
    setTimeout(() => {
      // Generate realistic score based on answer length and keywords
      const wordCount = answer.split(/\s+/).length
      const hasKeywords = ['because', 'example', 'experience', 'used', 'implemented', 'designed'].some(
        (kw) => answer.toLowerCase().includes(kw)
      )

      let baseScore = Math.min(8, Math.max(4, wordCount / 20))
      if (hasKeywords) baseScore += 1
      if (wordCount > 50) baseScore += 0.5

      const score = Math.min(10, Math.max(3, Math.round(baseScore * 10) / 10))

      const evaluation = {
        questionIndex: currentIndex,
        question: currentQuestion,
        answer,
        score,
        timeSpent: timer,
        feedback: score >= 8
          ? 'Excellent answer! You provided clear explanations with relevant examples.'
          : score >= 6
          ? 'Good answer. Consider providing more specific examples and going deeper into technical details.'
          : 'Your answer needs improvement. Try to structure it better and include concrete examples from your experience.',
        strengths: score >= 6
          ? ['Clear communication', 'Relevant technical knowledge']
          : ['Attempted to answer'],
        improvements: score < 8
          ? ['Add more specific examples', 'Structure with STAR method', 'Include technical details']
          : ['Could go even deeper on edge cases'],
      }

      setEvaluations((prev) => [...prev, evaluation])
      setIsEvaluating(false)
    }, 1200)
  }

  /**
   * Move to next question
   */
  const nextQuestion = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1)
      setAnswer('')
      setTimer(0)
      setIsTimerRunning(true)
    } else {
      // Interview complete
      setIsTimerRunning(false)
      setStage('results')
    }
  }

  /**
   * Skip question
   */
  const skipQuestion = () => {
    const evaluation = {
      questionIndex: currentIndex,
      question: questions[currentIndex],
      answer: '[Skipped]',
      score: 0,
      timeSpent: timer,
      feedback: 'Question was skipped.',
      strengths: [],
      improvements: ['Practice answering this type of question'],
    }
    setEvaluations((prev) => [...prev, evaluation])
    nextQuestion()
  }

  /**
   * Restart interview
   */
  const restartInterview = () => {
    setStage('setup')
    setQuestions([])
    setCurrentIndex(0)
    setAnswer('')
    setEvaluations([])
    setTimer(0)
    setIsTimerRunning(false)
  }

  /**
   * Get performance tier
   */
  const getPerformanceTier = (score) => {
    if (score >= 9) return { label: 'Expert', color: 'text-purple-400', bg: 'bg-purple-500/20', icon: Trophy }
    if (score >= 7) return { label: 'Strong', color: 'text-emerald-400', bg: 'bg-emerald-500/20', icon: Star }
    if (score >= 5) return { label: 'Good', color: 'text-blue-400', bg: 'bg-blue-500/20', icon: TrendingUp }
    if (score >= 3) return { label: 'Developing', color: 'text-amber-400', bg: 'bg-amber-500/20', icon: Flame }
    return { label: 'Needs Work', color: 'text-red-400', bg: 'bg-red-500/20', icon: AlertCircle }
  }

  // Computed values
  const currentQuestion = questions[currentIndex]
  const currentEval = evaluations.find((e) => e.questionIndex === currentIndex)
  const isAnswered = !!currentEval
  const overallScore = evaluations.length > 0
    ? Math.round((evaluations.reduce((s, e) => s + e.score, 0) / evaluations.length) * 10) / 10
    : 0
  const progress = questions.length > 0 ? ((currentIndex + (isAnswered ? 1 : 0)) / questions.length) * 100 : 0

  // Category scores for radar chart
  const categoryScores = QUESTION_TYPES.map((type) => {
    const typeEvals = evaluations.filter((e) => e.question?.type === type.id)
    return {
      subject: type.label,
      score: typeEvals.length > 0
        ? Math.round((typeEvals.reduce((s, e) => s + e.score, 0) / typeEvals.length) * 10)
        : 0,
      fullMark: 100,
    }
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h2 className="text-2xl font-bold gradient-text">AI Mock Interview</h2>
        <p className="text-gray-500 text-sm mt-1">
          Practice with AI-generated interview questions
        </p>
      </motion.div>

      {/* ========== SETUP STAGE ========== */}
      {stage === 'setup' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="max-w-2xl mx-auto space-y-6"
        >
          {!hasResume && (
            <div className="glass-card p-4 flex items-center gap-3 border-amber-500/20">
              <AlertCircle size={20} className="text-amber-400 flex-shrink-0" />
              <p className="text-sm text-gray-300">
                No resume loaded. 
                <button onClick={loadSampleResume} className="text-primary hover:underline ml-1">
                  Load sample
                </button>
              </p>
            </div>
          )}

          <div className="glass-card p-6 space-y-6">
            {/* Question count */}
            <div>
              <label className="text-sm font-medium text-white mb-3 block flex items-center gap-2">
                <Settings size={16} className="text-primary" />
                Number of Questions
              </label>
              <div className="flex gap-3">
                {[5, 10, 15].map((num) => (
                  <button
                    key={num}
                    onClick={() => setNumQuestions(num)}
                    className={`
                      flex-1 py-3 rounded-xl font-semibold text-sm transition-all duration-200
                      ${numQuestions === num
                        ? 'bg-primary text-white shadow-glow-primary'
                        : 'bg-dark-elevated text-gray-400 hover:text-white hover:bg-white/5'
                      }
                    `}
                  >
                    {num}
                  </button>
                ))}
              </div>
            </div>

            {/* Question types */}
            <div>
              <label className="text-sm font-medium text-white mb-3 block flex items-center gap-2">
                <Zap size={16} className="text-primary" />
                Question Types
              </label>
              <div className="grid grid-cols-2 gap-3">
                {QUESTION_TYPES.map((type) => {
                  const isSelected = selectedTypes.includes(type.id)
                  return (
                    <button
                      key={type.id}
                      onClick={() => toggleType(type.id)}
                      className={`
                        flex items-center gap-3 p-4 rounded-xl border transition-all duration-200
                        ${isSelected
                          ? 'border-primary/50 bg-primary/10 text-white'
                          : 'border-dark-border bg-dark-elevated/50 text-gray-400 hover:border-white/20'
                        }
                      `}
                    >
                      <div className={`
                        w-10 h-10 rounded-lg flex items-center justify-center
                        ${isSelected ? `bg-gradient-to-br ${type.color} text-white` : 'bg-white/5'}
                      `}>
                        <type.icon size={20} />
                      </div>
                      <div className="text-left">
                        <p className="text-sm font-medium">{type.label}</p>
                      </div>
                      {isSelected && (
                        <CheckCircle2 size={18} className="text-primary ml-auto" />
                      )}
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Start button */}
            <button
              onClick={generateQuestions}
              disabled={isGenerating}
              className={`
                w-full py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-3
                transition-all duration-300
                ${isGenerating
                  ? 'bg-dark-elevated text-gray-500 cursor-not-allowed'
                  : 'glass-button-primary hover:scale-[1.02] animate-pulse-glow'
                }
              `}
            >
              {isGenerating ? (
                <>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    className="w-6 h-6 border-3 border-white border-t-transparent rounded-full"
                  />
                  Generating Questions...
                </>
              ) : (
                <>
                  <Play size={24} fill="white" />
                  Start Interview
                </>
              )}
            </button>
          </div>
        </motion.div>
      )}

      {/* ========== INTERVIEW STAGE ========== */}
      {stage === 'interview' && currentQuestion && (
        <div className="max-w-3xl mx-auto space-y-6">
          {/* Progress bar */}
          <div className="glass-card p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-400">
                Question {currentIndex + 1} of {questions.length}
              </span>
              <div className="flex items-center gap-4">
                <span className="text-sm text-gray-400 flex items-center gap-1">
                  <Clock size={14} />
                  {formatTime(timer)}
                </span>
                <span className="text-sm font-medium text-primary">
                  {Math.round(progress)}%
                </span>
              </div>
            </div>
            <div className="h-2 bg-dark-elevated rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-primary to-accent-cyan rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
          </div>

          {/* Question card */}
          <AnimatePresence mode="wait">
            {!isAnswered ? (
              <motion.div
                key={`question-${currentIndex}`}
                variants={cardVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={{ duration: 0.3 }}
                className="glass-card p-6 sm:p-8"
              >
                {/* Badges */}
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className={`
                    px-3 py-1 rounded-full text-xs font-medium border
                    ${DIFFICULTY_CONFIG[currentQuestion.difficulty]?.color || DIFFICULTY_CONFIG.easy.color}
                  `}>
                    {DIFFICULTY_CONFIG[currentQuestion.difficulty]?.label || 'Easy'}
                  </span>
                  {QUESTION_TYPES.filter((t) => t.id === currentQuestion.type).map((type) => (
                    <span
                      key={type.id}
                      className="px-3 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary border border-primary/20"
                    >
                      {type.label}
                    </span>
                  ))}
                  {currentQuestion.category && (
                    <span className="px-3 py-1 rounded-full text-xs font-medium bg-dark-elevated text-gray-400 border border-dark-border">
                      {currentQuestion.category}
                    </span>
                  )}
                </div>

                {/* Question text */}
                <h3 className="text-lg sm:text-xl font-semibold text-white leading-relaxed">
                  {currentQuestion.text}
                </h3>

                {/* Answer textarea */}
                <div className="mt-6">
                  <textarea
                    value={answer}
                    onChange={(e) => setAnswer(e.target.value)}
                    placeholder="Type your answer here..."
                    rows={8}
                    className="glass-input resize-none"
                  />
                </div>

                {/* Actions */}
                <div className="flex gap-3 mt-4">
                  <button
                    onClick={skipQuestion}
                    className="px-4 py-3 rounded-xl text-sm text-gray-400 hover:text-white 
                               hover:bg-white/5 transition-all flex items-center gap-2"
                  >
                    <SkipForward size={16} />
                    Skip
                  </button>
                  <button
                    onClick={submitAnswer}
                    disabled={!answer.trim() || isEvaluating}
                    className={`
                      flex-1 py-3 rounded-xl font-semibold flex items-center justify-center gap-2
                      transition-all duration-300
                      ${answer.trim() && !isEvaluating
                        ? 'glass-button-primary hover:scale-[1.02]'
                        : 'bg-dark-elevated text-gray-500 cursor-not-allowed'
                      }
                    `}
                  >
                    {isEvaluating ? (
                      <>
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                          className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                        />
                        Evaluating...
                      </>
                    ) : (
                      <>
                        <CheckCircle2 size={18} />
                        Submit Answer
                      </>
                    )}
                  </button>
                </div>
              </motion.div>
            ) : (
              /* Feedback card */
              <motion.div
                key={`feedback-${currentIndex}`}
                variants={cardVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={{ duration: 0.3 }}
                className="glass-card p-6 sm:p-8"
              >
                {/* Score */}
                <div className="flex flex-col sm:flex-row items-center gap-6 mb-6">
                  <ProgressRing
                    percentage={(currentEval.score / 10) * 100}
                    size={100}
                    strokeWidth={8}
                  />
                  <div className="text-center sm:text-left">
                    <div className="flex items-center gap-2 justify-center sm:justify-start">
                      <h4 className="text-lg font-semibold text-white">AI Feedback</h4>
                      {(() => {
                        const tier = getPerformanceTier(currentEval.score)
                        return (
                          <span className={`
                            px-2 py-0.5 rounded-full text-xs font-medium
                            ${tier.bg} ${tier.color}
                          `}>
                            {tier.label}
                          </span>
                        )
                      })()}
                    </div>
                    <p className="text-gray-400 text-sm mt-1">{currentEval.feedback}</p>
                  </div>
                </div>

                {/* Strengths */}
                {currentEval.strengths.length > 0 && (
                  <div className="mb-4">
                    <h5 className="text-sm font-medium text-emerald-400 mb-2 flex items-center gap-2">
                      <CheckCircle2 size={16} />
                      Strengths
                    </h5>
                    <ul className="space-y-1">
                      {currentEval.strengths.map((s, i) => (
                        <li key={i} className="text-sm text-gray-400 flex items-center gap-2 ml-6">
                          <div className="w-1 h-1 rounded-full bg-emerald-400" />
                          {s}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Improvements */}
                {currentEval.improvements.length > 0 && (
                  <div className="mb-6">
                    <h5 className="text-sm font-medium text-amber-400 mb-2 flex items-center gap-2">
                      <Lightbulb size={16} />
                      Areas to Improve
                    </h5>
                    <ul className="space-y-1">
                      {currentEval.improvements.map((imp, i) => (
                        <li key={i} className="text-sm text-gray-400 flex items-center gap-2 ml-6">
                          <div className="w-1 h-1 rounded-full bg-amber-400" />
                          {imp}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Next button */}
                <button
                  onClick={nextQuestion}
                  className="w-full glass-button-primary flex items-center justify-center gap-2"
                >
                  {currentIndex < questions.length - 1 ? (
                    <>
                      Next Question
                      <ArrowRight size={18} />
                    </>
                  ) : (
                    <>
                      View Results
                      <Trophy size={18} />
                    </>
                  )}
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      {/* ========== RESULTS STAGE ========== */}
      {stage === 'results' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="max-w-4xl mx-auto space-y-6"
        >
          {/* Overall Score */}
          <div className="glass-card p-8">
            <div className="flex flex-col sm:flex-row items-center gap-8">
              <ProgressRing percentage={(overallScore / 10) * 100} size={160} strokeWidth={12} />
              <div className="text-center sm:text-left flex-1">
                <h3 className="text-2xl font-bold text-white">Interview Complete!</h3>
                <p className="text-gray-400 mt-1">
                  You answered {evaluations.filter((e) => e.answer !== '[Skipped]').length} of {questions.length} questions
                </p>
                {(() => {
                  const tier = getPerformanceTier(overallScore)
                  const Icon = tier.icon
                  return (
                    <div className={`
                      inline-flex items-center gap-2 px-4 py-2 rounded-xl mt-4
                      ${tier.bg} ${tier.color}
                    `}>
                      <Icon size={20} />
                      <span className="font-semibold">{tier.label} Performance</span>
                    </div>
                  )
                })()}
              </div>
            </div>
          </div>

          {/* Category Performance Radar */}
          <div className="glass-card p-6">
            <h4 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Target size={20} className="text-primary" />
              Performance by Category
            </h4>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={categoryScores}>
                  <PolarGrid stroke="rgba(255,255,255,0.1)" />
                  <PolarAngleAxis dataKey="subject" stroke="#94a3b8" fontSize={12} />
                  <PolarRadiusAxis angle={90} domain={[0, 100]} stroke="#64748b" fontSize={10} />
                  <Radar
                    name="Score"
                    dataKey="score"
                    stroke="#4d7dff"
                    fill="#4d7dff"
                    fillOpacity={0.2}
                    strokeWidth={2}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#161922',
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: '12px',
                    }}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Per-question breakdown */}
          <div className="glass-card p-6">
            <h4 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <MessageSquare size={20} className="text-primary" />
              Question Breakdown
            </h4>
            <div className="space-y-3">
              {evaluations.map((evalItem, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-dark-elevated/50 rounded-xl p-4"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs text-gray-500">Q{index + 1}</span>
                        <span className={`
                          px-2 py-0.5 rounded-full text-xs font-medium
                          ${evalItem.score >= 7 ? 'bg-emerald-500/20 text-emerald-400' :
                            evalItem.score >= 4 ? 'bg-amber-500/20 text-amber-400' :
                            'bg-red-500/20 text-red-400'}
                        `}>
                          {evalItem.question?.type?.replace('_', ' ') || 'General'}
                        </span>
                      </div>
                      <p className="text-sm text-gray-300">{evalItem.question?.text}</p>
                    </div>
                    <div className="flex-shrink-0 text-right">
                      <p className={`
                        text-lg font-bold
                        ${evalItem.score >= 7 ? 'text-emerald-400' :
                          evalItem.score >= 4 ? 'text-amber-400' :
                          'text-red-400'}
                      `}>
                        {evalItem.score}/10
                      </p>
                      <p className="text-xs text-gray-500">{formatTime(evalItem.timeSpent)}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex gap-3">
            <button
              onClick={restartInterview}
              className="flex-1 glass-button flex items-center justify-center gap-2"
            >
              <RotateCcw size={18} />
              New Interview
            </button>
          </div>
        </motion.div>
      )}
    </div>
  )
}

export default MockInterview
