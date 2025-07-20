import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Slider } from '@/components/ui/slider';
import { Lightbulb, Zap, Brain, Cpu, Sparkles, Eye, ArrowLeft } from 'lucide-react';
import { Link } from 'wouter';

interface DigitalEnlightenmentCharacter {
  id: string;
  name: string;
  knowledgeLevel: number;
  enlightenmentStage: 'medieval' | 'awareness' | 'integration' | 'transcendence';
  digitalTraits: string[];
  technomancySkills: string[];
  paradoxesResolved: number;
  fusionAbilities: string[];
}

interface EnlightenmentEvent {
  id: string;
  type: 'discovery' | 'adaptation' | 'paradox' | 'fusion';
  description: string;
  characters: string[];
  technology: string;
  medievalContext: string;
  outcome: string;
  timestamp: Date;
}

interface TechnomancySkill {
  id: string;
  name: string;
  description: string;
  incantations: string[];
  technologyRequired: string[];
  masteryLevel: number;
  effects: string[];
}

export default function DigitalEnlightenmentPage() {
  const [selectedCharacter, setSelectedCharacter] = useState<string | null>(null);
  const [enlightenmentLevel, setEnlightenmentLevel] = useState([50]);
  const [activeSkill, setActiveSkill] = useState<string | null>(null);
  const [fusionMode, setFusionMode] = useState(false);

  // Sample data for the Digital Enlightenment system
  const enlightenmentCharacters: DigitalEnlightenmentCharacter[] = [
    {
      id: 'wilhelm-enhanced',
      name: 'Wilhelm von Schreiber',
      knowledgeLevel: 8,
      enlightenmentStage: 'integration',
      digitalTraits: ['Data Wisdom', 'Algorithm Intuition', 'Binary Scholarship'],
      technomancySkills: ['Network Scrying', 'Data Divination', 'Digital Alchemy'],
      paradoxesResolved: 12,
      fusionAbilities: ['Quantum Manuscripts', 'Holographic Libraries', 'Time-Link Research']
    },
    {
      id: 'greta-enhanced',
      name: 'Greta Żelazna Kuźnia',
      knowledgeLevel: 9,
      enlightenmentStage: 'transcendence',
      digitalTraits: ['Tech-Forge Mastery', 'Circuit Intuition', 'Metal-Silicon Synthesis'],
      technomancySkills: ['Cyber-Enchantment', 'Digital Forging', 'Nano-Crafting'],
      paradoxesResolved: 18,
      fusionAbilities: ['Smart-Metal Creation', 'AI-Hammer Wielding', 'Molecular Assembly']
    },
    {
      id: 'aelindra-enhanced',
      name: 'Aelindra Szept Księżyca',
      knowledgeLevel: 10,
      enlightenmentStage: 'transcendence',
      digitalTraits: ['Quantum Mysticism', 'Digital Nature Bond', 'Cyber-Druidism'],
      technomancySkills: ['Quantum Rituals', 'Bio-Digital Fusion', 'Network Forest Walking'],
      paradoxesResolved: 25,
      fusionAbilities: ['Living Code Manipulation', 'Digital Ecosystem Creation', 'Quantum Forest Networks']
    }
  ];

  const technomancySkills: TechnomancySkill[] = [
    {
      id: 'network-scrying',
      name: 'Sieciowe Wróżbiarstwo',
      description: 'Zdolność przewidywania przyszłości poprzez analizę wzorców cyfrowych i magicznych przepływów danych',
      incantations: ['Przez sieci światła widzę jutro', 'Dane niech mi prawdę objawią', 'Połączenie światów niech się stanie'],
      technologyRequired: ['Neural Networks', 'Quantum Processors', 'Mystical Interfaces'],
      masteryLevel: 3,
      effects: ['Prophecy Accuracy +40%', 'Future Event Detection', 'Cross-Reality Communication']
    },
    {
      id: 'digital-alchemy',
      name: 'Cyfrowa Alchemia',
      description: 'Transmutacja materii poprzez połączenie starożytnych formuł alchemicznych z programowaniem kwantowym',
      incantations: ['Bity w złoto się przemienią', 'Kod życia niech się objawi', 'Materia cyfrowa w rzecz prawdziwą'],
      technologyRequired: ['Quantum Computers', 'Molecular Assemblers', 'Reality Engines'],
      masteryLevel: 4,
      effects: ['Matter Transformation', 'Resource Generation', 'Physical-Digital Bridge']
    },
    {
      id: 'cyber-enchantment',
      name: 'Cyber-Zaklęcia',
      description: 'Nakładanie magicznych efektów na urządzenia technologiczne poprzez hybridowe inkantacje',
      incantations: ['Moc starożytna w krzemie mieszka', 'Duch maszyny niech się przebudzi', 'Magia i technologia w jedności'],
      technologyRequired: ['Smart Materials', 'AI Cores', 'Enchantment Protocols'],
      masteryLevel: 2,
      effects: ['Device Enhancement', 'AI Consciousness', 'Magic-Tech Fusion']
    }
  ];

  const recentEvents: EnlightenmentEvent[] = [
    {
      id: 'event-1',
      type: 'fusion',
      description: 'Wilhelm odkrył sposób na zapisywanie zaklęć w kodzie binarnym, tworząc pierwszą cyfrową księgę czarów',
      characters: ['Wilhelm von Schreiber'],
      technology: 'Quantum Storage',
      medievalContext: 'Ancient Spellbooks',
      outcome: 'Utworzenie Biblioteki Kwantowej',
      timestamp: new Date(Date.now() - 3600000)
    },
    {
      id: 'event-2',
      type: 'paradox',
      description: 'Greta rozwiązała paradoks łączenia magicznego żelaza z nanomateriałami, tworząc nowe zastosowania w kowalstwie',
      characters: ['Greta Żelazna Kuźnia'],
      technology: 'Nanotechnology',
      medievalContext: 'Blacksmithing Traditions',
      outcome: 'Invention of Smart-Metal Alloys',
      timestamp: new Date(Date.now() - 7200000)
    },
    {
      id: 'event-3',
      type: 'discovery',
      description: 'Aelindra nawiązała kontakt z cyfrowym lasem, gdzie dane rosną jak drzewa i algorytmy śpiewają z wiatrem',
      characters: ['Aelindra Szept Księżyca'],
      technology: 'Digital Ecosystems',
      medievalContext: 'Druidic Nature Magic',
      outcome: 'Creation of Living Code Networks',
      timestamp: new Date(Date.now() - 1800000)
    }
  ];

  const getEnlightenmentColor = (stage: string) => {
    switch (stage) {
      case 'medieval': return 'bg-amber-500';
      case 'awareness': return 'bg-blue-500';
      case 'integration': return 'bg-purple-500';
      case 'transcendence': return 'bg-cyan-400';
      default: return 'bg-gray-500';
    }
  };

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'discovery': return <Lightbulb className="w-4 h-4" />;
      case 'adaptation': return <Brain className="w-4 h-4" />;
      case 'paradox': return <Zap className="w-4 h-4" />;
      case 'fusion': return <Sparkles className="w-4 h-4" />;
      default: return <Eye className="w-4 h-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-800 text-white p-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-4 mb-4">
            <Link href="/">
              <button className="flex items-center gap-2 bg-gray-800 hover:bg-gray-700 text-white px-3 py-2 rounded-lg transition-colors duration-300">
                <ArrowLeft className="w-4 h-4" />
                Powrót do Tawerny
              </button>
            </Link>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
              System Cyfrowego Oświecenia
            </h1>
          </div>
          <p className="text-xl text-gray-300 mb-6">
            Fuzja średniowiecznej magii z najnowocześniejszą technologią
          </p>
          <div className="flex justify-center gap-4 mb-6">
            <Badge variant="outline" className="text-cyan-400 border-cyan-400">
              <Cpu className="w-4 h-4 mr-2" />
              Kwantowe Procesy
            </Badge>
            <Badge variant="outline" className="text-purple-400 border-purple-400">
              <Sparkles className="w-4 h-4 mr-2" />
              Magiczno-Technologiczne Fuzje
            </Badge>
            <Badge variant="outline" className="text-blue-400 border-blue-400">
              <Brain className="w-4 h-4 mr-2" />
              AI Świadomość
            </Badge>
          </div>
        </div>

        <Tabs value={fusionMode ? "fusion" : "enlightenment"} className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-6">
            <TabsTrigger value="enlightenment" onClick={() => setFusionMode(false)}>
              Oświecone Postacie
            </TabsTrigger>
            <TabsTrigger value="technomancy">
              Technomancja
            </TabsTrigger>
            <TabsTrigger value="events">
              Wydarzenia
            </TabsTrigger>
            <TabsTrigger value="fusion" onClick={() => setFusionMode(true)}>
              Centrum Fuzji
            </TabsTrigger>
          </TabsList>

          <TabsContent value="enlightenment" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {enlightenmentCharacters.map(character => (
                <Card key={character.id} className="bg-gray-800/50 border-gray-700 hover:border-cyan-400 transition-all duration-300">
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span className="text-cyan-400">{character.name}</span>
                      <Badge className={`${getEnlightenmentColor(character.enlightenmentStage)} text-black`}>
                        {character.enlightenmentStage}
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span>Poziom Wiedzy</span>
                        <span>{character.knowledgeLevel}/10</span>
                      </div>
                      <Progress value={character.knowledgeLevel * 10} className="h-2" />
                    </div>

                    <div>
                      <h4 className="text-sm font-semibold text-purple-400 mb-2">Cechy Cyfrowe:</h4>
                      <div className="flex flex-wrap gap-1">
                        {character.digitalTraits.map(trait => (
                          <Badge key={trait} variant="secondary" className="text-xs">
                            {trait}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="text-sm font-semibold text-cyan-400 mb-2">Umiejętności Fuzji:</h4>
                      <div className="space-y-1">
                        {character.fusionAbilities.slice(0, 2).map(ability => (
                          <div key={ability} className="text-xs text-gray-300 flex items-center">
                            <Sparkles className="w-3 h-3 mr-1 text-purple-400" />
                            {ability}
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="flex justify-between text-xs text-gray-400">
                      <span>Rozwiązane paradoksy: {character.paradoxesResolved}</span>
                      <span>Technomancja: {character.technomancySkills.length}</span>
                    </div>

                    <Button 
                      onClick={() => setSelectedCharacter(character.id)}
                      className="w-full bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-700 hover:to-purple-700"
                    >
                      Eksploruj Oświecenie
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="technomancy" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {technomancySkills.map(skill => (
                <Card key={skill.id} className="bg-gradient-to-br from-purple-900/50 to-blue-900/50 border-purple-700">
                  <CardHeader>
                    <CardTitle className="text-purple-300">{skill.name}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-gray-300 text-sm">{skill.description}</p>
                    
                    <div>
                      <h4 className="text-cyan-400 font-semibold mb-2">Inkantacje:</h4>
                      <div className="space-y-1">
                        {skill.incantations.map((incantation, index) => (
                          <div key={index} className="text-sm italic text-purple-300 border-l-2 border-purple-500 pl-3">
                            "{incantation}"
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="text-blue-400 font-semibold mb-2">Wymagana Technologia:</h4>
                      <div className="flex flex-wrap gap-1">
                        {skill.technologyRequired.map(tech => (
                          <Badge key={tech} variant="outline" className="text-xs border-blue-400 text-blue-400">
                            {tech}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-yellow-400">Poziom Mistrzostwa</span>
                        <span>{skill.masteryLevel}/5</span>
                      </div>
                      <Progress value={skill.masteryLevel * 20} className="h-2" />
                    </div>

                    <Button 
                      onClick={() => setActiveSkill(skill.id)}
                      variant="outline"
                      className="w-full border-purple-500 text-purple-400 hover:bg-purple-500 hover:text-white"
                    >
                      Praktykuj Umiejętność
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="events" className="space-y-6">
            <div className="space-y-4">
              {recentEvents.map(event => (
                <Card key={event.id} className="bg-gray-800/50 border-gray-700">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-full bg-purple-900">
                          {getEventIcon(event.type)}
                        </div>
                        <div>
                          <h3 className="font-semibold text-white">{event.description}</h3>
                          <p className="text-sm text-gray-400">
                            {event.timestamp.toLocaleString('pl-PL')}
                          </p>
                        </div>
                      </div>
                      <Badge variant="outline" className="text-cyan-400 border-cyan-400">
                        {event.type}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                      <div>
                        <h4 className="text-purple-400 font-semibold mb-1">Technologia:</h4>
                        <p className="text-sm text-gray-300">{event.technology}</p>
                      </div>
                      <div>
                        <h4 className="text-amber-400 font-semibold mb-1">Kontekst Średniowieczny:</h4>
                        <p className="text-sm text-gray-300">{event.medievalContext}</p>
                      </div>
                      <div>
                        <h4 className="text-green-400 font-semibold mb-1">Rezultat:</h4>
                        <p className="text-sm text-gray-300">{event.outcome}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="fusion" className="space-y-6">
            <Card className="bg-gradient-to-br from-cyan-900/30 to-purple-900/30 border-cyan-500">
              <CardHeader>
                <CardTitle className="text-center text-2xl text-cyan-300">
                  Centrum Magiczno-Technologicznej Fuzji
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="text-center">
                  <h3 className="text-lg font-semibold text-purple-300 mb-4">
                    Poziom Fuzji Światów
                  </h3>
                  <div className="max-w-md mx-auto space-y-4">
                    <Slider
                      value={enlightenmentLevel}
                      onValueChange={setEnlightenmentLevel}
                      max={100}
                      step={1}
                      className="w-full"
                    />
                    <div className="flex justify-between text-sm text-gray-400">
                      <span>Czysta Magia</span>
                      <span className="text-cyan-300 font-semibold">{enlightenmentLevel[0]}%</span>
                      <span>Czysta Technologia</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card className="bg-amber-900/20 border-amber-600">
                    <CardHeader>
                      <CardTitle className="text-amber-400">Magiczne Komponenty</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span>Mana Crystals</span>
                          <span className="text-cyan-300">∞</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Ancient Runes</span>
                          <span className="text-cyan-300">47</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Spirit Essence</span>
                          <span className="text-cyan-300">23L</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-blue-900/20 border-blue-600">
                    <CardHeader>
                      <CardTitle className="text-blue-400">Tech Resources</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span>Quantum Cores</span>
                          <span className="text-cyan-300">12</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Neural Networks</span>
                          <span className="text-cyan-300">∞</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Data Streams</span>
                          <span className="text-cyan-300">847TB/s</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div className="text-center">
                  <Button className="bg-gradient-to-r from-purple-600 via-cyan-600 to-purple-600 hover:from-purple-700 hover:via-cyan-700 hover:to-purple-700 text-white font-bold py-3 px-8 rounded-lg text-lg">
                    <Sparkles className="w-5 h-5 mr-2" />
                    Inicjuj Wielką Fuzję
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}