import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { trpc } from "@/lib/trpc";
import { Loader2, Newspaper, ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import { Link } from "wouter";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

/* Design: Light theme — White bg, blue accents, news cards. */

const PAGE_SIZE = 6;

type Article = {
  id: number;
  title: string;
  excerpt: string;
  content: string | null;
  titleEn: string | null;
  excerptEn: string | null;
  contentEn: string | null;
  titleRu: string | null;
  excerptRu: string | null;
  contentRu: string | null;
  imageUrl: string | null;
  publishedAt: number;
};

export default function Press() {
  const { data: dbArticles, isLoading: newsLoading, error: newsError } = trpc.news.list.useQuery();
  const { t, lang } = useLanguage();

  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<Article | null>(null);

  const locale = lang === "en" ? "en-US" : lang === "ru" ? "ru-RU" : "tr-TR";

  // Use localized fields when available; fall back to Turkish otherwise.
  const aTitle = (a: Article) =>
    lang === "en" ? a.titleEn || a.title : lang === "ru" ? a.titleRu || a.title : a.title;
  const aExcerpt = (a: Article) =>
    lang === "en" ? a.excerptEn || a.excerpt : lang === "ru" ? a.excerptRu || a.excerpt : a.excerpt;
  const aContent = (a: Article) =>
    lang === "en"
      ? a.contentEn || a.content || a.excerptEn || a.excerpt
      : lang === "ru"
      ? a.contentRu || a.content || a.excerptRu || a.excerpt
      : a.content || a.excerpt;

  const formatDate = (ts: number) =>
    new Date(ts).toLocaleDateString(locale, {
      day: "numeric",
      month: "long",
      year: "numeric",
    });

  const articles = (dbArticles ?? []) as Article[];
  const totalPages = Math.max(1, Math.ceil(articles.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);

  const pageArticles = useMemo(
    () => articles.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE),
    [articles, currentPage]
  );

  const goToPage = (p: number) => {
    setPage(p);
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <div className="pt-20">
      {/* Hero */}
      <section className="relative py-24 lg:py-32 overflow-hidden bg-gradient-to-br from-[#1e3a5f] to-[#2563eb]">
        <div className="absolute inset-0 opacity-30">
          <img
            src="https://d2xsxph8kpxj0f.cloudfront.net/310519663406413308/YsuVUT62bVL4iGDytG28i2/basin-bg-E5BshufzgZYdQAXavkC2LS.webp"
            alt=""
            className="w-full h-full object-cover"
          />
        </div>
        <div className="container relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
          >
            <p className="text-blue-200 text-sm font-medium uppercase tracking-wider mb-3">
              {t("Basın", "Press", "Пресса")}
            </p>
            <h1 className="text-4xl lg:text-5xl font-extrabold text-white mb-6">
              {t("Haberler", "News", "Новости")}
            </h1>
            <p className="text-white/70 max-w-2xl text-lg">
              {t(
                "Bosphorus Gaz'dan son gelişmeler ve sektör haberleri.",
                "Latest developments and industry news from Bosphorus Gaz Corporation.",
                "Последние события и отраслевые новости от Bosphorus Gaz Corporation."
              )}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Basın sub-navigation */}
      <section className="border-t border-slate-100 bg-white sticky top-16 lg:top-20 z-30">
        <div className="container flex items-center gap-1 py-3">
          <Link
            href="/basin"
            className="px-4 py-2 text-sm font-semibold rounded-lg bg-[#1d4ed8] text-white"
          >
            {t("Haberler", "News", "Новости")}
          </Link>
          <Link
            href="/basin/foto-galeri"
            className="px-4 py-2 text-sm font-medium rounded-lg text-slate-600 hover:bg-slate-50 transition-colors"
          >
            {t("Foto Galeri", "Photo Gallery", "Фотогалерея")}
          </Link>
        </div>
      </section>

      {/* News Grid */}
      <section className="pb-20 pt-12">
        <div className="container">
          {newsLoading ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="h-8 w-8 animate-spin text-[#1d4ed8]" />
            </div>
          ) : newsError ? (
            <div className="text-center py-16 text-slate-500">
              <p className="text-lg">{t("Haberler yüklenirken bir hata oluştu.", "An error occurred while loading the news.", "При загрузке новостей произошла ошибка.")}</p>
              <p className="text-sm mt-1">{t("Lütfen daha sonra tekrar deneyin.", "Please try again later.", "Пожалуйста, попробуйте позже.")}</p>
            </div>
          ) : articles.length === 0 ? (
            <div className="text-center py-16 text-slate-500">
              <Newspaper className="h-12 w-12 mx-auto mb-3 text-slate-300" />
              <p className="text-lg">{t("Henüz haber bulunmamaktadır.", "No news articles available yet.", "Пока нет новостей.")}</p>
              <p className="text-sm mt-1">{t("Yeni haberler eklendiğinde burada görünecektir.", "New articles will appear here when published.", "Новые новости появятся здесь после публикации.")}</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {pageArticles.map((article, i) => (
                  <motion.article
                    key={article.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ duration: 0.4, delay: i * 0.08 }}
                    onClick={() => setSelected(article)}
                    className="group flex flex-col bg-white border border-slate-100 rounded-xl overflow-hidden hover:border-blue-200 hover:shadow-md transition-all duration-300 cursor-pointer"
                  >
                    {article.imageUrl && (
                      <div className="aspect-[3/2] overflow-hidden">
                        <img
                          src={article.imageUrl}
                          alt={aTitle(article)}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                    )}
                    <div className="p-6 flex flex-col flex-1">
                      <p className="text-xs text-slate-400 mb-3">{formatDate(article.publishedAt)}</p>
                      <h3 className="text-[#1e3a5f] font-semibold mb-3 group-hover:text-[#1d4ed8] transition-colors duration-200 line-clamp-2">
                        {aTitle(article)}
                      </h3>
                      <p className="text-slate-500 text-sm leading-relaxed line-clamp-3">
                        {aExcerpt(article)}
                      </p>
                      <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-[#1d4ed8] group-hover:gap-2 transition-all duration-200">
                        {t("Devamını Oku", "Read More", "Читать далее")}
                        <ArrowRight className="h-4 w-4" />
                      </span>
                    </div>
                  </motion.article>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-12">
                  <button
                    onClick={() => goToPage(currentPage - 1)}
                    disabled={currentPage === 1}
                    aria-label={t("Önceki", "Previous", "Назад")}
                    className="inline-flex items-center justify-center h-10 w-10 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                  {Array.from({ length: totalPages }, (_, idx) => idx + 1).map((p) => (
                    <button
                      key={p}
                      onClick={() => goToPage(p)}
                      aria-current={p === currentPage ? "page" : undefined}
                      className={`inline-flex items-center justify-center h-10 min-w-10 px-3 rounded-lg border text-sm font-medium transition-colors ${
                        p === currentPage
                          ? "border-[#1d4ed8] bg-[#1d4ed8] text-white"
                          : "border-slate-200 text-slate-600 hover:bg-slate-50"
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                  <button
                    onClick={() => goToPage(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    aria-label={t("Sonraki", "Next", "Вперёд")}
                    className="inline-flex items-center justify-center h-10 w-10 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </section>

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
                  {aTitle(selected)}
                </DialogTitle>
              </DialogHeader>
              {selected.imageUrl && (
                <div className="rounded-xl overflow-hidden my-2">
                  <img src={selected.imageUrl} alt={aTitle(selected)} className="w-full object-cover" />
                </div>
              )}
              <div className="text-slate-600 leading-relaxed whitespace-pre-line text-[15px]">
                {aContent(selected)}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

    </div>
  );
}
