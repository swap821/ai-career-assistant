/**
 * AI Career Assistant - JobMatcher Component (Module 4)
 * 
 * Job matching module that ranks resume against job templates.
 * Features ranked job cards with animated match scores, skill tags,
 * and Recharts radar chart comparing resume vs job requirements.
 */

import React, { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Briefcase,
  Search,
  CheckCircle2,
  XCircle,
  ChevronDown,
  ChevronUp,
  Sparkles,
  TrendingUp,
  Filter,
  Award,
  Zap,
  MapPin,
  DollarSign,
  Building2,
  ArrowUpDown,
  AlertCircle,
} from 'lucide-react'
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from 'recharts'
import ProgressRing from '@/components/shared/ProgressRing'
import SkillTag from '@/components/shared/SkillTag'

// Sample job data
const SAMPLE_JOBS = [
  {
    id: 1,
    title: 'Full-Stack Developer',
    company: 'TechCorp India',
    location: 'Bangalore, India',
    salary: '₹8-15 LPA',
    type: 'Full-time',
    experience: '0-2 years',
    matchScore: 85,
    description: 'We are looking for a passionate Full-Stack Developer to join our growing engineering team.',
    requirements: [
      'React', 'Node.js', 'JavaScript', 'TypeScript', 'MongoDB', 'PostgreSQL',
      'Express', 'HTML/CSS', 'Git', 'REST APIs', 'Redux', 'CI/CD',
    ],
    matchedSkills: ['React', 'Node.js', 'JavaScript', 'HTML/CSS', 'Git', 'MongoDB', 'REST APIs', 'Express'],
    missingSkills: ['TypeScript', 'PostgreSQL', 'Redux', 'CI/CD'],
  },
  {
    id: 2,
    title: 'Frontend Developer',
    company: 'StartupXYZ',
    location: 'Remote',
    salary: '₹6-12 LPA',
    type: 'Full-time',
    experience: '0-1 years',
    matchScore: 78,
    description: 'Join our innovative startup as a Frontend Developer and work on cutting-edge web applications.',
    requirements: [
      'React', 'JavaScript', 'TypeScript', 'HTML/CSS', 'Tailwind CSS',
      'Next.js', 'Redux', 'Git', 'Figma', 'Responsive Design',
    ],
    matchedSkills: ['React', 'JavaScript', 'HTML/CSS', 'Git'],
    missingSkills: ['TypeScript', 'Tailwind CSS', 'Next.js', 'Redux', 'Figma', 'Responsive Design'],
  },
  {
    id: 3,
    title: 'Junior Data Scientist',
    company: 'DataViz Labs',
    location: 'Hyderabad, India',
    salary: '₹7-14 LPA',
    type: 'Full-time',
    experience: '0-2 years',
    matchScore: 45,
    description: 'Entry-level Data Scientist position for candidates with strong Python and ML fundamentals.',
    requirements: [
      'Python', 'SQL', 'Pandas', 'NumPy', 'scikit-learn', 'TensorFlow',
      'Matplotlib', 'Statistics', 'Machine Learning', 'Deep Learning', 'Jupyter',
    ],
    matchedSkills: ['Python', 'TensorFlow'],
    missingSkills: ['SQL', 'Pandas', 'NumPy', 'scikit-learn', 'Matplotlib', 'Statistics', 'Machine Learning', 'Deep Learning', 'Jupyter'],
  },
  {
    id: 4,
    title: 'React Developer',
    company: 'ProductFirst',
    location: 'Mumbai, India',
    salary: '₹5-10 LPA',
    type: 'Full-time',
    experience: 'Fresher',
    matchScore: 72,
    description: 'Looking for a React Developer to build intuitive user interfaces for our SaaS product.',
    requirements: [
      'React', 'JavaScript', 'HTML/CSS', 'Redux', 'REST APIs',
      'Git', 'Jest', 'Webpack', 'Responsive Design', 'TypeScript',
    ],
    matchedSkills: ['React', 'JavaScript', 'HTML/CSS', 'REST APIs', 'Git'],
    missingSkills: ['Redux', 'TypeScript', 'Jest', 'Webpack', 'Responsive Design'],
  },
  {
    id: 5,
    title: 'Backend Developer (Node.js)',
    company: 'CloudScale Systems',
    location: 'Pune, India',
    salary: '₹8-16 LPA',
    type: 'Full-time',
    experience: '1-3 years',
    matchScore: 62,
    description: 'Build scalable backend services using Node.js and cloud technologies.',
    requirements: [
      'Node.js', 'Express', 'MongoDB', 'PostgreSQL', 'Redis', 'Docker',
      'AWS', 'Microservices', 'Git', 'CI/CD', 'Linux', 'Kafka',
    ],
    matchedSkills: ['Node.js', 'Express', 'MongoDB', 'Git'],
    missingSkills: ['PostgreSQL', 'Redis', 'Docker', 'AWS', 'Microservices', 'CI/CD', 'Linux', 'Kafka'],
  },
  {
    id: 6,
    title: 'ML Engineer Intern',
    company: 'AI Dynamics',
    location: 'Bangalore, India',
    salary: '₹25-40k/month',
    type: 'Internship',
    experience: 'Fresher',
    matchScore: 55,
    description: 'Internship opportunity to work on real-world ML models and deployment pipelines.',
    requirements: [
      'Python', 'TensorFlow', 'PyTorch', 'Docker', 'Git', 'Flask',
      'SQL', 'Feature Engineering', 'Model Deployment', 'Linux',
    ],
    matchedSkills: ['Python', 'TensorFlow', 'Git'],
    missingSkills: ['PyTorch', 'Docker', 'Flask', 'SQL', 'Feature Engineering', 'Model Deployment', 'Linux'],
  },
]

// Sort options
const SORT_OPTIONS = [
  { id: 'best_match', label: 'Best Match', icon: Award },
  { id: 'most_skills', label: 'Most Skills Matched', icon: CheckCircle2 },
  { id: 'easiest', label: 'Easiest to Qualify', icon: TrendingUp },
]

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
}

/**
 * JobMatcher - Module 4: Job Matching
 * @param {Object} resumeHook - useResume hook instance
 */
const JobMatcher = ({ resumeHook }) => {
  const { resumeData, hasResume, loadSampleResume } = resumeHook

  // State
  const [isMatching, setIsMatching] = useState(false)
  const [results, setResults] = useState(null)
  const [expandedJob, setExpandedJob] = useState(null)
  const [sortBy, setSortBy] = useState('best_match')
  const [filterExpanded, setFilterExpanded] = useState(false)

  // Get resume skills
  const resumeSkills = useMemo(() => {
    if (!resumeData?.skills) return []
    return resumeData.skills.map((s) => (typeof s === 'string' ? s : s.name))
  }, [resumeData])

  /**
   * Find matching jobs
   */
  const findMatches = () => {
    setIsMatching(true)

    // Simulate API call
    setTimeout(() => {
      // Calculate actual match scores based on resume skills
      const scoredJobs = SAMPLE_JOBS.map((job) => {
        const matched = job.requirements.filter((req) =>
          resumeSkills.some((rs) => rs.toLowerCase().includes(req.toLowerCase()) ||
                  req.toLowerCase().includes(rs.toLowerCase()))
        )
        const missing = job.requirements.filter((req) =>
          !resumeSkills.some((rs) => rs.toLowerCase().includes(req.toLowerCase()) ||
                  req.toLowerCase().includes(rs.toLowerCase()))
        )
        const score = job.requirements.length > 0
          ? Math.round((matched.length / job.requirements.length) * 100)
          : 0

        return {
          ...job,
          matchScore: score,
          matchedSkills: matched,
          missingSkills: missing,
          matchedCount: matched.length,
          missingCount: missing.length,
        }
      })

      // Sort based on selected option
      const sorted = sortJobs(scoredJobs, sortBy)
      setResults(sorted)
      setIsMatching(false)
    }, 2000)
  }

  /**
   * Sort jobs based on criteria
   */
  const sortJobs = (jobs, criteria) => {
    const sorted = [...jobs]
    switch (criteria) {
      case 'most_skills':
        return sorted.sort((a, b) => b.matchedCount - a.matchedCount)
      case 'easiest':
        return sorted.sort((a, b) => a.missingCount - b.missingCount)
      case 'best_match':
      default:
        return sorted.sort((a, b) => b.matchScore - a.matchScore)
    }
  }

  /**
   * Re-sort when criteria changes
   */
  const handleSortChange = (criteria) => {
    setSortBy(criteria)
    if (results) {
      setResults(sortJobs(results, criteria))
    }
  }

  /**
   * Toggle job details expansion
   */
  const toggleExpand = (jobId) => {
    setExpandedJob(expandedJob === jobId ? null : jobId)
  }

  /**
   * Get score color
   */
  const getScoreColor = (score) => {
    if (score >= 75) return 'text-emerald-400'
    if (score >= 50) return 'text-amber-400'
    return 'text-red-400'
  }

  /**
   * Get score bg
   */
  const getScoreBg = (score) => {
    if (score >= 75) return 'bg-emerald-500/20 border-emerald-500/30'
    if (score >= 50) return 'bg-amber-500/20 border-amber-500/30'
    return 'bg-red-500/20 border-red-500/30'
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h2 className="text-2xl font-bold gradient-text">Job Matcher</h2>
        <p className="text-gray-500 text-sm mt-1">
          Find jobs that match your skills and experience
        </p>
      </motion.div>

      {/* No resume warning */}
      {!hasResume && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="glass-card p-4 flex items-center gap-3 border-amber-500/20"
        >
          <AlertCircle size={20} className="text-amber-400 flex-shrink-0" />
          <div className="flex-1">
            <p className="text-sm text-gray-300">
              No resume loaded. 
              <button onClick={loadSampleResume} className="text-primary hover:underline ml-1">
                Load sample resume
              </button>
              {' '}to find matching jobs.
            </p>
          </div>
        </motion.div>
      )}

      {/* Search/Action bar */}
      <div className="glass-card p-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={findMatches}
            disabled={!hasResume || isMatching}
            className={`
              flex-1 py-3 px-6 rounded-xl font-semibold flex items-center justify-center gap-2
              transition-all duration-300
              ${hasResume && !isMatching
                ? 'glass-button-primary hover:scale-[1.02]'
                : 'bg-dark-elevated text-gray-500 cursor-not-allowed'
              }
            `}
          >
            {isMatching ? (
              <>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                  className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                />
                Finding Matches...
              </>
            ) : (
              <>
                <Search size={18} />
                Find Matching Jobs
              </>
            )}
          </button>

          {/* Sort dropdown */}
          {results && (
            <div className="relative">
              <button
                onClick={() => setFilterExpanded(!filterExpanded)}
                className="glass-button flex items-center gap-2 h-full"
              >
                <ArrowUpDown size={16} />
                <span className="hidden sm:inline">Sort</span>
                <ChevronDown size={14} className={`transition-transform ${filterExpanded ? 'rotate-180' : ''}`} />
              </button>

              <AnimatePresence>
                {filterExpanded && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute right-0 top-full mt-2 w-56 bg-dark-card border border-dark-border 
                               rounded-xl shadow-xl z-20 overflow-hidden"
                  >
                    {SORT_OPTIONS.map((option) => (
                      <button
                        key={option.id}
                        onClick={() => {
                          handleSortChange(option.id)
                          setFilterExpanded(false)
                        }}
                        className={`
                          w-full flex items-center gap-3 px-4 py-3 text-left transition-colors
                          ${sortBy === option.id ? 'bg-primary/10 text-primary' : 'text-gray-400 hover:bg-white/5'}
                        `}
                      >
                        <option.icon size={16} />
                        <span className="text-sm">{option.label}</span>
                        {sortBy === option.id && <CheckCircle2 size={16} className="ml-auto" />}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>

      {/* Results */}
      <AnimatePresence>
        {results && (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-4"
          >
            {/* Stats bar */}
            <motion.div variants={itemVariants} className="flex flex-wrap gap-3">
              <div className="glass-card px-4 py-2 flex items-center gap-2">
                <Briefcase size={16} className="text-primary" />
                <span className="text-sm text-gray-300">{results.length} jobs found</span>
              </div>
              <div className="glass-card px-4 py-2 flex items-center gap-2">
                <CheckCircle2 size={16} className="text-emerald-400" />
                <span className="text-sm text-gray-300">
                  {results.filter((j) => j.matchScore >= 75).length} strong matches
                </span>
              </div>
            </motion.div>

            {/* Job cards */}
            {results.map((job, index) => (
              <motion.div
                key={job.id}
                variants={itemVariants}
                layout
                className="glass-card overflow-hidden"
              >
                {/* Main card content */}
                <div className="p-5 sm:p-6">
                  <div className="flex flex-col sm:flex-row gap-4">
                    {/* Match score */}
                    <div className="flex-shrink-0 flex flex-col items-center">
                      <ProgressRing
                        percentage={job.matchScore}
                        size={80}
                        strokeWidth={6}
                        showLabel={true}
                      />
                      <span className={`text-xs font-medium mt-2 ${getScoreColor(job.matchScore)}`}>
                        {job.matchScore >= 75 ? 'Great Match' : job.matchScore >= 50 ? 'Good Match' : 'Low Match'}
                      </span>
                    </div>

                    {/* Job info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <h3 className="text-lg font-semibold text-white">{job.title}</h3>
                          <div className="flex flex-wrap items-center gap-3 mt-1 text-sm text-gray-400">
                            <span className="flex items-center gap-1">
                              <Building2 size={14} />
                              {job.company}
                            </span>
                            <span className="flex items-center gap-1">
                              <MapPin size={14} />
                              {job.location}
                            </span>
                            <span className="flex items-center gap-1">
                              <DollarSign size={14} />
                              {job.salary}
                            </span>
                          </div>
                        </div>
                        <span className={`
                          px-2 py-1 rounded-lg text-xs font-medium border flex-shrink-0
                          ${getScoreBg(job.matchScore)}
                        `}>
                          {job.matchedCount}/{job.requirements.length} skills
                        </span>
                      </div>

                      <p className="text-sm text-gray-400 mt-3 line-clamp-2">
                        {job.description}
                      </p>

                      {/* Quick skill preview */}
                      <div className="flex flex-wrap gap-1.5 mt-3">
                        {job.matchedSkills.slice(0, 4).map((skill, i) => (
                          <span
                            key={i}
                            className="px-2 py-0.5 rounded-full text-xs bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                          >
                            {skill}
                          </span>
                        ))}
                        {job.matchedSkills.length > 4 && (
                          <span className="px-2 py-0.5 rounded-full text-xs bg-dark-elevated text-gray-500">
                            +{job.matchedSkills.length - 4} more
                          </span>
                        )}
                      </div>

                      {/* Expand button */}
                      <button
                        onClick={() => toggleExpand(job.id)}
                        className="flex items-center gap-1 mt-3 text-sm text-primary hover:underline"
                      >
                        {expandedJob === job.id ? (
                          <>Less details <ChevronUp size={14} /></>
                        ) : (
                          <>More details <ChevronDown size={14} /></>
                        )}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Expanded details */}
                <AnimatePresence>
                  {expandedJob === job.id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="px-5 sm:px-6 pb-6 border-t border-dark-border pt-4 space-y-4">
                        {/* Full skill breakdown */}
                        <div>
                          <h4 className="text-sm font-medium text-emerald-400 mb-2 flex items-center gap-2">
                            <CheckCircle2 size={16} />
                            Matched Skills ({job.matchedSkills.length})
                          </h4>
                          <div className="flex flex-wrap gap-2">
                            {job.matchedSkills.map((skill, i) => (
                              <SkillTag key={i} name={skill} variant="matched" size="sm" index={i} />
                            ))}
                          </div>
                        </div>

                        <div>
                          <h4 className="text-sm font-medium text-red-400 mb-2 flex items-center gap-2">
                            <XCircle size={16} />
                            Missing Skills ({job.missingSkills.length})
                          </h4>
                          <div className="flex flex-wrap gap-2">
                            {job.missingSkills.map((skill, i) => (
                              <SkillTag key={i} name={skill} variant="missing" size="sm" index={i} />
                            ))}
                          </div>
                        </div>

                        {/* Radar chart comparison */}
                        <div className="h-64 mt-4">
                          <ResponsiveContainer width="100%" height="100%">
                            <RadarChart
                              data={[
                                { subject: 'Frontend', resume: 80, job: job.requirements.some((r) =>
                                  ['React', 'HTML', 'CSS', 'Angular'].some((f) => r.includes(f))
                                ) ? 70 : 20 },
                                { subject: 'Backend', resume: 65, job: job.requirements.some((r) =>
                                  ['Node', 'Python', 'Java'].some((f) => r.includes(f))
                                ) ? 80 : 30 },
                                { subject: 'Database', resume: 50, job: job.requirements.some((r) =>
                                  ['SQL', 'MongoDB'].some((f) => r.includes(f))
                                ) ? 75 : 25 },
                                { subject: 'DevOps', resume: 30, job: job.requirements.some((r) =>
                                  ['Docker', 'AWS', 'CI/CD'].some((f) => r.includes(f))
                                ) ? 70 : 20 },
                                { subject: 'ML/Data', resume: 40, job: job.requirements.some((r) =>
                                  ['TensorFlow', 'ML', 'Pandas'].some((f) => r.includes(f))
                                ) ? 80 : 20 },
                              ]}
                            >
                              <PolarGrid stroke="rgba(255,255,255,0.05)" />
                              <PolarAngleAxis dataKey="subject" stroke="#94a3b8" fontSize={11} />
                              <PolarRadiusAxis angle={90} domain={[0, 100]} stroke="#64748b" fontSize={10} />
                              <Radar
                                name="Your Skills"
                                dataKey="resume"
                                stroke="#4d7dff"
                                fill="#4d7dff"
                                fillOpacity={0.15}
                                strokeWidth={2}
                              />
                              <Radar
                                name="Job Requirements"
                                dataKey="job"
                                stroke="#10b981"
                                fill="#10b981"
                                fillOpacity={0.1}
                                strokeWidth={2}
                              />
                              <Tooltip
                                contentStyle={{
                                  backgroundColor: '#161922',
                                  border: '1px solid rgba(255,255,255,0.1)',
                                  borderRadius: '12px',
                                  fontSize: '12px',
                                }}
                              />
                            </RadarChart>
                          </ResponsiveContainer>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}

            {/* Top matches summary chart */}
            <motion.div variants={itemVariants} className="glass-card p-6">
              <h4 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <TrendingUp size={20} className="text-primary" />
                Match Score Comparison
              </h4>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={results.slice(0, 6)} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                    <XAxis type="number" domain={[0, 100]} tickFormatter={(v) => `${v}%`}
                           stroke="#64748b" fontSize={12} />
                    <YAxis dataKey="title" type="category" stroke="#94a3b8" fontSize={11} width={120} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#161922',
                        border: '1px solid rgba(255,255,255,0.1)',
                        borderRadius: '12px',
                        fontSize: '12px',
                      }}
                      formatter={(value) => [`${value}%`, 'Match']}
                    />
                    <Bar dataKey="matchScore" radius={[0, 4, 4, 0]} barSize={20}>
                      {results.slice(0, 6).map((entry, index) => (
                        <Cell
                          key={index}
                          fill={entry.matchScore >= 75 ? '#10b981' : entry.matchScore >= 50 ? '#f59e0b' : '#ef4444'}
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default JobMatcher
