import { useState } from "react";
import Header from "@/components/header";
import Footer from "@/components/footer";
import TextInputArea from "@/components/text-input-area";
import ResultDisplay from "@/components/result-display";
import { TextEnhanceResponse } from "@shared/schema";

export default function Home() {
  const [result, setResult] = useState<TextEnhanceResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      
      <main className="flex-1 app-container">
        <h1 className="text-4xl font-bold text-gray-800 mb-10 text-center mt-4">Tekstforbedring med AI</h1>
        
        <div className="app-content">
          <section className="app-section">
            <div className="card h-full">
              <div className="card-header">
                <h2 className="card-title">Indtastning</h2>
                <p className="card-description">Indtast din tekst, og vælg dine præferencer</p>
              </div>
              <div className="card-content">
                <TextInputArea 
                  setResult={setResult}
                  setIsLoading={setIsLoading}
                  setError={setError}
                  isLoading={isLoading}
                />
              </div>
            </div>
          </section>
          
          <section className="app-section">
            <div className="card h-full">
              <div className="card-header">
                <h2 className="card-title">Resultat</h2>
                <p className="card-description">Din forbedrede tekst vises her</p>
              </div>
              <div className="card-content">
                <ResultDisplay 
                  result={result}
                  isLoading={isLoading}
                  error={error}
                />
              </div>
            </div>
          </section>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
