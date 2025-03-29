import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertCircle, Home, ArrowLeft, Info } from "lucide-react";
import { Link, useLocation } from "wouter";
import { useEffect, useState } from "react";

export default function NotFound() {
  const [location] = useLocation();
  const [isApiError, setIsApiError] = useState(false);
  
  // Tjek om det er en API-fejl baseret på URL
  useEffect(() => {
    const isApiPath = location.startsWith("/api/") || location.includes("/.netlify/functions/");
    setIsApiError(isApiPath);
  }, [location]);
  
  // Funktion til at gå tilbage til forrige side
  const goBack = () => {
    window.history.back();
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gray-50">
      <Card className="w-full max-w-md mx-4 shadow-lg">
        <CardContent className="pt-6 pb-6">
          <div className="flex flex-col items-center text-center mb-6">
            <AlertCircle className="h-16 w-16 text-red-500 mb-4" />
            <h1 className="text-2xl font-bold text-gray-900">
              {isApiError ? "API Fejl (404)" : "Siden blev ikke fundet"}
            </h1>
            <p className="mt-4 text-gray-600">
              {isApiError 
                ? "Der opstod en fejl ved kommunikation med API'et. Dette kan skyldes manglende API-nøgler eller forkert konfiguration."
                : "Den side, du leder efter, findes ikke eller er blevet flyttet."
              }
            </p>
            
            {isApiError && (
              <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-lg text-left w-full">
                <div className="flex items-start">
                  <Info className="h-5 w-5 text-amber-500 mr-2 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm text-amber-800 font-medium">Mulige årsager:</p>
                    <ul className="mt-2 text-xs text-amber-700 list-disc pl-4 space-y-1">
                      <li>Manglende API-nøgler i Netlify miljøvariable (OPENAI_API_KEY, ANTHROPIC_API_KEY, GOOGLE_API_KEY)</li>
                      <li>Forkert konfiguration af Netlify Functions (tjek node_bundler og included_files)</li>
                      <li>Problemer med redirects i netlify.toml (tjek om /api/* peger på /.netlify/functions/:splat)</li>
                      <li>Ugyldigt filformat i importstier (manglende .js-endelser i produktionsmiljø)</li>
                    </ul>
                    <p className="mt-3 text-xs text-amber-800">
                      Se <span className="font-medium">NETLIFY_SETUP.md</span> for 
                      mere information om fejlsøgning eller <span className="font-medium">logfiler i Netlify dashboard</span> 
                      for specifikke fejlbeskeder.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="flex flex-col sm:flex-row gap-3 mt-6">
            <Button 
              variant="outline" 
              className="flex-1 gap-2" 
              onClick={goBack}
            >
              <ArrowLeft className="h-4 w-4" />
              Gå tilbage
            </Button>
            <Button 
              className="flex-1 gap-2" 
              asChild
            >
              <Link href="/">
                <Home className="h-4 w-4" />
                Til forsiden
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
