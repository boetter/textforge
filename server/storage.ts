import { users, Preset, type User, type InsertUser } from "@shared/schema";

// modify the interface with any CRUD methods
// you might need

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Preset management
  getPresets(): Promise<Preset[]>;
  getPreset(id: string): Promise<Preset | undefined>;
  createPreset(preset: Preset): Promise<Preset>;
  updatePreset(id: string, preset: Preset): Promise<Preset | undefined>;
  deletePreset(id: string): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private presets: Map<string, Preset>;
  currentId: number;
  presetId: number;

  constructor() {
    this.users = new Map();
    this.presets = new Map();
    this.currentId = 1;
    this.presetId = 1;
    
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
    this.presets.set(defaultPreset.id!, defaultPreset);
    this.presets.set(simpelRedigeringPreset.id!, simpelRedigeringPreset);
    this.presets.set(mereProfessionelPreset.id!, mereProfessionelPreset);
    this.presets.set(linkedInPreset.id!, linkedInPreset);
    this.presets.set(shortAndSweetPreset.id!, shortAndSweetPreset);
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  // Preset management implementation
  async getPresets(): Promise<Preset[]> {
    return Array.from(this.presets.values());
  }

  async getPreset(id: string): Promise<Preset | undefined> {
    return this.presets.get(id);
  }

  async createPreset(preset: Preset): Promise<Preset> {
    const id = this.presetId.toString();
    this.presetId++;
    const newPreset = { ...preset, id };
    this.presets.set(id, newPreset);
    return newPreset;
  }

  async updatePreset(id: string, preset: Preset): Promise<Preset | undefined> {
    if (!this.presets.has(id)) {
      return undefined;
    }
    const updatedPreset = { ...preset, id };
    this.presets.set(id, updatedPreset);
    return updatedPreset;
  }

  async deletePreset(id: string): Promise<boolean> {
    return this.presets.delete(id);
  }
}

export const storage = new MemStorage();
