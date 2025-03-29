import { Handler, HandlerEvent } from "@netlify/functions";
import { presetSchema } from "../../shared/schema.js";
import { updatePreset } from "./storage-utils.js";

const handler: Handler = async (event: HandlerEvent) => {
  // Kun tillad PUT-metoden
  if (event.httpMethod !== "PUT") {
    return {
      statusCode: 405,
      body: JSON.stringify({ message: "Method Not Allowed" }),
    };
  }

  try {
    // Hent preset ID fra URL-path
    const id = event.path.split("/").pop();
    
    if (!id) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: "Missing preset ID" }),
      };
    }
    
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
    
    const preset = await updatePreset(id, validationResult.data);
    
    if (!preset) {
      return {
        statusCode: 404,
        body: JSON.stringify({ message: "Preset not found" }),
      };
    }
    
    return {
      statusCode: 200,
      body: JSON.stringify(preset),
    };
  } catch (error) {
    console.error("Error updating preset:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ 
        message: "Failed to update preset", 
        error: error instanceof Error ? error.message : "Unknown error" 
      }),
    };
  }
};

export { handler };