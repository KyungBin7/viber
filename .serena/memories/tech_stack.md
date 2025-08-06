# Technology Stack

## Frontend Framework
- **Next.js 14.2.5** - React framework with SSR/SSG capabilities
- **React 18** - UI library
- **TypeScript 5** - Type-safe JavaScript

## Styling & UI
- **Tailwind CSS** - Utility-first CSS framework
- **react-bits** - Custom animation and interactive components library

## Testing
- **Jest 29.7.0** - Testing framework
- **@testing-library/react** - React component testing utilities
- **@testing-library/jest-dom** - Jest DOM matchers

## Development Tools
- **ESLint** - Code linting with Next.js config
- **PostCSS** - CSS processing
- **Autoprefixer** - CSS vendor prefixes
- **SWC** - Fast Rust-based compiler (Next.js built-in)

## Project Structure
- Next.js standard structure in `/front` directory
- Components organized in `/components/ui` and `/components/react-bits`
- TypeScript strict mode enabled
- Module path mapping: `@/*` → `./src/*`