/**
 * AI Career Assistant - SkillAnalyzer Component (Module 2)
 * 
 * Skill gap analysis module with two-column layout.
 * Compares resume skills against job descriptions with animated
 * circular progress, matched/missing skill tags, and Recharts bar chart.
 */

import React, { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  BarChart3,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Sparkles,
  Briefcase,
  Code2,
  Database,
  Cloud,
  Brain,
  Layout,
  Server,
} from 'lucide-react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts'
import SkillTag from '@/components/shared/SkillTag'
import ProgressRing from '@/components/shared/ProgressRing'

// Pre-loaded job templates
const JOB_TEMPLATES = [
  {
    id: 'fullstack',
    title: 'Full-Stack Developer',
    icon: Layout,
    skills: [
      'React', 'Node.js', 'JavaScript', 'TypeScript', 'MongoDB', 'PostgreSQL',
      'Express', 'HTML/CSS', 'Git', 'Docker', 'AWS', 'REST APIs', 'GraphQL',
      'Redux', 'Jest', 'CI/CD', 'Linux', 'Nginx',
    ],
  },
  {
    id: 'datascience',
    title: 'Data Scientist',
    icon: Brain,
    skills: [
      'Python', 'R', 'SQL', 'Pandas', 'NumPy', 'scikit-learn', 'TensorFlow',
      'PyTorch', 'Matplotlib', 'Seaborn', 'Jupyter', 'Statistics', 'Machine Learning',
      'Deep Learning', 'NLP', 'Data Visualization', 'Big Data', 'Spark',
    ],
  },
  {
    id: 'mlengineer',
    title: 'ML Engineer',
    icon: Server,
    skills: [
      'Python', 'TensorFlow', 'PyTorch', 'Docker', 'Kubernetes', 'AWS',
      'MLflow', 'SQL', 'Spark', 'Kafka', 'CI/CD', 'Git', 'Linux',
      'REST APIs', 'Flask', 'FastAPI', 'Feature Engineering', 'Model Deployment',
    ],
  },
  {
    id: 'frontend',
    title: 'Frontend Developer',
    icon: Code2,
    skills: [
      'React', 'JavaScript', 'TypeScript', 'HTML/CSS', 'Tailwind CSS', 'Next.js',
      'Redux', 'Webpack', 'Git', 'Jest', 'Testing Library', 'Figma',
      'Responsive Design', 'Accessibility', 'GraphQL', 'REST APIs', 'Vite', 'Sass',
    ],
  },
  {
    id: 'backend',
    title: 'Backend Developer',
    icon: Database,
    skills: [
      'Node.js', 'Python', 'Java', 'SQL', 'PostgreSQL', 'MongoDB', 'Redis',
      'Docker', 'Kubernetes', 'AWS', 'Microservices', 'GraphQL', 'REST APIs',
      'Kafka', 'Elasticsearch', 'Git', 'Linux', 'CI/CD', 'Nginx',
    ],
  },
]

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.06 } },
}

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: { opacity: 1, y: 0 },
}

/**
 * SkillAnalyzer - Module 2: Skill Gap Analysis
 * @param {Object} resumeHook - useResume hook instance
 */
const SkillAnalyzer = ({ resumeHook }) => {
  const { resumeData, hasResume, loadSampleResume } = resumeHook

  // State
  const [selectedTemplate, setSelectedTemplate] = useState('')
  const [jobDescription, setJobDescription] = useState('')
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [results, setResults] = useState(null)

  // Get selected template skills
  const templateSkills = useMemo(() => {
    const template = JOB_TEMPLATES.find((t) => t.id === selectedTemplate)
    return template ? template.skills : []
  }, [selectedTemplate])

  // Get resume skills as flat array of strings
  const resumeSkills = useMemo(() => {
    if (!resumeData?.skills) return []
    return resumeData.skills.map((s) => (typeof s === 'string' ? s : s.name))
  }, [resumeData])

  /**
   * Analyze skill gaps
   */
  const analyzeGaps = () => {
    if (!hasResume) return

    setIsAnalyzing(true)

    // Get target skills from template or parse from job description
    const targetSkills = templateSkills.length > 0
      ? templateSkills
      : jobDescription.split(/[,\.\n]/).map((s) => s.trim()).filter(Boolean)

    // Simulate API call with setTimeout
    setTimeout(() => {
      const matched = []
      const missing = []

      targetSkills.forEach((skill) => {
        const isMatch = resumeSkills.some(
          (rs) => rs.toLowerCase().includes(skill.toLowerCase()) ||
                  skill.toLowerCase().includes(rs.toLowerCase())
        )
        if (isMatch) {
          matched.push(skill)
        } else {
          missing.push(skill)
        }
      })

      // Calculate match percentage
      const matchPercent = targetSkills.length > 0
        ? Math.round((matched.length / targetSkills.length) * 100)
        : 0

      // Categorize skills for chart
      const categoryData = [
        { name: 'Frontend', matched: matched.filter((s) =>
          ['React', 'Angular', 'Vue', 'HTML', 'CSS', 'JavaScript', 'TypeScript', 'Next.js', 'Tailwind'].some(
            (f) => s.toLowerCase().includes(f.toLowerCase())
          )
        ).length, total: targetSkills.filter((s) =>
          ['React', 'Angular', 'Vue', 'HTML', 'CSS', 'JavaScript', 'TypeScript', 'Next.js', 'Tailwind'].some(
            (f) => s.toLowerCase().includes(f.toLowerCase())
          )
        ).length },
        { name: 'Backend', matched: matched.filter((s) =>
          ['Node.js', 'Python', 'Java', 'Express', 'Django', 'Flask', 'Spring'].some(
            (f) => s.toLowerCase().includes(f.toLowerCase())
          )
        ).length, total: targetSkills.filter((s) =>
          ['Node.js', 'Python', 'Java', 'Express', 'Django', 'Flask', 'Spring'].some(
            (f) => s.toLowerCase().includes(f.toLowerCase())
          )
        ).length },
        { name: 'Database', matched: matched.filter((s) =>
          ['SQL', 'MongoDB', 'PostgreSQL', 'Redis', 'MySQL', 'Database'].some(
            (f) => s.toLowerCase().includes(f.toLowerCase())
          )
        ).length, total: targetSkills.filter((s) =>
          ['SQL', 'MongoDB', 'PostgreSQL', 'Redis', 'MySQL', 'Database'].some(
            (f) => s.toLowerCase().includes(f.toLowerCase())
          )
        ).length },
        { name: 'DevOps', matched: matched.filter((s) =>
          ['Docker', 'Kubernetes', 'AWS', 'CI/CD', 'Linux', 'Git', 'Jenkins'].some(
            (f) => s.toLowerCase().includes(f.toLowerCase())
          )
        ).length, total: targetSkills.filter((s) =>
          ['Docker', 'Kubernetes', 'AWS', 'CI/CD', 'Linux', 'Git', 'Jenkins'].some(
            (f) => s.toLowerCase().includes(f.toLowerCase())
          )
        ).length },
        { name: 'ML/Data', matched: matched.filter((s) =>
          ['Python', 'TensorFlow', 'PyTorch', 'Pandas', 'Machine Learning', 'Deep Learning', 'NLP'].some(
            (f) => s.toLowerCase().includes(f.toLowerCase())
          )
        ).length, total: targetSkills.filter((s) =>
          ['Python', 'TensorFlow', 'PyTorch', 'Pandas', 'Machine Learning', 'Deep Learning', 'NLP'].some(
            (f) => s.toLowerCase().includes(f.toLowerCase())
          )
        ).length },
      ].map((c) => ({
        ...c,
        missing: c.total - c.matched,
        percent: c.total > 0 ? Math.round((c.matched / c.total) * 100) : 0,
      }))

      setResults({
        matchPercent,
        matched,
        missing,
        total: targetSkills.length,
        categoryData,
        recommendations: missing.slice(0, 5).map((skill) => ({
          skill,
          resources: [
            `Official ${skill} documentation`,
            `${skill} tutorial on freeCodeCamp`,
            `Build a project with ${skill}`,
          ],
        })),
      })

      setIsAnalyzing(false)
    }, 1500)
  }

  // Check if analysis can be run
  const canAnalyze = hasResume && (selectedTemplate || jobDescription.trim().length > 10)

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h2 className="text-2xl font-bold gradient-text">Skill Gap Analyzer</h2>
        <p className="text-gray-500 text-sm mt-1">
          Compare your skills against job requirements and identify gaps
        </p>
      </motion.div>

      {/* No resume warning */}
      {!hasResume && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="glass-card p-4 flex items-center gap-3 border-amber-500/20"
        >
          <AlertTriangle size={20} className="text-amber-400 flex-shrink-0" />
          <div className="flex-1">
            <p className="text-sm text-gray-300">
              No resume loaded. 
              <button 
                onClick={loadSampleResume} 
                className="text-primary hover:underline ml-1"
              >
                Load sample resume
              </button>
              {' '}or upload your resume first.
            </p>
          </div>
        </motion.div>
      )}

      {/* Two Column Layout */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* LEFT: Resume Skills */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-4"
        >
          <div className="glass-card p-6">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Briefcase size={20} className="text-primary" />
              Your Skills
              {resumeSkills.length > 0 && (
                <span className="text-sm text-gray-500 font-normal">
                  ({resumeSkills.length})
                </span>
              )}
            </h3>

            {resumeSkills.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {resumeSkills.map((skill, index) => {
                  const isMatched = results?.matched.some(
                    (m) => m.toLowerCase() === skill.toLowerCase()
                  )
                  return (
                    <SkillTag
                      key={index}
                      name={skill}
                      variant={results ? (isMatched ? 'matched' : 'neutral') : 'neutral'}
                      size="md"
                      index={index}
                    />
                  )
                })}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Code2 size={32} className="mx-auto mb-2 opacity-50" />
                <p className="text-sm">No skills found in resume</p>
              </div>
            )}
          </div>

          {/* Quick stats */}
          {results && (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-3 gap-3"
            >
              <motion.div variants={itemVariants} className="glass-card p-4 text-center">
                <p className="text-2xl font-bold text-emerald-400">{results.matched.length}</p>
                <p className="text-xs text-gray-500 mt-1">Matched</p>
              </motion.div>
              <motion.div variants={itemVariants} className="glass-card p-4 text-center">
                <p className="text-2xl font-bold text-red-400">{results.missing.length}</p>
                <p className="text-xs text-gray-500 mt-1">Missing</p>
              </motion.div>
              <motion.div variants={itemVariants} className="glass-card p-4 text-center">
                <p className="text-2xl font-bold text-primary">{results.total}</p>
                <p className="text-xs text-gray-500 mt-1">Total</p>
              </motion.div>
            </motion.div>
          )}
        </motion.div>

        {/* RIGHT: Job Description Input */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-4"
        >
          <div className="glass-card p-6">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <BarChart3 size={20} className="text-primary" />
              Job Requirements
            </h3>

            {/* Template selector */}
            <div className="mb-4">
              <label className="text-sm text-gray-400 mb-2 block">Select Job Template</label>
              <select
                value={selectedTemplate}
                onChange={(e) => {
                  setSelectedTemplate(e.target.value)
                  setJobDescription('')
                }}
                className="glass-input"
              >
                <option value="">-- Select a template --</option>
                {JOB_TEMPLATES.map((template) => (
                  <option key={template.id} value={template.id}>
                    {template.title}
                  </option>
                ))}
              </select>
            </div>

            {/* Or divider */}
            <div className="flex items-center gap-3 my-4">
              <div className="flex-1 h-px bg-dark-border" />
              <span className="text-xs text-gray-500">OR</span>
              <div className="flex-1 h-px bg-dark-border" />
            </div>

            {/* Job description textarea */}
            <div className="mb-4">
              <label className="text-sm text-gray-400 mb-2 block">Paste Job Description</label>
              <textarea
                value={jobDescription}
                onChange={(e) => {
                  setJobDescription(e.target.value)
                  setSelectedTemplate('')
                }}
                placeholder="Paste the job description here to analyze skill gaps..."
                rows={6}
                className="glass-input resize-none"
              />
            </div>

            {/* Analyze button */}
            <button
              onClick={analyzeGaps}
              disabled={!canAnalyze || isAnalyzing}
              className={`
                w-full py-3 rounded-xl font-semibold flex items-center justify-center gap-2
                transition-all duration-300
                ${canAnalyze && !isAnalyzing
                  ? 'glass-button-primary hover:scale-[1.02]'
                  : 'bg-dark-elevated text-gray-500 cursor-not-allowed'
                }
              `}
            >
              {isAnalyzing ? (
                <>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                  />
                  Analyzing...
                </>
              ) : (
                <>
                  <Sparkles size={18} />
                  Analyze Gap
                </>
              )}
            </button>
          </div>

          {/* Selected template preview */}
          <AnimatePresence>
            {selectedTemplate && templateSkills.length > 0 && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="glass-card p-4 overflow-hidden"
              >
                <p className="text-sm text-gray-400 mb-2">Required Skills:</p>
                <div className="flex flex-wrap gap-1.5">
                  {templateSkills.map((skill, i) => (
                    <span 
                      key={i} 
                      className="px-2 py-0.5 rounded-full text-xs bg-dark-elevated text-gray-400 border border-dark-border"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Results Section */}
      <AnimatePresence>
        {results && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="space-y-6"
          >
            {/* Match Score */}
            <div className="glass-card p-8">
              <div className="flex flex-col sm:flex-row items-center gap-8">
                <ProgressRing
                  percentage={results.matchPercent}
                  size={140}
                  strokeWidth={10}
                />
                <div className="flex-1 text-center sm:text-left">
                  <h3 className="text-xl font-bold text-white">Match Score</h3>
                  <p className="text-gray-400 text-sm mt-1">
                    {results.matchPercent >= 75
                      ? 'Excellent match! You have most of the required skills.'
                      : results.matchPercent >= 50
                      ? 'Good match. Consider upskilling in the missing areas.'
                      : 'Significant gaps detected. Focus on building the missing skills.'}
                  </p>
                  <div className="flex flex-wrap gap-4 mt-4 justify-center sm:justify-start">
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle2 size={16} className="text-emerald-400" />
                      <span className="text-emerald-400">{results.matched.length} matched</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <XCircle size={16} className="text-red-400" />
                      <span className="text-red-400">{results.missing.length} missing</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Skills breakdown */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* Matched Skills */}
              <motion.div
                variants={itemVariants}
                initial="hidden"
                animate="visible"
                className="glass-card p-6"
              >
                <h4 className="text-lg font-semibold text-emerald-400 mb-4 flex items-center gap-2">
                  <CheckCircle2 size={20} />
                  Matched Skills ({results.matched.length})
                </h4>
                <div className="flex flex-wrap gap-2">
                  {results.matched.map((skill, index) => (
                    <SkillTag
                      key={index}
                      name={skill}
                      variant="matched"
                      size="md"
                      index={index}
                    />
                  ))}
                </div>
              </motion.div>

              {/* Missing Skills */}
              <motion.div
                variants={itemVariants}
                initial="hidden"
                animate="visible"
                transition={{ delay: 0.1 }}
                className="glass-card p-6"
              >
                <h4 className="text-lg font-semibold text-red-400 mb-4 flex items-center gap-2">
                  <XCircle size={20} />
                  Missing Skills ({results.missing.length})
                </h4>
                <div className="flex flex-wrap gap-2">
                  {results.missing.map((skill, index) => (
                    <SkillTag
                      key={index}
                      name={skill}
                      variant="missing"
                      size="md"
                      index={index}
                    />
                  ))}
                </div>
              </motion.div>
            </div>

            {/* Skill Category Chart */}
            <motion.div
              variants={itemVariants}
              initial="hidden"
              animate="visible"
              className="glass-card p-6"
            >
              <h4 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <BarChart3 size={20} className="text-primary" />
                Skills by Category
              </h4>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={results.categoryData} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                    <XAxis type="number" domain={[0, 100]} tickFormatter={(v) => `${v}%`} 
                           stroke="#64748b" fontSize={12} />
                    <YAxis dataKey="name" type="category" stroke="#94a3b8" fontSize={12} width={80} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#161922',
                        border: '1px solid rgba(255,255,255,0.1)',
                        borderRadius: '12px',
                        fontSize: '12px',
                      }}
                      formatter={(value) => [`${value}%`, 'Match']}
                    />
                    <Bar dataKey="percent" radius={[0, 4, 4, 0]} barSize={20}>
                      {results.categoryData.map((entry, index) => (
                        <Cell 
                          key={index} 
                          fill={entry.percent >= 75 ? '#10b981' : entry.percent >= 50 ? '#f59e0b' : '#ef4444'}
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </motion.div>

            {/* Recommendations */}
            {results.recommendations.length > 0 && (
              <motion.div
                variants={itemVariants}
                initial="hidden"
                animate="visible"
                className="glass-card p-6"
              >
                <h4 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <Sparkles size={20} className="text-amber-400" />
                  Improvement Recommendations
                </h4>
                <div className="space-y-3">
                  {results.recommendations.map((rec, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="bg-dark-elevated/50 rounded-xl p-4"
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <AlertTriangle size={16} className="text-amber-400" />
                        <span className="font-medium text-white">Learn {rec.skill}</span>
                      </div>
                      <ul className="space-y-1 ml-6">
                        {rec.resources.map((resource, i) => (
                          <li key={i} className="text-sm text-gray-400 flex items-center gap-2">
                            <div className="w-1 h-1 rounded-full bg-primary" />
                            {resource}
                          </li>
                        ))}
                      </ul>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default SkillAnalyzer
