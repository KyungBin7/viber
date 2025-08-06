# Task Completion Workflow

## When a development task is completed, run these commands in sequence:

### 1. Code Quality Checks
```bash
cd front/
npm run lint
```

### 2. Type Checking
TypeScript compilation is handled automatically by Next.js during build, but you can verify types during development.

### 3. Testing
```bash
# Run all tests
npm test

# For comprehensive testing during development
npm test:watch
```

### 4. Build Verification
```bash
# Verify production build works
npm run build
```

### 5. Development Server Check
```bash
# Verify development server starts correctly
npm run dev
```

## Pre-commit Checklist
- [ ] Code linting passes (`npm run lint`)
- [ ] All tests pass (`npm test`)
- [ ] TypeScript compilation succeeds (no type errors)
- [ ] Production build succeeds (`npm run build`)
- [ ] Components render correctly in browser
- [ ] Animation components work as expected
- [ ] Responsive design tested on different screen sizes

## File Updates
- Update component tests when modifying components
- Maintain consistent TypeScript interfaces
- Follow established component patterns
- Update import statements when moving files