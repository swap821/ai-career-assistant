"""
utils.py — Helper functions
"""

import logging
import re


def setup_logging():
    logging.basicConfig(level=logging.INFO)
    return logging.getLogger(__name__)


def sanitize_text(text):
    """Clean extracted text."""
    text = re.sub(r'[^\w\s@./#+-]', ' ', text)
    return ' '.join(text.split())


def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in {'pdf', 'docx'}