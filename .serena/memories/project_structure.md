# Project Structure

## Root Directory Structure
```
react-bits/
├── front/                  # Next.js application
├── docs/                   # Project documentation
│   ├── architecture/       # Architecture documentation
│   ├── stories/           # Development stories
│   ├── prd/              # Product requirements
│   └── epics/            # Epic documentation
├── .bmad-core/           # BMad development framework
└── web-bundles/          # Additional configurations
```

## Frontend Structure (/front)
```
front/
├── src/
│   ├── components/
│   │   ├── ui/           # General UI components
│   │   └── react-bits/   # Custom react-bits components
│   ├── pages/            # Next.js pages (routing)
│   ├── styles/           # Global styles
│   ├── types/            # TypeScript type definitions
│   ├── data/             # Portfolio data
│   └── __tests__/        # Test files
├── public/               # Static assets
├── package.json          # Dependencies and scripts
├── tsconfig.json         # TypeScript configuration
├── tailwind.config.js    # Tailwind CSS configuration
├── jest.config.js        # Jest test configuration
└── next.config.js        # Next.js configuration
```

## Key Component Categories
- **UI Components**: Reusable general components (buttons, inputs)
- **React-bits Components**: Animation and interactive components
- **Pages**: Route-based page components
- **Tests**: Component and page tests

## Configuration Files
- **TypeScript**: Strict mode, path mapping, Next.js integration
- **Tailwind**: CSS utility framework configuration
- **Jest**: React Testing Library integration
- **Next.js**: React strict mode, SWC minification