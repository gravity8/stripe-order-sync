import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  Brain,
  BookOpen,
  BarChart3,
  Settings,
  Code2,
  Lightbulb,
  Users,
  Trophy,
  Home,
  ChevronRight,
  Search,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

const mainNavItems = [
  {
    title: "Home",
    url: "/",
    icon: Home,
    description: "Main concept explorer"
  },
  {
    title: "Learning Hub",
    url: "/learning",
    icon: BookOpen,
    description: "Curated programming concepts"
  },
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: BarChart3,
    description: "Your learning progress",
    badge: "Pro"
  },
  {
    title: "Code Playground",
    url: "/playground",
    icon: Code2,
    description: "Interactive coding environment"
  },
];

const learningCategories = [
  {
    title: "Fundamentals",
    items: [
      { title: "Data Structures", url: "/learn/data-structures" },
      { title: "Algorithms", url: "/learn/algorithms" },
      { title: "Design Patterns", url: "/learn/design-patterns" },
    ]
  },
  {
    title: "Web Development",
    items: [
      { title: "Frontend Frameworks", url: "/learn/frontend" },
      { title: "Backend APIs", url: "/learn/backend" },
      { title: "Database Design", url: "/learn/databases" },
    ]
  },
  {
    title: "DevOps & Security",
    items: [
      { title: "CI/CD Pipelines", url: "/learn/cicd" },
      { title: "Security Best Practices", url: "/learn/security" },
      { title: "Cloud Platforms", url: "/learn/cloud" },
    ]
  }
];

export function AppSidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  const [searchTerm, setSearchTerm] = useState("");
  const [openCategories, setOpenCategories] = useState<Record<string, boolean>>({});

  const isActive = (path: string) => location.pathname === path;
  const isCollapsed = state === "collapsed";

  const toggleCategory = (category: string) => {
    setOpenCategories(prev => ({
      ...prev,
      [category]: !prev[category]
    }));
  };

  const filteredCategories = learningCategories.map(category => ({
    ...category,
    items: category.items.filter(item => 
      item.title.toLowerCase().includes(searchTerm.toLowerCase())
    )
  })).filter(category => category.items.length > 0);

  return (
    <Sidebar className="border-r bg-gradient-to-b from-sidebar via-sidebar/95 to-sidebar/90">
      <SidebarHeader className="border-b border-sidebar-border/50 bg-sidebar/50 backdrop-blur-sm">
        <div className="flex items-center gap-2 px-2 py-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary shadow-lg">
            <Brain className="h-5 w-5 text-primary-foreground" />
          </div>
          {!isCollapsed && (
            <div className="flex flex-col">
              <span className="text-sm font-semibold">Code Explorer</span>
              <span className="text-xs text-muted-foreground">AI-Powered Learning</span>
            </div>
          )}
        </div>
        
        {!isCollapsed && (
          <div className="px-2 pb-2">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search concepts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8 h-9 bg-background/50 border-border/50"
              />
            </div>
          </div>
        )}
      </SidebarHeader>

      <SidebarContent className="overflow-x-hidden">
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs font-medium text-muted-foreground/80 px-2">
            Navigation
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainNavItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton 
                    asChild 
                    isActive={isActive(item.url)}
                    tooltip={isCollapsed ? item.description : undefined}
                    className="group relative overflow-hidden transition-all duration-200 hover:scale-[1.02]"
                  >
                    <NavLink to={item.url} className="flex items-center gap-3">
                      <item.icon className="h-4 w-4 transition-transform group-hover:scale-110" />
                      {!isCollapsed && (
                        <>
                          <span className="flex-1">{item.title}</span>
                          {item.badge && (
                            <Badge variant="secondary" className="text-xs px-1.5 py-0.5">
                              {item.badge}
                            </Badge>
                          )}
                        </>
                      )}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {!isCollapsed && (
          <SidebarGroup>
            <SidebarGroupLabel className="text-xs font-medium text-muted-foreground/80 px-2">
              Learning Paths
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {filteredCategories.map((category) => (
                  <Collapsible 
                    key={category.title}
                    open={openCategories[category.title]}
                    onOpenChange={() => toggleCategory(category.title)}
                  >
                    <SidebarMenuItem>
                      <CollapsibleTrigger asChild>
                        <SidebarMenuButton className="group hover:bg-sidebar-accent/50">
                          <Lightbulb className="h-4 w-4" />
                          <span className="flex-1">{category.title}</span>
                          <ChevronRight className="h-3 w-3 transition-transform group-data-[state=open]:rotate-90" />
                        </SidebarMenuButton>
                      </CollapsibleTrigger>
                      <CollapsibleContent>
                        <SidebarMenuSub>
                          {category.items.map((item) => (
                            <SidebarMenuSubItem key={item.title}>
                              <SidebarMenuSubButton 
                                asChild
                                isActive={isActive(item.url)}
                                className="hover:bg-sidebar-accent/30"
                              >
                                <NavLink to={item.url}>
                                  <span>{item.title}</span>
                                </NavLink>
                              </SidebarMenuSubButton>
                            </SidebarMenuSubItem>
                          ))}
                        </SidebarMenuSub>
                      </CollapsibleContent>
                    </SidebarMenuItem>
                  </Collapsible>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}

        {!isCollapsed && (
          <SidebarGroup className="mt-auto">
            <SidebarGroupLabel className="text-xs font-medium text-muted-foreground/80 px-2">
              Community
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild className="hover:bg-sidebar-accent/50">
                    <NavLink to="/community" className="flex items-center gap-3">
                      <Users className="h-4 w-4" />
                      <span>Community</span>
                      <Badge variant="secondary" className="text-xs">Beta</Badge>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild className="hover:bg-sidebar-accent/50">
                    <NavLink to="/achievements" className="flex items-center gap-3">
                      <Trophy className="h-4 w-4" />
                      <span>Achievements</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border/50 bg-sidebar/50 backdrop-blur-sm">
        {!isCollapsed && (
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild className="hover:bg-sidebar-accent/50">
                <NavLink to="/settings" className="flex items-center gap-3">
                  <Settings className="h-4 w-4" />
                  <span>Settings</span>
                </NavLink>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        )}
        {isCollapsed && (
          <div className="flex justify-center">
            <Button variant="ghost" size="icon" asChild>
              <NavLink to="/settings">
                <Settings className="h-4 w-4" />
              </NavLink>
            </Button>
          </div>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}