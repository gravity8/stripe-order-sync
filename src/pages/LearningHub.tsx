import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  BookOpen, 
  Clock, 
  Users, 
  TrendingUp,
  Search,
  Filter,
  Star,
  Play,
  ChevronRight
} from "lucide-react";

const featuredConcepts = [
  {
    id: 1,
    title: "Microservices Architecture",
    description: "Learn how to design and implement scalable microservices",
    difficulty: "Advanced",
    duration: "45 min",
    students: 1250,
    rating: 4.8,
    category: "Architecture",
    trending: true,
    scenario: "Building a scalable e-commerce platform with independent services"
  },
  {
    id: 2,
    title: "JWT Authentication",
    description: "Secure your applications with JSON Web Tokens",
    difficulty: "Intermediate",
    duration: "30 min",
    students: 2100,
    rating: 4.9,
    category: "Security",
    trending: false,
    scenario: "Implementing secure user authentication in a SaaS application"
  },
  {
    id: 3,
    title: "React Context & State Management",
    description: "Master state management patterns in React applications",
    difficulty: "Intermediate",
    duration: "35 min",
    students: 1850,
    rating: 4.7,
    category: "Frontend",
    trending: true,
    scenario: "Managing global state in a large React dashboard application"
  },
  {
    id: 4,
    title: "Docker Containerization",
    description: "Package and deploy applications with Docker containers",
    difficulty: "Beginner",
    duration: "40 min",
    students: 3200,
    rating: 4.6,
    category: "DevOps",
    trending: false,
    scenario: "Containerizing a Node.js application for consistent deployments"
  },
  {
    id: 5,
    title: "GraphQL API Design",
    description: "Build efficient APIs with GraphQL query language",
    difficulty: "Advanced",
    duration: "50 min",
    students: 980,
    rating: 4.8,
    category: "Backend",
    trending: true,
    scenario: "Creating a flexible API for a mobile app backend"
  },
  {
    id: 6,
    title: "Redis Caching Strategies",
    description: "Improve application performance with smart caching",
    difficulty: "Intermediate",
    duration: "25 min",
    students: 1400,
    rating: 4.5,
    category: "Performance",
    trending: false,
    scenario: "Optimizing database queries in a high-traffic web application"
  }
];

const categories = [
  "All",
  "Frontend",
  "Backend", 
  "Architecture",
  "Security",
  "DevOps",
  "Performance"
];

const difficultyLevels = [
  "All",
  "Beginner",
  "Intermediate", 
  "Advanced"
];

export default function LearningHub() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedDifficulty, setSelectedDifficulty] = useState("All");
  const [activeTab, setActiveTab] = useState("featured");

  const filteredConcepts = featuredConcepts.filter(concept => {
    const matchesSearch = concept.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         concept.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "All" || concept.category === selectedCategory;
    const matchesDifficulty = selectedDifficulty === "All" || concept.difficulty === selectedDifficulty;
    
    return matchesSearch && matchesCategory && matchesDifficulty;
  });

  const trendingConcepts = featuredConcepts.filter(concept => concept.trending);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Beginner": return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      case "Intermediate": return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
      case "Advanced": return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
      default: return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300";
    }
  };

  const handleExplore = (concept: any) => {
    // In a real app, this would navigate to the concept explorer with pre-filled data
    window.location.href = `/?concept=${encodeURIComponent(concept.title)}&scenario=${encodeURIComponent(concept.scenario)}`;
  };

  return (
    <div className="flex-1 space-y-6 p-6">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/20 via-primary/10 to-transparent p-8 border">
        <div className="relative z-10 max-w-2xl">
          <h1 className="text-4xl font-bold mb-4">Learning Hub</h1>
          <p className="text-xl text-muted-foreground mb-6">
            Discover curated programming concepts with hands-on examples and real-world scenarios.
          </p>
          <div className="flex flex-wrap gap-4">
            <Badge variant="secondary" className="text-sm px-3 py-1">
              50+ Concepts
            </Badge>
            <Badge variant="secondary" className="text-sm px-3 py-1">
              Interactive Examples
            </Badge>
            <Badge variant="secondary" className="text-sm px-3 py-1">
              AI-Powered Explanations
            </Badge>
          </div>
        </div>
        {/* Decorative background elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-primary/20 to-transparent rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-20 w-32 h-32 bg-gradient-to-tl from-accent/20 to-transparent rounded-full blur-2xl"></div>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search concepts, topics, or technologies..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-3 py-2 rounded-md border border-input bg-background text-sm"
              >
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
              <select
                value={selectedDifficulty}
                onChange={(e) => setSelectedDifficulty(e.target.value)}
                className="px-3 py-2 rounded-md border border-input bg-background text-sm"
              >
                {difficultyLevels.map(level => (
                  <option key={level} value={level}>{level}</option>
                ))}
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Concepts Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3 lg:grid-cols-3 lg:w-auto">
          <TabsTrigger value="featured">Featured</TabsTrigger>
          <TabsTrigger value="trending">Trending</TabsTrigger>
          <TabsTrigger value="all">All Concepts</TabsTrigger>
        </TabsList>

        <TabsContent value="featured" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredConcepts.slice(0, 6).map((concept) => (
              <ConceptCard key={concept.id} concept={concept} onExplore={handleExplore} getDifficultyColor={getDifficultyColor} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="trending" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {trendingConcepts.map((concept) => (
              <ConceptCard key={concept.id} concept={concept} onExplore={handleExplore} getDifficultyColor={getDifficultyColor} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="all" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredConcepts.map((concept) => (
              <ConceptCard key={concept.id} concept={concept} onExplore={handleExplore} getDifficultyColor={getDifficultyColor} />
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {filteredConcepts.length === 0 && (
        <Card className="p-12 text-center">
          <BookOpen className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-xl font-semibold mb-2">No concepts found</h3>
          <p className="text-muted-foreground">
            Try adjusting your search terms or filters to find what you're looking for.
          </p>
        </Card>
      )}
    </div>
  );
}

function ConceptCard({ concept, onExplore, getDifficultyColor }: any) {
  return (
    <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-border/50 hover:border-border overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="outline" className="text-xs">
                {concept.category}
              </Badge>
              {concept.trending && (
                <Badge variant="secondary" className="text-xs">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  Trending
                </Badge>
              )}
            </div>
            <CardTitle className="text-lg leading-tight group-hover:text-primary transition-colors">
              {concept.title}
            </CardTitle>
          </div>
          <Badge className={getDifficultyColor(concept.difficulty)} variant="secondary">
            {concept.difficulty}
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground leading-relaxed">
          {concept.description}
        </p>
      </CardHeader>
      
      <CardContent className="pt-0 space-y-4">
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              <span>{concept.duration}</span>
            </div>
            <div className="flex items-center gap-1">
              <Users className="h-4 w-4" />
              <span>{concept.students.toLocaleString()}</span>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            <span className="font-medium">{concept.rating}</span>
          </div>
        </div>
        
        <div className="p-3 bg-muted/50 rounded-lg">
          <p className="text-xs text-muted-foreground mb-1">Scenario:</p>
          <p className="text-sm">{concept.scenario}</p>
        </div>
        
        <Button 
          onClick={() => onExplore(concept)}
          className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
          variant="outline"
        >
          <Play className="h-4 w-4 mr-2" />
          Explore Concept
          <ChevronRight className="h-4 w-4 ml-auto group-hover:translate-x-1 transition-transform" />
        </Button>
      </CardContent>
    </Card>
  );
}