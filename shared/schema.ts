import { pgTable, text, serial, integer, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Core character system
export const tavernCharacters = pgTable("tavern_characters", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  race: text("race").notNull(),
  characterClass: text("character_class").notNull(),
  personalityTraits: text("personality_traits").notNull().array(),
  backstory: text("backstory").notNull(),
  speechPatterns: jsonb("speech_patterns").notNull(),
  relationships: jsonb("relationships").notNull(),
  conversationPreferences: jsonb("conversation_preferences").notNull(),
  narrativeRoles: jsonb("narrative_roles").notNull(),
});

// Conversation system
export const conversations = pgTable("conversations", {
  id: text("id").primaryKey(),
  timestamp: timestamp("timestamp").notNull(),
  sceneContext: text("scene_context").notNull(),
  participants: text("participants").notNull().array(),
  messages: jsonb("messages").notNull(),
  topicTags: text("topic_tags").notNull().array(),
  emotionalTone: text("emotional_tone").notNull(),
  plotRelevanceScore: integer("plot_relevance_score").notNull(),
  storyThreadIds: text("story_thread_ids").notNull().array(),
  gossipGenerated: jsonb("gossip_generated").notNull(),
  playerChoices: jsonb("player_choices").notNull(),
});

// Story system
export const storyThreads = pgTable("story_threads", {
  id: text("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  status: text("status").notNull(), // active, completed, paused
  participants: text("participants").notNull().array(),
  scenes: text("scenes").notNull().array(),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
});

// Gossip system
export const gossipItems = pgTable("gossip_items", {
  id: text("id").primaryKey(),
  content: text("content").notNull(),
  category: text("category").notNull(),
  source: text("source").notNull(),
  targets: text("targets").notNull().array(),
  veracity: boolean("veracity").notNull(), // true/false for accuracy
  spreadCount: integer("spread_count").notNull().default(0),
  createdAt: timestamp("created_at").notNull(),
});

// Scene system
export const tavernScenes = pgTable("tavern_scenes", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  atmosphere: text("atmosphere").notNull(),
  activeCharacters: text("active_characters").notNull().array(),
  availableActions: jsonb("available_actions").notNull(),
  backgroundMusic: text("background_music"),
  isActive: boolean("is_active").notNull().default(false),
});

// Legacy tables for backward compatibility
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const contactSubmissions = pgTable("contact_submissions", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  projectType: text("project_type").notNull(),
  message: text("message").notNull(),
  createdAt: text("created_at").notNull(),
});

// Zod schemas for validation
export const insertTavernCharacterSchema = createInsertSchema(tavernCharacters);
export const insertConversationSchema = createInsertSchema(conversations);
export const insertStoryThreadSchema = createInsertSchema(storyThreads);
export const insertGossipItemSchema = createInsertSchema(gossipItems);
export const insertTavernSceneSchema = createInsertSchema(tavernScenes);

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertContactSubmissionSchema = createInsertSchema(contactSubmissions).omit({
  id: true,
});

// TypeScript types
export type TavernCharacter = typeof tavernCharacters.$inferSelect;
export type InsertTavernCharacter = z.infer<typeof insertTavernCharacterSchema>;

export type Conversation = typeof conversations.$inferSelect;
export type InsertConversation = z.infer<typeof insertConversationSchema>;

export type StoryThread = typeof storyThreads.$inferSelect;
export type InsertStoryThread = z.infer<typeof insertStoryThreadSchema>;

export type GossipItem = typeof gossipItems.$inferSelect;
export type InsertGossipItem = z.infer<typeof insertGossipItemSchema>;

export type TavernScene = typeof tavernScenes.$inferSelect;
export type InsertTavernScene = z.infer<typeof insertTavernSceneSchema>;

export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type ContactSubmission = typeof contactSubmissions.$inferSelect;
export type InsertContactSubmission = z.infer<typeof insertContactSubmissionSchema>;

// Enums and constants
export const WarhammerRaces = ["Empire", "Dwarf", "Elf", "Halfling", "Bretonnian", "Tilean", "Norse"] as const;
export const SceneTypes = ["Quiet Evening", "Busy Market Day", "Storm Night", "Festival Celebration", "Mysterious Gathering"] as const;
export const RelationshipTypes = ["allied", "friendly", "neutral", "suspicious", "hostile"] as const;
export const GossipTypes = ["rumor", "secret", "news", "prophecy", "scandal"] as const;

export type WarhammerRace = typeof WarhammerRaces[number];
export type SceneType = typeof SceneTypes[number];
export type RelationshipType = typeof RelationshipTypes[number];
export type GossipType = typeof GossipTypes[number];
