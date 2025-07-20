import { useState } from 'react';
import { Menu, X, Scroll } from 'lucide-react';

export function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMenuOpen(false);
  };

  return (
    <nav className="fixed top-0 w-full z-50 glass-morphism">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <div className="flex items-center space-x-3">
            <Scroll className="text-gold text-2xl" />
            <span className="font-cinzel text-2xl font-bold text-gold">Chronicles Portfolio</span>
          </div>
          
          <div className="hidden md:flex items-center space-x-8">
            <button
              onClick={() => scrollToSection('home')}
              className="hover:text-gold transition-colors duration-300 font-crimson"
            >
              Home
            </button>
            <button
              onClick={() => scrollToSection('portfolio')}
              className="hover:text-gold transition-colors duration-300 font-crimson"
            >
              Case Studies
            </button>
            <button
              onClick={() => scrollToSection('about')}
              className="hover:text-gold transition-colors duration-300 font-crimson"
            >
              About
            </button>
            <button
              onClick={() => scrollToSection('contact')}
              className="bg-gold text-charcoal px-6 py-2 rounded-lg hover:bg-yellow-500 transition-colors duration-300 font-crimson font-semibold"
            >
              Contact
            </button>
          </div>
          
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gold text-xl"
            >
              {isMenuOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>
        
        {isMenuOpen && (
          <div className="md:hidden bg-charcoal bg-opacity-95 rounded-lg mt-2 p-4">
            <div className="flex flex-col space-y-4">
              <button
                onClick={() => scrollToSection('home')}
                className="text-left hover:text-gold transition-colors duration-300 font-crimson"
              >
                Home
              </button>
              <button
                onClick={() => scrollToSection('portfolio')}
                className="text-left hover:text-gold transition-colors duration-300 font-crimson"
              >
                Case Studies
              </button>
              <button
                onClick={() => scrollToSection('about')}
                className="text-left hover:text-gold transition-colors duration-300 font-crimson"
              >
                About
              </button>
              <button
                onClick={() => scrollToSection('contact')}
                className="text-left bg-gold text-charcoal px-6 py-2 rounded-lg hover:bg-yellow-500 transition-colors duration-300 font-crimson font-semibold w-fit"
              >
                Contact
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
