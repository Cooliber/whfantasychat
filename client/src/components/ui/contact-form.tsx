import { useState } from 'react';
import { Send } from 'lucide-react';
import { ContactFormData } from '../../types/portfolio';
import { useToast } from '../../hooks/use-toast';

export function ContactForm() {
  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    email: '',
    projectType: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Quest Request Received!",
        description: "Your chronicle request has been received! We shall respond within one day.",
      });
      
      setFormData({
        name: '',
        email: '',
        projectType: '',
        message: '',
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-20 bg-charcoal relative overflow-hidden">
      {/* Atmospheric background */}
      <div className="absolute inset-0 opacity-10">
        <img 
          src="https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&h=1080" 
          alt="Medieval candlelit atmosphere" 
          className="w-full h-full object-cover"
        />
      </div>
      
      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="font-cinzel text-4xl font-bold text-gold mb-6">Begin Your Quest</h2>
        <p className="font-crimson text-xl text-parchment mb-12 max-w-2xl mx-auto">
          Ready to write your own legend? Let us forge a strategy that will elevate your podcast from whispered tale to epic chronicle.
        </p>
        
        <div className="glass-morphism rounded-xl p-8 max-w-2xl mx-auto">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <input 
                  type="text" 
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Your Name" 
                  required
                  className="w-full px-4 py-3 bg-charcoal bg-opacity-50 border border-gold border-opacity-30 rounded-lg text-parchment placeholder-gray-400 focus:border-gold focus:outline-none transition-colors duration-300 font-crimson"
                />
              </div>
              <div>
                <input 
                  type="email" 
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Your Email" 
                  required
                  className="w-full px-4 py-3 bg-charcoal bg-opacity-50 border border-gold border-opacity-30 rounded-lg text-parchment placeholder-gray-400 focus:border-gold focus:outline-none transition-colors duration-300 font-crimson"
                />
              </div>
            </div>
            <div>
              <select 
                name="projectType"
                value={formData.projectType}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-charcoal bg-opacity-50 border border-gold border-opacity-30 rounded-lg text-parchment focus:border-gold focus:outline-none transition-colors duration-300 font-crimson"
              >
                <option value="">Project Type</option>
                <option value="new-launch">New Podcast Launch</option>
                <option value="optimization">Existing Show Optimization</option>
                <option value="marketing">Marketing Strategy</option>
                <option value="full-management">Full Campaign Management</option>
              </select>
            </div>
            <div>
              <textarea 
                name="message"
                value={formData.message}
                onChange={handleChange}
                rows={4} 
                placeholder="Tell us about your quest..." 
                required
                className="w-full px-4 py-3 bg-charcoal bg-opacity-50 border border-gold border-opacity-30 rounded-lg text-parchment placeholder-gray-400 focus:border-gold focus:outline-none transition-colors duration-300 font-crimson resize-none"
              />
            </div>
            <button 
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-gold text-charcoal py-4 rounded-lg font-crimson font-semibold text-lg hover-glow transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send size={20} />
              {isSubmitting ? 'Sending...' : 'Send Message'}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
