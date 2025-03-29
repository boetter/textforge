import { Handler, HandlerEvent } from "@netlify/functions";
import { textEnhanceSchema } from "../../shared/schema.js";
import { processWithClaude, processWithGemini, processWithGPT } from "./ai-utils.js";

// Hjælpefunktion til at tjekke om vi har de nødvendige API-nøgler
function checkRequiredApiKeys(modelName: string): string | null {
  switch (modelName) {
    case "claude":
      return process.env.ANTHROPIC_API_KEY ? null : "ANTHROPIC_API_KEY mangler i miljøvariabler";
    case "gemini":
      return process.env.GOOGLE_API_KEY ? null : "GOOGLE_API_KEY mangler i miljøvariabler";
    case "gpt":
      return process.env.OPENAI_API_KEY ? null : "OPENAI_API_KEY mangler i miljøvariabler";
    default:
      return `Ukendt model: ${modelName}`;
  }
}

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
    
    // Tjek først om API-nøglerne er tilgængelige
    const missingApiKey = checkRequiredApiKeys(model);
    
    if (missingApiKey) {
      console.error(`API-nøgle mangler for model ${model}: ${missingApiKey}`);
      return {
        statusCode: 500,
        body: JSON.stringify({ 
          message: "API-nøgle mangler", 
          error: missingApiKey,
          details: "API-nøglen skal konfigureres i Netlify miljøvariable for at bruge denne model."
        }),
      };
    }
    
    // Process med valgt AI-model
    let enhancedText: string;
    let usedModel: string;
    
    try {
      switch (model) {
        case "claude":
          console.log("Behandler tekst med Claude...");
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
          console.log("Behandler tekst med Gemini...");
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
          console.log("Behandler tekst med ChatGPT...");
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
    } catch (modelError) {
      console.error(`Fejl ved behandling med ${model}:`, modelError);
      return {
        statusCode: 500,
        body: JSON.stringify({ 
          message: `Fejl ved behandling med ${model}`, 
          error: modelError instanceof Error ? modelError.message : "Ukendt fejl",
          details: "Der opstod en fejl ved kommunikation med AI-modellen. Kontroller API-nøglen og prøv igen."
        }),
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