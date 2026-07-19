import { useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";
import { trpc } from "@/lib/trpc";
import { Loader2, Image as ImageIcon, X, ChevronLeft, ChevronRight, Images } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Link } from "wouter";
import { useSEO } from "@/hooks/useSEO";

/* Design: Light theme — White bg, blue accents. Albums grid + lightbox. */

type Photo = {
  id: number;
  imageUrl: string;
  caption: string | null;
};

type Album = {
  id: number;
  slug: string;
  title: string;
  description: string | null;
  titleEn: string | null;
  descriptionEn: string | null;
  titleRu: string | null;
  descriptionRu: string | null;
  coverUrl: string | null;
  photos: Photo[];
};

export default function Gallery() {
  const { data: albums, isLoading, error } = trpc.gallery.albums.useQuery();
  const { t, lang } = useLanguage();

  useSEO({
    titleTr: "Foto Galeri",
    titleEn: "Photo Gallery",
    titleRu: "Фотогалерея",
    descriptionTr: "Bosphorus Gaz Corporation foto galeri. Şirket etkinlikleri, tesisler ve kurumsal fotoğraflar.",
    descriptionEn: "Bosphorus Gaz Corporation photo gallery. Company events, facilities, and corporate photos.",
    descriptionRu: "Фотогалерея Bosphorus Gaz Corporation. Корпоративные мероприятия, объекты и корпоративные фотографии.",
  });

  // Pick the album title/description for the active language, falling back to TR.
  const albumTitle = (a: Album) =>
    (lang === "en" ? a.titleEn : lang === "ru" ? a.titleRu : null) || a.title;
  const albumDesc = (a: Album) =>
    (lang === "en" ? a.descriptionEn : lang === "ru" ? a.descriptionRu : null) || a.description;

  // Selected album for the lightbox view
  const [openAlbum, setOpenAlbum] = useState<Album | null>(null);
  // Index of the currently displayed photo within the open album
  const [photoIndex, setPhotoIndex] = useState(0);

  const closeLightbox = useCallback(() => setOpenAlbum(null), []);

  const showPrev = useCallback(() => {
    if (!openAlbum) return;
    setPhotoIndex((i) => (i - 1 + openAlbum.photos.length) % openAlbum.photos.length);
  }, [openAlbum]);

  const showNext = useCallback(() => {
    if (!openAlbum) return;
    setPhotoIndex((i) => (i + 1) % openAlbum.photos.length);
  }, [openAlbum]);

  // Keyboard navigation for the lightbox
  useEffect(() => {
    if (!openAlbum) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeLightbox();
      else if (e.key === "ArrowLeft") showPrev();
      else if (e.key === "ArrowRight") showNext();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [openAlbum, closeLightbox, showPrev, showNext]);

  const openAlbumAt = (album: Album, index = 0) => {
    setOpenAlbum(album);
    setPhotoIndex(index);
  };

  const albumList = (albums ?? []) as Album[];

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
              {t("Foto Galeri", "Photo Gallery", "Фотогалерея")}
            </h1>
            <p className="text-white/70 max-w-2xl text-lg">
              {t(
                "Bosphorus Gaz Corporation etkinliklerinden ve organizasyonlarından fotoğraflar.",
                "Photos from Bosphorus Gaz Corporation events and organizations.",
                "Фотографии с мероприятий и организаций Bosphorus Gaz Corporation."
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
            className="px-4 py-2 text-sm font-medium rounded-lg text-slate-600 hover:bg-slate-50 transition-colors"
          >
            {t("Haberler", "News", "Новости")}
          </Link>
          <Link
            href="/basin/foto-galeri"
            className="px-4 py-2 text-sm font-semibold rounded-lg bg-[#1d4ed8] text-white"
          >
            {t("Foto Galeri", "Photo Gallery", "Фотогалерея")}
          </Link>
        </div>
      </section>

      {/* Albums Grid */}
      <section className="py-16 lg:py-20">
        <div className="container">
          {isLoading ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="h-8 w-8 animate-spin text-[#1d4ed8]" />
            </div>
          ) : error ? (
            <div className="text-center py-16 text-slate-500">
              <p className="text-lg">{t("Galeri yüklenirken bir hata oluştu.", "An error occurred while loading the gallery.", "При загрузке галереи произошла ошибка.")}</p>
            </div>
          ) : albumList.length === 0 ? (
            <div className="text-center py-16 text-slate-500">
              <ImageIcon className="h-12 w-12 mx-auto mb-3 text-slate-300" />
              <p className="text-lg">{t("Henüz albüm bulunmamaktadır.", "No albums available yet.", "Пока нет альбомов.")}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {albumList.map((album, i) => (
                <motion.article
                  key={album.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.4, delay: i * 0.08 }}
                  onClick={() => openAlbumAt(album)}
                  className="group flex flex-col sm:flex-row gap-5 bg-white border border-slate-100 rounded-xl overflow-hidden hover:border-blue-200 hover:shadow-md transition-all duration-300 cursor-pointer p-4"
                >
                  <div className="sm:w-48 shrink-0 aspect-[3/2] overflow-hidden rounded-lg bg-slate-100">
                    {album.coverUrl && (
                      <img
                        src={album.coverUrl}
                        alt={albumTitle(album)}
                        loading="lazy"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    )}
                  </div>
                  <div className="flex flex-col flex-1 min-w-0">
                    <h3 className="text-[#1e3a5f] font-semibold text-lg mb-2 group-hover:text-[#1d4ed8] transition-colors duration-200">
                      {albumTitle(album)}
                    </h3>
                    {albumDesc(album) && (
                      <p className="text-slate-500 text-sm leading-relaxed line-clamp-3 flex-1">
                        {albumDesc(album)}
                      </p>
                    )}
                    <span className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-[#1d4ed8]">
                      <Images className="h-4 w-4" />
                      {album.photos.length} {t("Fotoğraf", "Photos", "Фото")}
                    </span>
                  </div>
                </motion.article>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Lightbox */}
      {openAlbum && openAlbum.photos.length > 0 && (
        <div
          className="fixed inset-0 z-[70] bg-black/90 backdrop-blur-sm flex flex-col"
          onClick={closeLightbox}
        >
          {/* Top bar */}
          <div
            className="flex items-center justify-between px-4 py-3 text-white/90"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="min-w-0">
              <p className="font-semibold truncate">{albumTitle(openAlbum)}</p>
              <p className="text-xs text-white/60">
                {photoIndex + 1} / {openAlbum.photos.length}
              </p>
            </div>
            <button
              onClick={closeLightbox}
              aria-label={t("Kapat", "Close", "Закрыть")}
              className="p-2 rounded-full hover:bg-white/10 transition-colors active:scale-[0.94]"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          {/* Main image */}
          <div
            className="flex-1 flex items-center justify-center px-4 pb-4 min-h-0"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={showPrev}
              aria-label={t("Önceki", "Previous", "Назад")}
              className="hidden sm:flex items-center justify-center h-12 w-12 shrink-0 rounded-full text-white/80 hover:bg-white/10 transition-colors active:scale-[0.94]"
            >
              <ChevronLeft className="h-7 w-7" />
            </button>
            <img
              key={openAlbum.photos[photoIndex].id}
              src={openAlbum.photos[photoIndex].imageUrl}
              alt={openAlbum.photos[photoIndex].caption ?? albumTitle(openAlbum)}
              className="max-h-full max-w-full object-contain rounded-lg select-none"
            />
            <button
              onClick={showNext}
              aria-label={t("Sonraki", "Next", "Вперёд")}
              className="hidden sm:flex items-center justify-center h-12 w-12 shrink-0 rounded-full text-white/80 hover:bg-white/10 transition-colors active:scale-[0.94]"
            >
              <ChevronRight className="h-7 w-7" />
            </button>
          </div>

          {/* Mobile prev/next */}
          <div
            className="flex sm:hidden items-center justify-center gap-6 pb-3 text-white/80"
            onClick={(e) => e.stopPropagation()}
          >
            <button onClick={showPrev} aria-label={t("Önceki", "Previous", "Назад")} className="p-3 rounded-full hover:bg-white/10 active:scale-[0.94]">
              <ChevronLeft className="h-6 w-6" />
            </button>
            <button onClick={showNext} aria-label={t("Sonraki", "Next", "Вперёд")} className="p-3 rounded-full hover:bg-white/10 active:scale-[0.94]">
              <ChevronRight className="h-6 w-6" />
            </button>
          </div>

          {/* Thumbnail strip */}
          <div
            className="shrink-0 overflow-x-auto px-4 pb-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex gap-2 w-max mx-auto">
              {openAlbum.photos.map((p, idx) => (
                <button
                  key={p.id}
                  onClick={() => setPhotoIndex(idx)}
                  className={`h-14 w-20 shrink-0 overflow-hidden rounded-md border-2 transition-all ${
                    idx === photoIndex ? "border-[#3b82f6] opacity-100" : "border-transparent opacity-50 hover:opacity-90"
                  }`}
                >
                  <img src={p.imageUrl} alt="" loading="lazy" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
