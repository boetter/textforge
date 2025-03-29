# Text Enhance AI

En multifunktionel AI-tekstforbedrer, der bruger flere modeller til at forbedre dine tekster baseret på dine stilguider og eksempler.

## Funktioner

- **Multi-Model AI Support**: Vælg mellem Claude 3.7 Sonnet, Gemini 2.5 Pro Experimental eller GPT-4o
- **Stilguide**: Definer klare regler for, hvordan din tekst skal forbedres
- **Eksempeltekster**: Giv eksempler på den tone og stil, du ønsker
- **Brugerdefinerede instruktioner**: Giv specifikke anvisninger til AI'en
- **Presets**: Gem dine favorit stilguider og eksempler til fremtidig brug
- **Sprogsupport**: Vælg mellem dansk, norsk, svensk og engelsk
- **Modern UI**: Ren, moderne brugergrænseflade med fokus på brugervenlighed

## Teknologier

- **Frontend**: React, TypeScript, Vite, TailwindCSS, Shadcn/UI
- **Serverless Functions**: Netlify Functions (tidl. Node.js + Express)
- **AI Integration**: Claude 3.7 Sonnet, Gemini 2.5 Pro Experimental, GPT-4o

## Kom i gang - Netlify Deployment

### Forudsætninger

- Node.js 18+ installeret
- En Netlify-konto
- Adgang til følgende API-nøgler:
  - OpenAI API Key for GPT-4o
  - Anthropic API Key for Claude 3.7 Sonnet
  - Google AI API Key for Gemini 2.5 Pro Experimental

### Installation

1. Clone repositoriet:
   ```bash
   git clone https://github.com/dit-brugernavn/text-enhance-ai.git
   cd text-enhance-ai
   ```

2. Installer afhængigheder:
   ```bash
   npm install
   ```

3. Tilføj miljøvariable i Netlify Dashboard:
   - `OPENAI_API_KEY`: Din OpenAI API-nøgle
   - `ANTHROPIC_API_KEY`: Din Anthropic API-nøgle
   - `GOOGLE_API_KEY`: Din Google AI API-nøgle

### Udvikling

Start udviklingsserveren:

```bash
npm run dev
```

Besøg [http://localhost:3000](http://localhost:3000) for at se applikationen.

### Deployment

Projektet er klar til deployment på Netlify. Vi har oprettet disse specielle filer for at lette Netlify-deployment:

- `netlify.toml`: Konfiguration for Netlify-byggeprocesen
- `netlify/functions/`: Serverless functions for AI-integration og preset-administration

Brug Netlify CLI til at deploye:

```bash
npm install netlify-cli -g
netlify init
netlify deploy --prod
```

### Vigtige Forbedringer for Netlify Deployment

Vi har foretaget følgende ændringer for at sikre korrekt deployment på Netlify:

1. **Filnavne i imports**: Sørget for at alle importstier i Netlify Functions bruger eksplicitte `.js` filtyper, hvilket er påkrævet af Node.js' ESM-modul system.

2. **Redirect håndtering**: Tilføjet korrekte regler i både `netlify.toml` og `_redirects` for at sikre, at single-page application routing fungerer korrekt.

3. **Build-directory struktur**: Konfigureret output mappen til at være kompatibel med Netlify's forventninger.

## Anvendelse

1. Åbn applikationen i din browser
2. Indtast din oprindelige tekst i tekstfeltet
3. Vælg AI-model fra dropdown-menuen
4. Indtast en stilguide for at definere, hvordan din tekst skal forbedres
5. (Valgfrit) Tilføj eksempeltekster
6. (Valgfrit) Tilføj specifikke instruktioner
7. Klik på "Forbedre tekst"
8. Kopiér den forbedrede tekst eller gem stilguiden som et preset til senere brug

## Licensering

Dette projekt er licenseret under MIT-licensen. Se `LICENSE` filen for detaljer.

## Fejlfinding

### 404-fejl på API-kald til Netlify Functions

Hvis du oplever 404-fejl, når applikationen forsøger at kalde Netlify Functions:

1. **Kontroller netlify.toml**: Sørg for at din `netlify.toml` fil har korrekte stier:
   ```toml
   [build]
     publish = "dist/public"  # Matcher din vite.config.ts output-mappe
     functions = "netlify/functions"  # Korrekt sti til funktionsmappen
   
   [[redirects]]
     from = "/.netlify/functions/*"
     to = "/.netlify/functions/:splat"
     status = 200
   ```

2. **Tjek filnavne og imports**: Alle Netlify-funktioner skal bruge `.js` i deres imports:
   ```typescript
   // Korrekt
   import { something } from "./other-file.js";
   
   // Forkert
   import { something } from "./other-file";
   ```

3. **Funktionsstruktur**: Hver funktion skal eksportere en handler:
   ```typescript
   export { handler };
   ```

4. **Test lokalt med Netlify Dev**: Brug Netlify CLI til at teste lokalt:
   ```bash
   netlify dev
   ```

5. **Tjek API-nøgler**: Sørg for at have konfigureret alle nødvendige API-nøgler i Netlify miljøvariable.

For mere detaljeret fejlfinding, se [NETLIFY_SETUP.md](NETLIFY_SETUP.md)

## Bidrag

Bidrag er velkomne! For større ændringer, åbn venligst et issue først for at diskutere, hvad du gerne vil ændre.