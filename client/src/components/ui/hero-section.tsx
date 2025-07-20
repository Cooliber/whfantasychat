import { Play, BookOpen, Crown, Feather } from 'lucide-react';

export function HeroSection() {
  const scrollToPortfolio = () => {
    const element = document.getElementById('portfolio');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Medieval tavern interior background */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&h=1080" 
          alt="Medieval tavern interior with warm candlelight" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-charcoal bg-opacity-70"></div>
      </div>
      
      <div className="relative z-10 max-w-4xl mx-auto text-center px-4 animate-fade-in">
        <h1 className="font-cinzel text-5xl md:text-7xl font-bold mb-6 text-gold animate-slide-up">
          Chronicles of the Realm
        </h1>
        <p className="font-crimson text-xl md:text-2xl mb-8 text-parchment leading-relaxed animate-slide-up opacity-0 animation-delay-200">
          Immerse yourself in legendary podcast case studies where storytelling meets strategy. 
          Each chronicle reveals the secrets behind extraordinary audio adventures.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-up opacity-0 animation-delay-400">
          <button 
            onClick={scrollToPortfolio}
            className="bg-gold text-charcoal px-8 py-4 rounded-lg font-crimson font-semibold text-lg hover-glow transition-all duration-300 flex items-center justify-center gap-2"
          >
            <BookOpen size={20} />
            Explore Chronicles
          </button>
          <button className="border-2 border-gold text-gold px-8 py-4 rounded-lg font-crimson font-semibold text-lg hover:bg-gold hover:text-charcoal transition-all duration-300 flex items-center justify-center gap-2">
            <Play size={20} />
            Watch Demo
          </button>
        </div>
      </div>
      
      {/* Floating elements */}
      <div className="absolute top-1/4 left-10 text-gold opacity-20 animate-float">
        <Feather size={40} />
      </div>
      <div className="absolute bottom-1/4 right-10 text-gold opacity-20 animate-float animation-delay-1000">
        <Crown size={40} />
      </div>
    </section>
  );
}
