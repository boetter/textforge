import { Handler, HandlerEvent } from "@netlify/functions";
import { presetSchema } from "../../shared/schema";
import { createPreset } from "./storage-utils";

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
    const validationResult = presetSchema.safeParse(requestBody);
    
    if (!validationResult.success) {
      return {
        statusCode: 400,
        body: JSON.stringify({ 
          message: "Invalid request data", 
          errors: validationResult.error.errors 
        }),
      };
    }
    
    const preset = await createPreset(validationResult.data);
    
    return {
      statusCode: 201,
      body: JSON.stringify(preset),
    };
  } catch (error) {
    console.error("Error creating preset:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ 
        message: "Failed to create preset", 
        error: error instanceof Error ? error.message : "Unknown error" 
      }),
    };
  }
};

export { handler };