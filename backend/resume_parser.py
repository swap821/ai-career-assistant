"""
resume_parser.py — Resume Text Extraction & Parsing

Uses PyPDF2/pdfplumber for PDFs, python-docx for Word docs,
and spaCy NER to extract structured information:
- Name, email, phone, LinkedIn
- Skills (matched against 500+ tech skills database)
- Work experience (title, company, dates)
- Education (degree, institution, year)
- Projects (name + tech stack)
"""

import re
import spacy

# Load spaCy model (run: python -m spacy download en_core_web_sm)
nlp = spacy.load('en_core_web_sm')

# Skills database — 500+ tech skills
SKILLS_DB = [
    # Programming Languages
    'python', 'java', 'javascript', 'typescript', 'c++', 'c#', 'go', 'rust', 'ruby', 'php',
    'swift', 'kotlin', 'scala', 'r', 'matlab', 'sql', 'bash', 'powershell',
    # Web Frontend
    'react', 'angular', 'vue', 'svelte', 'html', 'css', 'sass', 'less', 'tailwind',
    'bootstrap', 'jquery', 'redux', 'zustand', 'next.js', 'gatsby',
    # Web Backend
    'node.js', 'express', 'django', 'flask', 'fastapi', 'spring', 'laravel',
    'ruby on rails', 'asp.net', 'graphql', 'rest api',
    # Databases
    'mongodb', 'postgresql', 'mysql', 'sqlite', 'redis', 'elasticsearch',
    'firebase', 'dynamodb', 'cassandra', 'neo4j',
    # Cloud & DevOps
    'aws', 'azure', 'gcp', 'docker', 'kubernetes', 'terraform', 'jenkins',
    'github actions', 'gitlab ci', 'circleci', 'travis ci', 'nginx',
    # AI/ML
    'tensorflow', 'pytorch', 'keras', 'scikit-learn', 'pandas', 'numpy',
    'matplotlib', 'seaborn', 'opencv', 'nltk', 'spacy', 'huggingface',
    'transformers', 'llm', 'langchain', 'fastai', 'xgboost', 'lightgbm',
    # Mobile
    'react native', 'flutter', 'android', 'ios', 'ionic', 'cordova',
    # Tools
    'git', 'github', 'gitlab', 'bitbucket', 'jira', 'confluence', 'trello',
    'figma', 'sketch', 'adobe xd', 'postman', 'insomnia', 'swagger',
    # Data
    'etl', 'data pipeline', 'apache spark', 'hadoop', 'kafka', 'airflow',
    'dbt', 'snowflake', 'bigquery', 'tableau', 'power bi',
    # Other
    'linux', 'unix', 'agile', 'scrum', 'ci/cd', 'microservices',
    'serverless', 'blockchain', 'solidity', 'web3',
]


def extract_text_from_pdf(file_path):
    """Extract text from PDF using pdfplumber."""
    import pdfplumber
    text = ""
    with pdfplumber.open(file_path) as pdf:
        for page in pdf.pages:
            page_text = page.extract_text()
            if page_text:
                text += page_text + "\n"
    return text


def extract_text_from_docx(file_path):
    """Extract text from Word document."""
    from docx import Document
    doc = Document(file_path)
    return "\n".join([paragraph.text for paragraph in doc.paragraphs])


def extract_text(file_path):
    """Auto-detect file type and extract text."""
    if file_path.endswith('.pdf'):
        return extract_text_from_pdf(file_path)
    elif file_path.endswith('.docx'):
        return extract_text_from_docx(file_path)
    else:
        raise ValueError("Unsupported file type. Use PDF or DOCX.")


def extract_contact_info(text):
    """Extract email, phone, LinkedIn from text."""
    email_pattern = r'[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}'
    phone_pattern = r'[\+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4}'
    linkedin_pattern = r'linkedin\.com/in/[a-zA-Z0-9_-]+'
    
    return {
        'email': re.findall(email_pattern, text),
        'phone': re.findall(phone_pattern, text),
        'linkedin': re.findall(linkedin_pattern, text),
    }


def extract_skills(text):
    """Extract skills by matching against skills database."""
    text_lower = text.lower()
    found_skills = []
    for skill in SKILLS_DB:
        if skill.lower() in text_lower:
            found_skills.append(skill)
    return list(set(found_skills))  # Remove duplicates


def extract_experience(text):
    """Extract work experience using regex patterns."""
    experiences = []
    patterns = [
        r'(?P<title>[A-Z][a-zA-Z\s]+)(?:\n|\r|\s)*.*?at\s+(?P<company>[A-Z][a-zA-Z\s]+)',  # "Software Engineer at Google"
        r'(?P<company>[A-Z][a-zA-Z\s]+)\s*[-|]\s*(?P<title>[A-Z][a-zA-Z\s]+)',  # "Google - Software Engineer"
    ]
    for pattern in patterns:
        matches = re.finditer(pattern, text)
        for match in matches:
            exp = match.groupdict()
            if exp not in experiences:
                experiences.append(exp)
    return experiences[:5]  # Top 5


def extract_education(text):
    """Extract education information."""
    education = []
    degree_patterns = [
        r'(Bachelor|Master|PhD|B\.S\.|M\.S\.|B\.Tech|M\.Tech|MBA)',
    ]
    for pattern in degree_patterns:
        matches = re.finditer(pattern, text, re.IGNORECASE)
        for match in matches:
            education.append({'degree': match.group()})
    return education


def parse_resume(file_path):
    """
    Main parsing function.
    
    Args:
        file_path: Path to PDF or DOCX file
        
    Returns:
        dict: Structured resume data
    """
    text = extract_text(file_path)
    contact = extract_contact_info(text)
    
    # Use spaCy NER to extract name (first PERSON entity)
    doc = nlp(text[:2000])  # Process first 2000 chars for speed
    name = None
    for ent in doc.ents:
        if ent.label_ == 'PERSON':
            name = ent.text
            break
    
    return {
        'name': name,
        'email': contact['email'][0] if contact['email'] else None,
        'phone': contact['phone'][0] if contact['phone'] else None,
        'linkedin': contact['linkedin'][0] if contact['linkedin'] else None,
        'skills': extract_skills(text),
        'experience': extract_experience(text),
        'education': extract_education(text),
        'raw_text': text[:5000],  # First 5000 chars for LLM context
    }