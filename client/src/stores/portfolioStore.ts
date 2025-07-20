import { create } from 'zustand';
import { CategoryFilter, CaseStudyData } from '../types/portfolio';

interface PortfolioStore {
  activeFilter: CategoryFilter;
  selectedCaseStudy: CaseStudyData | null;
  isModalOpen: boolean;
  setActiveFilter: (filter: CategoryFilter) => void;
  openCaseStudy: (caseStudy: CaseStudyData) => void;
  closeCaseStudy: () => void;
}

export const usePortfolioStore = create<PortfolioStore>((set) => ({
  activeFilter: 'all',
  selectedCaseStudy: null,
  isModalOpen: false,
  setActiveFilter: (filter) => set({ activeFilter: filter }),
  openCaseStudy: (caseStudy) => set({ selectedCaseStudy: caseStudy, isModalOpen: true }),
  closeCaseStudy: () => set({ selectedCaseStudy: null, isModalOpen: false }),
}));
