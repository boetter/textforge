import { Preset } from '@shared/schema';

// Standard preset som altid er tilgængelig
const DEFAULT_PRESET: Preset = {
  id: "default-preset",
  name: "Standard Stilguide",
  styleGuide: "Teksten skal være professionel og klar med et formelt, men venligt sprog. Undgå slang og forkortelser. Brug aktiv form frem for passiv. Brug korte, klare sætninger. Målgruppen er professionelle voksne.",
  exampleTexts: "Vi er glade for at kunne præsentere vores nyeste produkt, som er udviklet med fokus på brugervenlighed og effektivitet. Produktet løser flere udfordringer, som vores kunder har påpeget i deres feedback.\n\nVores team har arbejdet intensivt for at sikre, at alle funktioner fungerer optimalt. Vi står naturligvis til rådighed, hvis du har spørgsmål eller behov for support."
};

// Lagringskey til localStorage
const PRESETS_STORAGE_KEY = 'text-enhancer-presets';

// Henter alle presets fra localStorage + standard preset
export function getPresets(): Preset[] {
  try {
    // Hent gemte presets fra localStorage
    const storedPresets = localStorage.getItem(PRESETS_STORAGE_KEY);
    const userPresets: Preset[] = storedPresets ? JSON.parse(storedPresets) : [];
    
    // Tilføj standard preset først
    return [DEFAULT_PRESET, ...userPresets];
  } catch (error) {
    console.error('Fejl ved hentning af presets fra localStorage:', error);
    return [DEFAULT_PRESET];
  }
}

// Finder en specifik preset baseret på ID
export function getPreset(id: string): Preset | undefined {
  if (id === DEFAULT_PRESET.id) {
    return DEFAULT_PRESET;
  }
  
  const presets = getPresets();
  return presets.find(preset => preset.id === id);
}

// Gemmer en ny preset i localStorage
export function savePreset(preset: Omit<Preset, 'id'>): Preset {
  try {
    const presets = getPresets().filter(p => p.id !== DEFAULT_PRESET.id);
    
    // Generer et nyt ID baseret på timestamp og tilfældigt tal
    const newPreset: Preset = { 
      ...preset, 
      id: `preset-${Date.now()}-${Math.floor(Math.random() * 10000)}`
    };
    
    // Tilføj den nye preset til listen
    presets.push(newPreset);
    
    // Gem alle presets undtagen default i localStorage
    const presetsToSave = presets.filter(p => p.id !== DEFAULT_PRESET.id);
    localStorage.setItem(PRESETS_STORAGE_KEY, JSON.stringify(presetsToSave));
    
    return newPreset;
  } catch (error) {
    console.error('Fejl ved gemning af preset i localStorage:', error);
    throw new Error('Kunne ikke gemme preset. Prøv igen senere.');
  }
}

// Opdaterer en eksisterende preset
export function updatePreset(id: string, preset: Preset): Preset | undefined {
  if (id === DEFAULT_PRESET.id) {
    throw new Error('Standard preset kan ikke ændres');
  }
  
  try {
    const presets = getPresets().filter(p => p.id !== DEFAULT_PRESET.id);
    const presetIndex = presets.findIndex(p => p.id === id);
    
    if (presetIndex === -1) {
      return undefined;
    }
    
    // Opdater preset
    const updatedPreset = { ...preset, id };
    presets[presetIndex] = updatedPreset;
    
    // Gem opdaterede presets
    localStorage.setItem(PRESETS_STORAGE_KEY, JSON.stringify(presets));
    
    return updatedPreset;
  } catch (error) {
    console.error('Fejl ved opdatering af preset:', error);
    throw new Error('Kunne ikke opdatere preset. Prøv igen senere.');
  }
}

// Sletter en preset
export function deletePreset(id: string): boolean {
  if (id === DEFAULT_PRESET.id) {
    throw new Error('Standard preset kan ikke slettes');
  }
  
  try {
    const presets = getPresets().filter(p => p.id !== DEFAULT_PRESET.id);
    const filteredPresets = presets.filter(p => p.id !== id);
    
    if (filteredPresets.length === presets.length) {
      return false; // Preset ikke fundet
    }
    
    // Gem filtrerede presets
    localStorage.setItem(PRESETS_STORAGE_KEY, JSON.stringify(filteredPresets));
    
    return true;
  } catch (error) {
    console.error('Fejl ved sletning af preset:', error);
    throw new Error('Kunne ikke slette preset. Prøv igen senere.');
  }
}