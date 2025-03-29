import { Handler, HandlerEvent } from "@netlify/functions";
import { deletePreset } from "./storage-utils";

const handler: Handler = async (event: HandlerEvent) => {
  // Kun tillad DELETE-metoden
  if (event.httpMethod !== "DELETE") {
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
    
    const success = await deletePreset(id);
    
    if (!success) {
      return {
        statusCode: 404,
        body: JSON.stringify({ message: "Preset not found" }),
      };
    }
    
    return {
      statusCode: 200,
      body: JSON.stringify({ success: true }),
    };
  } catch (error) {
    console.error("Error deleting preset:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ 
        message: "Failed to delete preset", 
        error: error instanceof Error ? error.message : "Unknown error" 
      }),
    };
  }
};

export { handler };