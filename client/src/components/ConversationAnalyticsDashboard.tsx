import React, { useState, useEffect } from 'react';
import { useTavernStore } from '../stores/tavernStore';
import type { ConversationMemory } from '../services/conversationMemoryService';
import type { RelationshipDynamics } from '../services/emotionalIntelligenceService';

interface AnalyticsData {
  conversationStats: {
    totalConversations: number;
    averageLength: number;
    successRate: number;
    favoriteTopics: string[];
  };
  relationshipProgress: Array<{
    characterId: string;
    characterName: string;
    relationshipLevel: number;
    trustLevel: number;
    relationshipStatus: string;
    progressTrend: 'improving' | 'declining' | 'stable';
  }>;
  secretsAndInformation: {
    secretsDiscovered: number;
    informationGathered: string[];
    questsUnlocked: number;
    reputationGained: number;
  };
  characterInsights: Array<{
    characterId: string;
    characterName: string;
    personalityProfile: string[];
    conversationPreferences: string[];
    emotionalTriggers: string[];
    bestApproaches: string[];
  }>;
  conversationSkills: {
    persuasion: number;
    investigation: number;
    social: number;
    cultural: number;
    negotiation: number;
  };
  achievements: Array<{
    id: string;
    title: string;
    description: string;
    unlockedDate: Date;
    rarity: 'common' | 'uncommon' | 'rare' | 'legendary';
  }>;
}

export const ConversationAnalyticsDashboard: React.FC = () => {
  const { characters, conversationManager } = useTavernStore();
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [selectedTab, setSelectedTab] = useState<'overview' | 'relationships' | 'insights' | 'achievements'>('overview');
  const [selectedCharacter, setSelectedCharacter] = useState<string>('');

  useEffect(() => {
    if (conversationManager) {
      const data = generateAnalyticsData();
      setAnalyticsData(data);
    }
  }, [conversationManager, characters]);

  const generateAnalyticsData = (): AnalyticsData => {
    // This would integrate with the actual memory and analytics services
    // For now, generating mock data that demonstrates the dashboard capabilities
    
    const characterArray = Array.from(characters.values());
    
    return {
      conversationStats: {
        totalConversations: 47,
        averageLength: 8.5,
        successRate: 73,
        favoriteTopics: ['Trade', 'Regional News', 'Personal Stories', 'Quests', 'Cultural Exchange']
      },
      relationshipProgress: characterArray.slice(0, 5).map((char, index) => ({
        characterId: char.id,
        characterName: char.name,
        relationshipLevel: 45 + (index * 15),
        trustLevel: 50 + (index * 10),
        relationshipStatus: ['Acquaintance', 'Friend', 'Close Friend', 'Trusted Ally', 'Best Friend'][index],
        progressTrend: ['improving', 'stable', 'improving', 'declining', 'improving'][index] as any
      })),
      secretsAndInformation: {
        secretsDiscovered: 12,
        informationGathered: [
          'Trade route disruptions in the north',
          'Political tensions between Empire and Bretonnia',
          'Mysterious disappearances near the forest',
          'Underground smuggling network',
          'Noble family scandal'
        ],
        questsUnlocked: 8,
        reputationGained: 156
      },
      characterInsights: characterArray.slice(0, 3).map(char => ({
        characterId: char.id,
        characterName: char.name,
        personalityProfile: char.personalityTraits.slice(0, 3),
        conversationPreferences: [
          'Prefers direct communication',
          'Enjoys discussing trade',
          'Responds well to humor',
          'Values honesty above all'
        ],
        emotionalTriggers: [
          'Mentions of family',
          'Discussion of past failures',
          'Questions about loyalty'
        ],
        bestApproaches: [
          'Start with casual topics',
          'Show genuine interest',
          'Offer mutual benefit',
          'Respect their expertise'
        ]
      })),
      conversationSkills: {
        persuasion: 67,
        investigation: 73,
        social: 81,
        cultural: 59,
        negotiation: 64
      },
      achievements: [
        {
          id: 'first-friend',
          title: 'First Friend',
          description: 'Establish your first friendship in the tavern',
          unlockedDate: new Date('2024-01-15'),
          rarity: 'common'
        },
        {
          id: 'secret-keeper',
          title: 'Secret Keeper',
          description: 'Be trusted with 10 character secrets',
          unlockedDate: new Date('2024-01-20'),
          rarity: 'uncommon'
        },
        {
          id: 'master-negotiator',
          title: 'Master Negotiator',
          description: 'Successfully complete 5 persuasion contests',
          unlockedDate: new Date('2024-01-25'),
          rarity: 'rare'
        },
        {
          id: 'cultural-ambassador',
          title: 'Cultural Ambassador',
          description: 'Build relationships with characters from 5 different regions',
          unlockedDate: new Date('2024-01-30'),
          rarity: 'legendary'
        }
      ]
    };
  };

  const getProgressColor = (value: number): string => {
    if (value >= 80) return 'bg-green-500';
    if (value >= 60) return 'bg-blue-500';
    if (value >= 40) return 'bg-yellow-500';
    if (value >= 20) return 'bg-orange-500';
    return 'bg-red-500';
  };

  const getTrendIcon = (trend: string): string => {
    switch (trend) {
      case 'improving': return '📈';
      case 'declining': return '📉';
      case 'stable': return '➡️';
      default: return '➡️';
    }
  };

  const getRarityColor = (rarity: string): string => {
    switch (rarity) {
      case 'common': return 'text-gray-600';
      case 'uncommon': return 'text-green-600';
      case 'rare': return 'text-blue-600';
      case 'legendary': return 'text-purple-600';
      default: return 'text-gray-600';
    }
  };

  if (!analyticsData) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-wood mx-auto mb-4"></div>
          <p className="text-gray-600">Loading conversation analytics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-parchment min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-charcoal mb-2">
            📊 Conversation Analytics Dashboard
          </h1>
          <p className="text-gray-600">
            Track your social progress, relationship building, and conversation mastery in the Warhammer Fantasy Tavern
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex space-x-1 mb-8 bg-white rounded-lg p-1 shadow-md">
          {[
            { id: 'overview', label: '📈 Overview', icon: '📈' },
            { id: 'relationships', label: '👥 Relationships', icon: '👥' },
            { id: 'insights', label: '🧠 Character Insights', icon: '🧠' },
            { id: 'achievements', label: '🏆 Achievements', icon: '🏆' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedTab(tab.id as any)}
              className={`flex-1 py-3 px-4 rounded-md font-medium transition-colors ${
                selectedTab === tab.id
                  ? 'bg-wood text-parchment shadow-md'
                  : 'text-gray-600 hover:text-charcoal hover:bg-gray-50'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Overview Tab */}
        {selectedTab === 'overview' && (
          <div className="space-y-8">
            {/* Conversation Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white rounded-lg p-6 shadow-md border-l-4 border-blue-500">
                <h3 className="text-lg font-semibold text-charcoal mb-2">Total Conversations</h3>
                <p className="text-3xl font-bold text-blue-600">{analyticsData.conversationStats.totalConversations}</p>
                <p className="text-sm text-gray-600 mt-1">Across all characters</p>
              </div>
              
              <div className="bg-white rounded-lg p-6 shadow-md border-l-4 border-green-500">
                <h3 className="text-lg font-semibold text-charcoal mb-2">Average Length</h3>
                <p className="text-3xl font-bold text-green-600">{analyticsData.conversationStats.averageLength} min</p>
                <p className="text-sm text-gray-600 mt-1">Per conversation</p>
              </div>
              
              <div className="bg-white rounded-lg p-6 shadow-md border-l-4 border-purple-500">
                <h3 className="text-lg font-semibold text-charcoal mb-2">Success Rate</h3>
                <p className="text-3xl font-bold text-purple-600">{analyticsData.conversationStats.successRate}%</p>
                <p className="text-sm text-gray-600 mt-1">Positive outcomes</p>
              </div>
              
              <div className="bg-white rounded-lg p-6 shadow-md border-l-4 border-orange-500">
                <h3 className="text-lg font-semibold text-charcoal mb-2">Secrets Discovered</h3>
                <p className="text-3xl font-bold text-orange-600">{analyticsData.secretsAndInformation.secretsDiscovered}</p>
                <p className="text-sm text-gray-600 mt-1">Hidden information</p>
              </div>
            </div>

            {/* Conversation Skills */}
            <div className="bg-white rounded-lg p-6 shadow-md">
              <h3 className="text-xl font-bold text-charcoal mb-4">🎯 Conversation Skills</h3>
              <div className="space-y-4">
                {Object.entries(analyticsData.conversationSkills).map(([skill, value]) => (
                  <div key={skill} className="flex items-center">
                    <div className="w-32 text-sm font-medium text-gray-700 capitalize">
                      {skill.replace('_', ' ')}
                    </div>
                    <div className="flex-1 mx-4">
                      <div className="bg-gray-200 rounded-full h-3">
                        <div
                          className={`h-3 rounded-full ${getProgressColor(value)} transition-all duration-500`}
                          style={{ width: `${value}%` }}
                        ></div>
                      </div>
                    </div>
                    <div className="w-12 text-sm font-bold text-gray-700">
                      {value}%
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Favorite Topics */}
            <div className="bg-white rounded-lg p-6 shadow-md">
              <h3 className="text-xl font-bold text-charcoal mb-4">💬 Favorite Conversation Topics</h3>
              <div className="flex flex-wrap gap-2">
                {analyticsData.conversationStats.favoriteTopics.map((topic, index) => (
                  <span
                    key={topic}
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      index === 0 ? 'bg-gold text-charcoal' :
                      index === 1 ? 'bg-forest text-parchment' :
                      'bg-gray-200 text-gray-700'
                    }`}
                  >
                    {topic}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Relationships Tab */}
        {selectedTab === 'relationships' && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg p-6 shadow-md">
              <h3 className="text-xl font-bold text-charcoal mb-4">👥 Relationship Progress</h3>
              <div className="space-y-4">
                {analyticsData.relationshipProgress.map((relationship) => (
                  <div key={relationship.characterId} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-charcoal rounded-full flex items-center justify-center text-gold font-bold">
                          {relationship.characterName.charAt(0)}
                        </div>
                        <div>
                          <h4 className="font-semibold text-charcoal">{relationship.characterName}</h4>
                          <p className="text-sm text-gray-600">{relationship.relationshipStatus}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-2xl">{getTrendIcon(relationship.progressTrend)}</span>
                        <span className="text-sm font-medium text-gray-600">
                          {relationship.progressTrend}
                        </span>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Relationship Level</span>
                          <span>{relationship.relationshipLevel}%</span>
                        </div>
                        <div className="bg-gray-200 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full ${getProgressColor(relationship.relationshipLevel)} transition-all duration-500`}
                            style={{ width: `${relationship.relationshipLevel}%` }}
                          ></div>
                        </div>
                      </div>
                      
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Trust Level</span>
                          <span>{relationship.trustLevel}%</span>
                        </div>
                        <div className="bg-gray-200 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full ${getProgressColor(relationship.trustLevel)} transition-all duration-500`}
                            style={{ width: `${relationship.trustLevel}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Character Insights Tab */}
        {selectedTab === 'insights' && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg p-6 shadow-md">
              <h3 className="text-xl font-bold text-charcoal mb-4">🧠 Character Insights</h3>
              
              {/* Character Selector */}
              <div className="mb-6">
                <select
                  value={selectedCharacter}
                  onChange={(e) => setSelectedCharacter(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-wood focus:border-transparent"
                >
                  <option value="">Select a character to view detailed insights</option>
                  {analyticsData.characterInsights.map((insight) => (
                    <option key={insight.characterId} value={insight.characterId}>
                      {insight.characterName}
                    </option>
                  ))}
                </select>
              </div>

              {selectedCharacter && (
                <div className="space-y-6">
                  {analyticsData.characterInsights
                    .filter(insight => insight.characterId === selectedCharacter)
                    .map((insight) => (
                      <div key={insight.characterId} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="bg-blue-50 rounded-lg p-4">
                            <h4 className="font-semibold text-blue-800 mb-2">🎭 Personality Profile</h4>
                            <div className="space-y-1">
                              {insight.personalityProfile.map((trait) => (
                                <span key={trait} className="inline-block bg-blue-200 text-blue-800 px-2 py-1 rounded text-sm mr-2 mb-1">
                                  {trait}
                                </span>
                              ))}
                            </div>
                          </div>
                          
                          <div className="bg-green-50 rounded-lg p-4">
                            <h4 className="font-semibold text-green-800 mb-2">💬 Conversation Preferences</h4>
                            <ul className="space-y-1 text-sm text-green-700">
                              {insight.conversationPreferences.map((pref, index) => (
                                <li key={index} className="flex items-start">
                                  <span className="text-green-500 mr-2">•</span>
                                  {pref}
                                </li>
                              ))}
                            </ul>
                          </div>
                          
                          <div className="bg-red-50 rounded-lg p-4">
                            <h4 className="font-semibold text-red-800 mb-2">⚠️ Emotional Triggers</h4>
                            <ul className="space-y-1 text-sm text-red-700">
                              {insight.emotionalTriggers.map((trigger, index) => (
                                <li key={index} className="flex items-start">
                                  <span className="text-red-500 mr-2">•</span>
                                  {trigger}
                                </li>
                              ))}
                            </ul>
                          </div>
                          
                          <div className="bg-purple-50 rounded-lg p-4">
                            <h4 className="font-semibold text-purple-800 mb-2">✨ Best Approaches</h4>
                            <ul className="space-y-1 text-sm text-purple-700">
                              {insight.bestApproaches.map((approach, index) => (
                                <li key={index} className="flex items-start">
                                  <span className="text-purple-500 mr-2">•</span>
                                  {approach}
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Achievements Tab */}
        {selectedTab === 'achievements' && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg p-6 shadow-md">
              <h3 className="text-xl font-bold text-charcoal mb-4">🏆 Conversation Achievements</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {analyticsData.achievements.map((achievement) => (
                  <div key={achievement.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex items-start space-x-3">
                      <div className="text-3xl">🏆</div>
                      <div className="flex-1">
                        <h4 className={`font-semibold ${getRarityColor(achievement.rarity)}`}>
                          {achievement.title}
                        </h4>
                        <p className="text-sm text-gray-600 mb-2">{achievement.description}</p>
                        <div className="flex items-center justify-between">
                          <span className={`text-xs font-medium px-2 py-1 rounded ${
                            achievement.rarity === 'common' ? 'bg-gray-100 text-gray-600' :
                            achievement.rarity === 'uncommon' ? 'bg-green-100 text-green-600' :
                            achievement.rarity === 'rare' ? 'bg-blue-100 text-blue-600' :
                            'bg-purple-100 text-purple-600'
                          }`}>
                            {achievement.rarity.toUpperCase()}
                          </span>
                          <span className="text-xs text-gray-500">
                            {achievement.unlockedDate.toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
