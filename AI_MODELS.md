# AI Model Integration

Dette dokument beskriver, hvordan AI-modellerne er integreret i Text Enhance AI-applikationen.

## Understøttede modeller

Applikationen understøtter følgende AI-modeller:

1. **GPT-4o** fra OpenAI (model-id: `gpt-4o`)
2. **Claude 3.7 Sonnet** fra Anthropic (model-id: `claude-3-7-sonnet-20250219`)
3. **Gemini 2.5 Pro Experimental** fra Google (model-id: `gemini-2.5-pro-experimental`)

## Modelbrug

### Prompt-struktur

For at sikre konsistente svar på tværs af alle modeller bruges en standardiseret prompt-struktur:

```
Du er en assistent der hjælper med at forbedre tekster på [sprog]. 
Du skal holde dig indenfor denne stilguide: [stilguide]. 
Jeg har disse særlige instruktioner til dig: [instruktioner]. 
Øvrige eksempler på format og tone kan du læse her, men brug ikke deres indhold: [eksempler]. 
Her er teksten du skal forbedre, husk min instruks ([instruktioner]): [tekst]

VIGTIGT: Returner KUN den ENDELIGE forbedrede tekst uden nogen form for kommentarer, mellemtrin, forklaringer, indledning eller noter.
```

Denne prompt-struktur er implementeret i `buildPrompt`-funktionen, som bruges af alle model-integrationer.

### OpenAI Integration

OpenAI-integrationen bruger `gpt-4o`-modellen, som er den nyeste og mest avancerede til tekst-til-tekst-opgaver.

```typescript
// the newest OpenAI model is "gpt-4o" which was released May 13, 2024
const chatCompletion = await openai.chat.completions.create({
  model: "gpt-4o",
  messages: [{ role: "user", content: prompt }],
  max_tokens: 4000,
});
```

### Anthropic Integration

Anthropic-integrationen bruger `claude-3-7-sonnet-20250219`-modellen, som er den nyeste version af Claude.

```typescript
// the newest Anthropic model is "claude-3-7-sonnet-20250219" which was released February 24, 2025
const message = await anthropic.messages.create({
  model: "claude-3-7-sonnet-20250219",
  max_tokens: 4000,
  messages: [{ role: 'user', content: prompt }],
});
```

### Google Generative AI Integration

Google Generative AI-integrationen bruger den eksperimentelle `gemini-2.5-pro-experimental`-model, som tilbyder avancerede sprogegenskaber.

```typescript
// Bruger den nyeste Gemini 2.5 Pro Experimental model
const geminiModel = gemini.getGenerativeModel({ model: "gemini-2.5-pro-experimental" });
const result = await geminiModel.generateContent(prompt);
```

## API-nøgler og miljøvariabler

Hver model kræver sin egen API-nøgle, som skal gemmes som miljøvariabel:

- `OPENAI_API_KEY`: Nødvendig for GPT-4o
- `ANTHROPIC_API_KEY`: Nødvendig for Claude 3.7 Sonnet
- `GOOGLE_API_KEY`: Nødvendig for Gemini 2.5 Pro Experimental

## Fejlhåndtering

Hver modelintegration inkluderer robust fejlhåndtering for at fange og rapportere fejl:

```typescript
try {
  // Model-integrering kode her
} catch (error) {
  console.error('Error processing with [Model]:', error);
  throw new Error(`[Model] AI processing failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
}
```

## Modelvalg

Brugere kan vælge, hvilken model der skal bruges via brugergrænsefladen, og valget sendes til backend som en del af `TextEnhanceRequest`:

```typescript
switch (model) {
  case "claude":
    enhancedText = await processWithClaude(originalText, styleGuide, exampleTexts, language, instructions);
    usedModel = "claude";
    break;
  case "gemini":
    enhancedText = await processWithGemini(originalText, styleGuide, exampleTexts, language, instructions);
    usedModel = "gemini";
    break;
  case "chatgpt":
    enhancedText = await processWithGPT(originalText, styleGuide, exampleTexts, language, instructions);
    usedModel = "chatgpt";
    break;
  default:
    return {
      statusCode: 400,
      body: JSON.stringify({ message: "Invalid model selection" }),
    };
}
```

## Serverless implementation

AI-model-integrationen er implementeret som serverless Netlify Functions, som gør det muligt for frontend-applikationen at bruge AI-modellerne uden at afsløre API-nøgler til klienten.

Disse funktioner er placeret i `netlify/functions/` mappen og er eksponeret som HTTP-endepunkter, som frontend-applikationen kan kalde.