import { useState, useEffect } from "react";
import { ConceptForm } from "@/components/ConceptForm";
import { ConceptOutput } from "@/components/ConceptOutput";
import { ApiKeyInput } from "@/components/ApiKeyInput";
import { explainConcept } from "@/lib/openai";
import { useToast } from "@/hooks/use-toast";
import { useLearningStats } from "@/hooks/useLearningStats";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, Lightbulb, BarChart3 } from "lucide-react";

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
  const [teachMode, setTeachMode] = useState(false);
  const [showDashboard, setShowDashboard] = useState(false);
  const { toast } = useToast();
  const { stats, trackInteraction, clearStats } = useLearningStats();

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
      trackInteraction('concept_explored', { concept, scenario });
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
            <div className="space-y-6">
              {/* Learning Controls */}
              <Card className="max-w-2xl mx-auto">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Lightbulb className="h-5 w-5" />
                    Learning Settings
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="teach-mode" className="flex items-center gap-2">
                      <Lightbulb className="h-4 w-4" />
                      Teach Me As You Go Mode
                    </Label>
                    <Switch
                      id="teach-mode"
                      checked={teachMode}
                      onCheckedChange={setTeachMode}
                    />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Enhanced explanations with principles, best practices, and interactive code analysis
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <Label htmlFor="dashboard-mode" className="flex items-center gap-2">
                      <BarChart3 className="h-4 w-4" />
                      Show Learning Dashboard
                    </Label>
                    <Switch
                      id="dashboard-mode"
                      checked={showDashboard}
                      onCheckedChange={setShowDashboard}
                    />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Track your learning progress and coding principles applied
                  </p>
                </CardContent>
              </Card>

              <ConceptForm onSubmit={handleConceptSubmit} isLoading={isLoading} />
            </div>
            
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
                teachMode={teachMode}
                onTrackInteraction={trackInteraction}
                showDashboard={showDashboard}
                learningStats={stats}
                onClearStats={clearStats}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Index;
