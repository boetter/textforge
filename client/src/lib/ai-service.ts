import { TextEnhanceRequest, TextEnhanceResponse, Preset } from "@shared/schema";
import { getPresets as getLocalPresets, savePreset as saveLocalPreset, updatePreset as updateLocalPreset, deletePreset as deleteLocalPreset } from "./local-storage";
import { apiRequest } from "./queryClient";

// Basissti for Netlify-funktioner
const NETLIFY_API_BASE = '/.netlify/functions';

/**
 * Enhance text using selected AI model
 */
export async function enhanceText(data: TextEnhanceRequest): Promise<TextEnhanceResponse> {
  try {
    console.log("Sender anmodning om tekstforbedring");
    
    // Først prøv direkte Netlify-funktion
    try {
      console.log("Kalder Netlify function på: " + `${NETLIFY_API_BASE}/enhance`);
      const response = await fetch(`${NETLIFY_API_BASE}/enhance`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        console.error(`Netlify funktion fejlede med status: ${response.status} ${response.statusText}`);
        throw new Error(`Netlify funktion fejlede: ${response.status} ${response.statusText}`);
      }
      
      return await response.json();
    } catch (netlifyError) {
      console.warn('Netlify funktion fejlede, prøver fallback til /api/enhance:', netlifyError);
      
      // Prøv via /api/ omdirigering (som omdirigeres til Netlify funktion via netlify.toml)
      try {
        console.log("Prøver via /api/enhance");
        const apiResponse = await fetch(`/api/enhance`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        });
        
        if (!apiResponse.ok) {
          console.error(`API omdirigering fejlede med status: ${apiResponse.status} ${apiResponse.statusText}`);
          throw new Error(`API omdirigering fejlede: ${apiResponse.status} ${apiResponse.statusText}`);
        }
        
        return await apiResponse.json();
      } catch (apiError) {
        console.warn('API omdirigering fejlede, prøver Express fallback:', apiError);
        
        // Fallback til Express-endepunkt hvis alt andet fejler
        return await apiRequest<TextEnhanceResponse>({
          url: "/api/enhance",
          method: "POST",
          body: data
        });
      }
    }
  } catch (error) {
    console.error(`Fejl ved forbedring af tekst:`, error);
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("Kunne ikke forbedre teksten. Kontroller din internetforbindelse og prøv igen.");
  }
}

/**
 * Get all saved presets
 */
export async function getPresets(): Promise<Preset[]> {
  try {
    // Først prøv direkte Netlify-funktion
    try {
      console.log("Kalder Netlify function på: " + `${NETLIFY_API_BASE}/get-presets`);
      const response = await fetch(`${NETLIFY_API_BASE}/get-presets`);
      
      if (!response.ok) {
        console.error(`Netlify funktion fejlede med status: ${response.status} ${response.statusText}`);
        throw new Error(`Netlify funktion fejlede: ${response.status} ${response.statusText}`);
      }
      
      return await response.json();
    } catch (netlifyError) {
      console.warn('Netlify funktion fejlede, prøver fallback til /api/presets:', netlifyError);
      
      // Prøv via /api/ omdirigering
      try {
        console.log("Prøver via /api/presets");
        const apiResponse = await fetch(`/api/presets`);
        
        if (!apiResponse.ok) {
          console.error(`API omdirigering fejlede med status: ${apiResponse.status} ${apiResponse.statusText}`);
          throw new Error(`API omdirigering fejlede: ${apiResponse.status} ${apiResponse.statusText}`);
        }
        
        return await apiResponse.json();
      } catch (apiError) {
        console.warn('API omdirigering fejlede, prøver Express fallback:', apiError);
        
        // Fallback til Express-endepunkt
        return await apiRequest<Preset[]>({ url: "/api/presets" });
      }
    }
  } catch (error) {
    console.warn("Kunne ikke hente presets fra API, falder tilbage til localStorage:", error);
    // Fejl tilbage til localStorage som backup
    try {
      return getLocalPresets();
    } catch (localError) {
      console.error("Fejl ved hentning af presets fra localStorage:", localError);
      throw new Error(localError instanceof Error ? localError.message : "Kunne ikke hente presets");
    }
  }
}

/**
 * Create a new preset
 */
export async function createPreset(preset: Omit<Preset, "id">): Promise<Preset> {
  try {
    // Første prøv Netlify-funktion
    try {
      const response = await fetch(`${NETLIFY_API_BASE}/create-preset`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(preset),
      });
      
      if (!response.ok) {
        throw new Error(`Netlify funktion fejlede: ${response.status} ${response.statusText}`);
      }
      
      return await response.json();
    } catch (netlifyError) {
      console.warn('Netlify funktion fejlede, prøver fallback til Express:', netlifyError);
      
      // Fallback til Express-endepunkt
      return await apiRequest<Preset>({
        url: "/api/presets",
        method: "POST",
        body: preset
      });
    }
  } catch (error) {
    console.warn("Kunne ikke gemme preset via API, falder tilbage til localStorage:", error);
    // Fejl tilbage til localStorage som backup
    try {
      return saveLocalPreset(preset);
    } catch (localError) {
      console.error("Fejl ved oprettelse af preset i localStorage:", localError);
      throw new Error(localError instanceof Error ? localError.message : "Kunne ikke oprette preset");
    }
  }
}

/**
 * Update an existing preset
 */
export async function updatePreset(id: string, preset: Preset): Promise<Preset | undefined> {
  try {
    // Første prøv Netlify-funktion
    try {
      const response = await fetch(`${NETLIFY_API_BASE}/update-preset/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(preset),
      });
      
      if (!response.ok) {
        throw new Error(`Netlify funktion fejlede: ${response.status} ${response.statusText}`);
      }
      
      return await response.json();
    } catch (netlifyError) {
      console.warn('Netlify funktion fejlede, prøver fallback til Express:', netlifyError);
      
      // Fallback til Express-endepunkt
      return await apiRequest<Preset>({
        url: `/api/presets/${id}`,
        method: "PUT",
        body: preset
      });
    }
  } catch (error) {
    console.warn("Kunne ikke opdatere preset via API, falder tilbage til localStorage:", error);
    // Fejl tilbage til localStorage som backup
    try {
      return updateLocalPreset(id, preset);
    } catch (localError) {
      console.error("Fejl ved opdatering af preset i localStorage:", localError);
      throw new Error(localError instanceof Error ? localError.message : "Kunne ikke opdatere preset");
    }
  }
}

/**
 * Delete a preset
 */
export async function deletePreset(id: string): Promise<boolean> {
  try {
    // Første prøv Netlify-funktion
    try {
      const response = await fetch(`${NETLIFY_API_BASE}/delete-preset/${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error(`Netlify funktion fejlede: ${response.status} ${response.statusText}`);
      }
      
      await response.json();
      return true;
    } catch (netlifyError) {
      console.warn('Netlify funktion fejlede, prøver fallback til Express:', netlifyError);
      
      // Fallback til Express-endepunkt
      await apiRequest({
        url: `/api/presets/${id}`,
        method: "DELETE"
      });
      return true;
    }
  } catch (error) {
    console.warn("Kunne ikke slette preset via API, falder tilbage til localStorage:", error);
    // Fejl tilbage til localStorage som backup
    try {
      return deleteLocalPreset(id);
    } catch (localError) {
      console.error("Fejl ved sletning af preset fra localStorage:", localError);
      throw new Error(localError instanceof Error ? localError.message : "Kunne ikke slette preset");
    }
  }
}
