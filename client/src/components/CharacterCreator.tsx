import React, { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Textarea } from './ui/textarea';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Dice6, Sparkles, User, Sword, Shield, Cpu } from 'lucide-react';
import { generateRandomCharacter } from '../utils/characterGeneration';
import type { 
  TavernCharacterData, 
  CharacterRace, 
  CharacterClass,
  WeaponType,
  ArmorType,
  CyberneticType,
  TechnologyType
} from '../types/warhammer.types';

interface CharacterCreatorProps {
  onCharacterCreated: (character: TavernCharacterData) => void;
  onClose: () => void;
}

export function CharacterCreator({ onCharacterCreated, onClose }: CharacterCreatorProps) {
  const [character, setCharacter] = useState<Partial<TavernCharacterData>>({
    name: '',
    race: 'Empire',
    characterClass: 'Soldier',
    age: 25,
    personalityTraits: [],
    skills: [],
    equipment: [],
    secrets: [],
    goals: [],
    weapons: [],
    armor: [],
    cybernetics: [],
    technology: []
  });

  const races: CharacterRace[] = ['Empire', 'Dwarf', 'Elf', 'Halfling', 'Bretonnian', 'Tilean', 'Norse'];
  const classes: CharacterClass[] = [
    'Soldier', 'Scholar', 'Blacksmith', 'Ranger', 'Merchant', 'Warrior', 'Mage', 
    'Scout', 'Rogue', 'Innkeeper', 'Burglar', 'Cook', 'Knight', 'Berserker',
    'Witch Hunter', 'Wizard', 'Technomancer', 'Cyber-Knight', 'Digital Alchemist',
    'Quantum Scribe', 'Nano-Smith', 'Bio-Engineer'
  ];

  const weapons: WeaponType[] = [
    'Sword', 'Axe', 'Mace', 'Bow', 'Crossbow', 'Staff', 'Dagger',
    'Plasma Blade', 'Laser Rifle', 'Nano-Sword', 'Quantum Staff',
    'Bio-Weapon', 'Neural Disruptor', 'Cyber-Hammer', 'Digital Bow'
  ];

  const armors: ArmorType[] = [
    'Leather', 'Chain Mail', 'Plate', 'Robes', 'Light Armor',
    'Power Armor', 'Nano-Mesh', 'Bio-Suit', 'Quantum Shield',
    'Cyber-Plate', 'Digital Cloak', 'Neural Interface Suit'
  ];

  const cybernetics: CyberneticType[] = [
    'Neural Implant', 'Cyber Eye', 'Mechanical Arm', 'Data Port',
    'Memory Enhancer', 'Reflex Booster', 'Bio-Scanner', 'Quantum Processor',
    'Nano-Blood', 'Digital Soul', 'Techno-Heart', 'Cyber-Brain'
  ];

  const technologies: TechnologyType[] = [
    'Alchemy Kit', 'Scrying Crystal', 'Enchanted Tools', 'Healing Potions',
    'Quantum Computer', 'Nano-Fabricator', 'Bio-Lab', 'Neural Network',
    'Holographic Projector', 'Time Dilator', 'Matter Compiler', 'AI Assistant'
  ];

  const handleRandomGeneration = () => {
    const randomCharacter = generateRandomCharacter();
    setCharacter(prev => ({ ...prev, ...randomCharacter }));
  };

  const handleSubmit = () => {
    if (!character.name || !character.race || !character.characterClass) {
      alert('Please fill in the required fields: Name, Race, and Class');
      return;
    }

    const fullCharacter: TavernCharacterData = {
      id: `custom-${Date.now()}`,
      name: character.name,
      race: character.race,
      characterClass: character.characterClass,
      age: character.age || 25,
      backstory: character.backstory || 'A mysterious figure with an unknown past.',
      personalityTraits: character.personalityTraits || [],
      conversationPreferences: {
        topics: ['General conversation'],
        avoidanceTopics: [],
        initiationLikelihood: 0.5,
        responseStyle: 'casual'
      },
      currentMood: 'Neutral',
      relationshipModifiers: {},
      skills: character.skills || [],
      equipment: character.equipment || [],
      secrets: character.secrets || [],
      goals: character.goals || [],
      appearance: character.appearance,
      weapons: character.weapons,
      armor: character.armor,
      cybernetics: character.cybernetics,
      technology: character.technology,
      attributes: character.attributes,
      origin: character.origin,
      questHooks: character.questHooks,
      rumors: character.rumors,
      connections: character.connections
    };

    onCharacterCreated(fullCharacter);
  };

  const addToArray = (field: keyof TavernCharacterData, value: string) => {
    setCharacter(prev => ({
      ...prev,
      [field]: [...(prev[field] as string[] || []), value]
    }));
  };

  const removeFromArray = (field: keyof TavernCharacterData, index: number) => {
    setCharacter(prev => ({
      ...prev,
      [field]: (prev[field] as string[] || []).filter((_, i) => i !== index)
    }));
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="w-5 h-5" />
            Character Creator
          </CardTitle>
          <CardDescription>
            Create a new character for the Warhammer Fantasy Tavern
          </CardDescription>
          <div className="flex gap-2">
            <Button onClick={handleRandomGeneration} variant="outline" size="sm">
              <Dice6 className="w-4 h-4 mr-2" />
              Random Generate
            </Button>
            <Button onClick={onClose} variant="outline" size="sm">
              Cancel
            </Button>
            <Button onClick={handleSubmit} size="sm">
              <Sparkles className="w-4 h-4 mr-2" />
              Create Character
            </Button>
          </div>
        </CardHeader>

        <CardContent>
          <Tabs defaultValue="basic" className="w-full">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="basic">Basic</TabsTrigger>
              <TabsTrigger value="equipment">Equipment</TabsTrigger>
              <TabsTrigger value="tech">Technology</TabsTrigger>
              <TabsTrigger value="background">Background</TabsTrigger>
              <TabsTrigger value="narrative">Narrative</TabsTrigger>
            </TabsList>

            <TabsContent value="basic" className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Name *</Label>
                  <Input
                    id="name"
                    value={character.name || ''}
                    onChange={(e) => setCharacter(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Character name"
                  />
                </div>
                <div>
                  <Label htmlFor="age">Age</Label>
                  <Input
                    id="age"
                    type="number"
                    value={character.age || ''}
                    onChange={(e) => setCharacter(prev => ({ ...prev, age: parseInt(e.target.value) }))}
                    placeholder="25"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="race">Race *</Label>
                  <Select value={character.race} onValueChange={(value: CharacterRace) => 
                    setCharacter(prev => ({ ...prev, race: value }))
                  }>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {races.map(race => (
                        <SelectItem key={race} value={race}>{race}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="class">Class *</Label>
                  <Select value={character.characterClass} onValueChange={(value: CharacterClass) => 
                    setCharacter(prev => ({ ...prev, characterClass: value }))
                  }>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {classes.map(cls => (
                        <SelectItem key={cls} value={cls}>{cls}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="backstory">Backstory</Label>
                <Textarea
                  id="backstory"
                  value={character.backstory || ''}
                  onChange={(e) => setCharacter(prev => ({ ...prev, backstory: e.target.value }))}
                  placeholder="Character's background and history..."
                  rows={3}
                />
              </div>

              <div>
                <Label>Personality Traits</Label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {character.personalityTraits?.map((trait, index) => (
                    <Badge key={index} variant="secondary" className="cursor-pointer"
                           onClick={() => removeFromArray('personalityTraits', index)}>
                      {trait} ×
                    </Badge>
                  ))}
                </div>
                <Input
                  placeholder="Add personality trait..."
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      const value = (e.target as HTMLInputElement).value.trim();
                      if (value) {
                        addToArray('personalityTraits', value);
                        (e.target as HTMLInputElement).value = '';
                      }
                    }
                  }}
                  className="mt-2"
                />
              </div>
            </TabsContent>

            <TabsContent value="equipment" className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="flex items-center gap-2">
                    <Sword className="w-4 h-4" />
                    Weapons
                  </Label>
                  <Select onValueChange={(value: WeaponType) => addToArray('weapons', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Add weapon..." />
                    </SelectTrigger>
                    <SelectContent>
                      {weapons.map(weapon => (
                        <SelectItem key={weapon} value={weapon}>{weapon}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {character.weapons?.map((weapon, index) => (
                      <Badge key={index} variant="outline" className="cursor-pointer"
                             onClick={() => removeFromArray('weapons', index)}>
                        {weapon} ×
                      </Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <Label className="flex items-center gap-2">
                    <Shield className="w-4 h-4" />
                    Armor
                  </Label>
                  <Select onValueChange={(value: ArmorType) => addToArray('armor', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Add armor..." />
                    </SelectTrigger>
                    <SelectContent>
                      {armors.map(armor => (
                        <SelectItem key={armor} value={armor}>{armor}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {character.armor?.map((armor, index) => (
                      <Badge key={index} variant="outline" className="cursor-pointer"
                             onClick={() => removeFromArray('armor', index)}>
                        {armor} ×
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="tech" className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="flex items-center gap-2">
                    <Cpu className="w-4 h-4" />
                    Cybernetics
                  </Label>
                  <Select onValueChange={(value: CyberneticType) => addToArray('cybernetics', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Add cybernetic..." />
                    </SelectTrigger>
                    <SelectContent>
                      {cybernetics.map(cyber => (
                        <SelectItem key={cyber} value={cyber}>{cyber}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {character.cybernetics?.map((cyber, index) => (
                      <Badge key={index} variant="secondary" className="cursor-pointer"
                             onClick={() => removeFromArray('cybernetics', index)}>
                        {cyber} ×
                      </Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <Label>Technology</Label>
                  <Select onValueChange={(value: TechnologyType) => addToArray('technology', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Add technology..." />
                    </SelectTrigger>
                    <SelectContent>
                      {technologies.map(tech => (
                        <SelectItem key={tech} value={tech}>{tech}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {character.technology?.map((tech, index) => (
                      <Badge key={index} variant="secondary" className="cursor-pointer"
                             onClick={() => removeFromArray('technology', index)}>
                        {tech} ×
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="background" className="space-y-4">
              {character.appearance && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Height</Label>
                    <Input value={character.appearance.height || ''} readOnly />
                  </div>
                  <div>
                    <Label>Build</Label>
                    <Input value={character.appearance.build || ''} readOnly />
                  </div>
                </div>
              )}

              {character.attributes && (
                <div>
                  <Label>Attributes</Label>
                  <div className="grid grid-cols-3 gap-2 mt-2">
                    <div className="text-sm">Strength: {character.attributes.strength}</div>
                    <div className="text-sm">Dexterity: {character.attributes.dexterity}</div>
                    <div className="text-sm">Intelligence: {character.attributes.intelligence}</div>
                    <div className="text-sm">Charisma: {character.attributes.charisma}</div>
                    <div className="text-sm">Tech Affinity: {character.attributes.techAffinity}</div>
                    <div className="text-sm">Magic Resistance: {character.attributes.magicResistance}</div>
                  </div>
                </div>
              )}

              {character.origin && (
                <div>
                  <Label>Origin</Label>
                  <div className="space-y-2 mt-2 text-sm">
                    <div>Birthplace: {character.origin.birthplace}</div>
                    <div>Social Class: {character.origin.socialClass}</div>
                    <div>Education: {character.origin.education}</div>
                    <div>Formative Event: {character.origin.formativeEvent}</div>
                  </div>
                </div>
              )}
            </TabsContent>

            <TabsContent value="narrative" className="space-y-4">
              <div>
                <Label>Skills</Label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {character.skills?.map((skill, index) => (
                    <Badge key={index} variant="outline" className="cursor-pointer"
                           onClick={() => removeFromArray('skills', index)}>
                      {skill} ×
                    </Badge>
                  ))}
                </div>
                <Input
                  placeholder="Add skill..."
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      const value = (e.target as HTMLInputElement).value.trim();
                      if (value) {
                        addToArray('skills', value);
                        (e.target as HTMLInputElement).value = '';
                      }
                    }
                  }}
                  className="mt-2"
                />
              </div>

              <div>
                <Label>Secrets</Label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {character.secrets?.map((secret, index) => (
                    <Badge key={index} variant="destructive" className="cursor-pointer"
                           onClick={() => removeFromArray('secrets', index)}>
                      {secret} ×
                    </Badge>
                  ))}
                </div>
                <Input
                  placeholder="Add secret..."
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      const value = (e.target as HTMLInputElement).value.trim();
                      if (value) {
                        addToArray('secrets', value);
                        (e.target as HTMLInputElement).value = '';
                      }
                    }
                  }}
                  className="mt-2"
                />
              </div>

              <div>
                <Label>Goals</Label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {character.goals?.map((goal, index) => (
                    <Badge key={index} variant="default" className="cursor-pointer"
                           onClick={() => removeFromArray('goals', index)}>
                      {goal} ×
                    </Badge>
                  ))}
                </div>
                <Input
                  placeholder="Add goal..."
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      const value = (e.target as HTMLInputElement).value.trim();
                      if (value) {
                        addToArray('goals', value);
                        (e.target as HTMLInputElement).value = '';
                      }
                    }
                  }}
                  className="mt-2"
                />
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
