import { UseFormReturn } from "react-hook-form";
import { TextEnhanceRequest } from "@shared/schema";
import { FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { BrainCircuit } from "lucide-react";
import { SiAnthropic, SiGoogle, SiOpenai } from "react-icons/si";

interface ModelSelectorProps {
  form: UseFormReturn<TextEnhanceRequest>;
}

export default function ModelSelector({ form }: ModelSelectorProps) {
  return (
    <FormField
      control={form.control}
      name="model"
      render={({ field }) => (
        <FormItem className="space-y-3">
          <FormLabel className="label-enhanced flex items-center gap-2">
            <BrainCircuit className="h-5 w-5 text-primary" />
            Vælg AI-Model
          </FormLabel>
          
          <RadioGroup
            onValueChange={field.onChange}
            defaultValue={field.value}
            className="grid grid-cols-1 gap-4 pt-2"
          >
            <FormControl>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <label
                  htmlFor="claude"
                  className={`flex flex-col border-2 rounded-xl overflow-hidden cursor-pointer transition-all ${
                    field.value === "claude"
                      ? "border-primary bg-primary/5"
                      : "border-gray-200 hover:border-gray-300 bg-white"
                  }`}
                >
                  <RadioGroupItem value="claude" id="claude" className="sr-only" />
                  <div className="flex items-center justify-between p-4">
                    <div className="flex items-center gap-3">
                      <div className="border border-gray-100 rounded-full p-1.5 bg-white">
                        <SiAnthropic className="text-[#b942ff] h-5 w-5" />
                      </div>
                      <div className="text-sm font-medium">Claude 3.7 Sonnet</div>
                    </div>
                  </div>
                  <div className="bg-gray-50 px-3 py-2 text-xs text-gray-600">
                    Bedst til nuancerede tekster
                  </div>
                </label>

                <label
                  htmlFor="gemini"
                  className={`flex flex-col border-2 rounded-xl overflow-hidden cursor-pointer transition-all ${
                    field.value === "gemini"
                      ? "border-primary bg-primary/5"
                      : "border-gray-200 hover:border-gray-300 bg-white"
                  }`}
                >
                  <RadioGroupItem value="gemini" id="gemini" className="sr-only" />
                  <div className="flex items-center justify-between p-4">
                    <div className="flex items-center gap-3">
                      <div className="border border-gray-100 rounded-full p-1.5 bg-white">
                        <SiGoogle className="text-[#1a73e8] h-5 w-5" />
                      </div>
                      <div className="text-sm font-medium">Gemini 2.5 Pro</div>
                    </div>
                  </div>
                  <div className="bg-gray-50 px-3 py-2 text-xs text-gray-600">
                    Balanceret hastighed og kvalitet
                  </div>
                </label>

                <label
                  htmlFor="chatgpt"
                  className={`flex flex-col border-2 rounded-xl overflow-hidden cursor-pointer transition-all ${
                    field.value === "chatgpt"
                      ? "border-primary bg-primary/5"
                      : "border-gray-200 hover:border-gray-300 bg-white"
                  }`}
                >
                  <RadioGroupItem value="chatgpt" id="chatgpt" className="sr-only" />
                  <div className="flex items-center justify-between p-4">
                    <div className="flex items-center gap-3">
                      <div className="border border-gray-100 rounded-full p-1.5 bg-white">
                        <SiOpenai className="text-[#00A67E] h-5 w-5" />
                      </div>
                      <div className="text-sm font-medium">GPT-4o</div>
                    </div>
                  </div>
                  <div className="bg-gray-50 px-3 py-2 text-xs text-gray-600">
                    Højeste præcision og detaljegrad
                  </div>
                </label>
              </div>
            </FormControl>
          </RadioGroup>
        </FormItem>
      )}
    />
  );
}
