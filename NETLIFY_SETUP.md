# Vejledning til Netlify Deployment

Dette er en trin-for-trin guide til at opsætte Text Enhance AI projektet på Netlify.

## Forberedelse af projektet

1. **Erstat konfigurationsfiler**

   Før du deployer til Netlify, skal du erstatte følgende filer med de opdaterede versioner:

   ```bash
   # Erstat netlify.toml
   cp updated_netlify.toml netlify.toml

   # Erstat tsconfig.json
   cp updated_tsconfig.json tsconfig.json
   
   # Erstat vite.config.ts
   cp updated_vite.config.ts vite.config.ts
   
   # Erstat package.json
   cp updated_package.json package.json
   ```

2. **Installer afhængigheder**

   ```bash
   npm install
   ```

3. **Byg projektet lokalt for at teste**

   ```bash
   npm run build
   ```

   Kontroller, at `dist`-mappen indeholder din byggede applikation.

## Opsætning på Netlify

1. **Opret en Netlify konto**

   Gå til [netlify.com](https://www.netlify.com/) og tilmeld dig eller log ind.

2. **Opret et nyt site**

   Klik på "Add new site" og vælg "Import an existing project".

3. **Forbind til Git provider**

   Vælg GitHub (eller en anden Git-udbyder) og godkend Netlify til at få adgang til dine repositories.

4. **Vælg repository**

   Find og vælg Text Enhance AI repository'et.

5. **Konfigurér bygningsindstillinger**

   - Build command: `npm run build`
   - Publish directory: `dist`

6. **Tilføj miljøvariabler**

   Under "Site settings" > "Environment variables", tilføj:
   
   - `OPENAI_API_KEY`: Din OpenAI API-nøgle
   - `ANTHROPIC_API_KEY`: Din Anthropic API-nøgle
   - `GOOGLE_API_KEY`: Din Google API-nøgle

7. **Deploy**

   Klik på "Deploy site". Netlify vil nu bygge og deploye din applikation.

## Fejlfinding

Hvis du oplever problemer under deployment, kan du tjekke:

1. **Build logs**

   Netlify giver detaljerede build logs, som kan hjælpe med at diagnosticere problemer.

2. **Funktionslogs**

   For at se logs fra Netlify Functions, gå til "Functions" i Netlify dashboard og klik på den pågældende funktion.

3. **Lokale tests**

   Du kan installere `netlify-cli` og teste lokalt:
   
   ```bash
   npm install -g netlify-cli
   netlify dev
   ```

## Vigtige noter

- **API-nøgler**: Sørg for, at alle API-nøgler er korrekt indstillet i Netlify miljøvariabler.

- **Redirect**: Netlify.toml og _redirects filen sørger for, at alle ruter på dit site dirigeres korrekt.

- **Serverless funktioner**: Alle backend-funktioner er implementeret som Netlify Functions i `netlify/functions` mappen.

## Næste skridt

Efter succesfuld deployment:

1. Konfigurér et brugerdefineret domænenavn (valgfrit)
2. Opsæt Netlify Forms, hvis du tilføjer kontaktformularer
3. Aktivér Netlify Identity, hvis du tilføjer brugerautentificering