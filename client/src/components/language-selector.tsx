import { SUPPORTED_LANGUAGES } from "@shared/schema";
import { FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import type { UseFormReturn } from "react-hook-form";
import type { TextEnhanceRequest } from "@shared/schema";
import { Globe } from "lucide-react";

interface LanguageSelectorProps {
  form: UseFormReturn<TextEnhanceRequest>;
}

// Oversættelser af sprognavne
const languageNames: Record<string, string> = {
  "dansk": "Dansk",
  "norsk": "Norsk",
  "svensk": "Svensk",
  "engelsk": "Engelsk"
};

// Flag emojis for visual representation
const languageFlags: Record<string, string> = {
  "dansk": "🇩🇰",
  "norsk": "🇳🇴",
  "svensk": "🇸🇪",
  "engelsk": "🇬🇧"
};

// Beskrivelser af sprogene
const languageDescriptions: Record<string, string> = {
  "dansk": "Standard for danske tekster",
  "norsk": "Godt til norske indhold",
  "svensk": "Optimalt til svenske tekster",
  "engelsk": "Internationalt sprog"
};

export default function LanguageSelector({ form }: LanguageSelectorProps) {
  return (
    <FormField
      control={form.control}
      name="language"
      render={({ field }) => (
        <FormItem className="space-y-3">
          <FormLabel className="label-enhanced flex items-center gap-2">
            <Globe className="h-5 w-5 text-primary" />
            Sprog
          </FormLabel>
          
          <RadioGroup
            onValueChange={field.onChange}
            defaultValue={field.value}
            className="grid grid-cols-1 gap-4 pt-2"
          >
            <FormControl>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {SUPPORTED_LANGUAGES.map((lang) => (
                  <label
                    key={lang}
                    htmlFor={`lang-${lang}`}
                    className={`flex flex-col border-2 rounded-xl overflow-hidden cursor-pointer transition-all ${
                      field.value === lang
                        ? "border-primary bg-primary/5"
                        : "border-gray-200 hover:border-gray-300 bg-white"
                    }`}
                  >
                    <RadioGroupItem value={lang} id={`lang-${lang}`} className="sr-only" />
                    <div className="flex items-center justify-between p-4">
                      <div className="flex items-center gap-3">
                        <div className="text-2xl">{languageFlags[lang]}</div>
                        <div className="text-sm font-medium">{languageNames[lang]}</div>
                      </div>
                    </div>
                    <div className="bg-gray-50 px-3 py-2 text-xs text-gray-600">
                      {languageDescriptions[lang]}
                    </div>
                  </label>
                ))}
              </div>
            </FormControl>
          </RadioGroup>
        </FormItem>
      )}
    />
  );
}