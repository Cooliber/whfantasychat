import { Scroll, Twitter, Linkedin, Instagram } from 'lucide-react';

export function Footer() {
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer className="bg-gray-900 py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <div className="flex items-center space-x-3 mb-4">
              <Scroll className="text-gold text-2xl" />
              <span className="font-cinzel text-xl font-bold text-gold">Chronicles Portfolio</span>
            </div>
            <p className="font-crimson text-parchment leading-relaxed">
              Documenting the legendary strategies behind the realm's most successful podcast chronicles.
            </p>
          </div>
          <div>
            <h4 className="font-cinzel font-semibold text-gold mb-4">Quick Links</h4>
            <ul className="space-y-2 font-crimson text-parchment">
              <li>
                <button 
                  onClick={() => scrollToSection('home')}
                  className="hover:text-gold transition-colors duration-300"
                >
                  Home
                </button>
              </li>
              <li>
                <button 
                  onClick={() => scrollToSection('portfolio')}
                  className="hover:text-gold transition-colors duration-300"
                >
                  Case Studies
                </button>
              </li>
              <li>
                <button 
                  onClick={() => scrollToSection('about')}
                  className="hover:text-gold transition-colors duration-300"
                >
                  About
                </button>
              </li>
              <li>
                <button 
                  onClick={() => scrollToSection('contact')}
                  className="hover:text-gold transition-colors duration-300"
                >
                  Contact
                </button>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-cinzel font-semibold text-gold mb-4">Follow the Chronicles</h4>
            <div className="flex space-x-4">
              <a href="#" className="text-parchment hover:text-gold transition-colors duration-300">
                <Twitter size={24} />
              </a>
              <a href="#" className="text-parchment hover:text-gold transition-colors duration-300">
                <Linkedin size={24} />
              </a>
              <a href="#" className="text-parchment hover:text-gold transition-colors duration-300">
                <Instagram size={24} />
              </a>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-700 mt-8 pt-8 text-center">
          <p className="font-crimson text-gray-400">
            © 2024 Chronicles Portfolio. All rights reserved. May your tales be legendary.
          </p>
        </div>
      </div>
    </footer>
  );
}
