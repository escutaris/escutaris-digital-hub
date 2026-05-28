
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Suspense, lazy } from "react";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import { AuthProvider } from "./lib/useAuth";
import { ProtectedRoute } from "./lib/useAuth";
import { ThemeProvider } from "./hooks/use-theme";
import InstallPWA from "./components/InstallPWA";

const Admin = lazy(() => import("./pages/Admin"));
const NewsDetail = lazy(() => import("./pages/NewsDetail"));
const Favorites = lazy(() => import("./pages/Favorites"));

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider defaultTheme="system" storageKey="escutaris-theme">
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <InstallPWA />
          <BrowserRouter>
            <Suspense fallback={<div className="flex min-h-screen items-center justify-center"><div className="h-8 w-8 animate-spin rounded-full border-4 border-escutaris-green border-t-transparent" /></div>}>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/favoritos" element={<Favorites />} />
                <Route path="/noticias/:slug" element={<NewsDetail />} />
                <Route path="/login" element={<Login />} />
                <Route path="/admin" element={
                  <ProtectedRoute>
                    <Admin />
                  </ProtectedRoute>
                } />
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;

