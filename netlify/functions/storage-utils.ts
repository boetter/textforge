import { Preset } from "../../shared/schema.js";

// Vi bruger localStorage i Netlify Functions ved hjælp af en global variabel
// Dette er ikke en ideel løsning for produktion, men fungerer til demo-formål
// I en rigtig produktionsapp ville vi bruge en database

let presets: Map<string, Preset> | null = null;

// Initialize presets med standardværdier hvis de ikke allerede eksisterer
export function initializeStorage() {
  if (presets === null) {
    presets = new Map();
    
    // Add default presets
    const defaultPreset: Preset = {
      id: "default-preset",
      name: "Standard Stilguide",
      styleGuide: "Teksten skal være professionel og klar med et formelt, men venligt sprog. Undgå slang og forkortelser. Brug aktiv form frem for passiv. Brug korte, klare sætninger. Målgruppen er professionelle voksne.",
      exampleTexts: "Vi er glade for at kunne præsentere vores nyeste produkt, som er udviklet med fokus på brugervenlighed og effektivitet. Produktet løser flere udfordringer, som vores kunder har påpeget i deres feedback.\n\nVores team har arbejdet intensivt for at sikre, at alle funktioner fungerer optimalt. Vi står naturligvis til rådighed, hvis du har spørgsmål eller behov for support."
    };
    
    // Simpel redigering preset
    const simpelRedigeringPreset: Preset = {
      id: "simpel-redigering",
      name: "Simpel redigering",
      styleGuide: "Jeg vil have, at du opfører dig som en redaktør. Gennemgå denne tekst, ret kommaerne og gør flowet bedre, så den bliver mere læsevenlig.",
      exampleTexts: ""
    };
    
    // Mere professionel preset
    const mereProfessionelPreset: Preset = {
      id: "mere-professionel",
      name: "Mere professionel",
      styleGuide: "Jeg vil have, at du omformulerer mine tekster så de fremstår mere professionelle. Jeg bruger altid talesprog og simpelt sprog, men ønsker at få omformuleret tekster jeg giver dig så de bliver mere formelle og professionelle i deres tone.",
      exampleTexts: ""
    };
    
    // Omform til LinkedIn preset
    const linkedInPreset: Preset = {
      id: "linkedin-format",
      name: "Omform til LinkedIn",
      styleGuide: "Jeg vil have, at du opfører dig som en kommunikationsmedarbejder, hvis eneste job er at tage eksisterende indhold og omskrive det så det passer til andre platforme. Jeg har denne tekst, kan du lave en udgave af den der passer til LinkedIn?",
      exampleTexts: ""
    };
    
    // Short and sweet preset
    const shortAndSweetPreset: Preset = {
      id: "short-and-sweet",
      name: "Short and sweet",
      styleGuide: "Jeg vil have, at du omformulerer mine tekster så de bliver kortere. Jeg er ofte lidt lang i spyttet og gentager mig selv, derfor ønsker jeg at få omformuleret tekster jeg giver dig så de bliver kortere og mere præcise. Du skal stræbe efter at gøre mine tekster så korte som muligt. Absolut ind til benet.",
      exampleTexts: ""
    };
    
    // Tilføj alle presets til storage
    presets.set(defaultPreset.id!, defaultPreset);
    presets.set(simpelRedigeringPreset.id!, simpelRedigeringPreset);
    presets.set(mereProfessionelPreset.id!, mereProfessionelPreset);
    presets.set(linkedInPreset.id!, linkedInPreset);
    presets.set(shortAndSweetPreset.id!, shortAndSweetPreset);
  }
}

// Preset management implementation
export async function getPresets(): Promise<Preset[]> {
  initializeStorage();
  return Array.from(presets!.values());
}

export async function getPreset(id: string): Promise<Preset | undefined> {
  initializeStorage();
  return presets!.get(id);
}

export async function createPreset(preset: Preset): Promise<Preset> {
  initializeStorage();
  const id = preset.id || `custom-${Date.now()}`;
  const newPreset = { ...preset, id };
  presets!.set(id, newPreset);
  return newPreset;
}

export async function updatePreset(id: string, preset: Preset): Promise<Preset | undefined> {
  initializeStorage();
  if (!presets!.has(id)) {
    return undefined;
  }
  const updatedPreset = { ...preset, id };
  presets!.set(id, updatedPreset);
  return updatedPreset;
}

export async function deletePreset(id: string): Promise<boolean> {
  initializeStorage();
  return presets!.delete(id);
}