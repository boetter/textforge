# Text Enhance AI

En avanceret tekstforbedrer, der bruger multiple AI-modeller til at forbedre og omskrive tekst baseret på brugerdefinerede stilguider og eksempler.

## Oversigt

Text Enhance AI er en webapplikation, der giver brugere mulighed for at:

- Vælge mellem forskellige AI-modeller (GPT-4o, Claude 3.7 Sonnet, Gemini 2.5 Pro)
- Definere stilguider til at styre tekstforbedringer
- Tilføje eksempeltekster som reference for tone og stil
- Gemme og genbruge præferencer som presets

## Teknologier

- Frontend: React, TailwindCSS, ShadcnUI, TipTap editor
- Backend: Netlify Functions (serverless)
- AI-integration: OpenAI, Anthropic, Google Generative AI

## Forudsætninger

For at køre applikationen skal du have:

- Node.js (version 18 eller nyere)
- API-nøgler til de AI-modeller, du ønsker at bruge:
  - OPENAI_API_KEY
  - ANTHROPIC_API_KEY
  - GOOGLE_API_KEY

## Lokal kørsel

1. Installer afhængigheder:
   ```
   npm install
   ```

2. Start udviklingsserveren:
   ```
   npm run dev
   ```

## Deployment på Netlify

For at deployere applikationen på Netlify, følg disse trin:

1. Opret en konto på [Netlify](https://netlify.com) hvis du ikke allerede har en.

2. Inden deployment, opdater følgende filer med de versioner, der er inkluderet i dette projekt:
   - Erstat `netlify.toml` med `updated_netlify.toml`
   - Erstat `tsconfig.json` med `updated_tsconfig.json`
   - Erstat `vite.config.ts` med `updated_vite.config.ts`
   - Erstat `package.json` med `updated_package.json`

3. Konfigurer miljøvariabler på Netlify:
   - OPENAI_API_KEY
   - ANTHROPIC_API_KEY
   - GOOGLE_API_KEY

4. Deploy projektet via GitHub-integration eller manuel upload:
   - GitHub-integration: Forbind dit GitHub-repository til Netlify
   - Manuel upload: Kør `npm run build` og upload indholdet af `dist`-mappen

## Projektstruktur

- `client/`: Frontend React applikation
  - `src/components/`: UI-komponenter
  - `src/lib/`: Hjælpefunktioner
  - `src/pages/`: Applikationens sider
  
- `netlify/functions/`: Serverless Netlify-funktioner
  - `ai-utils.ts`: AI-modelintegration
  - `enhance.ts`: Hovedfunktion til tekstforbedring
  - `storage-utils.ts`: Håndtering af presets

- `shared/`: Delt kode mellem frontend og backend
  - `schema.ts`: Typescript-typer og Zod-validering

## API Nøgler

Applikationen kræver API-nøgler for at fungere korrekt:

1. OpenAI API-nøgle: [Opret her](https://platform.openai.com/api-keys)
2. Anthropic API-nøgle: [Opret her](https://console.anthropic.com/keys)
3. Google API-nøgle: [Opret her](https://makersuite.google.com/app/apikey)

Tilføj disse som miljøvariabler i din Netlify-konfiguration under "Site settings > Environment variables".