import { Dispatch, SetStateAction } from "react";
import { UseFormReturn } from "react-hook-form";
import { TextEnhanceRequest } from "@shared/schema";
import { ChevronDown, ChevronUp } from "lucide-react";
import { FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import LanguageSelector from "./language-selector";

interface AdditionalOptionsProps {
  form: UseFormReturn<TextEnhanceRequest>;
  showOptions: boolean;
  setShowOptions: Dispatch<SetStateAction<boolean>>;
}

export default function AdditionalOptions({
  form,
  showOptions,
  setShowOptions
}: AdditionalOptionsProps) {
  return (
    <div className="border border-gray-200 rounded-lg p-4">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-medium text-gray-700">Flere indstillinger</h3>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => setShowOptions(!showOptions)}
          className="text-primary-500 text-sm hover:text-primary-600 focus:outline-none h-auto p-0"
        >
          <span>{showOptions ? "Skjul" : "Vis"}</span>
          {showOptions ? (
            <ChevronUp className="h-4 w-4 inline ml-1 transition-transform" />
          ) : (
            <ChevronDown className="h-4 w-4 inline ml-1 transition-transform" />
          )}
        </Button>
      </div>
      
      {showOptions && (
        <div className="space-y-4 mt-4">
          {/* Sprog-selector */}
          <LanguageSelector form={form} />
          
          <FormField
            control={form.control}
            name="styleGuide"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium text-gray-700">Stilguide</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="F.eks., 'Skriv i en professionel tone, undgå fagsprog, brug aktiv stemme...'"
                    className="h-24 px-3 py-2 text-gray-700 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
                    {...field}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="exampleTexts"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium text-gray-700">Eksempeltekster</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Indsæt eksempler til inspiration eller kontekst..."
                    className="h-24 px-3 py-2 text-gray-700 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
                    {...field}
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </div>
      )}
    </div>
  );
}
