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
2. Tjek at `netlify.toml` har den korrekte redirect-regel:

   ```toml
   [[redirects]]
     from = "/*"
     to = "/index.html"
     status = 200
   ```

### API-nøgler fungerer ikke

Hvis API-kald fejler på grund af ungyltige eller manglende nøgler:

1. Gå til Netlify Dashboard > Site settings > Environment variables
2. Bekræft at alle nødvendige miljøvariable er tilføjet korrekt
3. Genstart bygningen efter at have tilføjet nye miljøvariable

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