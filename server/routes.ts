import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { textEnhanceSchema, presetSchema } from "@shared/schema";
import { 
  processWithClaude, 
  processWithGemini, 
  processWithGPT 
} from "./api/ai";

export async function registerRoutes(app: Express): Promise<Server> {
  // Text enhancement endpoint
  app.post("/api/enhance", async (req, res) => {
    try {
      // Validate request body
      const validationResult = textEnhanceSchema.safeParse(req.body);
      
      if (!validationResult.success) {
        return res.status(400).json({ 
          message: "Invalid request data", 
          errors: validationResult.error.errors 
        });
      }
      
      const { 
        originalText, 
        model, 
        styleGuide = "", 
        exampleTexts = "", 
        instructions = "", 
        language = "dansk" 
      } = validationResult.data;
      
      // Process with selected model
      let enhancedText: string;
      let usedModel: string;
      
      switch (model) {
        case "claude":
          enhancedText = await processWithClaude(originalText, styleGuide, exampleTexts, language, instructions);
          usedModel = "Claude 3.7 Sonnet";
          break;
        case "gemini":
          enhancedText = await processWithGemini(originalText, styleGuide, exampleTexts, language, instructions);
          usedModel = "Gemini 2.5 Pro (Exp)";
          break;
        case "chatgpt":
          enhancedText = await processWithGPT(originalText, styleGuide, exampleTexts, language, instructions);
          usedModel = "GPT-4o";
          break;
        default:
          return res.status(400).json({ message: "Invalid model selection" });
      }
      
      // Return enhanced text
      return res.status(200).json({
        enhancedText,
        model: usedModel,
        timestamp: new Date().toISOString(),
      });
      
    } catch (error) {
      console.error("Error enhancing text:", error);
      return res.status(500).json({ 
        message: "Failed to enhance text", 
        error: error instanceof Error ? error.message : "Unknown error" 
      });
    }
  });

  // Preset endpoints
  
  // Get all presets
  app.get("/api/presets", async (req, res) => {
    try {
      const presets = await storage.getPresets();
      return res.status(200).json(presets);
    } catch (error) {
      console.error("Error getting presets:", error);
      return res.status(500).json({ 
        message: "Failed to get presets", 
        error: error instanceof Error ? error.message : "Unknown error" 
      });
    }
  });

  // Get preset by ID
  app.get("/api/presets/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const preset = await storage.getPreset(id);
      
      if (!preset) {
        return res.status(404).json({ message: "Preset not found" });
      }
      
      return res.status(200).json(preset);
    } catch (error) {
      console.error("Error getting preset:", error);
      return res.status(500).json({ 
        message: "Failed to get preset", 
        error: error instanceof Error ? error.message : "Unknown error" 
      });
    }
  });

  // Create preset
  app.post("/api/presets", async (req, res) => {
    try {
      // Validate request body
      const validationResult = presetSchema.safeParse(req.body);
      
      if (!validationResult.success) {
        return res.status(400).json({ 
          message: "Invalid request data", 
          errors: validationResult.error.errors 
        });
      }
      
      const preset = await storage.createPreset(validationResult.data);
      return res.status(201).json(preset);
    } catch (error) {
      console.error("Error creating preset:", error);
      return res.status(500).json({ 
        message: "Failed to create preset", 
        error: error instanceof Error ? error.message : "Unknown error" 
      });
    }
  });

  // Update preset
  app.put("/api/presets/:id", async (req, res) => {
    try {
      const { id } = req.params;
      
      // Validate request body
      const validationResult = presetSchema.safeParse(req.body);
      
      if (!validationResult.success) {
        return res.status(400).json({ 
          message: "Invalid request data", 
          errors: validationResult.error.errors 
        });
      }
      
      const updatedPreset = await storage.updatePreset(id, validationResult.data);
      
      if (!updatedPreset) {
        return res.status(404).json({ message: "Preset not found" });
      }
      
      return res.status(200).json(updatedPreset);
    } catch (error) {
      console.error("Error updating preset:", error);
      return res.status(500).json({ 
        message: "Failed to update preset", 
        error: error instanceof Error ? error.message : "Unknown error" 
      });
    }
  });

  // Delete preset
  app.delete("/api/presets/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const success = await storage.deletePreset(id);
      
      if (!success) {
        return res.status(404).json({ message: "Preset not found" });
      }
      
      return res.status(204).send();
    } catch (error) {
      console.error("Error deleting preset:", error);
      return res.status(500).json({ 
        message: "Failed to delete preset", 
        error: error instanceof Error ? error.message : "Unknown error" 
      });
    }
  });

  // Health check endpoint
  app.get("/api/health", (req, res) => {
    res.status(200).json({ status: "ok" });
  });

  const httpServer = createServer(app);
  return httpServer;
}
