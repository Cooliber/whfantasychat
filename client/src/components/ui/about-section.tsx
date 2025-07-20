export function AboutSection() {
  return (
    <section id="about" className="py-20 bg-gradient-to-b from-gray-900 to-charcoal">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            {/* Medieval tavern keeper portrait */}
            <img 
              src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600" 
              alt="Portrait of a wise tavern keeper" 
              className="rounded-xl shadow-2xl w-full"
            />
          </div>
          <div>
            <h2 className="font-cinzel text-4xl font-bold text-gold mb-6">The Chronicle Keeper</h2>
            <p className="font-crimson text-lg text-parchment leading-relaxed mb-6">
              For over a decade, I have served as keeper of the chronicles, documenting the rise and fall of podcast empires across the digital realm. Each case study represents a quest undertaken, a challenge overcome, and wisdom gained through trial and triumph.
            </p>
            <p className="font-crimson text-lg text-parchment leading-relaxed mb-8">
              From humble beginnings in tavern corners to commanding great halls of millions of listeners, these chronicles reveal the strategies, tactics, and creative insights that separate legendary podcasts from forgotten tales.
            </p>
            <div className="grid grid-cols-2 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-gold font-cinzel">150+</div>
                <div className="text-parchment font-crimson">Chronicles Documented</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-gold font-cinzel">50M+</div>
                <div className="text-parchment font-crimson">Total Downloads Analyzed</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
