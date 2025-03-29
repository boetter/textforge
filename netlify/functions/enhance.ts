import { Handler, HandlerEvent } from "@netlify/functions";
import { textEnhanceSchema } from "../../shared/schema.js";
import { processWithClaude, processWithGemini, processWithGPT } from "./ai-utils.js";

const handler: Handler = async (event: HandlerEvent) => {
  // Kun tillad POST-metoden
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: JSON.stringify({ message: "Method Not Allowed" }),
    };
  }

  try {
    // Parse request body
    const requestBody = JSON.parse(event.body || "{}");
    
    // Valider request data
    const validationResult = textEnhanceSchema.safeParse(requestBody);
    
    if (!validationResult.success) {
      return {
        statusCode: 400,
        body: JSON.stringify({ 
          message: "Invalid request data", 
          errors: validationResult.error.errors 
        }),
      };
    }
    
    const { 
      originalText, 
      model, 
      styleGuide = "", 
      exampleTexts = "", 
      instructions = "", 
      language = "dansk" 
    } = validationResult.data;
    
    // Process med valgt AI-model
    let enhancedText: string;
    let usedModel: string;
    
    switch (model) {
      case "claude":
        enhancedText = await processWithClaude(
          originalText, 
          styleGuide, 
          exampleTexts, 
          language, 
          instructions
        );
        usedModel = "claude";
        break;
      case "gemini":
        enhancedText = await processWithGemini(
          originalText, 
          styleGuide, 
          exampleTexts, 
          language, 
          instructions
        );
        usedModel = "gemini";
        break;
      case "chatgpt":
        enhancedText = await processWithGPT(
          originalText, 
          styleGuide, 
          exampleTexts, 
          language, 
          instructions
        );
        usedModel = "chatgpt";
        break;
      default:
        return {
          statusCode: 400,
          body: JSON.stringify({ message: "Invalid model selection" }),
        };
    }
    
    // Returner forbedret tekst
    return {
      statusCode: 200,
      body: JSON.stringify({
        enhancedText,
        model: usedModel,
        timestamp: new Date().toISOString(),
      }),
    };
    
  } catch (error) {
    console.error("Error enhancing text:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ 
        message: "Failed to enhance text", 
        error: error instanceof Error ? error.message : "Unknown error" 
      }),
    };
  }
};

export { handler };