import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Menu, X, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";

const navLinks = [
  { href: "/", labelTr: "Ana Sayfa", labelEn: "Home", labelRu: "Главная" },
  { href: "/sirketimiz", labelTr: "Şirketimiz", labelEn: "Company", labelRu: "Компания" },
  { href: "/dogal-gaz", labelTr: "Doğal Gaz", labelEn: "Natural Gas", labelRu: "Природный газ" },
  {
    href: "/basin",
    labelTr: "Basın",
    labelEn: "Press",
    labelRu: "Пресса",
    children: [
      { href: "/basin", labelTr: "Haberler", labelEn: "News", labelRu: "Новости" },
      { href: "/basin/foto-galeri", labelTr: "Foto Galeri", labelEn: "Photo Gallery", labelRu: "Фотогалерея" },
    ],
  },
  { href: "/kariyer", labelTr: "Kariyer", labelEn: "Careers", labelRu: "Карьера" },
  { href: "/iletisim", labelTr: "İletişim", labelEn: "Contact", labelRu: "Контакты" },
];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [location] = useLocation(); // base-relative path (e.g. "/sirketimiz") thanks to <Router base>
  const { lang, setLang, t } = useLanguage(); // setLang navigates across language prefixes using the full URL

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [location]);

  return (
    <>
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm"
          : "bg-white/80 backdrop-blur-sm"
      }`}
    >
      <div className="container flex items-center justify-between h-16 lg:h-20">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 z-10">
          <img
            src="/manus-storage/BosphorusGazLogo_b7723e03.jpeg"
            alt="Bosphorus Gaz Corporation"
            className="h-10 w-auto object-contain"
          />
          <span className="text-[#1e3a5f] font-bold text-lg tracking-tight hidden sm:block">
            Bosphorus Gaz
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-1">
          {navLinks.map((link) => {
            const label = lang === "en" ? link.labelEn : lang === "ru" ? link.labelRu : link.labelTr;
            const isActive =
              location === link.href ||
              (link.children?.some((c) => location === c.href) ?? false);
            if (link.children) {
              return (
                <div key={link.href} className="relative group">
                  <Link
                    href={link.href}
                    className={`flex items-center gap-1 px-3 py-2 text-sm font-medium rounded-md transition-colors duration-200 ${
                      isActive ? "text-[#1d4ed8]" : "text-slate-600 hover:text-[#1d4ed8]"
                    }`}
                  >
                    {label}
                    <ChevronDown className="h-3.5 w-3.5 transition-transform duration-200 group-hover:rotate-180" />
                  </Link>
                  <div className="absolute left-0 top-full pt-2 opacity-0 invisible translate-y-1 group-hover:opacity-100 group-hover:visible group-hover:translate-y-0 transition-all duration-200">
                    <div className="min-w-44 bg-white rounded-lg border border-slate-100 shadow-lg py-1.5">
                      {link.children.map((child) => {
                        const childLabel = lang === "en" ? child.labelEn : lang === "ru" ? child.labelRu : child.labelTr;
                        return (
                          <Link
                            key={child.href}
                            href={child.href}
                            className={`block px-4 py-2 text-sm transition-colors ${
                              location === child.href
                                ? "text-[#1d4ed8] bg-blue-50"
                                : "text-slate-600 hover:text-[#1d4ed8] hover:bg-slate-50"
                            }`}
                          >
                            {childLabel}
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                </div>
              );
            }
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`px-3 py-2 text-sm font-medium rounded-md transition-colors duration-200 ${
                  isActive ? "text-[#1d4ed8]" : "text-slate-600 hover:text-[#1d4ed8]"
                }`}
              >
                {label}
              </Link>
            );
          })}
        </nav>

        {/* Right side: Language + CTA */}
        <div className="hidden lg:flex items-center gap-3">
          <div className="flex items-center gap-1 text-xs text-slate-400">
            <button
              onClick={() => setLang("tr")}
              className={`px-2 py-1 rounded font-medium transition-colors ${
                lang === "tr" ? "text-[#1d4ed8] bg-blue-50" : "hover:text-slate-700"
              }`}
            >
              TR
            </button>
            <button
              onClick={() => setLang("en")}
              className={`px-2 py-1 rounded font-medium transition-colors ${
                lang === "en" ? "text-[#1d4ed8] bg-blue-50" : "hover:text-slate-700"
              }`}
            >
              EN
            </button>
            <button
              onClick={() => setLang("ru")}
              className={`px-2 py-1 rounded font-medium transition-colors ${
                lang === "ru" ? "text-[#1d4ed8] bg-blue-50" : "hover:text-slate-700"
              }`}
            >
              RU
            </button>
          </div>
          <Link
            href="/dogal-gaz#talep"
            className="px-4 py-2 bg-[#1d4ed8] text-white text-sm font-semibold rounded-md hover:bg-[#2563eb] transition-all duration-200 active:scale-[0.97]"
          >
            {t("Teklif Al", "Request Quote", "Запросить КП")}
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="lg:hidden z-10 p-2 text-slate-700"
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>
    </header>

      {/* Mobile Menu — rendered OUTSIDE <header> so the header's backdrop-filter
          does not become the containing block for this position:fixed overlay
          (which previously clipped it to the header's height on iOS Safari). */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
            style={{ backgroundColor: "#ffffff" }}
            className="fixed inset-0 bg-white z-[60] lg:hidden flex flex-col px-6"
          >
            {/* Overlay header row: solid bg with logo + close button */}
            <div className="flex items-center justify-between h-16">
              <Link href="/" className="flex items-center gap-2.5">
                <img
                  src="/manus-storage/BosphorusGazLogo_b7723e03.jpeg"
                  alt="Bosphorus Gaz Corporation"
                  className="h-10 w-auto object-contain"
                />
                <span className="text-[#1e3a5f] font-bold text-lg tracking-tight">
                  Bosphorus Gaz
                </span>
              </Link>
              <button
                onClick={() => setMobileOpen(false)}
                className="p-2 text-slate-700"
                aria-label="Close menu"
              >
                <X size={24} />
              </button>
            </div>
            <nav className="flex flex-col gap-2 mt-4">
              {navLinks.map((link) => {
                const label = lang === "en" ? link.labelEn : lang === "ru" ? link.labelRu : link.labelTr;
                return (
                  <div key={link.href}>
                    <Link
                      href={link.href}
                      className={`px-4 py-3 block text-lg font-medium rounded-lg transition-colors ${
                        location === link.href
                          ? "text-[#1d4ed8] bg-blue-50"
                          : "text-slate-700 hover:text-[#1d4ed8] hover:bg-slate-50"
                      }`}
                    >
                      {label}
                    </Link>
                    {link.children && (
                      <div className="ml-4 flex flex-col">
                        {link.children.map((child) => {
                          const childLabel = lang === "en" ? child.labelEn : lang === "ru" ? child.labelRu : child.labelTr;
                          return (
                            <Link
                              key={child.href}
                              href={child.href}
                              className={`px-4 py-2.5 text-base rounded-lg transition-colors ${
                                location === child.href
                                  ? "text-[#1d4ed8] bg-blue-50"
                                  : "text-slate-500 hover:text-[#1d4ed8] hover:bg-slate-50"
                              }`}
                            >
                              {childLabel}
                            </Link>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </nav>
            <div className="mt-8 flex flex-col gap-4">
              <div className="flex items-center gap-2 text-sm text-slate-400">
                <button
                  onClick={() => setLang("tr")}
                  className={`px-3 py-1.5 rounded font-medium ${
                    lang === "tr" ? "text-[#1d4ed8] bg-blue-50" : "hover:text-slate-700"
                  }`}
                >
                  TR
                </button>
                <button
                  onClick={() => setLang("en")}
                  className={`px-3 py-1.5 rounded font-medium ${
                    lang === "en" ? "text-[#1d4ed8] bg-blue-50" : "hover:text-slate-700"
                  }`}
                >
                  EN
                </button>
                <button
                  onClick={() => setLang("ru")}
                  className={`px-3 py-1.5 rounded font-medium ${
                    lang === "ru" ? "text-[#1d4ed8] bg-blue-50" : "hover:text-slate-700"
                  }`}
                >
                  RU
                </button>
              </div>
              <Link
                href="/dogal-gaz#talep"
                className="px-4 py-3 bg-[#1d4ed8] text-white text-center font-semibold rounded-md"
              >
                {t("Teklif Al", "Request Quote", "Запросить КП")}
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
