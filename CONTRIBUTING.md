# Contributing Guidelines

Thank you for your interest in contributing! This document outlines the process for contributing to this project.

## Code of Conduct

By participating, you agree to abide by our [Code of Conduct](CODE_OF_CONDUCT.md). Please read it before contributing.

## How to Contribute

### Reporting Bugs
1. Check if the issue already exists in [Issues](../../issues)
2. If not, create a new issue using the **Bug Report** template
3. Provide clear steps to reproduce, expected vs actual behavior

### Suggesting Features
1. Check existing issues and discussions
2. Create a new issue using the **Feature Request** template (if available) or describe your idea clearly

### Pull Requests
1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature-name`
3. Make your changes with clear, descriptive commits
4. Ensure tests pass and code follows style guidelines
5. Push to your fork and open a Pull Request using the PR template
6. Address any review feedback

## Development Setup

### Prerequisites
- Node.js 18+ (LTS)
- MongoDB 6+ (local or Atlas)
- npm or yarn

### Installation
```bash
# Clone your fork
git clone https://github.com/YOUR_USERNAME/REPO_NAME.git
cd REPO_NAME

# Backend
cd backend
npm install
cp .env.example .env  # Configure environment variables

# Frontend
cd ../frontend  # or ../client
npm install
cp .env.local.example .env.local  # Configure environment variables
```

### Running Locally
```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend  # or client
npm run dev
```

## Code Style

- **JavaScript/TypeScript:** ESLint + Prettier (run `npm run lint`)
- **Commits:** Conventional Commits format (`feat:`, `fix:`, `docs:`, `refactor:`, etc.)
- **Branches:** `feature/`, `fix/`, `docs/`, `refactor/` prefixes

## Testing

- Write tests for new features and bug fixes
- Run full test suite before submitting PR: `npm test`
- Ensure coverage doesn't decrease significantly

## Documentation

- Update README.md for user-facing changes
- Update API docs for endpoint changes
- Add JSDoc comments for new functions

## Review Process

1. Automated checks must pass (CI, linting, tests)
2. At least one maintainer review required
3. Address all requested changes
4. Squash and merge when approved

## Recognition

Contributors will be acknowledged in:
- Release notes
- CONTRIBUTORS.md (if exists)
- GitHub contributors graph

---

*These guidelines apply to all repositories in this portfolio. Individual projects may have additional requirements.*