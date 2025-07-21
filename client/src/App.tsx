import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import Tavern from "@/pages/tavern-live";
import DigitalEnlightenment from "@/pages/digital-enlightenment";
import { ConversationDemo } from "./components/ConversationDemo";
import { ConversationAnalyticsDashboard } from "./components/ConversationAnalyticsDashboard";
import { EnhancedConversationDemo } from "./components/EnhancedConversationDemo";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Tavern} />
      <Route path="/home" component={Home} />
      <Route path="/conversation-demo" component={ConversationDemo} />
      <Route path="/enhanced-demo" component={EnhancedConversationDemo} />
      <Route path="/analytics" component={ConversationAnalyticsDashboard} />
      <Route path="/enlightenment" component={DigitalEnlightenment} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
