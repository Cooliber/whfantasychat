export type CategoryFilter = 'all' | 'fantasy' | 'adventure' | 'mystery' | 'documentary';

export interface CaseStudyData {
  id: string;
  title: string;
  category: CategoryFilter;
  description: string;
  downloads: string;
  rating: string;
  episodes: string;
  imageUrl: string;
  challenge: string;
  strategy: string[];
  results: {
    downloads: string;
    rating: string;
    completion: string;
  };
  keyLearnings: {
    title: string;
    description: string;
    icon: string;
  }[];
}

export interface ContactFormData {
  name: string;
  email: string;
  projectType: string;
  message: string;
}
