# AI Modeller i Text Enhance AI

Dette dokument beskriver de AI-modeller, der er integreret i Text Enhance AI-applikationen, samt hvordan de er konfigureret.

## Claude 3.7 Sonnet (Anthropic)

Claude 3.7 Sonnet er en af de nyeste modeller fra Anthropic, frigivet i februar 2025. Den er særligt egnet til opgaver, der kræver nuancerede og forståelige forklaringer, analyse og indholdsproduktion.

### Konfiguration

```typescript
const message = await anthropic.messages.create({
  model: "claude-3-7-sonnet-20250219",
  max_tokens: 4000,
  messages: [{ role: 'user', content: prompt }],
});
```

### Vigtige funktioner

- Avanceret forståelse af kontekst og nuancer
- Evne til at følge komplekse instruktioner
- Høj kvalitet af output for tekstforbedring
- Godt kendskab til dansk sprog

## Gemini 2.5 Pro Experimental (Google)

Gemini 2.5 Pro Experimental fra Google er designet til at være en af de mest kapable modeller i Gemini-familien med forbedrede ræsonnementsevner.

### Konfiguration

```typescript
const geminiModel = gemini.getGenerativeModel({ model: "gemini-2.5-pro-experimental" });
const result = await geminiModel.generateContent(prompt);
```

### Vigtige funktioner

- Fremragende til detaljerede forbedringer
- Stærk til at følge stilguider præcist
- God til at bevare tekstens originalitet, mens den forbedres
- Hurtigere responstider for længere tekster

## GPT-4o (OpenAI)

GPT-4o er OpenAI's nyeste og mest avancerede model, frigivet i maj 2024. Det er en "omni"-model, der kombinerer tekst-, billed- og andre modaliteter.

### Konfiguration

```typescript
const chatCompletion = await openai.chat.completions.create({
  model: "gpt-4o",
  messages: [{ role: "user", content: prompt }],
  max_tokens: 4000,
});
```

### Vigtige funktioner

- Høj kvalitet tekstoutput med gode stilistiske muligheder
- Stærk til at følge specifikke instruktioner
- God forståelse af kontekst og forfatterintention
- Meget alsidigt på tværs af tekstforbedringsopgaver

## Prompt-struktur

Alle modeller bruger den samme prompt-struktur for at sikre konsistente resultater på tværs af forskellige modeller:

```typescript
const prompt = `Du er en assistent der hjælper med at forbedre tekster på ${language}. 
Du skal holde dig indenfor denne stilguide: ${styleGuide}. 
Jeg har disse særlige instruktioner til dig: ${instructions}. 
Øvrige eksempler på format og tone kan du læse her, men brug ikke deres indhold: ${exampleTexts}. 
Her er teksten du skal forbedre, husk min instruks (${instructions}): ${text}

VIGTIGT: Returner KUN den ENDELIGE forbedrede tekst uden nogen form for kommentarer, mellemtrin, forklaringer, indledning eller noter.`;
```

Dette sikrer, at modellerne:
1. Forstår den ønskede skrivesprog
2. Følger den angivne stilguide nøje
3. Anvender eventuelle specifikke instruktioner
4. Bruger eksempeltekster som vejledning til tone og format
5. Kun returnerer den forbedrede tekst uden ekstra kommentarer

## Model-præstationer

Baseret på vores tests har vi observeret følgende generelle tendenser:

- **Claude 3.7 Sonnet** er fremragende til at følge stilguider præcist og bevare forfatterens oprindelige intention
- **Gemini 2.5 Pro Experimental** er særligt god til kreative forbedringer og til at identificere subtile stilistiske elementer
- **GPT-4o** er den mest alsidige model og giver gode resultater på tværs af de fleste opgaver

## Anvendelse af API-nøgler

For at bruge disse modeller skal du have API-nøgler fra de respektive udbydere:

1. **Anthropic API Key**:
   - Opret en konto på [Anthropic's website](https://www.anthropic.com/)
   - Navigér til API-nøgle sektionen
   - Miljøvariabel: `ANTHROPIC_API_KEY`

2. **Google AI API Key**:
   - Gå til [Google AI Studio](https://ai.google.dev/)
   - Opret et projekt og generer en API-nøgle
   - Miljøvariabel: `GOOGLE_API_KEY`

3. **OpenAI API Key**:
   - Opret en konto på [OpenAI's Platform](https://platform.openai.com/)
   - Gå til API-nøgle sektionen
   - Miljøvariabel: `OPENAI_API_KEY`

Tilføj disse miljøvariabler til din Netlify configuration under Site Settings > Environment Variables.