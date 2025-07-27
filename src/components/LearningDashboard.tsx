import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Brain, 
  Shield, 
  Code2, 
  HelpCircle, 
  TrendingUp, 
  Award,
  Calendar,
  Target
} from "lucide-react";

interface LearningStats {
  conceptsExplored: string[];
  securityAdviceAccepted: number;
  cleanCodePrinciplesApplied: string[];
  questionsAsked: number;
  blockExplanationsRequested: number;
  whyButtonClicks: number;
  lastActive: Date;
}

interface LearningDashboardProps {
  stats: LearningStats;
  onClearStats: () => void;
}

export function LearningDashboard({ stats, onClearStats }: LearningDashboardProps) {
  const [totalInteractions, setTotalInteractions] = useState(0);
  const [learningStreak, setLearningStreak] = useState(0);

  useEffect(() => {
    const total = stats.conceptsExplored.length + 
                 stats.securityAdviceAccepted + 
                 stats.questionsAsked + 
                 stats.blockExplanationsRequested + 
                 stats.whyButtonClicks;
    setTotalInteractions(total);

    // Calculate learning streak (simplified)
    const today = new Date();
    const lastActive = new Date(stats.lastActive);
    const daysDiff = Math.floor((today.getTime() - lastActive.getTime()) / (1000 * 60 * 60 * 24));
    setLearningStreak(daysDiff <= 1 ? learningStreak + 1 : 1);
  }, [stats, learningStreak]);

  const getProgressLevel = () => {
    if (totalInteractions < 5) return { level: "Beginner", progress: 20, color: "text-blue-500" };
    if (totalInteractions < 15) return { level: "Learning", progress: 50, color: "text-yellow-500" };
    if (totalInteractions < 30) return { level: "Advancing", progress: 75, color: "text-orange-500" };
    return { level: "Expert", progress: 100, color: "text-green-500" };
  };

  const progressLevel = getProgressLevel();

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-6 w-6 text-primary" />
            Learning Progress Dashboard
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Award className={progressLevel.color} size={20} />
                <span className="font-medium">Level: {progressLevel.level}</span>
              </div>
              <Progress value={progressLevel.progress} className="h-2" />
              <p className="text-xs text-muted-foreground">
                {totalInteractions} total interactions
              </p>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <TrendingUp className="text-green-500" size={20} />
                <span className="font-medium">Learning Streak</span>
              </div>
              <p className="text-2xl font-bold text-green-500">{learningStreak}</p>
              <p className="text-xs text-muted-foreground">days active</p>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Calendar className="text-purple-500" size={20} />
                <span className="font-medium">Last Active</span>
              </div>
              <p className="text-sm">{stats.lastActive.toLocaleDateString()}</p>
              <p className="text-xs text-muted-foreground">
                {stats.lastActive.toLocaleTimeString()}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="concepts" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="concepts">Concepts</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="principles">Principles</TabsTrigger>
          <TabsTrigger value="interactions">Interactions</TabsTrigger>
        </TabsList>

        <TabsContent value="concepts" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5" />
                Concepts Explored ({stats.conceptsExplored.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {stats.conceptsExplored.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {stats.conceptsExplored.map((concept, index) => (
                    <Badge key={index} variant="secondary">
                      {concept}
                    </Badge>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground text-sm">
                  No concepts explored yet. Start by asking about a programming concept!
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Security & Best Practices
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Security Advice Accepted</p>
                  <div className="flex items-center gap-2">
                    <Progress value={(stats.securityAdviceAccepted / 10) * 100} className="flex-1" />
                    <span className="text-sm font-medium">{stats.securityAdviceAccepted}/10</span>
                  </div>
                </div>
                
                {stats.securityAdviceAccepted >= 5 && (
                  <div className="flex items-center gap-2 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <Shield className="text-green-500" size={16} />
                    <span className="text-sm text-green-700 dark:text-green-300">
                      Great job! You're building secure coding habits.
                    </span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="principles" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Code2 className="h-5 w-5" />
                Clean Code Principles Applied
              </CardTitle>
            </CardHeader>
            <CardContent>
              {stats.cleanCodePrinciplesApplied.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {stats.cleanCodePrinciplesApplied.map((principle, index) => (
                    <Badge key={index} variant="outline" className="justify-center">
                      {principle}
                    </Badge>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground text-sm">
                  No principles tracked yet. Explore code examples to learn about clean code principles!
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="interactions" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <HelpCircle className="h-5 w-5" />
                  Questions Asked
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-primary mb-2">
                  {stats.questionsAsked}
                </div>
                <p className="text-sm text-muted-foreground">
                  Keep asking "Why?" to deepen your understanding!
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Block Explanations
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-primary mb-2">
                  {stats.blockExplanationsRequested}
                </div>
                <p className="text-sm text-muted-foreground">
                  Code blocks explained in detail
                </p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}