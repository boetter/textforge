import { useState, useRef, useEffect } from "react";
import { TextEnhanceResponse } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { AlertCircle, Check, Clipboard, FileText } from "lucide-react";
import { RichTextEditor, RichTextEditorRef } from "@/components/ui/rich-text-editor";

interface ResultDisplayProps {
  result: TextEnhanceResponse | null;
  isLoading: boolean;
  error: string | null;
}

export default function ResultDisplay({
  result,
  isLoading,
  error
}: ResultDisplayProps) {
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);
  const resultEditorRef = useRef<RichTextEditorRef>(null);

  // Opdater editoren, når resultatet ændres
  useEffect(() => {
    if (result && resultEditorRef.current) {
      // Hvis enhancedText starter med <h1><strong> eller lignende tags, så behold det
      // Men ellers wrap indholdet i en <div> for at sikre at vi ikke har uønsket fed skrift
      let sanitizedHtml = result.enhancedText;
      
      // Check om der ikke er nogen HTML tags i teksten (helt ren tekst fra API)
      if (!sanitizedHtml.includes('<')) {
        sanitizedHtml = `<p>${sanitizedHtml}</p>`;
      }
      
      // Sikrer at paragraffer ikke er formateret som fed tekst medmindre det er tilsigtet
      sanitizedHtml = sanitizedHtml.replace(/<p><strong>([\s\S]*?)<\/strong><\/p>/g, (match, p1) => {
        // Tjek om strong tag var tilsigtet (f.eks. hvis kun en del af teksten var fed)
        // eller om hele paragraffen blev markeret som fed af AI-modellen
        if (p1.includes('<strong>') || p1.includes('<em>') || p1.includes('<u>')) {
          // Hvis der er andre formateringer inden i strong, så behold strong-tagget
          return match;
        } else {
          // Ellers fjern strong-tagget omkring hele paragraffen
          return `<p>${p1}</p>`;
        }
      });
      
      resultEditorRef.current.setHTML(sanitizedHtml);
    }
  }, [result]);

  const handleCopy = async () => {
    if (!result || !resultEditorRef.current) return;
    
    try {
      // Hent HTML-indholdet fra editoren
      const htmlContent = resultEditorRef.current.getHTML();
      // Hent også ren tekst som backup
      const textContent = resultEditorRef.current.getText();
      
      // Forsøg at kopiere HTML (virker i moderne browsere)
      try {
        // Brug ClipboardItem API til at kopiere HTML
        const clipboardItem = new ClipboardItem({
          'text/html': new Blob([htmlContent], { type: 'text/html' }),
          'text/plain': new Blob([textContent], { type: 'text/plain' })
        });
        await navigator.clipboard.write([clipboardItem]);
      } catch (clipError) {
        // Fallback til ren tekst hvis ClipboardItem ikke understøttes
        await navigator.clipboard.writeText(textContent);
      }
      
      setCopied(true);
      toast({
        title: "Kopieret til udklipsholder",
        description: "Den forbedrede tekst er blevet kopieret til din udklipsholder med formatering",
      });
      
      // Reset copied state after 2 seconds
      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (err) {
      toast({
        title: "Kunne ikke kopiere",
        description: "Kunne ikke kopiere teksten til udklipsholderen",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex justify-between items-center mb-5">
        {result && (
          <Button
            variant="outline"
            size="default"
            onClick={handleCopy}
            className={`transition-all px-5 ${copied ? 'text-green-600 border-green-200 bg-green-50' : 'text-gray-600 border-gray-200 hover:border-gray-300'} rounded-full shadow-sm`}
          >
            {copied ? (
              <div className="flex items-center gap-2.5">
                <Check className="h-5 w-5" />
                <span className="font-medium">Kopieret</span>
              </div>
            ) : (
              <div className="flex items-center gap-2.5">
                <Clipboard className="h-5 w-5" />
                <span className="font-medium">Kopier til udklipsholder</span>
              </div>
            )}
          </Button>
        )}
      </div>
      
      <div className="flex-1 rounded-xl p-8 bg-white border border-gray-100 min-h-[24rem] overflow-auto shadow-sm">
        {/* Empty state */}
        {!result && !isLoading && !error && (
          <div className="flex flex-col h-full items-center justify-center text-gray-400">
            <FileText className="h-14 w-14 mb-5 opacity-50" />
            <p className="text-xl text-center">Din forbedrede tekst<br/>vil blive vist her</p>
          </div>
        )}
        
        {/* Result content - bruger RichTextEditor i read-only mode */}
        {result && !isLoading && !error && (
          <RichTextEditor
            ref={resultEditorRef}
            initialValue={result.enhancedText}
            minHeight="300px"
            className="border-none shadow-none"
            readOnly={true}
          />
        )}
        
        {/* Error state */}
        {error && !isLoading && (
          <div className="flex flex-col h-full items-center justify-center text-red-500 px-6">
            <AlertCircle className="h-14 w-14 mb-5" />
            <div className="text-center max-w-xl">
              <p className="text-xl mb-3">{error.split('\n\n')[0]}</p>
              
              {/* Vis instruktioner hvis det er en API-nøgle fejl */}
              {error.includes('API-nøgle') && (
                <div className="mt-6 bg-red-50 border border-red-200 rounded-lg p-4 text-left text-red-700">
                  <h3 className="font-bold mb-2">Sådan tilføjer du API-nøglen:</h3>
                  <ol className="list-decimal list-inside space-y-2">
                    <li>Gå til <a href="https://app.netlify.com/sites/" target="_blank" rel="noopener noreferrer" className="underline">Netlify dashboard</a></li>
                    <li>Vælg dit site</li>
                    <li>Gå til <strong>Site settings</strong> &gt; <strong>Environment variables</strong></li>
                    <li>Klik på <strong>Add a variable</strong></li>
                    <li>Tilføj den nødvendige API-nøgle</li>
                    <li>Genindlæs siden efter du har gemt ændringerne</li>
                  </ol>
                </div>
              )}
              
              {/* Vis eventuelt flere detaljer */}
              {error.split('\n\n').length > 1 && (
                <p className="text-sm mt-4 text-red-600">{error.split('\n\n')[1]}</p>
              )}
            </div>
          </div>
        )}
        
        {/* Loading state */}
        {isLoading && (
          <div className="flex flex-col h-full items-center justify-center text-gray-500">
            <div className="flex flex-col items-center justify-center mb-8">
              <div className="relative mb-6">
                <svg className="animate-spin h-16 w-16 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="h-8 w-8 rounded-full bg-primary/10"></div>
                </div>
              </div>
              
              <div className="text-center space-y-4">
                <h3 className="text-xl font-medium text-primary">Teksten bearbejdes...</h3>
                <div className="flex gap-1.5 justify-center">
                  <div className="w-2 h-2 rounded-full bg-primary/70 animate-bounce" style={{ animationDelay: "0ms" }}></div>
                  <div className="w-2 h-2 rounded-full bg-primary/70 animate-bounce" style={{ animationDelay: "150ms" }}></div>
                  <div className="w-2 h-2 rounded-full bg-primary/70 animate-bounce" style={{ animationDelay: "300ms" }}></div>
                </div>
              </div>
            </div>
            
            <div className="max-w-sm text-center text-gray-500 text-sm opacity-90 italic">
              Afhængigt af tekstens længde og kompleksitet kan dette tage nogle øjeblikke
            </div>
          </div>
        )}
      </div>
      
      {/* Response metadata */}
      {result && (
        <div className="mt-5 flex justify-between items-center text-sm text-gray-500 bg-gray-50 p-5 rounded-xl border border-gray-100 shadow-sm">
          <div className="flex items-center gap-3">
            <span>Genereret med</span>
            <span className="font-medium px-3.5 py-1.5 bg-primary/10 text-primary rounded-full">
              {result.model === "claude" ? "Claude 3.7 Sonnet" : 
               result.model === "chatgpt" ? "GPT-4o" : 
               result.model === "gemini" ? "Gemini 2.5 Pro" : result.model}
            </span>
          </div>
          <div>
            <span>{new Date(result.timestamp).toLocaleTimeString()}</span>
          </div>
        </div>
      )}
    </div>
  );
}
