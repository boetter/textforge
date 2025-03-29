# Vite på Netlify

Dette dokument beskriver, hvordan Vite-applikationer fungerer på Netlify og hvordan Text Enhance AI er konfigureret til at fungere optimalt på Netlify's platform.

## Vite's fordele

Vite er et moderne frontend build-værktøj designet til at give en hurtig, effektiv udviklingsoplevelse for moderne webprojekter. Det inkluderer en udviklingsserver og en byggekommando, der bundler din kode.

### Nøglefunktioner

- **Afhængighedsløsning og prebundling**: Vite finder automatisk modul-imports og prebundler dem for at forbedre sideindlæsningshastigheden.
  
- **Hot Module Replacement (HMR)**: Giver øjeblikkelige opdateringer uden at genindlæse siden.
  
- **Indbygget understøttelse af TypeScript, React og JSX**: Du kan importere TS, JSX og TSX-filer direkte.
  
- **Byggeoptimeringer**: CSS-kodeopdeling, automatisk genererede direktiver og optimering af asynkron chunk-indlæsning.
  
- **Nem at udvide**: Vite kan udvides ved hjælp af plugins baseret på Rollup-økosystemet.

## Netlify-integration

Netlify genkender automatisk Vite-projekter og foreslår byggekommandoen `npm run build` og publiceringsmappen `dist`. Du kan dog overskrive disse værdier, hvis det er nødvendigt.

## Text Enhance AI på Netlify

For at tilpasse vores projekt til Netlify har vi foretaget følgende ændringer:

1. **Opdateret build output sti**: I vores `vite.config.ts`-fil har vi ændret output-mappen fra `dist/public` til `dist` for at matche Netlify's forventninger:

   ```typescript
   build: {
     outDir: path.resolve(__dirname, "dist"),
     emptyOutDir: true,
   }
   ```

2. **Netlify Functions**: Vi har implementeret serverless-funktioner i `netlify/functions/` mappen:
   - `enhance.ts`: Håndterer tekstforbedring
   - `ai-utils.ts`: Implementerer AI-model-integrationer
   - `storage-utils.ts`: Håndterer presets
   - Flere CRUD-funktioner for preset-håndtering

3. **Redirects**: Vi har konfigureret redirects i både `netlify.toml` og `_redirects`-filen for at sikre, at:
   - Single-page application (SPA) ruter fungerer korrekt
   - Netlify Functions er tilgængelige på deres forventede stier

4. **Miljøvariabler**: Vores app kræver følgende miljøvariabler:
   - `OPENAI_API_KEY`
   - `ANTHROPIC_API_KEY` 
   - `GOOGLE_API_KEY`

## Undgå 404-fejl for SPA

Da vores projekt er en single-page application (SPA), der bruger history pushState-metoden til at få pæne URL'er, har vi tilføjet en rewrite-regel for at servere index.html-filen uanset hvilken URL, browseren anmoder om:

```
/* /index.html 200
```

Denne regel er defineret i både `_redirects`-filen og `netlify.toml` for at sikre, at den anvendes uanset deploymentmetode.

## Deployment med Netlify CLI

For lokal udvikling og testning kan du bruge Netlify CLI:

1. Installer Netlify CLI:
   ```bash
   npm install netlify-cli -g
   ```

2. Initialiser Netlify i dit projekt:
   ```bash
   netlify init
   ```

3. Start en lokal udviklingsserver med Netlify Functions:
   ```bash
   netlify dev
   ```

4. Deploy til produktion:
   ```bash
   netlify deploy --prod
   ```