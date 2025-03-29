import { useState, useEffect } from "react";
import { UseFormReturn } from "react-hook-form";
import { Preset, TextEnhanceRequest } from "@shared/schema";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Save, BookMarked, RefreshCw, Store } from "lucide-react";
import { getPresets as getLocalPresets, savePreset as saveLocalPreset } from "@/lib/local-storage";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface PresetManagerProps {
  form: UseFormReturn<TextEnhanceRequest>;
}

// Save preset dialog component
function SavePresetDialog({ 
  form,
  onSaved
}: { 
  form: UseFormReturn<TextEnhanceRequest>;
  onSaved: () => void;
}) {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [presetName, setPresetName] = useState("");
  const [saving, setSaving] = useState(false);

  const handleSave = () => {
    const styleGuide = form.getValues("styleGuide") || "";
    const exampleTexts = form.getValues("exampleTexts") || "";

    if (!presetName.trim()) {
      toast({
        title: "Fejl",
        description: "Angiv venligst et navn til din skabelon",
        variant: "destructive",
      });
      return;
    }

    if (!styleGuide.trim() && !exampleTexts.trim()) {
      toast({
        title: "Fejl",
        description: "Angiv venligst en stilguide eller eksempeltekster",
        variant: "destructive",
      });
      return;
    }

    try {
      setSaving(true);
      saveLocalPreset({
        name: presetName,
        styleGuide,
        exampleTexts,
      });
      
      setOpen(false);
      setPresetName("");
      toast({
        title: "Skabelon gemt",
        description: "Din stilguide og eksempeltekster er blevet gemt!",
      });
      onSaved();
    } catch (error: any) {
      toast({
        title: "Fejl",
        description: `Der opstod en fejl: ${error instanceof Error ? error.message : String(error)}`,
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="outline" 
          size="sm" 
          className="text-sm flex items-center justify-center gap-2 rounded-full shadow-sm text-gray-600 border-gray-200 hover:border-gray-300 hover:bg-gray-50"
          title="Gem som skabelon"
        >
          <Store className="h-4 w-4 text-primary" />
          <span className="hidden sm:inline">Gem skabelon</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] rounded-xl shadow-lg border-gray-100 bg-white">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-gray-800">Gem skabelon</DialogTitle>
          <DialogDescription className="text-gray-500">
            Gem din stilguide og eksempeltekster som en skabelon til senere brug.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="preset-name" className="text-base font-medium text-gray-700">Skabelon Navn</Label>
              <Input
                id="preset-name"
                placeholder="Angiv et beskrivende navn"
                value={presetName}
                onChange={(e) => setPresetName(e.target.value)}
                className="input-enhanced"
              />
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button 
            onClick={handleSave} 
            disabled={saving}
            className="w-full sm:w-auto button-primary rounded-lg"
          >
            {saving ? (
              <div className="flex items-center gap-2">
                <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Gemmer...</span>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Save className="h-4 w-4" />
                <span>Gem Skabelon</span>
              </div>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// Small Label component to avoid importing FormLabel in dialog
function Label({ htmlFor, children, className }: { 
  htmlFor: string; 
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <label htmlFor={htmlFor} className={className || "text-sm font-medium text-gray-700"}>
      {children}
    </label>
  );
}

export default function PresetManager({ form }: PresetManagerProps) {
  const { toast } = useToast();
  const [selectedPresetId, setSelectedPresetId] = useState<string>("");
  const [presets, setPresets] = useState<Preset[]>([]);
  const [loading, setLoading] = useState(false);

  // Load presets from localStorage
  const loadPresets = () => {
    setLoading(true);
    try {
      const loadedPresets = getLocalPresets();
      setPresets(loadedPresets);
    } catch (error: any) {
      toast({
        title: "Fejl ved indlæsning af skabeloner",
        description: error instanceof Error ? error.message : String(error),
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  // Initial loading of presets
  useEffect(() => {
    loadPresets();
  }, []);

  const handlePresetChange = (presetId: string) => {
    setSelectedPresetId(presetId);
    const preset = presets.find((p: Preset) => p.id === presetId);
    
    if (preset) {
      form.setValue("styleGuide", preset.styleGuide);
      form.setValue("exampleTexts", preset.exampleTexts);
      toast({
        title: "Skabelon indlæst",
        description: `Skabelon "${preset.name}" er blevet indlæst`,
      });
    }
  };

  const handlePresetSaved = () => {
    loadPresets(); // Reload presets after saving
  };

  const clearPreset = () => {
    form.setValue("styleGuide", "");
    form.setValue("exampleTexts", "");
    setSelectedPresetId("");
    toast({
      title: "Skabelon nulstillet",
      description: "Stilguide og eksempeltekster er blevet nulstillet",
    });
  };

  return (
    <div className="space-y-5 form-group">
      <div>
        <FormLabel className="label-enhanced flex items-center gap-2 mb-3">
          <BookMarked className="h-5 w-5 text-primary" />
          Skabeloner
        </FormLabel>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <div className="flex-1 w-full">
            <Select 
              value={selectedPresetId} 
              onValueChange={handlePresetChange}
            >
              <SelectTrigger className="input-enhanced w-full border-gray-200 shadow-sm">
                <SelectValue placeholder="Vælg en skabelon..." />
              </SelectTrigger>
              <SelectContent className="bg-white shadow-md border-gray-100 rounded-lg">
                <SelectItem value="none" onSelect={clearPreset} className="focus:bg-primary/5 focus:text-primary">
                  Ingen skabelon (nulstil)
                </SelectItem>
                
                {presets.map((preset: Preset) => preset.id && (
                  <SelectItem key={preset.id} value={preset.id} className="focus:bg-primary/5 focus:text-primary">
                    {preset.name}
                  </SelectItem>
                ))}
                
                {presets.length === 0 && (
                  <SelectItem value="empty" disabled className="text-gray-400 italic">
                    Ingen skabeloner fundet
                  </SelectItem>
                )}
              </SelectContent>
            </Select>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={loadPresets}
              disabled={loading}
              title="Genindlæs skabeloner"
              className="rounded-full text-gray-600 border-gray-200 hover:border-gray-300 hover:bg-gray-50 shadow-sm"
            >
              <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            </Button>
            <SavePresetDialog form={form} onSaved={handlePresetSaved} />
          </div>
        </div>
      </div>
      
      <div className="text-sm text-gray-500 bg-gray-50 p-4 rounded-xl border border-gray-100">
        <p>Vælg en skabelon fra listen eller opret en ny ved at udfylde stilguide og eksempeltekster nedenfor.</p>
      </div>
    </div>
  );
}