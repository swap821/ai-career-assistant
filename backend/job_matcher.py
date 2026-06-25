"""
job_matcher.py — Semantic Job Matching

Uses sentence-transformers to create vector embeddings of resumes
and job descriptions, then computes cosine similarity to find
the best matching jobs.

Why sentence-transformers?
- Creates semantic embeddings (understands meaning, not just keywords)
- "Python developer" and "Python programmer" will have high similarity
- Captures context that keyword matching misses
"""

import numpy as np
from sklearn.metrics.pairwise import cosine_similarity

# Try sentence-transformers, fallback to TF-IDF
try:
    from sentence_transformers import SentenceTransformer
    model = SentenceTransformer('all-MiniLM-L6-v2')
    USE_TRANSFORMERS = True
except:
    from sklearn.feature_extraction.text import TfidfVectorizer
    USE_TRANSFORMERS = False


# Pre-loaded job templates
JOB_TEMPLATES = {
    'Full-Stack Developer': {
        'skills': ['javascript', 'react', 'node.js', 'mongodb', 'sql', 'git', 'docker', 'aws'],
        'description': 'Build and maintain web applications using modern JavaScript frameworks. Work on both frontend and backend systems.'
    },
    'Data Scientist': {
        'skills': ['python', 'pandas', 'numpy', 'scikit-learn', 'tensorflow', 'sql', 'matplotlib', 'statistics'],
        'description': 'Analyze complex data sets, build predictive models, and derive actionable insights using statistical and machine learning techniques.'
    },
    'ML Engineer': {
        'skills': ['python', 'tensorflow', 'pytorch', 'docker', 'kubernetes', 'aws', 'ci/cd', 'mlflow'],
        'description': 'Design, build, and deploy machine learning models to production. Focus on MLOps and model serving infrastructure.'
    },
    'Frontend Developer': {
        'skills': ['javascript', 'react', 'html', 'css', 'typescript', 'tailwind', 'redux', 'webpack'],
        'description': 'Create responsive, interactive user interfaces. Focus on performance, accessibility, and modern UI/UX patterns.'
    },
    'Backend Developer': {
        'skills': ['python', 'java', 'sql', 'redis', 'docker', 'aws', 'microservices', 'rest api'],
        'description': 'Design and implement server-side architecture, APIs, and database systems. Focus on scalability and reliability.'
    },
}


def encode_text(text):
    """Create vector embedding for text."""
    if USE_TRANSFORMERS:
        return model.encode([text])[0]
    else:
        # Fallback: use TF-IDF
        vectorizer = TfidfVectorizer()
        return vectorizer.fit_transform([text]).toarray()[0]


def compute_similarity(resume_text, job_description):
    """
    Compute semantic similarity between resume and job description.
    
    Returns:
        float: Similarity score (0-1)
    """
    if USE_TRANSFORMERS:
        resume_vec = model.encode([resume_text])[0]
        job_vec = model.encode([job_description])[0]
        similarity = cosine_similarity([resume_vec], [job_vec])[0][0]
    else:
        # TF-IDF fallback
        from sklearn.feature_extraction.text import TfidfVectorizer
        vectorizer = TfidfVectorizer()
        tfidf = vectorizer.fit_transform([resume_text, job_description])
        similarity = cosine_similarity(tfidf[0:1], tfidf[1:2])[0][0]
    
    return float(similarity)


def match_against_jobs(resume_text):
    """
    Compare resume against all job templates.
    
    Returns:
        list: Ranked job matches with scores
    """
    matches = []
    
    for title, job in JOB_TEMPLATES.items():
        full_desc = f"{job['description']} Skills: {', '.join(job['skills'])}"
        similarity = compute_similarity(resume_text, full_desc)
        
        # Also compute skill overlap
        from skill_analyzer import extract_skills_from_text, compare_skills
        resume_skills = extract_skills_from_text(resume_text, job['skills'] + list(JOB_TEMPLATES.keys()))
        skill_comparison = compare_skills(resume_skills, job['skills'])
        
        matches.append({
            'job_title': title,
            'similarity_score': round(similarity * 100, 1),
            'match_percentage': skill_comparison['match_percentage'],
            'matched_skills': skill_comparison['matched'],
            'missing_skills': skill_comparison['missing'],
            'explanation': f"Your resume matches this role at {round(similarity * 100)}% based on semantic similarity.",
        })
    
    # Sort by similarity score descending
    matches.sort(key=lambda x: x['similarity_score'], reverse=True)
    return matches


def explain_match(resume_text, job_description):
    """Generate human-readable explanation of the match."""
    similarity = compute_similarity(resume_text, job_description)
    pct = round(similarity * 100)
    
    if pct >= 80:
        return f"Strong match ({pct}%)! Your profile aligns well with this role."
    elif pct >= 60:
        return f"Good match ({pct}%). You have relevant skills but some gaps exist."
    elif pct >= 40:
        return f"Moderate match ({pct}%). Consider upskilling in key areas."
    else:
        return f"Low match ({pct}%). This role may require significant skill development."