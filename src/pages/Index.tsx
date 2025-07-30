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
import { AlertCircle, Lightbulb, BarChart3, Sparkles } from "lucide-react";
import { Scene3D } from "@/components/Scene3D";
import { Suspense } from "react";

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

  // Parse URL parameters for pre-filled concept and scenario
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const conceptParam = urlParams.get('concept');
    const scenarioParam = urlParams.get('scenario');
    
    if (conceptParam && scenarioParam) {
      handleConceptSubmit(conceptParam, scenarioParam);
    }
  }, []);

  return (
    <div className="flex-1 bg-gradient-to-br from-background via-background to-background/50 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-accent/5 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 w-32 h-32 bg-secondary/5 rounded-full blur-xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>
      
      <div className="relative z-10 container mx-auto space-y-8 py-8 px-4">
        <div className="text-center space-y-6 relative">
          <div className="relative">
            <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-primary via-primary/90 to-accent bg-clip-text text-transparent animate-fade-in">
              AI-Powered Learning
            </h1>
            <div className="absolute -top-2 -right-2 w-6 h-6 bg-primary/20 rounded-full animate-ping"></div>
            <div className="absolute -bottom-2 -left-2 w-4 h-4 bg-accent/20 rounded-full animate-ping" style={{ animationDelay: '0.5s' }}></div>
          </div>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Master programming concepts with AI-generated explanations, interactive code analysis, 
            and real-world scenarios. Unlock your coding potential with personalized learning.
          </p>
          <div className="flex flex-wrap justify-center gap-4 pt-4">
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium">AI-Powered</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 border border-accent/20">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" style={{ animationDelay: '0.3s' }}></div>
              <span className="text-sm font-medium">Interactive</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/10 border border-secondary/20">
              <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse" style={{ animationDelay: '0.6s' }}></div>
              <span className="text-sm font-medium">Personalized</span>
            </div>
          </div>
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
              
              {/* 3D Scene */}
              <Card className="max-w-2xl mx-auto">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Sparkles className="h-5 w-5" />
                    Interactive Learning
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Suspense fallback={
                    <div className="w-full h-64 bg-muted rounded-lg flex items-center justify-center">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"></div>
                        <span>Loading 3D experience...</span>
                      </div>
                    </div>
                  }>
                    <Scene3D />
                  </Suspense>
                  <p className="text-sm text-muted-foreground mt-4 text-center">
                    Drag to rotate • Scroll to zoom • Experience interactive learning
                  </p>
                </CardContent>
              </Card>
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
