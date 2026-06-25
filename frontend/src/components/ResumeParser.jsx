/**
 * AI Career Assistant - ResumeParser Component (Module 1)
 * 
 * Resume upload and parsing module with drag-and-drop support,
 * file validation, progress tracking, and beautiful result display.
 * Features animated section reveals and export functionality.
 */

import React, { useState, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Upload,
  FileText,
  X,
  CheckCircle2,
  AlertCircle,
  Download,
  Sparkles,
  User,
  Mail,
  Phone,
  MapPin,
  GraduationCap,
  Briefcase,
  FolderGit2,
  Award,
  FileSpreadsheet,
  Zap,
} from 'lucide-react'
import SkillTag from '@/components/shared/SkillTag'

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
}

/**
 * ResumeParser - Module 1: Resume Upload & Parse
 * @param {Object} resumeHook - useResume hook instance
 */
const ResumeParser = ({ resumeHook }) => {
  const {
    resumeData,
    isLoading,
    uploadProgress,
    error,
    hasResume,
    uploadResume,
    loadSampleResume,
    clearResume,
    exportAsJSON,
  } = resumeHook

  // Drag state
  const [isDragActive, setIsDragActive] = useState(false)
  const [fileError, setFileError] = useState(null)
  const fileInputRef = useRef(null)

  // Accepted file types
  const ACCEPTED_TYPES = ['.pdf', '.docx', '.doc']
  const MAX_SIZE_MB = 10

  /**
   * Validate file before upload
   */
  const validateFile = (file) => {
    setFileError(null)

    // Check file extension
    const ext = '.' + file.name.split('.').pop().toLowerCase()
    if (!ACCEPTED_TYPES.includes(ext)) {
      setFileError(`Invalid file type. Accepted: ${ACCEPTED_TYPES.join(', ')}`)
      return false
    }

    // Check file size
    if (file.size > MAX_SIZE_MB * 1024 * 1024) {
      setFileError(`File too large. Maximum size: ${MAX_SIZE_MB}MB`)
      return false
    }

    return true
  }

  /**
   * Handle file drop
   */
  const handleDrop = useCallback((e) => {
    e.preventDefault()
    setIsDragActive(false)

    const file = e.dataTransfer.files[0]
    if (file && validateFile(file)) {
      uploadResume(file)
    }
  }, [uploadResume])

  /**
   * Handle file input change
   */
  const handleFileChange = useCallback((e) => {
    const file = e.target.files[0]
    if (file && validateFile(file)) {
      uploadResume(file)
    }
  }, [uploadResume])

  /**
   * Handle drag events
   */
  const handleDragOver = (e) => {
    e.preventDefault()
    setIsDragActive(true)
  }

  const handleDragLeave = () => {
    setIsDragActive(false)
  }

  /**
   * Trigger file input click
   */
  const handleBrowseClick = () => {
    fileInputRef.current?.click()
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h2 className="text-2xl font-bold gradient-text">Resume Parser</h2>
          <p className="text-gray-500 text-sm mt-1">
            Upload your resume to extract skills, experience, and more
          </p>
        </div>
        {hasResume && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            onClick={clearResume}
            className="p-2 rounded-lg hover:bg-red-500/10 text-red-400 transition-colors"
            title="Clear resume"
          >
            <X size={20} />
          </motion.button>
        )}
      </motion.div>

      {/* Upload Area - shown when no resume loaded */}
      <AnimatePresence mode="wait">
        {!hasResume ? (
          <motion.div
            key="upload"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, y: -20 }}
          >
            {/* Drag & Drop Zone */}
            <div
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onClick={handleBrowseClick}
              className={`
                relative border-2 border-dashed rounded-2xl p-8 sm:p-12
                flex flex-col items-center justify-center gap-4 cursor-pointer
                transition-all duration-300 min-h-[280px]
                ${isDragActive 
                  ? 'border-primary bg-primary/5 shadow-glow-primary' 
                  : 'border-dark-border hover:border-primary/50 hover:bg-white/[0.02]'
                }
              `}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.docx,.doc"
                onChange={handleFileChange}
                className="hidden"
              />

              {/* Upload icon with animation */}
              <motion.div
                animate={isDragActive ? { y: -5, scale: 1.1 } : { y: 0, scale: 1 }}
                className={`
                  w-16 h-16 rounded-2xl flex items-center justify-center
                  ${isDragActive ? 'bg-primary/20' : 'bg-white/5'}
                  transition-colors duration-300
                `}
              >
                <Upload 
                  size={28} 
                  className={isDragActive ? 'text-primary' : 'text-gray-500'} 
                />
              </motion.div>

              <div className="text-center">
                <p className="text-lg font-medium text-white">
                  {isDragActive ? 'Drop your resume here' : 'Drag & drop your resume'}
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  or <span className="text-primary hover:underline">browse files</span>
                </p>
              </div>

              <div className="flex items-center gap-2 text-xs text-gray-600">
                <FileText size={14} />
                <span>PDF, DOCX up to {MAX_SIZE_MB}MB</span>
              </div>

              {/* File error */}
              <AnimatePresence>
                {fileError && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-500/10 text-red-400 text-sm"
                  >
                    <AlertCircle size={16} />
                    {fileError}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Sample resume buttons */}
            <div className="mt-6 flex flex-col sm:flex-row items-center gap-3 justify-center">
              <span className="text-sm text-gray-500">Or try with:</span>
              <div className="flex gap-2">
                <button
                  onClick={loadSampleResume}
                  className="glass-button flex items-center gap-2 text-sm"
                >
                  <Zap size={16} />
                  Sample Resume
                </button>
                <button
                  onClick={() => alert('Demo video coming soon!')}
                  className="px-4 py-2 rounded-xl text-sm text-gray-400 hover:text-white 
                             hover:bg-white/5 transition-all flex items-center gap-2"
                >
                  <Sparkles size={16} />
                  Watch Demo
                </button>
              </div>
            </div>
          </motion.div>
        ) : (
          /* Parsed Resume Display */
          <motion.div
            key="parsed"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-4"
          >
            {/* Top action bar */}
            <motion.div variants={itemVariants} className="flex justify-end">
              <button
                onClick={exportAsJSON}
                className="glass-button flex items-center gap-2 text-sm"
              >
                <Download size={16} />
                Export JSON
              </button>
            </motion.div>

            {/* Personal Info Card */}
            <motion.div variants={itemVariants} className="glass-card p-6">
              <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/30 to-accent-purple/30 
                                flex items-center justify-center flex-shrink-0">
                  <User size={32} className="text-primary-light" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-white">{resumeData.name}</h3>
                  <div className="flex flex-wrap gap-3 mt-2 text-sm text-gray-400">
                    {resumeData.email && (
                      <span className="flex items-center gap-1.5">
                        <Mail size={14} className="text-primary" />
                        {resumeData.email}
                      </span>
                    )}
                    {resumeData.phone && (
                      <span className="flex items-center gap-1.5">
                        <Phone size={14} className="text-primary" />
                        {resumeData.phone}
                      </span>
                    )}
                    {resumeData.location && (
                      <span className="flex items-center gap-1.5">
                        <MapPin size={14} className="text-primary" />
                        {resumeData.location}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Skills Section */}
            {resumeData.skills && resumeData.skills.length > 0 && (
              <motion.div variants={itemVariants} className="glass-card p-6">
                <h4 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <Zap size={20} className="text-primary" />
                  Skills ({resumeData.skills.length})
                </h4>
                <div className="flex flex-wrap gap-2">
                  {resumeData.skills.map((skill, index) => (
                    <SkillTag
                      key={index}
                      name={skill.name || skill}
                      category={skill.category || 'default'}
                      variant="neutral"
                      size="md"
                      index={index}
                    />
                  ))}
                </div>
              </motion.div>
            )}

            {/* Experience Timeline */}
            {resumeData.experience && resumeData.experience.length > 0 && (
              <motion.div variants={itemVariants} className="glass-card p-6">
                <h4 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <Briefcase size={20} className="text-primary" />
                  Experience
                </h4>
                <div className="relative space-y-6">
                  {/* Timeline line */}
                  <div className="absolute left-[19px] top-2 bottom-2 w-0.5 bg-gradient-to-b from-primary/50 to-transparent" />

                  {resumeData.experience.map((exp, index) => (
                    <motion.div
                      key={exp.id || index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="relative pl-12"
                    >
                      {/* Timeline dot */}
                      <div className="absolute left-2 top-1.5 w-5 h-5 rounded-full border-2 border-primary 
                                      bg-dark-card flex items-center justify-center">
                        <div className="w-2 h-2 rounded-full bg-primary" />
                      </div>

                      <div className="bg-dark-elevated/50 rounded-xl p-4">
                        <h5 className="font-semibold text-white">{exp.title}</h5>
                        <p className="text-primary text-sm">{exp.company}</p>
                        <p className="text-gray-500 text-xs mt-1">{exp.duration}</p>
                        <p className="text-gray-400 text-sm mt-2">{exp.description}</p>
                        {exp.skills && (
                          <div className="flex flex-wrap gap-1.5 mt-3">
                            {exp.skills.map((s, i) => (
                              <span 
                                key={i} 
                                className="px-2 py-0.5 rounded-full text-xs bg-primary/10 text-primary"
                              >
                                {s}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Education Cards */}
            {resumeData.education && resumeData.education.length > 0 && (
              <motion.div variants={itemVariants} className="glass-card p-6">
                <h4 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <GraduationCap size={20} className="text-primary" />
                  Education
                </h4>
                <div className="grid gap-3 sm:grid-cols-2">
                  {resumeData.education.map((edu, index) => (
                    <motion.div
                      key={edu.id || index}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.1 }}
                      className="bg-dark-elevated/50 rounded-xl p-4 hover:bg-dark-elevated transition-colors"
                    >
                      <h5 className="font-semibold text-white text-sm">{edu.degree}</h5>
                      <p className="text-primary text-sm mt-1">{edu.institution}</p>
                      <p className="text-gray-500 text-xs mt-1">{edu.duration}</p>
                      {(edu.cgpa || edu.percentage) && (
                        <div className="mt-2 inline-flex items-center gap-1 px-2 py-0.5 rounded-full 
                                        bg-emerald-500/10 text-emerald-400 text-xs">
                          <CheckCircle2 size={12} />
                          {edu.cgpa || edu.percentage}
                        </div>
                      )}
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Projects Section */}
            {resumeData.projects && resumeData.projects.length > 0 && (
              <motion.div variants={itemVariants} className="glass-card p-6">
                <h4 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <FolderGit2 size={20} className="text-primary" />
                  Projects
                </h4>
                <div className="space-y-3">
                  {resumeData.projects.map((project, index) => (
                    <motion.div
                      key={project.id || index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.08 }}
                      className="bg-dark-elevated/50 rounded-xl p-4 hover:bg-dark-elevated transition-colors"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <h5 className="font-semibold text-white">{project.name}</h5>
                          <p className="text-gray-400 text-sm mt-1">{project.description}</p>
                          {project.tech && (
                            <div className="flex flex-wrap gap-1.5 mt-3">
                              {project.tech.map((t, i) => (
                                <span 
                                  key={i} 
                                  className="px-2 py-0.5 rounded text-xs bg-dark-bg text-gray-400 border border-dark-border"
                                >
                                  {t}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                        {project.link && (
                          <a
                            href={project.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 rounded-lg hover:bg-white/5 text-gray-500 hover:text-primary transition-colors"
                          >
                            <FileSpreadsheet size={18} />
                          </a>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Certifications */}
            {resumeData.certifications && resumeData.certifications.length > 0 && (
              <motion.div variants={itemVariants} className="glass-card p-6">
                <h4 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <Award size={20} className="text-primary" />
                  Certifications
                </h4>
                <div className="flex flex-wrap gap-2">
                  {resumeData.certifications.map((cert, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.05 }}
                      className="flex items-center gap-2 px-3 py-2 rounded-xl bg-dark-elevated/50 
                                 border border-dark-border hover:border-primary/30 transition-colors"
                    >
                      <Award size={16} className="text-amber-400" />
                      <div>
                        <p className="text-sm text-white font-medium">{cert.name}</p>
                        <p className="text-xs text-gray-500">{cert.issuer} • {cert.year}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Upload progress overlay */}
      <AnimatePresence>
        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-dark-card border border-dark-border rounded-2xl p-8 max-w-sm w-full mx-4"
            >
              <div className="text-center">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                  className="w-12 h-12 rounded-full border-3 border-primary border-t-transparent mx-auto"
                />
                <h3 className="text-lg font-semibold text-white mt-4">Parsing Resume</h3>
                <p className="text-sm text-gray-500 mt-1">Extracting skills, experience, and more...</p>

                {/* Progress bar */}
                <div className="mt-4">
                  <div className="h-2 bg-dark-elevated rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-gradient-to-r from-primary to-accent-cyan rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${uploadProgress}%` }}
                      transition={{ duration: 0.3 }}
                    />
                  </div>
                  <p className="text-sm text-gray-500 mt-2">{uploadProgress}%</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Error toast */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50"
          >
            <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400">
              <AlertCircle size={18} />
              <span className="text-sm">{error}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default ResumeParser
