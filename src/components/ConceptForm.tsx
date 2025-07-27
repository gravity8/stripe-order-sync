import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Brain, Target } from "lucide-react";

interface ConceptFormProps {
  onSubmit: (concept: string, scenario: string) => void;
  isLoading: boolean;
}

export function ConceptForm({ onSubmit, isLoading }: ConceptFormProps) {
  const [concept, setConcept] = useState("");
  const [scenario, setScenario] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (concept.trim() && scenario.trim()) {
      onSubmit(concept.trim(), scenario.trim());
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="h-6 w-6 text-primary" />
          Programming Concept Explorer
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="concept" className="flex items-center gap-2">
              <Brain className="h-4 w-4" />
              Programming Concept
            </Label>
            <Input
              id="concept"
              placeholder="e.g., Webhooks, JWT, Rate Limiting, CORS"
              value={concept}
              onChange={(e) => setConcept(e.target.value)}
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="scenario" className="flex items-center gap-2">
              <Target className="h-4 w-4" />
              Application Scenario
            </Label>
            <Textarea
              id="scenario"
              placeholder="e.g., Stripe integration in an e-commerce app, User authentication in a SaaS platform"
              value={scenario}
              onChange={(e) => setScenario(e.target.value)}
              disabled={isLoading}
              rows={3}
            />
          </div>

          <Button 
            type="submit" 
            className="w-full" 
            disabled={!concept.trim() || !scenario.trim() || isLoading}
          >
            {isLoading ? "Analyzing..." : "Explain Concept"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}