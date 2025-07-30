import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { 
  Play, 
  Code2, 
  Lightbulb, 
  Share, 
  Download,
  Sparkles,
  Terminal,
  FileCode,
  Rocket
} from "lucide-react";

const codeTemplates = [
  {
    id: 1,
    title: "API Rate Limiter",
    description: "Implement rate limiting for API endpoints",
    language: "JavaScript",
    category: "Backend",
    difficulty: "Intermediate",
    code: `// Rate limiter implementation
const rateLimit = new Map();

function rateLimiter(req, res, next) {
  const key = req.ip;
  const limit = 100; // requests per hour
  const windowMs = 60 * 60 * 1000; // 1 hour
  
  const now = Date.now();
  const requests = rateLimit.get(key) || [];
  
  // Remove old requests outside the window
  const validRequests = requests.filter(
    timestamp => now - timestamp < windowMs
  );
  
  if (validRequests.length >= limit) {
    return res.status(429).json({
      error: 'Too many requests'
    });
  }
  
  validRequests.push(now);
  rateLimit.set(key, validRequests);
  
  next();
}`
  },
  {
    id: 2,
    title: "React Custom Hook",
    description: "Create a reusable hook for data fetching",
    language: "TypeScript",
    category: "Frontend",
    difficulty: "Intermediate",
    code: `import { useState, useEffect } from 'react';

interface UseApiState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

function useApi<T>(url: string): UseApiState<T> {
  const [state, setState] = useState<UseApiState<T>>({
    data: null,
    loading: true,
    error: null
  });

  useEffect(() => {
    let cancelled = false;
    
    const fetchData = async () => {
      try {
        setState(prev => ({ ...prev, loading: true, error: null }));
        
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(\`HTTP error! status: \${response.status}\`);
        }
        
        const data = await response.json();
        
        if (!cancelled) {
          setState({ data, loading: false, error: null });
        }
      } catch (error) {
        if (!cancelled) {
          setState({ 
            data: null, 
            loading: false, 
            error: error instanceof Error ? error.message : 'Unknown error'
          });
        }
      }
    };

    fetchData();

    return () => {
      cancelled = true;
    };
  }, [url]);

  return state;
}

export default useApi;`
  },
  {
    id: 3,
    title: "Docker Multi-stage Build",
    description: "Optimize Docker images with multi-stage builds",
    language: "Dockerfile",
    category: "DevOps",
    difficulty: "Advanced",
    code: `# Multi-stage Docker build for Node.js app
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files first for better caching
COPY package*.json ./
RUN npm ci --only=production

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Production stage
FROM node:18-alpine AS production

# Create non-root user for security
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001

WORKDIR /app

# Copy built application from builder stage
COPY --from=builder --chown=nextjs:nodejs /app/dist ./dist
COPY --from=builder --chown=nextjs:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=nextjs:nodejs /app/package.json ./package.json

USER nextjs

EXPOSE 3000

ENV NODE_ENV=production

CMD ["npm", "start"]`
  }
];

const playgroundModes = [
  { id: "interactive", name: "Interactive Analysis", icon: Sparkles },
  { id: "template", name: "Code Templates", icon: FileCode },
  { id: "experiment", name: "Free Experiment", icon: Terminal }
];

export default function Playground() {
  const [activeMode, setActiveMode] = useState("interactive");
  const [selectedTemplate, setSelectedTemplate] = useState<number | null>(null);
  const [customCode, setCustomCode] = useState("");
  const [analysisResult, setAnalysisResult] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleAnalyzeCode = async () => {
    setIsAnalyzing(true);
    // Simulate analysis delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const mockAnalysis = `
## Code Analysis Results

### ✅ Best Practices Found:
- Good separation of concerns
- Proper error handling
- Clear variable naming

### 🔧 Suggestions for Improvement:
1. **Add input validation** - Consider validating input parameters
2. **Include unit tests** - Add test coverage for edge cases  
3. **Add logging** - Include structured logging for debugging

### 🛡️ Security Considerations:
- Implement proper sanitization for user inputs
- Add rate limiting to prevent abuse
- Use environment variables for sensitive config

### 📊 Complexity Score: 7/10
This code demonstrates good understanding of the concept with room for optimization.
    `;
    
    setAnalysisResult(mockAnalysis);
    setIsAnalyzing(false);
  };

  const handleTemplateSelect = (templateId: number) => {
    const template = codeTemplates.find(t => t.id === templateId);
    if (template) {
      setSelectedTemplate(templateId);
      setCustomCode(template.code);
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Beginner": return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      case "Intermediate": return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
      case "Advanced": return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
      default: return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300";
    }
  };

  return (
    <div className="flex-1 space-y-6 p-6">
      {/* Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/20 via-primary/10 to-transparent p-8 border">
        <div className="relative z-10">
          <h1 className="text-4xl font-bold mb-4 flex items-center gap-3">
            <Rocket className="h-10 w-10" />
            Code Playground
          </h1>
          <p className="text-xl text-muted-foreground mb-6">
            Experiment with code, explore templates, and get AI-powered insights.
          </p>
          
          {/* Mode Selector */}
          <div className="flex flex-wrap gap-3">
            {playgroundModes.map((mode) => (
              <Button
                key={mode.id}
                variant={activeMode === mode.id ? "default" : "outline"}
                size="sm"
                onClick={() => setActiveMode(mode.id)}
                className="flex items-center gap-2"
              >
                <mode.icon className="h-4 w-4" />
                {mode.name}
              </Button>
            ))}
          </div>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-primary/20 to-transparent rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-20 w-32 h-32 bg-gradient-to-tl from-accent/20 to-transparent rounded-full blur-2xl"></div>
      </div>

      {/* Interactive Analysis Mode */}
      {activeMode === "interactive" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Code2 className="h-5 w-5" />
                Code Input
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="code-input">Paste your code here</Label>
                <Textarea
                  id="code-input"
                  placeholder="// Paste your code here for analysis..."
                  value={customCode}
                  onChange={(e) => setCustomCode(e.target.value)}
                  className="min-h-[300px] font-mono text-sm"
                />
              </div>
              
              <div className="flex gap-2">
                <Button 
                  onClick={handleAnalyzeCode}
                  disabled={!customCode.trim() || isAnalyzing}
                  className="flex-1"
                >
                  {isAnalyzing ? (
                    <>
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent mr-2" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4 mr-2" />
                      Analyze Code
                    </>
                  )}
                </Button>
                <Button variant="outline" size="icon">
                  <Share className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lightbulb className="h-5 w-5" />
                AI Analysis
              </CardTitle>
            </CardHeader>
            <CardContent>
              {analysisResult ? (
                <div className="prose prose-sm dark:prose-invert max-w-none">
                  <pre className="whitespace-pre-wrap text-sm">{analysisResult}</pre>
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Lightbulb className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Paste some code and click "Analyze Code" to get AI-powered insights.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {/* Template Mode */}
      {activeMode === "template" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {codeTemplates.map((template) => (
              <Card 
                key={template.id} 
                className={`cursor-pointer hover:shadow-lg transition-all duration-300 hover:-translate-y-1 ${
                  selectedTemplate === template.id ? 'ring-2 ring-primary' : ''
                }`}
                onClick={() => handleTemplateSelect(template.id)}
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="outline" className="text-xs">
                          {template.category}
                        </Badge>
                        <Badge className={getDifficultyColor(template.difficulty)} variant="secondary">
                          {template.difficulty}
                        </Badge>
                      </div>
                      <CardTitle className="text-lg">{template.title}</CardTitle>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {template.description}
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <Badge variant="secondary" className="text-xs">
                      {template.language}
                    </Badge>
                    <Button size="sm" variant="outline">
                      <Play className="h-3 w-3 mr-1" />
                      Load
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {selectedTemplate && (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>
                    {codeTemplates.find(t => t.id === selectedTemplate)?.title}
                  </CardTitle>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </Button>
                    <Button size="sm">
                      <Sparkles className="h-4 w-4 mr-2" />
                      Analyze
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <pre className="bg-muted p-4 rounded-lg text-sm overflow-x-auto">
                  <code>{customCode}</code>
                </pre>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* Experiment Mode */}
      {activeMode === "experiment" && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Terminal className="h-5 w-5" />
              Free Code Experiment
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              placeholder="// Start experimenting with your code here...
// This is your creative space to try new ideas!"
              value={customCode}
              onChange={(e) => setCustomCode(e.target.value)}
              className="min-h-[400px] font-mono text-sm"
            />
            
            <div className="flex gap-2">
              <Button onClick={handleAnalyzeCode} disabled={!customCode.trim()}>
                <Sparkles className="h-4 w-4 mr-2" />
                Get AI Feedback
              </Button>
              <Button variant="outline">
                <Share className="h-4 w-4 mr-2" />
                Share Experiment
              </Button>
              <Button variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Save Code
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}