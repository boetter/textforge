import { pgTable, text, serial, integer, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User model
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// Preset model for saving style guides and example texts
export const presetSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, "Navn er påkrævet"),
  styleGuide: z.string(),
  exampleTexts: z.string(),
});

export type Preset = z.infer<typeof presetSchema>;

// Supporterede sprog
export const SUPPORTED_LANGUAGES = ["dansk", "norsk", "svensk", "engelsk"] as const;

// AI Text Enhancement models and schemas
export const textEnhanceSchema = z.object({
  originalText: z.string().min(1, "Text is required"),
  model: z.enum(["claude", "gemini", "chatgpt"]),
  styleGuide: z.string().optional(),
  exampleTexts: z.string().optional(),
  instructions: z.string().optional(), // Særlige instruktioner til modellen
  presetId: z.string().optional(),
  language: z.enum(SUPPORTED_LANGUAGES).default("dansk"),
});

export type TextEnhanceRequest = z.infer<typeof textEnhanceSchema>;

export const textEnhanceResponseSchema = z.object({
  enhancedText: z.string(),
  model: z.string(),
  timestamp: z.string(),
});

export type TextEnhanceResponse = z.infer<typeof textEnhanceResponseSchema>;
