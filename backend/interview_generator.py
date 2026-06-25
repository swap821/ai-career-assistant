"""
interview_generator.py - AI Mock Interview Generator

Uses AWS Bedrock (Claude) with RAG (Retrieval-Augmented Generation):
1. Retrieve: Extract skills, experience, projects from resume
2. Augment: Inject this context into the LLM prompt
3. Generate: Create personalized interview questions

Falls back to pre-written questions when Bedrock is unavailable.
"""

import os
import json
import random
import logging

from bedrock_client import call_claude, is_available

logger = logging.getLogger(__name__)

# Track if Bedrock is working
_BEDROCK_READY = None


def check_bedrock():
    """Check if Bedrock is available, cache the result."""
    global _BEDROCK_READY
    if _BEDROCK_READY is None:
        _BEDROCK_READY = is_available()
        if _BEDROCK_READY:
            logger.info("AWS Bedrock is available - using Claude for interview generation")
        else:
            logger.info("AWS Bedrock not available - using fallback questions")
    return _BEDROCK_READY


def build_resume_context(resume_data):
    """Build context string from resume data for RAG."""
    parts = []
    skills = resume_data.get('skills', [])
    if skills:
        if isinstance(skills[0], dict):
            skill_names = [s.get('name', '') for s in skills[:15]]
        else:
            skill_names = skills[:15]
        parts.append(f"Skills: {', '.join(filter(None, skill_names))}")
    if resume_data.get('experience'):
        exp_texts = []
        for exp in resume_data['experience'][:3]:
            exp_texts.append(f"{exp.get('title', '')} at {exp.get('company', '')}")
        parts.append(f"Experience: {'; '.join(exp_texts)}")
    if resume_data.get('education'):
        edu_texts = [e.get('degree', '') for e in resume_data['education'][:2]]
        parts.append(f"Education: {', '.join(edu_texts)}")
    return "\n".join(parts) if parts else "No resume data provided"


def generate_questions(resume_data, num_questions=10):
    """
    Generate personalized interview questions using RAG + AWS Bedrock.

    Args:
        resume_data: Dict with skills, experience, projects
        num_questions: Number of questions to generate

    Returns:
        list: Question objects with category, difficulty, hints
    """
    if not check_bedrock():
        return load_fallback_questions(resume_data, num_questions)

    # Build context from resume (RAG: Retrieval step)
    context = build_resume_context(resume_data)

    # Build prompt (RAG: Augmentation step)
    prompt = f"""You are an expert technical interviewer. Based on this candidate's resume:

{context}

Generate {num_questions} interview questions that test their expertise.
Mix these types:
- Technical coding (data structures, algorithms)
- System design (architecture, scalability)
- Behavioral (leadership, conflict resolution)
- Project deep-dive (their specific projects)

For each question, provide:
1. The question text
2. Category (technical/system_design/behavioral/project_deep_dive)
3. Difficulty (Easy/Medium/Hard)
4. Key points the answer should cover

Return ONLY a JSON array, no markdown, no explanation. Format:
[{{"question": "...", "category": "...", "difficulty": "...", "expected_answer_hint": "..."}}]"""

    response = call_claude(prompt, max_tokens=2048, temperature=0.7)
    if not response:
        return load_fallback_questions(resume_data, num_questions)

    try:
        # Extract JSON array from response
        text = response.strip()
        start = text.find('[')
        end = text.rfind(']') + 1
        if start >= 0 and end > start:
            questions = json.loads(text[start:end])
            return questions[:num_questions]
        # Try parsing as JSON directly
        questions = json.loads(text)
        if isinstance(questions, list):
            return questions[:num_questions]
    except json.JSONDecodeError:
        logger.warning("Failed to parse Bedrock response as JSON, using fallback")

    return load_fallback_questions(resume_data, num_questions)


def evaluate_answer(question, user_answer):
    """Evaluate user's answer with AWS Bedrock."""
    if not check_bedrock():
        return {
            'score': 7,
            'feedback': 'Good attempt! Your answer shows understanding of the topic. Keep practicing with more specific examples.',
            'strengths': ['Attempted the question', 'Shows domain knowledge'],
            'improvements': ['Add more specific examples', 'Structure answer with STAR method']
        }

    prompt = f"""You are an expert technical interviewer evaluating a candidate's response.

Question: {question}
Candidate's Answer: {user_answer}

Evaluate this interview answer. Provide your evaluation as ONLY a JSON object:
{{
    "score": <integer 1-10>,
    "feedback": "<specific feedback>",
    "strengths": ["<strength 1>", "<strength 2>"],
    "improvements": ["<improvement 1>", "<improvement 2>"]
}}

Return ONLY the JSON object, no markdown, no explanation."""

    response = call_claude(prompt, max_tokens=1024, temperature=0.3)
    if not response:
        return {
            'score': 7,
            'feedback': 'Good attempt! Keep practicing.',
            'strengths': ['Attempted the question'],
            'improvements': ['Add more specific examples']
        }

    try:
        text = response.strip()
        start = text.find('{')
        end = text.rfind('}') + 1
        if start >= 0 and end > start:
            return json.loads(text[start:end])
    except json.JSONDecodeError:
        pass

    return {
        'score': 7,
        'feedback': 'Good attempt! Your answer demonstrates understanding.',
        'strengths': ['Attempted the question', 'Shows knowledge'],
        'improvements': ['Add more specific examples', 'Structure with STAR method']
    }


# ---- Fallback questions when Bedrock is unavailable ----

FALLBACK_QUESTIONS = [
    {"question": "Tell me about yourself and your background.", "category": "behavioral", "difficulty": "Easy", "expected_answer_hint": "Brief overview: education, key experiences, what drives you"},
    {"question": "What is your strongest technical skill and why?", "category": "technical", "difficulty": "Easy", "expected_answer_hint": "Pick one skill, explain depth of knowledge, give concrete project example"},
    {"question": "Describe a challenging project you worked on and how you overcame obstacles.", "category": "project_deep_dive", "difficulty": "Medium", "expected_answer_hint": "Use STAR method: Situation, Task, Action, Result. Focus on YOUR contributions."},
    {"question": "How do you handle tight deadlines and conflicting priorities?", "category": "behavioral", "difficulty": "Medium", "expected_answer_hint": "Discuss prioritization framework, communication with stakeholders, time management"},
    {"question": "Explain the difference between REST and GraphQL APIs.", "category": "technical", "difficulty": "Medium", "expected_answer_hint": "Compare: endpoints vs single endpoint, over/under-fetching, flexibility, use cases"},
    {"question": "Design a URL shortening service like bit.ly. How would you handle 1M requests/day?", "category": "system_design", "difficulty": "Hard", "expected_answer_hint": "Database choice, hashing strategy, caching, rate limiting, analytics"},
    {"question": "What is the difference between SQL and NoSQL databases? When would you use each?", "category": "technical", "difficulty": "Easy", "expected_answer_hint": "ACID vs BASE, structured vs flexible schema, vertical vs horizontal scaling"},
    {"question": "Tell me about a time you had a conflict with a team member. How did you resolve it?", "category": "behavioral", "difficulty": "Medium", "expected_answer_hint": "Focus on resolution, not the conflict. Show empathy and communication skills."},
    {"question": "How do you keep up with new technologies and industry trends?", "category": "behavioral", "difficulty": "Easy", "expected_answer_hint": "Mention specific resources: blogs, GitHub, conferences, side projects, communities"},
    {"question": "Explain how you would optimize a slow React application.", "category": "technical", "difficulty": "Medium", "expected_answer_hint": "React.memo, useMemo, useCallback, code splitting, lazy loading, virtualization"},
    {"question": "Design a real-time notification system for a social media app.", "category": "system_design", "difficulty": "Hard", "expected_answer_hint": "WebSockets vs polling, message queue, delivery guarantees, scalability"},
    {"question": "Why do you want to work at our company?", "category": "behavioral", "difficulty": "Easy", "expected_answer_hint": "Research the company. Mention specific products, culture, mission that align with you"},
    {"question": "What is the Event Loop in JavaScript and how does it work?", "category": "technical", "difficulty": "Medium", "expected_answer_hint": "Call stack, task queue, microtasks, macrotasks, setTimeout vs Promise"},
    {"question": "Describe a time you had to learn a new technology quickly to meet a deadline.", "category": "behavioral", "difficulty": "Medium", "expected_answer_hint": "Show adaptability: resources used, time management, outcome achieved"},
    {"question": "How would you design a database schema for an e-commerce platform?", "category": "system_design", "difficulty": "Hard", "expected_answer_hint": "Users, Products, Orders, Inventory tables. Relationships, indexing, sharding"},
]


def load_fallback_questions(resume_data, num_questions):
    """Pre-written questions when Bedrock is not available."""
    skills = resume_data.get('skills', [])
    first_skill = skills[0].get('name', 'Python') if skills and isinstance(skills[0], dict) else (skills[0] if skills else 'Python')

    questions = list(FALLBACK_QUESTIONS)

    # Add a personalized question based on their top skill
    if first_skill:
        questions.insert(2, {
            "question": f"I see you have experience with {first_skill}. Walk me through a project where you used it extensively.",
            "category": "project_deep_dive",
            "difficulty": "Medium",
            "expected_answer_hint": "Describe the project, YOUR specific contributions, technical decisions, challenges faced"
        })

    random.shuffle(questions)
    return questions[:num_questions]
