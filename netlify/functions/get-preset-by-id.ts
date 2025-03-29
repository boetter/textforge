import { Handler, HandlerEvent } from "@netlify/functions";
import { getPreset } from "./storage-utils.js";

const handler: Handler = async (event: HandlerEvent) => {
  // Kun tillad GET-metoden
  if (event.httpMethod !== "GET") {
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
    
    const preset = await getPreset(id);
    
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
    console.error("Error getting preset:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ 
        message: "Failed to get preset", 
        error: error instanceof Error ? error.message : "Unknown error" 
      }),
    };
  }
};

export { handler };