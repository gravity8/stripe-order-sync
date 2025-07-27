import { useState, useEffect } from "react";
import { ConceptForm } from "@/components/ConceptForm";
import { ConceptOutput } from "@/components/ConceptOutput";
import { ApiKeyInput } from "@/components/ApiKeyInput";
import { explainConcept } from "@/lib/openai";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

interface CodeExample {
  language: string;
  syntax: string;
  code: string;
}

interface ConceptResponse {
  explanation: string;
  scenarioApplication: string;
  codeExamples: CodeExample[];
  relatedConcepts: string[];
  visualDiagram: string;
}

const Index = () => {
  const [apiKey, setApiKey] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState<ConceptResponse | null>(null);
  const [currentConcept, setCurrentConcept] = useState<string>("");
  const [currentScenario, setCurrentScenario] = useState<string>("");
  const [error, setError] = useState<string>("");
  const { toast } = useToast();

  const handleApiKeySet = (key: string) => {
    setApiKey(key);
    localStorage.setItem("openai_api_key", key);
    toast({
      title: "API Key Set",
      description: "You can now start explaining programming concepts!",
    });
  };

  const handleConceptSubmit = async (concept: string, scenario: string) => {
    setIsLoading(true);
    setError("");
    setResponse(null);
    setCurrentConcept(concept);
    setCurrentScenario(scenario);

    try {
      const result = await explainConcept(concept, scenario, apiKey);
      setResponse(result);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An unknown error occurred";
      setError(errorMessage);
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Check for saved API key on component mount
  useEffect(() => {
    const savedKey = localStorage.getItem("openai_api_key");
    if (savedKey) {
      setApiKey(savedKey);
    }
  }, []);

  return (
    <div className="min-h-screen bg-background py-8 px-4">
      <div className="container mx-auto space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold">Programming Concept Explorer</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Get detailed explanations of programming concepts with practical code examples 
            in Node.js, Python, and Java.
          </p>
        </div>

        {!apiKey ? (
          <ApiKeyInput onApiKeySet={handleApiKeySet} />
        ) : (
          <>
            <ConceptForm onSubmit={handleConceptSubmit} isLoading={isLoading} />
            
            {error && (
              <Alert variant="destructive" className="max-w-2xl mx-auto">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {response && (
              <ConceptOutput 
                response={response} 
                concept={currentConcept} 
                scenario={currentScenario}
                apiKey={apiKey}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Index;
