import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { InteractiveCodeBlock } from "./InteractiveCodeBlock";
import { HelpCircle, ChevronDown, ChevronUp, Lightbulb } from "lucide-react";
import { explainWhy } from "@/lib/openai";
import { useToast } from "@/hooks/use-toast";

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

interface WhyExplanation {
  approach: string;
  reasoning: string;
  tradeoffs: string[];
  alternatives: Array<{
    name: string;
    description: string;
    pros: string[];
    cons: string[];
  }>;
}

interface EnhancedCodeTabsProps {
  examples: CodeExample[];
  teachMode: boolean;
  apiKey: string;
  originalResponse: ConceptResponse;
  concept: string;
  scenario: string;
  onTrackInteraction: (type: string, data: any) => void;
}

export function EnhancedCodeTabs({ 
  examples, 
  teachMode, 
  apiKey, 
  originalResponse, 
  concept, 
  scenario,
  onTrackInteraction 
}: EnhancedCodeTabsProps) {
  const [whyExplanation, setWhyExplanation] = useState<WhyExplanation | null>(null);
  const [showWhyExplanation, setShowWhyExplanation] = useState(false);
  const [isLoadingWhy, setIsLoadingWhy] = useState(false);
  const { toast } = useToast();

  const handleWhyClick = async () => {
    if (whyExplanation) {
      setShowWhyExplanation(!showWhyExplanation);
      return;
    }

    setIsLoadingWhy(true);
    try {
      const explanation = await explainWhy(originalResponse, concept, scenario, apiKey);
      setWhyExplanation(explanation);
      setShowWhyExplanation(true);
      onTrackInteraction('why_clicked', { concept, scenario });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load explanation. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoadingWhy(false);
    }
  };

  if (examples.length === 0) return null;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h3 className="text-lg font-semibold">Code Examples</h3>
          {teachMode && (
            <Badge variant="secondary" className="text-xs">
              <Lightbulb className="h-3 w-3 mr-1" />
              Enhanced Learning
            </Badge>
          )}
        </div>
        
        <Button
          onClick={handleWhyClick}
          disabled={isLoadingWhy}
          variant="outline"
          size="sm"
          className="flex items-center gap-2"
        >
          <HelpCircle className="h-4 w-4" />
          {isLoadingWhy ? "Loading..." : "Ask Why?"}
        </Button>
      </div>

      {/* Why Explanation */}
      {showWhyExplanation && whyExplanation && (
        <Collapsible open={showWhyExplanation} onOpenChange={setShowWhyExplanation}>
          <CollapsibleTrigger asChild>
            <Button variant="ghost" className="w-full justify-between mb-4">
              <span className="flex items-center gap-2">
                <HelpCircle className="h-4 w-4" />
                Why did the AI choose this approach?
              </span>
              {showWhyExplanation ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </Button>
          </CollapsibleTrigger>
          
          <CollapsibleContent>
            <Card className="mb-4">
              <CardHeader>
                <CardTitle className="text-lg">AI Decision Reasoning</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-medium text-sm text-muted-foreground mb-2">Approach</h4>
                  <p className="text-sm">{whyExplanation.approach}</p>
                </div>

                <div>
                  <h4 className="font-medium text-sm text-muted-foreground mb-2">Reasoning</h4>
                  <p className="text-sm">{whyExplanation.reasoning}</p>
                </div>

                <div>
                  <h4 className="font-medium text-sm text-muted-foreground mb-2">Trade-offs & Assumptions</h4>
                  <ul className="text-sm space-y-1">
                    {whyExplanation.tradeoffs.map((tradeoff, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <span className="text-yellow-500 mt-1">•</span>
                        {tradeoff}
                      </li>
                    ))}
                  </ul>
                </div>

                {whyExplanation.alternatives.length > 0 && (
                  <div>
                    <h4 className="font-medium text-sm text-muted-foreground mb-2">Alternative Approaches</h4>
                    <div className="space-y-3">
                      {whyExplanation.alternatives.map((alt, index) => (
                        <div key={index} className="border border-border rounded-lg p-3">
                          <h5 className="font-medium text-sm mb-1">{alt.name}</h5>
                          <p className="text-xs text-muted-foreground mb-2">{alt.description}</p>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
                            <div>
                              <span className="font-medium text-green-600">Pros:</span>
                              <ul className="mt-1 space-y-1">
                                {alt.pros.map((pro, proIndex) => (
                                  <li key={proIndex} className="flex items-start gap-1">
                                    <span className="text-green-500">+</span>
                                    {pro}
                                  </li>
                                ))}
                              </ul>
                            </div>
                            <div>
                              <span className="font-medium text-red-600">Cons:</span>
                              <ul className="mt-1 space-y-1">
                                {alt.cons.map((con, conIndex) => (
                                  <li key={conIndex} className="flex items-start gap-1">
                                    <span className="text-red-500">-</span>
                                    {con}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </CollapsibleContent>
        </Collapsible>
      )}

      <Tabs defaultValue={examples[0]?.syntax || "js"} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          {examples.map((example) => (
            <TabsTrigger key={example.syntax} value={example.syntax}>
              {example.language}
            </TabsTrigger>
          ))}
        </TabsList>

        {examples.map((example) => (
          <TabsContent key={example.syntax} value={example.syntax}>
            <InteractiveCodeBlock
              code={example.code}
              language={example.language}
              syntax={example.syntax}
              teachMode={teachMode}
              apiKey={apiKey}
              onTrackInteraction={onTrackInteraction}
            />
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}