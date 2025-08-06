# Development Commands

## Working Directory
All commands should be run from the `/front` directory.

## Core Development Commands
```bash
# Development server
npm run dev

# Production build
npm run build

# Start production server
npm start

# Code linting
npm run lint

# Run tests
npm test

# Run tests in watch mode
npm test:watch
```

## Testing Strategy
- Jest with React Testing Library
- Tests located in `src/__tests__/` directory
- Coverage collection from `src/components/**` and `src/pages/**`
- jsdom environment for DOM testing
- Setup file: `jest.setup.js`

## Package Management
```bash
# Install dependencies
npm install

# Install new package
npm install <package-name>

# Install dev dependency
npm install -D <package-name>
```

## Git Commands (from project root)
```bash
# Standard git operations
git status
git add .
git commit -m "message"
git push
```

## System Commands (Darwin/macOS)
```bash
# List files
ls -la

# Find files
find . -name "*.tsx" -type f

# Search in files
grep -r "searchterm" src/

# Directory navigation
cd front/
pwd
```