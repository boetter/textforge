import Anthropic from '@anthropic-ai/sdk';
import { GoogleGenerativeAI } from '@google/generative-ai';
import OpenAI from 'openai';

// Initialize API-klienter
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const gemini = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY || '');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/**
 * Process text with Claude Sonnet
 */
export async function processWithClaude(
  text: string,
  styleGuide: string,
  exampleTexts: string,
  language: string,
  instructions: string
): Promise<string> {
  try {
    const prompt = buildPrompt(text, styleGuide, exampleTexts, language, instructions);
    
    // the newest Anthropic model is "claude-3-7-sonnet-20250219" which was released February 24, 2025
    const message = await anthropic.messages.create({
      model: "claude-3-7-sonnet-20250219",
      max_tokens: 4000,
      messages: [{ role: 'user', content: prompt }],
    });

    // Håndter svaret fra Anthropic API
    if (message.content && message.content.length > 0) {
      const content = message.content[0];
      if (typeof content === 'object' && 'type' in content && content.type === 'text') {
        return content.text;
      }
    }
    
    throw new Error("Uventet svarformat fra Claude API");
  } catch (error) {
    console.error('Error processing with Claude:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Detaljeret Claude API fejl:', JSON.stringify(error));
    throw new Error(`Claude AI processing failed: ${errorMessage}. Kontroller at ANTHROPIC_API_KEY er korrekt konfigureret i Netlify miljøvariable.`);
  }
}

/**
 * Process text with Gemini
 */
export async function processWithGemini(
  text: string,
  styleGuide: string,
  exampleTexts: string,
  language: string,
  instructions: string
): Promise<string> {
  try {
    const prompt = buildPrompt(text, styleGuide, exampleTexts, language, instructions);
    
    // Bruger den nyeste Gemini 2.5 Pro Experimental model
    const geminiModel = gemini.getGenerativeModel({ model: "gemini-2.5-pro-experimental" });
    const result = await geminiModel.generateContent(prompt);
    const response = result.response;
    return response.text();
  } catch (error) {
    console.error('Error processing with Gemini:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Detaljeret Gemini API fejl:', JSON.stringify(error));
    throw new Error(`Gemini AI processing failed: ${errorMessage}. Kontroller at GOOGLE_API_KEY er korrekt konfigureret i Netlify miljøvariable.`);
  }
}

/**
 * Process text with GPT-4o
 */
export async function processWithGPT(
  text: string,
  styleGuide: string,
  exampleTexts: string,
  language: string,
  instructions: string
): Promise<string> {
  try {
    const prompt = buildPrompt(text, styleGuide, exampleTexts, language, instructions);
    
    // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
    const chatCompletion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 4000,
    });

    return chatCompletion.choices[0].message.content || '';
  } catch (error) {
    console.error('Error processing with GPT:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Detaljeret OpenAI API fejl:', JSON.stringify(error));
    throw new Error(`GPT AI processing failed: ${errorMessage}. Kontroller at OPENAI_API_KEY er korrekt konfigureret i Netlify miljøvariable.`);
  }
}

/**
 * Build a consistent prompt for all AI models
 */
export function buildPrompt(
  text: string,
  styleGuide: string,
  exampleTexts: string,
  language: string,
  instructions: string
): string {
  const prompt = `Du er en assistent der hjælper med at forbedre tekster på ${language}. 
Du skal holde dig indenfor denne stilguide: ${styleGuide}. 
Jeg har disse særlige instruktioner til dig: ${instructions}. 
Øvrige eksempler på format og tone kan du læse her, men brug ikke deres indhold: ${exampleTexts}. 
Her er teksten du skal forbedre, husk min instruks (${instructions}): ${text}

VIGTIGT: Returner KUN den ENDELIGE forbedrede tekst uden nogen form for kommentarer, mellemtrin, forklaringer, indledning eller noter.`;

  return prompt;
}