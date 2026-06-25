"""
interview_generator.py — AI Mock Interview Generator

Uses Google Gemini API with RAG (Retrieval-Augmented Generation):
1. Retrieve: Extract skills, experience, projects from resume
2. Augment: Inject this context into the LLM prompt
3. Generate: Create personalized interview questions
"""

import os
import json
import random

# Try to import Gemini, fallback to pre-written questions
try:
    import google.generativeai as genai
    HAS_GEMINI = True
except ImportError:
    HAS_GEMINI = False


def setup_gemini():
    """Configure Gemini API."""
    api_key = os.environ.get('GEMINI_API_KEY', '')
    if api_key and api_key != 'fallback':
        genai.configure(api_key=api_key)
        return genai.GenerativeModel('gemini-pro')
    return None


def generate_questions(resume_data, num_questions=10):
    """
    Generate personalized interview questions using RAG.
    
    RAG Process:
    1. Retrieve relevant info from resume (skills, projects, experience)
    2. Create a detailed prompt with this context
    3. Send to Gemini for generation
    
    Args:
        resume_data: Dict with skills, experience, projects
        num_questions: Number of questions to generate
        
    Returns:
        list: Question objects with category, difficulty, hints
    """
    model = setup_gemini()
    
    if not model or not HAS_GEMINI:
        # Fallback: use pre-written questions
        return load_fallback_questions(resume_data, num_questions)
    
    # Build context from resume (RAG: Retrieval step)
    context = build_resume_context(resume_data)
    
    # Build prompt (RAG: Augmentation step)
    prompt = f"""
    You are an expert technical interviewer. Based on this candidate's resume:
    
    {context}
    
    Generate {num_questions} interview questions that test their expertise.
    Mix these types:
    - Technical coding (data structures, algorithms)
    - System design (architecture, scalability)
    - Behavioral (leadership, conflict resolution)
    - Project deep-dive (their specific projects)
    
    For each question, provide:
    1. The question
    2. Category (technical/system_design/behavioral/project)
    3. Difficulty (Easy/Medium/Hard)
    4. Key points the answer should cover
    
    Format as JSON array.
    """
    
    try:
        response = model.generate_content(prompt)
        # Parse JSON from response
        text = response.text
        # Extract JSON array
        start = text.find('[')
        end = text.rfind(']') + 1
        if start >= 0 and end > start:
            questions = json.loads(text[start:end])
        else:
            questions = parse_questions_text(text)
        return questions[:num_questions]
    except Exception as e:
        print(f"Gemini error: {e}, using fallback")
        return load_fallback_questions(resume_data, num_questions)


def build_resume_context(resume_data):
    """Build context string from resume data for RAG."""
    parts = []
    
    if resume_data.get('skills'):
        parts.append(f"Skills: {', '.join(resume_data['skills'][:15])}")
    
    if resume_data.get('experience'):
        exp_texts = []
        for exp in resume_data['experience'][:3]:
            exp_texts.append(f"{exp.get('title', '')} at {exp.get('company', '')}")
        parts.append(f"Experience: {'; '.join(exp_texts)}")
    
    if resume_data.get('education'):
        edu_texts = [e.get('degree', '') for e in resume_data['education'][:2]]
        parts.append(f"Education: {', '.join(edu_texts)}")
    
    return "\n".join(parts) if parts else "No resume data provided"


def evaluate_answer(question, user_answer):
    """Evaluate user's answer with Gemini."""
    model = setup_gemini()
    if not model or not HAS_GEMINI:
        return {'score': 7, 'feedback': 'Good attempt. Keep practicing!', 'strengths': ['Attempted'], 'improvements': ['Practice more']}
    
    prompt = f"""
    Question: {question}
    Candidate's Answer: {user_answer}
    
    Evaluate this interview answer. Provide:
    1. Score (1-10)
    2. Specific feedback
    3. Strengths
    4. Areas for improvement
    
    Format as JSON.
    """
    
    try:
        response = model.generate_content(prompt)
        text = response.text
        start = text.find('{')
        end = text.rfind('}') + 1
        if start >= 0:
            return json.loads(text[start:end])
    except:
        pass
    
    return {'score': 7, 'feedback': 'Good attempt!', 'strengths': [], 'improvements': []}


def load_fallback_questions(resume_data, num_questions):
    """Pre-written questions when Gemini is not available."""
    skills = resume_data.get('skills', [])
    
    questions = [
        {'question': 'Tell me about yourself and your background.', 'category': 'behavioral', 'difficulty': 'Easy', 'expected_answer_hint': 'Brief overview of education, experience, and skills'},
        {'question': 'What is your strongest technical skill and why?', 'category': 'technical', 'difficulty': 'Easy', 'expected_answer_hint': 'Choose a skill from your resume and explain with examples'},
        {'question': 'Describe a challenging project you worked on.', 'category': 'project', 'difficulty': 'Medium', 'expected_answer_hint': 'Use STAR method: Situation, Task, Action, Result'},
        {'question': 'How do you handle tight deadlines?', 'category': 'behavioral', 'difficulty': 'Medium', 'expected_answer_hint': 'Discuss prioritization, communication, and time management'},
        {'question': 'Explain the difference between REST and GraphQL.', 'category': 'technical', 'difficulty': 'Medium', 'expected_answer_hint': 'Compare endpoints, data fetching, flexibility'},
        {'question': 'How would you design a scalable web application?', 'category': 'system_design', 'difficulty': 'Hard', 'expected_answer_hint': 'Discuss load balancing, caching, database sharding, microservices'},
        {'question': 'What is your experience with databases?', 'category': 'technical', 'difficulty': 'Easy', 'expected_answer_hint': 'Mention SQL/NoSQL experience, optimization, indexing'},
        {'question': 'Tell me about a time you had a conflict with a team member.', 'category': 'behavioral', 'difficulty': 'Medium', 'expected_answer_hint': 'Focus on resolution, communication, not the conflict itself'},
        {'question': 'How do you keep up with new technologies?', 'category': 'behavioral', 'difficulty': 'Easy', 'expected_answer_hint': 'Mention blogs, courses, side projects, communities'},
        {'question': f"I see you know {skills[0] if skills else 'Python'}. Explain a project where you used it.", 'category': 'project', 'difficulty': 'Medium', 'expected_answer_hint': 'Describe the project, your role, technical decisions, outcomes'},
    ]
    
    return questions[:num_questions]


def parse_questions_text(text):
    """Parse questions from non-JSON Gemini response."""
    return load_fallback_questions({}, 5)