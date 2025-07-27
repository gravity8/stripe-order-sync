import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { CodeTabs } from "./CodeTabs";
import { MermaidDiagram } from "./MermaidDiagram";
import { Brain, Target, Code, Link, Eye, ChevronDown, ChevronUp } from "lucide-react";
import { explainRelatedConcept } from "@/lib/openai";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";

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

interface RelatedConceptResponse {
  relatedConceptExplanation: string;
  relatedConceptInScenario: string;
}

interface ConceptOutputProps {
  response: ConceptResponse;
  concept: string;
  scenario: string;
  apiKey: string;
}

export function ConceptOutput({ response, concept, scenario, apiKey }: ConceptOutputProps) {
  const { explanation, scenarioApplication, codeExamples, relatedConcepts, visualDiagram } = response;
  const [expandedConcept, setExpandedConcept] = useState<string | null>(null);
  const [relatedConceptData, setRelatedConceptData] = useState<Record<string, RelatedConceptResponse>>({});
  const [loadingConcept, setLoadingConcept] = useState<string | null>(null);
  const { toast } = useToast();

  const handleRelatedConceptClick = async (relatedConcept: string) => {
    if (expandedConcept === relatedConcept) {
      setExpandedConcept(null);
      return;
    }

    if (relatedConceptData[relatedConcept]) {
      setExpandedConcept(relatedConcept);
      return;
    }

    setLoadingConcept(relatedConcept);
    try {
      const data = await explainRelatedConcept(relatedConcept, concept, scenario, apiKey);
      setRelatedConceptData(prev => ({ ...prev, [relatedConcept]: data }));
      setExpandedConcept(relatedConcept);
    } catch (err) {
      toast({
        title: "Error",
        description: `Failed to load explanation for ${relatedConcept}`,
        variant: "destructive",
      });
    } finally {
      setLoadingConcept(null);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl flex items-center gap-2">
            <Brain className="h-7 w-7 text-primary" />
            {concept}
          </CardTitle>
          <p className="text-muted-foreground">
            <span className="font-medium">Scenario:</span> {scenario}
          </p>
        </CardHeader>
      </Card>

      {/* Explanation */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5" />
            Explanation
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-foreground leading-relaxed whitespace-pre-wrap">
            {explanation}
          </p>
        </CardContent>
      </Card>

      {/* Scenario Application */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Scenario Application
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-foreground leading-relaxed whitespace-pre-wrap">
            {scenarioApplication}
          </p>
        </CardContent>
      </Card>

      {/* Visual Diagram */}
      {visualDiagram && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5" />
              Visual Flow
            </CardTitle>
          </CardHeader>
          <CardContent>
            <MermaidDiagram chart={visualDiagram} />
          </CardContent>
        </Card>
      )}

      {/* Code Examples */}
      {codeExamples.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Code className="h-5 w-5" />
            <h3 className="text-lg font-semibold">Code Examples</h3>
          </div>
          <CodeTabs examples={codeExamples} />
        </div>
      )}

      {/* Related Concepts */}
      {relatedConcepts.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Link className="h-5 w-5" />
              Related Concepts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex flex-wrap gap-2">
                {relatedConcepts.map((relatedConcept, index) => (
                  <div key={index} className="space-y-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-sm cursor-pointer hover:bg-secondary"
                      onClick={() => handleRelatedConceptClick(relatedConcept)}
                      disabled={loadingConcept === relatedConcept}
                    >
                      {relatedConcept}
                      {loadingConcept === relatedConcept ? (
                        <div className="ml-2 h-3 w-3 animate-spin rounded-full border border-current border-t-transparent" />
                      ) : expandedConcept === relatedConcept ? (
                        <ChevronUp className="ml-2 h-3 w-3" />
                      ) : (
                        <ChevronDown className="ml-2 h-3 w-3" />
                      )}
                    </Button>
                    
                    {expandedConcept === relatedConcept && relatedConceptData[relatedConcept] && (
                      <Card className="ml-4 border-l-4 border-l-primary">
                        <CardContent className="pt-4">
                          <div className="space-y-3">
                            <div>
                              <h4 className="font-medium text-sm text-muted-foreground mb-1">What is {relatedConcept}?</h4>
                              <p className="text-sm leading-relaxed">{relatedConceptData[relatedConcept].relatedConceptExplanation}</p>
                            </div>
                            <div>
                              <h4 className="font-medium text-sm text-muted-foreground mb-1">How it applies to your scenario:</h4>
                              <p className="text-sm leading-relaxed">{relatedConceptData[relatedConcept].relatedConceptInScenario}</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}