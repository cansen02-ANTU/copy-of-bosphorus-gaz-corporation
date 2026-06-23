import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch, useLocation, Router, Redirect } from "wouter";
import { useEffect } from "react";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import {
  LanguageProvider,
  useLanguage,
  baseForLang,
} from "./contexts/LanguageContext";
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

// The public routes, defined relative to the language base (e.g. "/" matches
// "/", "/en", or "/ru" depending on the active <Router base>).
function PublicRoutes() {
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

// Keeps the <html lang> attribute and document title in sync with the active language.
function HtmlLangSync() {
  const { lang } = useLanguage();
  useEffect(() => {
    document.documentElement.lang = lang;
    const titles: Record<string, string> = {
      tr: "Bosphorus Gaz Corporation | Doğal Gaz İthalat ve Toptan Satış",
      en: "Bosphorus Gaz Corporation | Natural Gas Import & Wholesale",
      ru: "Bosphorus Gaz Corporation | Импорт и оптовая продажа природного газа",
    };
    document.title = titles[lang] ?? titles.tr;
  }, [lang]);
  return null;
}

// Renders the public site within a language-scoped router so every internal
// <Link href="/..."> automatically resolves under the active language prefix.
function PublicSite() {
  const { lang } = useLanguage();
  const base = baseForLang(lang); // "" for tr, "/en", "/ru"
  return (
    <Router base={base}>
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1">
          <PublicRoutes />
        </main>
        <Footer />
      </div>
    </Router>
  );
}

function AppShell() {
  const [location] = useLocation();
  const isAdminLogin = location === "/admin/login";
  const isAdmin = location.startsWith("/admin") && !isAdminLogin;

  return (
    <>
      <HtmlLangSync />
      <ScrollToTop />
      {isAdminLogin ? (
        <AdminLogin />
      ) : isAdmin ? (
        <AdminRouter />
      ) : (
        <PublicSite />
      )}
    </>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <LanguageProvider>
        <ThemeProvider defaultTheme="light">
          <TooltipProvider>
            <Toaster />
            <AppShell />
          </TooltipProvider>
        </ThemeProvider>
      </LanguageProvider>
    </ErrorBoundary>
  );
}

export default App;
