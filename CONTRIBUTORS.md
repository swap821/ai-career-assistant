# Contributors

## Author

**Swapnil Kumar** — BCA 2nd Year Student

- GitHub: [@swap821](https://github.com/swap821)
- Portfolio: [swapnil-kumar-portfolio016.vercel.app](https://swapnil-kumar-portfolio016.vercel.app)
- LinkedIn: [swapnil-kumar-73a68a308](https://www.linkedin.com/in/swapnil-kumar-73a68a308)

## How to Contribute

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## Development Setup

```bash
# Backend
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python -m spacy download en_core_web_sm
python app.py

# Frontend (separate terminal)
cd frontend
npm install
npm run dev
```

## Code Style

- Follow PEP 8 for Python code, ESLint/Prettier for JavaScript
- Add docstrings to all functions and classes
- Add type hints where possible
- Run tests before submitting PRs
