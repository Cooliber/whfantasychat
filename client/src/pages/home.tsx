import { useState, useMemo } from 'react';
import { Navigation } from '../components/ui/navigation';
import { HeroSection } from '../components/ui/hero-section';
import { FilterTabs } from '../components/portfolio/FilterTabs';
import { PortfolioCard } from '../components/portfolio/PortfolioCard';
import { CaseStudyModal } from '../components/portfolio/CaseStudyModal';
import { AboutSection } from '../components/ui/about-section';
import { ContactForm } from '../components/ui/contact-form';
import { Footer } from '../components/ui/footer';
import { CategoryFilter, CaseStudyData } from '../types/portfolio';

const mockCaseStudies: CaseStudyData[] = [
  {
    id: 'mage-chronicles',
    title: "The Mage's Chronicles",
    category: 'fantasy',
    description: "An epic fantasy podcast series that achieved 2.5M downloads through immersive worldbuilding and character-driven storytelling.",
    downloads: '2.5M Downloads',
    rating: '4.9 Rating',
    episodes: '52 Episodes',
    imageUrl: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600',
    challenge: "The Mage's Chronicles faced the daunting task of breaking into the saturated fantasy podcast market. With hundreds of similar shows competing for attention, the challenge was to create a unique identity that would resonate with both fantasy enthusiasts and newcomers to the genre.",
    strategy: [
      'Immersive world-building with detailed lore',
      'Character-driven narrative approach',
      'High-quality voice acting and sound design',
      'Community engagement through social media'
    ],
    results: {
      downloads: '2.5M',
      rating: '4.9★',
      completion: '85%'
    },
    keyLearnings: [
      {
        title: 'World-Building Matters',
        description: 'Detailed lore and consistent world-building created an immersive experience that kept listeners engaged.',
        icon: '💡'
      },
      {
        title: 'Community is Key',
        description: 'Active community engagement through social media increased retention by 45%.',
        icon: '💬'
      },
      {
        title: 'Quality Over Quantity',
        description: 'Investing in professional voice acting and sound design significantly improved listener satisfaction.',
        icon: '📈'
      }
    ]
  },
  {
    id: 'warrior-quest',
    title: "Warrior's Quest",
    category: 'adventure',
    description: "A thrilling adventure series featuring legendary heroes, achieving viral success through strategic social media campaigns.",
    downloads: '1.8M Downloads',
    rating: '4.7 Rating',
    episodes: '36 Episodes',
    imageUrl: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600',
    challenge: "Breaking through the noise in the adventure podcast space required innovative marketing and exceptional storytelling that would capture both existing fans and new audiences.",
    strategy: [
      'Strategic social media campaigns',
      'Influencer partnerships',
      'Interactive storytelling elements',
      'Cross-platform promotion'
    ],
    results: {
      downloads: '1.8M',
      rating: '4.7★',
      completion: '78%'
    },
    keyLearnings: [
      {
        title: 'Social Media Power',
        description: 'Strategic social campaigns can drive massive organic growth when executed properly.',
        icon: '🚀'
      },
      {
        title: 'Influencer Impact',
        description: 'Partnering with the right influencers expanded reach by 300%.',
        icon: '🤝'
      },
      {
        title: 'Interactive Elements',
        description: 'Adding interactive storytelling increased listener engagement significantly.',
        icon: '🎮'
      }
    ]
  },
  {
    id: 'shadows-keep',
    title: "Shadows of the Keep",
    category: 'mystery',
    description: "A haunting mystery series that mastered audience engagement through interactive storytelling and community building.",
    downloads: '3.2M Downloads',
    rating: '4.8 Rating',
    episodes: '48 Episodes',
    imageUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600',
    challenge: "Creating a mystery series that would keep audiences guessing while building a strong community of engaged listeners who would actively participate in solving the mysteries.",
    strategy: [
      'Interactive mystery elements',
      'Community-driven content',
      'Cliffhanger episode structure',
      'Fan theory integration'
    ],
    results: {
      downloads: '3.2M',
      rating: '4.8★',
      completion: '92%'
    },
    keyLearnings: [
      {
        title: 'Mystery Engagement',
        description: 'Interactive mysteries create deeper emotional investment from listeners.',
        icon: '🔍'
      },
      {
        title: 'Community Building',
        description: 'Strong community engagement led to the highest completion rates in the genre.',
        icon: '🏰'
      },
      {
        title: 'Cliffhanger Strategy',
        description: 'Strategic cliffhangers increased episode-to-episode retention by 60%.',
        icon: '⚡'
      }
    ]
  },
  {
    id: 'tales-old',
    title: "Tales of Old",
    category: 'documentary',
    description: "A documentary series exploring real medieval history, leveraging educational partnerships for massive reach.",
    downloads: '4.1M Downloads',
    rating: '4.9 Rating',
    episodes: '72 Episodes',
    imageUrl: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600',
    challenge: "Making historical content accessible and engaging for modern audiences while maintaining historical accuracy and educational value.",
    strategy: [
      'Educational institution partnerships',
      'Expert historian interviews',
      'Narrative storytelling approach',
      'Multi-platform content strategy'
    ],
    results: {
      downloads: '4.1M',
      rating: '4.9★',
      completion: '88%'
    },
    keyLearnings: [
      {
        title: 'Educational Partnerships',
        description: 'Partnerships with universities and museums provided credibility and expanded reach.',
        icon: '🎓'
      },
      {
        title: 'Narrative History',
        description: 'Telling history through stories made complex topics accessible and engaging.',
        icon: '📚'
      },
      {
        title: 'Multi-Platform',
        description: 'Expanding to multiple platforms increased total audience by 200%.',
        icon: '🌐'
      }
    ]
  },
  {
    id: 'elvish-legends',
    title: "Elvish Legends",
    category: 'fantasy',
    description: "An enchanting fantasy series featuring elvish mythology, achieving cult status through fan community engagement.",
    downloads: '1.9M Downloads',
    rating: '4.8 Rating',
    episodes: '42 Episodes',
    imageUrl: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600',
    challenge: "Creating a niche fantasy series that would appeal to a specific audience while building a passionate, dedicated fanbase.",
    strategy: [
      'Niche mythology focus',
      'Fan community cultivation',
      'Premium content strategy',
      'Merchandise integration'
    ],
    results: {
      downloads: '1.9M',
      rating: '4.8★',
      completion: '94%'
    },
    keyLearnings: [
      {
        title: 'Niche Success',
        description: 'Focusing on a specific niche can create deeply passionate audiences.',
        icon: '🏹'
      },
      {
        title: 'Community Cultivation',
        description: 'Careful community building led to the highest fan engagement rates.',
        icon: '🌟'
      },
      {
        title: 'Premium Strategy',
        description: 'Premium content offerings increased per-listener revenue by 150%.',
        icon: '💎'
      }
    ]
  },
  {
    id: 'empire-end',
    title: "Empire's End",
    category: 'adventure',
    description: "An epic war chronicle spanning multiple seasons, revolutionizing podcast storytelling through cinematic audio design.",
    downloads: '5.7M Downloads',
    rating: '4.9 Rating',
    episodes: '84 Episodes',
    imageUrl: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600',
    challenge: "Creating a multi-season epic that would maintain audience interest across a long narrative arc while pushing the boundaries of audio storytelling.",
    strategy: [
      'Cinematic audio design',
      'Multi-season narrative arc',
      'Professional voice cast',
      'Industry award campaigns'
    ],
    results: {
      downloads: '5.7M',
      rating: '4.9★',
      completion: '91%'
    },
    keyLearnings: [
      {
        title: 'Cinematic Audio',
        description: 'Investment in cinematic audio design set new industry standards.',
        icon: '🎬'
      },
      {
        title: 'Long-form Success',
        description: 'Multi-season planning allowed for complex character development.',
        icon: '📖'
      },
      {
        title: 'Industry Recognition',
        description: 'Award campaigns increased credibility and mainstream recognition.',
        icon: '🏆'
      }
    ]
  }
];

export default function Home() {
  const [activeFilter, setActiveFilter] = useState<CategoryFilter>('all');

  const filteredCaseStudies = useMemo(() => {
    if (activeFilter === 'all') {
      return mockCaseStudies;
    }
    return mockCaseStudies.filter(study => study.category === activeFilter);
  }, [activeFilter]);

  return (
    <div className="min-h-screen bg-charcoal text-parchment">
      <Navigation />
      <HeroSection />
      
      {/* Portfolio Filter Section */}
      <section id="portfolio" className="py-20 bg-gradient-to-b from-charcoal to-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-cinzel text-4xl md:text-5xl font-bold text-gold mb-6">Case Studies of Legend</h2>
            <p className="font-crimson text-xl text-parchment max-w-3xl mx-auto">
              Each chronicle tells a tale of triumph, revealing the strategic mastery behind successful podcast campaigns that have captivated audiences across the realm.
            </p>
          </div>

          <FilterTabs onFilterChange={setActiveFilter} />

          {/* Portfolio Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredCaseStudies.map((caseStudy) => (
              <PortfolioCard key={caseStudy.id} caseStudy={caseStudy} />
            ))}
          </div>
        </div>
      </section>

      <CaseStudyModal />
      <AboutSection />
      <ContactForm />
      <Footer />
    </div>
  );
}
