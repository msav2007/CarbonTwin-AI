import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "sonner";
import HomePage from "./app/page";
import OnboardingPage from "./app/onboarding/page";
import RevealPage from "./app/onboarding/reveal/page";
import DashboardPage from "./app/dashboard/page";
import DashboardLayout from "./app/dashboard/layout";
import CoachPage from "./app/dashboard/coach/page";
import SimulatorPage from "./app/dashboard/simulator/page";
import WhatIfPage from "./app/dashboard/what-if/page";
import ProgressPage from "./app/dashboard/progress/page";

const queryClient = new QueryClient();

function Router() {
  return (
    <Switch>
      <Route path="/" component={HomePage} />
      <Route path="/onboarding" component={OnboardingPage} />
      <Route path="/onboarding/reveal" component={RevealPage} />
      <Route path="/dashboard">
        <DashboardLayout>
          <DashboardPage />
        </DashboardLayout>
      </Route>
      <Route path="/dashboard/coach">
        <DashboardLayout>
          <CoachPage />
        </DashboardLayout>
      </Route>
      <Route path="/dashboard/simulator">
        <DashboardLayout>
          <SimulatorPage />
        </DashboardLayout>
      </Route>
      <Route path="/dashboard/what-if">
        <DashboardLayout>
          <WhatIfPage />
        </DashboardLayout>
      </Route>
      <Route path="/dashboard/progress">
        <DashboardLayout>
          <ProgressPage />
        </DashboardLayout>
      </Route>
      <Route>
        <div className="min-h-screen flex items-center justify-center bg-background text-foreground">
          <div className="text-center">
            <h1 className="text-2xl font-bold">404 - Page Not Found</h1>
          </div>
        </div>
      </Route>
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
        <Router />
      </WouterRouter>
      <Toaster
        theme="dark"
        position="bottom-right"
        toastOptions={{
          classNames: {
            toast: "glass border-border font-sans",
          },
        }}
      />
    </QueryClientProvider>
  );
}

export default App;
