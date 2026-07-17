import { useEffect, useRef, useState, useMemo } from "react";
import { Link } from "wouter";
import { motion, useInView } from "framer-motion";
import IndustryBubbles from "@/components/IndustryBubbles";
import { useLanguage } from "@/contexts/LanguageContext";
import { trpc } from "@/lib/trpc";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

/* Design: Light theme — White background, blue accents (#1d4ed8), navy text. */

function AnimatedCounter({ end, suffix = "", duration = 2000, decimals = 0 }: { end: number; suffix?: string; duration?: number; decimals?: number }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  useEffect(() => {
    if (!inView) return;
    const startTime = performance.now();
    const animate = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(eased * end);
      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setCount(end);
      }
    };
    requestAnimationFrame(animate);
  }, [inView, end, duration]);

  const display = decimals > 0 ? count.toFixed(decimals) : Math.round(count).toString();

  return (
    <div ref={ref} className="text-3xl lg:text-4xl font-extrabold text-[#1e3a5f] tabular-nums">
      {display}{suffix}
    </div>
  );
}

function LatestNewsSection() {
  const { t, lang } = useLanguage();
  const [selected, setSelected] = useState<any>(null);
  const { data: articles, isLoading, isError } = trpc.news.list.useQuery(undefined, {
    retry: 1,
    staleTime: 60_000,
  });

  const latestThree = useMemo(() => {
    if (!articles) return [];
    return articles.slice(0, 3);
  }, [articles]);

  const formatDate = (dateStr: string | number | Date | null) => {
    if (!dateStr) return "";
    const d = new Date(dateStr);
    const localeMap: Record<string, string> = { tr: "tr-TR", en: "en-US", ru: "ru-RU" };
    return d.toLocaleDateString(localeMap[lang] || "tr-TR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const getTitle = (article: any) => {
    if (lang === "en" && article.titleEn) return article.titleEn;
    if (lang === "ru" && article.titleRu) return article.titleRu;
    return article.title;
  };

  const getExcerpt = (article: any) => {
    if (lang === "en" && article.excerptEn) return article.excerptEn;
    if (lang === "ru" && article.excerptRu) return article.excerptRu;
    return article.excerpt;
  };

  const getContent = (article: any) => {
    if (lang === "en") return article.contentEn || article.content || article.excerptEn || article.excerpt;
    if (lang === "ru") return article.contentRu || article.content || article.excerptRu || article.excerpt;
    return article.content || article.excerpt;
  };

  return (
    <section className="py-24 lg:py-32 border-t border-slate-100">
      <div className="container">
        <div className="flex items-end justify-between mb-12">
          <div>
            <p className="text-[#1d4ed8] text-sm font-medium uppercase tracking-wider mb-3">
              {t("Bas\u0131n", "Press", "\u041f\u0440\u0435\u0441\u0441\u0430")}
            </p>
            <h2 className="text-3xl lg:text-4xl font-extrabold text-[#1e3a5f]">
              {t("Son Haberler", "Latest News", "\u041f\u043e\u0441\u043b\u0435\u0434\u043d\u0438\u0435 \u043d\u043e\u0432\u043e\u0441\u0442\u0438")}
            </h2>
          </div>
          <Link
            href="/basin"
            className="hidden sm:inline-flex items-center gap-2 text-slate-500 hover:text-[#1d4ed8] text-sm transition-colors"
          >
            {t("T\u00fcm\u00fcn\u00fc G\u00f6r", "View All", "\u0421\u043c\u043e\u0442\u0440\u0435\u0442\u044c \u0432\u0441\u0435")} &rarr;
          </Link>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[0, 1, 2].map((i) => (
              <div key={i} className="bg-slate-50 border border-slate-100 rounded-xl p-6 animate-pulse">
                <div className="h-3 w-24 bg-slate-200 rounded mb-4" />
                <div className="h-5 w-full bg-slate-200 rounded mb-3" />
                <div className="h-4 w-3/4 bg-slate-200 rounded" />
              </div>
            ))}
          </div>
        ) : isError || latestThree.length === 0 ? (
          <div className="text-center py-12 text-slate-400">
            <p>{t("Haberler yüklenemedi.", "Unable to load news.", "Не удалось загрузить новости.")}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {latestThree.map((article, i) => (
              <motion.article
                key={article.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.4, delay: i * 0.1, ease: [0.23, 1, 0.32, 1] }}
                className="group bg-white border border-slate-100 rounded-xl p-6 hover:border-blue-200 hover:shadow-md transition-all duration-300 cursor-pointer"
                onClick={() => setSelected(article)}
              >
                <p className="text-xs text-slate-400 mb-3">{formatDate(article.publishedAt)}</p>
                <h3 className="text-[#1e3a5f] font-semibold mb-3 group-hover:text-[#1d4ed8] transition-colors duration-200 line-clamp-2">
                  {getTitle(article)}
                </h3>
                <p className="text-slate-500 text-sm leading-relaxed line-clamp-3">
                  {getExcerpt(article)}
                </p>
              </motion.article>
            ))}
          </div>
        )}

        <Link
          href="/basin"
          className="sm:hidden mt-6 inline-flex items-center gap-2 text-slate-500 hover:text-[#1d4ed8] text-sm transition-colors"
        >
          {t("T\u00fcm\u00fcn\u00fc G\u00f6r", "View All", "\u0421\u043c\u043e\u0442\u0440\u0435\u0442\u044c \u0432\u0441\u0435")} &rarr;
        </Link>
      </div>

      {/* Article Detail Dialog */}
      <Dialog open={selected !== null} onOpenChange={(open) => !open && setSelected(null)}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
          {selected && (
            <>
              <DialogHeader>
                <DialogDescription className="text-xs text-slate-400 mb-1">
                  {formatDate(selected.publishedAt)}
                </DialogDescription>
                <DialogTitle className="text-2xl font-bold text-[#1e3a5f] leading-snug">
                  {getTitle(selected)}
                </DialogTitle>
              </DialogHeader>
              {selected.imageUrl && (
                <div className="rounded-xl overflow-hidden my-2">
                  <img src={selected.imageUrl} alt={getTitle(selected)} className="w-full object-cover" />
                </div>
              )}
              <div className="text-slate-600 leading-relaxed whitespace-pre-line text-[15px]">
                {getContent(selected)}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
}

export default function Home() {
  const { t } = useLanguage();

  return (
    <div>
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://d2xsxph8kpxj0f.cloudfront.net/310519663406413308/YsuVUT62bVL4iGDytG28i2/hero-bg-K6Qnm8DfK2VVuDEEjfa2tY.webp"
            alt=""
            className="w-full h-full object-cover opacity-50"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#1e3a5f]/90 via-[#2563eb]/50 to-white" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#1e3a5f]/60 via-[#1e3a5f]/30 to-transparent" />
        </div>

        <div className="container relative z-10 pt-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
            className="max-w-2xl"
          >
            {/* Large Logo */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.05, ease: [0.23, 1, 0.32, 1] }}
              className="mb-8"
            >
              <img
                src="/images/BosphorusGazLogo_b7723e03.jpeg"
                alt="Bosphorus Gaz Corporation A.Ş."
                className="w-[280px] sm:w-[320px] lg:w-[380px] h-auto object-contain rounded-lg"
              />
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1, ease: [0.23, 1, 0.32, 1] }}
              className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-[1.1] mb-6"
            >
              {t(
                "Türkiye'nin En Büyük Özel Doğal Gaz İthalatçısı",
                "Turkey's Largest Private Natural Gas Importer",
                "Крупнейший частный импортёр природного газа в Турции"
              )}
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.25, ease: [0.23, 1, 0.32, 1] }}
              className="text-lg text-white/70 mb-8 leading-relaxed"
            >
              {t(
                "Yılda 2,5 milyar m³ kapasite. 2043'e kadar güvenceli arz. 2003'ten beri Türkiye'ye hizmet.",
                "2.5 billion m³/year capacity. Supply secured until 2043. Serving Turkey since 2003.",
                "Мощность 2,5 млрд м³ в год. Гарантированные поставки до 2043 года. Работаем в Турции с 2003 года."
              )}
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4, ease: [0.23, 1, 0.32, 1] }}
              className="flex flex-wrap gap-4"
            >
              <Link
                href="/dogal-gaz#talep"
                className="px-6 py-3 bg-white text-[#1e3a5f] font-semibold rounded-md hover:bg-blue-50 transition-all duration-200 active:scale-[0.97]"
              >
                {t("Teklif Al", "Request a Quote", "Запросить КП")}
              </Link>
              <Link
                href="/sirketimiz"
                className="px-6 py-3 border border-white/30 text-white font-medium rounded-md hover:bg-white/10 transition-all duration-200 active:scale-[0.97]"
              >
                {t("Hakkımızda", "About Us", "О компании")}
              </Link>
            </motion.div>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          <div className="w-5 h-8 rounded-full border-2 border-white/30 flex items-start justify-center p-1">
            <div className="w-1 h-2 bg-white/50 rounded-full" />
          </div>
        </motion.div>
      </section>

      {/* Stats Strip */}
      <section className="py-16 lg:py-20 border-y border-slate-100 bg-slate-50">
        <div className="container">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
            <div className="text-center lg:text-left">
              <AnimatedCounter end={2.5} suffix=" bcm" decimals={1} />
              <p className="text-slate-500 text-sm mt-2">{t("Yıllık Kapasite", "Annual Capacity", "Годовая мощность")}</p>
            </div>
            <div className="text-center lg:text-left">
              <AnimatedCounter end={2003} suffix="" duration={1500} />
              <p className="text-slate-500 text-sm mt-2">{t("Kuruluş Yılı", "Established", "Год основания")}</p>
            </div>
            <div className="text-center lg:text-left">
              <div className="flex items-baseline gap-1 justify-center lg:justify-start">
                <span className="text-slate-400 text-lg">~</span>
                <AnimatedCounter end={45} suffix="%" />
              </div>
              <p className="text-slate-500 text-sm mt-2">{t("Özel Pazar Payı", "Private Market Share", "Доля на частном рынке")}</p>
            </div>
            <div className="text-center lg:text-left">
              <AnimatedCounter end={2043} suffix="" duration={1500} />
              <p className="text-slate-500 text-sm mt-2">{t("Tedarik Kontratı", "Supply Contract", "Контракт на поставки")}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Industry Bubbles Section */}
      <IndustryBubbles />

      {/* About Snippet */}
      <section className="py-24 lg:py-32 relative bg-slate-50">
        <div className="container relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <p className="text-[#1d4ed8] text-sm font-medium uppercase tracking-wider mb-3">
                Bosphorus Gaz Corporation
              </p>
              <h2 className="text-3xl lg:text-4xl font-extrabold text-[#1e3a5f] mb-6">
                {t(
                  "2003'ten Bu Yana Güvenilir Enerji Ortağınız",
                  "Your Reliable Energy Partner Since 2003",
                  "Ваш надёжный энергетический партнёр с 2003 года"
                )}
              </h2>
              <p className="text-slate-600 leading-relaxed mb-4">
                {t(
                  "İstanbul'da 7 Nisan 2003 tarihinde kurulan Bosphorus Gaz Corporation A.Ş., Türkiye doğal gaz piyasasının serbestleşme sürecinde güçlü ve güvenilir bir kurumsal yapı olarak sektörde yerini almıştır.",
                  "Founded on April 7, 2003 in Istanbul, Bosphorus Gaz Corporation A.Ş. has established itself as a strong and reliable corporate entity in Turkey's natural gas market liberalization process.",
                  "Основанная 7 апреля 2003 года в Стамбуле, компания Bosphorus Gaz Corporation A.Ş. заняла прочное место в отрасли как сильная и надёжная корпоративная структура в процессе либерализации рынка природного газа Турции."
                )}
              </p>
              <p className="text-slate-600 leading-relaxed mb-8">
                {t(
                  "Bugün yılda 2,5 milyar m³ toplam hacimle ülkemiz toplam ithalatının yaklaşık %5'ini üstlenen bir kuruluş olarak, BOTAŞ sonrası en yüksek ithalat miktarına sahip bağımsız şirket konumundadır.",
                  "Today, with a total volume of 2.5 billion m³ per year, accounting for approximately 5% of Turkey's total imports, it is the independent company with the highest import volume after BOTAŞ.",
                  "Сегодня, с общим объёмом 2,5 млрд м³ в год, что составляет около 5% от общего импорта Турции, компания является независимым поставщиком с наибольшим объёмом импорта после BOTAŞ."
                )}
              </p>
              <Link
                href="/sirketimiz"
                className="inline-flex items-center gap-2 text-[#1d4ed8] font-medium hover:gap-3 transition-all duration-200"
              >
                {t("Daha Fazla Bilgi", "Learn More", "Подробнее")}
                <span>&rarr;</span>
              </Link>
            </div>
            <div className="relative">
              <img
                src="https://d2xsxph8kpxj0f.cloudfront.net/310519663406413308/YsuVUT62bVL4iGDytG28i2/about-corporate-fjzD2yPeTcmgeM3mtopuDP.webp"
                alt={t("Bosphorus Gaz altyapısı", "Bosphorus Gaz infrastructure", "Инфраструктура Bosphorus Gaz")}
                className="rounded-xl w-full h-auto object-cover shadow-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Latest News — dynamic from DB */}
      <LatestNewsSection />

      {/* CTA Banner */}
      <section className="py-20 lg:py-24 bg-gradient-to-r from-[#1e3a5f] to-[#2563eb]">
        <div className="container text-center">
          <h2 className="text-2xl lg:text-3xl font-bold text-white mb-4">
            {t(
              "Türkiye'nin en güvenilir gaz tedarikçisine geçmeye hazır mısınız?",
              "Ready to switch to Turkey's most reliable gas supplier?",
              "Готовы перейти к самому надёжному поставщику газа в Турции?"
            )}
          </h2>
          <p className="text-white/70 mb-8 max-w-lg mx-auto">
            {t(
              "Rekabetçi fiyatlarımız ve güvenceli arz kapasitemiz hakkında bilgi almak için bizimle iletişime geçin.",
              "Contact us to learn about our competitive pricing and secured supply capacity.",
              "Свяжитесь с нами, чтобы узнать о наших конкурентоспособных ценах и гарантированных объёмах поставок."
            )}
          </p>
          <Link
            href="/dogal-gaz#talep"
            className="inline-flex px-8 py-4 bg-white text-[#1e3a5f] font-semibold rounded-md hover:bg-blue-50 transition-all duration-200 active:scale-[0.97]"
          >
            {t("Teklif Talep Edin", "Request a Supply Quote", "Запросить коммерческое предложение")}
          </Link>
        </div>
      </section>
    </div>
  );
}
