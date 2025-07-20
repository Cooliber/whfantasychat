import { Download, Star, Clock, Scroll } from 'lucide-react';
import { CaseStudyData } from '../../types/portfolio';
import { usePortfolioStore } from '../../stores/portfolioStore';

interface PortfolioCardProps {
  caseStudy: CaseStudyData;
}

const categoryColors = {
  fantasy: 'bg-gold text-charcoal',
  adventure: 'bg-crimson text-parchment',
  mystery: 'bg-forest text-parchment',
  documentary: 'bg-wood text-parchment',
};

export function PortfolioCard({ caseStudy }: PortfolioCardProps) {
  const { openCaseStudy } = usePortfolioStore();

  return (
    <div className="glass-morphism rounded-xl overflow-hidden hover-glow transition-all duration-500 group">
      <div className="relative h-64 overflow-hidden">
        <img 
          src={caseStudy.imageUrl} 
          alt={`${caseStudy.title} case study`}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className={`absolute top-4 right-4 px-3 py-1 rounded-full text-sm font-crimson font-semibold ${categoryColors[caseStudy.category]}`}>
          {caseStudy.category.charAt(0).toUpperCase() + caseStudy.category.slice(1)}
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal via-transparent to-transparent opacity-60"></div>
      </div>
      
      <div className="p-6">
        <h3 className="font-cinzel text-xl font-bold text-gold mb-3">{caseStudy.title}</h3>
        <p className="font-crimson text-parchment mb-4 leading-relaxed">
          {caseStudy.description}
        </p>
        
        <div className="flex justify-between items-center text-sm text-gray-300 mb-4">
          <span className="flex items-center gap-1">
            <Download size={16} />
            {caseStudy.downloads}
          </span>
          <span className="flex items-center gap-1">
            <Star size={16} />
            {caseStudy.rating}
          </span>
          <span className="flex items-center gap-1">
            <Clock size={16} />
            {caseStudy.episodes}
          </span>
        </div>
        
        <button 
          onClick={() => openCaseStudy(caseStudy)}
          className="w-full bg-wood text-parchment py-3 rounded-lg font-crimson font-semibold hover:bg-opacity-80 transition-all duration-300 flex items-center justify-center gap-2"
        >
          <Scroll size={16} />
          Read Chronicle
        </button>
      </div>
    </div>
  );
}
