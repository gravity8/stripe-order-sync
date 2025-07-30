import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { LearningDashboard } from "@/components/LearningDashboard";
import { useLearningStats } from "@/hooks/useLearningStats";
import { 
  Brain, 
  Target, 
  Trophy,
  Calendar,
  TrendingUp,
  Clock,
  Code,
  BookOpen,
  Lightbulb,
  Zap,
  Award,
  Flame
} from "lucide-react";

const achievements = [
  {
    id: 1,
    title: "First Steps",
    description: "Explored your first programming concept",
    icon: Lightbulb,
    unlocked: true,
    date: "2024-01-15"
  },
  {
    id: 2,
    title: "Code Explorer",
    description: "Analyzed 10 different code examples",
    icon: Code,
    unlocked: true,
    date: "2024-01-20"
  },
  {
    id: 3,
    title: "Security Conscious", 
    description: "Applied 5 security best practices",
    icon: Award,
    unlocked: false,
    progress: 60
  },
  {
    id: 4,
    title: "Learning Streak",
    description: "Learned for 7 consecutive days",
    icon: Flame,
    unlocked: false,
    progress: 42
  }
];

const recentActivity = [
  {
    type: "concept",
    title: "JWT Authentication",
    description: "Explored JWT token-based authentication",
    timestamp: "2 hours ago",
    icon: Brain
  },
  {
    type: "code",
    title: "React Hooks",
    description: "Analyzed useState and useEffect examples",
    timestamp: "1 day ago", 
    icon: Code
  },
  {
    type: "achievement",
    title: "Code Explorer",
    description: "Unlocked new achievement",
    timestamp: "2 days ago",
    icon: Trophy
  }
];

const weeklyGoals = [
  {
    title: "Explore 5 new concepts",
    current: 3,
    target: 5,
    category: "Learning"
  },
  {
    title: "Complete 10 code analyses",
    current: 7,
    target: 10,
    category: "Practice"
  },
  {
    title: "Apply 3 security principles",
    current: 1,
    target: 3,
    category: "Security"
  }
];

export default function Dashboard() {
  const { stats, clearStats } = useLearningStats();
  const [timeFrame, setTimeFrame] = useState("week");
  
  // Mock data for demonstration
  const weeklyProgress = [65, 78, 82, 45, 92, 88, 74];
  const conceptsByCategory = {
    "Frontend": 8,
    "Backend": 6, 
    "Security": 4,
    "DevOps": 3,
    "Database": 5
  };

  return (
    <div className="flex-1 space-y-6 p-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Learning Dashboard</h1>
          <p className="text-muted-foreground">
            Track your programming learning journey and progress
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            Export Progress
          </Button>
          <Button size="sm">
            Set Weekly Goal
          </Button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="relative overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Concepts Explored</CardTitle>
            <Brain className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.conceptsExplored.length}</div>
            <p className="text-xs text-muted-foreground">
              +2 from last week
            </p>
            <div className="absolute bottom-0 left-0 h-1 w-full bg-gradient-to-r from-blue-500 to-blue-600"></div>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Code Blocks Analyzed</CardTitle>
            <Code className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.blockExplanationsRequested}</div>
            <p className="text-xs text-muted-foreground">
              +5 from last week
            </p>
            <div className="absolute bottom-0 left-0 h-1 w-full bg-gradient-to-r from-green-500 to-green-600"></div>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Learning Streak</CardTitle>
            <Flame className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">7 days</div>
            <p className="text-xs text-muted-foreground">
              Personal best!
            </p>
            <div className="absolute bottom-0 left-0 h-1 w-full bg-gradient-to-r from-orange-500 to-red-500"></div>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Security Score</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">85%</div>
            <p className="text-xs text-muted-foreground">
              Excellent security awareness
            </p>
            <div className="absolute bottom-0 left-0 h-1 w-full bg-gradient-to-r from-purple-500 to-purple-600"></div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Weekly Goals */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Weekly Goals
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {weeklyGoals.map((goal, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{goal.title}</p>
                    <p className="text-sm text-muted-foreground">{goal.category}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{goal.current}/{goal.target}</p>
                    <p className="text-xs text-muted-foreground">
                      {Math.round((goal.current / goal.target) * 100)}%
                    </p>
                  </div>
                </div>
                <Progress value={(goal.current / goal.target) * 100} className="h-2" />
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Achievements */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="h-5 w-5" />
              Achievements
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {achievements.map((achievement) => (
              <div key={achievement.id} className="flex items-start gap-3">
                <div className={`p-2 rounded-lg ${achievement.unlocked ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'}`}>
                  <achievement.icon className="h-4 w-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`font-medium text-sm ${achievement.unlocked ? '' : 'text-muted-foreground'}`}>
                    {achievement.title}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {achievement.description}
                  </p>
                  {achievement.unlocked ? (
                    <p className="text-xs text-muted-foreground mt-1">
                      Unlocked {achievement.date}
                    </p>
                  ) : (
                    <Progress value={achievement.progress} className="h-1 mt-2" />
                  )}
                </div>
                {achievement.unlocked && (
                  <Badge variant="secondary" className="text-xs">
                    Unlocked
                  </Badge>
                )}
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Recent Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentActivity.map((activity, index) => (
              <div key={index} className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                <div className="p-2 rounded-lg bg-primary/10 text-primary">
                  <activity.icon className="h-4 w-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium">{activity.title}</p>
                  <p className="text-sm text-muted-foreground">{activity.description}</p>
                </div>
                <p className="text-xs text-muted-foreground">{activity.timestamp}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Detailed Learning Dashboard */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold">Detailed Progress</h2>
        <LearningDashboard stats={stats} onClearStats={clearStats} />
      </div>
    </div>
  );
}