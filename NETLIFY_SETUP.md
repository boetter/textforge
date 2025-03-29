# Netlify Opsætningsvejledning

Denne vejledning hjælper dig med at opsætte Text Enhance AI projektet på Netlify.

## Trin 1: Klargør projektet til Netlify

For at gøre Text Enhance AI klar til Netlify-deployment skal du erstatte nogle konfigurationsfiler, der er lavet specielt til Netlify.

1. Kopiér følgende filer til deres destinationer:

   ```bash
   cp updated_vite.config.ts vite.config.ts
   cp updated_tsconfig.json tsconfig.json
   cp updated_netlify.toml netlify.toml
   ```

2. Sørg for at du har en `_redirects` fil i `client/public` mappen med følgende indhold:

   ```
   /* /index.html 200
   ```

## Trin 2: Konfigurér Netlify Dashboard

1. Opret en konto på [Netlify](https://app.netlify.com/) hvis du ikke allerede har en.

2. Opret et nyt site fra Git:
   - Gå til "Sites" i Netlify dashboard
   - Klik på "New site from Git"
   - Vælg din Git-udbyder (GitHub, GitLab, Bitbucket)
   - Vælg dit repository

3. Konfigurér build indstillinger:
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
   - **Node version**: `18` eller nyere

4. Konfigurér miljøvariable:
   - Gå til "Site settings" > "Environment variables"
   - Tilføj følgende:
     - `OPENAI_API_KEY`: Din OpenAI API-nøgle
     - `ANTHROPIC_API_KEY`: Din Anthropic API-nøgle
     - `GOOGLE_API_KEY`: Din Google AI API-nøgle

5. Klik på "Deploy site"

## Trin 3: Fejlfinding af Almindelige Problemer

### Importproblemer i Netlify Functions

Hvis du får fejlen "Could not resolve..." i Netlify Functions, skal du sikre dig at:

1. Alle import-stier i Netlify Functions bruger `.js` endelsen, selv for TypeScript-filer:

   ```typescript
   // Korrekt
   import { processWithClaude } from "./ai-utils.js";
   
   // Forkert
   import { processWithClaude } from "./ai-utils";
   ```

2. Netlify Functions bruger Node.js' ESM-modulsystem, som kræver eksplicitte filendelser.

### 404-fejl efter navigation

Hvis du får 404-fejl efter at have navigeret til ikke-rod-ruter:

1. Tjek at `_redirects` filen eksisterer i `client/public` mappen
2. Tjek at `netlify.toml` har de korrekte redirect-regler:

   ```toml
   # Sørg for at API-kald til funktioner bliver korrekt routet
   [[redirects]]
     from = "/.netlify/functions/*"
     to = "/.netlify/functions/:splat"
     status = 200

   # Alle andre stier går til single-page applikation
   [[redirects]]
     from = "/*"
     to = "/index.html"
     status = 200
   ```

### 404-fejl ved API-kald til Netlify Functions

Hvis du får 404-fejl når du kalder Netlify Functions:

1. Tjek at funktionssti i `netlify.toml` er korrekt:
   ```toml
   [build]
     functions = "netlify/functions"  # Korrekt sti til funktionsmappen
     publish = "dist"  # Korrekt output-mappe (ikke dist/public)
   ```

2. Verificer at redirect-reglerne er konfigureret korrekt:
   ```toml
   # Omdirigerer /api/enhance til /.netlify/functions/enhance
   [[redirects]]
     from = "/api/*"
     to = "/.netlify/functions/:splat"
     status = 200
     
   # Eksplicit regel for direkte adgang til Netlify funktioner
   [[redirects]]
     from = "/.netlify/functions/*"
     to = "/.netlify/functions/:splat"
     status = 200
   ```

3. Sørg for at filnavnene på funktionerne matcher de sti-navne du prøver at kalde:
   - Hvis du kalder `/.netlify/functions/enhance`, skal der være en fil ved navn `enhance.js` eller `enhance.ts` i `netlify/functions` mappen
   - Filerne skal eksportere en `handler` funktion (ikke en default export!)

4. Tjek at funktionerne importerer korrekt med `.js` endelser, selv for TypeScript-filer:
   ```typescript
   // Korrekt
   import { something } from "./other-file.js";
   import { schema } from "../../shared/schema.js";
   
   // Forkert
   import { something } from "./other-file";
   import { schema } from "../../shared/schema";
   ```

5. Åbn browserkonsollen (F12) og tjek for fejl:
   - Søg efter 404-fejl i netværksfanen
   - Kontroller at API-kald går til den korrekte URL
   - Verificer at der ikke er CORS-fejl

6. Tjek formatet af din `netlify.toml` fil:
   - Brug korrekt indentering og formatering
   - Undgå ekstra tegn eller ugyldige tegn
   
7. Prøv at rydde deployment cache og gendeploy projektet:
   - Gå til Netlify dashboard → Site → Deploys → Trigger deploy → Clear cache and deploy site

### API-nøgler fungerer ikke

Hvis API-kald fejler på grund af ungyltige eller manglende nøgler:

1. Gå til Netlify Dashboard > Site settings > Environment variables
2. Bekræft at alle nødvendige miljøvariable er tilføjet korrekt:
   - `OPENAI_API_KEY`: Din OpenAI API-nøgle (kræves for GPT-4o)
   - `ANTHROPIC_API_KEY`: Din Anthropic API-nøgle (kræves for Claude)
   - `GOOGLE_API_KEY`: Din Google AI API-nøgle (kræves for Gemini)
3. Sørg for at API-nøglerne er gyldige og ikke udløbet
4. Genstart bygningen efter at have tilføjet nye miljøvariable ved at gå til:
   - Netlify Dashboard → Site → Deploys → Trigger deploy → Clear cache and deploy site
5. Tjek browser-konsollen (F12) for specifikke fejlmeddelelser relateret til API-kald
6. Kontrollér Netlify funktionslogs for fejl:
   - Netlify Dashboard → Site → Functions → Vælg funktion → Logs
7. Test at dine API-nøgler virker gennem API-udbyderens testværktøjer:
   - OpenAI: [API test](https://platform.openai.com/playground)
   - Anthropic: [Claude console](https://console.anthropic.com/)
   - Google: [AI Studio](https://makersuite.google.com/)

## Trin 4: Local Netlify Development

For at teste Netlify Functions lokalt:

1. Installer Netlify CLI:
   ```bash
   npm install netlify-cli -g
   ```

2. Kør den lokale udviklingsserver:
   ```bash
   netlify dev
   ```

Dette vil starte en lokal server, der emulerer Netlify-miljøet, inklusive Netlify Functions.

## Trin 5: Manuelt Deployment

Hvis du foretrækker at deploye manuelt (uden kontinuerlig deployment):

1. Byg projektet:
   ```bash
   npm run build
   ```

2. Deploy via Netlify CLI:
   ```bash
   netlify deploy --prod
   ```

## Trøbbelskyding

### TypeScript Errors

Hvis du støder på TypeScript-fejl i Netlify Functions:

1. Tjek at `netlify/tsconfig.json` indeholder:
   ```json
   {
     "compilerOptions": {
       "target": "ES2020",
       "module": "NodeNext",
       "moduleResolution": "NodeNext",
       "esModuleInterop": true
     }
   }
   ```

2. Sørg for at alle import-stier bruger `.js` endelsen.

### Build Fejl

Hvis byggeprocessen fejler:

1. Tjek Netlify build logs for specifikke fejl
2. Sørg for at `vite.config.ts` har korrekt output-katalog
3. Verificer at alle afhængigheder er korrekt installeret

### Function Timeouts

Hvis Netlify Functions timer ud:

1. Overvej at øge timeout-indstillingen i `netlify.toml`:
   ```toml
   [functions]
     node_bundler = "esbuild"
     timeout = 30
   ```

2. Optimer dine funktioner for hurtigere respons.

### Kontakt og support

Hvis du har problemer, som ikke er dækket her, kan du:

1. Tjekke [Netlify dokumentation](https://docs.netlify.com/)
2. Besøge [Netlify Community](https://community.netlify.com/)
3. Kontakte Netlify Support via deres dashboard