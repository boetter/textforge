import Anthropic from "@anthropic-ai/sdk";
import OpenAI from "openai";
import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize the AI service clients
// the newest Anthropic model is "claude-3-7-sonnet-20250219" which was released February 24, 2025
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || "",
});

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || "",
});

// the newest Gemini model is "gemini-2.5-pro-exp-03-25" which was released March 25, 2025
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY || "");

/**
 * Process text with Claude Sonnet
 */
export async function processWithClaude(
  originalText: string, 
  styleGuide: string, 
  exampleTexts: string,
  language: string = "dansk",
  instructions: string = ""
): Promise<string> {
  try {
    const prompt = buildPrompt(originalText, styleGuide, exampleTexts, language, instructions);

    const message = await anthropic.messages.create({
      max_tokens: 4000,
      system: "Du skal KUN returnere det endelige resultat efter at have udført alle instruktioner fra brugeren. Returner aldrig mellemtrin eller flere versioner af teksten. Giv ingen kommentarer eller forklaringer.",
      messages: [{ role: "user", content: prompt }],
      model: "claude-3-7-sonnet-20250219",
    });

    // Check if content exists and is of type TextBlock
    if (message.content && message.content[0] && 'text' in message.content[0]) {
      return message.content[0].text;
    }
    
    return "No content generated";
  } catch (error) {
    console.error("Error with Claude API:", error);
    throw new Error(error instanceof Error ? error.message : "Failed to process with Claude");
  }
}

/**
 * Process text with Gemini
 */
export async function processWithGemini(
  originalText: string, 
  styleGuide: string, 
  exampleTexts: string,
  language: string = "dansk",
  instructions: string = ""
): Promise<string> {
  try {
    // Opdateret til den nyeste Gemini 2.5 Pro model
    const geminiModel = genAI.getGenerativeModel({ 
      model: "gemini-2.5-pro-exp-03-25",
      systemInstruction: "Du skal KUN returnere det endelige resultat efter at have udført alle instruktioner fra brugeren. Returner aldrig mellemtrin eller flere versioner af teksten. Giv ingen kommentarer eller forklaringer."
    });
    
    const prompt = buildPrompt(originalText, styleGuide, exampleTexts, language, instructions);
    
    const result = await geminiModel.generateContent(prompt);
    const response = result.response;
    return response.text();
  } catch (error) {
    console.error("Error with Gemini API:", error);
    throw new Error(error instanceof Error ? error.message : "Failed to process with Gemini");
  }
}

/**
 * Process text with GPT-4o
 */
export async function processWithGPT(
  originalText: string, 
  styleGuide: string, 
  exampleTexts: string,
  language: string = "dansk",
  instructions: string = ""
): Promise<string> {
  try {
    const prompt = buildPrompt(originalText, styleGuide, exampleTexts, language, instructions);
    
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { 
          role: "system", 
          content: "Du skal KUN returnere det endelige resultat efter at have udført alle instruktioner fra brugeren. Returner aldrig mellemtrin eller flere versioner af teksten. Giv ingen kommentarer eller forklaringer."
        },
        { role: "user", content: prompt }
      ],
    });

    return response.choices[0].message.content || "No content generated";
  } catch (error) {
    console.error("Error with OpenAI API:", error);
    throw new Error(error instanceof Error ? error.message : "Failed to process with GPT");
  }
}

/**
 * Build a consistent prompt for all AI models
 */
function buildPrompt(
  originalText: string, 
  styleGuide: string, 
  exampleTexts: string, 
  language: string = "dansk", 
  instructions: string = ""
): string {
  // Map af sprog til standard-instruktionstekst
  const languageNames: Record<string, string> = {
    "dansk": "dansk",
    "norsk": "norsk",
    "svensk": "svensk",
    "engelsk": "engelsk",
  };
  
  // Hent sprognavnet fra vores mapping
  const languageName = languageNames[language] || languageNames["dansk"];
  
  // Byg den nye prompt struktur ifølge brugerens specifikation
  let prompt = `Du er en assistent der hjælper med at forbedre tekster på ${languageName}.`;
  
  if (styleGuide && styleGuide.trim() !== "") {
    prompt += ` Du skal holde dig indenfor denne stilguide: ${styleGuide}.`;
  }
  
  if (instructions && instructions.trim() !== "") {
    prompt += ` Jeg har disse særlige instruktioner til dig: ${instructions}.`;
  }
  
  if (exampleTexts && exampleTexts.trim() !== "") {
    prompt += ` Øvrige eksempler på format og tone kan du læse her, men brug ikke deres indhold: ${exampleTexts}.`;
  }
  
  prompt += ` Her er teksten du skal forbedre`;
  
  if (instructions && instructions.trim() !== "") {
    prompt += `, husk min instruks (${instructions})`;
  }
  
  prompt += `: ${originalText}`;
  
  // Tilføj en klar instruks om at returnere kun den forbedrede tekst
  prompt += `\n\nVIGTIGT: Returner KUN den ENDELIGE version af teksten efter ALLE instruktioner er udført. Returner ikke mellemtrin eller flere tekster. Inkluder ingen kommentarer, forklaringer, indledninger eller noter. Hvis flere instruktioner er givet (som f.eks. "ret stavefejl og oversæt til tysk"), skal du udføre alle instruktioner i rækkefølge og KUN returnere det endelige resultat (den oversatte tekst med rettede stavefejl).`;
  
  return prompt;
}
