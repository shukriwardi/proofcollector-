
import { useEffect } from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { getCSPDirectives } from "./lib/security";
import Index from "./pages/Index";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import Dashboard from "./pages/Dashboard";
import Submit from "./pages/Submit";
import Testimonials from "./pages/Testimonials";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";
import TestimonialView from "./pages/TestimonialView";

const queryClient = new QueryClient();

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
};

const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }
  
  if (user) {
    return <Navigate to="/dashboard" replace />;
  }
  
  return <>{children}</>;
};

const AppRoutes = () => (
  <Routes>
    <Route path="/" element={<Index />} />
    <Route path="/signup" element={<PublicRoute><Signup /></PublicRoute>} />
    <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
    <Route path="/forgot-password" element={<PublicRoute><ForgotPassword /></PublicRoute>} />
    <Route path="/reset-password" element={<ResetPassword />} />
    <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
    <Route path="/testimonials" element={<ProtectedRoute><Testimonials /></ProtectedRoute>} />
    <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
    <Route path="/submit" element={<Submit />} />
    <Route path="/submit/:linkId" element={<Submit />} />
    <Route path="/link/:id" element={<Submit />} />
    <Route path="/t/:id" element={<TestimonialView />} />
    <Route path="*" element={<NotFound />} />
  </Routes>
);

const App = () => {
  useEffect(() => {
    // Hide Lovable badge for Pro users
    const hideLovableBadge = () => {
      const badgeSelectors = [
        '[data-lovable-badge]',
        '.lovable-badge',
        '#lovable-badge',
        '[class*="lovable-badge"]',
        '[id*="lovable-badge"]',
        '[data-testid*="lovable"]',
        '[class*="gptengineer"]'
      ];
      
      badgeSelectors.forEach(selector => {
        const elements = document.querySelectorAll(selector);
        elements.forEach(element => {
          if (element instanceof HTMLElement) {
            element.style.display = 'none';
            element.style.visibility = 'hidden';
            element.remove(); // Actually remove it from DOM
          }
        });
      });
    };

    // Run immediately and also observe for dynamically added badges
    hideLovableBadge();
    
    const observer = new MutationObserver(hideLovableBadge);
    observer.observe(document.body, {
      childList: true,
      subtree: true
    });

    // Set security headers (where possible in client-side)
    const cspDirectives = getCSPDirectives();
    
    // Add CSP meta tag if not already present
    if (!document.querySelector('meta[http-equiv="Content-Security-Policy"]')) {
      const cspMeta = document.createElement('meta');
      cspMeta.setAttribute('http-equiv', 'Content-Security-Policy');
      cspMeta.setAttribute('content', cspDirectives);
      document.head.appendChild(cspMeta);
    }

    // Set other security-related meta tags
    const securityMetas = [
      { name: 'referrer', content: 'strict-origin-when-cross-origin' },
      { name: 'robots', content: 'noindex, nofollow', condition: window.location.hostname !== 'your-production-domain.com' }
    ];

    securityMetas.forEach(({ name, content, condition }) => {
      if (condition === undefined || condition) {
        if (!document.querySelector(`meta[name="${name}"]`)) {
          const meta = document.createElement('meta');
          meta.setAttribute('name', name);
          meta.setAttribute('content', content);
          document.head.appendChild(meta);
        }
      }
    });

    // Disable right-click context menu in production (optional)
    if (process.env.NODE_ENV === 'production') {
      const handleContextMenu = (e: MouseEvent) => {
        e.preventDefault();
      };
      
      document.addEventListener('contextmenu', handleContextMenu);
      
      return () => {
        document.removeEventListener('contextmenu', handleContextMenu);
        observer.disconnect();
      };
    }

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <AuthProvider>
          <BrowserRouter>
            <AppRoutes />
          </BrowserRouter>
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
