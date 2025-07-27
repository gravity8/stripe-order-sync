import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { HelpCircle, ChevronDown, ChevronUp, Lightbulb, Shield, Code2, AlertTriangle } from "lucide-react";
import { explainCodeBlock } from "@/lib/openai";
import { useToast } from "@/hooks/use-toast";

interface SmartComment {
  line: number;
  type: 'security' | 'improvement' | 'principle' | 'warning';
  message: string;
  principle?: string;
}

interface CodeBlockExplanation {
  blockType: string;
  intent: string;
  conditionExplanation?: string;
  bestPractices: string[];
  principles: string[];
  smartComments: SmartComment[];
}

interface InteractiveCodeBlockProps {
  code: string;
  language: string;
  syntax: string;
  teachMode: boolean;
  apiKey: string;
  onTrackInteraction: (type: string, data: any) => void;
}

export function InteractiveCodeBlock({ 
  code, 
  language, 
  syntax, 
  teachMode, 
  apiKey,
  onTrackInteraction 
}: InteractiveCodeBlockProps) {
  const [selectedLines, setSelectedLines] = useState<number[]>([]);
  const [blockExplanation, setBlockExplanation] = useState<CodeBlockExplanation | null>(null);
  const [isExplaining, setIsExplaining] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);
  const { toast } = useToast();

  const codeLines = code.split('\n');

  const getCommentIcon = (type: SmartComment['type']) => {
    switch (type) {
      case 'security': return <Shield className="h-3 w-3 text-red-500" />;
      case 'improvement': return <Lightbulb className="h-3 w-3 text-yellow-500" />;
      case 'principle': return <Code2 className="h-3 w-3 text-blue-500" />;
      case 'warning': return <AlertTriangle className="h-3 w-3 text-orange-500" />;
    }
  };

  const handleLineSelection = (lineIndex: number) => {
    setSelectedLines(prev => {
      if (prev.includes(lineIndex)) {
        return prev.filter(l => l !== lineIndex);
      } else {
        return [...prev, lineIndex].sort((a, b) => a - b);
      }
    });
  };

  const explainSelectedBlock = async () => {
    if (selectedLines.length === 0) {
      toast({
        title: "No lines selected",
        description: "Please select the lines you want to explain by clicking on them.",
        variant: "destructive",
      });
      return;
    }

    setIsExplaining(true);
    try {
      const selectedCode = selectedLines
        .map(lineIndex => codeLines[lineIndex])
        .join('\n');

      const explanation = await explainCodeBlock(selectedCode, language, apiKey);
      setBlockExplanation(explanation);
      setShowExplanation(true);
      
      onTrackInteraction('block_explanation', {
        blockType: explanation.blockType,
        linesCount: selectedLines.length,
        language
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to explain the code block. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsExplaining(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Badge variant="outline">{language}</Badge>
          {teachMode && (
            <Badge variant="secondary" className="text-xs">
              <Lightbulb className="h-3 w-3 mr-1" />
              Teach Mode
            </Badge>
          )}
        </div>
        
        {selectedLines.length > 0 && (
          <Button
            onClick={explainSelectedBlock}
            disabled={isExplaining}
            size="sm"
            className="flex items-center gap-2"
          >
            <HelpCircle className="h-4 w-4" />
            {isExplaining ? "Explaining..." : `Explain Block (${selectedLines.length} lines)`}
          </Button>
        )}
      </div>

      <div className="relative">
        <pre className="bg-muted/50 p-4 rounded-lg overflow-x-auto text-sm">
          <code>
            {codeLines.map((line, index) => (
              <div
                key={index}
                className={`flex items-start cursor-pointer hover:bg-muted/70 px-2 py-1 rounded transition-colors ${
                  selectedLines.includes(index) ? 'bg-primary/20 border-l-2 border-primary' : ''
                }`}
                onClick={() => handleLineSelection(index)}
              >
                <span className="text-muted-foreground mr-4 text-xs min-w-[2rem] text-right">
                  {index + 1}
                </span>
                <span className="flex-1 font-mono whitespace-pre">{line}</span>
                
                {/* Smart Comments */}
                {teachMode && blockExplanation?.smartComments
                  .filter(comment => comment.line === index + 1)
                  .map((comment, commentIndex) => (
                    <Tooltip key={commentIndex}>
                      <TooltipTrigger>
                        <div className="ml-2 flex items-center">
                          {getCommentIcon(comment.type)}
                        </div>
                      </TooltipTrigger>
                      <TooltipContent side="right" className="max-w-xs">
                        <div className="space-y-1">
                          <p className="text-xs font-medium">
                            {comment.principle && `${comment.principle}: `}
                            {comment.message}
                          </p>
                        </div>
                      </TooltipContent>
                    </Tooltip>
                  ))}
              </div>
            ))}
          </code>
        </pre>
      </div>

      {/* Block Explanation */}
      {showExplanation && blockExplanation && (
        <Collapsible open={showExplanation} onOpenChange={setShowExplanation}>
          <CollapsibleTrigger asChild>
            <Button variant="ghost" className="w-full justify-between">
              <span className="flex items-center gap-2">
                <Code2 className="h-4 w-4" />
                Block Explanation: {blockExplanation.blockType}
              </span>
              {showExplanation ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </Button>
          </CollapsibleTrigger>
          
          <CollapsibleContent>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Understanding this {blockExplanation.blockType}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-medium text-sm text-muted-foreground mb-2">Intent</h4>
                  <p className="text-sm">{blockExplanation.intent}</p>
                </div>

                {blockExplanation.conditionExplanation && (
                  <div>
                    <h4 className="font-medium text-sm text-muted-foreground mb-2">How it works</h4>
                    <p className="text-sm">{blockExplanation.conditionExplanation}</p>
                  </div>
                )}

                <div>
                  <h4 className="font-medium text-sm text-muted-foreground mb-2">Best Practices</h4>
                  <ul className="text-sm space-y-1">
                    {blockExplanation.bestPractices.map((practice, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <span className="text-green-500 mt-1">•</span>
                        {practice}
                      </li>
                    ))}
                  </ul>
                </div>

                {teachMode && blockExplanation.principles.length > 0 && (
                  <div>
                    <h4 className="font-medium text-sm text-muted-foreground mb-2">Related Principles</h4>
                    <div className="flex flex-wrap gap-2">
                      {blockExplanation.principles.map((principle, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {principle}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </CollapsibleContent>
        </Collapsible>
      )}
    </div>
  );
}