import { motion } from "framer-motion";
import { trpc } from "@/lib/trpc";
import { Loader2, Newspaper, Image as ImageIcon } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

/* Design: Light theme — White bg, blue accents, news cards. */

export default function Press() {
  const { data: dbArticles, isLoading: newsLoading, error: newsError } = trpc.news.list.useQuery();
  const { data: dbGallery, isLoading: galleryLoading, error: galleryError } = trpc.gallery.list.useQuery();
  const { t, lang } = useLanguage();

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
              {t("Basın", "Press")}
            </p>
            <h1 className="text-4xl lg:text-5xl font-extrabold text-white mb-6">
              {t("Haberler", "News")}
            </h1>
            <p className="text-white/70 max-w-2xl text-lg">
              {t(
                "Bosphorus Gaz Corporation'dan son gelişmeler ve sektör haberleri.",
                "Latest developments and industry news from Bosphorus Gaz Corporation."
              )}
            </p>
          </motion.div>
        </div>
      </section>

      {/* News Grid */}
      <section className="pb-20 border-t border-slate-100 pt-12">
        <div className="container">
          {newsLoading ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="h-8 w-8 animate-spin text-[#1d4ed8]" />
            </div>
          ) : newsError ? (
            <div className="text-center py-16 text-slate-500">
              <p className="text-lg">{t("Haberler yüklenirken bir hata oluştu.", "An error occurred while loading the news.")}</p>
              <p className="text-sm mt-1">{t("Lütfen daha sonra tekrar deneyin.", "Please try again later.")}</p>
            </div>
          ) : !dbArticles || dbArticles.length === 0 ? (
            <div className="text-center py-16 text-slate-500">
              <Newspaper className="h-12 w-12 mx-auto mb-3 text-slate-300" />
              <p className="text-lg">{t("Henüz haber bulunmamaktadır.", "No news articles available yet.")}</p>
              <p className="text-sm mt-1">{t("Yeni haberler eklendiğinde burada görünecektir.", "New articles will appear here when published.")}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {dbArticles.map((article, i) => (
                <motion.article
                  key={article.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.4, delay: i * 0.08 }}
                  className="group bg-white border border-slate-100 rounded-xl overflow-hidden hover:border-blue-200 hover:shadow-md transition-all duration-300"
                >
                  {article.imageUrl && (
                    <div className="aspect-[3/2] overflow-hidden">
                      <img
                        src={article.imageUrl}
                        alt={article.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                  )}
                  <div className="p-6">
                    <p className="text-xs text-slate-400 mb-3">
                      {new Date(article.publishedAt).toLocaleDateString(lang === "en" ? "en-US" : "tr-TR", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </p>
                    <h3 className="text-[#1e3a5f] font-semibold mb-3 group-hover:text-[#1d4ed8] transition-colors duration-200 line-clamp-2">
                      {article.title}
                    </h3>
                    <p className="text-slate-500 text-sm leading-relaxed line-clamp-3">
                      {article.excerpt}
                    </p>
                  </div>
                </motion.article>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Photo Gallery */}
      <section className="py-20 border-t border-slate-100 bg-slate-50">
        <div className="container">
          <h2 className="text-2xl font-bold text-[#1e3a5f] mb-8">
            {t("Fotoğraf Galerisi", "Photo Gallery")}
          </h2>
          {galleryLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-[#1d4ed8]" />
            </div>
          ) : galleryError ? (
            <div className="text-center py-12 text-slate-500">
              <p className="text-lg">{t("Galeri yüklenirken bir hata oluştu.", "An error occurred while loading the gallery.")}</p>
            </div>
          ) : !dbGallery || dbGallery.length === 0 ? (
            <div className="text-center py-12 text-slate-500">
              <ImageIcon className="h-12 w-12 mx-auto mb-3 text-slate-300" />
              <p className="text-lg">{t("Henüz galeri görseli bulunmamaktadır.", "No gallery images available yet.")}</p>
              <p className="text-sm mt-1">{t("Yeni görseller eklendiğinde burada görünecektir.", "New images will appear here when added.")}</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {dbGallery.map((image, i) => (
                <motion.div
                  key={image.id}
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: i * 0.05 }}
                  className={`overflow-hidden rounded-xl ${i % 3 === 1 ? "row-span-2" : ""}`}
                >
                  <img
                    src={image.imageUrl}
                    alt={image.caption}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                  />
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
