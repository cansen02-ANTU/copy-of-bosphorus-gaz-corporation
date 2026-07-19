import { useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";

interface SEOProps {
  titleTr: string;
  titleEn: string;
  titleRu: string;
  descriptionTr: string;
  descriptionEn: string;
  descriptionRu: string;
}

export function useSEO({ titleTr, titleEn, titleRu, descriptionTr, descriptionEn, descriptionRu }: SEOProps) {
  const { lang } = useLanguage();

  useEffect(() => {
    const title = lang === "en" ? titleEn : lang === "ru" ? titleRu : titleTr;
    const description = lang === "en" ? descriptionEn : lang === "ru" ? descriptionRu : descriptionTr;

    document.title = `${title} | Bosphorus Gaz Corporation`;

    // Update or create meta description
    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement("meta");
      metaDesc.setAttribute("name", "description");
      document.head.appendChild(metaDesc);
    }
    metaDesc.setAttribute("content", description);

    // Update or create Open Graph tags
    const ogTags: Record<string, string> = {
      "og:title": title,
      "og:description": description,
      "og:type": "website",
      "og:site_name": "Bosphorus Gaz Corporation",
    };

    Object.entries(ogTags).forEach(([property, content]) => {
      let tag = document.querySelector(`meta[property="${property}"]`);
      if (!tag) {
        tag = document.createElement("meta");
        tag.setAttribute("property", property);
        document.head.appendChild(tag);
      }
      tag.setAttribute("content", content);
    });

    // Update html lang attribute
    document.documentElement.lang = lang === "en" ? "en" : lang === "ru" ? "ru" : "tr";
  }, [lang, titleTr, titleEn, titleRu, descriptionTr, descriptionEn, descriptionRu]);
}
