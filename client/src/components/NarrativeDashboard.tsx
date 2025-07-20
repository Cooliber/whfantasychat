import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { ScrollArea } from './ui/scroll-area';
import { Progress } from './ui/progress';
import { 
  BookOpen, 
  Zap, 
  MessageSquare, 
  Clock, 
  Users, 
  Sparkles,
  Eye,
  TrendingUp,
  Network,
  Brain
} from 'lucide-react';
import { 
  generatePlotHook, 
  generateRumor, 
  generateInterconnectedNarrative,
  generateDynamicScene,
  HISTORICAL_EVENTS,
  LORE_ENTRIES,
  type PlotHook,
  type RumorNetwork,
  type HistoricalEvent,
  type LoreEntry
} from '../utils/narrativeEngine';
import type { StoryThreadData, GossipData, SceneType } from '../types/warhammer.types';

interface NarrativeDashboardProps {
  activeCharacters: string[];
  currentScene: SceneType;
  storyThreads: StoryThreadData[];
  rumors: RumorNetwork[];
  onUpdateStoryThread: (thread: StoryThreadData) => void;
  onAddRumor: (rumor: RumorNetwork) => void;
  onGeneratePlotHook: (hook: PlotHook) => void;
}

export function NarrativeDashboard({
  activeCharacters,
  currentScene,
  storyThreads,
  rumors,
  onUpdateStoryThread,
  onAddRumor,
  onGeneratePlotHook
}: NarrativeDashboardProps) {
  const [selectedLore, setSelectedLore] = useState<LoreEntry | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<HistoricalEvent | null>(null);
  const [narrativeInsights, setNarrativeInsights] = useState<any>(null);

  useEffect(() => {
    // Generate narrative insights when data changes
    if (storyThreads.length > 0 || rumors.length > 0) {
      const insights = generateInterconnectedNarrative(activeCharacters, storyThreads, rumors);
      setNarrativeInsights(insights);
    }
  }, [activeCharacters, storyThreads, rumors]);

  const handleGenerateRumor = () => {
    const newRumor = generateRumor(activeCharacters, storyThreads.map(t => t.title));
    onAddRumor(newRumor);
  };

  const handleGeneratePlotHook = () => {
    const newHook = generatePlotHook(activeCharacters, storyThreads.map(t => t.title));
    onGeneratePlotHook(newHook);
  };

  const handleGenerateNarrative = () => {
    if (narrativeInsights) {
      onGeneratePlotHook(narrativeInsights.newPlotHook);
      narrativeInsights.connectedRumors.forEach((rumor: RumorNetwork) => onAddRumor(rumor));
      narrativeInsights.threadEvolutions.forEach((thread: StoryThreadData) => onUpdateStoryThread(thread));
    }
  };

  const getReliabilityColor = (reliability: number) => {
    if (reliability > 0.8) return 'bg-green-500';
    if (reliability > 0.6) return 'bg-yellow-500';
    if (reliability > 0.4) return 'bg-orange-500';
    return 'bg-red-500';
  };

  const getImpactColor = (impact: number) => {
    if (impact > 0.8) return 'destructive';
    if (impact > 0.6) return 'default';
    if (impact > 0.4) return 'secondary';
    return 'outline';
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-4 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="w-5 h-5" />
            Narrative Control Center
          </CardTitle>
          <CardDescription>
            Manage story threads, rumors, and plot hooks for enhanced gameplay
          </CardDescription>
          <div className="flex gap-2">
            <Button onClick={handleGenerateRumor} size="sm" variant="outline">
              <MessageSquare className="w-4 h-4 mr-2" />
              Generate Rumor
            </Button>
            <Button onClick={handleGeneratePlotHook} size="sm" variant="outline">
              <Zap className="w-4 h-4 mr-2" />
              Create Plot Hook
            </Button>
            <Button onClick={handleGenerateNarrative} size="sm">
              <Sparkles className="w-4 h-4 mr-2" />
              Generate Interconnected Narrative
            </Button>
          </div>
        </CardHeader>
      </Card>

      <Tabs defaultValue="threads" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="threads">Story Threads</TabsTrigger>
          <TabsTrigger value="rumors">Rumor Network</TabsTrigger>
          <TabsTrigger value="lore">Lore & History</TabsTrigger>
          <TabsTrigger value="scenes">Scene Dynamics</TabsTrigger>
          <TabsTrigger value="insights">Narrative Insights</TabsTrigger>
        </TabsList>

        <TabsContent value="threads" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {storyThreads.map((thread) => (
              <Card key={thread.id}>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center justify-between">
                    {thread.title}
                    <Badge variant={thread.status === 'active' ? 'default' : 'secondary'}>
                      {thread.status}
                    </Badge>
                  </CardTitle>
                  <CardDescription>{thread.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <Users className="w-4 h-4" />
                        <span className="text-sm font-medium">Participants</span>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {thread.participants.map((participant) => (
                          <Badge key={participant} variant="outline" className="text-xs">
                            {participant}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <Clock className="w-4 h-4" />
                        <span className="text-sm font-medium">Progress</span>
                      </div>
                      <Progress value={(thread.progressMarkers.length / 5) * 100} className="h-2" />
                      <div className="text-xs text-muted-foreground mt-1">
                        {thread.progressMarkers.length} / 5 milestones
                      </div>
                    </div>

                    {thread.progressMarkers.length > 0 && (
                      <div>
                        <div className="text-sm font-medium mb-2">Latest Development</div>
                        <div className="text-sm text-muted-foreground">
                          {thread.progressMarkers[thread.progressMarkers.length - 1].description}
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="rumors" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {rumors.map((rumor) => (
              <Card key={rumor.id}>
                <CardHeader>
                  <CardTitle className="text-sm flex items-center justify-between">
                    <Badge variant={getImpactColor(rumor.impact)}>
                      {rumor.category}
                    </Badge>
                    <div className="flex items-center gap-1">
                      <div className={`w-2 h-2 rounded-full ${getReliabilityColor(rumor.reliability)}`} />
                      <span className="text-xs text-muted-foreground">
                        {Math.round(rumor.reliability * 100)}%
                      </span>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm mb-3">{rumor.content}</p>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span>Source: {rumor.source}</span>
                      <span>Impact: {Math.round(rumor.impact * 100)}%</span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span>Spread Rate: {Math.round(rumor.spreadRate * 100)}%</span>
                      <span>
                        Expires: {rumor.expirationDate?.toLocaleDateString()}
                      </span>
                    </div>
                    {rumor.affectedCharacters.length > 0 && (
                      <div>
                        <div className="text-xs font-medium mb-1">Affected Characters:</div>
                        <div className="flex flex-wrap gap-1">
                          {rumor.affectedCharacters.map((char) => (
                            <Badge key={char} variant="outline" className="text-xs">
                              {char}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="lore" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5" />
                  Historical Events
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-64">
                  <div className="space-y-2">
                    {HISTORICAL_EVENTS.map((event) => (
                      <div
                        key={event.id}
                        className="p-3 border rounded cursor-pointer hover:bg-muted/50"
                        onClick={() => setSelectedEvent(event)}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <h4 className="font-medium text-sm">{event.title}</h4>
                          <Badge variant="outline" className="text-xs">
                            {event.category}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground">{event.date}</p>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Eye className="w-5 h-5" />
                  Lore Entries
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-64">
                  <div className="space-y-2">
                    {LORE_ENTRIES.map((entry) => (
                      <div
                        key={entry.id}
                        className="p-3 border rounded cursor-pointer hover:bg-muted/50"
                        onClick={() => setSelectedLore(entry)}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <h4 className="font-medium text-sm">{entry.title}</h4>
                          <Badge variant="outline" className="text-xs">
                            {entry.category}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge 
                            variant={entry.reliability === 'Confirmed' ? 'default' : 'secondary'}
                            className="text-xs"
                          >
                            {entry.reliability}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>

          {(selectedEvent || selectedLore) && (
            <Card>
              <CardHeader>
                <CardTitle>
                  {selectedEvent ? selectedEvent.title : selectedLore?.title}
                </CardTitle>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => { setSelectedEvent(null); setSelectedLore(null); }}
                >
                  Close
                </Button>
              </CardHeader>
              <CardContent>
                {selectedEvent && (
                  <div className="space-y-4">
                    <p>{selectedEvent.description}</p>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-medium mb-2">Consequences</h4>
                        <ul className="text-sm space-y-1">
                          {selectedEvent.consequences.map((consequence, index) => (
                            <li key={index} className="text-muted-foreground">• {consequence}</li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-medium mb-2">Related Characters</h4>
                        <div className="flex flex-wrap gap-1">
                          {selectedEvent.relatedCharacters.map((char) => (
                            <Badge key={char} variant="outline" className="text-xs">
                              {char}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                {selectedLore && (
                  <div className="space-y-4">
                    <p>{selectedLore.content}</p>
                    <div>
                      <h4 className="font-medium mb-2">Keywords</h4>
                      <div className="flex flex-wrap gap-1">
                        {selectedLore.keywords.map((keyword) => (
                          <Badge key={keyword} variant="secondary" className="text-xs">
                            {keyword}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="scenes" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Current Scene: {currentScene}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Active Characters</h4>
                  <div className="flex flex-wrap gap-2">
                    {activeCharacters.map((char) => (
                      <Badge key={char} variant="default">
                        {char}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium mb-2">Dynamic Events</h4>
                  <div className="space-y-2">
                    {generateDynamicScene(currentScene, activeCharacters, storyThreads, rumors)
                      .dynamicEvents.slice(0, 3).map((event, index) => (
                      <div key={index} className="p-2 bg-muted/50 rounded text-sm">
                        {event}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="insights" className="space-y-4">
          {narrativeInsights && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Network className="w-5 h-5" />
                    Narrative Connections
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <h4 className="font-medium mb-2">Generated Plot Hook</h4>
                      <div className="p-3 border rounded">
                        <h5 className="font-medium">{narrativeInsights.newPlotHook.title}</h5>
                        <p className="text-sm text-muted-foreground mt-1">
                          {narrativeInsights.newPlotHook.description}
                        </p>
                        <div className="flex gap-2 mt-2">
                          <Badge variant="outline">{narrativeInsights.newPlotHook.complexity}</Badge>
                          <Badge variant="secondary">{narrativeInsights.newPlotHook.timeframe}</Badge>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-medium mb-2">Connected Rumors</h4>
                      <div className="space-y-2">
                        {narrativeInsights.connectedRumors.map((rumor: RumorNetwork, index: number) => (
                          <div key={index} className="p-2 border rounded text-sm">
                            <Badge variant="outline" className="mb-1">{rumor.category}</Badge>
                            <p>{rumor.content}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Thread Evolution</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {narrativeInsights.threadEvolutions.map((thread: StoryThreadData, index: number) => (
                      <div key={index} className="p-3 border rounded">
                        <h5 className="font-medium">{thread.title}</h5>
                        <p className="text-sm text-muted-foreground mt-1">
                          Latest: {thread.progressMarkers[thread.progressMarkers.length - 1]?.description}
                        </p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
