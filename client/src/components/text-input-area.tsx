import { useState, useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { TextEnhanceRequest, TextEnhanceResponse, textEnhanceSchema } from "@shared/schema";
import { enhanceText } from "@/lib/ai-service";
import ModelSelector from "@/components/model-selector";
import LanguageSelector from "@/components/language-selector";
import PresetManager from "@/components/preset-manager";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Sparkles, Settings2 } from "lucide-react";
import { RichTextEditor, RichTextEditorRef } from "@/components/ui/rich-text-editor";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface TextInputAreaProps {
  setResult: (result: TextEnhanceResponse | null) => void;
  setIsLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  isLoading: boolean;
}

export default function TextInputArea({
  setResult,
  setIsLoading,
  setError,
  isLoading
}: TextInputAreaProps) {
  const { toast } = useToast();
  const editorRef = useRef<RichTextEditorRef>(null);

  const form = useForm<TextEnhanceRequest>({
    resolver: zodResolver(textEnhanceSchema),
    defaultValues: {
      originalText: "",
      model: "claude",
      styleGuide: "",
      exampleTexts: "",
      instructions: "",
      language: "dansk"
    }
  });
  
  // Sync rich text editor with form
  const handleEditorChange = ({ html, text }: { html: string; text: string }) => {
    form.setValue('originalText', html, { shouldValidate: true });
  };
  
  // Update editor when form value changes (e.g. when presets are loaded)
  useEffect(() => {
    const subscription = form.watch((value) => {
      if (editorRef.current && typeof value.originalText === 'string') {
        const currentHTML = editorRef.current.getHTML();
        if (value.originalText !== currentHTML) {
          editorRef.current.setHTML(value.originalText);
        }
      }
    });
    return () => subscription.unsubscribe();
  }, [form]);

  async function onSubmit(data: TextEnhanceRequest) {
    if (!data.originalText.trim()) {
      toast({
        title: "Fejl",
        description: "Indtast venligst tekst, der skal forbedres",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    setError(null);
    
    try {
      const result = await enhanceText(data);
      setResult(result);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Der opstod en ukendt fejl";
      setError(message);
      toast({
        title: "Fejl ved forbedring af teksten",
        description: message,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="originalText"
          render={({ field }) => (
            <FormItem className="form-group">
              <FormLabel className="label-enhanced">Original Tekst</FormLabel>
              <FormControl>
                <div className="relative">
                  <RichTextEditor
                    ref={editorRef}
                    initialValue={field.value}
                    onChange={handleEditorChange}
                    minHeight="224px"
                    className="shadow-sm hover:bg-gray-50/70 hover:shadow focus:bg-white focus:shadow transition-all duration-200"
                    placeholder="Indtast eller indsæt din tekst her..."
                    error={!!form.formState.errors.originalText}
                  />
                  {/* Visuel indikator for, at feltet kan klikkes */}
                  <div className="absolute -bottom-3.5 right-3 bg-gray-100 text-gray-500 text-xs py-1 px-2 rounded-md shadow-sm pointer-events-none opacity-70">
                    Klik her for at aktivere editor
                  </div>
                </div>
              </FormControl>
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="instructions"
          render={({ field }) => (
            <FormItem className="form-group">
              <FormLabel className="label-enhanced">Særlige instruktioner</FormLabel>
              <FormControl>
                <div className="relative">
                  <Textarea
                    placeholder="F.eks. 'Ret mine stavefejl' eller 'Oversæt til tysk'..."
                    className="textarea-enhanced h-28"
                    {...field}
                  />
                </div>
              </FormControl>
            </FormItem>
          )}
        />
        
        <Accordion type="single" collapsible className="border rounded-xl border-gray-100 shadow-sm bg-white">
          <AccordionItem value="item-1" className="border-none">
            <AccordionTrigger className="px-6 py-5 text-lg font-medium hover:bg-gray-50 rounded-t-xl transition-colors">
              <div className="flex items-center gap-3">
                <Settings2 className="h-6 w-6 text-primary" />
                <span>Avancerede indstillinger</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-6 pb-6 pt-4 space-y-8">
              <div className="space-y-10">
                <PresetManager form={form} />
                <ModelSelector form={form} />
                <LanguageSelector form={form} />
                
                <FormField
                  control={form.control}
                  name="styleGuide"
                  render={({ field }) => (
                    <FormItem className="form-group">
                      <FormLabel className="label-enhanced">Stilguide</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Textarea
                            placeholder="Beskriv krav til tekstens format, tone eller stil..."
                            className="textarea-enhanced h-36"
                            {...field}
                          />
                        </div>
                      </FormControl>
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="exampleTexts"
                  render={({ field }) => (
                    <FormItem className="form-group">
                      <FormLabel className="label-enhanced">Eksempeltekster</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Textarea
                            placeholder="Indsæt eksempler på den type tekst du ønsker..."
                            className="textarea-enhanced h-36"
                            {...field}
                          />
                        </div>
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
        
        <Button 
          type="submit" 
          disabled={isLoading}
          className={`w-full button-primary py-7 px-6 rounded-xl shadow-md transition-all text-white font-medium text-lg mt-8 flex items-center justify-center ${isLoading ? 'bg-gradient-to-r from-primary to-primary/80 animate-pulse' : 'hover:shadow-lg'}`}
        >
          {isLoading ? (
            <div className="flex items-center justify-center">
              <div className="relative">
                <svg className="animate-spin mr-3 h-7 w-7 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span className="absolute -bottom-1 -right-1 flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-white"></span>
                </span>
              </div>
              <span className="font-semibold text-lg">Bearbejder tekst...</span>
            </div>
          ) : (
            <div className="flex items-center">
              <Sparkles className="mr-3 h-6 w-6" />
              <span className="font-semibold text-lg">Send til AI-model</span>
            </div>
          )}
        </Button>
      </form>
    </Form>
  );
}
