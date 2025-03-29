import { Settings, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Header() {
  return (
    <header className="bg-white border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-6 py-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="h-7 w-7 text-primary" />
            <h1 className="text-2xl font-bold text-gray-800">AI Tekstforbedring</h1>
          </div>
          <div className="flex items-center space-x-4">
            <Button
              variant="outline"
              size="sm"
              className="rounded-full text-gray-600 hover:text-gray-900 border-gray-200 hover:border-gray-300 hover:bg-gray-50 shadow-sm"
            >
              <Settings className="h-4 w-4 mr-2" />
              Indstillinger
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
