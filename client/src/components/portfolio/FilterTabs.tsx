import { CategoryFilter } from '../../types/portfolio';
import { usePortfolioStore } from '../../stores/portfolioStore';

interface FilterTabsProps {
  onFilterChange: (filter: CategoryFilter) => void;
}

const filterOptions: { label: string; value: CategoryFilter }[] = [
  { label: 'All Chronicles', value: 'all' },
  { label: 'Fantasy Realms', value: 'fantasy' },
  { label: 'Adventure Quests', value: 'adventure' },
  { label: 'Mystery Tales', value: 'mystery' },
  { label: 'Historical Chronicles', value: 'documentary' },
];

export function FilterTabs({ onFilterChange }: FilterTabsProps) {
  const { activeFilter, setActiveFilter } = usePortfolioStore();

  const handleFilterClick = (filter: CategoryFilter) => {
    setActiveFilter(filter);
    onFilterChange(filter);
  };

  return (
    <div className="flex flex-wrap justify-center gap-4 mb-12">
      {filterOptions.map((option) => (
        <button
          key={option.value}
          onClick={() => handleFilterClick(option.value)}
          className={`px-6 py-3 rounded-lg font-crimson font-semibold transition-all duration-300 hover-glow ${
            activeFilter === option.value
              ? 'bg-gold text-charcoal'
              : 'bg-transparent border-2 border-gold text-gold hover:bg-gold hover:text-charcoal'
          }`}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
