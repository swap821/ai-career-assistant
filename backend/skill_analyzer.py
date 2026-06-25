"""
skill_analyzer.py — Skill Gap Analysis

Compares resume skills against job requirements to identify:
- Matched skills (already have)
- Missing skills (need to learn)
- Match percentage
"""

from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity


def extract_skills_from_text(text, skills_db):
    """Extract skills mentioned in text."""
    text_lower = text.lower()
    return [s for s in skills_db if s.lower() in text_lower]


def compare_skills(resume_skills, job_skills):
    """
    Compare two skill sets.
    
    Returns:
        dict: matched, missing, extra, match_percentage
    """
    resume_set = set(s.lower() for s in resume_skills)
    job_set = set(s.lower() for s in job_skills)
    
    matched = list(resume_set & job_set)
    missing = list(job_set - resume_set)
    extra = list(resume_set - job_set)
    
    match_pct = len(matched) / len(job_set) * 100 if job_set else 0
    
    return {
        'matched': matched,
        'missing': missing,
        'extra': extra,
        'match_percentage': round(match_pct, 1),
        'matched_count': len(matched),
        'required_count': len(job_set),
    }


def analyze_skill_gap(resume_text, job_description, skills_db):
    """Full skill gap analysis."""
    resume_skills = extract_skills_from_text(resume_text, skills_db)
    job_skills = extract_skills_from_text(job_description, skills_db)
    
    comparison = compare_skills(resume_skills, job_skills)
    
    # TF-IDF similarity for overall match
    vectorizer = TfidfVectorizer()
    tfidf = vectorizer.fit_transform([resume_text, job_description])
    similarity = cosine_similarity(tfidf[0:1], tfidf[1:2])[0][0]
    
    comparison['text_similarity'] = round(similarity * 100, 1)
    
    return comparison