import { X, Download } from 'lucide-react';
import { usePortfolioStore } from '../../stores/portfolioStore';
import { useEffect } from 'react';

export function CaseStudyModal() {
  const { selectedCaseStudy, isModalOpen, closeCaseStudy } = usePortfolioStore();

  useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }

    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isModalOpen]);

  if (!isModalOpen || !selectedCaseStudy) return null;

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      closeCaseStudy();
    }
  };

  return (
    <div className="fixed inset-0 z-50" onClick={handleBackdropClick}>
      <div className="absolute inset-0 bg-black bg-opacity-80 backdrop-blur-sm"></div>
      <div className="relative flex items-center justify-center min-h-screen p-4">
        <div className="glass-morphism rounded-xl max-w-4xl w-full max-h-screen overflow-y-auto">
          <div className="relative p-8">
            {/* Close button */}
            <button 
              onClick={closeCaseStudy}
              className="absolute top-4 right-4 text-gold hover:text-yellow-400 text-2xl transition-colors duration-300"
            >
              <X />
            </button>
            
            {/* Modal content */}
            <div className="mb-8">
              <img 
                src={selectedCaseStudy.imageUrl} 
                alt={`${selectedCaseStudy.title} detailed analysis`}
                className="w-full h-64 object-cover rounded-lg mb-6"
              />
              <h2 className="font-cinzel text-3xl font-bold text-gold mb-4">
                Case Study: {selectedCaseStudy.title}
              </h2>
              <div className="flex flex-wrap gap-4 mb-6">
                <span className="bg-gold text-charcoal px-3 py-1 rounded-full text-sm font-semibold">
                  {selectedCaseStudy.category.charAt(0).toUpperCase() + selectedCaseStudy.category.slice(1)}
                </span>
                <span className="bg-wood text-parchment px-3 py-1 rounded-full text-sm font-semibold">
                  {selectedCaseStudy.episodes}
                </span>
                <span className="bg-forest text-parchment px-3 py-1 rounded-full text-sm font-semibold">
                  {selectedCaseStudy.downloads}
                </span>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-8 mb-8">
              <div>
                <h3 className="font-cinzel text-xl font-bold text-gold mb-4">Challenge</h3>
                <p className="font-crimson text-parchment leading-relaxed mb-6">
                  {selectedCaseStudy.challenge}
                </p>

                <h3 className="font-cinzel text-xl font-bold text-gold mb-4">Strategy</h3>
                <ul className="font-crimson text-parchment space-y-2">
                  {selectedCaseStudy.strategy.map((item, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <Scroll size={16} className="text-gold mt-1 flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              
              <div>
                <h3 className="font-cinzel text-xl font-bold text-gold mb-4">Results</h3>
                <div className="space-y-4">
                  <div className="bg-charcoal bg-opacity-50 p-4 rounded-lg">
                    <div className="text-2xl font-bold text-gold">{selectedCaseStudy.results.downloads}</div>
                    <div className="text-sm text-parchment">Total Downloads</div>
                  </div>
                  <div className="bg-charcoal bg-opacity-50 p-4 rounded-lg">
                    <div className="text-2xl font-bold text-gold">{selectedCaseStudy.results.rating}</div>
                    <div className="text-sm text-parchment">Average Rating</div>
                  </div>
                  <div className="bg-charcoal bg-opacity-50 p-4 rounded-lg">
                    <div className="text-2xl font-bold text-gold">{selectedCaseStudy.results.completion}</div>
                    <div className="text-sm text-parchment">Completion Rate</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mb-8">
              <h3 className="font-cinzel text-xl font-bold text-gold mb-4">Key Learnings</h3>
              <div className="grid md:grid-cols-3 gap-4">
                {selectedCaseStudy.keyLearnings.map((learning, index) => (
                  <div key={index} className="glass-morphism p-4 rounded-lg">
                    <div className="text-gold text-2xl mb-3">{learning.icon}</div>
                    <h4 className="font-crimson font-semibold text-parchment mb-2">{learning.title}</h4>
                    <p className="font-crimson text-sm text-gray-300">{learning.description}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="text-center">
              <button className="bg-gold text-charcoal px-8 py-3 rounded-lg font-crimson font-semibold text-lg hover-glow transition-all duration-300 flex items-center gap-2 mx-auto">
                <Download size={20} />
                Download Full Case Study
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
