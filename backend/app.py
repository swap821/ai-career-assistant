"""
app.py — Flask API for AI Career Assistant

11 API endpoints serving 4 modules:
1. Resume Parser: /resume/parse
2. Skill Analyzer: /resume/analyze-skills
3. Interview Generator: /interview/generate
4. Job Matcher: /jobs/match-all
"""

import os
from flask import Flask, request, jsonify
from flask_cors import CORS

from resume_parser import parse_resume, extract_skills, SKILLS_DB
from skill_analyzer import analyze_skill_gap
from interview_generator import generate_questions, evaluate_answer
from job_matcher import match_against_jobs, JOB_TEMPLATES

app = Flask(__name__)
CORS(app)


def allowed_file(filename):
    """Check if file extension is allowed."""
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in {'pdf', 'docx'}


@app.route('/')
def home():
    return jsonify({
        'message': 'AI Career Assistant API',
        'endpoints': {
            'POST /resume/parse': 'Upload resume (PDF/DOCX)',
            'POST /resume/analyze-skills': 'Skill gap analysis',
            'POST /interview/generate': 'Generate AI interview questions',
            'POST /interview/evaluate': 'Evaluate interview answer',
            'GET /jobs/templates': 'List job templates',
            'GET /jobs/match-all': 'Match resume against all jobs',
            'GET /skills/database': 'List known skills',
        }
    })


@app.route('/resume/parse', methods=['POST'])
def parse_resume_endpoint():
    """Upload and parse a resume."""
    if 'file' not in request.files:
        return jsonify({'error': 'No file provided'}), 400
    
    file = request.files['file']
    if not allowed_file(file.filename):
        return jsonify({'error': 'File must be PDF or DOCX'}), 400
    
    # Save temporarily
    filepath = f"/tmp/{file.filename}"
    file.save(filepath)
    
    try:
        result = parse_resume(filepath)
        os.remove(filepath)
        return jsonify({'status': 'success', 'data': result})
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/resume/analyze-skills', methods=['POST'])
def analyze_skills_endpoint():
    """Analyze skill gap between resume and job description."""
    data = request.get_json()
    resume_text = data.get('resume_text', '')
    job_description = data.get('job_description', '')
    
    if not resume_text or not job_description:
        return jsonify({'error': 'Both resume_text and job_description required'}), 400
    
    result = analyze_skill_gap(resume_text, job_description, SKILLS_DB)
    return jsonify({'status': 'success', 'data': result})


@app.route('/interview/generate', methods=['POST'])
def generate_interview_endpoint():
    """Generate AI interview questions from resume."""
    data = request.get_json()
    resume_data = data.get('resume_data', {})
    num_questions = data.get('num_questions', 5)
    
    questions = generate_questions(resume_data, num_questions)
    return jsonify({'status': 'success', 'questions': questions})


@app.route('/interview/evaluate', methods=['POST'])
def evaluate_answer_endpoint():
    """Evaluate an interview answer."""
    data = request.get_json()
    question = data.get('question', '')
    answer = data.get('answer', '')
    
    result = evaluate_answer(question, answer)
    return jsonify({'status': 'success', 'evaluation': result})


@app.route('/jobs/templates', methods=['GET'])
def get_job_templates():
    """List available job templates."""
    return jsonify({'templates': [
        {'title': k, 'skills': v['skills'], 'description': v['description']}
        for k, v in JOB_TEMPLATES.items()
    ]})


@app.route('/jobs/match-all', methods=['POST'])
def match_all_jobs_endpoint():
    """Match resume against all job templates."""
    data = request.get_json()
    resume_text = data.get('resume_text', '')
    
    if not resume_text:
        return jsonify({'error': 'resume_text required'}), 400
    
    matches = match_against_jobs(resume_text)
    return jsonify({'status': 'success', 'matches': matches})


@app.route('/skills/database', methods=['GET'])
def get_skills_database():
    """List all skills in the database."""
    return jsonify({'skills': SKILLS_DB, 'count': len(SKILLS_DB)})


@app.route('/health', methods=['GET'])
def health():
    return jsonify({'status': 'healthy'})


if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)