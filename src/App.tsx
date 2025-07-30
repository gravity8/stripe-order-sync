import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import Index from "./pages/Index";
import LearningHub from "./pages/LearningHub";
import Dashboard from "./pages/Dashboard";
import Playground from "./pages/Playground";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <SidebarProvider>
          <div className="flex min-h-screen w-full">
            <AppSidebar />
            <SidebarInset>
              <header className="flex h-16 shrink-0 items-center gap-2 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                <div className="flex items-center gap-2 px-4">
                  <SidebarTrigger className="-ml-1" />
                  <div className="h-4 w-px bg-sidebar-border" />
                  <h1 className="text-lg font-semibold">Programming Concept Explorer</h1>
                </div>
              </header>
              
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/learning" element={<LearningHub />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/playground" element={<Playground />} />
                <Route path="/learn/*" element={<LearningHub />} />
                <Route path="/community" element={<div className="p-6"><h1>Community (Coming Soon)</h1></div>} />
                <Route path="/achievements" element={<div className="p-6"><h1>Achievements (Coming Soon)</h1></div>} />
                <Route path="/settings" element={<div className="p-6"><h1>Settings (Coming Soon)</h1></div>} />
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </SidebarInset>
          </div>
        </SidebarProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
