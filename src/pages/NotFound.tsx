import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { AlertTriangle, Home } from "lucide-react";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background via-muted/20 to-accent/10">
      <div className="text-center max-w-md mx-auto px-4">
        <div className="flex justify-center mb-6">
          <div className="p-4 bg-destructive/10 rounded-full">
            <AlertTriangle className="h-16 w-16 text-destructive" />
          </div>
        </div>
        
        <h1 className="text-4xl font-bold text-foreground mb-4">404</h1>
        <h2 className="text-xl font-semibold text-foreground mb-2">Página não encontrada</h2>
        <p className="text-muted-foreground mb-8 leading-relaxed">
          A página que você está procurando não existe ou foi removida. 
          Verifique o endereço ou volte à página inicial.
        </p>
        
        <Button asChild className="inline-flex items-center gap-2">
          <Link to="/">
            <Home className="h-4 w-4" />
            Voltar ao Início
          </Link>
        </Button>
        
        {location.pathname !== "/" && (
          <p className="text-xs text-muted-foreground mt-4">
            Rota tentada: <code className="bg-muted px-1 py-0.5 rounded text-xs">{location.pathname}</code>
          </p>
        )}
      </div>
    </div>
  );
};

export default NotFound;
