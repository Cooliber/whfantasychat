import type { TavernCharacterData } from '../types/warhammer.types';
import type { ConversationMemory } from './conversationMemoryService';
import type { RelationshipDynamics } from './emotionalIntelligenceService';

// Advanced Dialogue Tree Types
export interface DialogueNode {
  id: string;
  type: 'root' | 'branch' | 'leaf' | 'conditional' | 'memory_reference' | 'quest_gate';
  
  // Content
  text: string;
  speakerId: string; // 'player' or character ID
  
  // Conditions for availability
  conditions: DialogueCondition[];
  
  // Consequences of selecting this node
  consequences: DialogueConsequence[];
  
  // Child nodes
  children: string[]; // IDs of child nodes
  
  // Metadata
  priority: number; // Higher priority nodes appear first
  oneTime: boolean; // Can only be selected once
  cooldown?: number; // Minutes before can be selected again
  
  // Memory integration
  memoryTriggers?: MemoryTrigger[];
  memoryReferences?: MemoryReference[];
}

export interface DialogueCondition {
  type: 'relationship' | 'skill' | 'item' | 'quest' | 'secret' | 'memory' | 'emotion' | 'time' | 'faction';
  operator: 'equals' | 'greater_than' | 'less_than' | 'contains' | 'not_contains';
  value: any;
  target?: string; // For relationship/faction conditions
}

export interface DialogueConsequence {
  type: 'relationship' | 'emotion' | 'quest' | 'item' | 'memory' | 'secret' | 'reputation';
  action: 'add' | 'remove' | 'modify' | 'unlock' | 'reveal';
  value: any;
  target?: string;
}

export interface MemoryTrigger {
  type: 'conversation_reference' | 'shared_secret' | 'promise_reminder' | 'emotional_callback';
  memoryId?: string;
  condition: string;
  response: string;
}

export interface MemoryReference {
  type: 'past_conversation' | 'shared_experience' | 'promise' | 'secret';
  memoryId: string;
  integrationText: string;
}

export interface DialogueTree {
  id: string;
  characterId: string;
  rootNodeId: string;
  nodes: Map<string, DialogueNode>;
  
  // Tree metadata
  category: 'greeting' | 'quest' | 'trade' | 'personal' | 'lore' | 'romance' | 'conflict';
  unlockConditions: DialogueCondition[];
  
  // Progression tracking
  visitedNodes: Set<string>;
  lastVisited: Date;
  completionStatus: 'not_started' | 'in_progress' | 'completed' | 'locked';
}

// Advanced Dialogue Manager
export class AdvancedDialogueManager {
  private dialogueTrees: Map<string, DialogueTree[]> = new Map(); // Character ID -> Trees
  private nodeUsageHistory: Map<string, Date> = new Map(); // Node ID -> Last used
  
  // Initialize dialogue trees for a character
  initializeCharacterDialogue(character: TavernCharacterData): void {
    const trees = this.generateDialogueTrees(character);
    this.dialogueTrees.set(character.id, trees);
  }

  // Get available dialogue options based on current state
  getAvailableDialogueOptions(
    characterId: string,
    memory: ConversationMemory,
    relationship: RelationshipDynamics,
    playerState: any
  ): DialogueNode[] {
    const trees = this.dialogueTrees.get(characterId) || [];
    const availableNodes: DialogueNode[] = [];

    trees.forEach(tree => {
      if (this.evaluateTreeConditions(tree, memory, relationship, playerState)) {
        const rootNode = tree.nodes.get(tree.rootNodeId);
        if (rootNode) {
          const childNodes = this.getAvailableChildNodes(tree, rootNode, memory, relationship, playerState);
          availableNodes.push(...childNodes);
        }
      }
    });

    // Sort by priority and filter duplicates
    return availableNodes
      .filter((node, index, self) => self.findIndex(n => n.id === node.id) === index)
      .sort((a, b) => b.priority - a.priority)
      .slice(0, 6); // Limit to 6 options
  }

  // Process dialogue selection and get response
  processDialogueSelection(
    nodeId: string,
    characterId: string,
    memory: ConversationMemory,
    relationship: RelationshipDynamics
  ): {
    response: DialogueNode | null;
    consequences: DialogueConsequence[];
    memoryUpdates: any[];
    nextOptions: DialogueNode[];
  } {
    const trees = this.dialogueTrees.get(characterId) || [];
    let selectedNode: DialogueNode | null = null;
    let parentTree: DialogueTree | null = null;

    // Find the selected node
    for (const tree of trees) {
      const node = tree.nodes.get(nodeId);
      if (node) {
        selectedNode = node;
        parentTree = tree;
        break;
      }
    }

    if (!selectedNode || !parentTree) {
      return { response: null, consequences: [], memoryUpdates: [], nextOptions: [] };
    }

    // Mark node as visited
    parentTree.visitedNodes.add(nodeId);
    this.nodeUsageHistory.set(nodeId, new Date());

    // Process consequences
    const consequences = selectedNode.consequences;
    const memoryUpdates = this.processMemoryTriggers(selectedNode, memory);

    // Get character response (first child node that's a character response)
    let response: DialogueNode | null = null;
    const nextOptions: DialogueNode[] = [];

    selectedNode.children.forEach(childId => {
      const childNode = parentTree!.nodes.get(childId);
      if (childNode) {
        if (childNode.speakerId === characterId && !response) {
          response = childNode;
        } else if (childNode.speakerId === 'player') {
          nextOptions.push(childNode);
        }
      }
    });

    // If response node has children, add them as next options
    if (response) {
      response.children.forEach(childId => {
        const childNode = parentTree!.nodes.get(childId);
        if (childNode && childNode.speakerId === 'player') {
          nextOptions.push(childNode);
        }
      });
    }

    return { response, consequences, memoryUpdates, nextOptions };
  }

  // Generate dialogue trees for character
  private generateDialogueTrees(character: TavernCharacterData): DialogueTree[] {
    const trees: DialogueTree[] = [];

    // Generate greeting tree
    trees.push(this.generateGreetingTree(character));

    // Generate quest trees based on character background
    if (character.goals.length > 0) {
      trees.push(this.generateQuestTree(character));
    }

    // Generate personal story tree
    trees.push(this.generatePersonalTree(character));

    // Generate trade tree if applicable
    if (character.characterClass === 'Merchant' || character.skills.includes('Haggle')) {
      trees.push(this.generateTradeTree(character));
    }

    // Generate romance tree if character is eligible
    if (this.isRomanceEligible(character)) {
      trees.push(this.generateRomanceTree(character));
    }

    // Generate conflict tree for dramatic tension
    trees.push(this.generateConflictTree(character));

    return trees;
  }

  // Generate greeting dialogue tree
  private generateGreetingTree(character: TavernCharacterData): DialogueTree {
    const tree: DialogueTree = {
      id: `greeting-${character.id}`,
      characterId: character.id,
      rootNodeId: 'greeting-root',
      nodes: new Map(),
      category: 'greeting',
      unlockConditions: [],
      visitedNodes: new Set(),
      lastVisited: new Date(),
      completionStatus: 'not_started'
    };

    // Root greeting node
    const greetingNode: DialogueNode = {
      id: 'greeting-root',
      type: 'root',
      text: `Greetings, friend! I am ${character.name}. What brings you to our tavern tonight?`,
      speakerId: character.id,
      conditions: [],
      consequences: [
        { type: 'relationship', action: 'add', value: 2 }
      ],
      children: ['greeting-response-1', 'greeting-response-2', 'greeting-response-3'],
      priority: 100,
      oneTime: false
    };

    // Player response options
    const response1: DialogueNode = {
      id: 'greeting-response-1',
      type: 'branch',
      text: "I'm just looking for good company and conversation.",
      speakerId: 'player',
      conditions: [],
      consequences: [
        { type: 'relationship', action: 'add', value: 3 },
        { type: 'emotion', action: 'add', value: { happiness: 5 } }
      ],
      children: ['greeting-followup-1'],
      priority: 80,
      oneTime: false
    };

    const response2: DialogueNode = {
      id: 'greeting-response-2',
      type: 'branch',
      text: "I'm seeking information about recent events in the region.",
      speakerId: 'player',
      conditions: [],
      consequences: [
        { type: 'relationship', action: 'add', value: 1 },
        { type: 'emotion', action: 'add', value: { suspicion: 2 } }
      ],
      children: ['greeting-followup-2'],
      priority: 70,
      oneTime: false
    };

    const response3: DialogueNode = {
      id: 'greeting-response-3',
      type: 'branch',
      text: "I'm looking for work. Do you know of any opportunities?",
      speakerId: 'player',
      conditions: [],
      consequences: [
        { type: 'relationship', action: 'add', value: 2 },
        { type: 'quest', action: 'unlock', value: 'character-quest-hint' }
      ],
      children: ['greeting-followup-3'],
      priority: 90,
      oneTime: false
    };

    // Character follow-up responses
    const followup1: DialogueNode = {
      id: 'greeting-followup-1',
      type: 'leaf',
      text: "Excellent! I always enjoy meeting fellow travelers. There's nothing quite like sharing stories over a good drink.",
      speakerId: character.id,
      conditions: [],
      consequences: [],
      children: [],
      priority: 50,
      oneTime: false
    };

    const followup2: DialogueNode = {
      id: 'greeting-followup-2',
      type: 'leaf',
      text: "Information, you say? Well, I might know a thing or two... but such knowledge often comes at a price.",
      speakerId: character.id,
      conditions: [],
      consequences: [],
      children: [],
      priority: 50,
      oneTime: false
    };

    const followup3: DialogueNode = {
      id: 'greeting-followup-3',
      type: 'leaf',
      text: "Work? Hmm, as it happens, I might know of something that needs doing. But first, tell me about yourself.",
      speakerId: character.id,
      conditions: [],
      consequences: [],
      children: [],
      priority: 50,
      oneTime: false
    };

    // Add nodes to tree
    tree.nodes.set('greeting-root', greetingNode);
    tree.nodes.set('greeting-response-1', response1);
    tree.nodes.set('greeting-response-2', response2);
    tree.nodes.set('greeting-response-3', response3);
    tree.nodes.set('greeting-followup-1', followup1);
    tree.nodes.set('greeting-followup-2', followup2);
    tree.nodes.set('greeting-followup-3', followup3);

    return tree;
  }

  // Generate quest dialogue tree
  private generateQuestTree(character: TavernCharacterData): DialogueTree {
    const tree: DialogueTree = {
      id: `quest-${character.id}`,
      characterId: character.id,
      rootNodeId: 'quest-root',
      nodes: new Map(),
      category: 'quest',
      unlockConditions: [
        { type: 'relationship', operator: 'greater_than', value: 20, target: character.id }
      ],
      visitedNodes: new Set(),
      lastVisited: new Date(),
      completionStatus: 'not_started'
    };

    const questNode: DialogueNode = {
      id: 'quest-root',
      type: 'conditional',
      text: `Actually, there is something you could help me with. ${character.goals[0] || 'I have a personal matter that requires assistance'}.`,
      speakerId: character.id,
      conditions: [
        { type: 'relationship', operator: 'greater_than', value: 20, target: character.id }
      ],
      consequences: [
        { type: 'quest', action: 'unlock', value: `${character.id}-personal-quest` }
      ],
      children: ['quest-accept', 'quest-decline', 'quest-details'],
      priority: 85,
      oneTime: true
    };

    // Add quest nodes
    tree.nodes.set('quest-root', questNode);

    return tree;
  }

  // Generate personal story tree
  private generatePersonalTree(character: TavernCharacterData): DialogueTree {
    const tree: DialogueTree = {
      id: `personal-${character.id}`,
      characterId: character.id,
      rootNodeId: 'personal-root',
      nodes: new Map(),
      category: 'personal',
      unlockConditions: [
        { type: 'relationship', operator: 'greater_than', value: 40, target: character.id }
      ],
      visitedNodes: new Set(),
      lastVisited: new Date(),
      completionStatus: 'not_started'
    };

    const personalNode: DialogueNode = {
      id: 'personal-root',
      type: 'memory_reference',
      text: `You know, I don't often share this with strangers, but... ${this.generatePersonalStory(character)}`,
      speakerId: character.id,
      conditions: [
        { type: 'relationship', operator: 'greater_than', value: 40, target: character.id }
      ],
      consequences: [
        { type: 'memory', action: 'add', value: 'personal-story-shared' },
        { type: 'relationship', action: 'add', value: 10 }
      ],
      children: [],
      priority: 70,
      oneTime: true,
      memoryTriggers: [
        {
          type: 'conversation_reference',
          condition: 'trust_level > 60',
          response: 'I remember telling you about my past...'
        }
      ]
    };

    tree.nodes.set('personal-root', personalNode);
    return tree;
  }

  // Generate trade dialogue tree
  private generateTradeTree(character: TavernCharacterData): DialogueTree {
    const tree: DialogueTree = {
      id: `trade-${character.id}`,
      characterId: character.id,
      rootNodeId: 'trade-root',
      nodes: new Map(),
      category: 'trade',
      unlockConditions: [],
      visitedNodes: new Set(),
      lastVisited: new Date(),
      completionStatus: 'not_started'
    };

    const tradeNode: DialogueNode = {
      id: 'trade-root',
      type: 'branch',
      text: "Interested in doing some business? I have quality goods at fair prices.",
      speakerId: character.id,
      conditions: [],
      consequences: [],
      children: ['trade-browse', 'trade-negotiate', 'trade-decline'],
      priority: 60,
      oneTime: false
    };

    tree.nodes.set('trade-root', tradeNode);
    return tree;
  }

  // Generate romance dialogue tree
  private generateRomanceTree(character: TavernCharacterData): DialogueTree {
    const tree: DialogueTree = {
      id: `romance-${character.id}`,
      characterId: character.id,
      rootNodeId: 'romance-root',
      nodes: new Map(),
      category: 'romance',
      unlockConditions: [
        { type: 'relationship', operator: 'greater_than', value: 60, target: character.id },
        { type: 'emotion', operator: 'greater_than', value: 30, target: 'attraction' }
      ],
      visitedNodes: new Set(),
      lastVisited: new Date(),
      completionStatus: 'not_started'
    };

    const romanceNode: DialogueNode = {
      id: 'romance-root',
      type: 'conditional',
      text: "*looks at you with warm eyes* I must say, I've grown quite fond of our conversations...",
      speakerId: character.id,
      conditions: [
        { type: 'relationship', operator: 'greater_than', value: 60, target: character.id }
      ],
      consequences: [
        { type: 'emotion', action: 'add', value: { romance: 10 } }
      ],
      children: ['romance-reciprocate', 'romance-deflect'],
      priority: 75,
      oneTime: true
    };

    tree.nodes.set('romance-root', romanceNode);
    return tree;
  }

  // Generate conflict dialogue tree
  private generateConflictTree(character: TavernCharacterData): DialogueTree {
    const tree: DialogueTree = {
      id: `conflict-${character.id}`,
      characterId: character.id,
      rootNodeId: 'conflict-root',
      nodes: new Map(),
      category: 'conflict',
      unlockConditions: [
        { type: 'relationship', operator: 'less_than', value: -20, target: character.id }
      ],
      visitedNodes: new Set(),
      lastVisited: new Date(),
      completionStatus: 'not_started'
    };

    const conflictNode: DialogueNode = {
      id: 'conflict-root',
      type: 'conditional',
      text: "*narrows eyes* I'm not sure I appreciate your tone. Perhaps we should clear the air.",
      speakerId: character.id,
      conditions: [
        { type: 'relationship', operator: 'less_than', value: -20, target: character.id }
      ],
      consequences: [],
      children: ['conflict-apologize', 'conflict-escalate', 'conflict-ignore'],
      priority: 95,
      oneTime: false
    };

    tree.nodes.set('conflict-root', conflictNode);
    return tree;
  }

  // Helper methods
  private evaluateTreeConditions(
    tree: DialogueTree,
    memory: ConversationMemory,
    relationship: RelationshipDynamics,
    playerState: any
  ): boolean {
    return tree.unlockConditions.every(condition => 
      this.evaluateCondition(condition, memory, relationship, playerState)
    );
  }

  private evaluateCondition(
    condition: DialogueCondition,
    memory: ConversationMemory,
    relationship: RelationshipDynamics,
    playerState: any
  ): boolean {
    switch (condition.type) {
      case 'relationship':
        const relationshipValue = relationship.friendship; // Simplified
        return this.compareValues(relationshipValue, condition.operator, condition.value);
      
      case 'memory':
        return memory.conversationSummaries.length > 0; // Simplified
      
      case 'emotion':
        return true; // Simplified for now
      
      default:
        return true;
    }
  }

  private compareValues(actual: any, operator: string, expected: any): boolean {
    switch (operator) {
      case 'equals': return actual === expected;
      case 'greater_than': return actual > expected;
      case 'less_than': return actual < expected;
      case 'contains': return Array.isArray(actual) ? actual.includes(expected) : false;
      case 'not_contains': return Array.isArray(actual) ? !actual.includes(expected) : true;
      default: return false;
    }
  }

  private getAvailableChildNodes(
    tree: DialogueTree,
    parentNode: DialogueNode,
    memory: ConversationMemory,
    relationship: RelationshipDynamics,
    playerState: any
  ): DialogueNode[] {
    const childNodes: DialogueNode[] = [];

    parentNode.children.forEach(childId => {
      const childNode = tree.nodes.get(childId);
      if (childNode && childNode.speakerId === 'player') {
        // Check if node is available
        if (this.isNodeAvailable(childNode, tree, memory, relationship, playerState)) {
          childNodes.push(childNode);
        }
      }
    });

    return childNodes;
  }

  private isNodeAvailable(
    node: DialogueNode,
    tree: DialogueTree,
    memory: ConversationMemory,
    relationship: RelationshipDynamics,
    playerState: any
  ): boolean {
    // Check one-time restriction
    if (node.oneTime && tree.visitedNodes.has(node.id)) {
      return false;
    }

    // Check cooldown
    if (node.cooldown) {
      const lastUsed = this.nodeUsageHistory.get(node.id);
      if (lastUsed) {
        const minutesSinceUse = (Date.now() - lastUsed.getTime()) / (1000 * 60);
        if (minutesSinceUse < node.cooldown) {
          return false;
        }
      }
    }

    // Check conditions
    return node.conditions.every(condition => 
      this.evaluateCondition(condition, memory, relationship, playerState)
    );
  }

  private processMemoryTriggers(node: DialogueNode, memory: ConversationMemory): any[] {
    const updates: any[] = [];

    if (node.memoryTriggers) {
      node.memoryTriggers.forEach(trigger => {
        // Process memory triggers based on type
        updates.push({
          type: trigger.type,
          content: trigger.response,
          timestamp: new Date()
        });
      });
    }

    return updates;
  }

  private generatePersonalStory(character: TavernCharacterData): string {
    const stories = [
      `I wasn't always a ${character.characterClass}. Once, I had dreams of a different life...`,
      `My family... well, let's just say we don't speak anymore. It's complicated.`,
      `I've seen things in my travels that would make your hair stand on end.`,
      `There's a reason I ended up in this tavern, and it's not what you might think.`
    ];

    return stories[Math.floor(Math.random() * stories.length)];
  }

  private isRomanceEligible(character: TavernCharacterData): boolean {
    // Simple eligibility check - can be expanded
    return character.age >= 18 && character.age <= 60 && 
           !character.personalityTraits.includes('Celibate');
  }

  // Public getters
  getDialogueTrees(characterId: string): DialogueTree[] {
    return this.dialogueTrees.get(characterId) || [];
  }

  getDialogueTree(characterId: string, treeId: string): DialogueTree | undefined {
    const trees = this.dialogueTrees.get(characterId) || [];
    return trees.find(tree => tree.id === treeId);
  }
}
