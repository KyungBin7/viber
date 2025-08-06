# Coding Conventions & Style Guide

## TypeScript Configuration
- **Strict mode**: enabled for type safety
- **Target**: ES5 with modern library support
- **Module system**: ESNext with bundler resolution
- **JSX**: preserve (Next.js handles compilation)

## Component Patterns
- **Functional components** with TypeScript interfaces
- **Props interfaces** defined before components
- **Default props** using destructuring with default values
- **React.FC** type annotation for components
- **Hooks** (useState, useEffect) for state management

## File Organization
- **Components**: organized by category (`ui/`, `react-bits/`)
- **Pages**: Next.js routing structure
- **Tests**: organized in `__tests__/` with same directory structure
- **Imports**: path aliases using `@/` prefix

## Code Style Examples
```typescript
interface ComponentProps {
  prop: string;
  optional?: number;
  callback?: () => void;
}

const Component: React.FC<ComponentProps> = ({
  prop,
  optional = 100,
  callback
}) => {
  const [state, setState] = useState('');
  
  useEffect(() => {
    // effect logic
  }, []);

  return <div className="tailwind-classes">{prop}</div>;
};
```

## Animation Component Patterns
- Use react-bits library for animations
- Performance optimization with dynamic imports
- SSR considerations for animation components