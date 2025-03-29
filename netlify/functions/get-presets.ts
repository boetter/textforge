import { Handler, HandlerEvent } from "@netlify/functions";
import { getPresets } from "./storage-utils.js";

const handler: Handler = async (event: HandlerEvent) => {
  // Kun tillad GET-metoden
  if (event.httpMethod !== "GET") {
    return {
      statusCode: 405,
      body: JSON.stringify({ message: "Method Not Allowed" }),
    };
  }

  try {
    const presets = await getPresets();
    
    return {
      statusCode: 200,
      body: JSON.stringify(presets),
    };
  } catch (error) {
    console.error("Error getting presets:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ 
        message: "Failed to get presets", 
        error: error instanceof Error ? error.message : "Unknown error" 
      }),
    };
  }
};

export { handler };