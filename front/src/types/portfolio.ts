export interface Portfolio {
  id: string;
  title: string;
  description: string;
  techStack: string[];
  heroImage: string;
  category: string;
  url?: string;
  githubUrl?: string;
}

export interface PortfolioCardProps {
  portfolio: Portfolio;
  delay?: number;
  onHover?: (portfolio: Portfolio) => void;
}

export interface PortfolioFilterProps {
  categories: string[];
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}

export type FilterCategory = 'All Projects' | string;