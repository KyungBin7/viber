# 4. Project Structure
We will follow Next.js's standard directory structure, considering reusability and scalability:
/
├── components/          // Reusable UI components
│   ├── ui/              // General UI components (buttons, inputs, etc.)
│   ├── react-bits/      // Customized react-bits components
├── pages/               // Page components for routing
│   ├── _app.tsx
│   ├── index.tsx        // Main page
│   ├── portfolio.tsx    // Portfolio list page
│   ├── portfolio/[id].tsx // Portfolio detail page using dynamic routing
│   └── contact.tsx      // Contact page
├── public/              // Static assets like images and fonts
├── styles/              // Global styles and Tailwind CSS configuration
├── lib/                 // API calls, utility functions, etc.
├── types/               // TypeScript type definitions
├── data/                // Portfolio data (JSON or Markdown)
└── README.md
