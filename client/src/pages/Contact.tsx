import { useState } from "react";
import { motion } from "framer-motion";
import { MapPin, Phone, Mail, Clock } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

/* Design: Light theme — White bg, blue accents, navy headings. */

export default function Contact() {
  const [submitted, setSubmitted] = useState(false);
  const { t } = useLanguage();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="pt-20">
      {/* Hero */}
      <section className="relative py-24 lg:py-32 overflow-hidden bg-gradient-to-br from-[#1e3a5f] to-[#2563eb]">
        <div className="absolute inset-0 opacity-30">
          <img
            src="https://d2xsxph8kpxj0f.cloudfront.net/310519663406413308/YsuVUT62bVL4iGDytG28i2/iletisim-bg-ZfreqiLpYJ9qd8VTa8CZdC.webp"
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
              {t("İletişim", "Contact", "Контакты")}
            </p>
            <h1 className="text-4xl lg:text-5xl font-extrabold text-white mb-6">
              {t("Bize Ulaşın", "Get in Touch", "Свяжитесь с нами")}
            </h1>
            <p className="text-white/70 max-w-2xl text-lg">
              {t(
                "Sorularınız, önerileriniz veya iş birliği talepleriniz için bizimle iletişime geçin.",
                "Contact us for your questions, suggestions, or partnership requests.",
                "Свяжитесь с нами по вопросам, предложениям или запросам о сотрудничестве."
              )}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact Info + Form */}
      <section className="py-20 border-t border-slate-100">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            {/* Left: Info + Map */}
            <div>
              <h2 className="text-2xl font-bold text-[#1e3a5f] mb-8">{t("İletişim Bilgileri", "Contact Information", "Контактная информация")}</h2>
              <div className="space-y-6 mb-10">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center shrink-0">
                    <MapPin className="w-5 h-5 text-[#1d4ed8]" />
                  </div>
                  <div>
                    <h3 className="text-[#1e3a5f] font-semibold text-sm">{t("Adres", "Address", "Адрес")}</h3>
                    <p className="text-slate-500 text-sm mt-1">
                      Seba Center, Darüşşafaka Cad. No:45<br />
                      {t("Sarıyer, İstanbul, Türkiye", "Sarıyer, Istanbul, Turkey", "Сарыер, Стамбул, Турция")}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center shrink-0">
                    <Phone className="w-5 h-5 text-[#1d4ed8]" />
                  </div>
                  <div>
                    <h3 className="text-[#1e3a5f] font-semibold text-sm">{t("Telefon", "Phone", "Телефон")}</h3>
                    <p className="text-slate-500 text-sm mt-1">+90 (212) 000 00 00</p>
                    <p className="text-slate-500 text-sm">+90 (212) 000 00 01 ({t("Faks", "Fax", "Факс")})</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center shrink-0">
                    <Mail className="w-5 h-5 text-[#1d4ed8]" />
                  </div>
                  <div>
                    <h3 className="text-[#1e3a5f] font-semibold text-sm">{t("E-posta", "Email", "Эл. почта")}</h3>
                    <p className="text-slate-500 text-sm mt-1">info@bosphorusgaz.com</p>
                    <p className="text-slate-500 text-sm">ticaret@bosphorusgaz.com</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center shrink-0">
                    <Clock className="w-5 h-5 text-[#1d4ed8]" />
                  </div>
                  <div>
                    <h3 className="text-[#1e3a5f] font-semibold text-sm">{t("Çalışma Saatleri", "Working Hours", "Часы работы")}</h3>
                    <p className="text-slate-500 text-sm mt-1">{t("Pazartesi – Cuma: 09:00 – 18:00", "Monday – Friday: 09:00 – 18:00", "Понедельник – Пятница: 09:00 – 18:00")}</p>
                    <p className="text-slate-500 text-sm">{t("Cumartesi – Pazar: Kapalı", "Saturday – Sunday: Closed", "Суббота – Воскресенье: Закрыто")}</p>
                  </div>
                </div>
              </div>

              {/* Map Placeholder */}
              <div className="relative rounded-xl overflow-hidden border border-slate-100 aspect-[4/3] bg-slate-50">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <MapPin className="w-8 h-8 text-[#1d4ed8] mx-auto mb-2" />
                    <p className="text-slate-500 text-sm">Seba Center, Sarıyer</p>
                    <p className="text-slate-400 text-xs mt-1">41.1°N, 29.0°E</p>
                  </div>
                </div>
                <div className="absolute inset-0 opacity-30">
                  <svg className="w-full h-full" viewBox="0 0 400 300">
                    <path d="M0,150 Q100,100 200,150 T400,150" fill="none" stroke="#3b82f6" strokeWidth="0.5" opacity="0.5" />
                    <path d="M0,180 Q150,130 250,180 T400,180" fill="none" stroke="#3b82f6" strokeWidth="0.5" opacity="0.3" />
                    <path d="M0,120 Q80,80 180,120 T400,120" fill="none" stroke="#3b82f6" strokeWidth="0.5" opacity="0.4" />
                    <circle cx="200" cy="150" r="4" fill="#1d4ed8" />
                    <circle cx="200" cy="150" r="12" fill="none" stroke="#1d4ed8" strokeWidth="0.5" opacity="0.5" />
                    <circle cx="200" cy="150" r="24" fill="none" stroke="#1d4ed8" strokeWidth="0.3" opacity="0.3" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Right: Contact Form */}
            <div>
              <h2 className="text-2xl font-bold text-[#1e3a5f] mb-8">{t("İletişim Formu", "Contact Form", "Контактная форма")}</h2>
              {submitted ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-green-50 border border-green-200 rounded-xl p-8 text-center"
                >
                  <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                    <span className="text-green-600 text-xl">✓</span>
                  </div>
                  <h3 className="text-[#1e3a5f] font-semibold mb-2">{t("Mesajınız Gönderildi", "Your Message Has Been Sent", "Ваше сообщение отправлено")}</h3>
                  <p className="text-slate-500 text-sm">{t("En kısa sürede size dönüş yapacağız.", "We will get back to you as soon as possible.", "Мы свяжемся с вами в ближайшее время.")}</p>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm text-slate-600 mb-1.5">{t("Ad Soyad *", "Full Name *", "Имя и фамилия *")}</label>
                      <input
                        type="text"
                        required
                        className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-md text-slate-800 text-sm placeholder:text-slate-300 focus:border-[#1d4ed8] focus:ring-1 focus:ring-[#1d4ed8]/20 focus:outline-none transition-colors"
                        placeholder={t("Adınız Soyadınız", "Your Full Name", "Ваше имя и фамилия")}
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-slate-600 mb-1.5">{t("E-posta *", "Email *", "Эл. почта *")}</label>
                      <input
                        type="email"
                        required
                        className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-md text-slate-800 text-sm placeholder:text-slate-300 focus:border-[#1d4ed8] focus:ring-1 focus:ring-[#1d4ed8]/20 focus:outline-none transition-colors"
                        placeholder={t("ornek@email.com", "example@email.com", "primer@email.com")}
                      />
                    </div>
                  </div>
                  <div>
                      <label className="block text-sm text-slate-600 mb-1.5">{t("Konu *", "Subject *", "Тема *")}</label>
                    <select
                      required
                      className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-md text-slate-800 text-sm focus:border-[#1d4ed8] focus:ring-1 focus:ring-[#1d4ed8]/20 focus:outline-none transition-colors"
                    >
                      <option value="">{t("Seçiniz", "Select", "Выберите")}</option>
                      <option value="tedarik">{t("Doğal Gaz Tedarik", "Natural Gas Supply", "Поставка природного газа")}</option>
                      <option value="isbirligi">{t("İş Birliği", "Partnership", "Сотрудничество")}</option>
                      <option value="basin">{t("Basın & Medya", "Press & Media", "Пресса и Медиа")}</option>
                      <option value="kariyer">{t("Kariyer", "Careers", "Карьера")}</option>
                      <option value="diger">{t("Diğer", "Other", "Другое")}</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm text-slate-600 mb-1.5">{t("Mesaj *", "Message *", "Сообщение *")}</label>
                    <textarea
                      rows={5}
                      required
                      className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-md text-slate-800 text-sm placeholder:text-slate-300 focus:border-[#1d4ed8] focus:ring-1 focus:ring-[#1d4ed8]/20 focus:outline-none transition-colors resize-none"
                      placeholder={t("Mesajınızı yazın...", "Write your message...", "Напишите ваше сообщение...")}
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full px-6 py-3 bg-[#1d4ed8] text-white font-semibold rounded-md hover:bg-[#2563eb] transition-all duration-200 active:scale-[0.97]"
                  >
                    {t("Gönder", "Send", "Отправить")}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
