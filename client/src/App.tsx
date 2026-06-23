import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch, useLocation } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { LanguageProvider } from "./contexts/LanguageContext";
import Home from "./pages/Home";
import Company from "./pages/Company";
import NaturalGas from "./pages/NaturalGas";
import Press from "./pages/Press";
import Careers from "./pages/Careers";
import Contact from "./pages/Contact";
import Header from "./components/Header";
import Footer from "./components/Footer";
import ScrollToTop from "./components/ScrollToTop";
import DashboardLayout from "./components/DashboardLayout";
import AdminNews from "./pages/AdminNews";
import AdminGallery from "./pages/AdminGallery";
import AdminLogin from "./pages/AdminLogin";
import { Redirect } from "wouter";

function PublicRouter() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/sirketimiz" component={Company} />
      <Route path="/dogal-gaz" component={NaturalGas} />
      <Route path="/basin" component={Press} />
      <Route path="/kariyer" component={Careers} />
      <Route path="/iletisim" component={Contact} />
      <Route path="/404" component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

function AdminRouter() {
  return (
    <DashboardLayout>
      <Switch>
        <Route path="/admin/haberler" component={AdminNews} />
        <Route path="/admin/galeri" component={AdminGallery} />
        <Route path="/admin">
          <Redirect to="/admin/haberler" />
        </Route>
        <Route component={NotFound} />
      </Switch>
    </DashboardLayout>
  );
}

function App() {
  const [location] = useLocation();
  const isAdminLogin = location === "/admin/login";
  const isAdmin = location.startsWith("/admin") && !isAdminLogin;

  return (
    <ErrorBoundary>
      <LanguageProvider>
      <ThemeProvider defaultTheme="light">
        <TooltipProvider>
          <Toaster />
          <ScrollToTop />
          {isAdminLogin ? (
            <AdminLogin />
          ) : isAdmin ? (
            <AdminRouter />
          ) : (
            <div className="min-h-screen flex flex-col">
              <Header />
              <main className="flex-1">
                <PublicRouter />
              </main>
              <Footer />
            </div>
          )}
        </TooltipProvider>
      </ThemeProvider>
      </LanguageProvider>
    </ErrorBoundary>
  );
}

export default App;
